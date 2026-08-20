const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

console.log("Compiling curriculum schema for DTO leak test...");

const tempTsconfig = {
  compilerOptions: {
    target: "ES2022",
    module: "commonjs",
    moduleResolution: "node",
    esModuleInterop: true,
    baseUrl: ".",
    paths: {
      "@/*": ["src/*"]
    },
    outDir: "temp-dto-test",
    noEmit: false,
    skipLibCheck: true
  },
  include: ["src/lib/curriculum-schema.ts", "src/lib/assessment-state.ts"]
};

const tempConfigPath = path.join(__dirname, "../temp-dto-tsconfig.json");
fs.writeFileSync(tempConfigPath, JSON.stringify(tempTsconfig, null, 2), "utf8");

try {
  execSync(`npx tsc --project temp-dto-tsconfig.json`, { stdio: "pipe" });
} catch (e) {
  console.error("Compilation error in test-dto-leak:", e.stdout ? e.stdout.toString() : e);
  if (fs.existsSync(tempConfigPath)) fs.unlinkSync(tempConfigPath);
  process.exit(1);
}

if (fs.existsSync(tempConfigPath)) fs.unlinkSync(tempConfigPath);

const schemaPath1 = path.join(__dirname, "../temp-dto-test/curriculum-schema.js");
const schemaPath2 = path.join(__dirname, "../temp-dto-test/lib/curriculum-schema.js");
const schemaModule = fs.existsSync(schemaPath1) ? require(schemaPath1) : require(schemaPath2);

const { createFamilyPremiumProjection, serializeForFamily } = schemaModule;

// Synthetic lesson with sentinels in every sensitive / scoring position
const SENTINEL_PREP = "SECRET_PREP_NOTES_DO_NOT_LEAK";
const SENTINEL_KEY = "SECRET_TEACHER_KEY_DO_NOT_LEAK";
const SENTINEL_MC_CORRECT = "SECRET_CORRECT_ANSWER_MC";
const SENTINEL_MC_OPT_ID = "SECRET_CORRECT_OPTION_ID";
const SENTINEL_MC_EXPL = "SECRET_EXPLANATION_MC";
const SENTINEL_TF_CORRECT = "SECRET_CORRECT_ANSWER_TF";
const SENTINEL_SA_KEYWORD = "SECRET_SA_KEYWORD";
const SENTINEL_MATCH_RIGHT = "SECRET_MATCH_RIGHT_SOLVED";
const SENTINEL_SEQ_ORDER = "SECRET_SEQUENCE_EXACT_ORDER";
const SENTINEL_SCENARIO_RES = "SECRET_SCENARIO_EXPECTED_RESOLUTION";
const SENTINEL_KC_CORRECT = "SECRET_KNOWLEDGE_CHECK_ANSWER";
const SENTINEL_SOURCE_NOTES = "SECRET_SOURCE_NOTES_DO_NOT_LEAK";
const SENTINEL_MEDIA_ATTR = "SECRET_MEDIA_ATTR_DO_NOT_LEAK";
const SENTINEL_FACTUAL_SOURCES = "SECRET_FACTUAL_SOURCES_DO_NOT_LEAK";
const SENTINEL_AUTH_SOURCES = "SECRET_AUTH_SOURCES_DO_NOT_LEAK";
const SENTINEL_TEACHER_RESOURCE = "SECRET_TEACHER_RESOURCE_DO_NOT_LEAK";

