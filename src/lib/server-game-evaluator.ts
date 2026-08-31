import {
  TeacherSolutionKey,
  unsealSolutionKey,
  SealedTokenContext,
  CANONICAL_LESSON_IDS,
} from "./server-game-definitions";
import { createServiceRoleClient } from "./supabase/service-role";

// ─────────────────────────────────────────────────────────────
// WONDER JOURNEY OS — SERVER-ONLY GAME EVALUATOR
// Strictly evaluates student interaction attempts on the server.
// Fails closed if keys are missing or invalid.
// ─────────────────────────────────────────────────────────────

export interface EvaluationResult {
  success: boolean;
  result: "correct" | "try_again";
  score: number;
  feedback: string;
  error?: string;
  statusCode?: number;
}

// ─────────────────────────────────────────────────────────────
// PURE SCORING FUNCTION — zero side effects
// ─────────────────────────────────────────────────────────────
export function scoreGameAttempt(
  key: TeacherSolutionKey,
  gameType: string,
  attemptData: Record<string, unknown>
): EvaluationResult {
  switch (gameType) {
    case "sorting":
    case "drag_drop_sort": {
      const placements = (attemptData.placements || {}) as Record<string, string>;
      const keys = Object.keys(key.sortingMap);
      if (keys.length === 0) {
        return { success: false, result: "try_again", score: 0, feedback: "Invalid sorting key on server.", error: "Empty sorting map" };
      }
      let correct = 0;
      for (const [itemId, expectedBin] of Object.entries(key.sortingMap)) {
        if (placements[itemId] === expectedBin) correct++;
      }
      const score = Math.round((correct / keys.length) * 100);
      return {
        success: true,
        result: score >= 75 ? "correct" : "try_again",
        score,
        feedback: score >= 75 ? "Magaling! All items placed in correct categories!" : `You categorized ${correct}/${keys.length} correctly. Subukan muli!`,
      };
    }

    case "matching": {
      const pair = (attemptData.pair || {}) as { leftId?: string; rightId?: string };
      if (!pair.leftId || !pair.rightId) {
        return { success: false, result: "try_again", score: 0, feedback: "Incomplete matching pair submitted.", error: "Incomplete pair" };
      }
      const expectedRight = key.matchingPairs[pair.leftId];
      const isMatch = expectedRight !== undefined && expectedRight === pair.rightId;
      return {
        success: true,
        result: isMatch ? "correct" : "try_again",
        score: isMatch ? 100 : 0,
        feedback: isMatch ? "Tama! Pair matched successfully!" : "Hindi tugma. Try matching another pair!",
      };
    }

    case "memory_flip":
    case "memory_pairs": {
      const cardIds = (attemptData.cardIds || []) as string[];
      if (!Array.isArray(cardIds) || cardIds.length !== 2) {
        return { success: false, result: "try_again", score: 0, feedback: "Select exactly 2 cards to flip.", error: "Invalid card selection" };
      }
      const isMatch = key.memoryPairs[cardIds[0]] === cardIds[1];
      return {
        success: true,
        result: isMatch ? "correct" : "try_again",
        score: isMatch ? 100 : 0,
        feedback: isMatch ? "Tagumpay! You found a matching pair!" : "Not a match. Memory flip reset!",
      };
    }

    case "sequencing": {
      const order = (attemptData.order || []) as string[];
      if (!Array.isArray(order) || order.length === 0) {
        return { success: false, result: "try_again", score: 0, feedback: "Invalid sequence order submitted.", error: "Empty sequence" };
      }
      const isCorrect = order.length === key.sequenceOrder.length && order.every((id, idx) => id === key.sequenceOrder[idx]);
      return {
        success: true,
        result: isCorrect ? "correct" : "try_again",
        score: isCorrect ? 100 : 50,
        feedback: isCorrect ? "Tumpak! Steps ordered in exact sequence!" : "Sequence out of order. Re-order the steps!",
      };
    }

    case "quiz":
    case "multiple_choice": {
      const selectedId = attemptData.selectedOptionId as string;
      if (!selectedId) {
        return { success: false, result: "try_again", score: 0, feedback: "Please select an answer option.", error: "No option selected" };
      }
      const isCorrect = selectedId === key.correctQuizOptionId;
      return {
        success: true,
        result: isCorrect ? "correct" : "try_again",
        score: isCorrect ? 100 : 0,
        feedback: isCorrect ? "Magaling! Correct answer!" : "Subukan muli! Select the correct option.",
      };
    }

    case "hotspot": {
      const targetId = attemptData.targetId as string;
      if (!targetId) {
        return { success: false, result: "try_again", score: 0, feedback: "Select a valid target hotspot.", error: "No target selected" };
      }
      const isCorrect = key.hotspotTargetIds.includes(targetId);
      return {
        success: true,
        result: isCorrect ? "correct" : "try_again",
        score: isCorrect ? 100 : 0,
        feedback: isCorrect ? "Nahanap mo! Feature accurately located!" : "Keep exploring the diagram!",
      };
    }

    default:
      return {
        success: false,
        result: "try_again",
        score: 0,
        feedback: `Unsupported game activity type: "${gameType}".`,
        error: "Unsupported game type",
      };
  }
}

