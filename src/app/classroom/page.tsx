"use client";

import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ConnectionState, Participant, Track } from "livekit-client";
import { AnnotationLayer } from "@/components/adventure/annotation-layer";
import { AdventureTheater } from "@/components/adventure/theater";
import { familyName, getStudent, teacherName } from "@/config/family";
import { getTodaysLesson, lessons as allLessons, type Lesson } from "@/config/lessons";
import type { Mode } from "@/config/navigation";
import { normalizeMode } from "@/config/navigation";
import { KEYS, todayISO } from "@/lib/app-state";
import { getScreenShare, useCall } from "@/lib/call-context";
import { initCloudSync, sendEvent } from "@/lib/cloud-sync";
import { useStored } from "@/lib/storage";

// 🎥 LIVE ADVENTURE CLASSROOM
// The call itself lives in the global CallProvider (app-shell), so it
// follows the family across every page. This page is the full-size
// room: lesson stage + camera rail + teaching toolbar.
// Solo mode (no/wrong class code) still gives a working local camera.

type Device = { id: string; label: string };

export default function ClassroomPage() {
  const call = useCall();
  const router = useRouter();
  const [activeStudentId] = useStored<string | null>(KEYS.activeStudent, null);
  const [rawMode] = useStored<string>(KEYS.mode, "family");
  const mode: Mode = normalizeMode(rawMode);
  const student = getStudent(activeStudentId);
  const [name, setName] = useState("");
  // the code is entered once at the front door (AccessGate) — never here
  const [classCode] = useStored<string>("classCode", "");
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [joinError, setJoinError] = useState<string | null>(null);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    setLesson(getTodaysLesson());
  }, []);
  useEffect(() => {
    setName(mode === "teacher" ? teacherName : student ? student.name : familyName);
  }, [student, mode]);

  const roomName = useMemo(() => `wj-${lesson?.id ?? "class"}-${todayISO()}`, [lesson]);

  async function join(devices: { camId: string; micId: string; camOn: boolean; micOn: boolean }) {
    setJoinError(null);
    setJoining(true);
    const result = await call.join({
      name,
      code: classCode,
      role: mode === "teacher" ? "teacher" : "family",
      roomName,
      ...devices,
    });
    setJoining(false);
    if (result === "wrong_code") {
      setJoinError("That class code doesn't match — please check it with Teacher Sharon. 💛");
      return;
    }
    if (result === "error") {
      setJoinError("We couldn't reach your camera. Please allow camera & microphone access and try again.");
      return;
    }
    initCloudSync();
    if (result === "connected") sendEvent("class.joined", { who: name, room: roomName });
  }

  // END CALL — the only action that disconnects. Back to Home Base.
  function endCall() {
    if (call.status === "connected") sendEvent("class.ended", { who: name, room: roomName });
    call.endCall();
    router.push("/");
  }

  if (call.status === "connected" && call.room) {
    return <ConnectedRoom lesson={lesson} onLeave={endCall} />;
  }
  if (call.status === "solo") {
    return (
      <SoloRoom
        lesson={lesson}
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

/* ── Local camera (lobby preview) ───────────────────────────── */
function useLocalCamera(initial?: { camId?: string; micId?: string; camOn?: boolean; micOn?: boolean }) {
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cams, setCams] = useState<Device[]>([]);
  const [mics, setMics] = useState<Device[]>([]);
  const [camId, setCamId] = useState(initial?.camId ?? "");
  const [micId, setMicId] = useState(initial?.micId ?? "");
  const [camOn, setCamOn] = useState(initial?.camOn ?? true);
  const [micOn, setMicOn] = useState(initial?.micOn ?? true);
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
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-ocean-deep to-ube-deep text-5xl">📷</div>
      )}
      {label && (
        <span className="absolute bottom-2 left-2 rounded-full bg-ink/70 px-2.5 py-0.5 text-xs font-bold text-white">{label}</span>
      )}
    </div>
  );
}

