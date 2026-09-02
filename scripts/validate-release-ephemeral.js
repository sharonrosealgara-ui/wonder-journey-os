const { execSync, spawnSync } = require("child_process");
const path = require("path");
const { generateEphemeralCredentials } = require("./e2e-credentials-helper");

console.log("================================================================================");
console.log("WONDER JOURNEY OS — EPHEMERAL CREDENTIAL RUNNER & RELEASE CANDIDATE ORCHESTRATOR");
console.log("Stage 12.1R.10: Zero Credential Literals & Dynamic Secret Governance");
console.log("================================================================================\n");

// 1. Generate Ephemeral Credentials for any missing variables
const ephemeral = generateEphemeralCredentials();

process.env.E2E_TEACHER_PASSWORD = process.env.E2E_TEACHER_PASSWORD || ephemeral.E2E_TEACHER_PASSWORD;
process.env.E2E_FAMILY_PASSWORD = process.env.E2E_FAMILY_PASSWORD || ephemeral.E2E_FAMILY_PASSWORD;
process.env.LIVEKIT_API_KEY = process.env.LIVEKIT_API_KEY || ephemeral.LIVEKIT_API_KEY;
process.env.LIVEKIT_API_SECRET = process.env.LIVEKIT_API_SECRET || ephemeral.LIVEKIT_API_SECRET;
process.env.GAME_EVALUATION_SECRET = process.env.GAME_EVALUATION_SECRET || ephemeral.GAME_EVALUATION_SECRET;
process.env.LIVEKIT_URL = process.env.LIVEKIT_URL || "ws://127.0.0.1:7880";
process.env.NEXT_PUBLIC_LIVEKIT_WS_URL = process.env.NEXT_PUBLIC_LIVEKIT_WS_URL || "ws://127.0.0.1:7880";
process.env.NODE_ENV = process.env.NODE_ENV || "test";
process.env.NEXT_TELEMETRY_DISABLED = "1";

// 2. Extract Supabase status if keys are missing from environment
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.log("Extracting local Supabase connection details via status command...");
  try {
    let statusJsonStr = "";
    try {
      statusJsonStr = execSync("supabase status -o json", { encoding: "utf8", stdio: "pipe" });
    } catch {
      statusJsonStr = execSync("npx supabase status -o json", { encoding: "utf8", stdio: "pipe" });
    }

    const status = JSON.parse(statusJsonStr);
    if (status.API_URL) process.env.NEXT_PUBLIC_SUPABASE_URL = status.API_URL;
    if (status.ANON_KEY) process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = status.ANON_KEY;
    if (status.SERVICE_ROLE_KEY) process.env.SUPABASE_SERVICE_ROLE_KEY = status.SERVICE_ROLE_KEY;
    console.log("✓ Successfully extracted Supabase configuration from local status.");
  } catch (err) {
    // If status extraction fails, verify whether existing env has required keys
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error("FAIL: Unable to extract Supabase keys and environment variables are missing.");
      console.error(err.message);
      process.exit(1);
    }
  }
}

// 3. Seed Local Database with current Ephemeral Credentials
console.log("\n▶ Seeding local database with ephemeral credentials...");
try {
  execSync(`node "${path.join(__dirname, "seed-local-database.js")}"`, {
    stdio: "inherit",
    env: process.env,
  });
} catch (err) {
  console.error("FAIL: Local database seeding failed before release validation.");
  process.exit(1);
}

// 4. Execute Full 30 Release Verification Gates
console.log("\n▶ Executing 30-Gate Release Candidate Verification...");
const result = spawnSync(
  process.execPath,
  [path.join(__dirname, "validate-release-candidate.js")],
  {
    stdio: "inherit",
    env: process.env,
  }
);

process.exit(result.status ?? (result.signal ? 1 : 0));
