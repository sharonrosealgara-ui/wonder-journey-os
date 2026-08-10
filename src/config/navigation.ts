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

export type NavIcon =
  | "home"
  | "classroom"
  | "map"
  | "passport"
  | "award"
  | "cooking"
  | "journal"
  | "language"
  | "resources"
  | "lesson-plan"
  | "message"
  | "photos"
  | "blessings"
  | "celebrations"
  | "backpack";

export type NavItem = {
  href: string;
  label: string;
  emoji?: string;
  icon?: NavIcon;
};

// The Family Portal — the warm adventure world.
export const familyNav: NavItem[] = [
  { href: "/family", label: "Home Base", icon: "home" },
  { href: "/classroom", label: "Live Classroom", icon: "classroom" },
  { href: "/blessings", label: "Morning Blessings", emoji: "☀️", icon: "blessings" },
  { href: "/lessons", label: "Adventure Map", icon: "map" },
  { href: "/passport", label: "Passport", icon: "passport" },
  { href: "/awards", label: "Badges", icon: "award" },
  { href: "/celebrations", label: "Celebrations", emoji: "🎉", icon: "celebrations" },
  { href: "/backpack", label: "Adventure Tree", emoji: "🌳", icon: "backpack" },
  { href: "/cooking", label: "Cooking Academy", icon: "cooking" },
  { href: "/cookbook", label: "Family Cookbook", icon: "cooking" },
  { href: "/journal", label: "Family Journal", icon: "journal" },
  { href: "/languages", label: "Languages", icon: "language" },
  { href: "/resources", label: "Resources", icon: "resources" },
];

// Teacher Portal — Sharon's studio (shown as its own section).
export const teacherNav: NavItem[] = [
  { href: "/teacher", label: "Lesson Plans", icon: "lesson-plan" },
  { href: "/teacher/whatsapp", label: "WhatsApp Helper", icon: "message" },
  { href: "/photos", label: "Photo Studio", icon: "photos" },
];
