const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

console.log("Running Family Dataset Projection Sync Test...");

const stages = [
  { rawFile: "src/config/lessons-stage2.ts", familyFile: "src/config/lessons-stage2-family.ts", exportName: "stage2Lessons", familyExport: "stage2LessonsFamily" },
  { rawFile: "src/config/lessons-stage4.ts", familyFile: "src/config/lessons-stage4-family.ts", exportName: "stage4Lessons", familyExport: "stage4LessonsFamily" },
  { rawFile: "src/config/lessons-stage5.ts", familyFile: "src/config/lessons-stage5-family.ts", exportName: "stage5Lessons", familyExport: "stage5LessonsFamily" },
  { rawFile: "src/config/lessons-stage6.ts", familyFile: "src/config/lessons-stage6-family.ts", exportName: "stage6Lessons", familyExport: "stage6LessonsFamily" },
  { rawFile: "src/config/lessons-stage7.ts", familyFile: "src/config/lessons-stage7-family.ts", exportName: "stage7Lessons", familyExport: "stage7LessonsFamily" }
];

const tempTsconfig = {
  compilerOptions: {
    target: "ES2022",
    module: "commonjs",
    moduleResolution: "node",
    esModuleInterop: true,
    baseUrl: ".",
    paths: {
      "@/*": ["src/*"]
    },
    outDir: "temp-sync-gen",
    noEmit: false,
    skipLibCheck: true
  },
  include: [
    "src/config/lessons-stage2.ts",
    "src/config/lessons-stage4.ts",
    "src/config/lessons-stage5.ts",
    "src/config/lessons-stage6.ts",
    "src/config/lessons-stage7.ts",
    "src/config/lessons-stage2-family.ts",
    "src/config/lessons-stage4-family.ts",
    "src/config/lessons-stage5-family.ts",
    "src/config/lessons-stage6-family.ts",
    "src/config/lessons-stage7-family.ts",
    "src/lib/curriculum-schema.ts",
    "src/lib/assessment-state.ts"
  ]
};

const tempConfigPath = path.join(__dirname, "../temp-sync-tsconfig.json");
fs.writeFileSync(tempConfigPath, JSON.stringify(tempTsconfig, null, 2), "utf8");

try {
  execSync(`npx tsc --project temp-sync-tsconfig.json`, { stdio: "pipe" });
} catch (e) {
  console.error("Compilation failed during sync test:", e.stdout ? e.stdout.toString() : e);
  if (fs.existsSync(tempConfigPath)) fs.unlinkSync(tempConfigPath);
  process.exit(1);
}

if (fs.existsSync(tempConfigPath)) fs.unlinkSync(tempConfigPath);

const { serializeForFamily } = require("../temp-sync-gen/lib/curriculum-schema.js");

const forbiddenTeacherKeys = [
  "teacherAnswerKey",
  "teacherPreparation",
  "privateTeacherNotes",
  "internalFactCheckNotes",
  "authoritativeSources",
  "sourceNotes",
  "mediaAttributionNotes",
  "factualSources"
];

const errors = [];

stages.forEach((s) => {
  const rawModPath = path.join(__dirname, `../temp-sync-gen/${s.rawFile.replace(/^src\//, "").replace(/\.ts$/, ".js")}`);
  const familyModPath = path.join(__dirname, `../temp-sync-gen/${s.familyFile.replace(/^src\//, "").replace(/\.ts$/, ".js")}`);

  const rawMod = require(rawModPath);
  const familyMod = require(familyModPath);

  const rawLessons = rawMod[s.exportName] || [];
  const familyLessons = familyMod[s.familyExport] || [];

  if (rawLessons.length !== familyLessons.length) {
    errors.push(`${s.familyFile}: Count mismatch. Raw has ${rawLessons.length} lessons, Family has ${familyLessons.length} lessons.`);
    return;
  }

  rawLessons.forEach((rawLesson, idx) => {
    const familyLesson = familyLessons[idx];
    if (!familyLesson || rawLesson.id !== familyLesson.id) {
      errors.push(`${s.familyFile}[${idx}]: ID mismatch. Expected ${rawLesson.id}, got ${familyLesson ? familyLesson.id : "undefined"}.`);
      return;
    }

    const expectedProjection = serializeForFamily(rawLesson);

    forbiddenTeacherKeys.forEach((key) => {
      if (key in familyLesson) {
        errors.push(`${s.familyFile} (${rawLesson.id}): Leaked teacher key "${key}" in Family dataset.`);
      }
    });

    if (rawLesson.premiumAssessment) {
      if (!familyLesson.premiumAssessment) {
        errors.push(`${s.familyFile} (${rawLesson.id}): Missing premiumAssessment in Family projection.`);
      } else if (rawLesson.premiumAssessment.length !== familyLesson.premiumAssessment.length) {
        errors.push(`${s.familyFile} (${rawLesson.id}): Assessment count mismatch.`);
      } else {
        familyLesson.premiumAssessment.forEach((q, qIdx) => {
          if ("correctAnswer" in q || "correctOptionId" in q || "expectedAnswerKeywords" in q || "expectedResolution" in q || "correctOrder" in q || "pairs" in q) {
            errors.push(`${s.familyFile} (${rawLesson.id}) Q${qIdx + 1}: Learner assessment DTO contains answer or internal key!`);
          }
        });
      }
    }

    if (familyLesson.title !== expectedProjection.title || familyLesson.topic !== expectedProjection.topic) {
      errors.push(`${s.familyFile} (${rawLesson.id}): Desynchronized title or topic with raw lesson.`);
    }
    if (familyLesson.familyChallenge !== expectedProjection.familyChallenge) {
      errors.push(`${s.familyFile} (${rawLesson.id}): Desynchronized familyChallenge with raw lesson.`);
    }
  });
});

try {
  fs.rmSync(path.join(__dirname, "../temp-sync-gen"), { recursive: true, force: true, maxRetries: 3, retryDelay: 100 });
} catch {
  // Gracefully handle Windows file system temp directory locks
}

if (errors.length > 0) {
  console.error("FAIL: Family projection sync test detected errors:");
  errors.forEach((e) => console.error(" - " + e));
  process.exit(1);
}

console.log("PASS: All 5 curriculum stages Family projections are 100% in sync with zero leaked teacher keys.");
process.exit(0);
