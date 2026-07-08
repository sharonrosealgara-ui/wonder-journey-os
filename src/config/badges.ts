// ─────────────────────────────────────────────────────────────
// AWARDS & BADGES — the teacher awards these from the dashboard.
// ─────────────────────────────────────────────────────────────

export type BadgeDef = {
  id: string;
  name: string;
  emoji: string;
  description: string;
};

export const badges: BadgeDef[] = [
  { id: "island-explorer", name: "Island Explorer", emoji: "🏝️", description: "Completed the Welcome to the Philippines adventure" },
  { id: "language-star", name: "Language Star", emoji: "⭐", description: "Learned greetings in Tagalog and Hiligaynon" },
  { id: "kind-heart", name: "Kind Heart", emoji: "💖", description: "Showed Filipino family values in action" },
  { id: "little-chef", name: "Little Chef", emoji: "👩‍🍳", description: "Completed a cooking or baking adventure" },
  { id: "grateful-heart", name: "Grateful Heart", emoji: "🙏", description: "Wrote 5 gratitude journal entries" },
  { id: "brave-speaker", name: "Brave Speaker", emoji: "🎤", description: "Practiced speaking Filipino words out loud" },
  { id: "helping-hand", name: "Helping Hand (Bayanihan)", emoji: "🤝", description: "Helped a family member without being asked" },
  { id: "memory-keeper", name: "Memory Keeper", emoji: "📸", description: "Added a memory to the Family Cookbook" },
  { id: "prayer-warrior", name: "Courageous Prayer", emoji: "✝️", description: "Bravely led the family in opening prayer" },
  { id: "passport-pro", name: "Passport Pro", emoji: "🛂", description: "Collected 5 passport stamps" },
];

export function getBadge(id: string): BadgeDef | undefined {
  return badges.find((b) => b.id === id);
}
