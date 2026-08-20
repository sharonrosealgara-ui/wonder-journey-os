import { scrambleSequencing, scrambleRightItems } from "./assessment-state";

export type LevelSupport = {
  beginnerSupport: string;
  coreActivity: string;
  advancedChallenge: string;
  movementOption?: string;
};

export type QuizQuestion = {
  question: string;
  options: string[];
  correctAnswer: string;
};

export type Discovery = {
  title: string;
  description: string;
};

// Complete Teacher/Internal Assessment Types (contains answers/keys)
export type PremiumAssessment =
  | { id?: string; type: 'multiple-choice'; question: string; options: string[]; correctAnswer?: string; correctOptionId?: string; explanation?: string; prompt?: string }
  | { id?: string; type: 'true-false-with-explanation'; question: string; correctAnswer?: 'True' | 'False' | string; correctOptionId?: string; explanation?: string; options?: string[]; prompt?: string }
  | { id?: string; type: 'short-answer'; question: string; expectedAnswerKeywords?: string[]; correctOptionId?: string; options?: string[]; prompt?: string }
  | { id?: string; type: 'matching'; pairs: { left: string; right: string }[]; question?: string; prompt?: string }
  | { id?: string; type: 'sequencing'; question: string; correctOrder: string[]; prompt?: string }
  | { id?: string; type: 'scenario-application'; scenario: string; question: string; expectedResolution?: string; prompt?: string };

// Learner-Safe Family Assessment Types (Strictly NO answers/keys/solutions)
export type FamilyPremiumAssessment =
  | { id?: string; type: 'multiple-choice'; question: string; options: string[]; prompt?: string }
  | { id?: string; type: 'true-false-with-explanation'; question: string; options?: string[]; prompt?: string }
  | { id?: string; type: 'short-answer'; question: string; prompt?: string }
  | { id?: string; type: 'matching'; question?: string; leftItems: string[]; rightItems: string[]; prompt?: string }
  | { id?: string; type: 'sequencing'; question: string; items: string[]; prompt?: string }
  | { id?: string; type: 'scenario-application'; scenario: string; question: string; prompt?: string };

export type FamilyKnowledgeCheck = {
  question: string;
  options?: string[];
  prompt?: string;
};

export type MisconceptionItem = {
  misconception: string;
  correction?: string;
  prompt?: string;
} | string;

export type FactualSource = {
  source: string;
  url?: string;
  note?: string;
};

export type CuratedResource = {
  id: string;
  title: string;
  url: string;
  type: string;
  visibility: "teacher" | "family" | "both";
  whyUseful: string;
  verificationStatus: "verified" | "unverified";
  provider: string;
  verifiedDate?: string;
};

export type AuthoritativeSource = {
  source: string;
  exactUrl: string;
  publisher: string;
  claimSupported: string;
  verifiedDate: string;
  context?: string;
  note?: string;
  url?: string;
};

export type SuggestedPacing = {
  hook: number;
  teaching: number;
  discussionVocabulary: number;
  handsOnOrGame: number;
  assessment: number;
  reflectionClosing: number;
  total: number;
};

export type AgeDifferentiation = {
  explorer: string;
  adventure: string;
  trailblazer: string;
};

export type Game = {
  title: string;
  objective: string;
  materials: string[];
  setup: string;
  rules: string;
  winCondition: string;
  adaptation?: string;
};

export type HandsOnTask = {
  title: string;
  description?: string;
  materials: string[];
  setup?: string;
  steps: string[];
  finishCondition?: string;
  safetyNotes?: string;
  accessibilityAlternative?: string;
};

export type VocabularyItem = {
  word: string;
  translation?: string;
  language?: string;
  hiligaynon?: string;
  pronunciation?: string;
  contextualExample?: string;
  mediaId?: string;
};

export type MediaMoment = {
  description: string;
  purpose: string;
  requiredType: string;
  factualRequirement?: string;
  sourceRequirement: string;
  altTextGuidance?: string;
  url?: string;
  caption?: string;
};

export type RichExplanationSection = {
  heading?: string;
  body: string;
  emoji?: string;
};

