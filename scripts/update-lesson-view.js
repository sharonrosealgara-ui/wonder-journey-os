
const fs = require("fs");
let code = fs.readFileSync("src/app/(app)/lessons/[id]/lesson-view.tsx", "utf8");

const start = code.indexOf("<section className=\"wj-card p-6 border-t-4 border-t-mango space-y-6\">");
const end = code.indexOf("</section>", start) + "</section>".length;

const newSection = `<section className="wj-card p-6 border-t-4 border-t-mango space-y-8">
            <h2 className="font-display text-2xl font-extrabold text-mango-deep">?? The Premium Journey</h2>

            {lesson.premiumContent?.adventureHook && (
              <div className="p-5 bg-mango/10 rounded-xl">
                <h3 className="font-display text-xl font-bold">?? Adventure Hook</h3>
                <p className="mt-2 text-ink">{lesson.premiumContent.adventureHook}</p>
              </div>
            )}

            {lesson.premiumContent?.essentialQuestion && (
              <div className="p-4 bg-sand rounded-xl border border-sand-deep text-center">
                <p className="text-sm font-bold text-ink-soft uppercase tracking-wider">Essential Question</p>
                <p className="mt-2 text-xl italic text-ink font-serif">"{lesson.premiumContent.essentialQuestion}"</p>
              </div>
            )}

            {lesson.premiumContent?.discoveries && lesson.premiumContent.discoveries.length > 0 && (
              <div>
                <h3 className="font-display text-xl font-bold">?? Discoveries</h3>
                <ul className="mt-3 space-y-2">
                  {lesson.premiumContent.discoveries.map((disc, idx) => (
                    <li key={idx} className="flex gap-2 text-md">
                      <span className="text-ocean-deep">?</span>
                      <span>{disc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {lesson.premiumContent?.richExplanation && lesson.premiumContent.richExplanation.length > 0 && (
              <div className="space-y-6">
                <h3 className="font-display text-xl font-bold">?? Story & Explanation</h3>
                {lesson.premiumContent.richExplanation.map((section, idx) => (
                  <div key={idx}>
                    {section.heading && <h4 className="font-bold text-lg">{section.heading}</h4>}
                    <p className="mt-2 text-ink">{section.body}</p>
                  </div>
                ))}
              </div>
            )}

            {lesson.premiumContent?.keyFacts && lesson.premiumContent.keyFacts.length > 0 && (
              <div className="p-5 bg-white border border-sand-deep rounded-xl shadow-sm">
                <h3 className="font-display text-lg font-bold text-sunset-deep">?? Key Facts</h3>
                <ul className="mt-3 space-y-2">
                  {lesson.premiumContent.keyFacts.map((fact, idx) => (
                    <li key={idx} className="flex gap-2 text-md">
                      <span>??</span>
                      <span>{fact}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {lesson.premiumContent?.realWorldConnection && (
              <div>
                <h3 className="font-display text-lg font-bold text-ocean-deep">?? Real-World Connection</h3>
                <p className="mt-2">{lesson.premiumContent.realWorldConnection}</p>
              </div>
            )}

            {lesson.premiumContent?.vocabulary && lesson.premiumContent.vocabulary.length > 0 && (
              <div>
                <h3 className="font-display text-lg font-bold">?? New Words</h3>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {lesson.premiumContent.vocabulary.map((v, i) => (
                    <div key={v.word || i} className="p-4 bg-white rounded-lg border border-sand-deep shadow-sm">
                      <p className="font-bold text-lg">{v.word} {v.language && <span className="text-sm text-ink-soft ml-2">({v.language})</span>}</p>
                      <p className="text-sunset-deep">{v.translation}</p>
                      {v.pronunciation && <p className="text-xs text-ink-soft mt-1">?? {v.pronunciation}</p>}
                      {v.contextualExample && <p className="text-sm italic mt-2 text-ink-soft">"{v.contextualExample}"</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {lesson.premiumContent?.mediaMoments && lesson.premiumContent.mediaMoments.length > 0 && (
              <div>
                <h3 className="font-display text-lg font-bold">??? Media Moments</h3>
                <div className="mt-3 space-y-4">
                  {lesson.premiumContent.mediaMoments.map((media, i) => (
                    <div key={i} className="p-4 bg-sand rounded-lg border border-sand-deep">
                      <p className="font-bold">{media.type} - {media.description}</p>
                      {media.url && (
                        <a href={media.url} target="_blank" rel="noopener noreferrer" className="text-sm text-ocean hover:underline block mt-1">
                          View Media ?
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {lesson.premiumContent?.ageDifferentiation && (
              <div className="p-5 bg-ocean/10 rounded-xl">
                <h3 className="font-display text-lg font-bold">?? Family Challenge by Age</h3>
                <div className="mt-3 space-y-3">
                  <p><strong>?? Explorer (7-8):</strong> {lesson.premiumContent.ageDifferentiation.explorer}</p>
                  <p><strong>??? Adventure (9-10):</strong> {lesson.premiumContent.ageDifferentiation.adventure}</p>
                  <p><strong>?? Trailblazer (11-12+):</strong> {lesson.premiumContent.ageDifferentiation.trailblazer}</p>
                </div>
              </div>
            )}

            {lesson.premiumContent?.handsOnTask && (
              <div className="p-5 bg-mango/10 rounded-xl border border-mango-deep/20">
                <h3 className="font-display text-lg font-bold text-mango-deep">? Hands-On Mission</h3>
                <p className="mt-2 font-bold">{lesson.premiumContent.handsOnTask.title}</p>
                {lesson.premiumContent.handsOnTask.materials && lesson.premiumContent.handsOnTask.materials.length > 0 && (
                  <p className="mt-2 text-sm"><strong>Materials:</strong> {lesson.premiumContent.handsOnTask.materials.join(", ")}</p>
                )}
                {lesson.premiumContent.handsOnTask.steps && (
                  <ol className="mt-2 list-decimal list-inside space-y-1">
                    {lesson.premiumContent.handsOnTask.steps.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>
                )}
                {lesson.premiumContent.handsOnTask.accessibilityAlternative && (
                  <p className="mt-3 text-sm italic text-ink-soft">Alternative: {lesson.premiumContent.handsOnTask.accessibilityAlternative}</p>
                )}
              </div>
            )}

            {lesson.premiumContent?.game && (
              <div className="p-4 bg-sunset/10 rounded-lg">
                <h3 className="font-display text-lg font-bold text-sunset-deep">?? Game</h3>
                <p className="mt-1">{lesson.premiumContent.game}</p>
              </div>
            )}

            {lesson.premiumContent?.crossSubjectConnections && lesson.premiumContent.crossSubjectConnections.length > 0 && (
              <div>
                <h3 className="font-display text-lg font-bold">?? Cross-Subject Connections</h3>
                <ul className="mt-2 list-disc list-inside">
                  {lesson.premiumContent.crossSubjectConnections.map((conn, i) => (
                    <li key={i}>{conn}</li>
                  ))}
                </ul>
              </div>
            )}

            {lesson.premiumContent?.characterConnection && (
              <div className="p-4 bg-palm/10 rounded-lg">
                <h3 className="font-display text-lg font-bold text-palm-deep">?? Character Connection</h3>
                <p className="mt-1">{lesson.premiumContent.characterConnection}</p>
              </div>
            )}

            {lesson.premiumContent?.knowledgeCheck && lesson.premiumContent.knowledgeCheck.length > 0 && (
              <div>
                <h3 className="font-display text-lg font-bold">? Check for Understanding</h3>
                <ul className="mt-2 space-y-2">
                  {lesson.premiumContent.knowledgeCheck.map((check, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-ocean">??</span>
                      <span>{check}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {lesson.premiumContent?.premiumAssessment && lesson.premiumContent.premiumAssessment.length > 0 && (
              <div className="p-5 bg-sand rounded-xl border border-sand-deep">
                <h3 className="font-display text-lg font-bold">?? Premium Assessment</h3>
                <div className="mt-3 space-y-4">
                  {lesson.premiumContent.premiumAssessment.map((q, i) => (
                    <div key={i} className="space-y-1">
                      <p className="font-bold">{i + 1}. {q.question}</p>
                      {q.options && q.options.length > 0 && (
                        <ul className="list-[lower-alpha] list-inside ml-2">
                          {q.options.map((opt, j) => (
                            <li key={j}>{opt}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {lesson.premiumContent?.learnerReflection && (
              <div className="mt-6">
                <h2 className="font-display text-xl font-extrabold">?? Reflection</h2>
                <p className="mt-2 text-ink-soft">{lesson.premiumContent.learnerReflection}</p>
                {lesson.gratitudePrompt && (
                  <div className="mt-4 rounded-2xl bg-sand p-4 border border-sand-deep">
                    <p className="text-sm font-bold text-ink-soft">Gratitude prompt for the journal:</p>
                    <p className="mt-1 italic">&ldquo;{lesson.gratitudePrompt}&rdquo;</p>
                    <Link href="/blessings" className="wj-btn mt-3 text-sm">
                      Write it in Morning Blessings ??
                    </Link>
                  </div>
                )}
              </div>
            )}

            {(lesson.premiumContent?.familyChallenge || lesson.familyChallenge) && (
              <div className="wj-card-bubble wj-note p-6 mt-6">
                <h2 className="font-display text-xl text-white">?? Family Challenge</h2>
                <p className="mt-2 font-semibold text-white/95">{lesson.premiumContent?.familyChallenge || lesson.familyChallenge}</p>
              </div>
            )}

            {lesson.premiumContent?.curatedResources && lesson.premiumContent.curatedResources.length > 0 && (
              <div className="p-5 bg-mango/10 rounded-xl border border-mango-deep/20">
                <h3 className="font-display text-lg font-bold">?? Curated Resources</h3>
                <ul className="mt-3 space-y-3">
                  {lesson.premiumContent.curatedResources.map(r => (
                    <li key={r.id} className="flex flex-col text-md">
                      <a href={r.url} target="_blank" rel="noopener noreferrer" className="font-bold text-ocean-deep hover:underline">
                        ?? {r.title}
                      </a>
                      <span className="text-sm text-ink-soft ml-6">{r.type} - {r.whyUseful}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>`;

const updated = code.substring(0, start) + newSection + code.substring(end);
fs.writeFileSync("src/app/(app)/lessons/[id]/lesson-view.tsx", updated, "utf8");

