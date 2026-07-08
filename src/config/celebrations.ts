// ─────────────────────────────────────────────────────────────
// FAMILY CELEBRATIONS — birthdays & special dates.
// ⚠️ EDIT THE DATES BELOW with the family's real birthdays!
// month: 1–12, day: 1–31. The year is not needed for birthdays.
// The birthday pop-up appears automatically on the matching day.
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
  // ── PLACEHOLDER BIRTHDAYS — replace with real dates! ──
  { id: "bday-rylee", name: "Rylee", studentId: "rylee", type: "birthday", month: 3, day: 15, emoji: "🧵", note: "Rylee's special day!" },
  { id: "bday-ezra", name: "Ezra", studentId: "ezra", type: "birthday", month: 6, day: 22, emoji: "🍳", note: "Ezra's special day!" },
  { id: "bday-asa", name: "Asa", studentId: "asa", type: "birthday", month: 9, day: 8, emoji: "🚜", note: "Asa's special day!" },
  { id: "bday-selah", name: "Selah", studentId: "selah", type: "birthday", month: 11, day: 30, emoji: "🧁", note: "Selah's special day!" },
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
