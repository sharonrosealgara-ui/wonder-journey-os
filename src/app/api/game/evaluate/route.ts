import { NextResponse } from "next/server";
import { evaluateGameAttemptOnServer } from "@/lib/server-game-evaluator";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { lessonId, gameType, attemptData } = body;

    if (!lessonId || !gameType) {
      return NextResponse.json(
        { error: "Missing required fields: lessonId and gameType" },
        { status: 400 }
      );
    }

    const evaluation = evaluateGameAttemptOnServer(lessonId, gameType, attemptData || {});
    return NextResponse.json(evaluation);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to evaluate game attempt" },
      { status: 500 }
    );
  }
}
