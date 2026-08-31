import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// UUID v4 validation
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET() {
  try {
    // 1. Authenticate user
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Resolve real workspace UUID from workspace_members
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
    if (!UUID_RE.test(workspaceId)) {
      return NextResponse.json(
        { error: "Internal: invalid workspace UUID" },
        { status: 500 }
      );
    }

    // 3. Query active classroom session for this workspace
    const { data: session, error: sessionError } = await supabase
      .from("classroom_sessions")
      .select("id, lesson_id, slide_index, room_name, status")
      .eq("workspace_id", workspaceId)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (sessionError || !session) {
      return NextResponse.json(
        { error: "No active classroom session found" },
        { status: 404 }
      );
    }

    // 4. Verify the user is an authorized participant
    const { data: participant, error: partError } = await supabase
      .from("classroom_participants")
      .select("id, role, permission_level")
      .eq("session_id", session.id)
      .eq("user_id", user.id)
      .single();

    if (partError || !participant) {
      return NextResponse.json(
        { error: "Forbidden: user is not an authorized participant in this session" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      sessionId: session.id,
      lessonId: session.lesson_id,
      slideIndex: session.slide_index,
      roomName: session.room_name,
      role: participant.role,
      permissionLevel: participant.permission_level,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
