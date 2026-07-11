"use client";

// Gentle sound effects for the Adventure Theater — synthesized in the
// browser with the Web Audio API, so there are NO audio files to ship.
// All sounds are soft and child-friendly. Muteable + remembered.

let ctx: AudioContext | null = null;
let muted = false;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  return ctx;
}

export function initMute() {
  try {
    muted = JSON.parse(localStorage.getItem("wjos:muted") || "false");
  } catch {
    muted = false;
  }
  return muted;
}

export function isMuted() {
  return muted;
}

export function setMuted(m: boolean) {
  muted = m;
  try {
    localStorage.setItem("wjos:muted", JSON.stringify(m));
  } catch {
    /* ignore */
  }
}

function note(freq: number, dur: number, type: OscillatorType = "sine", vol = 0.05, delay = 0) {
  const c = getCtx();
  if (!c || muted) return;
  if (c.state === "suspended") void c.resume();
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  osc.connect(gain);
  gain.connect(c.destination);
  const t = c.currentTime + delay;
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.linearRampToValueAtTime(vol, t + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.start(t);
  osc.stop(t + dur + 0.03);
}

// A soft rising "page-turn / next" chime, a gentle "back", reveals,
// a happy correct arpeggio, a warm passport "stamp", and a finale.
export const sfx = {
  next() {
    note(523.25, 0.12, "sine", 0.045);
    note(783.99, 0.14, "sine", 0.035, 0.07);
  },
  back() {
    note(587.33, 0.1, "sine", 0.035);
    note(440.0, 0.12, "sine", 0.03, 0.06);
  },
  reveal() {
    note(880, 0.09, "triangle", 0.035);
    note(1174.66, 0.08, "triangle", 0.03, 0.05);
  },
  tap() {
    note(660, 0.06, "sine", 0.03);
  },
  correct() {
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => note(f, 0.16, "sine", 0.045, i * 0.08));
  },
  tryAgain() {
    note(392, 0.14, "sine", 0.035);
  },
  stamp() {
    note(160, 0.18, "square", 0.045);
    note(110, 0.22, "sine", 0.04, 0.02);
  },
  celebrate() {
    [523.25, 659.25, 783.99, 1046.5, 1318.51].forEach((f, i) =>
      note(f, 0.22, "triangle", 0.045, i * 0.09)
    );
  },
};
