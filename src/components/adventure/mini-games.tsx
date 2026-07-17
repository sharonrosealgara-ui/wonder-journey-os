"use client";

import { useMemo, useState } from "react";
import { lessons, type Lesson, type PhrasePair } from "@/config/lessons";
import { shuffle, type ExplorerLevel } from "@/lib/slides";
import { sfx } from "@/lib/sound";

// 🎮 MINI-GAMES — quick, joyful games built from the lesson's OWN words
// and facts, so play and learning are the same thing. All are keyboard-
// free (tap only) so the youngest explorers can join. No audio files —
// the gentle sounds are synthesized (lib/sound).
//
// Each game reports a 1–3 ⭐ rating through onResult so the Game Arcade
// can track "beat your best" and tally sibling turns. Difficulty scales
// with the explorer's age tier (Decision 042).

type Lang = "tagalog"; // Tagalog only (Sharon's decision)

// how many pairs / questions per age tier
const DIFFICULTY: Record<ExplorerLevel, { pairs: number; questions: number }> = {
  explorer: { pairs: 4, questions: 5 },
  adventure: { pairs: 5, questions: 7 },
  trailblazer: { pairs: 6, questions: 9 },
};

type GameProps = {
  phrases: PhrasePair[];
  lang: Lang;
  level: ExplorerLevel;
  onResult?: (stars: number) => void;
};

/* ═══════════════════════════════════════════════════════════════
   1) MEMORY FLIP — classic concentration. Flip two cards to find an
   English word and its Filipino partner.
   ══════════════════════════════════════════════════════════════ */

type FlipCard = { key: string; pairId: string; label: string; side: "english" | "filipino" };

