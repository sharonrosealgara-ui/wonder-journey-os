
const fs = require("fs");
let content = fs.readFileSync("src/lib/curriculum-schema.ts", "utf8");

// 1. Add PremiumAssessment
if (!content.includes("type PremiumAssessment =")) {
  content = content.replace(
    "export type FactualSource =",
    `export type PremiumAssessment = 
  | { type: 'multiple-choice'; question: string; options: string[]; correctAnswer: string }
  | { type: 'true-false-with-explanation'; question: string; correctAnswer: 'True' | 'False'; explanation: string }
  | { type: 'short-answer'; question: string; expectedAnswerKeywords: string[] }
  | { type: 'matching'; pairs: { left: string; right: string }[] }
  | { type: 'sequencing'; question: string; correctOrder: string[] }
  | { type: 'scenario-application'; scenario: string; question: string; expectedResolution: string };

export type FactualSource =`
  );
}

// 2. Add premiumAssessment to CurriculumLesson
if (!content.includes("premiumAssessment?: PremiumAssessment[];")) {
  content = content.replace(
    "misconceptions?: string[];",
    "misconceptions?: string[];\n  premiumAssessment?: PremiumAssessment[];"
  );
}

// 3. Rename alternative to accessibilityAlternative in handsOnTask
content = content.replace("alternative?: string;", "accessibilityAlternative?: string;");

// 4. Update curatedResources in CurriculumLesson
content = content.replace(
  "curatedResources?: { id: string; title: string; url: string; type: string }[];",
  `curatedResources?: { id: string; title: string; url: string; type: string; visibility: "teacher" | "family" | "both"; whyUseful: string; verificationStatus: "verified" | "unverified"; provider: string; }[];`
);

// 5. Update createFamilyPremiumProjection to use an explicit allowlist
const familyPremiumBlock = `export function createFamilyPremiumProjection(lesson: CurriculumLesson): FamilyPremiumLesson {
  return {
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
    premiumAssessment: lesson.premiumAssessment,
    knowledgeCheck: lesson.knowledgeCheck,
    learnerReflection: lesson.learnerReflection,
    familyChallenge: lesson.familyChallenge,
    curatedResources: lesson.curatedResources?.filter(r => r.visibility === "family" || r.visibility === "both"),
    optionalExtensions: lesson.optionalExtensions,
    suggestedPacing: lesson.suggestedPacing,
    accessibilityNotes: lesson.accessibilityNotes,
    materials: lesson.materials,
    interactiveGame: lesson.interactiveGame,
    handsOnActivity: lesson.handsOnActivity
  } satisfies FamilyPremiumLesson;
}`;

content = content.replace(/export function createFamilyPremiumProjection.*?return familySafe as FamilyPremiumLesson;\n\}/s, familyPremiumBlock);

// 6. Fix FamilyVisibleCurriculumLesson
const famVisType = `export type FamilyVisibleCurriculumLesson = Pick<CurriculumLesson,
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
>;`;

content = content.replace(/export type FamilyVisibleCurriculumLesson = Omit<CurriculumLesson,.*?internalFactCheckNotes'>;/s, famVisType);

// 7. Fix serializeForFamily
const serializeBlock = `export function serializeForFamily(lesson: CurriculumLesson): FamilyVisibleCurriculumLesson {
  return {
    id: lesson.id,
    date: lesson.date,
    weekday: lesson.weekday,
    title: lesson.title,
    topic: lesson.topic,
    ageRange: lesson.ageRange,
    unit: lesson.unit,
    learningObjectives: lesson.learningObjectives,
    essentialQuestion: lesson.essentialQuestion,
    factualBackground: lesson.factualBackground,
    vocabulary: lesson.vocabulary,
    subjectConnections: lesson.subjectConnections,
    materials: lesson.materials,
    factualMediaRequirements: lesson.factualMediaRequirements,
    mediaReferences: lesson.mediaReferences,
    activities: lesson.activities,
    interactiveGame: lesson.interactiveGame,
    handsOnActivity: lesson.handsOnActivity,
    knowledgeCheck: lesson.knowledgeCheck,
    learnerReflection: lesson.learnerReflection,
    gratitudePrompt: lesson.gratitudePrompt,
    prayerPrompt: lesson.prayerPrompt,
    familyChallenge: lesson.familyChallenge,
    progressBadge: lesson.progressBadge,
    privacyClassification: lesson.privacyClassification,
    publicationStatus: lesson.publicationStatus,
    adventureHook: lesson.adventureHook,
    discoveries: lesson.discoveries,
    richExplanation: lesson.richExplanation,
    keyFacts: lesson.keyFacts,
    realWorldConnection: lesson.realWorldConnection,
    mediaMoments: lesson.mediaMoments,
    guidedDiscussion: lesson.guidedDiscussion,
    ageDifferentiation: lesson.ageDifferentiation,
    game: lesson.game,
    handsOnTask: lesson.handsOnTask,
    curatedResources: lesson.curatedResources?.filter(r => r.visibility === "family" || r.visibility === "both"),
    optionalExtensions: lesson.optionalExtensions,
    suggestedPacing: lesson.suggestedPacing,
    crossSubjectConnections: lesson.crossSubjectConnections,
    characterConnection: lesson.characterConnection,
    misconceptions: lesson.misconceptions,
    premiumAssessment: lesson.premiumAssessment,
    accessibilityNotes: lesson.accessibilityNotes,
    sourceNotes: lesson.sourceNotes,
    mediaAttributionNotes: lesson.mediaAttributionNotes,
    factualSources: lesson.factualSources
  } satisfies FamilyVisibleCurriculumLesson;
}`;

content = content.replace(/export function serializeForFamily.*?return familyVisible as FamilyVisibleCurriculumLesson;\n\}/s, serializeBlock);

fs.writeFileSync("src/lib/curriculum-schema.ts", content);

