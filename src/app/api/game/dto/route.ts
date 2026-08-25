import { NextRequest, NextResponse } from "next/server";
import { generateServerLearnerGame } from "@/lib/server-game-definitions";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lessonId = searchParams.get("lessonId") || "lesson-1-world-map";
    const lessonTitle = searchParams.get("lessonTitle") || undefined;

    if (lessonId.length > 80) {
      return NextResponse.json({ error: "Invalid lessonId" }, { status: 400 });
    }

    const dto = generateServerLearnerGame(lessonId, lessonTitle);
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
