const fs = require("fs");
const { execSync } = require("child_process");
const path = require("path");

const tempDir = path.join(__dirname, "../temp-validate");

console.log("Compiling stage 2 lessons for validation...");
try {
  execSync(`npx tsc src/config/lessons-stage2.ts --module commonjs --target ES2022 --outDir temp-validate --esModuleInterop true`, { stdio: "pipe" });
} catch (e) {
  console.error("Compilation failed:", e.stdout ? e.stdout.toString() : e);
  process.exit(1);
}

let stage2;
try {
  stage2 = require("../temp-validate/config/lessons-stage2.js");
} catch (e) {
  console.error("Failed to load compiled lessons-stage2.js:", e);
  process.exit(1);
}

const lessons = stage2.stage2Lessons || [];

const AUGUST_MANIFEST = [
  { id: "lesson-1-world-map", date: "2026-08-03", weekday: "Monday" },
  { id: "lesson-2-archipelago", date: "2026-08-04", weekday: "Tuesday" },
  { id: "lesson-3-luzon-visayas-mindanao", date: "2026-08-07", weekday: "Friday" },
  { id: "lesson-4-region", date: "2026-08-10", weekday: "Monday" },
  { id: "lesson-5-province", date: "2026-08-11", weekday: "Tuesday" },
  { id: "lesson-6-city", date: "2026-08-14", weekday: "Friday" },
  { id: "lesson-7-national-symbols", date: "2026-08-17", weekday: "Monday" },
  { id: "lesson-8-mountains", date: "2026-08-18", weekday: "Tuesday" },
  { id: "lesson-9-rivers-beaches", date: "2026-08-21", weekday: "Friday" },
  { id: "lesson-10-animals", date: "2026-08-24", weekday: "Monday" },
  { id: "lesson-11-plants", date: "2026-08-25", weekday: "Tuesday" },
  { id: "lesson-12-language", date: "2026-08-28", weekday: "Friday" },
  { id: "lesson-13-august-review", date: "2026-08-31", weekday: "Monday" }
];

const BANNED_STRINGS = [
  "pronunciation-0", "pronunciation-1", "pronunciation-2",
  "The Philippines has a rich heritage involving",
  "one of the most fascinating aspects of studying the Philippines",
  "Whether we are looking at maps, studying wildlife, or learning a new dialect",
  "Have you ever wondered about",
  "Let's dive into an adventure you will never forget",
  "dQw4w9WgXcQ",
  "youtube.com/results",
  "google.com/search",
  "canva.com", // Catch generic
  "Fact 1", "Fact 2", "Fact 3",
  "Official Guide to",
  "Educational Video on",
  "??", "???"
];

let globalErrors = [];
if (lessons.length !== 13) {
  globalErrors.push(`Expected 13 lessons, found ${lessons.length}`);
}

const matrix = [];
let lesson1Pass = true;
let lesson1Errors = [];

