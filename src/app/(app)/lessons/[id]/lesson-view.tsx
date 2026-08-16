"use client";

import Link from "next/link";
import { SmartPhoto } from "@/components/smart-photo";
import { useSmartSrc } from "@/lib/photos";
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
  const photoSrc = useSmartSrc("lesson", id);

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

  const isPremium = !!lesson.premiumContent?.richExplanation || !!lesson.premiumContent?.adventureHook;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <section className="wj-card overflow-hidden">
        <SmartPhoto
          src={photoSrc}
          alt={lesson.title}
          className="h-44 w-full sm:h-52"
        />
        <div className="bg-gradient-to-br from-ocean/10 to-mango/15 p-6 sm:p-8">
          <div className="flex flex-wrap gap-2">
            <span className="wj-chip">Lesson {lesson.order}</span>
            <span className="wj-chip">{lesson.category}</span>
            <span className="wj-chip">🗓️ {formatDate(lesson.date)} · {lesson.time || "30m"}</span>
          </div>
          <h1 className="mt-3 font-display text-3xl font-extrabold sm:text-4xl">
            {lesson.emoji} {lesson.title}
          </h1>
          <p className="mt-1 text-ink-soft">{lesson.subtitle || lesson.premiumContent?.topic}</p>
          <div className="mt-4">
            <Link href={`/adventure/${lesson.id}`} className="wj-btn text-lg">
              🎬 Start Adventure Theater
            </Link>
          </div>
        </div>
      </section>

      {/* Content sections */}
      {isPremium ? (
        <>
          <section className="wj-card p-6 border-t-4 border-t-mango space-y-6">
            <h2 className="font-display text-2xl font-extrabold text-mango-deep">🌟 The Premium Journey</h2>

            {lesson.premiumContent?.essentialQuestion && (
              <div className="p-4 bg-sand rounded-xl border border-sand-deep">
                <p className="text-sm font-bold text-ink-soft uppercase tracking-wider">Essential Question</p>
                <p className="mt-1 text-lg italic text-ink font-serif">{lesson.premiumContent?.essentialQuestion}</p>
              </div>
            )}

            {lesson.premiumContent?.keyFacts && lesson.premiumContent?.keyFacts.length > 0 && (
              <div>
                <h3 className="font-display text-lg font-bold">Key Discoveries</h3>
                <ul className="mt-3 space-y-2">
                  {lesson.premiumContent?.keyFacts.map((fact, idx) => (
                    <li key={idx} className="flex gap-2 text-md">
                      <span className="text-ocean-deep">💡</span>
                      <span>{fact}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {lesson.premiumContent?.vocabulary && lesson.premiumContent?.vocabulary.length > 0 && (
              <div>
                <h3 className="font-display text-lg font-bold">New Words</h3>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {lesson.premiumContent?.vocabulary.map((v, i) => (
                    <div key={v.word || i} className="p-3 bg-white rounded-lg border border-sand-deep shadow-sm">
                      <p className="font-bold text-lg">{v.word} {v.language && <span className="text-sm text-ink-soft ml-2">({v.language})</span>}</p>
                      <p className="text-sunset-deep">{v.translation}</p>
                      {v.pronunciation && <p className="text-xs text-ink-soft mt-1">🔊 {v.pronunciation}</p>}
                      {v.contextualExample && <p className="text-sm italic mt-2">"{v.contextualExample}"</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {lesson.premiumContent?.curatedResources && lesson.premiumContent?.curatedResources.length > 0 && (
              <div className="p-5 bg-mango/10 rounded-xl border border-mango-deep/20">
                <h3 className="font-display text-lg font-bold">Curated Resources</h3>
                <ul className="mt-3 space-y-3">
                  {lesson.premiumContent?.curatedResources.map(r => (
                    <li key={r.id} className="flex flex-col text-md">
                      <a href={r.url} target="_blank" rel="noopener noreferrer" className="font-bold text-ocean-deep hover:underline">
                        🔗 {r.title}
                      </a>
                      <span className="text-sm text-ink-soft ml-6">{r.type} - {r.whyUseful}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {lesson.premiumContent?.ageDifferentiation && (
              <div className="p-5 bg-ocean/10 rounded-xl">
                <h3 className="font-display text-lg font-bold">Family Challenge by Age</h3>
                <div className="mt-3 space-y-3">
                  <p><strong>🧭 Explorer (7-8):</strong> {lesson.premiumContent?.ageDifferentiation.explorer}</p>
                  <p><strong>🏕️ Adventure (9-10):</strong> {lesson.premiumContent?.ageDifferentiation.adventure}</p>
                  <p><strong>🚀 Trailblazer (11-12+):</strong> {lesson.premiumContent?.ageDifferentiation.trailblazer}</p>
                </div>
              </div>
            )}

            {lesson.familyChallenge && (
              <div className="wj-card-bubble wj-note p-6 mt-6">
                <h2 className="font-display text-xl text-white">🏆 Family Challenge</h2>
                <p className="mt-2 font-semibold text-white/95">{lesson.familyChallenge}</p>
              </div>
            )}

            {lesson.premiumContent?.learnerReflection && (
              <div className="mt-6">
                <h2 className="font-display text-xl font-extrabold">💭 Reflection</h2>
                <p className="mt-2 text-ink-soft">{lesson.premiumContent?.learnerReflection}</p>
                {lesson.gratitudePrompt && (
                  <div className="mt-4 rounded-2xl bg-sand p-4">
                    <p className="text-sm font-bold text-ink-soft">Gratitude prompt for the journal:</p>
                    <p className="mt-1 italic">&ldquo;{lesson.gratitudePrompt}&rdquo;</p>
                    <Link href="/blessings" className="wj-btn mt-3 text-sm">
                      Write it in Morning Blessings 🙏
                    </Link>
                  </div>
                )}
              </div>
            )}
          </section>
        </>
      ) : (
        <>
          {/* Legacy Fallback Rendering */}
          {lesson.sections && lesson.sections.map((section: any) => (
            <section key={section.heading} className="wj-card p-6">
              <h2 className="font-display text-xl font-extrabold">
                {section.emoji} {section.heading}
              </h2>
              <p className="mt-2 text-ink-soft">{section.body}</p>
              {section.bullets && (
                <ul className="mt-3 space-y-1.5">
                  {section.bullets.map((b: string) => (
                    <li key={b} className="flex gap-2 text-sm">
                      <span className="text-mango-deep">★</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          {lesson.phrases && lesson.phrases.length > 0 && (
            <section className="wj-card p-6">
              <h2 className="font-display text-xl font-extrabold">💬 Words for this adventure</h2>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left font-display text-ink-soft">
                      <th className="pb-2 pr-4">English</th>
                      <th className="pb-2 pr-4">Tagalog</th>
                      <th className="pb-2">Say it like...</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lesson.phrases.map((p: any) => (
                      <tr key={p.english} className="border-t border-sand-deep">
                        <td className="py-2.5 pr-4 font-bold">{p.english}</td>
                        <td className="py-2.5 pr-4 font-bold text-sunset-deep">{p.tagalog}</td>
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

          {lesson.familyChallenge && (
            <section className="wj-card-bubble wj-note p-6">
              <h2 className="font-display text-xl text-white">🏆 Family Challenge</h2>
              <p className="mt-2 font-semibold text-white/95">{lesson.familyChallenge}</p>
            </section>
          )}

          {lesson.reflection && (
            <section className="wj-card p-6">
              <h2 className="font-display text-xl font-extrabold">💭 Reflection</h2>
              <p className="mt-2 text-ink-soft">{lesson.reflection}</p>
              {lesson.gratitudePrompt && (
                <div className="mt-4 rounded-2xl bg-sand p-4">
                  <p className="text-sm font-bold text-ink-soft">Gratitude prompt for the journal:</p>
                  <p className="mt-1 italic">&ldquo;{lesson.gratitudePrompt}&rdquo;</p>
                  <Link href="/blessings" className="wj-btn mt-3 text-sm">
                    Write it in Morning Blessings 🙏
                  </Link>
                </div>
              )}
            </section>
          )}
        </>
      )}

      {/* Complete + passport stamp applies to both */}
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
