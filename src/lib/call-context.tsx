"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import {
  ConnectionState,
  Participant,
  RemoteParticipant,
  Room,
  RoomEvent,
  Track,
} from "livekit-client";
import { writeStored } from "@/lib/storage";

// A participant's side of the call, decided by the SERVER from which
// code they presented (identity "teacher" / "family"; legacy identities
// kept a role prefix, so startsWith covers both).
export function participantRole(p: Participant): "teacher" | "family" {
  try {
    const meta = JSON.parse(p.metadata || "{}") as { role?: string };
    if (meta.role === "teacher" || meta.role === "family") return meta.role;
  } catch { /* fall through */ }
  return p.identity.startsWith("teacher") ? "teacher" : "family";
}

// ─────────────────────────────────────────────────────────────
// GLOBAL CALL CONTEXT (Decision 044)
// The live call lives ABOVE the router, inside the persistent app
// shell — so the family can explore ALL of Wonder Journey (Adventure
// Mode) or watch a full-screen lesson (Theater Mode) while the
// Teacher & Family cameras stay connected. Only "End Call" hangs up.
// ─────────────────────────────────────────────────────────────

export type CallStatus = "idle" | "connecting" | "connected" | "solo";
export type ChatMsg = { who: string; text: string };

export type JoinOptions = {
  name: string;
  code: string;
  role: "teacher" | "family";
  roomName: string;
  camId: string;
  micId: string;
  camOn: boolean;
  micOn: boolean;
  /** auto-start mode: on a wrong/missing code, quietly fall back to a
      local-only camera instead of reporting an error */
  silent?: boolean;
};

export type JoinResult = "connected" | "solo" | "wrong_code" | "error";

type CallCtx = {
  status: CallStatus;
  connState: ConnectionState | null;
  name: string;
  isTeacher: boolean;
  room: Room | null;
  soloStream: MediaStream | null;
  version: number; // bumps on any room event → tiles re-attach
  participants: Participant[];
  chat: ChatMsg[];
  hands: Record<string, boolean>;
  micOn: boolean;
  camOn: boolean;
  sharing: boolean;
  join: (opts: JoinOptions) => Promise<JoinResult>;
  endCall: () => void;
  toggleMic: () => void;
  toggleCam: () => void;
  toggleShare: () => void;
  toggleHand: () => void;
  myHand: boolean;
  sendChat: (text: string) => void;
};

const Ctx = createContext<CallCtx | null>(null);

export function useCall(): CallCtx {
  const v = useContext(Ctx);
  if (!v) throw new Error("useCall must be used inside CallProvider");
  return v;
}

