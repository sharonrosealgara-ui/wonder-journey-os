// ─────────────────────────────────────────────────────────────
// MORNING BLESSINGS DEVOTIONAL CONTENT
// Verse of the day + rotating reflection prompts. Everything
// rotates deterministically by date, so the whole family sees the
// same verse and each member gets their own prompt each morning.
// ─────────────────────────────────────────────────────────────

export type Verse = { text: string; ref: string };

export const verses: Verse[] = [
  { text: "Give thanks to the Lord, for He is good; His love endures forever.", ref: "Psalm 107:1" },
  { text: "This is the day that the Lord has made; let us rejoice and be glad in it.", ref: "Psalm 118:24" },
  { text: "Give thanks in all circumstances; for this is God's will for you in Christ Jesus.", ref: "1 Thessalonians 5:18" },
  { text: "The Lord is my shepherd; I shall not want.", ref: "Psalm 23:1" },
  { text: "Let all that you do be done in love.", ref: "1 Corinthians 16:14" },
  { text: "Be kind and compassionate to one another, forgiving each other.", ref: "Ephesians 4:32" },
  { text: "I can do all things through Christ who strengthens me.", ref: "Philippians 4:13" },
  { text: "The steadfast love of the Lord never ceases; His mercies never come to an end; they are new every morning.", ref: "Lamentations 3:22–23" },
  { text: "Trust in the Lord with all your heart, and lean not on your own understanding.", ref: "Proverbs 3:5" },
  { text: "Children, obey your parents in the Lord, for this is right.", ref: "Ephesians 6:1" },
  { text: "How good and pleasant it is when God's people live together in unity!", ref: "Psalm 133:1" },
  { text: "Let the little children come to me, for the kingdom of heaven belongs to such as these.", ref: "Matthew 19:14" },
  { text: "Do everything without grumbling or arguing, so that you may shine like stars in the sky.", ref: "Philippians 2:14–15" },
  { text: "Serve one another humbly in love.", ref: "Galatians 5:13" },
  { text: "The earth is the Lord's, and everything in it, the world, and all who live in it.", ref: "Psalm 24:1" },
  { text: "A cheerful heart is good medicine.", ref: "Proverbs 17:22" },
];

export const reflectionPrompts: string[] = [
  "Today I thank God for...",
  "One blessing I noticed...",
  "Lord, please help me...",
  "One thing that made me smile...",
  "Someone I want to pray for...",
  "How can I show kindness today?",
  "What Bible story reminds me of today?",
  "One thing I'm excited to learn...",
  "One thing I appreciate about my family...",
  "How did I see God's love yesterday?",
];

function dayOfYear(d = new Date()): number {
  const start = new Date(d.getFullYear(), 0, 0);
  return Math.floor((d.getTime() - start.getTime()) / 86400000);
}

export function verseOfTheDay(d = new Date()): Verse {
  return verses[dayOfYear(d) % verses.length];
}

// Each family member gets a different prompt each day, and every
// member's prompt changes tomorrow — fresh combinations every morning.
export function promptForMember(memberIndex: number, d = new Date()): string {
  return reflectionPrompts[(dayOfYear(d) + memberIndex * 3) % reflectionPrompts.length];
}
