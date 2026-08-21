// ─────────────────────────────────────────────────────────────
// WONDER JOURNEY OS — CLASSROOM INTERACTION PROTOCOL
// Strongly typed, versioned LiveKit event schemas, normalized
// coordinate transforms, rate-limiting, and state synchronization.
// ─────────────────────────────────────────────────────────────

export type PermissionLevel =
  | "view_only"
  | "pointer_only"
  | "annotate"
  | "game_interactive"
  | "full_interactive"
  | "frozen";

export type NormalizedPoint = {
  x: number; // 0.0 to 1.0 (relative to 16:9 lesson stage)
  y: number; // 0.0 to 1.0 (relative to 16:9 lesson stage)
};

export type AnnotationTool =
  | "pointer"
  | "laser"
  | "pen"
  | "highlighter"
  | "underline"
  | "circle"
  | "rect"
  | "line"
  | "arrow"
  | "eraser";

export type SynchronizedStroke = {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: "teacher" | "family" | "student";
  tool: AnnotationTool;
  color: string;
  width: number; // normalized line thickness
  points: NormalizedPoint[];
  slideIndex: number;
  createdAt: number;
};

// ── Classroom Event Discriminated Union ────────────────────────

export type ClassroomPermissionEvent = {
  topic: "classroom.permission";
  version: 1;
  eventId: string;
  sessionId: string;
  workspaceId: string;
  senderId: string;
  role: "teacher";
  timestamp: number;
  payload: {
    targetIdentity: string | "all";
    level: PermissionLevel;
  };
};

export type ClassroomPointerEvent = {
  topic: "classroom.pointer";
  version: 1;
  eventId: string;
  sessionId: string;
  senderId: string;
  displayName: string;
  role: "teacher" | "family" | "student";
  timestamp: number;
  payload: {
    point: NormalizedPoint;
    active: boolean;
    color: string;
  };
};

export type ClassroomStrokeEvent = {
  topic: "classroom.stroke";
  version: 1;
  eventId: string;
  sessionId: string;
  senderId: string;
  senderName: string;
  role: "teacher" | "family" | "student";
  timestamp: number;
  payload: {
    action: "create" | "erase" | "clear_all" | "clear_participant" | "undo";
    stroke?: SynchronizedStroke;
    strokeId?: string;
    targetParticipantId?: string;
  };
};

export type ClassroomObjectEvent = {
  topic: "classroom.object";
  version: 1;
  eventId: string;
  sessionId: string;
  senderId: string;
  role: "teacher" | "family" | "student";
  timestamp: number;
  payload: {
    objectId: string;
    position: NormalizedPoint;
    isDropped: boolean;
    zoneId?: string;
  };
};

export type ClassroomGameEvent = {
  topic: "classroom.game";
  version: 1;
  eventId: string;
  sessionId: string;
  senderId: string;
  senderName: string;
  role: "teacher" | "family" | "student";
  timestamp: number;
  payload: {
    gameType: "matching" | "sequencing" | "word_scramble" | "memory_flip" | "quiz" | "custom";
    action: "select" | "match_pair" | "move_order" | "reset" | "reveal_authorized" | "submit_attempt";
    data: Record<string, unknown>;
  };
};

export type ClassroomSlideEvent = {
  topic: "classroom.slide";
  version: 1;
  eventId: string;
  sessionId: string;
  senderId: string;
  role: "teacher";
  timestamp: number;
  payload: {
    slideIndex: number;
    lessonId: string;
    isLocked: boolean;
  };
};

export type ClassroomSnapshotEvent = {
  topic: "classroom.snapshot";
  version: 1;
  eventId: string;
  sessionId: string;
  senderId: string;
  role: "teacher";
  timestamp: number;
  payload: {
    snapshotId: string;
    slideId: string;
    slideIndex: number;
    strokes: SynchronizedStroke[];
  };
};

export type ClassroomPresenceEvent = {
  topic: "classroom.presence";
  version: 1;
  eventId: string;
  sessionId: string;
  senderId: string;
  displayName: string;
  role: "teacher" | "family" | "student";
  timestamp: number;
  payload: {
    isOnline: boolean;
    currentSlideIndex: number;
    permissionLevel: PermissionLevel;
  };
};

