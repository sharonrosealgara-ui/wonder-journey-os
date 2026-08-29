import { NextRequest, NextResponse } from "next/server";
import {
  generateServerLearnerGame,
  CANONICAL_LESSON_IDS,
} from "@/lib/server-game-definitions";
import { createClient } from "@/lib/supabase/server";

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

    // 2. Query trusted user profile and workspace membership from database
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, role, family_id")
      .eq("id", user.id)
      .single();

    if (profileError || !profile || !profile.family_id) {
      return NextResponse.json(
        { error: "Forbidden: user lacks active profile or workspace membership" },
        { status: 403 }
      );
    }

    const workspaceId = `ws-${profile.family_id}`;

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

    // 5. Query active classroom session from database (Never treat startsWith('sess-') as authorization)
    const effectiveSessionId = requestedSessionId || `sess-${profile.family_id}-main`;

    const { data: sessionData, error: sessionError } = await supabase
      .from("classroom_sessions")
      .select("id, workspace_id, lesson_id, status")
      .eq("id", effectiveSessionId)
      .eq("workspace_id", workspaceId)
      .eq("status", "active")
      .single();

    if (sessionError || !sessionData || sessionData.lesson_id !== lessonId) {
      return NextResponse.json(
        { error: "Forbidden: no active authorized classroom session found for this lesson" },
        { status: 403 }
      );
    }

    // 6. Query classroom participant membership from database
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

    // 7. Generate sealed game DTO with cryptographically bound context
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