export function CallProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<CallStatus>("idle");
  const [connState, setConnState] = useState<ConnectionState | null>(null);
  const [name, setName] = useState("");
  const [isTeacher, setIsTeacher] = useState(false);
  const roomRef = useRef<Room | null>(null);
  const [soloStream, setSoloStream] = useState<MediaStream | null>(null);
  const [version, setVersion] = useState(0);
  const [chat, setChat] = useState<ChatMsg[]>([]);
  const [hands, setHands] = useState<Record<string, boolean>>({});
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [sharing, setSharing] = useState(false);

  const bump = useCallback(() => setVersion((v) => v + 1), []);

  const join = useCallback(
    async (opts: JoinOptions): Promise<JoinResult> => {
      // clean up any previous session first (re-join safe)
      roomRef.current?.disconnect();
      roomRef.current = null;
      setSoloStream((prev) => {
        prev?.getTracks().forEach((t) => t.stop());
        return null;
      });

      setStatus("connecting");
      setName(opts.name);
      setIsTeacher(opts.role === "teacher");
      setMicOn(opts.micOn);
      setCamOn(opts.camOn);

      const soloFallback = async (): Promise<JoinResult> => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: opts.camId ? { deviceId: { exact: opts.camId } } : true,
            audio: opts.micId ? { deviceId: { exact: opts.micId } } : true,
          });
          stream.getVideoTracks().forEach((t) => (t.enabled = opts.camOn));
          stream.getAudioTracks().forEach((t) => (t.enabled = opts.micOn));
          setSoloStream(stream);
          setStatus("solo");
          return "solo";
        } catch {
          setStatus("idle");
          return "error";
        }
      };

      // Try the secure LiveKit token function first.
      try {
        const res = await fetch("/api/livekit-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: opts.name, room: opts.roomName, role: opts.role, code: opts.code }),
        });
        if (res.status === 401) {
          if (opts.silent) return soloFallback();
          setStatus("idle");
          return "wrong_code";
        }
        if (!res.ok) throw new Error("not configured");
        const { token, url, role } = (await res.json()) as { token: string; url: string; role?: string };

        // The SERVER decided the role from the code (two-code system) —
        // adopt its verdict so the device labels itself correctly from
        // now on, no matter what the browser guessed.
        if (role === "teacher" || role === "family") {
          setIsTeacher(role === "teacher");
          writeStored("mode", role);
        }

        const room = new Room({
          adaptiveStream: true,
          dynacast: true,
          videoCaptureDefaults: opts.camId ? { deviceId: opts.camId } : undefined,
          audioCaptureDefaults: opts.micId ? { deviceId: opts.micId } : undefined,
        });

        // room events → version bumps + chat/hand messages + attendance
        const evs = [
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
        evs.forEach((e) => room.on(e, bump));
        room.on(RoomEvent.ConnectionStateChanged, (s) => setConnState(s));
        // server closed the room / network gone for good → back to idle
        room.on(RoomEvent.Disconnected, () => {
          if (roomRef.current === room) {
            roomRef.current = null;
            setStatus("idle");
            bump();
          }
        });
        room.on(RoomEvent.DataReceived, (payload: Uint8Array, p?: RemoteParticipant) => {
          try {
            const d = JSON.parse(new TextDecoder().decode(payload)) as { type: string; who?: string; text?: string; up?: boolean };
            if (d.type === "chat" && d.who && d.text) setChat((c) => [...c, { who: d.who!, text: d.text! }]);
            if (d.type === "hand" && p) setHands((h) => ({ ...h, [p.identity]: !!d.up }));
          } catch { /* ignore */ }
        });
        if (opts.role === "teacher") {
          const log = (who: string, action: string) => {
            try {
              const key = `wjos:attendance-${opts.roomName}`;
              const rows = JSON.parse(localStorage.getItem(key) ?? "[]") as unknown[];
              rows.push({ who, action, time: new Date().toISOString() });
              localStorage.setItem(key, JSON.stringify(rows));
            } catch { /* ignore */ }
          };
          log(opts.name, "joined");
          room.on(RoomEvent.ParticipantConnected, (p) => log(p.name ?? p.identity, "joined"));
          room.on(RoomEvent.ParticipantDisconnected, (p) => log(p.name ?? p.identity, "left"));
        }

        await room.connect(url, token);
        await room.localParticipant.setCameraEnabled(opts.camOn);
        await room.localParticipant.setMicrophoneEnabled(opts.micOn);
        void room.startAudio();
        roomRef.current = room;
        setStatus("connected");
        bump();
        return "connected";
      } catch {
        // LiveKit unavailable — the local camera still works.
        return soloFallback();
      }
    },
    [bump]
  );

  const endCall = useCallback(() => {
    roomRef.current?.disconnect();
    roomRef.current = null;
    soloStream?.getTracks().forEach((t) => t.stop());
    setSoloStream(null);
    setChat([]);
    setHands({});
    setSharing(false);
    setConnState(null);
    setStatus("idle");
  }, [soloStream]);

  // clean up on full page unload
  useEffect(() => {
    const h = () => roomRef.current?.disconnect();
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, []);

  function toggleMic() {
    setMicOn((v) => {
      const nv = !v;
      void roomRef.current?.localParticipant.setMicrophoneEnabled(nv);
      soloStream?.getAudioTracks().forEach((t) => (t.enabled = nv));
      bump();
      return nv;
    });
  }
  function toggleCam() {
    setCamOn((v) => {
      const nv = !v;
      void roomRef.current?.localParticipant.setCameraEnabled(nv);
      soloStream?.getVideoTracks().forEach((t) => (t.enabled = nv));
      bump();
      return nv;
    });
  }
  function toggleShare() {
    const room = roomRef.current;
    if (!room) return;
    const next = !sharing;
    room.localParticipant
      .setScreenShareEnabled(next)
      .then(() => {
        setSharing(next);
        bump();
      })
      .catch(() => { /* user cancelled */ });
  }
  function sendData(obj: object) {
    void roomRef.current?.localParticipant.publishData(
      new TextEncoder().encode(JSON.stringify(obj)),
      { reliable: true }
    );
  }
  const myIdentity = roomRef.current?.localParticipant.identity ?? "me";
  const myHand = hands[myIdentity] ?? false;
  function toggleHand() {
    const up = !myHand;
    setHands((h) => ({ ...h, [myIdentity]: up }));
    sendData({ type: "hand", up });
  }
  function sendChat(text: string) {
    if (!text.trim()) return;
    sendData({ type: "chat", who: name, text: text.trim() });
    setChat((c) => [...c, { who: name, text: text.trim() }]);
  }

  const room = roomRef.current;
  const participants: Participant[] = room
    ? [room.localParticipant, ...Array.from(room.remoteParticipants.values())]
    : [];

  return (
    <Ctx.Provider
      value={{
        status, connState, name, isTeacher, room, soloStream, version, participants,
        chat, hands, micOn, camOn, sharing,
        join, endCall, toggleMic, toggleCam, toggleShare, toggleHand, myHand, sendChat,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

// helper for tiles: find a participant's screen-share track
export function getScreenShare(participants: Participant[]) {
  for (const p of participants) {
    const pub = p.getTrackPublication(Track.Source.ScreenShare);
    if (pub?.track) return { participant: p, track: pub.track };
  }
  return null;
}
