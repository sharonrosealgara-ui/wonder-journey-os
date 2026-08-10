"use client";

import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { lessons } from "@/config/lessons";
import { familyValues } from "@/config/values";
import { formatDate, KEYS, type LessonCompletion, getLessonDisplayStatus } from "@/lib/app-state";
import { useStored } from "@/lib/storage";
import { FactualImage } from "@/components/factual-image";

export default function LessonsPage() {
  const [completions] = useStored<LessonCompletion[]>(KEYS.completions, []);
  const [activeStudentId] = useStored<string | null>(KEYS.activeStudent, null);

  return (
    <div>
      <PageHeader
        emoji="📚"
        title="Lesson Library"
        subtitle="Our adventures through the Philippines — one lesson at a time."
      />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {lessons
          .slice()
          .sort((a, b) => a.order - b.order)
          .map((lesson) => {
            const status = getLessonDisplayStatus(lesson.id, lesson.date, completions, activeStudentId);
            const isUpcoming = status === "upcoming";
            const isCompleted = status === "completed";

            return (
              <Link
                key={lesson.id}
                href={`/lessons/${lesson.id}`}
                className={`wj-card wj-card-hover group flex flex-col overflow-hidden ${
                  isUpcoming ? "opacity-75 saturate-90 hover:opacity-100" : ""
                }`}
              >
                {/* Premium Visual Anchor using FactualImage (pending state fallback) */}
                <div className="relative aspect-[4/3] w-full bg-sand-deep border-b border-sand">
                  <FactualImage media={{ status: "pending" }} fill className="rounded-none border-0" />
                  
                  {/* Status Overlay */}
                  <div className="absolute top-3 right-3 z-10 flex gap-2">
                    {isCompleted && (
                      <span className="wj-chip !bg-palm/90 !text-white !py-1 backdrop-blur-sm shadow-sm font-semibold">
                        ✅ Completed
                      </span>
                    )}
                    {isUpcoming && (
                      <span className="wj-chip !bg-ube/90 !text-white !py-1 backdrop-blur-sm shadow-sm font-semibold">
                        🔜 Coming soon
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-3xl" aria-hidden>{lesson.emoji}</span>
                  </div>
                  
                  <div className="mb-3 flex flex-wrap gap-2">
                    <span className="wj-chip !bg-sand !text-ink-soft !font-semibold">Lesson {lesson.order}</span>
                    <span className="wj-chip !bg-sand !text-ink-soft !font-semibold">{lesson.category}</span>
                  </div>
                  
                  <h2 className="font-display text-xl font-extrabold text-ink leading-tight">{lesson.title}</h2>
                  <p className="mt-1.5 text-sm text-ink-soft line-clamp-2">{lesson.subtitle}</p>
                  
                  <div className="mt-auto pt-4 flex items-center justify-between text-xs font-semibold text-ink-soft/70">
                    <span>🗓️ {formatDate(lesson.date)}</span>
                    <span>{lesson.time}</span>
                  </div>
                </div>
              </Link>
            );
          })}
      </div>

      <section className="mt-14">
        <h2 className="mb-2 font-display text-2xl font-extrabold text-ink">❤️ Values we carry on every adventure</h2>
        <p className="mb-6 text-sm text-ink-soft">
          Filipino family values woven through every lesson.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {familyValues.map((v) => (
            <div key={v.id} className="wj-card p-5 border border-sand">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{v.emoji}</span>
                <div>
                  <div className="font-display font-extrabold leading-tight text-ink">{v.name}</div>
                  <div className="text-xs italic text-ink-soft">{v.filipinoName}</div>
                </div>
              </div>
              <p className="text-sm text-ink-soft leading-relaxed">{v.meaning}</p>
              <p className="mt-3 text-xs font-bold text-ocean-deep tracking-wide uppercase">{v.verse}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
