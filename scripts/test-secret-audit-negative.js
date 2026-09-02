const fs = require("fs");
const path = require("path");
const os = require("os");
const { execSync } = require("child_process");
const { scanTrackedFiles } = require("./test-secret-env-audit");

console.log("================================================================================");
console.log("RUNNING SECRET AUDIT SCANNER NEGATIVE HARNESS & INTEGRATION TESTS");
console.log("================================================================================\n");

let tempDir = null;
let passed = 0;
let errors = [];

function assert(name, condition, detail) {
  if (condition) {
    passed++;
    console.log(`  ✓ PASS: ${name}`);
    if (detail) console.log(`          ${detail}`);
  } else {
    errors.push(name);
    console.error(`  ✗ FAIL: ${name}`);
    if (detail) console.error(`          ${detail}`);
  }
}

try {
  // 1. Initialize temporary Git repository in os.tmpdir()
  tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "wj-secret-audit-neg-"));
  console.log(`Initialized temporary Git test repository at: ${tempDir}`);

  execSync("git init", { cwd: tempDir, stdio: "ignore" });
  execSync('git config user.name "SecurityTester"', { cwd: tempDir, stdio: "ignore" });
  execSync('git config user.email "security-tester@wonderjourney.test"', { cwd: tempDir, stdio: "ignore" });

  // 1. Control Fixture: Clean file referencing process.env dynamically
  const cleanFilePath = path.join(tempDir, "clean-module.js");
  const cleanContent = `// Clean module referencing environment variables dynamically
const teacherPassword = process.env.E2E_TEACHER_PASSWORD;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
module.exports = { teacherPassword, serviceKey };
`;
  fs.writeFileSync(cleanFilePath, cleanContent, "utf8");
  execSync("git add clean-module.js", { cwd: tempDir, stdio: "ignore" });

  const controlResult = scanTrackedFiles(tempDir);
  assert(
    "1. Control fixture passes scanner with zero findings",
    controlResult.failures.length === 0,
    `Findings count: ${controlResult.failures.length}`
  );

  // 2. Synthetic Hardcoded Password Literal
  const badPasswordPath = path.join(tempDir, "violating-password.js");
  const pWordPrefix = "pass" + "word";
  const pWordFrag = "Teacher" + "SecretPassword2026!";
  const badPasswordContent = `const ${pWordPrefix} = "${pWordFrag}";\n`;
  fs.writeFileSync(badPasswordPath, badPasswordContent, "utf8");
  execSync("git add violating-password.js", { cwd: tempDir, stdio: "ignore" });

  const pwdScanResult = scanTrackedFiles(tempDir);
  const foundPasswordFinding = pwdScanResult.failures.some(
    (f) => f.path === "violating-password.js" && f.category.includes("Password")
  );
  assert(
    "2. Scanner detects synthetic hardcoded password literal in tracked git file",
    foundPasswordFinding,
    `Detected category: ${pwdScanResult.failures.find((f) => f.path === "violating-password.js")?.category}`
  );

  // 3. Synthetic Email-Password Pair in close proximity
  const badPairPath = path.join(tempDir, "violating-pair.js");
  const pairEmail = "admin" + "@" + "example.com";
  const pairPass = "admin" + "123456";
  const badPairContent = `const email = "${pairEmail}";\nconst password = "${pairPass}";\n`;
  fs.writeFileSync(badPairPath, badPairContent, "utf8");
  execSync("git add violating-pair.js", { cwd: tempDir, stdio: "ignore" });

  const pairScanResult = scanTrackedFiles(tempDir);
  const foundPairFinding = pairScanResult.failures.some(
    (f) => f.path === "violating-pair.js"
  );
  assert(
    "3. Scanner detects synthetic email-password pair in tracked git file",
    foundPairFinding,
    `Detected category: ${pairScanResult.failures.find((f) => f.path === "violating-pair.js")?.category}`
  );

  // 4. Synthetic Documentation Credential (proving zero documentation exemption)
  const badDocPath = path.join(tempDir, "violating-doc.md");
  const docSecretFrag = "lk_sec_" + "abcdef1234567890abcdef";
  const badDocContent = `# Deployment Guide\nUse the following secret:\nLIVEKIT_API_SECRET="${docSecretFrag}"\n`;
  fs.writeFileSync(badDocPath, badDocContent, "utf8");
  execSync("git add violating-doc.md", { cwd: tempDir, stdio: "ignore" });

  const docScanResult = scanTrackedFiles(tempDir);
  const foundDocFinding = docScanResult.failures.some(
    (f) => f.path === "violating-doc.md" && f.category.includes("LiveKit")
  );
  assert(
    "4. Scanner detects synthetic documentation credential without exemption",
    foundDocFinding,
    `Detected category: ${docScanResult.failures.find((f) => f.path === "violating-doc.md")?.category}`
  );

  // 5. Synthetic Hardcoded JWT Token
  const badJwtPath = path.join(tempDir, "violating-jwt.js");
  const jwtHeader = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";
  const jwtPayload = "eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIn0";
  const jwtSig = "synthetic-signature-value-sample-1234567890";
  const syntheticJwt = `${jwtHeader}.${jwtPayload}.${jwtSig}`;
  const badJwtContent = `const token = "${syntheticJwt}";\n`;
  fs.writeFileSync(badJwtPath, badJwtContent, "utf8");
  execSync("git add violating-jwt.js", { cwd: tempDir, stdio: "ignore" });

  const jwtScanResult = scanTrackedFiles(tempDir);
  const foundJwtFinding = jwtScanResult.failures.some(
    (f) => f.path === "violating-jwt.js" && f.category.includes("JWT")
  );
  assert(
    "5. Scanner detects synthetic hardcoded JWT literal in tracked git file",
    foundJwtFinding,
    `Detected category: ${jwtScanResult.failures.find((f) => f.path === "violating-jwt.js")?.category}`
  );

  // 6. Forbidden Tracked Sensitive File (.env.local)
  const forbiddenEnvPath = path.join(tempDir, ".env.local");
  fs.writeFileSync(forbiddenEnvPath, "SOME_SECRET=val\n", "utf8");
  execSync("git add .env.local", { cwd: tempDir, stdio: "ignore" });

  const envFileScanResult = scanTrackedFiles(tempDir);
  const foundEnvFileFinding = envFileScanResult.failures.some(
    (f) => f.path === ".env.local" && f.category.includes("Sensitive Environment File")
  );
  assert(
    "6. Scanner detects forbidden tracked .env.local file",
    foundEnvFileFinding,
    `Detected category: ${envFileScanResult.failures.find((f) => f.path === ".env.local")?.category}`
  );

  // 7. Synthetic Game Evaluation Secret
  const badGameSecPath = path.join(tempDir, "violating-game.js");
  const gameSecFrag = "sec_" + "game_eval_random_token_12345";
  const badGameSecContent = `const GAME_EVALUATION_SECRET = "${gameSecFrag}";\n`;
  fs.writeFileSync(badGameSecPath, badGameSecContent, "utf8");
  execSync("git add violating-game.js", { cwd: tempDir, stdio: "ignore" });

  const gameScanResult = scanTrackedFiles(tempDir);
  const foundGameFinding = gameScanResult.failures.some(
    (f) => f.path === "violating-game.js" && f.category.includes("Game Evaluation")
  );
  assert(
    "7. Scanner detects synthetic game evaluation secret literal",
    foundGameFinding,
    `Detected category: ${gameScanResult.failures.find((f) => f.path === "violating-game.js")?.category}`
  );

  // 8. CLI Execution Non-Zero Exit Code on Violating Repo
  const scannerScriptPath = path.resolve(__dirname, "test-secret-env-audit.js");
  let cliThrew = false;
  let cliOutput = "";
  try {
    execSync(`node "${scannerScriptPath}"`, { cwd: tempDir, encoding: "utf8", stdio: "pipe" });
  } catch (err) {
    cliThrew = true;
    cliOutput = (err.stdout || "") + (err.stderr || "");
    assert("8. CLI execution returns non-zero exit code on repository with findings", err.status !== 0, `Exit status: ${err.status}`);
  }
  if (!cliThrew) {
    errors.push("CLI execution failed to return non-zero exit code on violating repo");
  }

  // 9. Scanner Output Never Includes Synthetic Secret Values (Zero-Leak Output)
  const syntheticValues = [pWordFrag, docSecretFrag, syntheticJwt, gameSecFrag];
  const leakedValues = syntheticValues.filter((val) => cliOutput.includes(val));
  assert(
    "9. Scanner CLI output contains zero sensitive credential values or leaked strings",
    leakedValues.length === 0,
    `Leaked count: ${leakedValues.length} (output cleanly suppressed)`
  );

} catch (err) {
  console.error("Negative Harness Exception:", err.message);
  errors.push(err.message);
} finally {
  if (tempDir && fs.existsSync(tempDir)) {
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
      console.log("Cleaned up temporary test repository.");
    } catch (e) {
      console.warn("Failed to clean up temp dir:", e.message);
    }
  }
}

console.log("\n================================================================================");
console.log(`SECRET AUDIT NEGATIVE HARNESS SUMMARY: ${passed} PASSED, ${errors.length} FAILED`);
console.log("================================================================================\n");

if (errors.length > 0) {
  console.error("FAIL: Secret audit negative harness failed.");
  process.exit(1);
} else {
  console.log("PASS: Secret audit scanner successfully proved against negative fixtures!");
  process.exit(0);
}
