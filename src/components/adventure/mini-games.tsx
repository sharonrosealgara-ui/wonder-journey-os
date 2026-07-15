"use client";

import { useMemo, useState } from "react";
import type { PhrasePair } from "@/config/lessons";
import { shuffle } from "@/lib/slides";
import { sfx } from "@/lib/sound";

// 🎮 MINI-GAMES — quick, joyful games built from the lesson's OWN words,
// so play and learning are the same thing. All are keyboard-free (tap
// only) so the youngest explorers can join. No audio files — the gentle
// sounds are synthesized (lib/sound).

type Lang = "tagalog" | "hiligaynon";

/* ═══════════════════════════════════════════════════════════════
   1) MEMORY FLIP — classic concentration. Flip two cards to find an
   English word and its Filipino partner. Remembering where they hide
   is the game; learning the pair is the prize.
   ══════════════════════════════════════════════════════════════ */

type FlipCard = { key: string; pairId: string; label: string; side: "english" | "filipino" };

export function MemoryFlip({ phrases, lang }: { phrases: PhrasePair[]; lang: Lang }) {
  const [round, setRound] = useState(0);
  const cards = useMemo(() => {
    const pool = shuffle(phrases.filter((p) => p[lang])).slice(0, 6);
    const all: FlipCard[] = pool.flatMap((p) => [
      { key: p.english + "-en", pairId: p.english, label: p.english, side: "english" as const },
      { key: p.english + "-fil", pairId: p.english, label: p[lang], side: "filipino" as const },
    ]);
    return shuffle(all);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phrases, lang, round]);

  const [flipped, setFlipped] = useState<string[]>([]); // currently face-up (max 2)
  const [matched, setMatched] = useState<string[]>([]); // matched pairIds
  const [busy, setBusy] = useState(false);
  const [moves, setMoves] = useState(0);

  const won = matched.length > 0 && matched.length * 2 === cards.length;

  function flip(card: FlipCard) {
    if (busy || flipped.includes(card.key) || matched.includes(card.pairId)) return;
    sfx.tap();
    const now = [...flipped, card.key];
    setFlipped(now);
    if (now.length < 2) return;

    setMoves((m) => m + 1);
    const [aKey, bKey] = now;
    const a = cards.find((c) => c.key === aKey)!;
    const b = cards.find((c) => c.key === bKey)!;
    if (a.pairId === b.pairId && a.side !== b.side) {
      setTimeout(() => {
        setMatched((prev) => {
          const next = [...prev, a.pairId];
          if (next.length * 2 === cards.length) sfx.celebrate();
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

type Tile = { id: number; ch: string };

export function WordScramble({ phrases, lang }: { phrases: PhrasePair[]; lang: Lang }) {
  // words that are a single token scramble nicely (no spaces)
  const words = useMemo(
    () => shuffle(phrases.filter((p) => p[lang] && !p[lang].includes(" "))).slice(0, 6),
    [phrases, lang]
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
      onSolved={() => setSolvedCount((c) => c + 1)}
      onNext={() => setIdx((i) => (i + 1) % words.length)}
    />
  );
}

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
  onSolved: () => void;
  onNext: () => void;
}) {
  const letters = useMemo(() => answer.split(""), [answer]);
  const makeTiles = () =>
    scrambleStable(letters).map((ch, i) => ({ id: i, ch }));

  const [pool, setPool] = useState<Tile[]>(makeTiles);
  const [built, setBuilt] = useState<Tile[]>([]);
  const [solved, setSolved] = useState(false);
  const [wrong, setWrong] = useState(false);

  const current = built.map((t) => t.ch).join("");

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
        onSolved();
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
    // move the correct next letter into place
    if (solved) return;
    const nextCh = letters[built.length];
    const tile = pool.find((t) => t.ch.toLowerCase() === nextCh.toLowerCase());
    if (tile) {
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

      {/* answer row */}
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
          {/* letter pool */}
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

function EmptyGame() {
  return (
    <div className="wj-card p-6 text-center">
      <div className="text-4xl">🌱</div>
      <p className="font-hand mt-2 text-lg text-ink-soft">
        This lesson has no vocabulary words yet — add some phrases and the games fill up automatically!
      </p>
    </div>
  );
}

// scramble that never returns the original order (so it's always a puzzle)
function scrambleStable(letters: string[]): string[] {
  if (letters.length < 2) return letters;
  let out = shuffle(letters);
  let guard = 0;
  while (out.join("") === letters.join("") && guard++ < 8) out = shuffle(letters);
  return out;
}
