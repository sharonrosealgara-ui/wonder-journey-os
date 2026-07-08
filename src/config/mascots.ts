// ─────────────────────────────────────────────────────────────
// MASCOTS — the Wonder Journey guide characters.
// Each slide kind in the Adventure Theater has a guide who
// introduces it. Reusable across worlds; swap per client.
// ─────────────────────────────────────────────────────────────

export type Mascot = {
  id: string;
  name: string;
  emoji: string;
  role: string;
  catchphrase: string;
};

export const mascots: Record<string, Mascot> = {
  tala: {
    id: "tala",
    name: "Tala",
    emoji: "🐢",
    role: "Travel Guide",
    catchphrase: "Slow and steady sees the most wonders!",
  },
  lila: {
    id: "lila",
    name: "Lila",
    emoji: "🦜",
    role: "Language Teacher",
    catchphrase: "Say it with me — three times, big smile!",
  },
  kiko: {
    id: "kiko",
    name: "Kiko",
    emoji: "🐒",
    role: "Explorer",
    catchphrase: "Adventure is out there — let's go!",
  },
  mangga: {
    id: "mangga",
    name: "Mangga",
    emoji: "🥭",
    role: "Cooking Buddy",
    catchphrase: "The secret ingredient is always family!",
  },
  isla: {
    id: "isla",
    name: "Isla",
    emoji: "🌺",
    role: "Nature & Gratitude Guide",
    catchphrase: "Every day the Lord plants something beautiful.",
  },
};
