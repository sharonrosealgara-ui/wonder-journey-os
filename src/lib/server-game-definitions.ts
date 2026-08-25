if (typeof window !== "undefined") {
  throw new Error("This module is server-only and cannot be executed in browser context.");
}
import crypto from "crypto";

// ─────────────────────────────────────────────────────────────
// WONDER JOURNEY OS — SERVER-ONLY GAME DEFINITIONS & SOLUTION KEYS
// Protected Server Module: Authored questions, solution keys,
// and answer evaluators are strictly isolated from client bundles.
// ─────────────────────────────────────────────────────────────

export interface LearnerHotspot {
  id: string;
  x: number;
  y: number;
  radius: number;
}

export interface LearnerMatchingItem {
  id: string;
  text: string;
  side: "left" | "right";
}

export interface LearnerSequenceItem {
  id: string;
  text: string;
  emoji: string;
}

export interface LearnerSortItem {
  id: string;
  text: string;
}

export interface LearnerSortBin {
  id: string;
  label: string;
}

export interface LearnerQuizOption {
  id: string;
  text: string;
}

export interface LearnerMemoryCard {
  id: string;
  text: string;
  type: "text" | "translation";
}

export interface LearnerSafeGameDTO {
  lessonId: string;
  lessonTitle: string;
  hotspots: {
    prompt: string;
    targets: LearnerHotspot[];
  };
  sorting: {
    title: string;
    bins: LearnerSortBin[];
    items: LearnerSortItem[];
  };
  matching: {
    title: string;
    leftItems: LearnerMatchingItem[];
    rightItems: LearnerMatchingItem[];
  };
  sequencing: {
    title: string;
    items: LearnerSequenceItem[];
  };
  quiz: {
    question: string;
    options: LearnerQuizOption[];
  };
  memory: {
    title: string;
    cards: LearnerMemoryCard[];
  };
  review: {
    title: string;
    summary: string;
    keyPoints: string[];
  };
}

export interface TeacherSolutionKey {
  lessonId: string;
  hotspotTargetIds: string[];
  sortingMap: Record<string, string>; // itemId -> binId
  matchingPairs: Record<string, string>; // leftItemId -> rightItemId
  sequenceOrder: string[]; // itemIds in correct order
  correctQuizOptionId: string;
  memoryPairs: Record<string, string>; // cardId -> cardId
}

const activeSolutionKeys = new Map<string, TeacherSolutionKey>();

function genId(prefix: string): string {
  return `${prefix}_${crypto.randomBytes(6).toString("hex")}`;
}

