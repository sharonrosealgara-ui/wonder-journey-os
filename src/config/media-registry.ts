// ─────────────────────────────────────────────────────────────
// EDUCATIONAL MEDIA REGISTRY
// Stores compliance metadata for factual media used across the app.
// Future migration: This can be migrated to a database-backed Library.
// ─────────────────────────────────────────────────────────────

export type VerificationStatus = "pending" | "verified" | "rejected";

export type FactualMedia = {
  id: string; // Stable media ID
  title: string;
  subject: string;
  storedAssetPath?: string; // Path in Wonder Journey OS managed media storage (or public/)
  originalSourceUrl?: string; // Where the image was sourced from
  photographerOrInstitution?: string;
  license?: string;
  attributionText?: string;
  altText: string;
  category: "geography" | "culture" | "food" | "vocabulary" | "science" | "history" | "other";
  region?: "Luzon" | "Visayas" | "Mindanao" | "Nationwide" | string;
  dateAccessed?: string;
  verificationStatus: VerificationStatus;
  dateVerified?: string;
  verifiedByRole?: "admin" | "teacher" | "system";
  associatedLessonIds?: string[];
  associatedActivityIds?: string[];
};

// The centralized registry of factual educational media.
// When an image is "pending", the UI must fall back to the neutral placeholder.
export const mediaRegistry: Record<string, FactualMedia> = {
  "philippines-hero": {
    id: "philippines-hero",
    title: "Philippine Islands Aerial",
    subject: "The Philippines",
    originalSourceUrl: "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?q=80&w=1000&auto=format&fit=crop",
    photographerOrInstitution: "Eibner Saliba",
    license: "Unsplash License",
    attributionText: "Photo by Eibner Saliba on Unsplash",
    altText: "Aerial view of lush green islands and clear blue water in the Philippines",
    category: "geography",
    region: "Nationwide",
    dateAccessed: "2026-07-28",
    verificationStatus: "verified",
    dateVerified: "2026-07-28",
    verifiedByRole: "system",
  },
  "recipe-mango-float": {
    id: "recipe-mango-float",
    title: "Mango Float",
    subject: "Filipino Desserts",
    originalSourceUrl: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?q=80&w=1000&auto=format&fit=crop", // placeholder pineapple/mango dessert
    photographerOrInstitution: "Unsplash",
    license: "Unsplash License",
    attributionText: "Temporary placeholder photo",
    altText: "Creamy layered fruit dessert",
    category: "food",
    dateAccessed: "2026-07-28",
    verificationStatus: "pending",
  },
  "recipe-turon": {
    id: "recipe-turon",
    title: "Turon",
    subject: "Filipino Snacks",
    originalSourceUrl: "https://images.unsplash.com/photo-1601622359487-b956a2bb91f9?q=80&w=1000&auto=format&fit=crop", // placeholder lumpia/turon
    photographerOrInstitution: "Unsplash",
    license: "Unsplash License",
    attributionText: "Temporary placeholder photo",
    altText: "Crispy fried spring rolls",
    category: "food",
    dateAccessed: "2026-07-28",
    verificationStatus: "pending",
  }
};

export function getMedia(id?: string): FactualMedia | null {
  if (!id) return null;
  return mediaRegistry[id] || null;
}
