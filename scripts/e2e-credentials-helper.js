const crypto = require("crypto");

/**
 * Validates and retrieves required E2E credentials with fail-closed semantics.
 * Never exposes credential values in error messages or logs.
 */
function requireE2ECredentials() {
  const teacherPassword = process.env.E2E_TEACHER_PASSWORD;
  const familyPassword = process.env.E2E_FAMILY_PASSWORD;

  if (!teacherPassword || typeof teacherPassword !== "string" || teacherPassword.trim().length === 0) {
    throw new Error("Missing required E2E credential: E2E_TEACHER_PASSWORD must be configured in the environment.");
  }

  if (!familyPassword || typeof familyPassword !== "string" || familyPassword.trim().length === 0) {
    throw new Error("Missing required E2E credential: E2E_FAMILY_PASSWORD must be configured in the environment.");
  }

  return {
    teacherPassword: teacherPassword.trim(),
    familyPassword: familyPassword.trim(),
  };
}

/**
 * Generates high-entropy crypto-random credentials for ephemeral test environments.
 */
function generateEphemeralCredentials() {
  const teacherRand = crypto.randomBytes(12).toString("hex");
  const familyRand = crypto.randomBytes(12).toString("hex");
  const livekitKeyRand = crypto.randomBytes(8).toString("hex");
  const livekitSecRand = crypto.randomBytes(24).toString("hex");
  const gameSecRand = crypto.randomBytes(24).toString("hex");

  return {
    E2E_TEACHER_PASSWORD: `Tchr_${teacherRand}!9A`,
    E2E_FAMILY_PASSWORD: `Fmly_${familyRand}!9A`,
    LIVEKIT_API_KEY: `lk_key_${livekitKeyRand}`,
    LIVEKIT_API_SECRET: `lk_sec_${livekitSecRand}`,
    GAME_EVALUATION_SECRET: `game_sec_${gameSecRand}`,
  };
}

module.exports = {
  requireE2ECredentials,
  generateEphemeralCredentials,
};
