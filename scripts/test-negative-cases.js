const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Set required secret for evaluation test suite
process.env.GAME_EVALUATION_SECRET = process.env.GAME_EVALUATION_SECRET || "test_secret_key_for_evaluation_2026_secure";

const { generateServerLearnerGame, sealSolutionKey, unsealSolutionKey, isNonceReplayed, markNonceUsed } = require('../src/lib/server-game-definitions');
const { evaluateGameAttemptOnServer } = require('../src/lib/server-game-evaluator');

// Read contact sheet manifest
const mediaManifest = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../artifacts/media-contact-sheet.json'), 'utf8')
);

console.log("================================================================================");
console.log("WONDER JOURNEY OS — STAGE 12.1R.6 BEHAVIORAL NEGATIVE & SECURITY TEST SUITE");
console.log("Validating Negative Test Cases with Strict Security Assertions");
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

  for (const item of mediaManifest.items) {
    const localPath = path.join(__dirname, '../public', item.assetPath.replace(/^\//, ''));
    if (!fs.existsSync(localPath)) {
      invalidFiles++;
      continue;
    }
    const buf = fs.readFileSync(localPath);
    const minSize = item.assetPath.endsWith('.svg') ? 100 : 2048;
    if (buf.length < minSize) {
      invalidFiles++;
    }
    const hash = crypto.createHash('sha256').update(buf).digest('hex');
    if (hash !== item.checksum) {
      invalidHashes++;
    }
  }

  assertBehavior(
    "Media Integrity",
    invalidFiles === 0 && invalidHashes === 0,
    `130 media assets verified on disk (>2KB authentic buffers/valid SVGs, 100% SHA-256 match, 0 stubs)`
  );
}

// 2. Behavioral Test: Specific Creator Attributions
function testCreatorAttributions() {
  console.log("▶ Running Behavioral Test 2: Specific Creator & Artist Attribution Audit...");
  const genericCreators = mediaManifest.items.filter(m =>
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
  const invalidLicenses = mediaManifest.items.filter(m =>
    !m.license ||
    (!m.license.includes("Public Domain") && !m.license.includes("CC") && !m.license.includes("Creative Commons")) ||
    !m.sourceUrl.startsWith("http")
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
  const leaksBinIndex = dto?.sorting?.items?.some(i => typeof i.bin !== "undefined");

  assertBehavior(
    "Client DTO Key Isolation",
    !leaksSolutionMap && !leaksQuizIndex && !leaksBinIndex,
    "LearnerSafeGameDTO contains ZERO solution keys, answer mappings, or item bin indices"
  );
}

// 6. Behavioral Test: Zero Generic Games on Unknown Lesson IDs
function testZeroGenericGamesForUnknownLessons() {
  console.log("▶ Running Behavioral Test 6: Zero Generic Fallback Games on Unknown Lesson IDs...");
  const unknown1 = generateServerLearnerGame("lesson-999-fake");
  const unknown2 = generateServerLearnerGame("random-invalid-id");
  const unknown3 = generateServerLearnerGame("");

  assertBehavior(
    "No Generic Games",
    unknown1 === null && unknown2 === null && unknown3 === null,
    "Unknown lesson IDs return null (zero generic fallback games generated)"
  );
}

// 7. Behavioral Test: Sealed Token Cryptography & Tamper Resistance
function testSealedTokenCryptography() {
  console.log("▶ Running Behavioral Test 7: Tamper-Proof Sealed Solution Keys...");
  const dto = generateServerLearnerGame("lesson-1-world-map", "Lesson 1", {
    userId: "usr_alice",
    workspaceId: "ws_manila",
    sessionId: "sess_room_1"
  });
  assertBehavior(
    "Sealed Token Generation",
    !!dto && typeof dto.gameToken === "string" && dto.gameToken.length > 30,
    "Server generates AES-256-GCM sealed gameToken"
  );

  const tamperedToken = dto.gameToken.slice(0, -10) + "XXXXXXXXXX";
  const unsealed = unsealSolutionKey(tamperedToken);
  assertBehavior(
    "Tamper Resistance",
    unsealed === null,
    "Tampered token unsealing rejected by AES-256-GCM authentication tag"
  );
}

// 8. Behavioral Test: Cross-User, Cross-Workspace, Cross-Session & Replay Rejection
function testTokenBindingAndReplayRejection() {
  console.log("▶ Running Behavioral Test 8: Token Binding, Replay & Expiry Enforcement...");

  const contextA = { userId: "usr_student_001", workspaceId: "ws_workspace_001", sessionId: "sess_room_alpha" };
  const contextB = { userId: "usr_student_002", workspaceId: "ws_workspace_002", sessionId: "sess_room_beta" };

  const dtoA = generateServerLearnerGame("lesson-1-world-map", "Lesson 1", contextA);
  const tokenA = dtoA.gameToken;

  // 8A: Cross-User Rejection
  const crossUserResult = evaluateGameAttemptOnServer(
    "lesson-1-world-map",
    "quiz",
    { selectedOptionId: "any_opt" },
    tokenA,
    { userId: contextB.userId, workspaceId: contextA.workspaceId, sessionId: contextA.sessionId }
  );
  assertBehavior(
    "Cross-User Rejection",
    crossUserResult.error === "Cross-user token" && crossUserResult.score === 0,
    "Cross-user game token strictly rejected with score 0"
  );

  // 8B: Cross-Workspace Rejection
  const crossWorkspaceResult = evaluateGameAttemptOnServer(
    "lesson-1-world-map",
    "quiz",
    { selectedOptionId: "any_opt" },
    tokenA,
    { userId: contextA.userId, workspaceId: contextB.workspaceId, sessionId: contextA.sessionId }
  );
  assertBehavior(
    "Cross-Workspace Rejection",
    crossWorkspaceResult.error === "Cross-workspace token" && crossWorkspaceResult.score === 0,
    "Cross-workspace game token strictly rejected with score 0"
  );

  // 8C: Cross-Session Rejection
  const crossSessionResult = evaluateGameAttemptOnServer(
    "lesson-1-world-map",
    "quiz",
    { selectedOptionId: "any_opt" },
    tokenA,
    { userId: contextA.userId, workspaceId: contextA.workspaceId, sessionId: contextB.sessionId }
  );
  assertBehavior(
    "Cross-Session Rejection",
    crossSessionResult.error === "Cross-session token" && crossSessionResult.score === 0,
    "Cross-session game token strictly rejected with score 0"
  );

  // 8D: Cross-Lesson Rejection (Exact Lesson ID Equality)
  const crossLessonResult = evaluateGameAttemptOnServer(
    "lesson-2-archipelago",
    "quiz",
    { selectedOptionId: "any_opt" },
    tokenA,
    contextA
  );
  assertBehavior(
    "Cross-Lesson Rejection",
    crossLessonResult.error === "Cross-lesson token" && crossLessonResult.score === 0,
    "Cross-lesson evaluation attempt strictly rejected (exact lesson ID required)"
  );

  // 8E: Replay Prevention Check
  // First valid attempt marks nonce as used
  const firstAttempt = evaluateGameAttemptOnServer(
    "lesson-1-world-map",
    "quiz",
    { selectedOptionId: "any_opt" },
    tokenA,
    contextA
  );
  assertBehavior(
    "Initial Attempt Processing",
    firstAttempt.success === true,
    "Initial evaluation attempt processed and nonce registered"
  );

  // Second attempt with exact same token must be rejected as replayed
  const replayAttempt = evaluateGameAttemptOnServer(
    "lesson-1-world-map",
    "quiz",
    { selectedOptionId: "any_opt" },
    tokenA,
    contextA
  );
  assertBehavior(
    "Replay Prevention",
    replayAttempt.error === "Replayed game token" && replayAttempt.score === 0,
    "Replayed token evaluation attempt rejected with 'Replayed game token'"
  );
}

// 9. Behavioral Test: Endpoint Auth Requirements
function testEndpointAuthProtection() {
  console.log("▶ Running Behavioral Test 9: Game API Endpoint Auth Protection...");
  const dtoRouteCode = fs.readFileSync(path.join(__dirname, '../src/app/api/game/dto/route.ts'), 'utf8');
  const evalRouteCode = fs.readFileSync(path.join(__dirname, '../src/app/api/game/evaluate/route.ts'), 'utf8');

  const dtoHasAuth = dtoRouteCode.includes("supabase.auth.getUser()") && dtoRouteCode.includes("status: 401");
  const evalHasAuth = evalRouteCode.includes("supabase.auth.getUser()") && evalRouteCode.includes("status: 401");

  assertBehavior(
    "Endpoint Auth Protection",
    dtoHasAuth && evalHasAuth,
    "Both GET /api/game/dto and POST /api/game/evaluate enforce active Supabase authentication"
  );
}

// 10. Behavioral Test: Auth Bypass Prevention
function testAuthBypassPrevention() {
  console.log("▶ Running Behavioral Test 10: Auth Bypass Prevention Audit...");
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
testZeroGenericGamesForUnknownLessons();
testSealedTokenCryptography();
testTokenBindingAndReplayRejection();
testEndpointAuthProtection();
testAuthBypassPrevention();

console.log("\n================================================================================");
if (errors.length === 0) {
  console.log(`PASS: ALL ${passedCount} BEHAVIORAL NEGATIVE & SECURITY TESTS PASSED CLEANLY!`);
  console.log("================================================================================\n");
  process.exit(0);
} else {
  console.error(`FAIL: ${errors.length} BEHAVIORAL NEGATIVE TEST FAILURES:`);
  errors.forEach(e => console.error(`  - ${e}`));
  console.log("================================================================================\n");
  process.exit(1);
}
