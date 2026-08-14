
const fs = require("fs");
let schema = fs.readFileSync("src/lib/curriculum-schema.ts", "utf-8");

const premiumFields = `
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
    alternative?: string;
  };
  curatedResources?: { id: string; title: string; url: string; type: string }[];
  optionalExtensions?: string[];
  suggestedPacing?: Record<string, string>;
  crossSubjectConnections?: string[];
  characterConnection?: string;
  misconceptions?: string[];
`;

schema = schema.replace(
  "export type CurriculumLesson = {",
  "export type CurriculumLesson = {\n" + premiumFields
);

const familyProjection = `
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
`;

schema = schema.replace(
  "export type FamilyVisibleCurriculumLesson",
  familyProjection + "\nexport type FamilyVisibleCurriculumLesson"
);

fs.writeFileSync("src/lib/curriculum-schema.ts", schema);
console.log("Schema updated.");

