"use client";

import { useEffect, useRef, useState } from "react";
import { celebrations, daysUntil, type Celebration } from "@/config/celebrations";
import { familyMembers, teacherMember, type FamilyMember } from "@/config/family";
import { KEYS, todayISO, type VoiceGift } from "@/lib/app-state";
import { sendEvent } from "@/lib/cloud-sync";
import { newId, useStored } from "@/lib/storage";

// 🎙️ BIRTHDAY VOICE GIFTS
// Anyone in the family taps the mic, it records right away, and the
// message is saved for the celebrant — one loving voice at a time.
// Recordings are small (30s max, gentle bitrate) and sync to the cloud
// so the birthday person hears them on any device.

const MAX_SECONDS = 30;
const KEEP_MOST_RECENT = 40;

const senders: FamilyMember[] = [...familyMembers, teacherMember];

type RecState = "idle" | "asking" | "recording" | "preview" | "error";

export function VoiceGifts() {
  const [gifts, setGifts] = useStored<VoiceGift[]>(KEYS.voiceGifts, []);
  const upcoming = [...celebrations].sort((a, b) => daysUntil(a) - daysUntil(b));
  const [celebId, setCelebId] = useState(upcoming[0]?.id ?? "");
  const celeb: Celebration | undefined = celebrations.find((c) => c.id === celebId) ?? upcoming[0];
  const [senderId, setSenderId] = useState<string>("");
  const sender = senders.find((m) => m.id === senderId) ?? null;

  const [rec, setRec] = useState<RecState>("idle");
  const [seconds, setSeconds] = useState(0);
  const [preview, setPreview] = useState<{ audio: string; duration: number } | null>(null);
  const [sent, setSent] = useState(false);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // clean up mic + timer if the page closes mid-recording
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (recorderRef.current?.state === "recording") recorderRef.current.stop();
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  async function startRecording() {
    if (!sender) return;
    setRec("asking");
    setSent(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mime = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : undefined;
      const recorder = new MediaRecorder(stream, {
        ...(mime ? { mimeType: mime } : {}),
        audioBitsPerSecond: 32000, // small files that still sound warm
      });
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
        const blob = new Blob(chunksRef.current, { type: mime ?? "audio/webm" });
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview({ audio: reader.result as string, duration: secondsRef.current });
          setRec("preview");
        };
        reader.readAsDataURL(blob);
      };
      recorder.start();
      recorderRef.current = recorder;
      setSeconds(0);
      secondsRef.current = 0;
      setRec("recording");
      timerRef.current = setInterval(() => {
        secondsRef.current += 1;
        setSeconds(secondsRef.current);
        if (secondsRef.current >= MAX_SECONDS) stopRecording();
      }, 1000);
    } catch {
      setRec("error");
    }
  }

  const secondsRef = useRef(0);

  function stopRecording() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (recorderRef.current?.state === "recording") recorderRef.current.stop();
  }

  function discard() {
    setPreview(null);
    setRec("idle");
  }

  function send() {
    if (!preview || !sender || !celeb) return;
    const gift: VoiceGift = {
      id: newId(),
      fromId: sender.id,
      fromName: sender.name,
      fromEmoji: sender.emoji,
      celebrationId: celeb.id,
      celebrantName: celeb.name,
      date: todayISO(),
      duration: preview.duration,
      audio: preview.audio,
    };
    setGifts((g) => [gift, ...g].slice(0, KEEP_MOST_RECENT));
    sendEvent("voice.gift", { from: sender.name, to: celeb.name });
    setPreview(null);
    setRec("idle");
    setSent(true);
  }

  function remove(id: string) {
    setGifts((g) => g.filter((x) => x.id !== id));
  }

  const celebGifts = gifts.filter((g) => g.celebrationId === (celeb?.id ?? ""));
  const days = celeb ? daysUntil(celeb) : null;

  return (
    <section className="wj-card bg-gradient-to-br from-mango/10 to-hibiscus/10 p-6">
      <h2 className="font-display text-xl font-extrabold">🎙️ Birthday Voice Messages</h2>
      <p className="font-hand mt-1 text-base text-ink-soft">
        Tap the mic and speak from the heart — your voice becomes a gift the celebrant can play
        again and again. 💛
      </p>

      {/* who is it for */}
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <label className="text-sm font-bold text-ink-soft">🎂 For</label>
          <select className="wj-input mt-1" value={celeb?.id ?? ""} onChange={(e) => setCelebId(e.target.value)}>
            {upcoming.map((c) => (
              <option key={c.id} value={c.id}>
                {c.emoji} {c.type === "birthday" ? `${c.name}'s Birthday` : c.name}
                {daysUntil(c) === 0 ? " — TODAY! 🎉" : ` (in ${daysUntil(c)}d)`}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-bold text-ink-soft">💌 From</label>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {senders.map((m) => (
              <button
                key={m.id}
                onClick={() => setSenderId(m.id)}
                className={`wj-chip !text-sm transition-colors ${
                  senderId === m.id ? "!bg-sunset !text-white" : "hover:bg-mango/20"
                }`}
              >
                {m.emoji} {m.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* the mic */}
      <div className="mt-5 flex flex-col items-center gap-2 text-center">
        {rec === "recording" ? (
          <>
            <button
              onClick={stopRecording}
              className="animate-pulse flex h-24 w-24 items-center justify-center rounded-full bg-hibiscus text-4xl text-white shadow-xl ring-8 ring-hibiscus/25"
              title="Tap to finish"
            >
              ⏹
            </button>
            <p className="font-display text-lg text-hibiscus-deep">
              Recording… {String(Math.floor(seconds / 60)).padStart(1, "0")}:{String(seconds % 60).padStart(2, "0")}
            </p>
            <p className="text-xs text-ink-soft">tap to finish · up to {MAX_SECONDS} seconds</p>
          </>
        ) : rec === "preview" && preview ? (
          <>
            <p className="font-display text-base">💛 Listen back — happy with it?</p>
            <audio controls src={preview.audio} className="w-full max-w-sm" />
            <div className="mt-1 flex gap-3">
              <button className="wj-btn wj-btn-ghost !px-4 !py-1.5 text-sm" onClick={discard}>
                🔄 Record again
              </button>
              <button className="wj-btn !px-5 !py-1.5" onClick={send}>
                💌 Send to {celeb?.name ?? "the celebrant"}
              </button>
            </div>
          </>
        ) : (
          <>
            <button
              onClick={startRecording}
              disabled={!sender || rec === "asking"}
              className={`flex h-24 w-24 items-center justify-center rounded-full text-4xl shadow-xl transition-transform ${
                sender
                  ? "bg-gradient-to-br from-sunset to-hibiscus text-white hover:scale-105"
                  : "bg-sand-deep text-ink-soft"
              }`}
              title={sender ? "Tap to start recording" : "Choose who's sending first"}
            >
              🎤
            </button>
            <p className="font-display text-base">
              {rec === "asking"
                ? "Starting the microphone…"
                : sender
                ? `Tap to record, ${sender.name}!`
                : "Choose who's sending, then tap the mic"}
            </p>
            {rec === "error" && (
              <p className="rounded-2xl bg-hibiscus/10 px-4 py-2 text-sm font-bold text-hibiscus-deep">
                We couldn&apos;t reach the microphone — please allow mic access and try again. 💛
              </p>
            )}
            {sent && (
              <p className="wj-pop-in rounded-2xl bg-palm/10 px-4 py-2 text-sm font-bold text-palm-deep">
                🎁 Sent! Your voice is waiting for {celeb?.name}.
              </p>
            )}
          </>
        )}
      </div>

      {/* gifts received for this celebrant */}
      <div className="mt-6">
        <h3 className="font-display text-base font-extrabold">
          🎁 Voice gifts for {celeb?.name ?? "…"}{" "}
          {days === 0 && <span className="text-hibiscus-deep">— play them today! 🎊</span>}
        </h3>
        {celebGifts.length === 0 ? (
          <p className="font-hand mt-2 text-base text-ink-soft">
            No messages yet — be the first voice they hear! 🎈
          </p>
        ) : (
          <ul className="mt-3 space-y-2">
            {celebGifts.map((g) => (
              <li key={g.id} className="flex flex-wrap items-center gap-3 rounded-2xl border-2 border-sand-deep bg-white/70 p-3">
                <span className="text-2xl">{g.fromEmoji}</span>
                <div className="min-w-24">
                  <p className="font-display text-sm font-extrabold">{g.fromName}</p>
                  <p className="text-xs text-ink-soft">{g.date} · {g.duration}s</p>
                </div>
                <audio controls src={g.audio} className="h-10 min-w-0 flex-1" />
                <button
                  className="rounded-full px-2 py-1 text-sm hover:bg-hibiscus/15"
                  title="Remove this message"
                  onClick={() => remove(g.id)}
                >
                  🗑️
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
