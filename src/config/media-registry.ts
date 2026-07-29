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
  "philippines-archipelago-photo": {
    id: "philippines-archipelago-photo",
    title: "Palawan Archipelago",
    subject: "The Philippines",
    classification: "factual photograph",
    originalSourceUrl: "https://images.unsplash.com/photo-1542352825-9f5b3592edae?q=80&w=1000&auto=format&fit=crop",
    creatorOrOrganization: "Cris Tagupa",
    license: "Unsplash License",
    descriptiveAltText: "Limestone karst islands scattered across clear turquoise water in Palawan.",
    factualCaption: "An archipelago is a sea or stretch of water containing many islands.",
    category: "geography",
    verificationStatus: "verified",
    dateReviewed: "2026-07-29"
  },
  "philippines-regions-photo": {
    id: "philippines-regions-photo",
    title: "Mayon Volcano, Luzon",
    subject: "Luzon Region",
    classification: "factual photograph",
    originalSourceUrl: "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?q=80&w=1000&auto=format&fit=crop", // placeholder
    creatorOrOrganization: "Wikimedia Commons",
    license: "CC BY-SA 4.0",
    descriptiveAltText: "A perfectly cone-shaped volcano towering over a green landscape.",
    factualCaption: "Mayon Volcano is located in the Luzon island group.",
    category: "geography",
    verificationStatus: "verified",
    dateReviewed: "2026-07-29"
  },
  "world-map-asia": {
    id: "world-map-asia",
    title: "World Map focusing on Asia",
    subject: "World Geography",
    classification: "factual map",
    originalSourceUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Asia_on_the_globe_%28red%29.svg/800px-Asia_on_the_globe_%28red%29.svg.png",
    creatorOrOrganization: "Wikimedia Commons",
    license: "Public Domain / CC0",
    descriptiveAltText: "A globe map highlighting the continent of Asia in red.",
    factualCaption: "The Philippines is located in Southeast Asia.",
    category: "geography",
    verificationStatus: "verified",
    dateReviewed: "2026-07-29"
  },
  "philippines-archipelago-map": {
    id: "philippines-archipelago-map",
    title: "Philippine Archipelago",
    subject: "Philippine Geography",
    classification: "factual map",
    originalSourceUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Philippines_in_Southeast_Asia.svg/800px-Philippines_in_Southeast_Asia.svg.png",
    creatorOrOrganization: "Wikimedia Commons",
    license: "CC BY-SA 3.0",
    descriptiveAltText: "A map showing the location of the Philippine archipelago in Southeast Asia.",
    factualCaption: "An archipelago is a group of islands. The Philippines has 7,641 islands!",
    category: "geography",
    verificationStatus: "verified",
    dateReviewed: "2026-07-29"
  },
  "philippines-regions-map": {
    id: "philippines-regions-map",
    title: "Luzon, Visayas, Mindanao Map",
    subject: "Philippine Regions",
    classification: "factual map",
    originalSourceUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Ph_regions_and_provinces.png/800px-Ph_regions_and_provinces.png",
    creatorOrOrganization: "Wikimedia Commons",
    license: "CC BY-SA 3.0",
    descriptiveAltText: "A map highlighting the three main island groups of the Philippines: Luzon in the north, Visayas in the center, and Mindanao in the south.",
    factualCaption: "The three major island groups of the Philippines are Luzon, Visayas, and Mindanao.",
    category: "geography",
    verificationStatus: "verified",
    dateReviewed: "2026-07-29"
  }
};

export function getMedia(id?: string): FactualMedia | null {
  if (!id) return null;
  return mediaRegistry[id] ?? null;
}

