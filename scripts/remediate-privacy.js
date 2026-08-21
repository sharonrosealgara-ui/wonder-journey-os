const fs = require("fs");
const path = require("path");

function replaceInFile(relPath, replacers) {
  const fullPath = path.join(__dirname, "..", relPath);
  if (!fs.existsSync(fullPath)) return;
  let content = fs.readFileSync(fullPath, "utf8");
  for (const [search, replace] of replacers) {
    if (typeof search === "string") {
      content = content.replaceAll(search, replace);
    } else {
      content = content.replace(search, replace);
    }
  }
  fs.writeFileSync(fullPath, content, "utf8");
  console.log(`Sanitized privacy data in: ${relPath}`);
}

// 1. Sanitize family.ts
const familyContent = `// ─────────────────────────────────────────────────────────────
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
`;
fs.writeFileSync(path.join(__dirname, "../src/config/family.ts"), familyContent, "utf8");
console.log("Updated src/config/family.ts with synthetic fixtures");

// 2. Sanitize celebrations.ts
const celebrationsContent = `// ─────────────────────────────────────────────────────────────
// FAMILY CELEBRATIONS — birthdays & special dates.
// Generic synthetic fixtures for production & testing.
// ─────────────────────────────────────────────────────────────

export type Celebration = {
  id: string;
  name: string; // whose day it is (matches student name when applicable)
  studentId?: string;
  type: "birthday" | "family";
  month: number;
  day: number;
  emoji: string;
  note: string;
};

export const celebrations: Celebration[] = [
  // ── SYNTHETIC FIXTURE BIRTHDAYS ──
  { id: "bday-learner-001", name: "Learner One", studentId: "learner-001", type: "birthday", month: 3, day: 15, emoji: "🧵", note: "Learner One's special day!" },
  { id: "bday-learner-002", name: "Learner Two", studentId: "learner-002", type: "birthday", month: 6, day: 22, emoji: "🍳", note: "Learner Two's special day!" },
  { id: "bday-learner-003", name: "Learner Three", studentId: "learner-003", type: "birthday", month: 9, day: 8, emoji: "🚜", note: "Learner Three's special day!" },
  { id: "bday-learner-004", name: "Learner Four", studentId: "learner-004", type: "birthday", month: 11, day: 30, emoji: "🧁", note: "Learner Four's special day!" },
  { id: "bday-teacher-001", name: "Teacher Guide", type: "birthday", month: 7, day: 21, emoji: "🌺", note: "Teacher Guide's special day!" },
  // ── FAMILY DATES — add anniversaries & feast days here ──
  { id: "first-class", name: "First Wonder Journey Class!", type: "family", month: 7, day: 13, emoji: "🎒", note: "The day our Philippine adventure began" },
];

export const birthdayBlessing =
  "May the Lord bless you and keep you this year — may He fill your days with joy, your heart with kindness, and your adventures with wonder!";

export function getTodaysBirthdays(today = new Date()): Celebration[] {
  return celebrations.filter(
    (c) => c.type === "birthday" && c.month === today.getMonth() + 1 && c.day === today.getDate()
  );
}

export function daysUntil(c: Celebration, from = new Date()): number {
  const year = from.getFullYear();
  let next = new Date(year, c.month - 1, c.day);
  const startOfToday = new Date(year, from.getMonth(), from.getDate());
  if (next < startOfToday) next = new Date(year + 1, c.month - 1, c.day);
  return Math.round((next.getTime() - startOfToday.getTime()) / (1000 * 60 * 60 * 24));
}
`;
fs.writeFileSync(path.join(__dirname, "../src/config/celebrations.ts"), celebrationsContent, "utf8");
console.log("Updated src/config/celebrations.ts with synthetic fixtures");

// 3. Global replacement of specific hardcoded names in lessons and components
const filesToSanitize = [
  "src/config/lessons.ts",
  "src/config/recipes.ts",
  "src/config/destinations.ts",
  "src/config/navigation.ts",
  "src/config/stage4/lesson-14.ts",
  "src/config/lessons-stage4-family.ts",
  "src/lib/app-state.ts",
  "src/lib/speak.ts",
  "src/components/access-gate.tsx",
  "src/components/teacher-only.tsx",
  "src/components/classroom/classroom-games.tsx",
  "src/components/adventure/slide-views.tsx",
  "src/components/adventure/theater.tsx",
  "src/app/(app)/classroom/page.tsx",
  "src/app/(app)/cooking/[id]/recipe-view.tsx",
  "src/app/(app)/languages/page.tsx",
  "src/app/(app)/resources/page.tsx",
  "src/app/(app)/prayer/page.tsx",
];

const generalReplacements = [
  ["Teacher Sharon", "Teacher Guide"],
  ["teacher-sharon", "teacher-001"],
  ["Ferrell Family", "Wonder Journey Family"],
  ["Grandma Jeannie", "Grandparent"],
  ["Sharon's", "the Teacher's"],
  ["Sharon", "Teacher Guide"],
];

for (const f of filesToSanitize) {
  replaceInFile(f, generalReplacements);
}

console.log("Privacy remediation complete!");
