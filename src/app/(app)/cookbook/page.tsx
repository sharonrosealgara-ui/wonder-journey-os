"use client";

import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { getRecipe } from "@/config/recipes";
import { formatDate, KEYS, type CookbookMemory } from "@/lib/app-state";
import { useStored } from "@/lib/storage";

export default function CookbookPage() {
  const [cookbook, setCookbook] = useStored<CookbookMemory[]>(KEYS.cookbook, []);

  return (
    <div className="space-y-6">
      <PageHeader
        emoji="📖"
        title="Our Family Filipino Cookbook"
        subtitle="Every recipe we make together becomes a page in our family story."
      />

      {cookbook.length === 0 ? (
        <div className="wj-card p-10 text-center">
          <div className="text-5xl">🍳📖</div>
          <h2 className="mt-3 font-display text-xl font-extrabold">The first page is waiting!</h2>
          <p className="mx-auto mt-2 max-w-md text-ink-soft">
            Cook a recipe from the Studio, snap a photo, and it will appear here as a beautiful
            cookbook memory page.
          </p>
          <Link href="/cooking" className="wj-btn mt-5">
            Visit the Cooking &amp; Baking Studio 🥭
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          {cookbook.map((m) => {
            const recipe = getRecipe(m.recipeId);
            return (
              <article key={m.id} className="wj-card overflow-hidden">
                {m.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.photo} alt={recipe?.name ?? "Family cooking memory"} className="h-48 w-full object-cover" />
                ) : (
                  <div className="flex h-48 items-center justify-center bg-gradient-to-br from-mango/25 to-hibiscus/15 text-6xl">
                    {recipe?.emoji ?? "🍽️"}
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="font-display text-xl font-extrabold">
                      {recipe?.emoji} {recipe?.name ?? "Family recipe"}
                    </h2>
                    <span className="wj-chip whitespace-nowrap">{formatDate(m.date)}</span>
                  </div>
                  <p className="mt-1 text-sm font-bold text-ocean-deep">👩‍🍳 {m.cookNames}</p>
                  {m.memory && (
                    <p className="mt-3 rounded-2xl bg-sand p-3 text-sm">
                      <span className="font-bold text-ink-soft">Our memory: </span>
                      {m.memory}
                    </p>
                  )}
                  {m.reflection && (
                    <p className="mt-2 rounded-2xl bg-ocean/5 p-3 text-sm italic">
                      <span className="font-bold not-italic text-ink-soft">Reflection: </span>
                      {m.reflection}
                    </p>
                  )}
                  <div className="mt-3 flex items-center justify-between">
                    {recipe && (
                      <Link href={`/cooking/${recipe.id}`} className="text-sm font-bold text-sunset-deep hover:underline">
                        Make it again →
                      </Link>
                    )}
                    <button
                      className="text-xs text-ink-soft hover:text-hibiscus-deep"
                      onClick={() => {
                        if (confirm("Remove this cookbook memory?")) {
                          setCookbook((prev) => prev.filter((x) => x.id !== m.id));
                        }
                      }}
                    >
                      remove
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