function getLessonTheme(lessonId: string, lessonTitle: string) {
  const numMatch = lessonId.match(/\d+/);
  const num = numMatch ? parseInt(numMatch[0], 10) : 1;

  switch (num) {
    case 1:
      return {
        sortTitle: "Lesson 1: Our Place in the World Categorization",
        bins: ["Major Island Groups", "Surrounding Seas"],
        items: [
          {
                    "text": "Luzon",
                    "bin": 0
          },
          {
                    "text": "Pacific Ocean",
                    "bin": 1
          },
          {
                    "text": "Visayas",
                    "bin": 0
          },
          {
                    "text": "West Philippine Sea",
                    "bin": 1
          },
          {
                    "text": "Mindanao",
                    "bin": 0
          },
          {
                    "text": "Celebes Sea",
                    "bin": 1
          }
],
        matchLeft: ["Pilipinas","Dagat","Pulo","Kapuluan"],
        matchRight: ["Philippines","Sea / Ocean","Island","Archipelago"],
        seqTitle: "Process Sequence: Our Place in the World",
        seqItems: [
          {
                    "text": "Find Southeast Asia on the world globe",
                    "emoji": "🌏"
          },
          {
                    "text": "Locate the 7,641 islands in the Pacific",
                    "emoji": "🏝️"
          },
          {
                    "text": "Differentiate Luzon, Visayas, and Mindanao",
                    "emoji": "🗺️"
          },
          {
                    "text": "Mark your family's home coordinate",
                    "emoji": "📍"
          }
],
        quizQuestion: "How many islands make up the Philippine Archipelago?",
        quizOptions: [
          "Over 7,600 islands",
          "500 islands",
          "12 islands",
          "50 islands"
],
        correctQuizIndex: 0,
        hotspotPrompt: "Identify the core feature of Our Place in the World:",
        memoryPairs: [["Pilipinas","Philippines"],["Dagat","Sea"],["Kapuluan","Archipelago"],["Pulo","Island"]]
      };

    case 2:
      return {
        sortTitle: "Lesson 2: The Philippine Archipelago Categorization",
        bins: ["The Core Concept", "Cultural & Practical Context"],
        items: [
          {
                    "text": "Philippine Key Principle",
                    "bin": 0
          },
          {
                    "text": "Practical Application of Philippine",
                    "bin": 1
          },
          {
                    "text": "Archipelago Cultural Element",
                    "bin": 0
          },
          {
                    "text": "Community Context of Archipelago",
                    "bin": 1
          },
          {
                    "text": "Tagalog Vocabulary for Tradition",
                    "bin": 0
          },
          {
                    "text": "Family Reflection on Tradition",
                    "bin": 1
          }
],
        matchLeft: ["Philippine (Term 1)","Archipelago (Term 2)","Aral (Lesson)","Bayan (Community)"],
        matchRight: ["Core Meaning of Philippine","Practice of Archipelago","Instructional Knowledge","Town / People"],
        seqTitle: "Process Sequence: The Philippine Archipelago",
        seqItems: [
          {
                    "text": "Examine opening visual for The Philippine Archipelago",
                    "emoji": "🔍"
          },
          {
                    "text": "Understand factual background and Philippine context",
                    "emoji": "📖"
          },
          {
                    "text": "Practice Tagalog terms and family activity",
                    "emoji": "🗣️"
          },
          {
                    "text": "Complete reflection and record milestone",
                    "emoji": "⭐"
          }
],
        quizQuestion: "What is the primary educational objective of Lesson 2: The Philippine Archipelago?",
        quizOptions: [
          "Define the term 'archipelago' and understand why the Philippines is classif...",
          "Ignoring historical facts and context",
          "Memorizing unrelated numbers",
          "Skipping the interactive session"
],
        correctQuizIndex: 0,
        hotspotPrompt: "Identify the core feature of The Philippine Archipelago:",
        memoryPairs: [["Philippine","Translation of Philippine"],["Archipelago","Meaning of Archipelago"],["Aral","Learning"],["Bayan","Nation/Community"]]
      };

    case 3:
      return {
        sortTitle: "Lesson 3: Luzon, Visayas, and Mindanao Categorization",
        bins: ["Luzon Core Concept", "Cultural & Practical Context"],
        items: [
          {
                    "text": "Luzon Key Principle",
                    "bin": 0
          },
          {
                    "text": "Practical Application of Luzon",
                    "bin": 1
          },
          {
                    "text": "Visayas Cultural Element",
                    "bin": 0
          },
          {
                    "text": "Community Context of Visayas",
                    "bin": 1
          },
          {
                    "text": "Tagalog Vocabulary for Mindanao",
                    "bin": 0
          },
          {
                    "text": "Family Reflection on Mindanao",
                    "bin": 1
          }
],
        matchLeft: ["Luzon (Term 1)","Visayas (Term 2)","Aral (Lesson)","Bayan (Community)"],
        matchRight: ["Core Meaning of Luzon","Practice of Visayas","Instructional Knowledge","Town / People"],
        seqTitle: "Process Sequence: Luzon, Visayas, and Mindanao",
        seqItems: [
          {
                    "text": "Examine opening visual for Luzon Visayas and Mindanao Three Island Groups",
                    "emoji": "🔍"
          },
          {
                    "text": "Understand factual background and Luzon context",
                    "emoji": "📖"
          },
          {
                    "text": "Practice Tagalog terms and family activity",
                    "emoji": "🗣️"
          },
          {
                    "text": "Complete reflection and record milestone",
                    "emoji": "⭐"
          }
],
        quizQuestion: "What is the primary educational objective of Lesson 3: Luzon Visayas and Mindanao Three Island Groups?",
        quizOptions: [
          "Identify the three major island groups of the Philippines: Luzon in the nor...",
          "Ignoring historical facts and context",
          "Memorizing unrelated numbers",
          "Skipping the interactive session"
],
        correctQuizIndex: 0,
        hotspotPrompt: "Identify the core feature of Luzon, Visayas, and Mindanao:",
        memoryPairs: [["Luzon","Translation of Luzon"],["Visayas","Meaning of Visayas"],["Aral","Learning"],["Bayan","Nation/Community"]]
      };

    case 4:
      return {
        sortTitle: "Lesson 4: Understanding Our Administrative Regions Categorization",
        bins: ["Understanding Core Concept", "Cultural & Practical Context"],
        items: [
          {
                    "text": "Understanding Key Principle",
                    "bin": 0
          },
          {
                    "text": "Practical Application of Understanding",
                    "bin": 1
          },
          {
                    "text": "Administrative Cultural Element",
                    "bin": 0
          },
          {
                    "text": "Community Context of Administrative",
                    "bin": 1
          },
          {
                    "text": "Tagalog Vocabulary for Regions",
                    "bin": 0
          },
          {
                    "text": "Family Reflection on Regions",
                    "bin": 1
          }
],
        matchLeft: ["Understanding (Term 1)","Administrative (Term 2)","Aral (Lesson)","Bayan (Community)"],
        matchRight: ["Core Meaning of Understanding","Practice of Administrative","Instructional Knowledge","Town / People"],
        seqTitle: "Process Sequence: Understanding Our Administrative Regions",
        seqItems: [
          {
                    "text": "Examine opening visual for Understanding Our Administrative Regions",
                    "emoji": "🔍"
          },
          {
                    "text": "Understand factual background and Understanding context",
                    "emoji": "📖"
          },
          {
                    "text": "Practice Tagalog terms and family activity",
                    "emoji": "🗣️"
          },
          {
                    "text": "Complete reflection and record milestone",
                    "emoji": "⭐"
          }
],
        quizQuestion: "What is the primary educational objective of Lesson 4: Understanding Our Administrative Regions?",
        quizOptions: [
          "Identify that the Philippines is officially organized into 18 administrativ...",
          "Ignoring historical facts and context",
          "Memorizing unrelated numbers",
          "Skipping the interactive session"
],
        correctQuizIndex: 0,
        hotspotPrompt: "Identify the core feature of Understanding Our Administrative Regions:",
        memoryPairs: [["Understanding","Translation of Understanding"],["Administrative","Meaning of Administrative"],["Aral","Learning"],["Bayan","Nation/Community"]]
      };

    case 5:
      return {
        sortTitle: "Lesson 5: Provinces Categorization",
        bins: ["Provinces Core Concept", "Cultural & Practical Context"],
        items: [
          {
                    "text": "Provinces Key Principle",
                    "bin": 0
          },
          {
                    "text": "Practical Application of Provinces",
                    "bin": 1
          },
          {
                    "text": "Heartlands Cultural Element",
                    "bin": 0
          },
          {
                    "text": "Community Context of Heartlands",
                    "bin": 1
          },
          {
                    "text": "Tagalog Vocabulary for Archipelago",
                    "bin": 0
          },
          {
                    "text": "Family Reflection on Archipelago",
                    "bin": 1
          }
],
        matchLeft: ["Provinces (Term 1)","Heartlands (Term 2)","Aral (Lesson)","Bayan (Community)"],
        matchRight: ["Core Meaning of Provinces","Practice of Heartlands","Instructional Knowledge","Town / People"],
        seqTitle: "Process Sequence: Provinces",
        seqItems: [
          {
                    "text": "Examine opening visual for Provinces The Heartlands of the Archipelago",
                    "emoji": "🔍"
          },
          {
                    "text": "Understand factual background and Provinces context",
                    "emoji": "📖"
          },
          {
                    "text": "Practice Tagalog terms and family activity",
                    "emoji": "🗣️"
          },
          {
                    "text": "Complete reflection and record milestone",
                    "emoji": "⭐"
          }
],
        quizQuestion: "What is the primary educational objective of Lesson 5: Provinces The Heartlands of the Archipelago?",
        quizOptions: [
          "Identify that the Philippines is divided into 82 distinct provinces, each w...",
          "Ignoring historical facts and context",
          "Memorizing unrelated numbers",
          "Skipping the interactive session"
],
        correctQuizIndex: 0,
        hotspotPrompt: "Identify the core feature of Provinces:",
        memoryPairs: [["Provinces","Translation of Provinces"],["Heartlands","Meaning of Heartlands"],["Aral","Learning"],["Bayan","Nation/Community"]]
      };

    case 6:
      return {
        sortTitle: "Lesson 6: Cities, Municipalities, and Barangays Categorization",
        bins: ["Cities Core Concept", "Cultural & Practical Context"],
        items: [
          {
                    "text": "Cities Key Principle",
                    "bin": 0
          },
          {
                    "text": "Practical Application of Cities",
                    "bin": 1
          },
          {
                    "text": "Municipalities Cultural Element",
                    "bin": 0
          },
          {
                    "text": "Community Context of Municipalities",
                    "bin": 1
          },
          {
                    "text": "Tagalog Vocabulary for Barangays",
                    "bin": 0
          },
          {
                    "text": "Family Reflection on Barangays",
                    "bin": 1
          }
],
        matchLeft: ["Cities (Term 1)","Municipalities (Term 2)","Aral (Lesson)","Bayan (Community)"],
        matchRight: ["Core Meaning of Cities","Practice of Municipalities","Instructional Knowledge","Town / People"],
        seqTitle: "Process Sequence: Cities, Municipalities, and Barangays",
        seqItems: [
          {
                    "text": "Examine opening visual for Cities Municipalities and Barangays",
                    "emoji": "🔍"
          },
          {
                    "text": "Understand factual background and Cities context",
                    "emoji": "📖"
          },
          {
                    "text": "Practice Tagalog terms and family activity",
                    "emoji": "🗣️"
          },
          {
                    "text": "Complete reflection and record milestone",
                    "emoji": "⭐"
          }
],
        quizQuestion: "What is the primary educational objective of Lesson 6: Cities Municipalities and Barangays?",
        quizOptions: [
          "Understand the hierarchy of local governance in the Philippines: Highly Urb...",
          "Ignoring historical facts and context",
          "Memorizing unrelated numbers",
          "Skipping the interactive session"
],
        correctQuizIndex: 0,
        hotspotPrompt: "Identify the core feature of Cities, Municipalities, and Barangays:",
        memoryPairs: [["Cities","Translation of Cities"],["Municipalities","Meaning of Municipalities"],["Aral","Learning"],["Bayan","Nation/Community"]]
      };

    case 7:
      return {
        sortTitle: "Lesson 7: Symbols of Our Nation Categorization",
        bins: ["Symbols Core Concept", "Cultural & Practical Context"],
        items: [
          {
                    "text": "Symbols Key Principle",
                    "bin": 0
          },
          {
                    "text": "Practical Application of Symbols",
                    "bin": 1
          },
          {
                    "text": "Nation Cultural Element",
                    "bin": 0
          },
          {
                    "text": "Community Context of Nation",
                    "bin": 1
          },
          {
                    "text": "Tagalog Vocabulary for Tradition",
                    "bin": 0
          },
          {
                    "text": "Family Reflection on Tradition",
                    "bin": 1
          }
],
        matchLeft: ["Symbols (Term 1)","Nation (Term 2)","Aral (Lesson)","Bayan (Community)"],
        matchRight: ["Core Meaning of Symbols","Practice of Nation","Instructional Knowledge","Town / People"],
        seqTitle: "Process Sequence: Symbols of Our Nation",
        seqItems: [
          {
                    "text": "Examine opening visual for Symbols of Our Nation",
                    "emoji": "🔍"
          },
          {
                    "text": "Understand factual background and Symbols context",
                    "emoji": "📖"
          },
          {
                    "text": "Practice Tagalog terms and family activity",
                    "emoji": "🗣️"
          },
          {
                    "text": "Complete reflection and record milestone",
                    "emoji": "⭐"
          }
],
        quizQuestion: "What is the primary educational objective of Lesson 7: Symbols of Our Nation?",
        quizOptions: [
          "Identify official national symbols of the Philippines established under Rep...",
          "Ignoring historical facts and context",
          "Memorizing unrelated numbers",
          "Skipping the interactive session"
],
        correctQuizIndex: 0,
        hotspotPrompt: "Identify the core feature of Symbols of Our Nation:",
        memoryPairs: [["Symbols","Translation of Symbols"],["Nation","Meaning of Nation"],["Aral","Learning"],["Bayan","Nation/Community"]]
      };

    case 8:
      return {
        sortTitle: "Lesson 8: Mountains, Volcanoes, and the Ring of Fire Categorization",
        bins: ["Mountains Core Concept", "Cultural & Practical Context"],
        items: [
          {
                    "text": "Mountains Key Principle",
                    "bin": 0
          },
          {
                    "text": "Practical Application of Mountains",
                    "bin": 1
          },
          {
                    "text": "Volcanoes Cultural Element",
                    "bin": 0
          },
          {
                    "text": "Community Context of Volcanoes",
                    "bin": 1
          },
          {
                    "text": "Tagalog Vocabulary for Ring",
                    "bin": 0
          },
          {
                    "text": "Family Reflection on Ring",
                    "bin": 1
          }
],
        matchLeft: ["Mountains (Term 1)","Volcanoes (Term 2)","Aral (Lesson)","Bayan (Community)"],
        matchRight: ["Core Meaning of Mountains","Practice of Volcanoes","Instructional Knowledge","Town / People"],
        seqTitle: "Process Sequence: Mountains, Volcanoes, and the Ring of Fire",
        seqItems: [
          {
                    "text": "Examine opening visual for Mountains Volcanoes and the Ring of Fire",
                    "emoji": "🔍"
          },
          {
                    "text": "Understand factual background and Mountains context",
                    "emoji": "📖"
          },
          {
                    "text": "Practice Tagalog terms and family activity",
                    "emoji": "🗣️"
          },
          {
                    "text": "Complete reflection and record milestone",
                    "emoji": "⭐"
          }
],
        quizQuestion: "What is the primary educational objective of Lesson 8: Mountains Volcanoes and the Ring of Fire?",
        quizOptions: [
          "Explain why the Philippines has numerous active volcanoes and mountain rang...",
          "Ignoring historical facts and context",
          "Memorizing unrelated numbers",
          "Skipping the interactive session"
],
        correctQuizIndex: 0,
        hotspotPrompt: "Identify the core feature of Mountains, Volcanoes, and the Ring of Fire:",
        memoryPairs: [["Mountains","Translation of Mountains"],["Volcanoes","Meaning of Volcanoes"],["Aral","Learning"],["Bayan","Nation/Community"]]
      };

    case 9:
      return {
        sortTitle: "Lesson 9: Rivers, Lakes, and Coastal Waters Categorization",
        bins: ["Rivers Core Concept", "Cultural & Practical Context"],
        items: [
          {
                    "text": "Rivers Key Principle",
                    "bin": 0
          },
          {
                    "text": "Practical Application of Rivers",
                    "bin": 1
          },
          {
                    "text": "Lakes Cultural Element",
                    "bin": 0
          },
          {
                    "text": "Community Context of Lakes",
                    "bin": 1
          },
          {
                    "text": "Tagalog Vocabulary for Coastal",
                    "bin": 0
          },
          {
                    "text": "Family Reflection on Coastal",
                    "bin": 1
          }
],
        matchLeft: ["Rivers (Term 1)","Lakes (Term 2)","Aral (Lesson)","Bayan (Community)"],
        matchRight: ["Core Meaning of Rivers","Practice of Lakes","Instructional Knowledge","Town / People"],
        seqTitle: "Process Sequence: Rivers, Lakes, and Coastal Waters",
        seqItems: [
          {
                    "text": "Examine opening visual for Rivers Lakes and Coastal Waters",
                    "emoji": "🔍"
          },
          {
                    "text": "Understand factual background and Rivers context",
                    "emoji": "📖"
          },
          {
                    "text": "Practice Tagalog terms and family activity",
                    "emoji": "🗣️"
          },
          {
                    "text": "Complete reflection and record milestone",
                    "emoji": "⭐"
          }
],
        quizQuestion: "What is the primary educational objective of Lesson 9: Rivers Lakes and Coastal Waters?",
        quizOptions: [
          "Identify major Philippine river systems (Cagayan River, Rio Grande de Minda...",
          "Ignoring historical facts and context",
          "Memorizing unrelated numbers",
          "Skipping the interactive session"
],
        correctQuizIndex: 0,
        hotspotPrompt: "Identify the core feature of Rivers, Lakes, and Coastal Waters:",
        memoryPairs: [["Rivers","Translation of Rivers"],["Lakes","Meaning of Lakes"],["Aral","Learning"],["Bayan","Nation/Community"]]
      };

    case 10:
      return {
        sortTitle: "Lesson 10: Philippine Wildlife and Endemic Species Categorization",
        bins: ["Philippine Core Concept", "Cultural & Practical Context"],
        items: [
          {
                    "text": "Philippine Key Principle",
                    "bin": 0
          },
          {
                    "text": "Practical Application of Philippine",
                    "bin": 1
          },
          {
                    "text": "Wildlife Cultural Element",
                    "bin": 0
          },
          {
                    "text": "Community Context of Wildlife",
                    "bin": 1
          },
          {
                    "text": "Tagalog Vocabulary for Endemic",
                    "bin": 0
          },
          {
                    "text": "Family Reflection on Endemic",
                    "bin": 1
          }
],
        matchLeft: ["Philippine (Term 1)","Wildlife (Term 2)","Aral (Lesson)","Bayan (Community)"],
        matchRight: ["Core Meaning of Philippine","Practice of Wildlife","Instructional Knowledge","Town / People"],
        seqTitle: "Process Sequence: Philippine Wildlife and Endemic Species",
        seqItems: [
          {
                    "text": "Examine opening visual for Philippine Wildlife and Endemic Species",
                    "emoji": "🔍"
          },
          {
                    "text": "Understand factual background and Philippine context",
                    "emoji": "📖"
          },
          {
                    "text": "Practice Tagalog terms and family activity",
                    "emoji": "🗣️"
          },
          {
                    "text": "Complete reflection and record milestone",
                    "emoji": "⭐"
          }
],
        quizQuestion: "What is the primary educational objective of Lesson 10: Philippine Wildlife and Endemic Species?",
        quizOptions: [
          "Identify famous endemic animal species that live only in the Philippines (P...",
          "Ignoring historical facts and context",
          "Memorizing unrelated numbers",
          "Skipping the interactive session"
],
        correctQuizIndex: 0,
        hotspotPrompt: "Identify the core feature of Philippine Wildlife and Endemic Species:",
        memoryPairs: [["Philippine","Translation of Philippine"],["Wildlife","Meaning of Wildlife"],["Aral","Learning"],["Bayan","Nation/Community"]]
      };

    case 11:
      return {
        sortTitle: "Lesson 11: Philippine Flora Categorization",
        bins: ["Philippine Core Concept", "Cultural & Practical Context"],
        items: [
          {
                    "text": "Philippine Key Principle",
                    "bin": 0
          },
          {
                    "text": "Practical Application of Philippine",
                    "bin": 1
          },
          {
                    "text": "Flora Cultural Element",
                    "bin": 0
          },
          {
                    "text": "Community Context of Flora",
                    "bin": 1
          },
          {
                    "text": "Tagalog Vocabulary for Trees",
                    "bin": 0
          },
          {
                    "text": "Family Reflection on Trees",
                    "bin": 1
          }
],
        matchLeft: ["Philippine (Term 1)","Flora (Term 2)","Aral (Lesson)","Bayan (Community)"],
        matchRight: ["Core Meaning of Philippine","Practice of Flora","Instructional Knowledge","Town / People"],
        seqTitle: "Process Sequence: Philippine Flora",
        seqItems: [
          {
                    "text": "Examine opening visual for Philippine Flora Trees Flowers and Fruits",
                    "emoji": "🔍"
          },
          {
                    "text": "Understand factual background and Philippine context",
                    "emoji": "📖"
          },
          {
                    "text": "Practice Tagalog terms and family activity",
                    "emoji": "🗣️"
          },
          {
                    "text": "Complete reflection and record milestone",
                    "emoji": "⭐"
          }
],
        quizQuestion: "What is the primary educational objective of Lesson 11: Philippine Flora Trees Flowers and Fruits?",
        quizOptions: [
          "Identify famous native trees, flowers, and fruits of the Philippines (Narra...",
          "Ignoring historical facts and context",
          "Memorizing unrelated numbers",
          "Skipping the interactive session"
],
        correctQuizIndex: 0,
        hotspotPrompt: "Identify the core feature of Philippine Flora:",
        memoryPairs: [["Philippine","Translation of Philippine"],["Flora","Meaning of Flora"],["Aral","Learning"],["Bayan","Nation/Community"]]
      };

    case 12:
      return {
        sortTitle: "Lesson 12: Voices of the Archipelago Categorization",
        bins: ["Voices Core Concept", "Cultural & Practical Context"],
        items: [
          {
                    "text": "Voices Key Principle",
                    "bin": 0
          },
          {
                    "text": "Practical Application of Voices",
                    "bin": 1
          },
          {
                    "text": "Archipelago Cultural Element",
                    "bin": 0
          },
          {
                    "text": "Community Context of Archipelago",
                    "bin": 1
          },
          {
                    "text": "Tagalog Vocabulary for Languages",
                    "bin": 0
          },
          {
                    "text": "Family Reflection on Languages",
                    "bin": 1
          }
],
        matchLeft: ["Voices (Term 1)","Archipelago (Term 2)","Aral (Lesson)","Bayan (Community)"],
        matchRight: ["Core Meaning of Voices","Practice of Archipelago","Instructional Knowledge","Town / People"],
        seqTitle: "Process Sequence: Voices of the Archipelago",
        seqItems: [
          {
                    "text": "Examine opening visual for Voices of the Archipelago Languages and Cultural Heritage",
                    "emoji": "🔍"
          },
          {
                    "text": "Understand factual background and Voices context",
                    "emoji": "📖"
          },
          {
                    "text": "Practice Tagalog terms and family activity",
                    "emoji": "🗣️"
          },
          {
                    "text": "Complete reflection and record milestone",
                    "emoji": "⭐"
          }
],
        quizQuestion: "What is the primary educational objective of Lesson 12: Voices of the Archipelago Languages and Cultural Heritage?",
        quizOptions: [
          "Identify that the Philippines is home to over 120-180 distinct native langu...",
          "Ignoring historical facts and context",
          "Memorizing unrelated numbers",
          "Skipping the interactive session"
],
        correctQuizIndex: 0,
        hotspotPrompt: "Identify the core feature of Voices of the Archipelago:",
        memoryPairs: [["Voices","Translation of Voices"],["Archipelago","Meaning of Archipelago"],["Aral","Learning"],["Bayan","Nation/Community"]]
      };

    case 13:
      return {
        sortTitle: "Lesson 13: The Great August Showcase Categorization",
        bins: ["The Core Concept", "Cultural & Practical Context"],
        items: [
          {
                    "text": "Great Key Principle",
                    "bin": 0
          },
          {
                    "text": "Practical Application of Great",
                    "bin": 1
          },
          {
                    "text": "August Cultural Element",
                    "bin": 0
          },
          {
                    "text": "Community Context of August",
                    "bin": 1
          },
          {
                    "text": "Tagalog Vocabulary for Showcase",
                    "bin": 0
          },
          {
                    "text": "Family Reflection on Showcase",
                    "bin": 1
          }
],
        matchLeft: ["Great (Term 1)","August (Term 2)","Aral (Lesson)","Bayan (Community)"],
        matchRight: ["Core Meaning of Great","Practice of August","Instructional Knowledge","Town / People"],
        seqTitle: "Process Sequence: The Great August Showcase",
        seqItems: [
          {
                    "text": "Examine opening visual for The Great August Showcase Celebrating Our Archipelago",
                    "emoji": "🔍"
          },
          {
                    "text": "Understand factual background and Great context",
                    "emoji": "📖"
          },
          {
                    "text": "Practice Tagalog terms and family activity",
                    "emoji": "🗣️"
          },
          {
                    "text": "Complete reflection and record milestone",
                    "emoji": "⭐"
          }
],
        quizQuestion: "What is the primary educational objective of Lesson 13: The Great August Showcase Celebrating Our Archipelago?",
        quizOptions: [
          "Synthesize all August geography and heritage learning: world location, ~7,6...",
          "Ignoring historical facts and context",
          "Memorizing unrelated numbers",
          "Skipping the interactive session"
],
        correctQuizIndex: 0,
        hotspotPrompt: "Identify the core feature of The Great August Showcase:",
        memoryPairs: [["Great","Translation of Great"],["August","Meaning of August"],["Aral","Learning"],["Bayan","Nation/Community"]]
      };

    case 14:
      return {
        sortTitle: "Lesson 14: Kumusta? Greetings and Introductions Categorization",
        bins: ["Tagalog Greeting", "Time of Day / Etymology"],
        items: [
          {
                    "text": "Magandang umaga",
                    "bin": 0
          },
          {
                    "text": "Morning (Sunrise)",
                    "bin": 1
          },
          {
                    "text": "Kumusta",
                    "bin": 0
          },
          {
                    "text": "From Spanish 'cómo estás'",
                    "bin": 1
          },
          {
                    "text": "Magandang gabi",
                    "bin": 0
          },
          {
                    "text": "Evening (Sunset)",
                    "bin": 1
          }
],
        matchLeft: ["Kumusta","Magandang umaga","Magandang hapon","Magandang gabi"],
        matchRight: ["How are you?","Good morning","Good afternoon","Good evening"],
        seqTitle: "Process Sequence: Kumusta? Greetings and Introductions",
        seqItems: [
          {
                    "text": "Approach friend with warm eye contact and smile",
                    "emoji": "😊"
          },
          {
                    "text": "Say cheerful 'Kumusta!' greeting",
                    "emoji": "👋"
          },
          {
                    "text": "Offer time-based greeting (e.g. Magandang umaga)",
                    "emoji": "🌅"
          },
          {
                    "text": "Introduce oneself: 'Ako si...'",
                    "emoji": "🤝"
          }
],
        quizQuestion: "What historical language original is the Tagalog greeting 'Kumusta' derived from?",
        quizOptions: [
          "Spanish 'cómo estás'",
          "Latin 'quomodo stas'",
          "English 'how are you'",
          "Nahuatl 'comoesta'"
],
        correctQuizIndex: 0,
        hotspotPrompt: "Identify the core feature of Kumusta? Greetings and Introductions:",
        memoryPairs: [["Kumusta","How are you"],["Umaga","Morning"],["Hapon","Afternoon"],["Gabi","Evening"]]
      };

    case 15:
      return {
        sortTitle: "Lesson 15: Po, Opo, and Mano Po Categorization",
        bins: ["Honorific Verbal Particles", "Physical Gesture Etiquette"],
        items: [
          {
                    "text": "Salamat po",
                    "bin": 0
          },
          {
                    "text": "Mano po gesture",
                    "bin": 1
          },
          {
                    "text": "Opo (Respectful Yes)",
                    "bin": 0
          },
          {
                    "text": "Pressing hand to forehead",
                    "bin": 1
          },
          {
                    "text": "Magandang araw po",
                    "bin": 0
          },
          {
                    "text": "Asking elder's blessing",
                    "bin": 1
          }
],
        matchLeft: ["Po / Opo","Mano po","Paggalang","Lola / Lolo"],
        matchRight: ["Honorific particles","Respectful hand gesture","Core value of respect","Grandmother / Grandfather"],
        seqTitle: "Process Sequence: Po, Opo, and Mano Po",
        seqItems: [
          {
                    "text": "Approach parent or grandparent with respectful posture",
                    "emoji": "👵"
          },
          {
                    "text": "Gently take the back of elder's right hand",
                    "emoji": "✋"
          },
          {
                    "text": "Bow head and press back of hand to your forehead",
                    "emoji": "🙇"
          },
          {
                    "text": "Receive elder's verbal blessing ('Kaawaan ka ng Diyos')",
                    "emoji": "✨"
          }
],
        quizQuestion: "What physical action is performed during the 'Mano Po' custom?",
        quizOptions: [
          "Pressing elder's hand back to one's forehead",
          "Shaking hands twice",
          "Bowing to the knees",
          "Waving from afar"
],
        correctQuizIndex: 0,
        hotspotPrompt: "Identify the core feature of Po, Opo, and Mano Po:",
        memoryPairs: [["Paggalang","Respect"],["Opo","Respectful Yes"],["Mano","Hand Gesture"],["Biyaya","Blessing"]]
      };

    case 16:
      return {
        sortTitle: "Lesson 16: Ang Aking Pamilya Categorization",
        bins: ["Ang Core Concept", "Cultural & Practical Context"],
        items: [
          {
                    "text": "Aking Key Principle",
                    "bin": 0
          },
          {
                    "text": "Practical Application of Aking",
                    "bin": 1
          },
          {
                    "text": "Pamilya Cultural Element",
                    "bin": 0
          },
          {
                    "text": "Community Context of Pamilya",
                    "bin": 1
          },
          {
                    "text": "Tagalog Vocabulary for Filipino",
                    "bin": 0
          },
          {
                    "text": "Family Reflection on Filipino",
                    "bin": 1
          }
],
        matchLeft: ["Aking (Term 1)","Pamilya (Term 2)","Aral (Lesson)","Bayan (Community)"],
        matchRight: ["Core Meaning of Aking","Practice of Pamilya","Instructional Knowledge","Town / People"],
        seqTitle: "Process Sequence: Ang Aking Pamilya",
        seqItems: [
          {
                    "text": "Examine opening visual for Ang Aking Pamilya Filipino Family Ties",
                    "emoji": "🔍"
          },
          {
                    "text": "Understand factual background and Aking context",
                    "emoji": "📖"
          },
          {
                    "text": "Practice Tagalog terms and family activity",
                    "emoji": "🗣️"
          },
          {
                    "text": "Complete reflection and record milestone",
                    "emoji": "⭐"
          }
],
        quizQuestion: "What is the primary educational objective of Lesson 16: Ang Aking Pamilya Filipino Family Ties?",
        quizOptions: [
          "Identify, pronounce, and use core Filipino kinship terms including Nanay, T...",
          "Ignoring historical facts and context",
          "Memorizing unrelated numbers",
          "Skipping the interactive session"
],
        correctQuizIndex: 0,
        hotspotPrompt: "Identify the core feature of Ang Aking Pamilya:",
        memoryPairs: [["Aking","Translation of Aking"],["Pamilya","Meaning of Pamilya"],["Aral","Learning"],["Bayan","Nation/Community"]]
      };

    case 17:
      return {
        sortTitle: "Lesson 17: Mga Bahagi ng Katawan Categorization",
        bins: ["Mga Core Concept", "Cultural & Practical Context"],
        items: [
          {
                    "text": "Bahagi Key Principle",
                    "bin": 0
          },
          {
                    "text": "Practical Application of Bahagi",
                    "bin": 1
          },
          {
                    "text": "Katawan Cultural Element",
                    "bin": 0
          },
          {
                    "text": "Community Context of Katawan",
                    "bin": 1
          },
          {
                    "text": "Tagalog Vocabulary for Parts",
                    "bin": 0
          },
          {
                    "text": "Family Reflection on Parts",
                    "bin": 1
          }
],
        matchLeft: ["Bahagi (Term 1)","Katawan (Term 2)","Aral (Lesson)","Bayan (Community)"],
        matchRight: ["Core Meaning of Bahagi","Practice of Katawan","Instructional Knowledge","Town / People"],
        seqTitle: "Process Sequence: Mga Bahagi ng Katawan",
        seqItems: [
          {
                    "text": "Examine opening visual for Mga Bahagi ng Katawan Parts of the Body and Active Play",
                    "emoji": "🔍"
          },
          {
                    "text": "Understand factual background and Bahagi context",
                    "emoji": "📖"
          },
          {
                    "text": "Practice Tagalog terms and family activity",
                    "emoji": "🗣️"
          },
          {
                    "text": "Complete reflection and record milestone",
                    "emoji": "⭐"
          }
],
        quizQuestion: "What is the primary educational objective of Lesson 17: Mga Bahagi ng Katawan Parts of the Body and Active Play?",
        quizOptions: [
          "Identify, pronounce, and label primary body parts in Tagalog including ulo ...",
          "Ignoring historical facts and context",
          "Memorizing unrelated numbers",
          "Skipping the interactive session"
],
        correctQuizIndex: 0,
        hotspotPrompt: "Identify the core feature of Mga Bahagi ng Katawan:",
        memoryPairs: [["Bahagi","Translation of Bahagi"],["Katawan","Meaning of Katawan"],["Aral","Learning"],["Bayan","Nation/Community"]]
      };

    case 18:
      return {
        sortTitle: "Lesson 18: Kain Tayo! Filipino Food and Mealtime Hospitality Categorization",
        bins: ["Kain Core Concept", "Cultural & Practical Context"],
        items: [
          {
                    "text": "Kain Key Principle",
                    "bin": 0
          },
          {
                    "text": "Practical Application of Kain",
                    "bin": 1
          },
          {
                    "text": "Tayo Cultural Element",
                    "bin": 0
          },
          {
                    "text": "Community Context of Tayo",
                    "bin": 1
          },
          {
                    "text": "Tagalog Vocabulary for Filipino",
                    "bin": 0
          },
          {
                    "text": "Family Reflection on Filipino",
                    "bin": 1
          }
],
        matchLeft: ["Kain (Term 1)","Tayo (Term 2)","Aral (Lesson)","Bayan (Community)"],
        matchRight: ["Core Meaning of Kain","Practice of Tayo","Instructional Knowledge","Town / People"],
        seqTitle: "Process Sequence: Kain Tayo! Filipino Food and Mealtime Hospitality",
        seqItems: [
          {
                    "text": "Examine opening visual for Kain Tayo Filipino Food and Mealtime Hospitality",
                    "emoji": "🔍"
          },
          {
                    "text": "Understand factual background and Kain context",
                    "emoji": "📖"
          },
          {
                    "text": "Practice Tagalog terms and family activity",
                    "emoji": "🗣️"
          },
          {
                    "text": "Complete reflection and record milestone",
                    "emoji": "⭐"
          }
],
        quizQuestion: "What is the primary educational objective of Lesson 18: Kain Tayo Filipino Food and Mealtime Hospitality?",
        quizOptions: [
          "Identify, pronounce, and use essential Filipino food vocabulary including k...",
          "Ignoring historical facts and context",
          "Memorizing unrelated numbers",
          "Skipping the interactive session"
],
        correctQuizIndex: 0,
        hotspotPrompt: "Identify the core feature of Kain Tayo! Filipino Food and Mealtime Hospitality:",
        memoryPairs: [["Kain","Translation of Kain"],["Tayo","Meaning of Tayo"],["Aral","Learning"],["Bayan","Nation/Community"]]
      };

    case 19:
      return {
        sortTitle: "Lesson 19: Masaya Ako Categorization",
        bins: ["Masaya Core Concept", "Cultural & Practical Context"],
        items: [
          {
                    "text": "Masaya Key Principle",
                    "bin": 0
          },
          {
                    "text": "Practical Application of Masaya",
                    "bin": 1
          },
          {
                    "text": "Expressing Cultural Element",
                    "bin": 0
          },
          {
                    "text": "Community Context of Expressing",
                    "bin": 1
          },
          {
                    "text": "Tagalog Vocabulary for Feelings",
                    "bin": 0
          },
          {
                    "text": "Family Reflection on Feelings",
                    "bin": 1
          }
],
        matchLeft: ["Masaya (Term 1)","Expressing (Term 2)","Aral (Lesson)","Bayan (Community)"],
        matchRight: ["Core Meaning of Masaya","Practice of Expressing","Instructional Knowledge","Town / People"],
        seqTitle: "Process Sequence: Masaya Ako",
        seqItems: [
          {
                    "text": "Examine opening visual for Masaya Ako Expressing Feelings and Pakikiramdam",
                    "emoji": "🔍"
          },
          {
                    "text": "Understand factual background and Masaya context",
                    "emoji": "📖"
          },
          {
                    "text": "Practice Tagalog terms and family activity",
                    "emoji": "🗣️"
          },
          {
                    "text": "Complete reflection and record milestone",
                    "emoji": "⭐"
          }
],
        quizQuestion: "What is the primary educational objective of Lesson 19: Masaya Ako Expressing Feelings and Pakikiramdam?",
        quizOptions: [
          "Identify, pronounce, and express core emotion words in Tagalog including ma...",
          "Ignoring historical facts and context",
          "Memorizing unrelated numbers",
          "Skipping the interactive session"
],
        correctQuizIndex: 0,
        hotspotPrompt: "Identify the core feature of Masaya Ako:",
        memoryPairs: [["Masaya","Translation of Masaya"],["Expressing","Meaning of Expressing"],["Aral","Learning"],["Bayan","Nation/Community"]]
      };

    case 20:
      return {
        sortTitle: "Lesson 20: Ang Bahay Kubo Categorization",
        bins: ["Ang Core Concept", "Cultural & Practical Context"],
        items: [
          {
                    "text": "Bahay Key Principle",
                    "bin": 0
          },
          {
                    "text": "Practical Application of Bahay",
                    "bin": 1
          },
          {
                    "text": "Kubo Cultural Element",
                    "bin": 0
          },
          {
                    "text": "Community Context of Kubo",
                    "bin": 1
          },
          {
                    "text": "Tagalog Vocabulary for Traditional",
                    "bin": 0
          },
          {
                    "text": "Family Reflection on Traditional",
                    "bin": 1
          }
],
        matchLeft: ["Bahay (Term 1)","Kubo (Term 2)","Aral (Lesson)","Bayan (Community)"],
        matchRight: ["Core Meaning of Bahay","Practice of Kubo","Instructional Knowledge","Town / People"],
        seqTitle: "Process Sequence: Ang Bahay Kubo",
        seqItems: [
          {
                    "text": "Examine opening visual for Ang Bahay Kubo Traditional and Modern Filipino Homes",
                    "emoji": "🔍"
          },
          {
                    "text": "Understand factual background and Bahay context",
                    "emoji": "📖"
          },
          {
                    "text": "Practice Tagalog terms and family activity",
                    "emoji": "🗣️"
          },
          {
                    "text": "Complete reflection and record milestone",
                    "emoji": "⭐"
          }
],
        quizQuestion: "What is the primary educational objective of Lesson 20: Ang Bahay Kubo Traditional and Modern Filipino Homes?",
        quizOptions: [
          "Identify, pronounce, and use architectural and household vocabulary in Taga...",
          "Ignoring historical facts and context",
          "Memorizing unrelated numbers",
          "Skipping the interactive session"
],
        correctQuizIndex: 0,
        hotspotPrompt: "Identify the core feature of Ang Bahay Kubo:",
        memoryPairs: [["Bahay","Translation of Bahay"],["Kubo","Meaning of Kubo"],["Aral","Learning"],["Bayan","Nation/Community"]]
      };

    case 21:
      return {
        sortTitle: "Lesson 21: Sa Paaralan Categorization",
        bins: ["Sa Core Concept", "Cultural & Practical Context"],
        items: [
          {
                    "text": "Paaralan Key Principle",
                    "bin": 0
          },
          {
                    "text": "Practical Application of Paaralan",
                    "bin": 1
          },
          {
                    "text": "Classroom Cultural Element",
                    "bin": 0
          },
          {
                    "text": "Community Context of Classroom",
                    "bin": 1
          },
          {
                    "text": "Tagalog Vocabulary for Life",
                    "bin": 0
          },
          {
                    "text": "Family Reflection on Life",
                    "bin": 1
          }
],
        matchLeft: ["Paaralan (Term 1)","Classroom (Term 2)","Aral (Lesson)","Bayan (Community)"],
        matchRight: ["Core Meaning of Paaralan","Practice of Classroom","Instructional Knowledge","Town / People"],
        seqTitle: "Process Sequence: Sa Paaralan",
        seqItems: [
          {
                    "text": "Examine opening visual for Sa Paaralan Classroom Life and the Filipino School Day",
                    "emoji": "🔍"
          },
          {
                    "text": "Understand factual background and Paaralan context",
                    "emoji": "📖"
          },
          {
                    "text": "Practice Tagalog terms and family activity",
                    "emoji": "🗣️"
          },
          {
                    "text": "Complete reflection and record milestone",
                    "emoji": "⭐"
          }
],
        quizQuestion: "What is the primary educational objective of Lesson 21: Sa Paaralan Classroom Life and the Filipino School Day?",
        quizOptions: [
          "Identify, pronounce, and use school and classroom vocabulary in Tagalog inc...",
          "Ignoring historical facts and context",
          "Memorizing unrelated numbers",
          "Skipping the interactive session"
],
        correctQuizIndex: 0,
        hotspotPrompt: "Identify the core feature of Sa Paaralan:",
        memoryPairs: [["Paaralan","Translation of Paaralan"],["Classroom","Meaning of Classroom"],["Aral","Learning"],["Bayan","Nation/Community"]]
      };

    case 22:
      return {
        sortTitle: "Lesson 22: Sa Palengke Categorization",
        bins: ["Sa Core Concept", "Cultural & Practical Context"],
        items: [
          {
                    "text": "Palengke Key Principle",
                    "bin": 0
          },
          {
                    "text": "Practical Application of Palengke",
                    "bin": 1
          },
          {
                    "text": "Community Cultural Element",
                    "bin": 0
          },
          {
                    "text": "Community Context of Community",
                    "bin": 1
          },
          {
                    "text": "Tagalog Vocabulary for Commerce",
                    "bin": 0
          },
          {
                    "text": "Family Reflection on Commerce",
                    "bin": 1
          }
],
        matchLeft: ["Palengke (Term 1)","Community (Term 2)","Aral (Lesson)","Bayan (Community)"],
        matchRight: ["Core Meaning of Palengke","Practice of Community","Instructional Knowledge","Town / People"],
        seqTitle: "Process Sequence: Sa Palengke",
        seqItems: [
          {
                    "text": "Examine opening visual for Sa Palengke Community Commerce and Daily Markets",
                    "emoji": "🔍"
          },
          {
                    "text": "Understand factual background and Palengke context",
                    "emoji": "📖"
          },
          {
                    "text": "Practice Tagalog terms and family activity",
                    "emoji": "🗣️"
          },
          {
                    "text": "Complete reflection and record milestone",
                    "emoji": "⭐"
          }
],
        quizQuestion: "What is the primary educational objective of Lesson 22: Sa Palengke Community Commerce and Daily Markets?",
        quizOptions: [
          "Identify, pronounce, and use marketplace and commercial vocabulary in Tagal...",
          "Ignoring historical facts and context",
          "Memorizing unrelated numbers",
          "Skipping the interactive session"
],
        correctQuizIndex: 0,
        hotspotPrompt: "Identify the core feature of Sa Palengke:",
        memoryPairs: [["Palengke","Translation of Palengke"],["Community","Meaning of Community"],["Aral","Learning"],["Bayan","Nation/Community"]]
      };

    case 23:
      return {
        sortTitle: "Lesson 23: Sakay Na! Jeepneys, Tricycles, and Island Transport Categorization",
        bins: ["Sakay Core Concept", "Cultural & Practical Context"],
        items: [
          {
                    "text": "Sakay Key Principle",
                    "bin": 0
          },
          {
                    "text": "Practical Application of Sakay",
                    "bin": 1
          },
          {
                    "text": "Jeepneys Cultural Element",
                    "bin": 0
          },
          {
                    "text": "Community Context of Jeepneys",
                    "bin": 1
          },
          {
                    "text": "Tagalog Vocabulary for Tricycles",
                    "bin": 0
          },
          {
                    "text": "Family Reflection on Tricycles",
                    "bin": 1
          }
],
        matchLeft: ["Sakay (Term 1)","Jeepneys (Term 2)","Aral (Lesson)","Bayan (Community)"],
        matchRight: ["Core Meaning of Sakay","Practice of Jeepneys","Instructional Knowledge","Town / People"],
        seqTitle: "Process Sequence: Sakay Na! Jeepneys, Tricycles, and Island Transport",
        seqItems: [
          {
                    "text": "Examine opening visual for Sakay Na Jeepneys Tricycles and Island Transport",
                    "emoji": "🔍"
          },
          {
                    "text": "Understand factual background and Sakay context",
                    "emoji": "📖"
          },
          {
                    "text": "Practice Tagalog terms and family activity",
                    "emoji": "🗣️"
          },
          {
                    "text": "Complete reflection and record milestone",
                    "emoji": "⭐"
          }
],
        quizQuestion: "What is the primary educational objective of Lesson 23: Sakay Na Jeepneys Tricycles and Island Transport?",
        quizOptions: [
          "Identify, pronounce, and use Philippine transportation vocabulary in Tagalo...",
          "Ignoring historical facts and context",
          "Memorizing unrelated numbers",
          "Skipping the interactive session"
],
        correctQuizIndex: 0,
        hotspotPrompt: "Identify the core feature of Sakay Na! Jeepneys, Tricycles, and Island Transport:",
        memoryPairs: [["Sakay","Translation of Sakay"],["Jeepneys","Meaning of Jeepneys"],["Aral","Learning"],["Bayan","Nation/Community"]]
      };

    case 24:
      return {
        sortTitle: "Lesson 24: Ang Kalabaw Categorization",
        bins: ["Ang Core Concept", "Cultural & Practical Context"],
        items: [
          {
                    "text": "Kalabaw Key Principle",
                    "bin": 0
          },
          {
                    "text": "Practical Application of Kalabaw",
                    "bin": 1
          },
          {
                    "text": "Agriculture Cultural Element",
                    "bin": 0
          },
          {
                    "text": "Community Context of Agriculture",
                    "bin": 1
          },
          {
                    "text": "Tagalog Vocabulary for Rural",
                    "bin": 0
          },
          {
                    "text": "Family Reflection on Rural",
                    "bin": 1
          }
],
        matchLeft: ["Kalabaw (Term 1)","Agriculture (Term 2)","Aral (Lesson)","Bayan (Community)"],
        matchRight: ["Core Meaning of Kalabaw","Practice of Agriculture","Instructional Knowledge","Town / People"],
        seqTitle: "Process Sequence: Ang Kalabaw",
        seqItems: [
          {
                    "text": "Examine opening visual for Ang Kalabaw Agriculture and Rural Farm Life",
                    "emoji": "🔍"
          },
          {
                    "text": "Understand factual background and Kalabaw context",
                    "emoji": "📖"
          },
          {
                    "text": "Practice Tagalog terms and family activity",
                    "emoji": "🗣️"
          },
          {
                    "text": "Complete reflection and record milestone",
                    "emoji": "⭐"
          }
],
        quizQuestion: "What is the primary educational objective of Lesson 24: Ang Kalabaw Agriculture and Rural Farm Life?",
        quizOptions: [
          "Identify, pronounce, and use agricultural and rural vocabulary in Tagalog i...",
          "Ignoring historical facts and context",
          "Memorizing unrelated numbers",
          "Skipping the interactive session"
],
        correctQuizIndex: 0,
        hotspotPrompt: "Identify the core feature of Ang Kalabaw:",
        memoryPairs: [["Kalabaw","Translation of Kalabaw"],["Agriculture","Meaning of Agriculture"],["Aral","Learning"],["Bayan","Nation/Community"]]
      };

    case 25:
      return {
        sortTitle: "Lesson 25: Mga Katulong sa Pamayanan Categorization",
        bins: ["Mga Core Concept", "Cultural & Practical Context"],
        items: [
          {
                    "text": "Katulong Key Principle",
                    "bin": 0
          },
          {
                    "text": "Practical Application of Katulong",
                    "bin": 1
          },
          {
                    "text": "Pamayanan Cultural Element",
                    "bin": 0
          },
          {
                    "text": "Community Context of Pamayanan",
                    "bin": 1
          },
          {
                    "text": "Tagalog Vocabulary for Community",
                    "bin": 0
          },
          {
                    "text": "Family Reflection on Community",
                    "bin": 1
          }
],
        matchLeft: ["Katulong (Term 1)","Pamayanan (Term 2)","Aral (Lesson)","Bayan (Community)"],
        matchRight: ["Core Meaning of Katulong","Practice of Pamayanan","Instructional Knowledge","Town / People"],
        seqTitle: "Process Sequence: Mga Katulong sa Pamayanan",
        seqItems: [
          {
                    "text": "Examine opening visual for Mga Katulong sa Pamayanan Community Helpers and Bayanihan",
                    "emoji": "🔍"
          },
          {
                    "text": "Understand factual background and Katulong context",
                    "emoji": "📖"
          },
          {
                    "text": "Practice Tagalog terms and family activity",
                    "emoji": "🗣️"
          },
          {
                    "text": "Complete reflection and record milestone",
                    "emoji": "⭐"
          }
],
        quizQuestion: "What is the primary educational objective of Lesson 25: Mga Katulong sa Pamayanan Community Helpers and Bayanihan?",
        quizOptions: [
          "Identify, pronounce, and describe community helper professions in Tagalog i...",
          "Ignoring historical facts and context",
          "Memorizing unrelated numbers",
          "Skipping the interactive session"
],
        correctQuizIndex: 0,
        hotspotPrompt: "Identify the core feature of Mga Katulong sa Pamayanan:",
        memoryPairs: [["Katulong","Translation of Katulong"],["Pamayanan","Meaning of Pamayanan"],["Aral","Learning"],["Bayan","Nation/Community"]]
      };

    case 26:
      return {
        sortTitle: "Lesson 26: The Great September Showcase Categorization",
        bins: ["The Core Concept", "Cultural & Practical Context"],
        items: [
          {
                    "text": "Great Key Principle",
                    "bin": 0
          },
          {
                    "text": "Practical Application of Great",
                    "bin": 1
          },
          {
                    "text": "September Cultural Element",
                    "bin": 0
          },
          {
                    "text": "Community Context of September",
                    "bin": 1
          },
          {
                    "text": "Tagalog Vocabulary for Showcase",
                    "bin": 0
          },
          {
                    "text": "Family Reflection on Showcase",
                    "bin": 1
          }
],
        matchLeft: ["Great (Term 1)","September (Term 2)","Aral (Lesson)","Bayan (Community)"],
        matchRight: ["Core Meaning of Great","Practice of September","Instructional Knowledge","Town / People"],
        seqTitle: "Process Sequence: The Great September Showcase",
        seqItems: [
          {
                    "text": "Examine opening visual for The Great September Showcase Language and Daily Life Celebration",
                    "emoji": "🔍"
          },
          {
                    "text": "Understand factual background and Great context",
                    "emoji": "📖"
          },
          {
                    "text": "Practice Tagalog terms and family activity",
                    "emoji": "🗣️"
          },
          {
                    "text": "Complete reflection and record milestone",
                    "emoji": "⭐"
          }
],
        quizQuestion: "What is the primary educational objective of Lesson 26: The Great September Showcase Language and Daily Life Celebration?",
        quizOptions: [
          "Synthesize and apply core September Tagalog vocabulary across language, fam...",
          "Ignoring historical facts and context",
          "Memorizing unrelated numbers",
          "Skipping the interactive session"
],
        correctQuizIndex: 0,
        hotspotPrompt: "Identify the core feature of The Great September Showcase:",
        memoryPairs: [["Great","Translation of Great"],["September","Meaning of September"],["Aral","Learning"],["Bayan","Nation/Community"]]
      };

    case 27:
      return {
        sortTitle: "Lesson 27: Bayanihan Spirit Categorization",
        bins: ["Pre-Colonial Artefact / Leader", "Historical Significance"],
        items: [
          {
                    "text": "Laguna Copperplate Inscription",
                    "bin": 0
          },
          {
                    "text": "Dated 900 AD legal document",
                    "bin": 1
          },
          {
                    "text": "Datu",
                    "bin": 0
          },
          {
                    "text": "Barangay community leader",
                    "bin": 1
          },
          {
                    "text": "Baybayin",
                    "bin": 0
          },
          {
                    "text": "Ancient syllabic script",
                    "bin": 1
          }
],
        matchLeft: ["Barangay","Datu","Baybayin","LCI (900 AD)"],
        matchRight: ["Pre-colonial community","Community chieftain","Ancient writing system","Copperplate document"],
        seqTitle: "Process Sequence: Bayanihan Spirit",
        seqItems: [
          {
                    "text": "Scribe incises Kawi script onto copper plate",
                    "emoji": "📜"
          },
          {
                    "text": "Document is witnessed by Tondo and Pila leaders",
                    "emoji": "⚖️"
          },
          {
                    "text": "Debt clearance record preserved in river sand",
                    "emoji": "🏺"
          },
          {
                    "text": "Recovered in 1989 and verified by National Museum",
                    "emoji": "🏛️"
          }
],
        quizQuestion: "What is the date inscribed on the Laguna Copperplate Inscription?",
        quizOptions: [
          "900 AD",
          "1521 AD",
          "1898 AD",
          "1200 BC"
],
        correctQuizIndex: 0,
        hotspotPrompt: "Identify the core feature of Bayanihan Spirit:",
        memoryPairs: [["Datu","Chieftain"],["Baybayin","Script"],["Barangay","Village"],["Ginto","Gold"]]
      };

    case 28:
      return {
        sortTitle: "Lesson 28: José Rizal Categorization",
        bins: ["Jos Core Concept", "Cultural & Practical Context"],
        items: [
          {
                    "text": "Rizal Key Principle",
                    "bin": 0
          },
          {
                    "text": "Practical Application of Rizal",
                    "bin": 1
          },
          {
                    "text": "Writer Cultural Element",
                    "bin": 0
          },
          {
                    "text": "Community Context of Writer",
                    "bin": 1
          },
          {
                    "text": "Tagalog Vocabulary for Doctor",
                    "bin": 0
          },
          {
                    "text": "Family Reflection on Doctor",
                    "bin": 1
          }
],
        matchLeft: ["Rizal (Term 1)","Writer (Term 2)","Aral (Lesson)","Bayan (Community)"],
        matchRight: ["Core Meaning of Rizal","Practice of Writer","Instructional Knowledge","Town / People"],
        seqTitle: "Process Sequence: José Rizal",
        seqItems: [
          {
                    "text": "Examine opening visual for Jos Rizal Writer Doctor and National Hero",
                    "emoji": "🔍"
          },
          {
                    "text": "Understand factual background and Rizal context",
                    "emoji": "📖"
          },
          {
                    "text": "Practice Tagalog terms and family activity",
                    "emoji": "🗣️"
          },
          {
                    "text": "Complete reflection and record milestone",
                    "emoji": "⭐"
          }
],
        quizQuestion: "What is the primary educational objective of Lesson 28: Jos Rizal Writer Doctor and National Hero?",
        quizOptions: [
          "Identify Dr. José Protacio Rizal Mercado y Alonso Realonda (1861–1896) as t...",
          "Ignoring historical facts and context",
          "Memorizing unrelated numbers",
          "Skipping the interactive session"
],
        correctQuizIndex: 0,
        hotspotPrompt: "Identify the core feature of José Rizal:",
        memoryPairs: [["Rizal","Translation of Rizal"],["Writer","Meaning of Writer"],["Aral","Learning"],["Bayan","Nation/Community"]]
      };

    case 29:
      return {
        sortTitle: "Lesson 29: Andrés Bonifacio and the Katipunan Categorization",
        bins: ["Andrs Core Concept", "Cultural & Practical Context"],
        items: [
          {
                    "text": "Andrs Key Principle",
                    "bin": 0
          },
          {
                    "text": "Practical Application of Andrs",
                    "bin": 1
          },
          {
                    "text": "Bonifacio Cultural Element",
                    "bin": 0
          },
          {
                    "text": "Community Context of Bonifacio",
                    "bin": 1
          },
          {
                    "text": "Tagalog Vocabulary for Katipunan",
                    "bin": 0
          },
          {
                    "text": "Family Reflection on Katipunan",
                    "bin": 1
          }
],
        matchLeft: ["Andrs (Term 1)","Bonifacio (Term 2)","Aral (Lesson)","Bayan (Community)"],
        matchRight: ["Core Meaning of Andrs","Practice of Bonifacio","Instructional Knowledge","Town / People"],
        seqTitle: "Process Sequence: Andrés Bonifacio and the Katipunan",
        seqItems: [
          {
                    "text": "Examine opening visual for Andrs Bonifacio and the Katipunan",
                    "emoji": "🔍"
          },
          {
                    "text": "Understand factual background and Andrs context",
                    "emoji": "📖"
          },
          {
                    "text": "Practice Tagalog terms and family activity",
                    "emoji": "🗣️"
          },
          {
                    "text": "Complete reflection and record milestone",
                    "emoji": "⭐"
          }
],
        quizQuestion: "What is the primary educational objective of Lesson 29: Andrs Bonifacio and the Katipunan?",
        quizOptions: [
          "Identify Andrés Bonifacio (1863–1897) as the 'Supremo' and founder of the K...",
          "Ignoring historical facts and context",
          "Memorizing unrelated numbers",
          "Skipping the interactive session"
],
        correctQuizIndex: 0,
        hotspotPrompt: "Identify the core feature of Andrés Bonifacio and the Katipunan:",
        memoryPairs: [["Andrs","Translation of Andrs"],["Bonifacio","Meaning of Bonifacio"],["Aral","Learning"],["Bayan","Nation/Community"]]
      };

    case 30:
      return {
        sortTitle: "Lesson 30: Indigenous Peoples and Living Cultures of the Philippines Categorization",
        bins: ["Indigenous Core Concept", "Cultural & Practical Context"],
        items: [
          {
                    "text": "Indigenous Key Principle",
                    "bin": 0
          },
          {
                    "text": "Practical Application of Indigenous",
                    "bin": 1
          },
          {
                    "text": "Peoples Cultural Element",
                    "bin": 0
          },
          {
                    "text": "Community Context of Peoples",
                    "bin": 1
          },
          {
                    "text": "Tagalog Vocabulary for Living",
                    "bin": 0
          },
          {
                    "text": "Family Reflection on Living",
                    "bin": 1
          }
],
        matchLeft: ["Indigenous (Term 1)","Peoples (Term 2)","Aral (Lesson)","Bayan (Community)"],
        matchRight: ["Core Meaning of Indigenous","Practice of Peoples","Instructional Knowledge","Town / People"],
        seqTitle: "Process Sequence: Indigenous Peoples and Living Cultures of the Philippines",
        seqItems: [
          {
                    "text": "Examine opening visual for Indigenous Peoples and Living Cultures of the Philippines",
                    "emoji": "🔍"
          },
          {
                    "text": "Understand factual background and Indigenous context",
                    "emoji": "📖"
          },
          {
                    "text": "Practice Tagalog terms and family activity",
                    "emoji": "🗣️"
          },
          {
                    "text": "Complete reflection and record milestone",
                    "emoji": "⭐"
          }
],
        quizQuestion: "What is the primary educational objective of Lesson 30: Indigenous Peoples and Living Cultures of the Philippines?",
        quizOptions: [
          "Recognize that the Philippines is home to over 110 distinct ethnolinguistic...",
          "Ignoring historical facts and context",
          "Memorizing unrelated numbers",
          "Skipping the interactive session"
],
        correctQuizIndex: 0,
        hotspotPrompt: "Identify the core feature of Indigenous Peoples and Living Cultures of the Philippines:",
        memoryPairs: [["Indigenous","Translation of Indigenous"],["Peoples","Meaning of Peoples"],["Aral","Learning"],["Bayan","Nation/Community"]]
      };

    case 31:
      return {
        sortTitle: "Lesson 31: A Child-Friendly Philippine History Timeline Categorization",
        bins: ["A Core Concept", "Cultural & Practical Context"],
        items: [
          {
                    "text": "Child-Friendly Key Principle",
                    "bin": 0
          },
          {
                    "text": "Practical Application of Child-Friendly",
                    "bin": 1
          },
          {
                    "text": "Philippine Cultural Element",
                    "bin": 0
          },
          {
                    "text": "Community Context of Philippine",
                    "bin": 1
          },
          {
                    "text": "Tagalog Vocabulary for History",
                    "bin": 0
          },
          {
                    "text": "Family Reflection on History",
                    "bin": 1
          }
],
        matchLeft: ["Child-Friendly (Term 1)","Philippine (Term 2)","Aral (Lesson)","Bayan (Community)"],
        matchRight: ["Core Meaning of Child-Friendly","Practice of Philippine","Instructional Knowledge","Town / People"],
        seqTitle: "Process Sequence: A Child-Friendly Philippine History Timeline",
        seqItems: [
          {
                    "text": "Examine opening visual for A Child-Friendly Philippine History Timeline",
                    "emoji": "🔍"
          },
          {
                    "text": "Understand factual background and Child-Friendly context",
                    "emoji": "📖"
          },
          {
                    "text": "Practice Tagalog terms and family activity",
                    "emoji": "🗣️"
          },
          {
                    "text": "Complete reflection and record milestone",
                    "emoji": "⭐"
          }
],
        quizQuestion: "What is the primary educational objective of Lesson 31: A Child-Friendly Philippine History Timeline?",
        quizOptions: [
          "Chronologically order the five major eras of Philippine history: Pre-Coloni...",
          "Ignoring historical facts and context",
          "Memorizing unrelated numbers",
          "Skipping the interactive session"
],
        correctQuizIndex: 0,
        hotspotPrompt: "Identify the core feature of A Child-Friendly Philippine History Timeline:",
        memoryPairs: [["Child-Friendly","Translation of Child-Friendly"],["Philippine","Meaning of Philippine"],["Aral","Learning"],["Bayan","Nation/Community"]]
      };

    case 32:
      return {
        sortTitle: "Lesson 32: Mayon Volcano Categorization",
        bins: ["Mayon Core Concept", "Cultural & Practical Context"],
        items: [
          {
                    "text": "Mayon Key Principle",
                    "bin": 0
          },
          {
                    "text": "Practical Application of Mayon",
                    "bin": 1
          },
          {
                    "text": "Volcano Cultural Element",
                    "bin": 0
          },
          {
                    "text": "Community Context of Volcano",
                    "bin": 1
          },
          {
                    "text": "Tagalog Vocabulary for Worlds",
                    "bin": 0
          },
          {
                    "text": "Family Reflection on Worlds",
                    "bin": 1
          }
],
        matchLeft: ["Mayon (Term 1)","Volcano (Term 2)","Aral (Lesson)","Bayan (Community)"],
        matchRight: ["Core Meaning of Mayon","Practice of Volcano","Instructional Knowledge","Town / People"],
        seqTitle: "Process Sequence: Mayon Volcano",
        seqItems: [
          {
                    "text": "Examine opening visual for Mayon Volcano The Worlds Most Perfect Cone",
                    "emoji": "🔍"
          },
          {
                    "text": "Understand factual background and Mayon context",
                    "emoji": "📖"
          },
          {
                    "text": "Practice Tagalog terms and family activity",
                    "emoji": "🗣️"
          },
          {
                    "text": "Complete reflection and record milestone",
                    "emoji": "⭐"
          }
],
        quizQuestion: "What is the primary educational objective of Lesson 32: Mayon Volcano The Worlds Most Perfect Cone?",
        quizOptions: [
          "Identify Mayon Volcano (Bulkang Mayon) in Albay, Bicol, as an active strato...",
          "Ignoring historical facts and context",
          "Memorizing unrelated numbers",
          "Skipping the interactive session"
],
        correctQuizIndex: 0,
        hotspotPrompt: "Identify the core feature of Mayon Volcano:",
        memoryPairs: [["Mayon","Translation of Mayon"],["Volcano","Meaning of Volcano"],["Aral","Learning"],["Bayan","Nation/Community"]]
      };

    case 33:
      return {
        sortTitle: "Lesson 33: Tropical Weather, Monsoons, and Typhoons Categorization",
        bins: ["Tropical Core Concept", "Cultural & Practical Context"],
        items: [
          {
                    "text": "Tropical Key Principle",
                    "bin": 0
          },
          {
                    "text": "Practical Application of Tropical",
                    "bin": 1
          },
          {
                    "text": "Weather Cultural Element",
                    "bin": 0
          },
          {
                    "text": "Community Context of Weather",
                    "bin": 1
          },
          {
                    "text": "Tagalog Vocabulary for Monsoons",
                    "bin": 0
          },
          {
                    "text": "Family Reflection on Monsoons",
                    "bin": 1
          }
],
        matchLeft: ["Tropical (Term 1)","Weather (Term 2)","Aral (Lesson)","Bayan (Community)"],
        matchRight: ["Core Meaning of Tropical","Practice of Weather","Instructional Knowledge","Town / People"],
        seqTitle: "Process Sequence: Tropical Weather, Monsoons, and Typhoons",
        seqItems: [
          {
                    "text": "Examine opening visual for Tropical Weather Monsoons and Typhoons",
                    "emoji": "🔍"
          },
          {
                    "text": "Understand factual background and Tropical context",
                    "emoji": "📖"
          },
          {
                    "text": "Practice Tagalog terms and family activity",
                    "emoji": "🗣️"
          },
          {
                    "text": "Complete reflection and record milestone",
                    "emoji": "⭐"
          }
],
        quizQuestion: "What is the primary educational objective of Lesson 33: Tropical Weather Monsoons and Typhoons?",
        quizOptions: [
          "Differentiate the two primary seasonal monsoons in the Philippines: the Sou...",
          "Ignoring historical facts and context",
          "Memorizing unrelated numbers",
          "Skipping the interactive session"
],
        correctQuizIndex: 0,
        hotspotPrompt: "Identify the core feature of Tropical Weather, Monsoons, and Typhoons:",
        memoryPairs: [["Tropical","Translation of Tropical"],["Weather","Meaning of Weather"],["Aral","Learning"],["Bayan","Nation/Community"]]
      };

    case 34:
      return {
        sortTitle: "Lesson 34: Philippine Rainforests Categorization",
        bins: ["Philippine Core Concept", "Cultural & Practical Context"],
        items: [
          {
                    "text": "Philippine Key Principle",
                    "bin": 0
          },
          {
                    "text": "Practical Application of Philippine",
                    "bin": 1
          },
          {
                    "text": "Rainforests Cultural Element",
                    "bin": 0
          },
          {
                    "text": "Community Context of Rainforests",
                    "bin": 1
          },
          {
                    "text": "Tagalog Vocabulary for Layers",
                    "bin": 0
          },
          {
                    "text": "Family Reflection on Layers",
                    "bin": 1
          }
],
        matchLeft: ["Philippine (Term 1)","Rainforests (Term 2)","Aral (Lesson)","Bayan (Community)"],
        matchRight: ["Core Meaning of Philippine","Practice of Rainforests","Instructional Knowledge","Town / People"],
        seqTitle: "Process Sequence: Philippine Rainforests",
        seqItems: [
          {
                    "text": "Examine opening visual for Philippine Rainforests Layers of Life and Biodiversity",
                    "emoji": "🔍"
          },
          {
                    "text": "Understand factual background and Philippine context",
                    "emoji": "📖"
          },
          {
                    "text": "Practice Tagalog terms and family activity",
                    "emoji": "🗣️"
          },
          {
                    "text": "Complete reflection and record milestone",
                    "emoji": "⭐"
          }
],
        quizQuestion: "What is the primary educational objective of Lesson 34: Philippine Rainforests Layers of Life and Biodiversity?",
        quizOptions: [
          "Identify the four ecological vertical layers of a tropical rainforest: Fore...",
          "Ignoring historical facts and context",
          "Memorizing unrelated numbers",
          "Skipping the interactive session"
],
        correctQuizIndex: 0,
        hotspotPrompt: "Identify the core feature of Philippine Rainforests:",
        memoryPairs: [["Philippine","Translation of Philippine"],["Rainforests","Meaning of Rainforests"],["Aral","Learning"],["Bayan","Nation/Community"]]
      };

    case 35:
      return {
        sortTitle: "Lesson 35: Coral Reefs Categorization",
        bins: ["Coral Core Concept", "Cultural & Practical Context"],
        items: [
          {
                    "text": "Coral Key Principle",
                    "bin": 0
          },
          {
                    "text": "Practical Application of Coral",
                    "bin": 1
          },
          {
                    "text": "Reefs Cultural Element",
                    "bin": 0
          },
          {
                    "text": "Community Context of Reefs",
                    "bin": 1
          },
          {
                    "text": "Tagalog Vocabulary for Underwater",
                    "bin": 0
          },
          {
                    "text": "Family Reflection on Underwater",
                    "bin": 1
          }
],
        matchLeft: ["Coral (Term 1)","Reefs (Term 2)","Aral (Lesson)","Bayan (Community)"],
        matchRight: ["Core Meaning of Coral","Practice of Reefs","Instructional Knowledge","Town / People"],
        seqTitle: "Process Sequence: Coral Reefs",
        seqItems: [
          {
                    "text": "Examine opening visual for Coral Reefs The Underwater Rainforests of the Coral Triangle",
                    "emoji": "🔍"
          },
          {
                    "text": "Understand factual background and Coral context",
                    "emoji": "📖"
          },
          {
                    "text": "Practice Tagalog terms and family activity",
                    "emoji": "🗣️"
          },
          {
                    "text": "Complete reflection and record milestone",
                    "emoji": "⭐"
          }
],
        quizQuestion: "What is the primary educational objective of Lesson 35: Coral Reefs The Underwater Rainforests of the Coral Triangle?",
        quizOptions: [
          "Identify the Philippines as the global apex and epicenter of marine shorefi...",
          "Ignoring historical facts and context",
          "Memorizing unrelated numbers",
          "Skipping the interactive session"
],
        correctQuizIndex: 0,
        hotspotPrompt: "Identify the core feature of Coral Reefs:",
        memoryPairs: [["Coral","Translation of Coral"],["Reefs","Meaning of Reefs"],["Aral","Learning"],["Bayan","Nation/Community"]]
      };

    case 36:
      return {
        sortTitle: "Lesson 36: The Philippine Eagle Categorization",
        bins: ["The Core Concept", "Cultural & Practical Context"],
        items: [
          {
                    "text": "Philippine Key Principle",
                    "bin": 0
          },
          {
                    "text": "Practical Application of Philippine",
                    "bin": 1
          },
          {
                    "text": "Eagle Cultural Element",
                    "bin": 0
          },
          {
                    "text": "Community Context of Eagle",
                    "bin": 1
          },
          {
                    "text": "Tagalog Vocabulary for Mighty",
                    "bin": 0
          },
          {
                    "text": "Family Reflection on Mighty",
                    "bin": 1
          }
],
        matchLeft: ["Philippine (Term 1)","Eagle (Term 2)","Aral (Lesson)","Bayan (Community)"],
        matchRight: ["Core Meaning of Philippine","Practice of Eagle","Instructional Knowledge","Town / People"],
        seqTitle: "Process Sequence: The Philippine Eagle",
        seqItems: [
          {
                    "text": "Examine opening visual for The Philippine Eagle The Mighty King of Birds Agila",
                    "emoji": "🔍"
          },
          {
                    "text": "Understand factual background and Philippine context",
                    "emoji": "📖"
          },
          {
                    "text": "Practice Tagalog terms and family activity",
                    "emoji": "🗣️"
          },
          {
                    "text": "Complete reflection and record milestone",
                    "emoji": "⭐"
          }
],
        quizQuestion: "What is the primary educational objective of Lesson 36: The Philippine Eagle The Mighty King of Birds Agila?",
        quizOptions: [
          "Identify the Philippine Eagle (Pithecophaga jefferyi / Agila ng Pilipinas) ...",
          "Ignoring historical facts and context",
          "Memorizing unrelated numbers",
          "Skipping the interactive session"
],
        correctQuizIndex: 0,
        hotspotPrompt: "Identify the core feature of The Philippine Eagle:",
        memoryPairs: [["Philippine","Translation of Philippine"],["Eagle","Meaning of Eagle"],["Aral","Learning"],["Bayan","Nation/Community"]]
      };

    case 37:
      return {
        sortTitle: "Lesson 37: Caring for God's Creation Categorization",
        bins: ["Caring Core Concept", "Cultural & Practical Context"],
        items: [
          {
                    "text": "Caring Key Principle",
                    "bin": 0
          },
          {
                    "text": "Practical Application of Caring",
                    "bin": 1
          },
          {
                    "text": "Gods Cultural Element",
                    "bin": 0
          },
          {
                    "text": "Community Context of Gods",
                    "bin": 1
          },
          {
                    "text": "Tagalog Vocabulary for Creation",
                    "bin": 0
          },
          {
                    "text": "Family Reflection on Creation",
                    "bin": 1
          }
],
        matchLeft: ["Caring (Term 1)","Gods (Term 2)","Aral (Lesson)","Bayan (Community)"],
        matchRight: ["Core Meaning of Caring","Practice of Gods","Instructional Knowledge","Town / People"],
        seqTitle: "Process Sequence: Caring for God's Creation",
        seqItems: [
          {
                    "text": "Examine opening visual for Caring for Gods Creation Environmental Stewardship",
                    "emoji": "🔍"
          },
          {
                    "text": "Understand factual background and Caring context",
                    "emoji": "📖"
          },
          {
                    "text": "Practice Tagalog terms and family activity",
                    "emoji": "🗣️"
          },
          {
                    "text": "Complete reflection and record milestone",
                    "emoji": "⭐"
          }
],
        quizQuestion: "What is the primary educational objective of Lesson 37: Caring for Gods Creation Environmental Stewardship?",
        quizOptions: [
          "Explain the biblical and civic principle of environmental stewardship ('Pan...",
          "Ignoring historical facts and context",
          "Memorizing unrelated numbers",
          "Skipping the interactive session"
],
        correctQuizIndex: 0,
        hotspotPrompt: "Identify the core feature of Caring for God's Creation:",
        memoryPairs: [["Caring","Translation of Caring"],["Gods","Meaning of Gods"],["Aral","Learning"],["Bayan","Nation/Community"]]
      };

    case 38:
      return {
        sortTitle: "Lesson 38: The Great October Quest Categorization",
        bins: ["The Core Concept", "Cultural & Practical Context"],
        items: [
          {
                    "text": "Great Key Principle",
                    "bin": 0
          },
          {
                    "text": "Practical Application of Great",
                    "bin": 1
          },
          {
                    "text": "October Cultural Element",
                    "bin": 0
          },
          {
                    "text": "Community Context of October",
                    "bin": 1
          },
          {
                    "text": "Tagalog Vocabulary for Quest",
                    "bin": 0
          },
          {
                    "text": "Family Reflection on Quest",
                    "bin": 1
          }
],
        matchLeft: ["Great (Term 1)","October (Term 2)","Aral (Lesson)","Bayan (Community)"],
        matchRight: ["Core Meaning of Great","Practice of October","Instructional Knowledge","Town / People"],
        seqTitle: "Process Sequence: The Great October Quest",
        seqItems: [
          {
                    "text": "Examine opening visual for The Great October Quest History Heroes and Nature Synthesis",
                    "emoji": "🔍"
          },
          {
                    "text": "Understand factual background and Great context",
                    "emoji": "📖"
          },
          {
                    "text": "Practice Tagalog terms and family activity",
                    "emoji": "🗣️"
          },
          {
                    "text": "Complete reflection and record milestone",
                    "emoji": "⭐"
          }
],
        quizQuestion: "What is the primary educational objective of Lesson 38: The Great October Quest History Heroes and Nature Synthesis?",
        quizOptions: [
          "Synthesize comprehensive learning across the October unit: Bayanihan cooper...",
          "Ignoring historical facts and context",
          "Memorizing unrelated numbers",
          "Skipping the interactive session"
],
        correctQuizIndex: 0,
        hotspotPrompt: "Identify the core feature of The Great October Quest:",
        memoryPairs: [["Great","Translation of Great"],["October","Meaning of October"],["Aral","Learning"],["Bayan","Nation/Community"]]
      };

    case 39:
      return {
        sortTitle: "Lesson 39: The Grand October Showcase Categorization",
        bins: ["The Core Concept", "Cultural & Practical Context"],
        items: [
          {
                    "text": "Grand Key Principle",
                    "bin": 0
          },
          {
                    "text": "Practical Application of Grand",
                    "bin": 1
          },
          {
                    "text": "October Cultural Element",
                    "bin": 0
          },
          {
                    "text": "Community Context of October",
                    "bin": 1
          },
          {
                    "text": "Tagalog Vocabulary for Showcase",
                    "bin": 0
          },
          {
                    "text": "Family Reflection on Showcase",
                    "bin": 1
          }
],
        matchLeft: ["Grand (Term 1)","October (Term 2)","Aral (Lesson)","Bayan (Community)"],
        matchRight: ["Core Meaning of Grand","Practice of October","Instructional Knowledge","Town / People"],
        seqTitle: "Process Sequence: The Grand October Showcase",
        seqItems: [
          {
                    "text": "Examine opening visual for The Grand October Showcase Celebrating Heroes and Heritage",
                    "emoji": "🔍"
          },
          {
                    "text": "Understand factual background and Grand context",
                    "emoji": "📖"
          },
          {
                    "text": "Practice Tagalog terms and family activity",
                    "emoji": "🗣️"
          },
          {
                    "text": "Complete reflection and record milestone",
                    "emoji": "⭐"
          }
],
        quizQuestion: "What is the primary educational objective of Lesson 39: The Grand October Showcase Celebrating Heroes and Heritage?",
        quizOptions: [
          "Present a comprehensive personal learning portfolio exhibition synthesizing...",
          "Ignoring historical facts and context",
          "Memorizing unrelated numbers",
          "Skipping the interactive session"
],
        correctQuizIndex: 0,
        hotspotPrompt: "Identify the core feature of The Grand October Showcase:",
        memoryPairs: [["Grand","Translation of Grand"],["October","Meaning of October"],["Aral","Learning"],["Bayan","Nation/Community"]]
      };

    case 40:
      return {
        sortTitle: "Lesson 40: Kitchen Safety and Hygiene Categorization",
        bins: ["Kitchen Core Concept", "Cultural & Practical Context"],
        items: [
          {
                    "text": "Kitchen Key Principle",
                    "bin": 0
          },
          {
                    "text": "Practical Application of Kitchen",
                    "bin": 1
          },
          {
                    "text": "Safety Cultural Element",
                    "bin": 0
          },
          {
                    "text": "Community Context of Safety",
                    "bin": 1
          },
          {
                    "text": "Tagalog Vocabulary for Hygiene",
                    "bin": 0
          },
          {
                    "text": "Family Reflection on Hygiene",
                    "bin": 1
          }
],
        matchLeft: ["Kitchen (Term 1)","Safety (Term 2)","Aral (Lesson)","Bayan (Community)"],
        matchRight: ["Core Meaning of Kitchen","Practice of Safety","Instructional Knowledge","Town / People"],
        seqTitle: "Process Sequence: Kitchen Safety and Hygiene",
        seqItems: [
          {
                    "text": "Examine opening visual for Kitchen Safety and Hygiene Junior Chef Foundations",
                    "emoji": "🔍"
          },
          {
                    "text": "Understand factual background and Kitchen context",
                    "emoji": "📖"
          },
          {
                    "text": "Practice Tagalog terms and family activity",
                    "emoji": "🗣️"
          },
          {
                    "text": "Complete reflection and record milestone",
                    "emoji": "⭐"
          }
],
        quizQuestion: "What is the primary educational objective of Lesson 40: Kitchen Safety and Hygiene Junior Chef Foundations?",
        quizOptions: [
          "Demonstrate essential kitchen hygiene rules: the 20-second warm water handw...",
          "Ignoring historical facts and context",
          "Memorizing unrelated numbers",
          "Skipping the interactive session"
],
        correctQuizIndex: 0,
        hotspotPrompt: "Identify the core feature of Kitchen Safety and Hygiene:",
        memoryPairs: [["Kitchen","Translation of Kitchen"],["Safety","Meaning of Safety"],["Aral","Learning"],["Bayan","Nation/Community"]]
      };

    case 41:
      return {
        sortTitle: "Lesson 41: Culinary Measurements and Tools Categorization",
        bins: ["Culinary Core Concept", "Cultural & Practical Context"],
        items: [
          {
                    "text": "Culinary Key Principle",
                    "bin": 0
          },
          {
                    "text": "Practical Application of Culinary",
                    "bin": 1
          },
          {
                    "text": "Measurements Cultural Element",
                    "bin": 0
          },
          {
                    "text": "Community Context of Measurements",
                    "bin": 1
          },
          {
                    "text": "Tagalog Vocabulary for Tools",
                    "bin": 0
          },
          {
                    "text": "Family Reflection on Tools",
                    "bin": 1
          }
],
        matchLeft: ["Culinary (Term 1)","Measurements (Term 2)","Aral (Lesson)","Bayan (Community)"],
        matchRight: ["Core Meaning of Culinary","Practice of Measurements","Instructional Knowledge","Town / People"],
        seqTitle: "Process Sequence: Culinary Measurements and Tools",
        seqItems: [
          {
                    "text": "Examine opening visual for Culinary Measurements and Tools The Science of Precision",
                    "emoji": "🔍"
          },
          {
                    "text": "Understand factual background and Culinary context",
                    "emoji": "📖"
          },
          {
                    "text": "Practice Tagalog terms and family activity",
                    "emoji": "🗣️"
          },
          {
                    "text": "Complete reflection and record milestone",
                    "emoji": "⭐"
          }
],
        quizQuestion: "What is the primary educational objective of Lesson 41: Culinary Measurements and Tools The Science of Precision?",
        quizOptions: [
          "Distinguish between dry measuring cups (for flour, sugar, uncooked rice) an...",
          "Ignoring historical facts and context",
          "Memorizing unrelated numbers",
          "Skipping the interactive session"
],
        correctQuizIndex: 0,
        hotspotPrompt: "Identify the core feature of Culinary Measurements and Tools:",
        memoryPairs: [["Culinary","Translation of Culinary"],["Measurements","Meaning of Measurements"],["Aral","Learning"],["Bayan","Nation/Community"]]
      };

    case 42:
      return {
        sortTitle: "Lesson 42: Pinggang Pinoy and Nourishing Filipino Ingredients Categorization",
        bins: ["Go Foods (Carbohydrates)", "Grow Foods (Proteins)"],
        items: [
          {
                    "text": "Sinangag (Garlic Rice)",
                    "bin": 0
          },
          {
                    "text": "Inihaw na Tilapia",
                    "bin": 1
          },
          {
                    "text": "Kamote (Sweet Potato)",
                    "bin": 0
          },
          {
                    "text": "Tokwa (Tofu)",
                    "bin": 1
          },
          {
                    "text": "Mais (Corn)",
                    "bin": 0
          },
          {
                    "text": "Nilagang Itlog",
                    "bin": 1
          }
],
        matchLeft: ["Go Foods","Grow Foods","Glow Foods","Pinggang Pinoy"],
        matchRight: ["Enerhiya (Energy)","Lakas (Proteins)","Bitamina (Vitamins)","DOST-FNRI Healthy Plate"],
        seqTitle: "Process Sequence: Pinggang Pinoy and Nourishing Filipino Ingredients",
        seqItems: [
          {
                    "text": "Fill 1/2 of plate with Glow vegetables and fruits",
                    "emoji": "🥗"
          },
          {
                    "text": "Fill 1/4 of plate with Go energy grains (rice/camote)",
                    "emoji": "🍚"
          },
          {
                    "text": "Fill 1/4 of plate with Grow protein (fish/eggs)",
                    "emoji": "🐟"
          },
          {
                    "text": "Serve with clean water and thanksgiving prayer",
                    "emoji": "🙏"
          }
],
        quizQuestion: "According to Pinggang Pinoy (DOST-FNRI), what portion of the plate should be vegetables and fruits?",
        quizOptions: [
          "One half (1/2) of the plate",
          "One tenth (1/10)",
          "None",
          "All of the plate"
],
        correctQuizIndex: 0,
        hotspotPrompt: "Identify the core feature of Pinggang Pinoy and Nourishing Filipino Ingredients:",
        memoryPairs: [["Kanin","Rice"],["Isda","Fish"],["Gulay","Vegetable"],["Prutas","Fruit"]]
      };

    case 43:
      return {
        sortTitle: "Lesson 43: Ang Bigas at Kanin Categorization",
        bins: ["Ang Core Concept", "Cultural & Practical Context"],
        items: [
          {
                    "text": "Bigas Key Principle",
                    "bin": 0
          },
          {
                    "text": "Practical Application of Bigas",
                    "bin": 1
          },
          {
                    "text": "Kanin Cultural Element",
                    "bin": 0
          },
          {
                    "text": "Community Context of Kanin",
                    "bin": 1
          },
          {
                    "text": "Tagalog Vocabulary for Rice",
                    "bin": 0
          },
          {
                    "text": "Family Reflection on Rice",
                    "bin": 1
          }
],
        matchLeft: ["Bigas (Term 1)","Kanin (Term 2)","Aral (Lesson)","Bayan (Community)"],
        matchRight: ["Core Meaning of Bigas","Practice of Kanin","Instructional Knowledge","Town / People"],
        seqTitle: "Process Sequence: Ang Bigas at Kanin",
        seqItems: [
          {
                    "text": "Examine opening visual for Ang Bigas at Kanin Rice Culture and Staple Heritage",
                    "emoji": "🔍"
          },
          {
                    "text": "Understand factual background and Bigas context",
                    "emoji": "📖"
          },
          {
                    "text": "Practice Tagalog terms and family activity",
                    "emoji": "🗣️"
          },
          {
                    "text": "Complete reflection and record milestone",
                    "emoji": "⭐"
          }
],
        quizQuestion: "What is the primary educational objective of Lesson 43: Ang Bigas at Kanin Rice Culture and Staple Heritage?",
        quizOptions: [
          "Differentiate the four linguistic and agricultural stages of rice in Filipi...",
          "Ignoring historical facts and context",
          "Memorizing unrelated numbers",
          "Skipping the interactive session"
],
        correctQuizIndex: 0,
        hotspotPrompt: "Identify the core feature of Ang Bigas at Kanin:",
        memoryPairs: [["Bigas","Translation of Bigas"],["Kanin","Meaning of Kanin"],["Aral","Learning"],["Bayan","Nation/Community"]]
      };

    case 44:
      return {
        sortTitle: "Lesson 44: Adobo Across the Archipelago Categorization",
        bins: ["Adobo Core Concept", "Cultural & Practical Context"],
        items: [
          {
                    "text": "Adobo Key Principle",
                    "bin": 0
          },
          {
                    "text": "Practical Application of Adobo",
                    "bin": 1
          },
          {
                    "text": "Across Cultural Element",
                    "bin": 0
          },
          {
                    "text": "Community Context of Across",
                    "bin": 1
          },
          {
                    "text": "Tagalog Vocabulary for Archipelago",
                    "bin": 0
          },
          {
                    "text": "Family Reflection on Archipelago",
                    "bin": 1
          }
],
        matchLeft: ["Adobo (Term 1)","Across (Term 2)","Aral (Lesson)","Bayan (Community)"],
        matchRight: ["Core Meaning of Adobo","Practice of Across","Instructional Knowledge","Town / People"],
        seqTitle: "Process Sequence: Adobo Across the Archipelago",
        seqItems: [
          {
                    "text": "Examine opening visual for Adobo Across the Archipelago Regional Vinegar Heritage",
                    "emoji": "🔍"
          },
          {
                    "text": "Understand factual background and Adobo context",
                    "emoji": "📖"
          },
          {
                    "text": "Practice Tagalog terms and family activity",
                    "emoji": "🗣️"
          },
          {
                    "text": "Complete reflection and record milestone",
                    "emoji": "⭐"
          }
],
        quizQuestion: "What is the primary educational objective of Lesson 44: Adobo Across the Archipelago Regional Vinegar Heritage?",
        quizOptions: [
          "Explain the indigenous Philippine origin of adobo as an ancient vinegar-and...",
          "Ignoring historical facts and context",
          "Memorizing unrelated numbers",
          "Skipping the interactive session"
],
        correctQuizIndex: 0,
        hotspotPrompt: "Identify the core feature of Adobo Across the Archipelago:",
        memoryPairs: [["Adobo","Translation of Adobo"],["Across","Meaning of Across"],["Aral","Learning"],["Bayan","Nation/Community"]]
      };

    case 45:
      return {
        sortTitle: "Lesson 45: Sinigang and Native Souring Agents Categorization",
        bins: ["Sinigang Core Concept", "Cultural & Practical Context"],
        items: [
          {
                    "text": "Sinigang Key Principle",
                    "bin": 0
          },
          {
                    "text": "Practical Application of Sinigang",
                    "bin": 1
          },
          {
                    "text": "Native Cultural Element",
                    "bin": 0
          },
          {
                    "text": "Community Context of Native",
                    "bin": 1
          },
          {
                    "text": "Tagalog Vocabulary for Souring",
                    "bin": 0
          },
          {
                    "text": "Family Reflection on Souring",
                    "bin": 1
          }
],
        matchLeft: ["Sinigang (Term 1)","Native (Term 2)","Aral (Lesson)","Bayan (Community)"],
        matchRight: ["Core Meaning of Sinigang","Practice of Native","Instructional Knowledge","Town / People"],
        seqTitle: "Process Sequence: Sinigang and Native Souring Agents",
        seqItems: [
          {
                    "text": "Examine opening visual for Sinigang and Native Souring Agents The Art of Asim",
                    "emoji": "🔍"
          },
          {
                    "text": "Understand factual background and Sinigang context",
                    "emoji": "📖"
          },
          {
                    "text": "Practice Tagalog terms and family activity",
                    "emoji": "🗣️"
          },
          {
                    "text": "Complete reflection and record milestone",
                    "emoji": "⭐"
          }
],
        quizQuestion: "What is the primary educational objective of Lesson 45: Sinigang and Native Souring Agents The Art of Asim?",
        quizOptions: [
          "Identify the botanical diversity of traditional Philippine souring agents (...",
          "Ignoring historical facts and context",
          "Memorizing unrelated numbers",
          "Skipping the interactive session"
],
        correctQuizIndex: 0,
        hotspotPrompt: "Identify the core feature of Sinigang and Native Souring Agents:",
        memoryPairs: [["Sinigang","Translation of Sinigang"],["Native","Meaning of Native"],["Aral","Learning"],["Bayan","Nation/Community"]]
      };

    case 46:
      return {
        sortTitle: "Lesson 46: Pancit Traditions Categorization",
        bins: ["Pancit Core Concept", "Cultural & Practical Context"],
        items: [
          {
                    "text": "Pancit Key Principle",
                    "bin": 0
          },
          {
                    "text": "Practical Application of Pancit",
                    "bin": 1
          },
          {
                    "text": "Traditions Cultural Element",
                    "bin": 0
          },
          {
                    "text": "Community Context of Traditions",
                    "bin": 1
          },
          {
                    "text": "Tagalog Vocabulary for Long",
                    "bin": 0
          },
          {
                    "text": "Family Reflection on Long",
                    "bin": 1
          }
],
        matchLeft: ["Pancit (Term 1)","Traditions (Term 2)","Aral (Lesson)","Bayan (Community)"],
        matchRight: ["Core Meaning of Pancit","Practice of Traditions","Instructional Knowledge","Town / People"],
        seqTitle: "Process Sequence: Pancit Traditions",
        seqItems: [
          {
                    "text": "Examine opening visual for Pancit Traditions Long Noodles Blessings and Celebrations",
                    "emoji": "🔍"
          },
          {
                    "text": "Understand factual background and Pancit context",
                    "emoji": "📖"
          },
          {
                    "text": "Practice Tagalog terms and family activity",
                    "emoji": "🗣️"
          },
          {
                    "text": "Complete reflection and record milestone",
                    "emoji": "⭐"
          }
],
        quizQuestion: "What is the primary educational objective of Lesson 46: Pancit Traditions Long Noodles Blessings and Celebrations?",
        quizOptions: [
          "Trace the cultural and historical evolution of pancit from Hokkien Chinese ...",
          "Ignoring historical facts and context",
          "Memorizing unrelated numbers",
          "Skipping the interactive session"
],
        correctQuizIndex: 0,
        hotspotPrompt: "Identify the core feature of Pancit Traditions:",
        memoryPairs: [["Pancit","Translation of Pancit"],["Traditions","Meaning of Traditions"],["Aral","Learning"],["Bayan","Nation/Community"]]
      };

    case 47:
      return {
        sortTitle: "Lesson 47: Halo-Halo Categorization",
        bins: ["Halo-Halo Core Concept", "Cultural & Practical Context"],
        items: [
          {
                    "text": "Halo-Halo Key Principle",
                    "bin": 0
          },
          {
                    "text": "Practical Application of Halo-Halo",
                    "bin": 1
          },
          {
                    "text": "Layered Cultural Element",
                    "bin": 0
          },
          {
                    "text": "Community Context of Layered",
                    "bin": 1
          },
          {
                    "text": "Tagalog Vocabulary for Sweet",
                    "bin": 0
          },
          {
                    "text": "Family Reflection on Sweet",
                    "bin": 1
          }
],
        matchLeft: ["Halo-Halo (Term 1)","Layered (Term 2)","Aral (Lesson)","Bayan (Community)"],
        matchRight: ["Core Meaning of Halo-Halo","Practice of Layered","Instructional Knowledge","Town / People"],
        seqTitle: "Process Sequence: Halo-Halo",
        seqItems: [
          {
                    "text": "Examine opening visual for Halo-Halo Layered Sweet Harmony and Shaved Ice Artistry",
                    "emoji": "🔍"
          },
          {
                    "text": "Understand factual background and Halo-Halo context",
                    "emoji": "📖"
          },
          {
                    "text": "Practice Tagalog terms and family activity",
                    "emoji": "🗣️"
          },
          {
                    "text": "Complete reflection and record milestone",
                    "emoji": "⭐"
          }
],
        quizQuestion: "What is the primary educational objective of Lesson 47: Halo-Halo Layered Sweet Harmony and Shaved Ice Artistry?",
        quizOptions: [
          "Trace the cultural history of halo-halo from the pre-war Japanese shaved-ic...",
          "Ignoring historical facts and context",
          "Memorizing unrelated numbers",
          "Skipping the interactive session"
],
        correctQuizIndex: 0,
        hotspotPrompt: "Identify the core feature of Halo-Halo:",
        memoryPairs: [["Halo-Halo","Translation of Halo-Halo"],["Layered","Meaning of Layered"],["Aral","Learning"],["Bayan","Nation/Community"]]
      };

    case 48:
      return {
        sortTitle: "Lesson 48: Mango Float Categorization",
        bins: ["Mango Core Concept", "Cultural & Practical Context"],
        items: [
          {
                    "text": "Mango Key Principle",
                    "bin": 0
          },
          {
                    "text": "Practical Application of Mango",
                    "bin": 1
          },
          {
                    "text": "Float Cultural Element",
                    "bin": 0
          },
          {
                    "text": "Community Context of Float",
                    "bin": 1
          },
          {
                    "text": "Tagalog Vocabulary for Beloved",
                    "bin": 0
          },
          {
                    "text": "Family Reflection on Beloved",
                    "bin": 1
          }
],
        matchLeft: ["Mango (Term 1)","Float (Term 2)","Aral (Lesson)","Bayan (Community)"],
        matchRight: ["Core Meaning of Mango","Practice of Float","Instructional Knowledge","Town / People"],
        seqTitle: "Process Sequence: Mango Float",
        seqItems: [
          {
                    "text": "Examine opening visual for Mango Float The Beloved No-Bake Family Heritage Dessert",
                    "emoji": "🔍"
          },
          {
                    "text": "Understand factual background and Mango context",
                    "emoji": "📖"
          },
          {
                    "text": "Practice Tagalog terms and family activity",
                    "emoji": "🗣️"
          },
          {
                    "text": "Complete reflection and record milestone",
                    "emoji": "⭐"
          }
],
        quizQuestion: "What is the primary educational objective of Lesson 48: Mango Float The Beloved No-Bake Family Heritage Dessert?",
        quizOptions: [
          "Explain the history and culinary science of Mango Float (also known as Mang...",
          "Ignoring historical facts and context",
          "Memorizing unrelated numbers",
          "Skipping the interactive session"
],
        correctQuizIndex: 0,
        hotspotPrompt: "Identify the core feature of Mango Float:",
        memoryPairs: [["Mango","Translation of Mango"],["Float","Meaning of Float"],["Aral","Learning"],["Bayan","Nation/Community"]]
      };

    case 49:
      return {
        sortTitle: "Lesson 49: Kakanin Heritage Categorization",
        bins: ["Kakanin Core Concept", "Cultural & Practical Context"],
        items: [
          {
                    "text": "Kakanin Key Principle",
                    "bin": 0
          },
          {
                    "text": "Practical Application of Kakanin",
                    "bin": 1
          },
          {
                    "text": "Heritage Cultural Element",
                    "bin": 0
          },
          {
                    "text": "Community Context of Heritage",
                    "bin": 1
          },
          {
                    "text": "Tagalog Vocabulary for Sticky",
                    "bin": 0
          },
          {
                    "text": "Family Reflection on Sticky",
                    "bin": 1
          }
],
        matchLeft: ["Kakanin (Term 1)","Heritage (Term 2)","Aral (Lesson)","Bayan (Community)"],
        matchRight: ["Core Meaning of Kakanin","Practice of Heritage","Instructional Knowledge","Town / People"],
        seqTitle: "Process Sequence: Kakanin Heritage",
        seqItems: [
          {
                    "text": "Examine opening visual for Kakanin Heritage Sticky Rice Delicacies and Coconut Traditions",
                    "emoji": "🔍"
          },
          {
                    "text": "Understand factual background and Kakanin context",
                    "emoji": "📖"
          },
          {
                    "text": "Practice Tagalog terms and family activity",
                    "emoji": "🗣️"
          },
          {
                    "text": "Complete reflection and record milestone",
                    "emoji": "⭐"
          }
],
        quizQuestion: "What is the primary educational objective of Lesson 49: Kakanin Heritage Sticky Rice Delicacies and Coconut Traditions?",
        quizOptions: [
          "Trace the indigenous Philippine heritage of 'kakanin' (traditional glutinou...",
          "Ignoring historical facts and context",
          "Memorizing unrelated numbers",
          "Skipping the interactive session"
],
        correctQuizIndex: 0,
        hotspotPrompt: "Identify the core feature of Kakanin Heritage:",
        memoryPairs: [["Kakanin","Translation of Kakanin"],["Heritage","Meaning of Heritage"],["Aral","Learning"],["Bayan","Nation/Community"]]
      };

    case 50:
      return {
        sortTitle: "Lesson 50: Grandma's Recipe Box Categorization",
        bins: ["Grandmas Core Concept", "Cultural & Practical Context"],
        items: [
          {
                    "text": "Grandmas Key Principle",
                    "bin": 0
          },
          {
                    "text": "Practical Application of Grandmas",
                    "bin": 1
          },
          {
                    "text": "Recipe Cultural Element",
                    "bin": 0
          },
          {
                    "text": "Community Context of Recipe",
                    "bin": 1
          },
          {
                    "text": "Tagalog Vocabulary for Preserving",
                    "bin": 0
          },
          {
                    "text": "Family Reflection on Preserving",
                    "bin": 1
          }
],
        matchLeft: ["Grandmas (Term 1)","Recipe (Term 2)","Aral (Lesson)","Bayan (Community)"],
        matchRight: ["Core Meaning of Grandmas","Practice of Recipe","Instructional Knowledge","Town / People"],
        seqTitle: "Process Sequence: Grandma's Recipe Box",
        seqItems: [
          {
                    "text": "Examine opening visual for Grandmas Recipe Box Preserving Heirlooms and Oral Histories",
                    "emoji": "🔍"
          },
          {
                    "text": "Understand factual background and Grandmas context",
                    "emoji": "📖"
          },
          {
                    "text": "Practice Tagalog terms and family activity",
                    "emoji": "🗣️"
          },
          {
                    "text": "Complete reflection and record milestone",
                    "emoji": "⭐"
          }
],
        quizQuestion: "What is the primary educational objective of Lesson 50: Grandmas Recipe Box Preserving Heirlooms and Oral Histories?",
        quizOptions: [
          "Explain the cultural role of oral culinary traditions ('pamana sa kusina') ...",
          "Ignoring historical facts and context",
          "Memorizing unrelated numbers",
          "Skipping the interactive session"
],
        correctQuizIndex: 0,
        hotspotPrompt: "Identify the core feature of Grandma's Recipe Box:",
        memoryPairs: [["Grandmas","Translation of Grandmas"],["Recipe","Meaning of Recipe"],["Aral","Learning"],["Bayan","Nation/Community"]]
      };

    case 51:
      return {
        sortTitle: "Lesson 51: The Family Heritage Wall Categorization",
        bins: ["The Core Concept", "Cultural & Practical Context"],
        items: [
          {
                    "text": "Family Key Principle",
                    "bin": 0
          },
          {
                    "text": "Practical Application of Family",
                    "bin": 1
          },
          {
                    "text": "Heritage Cultural Element",
                    "bin": 0
          },
          {
                    "text": "Community Context of Heritage",
                    "bin": 1
          },
          {
                    "text": "Tagalog Vocabulary for Wall",
                    "bin": 0
          },
          {
                    "text": "Family Reflection on Wall",
                    "bin": 1
          }
],
        matchLeft: ["Family (Term 1)","Heritage (Term 2)","Aral (Lesson)","Bayan (Community)"],
        matchRight: ["Core Meaning of Family","Practice of Heritage","Instructional Knowledge","Town / People"],
        seqTitle: "Process Sequence: The Family Heritage Wall",
        seqItems: [
          {
                    "text": "Examine opening visual for The Family Heritage Wall Culinary Roots and Generational Stories",
                    "emoji": "🔍"
          },
          {
                    "text": "Understand factual background and Family context",
                    "emoji": "📖"
          },
          {
                    "text": "Practice Tagalog terms and family activity",
                    "emoji": "🗣️"
          },
          {
                    "text": "Complete reflection and record milestone",
                    "emoji": "⭐"
          }
],
        quizQuestion: "What is the primary educational objective of Lesson 51: The Family Heritage Wall Culinary Roots and Generational Stories?",
        quizOptions: [
          "Map ancestral geographic roots across the Philippine archipelago (Luzon, Vi...",
          "Ignoring historical facts and context",
          "Memorizing unrelated numbers",
          "Skipping the interactive session"
],
        correctQuizIndex: 0,
        hotspotPrompt: "Identify the core feature of The Family Heritage Wall:",
        memoryPairs: [["Family","Translation of Family"],["Heritage","Meaning of Heritage"],["Aral","Learning"],["Bayan","Nation/Community"]]
      };

    case 52:
      return {
        sortTitle: "Lesson 52: The Grand November Culinary Showcase Categorization",
        bins: ["The Core Concept", "Cultural & Practical Context"],
        items: [
          {
                    "text": "Grand Key Principle",
                    "bin": 0
          },
          {
                    "text": "Practical Application of Grand",
                    "bin": 1
          },
          {
                    "text": "November Cultural Element",
                    "bin": 0
          },
          {
                    "text": "Community Context of November",
                    "bin": 1
          },
          {
                    "text": "Tagalog Vocabulary for Culinary",
                    "bin": 0
          },
          {
                    "text": "Family Reflection on Culinary",
                    "bin": 1
          }
],
        matchLeft: ["Grand (Term 1)","November (Term 2)","Aral (Lesson)","Bayan (Community)"],
        matchRight: ["Core Meaning of Grand","Practice of November","Instructional Knowledge","Town / People"],
        seqTitle: "Process Sequence: The Grand November Culinary Showcase",
        seqItems: [
          {
                    "text": "Examine opening visual for The Grand November Culinary Showcase A Feast of Family Heritage",
                    "emoji": "🔍"
          },
          {
                    "text": "Understand factual background and Grand context",
                    "emoji": "📖"
          },
          {
                    "text": "Practice Tagalog terms and family activity",
                    "emoji": "🗣️"
          },
          {
                    "text": "Complete reflection and record milestone",
                    "emoji": "⭐"
          }
],
        quizQuestion: "What is the primary educational objective of Lesson 52: The Grand November Culinary Showcase A Feast of Family Heritage?",
        quizOptions: [
          "Synthesize comprehensive learning from the entire November Culinary Heritag...",
          "Ignoring historical facts and context",
          "Memorizing unrelated numbers",
          "Skipping the interactive session"
],
        correctQuizIndex: 0,
        hotspotPrompt: "Identify the core feature of The Grand November Culinary Showcase:",
        memoryPairs: [["Grand","Translation of Grand"],["November","Meaning of November"],["Aral","Learning"],["Bayan","Nation/Community"]]
      };

    case 53:
      return {
        sortTitle: "Lesson 53: The Grand Philippine Geography Championship Categorization",
        bins: ["The Core Concept", "Cultural & Practical Context"],
        items: [
          {
                    "text": "Grand Key Principle",
                    "bin": 0
          },
          {
                    "text": "Practical Application of Grand",
                    "bin": 1
          },
          {
                    "text": "Philippine Cultural Element",
                    "bin": 0
          },
          {
                    "text": "Community Context of Philippine",
                    "bin": 1
          },
          {
                    "text": "Tagalog Vocabulary for Geography",
                    "bin": 0
          },
          {
                    "text": "Family Reflection on Geography",
                    "bin": 1
          }
],
        matchLeft: ["Grand (Term 1)","Philippine (Term 2)","Aral (Lesson)","Bayan (Community)"],
        matchRight: ["Core Meaning of Grand","Practice of Philippine","Instructional Knowledge","Town / People"],
        seqTitle: "Process Sequence: The Grand Philippine Geography Championship",
        seqItems: [
          {
                    "text": "Examine opening visual for The Grand Philippine Geography Championship Archipelagic Mastery",
                    "emoji": "🔍"
          },
          {
                    "text": "Understand factual background and Grand context",
                    "emoji": "📖"
          },
          {
                    "text": "Practice Tagalog terms and family activity",
                    "emoji": "🗣️"
          },
          {
                    "text": "Complete reflection and record milestone",
                    "emoji": "⭐"
          }
],
        quizQuestion: "What is the primary educational objective of Lesson 53: The Grand Philippine Geography Championship Archipelagic Mastery?",
        quizOptions: [
          "Synthesize comprehensive geographic knowledge from August, locating and dif...",
          "Ignoring historical facts and context",
          "Memorizing unrelated numbers",
          "Skipping the interactive session"
],
        correctQuizIndex: 0,
        hotspotPrompt: "Identify the core feature of The Grand Philippine Geography Championship:",
        memoryPairs: [["Grand","Translation of Grand"],["Philippine","Meaning of Philippine"],["Aral","Learning"],["Bayan","Nation/Community"]]
      };

    case 54:
      return {
        sortTitle: "Lesson 54: The Great Archipelago Cultural Game Show Categorization",
        bins: ["The Core Concept", "Cultural & Practical Context"],
        items: [
          {
                    "text": "Great Key Principle",
                    "bin": 0
          },
          {
                    "text": "Practical Application of Great",
                    "bin": 1
          },
          {
                    "text": "Archipelago Cultural Element",
                    "bin": 0
          },
          {
                    "text": "Community Context of Archipelago",
                    "bin": 1
          },
          {
                    "text": "Tagalog Vocabulary for Cultural",
                    "bin": 0
          },
          {
                    "text": "Family Reflection on Cultural",
                    "bin": 1
          }
],
        matchLeft: ["Great (Term 1)","Archipelago (Term 2)","Aral (Lesson)","Bayan (Community)"],
        matchRight: ["Core Meaning of Great","Practice of Archipelago","Instructional Knowledge","Town / People"],
        seqTitle: "Process Sequence: The Great Archipelago Cultural Game Show",
        seqItems: [
          {
                    "text": "Examine opening visual for The Great Archipelago Cultural Game Show Language Traditions and Daily Life",
                    "emoji": "🔍"
          },
          {
                    "text": "Understand factual background and Great context",
                    "emoji": "📖"
          },
          {
                    "text": "Practice Tagalog terms and family activity",
                    "emoji": "🗣️"
          },
          {
                    "text": "Complete reflection and record milestone",
                    "emoji": "⭐"
          }
],
        quizQuestion: "What is the primary educational objective of Lesson 54: The Great Archipelago Cultural Game Show Language Traditions and Daily Life?",
        quizOptions: [
          "Synthesize comprehensive cultural knowledge from September: respectful gest...",
          "Ignoring historical facts and context",
          "Memorizing unrelated numbers",
          "Skipping the interactive session"
],
        correctQuizIndex: 0,
        hotspotPrompt: "Identify the core feature of The Great Archipelago Cultural Game Show:",
        memoryPairs: [["Great","Translation of Great"],["Archipelago","Meaning of Archipelago"],["Aral","Learning"],["Bayan","Nation/Community"]]
      };

    case 55:
      return {
        sortTitle: "Lesson 55: Family Recipe Showcase Preparation Categorization",
        bins: ["Family Core Concept", "Cultural & Practical Context"],
        items: [
          {
                    "text": "Family Key Principle",
                    "bin": 0
          },
          {
                    "text": "Practical Application of Family",
                    "bin": 1
          },
          {
                    "text": "Recipe Cultural Element",
                    "bin": 0
          },
          {
                    "text": "Community Context of Recipe",
                    "bin": 1
          },
          {
                    "text": "Tagalog Vocabulary for Showcase",
                    "bin": 0
          },
          {
                    "text": "Family Reflection on Showcase",
                    "bin": 1
          }
],
        matchLeft: ["Family (Term 1)","Recipe (Term 2)","Aral (Lesson)","Bayan (Community)"],
        matchRight: ["Core Meaning of Family","Practice of Recipe","Instructional Knowledge","Town / People"],
        seqTitle: "Process Sequence: Family Recipe Showcase Preparation",
        seqItems: [
          {
                    "text": "Examine opening visual for Family Recipe Showcase Preparation The Junior Master Chef Feast",
                    "emoji": "🔍"
          },
          {
                    "text": "Understand factual background and Family context",
                    "emoji": "📖"
          },
          {
                    "text": "Practice Tagalog terms and family activity",
                    "emoji": "🗣️"
          },
          {
                    "text": "Complete reflection and record milestone",
                    "emoji": "⭐"
          }
],
        quizQuestion: "What is the primary educational objective of Lesson 55: Family Recipe Showcase Preparation The Junior Master Chef Feast?",
        quizOptions: [
          "Synthesize key culinary principles from November: kitchen hygiene protocols...",
          "Ignoring historical facts and context",
          "Memorizing unrelated numbers",
          "Skipping the interactive session"
],
        correctQuizIndex: 0,
        hotspotPrompt: "Identify the core feature of Family Recipe Showcase Preparation:",
        memoryPairs: [["Family","Translation of Family"],["Recipe","Meaning of Recipe"],["Aral","Learning"],["Bayan","Nation/Community"]]
      };

    case 56:
      return {
        sortTitle: "Lesson 56: A Year of Gratitude Categorization",
        bins: ["A Core Concept", "Cultural & Practical Context"],
        items: [
          {
                    "text": "Year Key Principle",
                    "bin": 0
          },
          {
                    "text": "Practical Application of Year",
                    "bin": 1
          },
          {
                    "text": "Gratitude Cultural Element",
                    "bin": 0
          },
          {
                    "text": "Community Context of Gratitude",
                    "bin": 1
          },
          {
                    "text": "Tagalog Vocabulary for Reflecting",
                    "bin": 0
          },
          {
                    "text": "Family Reflection on Reflecting",
                    "bin": 1
          }
],
        matchLeft: ["Year (Term 1)","Gratitude (Term 2)","Aral (Lesson)","Bayan (Community)"],
        matchRight: ["Core Meaning of Year","Practice of Gratitude","Instructional Knowledge","Town / People"],
        seqTitle: "Process Sequence: A Year of Gratitude",
        seqItems: [
          {
                    "text": "Examine opening visual for A Year of Gratitude Reflecting on Gods Blessings Family and Growth",
                    "emoji": "🔍"
          },
          {
                    "text": "Understand factual background and Year context",
                    "emoji": "📖"
          },
          {
                    "text": "Practice Tagalog terms and family activity",
                    "emoji": "🗣️"
          },
          {
                    "text": "Complete reflection and record milestone",
                    "emoji": "⭐"
          }
],
        quizQuestion: "What is the primary educational objective of Lesson 56: A Year of Gratitude Reflecting on Gods Blessings Family and Growth?",
        quizOptions: [
          "Synthesize the spiritual and emotional discipline of gratitude ('pasasalama...",
          "Ignoring historical facts and context",
          "Memorizing unrelated numbers",
          "Skipping the interactive session"
],
        correctQuizIndex: 0,
        hotspotPrompt: "Identify the core feature of A Year of Gratitude:",
        memoryPairs: [["Year","Translation of Year"],["Gratitude","Meaning of Gratitude"],["Aral","Learning"],["Bayan","Nation/Community"]]
      };

    case 57:
      return {
        sortTitle: "Lesson 57: Biblical Stewardship of Creation Categorization",
        bins: ["Biblical Core Concept", "Cultural & Practical Context"],
        items: [
          {
                    "text": "Biblical Key Principle",
                    "bin": 0
          },
          {
                    "text": "Practical Application of Biblical",
                    "bin": 1
          },
          {
                    "text": "Stewardship Cultural Element",
                    "bin": 0
          },
          {
                    "text": "Community Context of Stewardship",
                    "bin": 1
          },
          {
                    "text": "Tagalog Vocabulary for Creation",
                    "bin": 0
          },
          {
                    "text": "Family Reflection on Creation",
                    "bin": 1
          }
],
        matchLeft: ["Biblical (Term 1)","Stewardship (Term 2)","Aral (Lesson)","Bayan (Community)"],
        matchRight: ["Core Meaning of Biblical","Practice of Stewardship","Instructional Knowledge","Town / People"],
        seqTitle: "Process Sequence: Biblical Stewardship of Creation",
        seqItems: [
          {
                    "text": "Examine opening visual for Biblical Stewardship of Creation Caring for the Islands Seas and Living Creatures",
                    "emoji": "🔍"
          },
          {
                    "text": "Understand factual background and Biblical context",
                    "emoji": "📖"
          },
          {
                    "text": "Practice Tagalog terms and family activity",
                    "emoji": "🗣️"
          },
          {
                    "text": "Complete reflection and record milestone",
                    "emoji": "⭐"
          }
],
        quizQuestion: "What is the primary educational objective of Lesson 57: Biblical Stewardship of Creation Caring for the Islands Seas and Living Creatures?",
        quizOptions: [
          "Synthesize comprehensive environmental science and biodiversity knowledge f...",
          "Ignoring historical facts and context",
          "Memorizing unrelated numbers",
          "Skipping the interactive session"
],
        correctQuizIndex: 0,
        hotspotPrompt: "Identify the core feature of Biblical Stewardship of Creation:",
        memoryPairs: [["Biblical","Translation of Biblical"],["Stewardship","Meaning of Stewardship"],["Aral","Learning"],["Bayan","Nation/Community"]]
      };

    case 58:
      return {
        sortTitle: "Lesson 58: Bayanihan in Action Categorization",
        bins: ["Bayanihan Core Concept", "Cultural & Practical Context"],
        items: [
          {
                    "text": "Bayanihan Key Principle",
                    "bin": 0
          },
          {
                    "text": "Practical Application of Bayanihan",
                    "bin": 1
          },
          {
                    "text": "Action Cultural Element",
                    "bin": 0
          },
          {
                    "text": "Community Context of Action",
                    "bin": 1
          },
          {
                    "text": "Tagalog Vocabulary for Community",
                    "bin": 0
          },
          {
                    "text": "Family Reflection on Community",
                    "bin": 1
          }
],
        matchLeft: ["Bayanihan (Term 1)","Action (Term 2)","Aral (Lesson)","Bayan (Community)"],
        matchRight: ["Core Meaning of Bayanihan","Practice of Action","Instructional Knowledge","Town / People"],
        seqTitle: "Process Sequence: Bayanihan in Action",
        seqItems: [
          {
                    "text": "Examine opening visual for Bayanihan in Action Community Kindness Cooperation and Filipino Values",
                    "emoji": "🔍"
          },
          {
                    "text": "Understand factual background and Bayanihan context",
                    "emoji": "📖"
          },
          {
                    "text": "Practice Tagalog terms and family activity",
                    "emoji": "🗣️"
          },
          {
                    "text": "Complete reflection and record milestone",
                    "emoji": "⭐"
          }
],
        quizQuestion: "What is the primary educational objective of Lesson 58: Bayanihan in Action Community Kindness Cooperation and Filipino Values?",
        quizOptions: [
          "Synthesize the historical and cultural evolution of 'Bayanihan' from tradit...",
          "Ignoring historical facts and context",
          "Memorizing unrelated numbers",
          "Skipping the interactive session"
],
        correctQuizIndex: 0,
        hotspotPrompt: "Identify the core feature of Bayanihan in Action:",
        memoryPairs: [["Bayanihan","Translation of Bayanihan"],["Action","Meaning of Action"],["Aral","Learning"],["Bayan","Nation/Community"]]
      };

    case 59:
      return {
        sortTitle: "Lesson 59: Convictions, Faith, and Service in the Lives of Filipino Heroes Categorization",
        bins: ["Convictions Core Concept", "Cultural & Practical Context"],
        items: [
          {
                    "text": "Convictions Key Principle",
                    "bin": 0
          },
          {
                    "text": "Practical Application of Convictions",
                    "bin": 1
          },
          {
                    "text": "Faith Cultural Element",
                    "bin": 0
          },
          {
                    "text": "Community Context of Faith",
                    "bin": 1
          },
          {
                    "text": "Tagalog Vocabulary for Service",
                    "bin": 0
          },
          {
                    "text": "Family Reflection on Service",
                    "bin": 1
          }
],
        matchLeft: ["Convictions (Term 1)","Faith (Term 2)","Aral (Lesson)","Bayan (Community)"],
        matchRight: ["Core Meaning of Convictions","Practice of Faith","Instructional Knowledge","Town / People"],
        seqTitle: "Process Sequence: Convictions, Faith, and Service in the Lives of Filipino Heroes",
        seqItems: [
          {
                    "text": "Examine opening visual for Convictions Faith and Service in the Lives of Filipino Heroes",
                    "emoji": "🔍"
          },
          {
                    "text": "Understand factual background and Convictions context",
                    "emoji": "📖"
          },
          {
                    "text": "Practice Tagalog terms and family activity",
                    "emoji": "🗣️"
          },
          {
                    "text": "Complete reflection and record milestone",
                    "emoji": "⭐"
          }
],
        quizQuestion: "What is the primary educational objective of Lesson 59: Convictions Faith and Service in the Lives of Filipino Heroes?",
        quizOptions: [
          "Synthesize the historical lives, core convictions, and sacrificial service ...",
          "Ignoring historical facts and context",
          "Memorizing unrelated numbers",
          "Skipping the interactive session"
],
        correctQuizIndex: 0,
        hotspotPrompt: "Identify the core feature of Convictions, Faith, and Service in the Lives of Filipino Heroes:",
        memoryPairs: [["Convictions","Translation of Convictions"],["Faith","Meaning of Faith"],["Aral","Learning"],["Bayan","Nation/Community"]]
      };

    case 60:
      return {
        sortTitle: "Lesson 60: The Parol and Filipino Heritage Traditions Categorization",
        bins: ["Parol Artistry & Materials", "Cultural Meaning & Symbolism"],
        items: [
          {
                    "text": "Bamboo Frame & Capiz Shells",
                    "bin": 0
          },
          {
                    "text": "Star of Hope and Joy",
                    "bin": 1
          },
          {
                    "text": "Papel de Japon Lantern",
                    "bin": 0
          },
          {
                    "text": "Lighting the path to Simbang Gabi",
                    "bin": 1
          },
          {
                    "text": "San Fernando Pampanga Crafts",
                    "bin": 0
          },
          {
                    "text": "Giant Parol Festival Heritage",
                    "bin": 1
          }
],
        matchLeft: ["Parol","Capiz","Tala","Pag-asa"],
        matchRight: ["Star Lantern","Translucent marine shell","Star","Hope"],
        seqTitle: "Process Sequence: The Parol and Filipino Heritage Traditions",
        seqItems: [
          {
                    "text": "Craft five-pointed star frame from bamboo sticks",
                    "emoji": "🎋"
          },
          {
                    "text": "Attach translucent Capiz shells or papel de japon",
                    "emoji": "🐚"
          },
          {
                    "text": "Install gentle warm light inside lantern",
                    "emoji": "💡"
          },
          {
                    "text": "Hang in window to welcome neighbors and holiday season",
                    "emoji": "🌟"
          }
],
        quizQuestion: "What classic Philippine marine material is famously used in artisan Parol lanterns?",
        quizOptions: [
          "Capiz translucent shells",
          "Plastic bottles",
          "Aluminum foil",
          "Granite stone"
],
        correctQuizIndex: 0,
        hotspotPrompt: "Identify the core feature of The Parol and Filipino Heritage Traditions:",
        memoryPairs: [["Parol","Lantern"],["Tala","Star"],["Liwanag","Light"],["Pag-asa","Hope"]]
      };

    case 61:
      return {
        sortTitle: "Lesson 61: Simbang Gabi Categorization",
        bins: ["Simbang Core Concept", "Cultural & Practical Context"],
        items: [
          {
                    "text": "Simbang Key Principle",
                    "bin": 0
          },
          {
                    "text": "Practical Application of Simbang",
                    "bin": 1
          },
          {
                    "text": "Gabi Cultural Element",
                    "bin": 0
          },
          {
                    "text": "Community Context of Gabi",
                    "bin": 1
          },
          {
                    "text": "Tagalog Vocabulary for History",
                    "bin": 0
          },
          {
                    "text": "Family Reflection on History",
                    "bin": 1
          }
],
        matchLeft: ["Simbang (Term 1)","Gabi (Term 2)","Aral (Lesson)","Bayan (Community)"],
        matchRight: ["Core Meaning of Simbang","Practice of Gabi","Instructional Knowledge","Town / People"],
        seqTitle: "Process Sequence: Simbang Gabi",
        seqItems: [
          {
                    "text": "Examine opening visual for Simbang Gabi History Agricultural Heritage and Community Traditions",
                    "emoji": "🔍"
          },
          {
                    "text": "Understand factual background and Simbang context",
                    "emoji": "📖"
          },
          {
                    "text": "Practice Tagalog terms and family activity",
                    "emoji": "🗣️"
          },
          {
                    "text": "Complete reflection and record milestone",
                    "emoji": "⭐"
          }
],
        quizQuestion: "What is the primary educational objective of Lesson 61: Simbang Gabi History Agricultural Heritage and Community Traditions?",
        quizOptions: [
          "Explain the historical origin and agricultural heritage of 'Simbang Gabi' (...",
          "Ignoring historical facts and context",
          "Memorizing unrelated numbers",
          "Skipping the interactive session"
],
        correctQuizIndex: 0,
        hotspotPrompt: "Identify the core feature of Simbang Gabi:",
        memoryPairs: [["Simbang","Translation of Simbang"],["Gabi","Meaning of Gabi"],["Aral","Learning"],["Bayan","Nation/Community"]]
      };

    case 62:
      return {
        sortTitle: "Lesson 62: Year-End Showcase Preparation Categorization",
        bins: ["Year-End Core Concept", "Cultural & Practical Context"],
        items: [
          {
                    "text": "Year-End Key Principle",
                    "bin": 0
          },
          {
                    "text": "Practical Application of Year-End",
                    "bin": 1
          },
          {
                    "text": "Showcase Cultural Element",
                    "bin": 0
          },
          {
                    "text": "Community Context of Showcase",
                    "bin": 1
          },
          {
                    "text": "Tagalog Vocabulary for Preparation",
                    "bin": 0
          },
          {
                    "text": "Family Reflection on Preparation",
                    "bin": 1
          }
],
        matchLeft: ["Year-End (Term 1)","Showcase (Term 2)","Aral (Lesson)","Bayan (Community)"],
        matchRight: ["Core Meaning of Year-End","Practice of Showcase","Instructional Knowledge","Town / People"],
        seqTitle: "Process Sequence: Year-End Showcase Preparation",
        seqItems: [
          {
                    "text": "Examine opening visual for Year-End Showcase Preparation Assembling Portfolios and Rehearsing Presentations",
                    "emoji": "🔍"
          },
          {
                    "text": "Understand factual background and Year-End context",
                    "emoji": "📖"
          },
          {
                    "text": "Practice Tagalog terms and family activity",
                    "emoji": "🗣️"
          },
          {
                    "text": "Complete reflection and record milestone",
                    "emoji": "⭐"
          }
],
        quizQuestion: "What is the primary educational objective of Lesson 62: Year-End Showcase Preparation Assembling Portfolios and Rehearsing Presentations?",
        quizOptions: [
          "Synthesize and organize major physical and digital artifacts produced acros...",
          "Ignoring historical facts and context",
          "Memorizing unrelated numbers",
          "Skipping the interactive session"
],
        correctQuizIndex: 0,
        hotspotPrompt: "Identify the core feature of Year-End Showcase Preparation:",
        memoryPairs: [["Year-End","Translation of Year-End"],["Showcase","Meaning of Showcase"],["Aral","Learning"],["Bayan","Nation/Community"]]
      };

    case 63:
      return {
        sortTitle: "Lesson 63: The Birth of Jesus Categorization",
        bins: ["The Core Concept", "Cultural & Practical Context"],
        items: [
          {
                    "text": "Birth Key Principle",
                    "bin": 0
          },
          {
                    "text": "Practical Application of Birth",
                    "bin": 1
          },
          {
                    "text": "Jesus Cultural Element",
                    "bin": 0
          },
          {
                    "text": "Community Context of Jesus",
                    "bin": 1
          },
          {
                    "text": "Tagalog Vocabulary for Biblical",
                    "bin": 0
          },
          {
                    "text": "Family Reflection on Biblical",
                    "bin": 1
          }
],
        matchLeft: ["Birth (Term 1)","Jesus (Term 2)","Aral (Lesson)","Bayan (Community)"],
        matchRight: ["Core Meaning of Birth","Practice of Jesus","Instructional Knowledge","Town / People"],
        seqTitle: "Process Sequence: The Birth of Jesus",
        seqItems: [
          {
                    "text": "Examine opening visual for The Birth of Jesus The Biblical Accounts in Matthew and Luke",
                    "emoji": "🔍"
          },
          {
                    "text": "Understand factual background and Birth context",
                    "emoji": "📖"
          },
          {
                    "text": "Practice Tagalog terms and family activity",
                    "emoji": "🗣️"
          },
          {
                    "text": "Complete reflection and record milestone",
                    "emoji": "⭐"
          }
],
        quizQuestion: "What is the primary educational objective of Lesson 63: The Birth of Jesus The Biblical Accounts in Matthew and Luke?",
        quizOptions: [
          "Examine and synthesize the biblical accounts of the Nativity of Jesus Chris...",
          "Ignoring historical facts and context",
          "Memorizing unrelated numbers",
          "Skipping the interactive session"
],
        correctQuizIndex: 0,
        hotspotPrompt: "Identify the core feature of The Birth of Jesus:",
        memoryPairs: [["Birth","Translation of Birth"],["Jesus","Meaning of Jesus"],["Aral","Learning"],["Bayan","Nation/Community"]]
      };

    case 64:
      return {
        sortTitle: "Lesson 64: Looking Forward to the New Year Categorization",
        bins: ["Looking Core Concept", "Cultural & Practical Context"],
        items: [
          {
                    "text": "Looking Key Principle",
                    "bin": 0
          },
          {
                    "text": "Practical Application of Looking",
                    "bin": 1
          },
          {
                    "text": "Forward Cultural Element",
                    "bin": 0
          },
          {
                    "text": "Community Context of Forward",
                    "bin": 1
          },
          {
                    "text": "Tagalog Vocabulary for Year",
                    "bin": 0
          },
          {
                    "text": "Family Reflection on Year",
                    "bin": 1
          }
],
        matchLeft: ["Looking (Term 1)","Forward (Term 2)","Aral (Lesson)","Bayan (Community)"],
        matchRight: ["Core Meaning of Looking","Practice of Forward","Instructional Knowledge","Town / People"],
        seqTitle: "Process Sequence: Looking Forward to the New Year",
        seqItems: [
          {
                    "text": "Examine opening visual for Looking Forward to the New Year Hope Goals and Walking with God",
                    "emoji": "🔍"
          },
          {
                    "text": "Understand factual background and Looking context",
                    "emoji": "📖"
          },
          {
                    "text": "Practice Tagalog terms and family activity",
                    "emoji": "🗣️"
          },
          {
                    "text": "Complete reflection and record milestone",
                    "emoji": "⭐"
          }
],
        quizQuestion: "What is the primary educational objective of Lesson 64: Looking Forward to the New Year Hope Goals and Walking with God?",
        quizOptions: [
          "Formulate a structured 'Bagong Taon, Bagong Pag-asa' (New Year Vision Plan)...",
          "Ignoring historical facts and context",
          "Memorizing unrelated numbers",
          "Skipping the interactive session"
],
        correctQuizIndex: 0,
        hotspotPrompt: "Identify the core feature of Looking Forward to the New Year:",
        memoryPairs: [["Looking","Translation of Looking"],["Forward","Meaning of Forward"],["Aral","Learning"],["Bayan","Nation/Community"]]
      };

    case 65:
      return {
        sortTitle: "Lesson 65: The Grand Wonder Journey Year-End Adventure Showcase Categorization",
        bins: ["The Core Concept", "Cultural & Practical Context"],
        items: [
          {
                    "text": "Grand Key Principle",
                    "bin": 0
          },
          {
                    "text": "Practical Application of Grand",
                    "bin": 1
          },
          {
                    "text": "Wonder Cultural Element",
                    "bin": 0
          },
          {
                    "text": "Community Context of Wonder",
                    "bin": 1
          },
          {
                    "text": "Tagalog Vocabulary for Journey",
                    "bin": 0
          },
          {
                    "text": "Family Reflection on Journey",
                    "bin": 1
          }
],
        matchLeft: ["Grand (Term 1)","Wonder (Term 2)","Aral (Lesson)","Bayan (Community)"],
        matchRight: ["Core Meaning of Grand","Practice of Wonder","Instructional Knowledge","Town / People"],
        seqTitle: "Process Sequence: The Grand Wonder Journey Year-End Adventure Showcase",
        seqItems: [
          {
                    "text": "Examine opening visual for The Grand Wonder Journey Year-End Adventure Showcase A Celebration of Learning",
                    "emoji": "🔍"
          },
          {
                    "text": "Understand factual background and Grand context",
                    "emoji": "📖"
          },
          {
                    "text": "Practice Tagalog terms and family activity",
                    "emoji": "🗣️"
          },
          {
                    "text": "Complete reflection and record milestone",
                    "emoji": "⭐"
          }
],
        quizQuestion: "What is the primary educational objective of Lesson 65: The Grand Wonder Journey Year-End Adventure Showcase A Celebration of Learning?",
        quizOptions: [
          "Synthesize comprehensive learning across the entire 65-lesson Wonder Journe...",
          "Ignoring historical facts and context",
          "Memorizing unrelated numbers",
          "Skipping the interactive session"
],
        correctQuizIndex: 0,
        hotspotPrompt: "Identify the core feature of The Grand Wonder Journey Year-End Adventure Showcase:",
        memoryPairs: [["Grand","Translation of Grand"],["Wonder","Meaning of Wonder"],["Aral","Learning"],["Bayan","Nation/Community"]]
      };

    default:
      return {
        sortTitle: `Lesson ${num} Categorization`,
        bins: ["Core Concept", "Context"],
        items: [
          { text: "Heritage Feature", bin: 0 },
          { text: "Daily Application", bin: 1 }
        ],
        matchLeft: ["Salita", "Bayan", "Aral", "Pamilya"],
        matchRight: ["Word", "Town", "Lesson", "Family"],
        seqTitle: "Learning Steps",
        seqItems: [
          { text: "Observe lesson visual", emoji: "🔍" },
          { text: "Learn Tagalog vocabulary", emoji: "🗣️" },
          { text: "Complete family activity", emoji: "🤝" },
          { text: "Record reflection", emoji: "⭐" }
        ],
        quizQuestion: `What is the main topic of Lesson ${num}?`,
        quizOptions: [lessonTitle, "Unrelated topic", "Blank page", "None"],
        correctQuizIndex: 0,
        hotspotPrompt: "Locate main feature:",
        memoryPairs: [["Salita", "Word"], ["Bayan", "Town"], ["Aral", "Lesson"], ["Tahanan", "Home"]]
      };
  }
}

