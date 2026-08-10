"use client";

import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { recipes } from "@/config/recipes";
import { KEYS, type CookbookMemory } from "@/lib/app-state";
import { useStored } from "@/lib/storage";
import { SmartPhoto } from "@/components/smart-photo";

export default function CookingPage() {
  const [cookbook] = useStored<CookbookMemory[]>(KEYS.cookbook, []);

  return (
    <div className="space-y-8 pb-10">
      <div className="relative z-10 mb-8 bg-gradient-to-br from-mango/10 to-hibiscus/5 p-8 rounded-3xl border border-white shadow-sm overflow-hidden backdrop-blur-sm">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-[-1]"
             style={{
               backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 50 Q 25 25 50 50 T 100 50' stroke='%23004060' fill='none' stroke-width='2'/%3E%3Cpath d='M0 70 Q 25 45 50 70 T 100 70' stroke='%23004060' fill='none' stroke-width='2'/%3E%3Cpath d='M0 30 Q 25 5 50 30 T 100 30' stroke='%23004060' fill='none' stroke-width='2'/%3E%3C/svg%3E")`,
               backgroundSize: "200px 200px"
             }}
        />
        <PageHeader
          emoji="🥭"
          title="Cooking & Baking Studio"
          subtitle="Family-friendly Filipino recipes — every dish you make becomes a cookbook memory!"
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 relative z-10">
        {recipes.map((r) => {
          const made = cookbook.some((m) => m.recipeId === r.id);
          return (
            <Link key={r.id} href={`/cooking/${r.id}`} className="wj-card group relative p-0 overflow-hidden bg-white border border-sand-deep/40 shadow-md hover:-translate-y-2 hover:shadow-xl transition-all duration-300 transform-gpu cursor-pointer flex flex-col">
              {/* Subtle recipe paper texture */}
              <div className="absolute inset-0 opacity-10 pointer-events-none z-0"
                   style={{
                     backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 10 L20 10 M10 0 L10 20' stroke='%23004060' fill='none' stroke-width='0.5' stroke-dasharray='1,3'/%3E%3C/svg%3E")`,
                     backgroundSize: "20px 20px"
                   }}
              />

              <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-mango/20 to-hibiscus/10 border-b border-sand/60">
                <SmartPhoto 
                  mediaId={r.mediaId} 
                  alt={r.name} 
                  className={`absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 ${made ? "" : "opacity-90 saturate-[0.8]"}`} 
                  emojiClass="text-6xl drop-shadow-md"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-40"></div>
                
                {/* Made badge overlay */}
                {made && (
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm border border-palm/30 px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5 transform rotate-3">
                    <span className="text-sm">👩‍🍳</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-palm-deep">We made this!</span>
                  </div>
                )}
              </div>
              
              <div className="p-6 relative z-10 flex-1 flex flex-col">
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="wj-chip border border-sand shadow-sm bg-white/80">{r.type}</span>
                  <span className="wj-chip border border-sand shadow-sm bg-white/80">{r.difficulty}</span>
                </div>
                
                <h2 className="font-display text-2xl font-extrabold text-ocean-deep leading-tight group-hover:text-mango-deep transition-colors mb-1">{r.name}</h2>
                <p className="text-sm italic font-medium text-ink-soft/80 flex-1">{r.filipinoName}</p>
                
                <div className="mt-5 pt-4 border-t border-dashed border-sand-deep/40 flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-widest text-ink-soft">⏱️ {r.time}</p>
                  <span className="text-mango-deep opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0 font-bold">→</span >
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
