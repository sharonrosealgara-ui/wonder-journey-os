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

export type PremiumAssessment = 
  | { type: 'multiple-choice'; question: string; options: string[]; correctAnswer: string }
  | { type: 'true-false-with-explanation'; question: string; correctAnswer: 'True' | 'False'; explanation: string }
  | { type: 'short-answer'; question: string; expectedAnswerKeywords: string[] }
  | { type: 'matching'; pairs: { left: string; right: string }[] }
  | { type: 'sequencing'; question: string; correctOrder: string[] }
  | { type: 'scenario-application'; scenario: string; question: string; expectedResolution: string };

export type FactualSource = {
  source: string;
  url?: string;
  note?: string;
};

export type CurriculumLesson = {

  // Premium Fields
  adventureHook?: string;
  discoveries?: string[];
  richExplanation?: { heading?: string; body: string; emoji?: string }[];
  keyFacts?: string[];
  realWorldConnection?: string;
  mediaMoments?: { description: string; purpose: string; requiredType: string; sourceRequirement: string; altTextRequirement: boolean }[];
  guidedDiscussion?: string[];
  ageDifferentiation?: {
    explorer: string;
    adventure: string;
    trailblazer: string;
  };
  game?: {
    title: string;
    objective: string;
    materials: string[];
    setup: string;
    rules: string;
    winCondition: string;
    adaptation?: string;
  };
  handsOnTask?: {
    title: string;
    materials: string[];
    setup?: string;
    steps: string[];
    finishCondition?: string;
    safetyNotes?: string;
    accessibilityAlternative?: string;
  };
  curatedResources?: { id: string; title: string; url: string; type: string; visibility: "teacher" | "family" | "both"; whyUseful: string; verificationStatus: "verified" | "unverified"; provider: string; }[];
  authoritativeSources?: { source: string; url: string; note: string }[];
  optionalExtensions?: string[];
  suggestedPacing?: Record<string, string>;
  crossSubjectConnections?: string[];
  characterConnection?: string;
  misconceptions?: string[];
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
  vocabulary: { word: string; translation?: string; language?: string; hiligaynon?: string; pronunciation?: string; mediaId?: string }[];
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


export type FamilyPremiumLesson = Pick<
  CurriculumLesson,
  | "id" | "date" | "title" | "topic" | "ageRange" | "unit" | "essentialQuestion"
  | "adventureHook" | "discoveries" | "richExplanation" | "keyFacts" | "realWorldConnection"
  | "vocabulary" | "mediaMoments" | "guidedDiscussion" | "ageDifferentiation"
  | "game" | "handsOnTask" | "crossSubjectConnections" | "characterConnection"
  | "misconceptions" | "knowledgeCheck" | "learnerReflection" | "familyChallenge"
  | "curatedResources" | "optionalExtensions" | "suggestedPacing"
  | "accessibilityNotes" | "materials" | "interactiveGame" | "handsOnActivity"
>;

export function createFamilyPremiumProjection(lesson: CurriculumLesson): FamilyPremiumLesson {
  const {
    teacherPreparation,
    teacherAnswerKey,
    privateTeacherNotes,
    internalFactCheckNotes,
    sourceNotes,
    factualSources,
    ...familySafe
  } = lesson as any;
  return familySafe as FamilyPremiumLesson;
}

export type FamilyVisibleCurriculumLesson = Pick<CurriculumLesson,
  | "id" | "date" | "title" | "topic" | "ageRange" | "unit" | "essentialQuestion"
  | "adventureHook" | "discoveries" | "richExplanation" | "keyFacts" | "realWorldConnection"
  | "vocabulary" | "mediaMoments" | "guidedDiscussion" | "ageDifferentiation"
  | "game" | "handsOnTask" | "crossSubjectConnections" | "characterConnection"
  | "misconceptions" | "premiumAssessment" | "knowledgeCheck" | "learnerReflection" | "familyChallenge"
  | "curatedResources" | "optionalExtensions" | "suggestedPacing"
  | "accessibilityNotes" | "materials" | "interactiveGame" | "handsOnActivity"
  | "learningObjectives" | "factualBackground" | "subjectConnections" | "factualMediaRequirements"
  | "mediaReferences" | "activities" | "progressBadge" | "privacyClassification" | "publicationStatus"
  | "gratitudePrompt" | "prayerPrompt" | "weekday" | "sourceNotes" | "mediaAttributionNotes" | "factualSources"
>;

// Exclude teacher-only fields for Family serialization
export function serializeForFamily(lesson: CurriculumLesson): FamilyVisibleCurriculumLesson {
  const {
    teacherPreparation,
    teacherAnswerKey,
    privateTeacherNotes,
    internalFactCheckNotes,
    ...familyVisible
  } = lesson as any;
  return familyVisible as FamilyVisibleCurriculumLesson;
}

// Lightweight runtime validator — useful for build-time checks and unit tests
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
  else {
    if (typeof value.activities.beginnerSupport !== 'string') errors.push('activities.beginnerSupport must be a string');
    if (typeof value.activities.coreActivity !== 'string') errors.push('activities.coreActivity must be a string');
    if (typeof value.activities.advancedChallenge !== 'string') errors.push('activities.advancedChallenge must be a string');
  }

  // Validate knowledgeCheck shape
  if (!Array.isArray(value.knowledgeCheck)) errors.push('knowledgeCheck must be an array');
  else {
    value.knowledgeCheck.forEach((q: any, i: number) => {
      if (!q || typeof q.question !== 'string') errors.push(`knowledgeCheck[${i}].question must be a string`);
      if (!Array.isArray(q.options) || q.options.some((o: any) => typeof o !== 'string')) errors.push(`knowledgeCheck[${i}].options must be an array of strings`);
      if (typeof q.correctAnswer !== 'string') errors.push(`knowledgeCheck[${i}].correctAnswer must be a string`);
    });
  }

  // Date format basic check YYYY-MM-DD
  if (value.date && !/^\d{4}-\d{2}-\d{2}$/.test(value.date)) errors.push('date must be ISO YYYY-MM-DD');

  mustBeString('privacyClassification');
  if (value.privacyClassification && !["family-safe", "teacher-only", "private", "public"].includes(value.privacyClassification)) {
    errors.push('privacyClassification must be one of family-safe, teacher-only, private, public');
  }

  mustBeString('publicationStatus');
  if (value.publicationStatus && !["draft", "pilot", "published"].includes(value.publicationStatus)) {
    errors.push('publicationStatus must be one of draft, pilot, published');
  }

  if (value.gratitudePrompt && typeof value.gratitudePrompt !== 'string') errors.push('gratitudePrompt must be a string when present');
  if (value.prayerPrompt && typeof value.prayerPrompt !== 'string') errors.push('prayerPrompt must be a string when present');
  if (value.sourceNotes && typeof value.sourceNotes !== 'string') errors.push('sourceNotes must be a string');
  if (value.mediaAttributionNotes && typeof value.mediaAttributionNotes !== 'string') errors.push('mediaAttributionNotes must be a string');
  if (value.accessibilityNotes && typeof value.accessibilityNotes !== 'string') errors.push('accessibilityNotes must be a string');

  // Ensure teacher-only fields presence and types
  if (!('teacherPreparation' in value) || typeof value.teacherPreparation !== 'string') errors.push('teacherPreparation must be present as a string');
  if (!('teacherAnswerKey' in value) || typeof value.teacherAnswerKey !== 'object') errors.push('teacherAnswerKey must be present as an object');

  return { ok: errors.length === 0, errors };
}
