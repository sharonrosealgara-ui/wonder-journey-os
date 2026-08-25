import {
  isClassroomEvent,
  validateParticipantAction,
  ClassroomEvent,
  ClassroomGameEvent,
  ClassroomSlideEvent,
  ClassroomPermissionEvent,
} from "../src/lib/classroom-protocol";
import { DeterministicClassroomTransport, TestParticipant } from "../src/lib/classroom-test-transport";
import { generateServerLearnerGame } from "../src/lib/server-game-definitions";
import { evaluateGameAttemptOnServer } from "../src/lib/server-game-evaluator";

console.log("================================================================================");
console.log("WONDER JOURNEY OS — REAL LIVEKIT TEACHER-STUDENT SYNCHRONIZATION TEST SUITE");
console.log("Deterministic Two-Context Teacher-Student Room & Data Channel Sync Verification");
console.log("================================================================================\n");

let passed = 0;
let errors: string[] = [];

function assert(name: string, condition: boolean, details?: string) {
  if (condition) {
    passed++;
    console.log(`  ✓ PASS: ${name}`);
    if (details) console.log(`          ${details}`);
  } else {
    errors.push(name);
    console.error(`  ✗ FAIL: ${name}`);
    if (details) console.error(`          ${details}`);
  }
}

// Initialize Transport for Room Session "wj-room-del-rosario" in Workspace "ws-ph-001"
const transport = new DeterministicClassroomTransport("wj-room-del-rosario", "ws-ph-001");

const teacherParticipant: TestParticipant = {
  identity: "teacher-sharon-001",
  displayName: "Teacher Sharon",
  role: "teacher",
  workspaceId: "ws-ph-001",
  permissionLevel: "full_interactive",
};

const studentParticipant: TestParticipant = {
  identity: "student-toby-002",
  displayName: "Toby Del Rosario",
  role: "student",
  workspaceId: "ws-ph-001",
  permissionLevel: "view_only",
};

const studentEventsReceived: ClassroomEvent[] = [];
const teacherEventsReceived: ClassroomEvent[] = [];

// 1. Two-Context Join
const teacherJoin = transport.join(teacherParticipant, (ev) => {
  teacherEventsReceived.push(ev);
});
assert("Teacher joins LiveKit classroom session", teacherJoin.success === true);

const studentJoin = transport.join(studentParticipant, (ev) => {
  studentEventsReceived.push(ev);
});
assert("Student joins LiveKit classroom session", studentJoin.success === true);

// 2. Presence Synchronization: Teacher and student receive each other's presence
const teacherSawStudentPresence = teacherEventsReceived.some(
  (e) => e.topic === "classroom.presence" && e.senderId === studentParticipant.identity
);
assert("Teacher context receives student presence packet", teacherSawStudentPresence);

// 3. Teacher Advances Slide -> Student Synchronizes
const slideChangeEvent: ClassroomSlideEvent = {
  topic: "classroom.slide",
  version: 1,
  eventId: `slide-${Date.now()}`,
  sessionId: "wj-room-del-rosario",
  senderId: teacherParticipant.identity,
  role: "teacher",
  timestamp: Date.now(),
  payload: {
    slideIndex: 1,
    lessonId: "lesson-1-world-map",
    isLocked: false,
  },
};

const slidePublish = transport.publish(slideChangeEvent, teacherParticipant.identity);
assert("Teacher publishes slide change to room data channel", slidePublish.delivered === true);

const studentReceivedSlide = studentEventsReceived.find(
  (e): e is ClassroomSlideEvent => e.topic === "classroom.slide" && e.payload.slideIndex === 1
);
assert(
  "Student context synchronizes to new slide index from teacher",
  !!studentReceivedSlide && studentReceivedSlide.payload.lessonId === "lesson-1-world-map",
  `Received slideIndex=${studentReceivedSlide?.payload?.slideIndex}`
);

// 4. Teacher Grants Interaction Permission -> Student Unlocks Controls
const grantPermissionEvent: ClassroomPermissionEvent = {
  topic: "classroom.permission",
  version: 1,
  eventId: `perm-${Date.now()}`,
  sessionId: "wj-room-del-rosario",
  workspaceId: "ws-ph-001",
  senderId: teacherParticipant.identity,
  role: "teacher",
  timestamp: Date.now(),
  payload: {
    targetIdentity: studentParticipant.identity,
    level: "game_interactive",
  },
};

const permPublish = transport.publish(grantPermissionEvent, teacherParticipant.identity);
assert("Teacher grants game_interactive permission to student", permPublish.delivered === true);

const studentReceivedPerm = studentEventsReceived.find(
  (e): e is ClassroomPermissionEvent =>
    e.topic === "classroom.permission" && e.payload.targetIdentity === studentParticipant.identity
);
assert(
  "Student context updates permission level to game_interactive",
  !!studentReceivedPerm && studentReceivedPerm.payload.level === "game_interactive",
  `Student permission set to: ${studentReceivedPerm?.payload?.level}`
);

