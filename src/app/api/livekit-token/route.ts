import { NextResponse } from "next/server";
import { AccessToken } from "livekit-server-sdk";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { sessionId, room: requestedRoom, roomName, code } = body;

    // 1. Authenticate user
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Query trusted user profile and workspace membership from database
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, role, display_name, family_id")
      .eq("id", user.id)
      .single();

    if (profileError || !profile || !profile.family_id) {
      return NextResponse.json(
        { error: "Forbidden: user lacks active profile or workspace membership" },
        { status: 403 }
      );
    }

    const workspaceId = `ws-${profile.family_id}`;

    // 3. Class code verification if configured
    const validCode = process.env.WJ_CLASS_CODE || process.env.CLASSROOM_CODE;
    if (validCode && code !== validCode) {
      return NextResponse.json({ error: "Invalid class code" }, { status: 401 });
    }

    // 4. Session identifier lookup (Never allow arbitrary client-provided room names)
    const lookupKey = sessionId || roomName || requestedRoom || `sess-${profile.family_id}-main`;

    const { data: sessionData, error: sessionError } = await supabase
      .from("classroom_sessions")
      .select("id, workspace_id, room_name, status, lesson_id")
      .eq("id", lookupKey)
      .eq("workspace_id", workspaceId)
      .eq("status", "active")
      .single();

    if (sessionError || !sessionData) {
      return NextResponse.json(
        { error: "Forbidden: no active authorized classroom session found for this workspace" },
        { status: 403 }
      );
    }

    // 5. Query classroom participant membership from database
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

    // 6. Derive room name, role, and identity strictly from database records
    const derivedRoom = sessionData.room_name || sessionData.id;
    const derivedRole = participantData.role || profile.role || "student";
    const derivedName = profile.display_name || user.user_metadata?.name || user.email || "Explorer";

    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;
    const wsUrl = process.env.LIVEKIT_URL;

    if (!apiKey || !apiSecret || !wsUrl) {
      return NextResponse.json({ error: "LiveKit not configured" }, { status: 500 });
    }

    const at = new AccessToken(apiKey, apiSecret, {
      identity: `${derivedRole}-${user.id}`,
      name: derivedName,
      metadata: JSON.stringify({ role: derivedRole, sessionId: sessionData.id }),
    });

    // Grant room access strictly to authorized derived room
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
