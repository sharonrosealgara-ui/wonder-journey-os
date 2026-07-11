"use client";

import { useState } from "react";
import { MatchingGame } from "@/components/matching-game";
import { PageHeader } from "@/components/page-header";
import { phraseCategories, type Phrase } from "@/config/languages";

type View = "table" | "flashcards" | "game";
type Lang = "tagalog" | "hiligaynon";

export default function LanguagesPage() {
  const [categoryId, setCategoryId] = useState(phraseCategories[0].id);
  const [view, setView] = useState<View>("table");
  const [lang, setLang] = useState<Lang>("tagalog");

  const category = phraseCategories.find((c) => c.id === categoryId) ?? phraseCategories[0];

  return (
    <div className="space-y-6">
      <PageHeader
        emoji="💬"
        title="Languages"
        subtitle="Tagalog & Hiligaynon — learn, flip flashcards, and play the matching game!"
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
        {view !== "table" && (
          <div className="flex rounded-full border-2 border-sand-deep bg-white p-1">
            {(["tagalog", "hiligaynon"] as Lang[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`rounded-full px-3.5 py-1.5 text-sm font-bold capitalize ${
                  lang === l ? "bg-hibiscus text-white" : "text-ink-soft"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        )}
      </div>

      {view === "table" && <WordTable phrases={category.phrases} />}
      {view === "flashcards" && <Flashcards key={category.id + lang} phrases={category.phrases} lang={lang} />}
      {view === "game" && <MatchingGame key={category.id + lang} phrases={category.phrases} lang={lang} />}
    </div>
  );
}

function WordTable({ phrases }: { phrases: Phrase[] }) {
  return (
    <div className="wj-card overflow-x-auto p-6">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left font-display text-ink-soft">
            <th className="pb-3 pr-3"></th>
            <th className="pb-3 pr-4">English</th>
            <th className="pb-3 pr-4">Tagalog</th>
            <th className="pb-3 pr-4">Hiligaynon</th>
            <th className="pb-3">Say it like...</th>
          </tr>
        </thead>
        <tbody>
          {phrases.map((p) => (
            <tr key={p.english} className="border-t border-sand-deep">
              <td className="py-2.5 pr-3 text-xl">{p.emoji}</td>
              <td className="py-2.5 pr-4 font-bold">{p.english}</td>
              <td className="py-2.5 pr-4 font-bold text-sunset-deep">{p.tagalog}</td>
              <td className="py-2.5 pr-4 font-bold text-ocean-deep">{p.hiligaynon}</td>
              <td className="py-2.5 text-ink-soft">{p.pronunciation}</td>
            </tr>
          ))}
        </tbody>
      </table>
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


