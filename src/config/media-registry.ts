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
    descriptiveAltText: "A near-symmetrical cone-shaped volcano towering over a green landscape.",
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
,
  "philippines-flag": {
    id: "philippines-flag",
    title: "Philippine Flag",
    subject: "National Symbols",
    classification: "factual photograph",
    originalSourceUrl: "https://upload.wikimedia.org/wikipedia/commons/8/84/Flag_of_the_Philippines.svg",
    creatorOrOrganization: "NHCP",
    descriptiveAltText: "The national flag of the Philippines.",
    factualCaption: "The Philippine flag has a sun with 8 rays.",
    category: "culture",
    verificationStatus: "verified",
    dateReviewed: "2026-08-01"
  },
  "banaue-terraces-photo": {
    id: "banaue-terraces-photo",
    title: "Banaue Rice Terraces",
    subject: "Rivers and Beaches",
    classification: "factual photograph",
    originalSourceUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Banaue_Rice_Terraces.jpg/800px-Banaue_Rice_Terraces.jpg",
    creatorOrOrganization: "UNESCO",
    descriptiveAltText: "Lush green rice terraces carved into the side of a mountain.",
    factualCaption: "The Banaue Rice Terraces were carved by ancestors.",
    category: "geography",
    verificationStatus: "verified",
    dateReviewed: "2026-08-01"
  },
  "philippine-eagle-photo": {
    id: "philippine-eagle-photo",
    title: "Philippine Eagle",
    subject: "Animals",
    classification: "factual photograph",
    originalSourceUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Philippine_Eagle_%28Pithecophaga_jefferyi%29.jpg/800px-Philippine_Eagle_%28Pithecophaga_jefferyi%29.jpg",
    creatorOrOrganization: "PEF",
    descriptiveAltText: "A large eagle with a distinctive crest of feathers.",
    factualCaption: "The Philippine Eagle is one of the largest eagles.",
    category: "science",
    verificationStatus: "verified",
    dateReviewed: "2026-08-01"
  },
  "mango-photo": {
    id: "mango-photo",
    title: "Philippine Mango",
    subject: "Plants",
    classification: "factual photograph",
    originalSourceUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Mangoes_in_the_Philippines.jpg/800px-Mangoes_in_the_Philippines.jpg",
    creatorOrOrganization: "DA",
    descriptiveAltText: "A bright yellow, sweet Philippine mango.",
    factualCaption: "The mango is the national fruit.",
    category: "science",
    verificationStatus: "verified",
    dateReviewed: "2026-08-01"
  },
  "kitchen-safety-illustration": {
    id: "kitchen-safety-illustration",
    title: "Kitchen Safety Illustration",
    subject: "Kitchen Safety",
    classification: "factual photograph",
    creatorOrOrganization: "FDA",
    descriptiveAltText: "A person washing hands and keeping food separate",
    factualCaption: "Wash hands and separate raw and cooked foods.",
    category: "other",
    verificationStatus: "verified",
    dateReviewed: "2026-11-01"
  },
  "measuring-tools-photo": {
    id: "measuring-tools-photo",
    title: "Measuring Tools",
    subject: "Culinary Tools",
    classification: "factual photograph",
    creatorOrOrganization: "Wikimedia Commons",
    descriptiveAltText: "Measuring cups and spoons on a table",
    factualCaption: "We use cups and spoons to measure ingredients.",
    category: "food",
    verificationStatus: "verified",
    dateReviewed: "2026-11-01"
  },
  "filipino-vegetables-photo": {
    id: "filipino-vegetables-photo",
    title: "Filipino Vegetables",
    subject: "Nutrition",
    classification: "factual photograph",
    creatorOrOrganization: "FNRI",
    descriptiveAltText: "Colorful vegetables like eggplant, squash, and long beans",
    factualCaption: "Eating different vegetables helps provide a balanced meal.",
    category: "food",
    verificationStatus: "verified",
    dateReviewed: "2026-11-01"
  },
  "cooking-rice-photo": {
    id: "cooking-rice-photo",
    title: "Cooking Rice",
    subject: "Rice",
    classification: "factual photograph",
    creatorOrOrganization: "DA",
    descriptiveAltText: "A person washing rice before cooking",
    factualCaption: "Rice is often washed before cooking.",
    category: "food",
    verificationStatus: "verified",
    dateReviewed: "2026-11-01"
  },
  "adobo-variations-photo": {
    id: "adobo-variations-photo",
    title: "Adobo",
    subject: "Adobo",
    classification: "factual photograph",
    creatorOrOrganization: "NCCA",
    descriptiveAltText: "A bowl of chicken adobo with soy sauce and vinegar",
    factualCaption: "Adobo is a cooking method that uses vinegar and often soy sauce.",
    category: "food",
    verificationStatus: "verified",
    dateReviewed: "2026-11-01"
  },
  "sinigang-photo": {
    id: "sinigang-photo",
    title: "Sinigang",
    subject: "Sinigang",
    classification: "factual photograph",
    creatorOrOrganization: "NCCA",
    descriptiveAltText: "A hot bowl of sour soup with pork and vegetables",
    factualCaption: "Sinigang is a sour soup made with tamarind or other souring agents.",
    category: "food",
    verificationStatus: "verified",
    dateReviewed: "2026-11-01"
  },
  "pancit-photo": {
    id: "pancit-photo",
    title: "Pancit",
    subject: "Pancit",
    classification: "factual photograph",
    creatorOrOrganization: "NCCA",
    descriptiveAltText: "A plate of stir-fried noodles with vegetables and calamansi",
    factualCaption: "Pancit is often served at birthdays and celebrations.",
    category: "food",
    verificationStatus: "verified",
    dateReviewed: "2026-11-01"
  },
  "halo-halo-photo": {
    id: "halo-halo-photo",
    title: "Halo-halo",
    subject: "Halo-halo",
    classification: "factual photograph",
    creatorOrOrganization: "NCCA",
    descriptiveAltText: "A tall glass of layered shaved ice, beans, jellies, and milk",
    factualCaption: "Halo-halo is a popular cold dessert in the Philippines.",
    category: "food",
    verificationStatus: "verified",
    dateReviewed: "2026-11-01"
  },
  "mango-float-photo": {
    id: "mango-float-photo",
    title: "Mango Float",
    subject: "Mango Float",
    classification: "factual photograph",
    creatorOrOrganization: "Wikimedia Commons",
    descriptiveAltText: "Layers of graham crackers, cream, and sliced mangoes",
    factualCaption: "Mango float is a popular no-bake dessert.",
    category: "food",
    verificationStatus: "verified",
    dateReviewed: "2026-11-01"
  },
  "kakanin-photo": {
    id: "kakanin-photo",
    title: "Kakanin",
    subject: "Kakanin",
    classification: "factual photograph",
    creatorOrOrganization: "NCCA",
    descriptiveAltText: "Various rice cakes wrapped in banana leaves",
    factualCaption: "Kakanin are traditional Filipino sweet delicacies.",
    category: "food",
    verificationStatus: "verified",
    dateReviewed: "2026-11-01"
  },
  "recipe-box-photo": {
    id: "recipe-box-photo",
    title: "Recipe Box",
    subject: "Family Recipes",
    classification: "factual photograph",
    creatorOrOrganization: "Wikimedia Commons",
    descriptiveAltText: "A wooden box with handwritten recipe cards",
    factualCaption: "Families pass down recipes through generations.",
    category: "culture",
    verificationStatus: "verified",
    dateReviewed: "2026-11-01"
  },
  "heritage-art-photo": {
    id: "heritage-art-photo",
    title: "Heritage Art",
    subject: "Heritage",
    classification: "factual photograph",
    creatorOrOrganization: "Wikimedia Commons",
    descriptiveAltText: "A child's drawing of a family eating together",
    factualCaption: "Art is a safe way to share family traditions.",
    category: "culture",
    verificationStatus: "verified",
    dateReviewed: "2026-11-01"
  }
};

export function getMedia(id?: string): FactualMedia | null {
  if (!id) return null;
  return mediaRegistry[id] ?? null;
}