export function MemoryFlip({ phrases, lang, level, onResult }: GameProps) {
  const [round, setRound] = useState(0);
  const nPairs = DIFFICULTY[level].pairs;
  const cards = useMemo(() => {
    const pool = shuffle(phrases.filter((p) => p[lang])).slice(0, nPairs);
    const all: FlipCard[] = pool.flatMap((p) => [
      { key: p.english + "-en", pairId: p.english, label: p.english, side: "english" as const },
      { key: p.english + "-fil", pairId: p.english, label: p[lang], side: "filipino" as const },
    ]);
    return shuffle(all);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phrases, lang, round, nPairs]);

  const [flipped, setFlipped] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [moves, setMoves] = useState(0);
  const [reported, setReported] = useState(false);

  const totalPairs = cards.length / 2;
  const won = matched.length > 0 && matched.length === totalPairs;

  if (won && !reported) {
    // 3⭐ = near-perfect, 2⭐ = good, 1⭐ = finished
    const stars = moves <= totalPairs + 1 ? 3 : moves <= totalPairs * 2 ? 2 : 1;
    setReported(true);
    onResult?.(stars);
  }

  function flip(card: FlipCard) {
    if (busy || flipped.includes(card.key) || matched.includes(card.pairId)) return;
    sfx.tap();
    const now = [...flipped, card.key];
    setFlipped(now);
    if (now.length < 2) return;
    setMoves((m) => m + 1);
    const a = cards.find((c) => c.key === now[0])!;
    const b = cards.find((c) => c.key === now[1])!;
    if (a.pairId === b.pairId && a.side !== b.side) {
      setTimeout(() => {
        setMatched((prev) => {
          const next = [...prev, a.pairId];
          if (next.length === totalPairs) sfx.celebrate();
          else sfx.correct();
          return next;
        });
        setFlipped([]);
      }, 450);
    } else {
      setBusy(true);
      sfx.tryAgain();
      setTimeout(() => {
        setFlipped([]);
        setBusy(false);
      }, 1000);
    }
  }

  function reset() {
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setReported(false);
    setRound((r) => r + 1);
  }

  if (cards.length === 0) return <EmptyGame />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-ink-soft">Flip two cards — find the matching pair!</p>
        <span className="wj-chip">Moves: {moves}</span>
      </div>
      {won ? (
        <WinCard title="Magaling! 🧠" line={`You cleared the board in ${moves} moves!`} onReplay={reset} />
      ) : (
        <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 sm:gap-3">
          {cards.map((card) => {
            const isUp = flipped.includes(card.key) || matched.includes(card.pairId);
            const isDone = matched.includes(card.pairId);
            return (
              <button
                key={card.key}
                onClick={() => flip(card)}
                disabled={isUp}
                className={`flex min-h-20 items-center justify-center rounded-2xl border-2 p-2 text-center font-display text-sm transition-all duration-200 ${
                  isDone
                    ? "border-palm bg-palm/15 text-palm-deep opacity-70"
                    : isUp
                    ? card.side === "english"
                      ? "border-ocean bg-white text-ink shadow-lg"
                      : "border-ocean bg-ocean/10 text-ocean-deep shadow-lg"
                    : "border-sand-deep bg-gradient-to-br from-sunset to-hibiscus text-2xl text-white hover:scale-105"
                }`}
              >
                {isUp ? (isDone ? `✅ ${card.label}` : card.label) : "🌺"}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   2) WORD SCRAMBLE — the Filipino word's letters are jumbled. Tap the
   tiles in order to spell it, using the English word as a clue.
   ══════════════════════════════════════════════════════════════ */

export function WordScramble({ phrases, lang, level, onResult }: GameProps) {
  const nWords = DIFFICULTY[level].questions;
  const words = useMemo(
    () => shuffle(phrases.filter((p) => p[lang] && !p[lang].includes(" "))).slice(0, nWords),
    [phrases, lang, nWords]
  );
  const [idx, setIdx] = useState(0);
  const [solvedCount, setSolvedCount] = useState(0);
  const word = words[idx];

  if (!word) return <EmptyGame />;

  return (
    <ScrambleRound
      key={`${word.english}-${idx}`}
      answer={word[lang]}
      clue={word.english}
      pronunciation={word.pronunciation}
      progress={`${solvedCount} solved`}
      isLast={idx >= words.length - 1}
      onSolved={(stars) => {
        setSolvedCount((c) => c + 1);
        onResult?.(stars);
      }}
      onNext={() => setIdx((i) => (i + 1) % words.length)}
    />
  );
}

type Tile = { id: number; ch: string };

function ScrambleRound({
  answer,
  clue,
  pronunciation,
  progress,
  isLast,
  onSolved,
  onNext,
}: {
  answer: string;
  clue: string;
  pronunciation?: string;
  progress: string;
  isLast: boolean;
  onSolved: (stars: number) => void;
  onNext: () => void;
}) {
  const letters = useMemo(() => answer.split(""), [answer]);
  const makeTiles = () => scrambleStable(letters).map((ch, i) => ({ id: i, ch }));
  const [pool, setPool] = useState<Tile[]>(makeTiles);
  const [built, setBuilt] = useState<Tile[]>([]);
  const [solved, setSolved] = useState(false);
  const [wrong, setWrong] = useState(false);
  const [hints, setHints] = useState(0);

  function pick(tile: Tile) {
    if (solved) return;
    sfx.tap();
    const nextBuilt = [...built, tile];
    setPool((p) => p.filter((t) => t.id !== tile.id));
    setBuilt(nextBuilt);
    if (nextBuilt.length === letters.length) {
      const guess = nextBuilt.map((t) => t.ch).join("");
      if (guess.toLowerCase() === answer.toLowerCase()) {
        setSolved(true);
        sfx.celebrate();
        // fewer hints = more stars
        onSolved(hints === 0 ? 3 : hints <= 2 ? 2 : 1);
      } else {
        setWrong(true);
        sfx.tryAgain();
      }
    }
  }

  function unpick(tile: Tile) {
    if (solved) return;
    setWrong(false);
    setBuilt((b) => b.filter((t) => t.id !== tile.id));
    setPool((p) => [...p, tile]);
  }

  function clear() {
    setPool(makeTiles());
    setBuilt([]);
    setWrong(false);
  }

  function hint() {
    if (solved) return;
    const nextCh = letters[built.length];
    const tile = pool.find((t) => t.ch.toLowerCase() === nextCh.toLowerCase());
    if (tile) {
      setHints((h) => h + 1);
      sfx.reveal();
      pick(tile);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-ink-soft">Unscramble the word!</p>
        <span className="wj-chip">{progress}</span>
      </div>
      <div className="wj-card p-4 text-center">
        <p className="text-xs font-bold uppercase tracking-wide text-ink-soft">Clue (English)</p>
        <p className="font-display text-2xl text-sunset-deep">💬 {clue}</p>
      </div>
      <div
        className={`flex min-h-16 flex-wrap items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-3 ${
          solved ? "border-palm bg-palm/10" : wrong ? "border-hibiscus bg-hibiscus/10" : "border-sand-deep bg-white/60"
        }`}
      >
        {built.length === 0 && <span className="font-hand text-ink-soft">Tap letters below…</span>}
        {built.map((t) => (
          <button
            key={t.id}
            onClick={() => unpick(t)}
            className="h-11 w-11 rounded-xl border-2 border-ocean bg-ocean/10 font-display text-xl text-ocean-deep shadow-sm"
          >
            {t.ch}
          </button>
        ))}
      </div>
      {solved ? (
        <div className="wj-card wj-pop-in p-6 text-center">
          <div className="text-4xl">🎉</div>
          <p className="mt-2 font-display text-2xl text-palm-deep">{answer}</p>
          {pronunciation && <p className="font-hand text-ink-soft">say it: “{pronunciation}”</p>}
          <button className="wj-btn mt-3" onClick={onNext}>
            {isLast ? "Play again 🔄" : "Next word →"}
          </button>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {pool.map((t) => (
              <button
                key={t.id}
                onClick={() => pick(t)}
                className="h-12 w-12 rounded-xl border-2 border-sand-deep bg-gradient-to-br from-mango/30 to-sunset/20 font-display text-xl text-ink shadow-sm transition-transform hover:scale-110"
              >
                {t.ch}
              </button>
            ))}
          </div>
          <div className="flex justify-center gap-2">
            <button className="wj-btn wj-btn-ghost !px-4 !py-1.5 text-sm" onClick={clear}>🔄 Clear</button>
            <button className="wj-btn wj-btn-ghost !px-4 !py-1.5 text-sm" onClick={hint}>💡 Hint</button>
          </div>
        </>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   3) FACT HUNT — trivia built from the lesson's OWN facts, so EVERY
   lesson has a game (even Values & Cooking, which have no vocab).
   "Spot the true fact about ___" — the right answer is a real fact
   from that section; the decoys are real facts from other topics, so
   nothing false is ever taught.
   ══════════════════════════════════════════════════════════════ */

type TriviaQ = { topic: string; emoji: string; correct: string; options: string[] };

// shorten long bullets to a friendly length without cutting mid-word
function trim(text: string, max = 90): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return clean.slice(0, clean.lastIndexOf(" ", max)).trim() + "…";
}

function buildTrivia(lesson: Lesson, count: number): TriviaQ[] {
  // this lesson's sections that actually carry facts
  const factSections = lesson.sections.filter((s) => s.bullets && s.bullets.length > 0);
  // a big pool of "other" facts for decoys, from every lesson
  const otherFacts: string[] = lessons
    .flatMap((l) => (l.id === lesson.id ? [] : l.sections.flatMap((s) => s.bullets ?? [])))
    .map((b) => trim(b));

  const qs: TriviaQ[] = [];
  for (const s of shuffle(factSections)) {
    const bullets = shuffle(s.bullets!);
    const correct = trim(bullets[0]);
    // decoys: prefer facts from OTHER sections of this lesson, then other lessons
    const localDecoys = lesson.sections
      .filter((x) => x.heading !== s.heading)
      .flatMap((x) => x.bullets ?? [])
      .map((b) => trim(b));
    const decoyPool = shuffle([...localDecoys, ...otherFacts]).filter((d) => d !== correct);
    const options = shuffle([correct, ...unique(decoyPool).slice(0, 3)]);
    if (options.length >= 2) qs.push({ topic: s.heading, emoji: s.emoji, correct, options });
    if (qs.length >= count) break;
  }
  return qs;
}

export function FactHunt({
  lesson,
  level,
  onResult,
}: {
  lesson: Lesson;
  level: ExplorerLevel;
  onResult?: (stars: number) => void;
}) {
  const questions = useMemo(
    () => buildTrivia(lesson, DIFFICULTY[level].questions),
    [lesson, level]
  );
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [reported, setReported] = useState(false);

  if (questions.length === 0) return <EmptyGame facts />;

  const q = questions[i];

  if (done) {
    if (!reported) {
      const pct = score / questions.length;
      setReported(true);
      onResult?.(pct >= 0.9 ? 3 : pct >= 0.6 ? 2 : 1);
    }
    return (
      <WinCard
        title="Fact Hunter! 🏆"
        line={`You spotted ${score} of ${questions.length} true facts!`}
        onReplay={() => {
          setI(0);
          setScore(0);
          setPicked(null);
          setDone(false);
          setReported(false);
        }}
      />
    );
  }

  function choose(opt: string) {
    if (picked) return;
    setPicked(opt);
    if (opt === q.correct) {
      setScore((s) => s + 1);
      sfx.correct();
    } else {
      sfx.tryAgain();
    }
  }

  function nextQ() {
    if (i >= questions.length - 1) setDone(true);
    else {
      setI((n) => n + 1);
      setPicked(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="wj-chip">Question {i + 1} / {questions.length}</span>
        <span className="wj-chip">⭐ {score}</span>
      </div>
      <div className="wj-card p-5 text-center">
        <p className="text-xs font-bold uppercase tracking-wide text-ink-soft">Spot the TRUE fact about</p>
        <p className="font-display text-2xl">{q.emoji} {q.topic}</p>
      </div>
      <div className="space-y-2">
        {q.options.map((opt) => {
          const isCorrect = opt === q.correct;
          const chosen = picked === opt;
          const show = picked !== null;
          return (
            <button
              key={opt}
              onClick={() => choose(opt)}
              disabled={show}
              className={`flex w-full items-center gap-3 rounded-2xl border-2 p-3 text-left text-sm transition-colors ${
                show && isCorrect
                  ? "border-palm bg-palm/15 text-palm-deep"
                  : show && chosen
                  ? "border-hibiscus bg-hibiscus/10 text-hibiscus-deep"
                  : "border-sand-deep bg-white hover:border-ocean"
              }`}
            >
              <span className="text-lg">{show && isCorrect ? "✅" : show && chosen ? "💛" : "🔍"}</span>
              <span>{opt}</span>
            </button>
          );
        })}
      </div>
      {picked && (
        <div className="text-center">
          {picked !== q.correct && (
            <p className="font-hand text-sm text-ink-soft">The true one is highlighted in green 💚</p>
          )}
          <button className="wj-btn mt-2" onClick={nextQ}>
            {i >= questions.length - 1 ? "See results 🎉" : "Next fact →"}
          </button>
        </div>
      )}
    </div>
  );
}

/* ── shared bits ─────────────────────────────────────────────── */

function WinCard({ title, line, onReplay }: { title: string; line: string; onReplay: () => void }) {
  return (
    <div className="wj-card wj-pop-in p-8 text-center">
      <div className="text-5xl">🏆</div>
      <h2 className="mt-3 font-display text-2xl text-palm-deep">{title}</h2>
      <p className="mt-1 text-ink-soft">{line}</p>
      <button className="wj-btn mt-4" onClick={onReplay}>Play again 🔄</button>
    </div>
  );
}

function EmptyGame({ facts = false }: { facts?: boolean }) {
  return (
    <div className="wj-card p-6 text-center">
      <div className="text-4xl">🌱</div>
      <p className="font-hand mt-2 text-lg text-ink-soft">
        {facts
          ? "This lesson has no fact lists yet — add bullet points to its sections and Fact Hunt fills up automatically!"
          : "This lesson has no vocabulary words yet — add some phrases and the games fill up automatically!"}
      </p>
    </div>
  );
}

function scrambleStable(letters: string[]): string[] {
  if (letters.length < 2) return letters;
  let out = shuffle(letters);
  let guard = 0;
  while (out.join("") === letters.join("") && guard++ < 8) out = shuffle(letters);
  return out;
}

function unique(arr: string[]): string[] {
  return Array.from(new Set(arr));
}
