
const fs = require("fs");
let file = fs.readFileSync("src/lib/curriculum-schema.ts", "utf-8");

file = file.replace(
  "curatedResources?: { id: string; title: string; url: string; type: string }[];",
  "curatedResources?: { id: string; title: string; url: string; type: string }[];\n  authoritativeSources?: { source: string; url: string; note: string }[];"
);

fs.writeFileSync("src/lib/curriculum-schema.ts", file);
console.log("Schema fixed!");

