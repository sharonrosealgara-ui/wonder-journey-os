"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ConnectionState,
  Participant,
  RemoteParticipant,
  Room,
  RoomEvent,
  Track,
} from "livekit-client";
import { AnnotationLayer } from "@/components/adventure/annotation-layer";
import { AdventureTheater } from "@/components/adventure/theater";
import { familyName, getStudent } from "@/config/family";
import { getTodaysLesson, type Lesson } from "@/config/lessons";
import type { Mode } from "@/config/navigation";
import { normalizeMode } from "@/config/navigation";
import { KEYS, todayISO } from "@/lib/app-state";
import { useStored } from "@/lib/storage";

// 🎥 LIVE ADVENTURE CLASSROOM
// Stage 1 (always works): your own camera/mic/screen-share — no server.
// Stage 2 (when LiveKit keys are set in Netlify): the whole family sees
// and hears each other live, with chat, raise-hand and screen share —
// tokens are minted server-side; the API secret never reaches the browser.

type Phase = "lobby" | "connecting" | "live";
type Device = { id: string; label: string };
type ChatMsg = { who: string; text: string };

export default function ClassroomPage() {
  const [phase, setPhase] = useState<Phase>("lobby");
  const [activeStudentId] = useStored<string | null>(KEYS.activeStudent, null);
  const [rawMode] = useStored<string>(KEYS.mode, "family");
  const mode: Mode = normalizeMode(rawMode);
  const student = getStudent(activeStudentId);
  const [name, setName] = useState("");
  const [classCode, setClassCode] = useStored<string>("classCode", "");
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [joinError, setJoinError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false); // LiveKit vs solo
  const roomRef = useRef<Room | null>(null);
  const [lobbyDevices, setLobbyDevices] = useState<{ camId: string; micId: string; camOn: boolean; micOn: boolean }>({
    camId: "",
    micId: "",
    camOn: true,
    micOn: true,
  });

  useEffect(() => {
    setLesson(getTodaysLesson());
  }, []);
  useEffect(() => {
    setName(mode === "teacher" ? "Teacher Sharon" : student ? student.name : familyName);
  }, [student, mode]);

  const roomName = useMemo(
    () => `wj-${lesson?.id ?? "class"}-${todayISO()}`,
    [lesson]
  );

  async function join(devices: { camId: string; micId: string; camOn: boolean; micOn: boolean }) {
    setJoinError(null);
    setLobbyDevices(devices);
    setPhase("connecting");
    // Ask our secure Netlify function for a join token.
    try {
      const res = await fetch("/api/livekit-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          room: roomName,
          role: mode === "teacher" ? "teacher" : "family",
          code: classCode,
        }),
      });
      if (res.status === 401) {
        setJoinError("That class code doesn't match — please check it with Teacher Sharon. 💛");
        setPhase("lobby");
        return;
      }
      if (!res.ok) throw new Error("not configured");
      const { token, url } = (await res.json()) as { token: string; url: string };

      const room = new Room({
        adaptiveStream: true,
        dynacast: true,
        videoCaptureDefaults: devices.camId ? { deviceId: devices.camId } : undefined,
        audioCaptureDefaults: devices.micId ? { deviceId: devices.micId } : undefined,
      });
      await room.connect(url, token);
      await room.localParticipant.setCameraEnabled(devices.camOn);
      await room.localParticipant.setMicrophoneEnabled(devices.micOn);
      void room.startAudio();
      roomRef.current = room;
      setConnected(true);
      setPhase("live");
    } catch {
      // LiveKit not configured (or offline) → Stage 1 solo classroom.
      roomRef.current = null;
      setConnected(false);
      setPhase("live");
    }
  }

  function leave() {
    roomRef.current?.disconnect();
    roomRef.current = null;
    setConnected(false);
    setPhase("lobby");
  }

  if (phase === "lobby" || phase === "connecting") {
    return (
      <Lobby
        name={name}
        setName={setName}
        classCode={classCode}
        setClassCode={setClassCode}
        lesson={lesson}
        joining={phase === "connecting"}
        joinError={joinError}
        onJoin={join}
      />
    );
  }
  return connected && roomRef.current ? (
    <ConnectedRoom room={roomRef.current} name={name} lesson={lesson} isTeacher={mode === "teacher"} onLeave={leave} />
  ) : (
    <SoloRoom name={name} lesson={lesson} devices={lobbyDevices} onLeave={leave} />
  );
}

