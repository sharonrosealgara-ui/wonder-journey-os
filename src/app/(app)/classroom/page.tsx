"use client";

import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ConnectionState, Participant, Track } from "livekit-client";
import { AnnotationLayer } from "@/components/adventure/annotation-layer";
import { CameraOffTile } from "@/components/friendly-avatar";
import { AdventureTheater } from "@/components/adventure/theater";
import { familyName, familySlug, getStudent, teacherName } from "@/config/family";
import { getTodaysLesson, lessons as allLessons, type Lesson } from "@/config/lessons";
import type { Mode } from "@/config/navigation";
import { normalizeMode } from "@/config/navigation";
import { KEYS, todayISO } from "@/lib/app-state";
import { getScreenShare, participantRole, useCall } from "@/lib/call-context";
import { initCloudSync, sendEvent } from "@/lib/cloud-sync";
import { readStored, useStored } from "@/lib/storage";
import { useAuth } from "@/lib/auth-context";

// ≡ƒÄÑ LIVE ADVENTURE CLASSROOM
// The call itself lives in the global CallProvider (app-shell), so it
// follows the family across every page. This page is the full-size
// room: lesson stage + camera rail + teaching toolbar.
// Solo mode (no/wrong class code) still gives a working local camera.

type Device = { id: string; label: string };

export default function ClassroomPage() {
  const { role } = useAuth();
  const call = useCall();
  const router = useRouter();
  const [activeStudentId] = useStored<string | null>(KEYS.activeStudent, null);
  const student = getStudent(activeStudentId);
  const [name, setName] = useState("");
  // the code is entered once at the front door (AccessGate) ΓÇö never here
  const [classCode] = useStored<string>("classCode", "");
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [joinError, setJoinError] = useState<string | null>(null);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    setLesson(getTodaysLesson());
  }, []);
  useEffect(() => {
    // If teacher, authoritative name is Teacher Sharon. Do not leak Family displayName.
    if (role === "teacher") {
      setName(teacherName);
    } else {
      const doorName = readStored<string>("displayName", "");
      setName(doorName || (student ? student.name : familyName));
    }
  }, [student, role]);

  // ONE stable classroom per family ΓÇö never date- or lesson-derived, so
  // the teacher (in the Philippines) and the family (in the US) always
  // land in the SAME room even when it's a different calendar day on
  // each side. A family's classroom is like a personal meeting room.
  const roomName = `wj-room-${familySlug}`;

  async function join(devices: { camId: string; micId: string; camOn: boolean; micOn: boolean }) {
    setJoinError(null);
    setJoining(true);
    const result = await call.join({
      name,
      code: classCode,
      role: role === "teacher" ? "teacher" : "family",
      roomName,
      ...devices,
    });
    setJoining(false);
    if (result === "wrong_code") {
      setJoinError("That class code doesn't match ΓÇö please check it with Teacher Sharon. ≡ƒÆ¢");
      return;
    }
    if (result === "error") {
      setJoinError("We couldn't reach your camera. Please allow camera & microphone access and try again.");
      return;
    }
    initCloudSync();
    if (result === "connected") sendEvent("class.joined", { who: name, room: roomName });
  }

  // END CALL ΓÇö the only action that disconnects. Back to Home Base.
  function endCall() {
    if (call.status === "connected") sendEvent("class.ended", { who: name, room: roomName });
    call.endCall();
    router.push("/family");
  }

  if (call.status === "connected" && call.room) {
    return <ConnectedRoom lesson={lesson} onLeave={endCall} />;
  }
  if (call.status === "solo") {
    return (
      <SoloRoom
        lesson={lesson}
        isGuest={readStored<boolean>("guest", false)}
        onGoLive={() =>
          join({ camId: "", micId: "", camOn: call.camOn, micOn: call.micOn })
        }
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
    />
  );
}

