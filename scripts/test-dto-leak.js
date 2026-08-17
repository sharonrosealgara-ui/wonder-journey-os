
const fs = require("fs");
const { execSync } = require("child_process");
const path = require("path");

const tempDir = path.join(__dirname, "../temp-test-dto");

try {
  console.log("Compiling curriculum schema for test...");
  execSync(`npx tsc src/lib/curriculum-schema.ts --outDir temp-test-dto --esModuleInterop`);
} catch (err) {
  console.error("Compilation failed", err.stdout ? err.stdout.toString() : err);
  process.exit(1);
}

const { createFamilyPremiumProjection } = require("../temp-test-dto/curriculum-schema.js");

const mockLesson = {
  id: "test-id",
  date: "2026-08-01",
  title: "Test Lesson",
  topic: "Testing",
  teacherPreparation: "SECRET_TEACHER_PREP",
  teacherAnswerKey: { "Q1": "SECRET" },
  privateTeacherNotes: "SECRET_NOTES",
  futureInternalSecret: "SECRET_FUTURE_FIELD",
  richExplanation: []
};

const FAMILY_ALLOWED_KEYS = new Set([
  "id", "date", "title", "topic", "ageRange", "unit", "essentialQuestion",
  "adventureHook", "discoveries", "richExplanation", "keyFacts", "realWorldConnection",
  "vocabulary", "mediaMoments", "guidedDiscussion", "ageDifferentiation",
  "game", "handsOnTask", "crossSubjectConnections", "characterConnection",
  "misconceptions", "premiumAssessment", "knowledgeCheck", "learnerReflection", "familyChallenge",
  "curatedResources", "optionalExtensions", "suggestedPacing",
  "accessibilityNotes", "materials", "interactiveGame", "handsOnActivity"
]);

const dto = createFamilyPremiumProjection(mockLesson);

let failed = false;

// Check for leaks
if (dto.futureInternalSecret === "SECRET_FUTURE_FIELD") {
  console.error("FAIL: futureInternalSecret leaked!");
  failed = true;
}
if (dto.teacherPreparation) {
  console.error("FAIL: teacherPreparation leaked!");
  failed = true;
}
if (dto.teacherAnswerKey) {
  console.error("FAIL: teacherAnswerKey leaked!");
  failed = true;
}

// Check all returned keys
for (const key of Object.keys(dto)) {
  if (!FAMILY_ALLOWED_KEYS.has(key)) {
    console.error(`FAIL: Unknown key found in DTO: ${key}`);
    failed = true;
  }
}

// Cleanup
fs.rmSync(tempDir, { recursive: true, force: true });

if (failed) {
  process.exit(1);
} else {
  console.log("PASS: No teacher data leaked into Family Premium payload. Literal allowlist enforced.");
}

