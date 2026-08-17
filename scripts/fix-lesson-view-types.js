
const fs = require("fs");
let code = fs.readFileSync("src/app/(app)/lessons/[id]/lesson-view.tsx", "utf8");

// Media Moments
code = code.replace(
  /{lesson.premiumContent.mediaMoments.map\(\(media, i\) => \([\s\S]*?<\/div>\s*\)\)}/m,
  `{lesson.premiumContent.mediaMoments.map((media, i) => (
                    <div key={i} className="p-4 bg-sand rounded-lg border border-sand-deep">
                      <p className="font-bold">{media.requiredType} - {media.description}</p>
                      <p className="text-sm mt-1">{media.purpose}</p>
                      {media.sourceRequirement && <p className="text-xs text-ink-soft mt-1">Source: {media.sourceRequirement}</p>}
                    </div>
                  ))}`
);

// Game
code = code.replace(
  /{lesson.premiumContent\?.game && \([\s\S]*?<\/div>\s*\)}/m,
  `{lesson.premiumContent?.game && (
              <div className="p-4 bg-sunset/10 rounded-lg">
                <h3 className="font-display text-lg font-bold text-sunset-deep">?? Game: {lesson.premiumContent.game.title}</h3>
                <p className="mt-1"><strong>Objective:</strong> {lesson.premiumContent.game.objective}</p>
                {lesson.premiumContent.game.materials && lesson.premiumContent.game.materials.length > 0 && (
                  <p className="mt-1 text-sm"><strong>Materials:</strong> {lesson.premiumContent.game.materials.join(", ")}</p>
                )}
                <p className="mt-1 text-sm"><strong>Rules:</strong> {lesson.premiumContent.game.rules}</p>
              </div>
            )}`
);

// Knowledge Check
code = code.replace(
  /{lesson.premiumContent.knowledgeCheck.map\(\(check, i\) => \([\s\S]*?<\/li>\s*\)\)}/m,
  `{lesson.premiumContent.knowledgeCheck.map((check, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-ocean">??</span>
                      <span><strong>{check.question}</strong> - Answer: {check.correctAnswer}</span>
                    </li>
                  ))}`
);

// Premium Assessment
code = code.replace(
  /{lesson.premiumContent.premiumAssessment.map\(\(q, i\) => \([\s\S]*?<\/div>\s*\)\)}/m,
  `{lesson.premiumContent.premiumAssessment.map((q, i) => (
                    <div key={i} className="space-y-1">
                      <p className="font-bold">{i + 1}. [{q.type}] {q.type === "matching" ? "Matching Exercise" : q.type === "scenario-application" ? q.scenario + " " + q.question : q.question}</p>
                      {q.type === "multiple-choice" && q.options && (
                        <ul className="list-[lower-alpha] list-inside ml-2">
                          {q.options.map((opt, j) => (
                            <li key={j}>{opt}</li>
                          ))}
                        </ul>
                      )}
                      {q.type === "matching" && q.pairs && (
                         <ul className="list-disc list-inside ml-2">
                          {q.pairs.map((p, j) => (
                            <li key={j}>{p.left} = {p.right}</li>
                          ))}
                         </ul>
                      )}
                    </div>
                  ))}`
);

fs.writeFileSync("src/app/(app)/lessons/[id]/lesson-view.tsx", code, "utf8");