// ─────────────────────────────────────────────────────────────
// SYNCHRONOUS CONTEXT VALIDATOR & SCORER (Unit Testing & Pure Evaluation)
// ─────────────────────────────────────────────────────────────
export function evaluateGameAttemptOnServer(
  lessonId: string,
  gameType: string,
  attemptData: Record<string, unknown>,
  gameToken?: string,
  evalContext?: SealedTokenContext
): EvaluationResult {
  if (!gameToken) {
    return { success: false, result: "try_again", score: 0, error: "Missing gameToken", feedback: "Missing gameToken" };
  }
  if (!CANONICAL_LESSON_IDS.has(lessonId)) {
    return { success: false, result: "try_again", score: 0, error: `Unknown lessonId: "${lessonId}"`, feedback: "Unknown lesson ID" };
  }
  const unsealed = unsealSolutionKey(gameToken);
  if (!unsealed) {
    return { success: false, result: "try_again", score: 0, error: "Invalid or expired game token", feedback: "Invalid token" };
  }
  if (unsealed.lessonId !== lessonId) {
    return { success: false, result: "try_again", score: 0, error: "Cross-lesson token", feedback: "Cross-lesson token" };
  }
  if (evalContext) {
    if (evalContext.userId && unsealed.userId !== evalContext.userId) {
      return { success: false, result: "try_again", score: 0, error: "Cross-user token", feedback: "Cross-user token" };
    }
    if (evalContext.workspaceId && unsealed.workspaceId !== evalContext.workspaceId) {
      return { success: false, result: "try_again", score: 0, error: "Cross-workspace token", feedback: "Cross-workspace token" };
    }
    if (evalContext.sessionId && unsealed.sessionId !== evalContext.sessionId) {
      return { success: false, result: "try_again", score: 0, error: "Cross-session token", feedback: "Cross-session token" };
    }
  }
  return scoreGameAttempt(unsealed, gameType, attemptData);
}

