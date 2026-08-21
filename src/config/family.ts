// ─────────────────────────────────────────────────────────────
// FAMILY CONFIGURATION
// Generic synthetic fixtures for production & testing.
// Deployment-specific overrides can be provided via environment.
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
export const familyName = process.env.NEXT_PUBLIC_FAMILY_NAME || "Wonder Journey Family";
export const familySlug = process.env.NEXT_PUBLIC_FAMILY_SLUG || "family-workspace-001";

export const teacherName = process.env.NEXT_PUBLIC_TEACHER_NAME || "Teacher Guide";

export const parentNames = ["Guardian One", "Guardian Two"];

// Everyone who joins class from the family's shared screen (Decision 042).
export const familyAdults = ["Guardian One", "Guardian Two", "Grandparent"];

export const students: Student[] = [
  {
    id: "learner-001",
    name: "Learner One",
    age: 12,
    emoji: "🧵",
    color: "#e5739e",
    interests: ["Sewing", "Embroidery", "Knitting", "Animals", "Hands-on projects"],
    funFact: "Loves creating beautiful things with hands-on crafts",
  },
  {
    id: "learner-002",
    name: "Learner Two",
    age: 10,
    emoji: "🍳",
    color: "#e89a3c",
    interests: ["Cooking", "History", "Building", "Miniatures", "Dioramas"],
    funFact: "Future chef and cultural explorer",
  },
  {
    id: "learner-003",
    name: "Learner Three",
    age: 9,
    emoji: "🚜",
    color: "#4da66a",
    interests: ["Building", "Outdoors", "Animals", "Vehicles", "Hands-on fun"],
    funFact: "Always ready for an outdoor adventure",
  },
  {
    id: "learner-004",
    name: "Learner Four",
    age: 7,
    emoji: "🧁",
    color: "#7f7ad1",
    interests: ["Baking", "Miniature towns", "Drawing", "Toy figures"],
    funFact: "Bakes sweetness into everything created",
  },
];

// Prayer leader rotation — rotates automatically each day.
export const prayerLeaders = [
  "Learner One",
  "Learner Two",
  "Learner Three",
  "Learner Four",
  "Family Choice",
  "Teacher Guide",
];

export function getStudent(id: string | null | undefined): Student | undefined {
  return students.find((s) => s.id === id);
}

// ─────────────────────────────────────────────────────────────
// THE WHOLE FAMILY — everyone who takes part in Morning Blessings
// and family devotions. Children + parents + grandparent.
// ─────────────────────────────────────────────────────────────

export type FamilyMember = {
  id: string;
  name: string;
  emoji: string; // devotional-journal avatar
  color: string;
  role: "child" | "parent" | "grandparent";
};

export const familyMembers: FamilyMember[] = [
  { id: "learner-001", name: "Learner One", emoji: "🌿", color: "#e5739e", role: "child" },
  { id: "learner-002", name: "Learner Two", emoji: "🎨", color: "#e89a3c", role: "child" },
  { id: "learner-003", name: "Learner Three", emoji: "🚜", color: "#4da66a", role: "child" },
  { id: "learner-004", name: "Learner Four", emoji: "🧁", color: "#7f7ad1", role: "child" },
  { id: "guardian-001", name: "Guardian One", emoji: "❤️", color: "#e4573b", role: "parent" },
  { id: "guardian-002", name: "Guardian Two", emoji: "🌸", color: "#ec5d87", role: "parent" },
  { id: "grandparent-001", name: "Grandparent", emoji: "👵", color: "#14837c", role: "grandparent" },
];

export const teacherMember: FamilyMember = {
  id: "teacher-001",
  name: "Teacher Guide",
  emoji: "👩‍🏫",
  color: "#cf3e6b",
  role: "parent",
};

export function getFamilyMember(id: string | null | undefined): FamilyMember | undefined {
  if (id === teacherMember.id || id === "teacher-001") return teacherMember;
  return familyMembers.find((m) => m.id === id);
}
