"use client";

import { useMemo, useState } from "react";
import { shuffle } from "@/lib/slides";

// Match English cards to their Filipino partners.
// Used on the Languages page and inside the Adventure Theater.

export type MatchPhrase = {
  english: string;
  tagalog: string;
  hiligaynon: string;
  emoji?: string;
};

type Lang = "tagalog" | "hiligaynon";

type GameCard = {
  key: string;
  pairId: string;
  label: string;
  side: "english" | "filipino";
};

export function MatchingGame({
  phrases,
  lang,
  onWin,
  maxPairs = 6,
  onResult,
}: {
  phrases: MatchPhrase[];
  lang: Lang;
  onWin?: () => void;
  maxPairs?: number; // age-scaled difficulty (fewer pairs for little ones)
  onResult?: (stars: number) => void; // 1–3 ⭐ for the Game Arcade scoreboard
}) {
  const [round, setRound] = useState(0);
  const [reported, setReported] = useState(false);

  const cards = useMemo(() => {
    const pool = shuffle(phrases).slice(0, maxPairs);
    const all: GameCard[] = pool.flatMap((p) => [
      {
        key: p.english + "-en",
        pairId: p.english,
        label: `${p.emoji ? p.emoji + " " : ""}${p.english}`,
        side: "english" as const,
      },
      { key: p.english + "-fil", pairId: p.english, label: p[lang], side: "filipino" as const },
    ]);
    return shuffle(all);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phrases, lang, round, maxPairs]);

  const [selected, setSelected] = useState<GameCard | null>(null);
  const [matched, setMatched] = useState<string[]>([]);
  const [wrong, setWrong] = useState<string | null>(null);
  const [tries, setTries] = useState(0);

  const totalPairs = cards.length / 2;
  const won = matched.length > 0 && matched.length === totalPairs;

  if (won && !reported) {
    setReported(true);
    const stars = tries <= totalPairs + 1 ? 3 : tries <= totalPairs * 2 ? 2 : 1;
    onResult?.(stars);
  }

  function pick(card: GameCard) {
    if (matched.includes(card.pairId) || wrong) return;
    if (!selected) {
      setSelected(card);
      return;
    }
    if (selected.key === card.key) {
      setSelected(null);
      return;
    }
    setTries((t) => t + 1);
    if (selected.pairId === card.pairId && selected.side !== card.side) {
      const next = [...matched, card.pairId];
      setMatched(next);
      setSelected(null);
      if (next.length * 2 === cards.length) onWin?.();
    } else {
      setWrong(card.key);
      setTimeout(() => {
        setWrong(null);
        setSelected(null);
      }, 700);
    }
  }

  function reset() {
    setMatched([]);
    setSelected(null);
    setWrong(null);
    setTries(0);
    setReported(false);
    setRound((r) => r + 1);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-ink-soft">
          Match each English word with its {lang === "tagalog" ? "Tagalog" : "Hiligaynon"} partner!
        </p>
        <span className="wj-chip">Tries: {tries}</span>
      </div>

      {won ? (
        <div className="wj-card wj-pop-in p-8 text-center">
          <div className="text-5xl">🏆</div>
          <h2 className="mt-3 font-display text-2xl text-palm-deep">Magaling! (Great job!)</h2>
          <p className="mt-1 text-ink-soft">
            You matched all {matched.length} pairs in {tries} tries!
          </p>
          <button className="wj-btn mt-4" onClick={reset}>
            Play again 🔄
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {cards.map((card) => {
            const isMatched = matched.includes(card.pairId);
            const isSelected = selected?.key === card.key;
            const isWrong = wrong === card.key || (wrong && isSelected);
            return (
              <button
                key={card.key}
                onClick={() => pick(card)}
                disabled={isMatched}
                className={`min-h-20 rounded-2xl border-2 p-3 font-display text-sm transition-all ${
                  isMatched
                    ? "border-palm bg-palm/15 text-palm-deep opacity-60"
                    : isWrong
                    ? "animate-pulse border-hibiscus bg-hibiscus/15 text-hibiscus-deep"
                    : isSelected
                    ? "border-mango bg-mango/20 text-mango-deep shadow-lg"
                    : card.side === "english"
                    ? "border-sand-deep bg-white hover:border-ocean"
                    : "border-sand-deep bg-ocean/5 text-ocean-deep hover:border-ocean"
                }`}
              >
                {isMatched ? "✅ " : ""}
                {card.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