export type CurriculumLesson = {
  // Premium Fields
  adventureHook?: string;
  discoveries?: Discovery[];
  richExplanation?: RichExplanationSection[];
  keyFacts?: string[];
  realWorldConnection?: string;
  mediaMoments?: MediaMoment[];
  guidedDiscussion?: string[];
  ageDifferentiation?: AgeDifferentiation;
  game?: Game;
  handsOnTask?: HandsOnTask;
  curatedResources?: CuratedResource[];
  authoritativeSources?: AuthoritativeSource[];
  optionalExtensions?: string[] | string;
  suggestedPacing?: SuggestedPacing | Record<string, string | number> | string;
  crossSubjectConnections?: string[] | Record<string, string>;
  characterConnection?: string;
  misconceptions?: MisconceptionItem[];
  premiumAssessment?: PremiumAssessment[];

  id: string; // stable lesson id
  date: string; // ISO YYYY-MM-DD
  weekday: string;
  title: string;
  topic: string;
  ageRange: string;
  unit: string;
  learningObjectives: string[];
  essentialQuestion: string;
  factualBackground: string;
  vocabulary: VocabularyItem[];
  subjectConnections: {
    geography?: string;
    science?: string;
    history?: string;
    culture?: string;
    cooking?: string;
    art?: string;
    music?: string;
    language?: string;
    christianCharacter?: string;
    english?: string;
  };
  materials: string[];
  factualMediaRequirements: string[]; // array of mediaRegistry IDs
  mediaReferences?: string[];
  factualSources?: FactualSource[];
  activities: LevelSupport;
  interactiveGame: string;
  handsOnActivity: string;
  knowledgeCheck: QuizQuestion[];
  learnerReflection: string;
  gratitudePrompt?: string;
  prayerPrompt?: string;
  familyChallenge: string;
  progressBadge: string;
  sourceNotes: string;
  mediaAttributionNotes: string;
  accessibilityNotes: string;
  privacyClassification: "family-safe" | "teacher-only" | "private" | "public";
  publicationStatus: "draft" | "pilot" | "published";

  // Teacher-only fields (MUST NOT be exposed to Family routes)
  teacherPreparation: string;
  teacherAnswerKey: Record<string, string>;
  privateTeacherNotes?: string;
  internalFactCheckNotes?: string;
};

export type FamilyPremiumLesson = {
  id: string;
  date: string;
  title: string;
  topic: string;
  ageRange: string;
  unit: string;
  essentialQuestion: string;
  adventureHook?: string;
  discoveries?: Discovery[];
  richExplanation?: RichExplanationSection[];
  keyFacts?: string[];
  realWorldConnection?: string;
  vocabulary?: VocabularyItem[];
  mediaMoments?: MediaMoment[];
  guidedDiscussion?: string[];
  ageDifferentiation?: AgeDifferentiation;
  game?: Game;
  handsOnTask?: HandsOnTask;
  crossSubjectConnections?: string[] | Record<string, string>;
  characterConnection?: string;
  misconceptions?: MisconceptionItem[];
  premiumAssessment?: FamilyPremiumAssessment[];
  knowledgeCheck?: FamilyKnowledgeCheck[];
  learnerReflection?: string;
  familyChallenge?: string;
  curatedResources?: CuratedResource[];
  optionalExtensions?: string[] | string;
  suggestedPacing?: SuggestedPacing | Record<string, string | number> | string;
  accessibilityNotes?: string;
  materials?: string[];
  interactiveGame?: string;
  handsOnActivity?: string;
};

// Transforms teacher assessments into learner-safe DTOs stripping all answers and solutions
export function transformAssessmentsForFamily(assessments?: PremiumAssessment[]): FamilyPremiumAssessment[] | undefined {
  if (!assessments) return undefined;
  return assessments.map((q) => {
    switch (q.type) {
      case "multiple-choice":
        return {
          id: q.id,
          type: "multiple-choice",
          question: q.question,
          options: [...q.options],
          prompt: q.prompt
        };
      case "true-false-with-explanation":
        return {
          id: q.id,
          type: "true-false-with-explanation",
          question: q.question,
          options: q.options ? [...q.options] : ["True", "False"],
          prompt: q.prompt
        };
      case "short-answer":
        return {
          id: q.id,
          type: "short-answer",
          question: q.question,
          prompt: q.prompt
        };
      case "matching":
        return {
          id: q.id,
          type: "matching",
          question: q.question || "Match the following items:",
          leftItems: q.pairs.map((p) => p.left),
          rightItems: scrambleRightItems(q.pairs, q.id || q.question || "matching-seed"),
          prompt: q.prompt
        };
      case "sequencing":
        return {
          id: q.id,
          type: "sequencing",
          question: q.question,
          items: scrambleSequencing(q.correctOrder, q.id || q.question || "sequencing-seed"),
          prompt: q.prompt
        };
      case "scenario-application":
        return {
          id: q.id,
          type: "scenario-application",
          scenario: q.scenario,
          question: q.question,
          prompt: q.prompt
        };
    }
  });
}