/* ── Pre-join lobby ─────────────────────────────────────────── */
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
        <div className="mb-2 text-4xl">🎥🌴</div>
        <h1 className="wj-outline font-display text-3xl sm:text-4xl">Live Adventure Classroom</h1>
        <p className="font-hand mt-1 text-lg text-ink-soft">Mabuhay, {familyName}! Let&apos;s get you ready. 💛</p>
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
              {cam.camOn ? "📷 Camera On" : "📷 Camera Off"}
            </button>
            <button className={`wj-btn ${cam.micOn ? "wj-btn-ocean" : "wj-btn-ghost"} !px-4`} onClick={cam.toggleMic}>
              {cam.micOn ? "🎤 Mic On" : "🔇 Mic Off"}
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
            <label className="text-sm font-bold text-ink-soft">📷 Camera</label>
            <select className="wj-input mt-1" value={cam.camId} onChange={(e) => cam.setCamId(e.target.value)}>
              {cam.cams.length === 0 && <option>Default camera</option>}
              {cam.cams.map((c) => (<option key={c.id} value={c.id}>{c.label}</option>))}
            </select>
          </div>
          <div>
            <label className="text-sm font-bold text-ink-soft">🎤 Microphone</label>
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
            {joining ? "Connecting… 🌐" : "🚀 Join the Adventure"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── LiveKit connected classroom (shared call context) ──────── */
function ConnectedRoom({ lesson, onLeave }: {
  lesson: Lesson | null;
  onLeave: () => void;
}) {
  const call = useCall();
  const room = call.room!;
  const isTeacher = call.isTeacher;
  const [chatOpen, setChatOpen] = useState(false);
  const [msg, setMsg] = useState("");
  // The lesson opens INSIDE the stage — the route never changes, so the
  // LiveKit room, cameras, and toolbar are never unmounted.
  const [stageLesson, setStageLesson] = useState<Lesson | null>(null);
  const [wrapUp, setWrapUp] = useState(false); // Adventure Wrap-Up: lesson done, call stays alive
  const [camsVisible, setCamsVisible] = useState(true); // explicit "Hide video" only
  const [enlarged, setEnlarged] = useState<string | null>(null); // participant identity, pinned big
  const [drawing, setDrawing] = useState(false); // whiteboard over the stage

  // FINISH LESSON — closes the presentation only. The LiveKit room,
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
    call.connState === ConnectionState.Reconnecting ? "🟡 Reconnecting…" :
    call.connState === ConnectionState.Connected ? "🟢 Live" : "🔴 Connecting…";

  // ── V1 layout: exactly two featured feeds (Decision: one shared
  // family camera). Local participant on one side, the first remote on
  // the other. Extra remotes (future families/grandparents) stack small
  // under the family tile — the architecture already scales.
  const remotes = everyone.filter((p) => p !== room.localParticipant);
  const familyFeed = remotes[0] ?? null;
  const extraFeeds = remotes.slice(1);
  const enlargedP = enlarged ? everyone.find((p) => p.identity === enlarged) ?? null : null;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="wj-chip">{stateChip} · {everyone.length} in class</span>
        <div className="flex items-center gap-2">
          <span className="wj-chip">🎥 {lesson ? `${lesson.emoji} ${lesson.title}` : "Adventure"}</span>
          <button className="wj-chip hover:bg-mango/20" onClick={() => setCamsVisible((v) => !v)} title={camsVisible ? "Hide video" : "Show video"}>
            {camsVisible ? "👥 Hide video" : "👥 Show video"}
          </button>
        </div>
      </div>

      {/* Focused teaching room: LESSON STAGE (~78%) left · CAMERA RAIL right.
          Family camera ABOVE teacher camera (Decision 044). On small screens
          the lesson leads and the rail stacks beneath it — family still first. */}
      <div className={`grid grid-cols-1 gap-3 ${camsVisible ? "lg:grid-cols-[minmax(0,1fr)_minmax(14rem,23%)]" : ""} lg:items-start`}>
        {/* stage — lessons open here; the shell around it never unmounts */}
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
              <div className="text-6xl">{lesson?.emoji ?? "🌴"}</div>
              <h2 className="wj-outline font-display text-2xl sm:text-3xl">{lesson?.title ?? "Today's Adventure"}</h2>
              <p className="font-hand text-lg text-ink-soft">{lesson?.subtitle}</p>
              {lesson && (
                <button className="wj-btn text-lg" onClick={() => setStageLesson(lesson)}>
                  🎬 Open the Adventure
                </button>
              )}
              {isTeacher && <p className="text-xs text-ink-soft">The lesson opens right here — cameras stay on. Or share your screen 👇</p>}
            </div>
          )}

          {/* whiteboard over the whole stage (slides, maps, shares) */}
          {drawing && <AnnotationLayer onClose={() => setDrawing(false)} />}

          {/* pinned/enlarged camera overlay — cameras over the lesson on demand */}
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
        </div>

        {/* ── CAMERA RAIL: 👨‍👩‍👧‍👦 Family ABOVE 👩‍🏫 Teacher ─────────── */}
        {camsVisible && (
          <div className="flex flex-col gap-3 lg:sticky lg:top-3">
            {/* Family first — slightly more prominent so the teacher can
                watch all four children clearly */}
            <div>
              <p className="mb-1 text-center text-[11px] font-bold uppercase tracking-wide text-ink-soft">👨‍👩‍👧‍👦 {familyName}</p>
              {familyFeed ? (
                <ParticipantTile
                  participant={familyFeed}
                  isLocal={false}
                  hand={call.hands[familyFeed.identity] ?? false}
                  version={call.version}
                  tall
                  onClick={() => setEnlarged(familyFeed.identity)}
                />
              ) : (
                <div className="flex aspect-[4/3] w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-sand-deep bg-sand text-center text-ink-soft">
                  <span className="text-3xl">💛</span>
                  <span className="font-hand px-2 text-sm">Waiting for the family to join…</span>
                </div>
              )}
              {/* future participants stack here automatically */}
              {extraFeeds.map((p) => (
                <div key={p.identity} className="mt-2">
                  <ParticipantTile participant={p} isLocal={false} hand={call.hands[p.identity] ?? false} version={call.version} onClick={() => setEnlarged(p.identity)} />
                </div>
              ))}
            </div>

            {/* Teacher below */}
            <div>
              <p className="mb-1 text-center text-[11px] font-bold uppercase tracking-wide text-ink-soft">👩‍🏫 {teacherName}</p>
              <ParticipantTile
                participant={room.localParticipant}
                isLocal
                hand={call.hands[room.localParticipant.identity] ?? false}
                version={call.version}
                onClick={() => setEnlarged(room.localParticipant.identity)}
              />
            </div>
          </div>
        )}
      </div>

      {chatOpen && (
        <div className="wj-card p-4">
          <p className="font-display">💬 Class Chat</p>
          <div className="mt-2 max-h-32 space-y-1 overflow-y-auto text-sm">
            {call.chat.length === 0 && <p className="font-hand text-ink-soft">Say hello to the family! 👋</p>}
            {call.chat.map((c, i) => (<p key={i}><b>{c.who}:</b> {c.text}</p>))}
          </div>
          <div className="mt-2 flex gap-2">
            <input className="wj-input" value={msg} onChange={(e) => setMsg(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Type a message…" />
            <button className="wj-btn" onClick={send}>Send</button>
          </div>
        </div>
      )}

      {/* TEACHING TOOLBAR — only class tools, no dashboard navigation */}
      <div className="wj-card sticky bottom-2 z-10 flex flex-wrap items-center justify-center gap-2 p-3">
        <ToolBtn onClick={call.toggleMic} active={call.micOn} label={call.micOn ? "🎤 Mic" : "🔇 Muted"} />
        <ToolBtn onClick={call.toggleCam} active={call.camOn} label={call.camOn ? "📷 Cam" : "📷 Off"} />
        <ToolBtn onClick={call.toggleShare} active={call.sharing} label="🖥️ Share" />
        <ToolBtn onClick={() => setDrawing((d) => !d)} active={drawing} label="✏️ Draw" />
        <ToolBtn onClick={call.toggleHand} active={call.myHand} label="✋ Hand" />
        <ToolBtn onClick={() => setChatOpen((c) => !c)} active={chatOpen} label="💬 Chat" />
        <span className="mx-1 hidden h-6 w-px bg-sand-deep sm:block" />
        {isTeacher && stageLesson && (
          <button className="wj-btn wj-btn-ocean !px-4 !py-1.5 text-sm" onClick={finishLesson}>
            🏁 Finish Lesson
          </button>
        )}
        <button className="wj-btn wj-btn-hibiscus !px-4 !py-1.5 text-sm" onClick={onLeave} title="Disconnects the call and returns to Home Base">
          📞 End Call
        </button>
      </div>
    </div>
  );
}

