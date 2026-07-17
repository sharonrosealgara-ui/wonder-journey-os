"use client";

// 🗣️ TAP-TO-HEAR — the device reads a Tagalog word aloud with the
// browser's built-in speech (Web Speech API). No audio files, no
// recordings, works offline on phones, tablets, and laptops.
//
// It's a friendly robot voice, not Teacher Sharon — but it gives kids
// instant pronunciation practice today. (A real recorded-voice version
// can replace this later without changing any of the call sites.)

let filipinoVoice: SpeechSynthesisVoice | null = null;
let picked = false;

// Prefer a Filipino/Tagalog voice when the device has one; otherwise
// fall back gracefully to the default voice.
function pickVoice(): SpeechSynthesisVoice | null {
  if (picked) return filipinoVoice;
  try {
    const voices = window.speechSynthesis.getVoices();
    filipinoVoice =
      voices.find((v) => /fil|tl[-_]|tagalog|filipino/i.test(v.lang + " " + v.name)) ??
      null;
    if (voices.length > 0) picked = true; // voices are loaded
  } catch {
    /* ignore */
  }
  return filipinoVoice;
}

/** Speak a Tagalog word/phrase aloud. Safe to call anywhere; a no-op
 *  on browsers without speech support. */
export function speak(text: string): void {
  if (typeof window === "undefined") return;
  const synth = window.speechSynthesis;
  if (!synth) return;
  try {
    synth.cancel(); // stop any word already playing
    const u = new SpeechSynthesisUtterance(text);
    const v = pickVoice();
    if (v) u.voice = v;
    u.lang = v?.lang || "fil-PH";
    u.rate = 0.85; // a touch slow — clearer for young ears
    u.pitch = 1.05;
    synth.speak(u);
  } catch {
    /* speech unavailable — silently do nothing */
  }
}

/** True when the browser can speak at all (used to show/hide the 🔊). */
export function canSpeak(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}
