const { createFamilyPremiumProjection } = require("../dist-temp/curriculum-schema.js");

const dummyLesson = {
  id: "test-lesson",
  date: "2026-08-01",
  title: "Test Lesson",
  topic: "Testing",
  ageRange: "7-12",
  unit: "Test Unit",
  essentialQuestion: "Is this safe?",
  learningObjectives: ["Test obj"],
  factualBackground: "Fact",
  vocabulary: [],
  subjectConnections: {},
  materials: [],
  factualMediaRequirements: [],
  activities: { beginnerSupport: "a", coreActivity: "b", advancedChallenge: "c" },
  interactiveGame: "Game",
  handsOnActivity: "Activity",
  knowledgeCheck: [],
  learnerReflection: "Reflect",
  familyChallenge: "Challenge",
  progressBadge: "Badge",
  sourceNotes: "Source Note",
  mediaAttributionNotes: "Attribution",
  accessibilityNotes: "Accessibility",
  privacyClassification: "family-safe",
  publicationStatus: "pilot",
  weekday: "Monday",
  
  // Teacher only fields
  teacherPreparation: "SECRET_TEACHER_PREP",
  teacherAnswerKey: { q1: "SECRET_ANSWER_KEY" },
  privateTeacherNotes: "SECRET_PRIVATE_NOTE",
  internalFactCheckNotes: "SECRET_FACTCHECK",
  factualSources: [{ source: "Test", url: "http", note: "SECRET_SOURCE_NOTE" }]
};

const result = createFamilyPremiumProjection(dummyLesson);
const jsonStr = JSON.stringify(result);

const sentinels = [
  "SECRET_TEACHER_PREP",
  "SECRET_ANSWER_KEY",
  "SECRET_PRIVATE_NOTE",
  "SECRET_FACTCHECK",
  "SECRET_SOURCE_NOTE"
];

let failed = false;

sentinels.forEach(s => {
  if (jsonStr.includes(s)) {
    console.error(`FAIL: Sentinel ${s} leaked into Family payload!`);
    failed = true;
  }
});

const privateKeys = [
  "teacherPreparation",
  "teacherAnswerKey",
  "privateTeacherNotes",
  "internalFactCheckNotes",
  "sourceNotes",
  "factualSources"
];

const resultKeys = Object.keys(result);
privateKeys.forEach(k => {
  if (resultKeys.includes(k)) {
    console.error(`FAIL: Private key ${k} found in Family payload!`);
    failed = true;
  }
});

if (failed) {
  process.exit(1);
} else {
  console.log("PASS: No teacher data leaked into Family Premium payload.");
  process.exit(0);
}