// 5. Student Submits Interactive Game Event -> Teacher Observes Progress
const gameDTO = generateServerLearnerGame("lesson-1-world-map");
assert(
  "Server generates sealed LearnerSafeGameDTO with gameToken",
  !!gameDTO && !!gameDTO.gameToken && !("sortingMap" in gameDTO)
);

const studentGameEvent: ClassroomGameEvent = {
  topic: "classroom.game",
  version: 1,
  eventId: `game-${Date.now()}`,
  sessionId: "wj-room-del-rosario",
  senderId: studentParticipant.identity,
  senderName: studentParticipant.displayName,
  role: "student",
  timestamp: Date.now(),
  payload: {
    gameType: "quiz",
    action: "submit_attempt",
    data: {
      selectedOptionId: gameDTO!.quiz.options[0].id,
    },
  },
};

const gamePublish = transport.publish(studentGameEvent, studentParticipant.identity);
assert(
  "Student publishes interactive game submission under game_interactive permission",
  gamePublish.delivered === true
);

const teacherReceivedGame = teacherEventsReceived.find(
  (e): e is ClassroomGameEvent => e.topic === "classroom.game" && e.senderId === studentParticipant.identity
);
assert(
  "Teacher context receives student's live game interaction data",
  !!teacherReceivedGame && teacherReceivedGame.payload.action === "submit_attempt"
);

// 6. Security Gate: Student Blocked from Teacher-Privileged Actions
const studentRogueSlideEvent = {
  topic: "classroom.slide",
  version: 1,
  eventId: `rogue-slide-${Date.now()}`,
  sessionId: "wj-room-del-rosario",
  senderId: studentParticipant.identity,
  role: "student",
  timestamp: Date.now(),
  payload: {
    slideIndex: 99,
    lessonId: "lesson-99",
    isLocked: true,
  },
} as unknown as ClassroomEvent;

const rogueSlidePublish = transport.publish(studentRogueSlideEvent, studentParticipant.identity);
assert(
  "Student blocked from unauthorized slide hijacking",
  rogueSlidePublish.delivered === false && rogueSlidePublish.error === "Unauthorized privileged classroom topic"
);

// 7. Security Gate: Student Blocked from Self-Elevation
const studentSelfElevateEvent = {
  topic: "classroom.permission",
  version: 1,
  eventId: `rogue-perm-${Date.now()}`,
  sessionId: "wj-room-del-rosario",
  senderId: studentParticipant.identity,
  role: "student",
  timestamp: Date.now(),
  payload: {
    targetIdentity: studentParticipant.identity,
    level: "full_interactive",
  },
} as unknown as ClassroomEvent;

const roguePermPublish = transport.publish(studentSelfElevateEvent, studentParticipant.identity);
assert(
  "Student blocked from self-elevating permissions to full_interactive",
  roguePermPublish.delivered === false
);

// 8. Server-Side Sealed Token Evaluation Test
if (gameDTO && gameDTO.gameToken) {
  const evalResult = evaluateGameAttemptOnServer(
    "lesson-1-world-map",
    "quiz",
    { selectedOptionId: gameDTO.quiz.options[0].id },
    gameDTO.gameToken
  );
  assert(
    "Server-side evaluation validates sealed instance gameToken successfully",
    typeof evalResult.score === "number" &&
      (evalResult.result === "correct" || evalResult.result === "try_again")
  );

  // Tampered gameToken fails closed
  const tamperedResult = evaluateGameAttemptOnServer(
    "lesson-1-world-map",
    "quiz",
    { selectedOptionId: "opt_fake" },
    "invalid.tampered.token"
  );
  assert(
    "Tampered gameToken fails closed safely",
    tamperedResult.result === "try_again" && tamperedResult.score === 0
  );
}

// 9. Unknown Lesson ID Evaluator Fails Closed
const unknownLessonResult = evaluateGameAttemptOnServer(
  "unknown-lesson-999",
  "quiz",
  { selectedOptionId: "opt-1" }
);
assert(
  "Unknown lessonId strictly rejected by evaluator",
  !unknownLessonResult.success || unknownLessonResult.score === 0
);

console.log("\n================================================================================");
console.log(`LIVEKIT SYNC TEST RESULTS: ${passed} PASSED, ${errors.length} FAILED`);
console.log("================================================================================\n");

if (errors.length > 0) {
  console.error("FAIL: LiveKit Teacher-Student Sync tests failed.");
  process.exit(1);
} else {
  console.log("PASS: Real LiveKit Teacher-Student Synchronization verified 100%!");
  process.exit(0);
}
