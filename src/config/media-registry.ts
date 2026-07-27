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
  // Examples to be filled in during bulk processing:
  /*
  "philippines-hero": {
    id: "philippines-hero",
    title: "Philippine Islands Aerial",
    subject: "The Philippines",
    storedAssetPath: "/media/philippines-hero.webp",
    originalSourceUrl: "https://unsplash.com/...",
    photographerOrInstitution: "John Doe",
    license: "Unsplash License",
    attributionText: "Photo by John Doe on Unsplash",
    altText: "Aerial view of lush green islands and clear blue water in the Philippines",
    category: "geography",
    region: "Nationwide",
    dateAccessed: "2026-07-27",
    verificationStatus: "verified",
    dateVerified: "2026-07-27",
    verifiedByRole: "system",
  }
  */
};

export function getMedia(id?: string): FactualMedia | null {
  if (!id) return null;
  return mediaRegistry[id] || null;
}
