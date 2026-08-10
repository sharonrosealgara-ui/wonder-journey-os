"use client";

import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { resources } from "@/config/resources";

export default function ResourcesPage() {
  const categories = [...new Set(resources.map((r) => r.category))];

  return (
    <div className="space-y-8 pb-10">
      <div className="relative z-10 mb-8 bg-gradient-to-br from-ocean/10 to-sky/5 p-8 rounded-3xl border border-white shadow-sm overflow-hidden backdrop-blur-sm">
        {/* Subtle map lines motif */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none z-[-1]"
             style={{
               backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 10 Q 30 20 50 10 T 90 10' stroke='%23004060' fill='none' stroke-width='1.5'/%3E%3Cpath d='M10 30 Q 40 50 60 30 T 90 30' stroke='%23004060' fill='none' stroke-width='1.5'/%3E%3Cpath d='M10 50 Q 20 70 50 50 T 90 50' stroke='%23004060' fill='none' stroke-width='1.5'/%3E%3Cpath d='M10 70 Q 30 80 50 70 T 90 70' stroke='%23004060' fill='none' stroke-width='1.5'/%3E%3Cpath d='M10 90 Q 40 80 60 90 T 90 90' stroke='%23004060' fill='none' stroke-width='1.5'/%3E%3C/svg%3E")`,
               backgroundSize: "150px 150px"
             }}
        />
        <div className="absolute top-0 right-0 w-64 h-64 bg-ocean/10 blur-[60px] rounded-full z-[-1]"></div>
        
        <PageHeader
          emoji="📚"
          title="Family Library"
          subtitle="Books, videos, and tools to deepen your Wonder Journey."
        />
      </div>
      
      <div className="space-y-12">
        {categories.map((cat, index) => (
          <section key={cat} className="relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-ocean/20 to-sky/20 flex items-center justify-center border border-ocean/10 shadow-inner shadow-white">
                <span className="text-xl">
                  {index % 3 === 0 ? "🗺️" : index % 3 === 1 ? "🧭" : "🔭"}
                </span>
              </div>
              <h2 className="font-display text-2xl font-extrabold text-ocean-deep tracking-tight">{cat}</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-ocean/20 to-transparent"></div>
            </div>
            
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {resources
                .filter((r) => r.category === cat)
                .map((r) => (
                  <a
                    key={r.id}
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="wj-card group relative p-6 bg-white border border-sand-deep/40 shadow-sm hover:-translate-y-1 hover:shadow-lg hover:border-ocean/30 transition-all duration-300 transform-gpu flex flex-col h-full overflow-hidden"
                  >
                    {/* Hover highlight effect */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-ocean/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    
                    <div className="flex items-start gap-4 flex-1">
                      <div className="flex-shrink-0 w-12 h-12 bg-sand/30 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300 shadow-sm border border-white">
                        {r.emoji}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="wj-chip border border-sand shadow-sm bg-white font-bold tracking-wide">{r.type}</span>
                          <span className="text-ocean/40 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">↗</span>
                        </div>
                        <h3 className="font-display text-lg font-extrabold text-ink leading-tight mb-2 group-hover:text-ocean-deep transition-colors line-clamp-2">{r.title}</h3>
                        <p className="text-sm font-medium text-ink-soft/90 leading-relaxed line-clamp-3">{r.description}</p>
                      </div>
                    </div>
                  </a>
                ))}
            </div>
          </section>
        ))}
      </div>
      
      <div className="mt-12 p-6 bg-white/60 border border-sand-deep/30 rounded-2xl flex items-center justify-center gap-3 text-sm font-medium text-ink shadow-sm max-w-2xl mx-auto text-center backdrop-blur-sm">
        <span className="text-2xl drop-shadow-sm">💡</span>
        <p>Teacher Sharon adds lesson-specific links right inside each <Link href="/lessons" className="text-ocean-deep font-bold hover:underline">lesson page</Link>.</p>
      </div>
    </div>
  );
}
