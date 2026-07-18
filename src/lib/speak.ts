"use client";

// 🗣️ TAP-TO-HEAR — speaks a Tagalog word with a REAL Filipino accent.
//
// Three layers, best available wins:
//   1. A genuine Filipino (fil/tl) voice installed on the device
//      (many Android phones have one; works offline)
//   2. Google's public Tagalog voice (the Google-Translate voice) —
//      authentic Filipino accent, streamed as audio; needs internet.
//      Note: this is an unofficial endpoint — if Google ever closes it,
//      the app falls back gracefully to layer 1/3, nothing breaks.
//   3. The device's default voice (robot accent) — last resort only
//
// The forever-plan stays: Teacher Sharon's own recorded voice can
// replace all of this later without changing any call site.

let filipinoVoice: SpeechSynthesisVoice | null = null;
let picked = false;
let audioEl: HTMLAudioElement | null = null;

function findFilipinoVoice(): SpeechSynthesisVoice | null {
  try {
    const voices = window.speechSynthesis?.getVoices() ?? [];
    if (voices.length > 0) picked = true;
    return (
      voices.find((v) => /^(fil|tl)([-_]|$)|tagalog|filipino/i.test(v.lang + " " + v.name)) ?? null
    );
  } catch {
    return null;
  }
}

// voices load asynchronously — keep trying until the list arrives
if (typeof window !== "undefined" && "speechSynthesis" in window) {
  window.speechSynthesis.addEventListener?.("voiceschanged", () => {
    filipinoVoice = findFilipinoVoice();
  });
}

function speakWithDeviceVoice(text: string, voice: SpeechSynthesisVoice | null): void {
  const synth = window.speechSynthesis;
  synth.cancel();
  const u = new SpeechSynthesisUtterance(text);
  if (voice) u.voice = voice;
  u.lang = voice?.lang || "fil-PH";
  u.rate = 0.85; // a touch slow — clearer for young ears
  u.pitch = 1.05;
  synth.speak(u);
}

/** Speak a Tagalog word/phrase with the most Filipino voice available. */
export function speak(text: string): void {
  if (typeof window === "undefined") return;

  // 1) a real Filipino voice on the device itself
  if (!picked) filipinoVoice = findFilipinoVoice();
  if (filipinoVoice) {
    try {
      speakWithDeviceVoice(text, filipinoVoice);
      return;
    } catch {
      /* fall through */
    }
  }

  // 2) Google's Tagalog voice — the authentic accent, via audio stream
  try {
    if (!audioEl) audioEl = new Audio();
    audioEl.pause();
    window.speechSynthesis?.cancel();
    audioEl.src =
      "https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=tl&q=" +
      encodeURIComponent(text.slice(0, 180));
    void audioEl.play().catch(() => {
      // 3) offline / blocked → default device voice, better than silence
      try {
        speakWithDeviceVoice(text, null);
      } catch {
        /* silent */
      }
    });
  } catch {
    try {
      speakWithDeviceVoice(text, null);
    } catch {
      /* silent */
    }
  }
}

/** True when the browser can speak at all (used to show/hide the 🔊). */
export function canSpeak(): boolean {
  return typeof window !== "undefined" && ("speechSynthesis" in window || "Audio" in window);
}