export type ClassroomEvent =
  | ClassroomPermissionEvent
  | ClassroomPointerEvent
  | ClassroomStrokeEvent
  | ClassroomObjectEvent
  | ClassroomGameEvent
  | ClassroomSlideEvent
  | ClassroomSnapshotEvent
  | ClassroomPresenceEvent;

// ── Coordinate Normalization ───────────────────────────────────

/**
 * Converts screen client coordinates (clientX, clientY) to stage-normalized [0..1]
 * accounting for bounding client rect and letterboxing.
 */
export function normalizeStageCoordinates(
  clientX: number,
  clientY: number,
  stageRect: DOMRect
): NormalizedPoint {
  if (!stageRect || stageRect.width === 0 || stageRect.height === 0) {
    return { x: 0, y: 0 };
  }
  const rawX = (clientX - stageRect.left) / stageRect.width;
  const rawY = (clientY - stageRect.top) / stageRect.height;
  return {
    x: Math.max(0, Math.min(1, rawX)),
    y: Math.max(0, Math.min(1, rawY)),
  };
}

/**
 * Converts stage-normalized coordinates [0..1] to pixel values on a rendered canvas/SVG.
 */
export function denormalizeStageCoordinates(
  point: NormalizedPoint,
  width: number,
  height: number
): { x: number; y: number } {
  return {
    x: point.x * width,
    y: point.y * height,
  };
}

// ── Validation & Security Gate ─────────────────────────────────

export function isClassroomEvent(obj: unknown): obj is ClassroomEvent {
  if (!obj || typeof obj !== "object") return false;
  const ev = obj as Record<string, unknown>;
  return (
    typeof ev.topic === "string" &&
    ev.topic.startsWith("classroom.") &&
    ev.version === 1 &&
    typeof ev.sessionId === "string" &&
    typeof ev.senderId === "string" &&
    typeof ev.timestamp === "number" &&
    typeof ev.payload === "object" &&
    ev.payload !== null
  );
}

/**
 * Validates that an event from a student/family participant does NOT
 * attempt unauthorized actions (e.g. self-granting permission, slide changing,
 * snapshot saving, or leaking answer keys).
 */
export function validateParticipantAction(
  event: ClassroomEvent,
  assignedPermission: PermissionLevel,
  isTeacher: boolean
): { allowed: boolean; reason?: string } {
  if (isTeacher) return { allowed: true };

  // Student cannot emit teacher-only topics
  if (
    event.topic === "classroom.permission" ||
    event.topic === "classroom.slide" ||
    event.topic === "classroom.snapshot"
  ) {
    return { allowed: false, reason: "Unauthorized privileged classroom topic" };
  }

  // Check permission level capabilities
  if (assignedPermission === "frozen" || assignedPermission === "view_only") {
    return { allowed: false, reason: "Classroom interaction is currently locked/view-only" };
  }

  if (event.topic === "classroom.pointer") {
    return { allowed: true };
  }

  if (event.topic === "classroom.stroke") {
    if (assignedPermission === "pointer_only") {
      return { allowed: false, reason: "Only pointer tools are permitted" };
    }
    // Students can only clear their own strokes
    if (
      event.payload.action === "clear_all" ||
      (event.payload.action === "clear_participant" &&
        event.payload.targetParticipantId !== event.senderId)
    ) {
      return { allowed: false, reason: "Students cannot erase other participants' annotations" };
    }
    return { allowed: true };
  }

  if (event.topic === "classroom.object" || event.topic === "classroom.game") {
    if (
      assignedPermission === "pointer_only" ||
      assignedPermission === "annotate"
    ) {
      return { allowed: false, reason: "Interactive game tools not enabled" };
    }
    // Students cannot reveal answers
    if (
      event.topic === "classroom.game" &&
      event.payload.action === "reveal_authorized"
    ) {
      return { allowed: false, reason: "Answer reveal is teacher-only" };
    }
    return { allowed: true };
  }

  return { allowed: true };
}
