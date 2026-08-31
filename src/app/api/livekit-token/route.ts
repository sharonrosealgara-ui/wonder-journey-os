import { NextResponse } from "next/server";
import { AccessToken } from "livekit-server-sdk";
import { createClient } from "@/lib/supabase/server";

// UUID v4 validation
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Legacy/trusted-context fields that MUST NOT appear in the request body
const FORBIDDEN_FIELDS = ["room", "roomName", "identity", "name", "role", "code"];

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));

    // 1. Reject legacy trusted-context fields with HTTP 400
    for (const field of FORBIDDEN_FIELDS) {
      if (field in body && body[field] !== undefined) {
        return NextResponse.json(
          { error: `Bad Request: legacy field "${field}" is not accepted. Send only { sessionId }.` },
          { status: 400 }
        );
      }
    }

    // 2. Require mandatory sessionId
    const { sessionId } = body;
    if (!sessionId || typeof sessionId !== "string") {
      return NextResponse.json(
        { error: "Bad Request: sessionId is required" },
        { status: 400 }
      );
    }

    // 3. Validate sessionId as UUID
    if (!UUID_RE.test(sessionId)) {
      return NextResponse.json(
        { error: "Bad Request: sessionId must be a valid UUID" },
        { status: 400 }
      );
    }

    // 4. Authenticate user
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 5. Resolve real workspace UUID from workspace_members
    const { data: membership, error: memberError } = await supabase
      .from("workspace_members")
      .select("workspace_id")
      .eq("user_id", user.id)
      .eq("status", "active")
      .limit(1)
      .single();

    if (memberError || !membership?.workspace_id) {
      return NextResponse.json(
        { error: "Forbidden: user has no active workspace membership" },
        { status: 403 }
      );
    }

    const workspaceId = membership.workspace_id;

    // 6. Require active classroom_sessions row with exact UUID and workspace
    const { data: sessionData, error: sessionError } = await supabase
      .from("classroom_sessions")
      .select("id, workspace_id, room_name, status, lesson_id")
      .eq("id", sessionId)
      .eq("workspace_id", workspaceId)
      .eq("status", "active")
      .single();

    if (sessionError || !sessionData) {
      return NextResponse.json(
        { error: "Forbidden: no active authorized classroom session found" },
        { status: 403 }
      );
    }

    // 7. Require matching classroom_participants row
    const { data: participantData, error: participantError } = await supabase
      .from("classroom_participants")
      .select("id, session_id, user_id, role, permission_level")
      .eq("session_id", sessionData.id)
      .eq("user_id", user.id)
      .single();

    if (participantError || !participantData) {
      return NextResponse.json(
        { error: "Forbidden: user is not an authorized participant in this classroom session" },
        { status: 403 }
      );
    }

    // 8. Require valid participant role — no fallback chain
    const derivedRole = participantData.role;
    if (!derivedRole || !["teacher", "family", "student"].includes(derivedRole)) {
      return NextResponse.json(
        { error: "Forbidden: participant has no valid role assignment" },
        { status: 403 }
      );
    }

    // 9. Derive room and identity strictly from database records
    const derivedRoom = sessionData.room_name;
    if (!derivedRoom) {
      return NextResponse.json(
        { error: "Internal: session has no room_name" },
        { status: 500 }
      );
    }

    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;
    const wsUrl = process.env.LIVEKIT_URL;

    if (!apiKey || !apiSecret || !wsUrl) {
      return NextResponse.json({ error: "LiveKit not configured" }, { status: 500 });
    }

    const at = new AccessToken(apiKey, apiSecret, {
      identity: `${derivedRole}-${user.id}`,
      metadata: JSON.stringify({ role: derivedRole, sessionId: sessionData.id }),
    });

    at.addGrant({
      roomJoin: true,
      room: derivedRoom,
      canPublish: true,
      canSubscribe: true,
      roomAdmin: derivedRole === "teacher",
    });

    const token = await at.toJwt();

    return NextResponse.json({
      token,
      url: wsUrl,
      role: derivedRole,
      room: derivedRoom,
      sessionId: sessionData.id,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
