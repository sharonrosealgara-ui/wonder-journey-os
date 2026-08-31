import { NextRequest, NextResponse } from "next/server";
import {
  generateServerLearnerGame,
  CANONICAL_LESSON_IDS,
} from "@/lib/server-game-definitions";
import { createClient } from "@/lib/supabase/server";

// UUID v4 validation
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(request: NextRequest) {
  try {
    // 1. Authenticate user session
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
        { error: "Forbidden: user lacks active workspace membership" },
        { status: 403 }
      );
    }

    const workspaceId = membership.workspace_id;

    // 3. Parse query parameters
    const { searchParams } = new URL(request.url);
    const lessonId = searchParams.get("lessonId");
    const lessonTitle = searchParams.get("lessonTitle") || undefined;
    const requestedSessionId = searchParams.get("sessionId");

    if (!lessonId || typeof lessonId !== "string" || lessonId.length > 80) {
      return NextResponse.json({ error: "Missing or invalid lessonId" }, { status: 400 });
    }

    // 4. Validate exact canonical lesson ID from allowlist
    if (!CANONICAL_LESSON_IDS.has(lessonId)) {
      return NextResponse.json(
        { error: `Unknown lessonId: "${lessonId}"` },
        { status: 404 }
      );
    }

    // 5. Require sessionId and validate as UUID
    if (!requestedSessionId || !UUID_RE.test(requestedSessionId)) {
      return NextResponse.json(
        { error: "Bad Request: sessionId is required and must be a valid UUID" },
        { status: 400 }
      );
    }

    // 6. Query active classroom session from database
    const { data: sessionData, error: sessionError } = await supabase
      .from("classroom_sessions")
      .select("id, workspace_id, lesson_id, status")
      .eq("id", requestedSessionId)
      .eq("workspace_id", workspaceId)
      .eq("status", "active")
      .single();

    if (sessionError || !sessionData || sessionData.lesson_id !== lessonId) {
      return NextResponse.json(
        { error: "Forbidden: no active authorized classroom session found for this lesson" },
        { status: 403 }
      );
    }

    // 7. Query classroom participant membership from database
    const { data: participantData, error: participantError } = await supabase
      .from("classroom_participants")
      .select("id, session_id, user_id, role")
      .eq("session_id", sessionData.id)
      .eq("user_id", user.id)
      .single();

    if (participantError || !participantData) {
      return NextResponse.json(
        { error: "Forbidden: user is not an authorized participant in this classroom session" },
        { status: 403 }
      );
    }

    // 8. Generate sealed game DTO with cryptographically bound context
    const dto = generateServerLearnerGame(lessonId, lessonTitle, {
      userId: user.id,
      workspaceId,
      sessionId: sessionData.id,
    });

    if (!dto) {
      return NextResponse.json(
        { error: `Unknown lessonId: "${lessonId}"` },
        { status: 404 }
      );
    }

    return NextResponse.json(dto, {
      status: 200,
      headers: {
        "Cache-Control": "private, no-cache, no-store, must-revalidate",
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
