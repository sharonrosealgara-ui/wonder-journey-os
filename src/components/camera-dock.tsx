"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Participant, Track } from "livekit-client";
import { familyName, teacherName } from "@/config/family";
import { getTodaysLesson } from "@/config/lessons";
import { normalizeMode } from "@/config/navigation";
import { todayISO } from "@/lib/app-state";
import { participantRole, useCall } from "@/lib/call-context";
import { initCloudSync } from "@/lib/cloud-sync";
import { readStored, useStored } from "@/lib/storage";

// 🎥 FLOATING CAMERA DOCK — the call follows the family everywhere.
// Cameras auto-start when the app opens (family camera ABOVE teacher),
// float over every page including full-screen lessons (Theater Mode),
// and only "End" turns them off. Hidden on /classroom, which shows the
// full-size room instead.
//
// The class code is handled once at the front door (AccessGate), so
// there is never a code prompt here.

type DockPref = "on" | "min" | "off";

// 📏 The family can make the cameras as big as they like — faces should
// be easy to read from across the room, on either side of the call.
type DockSize = "s" | "m" | "l" | "xl";
const SIZE_ORDER: DockSize[] = ["s", "m", "l", "xl"];
const SIZE_CLASS: Record<DockSize, string> = {
  s: "w-56",
  m: "w-72",
  l: "w-[22rem]",
  xl: "w-[28rem]",
};
const SIZE_LABEL: Record<DockSize, string> = { s: "Small", m: "Medium", l: "Large", xl: "Extra large" };

