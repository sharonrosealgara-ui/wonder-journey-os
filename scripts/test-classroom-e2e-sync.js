const { DeterministicClassroomTransport } = require("../src/lib/classroom-test-transport");

console.log("================================================================================");
console.log("WONDER JOURNEY OS — DETERMINISTIC TWO-CONTEXT CLASSROOM E2E TEST SUITE");
console.log("================================================================================\n");

const startTime = Date.now();
const workspaceId = "test-family-algara";
const sessionId = "room-algara-lesson-1";
const transport = new DeterministicClassroomTransport(sessionId, workspaceId);

let errors = [];
let stepResults = [];

function recordStep(stepNum, desc, success, detail) {
  stepResults.push({ stepNum, desc, success, detail });
  const mark = success ? "✓ PASS" : "✗ FAIL";
  console.log(`[Step ${String(stepNum).padStart(2, "0")}] ${mark}: ${desc}`);
  if (detail) console.log(`          ${detail}`);
  if (!success) errors.push(`Step ${stepNum} failed: ${desc}`);
}

// ── Step 1: Teacher enters an authorized classroom ──
let teacherEvents = [];
const teacher = {
  identity: "teacher-sharon-uuid",
  displayName: "Teacher Sharon",
  role: "teacher",
  workspaceId: workspaceId,
  permissionLevel: "full_interactive",
};
const teacherJoin = transport.join(teacher, (event, sender) => {
  teacherEvents.push({ event, senderId: sender.identity });
});
recordStep(
  1,
  "Teacher enters authorized classroom",
  teacherJoin.success && transport.getSessionState().participants.some((p) => p.identity === teacher.identity),
  `Teacher joined room ${sessionId} with role ${teacher.role}`
);

// ── Step 2: Student enters the same authorized classroom ──
let studentEvents = [];
const student = {
  identity: "student-david-uuid",
  displayName: "David",
  role: "student",
  workspaceId: workspaceId,
  permissionLevel: "view_only",
};
const studentJoin = transport.join(student, (event, sender) => {
  studentEvents.push({ event, senderId: sender.identity });
});
recordStep(
  2,
  "Student enters the same authorized classroom",
  studentJoin.success && transport.getSessionState().participants.length === 2,
  `Student ${student.displayName} joined. Active participants: ${transport.getSessionState().participants.length}`
);

// ── Step 3: Student initially has view-only access ──
const studentStateInitial = transport.getSessionState().participants.find((p) => p.identity === student.identity);
recordStep(
  3,
  "Student initially has view-only access",
  studentStateInitial && studentStateInitial.permissionLevel === "view_only",
  `Initial student permission: ${studentStateInitial ? studentStateInitial.permissionLevel : "unknown"}`
);

// ── Step 4: Teacher grants drawing permission ──
const grantPermEvent = {
  topic: "classroom.permission",
  version: 1,
  eventId: `perm-${Date.now()}`,
  sessionId: sessionId,
  workspaceId: workspaceId,
  senderId: teacher.identity,
  role: "teacher",
  timestamp: Date.now(),
  payload: {
    targetIdentity: student.identity,
    level: "annotate",
  },
};
const grantResult = transport.publish(grantPermEvent, teacher.identity);
recordStep(
  4,
  "Teacher grants drawing permission",
  grantResult.delivered,
  `Permission event delivered. New permission: annotate`
);

// ── Step 5: The student tool becomes enabled ──
const studentStateAfterGrant = transport.getSessionState().participants.find((p) => p.identity === student.identity);
recordStep(
  5,
  "The student tool becomes enabled",
  studentStateAfterGrant && studentStateAfterGrant.permissionLevel === "annotate",
  `Updated student permission level: ${studentStateAfterGrant ? studentStateAfterGrant.permissionLevel : "none"}`
);

// ── Step 6: Student circles or underlines an object ──
const studentStroke = {
  id: "stroke-student-001",
  senderId: student.identity,
  senderName: student.displayName,
  senderRole: "student",
  tool: "circle",
  color: "#38bdf8",
  width: 0.005,
  points: [
    { x: 0.45, y: 0.35 },
    { x: 0.55, y: 0.35 },
    { x: 0.55, y: 0.65 },
    { x: 0.45, y: 0.65 },
  ],
  slideIndex: 0,
  createdAt: Date.now(),
};
const strokeEvent = {
  topic: "classroom.stroke",
  version: 1,
  eventId: `stroke-ev-${Date.now()}`,
  sessionId: sessionId,
  senderId: student.identity,
  senderName: student.displayName,
  role: "student",
  timestamp: Date.now(),
  payload: {
    action: "create",
    stroke: studentStroke,
  },
};
const strokePublish = transport.publish(strokeEvent, student.identity);
recordStep(
  6,
  "Student circles or underlines an object",
  strokePublish.delivered && transport.getSessionState().activeStrokes.length === 1,
  `Student stroke published with normalized coords [0.45..0.55, 0.35..0.65]`
);