// ─────────────────────────────────────────────────────────────
// ASYNC EVALUATION WITH ATOMIC DATABASE NONCE CONSUMPTION
// Uses service-role client — no in-memory nonce fallback
// ─────────────────────────────────────────────────────────────
export async function evaluateGameAttemptOnServerAsync(
  lessonId: string,
  gameType: string,
  attemptData: Record<string, unknown>,
  gameToken: string,
  evalContext: SealedTokenContext
): Promise<EvaluationResult> {
  if (
    !lessonId ||
    typeof lessonId !== "string" ||
    !gameType ||
    typeof gameType !== "string" ||
    !attemptData ||
    typeof attemptData !== "object"
  ) {
    return {
      success: false,
      result: "try_again",
      score: 0,
      feedback: "Invalid payload parameters submitted.",
      error: "Malformed request payload",
    };
  }

  // Canonical lesson validation
  if (!CANONICAL_LESSON_IDS.has(lessonId)) {
    return {
      success: false,
      result: "try_again",
      score: 0,
      feedback: "Unknown or non-canonical lesson ID.",
      error: `Unknown lessonId: "${lessonId}"`,
    };
  }

  // 1. gameToken is strictly required
  if (!gameToken || typeof gameToken !== "string") {
    return {
      success: false,
      result: "try_again",
      score: 0,
      feedback: "gameToken is strictly required for server evaluation.",
      error: "Missing gameToken",
    };
  }

  const unsealed = unsealSolutionKey(gameToken);
  if (!unsealed) {
    return {
      success: false,
      result: "try_again",
      score: 0,
      feedback: "Tampered, malformed, or expired game token rejected.",
      error: "Invalid or expired game token",
    };
  }

  // Require EXACT lesson-ID equality
  if (unsealed.lessonId !== lessonId) {
    return {
      success: false,
      result: "try_again",
      score: 0,
      feedback: "Cross-lesson game token rejected.",
      error: "Cross-lesson token",
    };
  }

  // Mandatory context check
  if (!evalContext || !evalContext.userId || !evalContext.workspaceId || !evalContext.sessionId) {
    return {
      success: false,
      result: "try_again",
      score: 0,
      feedback: "Missing mandatory evaluation context.",
      error: "Missing evaluation context",
    };
  }

  // User binding check
  if (unsealed.userId !== evalContext.userId) {
    return {
      success: false,
      result: "try_again",
      score: 0,
      feedback: "Cross-user game token rejected.",
      error: "Cross-user token",
    };
  }

  // Workspace binding check
  if (unsealed.workspaceId !== evalContext.workspaceId) {
    return {
      success: false,
      result: "try_again",
      score: 0,
      feedback: "Cross-workspace game token rejected.",
      error: "Cross-workspace token",
    };
  }

  // Session binding check
  if (unsealed.sessionId !== evalContext.sessionId) {
    return {
      success: false,
      result: "try_again",
      score: 0,
      feedback: "Cross-session game token rejected.",
      error: "Cross-session token",
    };
  }

  // Atomically consume nonce via service-role client (bypasses RLS)
  let serviceClient;
  try {
    serviceClient = createServiceRoleClient();
  } catch {
    return {
      success: false,
      result: "try_again",
      score: 0,
      feedback: "Database client required for secure evaluation.",
      error: "Service-role client unavailable",
      statusCode: 500,
    };
  }

  const { error: nonceError } = await (serviceClient.from("game_evaluation_nonces") as any)
    .insert({
      nonce: unsealed.nonce,
      user_id: evalContext.userId,
      workspace_id: evalContext.workspaceId,
      session_id: evalContext.sessionId,
      lesson_id: lessonId,
      expires_at: new Date(unsealed.expiresAt).toISOString(),
    });

  if (nonceError) {
    // HTTP 409 ONLY for exact PostgreSQL error code 23505 (unique violation)
    if (nonceError.code === "23505") {
      return {
        success: false,
        result: "try_again",
        score: 0,
        feedback: "Replayed or already consumed game token rejected.",
        error: "Replayed game token",
        statusCode: 409,
      };
    }

    // All other database failures → HTTP 500
    return {
      success: false,
      result: "try_again",
      score: 0,
      feedback: "Database error during nonce validation.",
      error: `Database failure: ${nonceError.message || "Nonce insertion failed"}`,
      statusCode: 500,
    };
  }

  // Score using the pure function — no delegation to evaluateGameAttemptOnServer
  return scoreGameAttempt(unsealed, gameType, attemptData);
}