lessons.forEach((lesson, i) => {
  const errors = [];
  const expected = AUGUST_MANIFEST[i];

  if (!expected) {
    errors.push(`Unexpected lesson at index ${i}`);
  } else {
    if (lesson.id !== expected.id) errors.push(`ID mismatch: expected ${expected.id}, got ${lesson.id}`);
    if (lesson.date !== expected.date) errors.push(`Date mismatch: expected ${expected.date}, got ${lesson.date}`);
    if (lesson.weekday !== expected.weekday) errors.push(`Weekday mismatch: expected ${expected.weekday}, got ${lesson.weekday}`);
  }

  const str = JSON.stringify(lesson);
  BANNED_STRINGS.forEach(b => {
    if (str.includes(b) && !(b === "canva.com" && str.includes("canva.com/design/"))) {
      errors.push(`Contains banned string/placeholder: "${b}"`);
    }
  });

  if (lesson.id === "lesson-1-world-map") {
    if (lesson.publicationStatus !== "pilot") errors.push("Publication status must be pilot");
    if (!lesson.premiumAssessment || lesson.premiumAssessment.length < 5) errors.push("Missing or insufficient premiumAssessment (min 5)");

    if (lesson.vocabulary && lesson.vocabulary.length < 3) errors.push("Insufficient vocabulary (min 3)");
    (lesson.vocabulary || []).forEach(v => {
      if (!v.contextualExample) errors.push(`Vocabulary word ${v.word} missing contextualExample`);
    });

    if (!lesson.mediaMoments || lesson.mediaMoments.length < 3) errors.push("Insufficient mediaMoments (min 3)");
    if (!lesson.guidedDiscussion || lesson.guidedDiscussion.length < 2) errors.push("Insufficient guidedDiscussion (min 2)");
    if (!lesson.discoveries || lesson.discoveries.length < 3) errors.push("Insufficient discoveries (min 3)");

    if (!lesson.ageDifferentiation || !lesson.ageDifferentiation.explorer || !lesson.ageDifferentiation.adventure) errors.push("Missing complete ageDifferentiation");

    if (!lesson.handsOnTask || !lesson.handsOnTask.materials || !lesson.handsOnTask.steps || lesson.handsOnTask.steps.length < 3) errors.push("Missing structured handsOnTask");
    if (lesson.handsOnTask && !lesson.handsOnTask.accessibilityAlternative) errors.push("Missing real accessibility alternative in handsOnTask");

    if (!lesson.authoritativeSources || lesson.authoritativeSources.length < 2) errors.push("Insufficient authoritativeSources (min 2)");
    if (!lesson.curatedResources || lesson.curatedResources.length < 2) errors.push("Insufficient curatedResources (min 2)");

    if (!lesson.learnerReflection) errors.push("Missing specific reflection");
    if (!lesson.familyChallenge) errors.push("Missing specific family challenge");
    if (!lesson.teacherPreparation || lesson.teacherPreparation.length < 50) errors.push("Missing or weak specific teacher preparation");
    if (!lesson.suggestedPacing) errors.push("Missing suggested pacing");

    const keyCount = lesson.teacherAnswerKey ? Object.keys(lesson.teacherAnswerKey).length : 0;
    if (keyCount !== (lesson.premiumAssessment || []).length) {
      errors.push(`Answer key mismatch: ${keyCount} keys vs ${(lesson.premiumAssessment || []).length} assessments`);
    }

    const richExpChunks = lesson.richExplanation || [];
    const richExpWords = richExpChunks.reduce((acc, chunk) => acc + (chunk.body || "").split(/\s+/).length, 0);
    if (richExpWords < 400) errors.push(`richExplanation < 400 words (${richExpWords})`);
    if (richExpChunks.length < 4 || richExpChunks.length > 7) errors.push(`Explanation sections not 4-7 (${richExpChunks.length})`);

    // Scope check
    if (str.toLowerCase().includes("archipelago overreach")) errors.push("Scope overreach detected (archipelago)");
    if (str.toLowerCase().includes("island-group overreach")) errors.push("Scope overreach detected (island-group)");
  }

  const matrixRow = {
    canonicalId: lesson.id,
    title: lesson.title,
    date: lesson.date,
    premiumGate: errors.length === 0 ? "PASS" : "FAIL"
  };
  matrix.push(matrixRow);

  if (lesson.id === "lesson-1-world-map") {
    lesson1Errors = errors;
    if (errors.length > 0) lesson1Pass = false;
  }
});

console.table(matrix);

// Cleanup
fs.rmSync(tempDir, { recursive: true, force: true });

if (globalErrors.length > 0) {
  globalErrors.forEach(e => console.error(e));
}

if (!lesson1Pass) {
  console.error("\nLesson 1 Failed:");
  lesson1Errors.forEach(e => console.error("- " + e));
  process.exit(1);
} else {
  console.log("\nLesson 1 Premium Gate: PASS");
  console.log("Note: Lessons 2-13 may legitimately fail during Phase A development.");
  process.exit(0);
}
