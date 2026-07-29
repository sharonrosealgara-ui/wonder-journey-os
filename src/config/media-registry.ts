export type VerificationStatus = "pending" | "verified" | "rejected";
export type MediaClassification = "factual photograph" | "factual map" | "diagram" | "decorative illustration" | "icon" | "verified video" | "pending verification";

export type FactualMedia = {
  id: string;
  title: string;
  subject: string;
  classification: MediaClassification;
  creatorOrOrganization?: string;
  license?: string;
  originalSourceUrl?: string;
  storedAssetPath?: string;
  descriptiveAltText: string;
  factualCaption: string;
  aspectRatio?: string;
  objectPosition?: string;
  loadingBehavior?: string;
  failureBehavior?: string;
  verificationStatus: VerificationStatus;
  dateReviewed?: string;
  associatedLessonIds?: string[];
  category: "geography" | "culture" | "food" | "vocabulary" | "science" | "history" | "other";
};

export const mediaRegistry: Record<string, FactualMedia> = {
  "philippines-hero": {
    id: "philippines-hero",
    title: "Philippine Islands Aerial",
    subject: "The Philippines",
    classification: "factual photograph",
    originalSourceUrl: "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?q=80&w=1000&auto=format&fit=crop",
    creatorOrOrganization: "Eibner Saliba",
    license: "Unsplash License",
    descriptiveAltText: "Aerial view of lush green islands and clear blue water in the Philippines",
    factualCaption: "The Philippines is an archipelago made up of over 7,000 islands.",
    category: "geography",
    verificationStatus: "verified",
    dateReviewed: "2026-07-28"
  },
  "world-map-asia": {
    id: "world-map-asia",
    title: "World Map focusing on Asia",
    subject: "World Geography",
    classification: "factual map",
    descriptiveAltText: "A world map showing the location of the Philippines in Southeast Asia.",
    factualCaption: "The Philippines is located in Southeast Asia, surrounded by the Pacific Ocean and the South China Sea.",
    category: "geography",
    verificationStatus: "pending"
  },
  "philippines-archipelago-map": {
    id: "philippines-archipelago-map",
    title: "Philippine Archipelago",
    subject: "Philippine Geography",
    classification: "factual map",
    descriptiveAltText: "A map showing the many islands that make up the Philippine archipelago.",
    factualCaption: "An archipelago is a group of islands. The Philippines has 7,641 islands!",
    category: "geography",
    verificationStatus: "pending"
  },
  "philippines-regions-map": {
    id: "philippines-regions-map",
    title: "Luzon, Visayas, Mindanao Map",
    subject: "Philippine Regions",
    classification: "factual map",
    descriptiveAltText: "A map highlighting the three main island groups of the Philippines: Luzon in the north, Visayas in the center, and Mindanao in the south.",
    factualCaption: "The three major island groups of the Philippines are Luzon, Visayas, and Mindanao.",
    category: "geography",
    verificationStatus: "pending"
  }
};

export function getMedia(id?: string): FactualMedia | null {
  if (!id) return null;
  return mediaRegistry[id] || null;
}