export function CameraDock() {
  const call = useCall();
  const pathname = usePathname();
  const [pref, setPref] = useStored<DockPref>("dock", "on");
  const [size, setSize] = useStored<DockSize>("dockSize", "l"); // big by default
  const [ready, setReady] = useState(false);
  const triedRef = useRef(false);

  useEffect(() => setReady(true), []);

  const startCall = useCallback(() => {
    const mode = normalizeMode(readStored<string>("mode", "family"));
    const code = readStored<string>("classCode", "");
    const lesson = getTodaysLesson();
    void call
      .join({
        name: mode === "teacher" ? teacherName : familyName,
        code,
        role: mode === "teacher" ? "teacher" : "family",
        roomName: `wj-${lesson?.id ?? "class"}-${todayISO()}`,
        camId: "",
        micId: "",
        camOn: true,
        micOn: true,
        silent: true, // wrong/missing code → quiet local camera, never an error
      })
      .then(() => initCloudSync());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // auto-start once when the app opens (the code is already in hand)
  useEffect(() => {
    if (!ready || triedRef.current) return;
    if (pref === "off" || call.status !== "idle") return;
    triedRef.current = true;
    startCall();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, pref, call.status]);

  if (!ready) return null;
  if (pathname.startsWith("/classroom")) return null; // full room lives there

  // turned off → tiny start pill
  if (pref === "off" || call.status === "idle" || call.status === "connecting") {
    return (
      <button
        onClick={() => {
          triedRef.current = true;
          setPref("on");
          if (call.status === "idle") startCall();
        }}
        className="wj-chip fixed bottom-3 right-3 z-[70] !bg-paper shadow-xl hover:!bg-mango/20"
        title="Start family cameras"
      >
        🎥 {call.status === "connecting" ? "Starting…" : "Cameras"}
      </button>
    );
  }

  // EXACTLY TWO CAMERAS: one Family, one Teacher — each picked by the
  // role the SERVER assigned from the code. Never a doubled tile.
  const familyP = call.participants.find((p) => participantRole(p) === "family") ?? null;
  const teacherP = call.participants.find((p) => participantRole(p) === "teacher") ?? null;
  const localP = call.room?.localParticipant ?? null;
  const live = call.status === "connected";

  // minimized → status pill
  if (pref === "min") {
    return (
      <button
        onClick={() => setPref("on")}
        className="wj-chip fixed bottom-3 right-3 z-[70] !bg-paper shadow-xl hover:!bg-mango/20"
        title="Show cameras"
      >
        🎥 {live ? `Live · ${call.participants.length}` : "Camera on"}
      </button>
    );
  }

  const i = SIZE_ORDER.indexOf(size);
  const grow = () => setSize(SIZE_ORDER[Math.min(i + 1, SIZE_ORDER.length - 1)]);
  const shrink = () => setSize(SIZE_ORDER[Math.max(i - 1, 0)]);

  return (
    <div className={`fixed bottom-3 right-3 z-[70] select-none ${SIZE_CLASS[size]} max-w-[calc(100vw-1.5rem)]`}>
      <div className="wj-card space-y-2 p-2 shadow-2xl">
        {/* header */}
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] font-bold text-ink-soft">
            {live ? "🟢 Live together" : "🎥 Camera on"}
          </span>
          <div className="flex items-center gap-0.5">
            <button
              className="rounded-full px-1.5 text-sm hover:bg-sand-deep disabled:opacity-30"
              title="Smaller cameras"
              onClick={shrink}
              disabled={i === 0}
            >
              ➖
            </button>
            <span className="px-0.5 text-[10px] font-bold text-ink-soft" title={`${SIZE_LABEL[size]} cameras`}>
              {SIZE_LABEL[size]}
            </span>
            <button
              className="rounded-full px-1.5 text-sm hover:bg-sand-deep disabled:opacity-30"
              title="Bigger cameras"
              onClick={grow}
              disabled={i === SIZE_ORDER.length - 1}
            >
              ➕
            </button>
            <button className="ml-1 rounded-full px-1.5 text-sm hover:bg-sand-deep" title="Minimize" onClick={() => setPref("min")}>▁</button>
            <button
              className="rounded-full px-1.5 text-sm hover:bg-hibiscus/20"
              title="End cameras"
              onClick={() => {
                setPref("off");
                call.endCall();
              }}
            >
              ✖
            </button>
          </div>
        </div>

        {/* 👨‍👩‍👧‍👦 Family — always on top, exactly one tile */}
        <div>
          <p className="mb-0.5 text-center text-[10px] font-bold uppercase tracking-wide text-ink-soft">👨‍👩‍👧‍👦 {familyName}</p>
          {familyP ? (
            <LKVideo participant={familyP} muted={familyP === localP} version={call.version} tall />
          ) : !call.room && !call.isTeacher ? (
            <SoloVideo stream={call.soloStream} camOn={call.camOn} tall />
          ) : (
            <DockPlaceholder text="Waiting for the family…" tall />
          )}
        </div>

        {/* 👩‍🏫 Teacher — below, exactly one tile */}
        <div>
          <p className="mb-0.5 text-center text-[10px] font-bold uppercase tracking-wide text-ink-soft">👩‍🏫 {teacherName}</p>
          {teacherP ? (
            <LKVideo participant={teacherP} muted={teacherP === localP} version={call.version} />
          ) : !call.room && call.isTeacher ? (
            <SoloVideo stream={call.soloStream} camOn={call.camOn} />
          ) : (
            <DockPlaceholder text={live ? "Waiting for Teacher…" : "Teacher joins in class"} />
          )}
        </div>

        {/* controls */}
        <div className="flex items-center justify-center gap-1.5 pb-0.5">
          <button
            onClick={call.toggleMic}
            className={`rounded-full px-2.5 py-1 text-sm ${call.micOn ? "bg-ocean text-white" : "bg-sand-deep"}`}
            title={call.micOn ? "Mute" : "Unmute"}
          >
            {call.micOn ? "🎤" : "🔇"}
          </button>
          <button
            onClick={call.toggleCam}
            className={`rounded-full px-2.5 py-1 text-sm ${call.camOn ? "bg-ocean text-white" : "bg-sand-deep"}`}
            title={call.camOn ? "Camera off" : "Camera on"}
          >
            📷
          </button>
          <a href="/classroom/" className="rounded-full bg-sunset px-2.5 py-1 font-display text-xs text-white shadow" title="Open the full classroom">
            Open Classroom
          </a>
        </div>
      </div>
    </div>
  );
}

/* ── tiles ──────────────────────────────────────────────────── */

function LKVideo({ participant, muted = false, version, tall = false }: {
  participant: Participant;
  muted?: boolean;
  version: number;
  tall?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const camPub = participant.getTrackPublication(Track.Source.Camera);
    if (camPub?.track && videoRef.current) camPub.track.attach(videoRef.current);
    if (!muted) {
      const micPub = participant.getTrackPublication(Track.Source.Microphone);
      if (micPub?.track && audioRef.current) micPub.track.attach(audioRef.current);
    }
    return () => {
      camPub?.track?.detach();
    };
  }, [participant, muted, version]);

  const camPub = participant.getTrackPublication(Track.Source.Camera);
  const showVideo = !!camPub?.track && !camPub.isMuted;

  return (
    <div className={`relative w-full overflow-hidden rounded-xl bg-ink ${tall ? "aspect-[4/3]" : "aspect-video"} ${participant.isSpeaking ? "ring-2 ring-mango" : ""}`}>
      <video ref={videoRef} autoPlay muted={muted} playsInline className={`h-full w-full object-cover ${showVideo ? "" : "hidden"}`} />
      {!muted && <audio ref={audioRef} autoPlay />}
      {!showVideo && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-ocean-deep to-ube-deep text-2xl">📷</div>
      )}
    </div>
  );
}

function SoloVideo({ stream, camOn, tall = false }: { stream: MediaStream | null; camOn: boolean; tall?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (ref.current && stream) {
      ref.current.srcObject = stream;
      void ref.current.play().catch(() => {});
    }
  }, [stream]);
  return (
    <div className={`relative w-full overflow-hidden rounded-xl bg-ink ${tall ? "aspect-[4/3]" : "aspect-video"}`}>
      <video ref={ref} autoPlay muted playsInline className={`h-full w-full object-cover ${camOn && stream ? "" : "hidden"}`} />
      {(!camOn || !stream) && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-ocean-deep to-ube-deep text-2xl">📷</div>
      )}
    </div>
  );
}

function DockPlaceholder({ text, tall = false }: { text: string; tall?: boolean }) {
  return (
    <div className={`flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-sand-deep bg-sand text-center ${tall ? "aspect-[4/3]" : "aspect-video"}`}>
      <span className="text-xl">💛</span>
      <span className="font-hand px-2 text-xs text-ink-soft">{text}</span>
    </div>
  );
}
