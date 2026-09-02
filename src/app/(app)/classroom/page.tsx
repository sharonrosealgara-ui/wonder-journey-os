"use client";

import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ConnectionState, Participant, Track, RemoteParticipant } from "livekit-client";
import { AnnotationLayer, RemotePointer } from "@/components/adventure/annotation-layer";
import { CameraOffTile } from "@/components/friendly-avatar";
import { AdventureTheater } from "@/components/adventure/theater";
import { familyName, familySlug, getStudent, teacherName, students } from "@/config/family";
import { getTodaysLesson, lessons as allLessons, type Lesson } from "@/config/lessons";
import { KEYS, todayISO } from "@/lib/app-state";
import { getScreenShare, participantRole, useCall } from "@/lib/call-context";
import { initCloudSync } from "@/lib/cloud-sync";
import { readStored, useStored } from "@/lib/storage";
import { useAuth } from "@/lib/auth-context";
import {
  PermissionLevel,
  ClassroomEvent,
  ClassroomGameEvent,
  isClassroomEvent,
  validateParticipantAction,
  SynchronizedStroke,
  NormalizedPoint,
} from "@/lib/classroom-protocol";
import { ClassroomGames } from "@/components/classroom/classroom-games";
import { MediaCreditsModal } from "@/components/classroom/media-credits-modal";
import { getMediaForLesson, FactualMedia } from "@/config/media-registry";
import { createClient as createBrowserSupabaseClient } from "@/lib/supabase/client";

// 🎥 LIVE ADVENTURE CLASSROOM — STAGE 12.1
// Full 16:9 wide classroom with synchronized teacher-controlled student interaction,
// normalized annotation drawing, LiveKit data packets, and authentic factual media.

export default function ClassroomPage() {
  const { role } = useAuth();
  const call = useCall();
  const router = useRouter();
  const [activeStudentId] = useStored<string | null>(KEYS.activeStudent, null);
  const student = getStudent(activeStudentId);
  const [name, setName] = useState("");
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [joinError, setJoinError] = useState<string | null>(null);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    setLesson(getTodaysLesson());
  }, []);

  useEffect(() => {
    if (role === "teacher") {
      setName(teacherName);
    } else {
      const doorName = readStored<string>("displayName", "");
      setName(doorName || (student ? student.name : familyName));
    }
  }, [student, role]);

  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [sessionInfo, setSessionInfo] = useState<{
    sessionId: string;
    lessonId: string;
    slideIndex: number;
    roomName: string;
    role: string;
    permissionLevel: PermissionLevel;
  } | null>(null);

  useEffect(() => {
    async function loadActiveSession() {
      try {
        const res = await fetch("/api/classroom/active-session");
        if (res.ok) {
          const data = await res.json();
          if (data.sessionId) {
            setActiveSessionId(data.sessionId);
            setSessionInfo(data);
            const l = allLessons.find((les) => les.id === data.lessonId);
            if (l) setLesson(l);
          }
        }
      } catch {
        // ignore
      }
    }
    loadActiveSession();
  }, []);

  async function join(devices: { camId: string; micId: string; camOn: boolean; micOn: boolean }) {
    setJoinError(null);
    setJoining(true);

    let sessId = activeSessionId;
    if (!sessId) {
      try {
        const res = await fetch("/api/classroom/active-session");
        if (res.ok) {
          const data = await res.json();
          sessId = data.sessionId;
          setActiveSessionId(sessId);
          setSessionInfo(data);
        }
      } catch {}
    }

    if (!sessId) {
      setJoining(false);
      setJoinError("No active classroom session found for your workspace. 💙");
      return;
    }

    const result = await call.join({
      sessionId: sessId,
      ...devices,
    });
    setJoining(false);
    if (result === "unauthorized") {
      setJoinError("Your session is unauthorized or your sign-in has expired. Please sign in again. 💙");
      return;
    }
    if (result === "error") {
      setJoinError("We couldn't reach your camera or classroom session. Please check permissions and try again.");
      return;
    }
    initCloudSync();
  }

  function endCall() {
    call.endCall();
    router.push("/family");
  }

  if (call.status === "connected" && call.room) {
    return (
      <ConnectedRoom
        lesson={lesson}
        sessionId={activeSessionId || call.room.name}
        initialSlideIndex={sessionInfo?.slideIndex ?? 0}
        initialPermission={sessionInfo?.permissionLevel ?? "view_only"}
        onLeave={endCall}
        currentUserName={name}
      />
    );
  }
  if (call.status === "solo") {
    return (
      <SoloRoom
        lesson={lesson}
        isGuest={readStored<boolean>("guest", false)}
        onGoLive={() => join({ camId: "", micId: "", camOn: call.camOn, micOn: call.micOn })}
        onLeave={endCall}
      />
    );
  }
  return (
    <Lobby
      name={name}
      setName={setName}
      lesson={lesson}
      joining={joining || call.status === "connecting"}
      joinError={joinError}
      onJoin={join}
      onEnterSolo={() => call.enterSolo(name)}
      role={role ?? "family"}
    />
  );
}

