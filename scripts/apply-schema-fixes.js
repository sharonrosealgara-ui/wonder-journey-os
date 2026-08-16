
const fs = require("fs");
const path = require("path");

function replaceInFile(filepath, replacements) {
  let content = fs.readFileSync(filepath, "utf8");
  for (const [search, replace] of replacements) {
    content = content.split(search).join(replace);
  }
  fs.writeFileSync(filepath, content, "utf8");
}

replaceInFile(path.join(__dirname, "../src/app/(app)/lessons/[id]/lesson-view.tsx"), [
  ["lesson.richExplanation", "lesson.premiumContent?.richExplanation"],
  ["lesson.adventureHook", "lesson.premiumContent?.adventureHook"],
  ["lesson.topic", "lesson.premiumContent?.topic"],
  ["lesson.essentialQuestion", "lesson.premiumContent?.essentialQuestion"],
  ["lesson.keyFacts", "lesson.premiumContent?.keyFacts"],
  ["lesson.vocabulary", "lesson.premiumContent?.vocabulary"],
  ["lesson.curatedResources", "lesson.premiumContent?.curatedResources"],
  ["lesson.ageDifferentiation", "lesson.premiumContent?.ageDifferentiation"],
  ["lesson.learnerReflection", "lesson.premiumContent?.learnerReflection"],
  ["fact: any, idx: any", "fact: string, idx: number"],
  ["v: any, i: any", "v: any, i: number"],
  ["r: any", "r: any"]
]);

replaceInFile(path.join(__dirname, "../src/lib/slides.ts"), [
  ["lesson.richExplanation", "lesson.premiumContent?.richExplanation"],
  ["lesson.adventureHook", "lesson.premiumContent?.adventureHook"],
  ["lesson.essentialQuestion", "lesson.premiumContent?.essentialQuestion"],
  ["lesson.discoveries", "lesson.premiumContent?.discoveries"],
  ["lesson.keyFacts", "lesson.premiumContent?.keyFacts"],
  ["lesson.vocabulary", "lesson.premiumContent?.vocabulary"],
  ["lesson.mediaMoments", "lesson.premiumContent?.mediaMoments"],
  ["lesson.guidedDiscussion", "lesson.premiumContent?.guidedDiscussion"],
  ["lesson.ageDifferentiation", "lesson.premiumContent?.ageDifferentiation"],
  ["lesson.handsOnTask", "lesson.premiumContent?.handsOnTask"],
  ["lesson.game", "lesson.premiumContent?.game"],
  ["lesson.knowledgeCheck", "lesson.premiumContent?.knowledgeCheck"],
  ["lesson.premiumAssessment", "lesson.premiumContent?.premiumAssessment"],
  ["lesson.learnerReflection", "lesson.premiumContent?.learnerReflection"],
  ["re: any, i: any", "re: any, i: number"],
  ["mm: any, i: any", "mm: any, i: number"]
]);

console.log("Fixed schema accesses in UI files.");

