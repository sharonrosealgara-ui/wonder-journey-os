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
  | "reflection"
  | "challenge"
  | "memory"
  | "complete";

export type Slide = {
  id: string;
  kind: SlideKind;
  title: string;
  emoji: string;
  mascot: Mascot;
  section?: LessonSection; // for story/learning slides
};

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
  reflection: mascots.isla,
  challenge: mascots.kiko,
  memory: mascots.mangga,
  complete: mascots.tala,
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
  const push = (kind: SlideKind, title: string, emoji: string, section?: LessonSection) =>
    slides.push({ id: `${kind}-${slides.length}`, kind, title, emoji, mascot: guideFor[kind], section });

  push("welcome", "Welcome Explorers!", "🌴");
  push("blessings", "Morning Blessings", "🙏");
  push("prayer", "Opening Prayer", "🕊️");
  push("mission", "Today's Mission", "🎯");

  lesson.sections.forEach((section, i) => {
    push(i === 0 ? "story" : "learning", section.heading, section.emoji, section);
  });

  if (lesson.phrases && lesson.phrases.length > 0) {
    push("vocab", "Words for the Adventure", "💬");
  }
  if (lesson.videoLinks.length > 0) {
    push("video", "Adventure Videos", "🎬");
  }
  if (lesson.phrases && lesson.phrases.length >= 3) {
    push("game", "Matching Game", "🎮");
  }
  if (lesson.recipeId) {
    push("recipe", "Cooking Time!", "👩‍🍳");
  }
  push("quiz", "Adventure Quiz", "🧠");
  push("reflection", "Reflection", "💭");
  push("challenge", "Family Challenge", "🏆");
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

// distractorCount: 1 = Younger Explorer Mode (2 choices), 2 = Older Explorer Challenge (3 choices)
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

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// YouTube helper: real video URLs become privacy-friendly embeds,
// search links stay as open-in-new-tab cards.
export function getYouTubeEmbed(url: string): string | null {
  const watch = url.match(/[?&]v=([\w-]{6,})/);
  const short = url.match(/youtu\.be\/([\w-]{6,})/);
  const id = watch?.[1] ?? short?.[1];
  return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
}