// Transforms knowledge check into learner-safe DTO stripping correctAnswer
export function transformKnowledgeCheckForFamily(checks?: QuizQuestion[]): FamilyKnowledgeCheck[] | undefined {
  if (!checks) return undefined;
  return checks.map((c) => ({
    question: c.question,
    options: c.options ? [...c.options] : undefined
  }));
}

export function createFamilyPremiumProjection(lesson: CurriculumLesson): FamilyPremiumLesson {
  const familyCurated = lesson.curatedResources
    ? lesson.curatedResources.filter((r) => r.visibility !== "teacher")
    : undefined;

  const result: FamilyPremiumLesson = {
    id: lesson.id,
    date: lesson.date,
    title: lesson.title,
    topic: lesson.topic,
    ageRange: lesson.ageRange,
    unit: lesson.unit,
    essentialQuestion: lesson.essentialQuestion,
    adventureHook: lesson.adventureHook,
    discoveries: lesson.discoveries,
    richExplanation: lesson.richExplanation,
    keyFacts: lesson.keyFacts,
    realWorldConnection: lesson.realWorldConnection,
    vocabulary: lesson.vocabulary,
    mediaMoments: lesson.mediaMoments,
    guidedDiscussion: lesson.guidedDiscussion,
    ageDifferentiation: lesson.ageDifferentiation,
    game: lesson.game,
    handsOnTask: lesson.handsOnTask,
    crossSubjectConnections: lesson.crossSubjectConnections,
    characterConnection: lesson.characterConnection,
    misconceptions: lesson.misconceptions,
    premiumAssessment: transformAssessmentsForFamily(lesson.premiumAssessment),
    knowledgeCheck: transformKnowledgeCheckForFamily(lesson.knowledgeCheck),
    learnerReflection: lesson.learnerReflection,
    familyChallenge: lesson.familyChallenge,
    curatedResources: familyCurated,
    optionalExtensions: lesson.optionalExtensions,
    suggestedPacing: lesson.suggestedPacing,
    accessibilityNotes: lesson.accessibilityNotes,
    materials: lesson.materials,
    interactiveGame: lesson.interactiveGame,
    handsOnActivity: lesson.handsOnActivity
  };

  for (const k of Object.keys(result) as Array<keyof typeof result>) {
    if (result[k] === undefined) delete result[k];
  }
  return result;
}

export type FamilyVisibleCurriculumLesson = Omit<
  FamilyPremiumLesson,
  never
> & {
  learningObjectives?: string[];
  factualBackground?: string;
  subjectConnections?: CurriculumLesson["subjectConnections"];
  factualMediaRequirements?: string[];
  mediaReferences?: string[];
  activities?: LevelSupport;
  progressBadge?: string;
  privacyClassification?: string;
  publicationStatus?: string;
  gratitudePrompt?: string;
  prayerPrompt?: string;
  weekday?: string;
};

