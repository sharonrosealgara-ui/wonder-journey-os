// ─────────────────────────────────────────────────────────────
// ADVENTURE THEATER SLIDE ENGINE
// Turns any Lesson config object into a full theater episode:
// Welcome → Blessings → Prayer → Mission → Story → Learning →
// Vocabulary → Videos → Game → Recipe → Quiz → Reflection →
// Family Challenge → Memory Capture → Adventure Complete.
// New lessons get a full theater experience with zero extra code.
// ─────────────────────────────────────────────────────────────

import type { Lesson, LessonSection, PhrasePair } from "@/config/lessons";
import { mascots, type Mascot } from "@/config/mascots";
import type {
  Discovery,
  RichExplanationSection,
  MediaMoment,
  AgeDifferentiation,
  HandsOnTask,
  Game,
  FamilyPremiumAssessment,
  FamilyKnowledgeCheck,
  MisconceptionItem
} from "@/lib/curriculum-schema";

// Three-tier Age Adaptation: the family learns together on one screen,
// each child gets age-appropriate challenge (Decision 042).
export type ExplorerLevel = "explorer" | "adventure" | "trailblazer";

// Adventure roles, never "grade levels" — the tier is a costume the
// explorer wears, not a ranking (CURRICULUM_FRAMEWORK: no sibling rankings).
export const levelMeta: Record<ExplorerLevel, { emoji: string; label: string; ages: string }> = {
  explorer: { emoji: "🐣", label: "Explorer", ages: "7–8" },
  adventure: { emoji: "🦅", label: "Adventure", ages: "9–10" },
  trailblazer: { emoji: "🏔️", label: "Trailblazer", ages: "11–12" },
};

export function levelForAge(age: number): ExplorerLevel {
  return age <= 8 ? "explorer" : age <= 10 ? "adventure" : "trailblazer";
}

export type SlideKind =
  | "welcome"
  | "blessings"
  | "prayer"
  | "mission"
  | "story"
  | "learning"
  | "vocab"
  | "video"
  | "game"
  | "recipe"
  | "quiz"
  | "academy"
  | "reflection"
  | "challenge"
  | "memory"
  | "complete"
  // Premium Kinds
  | "hook"
  | "essentialQuestion"
  | "discoveries"
  | "richExplanation"
  | "keyFacts"
  | "mediaMoment"
  | "guidedDiscussion"
  | "ageChallenge"
  | "handsOnMission"
  | "checkUnderstanding"
  | "premiumAssessment";

export type SlideContentMap = {
  welcome: undefined;
  blessings: undefined;
  prayer: undefined;
  mission: undefined;
  story: undefined;
  learning: undefined;
  vocab: undefined;
  video: undefined;
  game: Game | undefined;
  recipe: undefined;
  quiz: undefined;
  academy: undefined;
  reflection: string | undefined;
  challenge: string | undefined;
  memory: undefined;
  complete: undefined;
  // Premium typed contents
  hook: string;
  essentialQuestion: string;
  discoveries: Discovery[];
  richExplanation: RichExplanationSection;
  keyFacts: string[];
  mediaMoment: MediaMoment;
  guidedDiscussion: string[];
  ageChallenge: AgeDifferentiation;
  handsOnMission: HandsOnTask;
  checkUnderstanding: MisconceptionItem[] | FamilyKnowledgeCheck[];
  premiumAssessment: FamilyPremiumAssessment[];
};

export type Slide = {
  [K in SlideKind]: {
    id: string;
    kind: K;
    title: string;
    emoji: string;
    mascot: Mascot;
    section?: LessonSection;
    content?: SlideContentMap[K];
  };
}[SlideKind];

export type SlideOf<K extends SlideKind> = Extract<Slide, { kind: K }>;