/* ── Local camera (lobby preview + solo mode) ───────────────── */
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
function Lobby({ name, setName, classCode, setClassCode, lesson, joining, joinError, onJoin }: {
  name: string;
  setName: (s: string) => void;
  classCode: string;
  setClassCode: (s: string) => void;
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
            <label className="text-sm font-bold text-ink-soft">🔑 Class code</label>
            <input
              className="wj-input mt-1"
              value={classCode}
              onChange={(e) => setClassCode(e.target.value)}
              placeholder="from Teacher Sharon"
            />
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

/* ── LiveKit connected classroom ────────────────────────────── */
function ConnectedRoom({ room, name, lesson, isTeacher, onLeave }: {
  room: Room;
  name: string;
  lesson: Lesson | null;
  isTeacher: boolean;
  onLeave: () => void;
}) {
  const [version, setVersion] = useState(0);
  const [chatOpen, setChatOpen] = useState(false);
  const [chat, setChat] = useState<ChatMsg[]>([]);
  const [msg, setMsg] = useState("");
  const [hands, setHands] = useState<Record<string, boolean>>({});
  const [state, setState] = useState<ConnectionState>(room.state);
  // The lesson opens INSIDE the stage — the route never changes, so the
  // LiveKit room, cameras, and toolbar are never unmounted.
  const [stageLesson, setStageLesson] = useState<Lesson | null>(null);
  const [camsVisible, setCamsVisible] = useState(true); // explicit "Hide video" only
  const [enlarged, setEnlarged] = useState<string | null>(null); // participant identity, pinned big
  const [drawing, setDrawing] = useState(false); // whiteboard over the stage

  const bump = useCallback(() => setVersion((v) => v + 1), []);

  useEffect(() => {
    const events = [
      RoomEvent.ParticipantConnected,
      RoomEvent.ParticipantDisconnected,
      RoomEvent.TrackSubscribed,
      RoomEvent.TrackUnsubscribed,
      RoomEvent.LocalTrackPublished,
      RoomEvent.LocalTrackUnpublished,
      RoomEvent.TrackMuted,
      RoomEvent.TrackUnmuted,
      RoomEvent.ActiveSpeakersChanged,
    ] as const;
    events.forEach((e) => room.on(e, bump));

    const onData = (payload: Uint8Array, p?: RemoteParticipant) => {
      try {
        const d = JSON.parse(new TextDecoder().decode(payload)) as { type: string; who?: string; text?: string; up?: boolean };
        if (d.type === "chat" && d.who && d.text) setChat((c) => [...c, { who: d.who!, text: d.text! }]);
        if (d.type === "hand" && p) setHands((h) => ({ ...h, [p.identity]: !!d.up }));
      } catch { /* ignore */ }
    };
    const onState = (s: ConnectionState) => setState(s);
    const onDisconnect = () => onLeave();
    room.on(RoomEvent.DataReceived, onData);
    room.on(RoomEvent.ConnectionStateChanged, onState);
    room.on(RoomEvent.Disconnected, onDisconnect);

    // attendance log (teacher's device keeps the register)
    if (isTeacher) {
      const log = (who: string, action: "joined" | "left") => {
        try {
          const key = `wjos:attendance-${room.name}`;
          const rows = JSON.parse(localStorage.getItem(key) ?? "[]") as unknown[];
          rows.push({ who, action, time: new Date().toISOString() });
          localStorage.setItem(key, JSON.stringify(rows));
        } catch { /* ignore */ }
      };
      log(name, "joined");
      const onJoin = (p: RemoteParticipant) => log(p.name ?? p.identity, "joined");
      const onLeft = (p: RemoteParticipant) => log(p.name ?? p.identity, "left");
      room.on(RoomEvent.ParticipantConnected, onJoin);
      room.on(RoomEvent.ParticipantDisconnected, onLeft);
    }

    return () => {
      events.forEach((e) => room.off(e, bump));
      room.off(RoomEvent.DataReceived, onData);
      room.off(RoomEvent.ConnectionStateChanged, onState);
      room.off(RoomEvent.Disconnected, onDisconnect);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room]);

  const everyone: Participant[] = useMemo(
    () => [room.localParticipant, ...Array.from(room.remoteParticipants.values())],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [room, version]
  );

  // find any active screen share (local or remote)
  const screenShare = useMemo(() => {
    for (const p of everyone) {
      const pub = p.getTrackPublication(Track.Source.ScreenShare);
      if (pub?.track) return { participant: p, track: pub.track };
    }
    return null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [everyone, version]);

  const camOn = room.localParticipant.isCameraEnabled;
  const micOn = room.localParticipant.isMicrophoneEnabled;
  const myHand = hands[room.localParticipant.identity] ?? false;

  async function toggleCam() { await room.localParticipant.setCameraEnabled(!camOn); bump(); }
  async function toggleMic() { await room.localParticipant.setMicrophoneEnabled(!micOn); bump(); }
  async function toggleShare() {
    try { await room.localParticipant.setScreenShareEnabled(!screenShare || screenShare.participant !== room.localParticipant); bump(); }
    catch { /* user cancelled */ }
  }
  function sendData(obj: object) {
    void room.localParticipant.publishData(new TextEncoder().encode(JSON.stringify(obj)), { reliable: true });
  }
  function toggleHand() {
    const up = !myHand;
    setHands((h) => ({ ...h, [room.localParticipant.identity]: up }));
    sendData({ type: "hand", up });
  }
  function send() {
    if (!msg.trim()) return;
    const m = { type: "chat", who: name, text: msg.trim() };
    sendData(m);
    setChat((c) => [...c, { who: name, text: m.text }]);
    setMsg("");
  }
  function leave() { room.disconnect(); onLeave(); }

  const stateChip =
    state === ConnectionState.Connected ? "🟢 Live" :
    state === ConnectionState.Reconnecting ? "🟡 Reconnecting…" : "🔴 Connecting…";

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

      {/* Meet-style: teacher pinned left · lesson center · family pinned right.
          On smaller screens the lesson leads and both cameras sit beneath it. */}
      <div className={`grid grid-cols-2 gap-3 ${camsVisible ? "lg:grid-cols-[13rem_minmax(0,1fr)_13rem]" : "lg:grid-cols-1"} lg:items-start`}>
        {/* stage — lessons open here; the shell around it never unmounts */}
        <div
          className={`wj-card relative col-span-2 overflow-hidden p-0 lg:order-2 ${camsVisible ? "lg:col-span-1" : ""} ${
            stageLesson ? "h-[74vh]" : "flex min-h-[46vh] items-center justify-center"
          }`}
        >
          {/* screen share overlays the stage; the lesson stays mounted */}
          {screenShare && (
            <div className="absolute inset-0 z-20 bg-ink">
              <ShareView track={screenShare.track.mediaStreamTrack} />
            </div>
          )}
          {stageLesson ? (
            <AdventureTheater lesson={stageLesson} embedded onExit={() => setStageLesson(null)} />
          ) : (
            <div className="flex flex-col items-center gap-4 p-8 text-center">
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
                hand={hands[enlargedP.identity] ?? false}
                version={version}
                onClick={() => setEnlarged(null)}
              />
              <p className="mt-1 text-center text-[10px] font-bold text-white drop-shadow">tap to unpin</p>
            </div>
          )}
        </div>

        {/* 👩‍🏫 Teacher camera — pinned, always visible */}
        {camsVisible && (
          <div className="lg:order-1 lg:sticky lg:top-20">
            <p className="mb-1 text-center text-[11px] font-bold uppercase tracking-wide text-ink-soft">👩‍🏫 Teacher</p>
            <ParticipantTile
              participant={room.localParticipant}
              isLocal
              hand={hands[room.localParticipant.identity] ?? false}
              version={version}
              onClick={() => setEnlarged(room.localParticipant.identity)}
            />
          </div>
        )}

        {/* 👨‍👩‍👧‍👦 Family camera — pinned, always visible */}
        {camsVisible && (
          <div className="lg:order-3 lg:sticky lg:top-20">
            <p className="mb-1 text-center text-[11px] font-bold uppercase tracking-wide text-ink-soft">👨‍👩‍👧‍👦 {familyName}</p>
            {familyFeed ? (
              <ParticipantTile
                participant={familyFeed}
                isLocal={false}
                hand={hands[familyFeed.identity] ?? false}
                version={version}
                onClick={() => setEnlarged(familyFeed.identity)}
              />
            ) : (
              <div className="flex aspect-video w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-sand-deep bg-sand text-center text-ink-soft">
                <span className="text-3xl">💛</span>
                <span className="font-hand px-2 text-sm">Waiting for the family to join…</span>
              </div>
            )}
            {/* future participants stack here automatically */}
            {extraFeeds.map((p) => (
              <div key={p.identity} className="mt-2">
                <ParticipantTile participant={p} isLocal={false} hand={hands[p.identity] ?? false} version={version} onClick={() => setEnlarged(p.identity)} />
              </div>
            ))}
          </div>
        )}
      </div>

      {chatOpen && (
        <div className="wj-card p-4">
          <p className="font-display">💬 Class Chat</p>
          <div className="mt-2 max-h-32 space-y-1 overflow-y-auto text-sm">
            {chat.length === 0 && <p className="font-hand text-ink-soft">Say hello to the family! 👋</p>}
            {chat.map((c, i) => (<p key={i}><b>{c.who}:</b> {c.text}</p>))}
          </div>
          <div className="mt-2 flex gap-2">
            <input className="wj-input" value={msg} onChange={(e) => setMsg(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Type a message…" />
            <button className="wj-btn" onClick={send}>Send</button>
          </div>
        </div>
      )}

      <div className="wj-card sticky bottom-2 z-10 flex flex-wrap items-center justify-center gap-2 p-3">
        <ToolBtn onClick={() => void toggleMic()} active={micOn} label={micOn ? "🎤 Mic" : "🔇 Muted"} />
        <ToolBtn onClick={() => void toggleCam()} active={camOn} label={camOn ? "📷 Cam" : "📷 Off"} />
        <ToolBtn onClick={() => void toggleShare()} active={!!screenShare && screenShare.participant === room.localParticipant} label="🖥️ Share" />
        <ToolBtn onClick={() => setDrawing((d) => !d)} active={drawing} label="✏️ Draw" />
        <ToolBtn onClick={toggleHand} active={myHand} label="✋ Hand" />
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

function ParticipantTile({ participant, isLocal, hand, version, onClick }: {
  participant: Participant;
  isLocal: boolean;
  hand: boolean;
  version: number;
  onClick?: () => void;
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
      className={`relative aspect-video w-full overflow-hidden rounded-2xl bg-ink ${participant.isSpeaking ? "ring-4 ring-mango" : ""} ${onClick ? "cursor-pointer" : ""}`}
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

/* ── Solo classroom (Stage 1 fallback) ──────────────────────── */
function SoloRoom({ name, lesson, devices, onLeave }: {
  name: string;
  lesson: Lesson | null;
  devices: { camId: string; micId: string; camOn: boolean; micOn: boolean };
  onLeave: () => void;
}) {
  const cam = useLocalCamera(devices);
  const [sharing, setSharing] = useState(false);
  const [stageLesson, setStageLesson] = useState<Lesson | null>(null);
  const [drawing, setDrawing] = useState(false);
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
    } catch { /* cancelled */ }
  }

  function leave() {
    cam.stop();
    shareRef.current?.getTracks().forEach((t) => t.stop());
    onLeave();
  }

  return (
    <div className="space-y-3">
      <div className="wj-card-bubble wj-note p-3 text-center">
        <p className="font-display text-sm text-white">
          Solo mode — live family video turns on once the LiveKit keys are set in Netlify (docs/LIVEKIT_SETUP.md). 💛
        </p>
      </div>

      {/* Same Meet-style V1 layout: teacher left · lesson center · family right */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-[13rem_minmax(0,1fr)_13rem] lg:items-start">
        <div className={`wj-card relative col-span-2 overflow-hidden p-0 lg:order-2 lg:col-span-1 ${stageLesson ? "h-[74vh]" : "flex min-h-[46vh] items-center justify-center"}`}>
          {sharing && (
            <div className="absolute inset-0 z-20 bg-ink">
              <video ref={shareVideoRef} autoPlay playsInline className="h-full w-full object-contain" />
            </div>
          )}
          {stageLesson ? (
            <AdventureTheater lesson={stageLesson} embedded onExit={() => setStageLesson(null)} />
          ) : (
            <div className="flex flex-col items-center gap-4 p-8 text-center">
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

        {/* 👩‍🏫 Teacher camera — pinned */}
        <div className="lg:order-1 lg:sticky lg:top-20">
          <p className="mb-1 text-center text-[11px] font-bold uppercase tracking-wide text-ink-soft">👩‍🏫 Teacher</p>
          <LocalCameraView streamRef={cam.streamRef} camOn={cam.camOn} tick={cam.tick} className="aspect-video w-full" label={name} />
        </div>

        {/* 👨‍👩‍👧‍👦 Family camera — appears when LiveKit is connected */}
        <div className="lg:order-3 lg:sticky lg:top-20">
          <p className="mb-1 text-center text-[11px] font-bold uppercase tracking-wide text-ink-soft">👨‍👩‍👧‍👦 {familyName}</p>
          <div className="flex aspect-video w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-sand-deep bg-sand text-center text-ink-soft">
            <span className="text-3xl">💛</span>
            <span className="font-hand px-2 text-sm">Family video appears here once LiveKit is connected</span>
          </div>
        </div>
      </div>

      {cam.error && (
        <div className="wj-card p-3 text-center text-sm text-hibiscus-deep">
          {cam.error} <button className="wj-btn wj-btn-ghost ml-2 text-sm" onClick={() => void cam.start()}>Retry</button>
        </div>
      )}

      <div className="wj-card sticky bottom-2 z-10 flex flex-wrap items-center justify-center gap-2 p-3">
        <ToolBtn onClick={cam.toggleMic} active={cam.micOn} label={cam.micOn ? "🎤 Mic" : "🔇 Muted"} />
        <ToolBtn onClick={cam.toggleCam} active={cam.camOn} label={cam.camOn ? "📷 Cam" : "📷 Off"} />
        <ToolBtn onClick={() => void toggleShare()} active={sharing} label="🖥️ Share" />
        <ToolBtn onClick={() => setDrawing((d) => !d)} active={drawing} label="✏️ Draw" />
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
