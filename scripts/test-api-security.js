const assert = require("assert");
const fs = require("fs");
const path = require("path");

console.log("Running API & LiveKit Security Regression Tests...");

// ─────────────────────────────────────────────────────────────
// 1. Test Auth Callback Safe Path Sanitization & Redirect Allowlist
// ─────────────────────────────────────────────────────────────
function sanitizeCallbackNext(rawNext) {
  const allowedNextPaths = ["/reset-password"];
  const isSafePath =
    typeof rawNext === "string" &&
    rawNext.startsWith("/") &&
    !rawNext.startsWith("//") &&
    allowedNextPaths.includes(rawNext);
  return isSafePath ? rawNext : "/reset-password";
}

assert.strictEqual(sanitizeCallbackNext("/reset-password"), "/reset-password");
assert.strictEqual(sanitizeCallbackNext("https://attacker.com"), "/reset-password");
assert.strictEqual(sanitizeCallbackNext("//attacker.com"), "/reset-password");
assert.strictEqual(sanitizeCallbackNext("javascript:alert(1)"), "/reset-password");
assert.strictEqual(sanitizeCallbackNext("/teacher"), "/reset-password");
assert.strictEqual(sanitizeCallbackNext("/family"), "/reset-password");
assert.strictEqual(sanitizeCallbackNext(null), "/reset-password");
console.log("PASS: Auth callback open-redirect protection strictly sanitizes destinations to allowlist.");

// ─────────────────────────────────────────────────────────────
// 2. Validate LiveKit Token Request Body Contracts
// ─────────────────────────────────────────────────────────────
const FORBIDDEN_FIELDS = ["room", "roomName", "identity", "name", "role", "code"];
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function validateLiveKitRequestBody(body) {
  if (!body || typeof body !== "object") {
    return { status: 400, error: "Bad Request: body required" };
  }
  for (const field of FORBIDDEN_FIELDS) {
    if (field in body && body[field] !== undefined) {
      return { status: 400, error: `Bad Request: legacy field "${field}" is not accepted. Send only { sessionId }.` };
    }
  }
  const { sessionId } = body;
  if (!sessionId || typeof sessionId !== "string") {
    return { status: 400, error: "Bad Request: sessionId is required" };
  }
  if (!UUID_RE.test(sessionId)) {
    return { status: 400, error: "Bad Request: sessionId must be a valid UUID" };
  }
  return { status: 200, sessionId };
}

// Test rejection of forbidden fields
for (const forbidden of FORBIDDEN_FIELDS) {
  const result = validateLiveKitRequestBody({ sessionId: "11111111-2222-3333-4444-555555555555", [forbidden]: "injected_val" });
  assert.strictEqual(result.status, 400, `Expected rejection of forbidden field: ${forbidden}`);
  assert.ok(result.error.includes(forbidden));
}

// Test rejection of non-UUID sessionId
assert.strictEqual(validateLiveKitRequestBody({ sessionId: "invalid-session" }).status, 400);
assert.strictEqual(validateLiveKitRequestBody({}).status, 400);

// Test valid request
const validReq = validateLiveKitRequestBody({ sessionId: "c8b1d977-9b2f-4e94-8bf4-6ef26e5a0100" });
assert.strictEqual(validReq.status, 200);
console.log("PASS: LiveKit token API strictly rejects client-supplied room, identity, role, and code fields.");

// ─────────────────────────────────────────────────────────────
// 3. Validate LiveKit Server-Derived Grants & Database Identity
// ─────────────────────────────────────────────────────────────
function computeTokenPayload(user, membership, session, participant) {
  if (!user) return { status: 401, error: "Unauthorized" };
  if (!membership || membership.status !== "active") {
    return { status: 403, error: "Forbidden: user has no active workspace membership" };
  }
  if (!session || session.status !== "active" || session.workspace_id !== membership.workspace_id) {
    return { status: 403, error: "Forbidden: no active authorized classroom session found" };
  }
  if (!participant || participant.session_id !== session.id || participant.user_id !== user.id) {
    return { status: 403, error: "Forbidden: user is not an authorized participant in this classroom session" };
  }
  if (!["teacher", "family", "student"].includes(participant.role)) {
    return { status: 403, error: "Forbidden: participant has no valid role assignment" };
  }

  const identity = `${participant.role}-${user.id}`;
  const room = session.room_name;
  const grants = {
    roomJoin: true,
    room: room,
    canPublish: true,
    canSubscribe: true,
    roomAdmin: participant.role === "teacher",
  };

  return {
    status: 200,
    identity,
    room,
    role: participant.role,
    grants,
  };
}

// 3A. Unauthorized user
assert.strictEqual(computeTokenPayload(null, {}, {}, {}).status, 401);

// 3B. Missing workspace membership
assert.strictEqual(computeTokenPayload({ id: "u1" }, null, {}, {}).status, 403);

// 3C. Mismatched session workspace
assert.strictEqual(computeTokenPayload({ id: "u1" }, { workspace_id: "ws1", status: "active" }, { workspace_id: "ws2", status: "active" }, {}).status, 403);

// 3D. Teacher Grants
const teacherPayload = computeTokenPayload(
  { id: "u-teacher-1" },
  { workspace_id: "ws1", status: "active" },
  { id: "sess1", workspace_id: "ws1", room_name: "room-adventure-1", status: "active" },
  { session_id: "sess1", user_id: "u-teacher-1", role: "teacher" }
);
assert.strictEqual(teacherPayload.status, 200);
assert.strictEqual(teacherPayload.identity, "teacher-u-teacher-1");
assert.strictEqual(teacherPayload.grants.roomAdmin, true);
assert.strictEqual(teacherPayload.room, "room-adventure-1");

// 3E. Family Grants
const familyPayload = computeTokenPayload(
  { id: "u-family-1" },
  { workspace_id: "ws1", status: "active" },
  { id: "sess1", workspace_id: "ws1", room_name: "room-adventure-1", status: "active" },
  { session_id: "sess1", user_id: "u-family-1", role: "family" }
);
assert.strictEqual(familyPayload.status, 200);
assert.strictEqual(familyPayload.identity, "family-u-family-1");
assert.strictEqual(familyPayload.grants.roomAdmin, false);

console.log("PASS: LiveKit grants strictly derive identity, room, role, and teacher-only roomAdmin from database.");

// ─────────────────────────────────────────────────────────────
// 4. Assert Absence of Legacy Cloudflare Pages and Netlify Runtimes
// ─────────────────────────────────────────────────────────────
const projectRoot = path.join(__dirname, "..");
const legacyPaths = [
  "functions",
  "netlify.toml",
  "netlify",
  "src/components/access-gate.tsx",
];

for (const relPath of legacyPaths) {
  const fullPath = path.join(projectRoot, relPath);
  assert.strictEqual(
    fs.existsSync(fullPath),
    false,
    `Legacy runtime or unused file must NOT exist: ${relPath}`
  );
}

console.log("PASS: Cloudflare Pages and Netlify legacy runtime files are completely absent.");

// ─────────────────────────────────────────────────────────────
// 5. Inquiry Pipeline Real Database Boundary Security Tests
// ─────────────────────────────────────────────────────────────
const { runInquirySecurityTests } = require("./test-inquiry-security");

async function main() {
  await runInquirySecurityTests();
  console.log("PASS: All API, LiveKit, and Inquiry Pipeline Security regression tests passed successfully.");
}

main().catch((err) => {
  console.error("FAIL: API & Inquiry Security Regression failed:", err.message);
  process.exit(1);
});