const guideFor: Record<SlideKind, Mascot> = {
  welcome: mascots.kiko,
  blessings: mascots.isla,
  prayer: mascots.isla,
  mission: mascots.kiko,
  story: mascots.kiko,
  learning: mascots.tala,
  vocab: mascots.lila,
  video: mascots.tala,
  game: mascots.lila,
  recipe: mascots.mangga,
  quiz: mascots.lila,
  academy: mascots.tala,
  reflection: mascots.isla,
  challenge: mascots.kiko,
  memory: mascots.mangga,
  complete: mascots.tala,
  // Premium Mascots
  hook: mascots.kiko,
  essentialQuestion: mascots.tala,
  discoveries: mascots.lila,
  richExplanation: mascots.tala,
  keyFacts: mascots.lila,
  mediaMoment: mascots.tala,
  guidedDiscussion: mascots.isla,
  ageChallenge: mascots.kiko,
  handsOnMission: mascots.mangga,
  checkUnderstanding: mascots.lila,
  premiumAssessment: mascots.tala,
};

export function buildMission(lesson: Lesson): string[] {
  const items: string[] = [];
  if (lesson.phrases?.length) items.push(`Learn ${lesson.phrases.length} new Filipino words`);
  items.push(`Explore: ${lesson.subtitle}`);
  if (lesson.recipeId) items.push("Cook something delicious together");
  if (lesson.phrases?.length) items.push("Play the matching game");
  items.push("Pass the adventure quiz");
  if (lesson.destinationId) items.push("Earn a new passport stamp");
  return items;
}

export function buildSlides(lesson: Lesson): Slide[] {
  const slides: Slide[] = [];
  const push = <K extends SlideKind>(kind: K, title: string, emoji: string, section?: LessonSection, content?: SlideContentMap[K]) =>
    slides.push({ id: `${kind}-${slides.length}`, kind, title, emoji, mascot: guideFor[kind], section, content } as any);

  push("welcome", "Welcome Explorers!", "🌴");
  push("blessings", "Morning Blessings", "🙏");
  push("prayer", "Opening Prayer", "🕊️");

  const isPremium = !!lesson.premiumContent?.richExplanation || !!lesson.premiumContent?.adventureHook;

  if (isPremium) {
    // Premium Flow
    if (lesson.premiumContent?.adventureHook) push("hook", "Adventure Hook", "🎣", undefined, lesson.premiumContent.adventureHook);
    if (lesson.premiumContent?.essentialQuestion) push("essentialQuestion", "Essential Question", "❓", undefined, lesson.premiumContent.essentialQuestion);

    // Core Learning
    if (lesson.premiumContent?.richExplanation) {
      lesson.premiumContent.richExplanation.forEach((re) => push("richExplanation", re.heading || "Explanation", re.emoji || "📖", undefined, re));
    }
    if (lesson.premiumContent?.discoveries) push("discoveries", "Discoveries", "🔍", undefined, lesson.premiumContent.discoveries);
    if (lesson.premiumContent?.keyFacts) push("keyFacts", "Key Facts", "💡", undefined, lesson.premiumContent.keyFacts);
    if (lesson.premiumContent?.vocabulary && lesson.premiumContent.vocabulary.length > 0) push("vocab", "Words for the Adventure", "💬");
    if (lesson.premiumContent?.mediaMoments) {
      lesson.premiumContent.mediaMoments.forEach((mm) => push("mediaMoment", mm.requiredType === "video" ? "Video Moment" : "Media Moment", mm.requiredType === "video" ? "🎬" : "📸", undefined, mm));
    }

    // Engagement
    if (lesson.premiumContent?.guidedDiscussion) push("guidedDiscussion", "Guided Discussion", "🗣️", undefined, lesson.premiumContent.guidedDiscussion);
    if (lesson.premiumContent?.ageDifferentiation) push("ageChallenge", "Age Challenge", "⭐", undefined, lesson.premiumContent.ageDifferentiation);
    if (lesson.premiumContent?.handsOnTask) push("handsOnMission", "Hands-On Mission", "🛠️", undefined, lesson.premiumContent.handsOnTask);
    if (lesson.premiumContent?.game) push("game", lesson.premiumContent.game.title || "Game", "🎮", undefined, lesson.premiumContent.game);

    // Assessment & Reflection
    if (lesson.premiumContent?.misconceptions && lesson.premiumContent.misconceptions.length > 0) {
      push("checkUnderstanding", "Check Your Thinking", "💡", undefined, lesson.premiumContent.misconceptions);
    } else if (lesson.premiumContent?.knowledgeCheck && lesson.premiumContent.knowledgeCheck.length > 0) {
      push("checkUnderstanding", "Check for Understanding", "💡", undefined, lesson.premiumContent.knowledgeCheck);
    }

    if (lesson.premiumContent?.premiumAssessment) push("premiumAssessment", "Assessment", "🧠", undefined, lesson.premiumContent.premiumAssessment);
    if (lesson.premiumContent?.learnerReflection) push("reflection", "Reflection", "💭", undefined, lesson.premiumContent.learnerReflection);
    if (lesson.familyChallenge) push("challenge", "Family Challenge", "🏆", undefined, lesson.familyChallenge);
  } else {
    // Legacy Flow
    push("mission", "Today's Mission", "🎯");

    lesson.sections?.forEach((section, i) => {
      push(i === 0 ? "story" : "learning", section.heading, section.emoji, section);
    });

    if (lesson.phrases && lesson.phrases.length > 0) {
      push("vocab", "Words for the Adventure", "💬");
    }
    if (lesson.videoLinks && lesson.videoLinks.length > 0) {
      push("video", "Adventure Videos", "🎬");
    }
    if (lesson.phrases && lesson.phrases.length >= 3) {
      push("game", "Matching Game", "🎮");
    }
    if (lesson.recipeId) {
      push("recipe", "Cooking Time!", "👩‍🍳");
    }
    push("quiz", "Adventure Quiz", "🧠");
    push("academy", "Adventure Academy", "🎓");
    push("reflection", "Reflection", "💭");
    if (lesson.familyChallenge) {
      push("challenge", "Family Challenge", "🏆");
    }
  }

  push("memory", "Capture Today's Memory", "📷");
  push("complete", "Adventure Complete!", "🌅");

  return slides;
}

