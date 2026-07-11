"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { getStudent, familyName } from "@/config/family";
import { getTodaysLesson, type Lesson } from "@/config/lessons";
import { KEYS } from "@/lib/app-state";
import { useStored } from "@/lib/storage";

// 🎥 LIVE ADVENTURE CLASSROOM — Stage 1.
// The full Wonder-Journey-styled classroom with the teacher/family's own
// live camera, mic and screen-share (browser getUserMedia — no server).
// Stage 2 (seeing EACH OTHER live) activates when LiveKit keys are added
// — see docs/LIVEKIT_SETUP.md.

type Phase = "lobby" | "live";
type Device = { id: string; label: string };

export default function ClassroomPage() {
  const [phase, setPhase] = useState<Phase>("lobby");
  const [activeStudentId] = useStored<string | null>(KEYS.activeStudent, null);
  const student = getStudent(activeStudentId);
  const [name, setName] = useState("");
  const [lesson, setLesson] = useState<Lesson | null>(null);

  useEffect(() => {
    setLesson(getTodaysLesson());
    setName(student ? student.name : familyName);
  }, [student]);

  if (phase === "lobby") {
    return <Lobby name={name} setName={setName} lesson={lesson} onJoin={() => setPhase("live")} />;
  }
  return <LiveRoom name={name} lesson={lesson} onLeave={() => setPhase("lobby")} />;
}

// ── Shared camera hook ───────────────────────────────────────
function useCamera() {
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cams, setCams] = useState<Device[]>([]);
  const [mics, setMics] = useState<Device[]>([]);
  const [camId, setCamId] = useState<string>("");
  const [micId, setMicId] = useState<string>("");
  const [camOn, setCamOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [ready, setReady] = useState(false);
  const [tick, setTick] = useState(0); // forces consumers to re-grab stream

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
      setCams(
        devices.filter((d) => d.kind === "videoinput").map((d, i) => ({ id: d.deviceId, label: d.label || `Camera ${i + 1}` }))
      );
      setMics(
        devices.filter((d) => d.kind === "audioinput").map((d, i) => ({ id: d.deviceId, label: d.label || `Microphone ${i + 1}` }))
      );
      setError(null);
      setReady(true);
      setTick((t) => t + 1);
    } catch {
      setError("We couldn't reach your camera. Please allow camera & microphone access in your browser, then tap Retry.");
      setReady(false);
    }
  }, [camId, micId, camOn, micOn]);

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

function CameraView({ streamRef, camOn, tick, label, className = "" }: {
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
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-ocean-deep to-ube-deep text-5xl">
          📷
        </div>
      )}
      {label && (
        <span className="absolute bottom-2 left-2 rounded-full bg-ink/70 px-2.5 py-0.5 text-xs font-bold text-white">
          {label}
        </span>
      )}
    </div>
  );
}

// ── Pre-join lobby ───────────────────────────────────────────
function Lobby({ name, setName, lesson, onJoin }: {
  name: string;
  setName: (s: string) => void;
  lesson: Lesson | null;
  onJoin: () => void;
}) {
  const cam = useCamera();
  const [level, setLevel] = useState(0);

  // mic level meter
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
        const avg = data.reduce((a, b) => a + b, 0) / data.length;
        setLevel(Math.min(100, Math.round((avg / 128) * 100)));
        raf = requestAnimationFrame(loop);
      };
      loop();
    } catch {
      /* ignore */
    }
    return () => {
      cancelAnimationFrame(raf);
      void ctx?.close();
    };
  }, [cam.ready, cam.tick, cam.streamRef]);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="text-center">
        <div className="mb-2 text-4xl">🎥🌴</div>
        <h1 className="wj-outline font-display text-3xl sm:text-4xl">Live Adventure Classroom</h1>
        <p className="font-hand mt-1 text-lg text-ink-soft">
          Mabuhay, {familyName}! Let&apos;s get you ready before we begin. 💛
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-[1.3fr_1fr]">
        {/* camera preview */}
        <div className="wj-card overflow-hidden p-3">
          <CameraView streamRef={cam.streamRef} camOn={cam.camOn} tick={cam.tick} className="aspect-video w-full" label={name} />
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
          {/* mic level */}
          <div className="mt-3">
            <p className="text-xs font-bold text-ink-soft">Microphone</p>
            <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-sand-deep">
              <div className="h-full rounded-full bg-gradient-to-r from-palm to-mango transition-[width] duration-100" style={{ width: `${cam.micOn ? level : 0}%` }} />
            </div>
          </div>
        </div>

        {/* settings */}
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
          <button className="wj-btn w-full text-lg" onClick={onJoin} disabled={!cam.ready}>
            🚀 Join the Adventure
          </button>
        </div>
      </div>

      {/* Stage-2 note */}
      <div className="wj-card-bubble wj-note p-4 text-center">
        <p className="font-display text-white">👨‍👩‍👧‍👦 Seeing the whole family live together turns on once LiveKit is connected.</p>
        <p className="font-hand mt-1 text-white/90">Ask Teacher Sharon&apos;s helper to follow docs/LIVEKIT_SETUP.md — it&apos;s free and quick!</p>
      </div>
    </div>
  );
}

