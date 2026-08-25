// ─────────────────────────────────────────────────────────────
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
  gameToken?: string;
  instanceId?: string;
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
      summary: `Adventure summary for ${lessonTitle}`,
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