// ── Gentle quiz generator ────────────────────────────────────
// Builds multiple-choice questions from the lesson's phrases.
// Celebration-first: wrong answers get a retry, never a red X.

export type QuizQuestion = {
  prompt: string;
  options: string[];
  answerIndex: number;
};

type Direction = { from: keyof PhrasePair; to: keyof PhrasePair; label: string };

const directions: Direction[] = [
  { from: "english", to: "tagalog", label: "in Tagalog" },
  { from: "english", to: "hiligaynon", label: "in Hiligaynon" },
  { from: "tagalog", to: "english", label: "in English" },
  { from: "hiligaynon", to: "english", label: "in English" },
];

export function buildQuiz(phrases: PhrasePair[], seedCount = 5, distractorCount = 2): QuizQuestion[] {
  if (phrases.length < 2) return [];
  const count = Math.min(seedCount, Math.max(3, phrases.length));
  const questions: QuizQuestion[] = [];
  const pool = shuffle(phrases);

  for (let i = 0; i < count; i++) {
    const phrase = pool[i % pool.length];
    const dir = directions[Math.floor(Math.random() * directions.length)];
    const answer = String(phrase[dir.to] ?? "");
    const promptWord = String(phrase[dir.from] ?? "");
    if (!answer || !promptWord) continue;

    const distractors = shuffle(
      phrases.filter((p) => p !== phrase && p[dir.to] && p[dir.to] !== answer)
    )
      .slice(0, distractorCount)
      .map((p) => String(p[dir.to]));

    const options = shuffle([answer, ...distractors]);
    questions.push({
      prompt: `How do you say "${promptWord}" ${dir.label}?`,
      options,
      answerIndex: options.indexOf(answer),
    });
  }
  return questions;
}

