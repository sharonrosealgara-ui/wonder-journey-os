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

export type CurriculumLesson = {
  id: string; // stable lesson id
  date: string; // ISO YYYY-MM-DD
  weekday: string;
  title: string;
  unit: string;
  learningObjectives: string[];
  essentialQuestion: string;
  factualBackground: string;
  vocabulary: { word: string; translation?: string; pronunciation?: string; mediaId?: string }[];
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
  activities: LevelSupport;
  interactiveGame: string;
  handsOnActivity: string;
  knowledgeCheck: QuizQuestion[];
  learnerReflection: string;
  familyChallenge: string;
  progressBadge: string;
  sourceNotes: string;
  mediaAttributionNotes: string;
  accessibilityNotes: string;
  
  // Teacher-only fields (MUST NOT be exposed to Family routes)
  teacherPreparation: string;
  teacherAnswerKey: Record<string, string>;
  privateTeacherNotes?: string;
  internalFactCheckNotes?: string;
};

export type FamilyVisibleCurriculumLesson = Omit<CurriculumLesson, 'teacherPreparation' | 'teacherAnswerKey' | 'privateTeacherNotes' | 'internalFactCheckNotes'>;

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

  // Ensure teacher-only fields presence and types
  if (!('teacherPreparation' in value) || typeof value.teacherPreparation !== 'string') errors.push('teacherPreparation must be present as a string');
  if (!('teacherAnswerKey' in value) || typeof value.teacherAnswerKey !== 'object') errors.push('teacherAnswerKey must be present as an object');

  return { ok: errors.length === 0, errors };
}
