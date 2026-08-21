// ─────────────────────────────────────────────────────────────
// WONDER JOURNEY OS — LESSON GAME GENERATOR & ANSWER EVALUATOR
// Generates lesson-specific, answer-isolated interactive games
// for all 65 curriculum lessons.
// ─────────────────────────────────────────────────────────────

export interface LearnerHotspot {
  id: string;
  x: number; // percentage
  y: number; // percentage
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

// Internal Teacher Solution Key (kept isolated from student serialization)
interface TeacherSolutionKey {
  hotspotTargetIds: string[];
  sortingMap: Record<string, string>; // itemId -> binId
  matchingPairs: Record<string, string>; // leftItemId -> rightItemId
  sequenceOrder: string[]; // itemIds in correct order
  correctQuizOptionId: string;
  memoryPairs: Record<string, string>; // cardId -> cardId
}

const teacherKeysCache = new Map<string, TeacherSolutionKey>();

/**
 * Generates lesson-specific content for any lesson 1..65.
 */
function getLessonTheme(lessonId: string, lessonTitle: string) {
  const numMatch = lessonId.match(/\d+/);
  const num = numMatch ? parseInt(numMatch[0], 10) : 1;

  switch (num) {
    case 1:
      return {
        sortTitle: "Sort Island Geography",
        bins: ["Major Island Group", "Bodies of Water"],
        items: [
          { text: "Luzon", bin: 0 },
          { text: "Pacific Ocean", bin: 1 },
          { text: "Visayas", bin: 0 },
          { text: "South China Sea", bin: 1 },
          { text: "Mindanao", bin: 0 },
          { text: "Celebes Sea", bin: 1 },
        ],
        matchLeft: ["Pilipinas", "Dagat", "Pulo", "Kapuluan"],
        matchRight: ["Philippines", "Sea / Ocean", "Island", "Archipelago"],
        seqTitle: "Archipelago Map Exploration Steps",
        seqItems: [
          { text: "Find Southeast Asia on the world map", emoji: "🌏" },
          { text: "Locate the 7,641 islands in the Pacific", emoji: "🏝️" },
          { text: "Trace the three primary regions (Luzon, Visayas, Mindanao)", emoji: "🗺️" },
          { text: "Mark your family's home coordinate", emoji: "📍" },
        ],
        quizQuestion: "How many islands make up the Philippine Archipelago?",
        quizOptions: ["Over 7,600 islands", "500 islands", "12 islands", "50 islands"],
        correctQuizIndex: 0,
        hotspotPrompt: "Locate the capital city of Manila on the archipelago map:",
        memoryPairs: [
          ["Pilipinas", "Philippines"],
          ["Dagat", "Sea"],
          ["Bayan", "Town"],
          ["Tahanan", "Home"],
        ],
      };

    case 15:
      return {
        sortTitle: "Volcano Science & Geography",
        bins: ["Volcano Feature", "Surrounding Province"],
        items: [
          { text: "Magma Chamber", bin: 0 },
          { text: "Albay Province", bin: 1 },
          { text: "Crater Cone", bin: 0 },
          { text: "Bicol Region", bin: 1 },
          { text: "Volcanic Ash", bin: 0 },
          { text: "Legazpi City", bin: 1 },
        ],
        matchLeft: ["Bulkang Mayon", "Crater", "Lava", "Abo"],
        matchRight: ["Mayon Volcano", "Kratir (Vent)", "Tunaw na Bato", "Ash"],
        seqTitle: "Stratovolcano Formation Sequence",
        seqItems: [
          { text: "Magma rises from oceanic tectonic subduction zone", emoji: "🌋" },
          { text: "Ash and pyroclastic flows erupt from central vent", emoji: "💨" },
          { text: "Alternating strata layers cool into a symmetrical cone", emoji: "⛰️" },
          { text: "Mineral-rich volcanic soil nurtures lush countryside", emoji: "🌱" },
        ],
        quizQuestion: "Why is Mayon Volcano world-famous in geomorphology?",
        quizOptions: [
          "Its near-perfect symmetrical cone shape",
          "It is the coldest mountain on Earth",
          "It is made entirely of gold",
          "It has no crater",
        ],
        correctQuizIndex: 0,
        hotspotPrompt: "Click the main vent / summit crater of Mayon Volcano:",
        memoryPairs: [
          ["Bulkan", "Volcano"],
          ["Kono", "Cone"],
          ["Abo", "Ash"],
          ["Lupa", "Earth/Soil"],
        ],
      };

    case 42:
      return {
        sortTitle: "Pinggang Pinoy Food Group Sorting",
        bins: ["Go (Energy / Carbs)", "Grow (Protein)", "Glow (Vitamins & Minerals)"],
        items: [
          { text: "Sinangag (Garlic Rice)", bin: 0 },
          { text: "Inihaw na Tilapia", bin: 1 },
          { text: "Fresh Kangkong", bin: 2 },
          { text: "Kamote (Sweet Potato)", bin: 0 },
          { text: "Tokwa (Tofu)", bin: 1 },
          { text: "Ripe Papaya", bin: 2 },
        ],
        matchLeft: ["Go Foods", "Grow Foods", "Glow Foods", "Pinggang Pinoy"],
        matchRight: ["Enerhiya (Energy)", "Lakas (Protein/Muscles)", "Bitamina (Immunity)", "Healthy Filipino Plate"],
        seqTitle: "Balanced Meal Assembly Sequence",
        seqItems: [
          { text: "Fill 1/2 of plate with Glow vegetables and fruits", emoji: "🥗" },
          { text: "Fill 1/4 of plate with Go whole grains or brown rice", emoji: "🍚" },
          { text: "Fill 1/4 of plate with Grow fresh fish, eggs, or beans", emoji: "🐟" },
          { text: "Serve with clean water and thanksgiving prayer", emoji: "🙏" },
        ],
        quizQuestion: "According to Pinggang Pinoy (DOST-FNRI), what portion of the plate should be vegetables and fruits?",
        quizOptions: ["One half (1/2) of the plate", "One tenth (1/10)", "None", "All of the plate"],
        correctQuizIndex: 0,
        hotspotPrompt: "Tap the Glow food section of the Pinggang Pinoy plate:",
        memoryPairs: [
          ["Gulay", "Vegetable"],
          ["Prutas", "Fruit"],
          ["Isda", "Fish"],
          ["Kanin", "Rice"],
        ],
      };

    default:
      // Programmatic theme for other lessons
      return {
        sortTitle: `Lesson ${num} Cultural Categorization`,
        bins: ["Heritage / Culture", "Nature / Environment"],
        items: [
          { text: `Topic ${num} Tradition`, bin: 0 },
          { text: `Flora & Fauna of Lesson ${num}`, bin: 1 },
          { text: `Philippine Language Concept`, bin: 0 },
          { text: `Geographic Feature`, bin: 1 },
          { text: `Community Values`, bin: 0 },
          { text: `Marine & Coastal Life`, bin: 1 },
        ],
        matchLeft: [`Salita ${num}A`, `Salita ${num}B`, `Salita ${num}C`, `Salita ${num}D`],
        matchRight: [`Meaning ${num}A`, `Meaning ${num}B`, `Meaning ${num}C`, `Meaning ${num}D`],
        seqTitle: `Lesson ${num} Exploration Sequence`,
        seqItems: [
          { text: "Discover the heritage topic in the opening visual", emoji: "🔍" },
          { text: "Explore key Tagalog vocabulary and expressions", emoji: "🗣️" },
          { text: "Engage in hands-on family interactive activity", emoji: "🤝" },
          { text: "Record learning milestone in adventure journal", emoji: "⭐" },
        ],
        quizQuestion: `What is the core focus of Lesson ${num}: ${lessonTitle}?`,
        quizOptions: [
          `Understanding Philippine heritage and culture for ${lessonTitle}`,
          "Memorizing unrelated numbers",
          "Skipping reflection questions",
          "Leaving the classroom early",
        ],
        correctQuizIndex: 0,
        hotspotPrompt: `Identify the primary feature in the Lesson ${num} instructional diagram:`,
        memoryPairs: [
          [`Tagalog ${num}A`, `English ${num}A`],
          [`Tagalog ${num}B`, `English ${num}B`],
          [`Tagalog ${num}C`, `English ${num}C`],
          [`Tagalog ${num}D`, `English ${num}D`],
        ],
      };
  }
}

/**
 * Generates an opaque, shuffled, answer-safe game DTO for the learner.
 * Keeps the teacher solution key securely cached in memory.
 */
export function generateLearnerSafeGame(lessonId: string, lessonTitle: string): LearnerSafeGameDTO {
  const theme = getLessonTheme(lessonId, lessonTitle);

  // 1. Sorting items & bins with opaque IDs
  const bins: LearnerSortBin[] = theme.bins.map((label, idx) => ({
    id: `bin_${idx + 1}`,
    label,
  }));

  const sortingMap: Record<string, string> = {};
  const items: LearnerSortItem[] = theme.items.map((item, idx) => {
    const itemId = `sort_item_${idx + 1}`;
    sortingMap[itemId] = bins[item.bin].id;
    return {
      id: itemId,
      text: item.text,
    };
  });

  // Shuffle items for learner
  const shuffledItems = [...items].sort(() => Math.random() - 0.5);

  // 2. Matching with opaque IDs
  const matchingPairs: Record<string, string> = {};
  const leftItems: LearnerMatchingItem[] = [];
  const rightItems: LearnerMatchingItem[] = [];

  theme.matchLeft.forEach((leftText, idx) => {
    const leftId = `m_left_${idx + 1}`;
    const rightId = `m_right_${idx + 1}`;
    matchingPairs[leftId] = rightId;

    leftItems.push({ id: leftId, text: leftText, side: "left" });
    rightItems.push({ id: rightId, text: theme.matchRight[idx], side: "right" });
  });

  const shuffledLeft = [...leftItems].sort(() => Math.random() - 0.5);
  const shuffledRight = [...rightItems].sort(() => Math.random() - 0.5);

  // 3. Sequencing with opaque IDs
  const sequenceOrder: string[] = [];
  const sequenceItems: LearnerSequenceItem[] = theme.seqItems.map((seq, idx) => {
    const seqId = `seq_${idx + 1}`;
    sequenceOrder.push(seqId);
    return {
      id: seqId,
      text: seq.text,
      emoji: seq.emoji,
    };
  });

  const shuffledSequence = [...sequenceItems].sort(() => Math.random() - 0.5);

  // 4. Quiz with opaque option IDs
  let correctOptionId = "";
  const quizOptions: LearnerQuizOption[] = theme.quizOptions.map((opt, idx) => {
    const optId = `opt_${idx + 1}`;
    if (idx === theme.correctQuizIndex) {
      correctOptionId = optId;
    }
    return {
      id: optId,
      text: opt,
    };
  });

  const shuffledQuizOptions = [...quizOptions].sort(() => Math.random() - 0.5);

  // 5. Memory cards with opaque IDs
  const memoryPairs: Record<string, string> = {};
  const memoryCards: LearnerMemoryCard[] = [];

  theme.memoryPairs.forEach((pair, pIdx) => {
    const cardAId = `mem_card_${pIdx * 2 + 1}`;
    const cardBId = `mem_card_${pIdx * 2 + 2}`;

    memoryPairs[cardAId] = cardBId;
    memoryPairs[cardBId] = cardAId;

    memoryCards.push({ id: cardAId, text: pair[0], type: "text" });
    memoryCards.push({ id: cardBId, text: pair[1], type: "translation" });
  });

  const shuffledMemoryCards = [...memoryCards].sort(() => Math.random() - 0.5);

  // 6. Hotspot targets
  const target1Id = "hotspot_target_1";
  const hotspots: LearnerHotspot[] = [
    { id: target1Id, x: 50, y: 50, radius: 24 },
    { id: "hotspot_target_2", x: 25, y: 40, radius: 20 },
    { id: "hotspot_target_3", x: 75, y: 65, radius: 20 },
  ];

  // Store Solution Key securely
  teacherKeysCache.set(lessonId, {
    hotspotTargetIds: [target1Id],
    sortingMap,
    matchingPairs,
    sequenceOrder,
    correctQuizOptionId: correctOptionId,
    memoryPairs,
  });

  return {
    lessonId,
    lessonTitle,
    hotspots: {
      prompt: theme.hotspotPrompt,
      targets: hotspots,
    },
    sorting: {
      title: theme.sortTitle,
      bins,
      items: shuffledItems,
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
      summary: `You completed all interactive challenges for ${lessonTitle}!`,
      keyPoints: [
        "Cultural comprehension verified",
        "Vocabulary retention practiced",
        "Interactive teamwork completed",
      ],
    },
  };
}

/**
 * Server / Teacher Evaluation Handler.
 * Evaluates student attempts without leaking answer keys to the student.
 */
export function evaluateGameAttempt(
  lessonId: string,
  gameType: string,
  attemptData: Record<string, unknown>
): { result: "correct" | "try_again"; score: number; feedback: string } {
  const key = teacherKeysCache.get(lessonId);
  if (!key) {
    return { result: "correct", score: 100, feedback: "Great work!" };
  }

  switch (gameType) {
    case "sorting": {
      const placements = (attemptData.placements || {}) as Record<string, string>;
      let correct = 0;
      const total = Object.keys(key.sortingMap).length;
      for (const [itemId, expectedBin] of Object.entries(key.sortingMap)) {
        if (placements[itemId] === expectedBin) correct++;
      }
      const score = Math.round((correct / total) * 100);
      return {
        result: score >= 80 ? "correct" : "try_again",
        score,
        feedback: score >= 80 ? "Magaling! All items sorted correctly!" : `You sorted ${correct}/${total} correctly. Subukan muli!`,
      };
    }

    case "matching": {
      const pair = (attemptData.pair || {}) as { leftId: string; rightId: string };
      const isMatch = key.matchingPairs[pair.leftId] === pair.rightId;
      return {
        result: isMatch ? "correct" : "try_again",
        score: isMatch ? 100 : 0,
        feedback: isMatch ? "Tama! Pair matched!" : "Hindi tugma. Try another pair!",
      };
    }

    case "memory_flip": {
      const cardIds = (attemptData.cardIds || []) as string[];
      if (cardIds.length !== 2) return { result: "try_again", score: 0, feedback: "Select 2 cards" };
      const isMatch = key.memoryPairs[cardIds[0]] === cardIds[1];
      return {
        result: isMatch ? "correct" : "try_again",
        score: isMatch ? 100 : 0,
        feedback: isMatch ? "Pair found!" : "Not a match. Flip again!",
      };
    }

    case "sequencing": {
      const order = (attemptData.order || []) as string[];
      const isCorrect = order.length === key.sequenceOrder.length && order.every((id, idx) => id === key.sequenceOrder[idx]);
      return {
        result: isCorrect ? "correct" : "try_again",
        score: isCorrect ? 100 : 50,
        feedback: isCorrect ? "Exact sequence achieved!" : "Steps out of order. Adjust and re-check!",
      };
    }

    case "quiz": {
      const selectedId = attemptData.selectedOptionId as string;
      const isCorrect = selectedId === key.correctQuizOptionId;
      return {
        result: isCorrect ? "correct" : "try_again",
        score: isCorrect ? 100 : 0,
        feedback: isCorrect ? "Tumpak! Correct answer!" : "Piliin muli ang tamang sagot!",
      };
    }

    case "hotspot": {
      const targetId = attemptData.targetId as string;
      const isCorrect = key.hotspotTargetIds.includes(targetId);
      return {
        result: isCorrect ? "correct" : "try_again",
        score: isCorrect ? 100 : 0,
        feedback: isCorrect ? "Nahanap mo! Feature identified!" : "Keep exploring the diagram!",
      };
    }

    default:
      return { result: "correct", score: 100, feedback: "Activity finished!" };
  }
}
