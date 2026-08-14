
const fs = require("fs");
let file = fs.readFileSync("src/config/lessons.ts", "utf-8");

file = file.replace(
  "import { CurriculumLesson } from \"../lib/curriculum-schema\";",
  "import { CurriculumLesson, FamilyPremiumLesson, createFamilyPremiumProjection } from \"../lib/curriculum-schema\";"
);

file = file.replace(
  "gratitudePrompt: string;",
  "gratitudePrompt: string;\n  premiumContent?: FamilyPremiumLesson;"
);

file = file.replace(
  "reflection: c.learnerReflection,",
  "reflection: c.learnerReflection,\n    premiumContent: createFamilyPremiumProjection(c),"
);

fs.writeFileSync("src/config/lessons.ts", file);
console.log("lessons.ts updated.");