/* ΓöÇΓöÇ Local camera (lobby preview) ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */
function useLocalCamera(initial?: { camId?: string; micId?: string; camOn?: boolean; micOn?: boolean }) {
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cams, setCams] = useState<Device[]>([]);
  const [mics, setMics] = useState<Device[]>([]);
  const [camId, setCamId] = useStored("wj-cam-id", initial?.camId ?? "");
  const [micId, setMicId] = useStored("wj-mic-id", initial?.micId ?? "");
  const [camOn, setCamOn] = useStored("wj-cam-on", initial?.camOn ?? true);
  const [micOn, setMicOn] = useStored("wj-mic-on", initial?.micOn ?? true);
  const [ready, setReady] = useState(false);
  const [tick, setTick] = useState(0);

  const start = useCallback(async () => {
    try {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      const stream = await navigator.mediaDevices.getUserMedia({
        video: camId ? { deviceId: { exact: camId } } : true,
        audio: micId ? { deviceId: { exact: micId } } : true,
      });
      streamRef.current = stream;
      stream.getVideoTracks().forEach((t) => (t.enabled = camOn));
      stream.getAudioTracks().forEach((t) => (t.enabled = micOn));
      const devices = await navigator.mediaDevices.enumerateDevices();
      setCams(devices.filter((d) => d.kind === "videoinput").map((d, i) => ({ id: d.deviceId, label: d.label || `Camera ${i + 1}` })));
      setMics(devices.filter((d) => d.kind === "audioinput").map((d, i) => ({ id: d.deviceId, label: d.label || `Microphone ${i + 1}` })));
      setError(null);
      setReady(true);
      setTick((t) => t + 1);
    } catch {
      setError("We couldn't reach your camera. Please allow camera & microphone access, then tap Retry.");
      setReady(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [camId, micId]);

  useEffect(() => {
    void start();
    return () => streamRef.current?.getTracks().forEach((t) => t.stop());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [camId, micId]);

  function toggleCam() {
    setCamOn((v) => {
      const nv = !v;
      streamRef.current?.getVideoTracks().forEach((t) => (t.enabled = nv));
      return nv;
    });
  }
  function toggleMic() {
    setMicOn((v) => {
      const nv = !v;
      streamRef.current?.getAudioTracks().forEach((t) => (t.enabled = nv));
      return nv;
    });
  }
  function stop() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }

  return { streamRef, error, cams, mics, camId, setCamId, micId, setMicId, camOn, micOn, toggleCam, toggleMic, ready, start, stop, tick };
}

function LocalCameraView({ streamRef, camOn, tick, label, className = "" }: {
  streamRef: React.MutableRefObject<MediaStream | null>;
  camOn: boolean;
  tick: number;
  label?: string;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      void videoRef.current.play().catch(() => {});
    }
  }, [streamRef, tick]);
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-ink ${className}`}>
      <video ref={videoRef} autoPlay muted playsInline className={`h-full w-full object-cover ${camOn ? "" : "hidden"}`} />
      {!camOn && (
        <CameraOffTile />
      )}
      {label && (
        <span className="absolute bottom-2 left-2 rounded-full bg-ink/70 px-2.5 py-0.5 text-xs font-bold text-white">{label}</span>
      )}
    </div>
  );
}

/* ΓöÇΓöÇ Pre-join lobby ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */
function Lobby({ name, setName, lesson, joining, joinError, onJoin }: {
  name: string;
  setName: (s: string) => void;
  lesson: Lesson | null;
  joining: boolean;
  joinError: string | null;
  onJoin: (d: { camId: string; micId: string; camOn: boolean; micOn: boolean }) => void;
}) {
  const cam = useLocalCamera();
  const [level, setLevel] = useState(0);

  useEffect(() => {
    if (!cam.ready || !cam.streamRef.current) return;
    let raf = 0;
    let ctx: AudioContext | null = null;
    try {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      ctx = new AC();
      const src = ctx.createMediaStreamSource(cam.streamRef.current);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      src.connect(analyser);
      const data = new Uint8Array(analyser.frequencyBinCount);
      const loop = () => {
        analyser.getByteFrequencyData(data);
        setLevel(Math.min(100, Math.round((data.reduce((a, b) => a + b, 0) / data.length / 128) * 100)));
        raf = requestAnimationFrame(loop);
      };
      loop();
    } catch { /* ignore */ }
    return () => { cancelAnimationFrame(raf); void ctx?.close(); };
  }, [cam.ready, cam.tick, cam.streamRef]);

  function handleJoin() {
    const d = { camId: cam.camId, micId: cam.micId, camOn: cam.camOn, micOn: cam.micOn };
    cam.stop(); // release devices so LiveKit (or solo room) can take them
    onJoin(d);
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="text-center">
        <div className="mb-2 text-4xl">≡ƒÄÑ≡ƒî┤</div>
        <h1 className="wj-outline font-display text-3xl sm:text-4xl">Live Adventure Classroom</h1>
        <p className="font-hand mt-1 text-lg text-ink-soft">Mabuhay, {familyName}! Let&apos;s get you ready. ≡ƒÆ¢</p>
      </div>

      <div className="grid gap-6 md:grid-cols-[1.3fr_1fr]">
        <div className="wj-card overflow-hidden p-3">
          <LocalCameraView streamRef={cam.streamRef} camOn={cam.camOn} tick={cam.tick} className="aspect-video w-full" label={name} />
          {cam.error && (
            <div className="mt-3 rounded-2xl bg-hibiscus/10 p-3 text-sm text-hibiscus-deep">
              {cam.error}
              <button className="wj-btn wj-btn-ghost mt-2 text-sm" onClick={() => void cam.start()}>Retry</button>
            </div>
          )}
          <div className="mt-3 flex items-center justify-center gap-3">
            <button className={`wj-btn ${cam.camOn ? "wj-btn-ocean" : "wj-btn-ghost"} !px-4`} onClick={cam.toggleCam}>
              {cam.camOn ? "≡ƒô╖ Camera On" : "≡ƒô╖ Camera Off"}
            </button>
            <button className={`wj-btn ${cam.micOn ? "wj-btn-ocean" : "wj-btn-ghost"} !px-4`} onClick={cam.toggleMic}>
              {cam.micOn ? "≡ƒÄñ Mic On" : "≡ƒöç Mic Off"}
            </button>
          </div>
          <div className="mt-3">
            <p className="text-xs font-bold text-ink-soft">Microphone</p>
            <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-sand-deep">
              <div className="h-full rounded-full bg-gradient-to-r from-palm to-mango transition-[width] duration-100" style={{ width: `${cam.micOn ? level : 0}%` }} />
            </div>
          </div>
        </div>

        <div className="wj-card space-y-4 p-5">
          <div>
            <label className="text-sm font-bold text-ink-soft">Your name in class</label>
            <input className="wj-input mt-1" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-bold text-ink-soft">≡ƒô╖ Camera</label>
            <select className="wj-input mt-1" value={cam.camId} onChange={(e) => cam.setCamId(e.target.value)}>
              {cam.cams.length === 0 && <option>Default camera</option>}
              {cam.cams.map((c) => (<option key={c.id} value={c.id}>{c.label}</option>))}
            </select>
          </div>
          <div>
            <label className="text-sm font-bold text-ink-soft">≡ƒÄñ Microphone</label>
            <select className="wj-input mt-1" value={cam.micId} onChange={(e) => cam.setMicId(e.target.value)}>
              {cam.mics.length === 0 && <option>Default microphone</option>}
              {cam.mics.map((m) => (<option key={m.id} value={m.id}>{m.label}</option>))}
            </select>
          </div>
          <div className="rounded-2xl bg-sand p-3 text-sm text-ink-soft">
            <p className="font-bold">Today&apos;s Adventure</p>
            <p className="font-hand text-base">{lesson ? `${lesson.emoji} ${lesson.title}` : "Loading..."}</p>
          </div>
          {joinError && <p className="rounded-2xl bg-hibiscus/10 p-3 text-sm font-bold text-hibiscus-deep">{joinError}</p>}
          <button className="wj-btn w-full text-lg" onClick={handleJoin} disabled={joining}>
            {joining ? "ConnectingΓÇª ≡ƒîÉ" : "≡ƒÜÇ Join the Adventure"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ΓöÇΓöÇ LiveKit connected classroom (shared call context) ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */
function ConnectedRoom({ lesson, onLeave }: {
  lesson: Lesson | null;
  onLeave: () => void;
}) {
  const call = useCall();
  const room = call.room!;
  const isTeacher = call.isTeacher;
  const [chatOpen, setChatOpen] = useState(false);
  const [msg, setMsg] = useState("");
  // The lesson opens INSIDE the stage ΓÇö the route never changes, so the
  // LiveKit room, cameras, and toolbar are never unmounted.
  const [stageLesson, setStageLesson] = useState<Lesson | null>(null);
  const [wrapUp, setWrapUp] = useState(false); // Adventure Wrap-Up: lesson done, call stays alive
  const [camsVisible, setCamsVisible] = useState(true); // explicit "Hide video" only
  const [enlarged, setEnlarged] = useState<string | null>(null); // participant identity, pinned big
  const [drawing, setDrawing] = useState(false); // whiteboard over the stage
  const [tvMode, setTvMode] = useStored<boolean>("wj-tv-mode", false); // TV Mode scales typography and contrast
  const [showDiagnostics, setShowDiagnostics] = useState(false);

  // FINISH LESSON ΓÇö closes the presentation only. The LiveKit room,
  // cameras, and microphones stay connected for the wrap-up chat.
  function finishLesson() {
    setStageLesson(null);
    setWrapUp(true);
    if (lesson) sendEvent("lesson.finished", { lessonId: lesson.id, title: lesson.title });
  }

  const everyone = call.participants;
  const screenShare = getScreenShare(everyone);

  function send() {
    if (!msg.trim()) return;
    call.sendChat(msg);
    setMsg("");
  }

  const stateChip =
    call.connState === ConnectionState.Reconnecting ? "≡ƒƒí ReconnectingΓÇª" :
    call.connState === ConnectionState.Connected ? "≡ƒƒó Live" : "≡ƒö┤ ConnectingΓÇª";

  // ΓöÇΓöÇ EXACTLY TWO CAMERAS (Sharon's rule): one Teacher, one Family.
  // Each tile is picked by ROLE ΓÇö the server decided it from the code
  // (two-code system) ΓÇö so it never matters which device this is, and a
  // stray extra connection can never appear as a third camera.
  const familyFeed = everyone.find((p) => participantRole(p) === "family") ?? null;
  const teacherFeed = everyone.find((p) => participantRole(p) === "teacher") ?? null;
  const enlargedP = enlarged ? everyone.find((p) => p.identity === enlarged) ?? null : null;

  return (
    <div className={`space-y-3 ${tvMode ? "tv-mode scale-[1.02] origin-top contrast-125 transition-transform" : "transition-transform"}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="wj-chip">{stateChip} ┬╖ {everyone.length} in class</span>
        <div className="flex items-center gap-2">
          {isTeacher && (
            <button className={`wj-chip hover:bg-mango/20 ${showDiagnostics ? "!bg-mango" : ""}`} onClick={() => setShowDiagnostics((d) => !d)} title="View connection diagnostics">
              ≡ƒôí Diagnostics
            </button>
          )}
          <span className="wj-chip">≡ƒÄÑ {lesson ? `${lesson.emoji} ${lesson.title}` : "Adventure"}</span>
          <button className="wj-chip hover:bg-mango/20" onClick={() => setTvMode((v) => !v)} title="Toggle TV Mode (bigger text, high contrast)">
            {tvMode ? "≡ƒô║ TV Mode: On" : "≡ƒô║ TV Mode"}
          </button>
          <button className="wj-chip hover:bg-mango/20" onClick={() => setCamsVisible((v) => !v)} title={camsVisible ? "Hide video" : "Show video"}>
            {camsVisible ? "≡ƒæÑ Hide video" : "≡ƒæÑ Show video"}
          </button>
        </div>
      </div>

      {/* Focused teaching room: LESSON STAGE (75%) left ┬╖ CAMERA RAIL (25%) right.
          Family camera ABOVE teacher camera (Decision 044). On small screens
          the lesson leads and the rail stacks beneath it ΓÇö family still first. */}
      <div className={`grid grid-cols-1 gap-3 ${camsVisible ? "lg:grid-cols-[3fr_1fr]" : ""} lg:items-start`}>
        {/* stage ΓÇö lessons open here; the shell around it never unmounts */}
        <div
          className={`wj-card relative overflow-hidden p-0 ${
            stageLesson ? "h-[74vh] lg:h-[78vh]" : "flex min-h-[46vh] items-center justify-center lg:h-[78vh]"
          }`}
        >
          {/* screen share overlays the stage; the lesson stays mounted */}
          {screenShare && (
            <div className="absolute inset-0 z-20 bg-ink">
              <ShareView track={screenShare.track.mediaStreamTrack} />
            </div>
          )}
          {stageLesson ? (
            <LessonBoundary onReturnToWrapUp={finishLesson}>
              <AdventureTheater lesson={stageLesson} embedded onExit={finishLesson} />
            </LessonBoundary>
          ) : wrapUp ? (
            <WrapUpPanel
              lesson={lesson}
              quizResult={null}
              onReopen={() => {
                if (lesson) {
                  setWrapUp(false);
                  setStageLesson(lesson);
                }
              }}
              onEndCall={onLeave}
            />
          ) : (
            <div className="flex flex-col items-center gap-4 overflow-y-auto p-8 text-center">
              <div className="text-6xl">{lesson?.emoji ?? "≡ƒî┤"}</div>
              <h2 className="wj-outline font-display text-2xl sm:text-3xl">{lesson?.title ?? "Today's Adventure"}</h2>
              <p className="font-hand text-lg text-ink-soft">{lesson?.subtitle}</p>
              {lesson && (
                <button className="wj-btn text-lg" onClick={() => setStageLesson(lesson)}>
                  ≡ƒÄ¼ Open the Adventure
                </button>
              )}
              {isTeacher && <p className="text-xs text-ink-soft">The lesson opens right here ΓÇö cameras stay on. Or share your screen ≡ƒæç</p>}
            </div>
          )}

          {/* whiteboard over the whole stage (slides, maps, shares) */}
          {drawing && <AnnotationLayer onClose={() => setDrawing(false)} />}

          {/* pinned/enlarged camera overlay ΓÇö cameras over the lesson on demand */}
          {enlargedP && (
            <div className="absolute bottom-3 right-3 z-40 w-72 max-w-[70%] sm:w-96">
              <ParticipantTile
                participant={enlargedP}
                isLocal={enlargedP === room.localParticipant}
                hand={call.hands[enlargedP.identity] ?? false}
                version={call.version}
                onClick={() => setEnlarged(null)}
              />
              <p className="mt-1 text-center text-[10px] font-bold text-white drop-shadow">tap to unpin</p>
            </div>
          )}

          {/* Diagnostics Panel (Teacher Only) */}
          {isTeacher && showDiagnostics && (
            <div className="absolute top-3 left-3 z-50 rounded-xl bg-ink/80 p-3 text-xs text-white backdrop-blur">
              <p className="font-bold text-mango mb-1">LiveKit Connection Diagnostics</p>
              <p>Room: {room.name}</p>
              <p>State: {call.connState}</p>
              <p>Connection: {room.state === ConnectionState.Connected ? "Connected" : room.state}</p>
              <div className="mt-2 border-t border-white/20 pt-2">
                <p className="font-bold">Participants ({everyone.length}):</p>
                {everyone.map(p => (
                  <p key={p.identity}>
                    - {p.identity}: {p.connectionQuality} (Video: {p.getTrackPublication(Track.Source.Camera)?.isMuted ? "Muted" : "On"})
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ΓöÇΓöÇ CAMERA RAIL: ≡ƒæ¿ΓÇì≡ƒæ⌐ΓÇì≡ƒæºΓÇì≡ƒæª Family ABOVE ≡ƒæ⌐ΓÇì≡ƒÅ½ Teacher ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */}
        {camsVisible && (
          <div className="flex flex-col gap-3 lg:sticky lg:top-3">
            {/* Family first ΓÇö slightly more prominent so the teacher can
                watch all four children clearly */}
            <div>
              <p className="mb-1 text-center text-[11px] font-bold uppercase tracking-wide text-ink-soft">≡ƒæ¿ΓÇì≡ƒæ⌐ΓÇì≡ƒæºΓÇì≡ƒæª {familyName}</p>
              {familyFeed ? (
                <ParticipantTile
                  participant={familyFeed}
                  isLocal={familyFeed === room.localParticipant}
                  hand={call.hands[familyFeed.identity] ?? false}
                  version={call.version}
                  tall
                  onClick={() => setEnlarged(familyFeed.identity)}
                />
              ) : (
                <div className="flex aspect-[4/3] w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-sand-deep bg-sand text-center text-ink-soft">
                  <span className="text-3xl">≡ƒÆ¢</span>
                  <span className="font-hand px-2 text-sm">Waiting for the family to joinΓÇª</span>
                </div>
              )}
            </div>

            {/* Teacher below ΓÇö exactly one tile, never a third camera */}
            <div>
              <p className="mb-1 text-center text-[11px] font-bold uppercase tracking-wide text-ink-soft">≡ƒæ⌐ΓÇì≡ƒÅ½ {teacherName}</p>
              {teacherFeed ? (
                <ParticipantTile
                  participant={teacherFeed}
                  isLocal={teacherFeed === room.localParticipant}
                  hand={call.hands[teacherFeed.identity] ?? false}
                  version={call.version}
                  onClick={() => setEnlarged(teacherFeed.identity)}
                />
              ) : (
                <div className="flex aspect-video w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-sand-deep bg-sand text-center text-ink-soft">
                  <span className="text-3xl">≡ƒÆ¢</span>
                  <span className="font-hand px-2 text-sm">{teacherName} joins soonΓÇª</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {chatOpen && (
        <div className="wj-card p-4">
          <p className="font-display">≡ƒÆ¼ Class Chat</p>
          <div className="mt-2 max-h-32 space-y-1 overflow-y-auto text-sm">
            {call.chat.length === 0 && <p className="font-hand text-ink-soft">Say hello to the family! ≡ƒæï</p>}
            {call.chat.map((c, i) => (<p key={i}><b>{c.who}:</b> {c.text}</p>))}
          </div>
          <div className="mt-2 flex gap-2">
            <input className="wj-input" value={msg} onChange={(e) => setMsg(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Type a messageΓÇª" />
            <button className="wj-btn" onClick={send}>Send</button>
          </div>
        </div>
      )}

      {/* TEACHING TOOLBAR ΓÇö only class tools, no dashboard navigation */}
      <div className="wj-card sticky bottom-2 z-10 flex flex-wrap items-center justify-center gap-2 p-3">
        <ToolBtn onClick={call.toggleMic} active={call.micOn} label={call.micOn ? "≡ƒÄñ Mic" : "≡ƒöç Muted"} />
        <ToolBtn onClick={call.toggleCam} active={call.camOn} label={call.camOn ? "≡ƒô╖ Cam" : "≡ƒô╖ Off"} />
        <ToolBtn onClick={call.toggleShare} active={call.sharing} label="≡ƒûÑ∩╕Å Share" />
        <ToolBtn onClick={() => setDrawing((d) => !d)} active={drawing} label="Γ£Å∩╕Å Draw" />
        <ToolBtn onClick={call.toggleHand} active={call.myHand} label="Γ£ï Hand" />
        <ToolBtn onClick={() => setChatOpen((c) => !c)} active={chatOpen} label="≡ƒÆ¼ Chat" />
        <span className="mx-1 hidden h-6 w-px bg-sand-deep sm:block" />
        {/* same pill geometry as every tool ΓÇö colour fill marks the special ones */}
        {isTeacher && stageLesson && (
          <button
            className="rounded-full bg-ocean px-4 py-2 font-display text-sm text-white transition-colors hover:bg-ocean-deep"
            onClick={finishLesson}
          >
            ≡ƒÅü Finish Lesson
          </button>
        )}
        <button
          className="rounded-full bg-hibiscus px-4 py-2 font-display text-sm text-white transition-[filter] hover:brightness-95"
          onClick={onLeave}
          title="Disconnects the call and returns to Home Base"
        >
          ≡ƒô₧ End Call
        </button>
      </div>
    </div>
  );
}

/* ΓöÇΓöÇ Adventure Wrap-Up: lesson finished, cameras stay on ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */
function WrapUpPanel({ lesson, quizResult, onReopen, onEndCall }: {
  lesson: Lesson | null;
  quizResult: { score: number; total: number } | null;
  onReopen: () => void;
  onEndCall: () => void;
}) {
  const next = lesson ? allLessons.find((l) => l.order === lesson.order + 1) : null;
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 overflow-y-auto p-6 text-center">
      <div className="text-5xl">≡ƒîà</div>
      <h2 className="wj-outline font-display text-2xl sm:text-3xl">Wonderful work today!</h2>
      <p className="font-hand text-lg text-ink-soft">
        {lesson ? `${lesson.emoji} ${lesson.title} ΓÇö adventure complete!` : "Adventure complete!"}
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        {quizResult && <span className="wj-chip">≡ƒºá Quiz: {quizResult.score}/{quizResult.total}</span>}
        {lesson?.destinationId && <span className="wj-chip">≡ƒ¢é Passport stamp earned</span>}
        <span className="wj-chip">≡ƒôö Journal saved</span>
      </div>
      {next && (
        <p className="font-hand rounded-2xl bg-sand px-4 py-2 text-base text-ink-soft">
          Next adventure: <b>{next.emoji} {next.title}</b> ┬╖ {next.date}
        </p>
      )}
      <p className="font-hand text-base text-ink-soft">
        Stay and chat as long as you like ΓÇö the call is still on. ≡ƒÆ¢
      </p>
      <div className="mt-1 flex flex-wrap justify-center gap-3">
        <button className="wj-btn wj-btn-ghost text-sm" onClick={onReopen}>Γå⌐∩╕Å Reopen the lesson</button>
        <button className="wj-btn wj-btn-hibiscus" onClick={onEndCall}>≡ƒô₧ End Call</button>
      </div>
    </div>
  );
}

/* ΓöÇΓöÇ Failsafe: a lesson crash must never end the call ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */
class LessonBoundary extends React.Component<
  { children: React.ReactNode; onReturnToWrapUp: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-6 text-center">
        <div className="text-4xl">≡ƒ¢╢</div>
        <h2 className="font-display text-xl">That lesson page hit a wave ΓÇö but the call is still on!</h2>
        <p className="font-hand text-ink-soft">Cameras and microphones are untouched. You can keep talking.</p>
        <div className="flex gap-3">
          <button className="wj-btn wj-btn-ghost text-sm" onClick={() => this.setState({ failed: false })}>≡ƒöä Retry Lesson</button>
          <button className="wj-btn text-sm" onClick={this.props.onReturnToWrapUp}>Return to Wrap-Up</button>
        </div>
      </div>
    );
  }
}

function ParticipantTile({ participant, isLocal, hand, version, onClick, tall = false }: {
  participant: Participant;
  isLocal: boolean;
  hand: boolean;
  version: number;
  onClick?: () => void;
  tall?: boolean; // family tile gets slightly more visual prominence
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const camPub = participant.getTrackPublication(Track.Source.Camera);
  const micPub = participant.getTrackPublication(Track.Source.Microphone);
  const camTrack = camPub?.track;
  const micTrack = micPub?.track;

  // ΓÜá∩╕Å Anti-glitch fix: attach/detach only when the TRACK ITSELF changes,
  // never on `version` (which also bumps on ActiveSpeakersChanged, firing
  // ~every second for the whole room). Re-attaching that often tore down
  // and rebuilt the live video every second ΓÇö the flicker/freeze both
  // sides were seeing during class.
  useEffect(() => {
    if (camTrack && videoRef.current) camTrack.attach(videoRef.current);
    if (!isLocal && micTrack && audioRef.current) micTrack.attach(audioRef.current);
    return () => {
      camTrack?.detach();
      micTrack?.detach();
    };
  }, [camTrack, micTrack, isLocal]);

  const camLive = !!camPub?.track && !camPub.isMuted;
  void version; // still forces the re-render that keeps isSpeaking/mute UI fresh
  const muted = !micPub?.track || micPub.isMuted;

  return (
    <div
      onClick={onClick}
      title={onClick ? "Tap to pin / enlarge" : undefined}
      className={`relative ${tall ? "aspect-[4/3]" : "aspect-video"} w-full overflow-hidden rounded-2xl bg-ink ${participant.isSpeaking ? "ring-4 ring-mango" : ""} ${onClick ? "cursor-pointer" : ""}`}
    >
      <video ref={videoRef} autoPlay muted={isLocal} playsInline className={`h-full w-full object-cover ${camLive ? "" : "hidden"}`} />
      {!isLocal && <audio ref={audioRef} autoPlay />}
      {!camLive && (
        <CameraOffTile />
      )}
      <span className="absolute bottom-2 left-2 rounded-full bg-ink/70 px-2.5 py-0.5 text-xs font-bold text-white">
        {participant.name || participant.identity}{isLocal ? " (you)" : ""}{hand ? " Γ£ï" : ""}{muted ? " ≡ƒöç" : ""}
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

/* ΓöÇΓöÇ Solo classroom (no/wrong class code ΓÇö local camera only) ΓöÇΓöÇ */
function SoloRoom({ lesson, isGuest = false, onGoLive, onLeave }: {
  lesson: Lesson | null;
  isGuest?: boolean;
  onGoLive: () => void;
  onLeave: () => void;
}) {
  const call = useCall();
  const [sharing, setSharing] = useState(false);
  const [stageLesson, setStageLesson] = useState<Lesson | null>(null);
  const [drawing, setDrawing] = useState(false);
  const shareRef = useRef<MediaStream | null>(null);
  const shareVideoRef = useRef<HTMLVideoElement>(null);
  const soloVideoRef = useRef<HTMLVideoElement>(null);
  const [tvMode, setTvMode] = useStored<boolean>("wj-tv-mode", false);

  useEffect(() => {
    if (soloVideoRef.current && call.soloStream) {
      soloVideoRef.current.srcObject = call.soloStream;
      void soloVideoRef.current.play().catch(() => {});
    }
  }, [call.soloStream]);

  async function toggleShare() {
    if (sharing) {
      shareRef.current?.getTracks().forEach((t) => t.stop());
      shareRef.current = null;
      setSharing(false);
      return;
    }
    try {
      const s = await navigator.mediaDevices.getDisplayMedia({ video: true });
      shareRef.current = s;
      s.getVideoTracks()[0].onended = () => setSharing(false);
      setSharing(true);
      setTimeout(() => {
        if (shareVideoRef.current) {
          shareVideoRef.current.srcObject = s;
          void shareVideoRef.current.play().catch(() => {});
        }
      }, 50);
    } catch { /* cancelled */ }
  }

  function leave() {
    shareRef.current?.getTracks().forEach((t) => t.stop());
    onLeave();
  }

  return (
    <div className={`space-y-3 ${tvMode ? "tv-mode scale-[1.02] origin-top contrast-125 transition-transform" : "transition-transform"}`}>
      <div className="wj-card-bubble wj-note flex flex-wrap items-center justify-between gap-2 p-3 text-center">
        {isGuest ? (
          // ≡ƒ¢í∩╕Å GUEST DEMO ΓÇö the full classroom experience, connected to
          // NOBODY. A guest camera can never enter a family's real room
          // (the server refuses codeless connections), so families stay
          // private and guests still feel the magic.
          <p className="font-display text-sm text-white">
            Γ£¿ Demo classroom ΓÇö this is how your family&apos;s class will look and feel.
            Love it? Ask Teacher Sharon for your family&apos;s own code! ≡ƒÆ¢
          </p>
        ) : (
          <>
            <p className="font-display text-sm text-white">
              Your camera is on! We couldn&apos;t reach the live room just now. ≡ƒÆ¢
            </p>
            <button className="wj-btn !px-4 !py-1.5 text-sm" onClick={onGoLive}>≡ƒÜÇ Try again</button>
          </>
        )}
      </div>

      {/* Focused room: lesson stage left ┬╖ camera rail right, family ABOVE teacher */}
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[3fr_1fr] lg:items-start">
        <div className={`wj-card relative overflow-hidden p-0 ${stageLesson ? "h-[74vh] lg:h-[78vh]" : "flex min-h-[46vh] items-center justify-center lg:h-[78vh]"}`}>
          {sharing && (
            <div className="absolute inset-0 z-20 bg-ink">
              <video ref={shareVideoRef} autoPlay playsInline className="h-full w-full object-contain" />
            </div>
          )}
          {stageLesson ? (
            <AdventureTheater lesson={stageLesson} embedded onExit={() => setStageLesson(null)} />
          ) : (
            <div className="flex flex-col items-center gap-4 overflow-y-auto p-8 text-center">
              <div className="text-6xl">{lesson?.emoji ?? "≡ƒî┤"}</div>
              <h2 className="wj-outline font-display text-2xl sm:text-3xl">{lesson?.title ?? "Today's Adventure"}</h2>
              <p className="font-hand text-lg text-ink-soft">{lesson?.subtitle}</p>
              {lesson && (
                <button className="wj-btn text-lg" onClick={() => setStageLesson(lesson)}>
                  ≡ƒÄ¼ Open the Adventure
                </button>
              )}
            </div>
          )}
          {drawing && <AnnotationLayer onClose={() => setDrawing(false)} />}
        </div>

        {/* Camera rail: ≡ƒæ¿ΓÇì≡ƒæ⌐ΓÇì≡ƒæºΓÇì≡ƒæª Family ABOVE ≡ƒæ⌐ΓÇì≡ƒÅ½ Teacher */}
        <div className="flex flex-col gap-3 lg:sticky lg:top-3">
          <div>
            <p className="mb-1 text-center text-[11px] font-bold uppercase tracking-wide text-ink-soft">
              ≡ƒæ¿ΓÇì≡ƒæ⌐ΓÇì≡ƒæºΓÇì≡ƒæª {isGuest ? call.name || "Your Family" : familyName}
            </p>
            {call.isTeacher ? (
              <div className="flex aspect-[4/3] w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-sand-deep bg-sand text-center text-ink-soft">
                <span className="text-3xl">≡ƒÆ¢</span>
                <span className="font-hand px-2 text-sm">Family video appears once you go live together</span>
              </div>
            ) : (
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-ink">
                <video ref={soloVideoRef} autoPlay muted playsInline className={`h-full w-full object-cover ${call.camOn ? "" : "hidden"}`} />
                {!call.camOn && (
                  <CameraOffTile />
                )}
                <span className="absolute bottom-2 left-2 rounded-full bg-ink/70 px-2.5 py-0.5 text-xs font-bold text-white">{call.name || familyName}</span>
              </div>
            )}
          </div>
          <div>
            <p className="mb-1 text-center text-[11px] font-bold uppercase tracking-wide text-ink-soft">≡ƒæ⌐ΓÇì≡ƒÅ½ {teacherName}</p>
            {call.isTeacher ? (
              <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-ink">
                <video ref={call.isTeacher ? soloVideoRef : undefined} autoPlay muted playsInline className={`h-full w-full object-cover ${call.camOn ? "" : "hidden"}`} />
                {!call.camOn && (
                  <CameraOffTile />
                )}
                <span className="absolute bottom-2 left-2 rounded-full bg-ink/70 px-2.5 py-0.5 text-xs font-bold text-white">{call.name || teacherName}</span>
              </div>
            ) : (
              <div className="flex aspect-video w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-sand-deep bg-sand text-center text-ink-soft">
                <span className="text-3xl">≡ƒÆ¢</span>
                <span className="font-hand px-2 text-sm">Teacher Sharon appears once you go live together</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="wj-card sticky bottom-2 z-10 flex flex-wrap items-center justify-center gap-2 p-3">
        <ToolBtn onClick={call.toggleMic} active={call.micOn} label={call.micOn ? "≡ƒÄñ Mic" : "≡ƒöç Muted"} />
        <ToolBtn onClick={call.toggleCam} active={call.camOn} label={call.camOn ? "≡ƒô╖ Cam" : "≡ƒô╖ Off"} />
        <ToolBtn onClick={() => void toggleShare()} active={sharing} label="≡ƒûÑ∩╕Å Share" />
        <ToolBtn onClick={() => setDrawing((d) => !d)} active={drawing} label="Γ£Å∩╕Å Draw" />
        <span className="mx-1 hidden h-6 w-px bg-sand-deep sm:block" />
        <button
          className="rounded-full bg-hibiscus px-4 py-2 font-display text-sm text-white transition-[filter] hover:brightness-95"
          onClick={leave}
          title="Disconnects and returns to Home Base"
        >
          ≡ƒô₧ End Call
        </button>
      </div>
    </div>
  );
}

function ToolBtn({ onClick, active, label }: { onClick: () => void; active: boolean; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3.5 py-2 font-display text-sm transition-colors ${
        active ? "bg-ocean text-white shadow" : "bg-white text-ink-soft hover:bg-sand-deep"
      }`}
    >
      {label}
    </button>
  );
}
