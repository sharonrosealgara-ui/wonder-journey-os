const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

console.log("Running Client-Bundle Answer Leak Gate...");

const chunksDir = path.join(__dirname, "../.next/static/chunks");

if (!fs.existsSync(chunksDir)) {
  console.log("Building Next.js app to generate production client chunks...");
  execSync("npm run build", {
    stdio: "inherit",
    env: {
      ...process.env,
      NEXT_PUBLIC_SUPABASE_URL: "https://placeholder.supabase.co",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder"
    }
  });
}

function getAllJsFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllJsFiles(fullPath));
    } else if (file.endsWith(".js")) {
      results.push(fullPath);
    }
  });
  return results;
}

const clientJsFiles = getAllJsFiles(chunksDir);
console.log(`Scanning ${clientJsFiles.length} client JavaScript chunks in .next/static/chunks/...`);

const forbiddenClientKeys = [
  "teacherAnswerKey",
  "teacherPreparation",
  "correctOptionId",
  "expectedResolution",
  "expectedAnswerKeywords",
  "privateTeacherNotes",
  "internalFactCheckNotes",
  "authoritativeSources",
  "sourceNotes",
  "mediaAttributionNotes",
  "factualSources"
];

const answerKeyStrings = [
  "The Equator (Ekwador)",
  "False. The Philippines is an archipelago of about 7,641 islands.",
  "The Equator is the 0° latitude line dividing the Northern and Southern Hemispheres.",
  "The Philippines is an archipelago made of about 7,641 islands surrounded by water.",
  "Official surveys by the Philippine government record approximately 7,641 islands"
];

let answerStringHits = 0;
let teacherMetadataHits = 0;
let rawStage2ModuleHits = 0;
const errors = [];

clientJsFiles.forEach((filePath) => {
  const content = fs.readFileSync(filePath, "utf8");
  const relPath = path.relative(path.join(__dirname, ".."), filePath);

  if (content.includes("lessons-stage2.ts") || content.includes("lessons-stage2.js")) {
    rawStage2ModuleHits++;
    errors.push(`Raw stage2 module reference found in client chunk: ${relPath}`);
  }

  forbiddenClientKeys.forEach((key) => {
    if (content.includes(`"${key}"`) || content.includes(`'${key}'`) || content.includes(`${key}:`)) {
      teacherMetadataHits++;
      errors.push(`Teacher/internal metadata key "${key}" found in client chunk: ${relPath}`);
    }
  });

  answerKeyStrings.forEach((ans) => {
    if (content.includes(ans)) {
      answerStringHits++;
      errors.push(`Answer-bearing curriculum string "${ans}" found in client chunk: ${relPath}`);
    }
  });
});

console.log(`raw stage2 lesson module in Family client graph: ${rawStage2ModuleHits > 0 ? "YES" : "NO"}`);
console.log(`answer-bearing curriculum strings in Family browser JS: ${answerStringHits}`);
console.log(`teacher-only metadata in Family browser JS: ${teacherMetadataHits}`);

if (errors.length > 0) {
  console.error("\nFAIL: Client-bundle answer leak gate detected leaks in browser JavaScript:");
  errors.forEach((e) => console.error("- " + e));
  process.exit(1);
}

console.log("\nPASS: Client-bundle answer leak gate passed with 0 answer or teacher metadata leaks.");
process.exit(0);
