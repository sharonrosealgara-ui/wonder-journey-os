const fs = require("fs");
const path = require("path");

const sourceFile = path.join(__dirname, "../src/lib/lesson-game-generator.ts");
const content = fs.readFileSync(sourceFile, "utf8");

// Extract the getLessonTheme function
const themeMatch = content.match(/function getLessonTheme\(lessonId:\s*string,\s*lessonTitle:\s*string\)\s*\{[\s\S]*?\n\}/);

if (!themeMatch) {
  console.error("Could not find getLessonTheme in lesson-game-generator.ts");
  process.exit(1);
}

const getLessonThemeCode = themeMatch[0];

const serverDefinitionsContent = `import "server-only";
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
  return \`\${prefix}_\${crypto.randomBytes(6).toString("hex")}\`;
}

${getLessonThemeCode}

export function generateServerLearnerGame(lessonId: string, lessonTitle?: string): LearnerSafeGameDTO {
  const resolvedTitle = lessonTitle || \`Lesson \${lessonId}\`;
  const theme = getLessonTheme(lessonId, resolvedTitle);

  // 1. Sorting: generate random bin IDs and item IDs
  const bins: LearnerSortBin[] = theme.bins.map((label, idx) => ({
    id: genId(\`bin_\${idx}\`),
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
    const leftId = genId(\`match_l_\${i}\`);
    const rightId = genId(\`match_r_\${i}\`);
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
    const optId = genId(\`quiz_opt_\${idx}\`);
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
    const cardAId = genId(\`mem_a_\${idx}\`);
    const cardBId = genId(\`mem_b_\${idx}\`);
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
      title: \`Lesson \${lessonId} Adventure Review\`,
      summary: \`You completed all interactive challenges for \${resolvedTitle}!\`,
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
`;

fs.writeFileSync(path.join(__dirname, "../src/lib/server-game-definitions.ts"), serverDefinitionsContent);
console.log("✓ Created src/lib/server-game-definitions.ts with 100% server-only game definitions and solution keys.");

// Now create clean client-safe src/lib/lesson-game-generator.ts
const clientInterfacesContent = `// ─────────────────────────────────────────────────────────────
// WONDER JOURNEY OS — CLIENT GAME INTERFACES & SAFE DTOs
// Client-safe types and helper functions with ZERO solution keys.
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

export function createInitialBlankGameDTO(lessonId: string, lessonTitle: string): LearnerSafeGameDTO {
  return {
    lessonId,
    lessonTitle,
    hotspots: {
      prompt: "Explore the interactive cultural visual",
      targets: [
        { id: "hotspot_1", x: 50, y: 50, radius: 24 },
        { id: "hotspot_2", x: 25, y: 40, radius: 20 },
        { id: "hotspot_3", x: 75, y: 65, radius: 20 },
      ],
    },
    sorting: {
      title: "Categorization Challenge",
      bins: [
        { id: "bin_0", label: "Category 1" },
        { id: "bin_1", label: "Category 2" },
      ],
      items: [
        { id: "item_0", text: "Loading challenge..." },
      ],
    },
    matching: {
      title: "Vocabulary Matching",
      leftItems: [{ id: "l_0", text: "Loading...", side: "left" }],
      rightItems: [{ id: "r_0", text: "Loading...", side: "right" }],
    },
    sequencing: {
      title: "Step Sequencing",
      items: [
        { id: "s_0", text: "Step 1", emoji: "📌" },
        { id: "s_1", text: "Step 2", emoji: "📌" },
      ],
    },
    quiz: {
      question: "Interactive Knowledge Check",
      options: [
        { id: "opt_0", text: "Option A" },
        { id: "opt_1", text: "Option B" },
      ],
    },
    memory: {
      title: "Heritage Memory Match",
      cards: [
        { id: "c_0", text: "Card A", type: "text" },
        { id: "c_1", text: "Card B", type: "translation" },
      ],
    },
    review: {
      title: "Lesson Review",
      summary: \`Adventure summary for \${lessonTitle}\`,
      keyPoints: [
        "Interactive challenge completed",
        "Cultural understanding deepened",
      ],
    },
  };
}

// Backward-compatibility alias that returns safe blank structure until API fetches
export function generateLearnerSafeGame(lessonId: string, lessonTitle: string): LearnerSafeGameDTO {
  return createInitialBlankGameDTO(lessonId, lessonTitle);
}
`;

fs.writeFileSync(sourceFile, clientInterfacesContent);
console.log("✓ Replaced src/lib/lesson-game-generator.ts with clean client-safe interfaces.");
