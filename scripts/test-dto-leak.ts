import { createFamilyPremiumProjection, serializeForFamily } from "../src/lib/curriculum-schema";

console.log("Running Nested Answer & Internal Metadata DTO Leak Test via tsx...");

// Sensitive sentinels that MUST NOT leak into DTOs
const SENTINEL_PREP = "SECRET_PREP_NOTES_DO_NOT_LEAK";
const SENTINEL_KEY = "SECRET_TEACHER_KEY_DO_NOT_LEAK";
const SENTINEL_MC_CORRECT = "SECRET_CORRECT_ANSWER_MC";
const SENTINEL_MC_OPT_ID = "SECRET_CORRECT_OPTION_ID";
const SENTINEL_MC_EXPL = "SECRET_EXPLANATION_MC";
const SENTINEL_TF_CORRECT = "SECRET_CORRECT_ANSWER_TF";
const SENTINEL_SA_KEYWORD = "SECRET_SA_KEYWORD";
const SENTINEL_SCENARIO_RES = "SECRET_SCENARIO_EXPECTED_RESOLUTION";
const SENTINEL_KC_CORRECT = "SECRET_KNOWLEDGE_CHECK_ANSWER";
const SENTINEL_SOURCE_NOTES = "SECRET_SOURCE_NOTES_DO_NOT_LEAK";
const SENTINEL_MEDIA_ATTR = "SECRET_MEDIA_ATTR_DO_NOT_LEAK";
const SENTINEL_FACTUAL_SOURCES = "SECRET_FACTUAL_SOURCES_DO_NOT_LEAK";
const SENTINEL_AUTH_SOURCES = "SECRET_AUTH_SOURCES_DO_NOT_LEAK";
const SENTINEL_TEACHER_RESOURCE = "SECRET_TEACHER_RESOURCE_DO_NOT_LEAK";

const syntheticLesson: any = {
  id: "lesson-test-dto-leak",
  date: "2026-07-01",
  title: "Test DTO Leak Security",
  topic: "Security Testing",
  ageRange: "5-10",
  unit: "Unit 1",
  essentialQuestion: "How do we protect learner DTOs?",
  adventureHook: "Security exploration",
  discoveries: ["Discovery 1"],
  richExplanation: "Explanation text",
  keyFacts: ["Fact 1"],
  realWorldConnection: "Connection text",
  vocabulary: [{ word: "Lihim", pronunciation: "LEE-heem", meaning: "Secret", context: "Context" }],
  guidedDiscussion: [{ question: "Discussion question?", followUp: "Follow-up" }],
  characterConnection: { virtue: "Katapatan (Honesty)", story: "Story" },
  misconceptions: [{ misconception: "Fake idea", reality: "Real fact" }],
  familyChallenge: "Review together",
  
  // Sensitive assessments with sentinels
  knowledgeCheck: [
    {
      question: "KC Question 1?",
      options: ["Opt 1", "Opt 2"],
      correctAnswer: SENTINEL_KC_CORRECT
    }
  ],
  premiumAssessment: [
    {
      id: "q1",
      type: "multiple-choice",
      question: "MC Question 1?",
      options: ["Opt A", "Opt B"],
      correctAnswer: SENTINEL_MC_CORRECT,
      correctOptionId: SENTINEL_MC_OPT_ID,
      explanation: SENTINEL_MC_EXPL
    },
    {
      id: "q2",
      type: "true-false-with-explanation",
      question: "TF Question 2?",
      options: ["True", "False"],
      correctAnswer: SENTINEL_TF_CORRECT,
      explanation: SENTINEL_MC_EXPL
    },
    {
      id: "q3",
      type: "short-answer",
      question: "SA Question 3?",
      expectedAnswerKeywords: [SENTINEL_SA_KEYWORD]
    },
    {
      id: "q4",
      type: "matching",
      question: "Match items:",
      pairs: [
        { left: "Left Item 1", right: "Right Item 1" },
        { left: "Left Item 2", right: "Right Item 2" },
        { left: "Left Item 3", right: "Right Item 3" }
      ]
    },
    {
      id: "q5",
      type: "sequencing",
      question: "Sequence items:",
      correctOrder: ["Step A", "Step B", "Step C", "Step D"]
    },
    {
      id: "q6",
      type: "scenario-application",
      scenario: "Scenario text",
      question: "Scenario question?",
      expectedResolution: SENTINEL_SCENARIO_RES
    }
  ],

  // Sensitive teacher-only root fields
  teacherPreparation: SENTINEL_PREP,
  teacherAnswerKey: { q1: SENTINEL_KEY },
  privateTeacherNotes: SENTINEL_PREP,
  internalFactCheckNotes: SENTINEL_PREP,
  sourceNotes: [SENTINEL_SOURCE_NOTES],
  mediaAttributionNotes: [SENTINEL_MEDIA_ATTR],
  factualSources: [{ title: "Factual 1", note: SENTINEL_FACTUAL_SOURCES }],
  authoritativeSources: [{ title: "Auth 1", note: SENTINEL_AUTH_SOURCES }],
  teacherResources: [{ title: "Res 1", note: SENTINEL_TEACHER_RESOURCE }],
};

