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
          <section className="wj-card p-6 border-t-4 border-t-mango space-y-8">
            <h2 className="font-display text-2xl font-extrabold text-mango-deep">🌟 The Premium Journey</h2>

            {lesson.premiumContent?.adventureHook && (
              <div className="p-5 bg-mango/10 rounded-xl">
                <h3 className="font-display text-xl font-bold">🎣 Adventure Hook</h3>
                <p className="mt-2 text-ink leading-relaxed">{lesson.premiumContent.adventureHook}</p>
              </div>
            )}

            {lesson.premiumContent?.essentialQuestion && (
              <div className="p-5 bg-sand rounded-xl border border-sand-deep text-center">
                <p className="text-sm font-bold text-ink-soft uppercase tracking-wider">Essential Question</p>
                <p className="mt-2 text-xl italic text-ink font-serif font-semibold">"{lesson.premiumContent.essentialQuestion}"</p>
              </div>
            )}

            {lesson.premiumContent?.discoveries && lesson.premiumContent.discoveries.length > 0 && (
              <div>
                <h3 className="font-display text-xl font-bold">🔍 Discoveries</h3>
                <div className="mt-3 space-y-3">
                  {lesson.premiumContent.discoveries.map((disc, idx) => (
                    <div key={idx} className="rounded-xl border border-sand-deep bg-white p-4 shadow-sm">
                      <h4 className="font-bold text-lg text-ocean-deep flex items-center gap-2">
                        <span>✨</span>
                        <span>{typeof disc === "string" ? disc : disc.title}</span>
                      </h4>
                      {typeof disc === "object" && disc.description && (
                        <p className="mt-1.5 text-ink-soft text-sm leading-relaxed">{disc.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {lesson.premiumContent?.richExplanation && lesson.premiumContent.richExplanation.length > 0 && (
              <div className="space-y-6">
                <h3 className="font-display text-xl font-bold">📖 Story & Explanation</h3>
                {lesson.premiumContent.richExplanation.map((section, idx) => (
                  <div key={idx} className="space-y-2">
                    {section.heading && (
                      <h4 className="font-bold text-lg text-ink flex items-center gap-2">
                        <span>{section.emoji || "📖"}</span>
                        <span>{section.heading}</span>
                      </h4>
                    )}
                    <p className="text-ink leading-relaxed">{section.body}</p>
                  </div>
                ))}
              </div>
            )}

            {lesson.premiumContent?.keyFacts && lesson.premiumContent.keyFacts.length > 0 && (
              <div className="p-5 bg-white border border-sand-deep rounded-xl shadow-sm">
                <h3 className="font-display text-lg font-bold text-sunset-deep">💡 Key Facts</h3>
                <ul className="mt-3 space-y-2">
                  {lesson.premiumContent.keyFacts.map((fact, idx) => (
                    <li key={idx} className="flex gap-2 text-md">
                      <span>💡</span>
                      <span className="font-medium text-ink">{fact}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {lesson.premiumContent?.realWorldConnection && (
              <div className="p-5 bg-ocean/10 rounded-xl">
                <h3 className="font-display text-lg font-bold text-ocean-deep">🌏 Real-World Connection</h3>
                <p className="mt-2 text-ink leading-relaxed">{lesson.premiumContent.realWorldConnection}</p>
              </div>
            )}

            {lesson.premiumContent?.vocabulary && lesson.premiumContent.vocabulary.length > 0 && (
              <div>
                <h3 className="font-display text-lg font-bold">💬 New Words</h3>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {lesson.premiumContent.vocabulary.map((v, i) => (
                    <div key={v.word || i} className="p-4 bg-white rounded-lg border border-sand-deep shadow-sm">
                      <p className="font-bold text-lg">{v.word} {v.language && <span className="text-sm text-ink-soft ml-2">({v.language})</span>}</p>
                      {v.translation && <p className="text-sunset-deep font-semibold">{v.translation}</p>}
                      {v.pronunciation && <p className="text-xs text-ink-soft mt-1">🔊 {v.pronunciation}</p>}
                      {v.contextualExample && <p className="text-sm italic mt-2 text-ink-soft">"{v.contextualExample}"</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {lesson.premiumContent?.mediaMoments && lesson.premiumContent.mediaMoments.length > 0 && (
              <div>
                <h3 className="font-display text-lg font-bold">🖼️ Media Moments</h3>
                <div className="mt-3 space-y-4">
                  {lesson.premiumContent.mediaMoments.map((media, i) => (
                    <div key={i} className="p-4 bg-sand rounded-lg border border-sand-deep">
                      <p className="font-bold">{media.requiredType} - {media.description}</p>
                      <p className="text-sm mt-1 text-ink-soft">{media.purpose}</p>
                      {media.sourceRequirement && <p className="text-xs text-ocean-deep mt-1"><strong>Source:</strong> {media.sourceRequirement}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {lesson.premiumContent?.guidedDiscussion && lesson.premiumContent.guidedDiscussion.length > 0 && (
              <div className="p-5 bg-hibiscus-light rounded-xl border border-hibiscus-deep/20">
                <h3 className="font-display text-lg font-bold text-hibiscus-deep">🗣️ Guided Discussion</h3>
                <ul className="mt-3 space-y-2.5">
                  {lesson.premiumContent.guidedDiscussion.map((q, i) => (
                    <li key={i} className="flex gap-2 text-md">
                      <span className="text-hibiscus-deep">💬</span>
                      <span className="font-medium text-ink">{q}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {lesson.premiumContent?.ageDifferentiation && (
              <div className="p-5 bg-ocean/10 rounded-xl">
                <h3 className="font-display text-lg font-bold">👥 Family Challenge by Age</h3>
                <div className="mt-3 space-y-3">
                  {lesson.premiumContent.ageDifferentiation.explorer && (
                    <p><strong>🧭 Explorer (7-8):</strong> {lesson.premiumContent.ageDifferentiation.explorer}</p>
                  )}
                  {lesson.premiumContent.ageDifferentiation.adventure && (
                    <p><strong>🏕️ Adventure (9-10):</strong> {lesson.premiumContent.ageDifferentiation.adventure}</p>
                  )}
                  {lesson.premiumContent.ageDifferentiation.trailblazer && (
                    <p><strong>🏔️ Trailblazer (11-12+):</strong> {lesson.premiumContent.ageDifferentiation.trailblazer}</p>
                  )}
                </div>
              </div>
            )}

            {lesson.premiumContent?.handsOnTask && (
              <div className="p-5 bg-mango/10 rounded-xl border border-mango-deep/20">
                <h3 className="font-display text-lg font-bold text-mango-deep">🎨 Hands-On Mission</h3>
                <p className="mt-2 font-bold">{lesson.premiumContent.handsOnTask.title}</p>
                {lesson.premiumContent.handsOnTask.description && (
                  <p className="mt-1 text-sm text-ink-soft">{lesson.premiumContent.handsOnTask.description}</p>
                )}
                {lesson.premiumContent.handsOnTask.materials && lesson.premiumContent.handsOnTask.materials.length > 0 && (
                  <p className="mt-2 text-sm"><strong>Materials:</strong> {lesson.premiumContent.handsOnTask.materials.join(", ")}</p>
                )}
                {lesson.premiumContent.handsOnTask.steps && (
                  <ol className="mt-2 list-decimal list-inside space-y-1 text-sm text-ink">
                    {lesson.premiumContent.handsOnTask.steps.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>
                )}
                {lesson.premiumContent.handsOnTask.accessibilityAlternative && (
                  <p className="mt-3 text-xs italic text-ink-soft bg-white/70 p-3 rounded-lg">
                    <strong>Alternative:</strong> {lesson.premiumContent.handsOnTask.accessibilityAlternative}
                  </p>
                )}
              </div>
            )}

            {lesson.premiumContent?.game && (
              <div className="p-5 bg-sunset/10 rounded-xl border border-sunset-deep/20">
                <h3 className="font-display text-lg font-bold text-sunset-deep">🎲 Game: {lesson.premiumContent.game.title}</h3>
                <p className="mt-2 text-sm leading-relaxed"><strong>Objective:</strong> {lesson.premiumContent.game.objective}</p>
                {lesson.premiumContent.game.materials && lesson.premiumContent.game.materials.length > 0 && (
                  <p className="mt-1.5 text-sm"><strong>Materials:</strong> {lesson.premiumContent.game.materials.join(", ")}</p>
                )}
                {lesson.premiumContent.game.setup && (
                  <p className="mt-1.5 text-sm"><strong>Setup:</strong> {lesson.premiumContent.game.setup}</p>
                )}
                <p className="mt-1.5 text-sm"><strong>Rules:</strong> {lesson.premiumContent.game.rules}</p>
                {lesson.premiumContent.game.winCondition && (
                  <p className="mt-1.5 text-sm font-semibold text-sunset-deep"><strong>Completion:</strong> {lesson.premiumContent.game.winCondition}</p>
                )}
                {lesson.premiumContent.game.adaptation && (
                  <p className="mt-1.5 text-xs text-ink-soft italic"><strong>Age Adaptations:</strong> {lesson.premiumContent.game.adaptation}</p>
                )}
              </div>
            )}

            {lesson.premiumContent?.misconceptions && lesson.premiumContent.misconceptions.length > 0 && (
              <div className="p-5 bg-ocean/10 rounded-xl border border-ocean-deep/20">
                <h3 className="font-display text-lg font-bold text-ocean-deep">💡 Check Your Thinking</h3>
                <div className="mt-3 space-y-2.5">
                  {lesson.premiumContent.misconceptions.map((item, idx) => (
                    <div key={idx} className="rounded-lg bg-white p-3.5 shadow-sm border border-sand-deep">
                      <p className="text-sm font-medium text-ink">
                        {typeof item === "string" ? item : (item as any).prompt || (item as any).misconception}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {lesson.premiumContent?.crossSubjectConnections && (
              <div>
                <h3 className="font-display text-lg font-bold">🔗 Cross-Subject Connections</h3>
                <ul className="mt-2 list-disc list-inside space-y-1 text-sm text-ink">
                  {Array.isArray(lesson.premiumContent.crossSubjectConnections)
                    ? lesson.premiumContent.crossSubjectConnections.map((conn, i) => (
                        <li key={i}>{typeof conn === "string" ? conn : JSON.stringify(conn)}</li>
                      ))
                    : Object.entries(lesson.premiumContent.crossSubjectConnections).map(([subj, desc]) => (
                        <li key={subj}><strong>{subj.charAt(0).toUpperCase() + subj.slice(1)}:</strong> {desc}</li>
                      ))
                  }
                </ul>
              </div>
            )}

            {lesson.premiumContent?.characterConnection && (
              <div className="p-4 bg-palm/10 rounded-lg">
                <h3 className="font-display text-lg font-bold text-palm-deep">🌱 Character Connection</h3>
                <p className="mt-1 text-sm text-ink">{lesson.premiumContent.characterConnection}</p>
              </div>
            )}

            {lesson.premiumContent?.premiumAssessment && lesson.premiumContent.premiumAssessment.length > 0 && (
              <div className="p-5 bg-sand rounded-xl border border-sand-deep">
                <h3 className="font-display text-lg font-bold">📝 Premium Assessment</h3>
                <div className="mt-3 space-y-4">
                  {lesson.premiumContent.premiumAssessment.map((q, i) => (
                    <div key={i} className="space-y-1.5 text-left">
                      <p className="font-bold text-ink">
                        {i + 1}. {("question" in q && q.question) ? q.question : (q.type === "scenario-application" ? `${q.scenario} ${q.question}` : "Assessment Question")}
                      </p>
                      {"options" in q && Array.isArray(q.options) && q.options.length > 0 && (
                        <ul className="list-[lower-alpha] list-inside ml-2 text-sm text-ink-soft space-y-0.5">
                          {q.options.map((opt: string, j: number) => (
                            <li key={j}>{opt}</li>
                          ))}
                        </ul>
                      )}
                      {"pairs" in q && Array.isArray(q.pairs) && (
                        <ul className="list-disc list-inside ml-2 text-sm text-ink-soft">
                          {q.pairs.map((p: { left: string; right: string }, j: number) => (
                            <li key={j}>{p.left} = {p.right}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {lesson.premiumContent?.suggestedPacing && (
              <div className="p-4 bg-sand/60 rounded-xl border border-sand-deep">
                <h4 className="font-bold text-sm text-ink-soft uppercase tracking-wider">Suggested Pacing (~60 mins)</h4>
                {typeof lesson.premiumContent.suggestedPacing === "object" ? (
                  <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                    {"hook" in lesson.premiumContent.suggestedPacing && (
                      <span className="p-1.5 bg-white rounded border border-sand-deep">🎣 Hook: {lesson.premiumContent.suggestedPacing.hook}m</span>
                    )}
                    {"teaching" in lesson.premiumContent.suggestedPacing && (
                      <span className="p-1.5 bg-white rounded border border-sand-deep">📖 Core: {lesson.premiumContent.suggestedPacing.teaching}m</span>
                    )}
                    {"discussionVocabulary" in lesson.premiumContent.suggestedPacing && (
                      <span className="p-1.5 bg-white rounded border border-sand-deep">💬 Discussion: {lesson.premiumContent.suggestedPacing.discussionVocabulary}m</span>
                    )}
                    {"handsOnOrGame" in lesson.premiumContent.suggestedPacing && (
                      <span className="p-1.5 bg-white rounded border border-sand-deep">🛠️ Activity/Game: {lesson.premiumContent.suggestedPacing.handsOnOrGame}m</span>
                    )}
                    {"assessment" in lesson.premiumContent.suggestedPacing && (
                      <span className="p-1.5 bg-white rounded border border-sand-deep">📝 Assessment: {lesson.premiumContent.suggestedPacing.assessment}m</span>
                    )}
                    {"reflectionClosing" in lesson.premiumContent.suggestedPacing && (
                      <span className="p-1.5 bg-white rounded border border-sand-deep">💭 Closing: {lesson.premiumContent.suggestedPacing.reflectionClosing}m</span>
                    )}
                  </div>
                ) : (
                  <p className="mt-1 text-sm text-ink">{lesson.premiumContent.suggestedPacing}</p>
                )}
              </div>
            )}

            {lesson.premiumContent?.learnerReflection && (
              <div className="mt-6">
                <h2 className="font-display text-xl font-extrabold">💭 Reflection</h2>
                <p className="mt-2 text-ink-soft leading-relaxed">{lesson.premiumContent.learnerReflection}</p>
                {lesson.gratitudePrompt && (
                  <div className="mt-4 rounded-2xl bg-sand p-4 border border-sand-deep">
                    <p className="text-sm font-bold text-ink-soft">Gratitude prompt for the journal:</p>
                    <p className="mt-1 italic">&ldquo;{lesson.gratitudePrompt}&rdquo;</p>
                    <Link href="/blessings" className="wj-btn mt-3 text-sm">
                      Write it in Morning Blessings 🙏
                    </Link>
                  </div>
                )}
              </div>
            )}

            {(lesson.premiumContent?.familyChallenge || lesson.familyChallenge) && (
              <div className="wj-card-bubble wj-note p-6 mt-6">
                <h2 className="font-display text-xl text-white">🏆 Family Challenge</h2>
                <p className="mt-2 font-semibold text-white/95">{lesson.premiumContent?.familyChallenge || lesson.familyChallenge}</p>
              </div>
            )}

            {lesson.premiumContent?.curatedResources && lesson.premiumContent.curatedResources.length > 0 && (
              <div className="p-5 bg-mango/10 rounded-xl border border-mango-deep/20">
                <h3 className="font-display text-lg font-bold">📚 Curated Resources</h3>
                <ul className="mt-3 space-y-3">
                  {lesson.premiumContent.curatedResources.map((r, i) => (
                    <li key={r.id || i} className="flex flex-col text-md">
                      <a href={r.url} target="_blank" rel="noopener noreferrer" className="font-bold text-ocean-deep hover:underline">
                        🔗 {r.title}
                      </a>
                      <span className="text-sm text-ink-soft ml-6">{r.type} {r.provider ? `(${r.provider})` : ''} - {r.whyUseful}</span>
                    </li>
                  ))}
                </ul>
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