/* ── Adventure Wrap-Up: lesson finished, cameras stay on ────── */
function WrapUpPanel({ lesson, quizResult, onReopen, onEndCall }: {
  lesson: Lesson | null;
  quizResult: { score: number; total: number } | null;
  onReopen: () => void;
  onEndCall: () => void;
}) {
  const next = lesson ? allLessons.find((l) => l.order === lesson.order + 1) : null;
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 overflow-y-auto p-6 text-center">
      <div className="text-5xl">🌅</div>
      <h2 className="wj-outline font-display text-2xl sm:text-3xl">Wonderful work today!</h2>
      <p className="font-hand text-lg text-ink-soft">
        {lesson ? `${lesson.emoji} ${lesson.title} — adventure complete!` : "Adventure complete!"}
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        {quizResult && <span className="wj-chip">🧠 Quiz: {quizResult.score}/{quizResult.total}</span>}
        {lesson?.destinationId && <span className="wj-chip">🛂 Passport stamp earned</span>}
        <span className="wj-chip">📔 Journal saved</span>
      </div>
      {next && (
        <p className="font-hand rounded-2xl bg-sand px-4 py-2 text-base text-ink-soft">
          Next adventure: <b>{next.emoji} {next.title}</b> · {next.date}
        </p>
      )}
      <p className="font-hand text-base text-ink-soft">
        Stay and chat as long as you like — the call is still on. 💛
      </p>
      <div className="mt-1 flex flex-wrap justify-center gap-3">
        <button className="wj-btn wj-btn-ghost text-sm" onClick={onReopen}>↩️ Reopen the lesson</button>
        <button className="wj-btn wj-btn-hibiscus" onClick={onEndCall}>📞 End Call</button>
      </div>
    </div>
  );
}

