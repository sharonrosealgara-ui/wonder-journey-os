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
// Also the family's shared display name on camera ("user name").
export const familyName = "Ferrell Family";
export const familySlug = "ferrell"; // future: workspace id in the multi-family database

export const teacherName = "Teacher Sharon";

export const parentNames = ["Shaun", "Taylor"];

// Everyone who joins class from the family's shared screen (Decision 042).
export const familyAdults = ["Shaun", "Taylor", "Grandma"];

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

// ─────────────────────────────────────────────────────────────
// THE WHOLE FAMILY — everyone who takes part in Morning Blessings
// and family devotions. Children + parents + grandma. The teacher
// joins only in teacher mode (added by the page, not listed here).
// ─────────────────────────────────────────────────────────────

export type FamilyMember = {
  id: string;
  name: string;
  emoji: string; // devotional-journal avatar
  color: string;
  role: "child" | "parent" | "grandparent";
};

export const familyMembers: FamilyMember[] = [
  { id: "rylee", name: "Rylee", emoji: "🌿", color: "#e5739e", role: "child" },
  { id: "ezra", name: "Ezra", emoji: "🎨", color: "#e89a3c", role: "child" },
  { id: "asa", name: "Asa", emoji: "🚜", color: "#4da66a", role: "child" },
  { id: "selah", name: "Selah", emoji: "🧁", color: "#7f7ad1", role: "child" },
  { id: "shaun", name: "Shaun", emoji: "❤️", color: "#e4573b", role: "parent" },
  { id: "taylor", name: "Taylor", emoji: "🌸", color: "#ec5d87", role: "parent" },
  { id: "grandma", name: "Grandma Jeannie", emoji: "👵", color: "#14837c", role: "grandparent" },
];

export const teacherMember: FamilyMember = {
  id: "teacher-sharon",
  name: "Teacher Sharon",
  emoji: "👩‍🏫",
  color: "#cf3e6b",
  role: "parent",
};

export function getFamilyMember(id: string | null | undefined): FamilyMember | undefined {
  if (id === teacherMember.id) return teacherMember;
  return familyMembers.find((m) => m.id === id);
}