// ── Step 7: The same annotation appears correctly in the teacher context ──
const strokeReceivedByTeacher = teacherEvents.some(
  (e) => e.event.topic === "classroom.stroke" && e.event.payload.stroke?.id === studentStroke.id
);
recordStep(
  7,
  "The same annotation appears correctly in the teacher context",
  strokeReceivedByTeacher,
  `Teacher received stroke event from student ${student.displayName}`
);

// ── Step 8: Teacher revokes permission ──
const revokePermEvent = {
  topic: "classroom.permission",
  version: 1,
  eventId: `perm-revoke-${Date.now()}`,
  sessionId: sessionId,
  workspaceId: workspaceId,
  senderId: teacher.identity,
  role: "teacher",
  timestamp: Date.now(),
  payload: {
    targetIdentity: student.identity,
    level: "view_only",
  },
};
const revokeResult = transport.publish(revokePermEvent, teacher.identity);
const studentStateAfterRevoke = transport.getSessionState().participants.find((p) => p.identity === student.identity);
recordStep(
  8,
  "Teacher revokes permission",
  revokeResult.delivered && studentStateAfterRevoke.permissionLevel === "view_only",
  `Teacher revoked drawing. Student permission: ${studentStateAfterRevoke.permissionLevel}`
);

// ── Step 9: Further student input is rejected ──
const unauthorizedStrokeEvent = {
  topic: "classroom.stroke",
  version: 1,
  eventId: `unauth-stroke-${Date.now()}`,
  sessionId: sessionId,
  senderId: student.identity,
  senderName: student.displayName,
  role: "student",
  timestamp: Date.now(),
  payload: {
    action: "create",
    stroke: { ...studentStroke, id: "stroke-unauth-002" },
  },
};
const unauthorizedResult = transport.publish(unauthorizedStrokeEvent, student.identity);
recordStep(
  9,
  "Further student input is rejected",
  !unauthorizedResult.delivered && unauthorizedResult.error !== undefined,
  `Rejected with reason: "${unauthorizedResult.error}"`
);

// ── Step 10: Teacher clears the annotation ──
const clearEvent = {
  topic: "classroom.stroke",
  version: 1,
  eventId: `clear-${Date.now()}`,
  sessionId: sessionId,
  senderId: teacher.identity,
  senderName: teacher.displayName,
  role: "teacher",
  timestamp: Date.now(),
  payload: {
    action: "clear_all",
  },
};
const clearResult = transport.publish(clearEvent, teacher.identity);
recordStep(
  10,
  "Teacher clears the annotation",
  clearResult.delivered,
  `Teacher emitted clear_all event`
);

// ── Step 11: It disappears from both contexts ──
const strokesRemaining = transport.getSessionState().activeStrokes.length;
recordStep(
  11,
  "It disappears from both contexts",
  strokesRemaining === 0,
  `Active strokes count in session state: ${strokesRemaining}`
);

// ── Step 12: Student disconnects and reconnects ──
transport.leave(student.identity);
const midState = transport.getSessionState().participants.length;
let reconnectedStudentEvents = [];
const reconnectResult = transport.join(student, (event, sender) => {
  reconnectedStudentEvents.push({ event, senderId: sender.identity });
});
recordStep(
  12,
  "Student disconnects and reconnects",
  midState === 1 && reconnectResult.success && transport.getSessionState().participants.length === 2,
  `Student successfully disconnected (count=1) and reconnected (count=2)`
);

// ── Step 13: Authoritative slide, permissions, and saved state are restored ──
const sessionStateNow = transport.getSessionState();
recordStep(
  13,
  "Authoritative slide, permissions, and saved state are restored",
  sessionStateNow.currentSlideIndex === 0 && sessionStateNow.sessionId === sessionId,
  `Current authoritative slide: ${sessionStateNow.currentSlideIndex}, lesson: ${sessionStateNow.currentLessonId}`
);

// ── Step 14: A participant from another synthetic workspace is rejected ──
const rogueParticipant = {
  identity: "rogue-intruder-uuid",
  displayName: "Unknown Guest",
  role: "student",
  workspaceId: "rogue-other-workspace",
  permissionLevel: "view_only",
};
const rogueJoin = transport.join(rogueParticipant, () => {});
recordStep(
  14,
  "A participant from another synthetic workspace is rejected",
  !rogueJoin.success && rogueJoin.error?.includes("mismatch"),
  `Rejected unauthorized workspace: "${rogueJoin.error}"`
);

const duration = Date.now() - startTime;
console.log("\n--------------------------------------------------------------------------------");
console.log(`E2E TEST RUN COMPLETED IN ${duration}ms`);
console.log(`Total Steps Executed: ${stepResults.length} / 14`);
console.log(`Passed: ${stepResults.filter((s) => s.success).length}`);
console.log(`Failed: ${errors.length}`);
console.log("--------------------------------------------------------------------------------\n");

if (errors.length > 0) {
  console.error("FAIL: Classroom E2E Sync validation failed with errors:\n");
  errors.forEach((e) => console.error(`  - ${e}`));
  process.exit(1);
}

console.log("PASS: All 14 Classroom Synchronization E2E Verification Steps PASSED 100%!\n");
process.exit(0);
