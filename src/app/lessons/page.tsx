"use client";

import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { lessons } from "@/config/lessons";
import { familyValues } from "@/config/values";
import { formatDate, KEYS, type LessonCompletion } from "@/lib/app-state";
import { useStored } from "@/lib/storage";

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
      <div className="grid gap-4 sm:grid-cols-2">
        {lessons
          .slice()
          .sort((a, b) => a.order - b.order)
          .map((lesson) => {
            const done = completions.some(
              (c) => c.lessonId === lesson.id && (!activeStudentId || c.studentId === activeStudentId)
            );
            return (
              <Link
                key={lesson.id}
                href={`/lessons/${lesson.id}`}
                className="wj-card wj-card-hover block p-6"
              >
                <div className="flex items-start justify-between">
                  <span className="text-4xl">{lesson.emoji}</span>
                  {done && <span className="wj-chip !bg-palm/15 !text-palm-deep">✅ Completed</span>}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="wj-chip">Lesson {lesson.order}</span>
                  <span className="wj-chip">{lesson.category}</span>
                </div>
                <h2 className="mt-2 font-display text-xl font-extrabold">{lesson.title}</h2>
                <p className="mt-1 text-sm text-ink-soft">{lesson.subtitle}</p>
                <p className="mt-3 text-xs font-bold text-ink-soft">
                  🗓️ {formatDate(lesson.date)} · {lesson.time}
                </p>
              </Link>
            );
          })}
      </div>

      <section className="mt-10">
        <h2 className="mb-1 font-display text-2xl font-extrabold">❤️ Values we carry on every adventure</h2>
        <p className="mb-4 text-sm text-ink-soft">
          Filipino family values woven through every lesson.
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {familyValues.map((v) => (
            <div key={v.id} className="wj-card p-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{v.emoji}</span>
                <div>
                  <div className="font-display font-extrabold leading-tight">{v.name}</div>
                  <div className="text-xs italic text-ink-soft">{v.filipinoName}</div>
                </div>
              </div>
              <p className="mt-2 text-sm text-ink-soft">{v.meaning}</p>
              <p className="mt-2 text-xs font-bold text-ocean-deep">{v.verse}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
