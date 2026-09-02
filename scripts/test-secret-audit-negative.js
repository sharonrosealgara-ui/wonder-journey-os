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

  // 2. Test Control Fixture: Clean file referencing process.env
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
    "Control fixture passes scanner with zero findings",
    controlResult.failures.length === 0,
    `Findings count: ${controlResult.failures.length}`
  );

  // 3. Test Negative Fixture 1: Synthetic Hardcoded Password Literal
  const badPasswordPath = path.join(tempDir, "violating-password.js");
  const pWordPrefix = "pass" + "word";
  const pWordValue = '"' + "Teacher" + "SecretPassword2026!" + '"';
  const badPasswordContent = `const ${pWordPrefix} = ${pWordValue};\n`;
  fs.writeFileSync(badPasswordPath, badPasswordContent, "utf8");
  execSync("git add violating-password.js", { cwd: tempDir, stdio: "ignore" });

  const pwdScanResult = scanTrackedFiles(tempDir);
  const foundPasswordFinding = pwdScanResult.failures.some(
    (f) => f.path === "violating-password.js" && f.category.includes("Password")
  );
  assert(
    "Scanner detects synthetic hardcoded password literal in tracked git file",
    foundPasswordFinding,
    `Detected category: ${pwdScanResult.failures.find((f) => f.path === "violating-password.js")?.category}`
  );

  // 4. Test Negative Fixture 2: Synthetic Hardcoded JWT Token
  const badJwtPath = path.join(tempDir, "violating-jwt.js");
  const jwtHeader = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";
  const jwtPayload = "eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIn0";
  const jwtSig = "synthetic-signature-value-sample-1234567890";
  const badJwtContent = `const token = "${jwtHeader}.${jwtPayload}.${jwtSig}";\n`;
  fs.writeFileSync(badJwtPath, badJwtContent, "utf8");
  execSync("git add violating-jwt.js", { cwd: tempDir, stdio: "ignore" });

  const jwtScanResult = scanTrackedFiles(tempDir);
  const foundJwtFinding = jwtScanResult.failures.some(
    (f) => f.path === "violating-jwt.js" && f.category.includes("JWT")
  );
  assert(
    "Scanner detects synthetic hardcoded JWT literal in tracked git file",
    foundJwtFinding,
    `Detected category: ${jwtScanResult.failures.find((f) => f.path === "violating-jwt.js")?.category}`
  );

  // 5. Test Negative Fixture 3: Forbidden Tracked Sensitive File (.env.local)
  const forbiddenEnvPath = path.join(tempDir, ".env.local");
  fs.writeFileSync(forbiddenEnvPath, "SOME_SECRET=val\n", "utf8");
  execSync("git add .env.local", { cwd: tempDir, stdio: "ignore" });

  const envFileScanResult = scanTrackedFiles(tempDir);
  const foundEnvFileFinding = envFileScanResult.failures.some(
    (f) => f.path === ".env.local" && f.category.includes("Sensitive Environment File")
  );
  assert(
    "Scanner detects forbidden tracked .env.local file",
    foundEnvFileFinding,
    `Detected category: ${envFileScanResult.failures.find((f) => f.path === ".env.local")?.category}`
  );

  // 6. Test CLI Execution Non-Zero Exit Code on Violating Repo
  const scannerScriptPath = path.resolve(__dirname, "test-secret-env-audit.js");
  let cliThrew = false;
  try {
    execSync(`node "${scannerScriptPath}"`, { cwd: tempDir, stdio: "pipe" });
  } catch (err) {
    cliThrew = true;
    assert("CLI execution returns non-zero exit code on repository with findings", err.status !== 0, `Exit status: ${err.status}`);
  }
  if (!cliThrew) {
    errors.push("CLI execution failed to return non-zero exit code on violating repo");
  }

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
