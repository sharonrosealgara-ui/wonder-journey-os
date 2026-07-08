// ─────────────────────────────────────────────────────────────
// Shared record shapes stored in localStorage + date helpers.
// ─────────────────────────────────────────────────────────────

import { prayerLeaders } from "@/config/family";

export type GratitudeEntry = {
  id: string;
  studentId: string;
  date: string; // ISO date
  prompt: string;
  text: string;
};

export type JournalEntry = {
  id: string;
  studentId: string;
  date: string;
  title: string;
  text: string;
};

export type LessonCompletion = {
  lessonId: string;
  studentId: string;
  date: string;
};

export type AwardedBadge = {
  id: string;
  badgeId: string;
  studentId: string;
  date: string;
  note: string;
};

// Adventure Theater "Capture Today's Memory" uploads — shown in the Backpack.
export type AdventureMemory = {
  id: string;
  lessonId: string;
  studentId: string;
  date: string;
  photo: string | null;
  caption: string;
};

export type CookbookMemory = {
  id: string;
  recipeId: string;
  date: string;
  cookNames: string;
  photo: string | null; // data URL
  memory: string;
  reflection: string;
};

// Storage keys (all namespaced by lib/storage.ts)
export const KEYS = {
  mode: "mode",
  activeStudent: "activeStudent",
  gratitude: "gratitude",
  journal: "journal",
  completions: "completions",
  awards: "awards",
  cookbook: "cookbook",
  birthdayDismissed: "birthdayDismissed",
  memories: "memories",
} as const;

export function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

// Prayer leader rotates automatically by day of year.
export function getTodaysPrayerLeader(date = new Date()): string {
  const start = new Date(date.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((date.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return prayerLeaders[dayOfYear % prayerLeaders.length];
}

export function getTomorrowsPrayerLeader(date = new Date()): string {
  const t = new Date(date);
  t.setDate(t.getDate() + 1);
  return getTodaysPrayerLeader(t);
}
