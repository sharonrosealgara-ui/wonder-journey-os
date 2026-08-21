// ─────────────────────────────────────────────────────────────
// WONDER JOURNEY OS — DETERMINISTIC LOCAL TEST TRANSPORT
// In-memory / BroadcastChannel transport adapter for deterministic
// multi-participant classroom testing without external LiveKit Cloud.
// ─────────────────────────────────────────────────────────────

import { ClassroomEvent, isClassroomEvent, validateParticipantAction, PermissionLevel } from "./classroom-protocol";

export type TestParticipant = {
  identity: string;
  displayName: string;
  role: "teacher" | "family" | "student";
  workspaceId: string;
  permissionLevel: PermissionLevel;
};

export class DeterministicClassroomTransport {
  private sessionId: string;
  private workspaceId: string;
  private participants: Map<string, TestParticipant> = new Map();
  private subscribers: Map<string, (event: ClassroomEvent, sender: TestParticipant) => void> = new Map();
  private currentSlideIndex: number = 0;
  private currentLessonId: string = "lesson-1-world-map";
  private activeStrokes: any[] = [];
  private eventHistory: ClassroomEvent[] = [];

  constructor(sessionId: string, workspaceId: string) {
    this.sessionId = sessionId;
    this.workspaceId = workspaceId;
  }

  public join(participant: TestParticipant, onEvent: (event: ClassroomEvent, sender: TestParticipant) => void): { success: boolean; error?: string } {
    // Cross-workspace validation
    if (participant.workspaceId !== this.workspaceId) {
      return { success: false, error: "Cross-workspace access rejected: Workspace ID mismatch" };
    }

    this.participants.set(participant.identity, { ...participant });
    this.subscribers.set(participant.identity, onEvent);

    // Broadcast presence
    this.publish({
      topic: "classroom.presence",
      version: 1,
      eventId: `join-${Date.now()}`,
      sessionId: this.sessionId,
      senderId: participant.identity,
      displayName: participant.displayName,
      role: participant.role,
      timestamp: Date.now(),
      payload: {
        isOnline: true,
        currentSlideIndex: this.currentSlideIndex,
        permissionLevel: participant.permissionLevel,
      },
    }, participant.identity);

    return { success: true };
  }

  public leave(identity: string): void {
    const p = this.participants.get(identity);
    if (p) {
      this.publish({
        topic: "classroom.presence",
        version: 1,
        eventId: `leave-${Date.now()}`,
        sessionId: this.sessionId,
        senderId: p.identity,
        displayName: p.displayName,
        role: p.role,
        timestamp: Date.now(),
        payload: {
          isOnline: false,
          currentSlideIndex: this.currentSlideIndex,
          permissionLevel: p.permissionLevel,
        },
      }, identity);
    }
    this.participants.delete(identity);
    this.subscribers.delete(identity);
  }

  public publish(event: ClassroomEvent, senderIdentity: string): { delivered: boolean; error?: string } {
    const sender = this.participants.get(senderIdentity);
    if (!sender) {
      return { delivered: false, error: "Sender not joined in session" };
    }

    // Security Gatekeeper
    const isTeacher = sender.role === "teacher";
    const validation = validateParticipantAction(event, sender.permissionLevel, isTeacher);
    if (!validation.allowed) {
      return { delivered: false, error: validation.reason };
    }

    // Process stateful events
    if (event.topic === "classroom.permission") {
      const target = event.payload.targetIdentity;
      const lvl = event.payload.level;
      if (target === "all") {
        this.participants.forEach((p) => {
          if (p.role !== "teacher") p.permissionLevel = lvl;
        });
      } else {
        const targetP = this.participants.get(target);
        if (targetP) targetP.permissionLevel = lvl;
      }
    } else if (event.topic === "classroom.slide") {
      this.currentSlideIndex = event.payload.slideIndex;
      this.currentLessonId = event.payload.lessonId;
    } else if (event.topic === "classroom.stroke") {
      if (event.payload.action === "create" && event.payload.stroke) {
        this.activeStrokes.push(event.payload.stroke);
      } else if (event.payload.action === "clear_all") {
        this.activeStrokes = [];
      }
    }

    this.eventHistory.push(event);

    // Deliver to all active subscribers
    this.subscribers.forEach((cb, id) => {
      // Receiver callback
      try {
        cb(event, sender);
      } catch (err) {
        console.error(`Error delivering event to ${id}:`, err);
      }
    });

    return { delivered: true };
  }

  public getSessionState() {
    return {
      sessionId: this.sessionId,
      workspaceId: this.workspaceId,
      currentSlideIndex: this.currentSlideIndex,
      currentLessonId: this.currentLessonId,
      activeStrokes: [...this.activeStrokes],
      participants: Array.from(this.participants.values()),
      eventCount: this.eventHistory.length,
    };
  }
}
