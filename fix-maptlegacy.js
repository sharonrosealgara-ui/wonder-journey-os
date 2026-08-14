
const fs = require("fs");
const file = "src/config/lessons.ts";
let content = fs.readFileSync(file, "utf-8");

const legacyFn = `
import { CurriculumLesson, FamilyPremiumLesson, createFamilyPremiumProjection } from "../lib/curriculum-schema";

function mapToLegacy(c: CurriculumLesson, order: number, emoji: string): any {
  return {
    id: c.id,
    order,
    title: c.title,
    subtitle: c.unit,
    emoji,
    category: "Philippines",
    date: c.date,
    time: "9:00 AM",
    materials: c.materials || [],
    canvaLink: "",
    videoLinks: [],
    familyChallenge: c.familyChallenge || "",
    notes: "",
    sections: c.richExplanation && c.richExplanation.length > 0
      ? c.richExplanation.map(r => ({ heading: r.heading || "Fact", emoji: "??", body: r.body }))
      : [
          { heading: "Objective", emoji: "??", body: c.learningObjectives?.join(", ") || "" },
          { heading: "Fact", emoji: "??", body: c.factualBackground || "" },
          { heading: "Beginner", emoji: "??", body: c.activities?.beginnerSupport || "" },
          { heading: "Core", emoji: "?", body: c.activities?.coreActivity || "" },
          { heading: "Advanced", emoji: "??", body: c.activities?.advancedChallenge || "" }
        ],
    phrases: c.vocabulary ? c.vocabulary.map(v => ({ english: v.translation, tagalog: v.word, pronunciation: v.pronunciation })) : [],
    reflection: c.learnerReflection || "",
    premiumContent: createFamilyPremiumProjection(c),
    gratitudePrompt: "Today I am grateful to the Lord for..."
  };
}

const pilotLessons = stage2Lessons.map((l, i) => mapToLegacy(l, i + 1, "??"));
`;

content = content.replace(
  /import { CurriculumLesson.*const pilotLessons = stage2Lessons\.map[^\n]+\n/s,
  legacyFn
);

fs.writeFileSync(file, content);
console.log("Fixed mapToLegacy");

