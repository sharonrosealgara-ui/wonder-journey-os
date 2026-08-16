
const fs = require("fs");
const path = require("path");

function replaceInFile(filepath, replacements) {
  let content = fs.readFileSync(filepath, "utf8");
  for (const [search, replace] of replacements) {
    content = content.split(search).join(replace);
  }
  fs.writeFileSync(filepath, content, "utf8");
}

replaceInFile(path.join(__dirname, "../src/lib/curriculum-schema.ts"), [
  ["| \"misconceptions\" | \"knowledgeCheck\"", "| \"misconceptions\" | \"premiumAssessment\" | \"knowledgeCheck\""]
]);

replaceInFile(path.join(__dirname, "../src/lib/slides.ts"), [
  ["mm.type", "mm.requiredType"]
]);

console.log("Fixed schema again.");

