
const fs = require("fs");
const file = "src/app/(app)/lessons/[id]/lesson-view.tsx";
let content = fs.readFileSync(file, "utf-8");

const curatedBlock = `
            {lesson.premiumContent.curatedResources && lesson.premiumContent.curatedResources.length > 0 && (
              <div className="mt-6 p-5 bg-mango/10 rounded-xl border border-mango-deep/20">
                <h3 className="font-display text-lg font-bold">Curated Resources</h3>
                <ul className="mt-3 space-y-3">
                  {lesson.premiumContent.curatedResources.map(r => (
                    <li key={r.id} className="flex flex-col text-md">
                      <a href={r.url} target="_blank" rel="noopener noreferrer" className="font-bold text-ocean-deep hover:underline">
                        ?? {r.title}
                      </a>
                      <span className="text-sm text-ink-soft ml-6">{r.type}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
`;

content = content.replace(
  "{lesson.premiumContent.ageDifferentiation && (",
  curatedBlock + "\n            {lesson.premiumContent.ageDifferentiation && ("
);

fs.writeFileSync(file, content);
console.log("lesson-view.tsx updated with curatedResources.");

