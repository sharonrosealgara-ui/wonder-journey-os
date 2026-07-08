"use client";

import { PageHeader } from "@/components/page-header";
import { resources } from "@/config/resources";

export default function ResourcesPage() {
  const categories = [...new Set(resources.map((r) => r.category))];

  return (
    <div className="space-y-6">
      <PageHeader
        emoji="🎬"
        title="Resources"
        subtitle="Videos, presentations, and printables for our adventures."
      />
      {categories.map((cat) => (
        <section key={cat}>
          <h2 className="mb-3 font-display text-xl font-extrabold text-ocean-deep">{cat}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {resources
              .filter((r) => r.category === cat)
              .map((r) => (
                <a
                  key={r.id}
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="wj-card wj-card-hover flex items-start gap-4 p-5"
                >
                  <span className="text-3xl">{r.emoji}</span>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-display font-extrabold">{r.title}</h3>
                      <span className="wj-chip">{r.type}</span>
                    </div>
                    <p className="mt-1 text-sm text-ink-soft">{r.description}</p>
                  </div>
                </a>
              ))}
          </div>
        </section>
      ))}
      <p className="text-center text-sm text-ink-soft">
        💡 Teacher Sharon adds lesson-specific links inside each lesson page.
      </p>
    </div>
  );
}
