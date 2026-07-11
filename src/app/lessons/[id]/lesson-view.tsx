"use client";

import Link from "next/link";
import { SmartPhoto, lessonPhoto } from "@/components/smart-photo";
import { getDestination } from "@/config/destinations";
import { getStudent } from "@/config/family";
import { getLesson } from "@/config/lessons";
import { formatDate, KEYS, todayISO, type LessonCompletion } from "@/lib/app-state";
import { useStored } from "@/lib/storage";

export function LessonView({ id }: { id: string }) {

  const lesson = getLesson(id);
  const [activeStudentId] = useStored<string | null>(KEYS.activeStudent, null);
  const [completions, setCompletions] = useStored<LessonCompletion[]>(KEYS.completions, []);
  const student = getStudent(activeStudentId);

  if (!lesson) {
    return (
      <div className="wj-card p-8 text-center">
        <p>Hmm, that lesson has sailed away. 🛶</p>
        <Link href="/lessons" className="wj-btn mt-4">Back to Lesson Library</Link>
      </div>
    );
  }

  const destination = lesson.destinationId ? getDestination(lesson.destinationId) : undefined;
  const done = completions.some(
    (c) => c.lessonId === lesson.id && (!student || c.studentId === student.id)
  );

  function complete() {
    if (!lesson) return;
    const studentId = student?.id ?? "family";
    setCompletions((prev) =>
      prev.some((c) => c.lessonId === lesson.id && c.studentId === studentId)
        ? prev
        : [...prev, { lessonId: lesson.id, studentId, date: todayISO() }]
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <section className="wj-card overflow-hidden">
        {/* real lesson photo (falls back to emoji art) */}
        <SmartPhoto
          src={lessonPhoto(lesson.id)}
          alt={lesson.title}
          emoji={lesson.emoji}
          className="h-44 w-full sm:h-52"
          emojiClass="text-7xl"
        />
        <div className="bg-gradient-to-br from-ocean/10 to-mango/15 p-6 sm:p-8">
        <div className="flex flex-wrap gap-2">
          <span className="wj-chip">Lesson {lesson.order}</span>
          <span className="wj-chip">{lesson.category}</span>
          <span className="wj-chip">🗓️ {formatDate(lesson.date)} · {lesson.time}</span>
        </div>
        <h1 className="mt-3 font-display text-3xl font-extrabold sm:text-4xl">
          {lesson.emoji} {lesson.title}
        </h1>
        <p className="mt-1 text-ink-soft">{lesson.subtitle}</p>
        <div className="mt-4">
          <Link href={`/adventure/${lesson.id}`} className="wj-btn text-lg">
            🎬 Start Adventure Theater
          </Link>
        </div>
        </div>
      </section>

      {/* Content sections */}
      {lesson.sections.map((section) => (
        <section key={section.heading} className="wj-card p-6">
          <h2 className="font-display text-xl font-extrabold">
            {section.emoji} {section.heading}
          </h2>
          <p className="mt-2 text-ink-soft">{section.body}</p>
          {section.bullets && (
            <ul className="mt-3 space-y-1.5">
              {section.bullets.map((b) => (
                <li key={b} className="flex gap-2 text-sm">
                  <span className="text-mango-deep">★</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}

      {/* Phrases */}
      {lesson.phrases && lesson.phrases.length > 0 && (
        <section className="wj-card p-6">
          <h2 className="font-display text-xl font-extrabold">💬 Words for this adventure</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left font-display text-ink-soft">
                  <th className="pb-2 pr-4">English</th>
                  <th className="pb-2 pr-4">Tagalog</th>
                  <th className="pb-2 pr-4">Hiligaynon</th>
                  <th className="pb-2">Say it like...</th>
                </tr>
              </thead>
              <tbody>
                {lesson.phrases.map((p) => (
                  <tr key={p.english} className="border-t border-sand-deep">
                    <td className="py-2.5 pr-4 font-bold">{p.english}</td>
                    <td className="py-2.5 pr-4 text-sunset-deep">{p.tagalog}</td>
                    <td className="py-2.5 pr-4 text-ocean-deep">{p.hiligaynon}</td>
                    <td className="py-2.5 text-ink-soft">{p.pronunciation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Link href="/languages" className="wj-btn wj-btn-ocean mt-4">
            Practice with games 🎮
          </Link>
        </section>
      )}

      {/* Cooking link */}
      {lesson.recipeId && (
        <Link href={`/cooking/${lesson.recipeId}`} className="wj-card wj-card-hover block bg-gradient-to-br from-mango/15 to-hibiscus/10 p-6">
          <h2 className="font-display text-xl font-extrabold">👩‍🍳 Open the recipe</h2>
          <p className="mt-1 text-sm text-ink-soft">
            This adventure continues in the Cooking &amp; Baking Studio — aprons on!
          </p>
        </Link>
      )}

      {/* Family challenge — periwinkle bubble card like the reference */}
      <section className="wj-card-bubble wj-note p-6">
        <h2 className="font-display text-xl text-white">🏆 Family Challenge</h2>
        <p className="mt-2 font-semibold text-white/95">{lesson.familyChallenge}</p>
      </section>

      {/* Reflection & gratitude */}
      <section className="wj-card p-6">
        <h2 className="font-display text-xl font-extrabold">💭 Reflection</h2>
        <p className="mt-2 text-ink-soft">{lesson.reflection}</p>
        <div className="mt-4 rounded-2xl bg-sand p-4">
          <p className="text-sm font-bold text-ink-soft">Gratitude prompt for the journal:</p>
          <p className="mt-1 italic">&ldquo;{lesson.gratitudePrompt}&rdquo;</p>
          <Link href="/blessings" className="wj-btn mt-3 text-sm">
            Write it in Morning Blessings 🙏
          </Link>
        </div>
      </section>

      {/* Complete + passport stamp */}
      <section className="wj-card p-6 text-center">
        {done ? (
          <div className="wj-pop-in">
            <div className="text-4xl">🎉</div>
            <h2 className="mt-2 font-display text-2xl font-extrabold text-palm-deep">
              Adventure complete{student ? `, ${student.name}` : ""}!
            </h2>
            {destination && (
              <div className="mx-auto mt-4 inline-block">
                <div className="wj-stamp wj-stamp-earned px-6 py-4">
                  <div className="text-3xl">{destination.emoji}</div>
                  <div className="font-display text-sm font-extrabold uppercase tracking-wide">
                    {destination.name}
                  </div>
                  <div className="text-xs">stamped!</div>
                </div>
              </div>
            )}
            <div className="mt-4">
              <Link href="/passport" className="wj-btn wj-btn-ocean">
                View Travel Passport 🛂
              </Link>
            </div>
          </div>
        ) : (
          <>
            <p className="text-ink-soft">
              Finished the whole adventure{destination ? ` and ready for your ${destination.name} stamp` : ""}?
            </p>
            <button className="wj-btn mt-3" onClick={complete}>
              Mark adventure complete {destination ? "& stamp my passport 🛂" : "✅"}
            </button>
          </>
        )}
      </section>
    </div>
  );
}
