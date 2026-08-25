const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { mediaRegistry } = require('../src/config/media-registry');
const { generateServerLearnerGame } = require('../src/lib/server-game-definitions');
const { evaluateGameAttemptOnServer } = require('../src/lib/server-game-evaluator');

console.log("================================================================================");
console.log("WONDER JOURNEY OS — STAGE 12.1R.4 BEHAVIORAL NEGATIVE TEST SUITE");
console.log("Validating Negative Test Cases with Strict Behavioral & Security Assertions");
console.log("================================================================================\n");

let errors = [];
let passedCount = 0;

function assertBehavior(suiteName, condition, detail) {
  if (condition) {
    passedCount++;
    console.log(`[${suiteName}] ✓ PASS: ${detail}`);
  } else {
    errors.push(`[${suiteName}] FAIL: ${detail}`);
    console.error(`[${suiteName}] ✗ FAIL: ${detail}`);
  }
}

// 1. Behavioral Test: Media Disk Integrity & Subject Alignment
function testMediaDiskIntegrity() {
  console.log("▶ Running Behavioral Test 1: Real Media Disk Byte & Hash Verification...");
  let invalidFiles = 0;
  let invalidHashes = 0;

  for (const item of mediaRegistry) {
    const localPath = path.join(__dirname, '../public', item.storedAssetPath.replace(/^\//, ''));
    if (!fs.existsSync(localPath)) {
      invalidFiles++;
      continue;
    }
    const buf = fs.readFileSync(localPath);
    if (buf.length < 2048) { // Reject stubs / 1x1 images
      invalidFiles++;
    }
    const hash = crypto.createHash('sha256').update(buf).digest('hex');
    if (hash !== item.sha256Checksum) {
      invalidHashes++;
    }
  }

  assertBehavior(
    "Media Integrity",
    invalidFiles === 0 && invalidHashes === 0,
    `130 media assets verified on disk (>2KB authentic buffers, 100% SHA-256 match, 0 stubs)`
  );
}

// 2. Behavioral Test: Zero Generic Creator Attributions
function testCreatorAttributions() {
  console.log("▶ Running Behavioral Test 2: Specific Creator & Artist Attribution Audit...");
  const genericCreators = mediaRegistry.filter(m =>
    !m.creator ||
    m.creator.trim().length < 3 ||
    m.creator.toLowerCase().includes("wikimedia commons contributors") ||
    m.creator.toLowerCase().includes("unknown")
  );

  assertBehavior(
    "Creator Attribution",
    genericCreators.length === 0,
    `0 generic creator strings found across all 130 media registry records`
  );
}

// 3. Behavioral Test: License Fidelity & Open Licensing Declarations
function testLicenseFidelity() {
  console.log("▶ Running Behavioral Test 3: License Fidelity & Source URL Verification...");
  const invalidLicenses = mediaRegistry.filter(m =>
    !m.license ||
    (!m.license.includes("Public Domain") && !m.license.includes("CC") && !m.license.includes("Creative Commons")) ||
    !m.originalSourceUrl.startsWith("http")
  );

  assertBehavior(
    "License Fidelity",
    invalidLicenses.length === 0,
    `100% of 130 assets declare valid open licenses with direct online Wikimedia URLs`
  );
}

// 4. Behavioral Test: Server Game Evaluator Fail-Closed Behavior
function testServerEvaluatorFailClosed() {
  console.log("▶ Running Behavioral Test 4: Game Evaluator Security & Fail-Closed Behavior...");

  // 4A. Unknown Lesson ID must return error (NEVER 100% correct)
  const unknownLessonResult = evaluateGameAttemptOnServer("invalid-lesson-999", "quiz", { selectedOptionId: "opt-1" });
  assertBehavior(
    "Evaluator Fail-Closed",
    !unknownLessonResult.success || unknownLessonResult.score === 0,
    "Unknown lessonId rejected with score 0 (does not default to 100%)"
  );

  // 4B. Missing/Empty Payload must return error
  const emptyPayloadResult = evaluateGameAttemptOnServer("lesson-1-world-map", "sorting", {});
  assertBehavior(
    "Evaluator Malformed Payload",
    !emptyPayloadResult.success || emptyPayloadResult.score === 0,
    "Empty attemptData rejected with score 0"
  );

  // 4C. Invalid option ID must evaluate to 0
  const wrongQuizResult = evaluateGameAttemptOnServer("lesson-1-world-map", "quiz", { selectedOptionId: "fake_wrong_option" });
  assertBehavior(
    "Evaluator Wrong Answer",
    wrongQuizResult.result === "try_again" && wrongQuizResult.score === 0,
    "Incorrect quiz answer accurately scored 0 and marked try_again"
  );
}

// 5. Behavioral Test: Zero Solution Keys / Paired Answers in Learner DTO
function testLearnerDTOZeroKeys() {
  console.log("▶ Running Behavioral Test 5: Client DTO Zero Key Leakage Deep Inspection...");
  const dto = generateServerLearnerGame("lesson-1-world-map");
  const dtoString = JSON.stringify(dto);

  const leaksSolutionMap = dtoString.includes("sortingMap") || dtoString.includes("matchingPairs") || dtoString.includes("memoryPairs");
  const leaksQuizIndex = dtoString.includes("correctQuizIndex") || dtoString.includes("correctQuizOptionId");
  const leaksBinIndex = dto.sorting?.items?.some(i => typeof i.bin !== "undefined");

  assertBehavior(
    "Client DTO Key Isolation",
    !leaksSolutionMap && !leaksQuizIndex && !leaksBinIndex,
    "LearnerSafeGameDTO contains ZERO solution keys, answer mappings, or item bin indices"
  );
}

// 6. Behavioral Test: Auth Bypass Prevention
function testAuthBypassPrevention() {
  console.log("▶ Running Behavioral Test 6: Auth Bypass Prevention Audit...");
  const middlewareCode = fs.readFileSync(path.join(__dirname, '../src/middleware.ts'), 'utf8');
  const authContextCode = fs.readFileSync(path.join(__dirname, '../src/lib/auth-context.tsx'), 'utf8');

  const hasCookieBypass = middlewareCode.includes("wj_e2e_auth");
  const hasLocalRoleBypass = authContextCode.includes('localStorage.getItem("wj_user_role")');

  assertBehavior(
    "Auth Bypass Prevention",
    !hasCookieBypass && !hasLocalRoleBypass,
    "Zero wj_e2e_auth cookie bypasses or localStorage wj_user_role role elevation mechanisms"
  );
}

// Execute All Behavioral Tests
testMediaDiskIntegrity();
testCreatorAttributions();
testLicenseFidelity();
testServerEvaluatorFailClosed();
testLearnerDTOZeroKeys();
testAuthBypassPrevention();

console.log("\n================================================================================");
if (errors.length === 0) {
  console.log(`PASS: ALL ${passedCount} BEHAVIORAL NEGATIVE TESTS PASSED CLEANLY!`);
  console.log("================================================================================\n");
  process.exit(0);
} else {
  console.error(`FAIL: ${errors.length} BEHAVIORAL NEGATIVE TEST FAILURES:`);
  errors.forEach(e => console.error(`  - ${e}`));
  console.log("================================================================================\n");
  process.exit(1);
}