const familyProjection = createFamilyPremiumProjection(syntheticLesson);
const familySerialized = serializeForFamily(syntheticLesson);

const sentinels = [
  SENTINEL_PREP,
  SENTINEL_KEY,
  SENTINEL_MC_CORRECT,
  SENTINEL_MC_OPT_ID,
  SENTINEL_MC_EXPL,
  SENTINEL_TF_CORRECT,
  SENTINEL_SA_KEYWORD,
  SENTINEL_SCENARIO_RES,
  SENTINEL_KC_CORRECT,
  SENTINEL_SOURCE_NOTES,
  SENTINEL_MEDIA_ATTR,
  SENTINEL_FACTUAL_SOURCES,
  SENTINEL_AUTH_SOURCES,
  SENTINEL_TEACHER_RESOURCE
];

const forbiddenKeys = [
  "correctAnswer",
  "correctOptionId",
  "expectedResolution",
  "correctOrder",
  "expectedAnswerKeywords",
  "teacherPreparation",
  "teacherAnswerKey",
  "privateTeacherNotes",
  "internalFactCheckNotes",
  "sourceNotes",
  "mediaAttributionNotes",
  "factualSources",
  "authoritativeSources"
];

function checkSentinels(name: string, obj: any) {
  const jsonStr = JSON.stringify(obj);
  for (const s of sentinels) {
    if (jsonStr.includes(s)) {
      console.error(`FAIL [${name}]: Leaked sentinel "${s}" into payload!`);
      process.exit(1);
    }
  }
}

function checkForbiddenKeys(name: string, obj: any, path = "") {
  if (!obj || typeof obj !== "object") return;
  for (const key of Object.keys(obj)) {
    const currentPath = path ? `${path}.${key}` : key;
    if (forbiddenKeys.includes(key)) {
      console.error(`FAIL [${name}]: Forbidden key "${key}" found at ${currentPath}!`);
      process.exit(1);
    }
    checkForbiddenKeys(name, obj[key], currentPath);
  }
}

checkSentinels("createFamilyPremiumProjection", familyProjection);
checkForbiddenKeys("createFamilyPremiumProjection", familyProjection);

checkSentinels("serializeForFamily", familySerialized);
checkForbiddenKeys("serializeForFamily", familySerialized);

// Validate Matching DTO safety
const matchingFamily = familyProjection.premiumAssessment?.find(a => a.type === "matching");
if (!matchingFamily || !matchingFamily.leftItems || !matchingFamily.rightItems) {
  console.error("FAIL: Matching DTO missing leftItems or rightItems");
  process.exit(1);
}
if ("pairs" in matchingFamily) {
  console.error("FAIL: Matching DTO leaked solved 'pairs' array");
  process.exit(1);
}

// Validate Sequencing DTO safety
const seqFamily = familyProjection.premiumAssessment?.find(a => a.type === "sequencing");
if (!seqFamily || !seqFamily.items) {
  console.error("FAIL: Sequencing DTO missing items");
  process.exit(1);
}
if ("correctOrder" in seqFamily) {
  console.error("FAIL: Sequencing DTO leaked 'correctOrder'");
  process.exit(1);
}
const origSeq = syntheticLesson.premiumAssessment.find((a: any) => a.type === "sequencing").correctOrder;
if (seqFamily.items.every((v: any, i: number) => v === origSeq[i])) {
  console.error("FAIL: Sequencing items in DTO must not be in exact correctOrder");
  process.exit(1);
}

// Validate Scenario DTO safety
const scenFamily = familyProjection.premiumAssessment?.find(a => a.type === "scenario-application");
if (!scenFamily || !scenFamily.scenario || !scenFamily.question) {
  console.error("FAIL: Scenario DTO missing scenario or question");
  process.exit(1);
}
if ("expectedResolution" in scenFamily) {
  console.error("FAIL: Scenario DTO leaked 'expectedResolution'");
  process.exit(1);
}

console.log("PASS: Nested Answer & Internal Metadata Leak Test succeeded! All sentinels, forbidden scoring keys, and internal notes strictly stripped.");
process.exit(0);
