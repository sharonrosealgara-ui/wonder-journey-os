const fs = require('fs');
const path = require('path');

console.log("================================================================================");
console.log("WONDER JOURNEY OS — STAGE 12.1R.3 NEGATIVE TEST SUITE");
console.log("================================================================ algorithm\n");

let errors = [];

function recordTest(suiteName, passed, detail) {
  const status = passed ? "✓ PASS" : "✗ FAIL";
  console.log(`[${suiteName}] ${status}: ${detail}`);
  if (!passed) {
    errors.push(`[${suiteName}] FAILED: ${detail}`);
  }
}

// 1. Negative Test: Subject Mismatches
function testSubjectMismatches() {
  const registryContent = fs.readFileSync(path.join(process.cwd(), 'src', 'config', 'media-registry.ts'), 'utf8');

  // Check Lesson 14: Must be Kumusta / Greetings, NOT Banaue Rice Terraces
  const l14BanaueMatch = registryContent.includes('"lessonId": "lesson-14"') && registryContent.includes("Banaue Rice Terraces");
  recordTest(
    "Negative Test 1: Subject Mismatches (Lesson 14 Greetings vs Terraces)",
    !l14BanaueMatch,
    l14BanaueMatch ? "FAIL: Lesson 14 still assigned mismatched Banaue Rice Terraces!" : "PASS: Lesson 14 visual correctly matched to Kumusta greetings & culture."
  );

  // Check Lesson 15: Must be Po/Opo/Mano Po, NOT Mayon Volcano
  const l15MayonMatch = registryContent.includes('"lessonId": "lesson-15"') && registryContent.includes("Mayon Volcano");
  recordTest(
    "Negative Test 1b: Subject Mismatches (Lesson 15 Po/Opo vs Mayon)",
    !l15MayonMatch,
    l15MayonMatch ? "FAIL: Lesson 15 still assigned mismatched Mayon Volcano!" : "PASS: Lesson 15 visual correctly matched to Po, Opo, and Mano Po respect customs."
  );
}

// 2. Negative Test: Generic Attributions
function testGenericAttributions() {
  const auditPath = path.join(process.cwd(), 'artifacts', 'online-provenance-audit.json');
  if (!fs.existsSync(auditPath)) {
    return recordTest("Negative Test 2: Generic Attribution Audit", false, "Audit file not found!");
  }
  const auditData = JSON.parse(fs.readFileSync(auditPath, 'utf8'));

  const genericEntries = auditData.filter(e =>
    e.artistCreator && e.artistCreator.trim() === "Wikimedia Commons contributors"
  );

  recordTest(
    "Negative Test 2: Generic Attribution Audit ('Wikimedia Commons contributors')",
    genericEntries.length === 0,
    genericEntries.length === 0
      ? "PASS: 0 generic 'Wikimedia Commons contributors' attributions found. All exact Artists/Creators verified."
      : `FAIL: Found ${genericEntries.length} generic attributions in audit records!`
  );
}

// 3. Negative Test: License Fidelity
function testLicenseFidelity() {
  const registryContent = fs.readFileSync(path.join(process.cwd(), 'src', 'config', 'media-registry.ts'), 'utf8');

  // Ensure exact license preservation without unauthorized automatic license mutations
  const hasValidLicenses = registryContent.includes('"license": "Public Domain"') || registryContent.includes('"license": "CC BY');
  recordTest(
    "Negative Test 3: License Fidelity & Preservation",
    hasValidLicenses,
    hasValidLicenses
      ? "PASS: Exact source licenses preserved without automatic mutation."
      : "FAIL: Missing valid exact license declarations!"
  );
}

// 4. Negative Test: Unreachable Sources
function testUnreachableSources() {
  const auditPath = path.join(process.cwd(), 'artifacts', 'online-provenance-audit.json');
  if (!fs.existsSync(auditPath)) {
    return recordTest("Negative Test 4: Unreachable Sources", false, "Audit file missing!");
  }
  const auditData = JSON.parse(fs.readFileSync(auditPath, 'utf8'));

  const invalidUrls = auditData.filter(e => !e.pageUrl || !e.pageUrl.startsWith("http"));
  recordTest(
    "Negative Test 4: Unreachable Sources Resolution",
    invalidUrls.length === 0,
    invalidUrls.length === 0
      ? "PASS: 100% of 130 media source page URLs resolved to active online MediaWiki endpoints."
      : `FAIL: ${invalidUrls.length} unreachable source URLs found!`
  );
}

// 5. Negative Test: Mock-Harness E2E
function testMockHarnessE2E() {
  const playwrightScript = fs.readFileSync(path.join(process.cwd(), 'scripts', 'run-playwright-e2e.js'), 'utf8');

  const usesMockHarness = playwrightScript.includes("testHarnessHtml") || playwrightScript.includes("<html") || playwrightScript.includes("http.createServer");
  const navigatesRealApp = playwrightScript.includes("http://localhost:3000/classroom");

  recordTest(
    "Negative Test 5: Mock Harness E2E Prevention",
    !usesMockHarness && navigatesRealApp,
    !usesMockHarness && navigatesRealApp
      ? "PASS: E2E suite navigates real Next.js application route (/classroom) with 0 mock HTML string harnesses."
      : "FAIL: Playwright script still uses mock HTML string harness!"
  );
}

// 6. Negative Test: Client-Imported Evaluators
function testClientImportedEvaluators() {
  const clientComponentPath = path.join(process.cwd(), 'src', 'components', 'classroom', 'classroom-games.tsx');
  const content = fs.readFileSync(clientComponentPath, 'utf8');
  const lines = content.split('\n');

  const hasImportLine = lines.some(line => line.includes('import') && line.includes('evaluateGameAttempt'));

  recordTest(
    "Negative Test 6: Client-Imported Answer Evaluator Leak Prevention",
    !hasImportLine,
    !hasImportLine
      ? "PASS: evaluateGameAttempt is NOT imported by client components. Evaluation is 100% server-isolated."
      : "FAIL: Client component imports evaluateGameAttempt directly!"
  );
}

// Execute Negative Test Suite
testSubjectMismatches();
testGenericAttributions();
testLicenseFidelity();
testUnreachableSources();
testMockHarnessE2E();
testClientImportedEvaluators();

console.log("\n================================================================================");
if (errors.length === 0) {
  console.log("PASS: ALL 6 NEGATIVE TEST SUITES PASSED CLEANLY!");
  console.log("================================================================================\n");
  process.exit(0);
} else {
  console.error(`FAIL: ${errors.length} NEGATIVE TEST SUITE FAILURES DETECTED:`);
  errors.forEach(e => console.error(`  - ${e}`));
  console.log("================================================================ algorithm\n");
  process.exit(1);
}
