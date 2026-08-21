import {
  normalizeStageCoordinates,
  denormalizeStageCoordinates,
  validateParticipantAction,
  isClassroomEvent,
  ClassroomEvent,
} from "../src/lib/classroom-protocol";

function assert(condition: boolean, msg: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${msg}`);
  }
}

// 1. Coordinate Normalization
const fakeRect = {
  left: 100,
  top: 50,
  width: 800,
  height: 450,
  right: 900,
  bottom: 500,
  x: 100,
  y: 50,
  toJSON: () => {},
} as DOMRect;

const center = normalizeStageCoordinates(500, 275, fakeRect);
assert(Math.abs(center.x - 0.5) < 0.001, "Normalized stage center X is 0.5");
assert(Math.abs(center.y - 0.5) < 0.001, "Normalized stage center Y is 0.5");

const topLeft = normalizeStageCoordinates(100, 50, fakeRect);
assert(topLeft.x === 0 && topLeft.y === 0, "Normalized stage top-left is (0, 0)");

const clamped = normalizeStageCoordinates(1200, 900, fakeRect);
assert(clamped.x === 1 && clamped.y === 1, "Coordinates outside bounding box clamp to [0..1]");

// 2. Coordinate Denormalization
const normPt = { x: 0.5, y: 0.5 };
const px1080 = denormalizeStageCoordinates(normPt, 1920, 1080);
assert(px1080.x === 960 && px1080.y === 540, "Denormalization scales accurately to 1920x1080");

const px768 = denormalizeStageCoordinates(normPt, 1366, 768);
assert(px768.x === 683 && px768.y === 384, "Denormalization scales accurately to 1366x768");

// 3. Teacher universal permissions
const slideEvent: ClassroomEvent = {
  topic: "classroom.slide",
  version: 1,
  eventId: "test-1",
  sessionId: "room-1",
  senderId: "teacher-1",
  role: "teacher",
  timestamp: Date.now(),
  payload: {
    slideIndex: 5,
    lessonId: "lesson-1-world-map",
    isLocked: true,
  },
};
const teacherRes = validateParticipantAction(slideEvent, "full_interactive", true);
assert(teacherRes.allowed === true, "Teacher is permitted to emit slide change topics");

// 4. Student privileged topic blocking
const studentPrivilegeEvent: ClassroomEvent = {
  topic: "classroom.slide",
  version: 1,
  eventId: "evil-1",
  sessionId: "room-1",
  senderId: "student-1",
  role: "teacher",
  timestamp: Date.now(),
  payload: {
    slideIndex: 99,
    lessonId: "lesson-99",
    isLocked: false,
  },
};
const studentPrivilegeRes = validateParticipantAction(studentPrivilegeEvent, "full_interactive", false);
assert(studentPrivilegeRes.allowed === false, "Student is blocked from emitting teacher-only topics");

// 5. View-only and frozen permissions
const strokeEvent: ClassroomEvent = {
  topic: "classroom.stroke",
  version: 1,
  eventId: "stroke-1",
  sessionId: "room-1",
  senderId: "student-1",
  senderName: "Toby",
  role: "student",
  timestamp: Date.now(),
  payload: {
    action: "create",
  },
};
const viewOnlyRes = validateParticipantAction(strokeEvent, "view_only", false);
assert(viewOnlyRes.allowed === false, "View-only permission blocks stroke creation");

const frozenRes = validateParticipantAction(strokeEvent, "frozen", false);
assert(frozenRes.allowed === false, "Frozen permission blocks stroke creation");

const annotateRes = validateParticipantAction(strokeEvent, "annotate", false);
assert(annotateRes.allowed === true, "Annotate permission permits stroke creation");

// 6. Erasing / Clear All protection
const clearAllEvent: ClassroomEvent = {
  topic: "classroom.stroke",
  version: 1,
  eventId: "clear-all-1",
  sessionId: "room-1",
  senderId: "student-1",
  senderName: "Toby",
  role: "student",
  timestamp: Date.now(),
  payload: {
    action: "clear_all",
  },
};
const clearAllRes = validateParticipantAction(clearAllEvent, "annotate", false);
assert(clearAllRes.allowed === false, "Students cannot clear all annotations from classroom board");

// 7. Schema type guard
assert(isClassroomEvent(null) === false, "Null is not a valid classroom event");
assert(isClassroomEvent({}) === false, "Empty object is not a valid classroom event");

const validPointerEvent = {
  topic: "classroom.pointer",
  version: 1,
  eventId: "ptr-1",
  sessionId: "session-1",
  senderId: "user-1",
  timestamp: 12345,
  payload: { point: { x: 0.1, y: 0.2 }, active: true, color: "#fff" },
};
assert(isClassroomEvent(validPointerEvent) === true, "Valid LiveKit pointer event matches schema");
