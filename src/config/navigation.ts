// Navigation is mode-aware: each item lists which access modes can see it.
//
// Wonder Journey has exactly TWO roles (Decision 040):
//   family  — the shared Family Portal (children + parents together; no student logins)
//   teacher — Teacher Sharon's portal
// Legacy stored values ("student"/"parent") are treated as "family".

export type Mode = "family" | "teacher";

export function normalizeMode(raw: string | null | undefined): Mode {
  return raw === "teacher" ? "teacher" : "family";
}

export type NavItem = {
  href: string;
  label: string;
  emoji: string;
  modes: Mode[];
};

export const navItems: NavItem[] = [
  // ── Teacher Portal tools (listed first so the teacher's nav leads with her studio) ──
  { href: "/teacher", label: "Teacher Studio", emoji: "🍎", modes: ["teacher"] },
  { href: "/prep-email", label: "Class Prep Email", emoji: "✉️", modes: ["teacher"] },

  // ── Family Portal (the whole family together — no admin controls, no student logins) ──
  { href: "/today", label: "Today's Adventure", emoji: "🌅", modes: ["family", "teacher"] },
  { href: "/blessings", label: "Morning Blessings", emoji: "🙏", modes: ["family", "teacher"] },
  { href: "/journal", label: "Gratitude Journal", emoji: "📔", modes: ["family", "teacher"] },
  { href: "/lessons", label: "Lesson Library", emoji: "📚", modes: ["family", "teacher"] },
  { href: "/languages", label: "Languages", emoji: "💬", modes: ["family", "teacher"] },
  { href: "/passport", label: "Travel Passport", emoji: "🛂", modes: ["family", "teacher"] },
  { href: "/backpack", label: "Backpack", emoji: "🎒", modes: ["family", "teacher"] },
  { href: "/cooking", label: "Cooking & Baking", emoji: "🥭", modes: ["family", "teacher"] },
  { href: "/cookbook", label: "Family Cookbook", emoji: "📖", modes: ["family", "teacher"] },
  { href: "/awards", label: "Awards", emoji: "🏅", modes: ["family", "teacher"] },
  { href: "/celebrations", label: "Celebrations", emoji: "🎉", modes: ["family", "teacher"] },
  { href: "/resources", label: "Resources", emoji: "🎬", modes: ["family", "teacher"] },
  { href: "/parent", label: "Family Hub", emoji: "👨‍👩‍👧‍👦", modes: ["family", "teacher"] },
];
