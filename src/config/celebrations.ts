// ─────────────────────────────────────────────────────────────
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