// ── Live classroom ───────────────────────────────────────────
function LiveRoom({ name, lesson, onLeave }: { name: string; lesson: Lesson | null; onLeave: () => void }) {
  const cam = useCamera();
  const [sharing, setSharing] = useState(false);
  const [hand, setHand] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chat, setChat] = useState<{ who: string; text: string }[]>([]);
  const [msg, setMsg] = useState("");
  const shareRef = useRef<MediaStream | null>(null);
  const shareVideoRef = useRef<HTMLVideoElement>(null);

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
    } catch {
      /* user cancelled */
    }
  }

  function leave() {
    cam.stop();
    shareRef.current?.getTracks().forEach((t) => t.stop());
    onLeave();
  }

  function send() {
    if (!msg.trim()) return;
    setChat((c) => [...c, { who: name, text: msg.trim() }]);
    setMsg("");
  }

  return (
    <div className="space-y-3">
      {/* stage: lesson gets the most space */}
      <div className="grid gap-3 lg:grid-cols-[1fr_16rem]">
        <div className="wj-card relative flex min-h-[46vh] items-center justify-center overflow-hidden p-0">
          {sharing ? (
            <video ref={shareVideoRef} autoPlay playsInline className="h-full w-full bg-ink object-contain" />
          ) : (
            <div className="flex flex-col items-center gap-4 p-8 text-center">
              <div className="text-6xl">{lesson?.emoji ?? "🌴"}</div>
              <h2 className="wj-outline font-display text-2xl sm:text-3xl">{lesson?.title ?? "Today's Adventure"}</h2>
              <p className="font-hand text-lg text-ink-soft">{lesson?.subtitle}</p>
              {lesson && (
                <Link href={`/adventure/${lesson.id}`} className="wj-btn text-lg">🎬 Open the Adventure</Link>
              )}
              <p className="text-xs text-ink-soft">Or share your screen to show slides, maps, or a cooking demo 👇</p>
            </div>
          )}
        </div>

        {/* camera filmstrip */}
        <div className="space-y-3">
          <CameraView streamRef={cam.streamRef} camOn={cam.camOn} tick={cam.tick} className="aspect-video w-full" label={`${name}${hand ? " ✋" : ""}`} />
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex aspect-video w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-sand-deep bg-sand text-center text-ink-soft">
              <span className="text-2xl">👦</span>
              <span className="font-hand text-sm">family joins here</span>
            </div>
          ))}
        </div>
      </div>

      {cam.error && (
        <div className="wj-card p-3 text-center text-sm text-hibiscus-deep">
          {cam.error} <button className="wj-btn wj-btn-ghost ml-2 text-sm" onClick={() => void cam.start()}>Retry</button>
        </div>
      )}

      {/* chat */}
      {chatOpen && (
        <div className="wj-card p-4">
          <p className="font-display">💬 Class Chat</p>
          <div className="mt-2 max-h-32 space-y-1 overflow-y-auto text-sm">
            {chat.length === 0 && <p className="font-hand text-ink-soft">Say hello to the family! (chat syncs live once LiveKit is on)</p>}
            {chat.map((c, i) => (<p key={i}><b>{c.who}:</b> {c.text}</p>))}
          </div>
          <div className="mt-2 flex gap-2">
            <input className="wj-input" value={msg} onChange={(e) => setMsg(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Type a message..." />
            <button className="wj-btn" onClick={send}>Send</button>
          </div>
        </div>
      )}

      {/* bottom adventure toolbar */}
      <div className="wj-card sticky bottom-2 z-10 flex flex-wrap items-center justify-center gap-2 p-3">
        <ToolBtn onClick={cam.toggleMic} active={cam.micOn} label={cam.micOn ? "🎤 Mic" : "🔇 Muted"} />
        <ToolBtn onClick={cam.toggleCam} active={cam.camOn} label={cam.camOn ? "📷 Cam" : "📷 Off"} />
        <ToolBtn onClick={toggleShare} active={sharing} label="🖥️ Share" />
        <ToolBtn onClick={() => setHand((h) => !h)} active={hand} label="✋ Hand" />
        <ToolBtn onClick={() => setChatOpen((c) => !c)} active={chatOpen} label="💬 Chat" />
        <span className="mx-1 hidden h-6 w-px bg-sand-deep sm:block" />
        <Link href="/passport" target="_blank" className="wj-chip hover:bg-mango/20">🛂 Passport</Link>
        <Link href="/journal" target="_blank" className="wj-chip hover:bg-mango/20">📔 Notebook</Link>
        <Link href="/cooking" target="_blank" className="wj-chip hover:bg-mango/20">🍳 Cooking</Link>
        <button className="wj-btn wj-btn-hibiscus !px-4 !py-1.5 text-sm" onClick={leave}>Leave</button>
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
