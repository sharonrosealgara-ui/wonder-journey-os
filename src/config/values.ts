// ─────────────────────────────────────────────────────────────
// FILIPINO FAMILY VALUES — displayed across the app and lessons.
// Note: per family preference, seasonal content centers on biblical
// Feast Days rather than Christmas/Easter crafts.
// ─────────────────────────────────────────────────────────────

export type FamilyValue = {
  id: string;
  name: string;
  filipinoName: string;
  emoji: string;
  meaning: string;
  verse: string;
};

export const familyValues: FamilyValue[] = [
  {
    id: "respect",
    name: "Respect for Parents & Elders",
    filipinoName: "Paggalang",
    emoji: "🙇",
    meaning: "Honoring parents and elders with 'po', 'opo', and the mano po blessing.",
    verse: "Honor your father and your mother. — Exodus 20:12",
  },
  {
    id: "hospitality",
    name: "Hospitality",
    filipinoName: "Pagtanggap",
    emoji: "🏠",
    meaning: "Welcoming every guest like family and sharing the best of what we have.",
    verse: "Do not forget to show hospitality to strangers. — Hebrews 13:2",
  },
  {
    id: "bayanihan",
    name: "Bayanihan",
    filipinoName: "Bayanihan",
    emoji: "🤝",
    meaning: "Joyfully working together as a community to help anyone in need.",
    verse: "Carry each other's burdens. — Galatians 6:2",
  },
  {
    id: "gratitude",
    name: "Gratitude",
    filipinoName: "Pasasalamat",
    emoji: "🙏",
    meaning: "A heart that remembers kindness and thanks the Lord in everything.",
    verse: "Give thanks in all circumstances. — 1 Thessalonians 5:18",
  },
  {
    id: "kindness",
    name: "Kindness",
    filipinoName: "Kabaitan",
    emoji: "💖",
    meaning: "Treating everyone gently and looking for ways to brighten their day.",
    verse: "Be kind and compassionate to one another. — Ephesians 4:32",
  },
  {
    id: "helping",
    name: "Helping Others",
    filipinoName: "Pagtulong",
    emoji: "🫶",
    meaning: "Serving family and neighbors without waiting to be asked.",
    verse: "Serve one another humbly in love. — Galatians 5:13",
  },
  {
    id: "responsibility",
    name: "Responsibility",
    filipinoName: "Pananagutan",
    emoji: "📋",
    meaning: "Doing our part faithfully — chores, schoolwork, and promises.",
    verse: "Whoever can be trusted with very little can also be trusted with much. — Luke 16:10",
  },
  {
    id: "humility",
    name: "Humility",
    filipinoName: "Kababaang-loob",
    emoji: "🌱",
    meaning: "A gentle heart that puts others first and learns from everyone.",
    verse: "In humility value others above yourselves. — Philippians 2:3",
  },
  {
    id: "stewardship",
    name: "Caring for God's Creation",
    filipinoName: "Pangangalaga sa Kalikasan",
    emoji: "🌏",
    meaning: "Being good stewards of animals, oceans, islands, and everything the Lord made.",
    verse: "The earth is the Lord's, and everything in it. — Psalm 24:1",
  },
  {
    id: "family-love",
    name: "Family Love",
    filipinoName: "Pagmamahal sa Pamilya",
    emoji: "❤️",
    meaning: "Cherishing each other every day — family is God's first gift of community.",
    verse: "Love one another deeply, from the heart. — 1 Peter 1:22",
  },
];
