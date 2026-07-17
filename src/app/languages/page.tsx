"use client";

import { useState } from "react";
import { MatchingGame } from "@/components/matching-game";
import { PageHeader } from "@/components/page-header";
import { phraseCategories, type Phrase } from "@/config/languages";

type View = "table" | "flashcards" | "game";
type Lang = "tagalog";

export default function LanguagesPage() {
  const [categoryId, setCategoryId] = useState(phraseCategories[0].id);
  const [view, setView] = useState<View>("table");
  // Tagalog-only (Sharon's decision) — one language, learned well.
  const lang: Lang = "tagalog";

  const category = phraseCategories.find((c) => c.id === categoryId) ?? phraseCategories[0];

  return (
    <div className="space-y-6">
      <PageHeader
        emoji="💬"
        title="Languages"
        subtitle="Let's learn Tagalog — a word list, flip flashcards, and a matching game!"
      />

      {/* Category picker */}
      <div className="flex flex-wrap gap-2">
        {phraseCategories.map((c) => (
          <button
            key={c.id}
            onClick={() => setCategoryId(c.id)}
            className={`rounded-full px-4 py-2 font-display text-sm font-bold transition-colors ${
              c.id === categoryId ? "bg-sunset text-white shadow" : "bg-white text-ink-soft hover:bg-sand-deep"
            }`}
          >
            {c.emoji} {c.title}
          </button>
        ))}
      </div>

      {/* View + language toggles */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex rounded-full border-2 border-sand-deep bg-white p-1">
          {(
            [
              ["table", "📖 Word List"],
              ["flashcards", "🃏 Flashcards"],
              ["game", "🎮 Matching Game"],
            ] as [View, string][]
          ).map(([v, label]) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-bold ${
                view === v ? "bg-ocean text-white" : "text-ink-soft"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {view === "table" && <WordTable phrases={category.phrases} />}
      {view === "flashcards" && <Flashcards key={category.id + lang} phrases={category.phrases} lang={lang} />}
      {view === "game" && <MatchingGame key={category.id + lang} phrases={category.phrases} lang={lang} />}
    </div>
  );
}

// Goodbye spreadsheet — every phrase is a chunky, floating word block a
// child can love. The pronunciation lives in a warm yellow speech bubble
// that begs to be read aloud (Sharon's Family OS direction).
function WordTable({ phrases }: { phrases: Phrase[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {phrases.map((p) => (
        <div
          key={p.english}
          className="rounded-3xl border-2 border-sand-deep bg-[--color-cream-card] p-4 [box-shadow:var(--shadow-tactile)] transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.02]"
        >
          <div className="flex items-center gap-3">
            <span className="wj-sticker h-11 w-11 shrink-0 text-xl">{p.emoji}</span>
            <div className="min-w-0">
              <div className="font-display text-lg leading-tight">{p.english}</div>
              <div className="mt-0.5 text-base">
                <b className="text-sunset-deep">{p.tagalog}</b>
              </div>
            </div>
          </div>
          {p.pronunciation && (
            <div className="mt-3 inline-flex items-center gap-2 rounded-2xl rounded-bl-sm bg-mango/35 px-3 py-1.5 font-hand text-base text-ink">
              📣 Say it: <b>{p.pronunciation}</b>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function Flashcards({ phrases, lang }: { phrases: Phrase[]; lang: Lang }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const phrase = phrases[index];

  function move(delta: number) {
    setFlipped(false);
    setIndex((i) => (i + delta + phrases.length) % phrases.length);
  }

  return (
    <div className="mx-auto max-w-md text-center">
      <div
        className={`wj-flip mx-auto h-64 cursor-pointer select-none ${flipped ? "flipped" : ""}`}
        onClick={() => setFlipped((f) => !f)}
      >
        <div className="wj-flip-inner h-full">
          <div className="wj-flip-face wj-card h-full p-6">
            <span className="text-5xl">{phrase.emoji}</span>
            <span className="mt-3 font-display text-3xl font-extrabold">{phrase.english}</span>
            <span className="mt-3 text-sm text-ink-soft">Tap to see it in {lang}!</span>
          </div>
          <div className="wj-flip-face wj-flip-back wj-card h-full bg-gradient-to-br from-sunset/10 to-mango/15 p-6">
            <span className="font-display text-3xl font-extrabold text-sunset-deep">
              {phrase[lang]}
            </span>
            <span className="mt-2 text-ink-soft">{phrase.pronunciation}</span>
            <span className="mt-3 text-sm text-ink-soft">Say it out loud 3 times! 🎤</span>
          </div>
        </div>
      </div>
      <div className="mt-5 flex items-center justify-center gap-4">
        <button className="wj-btn wj-btn-ghost" onClick={() => move(-1)}>← Back</button>
        <span className="font-display font-bold text-ink-soft">
          {index + 1} / {phrases.length}
        </span>
        <button className="wj-btn" onClick={() => move(1)}>Next →</button>
      </div>
    </div>
  );
}


