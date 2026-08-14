
const fs = require("fs");
const file = "src/app/(app)/lessons/[id]/lesson-view.tsx";
let content = fs.readFileSync(file, "utf-8");

// Conditionally render premium fields
const premiumBlock = `
      {lesson.premiumContent ? (
        <>
          <section className="wj-card p-6 border-t-4 border-t-mango">
            <h2 className="font-display text-2xl font-extrabold text-mango-deep">?? The Premium Journey</h2>
            {lesson.premiumContent.essentialQuestion && (
              <div className="mt-4 p-4 bg-sand rounded-xl border border-sand-deep">
                <p className="text-sm font-bold text-ink-soft uppercase tracking-wider">Essential Question</p>
                <p className="mt-1 text-lg italic text-ink font-serif">{lesson.premiumContent.essentialQuestion}</p>
              </div>
            )}
            
            {lesson.premiumContent.keyFacts && (
              <div className="mt-6">
                <h3 className="font-display text-lg font-bold">Key Discoveries</h3>
                <ul className="mt-3 space-y-2">
                  {lesson.premiumContent.keyFacts.map((fact, idx) => (
                    <li key={idx} className="flex gap-2 text-md">
                      <span className="text-ocean-deep">??</span>
                      <span>{fact}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {lesson.premiumContent.vocabulary && lesson.premiumContent.vocabulary.length > 0 && (
              <div className="mt-6">
                <h3 className="font-display text-lg font-bold">New Words</h3>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {lesson.premiumContent.vocabulary.map(v => (
                    <div key={v.word} className="p-3 bg-white rounded-lg border border-sand-deep shadow-sm">
                      <p className="font-bold text-lg">{v.word} <span className="text-sm text-ink-soft ml-2">({v.language})</span></p>
                      <p className="text-sunset-deep">{v.translation}</p>
                      <p className="text-xs text-ink-soft mt-1">??? {v.pronunciation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {lesson.premiumContent.ageDifferentiation && (
              <div className="mt-6 p-5 bg-ocean/10 rounded-xl">
                <h3 className="font-display text-lg font-bold">Family Challenge by Age</h3>
                <div className="mt-3 space-y-3">
                  <p><strong>?? Explorer (7-8):</strong> {lesson.premiumContent.ageDifferentiation.explorer}</p>
                  <p><strong>?? Adventure (9-10):</strong> {lesson.premiumContent.ageDifferentiation.adventure}</p>
                  <p><strong>?? Trailblazer (11-12+):</strong> {lesson.premiumContent.ageDifferentiation.trailblazer}</p>
                </div>
              </div>
            )}
          </section>
        </>
      ) : (
        <>
`;

content = content.replace(
  "{/* Content sections */}",
  "{/* Content sections */}\n" + premiumBlock
);

content = content.replace(
  "{/* Phrases */}",
  "</>\n      )}\n\n      {/* Phrases */}"
);

fs.writeFileSync(file, content);
console.log("lesson-view.tsx updated.");

