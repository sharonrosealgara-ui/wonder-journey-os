// Pure response-model helpers and state transformers for Learner-Safe Assessments
// (DISCUSSION / RESPONSE RECORD MODE)

export type AssessmentResponseType =
  | "multiple-choice"
  | "true-false-with-explanation"
  | "short-answer"
  | "matching"
  | "sequencing"
  | "scenario-application";

export type MultipleChoiceResponse = {
  type: "multiple-choice";
  questionId: string;
  chosenOption: string;
  recordedAt: string;
};

export type TrueFalseResponse = {
  type: "true-false-with-explanation";
  questionId: string;
  chosenOption: "True" | "False" | string;
  recordedAt: string;
};

export type ShortAnswerResponse = {
  type: "short-answer";
  questionId: string;
  text: string;
  recordedAt: string;
};

export type MatchingPair = {
  left: string;
  right: string;
};

export type MatchingResponse = {
  type: "matching";
  questionId: string;
  matches: MatchingPair[];
  recordedAt: string;
};

export type SequencingResponse = {
  type: "sequencing";
  questionId: string;
  chosenOrder: string[];
  recordedAt: string;
};

export type ScenarioResponse = {
  type: "scenario-application";
  questionId: string;
  response: string;
  recordedAt: string;
};

export type LearnerAssessmentResponse =
  | MultipleChoiceResponse
  | TrueFalseResponse
  | ShortAnswerResponse
  | MatchingResponse
  | SequencingResponse
  | ScenarioResponse;

export type AssessmentRecordState = Record<string, LearnerAssessmentResponse>;

// Pure State Transformer Helpers

export function recordMultipleChoice(
  state: AssessmentRecordState,
  questionId: string,
  chosenOption: string,
  timestamp: string = new Date().toISOString()
): AssessmentRecordState {
  if (!chosenOption || !chosenOption.trim()) return state;
  return {
    ...state,
    [questionId]: {
      type: "multiple-choice",
      questionId,
      chosenOption,
      recordedAt: timestamp,
    },
  };
}

export function recordTrueFalse(
  state: AssessmentRecordState,
  questionId: string,
  chosenOption: "True" | "False" | string,
  timestamp: string = new Date().toISOString()
): AssessmentRecordState {
  if (!chosenOption || !chosenOption.trim()) return state;
  return {
    ...state,
    [questionId]: {
      type: "true-false-with-explanation",
      questionId,
      chosenOption,
      recordedAt: timestamp,
    },
  };
}

export function recordShortAnswer(
  state: AssessmentRecordState,
  questionId: string,
  text: string,
  timestamp: string = new Date().toISOString()
): AssessmentRecordState {
  if (!text || !text.trim()) return state;
  return {
    ...state,
    [questionId]: {
      type: "short-answer",
      questionId,
      text: text.trim(),
      recordedAt: timestamp,
    },
  };
}

export function updateMatchingPair(
  pairs: Record<string, string>,
  leftItem: string,
  chosenRightItem: string
): Record<string, string> {
  if (!leftItem || !chosenRightItem) return pairs;
  return {
    ...pairs,
    [leftItem]: chosenRightItem,
  };
}

export function removeMatchingPair(
  pairs: Record<string, string>,
  leftItem: string
): Record<string, string> {
  const next = { ...pairs };
  delete next[leftItem];
  return next;
}

export function recordMatching(
  state: AssessmentRecordState,
  questionId: string,
  pairs: Record<string, string>,
  timestamp: string = new Date().toISOString()
): AssessmentRecordState {
  const entries = Object.entries(pairs).filter(([l, r]) => l && r);
  if (entries.length === 0) return state;
  const matches: MatchingPair[] = entries.map(([left, right]) => ({ left, right }));
  return {
    ...state,
    [questionId]: {
      type: "matching",
      questionId,
      matches,
      recordedAt: timestamp,
    },
  };
}

export function moveSequenceItem(
  items: string[],
  fromIndex: number,
  direction: "up" | "down"
): string[] {
  const toIndex = direction === "up" ? fromIndex - 1 : fromIndex + 1;
  if (fromIndex < 0 || fromIndex >= items.length || toIndex < 0 || toIndex >= items.length) {
    return [...items];
  }
  const copy = [...items];
  const item = copy[fromIndex];
  copy[fromIndex] = copy[toIndex];
  copy[toIndex] = item;
  return copy;
}

export function recordSequencing(
  state: AssessmentRecordState,
  questionId: string,
  chosenOrder: string[],
  timestamp: string = new Date().toISOString()
): AssessmentRecordState {
  if (!chosenOrder || chosenOrder.length === 0) return state;
  return {
    ...state,
    [questionId]: {
      type: "sequencing",
      questionId,
      chosenOrder: [...chosenOrder],
      recordedAt: timestamp,
    },
  };
}

export function recordScenario(
  state: AssessmentRecordState,
  questionId: string,
  response: string,
  timestamp: string = new Date().toISOString()
): AssessmentRecordState {
  if (!response || !response.trim()) return state;
  return {
    ...state,
    [questionId]: {
      type: "scenario-application",
      questionId,
      response: response.trim(),
      recordedAt: timestamp,
    },
  };
}

// Deterministic Scrambler to guarantee learner candidates are NEVER in the solved/correct order
export function deterministicScramble<T>(arr: T[], seedStr: string): T[] {
  if (arr.length <= 1) return [...arr];
  const copy = [...arr];
  let seed = 0;
  for (let i = 0; i < seedStr.length; i++) {
    seed = (seed * 31 + seedStr.charCodeAt(i)) >>> 0;
  }
  for (let i = copy.length - 1; i > 0; i--) {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    const j = seed % (i + 1);
    const temp = copy[i];
    copy[i] = copy[j];
    copy[j] = temp;
  }
  return copy;
}

export function scrambleSequencing(correctOrder: string[], seedStr: string): string[] {
  if (correctOrder.length <= 1) return [...correctOrder];
  let scrambled = deterministicScramble(correctOrder, seedStr);
  const isIdentical = scrambled.every((val, idx) => val === correctOrder[idx]);
  if (isIdentical) {
    scrambled = [scrambled[scrambled.length - 1], ...scrambled.slice(0, scrambled.length - 1)];
  }
  return scrambled;
}

export function scrambleRightItems(pairs: { left: string; right: string }[], seedStr: string): string[] {
  const rightItems = pairs.map((p) => p.right);
  if (rightItems.length <= 1) return rightItems;
  let scrambled = deterministicScramble(rightItems, seedStr);
  const isAllSameIndex = scrambled.every((val, idx) => val === pairs[idx].right);
  if (isAllSameIndex) {
    scrambled = [scrambled[scrambled.length - 1], ...scrambled.slice(0, scrambled.length - 1)];
  }
  return scrambled;
}
