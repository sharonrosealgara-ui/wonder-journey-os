import "server-only";

// ─────────────────────────────────────────────────────────────
// WONDER JOURNEY OS — SERVER-ONLY GAME EVALUATOR & ANSWER KEYS
// Protected Server Module: Answer evaluation and solution keys
// are isolated from client bundles.
// ─────────────────────────────────────────────────────────────

export interface TeacherSolutionKey {
  hotspotTargetIds: string[];
  sortingMap: Record<string, string>; // itemId -> binId
  matchingPairs: Record<string, string>; // leftItemId -> rightItemId
  sequenceOrder: string[]; // itemIds in correct order
  correctQuizOptionId: string;
  memoryPairs: Record<string, string>; // cardId -> cardId
}

const teacherKeysCache = new Map<string, TeacherSolutionKey>();

export function setTeacherSolutionKey(lessonId: string, key: TeacherSolutionKey) {
  teacherKeysCache.set(lessonId, key);
}

export function evaluateGameAttemptOnServer(
  lessonId: string,
  gameType: string,
  attemptData: Record<string, unknown>
): { result: "correct" | "try_again"; score: number; feedback: string } {
  const key = teacherKeysCache.get(lessonId);
  if (!key) {
    return { result: "correct", score: 100, feedback: "Magaling! Activity completed!" };
  }

  switch (gameType) {
    case "sorting":
    case "drag_drop_sort": {
      const placements = (attemptData.placements || {}) as Record<string, string>;
      let correct = 0;
      const total = Object.keys(key.sortingMap).length || 1;
      for (const [itemId, expectedBin] of Object.entries(key.sortingMap)) {
        if (placements[itemId] === expectedBin) correct++;
      }
      const score = Math.round((correct / total) * 100);
      return {
        result: score >= 75 ? "correct" : "try_again",
        score,
        feedback: score >= 75 ? "Magaling! All items placed in correct categories!" : `You categorized ${correct}/${total} correctly. Subukan muli!`,
      };
    }

    case "matching": {
      const pair = (attemptData.pair || {}) as { leftId: string; rightId: string };
      const isMatch = key.matchingPairs[pair.leftId] === pair.rightId;
      return {
        result: isMatch ? "correct" : "try_again",
        score: isMatch ? 100 : 0,
        feedback: isMatch ? "Tama! Pair matched successfully!" : "Hindi tugma. Try matching another pair!",
      };
    }

    case "memory_flip":
    case "memory_pairs": {
      const cardIds = (attemptData.cardIds || []) as string[];
      if (cardIds.length !== 2) return { result: "try_again", score: 0, feedback: "Select 2 cards to flip." };
      const isMatch = key.memoryPairs[cardIds[0]] === cardIds[1];
      return {
        result: isMatch ? "correct" : "try_again",
        score: isMatch ? 100 : 0,
        feedback: isMatch ? "Tagumpay! You found a matching pair!" : "Not a match. Memory flip reset!",
      };
    }

    case "sequencing": {
      const order = (attemptData.order || []) as string[];
      const isCorrect = order.length === key.sequenceOrder.length && order.every((id, idx) => id === key.sequenceOrder[idx]);
      return {
        result: isCorrect ? "correct" : "try_again",
        score: isCorrect ? 100 : 50,
        feedback: isCorrect ? "Tumpak! Steps ordered in exact historical sequence!" : "Sequence out of order. Re-order the steps!",
      };
    }

    case "quiz":
    case "multiple_choice": {
      const selectedId = attemptData.selectedOptionId as string;
      const isCorrect = selectedId === key.correctQuizOptionId;
      return {
        result: isCorrect ? "correct" : "try_again",
        score: isCorrect ? 100 : 0,
        feedback: isCorrect ? "Magaling! Correct answer!" : "Subukan muli! Select the correct option.",
      };
    }

    case "hotspot": {
      const targetId = attemptData.targetId as string;
      const isCorrect = key.hotspotTargetIds.includes(targetId);
      return {
        result: isCorrect ? "correct" : "try_again",
        score: isCorrect ? 100 : 0,
        feedback: isCorrect ? "Nahanap mo! Feature accurately located!" : "Keep exploring the diagram!",
      };
    }

    default:
      return { result: "correct", score: 100, feedback: "Activity finished!" };
  }
}
