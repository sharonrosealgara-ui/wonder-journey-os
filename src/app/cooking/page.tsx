"use client";

import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { recipes } from "@/config/recipes";
import { KEYS, type CookbookMemory } from "@/lib/app-state";
import { useStored } from "@/lib/storage";

export default function CookingPage() {
  const [cookbook] = useStored<CookbookMemory[]>(KEYS.cookbook, []);

  return (
    <div>
      <PageHeader
        emoji="🥭"
        title="Cooking & Baking Studio"
        subtitle="Family-friendly Filipino recipes — every dish you make becomes a cookbook memory!"
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {recipes.map((r) => {
          const made = cookbook.some((m) => m.recipeId === r.id);
          return (
            <Link key={r.id} href={`/cooking/${r.id}`} className="wj-card wj-card-hover block overflow-hidden">
              {/* photo placeholder */}
              <div className="flex h-32 items-center justify-center bg-gradient-to-br from-mango/25 to-hibiscus/15 text-6xl">
                {r.emoji}
              </div>
              <div className="p-5">
                <div className="flex flex-wrap gap-2">
                  <span className="wj-chip">{r.type}</span>
                  <span className="wj-chip">{r.difficulty}</span>
                  {made && <span className="wj-chip !bg-palm/15 !text-palm-deep">✅ We made this!</span>}
                </div>
                <h2 className="mt-2 font-display text-xl font-extrabold">{r.name}</h2>
                <p className="text-sm italic text-ink-soft">{r.filipinoName}</p>
                <p className="mt-2 text-xs font-bold text-ink-soft">⏱️ {r.time}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
