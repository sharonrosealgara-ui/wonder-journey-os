"use client";

import { useMemo, useState } from "react";
import type { PhrasePair } from "@/config/lessons";
import { buildQuiz, type ExplorerLevel } from "@/lib/slides";

// Gentle adventure quiz: multiple choice from the lesson's phrases.
// Wrong answers pulse softly and allow another try — never a red X.

export function AdventureQuiz({
  phrases,
  onFinish,
  level = "adventure",
}: {
  phrases: PhrasePair[];
  onFinish: (score: number, total: number) => void;
  level?: ExplorerLevel;
}) {
  // Explorer (7–8): 2 choices · Adventure (9–10): 3 choices · Trailblazer (11–12): 3 + bonus.
  const questions = useMemo(
    () => buildQuiz(phrases, 5, level === "explorer" ? 1 : 2),
    [phrases, level]
  );
  const [index, setIndex] = useState(0);
  const [firstTryScore, setFirstTryScore] = useState(0);
  const [attempted, setAttempted] = useState(false);
  const [wrongPick, setWrongPick] = useState<number | null>(null);
  const [correctPick, setCorrectPick] = useState<number | null>(null);
  const [done, setDone] = useState(false);

  if (questions.length === 0) {
    return (
      <div className="wj-card p-8 text-center">
        <p>This adventure has no quiz words — straight to the reflection! 🎉</p>
        <button className="wj-btn mt-4" onClick={() => onFinish(1, 1)}>
          Continue
        </button>
      </div>
    );
  }

  const q = questions[index];
  const isLast = index === questions.length - 1;

  function pick(i: number) {
    if (correctPick !== null) return;
    if (i === q.answerIndex) {
      setCorrectPick(i);
      if (!attempted) setFirstTryScore((s) => s + 1);
      setTimeout(() => {
        if (isLast) {
          setDone(true);
        } else {
          setIndex((x) => x + 1);
          setAttempted(false);
          setCorrectPick(null);
          setWrongPick(null);
        }
      }, 900);
    } else {
      setAttempted(true);
      setWrongPick(i);
      setTimeout(() => setWrongPick(null), 700);
    }
  }

  if (done) {
    const total = questions.length;
    const stars = firstTryScore === total ? 3 : firstTryScore >= total - 1 ? 2 : 1;
    return (
      <div className="wj-card wj-pop-in mx-auto max-w-xl p-8 text-center">
        <div className="text-6xl">{"⭐".repeat(stars)}</div>
        <h2 className="wj-outline mt-3 font-display text-3xl">Great Job, Explorer!</h2>
        <p className="font-hand mt-2 text-xl text-ink-soft">
          {firstTryScore} of {total} first-try — and you figured out every single one!
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <span className="wj-chip">🧠 Quiz complete</span>
          <span className="wj-chip">💬 {phrases.length} words practiced</span>
          <span className="wj-chip">
            {level === "explorer" ? "🐣 Explorer" : level === "adventure" ? "🦅 Adventure" : "🏔️ Trailblazer"}
          </span>
        </div>
        {level === "adventure" && (
          <p className="font-hand mt-3 text-lg text-ink-soft">
            🦅 Bonus challenge: teach your favorite new word to a younger explorer!
          </p>
        )}
        {level === "trailblazer" && (
          <p className="font-hand mt-3 text-lg text-ink-soft">
            🏔️ Bonus challenge: lead the family — quiz everyone on today&apos;s words from memory!
          </p>
        )}
        <button className="wj-btn mt-6" onClick={() => onFinish(firstTryScore, total)}>
          Continue the Adventure 🚀
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-3 flex items-center justify-between">
        <span className="wj-chip">
          Question {index + 1} of {questions.length}
        </span>
        <span className="wj-chip">⭐ {firstTryScore}</span>
      </div>
      <div className="wj-card p-6 sm:p-8">
        <h2 className="font-display text-2xl text-ink">{q.prompt}</h2>
        <div className="mt-5 space-y-3">
          {q.options.map((opt, i) => {
            const isCorrect = correctPick === i;
            const isWrong = wrongPick === i;
            return (
              <button
                key={`${opt}-${i}`}
                onClick={() => pick(i)}
                className={`block w-full rounded-2xl border-2 p-4 text-left font-display text-lg transition-all ${
                  isCorrect
                    ? "border-palm bg-palm/20 text-palm-deep"
                    : isWrong
                    ? "animate-pulse border-hibiscus bg-hibiscus/10 text-hibiscus-deep"
                    : "border-sand-deep bg-white hover:border-mango hover:bg-mango/10"
                }`}
              >
                {isCorrect ? "✅ " : isWrong ? "💭 " : ""}
                {opt}
              </button>
            );
          })}
        </div>
        {wrongPick !== null && (
          <p className="font-hand mt-3 text-center text-ink-soft">
            Almost! Take another look — you&apos;ve got this! 💛
          </p>
        )}
      </div>
    </div>
  );
}