export function buildAcademy(
  lesson: Lesson,
  level: ExplorerLevel
): { english: string[]; math: string[] } {
  const phrases = lesson.phrases ?? [];
  const p1 = phrases[0];
  const p2 = phrases[1] ?? p1;
  const wordCount = Math.max(phrases.length, 3);
  const spellable = [...phrases]
    .map((p) => p.english.replace(/[^a-zA-Z ]/g, "").trim())
    .filter((w) => w && !w.includes(" "))
    .sort((a, b) => a.length - b.length)[0];

  const english: string[] =
    level === "explorer"
      ? [
          spellable ? `Spell "${spellable}" out loud together — one letter each!` : "Spell your name out loud, one letter at a time!",
          p2 ? `Point and say: which picture matches "${p2.english}"? Find something like it in the room!` : "Find something in the room and name it in English!",
          `Retell today's story in 3 short sentences — everyone adds one.`,
          p1 ? `Say "${p1.tagalog}" and "${p1.hiligaynon}" — which sounds do they share with English?` : "Say today's new word in all three languages!",
        ]
      : level === "adventure"
      ? [
          p1 ? `Use "${p1.english}" and "${p2.english}" together in one full sentence.` : "Make one full sentence about today's adventure.",
          `Retell today's story in your own words — beginning, middle, end.`,
          phrases.length >= 2
            ? `Spelling bee: take turns spelling the English words from today's vocabulary — start easy, get harder!`
            : "Have a mini spelling bee with today's words.",
          `Finish this sentence in writing: "The most amazing thing I discovered today was..."`,
        ]
      : [
          `Write a 4–5 sentence paragraph about today's discovery — with a topic sentence and a closing sentence.`,
          p1 ? `Teach time! Explain to a younger explorer what "${p1.english}" means in Tagalog AND Hiligaynon, with an example.` : "Teach today's topic to a younger explorer in one minute.",
          `Debate gently: what was the MOST important idea today, and why? Defend your answer.`,
          `Interview a parent: ask two questions about today's topic and summarize their answers aloud.`,
        ];

  const math: string[] =
    level === "explorer"
      ? [
          `Count today's new words: we learned ${wordCount}! Now count backwards from ${wordCount + 5}.`,
          `If each explorer gets 2 stickers and there are 4 explorers, how many stickers is that?`,
          `Pattern time: 🥭🌺🥭🌺… what comes next? Make your own pattern with 3 things.`,
          `Shape hunt: find 3 circles and 2 rectangles in the room. Which did you find first?`,
        ]
      : level === "adventure"
      ? [
          `We learned ${wordCount} words today. If we learn ${wordCount} words every class, how many after 4 classes?`,
          `The Philippines has 7,641 islands. Round that to the nearest hundred, then the nearest thousand.`,
          lesson.recipeId
            ? `Our recipe serves 8. How would you split it evenly for our family of 7? What's left?`
            : `Class started at 9:00 and lasts 90 minutes. What time does it end?`,
          `If a jeepney ride costs 13 pesos, how much do 4 riders pay together?`,
        ]
      : [
          lesson.recipeId
            ? `Our recipe uses 2 cups of cream for 8 servings. How much cream for 12 servings? Show your thinking.`
            : `A flight to Manila covers about 11,000 km in 14 hours. Roughly how many km per hour is that?`,
          `The Philippines comprises about 7,641 islands. Estimate that as a fraction and a percent.`,
          `Plan it: with ₱500 and pancit ingredients costing ₱85, ₱120, ₱65, and ₱95 — what's the total and the change?`,
          `Word problem challenge: write your OWN word problem about today's lesson and quiz the family!`,
        ];

  return { english, math };
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function getYouTubeEmbed(url: string): string | null {
  const watch = url.match(/[?&]v=([\w-]{6,})/);
  const short = url.match(/youtu\.be\/([\w-]{6,})/);
  const id = watch?.[1] ?? short?.[1];
  return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
}
