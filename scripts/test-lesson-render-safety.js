const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const Module = require("module");

console.log("Running Lesson Render Safety Test...");

// Setup path alias resolver for compiled temp modules
const origResolve = Module._resolveFilename;
Module._resolveFilename = function(request, parent, isMain) {
  if (request.startsWith("@/")) {
    const rel = request.substring(2);
    const resolvedPath = path.join(__dirname, "../temp-validate", rel);
    return origResolve.call(this, resolvedPath, parent, isMain);
  }
  return origResolve.call(this, request, parent, isMain);
};

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
    outDir: "temp-validate",
    noEmit: false,
    skipLibCheck: true
  },
  include: [
    "src/config/lessons-stage2.ts",
    "src/lib/curriculum-schema.ts",
    "src/lib/slides.ts",
    "src/config/lessons.ts",
    "src/config/mascots.ts",
    "src/config/lessons-stage4.ts",
    "src/config/lessons-stage5.ts",
    "src/config/lessons-stage6.ts",
    "src/config/lessons-stage7.ts"
  ]
};

const tempConfigPath = path.join(__dirname, "../temp-test-tsconfig.json");
fs.writeFileSync(tempConfigPath, JSON.stringify(tempTsconfig, null, 2), "utf8");

try {
  execSync(`npx tsc --project temp-test-tsconfig.json`, { stdio: "pipe" });
} catch (e) {
  console.error("Compilation error in test-lesson-render-safety:", e.stdout ? e.stdout.toString() : e);
  if (fs.existsSync(tempConfigPath)) fs.unlinkSync(tempConfigPath);
  process.exit(1);
}

if (fs.existsSync(tempConfigPath)) fs.unlinkSync(tempConfigPath);

const stage2 = require("../temp-validate/config/lessons-stage2.js");
const lesson1 = stage2.stage2Lessons.find(l => l.id === "lesson-1-world-map");

if (!lesson1) {
  console.error("FAIL: lesson-1-world-map not found");
  process.exit(1);
}

// 2. Test schema projections and serialization
const { createFamilyPremiumProjection, serializeForFamily, validateCurriculumLesson } = require("../temp-validate/lib/curriculum-schema.js");

const validationResult = validateCurriculumLesson(lesson1);
if (!validationResult.ok) {
  console.error("FAIL: CurriculumLesson validation failed:", validationResult.errors);
  process.exit(1);
}

const familyProjection = createFamilyPremiumProjection(lesson1);
const familySerialized = serializeForFamily(lesson1);

// Verify teacher fields do not leak into Family projection or serialization
const teacherOnlyFields = ["teacherPreparation", "teacherAnswerKey", "privateTeacherNotes", "internalFactCheckNotes"];
for (const field of teacherOnlyFields) {
  if (field in familyProjection) {
    console.error(`FAIL: Teacher field ${field} leaked into createFamilyPremiumProjection`);
    process.exit(1);
  }
  if (field in familySerialized) {
    console.error(`FAIL: Teacher field ${field} leaked into serializeForFamily`);
    process.exit(1);
  }
}

// 3. Verify Discovery objects
if (!Array.isArray(familyProjection.discoveries) || familyProjection.discoveries.length === 0) {
  console.error("FAIL: familyProjection.discoveries is not an array");
  process.exit(1);
}
familyProjection.discoveries.forEach((d, i) => {
  if (typeof d !== "object" || typeof d.title !== "string" || typeof d.description !== "string") {
    console.error(`FAIL: Discovery ${i} is not a valid { title, description } object`);
    process.exit(1);
  }
});

// 4. Verify 3-tier age differentiation
if (!familyProjection.ageDifferentiation || !familyProjection.ageDifferentiation.explorer || !familyProjection.ageDifferentiation.adventure || !familyProjection.ageDifferentiation.trailblazer) {
  console.error("FAIL: Missing complete 3-tier age differentiation in family projection");
  process.exit(1);
}

// 5. Verify hands-on task
if (!familyProjection.handsOnTask || !familyProjection.handsOnTask.title || !Array.isArray(familyProjection.handsOnTask.steps)) {
  console.error("FAIL: Missing or invalid handsOnTask shape");
  process.exit(1);
}

// 6. Verify game
if (!familyProjection.game || !familyProjection.game.title || !familyProjection.game.rules || !familyProjection.game.winCondition) {
  console.error("FAIL: Missing or invalid game shape");
  process.exit(1);
}

// 7. Verify pacing
if (!familyProjection.suggestedPacing || typeof familyProjection.suggestedPacing !== "object" || !familyProjection.suggestedPacing.total) {
  console.error("FAIL: Missing or invalid suggestedPacing shape");
  process.exit(1);
}

// 8. Verify slides generation
const { buildSlides } = require("../temp-validate/lib/slides.js");
const { lessons } = require("../temp-validate/config/lessons.js");
const legacyLesson1 = lessons.find(l => l.id === "lesson-1-world-map");

if (!legacyLesson1) {
  console.error("FAIL: legacyLesson1 not found in mapped lessons array");
  process.exit(1);
}

const slides = buildSlides(legacyLesson1);
if (!Array.isArray(slides) || slides.length < 10) {
  console.error(`FAIL: buildSlides produced insufficient slides: ${slides.length}`);
  process.exit(1);
}

// Ensure every slide has valid id, kind, title, emoji, and mascot
slides.forEach((s, idx) => {
  if (!s.id || !s.kind || !s.title || !s.emoji || !s.mascot) {
    console.error(`FAIL: Slide ${idx} is missing required slide properties:`, s);
    process.exit(1);
  }
});

// Clean temp directory
fs.rmSync(path.join(__dirname, "../temp-validate"), { recursive: true, force: true });

console.log("PASS: Lesson Render Safety Test successfully verified all projection, DTO, and slide contracts!");
process.exit(0);