/* ── Lobby Preview ─────────────────────────────────────────── */
function Lobby({
  name,
  setName,
  lesson,
  joining,
  joinError,
  onJoin,
  onEnterSolo,
  role,
}: {
  name: string;
  setName: (n: string) => void;
  lesson: Lesson | null;
  joining: boolean;
  joinError: string | null;
  onJoin: (d: { camId: string; micId: string; camOn: boolean; micOn: boolean }) => void;
  onEnterSolo?: () => void;
  role: string;
}) {
  const cam = useLocalCamera();
  const [level, setLevel] = useState(0);
  const [showMediaModal, setShowMediaModal] = useState(false);

  const mediaList = useMemo(() => {
    if (!lesson) return [];
    return getMediaForLesson(lesson.id);
  }, [lesson]);

  useEffect(() => {
    if (!cam.streamRef.current || !cam.micOn) {
      setLevel(0);
      return;
    }
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const src = ctx.createMediaStreamSource(cam.streamRef.current);
    const ana = ctx.createAnalyser();
    ana.fftSize = 64;
    src.connect(ana);
    const data = new Uint8Array(ana.frequencyBinCount);
    let raf = 0;
    const loop = () => {
      ana.getByteFrequencyData(data);
      let sum = 0;
      for (let i = 0; i < data.length; i++) sum += data[i];
      const avg = sum / data.length;
      setLevel(Math.min(100, Math.round((avg / 128) * 100)));
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => {
      cancelAnimationFrame(raf);
      void ctx.close();
    };
  }, [cam.streamRef, cam.micOn, cam.tick]);

  return (
    <div className="mx-auto max-w-4xl space-y-6 py-6 px-4">
      <div className="text-center relative">
        <div className="mb-2 text-4xl">🎥🌴</div>
        <h1 className="wj-outline font-display text-3xl sm:text-4xl">Live Adventure Classroom</h1>
        <p className="font-hand mt-1 text-lg text-ink-soft">
          Mabuhay, {role === "teacher" ? teacherName : familyName}! Ready to learn together? 💙
        </p>
        <div className="mt-2 flex justify-center">
          <button
            type="button"
            onClick={() => setShowMediaModal(true)}
            className="rounded-full bg-sand px-3.5 py-1 text-xs font-semibold text-ocean border border-ocean/20 hover:bg-ocean hover:text-white transition-colors cursor-pointer"
          >
            ℹ️ Media Credits ({mediaList.length})
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[1.3fr_1fr]">
        <div className="wj-card overflow-hidden p-4 shadow-lg border-2 border-sand-deep">
          <LocalCameraView
            streamRef={cam.streamRef}
            camOn={cam.camOn}
            tick={cam.tick}
            className="aspect-video w-full rounded-2xl overflow-hidden bg-ink"
            label={name}
          />
          {cam.error && (
            <div className="mt-3 rounded-2xl bg-hibiscus/10 p-3 text-sm text-hibiscus-deep">
              {cam.error}
              <button className="wj-btn wj-btn-ghost mt-2 text-sm" onClick={() => void cam.start()}>
                Retry
              </button>
            </div>
          )}
          <div className="mt-3 flex items-center justify-center gap-3">
            <button
              className={`wj-btn ${cam.camOn ? "wj-btn-ocean" : "wj-btn-ghost"} !px-4 text-sm`}
              onClick={cam.toggleCam}
            >
              {cam.camOn ? "📷 Camera On" : "📷 Camera Off"}
            </button>
            <button
              className={`wj-btn ${cam.micOn ? "wj-btn-ocean" : "wj-btn-ghost"} !px-4 text-sm`}
              onClick={cam.toggleMic}
            >
              {cam.micOn ? "🎤 Mic On" : "🔇 Mic Off"}
            </button>
          </div>
          <div className="mt-3">
            <p className="text-xs font-bold text-ink-soft">Microphone Level</p>
            <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-sand-deep">
              <div
                className="h-full rounded-full bg-gradient-to-r from-palm to-mango transition-[width] duration-100"
                style={{ width: `${cam.micOn ? level : 0}%` }}
              />
            </div>
          </div>
        </div>

        <div className="wj-card space-y-4 p-5 shadow-lg border-2 border-sand-deep">
          <div>
            <label className="text-sm font-bold text-ink-soft">Your name in class</label>
            <input className="wj-input mt-1" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-bold text-ink-soft">📷 Camera Device</label>
            <select
              className="wj-input mt-1"
              value={cam.camId}
              onChange={(e) => cam.setCamId(e.target.value)}
            >
              {cam.cams.length === 0 && <option>Default camera</option>}
              {cam.cams.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-bold text-ink-soft">🎤 Microphone Device</label>
            <select
              className="wj-input mt-1"
              value={cam.micId}
              onChange={(e) => cam.setMicId(e.target.value)}
            >
              {cam.mics.length === 0 && <option>Default microphone</option>}
              {cam.mics.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
          <div className="rounded-2xl bg-sand p-3 text-sm text-ink-soft">
            <p className="font-bold text-ink">Today&apos;s Adventure</p>
            <p className="font-hand text-base text-ocean-deep">
              {lesson ? `${lesson.emoji} ${lesson.title}` : "Loading..."}
            </p>
          </div>
          {joinError && (
            <p className="rounded-2xl bg-hibiscus/10 p-3 text-sm font-bold text-hibiscus-deep">
              {joinError}
            </p>
          )}
          <button
            className="wj-btn w-full text-lg shadow-lg"
            onClick={() => onJoin({ camId: cam.camId, micId: cam.micId, camOn: cam.camOn, micOn: cam.micOn })}
            disabled={joining}
          >
            {joining ? "Connecting… 🌐" : "🚀 Enter Classroom"}
          </button>
          <button
            id="solo-classroom-btn"
            type="button"
            className="wj-btn wj-btn-ghost w-full text-sm font-bold mt-2"
            onClick={() => onEnterSolo?.()}
          >
            🎮 Preview Adventure Classroom (Solo / Stage Mode)
          </button>
        </div>
      </div>

      <MediaCreditsModal
        isOpen={showMediaModal}
        onClose={() => setShowMediaModal(false)}
        mediaList={mediaList}
        lessonTitle={lesson?.title || "Lesson Media"}
      />
    </div>
  );
}


/* ── LiveKit Connected Classroom ────────────────────────────── */
function ConnectedRoom({
  lesson,
  sessionId,
  initialSlideIndex = 0,
  initialPermission = "view_only",
  onLeave,
  currentUserName,
}: {
  lesson: Lesson | null;
  sessionId: string;
  initialSlideIndex?: number;
  initialPermission?: PermissionLevel;
  onLeave: () => void;
  currentUserName: string;
}) {
  const call = useCall();
  const room = call.room!;
  const isTeacher = call.isTeacher;
  const router = useRouter();
  const supabase = useMemo(() => createBrowserSupabaseClient(), []);

  // Classroom States
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(lesson);
  const [stageLesson, setStageLesson] = useState<Lesson | null>(lesson);
  const [slideIndex, setSlideIndex] = useState(initialSlideIndex);
  const [isSlideLocked, setIsSlideLocked] = useState(false);
  const [drawingActive, setDrawingActive] = useState(false);
  const [fullscreenStage, setFullscreenStage] = useState(false);
  const [camsVisible, setCamsVisible] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [msg, setMsg] = useState("");
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [snapshotSavedNotice, setSnapshotSavedNotice] = useState(false);

  const [gameActive, setGameActive] = useState(false);
  const [incomingGameEvent, setIncomingGameEvent] = useState<ClassroomGameEvent | null>(null);

  // Student Permissions State
  const [studentPermissions, setStudentPermissions] = useState<Record<string, PermissionLevel>>({});
  const [myPermission, setMyPermission] = useState<PermissionLevel>(
    isTeacher ? "full_interactive" : initialPermission
  );

  // Synchronized Interaction Data
  const [remoteStrokes, setRemoteStrokes] = useState<SynchronizedStroke[]>([]);
  const [remotePointers, setRemotePointers] = useState<Record<string, RemotePointer>>({});

  // ── Authoritative PostgreSQL Reconnection State Loading ──
  useEffect(() => {
    if (!sessionId) return;
    async function loadAuthoritativeState() {
      try {
        // 1. Authoritative slide index from classroom_sessions
        const { data: sessRow } = await supabase
          .from("classroom_sessions")
          .select("slide_index, lesson_id")
          .eq("id", sessionId)
          .single();
        if (sessRow && typeof sessRow.slide_index === "number") {
          setSlideIndex(sessRow.slide_index);
          if (sessRow.lesson_id) {
            const l = allLessons.find((les) => les.id === sessRow.lesson_id);
            if (l) setStageLesson(l);
          }
        }

        // 2. Authoritative participant permission from classroom_participants
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          const { data: partRow } = await supabase
            .from("classroom_participants")
            .select("permission_level")
            .eq("session_id", sessionId)
            .eq("user_id", user.id)
            .single();
          if (partRow?.permission_level && !isTeacher) {
            setMyPermission(partRow.permission_level as PermissionLevel);
          }
        }

        // 3. Authoritative board snapshots from classroom_board_snapshots
        const { data: snapshotRows } = await supabase
          .from("classroom_board_snapshots")
          .select("strokes_data")
          .eq("session_id", sessionId)
          .order("created_at", { ascending: false })
          .limit(1);
        if (snapshotRows && snapshotRows.length > 0 && Array.isArray(snapshotRows[0].strokes_data)) {
          setRemoteStrokes(snapshotRows[0].strokes_data as SynchronizedStroke[]);
        }
      } catch (err) {
        console.warn("Could not load authoritative PostgreSQL state:", err);
      }
    }
    loadAuthoritativeState();
  }, [sessionId, isTeacher, supabase]);

  const stageMediaList = useMemo(() => {
    if (!stageLesson) return [];
    return getMediaForLesson(stageLesson.id);
  }, [stageLesson]);

  // Broadcast data packet over LiveKit
  const broadcastClassroomEvent = useCallback(
    async (event: ClassroomEvent, lossy = false) => {
      if (!room || room.state !== ConnectionState.Connected) return;
      try {
        const payloadBytes = new TextEncoder().encode(JSON.stringify(event));
        await room.localParticipant.publishData(payloadBytes, {
          reliable: !lossy,
          topic: event.topic,
        });
      } catch (err) {
        console.warn("Error publishing classroom packet:", err);
      }
    },
    [room]
  );

  // Rate-limiting map: identity -> { count, resetTime }
  const rateLimitRef = useRef<Map<string, { count: number; resetTime: number }>>(new Map());

  // Handle incoming LiveKit data events with hardened production security
  useEffect(() => {
    if (!room) return;

    const onDataReceived = (payload: Uint8Array, participant?: RemoteParticipant) => {
      try {
        // 1. Require an actual RemoteParticipant
        if (!participant) return;

        // 2. Limit packet size (max 32KB)
        if (payload.byteLength > 32 * 1024) return;

        const text = new TextDecoder().decode(payload);
        const parsed = JSON.parse(text);
        if (!isClassroomEvent(parsed)) return;

        // 3. Bind sender identity to participant.identity
        if (parsed.senderId !== participant.identity) return;

        // 4. Verify room / session membership
        if (parsed.sessionId !== room.name) return;

        // 5. Rate limiting (max 25 packets per second per participant)
        const now = Date.now();
        const rl = rateLimitRef.current.get(participant.identity) || { count: 0, resetTime: now + 1000 };
        if (now > rl.resetTime) {
          rl.count = 0;
          rl.resetTime = now + 1000;
        }
        rl.count++;
        rateLimitRef.current.set(participant.identity, rl);
        if (rl.count > 25) {
          console.warn(`[Security] Rate limit exceeded for participant ${participant.identity}`);
          return;
        }

        // 6. Derive trusted role from LiveKit token/profile (NOT from packet.role)
        const trustedRole = participantRole(participant);
        const senderIsTeacher = trustedRole === "teacher";

        // 7. Determine effective permission of sender
        const senderPermission: PermissionLevel =
          studentPermissions[participant.identity] || myPermission || "view_only";

        // 8. Enforce validateParticipantAction before mutating any state
        const actionValidation = validateParticipantAction(
          parsed,
          senderPermission,
          senderIsTeacher
        );
        if (!actionValidation.allowed) {
          console.warn(`[Security] Rejected unauthorized action from ${participant.identity}: ${actionValidation.reason}`);
          return;
        }

        // 9. Process topic-specific actions safely
        switch (parsed.topic) {
          case "classroom.permission": {
            if (!senderIsTeacher) return;
            const target = parsed.payload.targetIdentity;
            const lvl = parsed.payload.level;
            if (target === "all" || target === room.localParticipant.identity) {
              setMyPermission(lvl);
            }
            if (target === "all") {
              setStudentPermissions((prev) => {
                const next: Record<string, PermissionLevel> = {};
                Object.keys(prev).forEach((k) => (next[k] = lvl));
                return next;
              });
            } else {
              setStudentPermissions((prev) => ({ ...prev, [target]: lvl }));
            }
            break;
          }

          case "classroom.pointer": {
            setRemotePointers((prev) => ({
              ...prev,
              [parsed.senderId]: {
                senderId: parsed.senderId,
                displayName: parsed.displayName,
                role: senderIsTeacher ? "teacher" : "student",
                point: parsed.payload.point,
                color: parsed.payload.color,
                active: parsed.payload.active,
              },
            }));
            break;
          }

          case "classroom.stroke": {
            if (parsed.payload.action === "create" && parsed.payload.stroke) {
              // Limit stroke points count (max 500 points)
              if (parsed.payload.stroke.points.length > 500) return;
              setRemoteStrokes((prev) => [...prev, parsed.payload.stroke!]);
            } else if (parsed.payload.action === "clear_all") {
              if (!senderIsTeacher) return;
              setRemoteStrokes([]);
            } else if (parsed.payload.action === "clear_participant" && parsed.payload.targetParticipantId) {
              if (!senderIsTeacher && parsed.payload.targetParticipantId !== parsed.senderId) return;
              setRemoteStrokes((prev) =>
                prev.filter((s) => s.senderId !== parsed.payload.targetParticipantId)
              );
            }
            break;
          }

          case "classroom.slide": {
            if (!senderIsTeacher) return;
            setSlideIndex(parsed.payload.slideIndex);
            setIsSlideLocked(parsed.payload.isLocked);
            const found = allLessons.find((l) => l.id === parsed.payload.lessonId);
            if (found) setStageLesson(found);
            break;
          }

          case "classroom.game": {
            setIncomingGameEvent(parsed as ClassroomGameEvent);
            setGameActive(true);
            break;
          }

          case "classroom.snapshot": {
            if (!senderIsTeacher) return;
            setSnapshotSavedNotice(true);
            setTimeout(() => setSnapshotSavedNotice(false), 3000);
            break;
          }
        }
      } catch {
        /* Ignore malformed packets */
      }
    };

    room.on("dataReceived", onDataReceived);
    return () => {
      room.off("dataReceived", onDataReceived);
    };
  }, [room, myPermission, studentPermissions]);

  // Teacher Permission Controls
  const setPermissionForStudent = async (studentIdentity: string, level: PermissionLevel) => {
    if (!isTeacher) return;
    setStudentPermissions((prev) => ({ ...prev, [studentIdentity]: level }));
    if (sessionId) {
      try {
        const parts = studentIdentity.split("-");
        const targetUserId = parts.length > 1 ? parts.slice(1).join("-") : studentIdentity;
        await supabase
          .from("classroom_participants")
          .update({ permission_level: level })
          .eq("session_id", sessionId)
          .eq("user_id", targetUserId);
      } catch (e) {
        console.warn("Could not persist permission to PostgreSQL:", e);
      }
    }
    broadcastClassroomEvent({
      topic: "classroom.permission",
      version: 1,
      eventId: `perm-${Date.now()}`,
      sessionId: room.name,
      workspaceId: "default-workspace",
      senderId: room.localParticipant.identity,
      role: "teacher",
      timestamp: Date.now(),
      payload: {
        targetIdentity: studentIdentity,
        level,
      },
    });
  };

  const setGlobalPermission = async (level: PermissionLevel) => {
    if (!isTeacher) return;
    setStudentPermissions({});
    if (sessionId) {
      try {
        await supabase
          .from("classroom_participants")
          .update({ permission_level: level })
          .eq("session_id", sessionId);
      } catch (e) {
        console.warn("Could not persist global permission to PostgreSQL:", e);
      }
    }
    broadcastClassroomEvent({
      topic: "classroom.permission",
      version: 1,
      eventId: `perm-global-${Date.now()}`,
      sessionId: room.name,
      workspaceId: "default-workspace",
      senderId: room.localParticipant.identity,
      role: "teacher",
      timestamp: Date.now(),
      payload: {
        targetIdentity: "all",
        level,
      },
    });
  };

  // Synchronized Slide Navigation
  const handleSlideChange = async (newIndex: number) => {
    setSlideIndex(newIndex);
    if (isTeacher && stageLesson) {
      if (sessionId) {
        try {
          await supabase
            .from("classroom_sessions")
            .update({ slide_index: newIndex })
            .eq("id", sessionId);
        } catch (e) {
          console.warn("Could not persist slide index to PostgreSQL:", e);
        }
      }
      broadcastClassroomEvent({
        topic: "classroom.slide",
        version: 1,
        eventId: `slide-${Date.now()}`,
        sessionId: room.name,
        senderId: room.localParticipant.identity,
        role: "teacher",
        timestamp: Date.now(),
        payload: {
          slideIndex: newIndex,
          lessonId: stageLesson.id,
          isLocked: isSlideLocked,
        },
      });
    }
  };

  // Local Stroke Emission
  const handleEmitStroke = (stroke: SynchronizedStroke) => {
    broadcastClassroomEvent({
      topic: "classroom.stroke",
      version: 1,
      eventId: `stroke-ev-${Date.now()}`,
      sessionId: room.name,
      senderId: room.localParticipant.identity,
      senderName: currentUserName,
      role: isTeacher ? "teacher" : "student",
      timestamp: Date.now(),
      payload: {
        action: "create",
        stroke,
      },
    });
  };

  // Local Pointer Emission (Lossy UDP packet under 1300B)
  const handleEmitPointer = (point: NormalizedPoint, active: boolean) => {
    broadcastClassroomEvent(
      {
        topic: "classroom.pointer",
        version: 1,
        eventId: `ptr-${Date.now()}`,
        sessionId: room.name,
        senderId: room.localParticipant.identity,
        displayName: currentUserName,
        role: isTeacher ? "teacher" : "student",
        timestamp: Date.now(),
        payload: {
          point,
          active,
          color: isTeacher ? "#e4573b" : "#2e9563",
        },
      },
      true
    );
  };

  const handleClearAllStrokes = () => {
    if (!isTeacher) return;
    setRemoteStrokes([]);
    broadcastClassroomEvent({
      topic: "classroom.stroke",
      version: 1,
      eventId: `clear-${Date.now()}`,
      sessionId: room.name,
      senderId: room.localParticipant.identity,
      senderName: currentUserName,
      role: "teacher",
      timestamp: Date.now(),
      payload: { action: "clear_all" },
    });
  };

  const handleSaveBoardSnapshot = async () => {
    if (!isTeacher || !stageLesson) return;
    if (sessionId) {
      try {
        await supabase
          .from("classroom_board_snapshots")
          .insert({
            session_id: sessionId,
            slide_id: `${stageLesson.id}-slide-${slideIndex}`,
            slide_index: slideIndex,
            strokes_data: remoteStrokes,
            captured_by: room.localParticipant.identity,
          });
      } catch (e) {
        console.warn("Could not persist board snapshot to PostgreSQL:", e);
      }
    }
    broadcastClassroomEvent({
      topic: "classroom.snapshot",
      version: 1,
      eventId: `snap-${Date.now()}`,
      sessionId: room.name,
      senderId: room.localParticipant.identity,
      role: "teacher",
      timestamp: Date.now(),
      payload: {
        snapshotId: `snap-${Date.now()}`,
        slideId: `${stageLesson.id}-slide-${slideIndex}`,
        slideIndex,
        strokes: remoteStrokes,
      },
    });
    setSnapshotSavedNotice(true);
    setTimeout(() => setSnapshotSavedNotice(false), 3000);
  };

  const handleEmitGameEvent = (event: Partial<ClassroomGameEvent>) => {
    const fullEv: ClassroomGameEvent = {
      topic: "classroom.game",
      version: 1,
      eventId: `game-${Date.now()}`,
      sessionId: room.name,
      senderId: room.localParticipant.identity,
      senderName: currentUserName,
      role: isTeacher ? "teacher" : "student",
      timestamp: Date.now(),
      payload: event.payload as ClassroomGameEvent["payload"],
    };
    broadcastClassroomEvent(fullEv);
  };

  const everyone = call.participants;
  const screenShare = getScreenShare(everyone);

  const familyFeed = everyone.find((p) => participantRole(p) === "family") ?? null;
  const teacherFeed = everyone.find((p) => participantRole(p) === "teacher") ?? null;

  return (
    <div className="flex flex-col h-[100dvh] w-[100vw] overflow-hidden bg-sand-deep text-ink">
      {/* ── 1. Top Classroom Bar (56-64px) ───────────────────────── */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b-2 border-sand-deep bg-white px-4 shadow-sm z-30">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-ocean text-white font-display text-sm shadow">
            🌴
          </span>
          <div>
            <h1 className="font-display text-base font-bold leading-tight">
              {stageLesson ? `${stageLesson.emoji} ${stageLesson.title}` : "Wonder Journey Classroom"}
            </h1>
            <p className="text-[11px] text-ink-soft leading-none">
              {isTeacher ? `Teacher Guide · ${familyName} Class` : `Explorer: ${currentUserName}`}
            </p>
          </div>
        </div>

        {/* Status Pills & Controls */}
        <div className="flex items-center gap-2">
          {/* Permission Status Pill */}
          <span
            data-testid="permission-status-pill"
            data-permission-level={isTeacher ? "full_interactive" : myPermission}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold shadow-sm ${
              isTeacher
                ? "bg-mango/20 text-mango-deep border border-mango/30"
                : myPermission === "view_only"
                ? "bg-sand-deep text-ink-soft"
                : "bg-palm/20 text-palm-deep border border-palm/30"
            }`}
          >
            {isTeacher
              ? "👑 Teacher Host"
              : myPermission === "view_only"
              ? "🔒 View-Only"
              : myPermission === "pointer_only"
              ? "👆 Pointer Ready"
              : myPermission === "annotate"
              ? "✏️ Drawing Enabled"
              : "🎮 Interactive Game"}
          </span>

          {/* Whiteboard / Draw Toggle */}
          <button
            type="button"
            data-testid="classroom-draw-toggle-btn"
            onClick={() => setDrawingActive((d) => !d)}
            aria-label="Toggle drawing whiteboard"
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition-all cursor-pointer shadow-sm ${
              drawingActive
                ? "bg-palm text-white ring-2 ring-palm-light"
                : "bg-sand text-ink hover:bg-sand-deep border border-sand-deep"
            }`}
          >
            <span>🎨</span>
            <span>{drawingActive ? "Close Whiteboard" : "Draw & Annotate"}</span>
          </button>

          {/* Interactive Games Toggle */}
          <button
            type="button"
            onClick={() => setGameActive((g) => !g)}
            aria-label="Toggle Interactive Games"
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition-all cursor-pointer shadow-sm ${
              gameActive
                ? "bg-amber-500 text-white ring-2 ring-amber-400/50"
                : "bg-amber-500/10 text-amber-700 hover:bg-amber-500/20 border border-amber-500/30"
            }`}
          >
            <span>🎮</span>
            <span>{gameActive ? "Close Game" : "Games & Activities"}</span>
          </button>

          {/* Media Info & Provenance Button */}
          <button
            type="button"
            onClick={() => setShowMediaModal(true)}
            aria-label="View media provenance & licensing"
            className="flex items-center gap-1.5 rounded-full bg-sand px-3 py-1 text-xs font-semibold text-ocean hover:bg-ocean hover:text-white transition-colors cursor-pointer border border-ocean/20"
          >
            <span>ℹ️ Media Credits</span>
            <span className="rounded-full bg-ocean/20 px-1.5 py-0.2 text-[10px] font-bold">
              {stageMediaList.length}
            </span>
          </button>

          {/* Fullscreen Toggle */}
          <button
            type="button"
            onClick={() => setFullscreenStage((f) => !f)}
            aria-label="Toggle Fullscreen Stage"
            className="flex h-8 px-2.5 items-center justify-center rounded-full bg-sand text-xs font-bold text-ink hover:bg-sand-deep cursor-pointer"
          >
            {fullscreenStage ? "🗗 Standard" : "🗖 Fullscreen"}
          </button>

          {/* Toggle Video Panel */}
          <button
            type="button"
            onClick={() => setCamsVisible((v) => !v)}
            aria-label="Toggle Participant Videos"
            className={`flex h-8 px-3 items-center justify-center rounded-full text-xs font-bold transition-colors cursor-pointer ${
              camsVisible ? "bg-ocean text-white shadow-sm" : "bg-sand text-ink hover:bg-sand-deep"
            }`}
          >
            👥 Video ({everyone.length})
          </button>

          {/* End Call */}
          <button
            type="button"
            onClick={onLeave}
            className="rounded-full bg-hibiscus px-4 py-1.5 font-display text-xs font-bold text-white shadow hover:brightness-95 transition-all cursor-pointer"
          >
            📞 Leave
          </button>
        </div>
      </header>

      {/* ── 2. Main Classroom Workspace (Stage + Participant Panel) ── */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Central 16:9 Lesson Stage */}
        <main
          className={`flex-1 flex flex-col items-center justify-center p-3 relative overflow-hidden transition-all ${
            fullscreenStage ? "w-full" : ""
          }`}
        >
          {/* Responsive 16:9 Lesson Stage Container */}
          <div
            className="relative w-full max-w-[1280px] aspect-[16/9] max-h-[calc(100vh-140px)] rounded-3xl overflow-hidden shadow-2xl bg-paper border-4 border-white flex flex-col justify-between"
            id="classroom-lesson-stage"
            data-testid="classroom-stage"
            data-current-slide={slideIndex}
            data-permission-level={isTeacher ? "full_interactive" : myPermission}
            data-remote-strokes-count={remoteStrokes.length}
            data-last-remote-stroke-id={remoteStrokes[remoteStrokes.length - 1]?.id || ""}
            data-session-id={sessionId}
          >
            {/* Screen Share Overlay */}
            {screenShare && (
              <div className="absolute inset-0 z-20 bg-ink">
                <ShareView track={screenShare.track.mediaStreamTrack} />
              </div>
            )}

            {/* Lesson Theater Content */}
            {stageLesson ? (
              <div className="h-full w-full overflow-y-auto">
                <AdventureTheater
                  lesson={stageLesson}
                  embedded
                  slideIndex={slideIndex}
                  onSlideChange={handleSlideChange}
                  onExit={() => setStageLesson(null)}
                />
              </div>
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-8 text-center bg-sand/30">
                <div className="text-6xl">{lesson?.emoji ?? "🌴"}</div>
                <h2 className="wj-outline font-display text-3xl">{lesson?.title ?? "Adventure Stage"}</h2>
                <p className="font-hand text-xl text-ink-soft">{lesson?.subtitle}</p>
                {lesson && (
                  <button
                    className="wj-btn text-lg shadow-lg"
                    onClick={() => setStageLesson(lesson)}
                  >
                    🎬 Open Lesson Presentation
                  </button>
                )}
              </div>
            )}

            {/* Classroom Interactive Games Overlay */}
            {gameActive && (
              <div className="absolute inset-0 z-30 bg-slate-950/95 flex flex-col p-4">
                <div className="flex justify-end mb-2">
                  <button
                    onClick={() => setGameActive(false)}
                    className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold border border-slate-700 cursor-pointer"
                  >
                    ✕ Return to Lesson Slide
                  </button>
                </div>
                <div className="flex-1 overflow-hidden">
                  <ClassroomGames
                    lessonId={stageLesson?.id || "lesson-1"}
                    lessonTitle={stageLesson?.title || "Classroom Adventure"}
                    role={isTeacher ? "teacher" : "student"}
                    permissionLevel={myPermission}
                    sessionId={sessionId}
                    workspaceId="default-workspace"
                    onEmitGameEvent={handleEmitGameEvent}
                    incomingGameEvent={incomingGameEvent}
                  />
                </div>
              </div>
            )}

            {/* Synchronized Annotation Layer Overlay */}
            {drawingActive && (
              <AnnotationLayer
                onClose={() => setDrawingActive(false)}
                isTeacher={isTeacher}
                permission={myPermission}
                userId={room.localParticipant.identity}
                userName={currentUserName}
                userRole={isTeacher ? "teacher" : "student"}
                slideIndex={slideIndex}
                onEmitStroke={handleEmitStroke}
                onEmitPointer={handleEmitPointer}
                onClearAll={handleClearAllStrokes}
                remoteStrokes={remoteStrokes}
                remotePointers={Object.values(remotePointers)}
              />
            )}

            {/* Snapshot Saved Notification */}
            {snapshotSavedNotice && (
              <div className="absolute top-4 right-4 z-50 rounded-2xl bg-palm px-4 py-2 text-xs font-bold text-white shadow-xl animate-bounce">
                📸 Classroom Board Snapshot Saved!
              </div>
            )}
          </div>
        </main>

        {/* ── 3. Participant & Video Panel (280-320px) ──────────────── */}
        {camsVisible && !fullscreenStage && (
          <aside className="w-80 shrink-0 border-l-2 border-sand-deep bg-white flex flex-col justify-between overflow-y-auto z-20 shadow-lg">
            <div className="p-3 space-y-3">
              <h2 className="font-display text-xs font-bold text-ink-soft uppercase tracking-wider px-1">
                Live Classroom Cameras
              </h2>

              {/* Family Tile (Above) */}
              <div>
                <p className="mb-1 text-[11px] font-bold text-ink-soft flex items-center justify-between">
                  <span>👨‍👩‍👧‍👦 {familyName}</span>
                  {familyFeed && <span className="text-palm text-[10px]">🟢 Live</span>}
                </p>
                {familyFeed ? (
                  <ParticipantTile
                    participant={familyFeed}
                    isLocal={familyFeed === room.localParticipant}
                    hand={call.hands[familyFeed.identity] ?? false}
                    version={call.version}
                    tall
                  />
                ) : (
                  <div className="flex aspect-[4/3] w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-sand-deep bg-sand text-center text-ink-soft">
                    <span className="text-3xl">💙</span>
                    <span className="font-hand px-2 text-xs">Waiting for family…</span>
                  </div>
                )}
              </div>

              {/* Teacher Tile (Below) */}
              <div>
                <p className="mb-1 text-[11px] font-bold text-ink-soft flex items-center justify-between">
                  <span>👩‍🏫 {teacherName}</span>
                  {teacherFeed && <span className="text-palm text-[10px]">🟢 Host</span>}
                </p>
                {teacherFeed ? (
                  <ParticipantTile
                    participant={teacherFeed}
                    isLocal={teacherFeed === room.localParticipant}
                    hand={call.hands[teacherFeed.identity] ?? false}
                    version={call.version}
                  />
                ) : (
                  <div className="flex aspect-video w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-sand-deep bg-sand text-center text-ink-soft">
                    <span className="text-3xl">💙</span>
                    <span className="font-hand px-2 text-xs">Teacher joins soon…</span>
                  </div>
                )}
              </div>

              {/* ── Teacher-Only Permissions Control Panel ────────────── */}
              {isTeacher && (
                <div className="mt-4 rounded-2xl bg-sand p-3 border border-sand-deep space-y-2">
                  <p className="font-display text-xs font-bold text-ink">
                    👑 Student Interaction Controls
                  </p>

                  <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                    <button
                      data-testid="perm-lock-btn"
                      onClick={() => setGlobalPermission("view_only")}
                      className="rounded-lg bg-white p-1.5 font-semibold text-ink-soft hover:bg-sand-deep border border-sand-deep cursor-pointer"
                    >
                      🔒 Lock All (View)
                    </button>
                    <button
                      data-testid="perm-pointer-btn"
                      onClick={() => setGlobalPermission("pointer_only")}
                      className="rounded-lg bg-white p-1.5 font-semibold text-ocean hover:bg-sand-deep border border-sand-deep cursor-pointer"
                    >
                      👆 Pointer Only
                    </button>
                    <button
                      data-testid="perm-draw-btn"
                      onClick={() => setGlobalPermission("annotate")}
                      className="rounded-lg bg-white p-1.5 font-semibold text-palm hover:bg-sand-deep border border-sand-deep cursor-pointer"
                    >
                      ✏️ Enable Drawing
                    </button>
                    <button
                      data-testid="perm-game-btn"
                      onClick={() => setGlobalPermission("game_interactive")}
                      className="rounded-lg bg-white p-1.5 font-semibold text-mango-deep hover:bg-sand-deep border border-sand-deep cursor-pointer"
                    >
                      🎮 Game Ready
                    </button>
                  </div>

                  <div className="pt-2 border-t border-sand-deep flex gap-2">
                    <button
                      onClick={handleSaveBoardSnapshot}
                      className="flex-1 rounded-lg bg-ocean/10 p-1.5 text-[11px] font-bold text-ocean hover:bg-ocean/20 cursor-pointer"
                    >
                      📸 Save Snapshot
                    </button>
                    <button
                      onClick={handleClearAllStrokes}
                      className="rounded-lg bg-sunset/10 px-2 py-1.5 text-[11px] font-bold text-sunset hover:bg-sunset/20 cursor-pointer"
                    >
                      🗑️ Clear
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Box */}
            {chatOpen && (
              <div className="border-t-2 border-sand-deep p-3 bg-sand/30 space-y-2">
                <p className="font-display text-xs font-bold text-ink">Class Chat</p>
                <div className="max-h-28 space-y-1 overflow-y-auto text-xs">
                  {call.chat.length === 0 && (
                    <p className="text-ink-soft italic">No messages yet. 👋</p>
                  )}
                  {call.chat.map((c, i) => (
                    <p key={i} className="leading-snug">
                      <strong className="text-ocean-deep">{c.who}:</strong> {c.text}
                    </p>
                  ))}
                </div>
                <div className="flex gap-1.5">
                  <input
                    className="wj-input !py-1 !text-xs flex-1"
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && msg.trim()) {
                        call.sendChat(msg);
                        setMsg("");
                      }
                    }}
                    placeholder="Message class…"
                  />
                  <button
                    className="wj-btn !py-1 !px-2.5 text-xs"
                    onClick={() => {
                      if (msg.trim()) {
                        call.sendChat(msg);
                        setMsg("");
                      }
                    }}
                  >
                    Send
                  </button>
                </div>
              </div>
            )}
          </aside>
        )}
      </div>

      {/* ── 4. Bottom Interaction Tool Rail ───────────────────────── */}
      <footer className="h-14 shrink-0 border-t-2 border-sand-deep bg-white px-4 flex items-center justify-center gap-3 z-30 shadow-md">
        <button
          onClick={call.toggleMic}
          className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
            call.micOn ? "bg-palm text-white" : "bg-sunset/10 text-sunset"
          }`}
        >
          {call.micOn ? "🎤 Mic On" : "🔇 Muted"}
        </button>

        <button
          onClick={call.toggleCam}
          className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
            call.camOn ? "bg-ocean text-white" : "bg-sand-deep text-ink-soft"
          }`}
        >
          {call.camOn ? "📷 Video On" : "📷 Video Off"}
        </button>

        <button
          onClick={call.toggleShare}
          className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
            call.sharing ? "bg-mango text-white" : "bg-sand text-ink hover:bg-sand-deep"
          }`}
        >
          🖥️ Screen Share
        </button>

        {/* Whiteboard / Annotation Toggle */}
        <button
          data-testid="classroom-draw-toggle-btn"
          onClick={() => setDrawingActive((d) => !d)}
          className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold transition-all cursor-pointer ${
            drawingActive
              ? "bg-ocean-deep text-white ring-2 ring-ocean shadow-md scale-105"
              : "bg-sand text-ink hover:bg-sand-deep"
          }`}
        >
          ✏️ Draw &amp; Annotate
        </button>

        <button
          onClick={call.toggleHand}
          className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
            call.myHand ? "bg-mango text-white" : "bg-sand text-ink hover:bg-sand-deep"
          }`}
        >
          ✋ Raise Hand
        </button>

        <button
          onClick={() => setChatOpen((c) => !c)}
          className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
            chatOpen ? "bg-ocean text-white" : "bg-sand text-ink hover:bg-sand-deep"
          }`}
        >
          💬 Chat
        </button>
      </footer>

      {/* ── 5. Media Credits Modal ────────────────────────────────── */}
      <MediaCreditsModal
        isOpen={showMediaModal}
        onClose={() => setShowMediaModal(false)}
        mediaList={stageMediaList}
        lessonTitle={stageLesson?.title || "Lesson Media"}
      />
    </div>
  );
}

/* ── Solo Room Fallback ─────────────────────────────────────── */
function SoloRoom({
  lesson,
  isGuest = false,
  onGoLive,
  onLeave,
}: {
  lesson: Lesson | null;
  isGuest?: boolean;
  onGoLive: () => void;
  onLeave: () => void;
}) {
  const call = useCall();
  const [stageLesson, setStageLesson] = useState<Lesson | null>(lesson);
  const [drawing, setDrawing] = useState(false);
  const soloVideoRef = useRef<HTMLVideoElement>(null);
  const [showMediaModal, setShowMediaModal] = useState(false);

  const mediaList = useMemo(() => {
    if (!stageLesson) return [];
    return getMediaForLesson(stageLesson.id);
  }, [stageLesson]);

  useEffect(() => {
    if (soloVideoRef.current && call.soloStream) {
      soloVideoRef.current.srcObject = call.soloStream;
      void soloVideoRef.current.play().catch(() => {});
    }
  }, [call.soloStream]);

  return (
    <div className="flex flex-col h-[100dvh] w-[100vw] overflow-hidden bg-sand-deep text-ink">
      <header className="flex h-14 shrink-0 items-center justify-between border-b-2 border-sand-deep bg-white px-4 shadow-sm z-30">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌴</span>
          <h1 className="font-display text-base font-bold">
            {stageLesson ? `${stageLesson.emoji} ${stageLesson.title}` : "Wonder Journey Classroom"}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowMediaModal(true)}
            className="rounded-full bg-sand px-3 py-1 text-xs font-semibold text-ocean border border-ocean/20 cursor-pointer"
          >
            ℹ️ Media Credits ({mediaList.length})
          </button>
          <button
            onClick={onLeave}
            className="rounded-full bg-hibiscus px-4 py-1.5 font-display text-xs font-bold text-white shadow cursor-pointer"
          >
            📞 Leave
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-3 relative overflow-hidden">
        <div className="relative w-full max-w-[1280px] aspect-[16/9] max-h-[calc(100vh-140px)] rounded-3xl overflow-hidden shadow-2xl bg-paper border-4 border-white flex flex-col justify-between">
          {stageLesson ? (
            <div className="h-full w-full overflow-y-auto">
              <AdventureTheater lesson={stageLesson} embedded onExit={() => setStageLesson(null)} />
            </div>
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-8 text-center bg-sand/30">
              <div className="text-6xl">{lesson?.emoji ?? "🌴"}</div>
              <h2 className="wj-outline font-display text-3xl">{lesson?.title ?? "Adventure Stage"}</h2>
              {lesson && (
                <button className="wj-btn text-lg shadow-lg" onClick={() => setStageLesson(lesson)}>
                  🎬 Open Lesson Presentation
                </button>
              )}
            </div>
          )}

          {drawing && <AnnotationLayer onClose={() => setDrawing(false)} isTeacher={true} />}
        </div>
      </main>

      <footer className="h-14 shrink-0 border-t-2 border-sand-deep bg-white px-4 flex items-center justify-center gap-3 z-30 shadow-md">
        <button
          onClick={() => setDrawing((d) => !d)}
          className="rounded-full bg-ocean px-4 py-1.5 text-xs font-bold text-white shadow cursor-pointer"
        >
          ✏️ Draw &amp; Annotate
        </button>
        <button
          onClick={onGoLive}
          className="rounded-full bg-palm px-4 py-1.5 text-xs font-bold text-white shadow cursor-pointer"
        >
          🚀 Go Live Together
        </button>
      </footer>

      <MediaCreditsModal
        isOpen={showMediaModal}
        onClose={() => setShowMediaModal(false)}
        mediaList={mediaList}
        lessonTitle={stageLesson?.title || "Lesson Media"}
      />
    </div>
  );
}

/* ── Camera Hooks and Utilities ────────────────────────────── */
function useLocalCamera(initial?: { camId?: string; micId?: string; camOn?: boolean; micOn?: boolean }) {
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [camId, setCamId] = useState(initial?.camId ?? "");
  const [micId, setMicId] = useState(initial?.micId ?? "");
  const [camOn, setCamOn] = useState(initial?.camOn ?? true);
  const [micOn, setMicOn] = useState(initial?.micOn ?? true);
  const [cams, setCams] = useState<{ id: string; label: string }[]>([]);
  const [mics, setMics] = useState<{ id: string; label: string }[]>([]);
  const [tick, setTick] = useState(0);

  const start = useCallback(async () => {
    try {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      const s = await navigator.mediaDevices.getUserMedia({
        video: camId ? { deviceId: { exact: camId } } : true,
        audio: micId ? { deviceId: { exact: micId } } : true,
      });
      streamRef.current = s;
      s.getVideoTracks().forEach((t) => (t.enabled = camOn));
      s.getAudioTracks().forEach((t) => (t.enabled = micOn));
      setError(null);
      setTick((t) => t + 1);

      const devs = await navigator.mediaDevices.enumerateDevices();
      setCams(
        devs
          .filter((d) => d.kind === "videoinput")
          .map((d, i) => ({ id: d.deviceId, label: d.label || `Camera ${i + 1}` }))
      );
      setMics(
        devs
          .filter((d) => d.kind === "audioinput")
          .map((d, i) => ({ id: d.deviceId, label: d.label || `Microphone ${i + 1}` }))
      );
    } catch {
      setError("Please allow camera and microphone access so Teacher Guide and the family can see you! 💙");
    }
  }, [camId, micId, camOn, micOn]);

  useEffect(() => {
    void start();
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, [start]);

  return {
    streamRef,
    error,
    camId,
    setCamId,
    micId,
    setMicId,
    camOn,
    toggleCam: () => setCamOn((v) => !v),
    micOn,
    toggleMic: () => setMicOn((v) => !v),
    cams,
    mics,
    start,
    tick,
  };
}

function LocalCameraView({
  streamRef,
  camOn,
  tick,
  className = "",
  label,
}: {
  streamRef: React.RefObject<MediaStream | null>;
  camOn: boolean;
  tick: number;
  className?: string;
  label: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (ref.current && streamRef.current) {
      ref.current.srcObject = streamRef.current;
      void ref.current.play().catch(() => {});
    }
  }, [streamRef, tick]);

  return (
    <div className={`relative ${className} bg-ink overflow-hidden flex items-center justify-center`}>
      <video ref={ref} autoPlay muted playsInline className={`h-full w-full object-cover ${camOn ? "" : "hidden"}`} />
      {!camOn && <CameraOffTile />}
      <span className="absolute bottom-2 left-2 rounded-full bg-ink/70 px-2.5 py-0.5 text-xs font-bold text-white">
        {label} (you)
      </span>
    </div>
  );
}

function ParticipantTile({
  participant,
  isLocal,
  hand,
  version,
  tall = false,
}: {
  participant: Participant;
  isLocal: boolean;
  hand: boolean;
  version: number;
  tall?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const camPub = participant.getTrackPublication(Track.Source.Camera);
  const micPub = participant.getTrackPublication(Track.Source.Microphone);
  const camTrack = camPub?.track;
  const micTrack = micPub?.track;

  useEffect(() => {
    if (camTrack && videoRef.current) camTrack.attach(videoRef.current);
    if (!isLocal && micTrack && audioRef.current) micTrack.attach(audioRef.current);
    return () => {
      camTrack?.detach();
      micTrack?.detach();
    };
  }, [camTrack, micTrack, isLocal]);

  const camLive = !!camPub?.track && !camPub.isMuted;
  void version;
  const muted = !micPub?.track || micPub.isMuted;

  return (
    <div
      className={`relative ${
        tall ? "aspect-[4/3]" : "aspect-video"
      } w-full overflow-hidden rounded-2xl bg-ink shadow ${
        participant.isSpeaking ? "ring-4 ring-mango" : ""
      }`}
    >
      <video
        ref={videoRef}
        autoPlay
        muted={isLocal}
        playsInline
        className={`h-full w-full object-cover ${camLive ? "" : "hidden"}`}
      />
      {!isLocal && <audio ref={audioRef} autoPlay />}
      {!camLive && <CameraOffTile />}
      <span className="absolute bottom-2 left-2 rounded-full bg-ink/70 px-2.5 py-0.5 text-xs font-bold text-white">
        {participant.name || participant.identity}
        {isLocal ? " (you)" : ""}
        {hand ? " ✋" : ""}
        {muted ? " 🔇" : ""}
      </span>
    </div>
  );
}

function ShareView({ track }: { track: MediaStreamTrack }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.srcObject = new MediaStream([track]);
      void ref.current.play().catch(() => {});
    }
  }, [track]);
  return <video ref={ref} autoPlay playsInline className="h-full w-full bg-ink object-contain" />;
}
