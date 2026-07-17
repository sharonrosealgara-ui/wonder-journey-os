"use client";

import Link from "next/link";
import { useState } from "react";
import { CopyButton } from "@/components/copy-button";
import { PhotoUpload } from "@/components/photo-upload";
import { getRecipe } from "@/config/recipes";
import { KEYS, todayISO, type CookbookMemory } from "@/lib/app-state";
import { newId, useStored } from "@/lib/storage";

export function RecipeView({ id }: { id: string }) {

  const recipe = getRecipe(id);
  const [cookbook, setCookbook] = useStored<CookbookMemory[]>(KEYS.cookbook, []);
  const [checked, setChecked] = useState<number[]>([]);

  // memory form
  const [photo, setPhoto] = useState<string | null>(null);
  const [cookNames, setCookNames] = useState("");
  const [memory, setMemory] = useState("");
  const [reflection, setReflection] = useState("");
  const [savedId, setSavedId] = useState<string | null>(null);

  if (!recipe) {
    return (
      <div className="wj-card p-8 text-center">
        <p>That recipe wandered off to the market. 🧺</p>
        <Link href="/cooking" className="wj-btn mt-4">Back to the Studio</Link>
      </div>
    );
  }

  function addToCookbook() {
    if (!recipe) return;
    const entry: CookbookMemory = {
      id: newId(),
      recipeId: recipe.id,
      date: todayISO(),
      cookNames: cookNames.trim() || "Our family",
      photo,
      memory: memory.trim(),
      reflection: reflection.trim(),
    };
    setCookbook((prev) => [entry, ...prev]);
    setSavedId(entry.id);
  }

  const shoppingList = `${recipe.name} — Shopping List\n\n${recipe.ingredients.map((i) => `[ ] ${i}`).join("\n")}`;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header + photo placeholder */}
      <section className="wj-card overflow-hidden">
        <div className="flex h-44 flex-col items-center justify-center gap-1 bg-gradient-to-br from-mango/30 to-hibiscus/15">
          <span className="text-7xl">{recipe.emoji}</span>
          <span className="text-xs font-bold text-ink-soft">📷 {recipe.photoNote}</span>
        </div>
        <div className="p-6">
          <div className="flex flex-wrap gap-2">
            <span className="wj-chip">{recipe.type}</span>
            <span className="wj-chip">{recipe.difficulty}</span>
            <span className="wj-chip">⏱️ {recipe.time}</span>
          </div>
          <h1 className="mt-2 font-display text-3xl font-extrabold">{recipe.name}</h1>
          <p className="italic text-ink-soft">{recipe.filipinoName}</p>
        </div>
      </section>

      {/* Ingredients & tools */}
      <div className="grid gap-4 sm:grid-cols-2">
        <section className="wj-card p-6">
          <h2 className="font-display text-lg font-extrabold">🧺 Ingredients</h2>
          <ul className="mt-3 space-y-1.5 text-sm">
            {recipe.ingredients.map((i) => (
              <li key={i} className="flex gap-2">
                <span className="text-mango-deep">•</span> {i}
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <CopyButton text={shoppingList} label="Copy shopping list 🛒" />
          </div>
        </section>
        <section className="wj-card p-6">
          <h2 className="font-display text-lg font-extrabold">🍴 Tools</h2>
          <ul className="mt-3 space-y-1.5 text-sm">
            {recipe.tools.map((t) => (
              <li key={t} className="flex gap-2">
                <span className="text-ocean-deep">•</span> {t}
              </li>
            ))}
          </ul>
          <h2 className="mt-5 font-display text-lg font-extrabold text-hibiscus-deep">⚠️ Safety first</h2>
          <ul className="mt-2 space-y-1.5 text-sm text-ink-soft">
            {recipe.safety.map((s) => (
              <li key={s} className="flex gap-2">
                <span>🛟</span> {s}
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Steps */}
      <section className="wj-card p-6">
        <h2 className="font-display text-lg font-extrabold">👣 Step by step</h2>
        <p className="mt-1 text-xs text-ink-soft">Tap each step as you finish it!</p>
        <ol className="mt-4 space-y-2">
          {recipe.steps.map((step, i) => {
            const done = checked.includes(i);
            return (
              <li key={i}>
                <button
                  onClick={() =>
                    setChecked((c) => (done ? c.filter((x) => x !== i) : [...c, i]))
                  }
                  className={`flex w-full items-start gap-3 rounded-2xl border-2 p-3 text-left text-sm transition-colors ${
                    done
                      ? "border-palm/50 bg-palm/10 text-ink-soft line-through"
                      : "border-sand-deep bg-white hover:border-mango"
                  }`}
                >
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-display font-extrabold ${
                      done ? "bg-palm text-white" : "bg-sand-deep text-ink-soft"
                    }`}
                  >
                    {done ? "✓" : i + 1}
                  </span>
                  <span className="pt-1">{step}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </section>

      {/* Language corner */}
      <section className="wj-card p-6">
        <h2 className="font-display text-lg font-extrabold">💬 Kitchen words (Tagalog)</h2>
        <div className="mt-3">
          <ul className="grid gap-1 text-sm sm:grid-cols-2">
            {recipe.tagalogWords.map((w) => (
              <li key={w.word}>
                <b className="text-sunset-deep">{w.word}</b> — {w.meaning}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Cultural note + discussion */}
      <section className="wj-card bg-gradient-to-br from-ocean/5 to-palm/10 p-6">
        <h2 className="font-display text-lg font-extrabold">🌏 Cultural note</h2>
        <p className="mt-2 text-sm">{recipe.culturalNote}</p>
        <h2 className="mt-4 font-display text-lg font-extrabold">💭 Family table talk</h2>
        <p className="mt-2 text-sm italic">{recipe.discussionQuestion}</p>
      </section>

      {/* Add to cookbook */}
      <section className="wj-card border-2 border-dashed border-mango/60 p-6">
        {savedId ? (
          <div className="wj-pop-in text-center">
            <div className="text-4xl">📖✨</div>
            <h2 className="mt-2 font-display text-2xl font-extrabold text-palm-deep">
              Saved to your Family Cookbook!
            </h2>
            <p className="mt-1 text-sm text-ink-soft">This memory is now part of your family story.</p>
            <Link href="/cookbook" className="wj-btn mt-4">Open the Family Cookbook 📖</Link>
          </div>
        ) : (
          <>
            <h2 className="font-display text-xl font-extrabold">📖 Make it a memory</h2>
            <p className="mt-1 text-sm text-ink-soft">
              Made this recipe? Add a photo and your memories to the Family Cookbook!
            </p>
            <div className="mt-4 space-y-3">
              <PhotoUpload label="Upload a photo of your creation 📸" photo={photo} onPhoto={setPhoto} />
              <input
                className="wj-input"
                placeholder="Who cooked today? (e.g., Ezra & Selah with Mom)"
                value={cookNames}
                onChange={(e) => setCookNames(e.target.value)}
              />
              <textarea
                className="wj-input min-h-24"
                placeholder="Our memory of making this... (funny moments, taste test results!)"
                value={memory}
                onChange={(e) => setMemory(e.target.value)}
              />
              <textarea
                className="wj-input min-h-20"
                placeholder="Student reflection: what did you learn?"
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
              />
              <button className="wj-btn w-full" onClick={addToCookbook}>
                Add to Family Cookbook 📖
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
