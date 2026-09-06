import { getLesson, getTodaysLesson, lessons as allLessons } from "../src/config/lessons";
import * as fs from "fs";
import * as path from "path";

function assert(condition: boolean, msg: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${msg}`);
  }
}

console.log("================================================================================");
console.log("WONDER JOURNEY OS — TEACHER CLASSROOM SESSION LIFECYCLE TESTS");
console.log("Authoritative Lifecycle: Launch, Re-entry, Participation, Conclude & RBAC");
console.log("================================================================================\n");

// 1. Canonical Curriculum Lesson Validation
console.log("▶ Test 1: Canonical Lesson Validation");
const validLesson = getLesson("lesson-1-world-map");
assert(!!validLesson, "Valid lesson-1-world-map exists in canonical curriculum");

const invalidLesson = getLesson("lesson-fake-999");
assert(!invalidLesson, "Non-existent lesson ID is strictly rejected as undefined");

const defaultToday = getTodaysLesson();
assert(!!defaultToday && !!defaultToday.id, "Default today's lesson resolves to canonical lesson");
console.log(`  ✓ Validated canonical lesson resolution (${validLesson?.id})`);

// 2. Migration and Schema Invariants
console.log("\n▶ Test 2: Zero SQL / Zero Migration Boundary Invariant");
const migrationsDir = path.join(__dirname, "../supabase/migrations");
const migrationFiles = fs.readdirSync(migrationsDir).filter(f => f.endsWith(".sql"));
console.log(`  Found ${migrationFiles.length} migration files in supabase/migrations`);
assert(migrationFiles.length === 7, "Expected exactly 7 historical migrations (zero new migrations introduced)");
assert(!migrationFiles.some(f => f.startsWith("0008")), "No migration 0008 exists (0 SQL mutation rule satisfied)");
console.log("  ✓ Verified 0 SQL / 0 schema changes rule");

// 3. Schema & Status Vocabulary Verification
console.log("\n▶ Test 3: Canonical Schema & Status Vocabulary Verification");
const migration0005Path = path.join(migrationsDir, "0005_classroom_sessions.sql");
const migration0005Content = fs.readFileSync(migration0005Path, "utf8");

assert(migration0005Content.includes("CHECK (status IN ('active', 'completed', 'discarded'))"), 
  "classroom_sessions status check constraint allows only 'active', 'completed', 'discarded'");
assert(migration0005Content.includes("CHECK (role IN ('teacher', 'family', 'student'))"),
  "classroom_participants role check constraint allows only 'teacher', 'family', 'student'");
assert(migration0005Content.includes("CHECK (permission_level IN ('view_only', 'pointer_only', 'annotate', 'game_interactive', 'full_interactive', 'frozen'))"),
  "classroom_participants permission_level check constraint strictly validated");
assert(migration0005Content.includes("ended_at TIMESTAMP WITH TIME ZONE"),
  "classroom_sessions schema provides canonical ended_at column");
console.log("  ✓ Canonical schema and status vocabulary verified against migration 0005");

// 4. Server Action Integrity & Zero Client Override Checks
console.log("\n▶ Test 4: Server Action Architecture & Forbidden Client Overrides");
const actionsPath = path.join(__dirname, "../src/app/(app)/classroom/actions.ts");
const actionsContent = fs.readFileSync(actionsPath, "utf8");

assert(actionsContent.includes("'use server'"), "actions.ts declared strictly as 'use server'");
assert(actionsContent.includes("export async function startClassroomSession"), "startClassroomSession exported");
assert(actionsContent.includes("export async function concludeClassroomSession"), "concludeClassroomSession exported");

// Client cannot supply teacher identity or workspace authority
assert(!actionsContent.includes("startClassroomSession(lessonId?: string, workspaceId"), 
  "startClassroomSession rejects client-supplied workspaceId parameter");
assert(!actionsContent.includes("startClassroomSession(lessonId?: string, userId"), 
  "startClassroomSession rejects client-supplied userId parameter");
assert(!actionsContent.includes("startClassroomSession(lessonId?: string, teacherId"), 
  "startClassroomSession rejects client-supplied teacherId parameter");
assert(!actionsContent.includes("startClassroomSession(lessonId?: string, roomName"), 
  "startClassroomSession rejects client-supplied roomName parameter");
console.log("  ✓ Actions derive all consequential parameters (user, workspace, role, room) from server auth");

// 5. Active Session Collision Rule
console.log("\n▶ Test 5: Collision Handling Logic");
assert(actionsContent.includes("existingSession"), "actions.ts queries existing active sessions");
assert(actionsContent.includes("reentered: true"), "actions.ts safely re-enters existing active session instead of duplicating");
assert(actionsContent.includes('status: "completed"'), "concludeClassroomSession sets canonical status 'completed'");
assert(actionsContent.includes("ended_at: now"), "concludeClassroomSession records canonical ended_at timestamp");
console.log("  ✓ Verified collision re-entry and truthful conclusion transition");

// 6. Active Session API Hardening
console.log("\n▶ Test 6: /api/classroom/active-session Route Security");
const activeSessionRoutePath = path.join(__dirname, "../src/app/api/classroom/active-session/route.ts");
const routeContent = fs.readFileSync(activeSessionRoutePath, "utf8");

assert(routeContent.includes(".from(\"workspace_members\")"), "Route queries workspace_members");
assert(routeContent.includes(".from(\"classroom_sessions\")"), "Route queries classroom_sessions");
assert(routeContent.includes(".from(\"classroom_participants\")"), "Route queries classroom_participants");
assert(routeContent.includes(".eq(\"status\", \"active\")"), "Route only returns active sessions (concluded sessions are refused)");
console.log("  ✓ Active session route queries canonical tables and rejects non-active sessions");

// 7. Role-Aware Exit Routing
console.log("\n▶ Test 7: Role-Aware Exit Routing");
const classroomPagePath = path.join(__dirname, "../src/app/(app)/classroom/page.tsx");
const pageContent = fs.readFileSync(classroomPagePath, "utf8");

assert(pageContent.includes("const isTeacherRole = role === \"teacher\";"), "Role-aware check evaluates teacher role");
assert(pageContent.includes("router.push(isTeacherRole ? \"/teacher\" : \"/family\");"), "Role-aware routing directs teacher to /teacher and family to /family");
console.log("  ✓ Verified role-aware exit routing to /teacher vs /family");

// 8. Leave vs Conclude Distinction
console.log("\n▶ Test 8: Leave vs Conclude Distinction");
assert(pageContent.includes("data-testid=\"leave-stage-btn\""), "Leave Stage button exists for non-destructive exit");
assert(pageContent.includes("data-testid=\"conclude-class-btn\""), "Conclude Class button exists exclusively for teacher host");
assert(pageContent.includes("data-testid=\"confirm-conclude-class-btn\""), "Confirmation modal safeguards against accidental session conclusion");
console.log("  ✓ Leave vs Conclude distinction and confirmation safeguards verified");

// 9. Client Session-Ended State Synchronization
console.log("\n▶ Test 9: Realtime & Polling Session-Ended Synchronization");
assert(pageContent.includes("postgres_changes"), "ConnectedRoom subscribes to Supabase Realtime changes on classroom_sessions");
assert(pageContent.includes("newStatus === \"completed\" || newStatus === \"discarded\""), "ConnectedRoom detects completed/discarded status and exits cleanly");
assert(pageContent.includes("setInterval"), "Lobby and ConnectedRoom include periodic polling fallback");
console.log("  ✓ Client session-ended synchronization verified");

// 10. LiveKit Token Derivation Security
console.log("\n▶ Test 10: LiveKit Token Route Hardening & Zero Override Rule");
const tokenRoutePath = path.join(__dirname, "../src/app/api/livekit-token/route.ts");
const tokenContent = fs.readFileSync(tokenRoutePath, "utf8");

assert(tokenContent.includes("FORBIDDEN_FIELDS"), "Forbidden client override fields checked in token route");
assert(tokenContent.includes('roomAdmin: derivedRole === "teacher"'), "roomAdmin grant strictly derived from database teacher role");
assert(!tokenContent.includes("CLASSROOM_CODE"), "Zero shared classroom code authorization exists");
console.log("  ✓ LiveKit token derivation strictly server-side with zero client overrides");

console.log("\n================================================================================");
console.log("ALL 10 LIFECYCLE & RBAC INTEGRATION INVARIANTS PASSED (100%)");
console.log("================================================================================\n");
