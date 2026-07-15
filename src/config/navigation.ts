// Sidebar navigation for the Home Base layout.
//
// Wonder Journey has exactly TWO roles (Decision 040):
//   family  — the shared Family Portal
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
};

// The Family Portal — the warm adventure world.
export const familyNav: NavItem[] = [
  { href: "/", label: "Home Base", emoji: "🏠" },
  { href: "/classroom", label: "Live Classroom", emoji: "🎥" },
  { href: "/blessings", label: "Morning Blessings", emoji: "☀️" },
  { href: "/lessons", label: "Adventure Map", emoji: "🗺️" },
  { href: "/passport", label: "Passport", emoji: "🛂" },
  { href: "/awards", label: "Badges", emoji: "🏅" },
  { href: "/celebrations", label: "Celebrations", emoji: "🎉" },
  { href: "/backpack", label: "Adventure Tree", emoji: "🌳" },
  { href: "/cooking", label: "Cooking Academy", emoji: "🧭" },
  { href: "/cookbook", label: "Family Cookbook", emoji: "📖" },
  { href: "/journal", label: "Family Journal", emoji: "📚" },
  { href: "/languages", label: "Languages", emoji: "💬" },
  { href: "/resources", label: "Resources", emoji: "🎬" },
];

// Teacher Portal — Sharon's studio (shown as its own section).
export const teacherNav: NavItem[] = [
  { href: "/teacher", label: "Lesson Plans", emoji: "📋" },
  { href: "/prep-email", label: "Class Prep Email", emoji: "✉️" },
  { href: "/photos", label: "Photo Studio", emoji: "🖼️" },
];