/* ── Failsafe: a lesson crash must never end the call ───────── */
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
        <div className="text-4xl">🛶</div>
        <h2 className="font-display text-xl">That lesson page hit a wave — but the call is still on!</h2>
        <p className="font-hand text-ink-soft">Cameras and microphones are untouched. You can keep talking.</p>
        <div className="flex gap-3">
          <button className="wj-btn wj-btn-ghost text-sm" onClick={() => this.setState({ failed: false })}>🔄 Retry Lesson</button>
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

  useEffect(() => {
    const camPub = participant.getTrackPublication(Track.Source.Camera);
    if (camPub?.track && videoRef.current) camPub.track.attach(videoRef.current);
    if (!isLocal) {
      const micPub = participant.getTrackPublication(Track.Source.Microphone);
      if (micPub?.track && audioRef.current) micPub.track.attach(audioRef.current);
    }
    return () => {
      camPub?.track?.detach();
    };
  }, [participant, isLocal, version]);

  const camPub = participant.getTrackPublication(Track.Source.Camera);
  const camLive = !!camPub?.track && !camPub.isMuted;
  const micPub = participant.getTrackPublication(Track.Source.Microphone);
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
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-ocean-deep to-ube-deep text-4xl">📷</div>
      )}
      <span className="absolute bottom-2 left-2 rounded-full bg-ink/70 px-2.5 py-0.5 text-xs font-bold text-white">
        {participant.name || participant.identity}{isLocal ? " (you)" : ""}{hand ? " ✋" : ""}{muted ? " 🔇" : ""}
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

