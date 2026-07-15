"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Participant, Track } from "livekit-client";
import { familyName, teacherName } from "@/config/family";
import { getTodaysLesson } from "@/config/lessons";
import { normalizeMode } from "@/config/navigation";
import { todayISO } from "@/lib/app-state";
import { useCall } from "@/lib/call-context";
import { initCloudSync } from "@/lib/cloud-sync";
import { readStored, useStored, writeStored } from "@/lib/storage";

// 🎥 FLOATING CAMERA DOCK — the call follows the family everywhere.
// Cameras auto-start when the app opens (family camera ABOVE teacher),
// float over every page including full-screen lessons (Theater Mode),
// and only "End" turns them off. Hidden on /classroom, which shows the
// full-size room instead.

type DockPref = "on" | "min" | "off";

export function CameraDock() {
  const call = useCall();
  const pathname = usePathname();
  const [pref, setPref] = useStored<DockPref>("dock", "on");
  const [prefReady, setPrefReady] = useState(false);
  const triedRef = useRef(false);
  const [codeCard, setCodeCard] = useState(false); // one-time class-code setup
  const [codeInput, setCodeInput] = useState("");
  const [codeDismissed, setCodeDismissed] = useStored<boolean>("codePromptDismissed", false);

  // ✨ Magic invite link: opening the app with ?code=XXXX saves the
  // class code forever on this device — the family never types it.
  // (Share: https://wonder-journey-os.netlify.app/?code=YOURCODE)
  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      const c = url.searchParams.get("code");
      if (c && c.trim()) {
        writeStored("classCode", c.trim());
        url.searchParams.delete("code");
        const clean = url.pathname + url.search + url.hash;
        // strip after hydration so Next's router doesn't restore it
        setTimeout(() => window.history.replaceState(null, "", clean), 400);
      }
    } catch { /* ignore */ }
  }, []);

  useEffect(() => setPrefReady(true), []);

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
        silent: true, // no code / wrong code → quiet local camera
      })
      .then(() => initCloudSync());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // auto-start once when the app opens (unless the user turned it off)
  useEffect(() => {
    if (!prefReady || triedRef.current) return;
    if (pref === "off" || call.status !== "idle") return;
    const code = readStored<string>("classCode", "");
    if (!code && !codeDismissed) {
      // first open on this device: ask for the class code ONE time
      setCodeCard(true);
      return;
    }
    triedRef.current = true;
    startCall();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefReady, pref, call.status, codeDismissed]);

  if (!prefReady) return null;
  if (pathname.startsWith("/classroom")) return null; // full room lives there

  // 🔑 ONE-TIME SETUP — shown only until a class code is saved on this
  // device. After this, opening the app connects everything by itself.
  if (codeCard) {
    const save = () => {
      const c = codeInput.trim();
      if (!c) return;
      writeStored("classCode", c);
      setCodeCard(false);
      triedRef.current = true;
      startCall();
    };
    return (
      <div className="wj-card fixed bottom-3 right-3 z-[70] w-72 space-y-2.5 p-4 shadow-2xl sm:w-80">
        <p className="font-display text-base">🔑 One-time setup</p>
        <p className="font-hand text-sm text-ink-soft">
          Enter the class code from {teacherName} — you&apos;ll only ever do this once on this device. After that, Wonder Journey connects all by itself. 💛
        </p>
        <input
          className="wj-input"
          value={codeInput}
          onChange={(e) => setCodeInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && save()}
          placeholder="class code"
          autoFocus
        />
        <div className="flex items-center justify-between gap-2">
          <button
            className="wj-btn wj-btn-ghost !px-3 !py-1.5 text-xs"
            onClick={() => {
              setCodeDismissed(true);
              setCodeCard(false);
              triedRef.current = true;
              startCall(); // camera still works, just not live together
            }}
          >
            Not now
          </button>
          <button className="wj-btn !px-4 !py-1.5 text-sm" onClick={save}>
            💛 Save &amp; Go Live
          </button>
        </div>
      </div>
    );
  }

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

  const remotes = call.participants.filter((p) => p !== call.room?.localParticipant);
  const familyFeed = remotes[0] ?? null;
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

  return (
    <div className="fixed bottom-3 right-3 z-[70] w-56 select-none sm:w-64">
      <div className="wj-card space-y-2 p-2 shadow-2xl">
        {/* header */}
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] font-bold text-ink-soft">
            {live ? "🟢 Live together" : "🎥 Camera on"}
          </span>
          <div className="flex gap-1">
            {!live && (
              <button
                className="rounded-full px-1.5 text-sm hover:bg-mango/20"
                title="Enter class code to go live together"
                onClick={() => {
                  setCodeInput(readStored<string>("classCode", ""));
                  setCodeCard(true);
                }}
              >
                🔑
              </button>
            )}
            <button className="rounded-full px-1.5 text-sm hover:bg-sand-deep" title="Minimize" onClick={() => setPref("min")}>▁</button>
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

        {/* 👨‍👩‍👧‍👦 Family — always on top */}
        <div>
          <p className="mb-0.5 text-center text-[10px] font-bold uppercase tracking-wide text-ink-soft">👨‍👩‍👧‍👦 {familyName}</p>
          {call.isTeacher ? (
            familyFeed ? (
              <LKVideo participant={familyFeed} version={call.version} tall />
            ) : (
              <DockPlaceholder text="Waiting for the family…" tall />
            )
          ) : call.room ? (
            <LKVideo participant={call.room.localParticipant} muted version={call.version} tall />
          ) : (
            <SoloVideo stream={call.soloStream} camOn={call.camOn} tall />
          )}
        </div>

        {/* 👩‍🏫 Teacher — below */}
        <div>
          <p className="mb-0.5 text-center text-[10px] font-bold uppercase tracking-wide text-ink-soft">👩‍🏫 {teacherName}</p>
          {call.isTeacher ? (
            call.room ? (
              <LKVideo participant={call.room.localParticipant} muted version={call.version} />
            ) : (
              <SoloVideo stream={call.soloStream} camOn={call.camOn} />
            )
          ) : familyFeed ? (
            <LKVideo participant={familyFeed} version={call.version} />
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
