import { NextRequest, NextResponse } from "next/server";
import { generateServerLearnerGame } from "@/lib/server-game-definitions";
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

    // 2. Parse and validate query parameters
    const { searchParams } = new URL(request.url);
    const lessonId = searchParams.get("lessonId");
    const lessonTitle = searchParams.get("lessonTitle") || undefined;

    if (!lessonId || lessonId.length > 80) {
      return NextResponse.json({ error: "Missing or invalid lessonId" }, { status: 400 });
    }

    const dto = generateServerLearnerGame(lessonId, lessonTitle);
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

