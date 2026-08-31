import { NextRequest, NextResponse } from "next/server";
import { evaluateGameAttemptOnServerAsync } from "@/lib/server-game-evaluator";
import { CANONICAL_LESSON_IDS, unsealSolutionKey } from "@/lib/server-game-definitions";
import { createClient } from "@/lib/supabase/server";

// UUID v4 validation
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// In-memory rate limiting map: userId -> timestamp[]
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 40;
const MAX_PAYLOAD_BYTES = 10 * 1024; // 10KB

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const timestamps = (rateLimitMap.get(key) || []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }
  timestamps.push(now);
  rateLimitMap.set(key, timestamps);
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate user session
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, result: "try_again", score: 0, error: "Unauthorized" },
        { status: 401 }
      );
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
        { success: false, result: "try_again", score: 0, error: "Forbidden: user lacks active workspace membership" },
        { status: 403 }
      );
    }

    const workspaceId = membership.workspace_id;

    // 3. Payload size check
    const contentLength = request.headers.get("content-length");
    if (contentLength && parseInt(contentLength, 10) > MAX_PAYLOAD_BYTES) {
      return NextResponse.json(
        { success: false, result: "try_again", score: 0, error: "Payload size exceeds 10KB limit" },
        { status: 413 }
      );
    }

    // 4. Rate limiting check (keyed by authenticated user ID)
    if (!checkRateLimit(user.id)) {
      return NextResponse.json(
        { success: false, result: "try_again", score: 0, error: "Rate limit exceeded. Please wait a moment." },
        { status: 429 }
      );
    }

    // 5. Parse JSON body
    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, result: "try_again", score: 0, error: "Invalid JSON format" },
        { status: 400 }
      );
    }

    const { lessonId, gameType, attemptData, gameToken } = body || {};

    // 6. Strict schema & mandatory gameToken validation
    if (!gameToken || typeof gameToken !== "string") {
      return NextResponse.json(
        { success: false, result: "try_again", score: 0, error: "Missing gameToken: gameToken is strictly required for evaluation" },
        { status: 400 }
      );
    }

    if (!lessonId || typeof lessonId !== "string" || (lessonId as string).length > 80) {
      return NextResponse.json(
        { success: false, result: "try_again", score: 0, error: "Missing or invalid lessonId" },
        { status: 400 }
      );
    }

    // Canonical lesson ID validation from allowlist
    if (!CANONICAL_LESSON_IDS.has(lessonId as string)) {
      return NextResponse.json(
        { success: false, result: "try_again", score: 0, error: `Unknown lessonId: "${lessonId}"` },
        { status: 404 }
      );
    }

    const VALID_GAME_TYPES = [
      "hotspot",
      "drag_drop_sort",
      "sorting",
      "matching",
      "sequencing",
      "multiple_choice",
      "quiz",
      "memory_pairs",
      "memory_flip",
      "lesson_review",
    ];

    if (!gameType || typeof gameType !== "string" || !VALID_GAME_TYPES.includes(gameType as string)) {
      return NextResponse.json(
        { success: false, result: "try_again", score: 0, error: `Invalid gameType: "${gameType}"` },
        { status: 422 }
      );
    }

    if (!attemptData || typeof attemptData !== "object" || Array.isArray(attemptData)) {
      return NextResponse.json(
        { success: false, result: "try_again", score: 0, error: "Missing or invalid attemptData" },
        { status: 400 }
      );
    }

    // 7. TRUST BOUNDARY: Unseal the gameToken on the server and derive all context from claims
    const unsealed = unsealSolutionKey(gameToken as string);
    if (!unsealed) {
      return NextResponse.json(
        { success: false, result: "try_again", score: 0, error: "Invalid or expired game token" },
        { status: 400 }
      );
    }

    // Compare token userId with authenticated user
    if (unsealed.userId !== user.id) {
      return NextResponse.json(
        { success: false, result: "try_again", score: 0, error: "Cross-user game token rejected" },
        { status: 403 }
      );
    }

    // Compare token workspaceId with resolved workspace
    if (unsealed.workspaceId !== workspaceId) {
      return NextResponse.json(
        { success: false, result: "try_again", score: 0, error: "Cross-workspace game token rejected" },
        { status: 403 }
      );
    }

    // Compare token lessonId with request lessonId
    if (unsealed.lessonId !== lessonId) {
      return NextResponse.json(
        { success: false, result: "try_again", score: 0, error: "Cross-lesson game token rejected" },
        { status: 403 }
      );
    }

    // Validate token sessionId as UUID
    if (!UUID_RE.test(unsealed.sessionId)) {
      return NextResponse.json(
        { success: false, result: "try_again", score: 0, error: "Invalid session in game token" },
        { status: 400 }
      );
    }

    // Verify session from token claims against PostgreSQL
    const { data: sessionData, error: sessionError } = await supabase
      .from("classroom_sessions")
      .select("id, workspace_id, lesson_id, status")
      .eq("id", unsealed.sessionId)
      .eq("workspace_id", workspaceId)
      .eq("status", "active")
      .single();

    if (sessionError || !sessionData || sessionData.lesson_id !== lessonId) {
      return NextResponse.json(
        { success: false, result: "try_again", score: 0, error: "Forbidden: no active authorized classroom session found for this lesson" },
        { status: 403 }
      );
    }

    // Verify participant membership
    const { data: participantData, error: participantError } = await supabase
      .from("classroom_participants")
      .select("id, session_id, user_id, role")
      .eq("session_id", sessionData.id)
      .eq("user_id", user.id)
      .single();

    if (participantError || !participantData) {
      return NextResponse.json(
        { success: false, result: "try_again", score: 0, error: "Forbidden: user is not an authorized participant in this classroom session" },
        { status: 403 }
      );
    }

    // 8. Evaluate using ONLY verified server context — never trust request body sessionId/workspaceId
    const verifiedContext = {
      userId: user.id,
      workspaceId,
      sessionId: sessionData.id,
    };

    const evaluation = await evaluateGameAttemptOnServerAsync(
      lessonId as string,
      gameType as string,
      attemptData as Record<string, unknown>,
      gameToken as string,
      verifiedContext
    );

    if (!evaluation.success && evaluation.error) {
      const status = evaluation.statusCode || 400;
      return NextResponse.json(evaluation, { status });
    }

    return NextResponse.json(evaluation, { status: 200 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal evaluation error";
    return NextResponse.json(
      { success: false, result: "try_again", score: 0, error: msg },
      { status: 500 }
    );
  }
}
