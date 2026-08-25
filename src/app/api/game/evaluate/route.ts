import { NextRequest, NextResponse } from "next/server";
import { evaluateGameAttemptOnServer } from "@/lib/server-game-evaluator";
import { createClient } from "@/lib/supabase/server";

// In-memory rate limiting map: ipOrUser -> timestamp[]
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

    // 2. Payload size check
    const contentLength = request.headers.get("content-length");
    if (contentLength && parseInt(contentLength, 10) > MAX_PAYLOAD_BYTES) {
      return NextResponse.json(
        { success: false, result: "try_again", score: 0, error: "Payload size exceeds 10KB limit" },
        { status: 413 }
      );
    }

    // 3. Rate limiting check (keyed by authenticated user ID)
    const rateLimitKey = user.id || request.headers.get("x-forwarded-for") || "client";
    if (!checkRateLimit(rateLimitKey)) {
      return NextResponse.json(
        { success: false, result: "try_again", score: 0, error: "Rate limit exceeded. Please wait a moment." },
        { status: 429 }
      );
    }

    // 4. Parse JSON body
    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, result: "try_again", score: 0, error: "Invalid JSON format" },
        { status: 400 }
      );
    }

    const { lessonId, gameType, attemptData, gameToken } = body || {};

    // 5. Strict schema validation
    if (!lessonId || typeof lessonId !== "string" || lessonId.length > 80) {
      return NextResponse.json(
        { success: false, result: "try_again", score: 0, error: "Missing or invalid lessonId" },
        { status: 400 }
      );
    }

    // Check if lessonId is valid 1..65
    const numMatch = lessonId.match(/\d+/);
    const num = numMatch ? parseInt(numMatch[0], 10) : NaN;
    if (isNaN(num) || num < 1 || num > 65) {
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

    if (!gameType || typeof gameType !== "string" || !VALID_GAME_TYPES.includes(gameType)) {
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

    // 6. Evaluate attempt strictly on server using unsealed gameToken or instance key
    const evaluation = evaluateGameAttemptOnServer(lessonId, gameType, attemptData, gameToken);

    if (!evaluation.success && evaluation.error) {
      const status = evaluation.error.includes("Unknown lessonId") ? 404 : 400;
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