/* ── Solo classroom (no/wrong class code — local camera only) ── */
function SoloRoom({ lesson, onGoLive, onLeave }: {
  lesson: Lesson | null;
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
    <div className="space-y-3">
      <div className="wj-card-bubble wj-note flex flex-wrap items-center justify-center gap-2 p-3 text-center">
        <p className="font-display text-sm text-white">
          Your camera is on! We couldn&apos;t reach the live room just now. 💛
        </p>
        <button className="wj-btn !px-4 !py-1.5 text-sm" onClick={onGoLive}>🚀 Try again</button>
      </div>

      {/* Focused room: lesson stage left · camera rail right, family ABOVE teacher */}
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(14rem,23%)] lg:items-start">
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
              <div className="text-6xl">{lesson?.emoji ?? "🌴"}</div>
              <h2 className="wj-outline font-display text-2xl sm:text-3xl">{lesson?.title ?? "Today's Adventure"}</h2>
              <p className="font-hand text-lg text-ink-soft">{lesson?.subtitle}</p>
              {lesson && (
                <button className="wj-btn text-lg" onClick={() => setStageLesson(lesson)}>
                  🎬 Open the Adventure
                </button>
              )}
            </div>
          )}
          {drawing && <AnnotationLayer onClose={() => setDrawing(false)} />}
        </div>

        {/* Camera rail: 👨‍👩‍👧‍👦 Family ABOVE 👩‍🏫 Teacher */}
        <div className="flex flex-col gap-3 lg:sticky lg:top-3">
          <div>
            <p className="mb-1 text-center text-[11px] font-bold uppercase tracking-wide text-ink-soft">👨‍👩‍👧‍👦 {familyName}</p>
            {call.isTeacher ? (
              <div className="flex aspect-[4/3] w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-sand-deep bg-sand text-center text-ink-soft">
                <span className="text-3xl">💛</span>
                <span className="font-hand px-2 text-sm">Family video appears once you go live together</span>
              </div>
            ) : (
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-ink">
                <video ref={soloVideoRef} autoPlay muted playsInline className={`h-full w-full object-cover ${call.camOn ? "" : "hidden"}`} />
                {!call.camOn && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-ocean-deep to-ube-deep text-5xl">📷</div>
                )}
                <span className="absolute bottom-2 left-2 rounded-full bg-ink/70 px-2.5 py-0.5 text-xs font-bold text-white">{call.name || familyName}</span>
              </div>
            )}
          </div>
          <div>
            <p className="mb-1 text-center text-[11px] font-bold uppercase tracking-wide text-ink-soft">👩‍🏫 {teacherName}</p>
            {call.isTeacher ? (
              <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-ink">
                <video ref={call.isTeacher ? soloVideoRef : undefined} autoPlay muted playsInline className={`h-full w-full object-cover ${call.camOn ? "" : "hidden"}`} />
                {!call.camOn && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-ocean-deep to-ube-deep text-5xl">📷</div>
                )}
                <span className="absolute bottom-2 left-2 rounded-full bg-ink/70 px-2.5 py-0.5 text-xs font-bold text-white">{call.name || teacherName}</span>
              </div>
            ) : (
              <div className="flex aspect-video w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-sand-deep bg-sand text-center text-ink-soft">
                <span className="text-3xl">💛</span>
                <span className="font-hand px-2 text-sm">Teacher Sharon appears once you go live together</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="wj-card sticky bottom-2 z-10 flex flex-wrap items-center justify-center gap-2 p-3">
        <ToolBtn onClick={call.toggleMic} active={call.micOn} label={call.micOn ? "🎤 Mic" : "🔇 Muted"} />
        <ToolBtn onClick={call.toggleCam} active={call.camOn} label={call.camOn ? "📷 Cam" : "📷 Off"} />
        <ToolBtn onClick={() => void toggleShare()} active={sharing} label="🖥️ Share" />
        <ToolBtn onClick={() => setDrawing((d) => !d)} active={drawing} label="✏️ Draw" />
        <span className="mx-1 hidden h-6 w-px bg-sand-deep sm:block" />
        <button className="wj-btn wj-btn-hibiscus !px-4 !py-1.5 text-sm" onClick={leave} title="Disconnects and returns to Home Base">
          📞 End Call
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