const syntheticLesson = {
  id: "test-lesson-sentinel",
  date: "2026-08-03",
  weekday: "Monday",
  title: "Test Lesson",
  topic: "Geography",
  ageRange: "7-12",
  unit: "Unit 1",
  learningObjectives: ["Objective 1"],
  essentialQuestion: "Where are we?",
  factualBackground: "Background",
  adventureHook: "Hook",
  discoveries: [{ title: "D1", description: "Desc 1" }],
  richExplanation: [{ heading: "H1", body: "Body 1" }],
  keyFacts: ["Fact 1"],
  vocabulary: [{ word: "Word", translation: "Salita" }],
  mediaMoments: [{ description: "MM", purpose: "P", requiredType: "Video", sourceRequirement: "S" }],
  guidedDiscussion: ["Discussion 1"],
  ageDifferentiation: { explorer: "Exp", adventure: "Adv", trailblazer: "TB" },
  game: { title: "G", objective: "O", materials: ["M"], setup: "S", rules: "R", winCondition: "W" },
  handsOnTask: { title: "HOT", materials: ["M"], steps: ["S1"] },
  suggestedPacing: { hook: 5, teaching: 20, discussionVocabulary: 10, handsOnOrGame: 15, assessment: 5, reflectionClosing: 5, total: 60 },
  learnerReflection: "Reflection",
  familyChallenge: "Challenge",
  materials: ["Mat"],
  factualMediaRequirements: ["req-1"],
  activities: { beginnerSupport: "B", coreActivity: "C", advancedChallenge: "A" },
  interactiveGame: "IG",
  handsOnActivity: "HA",
  privacyClassification: "family-safe",
  publicationStatus: "pilot",
  progressBadge: "Badge",
  accessibilityNotes: "Access",

  // Internal verification and teacher metadata (must not leak)
  sourceNotes: SENTINEL_SOURCE_NOTES,
  mediaAttributionNotes: SENTINEL_MEDIA_ATTR,
  factualSources: [{ source: SENTINEL_FACTUAL_SOURCES, url: "https://example.com" }],
  authoritativeSources: [
    {
      source: SENTINEL_AUTH_SOURCES,
      exactUrl: "https://example.com/notes",
      publisher: "Internal Publisher",
      claimSupported: "Internal Claim",
      verifiedDate: "2026-08-18"
    }
  ],
  curatedResources: [
    {
      id: "res-family",
      title: "Family Resource",
      url: "https://family.example.com",
      type: "Interactive",
      visibility: "family",
      whyUseful: "Great for families",
      verificationStatus: "verified",
      provider: "Provider"
    },
    {
      id: "res-teacher",
      title: "Teacher Only Resource",
      url: "https://teacher.example.com",
      type: "Guide",
      visibility: "teacher",
      whyUseful: SENTINEL_TEACHER_RESOURCE,
      verificationStatus: "verified",
      provider: "Teacher Provider"
    }
  ],

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
        { left: "Left Item 3", right: SENTINEL_MATCH_RIGHT }
      ]
    },
    {
      id: "q5",
      type: "sequencing",
      question: "Sequence items:",
      correctOrder: ["Step A", "Step B", "Step C", SENTINEL_SEQ_ORDER]
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
  internalFactCheckNotes: SENTINEL_PREP
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

function checkSentinels(name, obj) {
  const jsonStr = JSON.stringify(obj);
  for (const s of sentinels) {
    if (jsonStr.includes(s)) {
      console.error(`FAIL [${name}]: Leaked sentinel "${s}" into payload!`);
      process.exit(1);
    }
  }
}

function checkForbiddenKeys(name, obj, path = "") {
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
const matchingFamily = familyProjection.premiumAssessment.find(a => a.type === "matching");
if (!matchingFamily || !matchingFamily.leftItems || !matchingFamily.rightItems) {
  console.error("FAIL: Matching DTO missing leftItems or rightItems");
  process.exit(1);
}
if ("pairs" in matchingFamily) {
  console.error("FAIL: Matching DTO leaked solved 'pairs' array");
  process.exit(1);
}

// Validate Sequencing DTO safety
const seqFamily = familyProjection.premiumAssessment.find(a => a.type === "sequencing");
if (!seqFamily || !seqFamily.items) {
  console.error("FAIL: Sequencing DTO missing items");
  process.exit(1);
}
if ("correctOrder" in seqFamily) {
  console.error("FAIL: Sequencing DTO leaked 'correctOrder'");
  process.exit(1);
}
const origSeq = syntheticLesson.premiumAssessment.find(a => a.type === "sequencing").correctOrder;
if (seqFamily.items.every((v, i) => v === origSeq[i])) {
  console.error("FAIL: Sequencing items in DTO must not be in exact correctOrder");
  process.exit(1);
}

// Validate Scenario DTO safety
const scenFamily = familyProjection.premiumAssessment.find(a => a.type === "scenario-application");
if (!scenFamily || !scenFamily.scenario || !scenFamily.question) {
  console.error("FAIL: Scenario DTO missing scenario or question");
  process.exit(1);
}
if ("expectedResolution" in scenFamily) {
  console.error("FAIL: Scenario DTO leaked 'expectedResolution'");
  process.exit(1);
}

// Clean temp directory
fs.rmSync(path.join(__dirname, "../temp-dto-test"), { recursive: true, force: true });

console.log("PASS: Nested Answer & Internal Metadata Leak Test succeeded! All sentinels, forbidden scoring keys, and internal notes strictly stripped.");
process.exit(0);
