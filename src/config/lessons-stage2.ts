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
  },
  {
    id: "lesson-4-region",
    date: "2026-08-10",
    weekday: "Monday",
    title: "Exploring Our Region",
    unit: "Discover the Philippines",
    learningObjectives: ["Understand what a region is"],
    essentialQuestion: "What region are we exploring?",
    factualBackground: "The Philippines is divided into 17 administrative regions.",
    vocabulary: [{ word: "Rehiyon", translation: "Region" }],
    subjectConnections: { geography: "Regions" },
    materials: ["Map of regions"],
    factualMediaRequirements: ["philippines-regions-map"],
    activities: {
      beginnerSupport: "Point to a region.",
      coreActivity: "Find our target region on the map.",
      advancedChallenge: "Name 3 regions in the Philippines."
    },
    interactiveGame: "Region Match",
    handsOnActivity: "Color the region",
    knowledgeCheck: [
      { question: "How many regions are there?", options: ["17", "50"], correctAnswer: "17" }
    ],
    learnerReflection: "I learned about regions.",
    familyChallenge: "Discuss your family's home region.",
    progressBadge: "Region Explorer",
    sourceNotes: "PSA",
    mediaAttributionNotes: "Map verified",
    accessibilityNotes: "High contrast",
    teacherPreparation: "Review regional map.",
    teacherAnswerKey: { "Q1": "17" }
  },
  {
    id: "lesson-5-province",
    date: "2026-08-11",
    weekday: "Tuesday",
    title: "Our Home Province",
    unit: "Discover the Philippines",
    learningObjectives: ["Learn about provinces"],
    essentialQuestion: "What is a province?",
    factualBackground: "There are 82 provinces in the Philippines.",
    vocabulary: [{ word: "Lalawigan", translation: "Province" }],
    subjectConnections: { geography: "Provinces" },
    materials: ["Map of provinces"],
    factualMediaRequirements: [],
    activities: {
      beginnerSupport: "Say the word province.",
      coreActivity: "Locate a province on the map.",
      advancedChallenge: "Identify the capital of the province."
    },
    interactiveGame: "Province Puzzle",
    handsOnActivity: "Draw the province shape",
    knowledgeCheck: [
      { question: "What is the Tagalog word for province?", options: ["Lalawigan", "Bayan"], correctAnswer: "Lalawigan" }
    ],
    learnerReflection: "I learned what a province is.",
    familyChallenge: "Ask your parents about their home province.",
    progressBadge: "Province Guide",
    sourceNotes: "PSA",
    mediaAttributionNotes: "None",
    accessibilityNotes: "Clear text",
    teacherPreparation: "Prepare province map.",
    teacherAnswerKey: { "Q1": "Lalawigan" }
  },
  {
    id: "lesson-6-city",
    date: "2026-08-14",
    weekday: "Friday",
    title: "Our City and Hometown",
    unit: "Discover the Philippines",
    learningObjectives: ["Identify a city or hometown"],
    essentialQuestion: "What makes our city special?",
    factualBackground: "Cities and municipalities make up a province.",
    vocabulary: [{ word: "Lungsod", translation: "City" }],
    subjectConnections: { geography: "Cities" },
    materials: ["Photos of hometown"],
    factualMediaRequirements: [],
    activities: {
      beginnerSupport: "Name your city.",
      coreActivity: "Draw your favorite spot in the city.",
      advancedChallenge: "Write a sentence about your city."
    },
    interactiveGame: "City Bingo",
    handsOnActivity: "Build a mini city from blocks",
    knowledgeCheck: [
      { question: "What is the Tagalog word for city?", options: ["Lungsod", "Barangay"], correctAnswer: "Lungsod" }
    ],
    learnerReflection: "I love my city.",
    familyChallenge: "Take a walk in your city.",
    progressBadge: "City Explorer",
    sourceNotes: "General Knowledge",
    mediaAttributionNotes: "None",
    accessibilityNotes: "Clear audio",
    teacherPreparation: "Gather hometown pictures.",
    teacherAnswerKey: { "Q1": "Lungsod" }
  },
];

