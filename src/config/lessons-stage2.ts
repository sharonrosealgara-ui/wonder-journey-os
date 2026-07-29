import { CurriculumLesson } from '@/lib/curriculum-schema';

export const stage2Lessons: CurriculumLesson[] = [
  {
    id: "lesson-1-world-map",
    date: "2026-08-03",
    weekday: "Monday",
    title: "World Map → Asia → Philippines",
    unit: "Discover the Philippines",
    learningObjectives: ["Locate the Philippines on a world map", "Identify Southeast Asia"],
    essentialQuestion: "Where in the world is the Philippines?",
    factualBackground: "The Philippines is located in Southeast Asia.",
    vocabulary: [{ word: "Pilipinas", translation: "Philippines" }],
    subjectConnections: { geography: "World Maps" },
    materials: ["Globe or World Map"],
    factualMediaRequirements: ["world-map-asia", "philippines-hero"],
    activities: {
      beginnerSupport: "Point to the Philippines on the map.",
      coreActivity: "Find the Philippines and trace the route from our home country.",
      advancedChallenge: "Name three countries that neighbor the Philippines."
    },
    interactiveGame: "Map Match",
    handsOnActivity: "Draw your own map",
    knowledgeCheck: [
      { question: "What continent is the Philippines in?", options: ["Asia", "Europe"], correctAnswer: "Asia" }
    ],
    learnerReflection: "I learned where the Philippines is located.",
    familyChallenge: "Show your family where the Philippines is on a map.",
    progressBadge: "World Explorer",
    sourceNotes: "CIA World Factbook",
    mediaAttributionNotes: "Maps pending verification",
    accessibilityNotes: "Provide high contrast maps.",
    teacherPreparation: "Review world map and find the Philippines beforehand.",
    teacherAnswerKey: { "Q1": "Asia" }
  },
  {
    id: "lesson-2-archipelago",
    date: "2026-08-04",
    weekday: "Tuesday",
    title: "The Philippines as an Archipelago",
    unit: "Discover the Philippines",
    learningObjectives: ["Understand the definition of archipelago"],
    essentialQuestion: "What is an archipelago?",
    factualBackground: "An archipelago is a group of islands. The Philippines has 7,641 islands.",
    vocabulary: [{ word: "Isla", translation: "Island" }],
    subjectConnections: { geography: "Islands" },
    materials: ["Map of the Philippines"],
    factualMediaRequirements: ["philippines-archipelago-map", "philippines-archipelago-photo"],
    activities: {
      beginnerSupport: "Count islands on the map.",
      coreActivity: "Define archipelago and identify the Philippines as one.",
      advancedChallenge: "Research how archipelagos are formed."
    },
    interactiveGame: "Island Hopper",
    handsOnActivity: "Clay island modeling",
    knowledgeCheck: [
      { question: "What is a group of islands called?", options: ["Archipelago", "Peninsula"], correctAnswer: "Archipelago" }
    ],
    learnerReflection: "I learned what an archipelago is.",
    familyChallenge: "Build a tiny archipelago at home using pillows.",
    progressBadge: "Island Explorer",
    sourceNotes: "NAMRIA",
    mediaAttributionNotes: "Maps pending verification",
    accessibilityNotes: "Tactile maps for visually impaired.",
    teacherPreparation: "Prepare clay for modeling.",
    teacherAnswerKey: { "Q1": "Archipelago" }
  },
  {
    id: "lesson-3-luzon-visayas-mindanao",
    date: "2026-08-07",
    weekday: "Friday",
    title: "Luzon, Visayas, and Mindanao",
    unit: "Discover the Philippines",
    learningObjectives: ["Identify the three main island groups"],
    essentialQuestion: "What are the three main regions of the Philippines?",
    factualBackground: "Luzon, Visayas, and Mindanao are the three major island groups.",
    vocabulary: [{ word: "Luzon", translation: "Luzon" }, { word: "Visayas", translation: "Visayas" }, { word: "Mindanao", translation: "Mindanao" }],
    subjectConnections: { geography: "Philippine Regions" },
    materials: ["Philippine Regions Map"],
    factualMediaRequirements: ["philippines-regions-map", "philippines-regions-photo"],
    activities: {
      beginnerSupport: "Color the three regions.",
      coreActivity: "Learn the names of the three major island groups.",
      advancedChallenge: "Identify one major city in each region."
    },
    interactiveGame: "Region Match",
    handsOnActivity: "Region puzzle",
    knowledgeCheck: [
      { question: "Which is a major island group?", options: ["Luzon", "Hawaii"], correctAnswer: "Luzon" }
    ],
    learnerReflection: "I learned the three main island groups.",
    familyChallenge: "Sing a song about Luzon, Visayas, and Mindanao.",
    progressBadge: "Region Master",
    sourceNotes: "Philippine Statistics Authority",
    mediaAttributionNotes: "Maps pending verification",
    accessibilityNotes: "Color-blind friendly maps.",
    teacherPreparation: "Print region puzzle pieces.",
    teacherAnswerKey: { "Q1": "Luzon" }
  }
];
