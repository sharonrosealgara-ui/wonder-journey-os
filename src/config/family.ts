// ─────────────────────────────────────────────────────────────
// FAMILY CONFIGURATION
// To onboard a new family, edit this file only — the rest of the
// app reads everything from here.
// ─────────────────────────────────────────────────────────────

export type Student = {
  id: string;
  name: string;
  age: number;
  emoji: string;
  color: string; // tailwind-friendly accent used on cards & avatars
  interests: string[];
  funFact: string;
};

// The family workspace identity (Family Portal greeting & branding).
export const familyName = "The Ferrell Family";
export const familySlug = "ferrell"; // future: workspace id in the multi-family database

export const teacherName = "Teacher Sharon";

export const parentNames = ["Shaun", "Taylor"];

export const students: Student[] = [
  {
    id: "rylee",
    name: "Rylee",
    age: 12,
    emoji: "🧵",
    color: "#e5739e",
    interests: ["Sewing", "Embroidery", "Knitting", "Animals", "Hands-on projects"],
    funFact: "Loves creating beautiful things with her hands",
  },
  {
    id: "ezra",
    name: "Ezra",
    age: 10,
    emoji: "🍳",
    color: "#e89a3c",
    interests: ["Cooking", "History", "Legos", "Miniatures", "Dioramas"],
    funFact: "Future chef and history explorer",
  },
  {
    id: "asa",
    name: "Asa",
    age: 9,
    emoji: "🚜",
    color: "#4da66a",
    interests: ["Building", "Outdoors", "Animals", "Vehicles", "Hands-on fun"],
    funFact: "Always ready for an outdoor adventure",
  },
  {
    id: "selah",
    name: "Selah",
    age: 7,
    emoji: "🧁",
    color: "#7f7ad1",
    interests: ["Baking", "Miniature towns", "Drawing", "Toy figures"],
    funFact: "Bakes sweetness into everything she makes",
  },
];

// Prayer leader rotation — rotates automatically each day.
export const prayerLeaders = [
  "Rylee",
  "Ezra",
  "Asa",
  "Selah",
  "Family Choice",
  "Teacher Sharon",
];

export function getStudent(id: string | null | undefined): Student | undefined {
  return students.find((s) => s.id === id);
}