export function generateServerLearnerGame(lessonId: string, lessonTitle?: string): LearnerSafeGameDTO {
  const resolvedTitle = lessonTitle || `Lesson ${lessonId}`;
  const theme = getLessonTheme(lessonId, resolvedTitle);

  // 1. Sorting: generate random bin IDs and item IDs
  const bins: LearnerSortBin[] = theme.bins.map((label, idx) => ({
    id: genId(`bin_${idx}`),
    label,
  }));

  const sortingMap: Record<string, string> = {};
  const sortItems: LearnerSortItem[] = theme.items.map((item) => {
    const itemId = genId("sort_item");
    const targetBin = bins[item.bin] ? bins[item.bin].id : bins[0].id;
    sortingMap[itemId] = targetBin;
    return { id: itemId, text: item.text };
  });
  const shuffledSortItems = [...sortItems].sort(() => Math.random() - 0.5);

  // 2. Matching: generate random item IDs
  const matchingPairs: Record<string, string> = {};
  const leftItems: LearnerMatchingItem[] = [];
  const rightItems: LearnerMatchingItem[] = [];

  for (let i = 0; i < theme.matchLeft.length; i++) {
    const leftId = genId(`match_l_${i}`);
    const rightId = genId(`match_r_${i}`);
    matchingPairs[leftId] = rightId;
    leftItems.push({ id: leftId, text: theme.matchLeft[i], side: "left" });
    rightItems.push({ id: rightId, text: theme.matchRight[i] || theme.matchLeft[i], side: "right" });
  }
  const shuffledLeft = [...leftItems].sort(() => Math.random() - 0.5);
  const shuffledRight = [...rightItems].sort(() => Math.random() - 0.5);

  // 3. Sequencing: generate random item IDs in correct sequence
  const sequenceOrder: string[] = [];
  const seqItems: LearnerSequenceItem[] = theme.seqItems.map((item) => {
    const seqId = genId("seq_step");
    sequenceOrder.push(seqId);
    return { id: seqId, text: item.text, emoji: item.emoji };
  });
  const shuffledSequence = [...seqItems].sort(() => Math.random() - 0.5);

  // 4. Quiz: generate random option IDs
  let correctQuizOptionId = "";
  const quizOptions: LearnerQuizOption[] = theme.quizOptions.map((text, idx) => {
    const optId = genId(`quiz_opt_${idx}`);
    if (idx === theme.correctQuizIndex) {
      correctQuizOptionId = optId;
    }
    return { id: optId, text };
  });
  const shuffledQuizOptions = [...quizOptions].sort(() => Math.random() - 0.5);

  // 5. Memory cards
  const memoryPairs: Record<string, string> = {};
  const memoryCards: LearnerMemoryCard[] = [];
  theme.memoryPairs.forEach((pair, idx) => {
    const cardAId = genId(`mem_a_${idx}`);
    const cardBId = genId(`mem_b_${idx}`);
    memoryPairs[cardAId] = cardBId;
    memoryPairs[cardBId] = cardAId;
    memoryCards.push({ id: cardAId, text: pair[0], type: "text" });
    memoryCards.push({ id: cardBId, text: pair[1], type: "translation" });
  });
  const shuffledMemoryCards = [...memoryCards].sort(() => Math.random() - 0.5);

  // 6. Hotspots
  const hotspotTarget1 = genId("hotspot_target_1");
  const hotspots: LearnerHotspot[] = [
    { id: hotspotTarget1, x: 50, y: 50, radius: 24 },
    { id: genId("hotspot_target_2"), x: 25, y: 40, radius: 20 },
    { id: genId("hotspot_target_3"), x: 75, y: 65, radius: 20 },
  ];

  // Store Solution Key securely on the server
  activeSolutionKeys.set(lessonId, {
    lessonId,
    hotspotTargetIds: [hotspotTarget1],
    sortingMap,
    matchingPairs,
    sequenceOrder,
    correctQuizOptionId,
    memoryPairs,
  });

  return {
    lessonId,
    lessonTitle: resolvedTitle,
    hotspots: {
      prompt: theme.hotspotPrompt,
      targets: hotspots,
    },
    sorting: {
      title: theme.sortTitle,
      bins,
      items: shuffledSortItems,
    },
    matching: {
      title: "Interactive Tagalog Vocabulary Matching",
      leftItems: shuffledLeft,
      rightItems: shuffledRight,
    },
    sequencing: {
      title: theme.seqTitle,
      items: shuffledSequence,
    },
    quiz: {
      question: theme.quizQuestion,
      options: shuffledQuizOptions,
    },
    memory: {
      title: "Tagalog Heritage Memory Cards",
      cards: shuffledMemoryCards,
    },
    review: {
      title: `Lesson ${lessonId} Adventure Review`,
      summary: `You completed all interactive challenges for ${resolvedTitle}!`,
      keyPoints: [
        "Cultural comprehension verified",
        "Vocabulary retention practiced",
        "Interactive teamwork completed",
      ],
    },
  };
}

export function getActiveTeacherSolutionKey(lessonId: string): TeacherSolutionKey | null {
  let key = activeSolutionKeys.get(lessonId);
  if (!key) {
    // Generate fresh DTO and key for this lesson
    generateServerLearnerGame(lessonId);
    key = activeSolutionKeys.get(lessonId);
  }
  return key || null;
}
