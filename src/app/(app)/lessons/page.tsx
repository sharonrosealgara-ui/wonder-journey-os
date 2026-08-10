"use client";

import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { lessons } from "@/config/lessons";
import { familyValues } from "@/config/values";
import { formatDate, KEYS, getLessonDisplayStatus, type LessonCompletion } from "@/lib/app-state";
import { useStored } from "@/lib/storage";
import { CheckCircle2, CalendarDays } from "lucide-react";

export default function LessonsPage() {
  const [completions] = useStored<LessonCompletion[]>(KEYS.completions, []);
  const [activeStudentId] = useStored<string | null>(KEYS.activeStudent, null);

  return (
    <div className="relative z-10">
      <PageHeader
        emoji="📚"
        title="Lesson Library"
        subtitle="Our adventures through the Philippines — one lesson at a time."
      />
      <div className="grid gap-4 sm:grid-cols-2 mt-6">
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
                className={`wj-card wj-card-hover block p-6 ${isUpcoming ? "opacity-70 saturate-[.9] hover:opacity-100" : ""}`}
              >
                <div className="flex items-start justify-between">
                  <span className="text-4xl drop-shadow-sm" aria-hidden>{lesson.emoji}</span>
                  {isCompleted && (
                    <span className="wj-chip !bg-palm/15 !text-palm-deep font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Completed
                    </span>
                  )}
                  {isUpcoming && (
                    <span className="wj-chip !bg-ube/15 !text-ube font-bold">
                      <CalendarDays className="w-3.5 h-3.5 mr-1" /> Coming soon
                    </span>
                  )}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="wj-chip">Lesson {lesson.order}</span>
                  <span className="wj-chip">{lesson.category}</span>
                </div>
                <h2 className="mt-2 font-display text-xl font-extrabold">{lesson.title}</h2>
                <p className="mt-1 text-sm text-ink-soft">{lesson.subtitle}</p>
                <p className="mt-3 text-xs font-bold text-ink-soft flex items-center">
                  <CalendarDays className="w-3 h-3 mr-1" /> {formatDate(lesson.date)} · {lesson.time}
                </p>
              </Link>
            );
          })}
      </div>

      <section className="mt-10">
        <h2 className="mb-1 font-display text-2xl font-extrabold text-hibiscus-deep">❤️ Values we carry on every adventure</h2>
        <p className="mb-4 text-sm text-ink-soft">
          Filipino family values woven through every lesson.
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {familyValues.map((v) => (
            <div key={v.id} className="wj-card p-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl drop-shadow-sm">{v.emoji}</span>
                <div>
                  <div className="font-display font-extrabold leading-tight">{v.name}</div>
                  <div className="text-xs italic text-ink-soft">{v.filipinoName}</div>
                </div>
              </div>
              <p className="mt-2 text-sm text-ink-soft">{v.meaning}</p>
              <p className="mt-2 text-xs font-bold text-ocean-deep tracking-wide uppercase">{v.verse}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
