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
  id: string;
  date: string;
  weekday: string;
  title: string;
  unit: string;
  learningObjectives: string[];
  essentialQuestion: string;
  factualBackground: string;
  vocabulary: { word: string; translation: string; pronunciation?: string; mediaId?: string }[];
  subjectConnections: { geography?: string; christianCharacter?: string; english?: string };
  materials: string[];
  factualMediaRequirements: string[];
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
  
  // Teacher-only fields
  teacherPreparation: string;
  teacherAnswerKey: Record<string, string>;
  privateTeacherNotes?: string;
  internalFactCheckNotes?: string;
};

// Exclude teacher-only fields for Family serialization
export function serializeForFamily(lesson: CurriculumLesson) {
  const {
    teacherPreparation,
    teacherAnswerKey,
    privateTeacherNotes,
    internalFactCheckNotes,
    ...familyVisible
  } = lesson;
  return familyVisible;
}