// Exclude teacher-only and internal verification fields and transform assessments for Family serialization
export function serializeForFamily(lesson: CurriculumLesson): FamilyVisibleCurriculumLesson {
  const familyCurated = lesson.curatedResources
    ? lesson.curatedResources.filter((r) => r.visibility !== "teacher")
    : undefined;

  const result: FamilyVisibleCurriculumLesson = {
    id: lesson.id,
    date: lesson.date,
    title: lesson.title,
    topic: lesson.topic,
    ageRange: lesson.ageRange,
    unit: lesson.unit,
    essentialQuestion: lesson.essentialQuestion,
    adventureHook: lesson.adventureHook,
    discoveries: lesson.discoveries,
    richExplanation: lesson.richExplanation,
    keyFacts: lesson.keyFacts,
    realWorldConnection: lesson.realWorldConnection,
    vocabulary: lesson.vocabulary,
    mediaMoments: lesson.mediaMoments,
    guidedDiscussion: lesson.guidedDiscussion,
    ageDifferentiation: lesson.ageDifferentiation,
    game: lesson.game,
    handsOnTask: lesson.handsOnTask,
    crossSubjectConnections: lesson.crossSubjectConnections,
    characterConnection: lesson.characterConnection,
    misconceptions: lesson.misconceptions,
    premiumAssessment: transformAssessmentsForFamily(lesson.premiumAssessment),
    knowledgeCheck: transformKnowledgeCheckForFamily(lesson.knowledgeCheck),
    learnerReflection: lesson.learnerReflection,
    familyChallenge: lesson.familyChallenge,
    curatedResources: familyCurated,
    optionalExtensions: lesson.optionalExtensions,
    suggestedPacing: lesson.suggestedPacing,
    accessibilityNotes: lesson.accessibilityNotes,
    materials: lesson.materials,
    interactiveGame: lesson.interactiveGame,
    handsOnActivity: lesson.handsOnActivity,
    learningObjectives: lesson.learningObjectives,
    factualBackground: lesson.factualBackground,
    subjectConnections: lesson.subjectConnections,
    factualMediaRequirements: lesson.factualMediaRequirements,
    mediaReferences: lesson.mediaReferences,
    activities: lesson.activities,
    progressBadge: lesson.progressBadge,
    privacyClassification: lesson.privacyClassification,
    publicationStatus: lesson.publicationStatus,
    gratitudePrompt: lesson.gratitudePrompt,
    prayerPrompt: lesson.prayerPrompt,
    weekday: lesson.weekday,
  };

  for (const k of Object.keys(result) as Array<keyof typeof result>) {
    if (result[k] === undefined) delete result[k];
  }
  return result;
}

// Lightweight runtime validator for build-time checks and unit tests
export function validateCurriculumLesson(value: any): { ok: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!value || typeof value !== 'object') {
    errors.push('Value must be an object');
    return { ok: false, errors };
  }

  const mustBeString = (k: string) => {
    if (!(k in value) || typeof value[k] !== 'string') errors.push(`${k} must be a string`);
  };

  mustBeString('id');
  mustBeString('date');
  mustBeString('title');
  mustBeString('topic');
  mustBeString('ageRange');
  mustBeString('unit');

  if (!Array.isArray(value.learningObjectives) || value.learningObjectives.some((v: any) => typeof v !== 'string')) {
    errors.push('learningObjectives must be an array of strings');
  }

  if (!Array.isArray(value.vocabulary)) {
    errors.push('vocabulary must be an array');
  } else {
    value.vocabulary.forEach((v: any, i: number) => {
      if (!v || typeof v.word !== 'string') errors.push(`vocabulary[${i}].word must be a string`);
    });
  }

  if (!Array.isArray(value.materials)) errors.push('materials must be an array');
  if (!Array.isArray(value.factualMediaRequirements)) errors.push('factualMediaRequirements must be an array');
  if (value.mediaReferences && (!Array.isArray(value.mediaReferences) || value.mediaReferences.some((m: any) => typeof m !== 'string'))) {
    errors.push('mediaReferences must be an array of strings when present');
  }
  if (value.factualSources && !Array.isArray(value.factualSources)) {
    errors.push('factualSources must be an array when present');
  } else if (Array.isArray(value.factualSources)) {
    value.factualSources.forEach((src: any, i: number) => {
      if (!src || typeof src.source !== 'string') errors.push(`factualSources[${i}].source must be a string`);
      if (src.url && typeof src.url !== 'string') errors.push(`factualSources[${i}].url must be a string`);
      if (src.note && typeof src.note !== 'string') errors.push(`factualSources[${i}].note must be a string`);
    });
  }

  if (!value.activities || typeof value.activities !== 'object') errors.push('activities must be present and an object');

  if (value.curatedResources && Array.isArray(value.curatedResources)) {
    value.curatedResources.forEach((res: any, i: number) => {
      if (!res.id || typeof res.id !== 'string') errors.push(`curatedResources[${i}].id must be a string`);
      if (!res.title || typeof res.title !== 'string') errors.push(`curatedResources[${i}].title must be a string`);
      if (!res.url || typeof res.url !== 'string') errors.push(`curatedResources[${i}].url must be a string`);
      if (!['teacher', 'family', 'both'].includes(res.visibility)) errors.push(`curatedResources[${i}].visibility must be 'teacher', 'family', or 'both'`);
    });
  }

  return { ok: errors.length === 0, errors };
}
