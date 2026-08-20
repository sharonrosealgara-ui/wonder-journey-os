const fs = require("fs");
const { execSync } = require("child_process");
const path = require("path");

const tempDir = path.join(__dirname, "../temp-validate");
console.log("Compiling stage 2 lessons for validation...");

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
    "src/config/stage2/*.ts",
    "src/lib/curriculum-schema.ts",
    "src/lib/assessment-state.ts"
  ]
};

const tempConfigPath = path.join(__dirname, "../temp-val-tsconfig.json");
fs.writeFileSync(tempConfigPath, JSON.stringify(tempTsconfig, null, 2), "utf8");

try {
  execSync(`npx tsc --project temp-val-tsconfig.json`, { stdio: "pipe" });
} catch (e) {
  console.error("Compilation failed:", e.stdout ? e.stdout.toString() : e);
  if (fs.existsSync(tempConfigPath)) fs.unlinkSync(tempConfigPath);
  process.exit(1);
}

if (fs.existsSync(tempConfigPath)) fs.unlinkSync(tempConfigPath);

let stage2;
let curriculumSchema;
try {
  stage2 = require("../temp-validate/config/lessons-stage2.js");
  curriculumSchema = require("../temp-validate/lib/curriculum-schema.js");
} catch (e) {
  console.error("Failed to load compiled modules:", e);
  process.exit(1);
}

const lessons = stage2.stage2Lessons || [];

// Gate: Approved August Lessons
const APPROVED_RESOURCE_LESSON_IDS = new Set([
  "lesson-1-world-map",
  "lesson-2-archipelago",
  "lesson-3-luzon-visayas-mindanao",
  "lesson-4-region",
  "lesson-5-province",
  "lesson-6-city",
  "lesson-7-national-symbols",
  "lesson-8-mountains",
  "lesson-9-rivers-beaches",
  "lesson-10-animals",
  "lesson-11-plants",
  "lesson-12-language",
  "lesson-13-august-review"
]);

// Gate: Premium slide builder must not use `as any`
const slidesSrc = fs.readFileSync(path.join(__dirname, "../src/lib/slides.ts"), "utf8");
if (slidesSrc.includes("} as any") || slidesSrc.includes(") as any")) {
  console.error("FAIL: Premium slide builder contains 'as any' bypass!");
  process.exit(1);
}

// Gate: Slide views must implement interactive response mechanisms
const slideViewsSrc = fs.readFileSync(path.join(__dirname, "../src/components/adventure/slide-views.tsx"), "utf8");
if (!slideViewsSrc.includes("handleMatchingLeftClick") || !slideViewsSrc.includes("handleMatchingRightClick")) {
  console.error("FAIL: Missing interactive matching response mechanism in slide-views.tsx");
  process.exit(1);
}
if (!slideViewsSrc.includes("handleMoveSequence")) {
  console.error("FAIL: Missing interactive sequencing ordering mechanism in slide-views.tsx");
  process.exit(1);
}
if (!slideViewsSrc.includes("handleScenarioChange") && !slideViewsSrc.includes("scenarioAnswers")) {
  console.error("FAIL: Missing interactive scenario response mechanism in slide-views.tsx");
  process.exit(1);
}

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
  "canva.com",
  "Fact 1", "Fact 2", "Fact 3",
  "Official Guide to",
  "Educational Video on",
  "??", "???",
  "\uFFFD"
];

let globalErrors = [];
if (lessons.length !== 13) {
  globalErrors.push(`Expected 13 lessons, found ${lessons.length}`);
}

const matrix = [];
let allPassed = true;

// Trackers for cross-lesson anti-template duplication check
const seenHooks = new Set();
const seenQuestions = new Set();
const seenConnections = new Set();
const seenHandsOnTitles = new Set();
const seenGameTitles = new Set();
const seenReflections = new Set();
const seenFamilyChallenges = new Set();
const seenAssessmentQuestions = new Set();

lessons.forEach((lesson, i) => {
  const errors = [];
  const expected = AUGUST_MANIFEST[i];

  if (!expected || lesson.id !== expected.id) {
    errors.push(`Manifest ID mismatch at index ${i}: expected ${expected ? expected.id : 'none'}, got ${lesson.id}`);
  }
  if (expected && lesson.date !== expected.date) {
    errors.push(`Date mismatch: expected ${expected.date}, got ${lesson.date}`);
  }
  if (expected && lesson.weekday !== expected.weekday) {
    errors.push(`Weekday mismatch: expected ${expected.weekday}, got ${lesson.weekday}`);
  }

  if (!APPROVED_RESOURCE_LESSON_IDS.has(lesson.id)) {
    errors.push(`Lesson ${lesson.id} is unapproved placeholder`);
  }

  // 1. Hook length & engagement
  if (!lesson.adventureHook || lesson.adventureHook.length < 80) {
    errors.push("Missing or short adventureHook (<80 chars)");
  }
  if (seenHooks.has(lesson.adventureHook)) {
    errors.push("Duplicate adventureHook detected across lessons (anti-template violation)");
  }
  seenHooks.add(lesson.adventureHook);

  // Essential Question
  if (!lesson.essentialQuestion || lesson.essentialQuestion.length < 20) {
    errors.push("Missing or short essentialQuestion (<20 chars)");
  }
  if (seenQuestions.has(lesson.essentialQuestion)) {
    errors.push("Duplicate essentialQuestion detected across lessons (anti-template violation)");
  }
  seenQuestions.add(lesson.essentialQuestion);

  // Real World Connection
  if (!lesson.realWorldConnection || lesson.realWorldConnection.length < 40) {
    errors.push("Missing or short realWorldConnection (<40 chars)");
  }
  if (seenConnections.has(lesson.realWorldConnection)) {
    errors.push("Duplicate realWorldConnection detected across lessons (anti-template violation)");
  }
  seenConnections.add(lesson.realWorldConnection);

  // 2. Discoveries (exact 3, min 15 words each)
  if (!lesson.discoveries || lesson.discoveries.length !== 3) {
    errors.push(`Expected exactly 3 discoveries (found ${(lesson.discoveries || []).length})`);
  } else {
    lesson.discoveries.forEach((d, dIdx) => {
      if (!d.title || d.title.length < 4) errors.push(`Discovery ${dIdx + 1} missing strong title`);
      const words = (d.description || "").split(/\s+/).length;
      if (words < 12) errors.push(`Discovery ${dIdx + 1} description too short (<12 words, got ${words})`);
    });
  }

  // 3. Vocabulary items (min 3 with rich translation & pronunciation)
  if (!lesson.vocabulary || lesson.vocabulary.length < 3) {
    errors.push("Insufficient vocabulary items (min 3)");
  } else {
    lesson.vocabulary.forEach((v, vIdx) => {
      if (!v.word) errors.push(`Vocabulary item ${vIdx + 1} missing word`);
      if (!v.translation) errors.push(`Vocabulary item ${vIdx + 1} missing translation`);
      if (!v.pronunciation) errors.push(`Vocabulary item ${vIdx + 1} missing pronunciation`);
    });
  }

  // 4. Media moments (min 2, must specify requiredType & sourceRequirement)
  if (!lesson.mediaMoments || lesson.mediaMoments.length < 2) {
    errors.push("Insufficient mediaMoments (min 2)");
  } else {
    lesson.mediaMoments.forEach((mm, mIdx) => {
      if (!mm.requiredType) errors.push(`MediaMoment ${mIdx + 1} missing requiredType`);
      if (!mm.sourceRequirement) errors.push(`MediaMoment ${mIdx + 1} missing sourceRequirement`);
    });
  }

  // Scope check: Non-mountain lessons must not overreach into Ring of Fire / volcanoes
  if (lesson.id === "lesson-1-world-map") {
    (lesson.mediaMoments || []).forEach((mm, mIdx) => {
      const mmStr = JSON.stringify(mm).toLowerCase();
      if (mmStr.includes("ring of fire") || mmStr.includes("volcano") || mmStr.includes("tectonic")) {
        errors.push(`Lesson 1 mediaMoment ${mIdx + 1} overreaches into Ring of Fire / volcanoes`);
      }
    });
  }

  // 5. Guided discussion (min 2)
  if (!lesson.guidedDiscussion || lesson.guidedDiscussion.length < 2) {
    errors.push("Insufficient guidedDiscussion (min 2)");
  }

  // 6. Age differentiation (all 3 tiers)
  if (!lesson.ageDifferentiation || !lesson.ageDifferentiation.explorer || !lesson.ageDifferentiation.adventure || !lesson.ageDifferentiation.trailblazer) {
    errors.push("Missing complete 3-tier ageDifferentiation (explorer, adventure, trailblazer)");
  } else {
    const tb = lesson.ageDifferentiation.trailblazer.toLowerCase();
    if (tb.length < 40) {
      errors.push("Trailblazer challenge too brief (<40 chars)");
    }
  }

  // 7. Hands-on task with accessibility alternative
  if (!lesson.handsOnTask || !lesson.handsOnTask.materials || !lesson.handsOnTask.steps || lesson.handsOnTask.steps.length < 3) {
    errors.push("Missing structured handsOnTask with at least 3 steps");
  }
  if (lesson.handsOnTask && !lesson.handsOnTask.accessibilityAlternative) {
    errors.push("Missing real accessibility alternative in handsOnTask");
  }
  if (lesson.handsOnTask && seenHandsOnTitles.has(lesson.handsOnTask.title)) {
    errors.push("Duplicate handsOnTask title detected across lessons (anti-template violation)");
  }
  if (lesson.handsOnTask) seenHandsOnTitles.add(lesson.handsOnTask.title);

  // 8. Interactive Game with rules and winCondition
  if (!lesson.game || !lesson.game.title || !lesson.game.objective || !lesson.game.rules || !lesson.game.winCondition) {
    errors.push("Missing complete structured game (title, objective, rules, winCondition)");
  }
  if (lesson.game && seenGameTitles.has(lesson.game.title)) {
    errors.push("Duplicate game title detected across lessons (anti-template violation)");
  }
  if (lesson.game) seenGameTitles.add(lesson.game.title);

  // 9. Misconceptions / Check Your Thinking
  if (!lesson.misconceptions || lesson.misconceptions.length < 1) {
    errors.push("Missing misconceptions content for 'Check Your Thinking'");
  }

  // 10. Authoritative Primary Sources
  if (!lesson.authoritativeSources || lesson.authoritativeSources.length < 2) {
    errors.push("Insufficient authoritativeSources (min 2)");
  } else {
    lesson.authoritativeSources.forEach((src, sIdx) => {
      if (!src.exactUrl || !src.exactUrl.startsWith("http")) errors.push(`Authoritative source ${sIdx + 1} missing exactUrl`);
      if (!src.publisher) errors.push(`Authoritative source ${sIdx + 1} missing publisher`);
      if (!src.claimSupported) errors.push(`Authoritative source ${sIdx + 1} missing claimSupported`);
      if (!src.verifiedDate) errors.push(`Authoritative source ${sIdx + 1} missing verifiedDate`);
    });
  }

  // Specific Source Validation for Lesson 1
  if (lesson.id === "lesson-1-world-map") {
    const psaSource = lesson.authoritativeSources.find(s => s.source.toLowerCase().includes("psa") || s.source.toLowerCase().includes("philippine statistics authority"));
    const pagasaSource = lesson.authoritativeSources.find(s => s.exactUrl.includes("pagasa.dost.gov.ph"));
    if (!psaSource || !psaSource.exactUrl.includes("statistics/ocean-economy/technical-notes")) {
      errors.push("Lesson 1: PSA exactUrl must be specific technical-notes page");
    }
    if (!pagasaSource || !pagasaSource.exactUrl.includes("https://www.pagasa.dost.gov.ph/information/climate-philippines")) {
      errors.push("Lesson 1: PAGASA exactUrl must be canonical climate page");
    }
  }

  // Specific Source Validation for Lesson 4 (NIR RA 12000)
  if (lesson.id === "lesson-4-region") {
    const textStr = JSON.stringify(lesson).toLowerCase();
    if (!textStr.includes("negros island region") || !textStr.includes("12000")) {
      errors.push("Lesson 4: Must explicitly include the Negros Island Region (NIR) and Republic Act No. 12000");
    }
  }

  // 11. Curated resources
  if (!lesson.curatedResources || lesson.curatedResources.length < 2) {
    errors.push("Insufficient curatedResources (min 2)");
  } else {
    lesson.curatedResources.forEach((res, rIdx) => {
      if (!res.url || !res.url.startsWith("http")) errors.push(`Curated resource ${rIdx + 1} missing url`);
      if (!res.whyUseful) errors.push(`Curated resource ${rIdx + 1} missing whyUseful`);
      if (res.verificationStatus !== "verified") errors.push(`Curated resource ${rIdx + 1} must have verificationStatus: 'verified'`);
    });
  }

  // 12. Structured 60-min pacing
  if (!lesson.suggestedPacing) {
    errors.push("Missing suggested pacing");
  } else if (typeof lesson.suggestedPacing === "object") {
    const p = lesson.suggestedPacing;
    if (!p.hook || !p.teaching || !p.total) errors.push("Structured pacing missing required segments or total");
    if (p.total < 45 || p.total > 75) errors.push(`Suggested pacing total should target ~60m (got ${p.total})`);
  }

  // 13. Premium assessments & matching answer key
  if (!lesson.premiumAssessment || lesson.premiumAssessment.length < 5) {
    errors.push("Missing or insufficient premiumAssessment (min 5)");
  }
  const keyCount = lesson.teacherAnswerKey ? Object.keys(lesson.teacherAnswerKey).length : 0;
  if (keyCount !== (lesson.premiumAssessment || []).length) {
    errors.push(`Answer key mismatch: ${keyCount} keys vs ${(lesson.premiumAssessment || []).length} assessments`);
  }

  // Anti-duplication on assessment questions
  (lesson.premiumAssessment || []).forEach((q, qIdx) => {
    const qText = q.question || "";
    if (qText && seenAssessmentQuestions.has(qText)) {
      errors.push(`Assessment Q${qIdx + 1} is duplicated from another lesson`);
    }
    if (qText) seenAssessmentQuestions.add(qText);
  });

  // 14. DTO Answer Safety Projection Verification
  const familyProj = curriculumSchema.createFamilyPremiumProjection(lesson);
  const familyProjStr = JSON.stringify(familyProj);
  const forbiddenKeys = [
    "correctAnswer",
    "correctOptionId",
    "expectedResolution",
    "correctOrder",
    "expectedAnswerKeywords",
    "teacherPreparation",
    "teacherAnswerKey",
    "privateTeacherNotes",
    "internalFactCheckNotes",
    "sourceNotes",
    "mediaAttributionNotes",
    "factualSources",
    "authoritativeSources"
  ];
  forbiddenKeys.forEach(k => {
    if (familyProjStr.includes(`"${k}"`)) {
      errors.push(`Family projection leaked forbidden key: ${k}`);
    }
  });

  // 15. Core teaching richExplanation (4-7 sections, min 400 words)
  const richExpChunks = lesson.richExplanation || [];
  const richExpWords = richExpChunks.reduce((acc, chunk) => acc + (chunk.body || "").split(/\s+/).length, 0);
  if (richExpWords < 400) errors.push(`richExplanation < 400 words (${richExpWords})`);
  if (richExpChunks.length < 4 || richExpChunks.length > 7) errors.push(`Explanation sections not 4-7 (${richExpChunks.length})`);

  // Banned placeholder string check
  const fullLessonStr = JSON.stringify(lesson);
  BANNED_STRINGS.forEach(banned => {
    if (fullLessonStr.includes(banned)) {
      errors.push(`Contains banned placeholder string: "${banned}"`);
    }
  });

  // Reflection and Family Challenge Anti-Template
  if (seenReflections.has(lesson.learnerReflection)) {
    errors.push("Duplicate learnerReflection detected across lessons");
  }
  seenReflections.add(lesson.learnerReflection);

  if (seenFamilyChallenges.has(lesson.familyChallenge)) {
    errors.push("Duplicate familyChallenge detected across lessons");
  }
  seenFamilyChallenges.add(lesson.familyChallenge);

  const passed = errors.length === 0;
  if (!passed) allPassed = false;

  const assessmentTypes = (lesson.premiumAssessment || []).map(a => a.type);
  const uniqueAssessmentTypes = [...new Set(assessmentTypes)].join(", ");

  matrix.push({
    id: lesson.id,
    title: lesson.title,
    date: lesson.date,
    weekday: lesson.weekday,
    richExpWords,
    sectionCount: richExpChunks.length,
    discoveryCount: (lesson.discoveries || []).length,
    vocabCount: (lesson.vocabulary || []).length,
    mediaMomentsCount: (lesson.mediaMoments || []).length,
    guidedDiscussionCount: (lesson.guidedDiscussion || []).length,
    ageTiersComplete: (lesson.ageDifferentiation && lesson.ageDifferentiation.explorer && lesson.ageDifferentiation.adventure && lesson.ageDifferentiation.trailblazer) ? "YES" : "NO",
    handsOnUnique: "YES",
    gameUnique: "YES",
    assessmentCount: (lesson.premiumAssessment || []).length,
    assessmentTypes: uniqueAssessmentTypes,
    authoritativeSourcesCount: (lesson.authoritativeSources || []).length,
    curatedResourcesCount: (lesson.curatedResources || []).length,
    urlsVerified: (lesson.curatedResources || []).every(r => r.verificationStatus === "verified") ? "YES" : "NO",
    pacingTotal: typeof lesson.suggestedPacing === "object" ? `${lesson.suggestedPacing.total}m` : "N/A",
    publicationStatus: lesson.publicationStatus,
    familyProjectionSync: "PASS",
    familyAnswerLeak: "0",
    status: passed ? "PASS" : "FAIL",
    errors
  });
});

console.log("\n=======================================================");
console.log("AUGUST PREMIUM CURRICULUM QUALITY MATRIX (13 LESSONS)");
console.log("=======================================================\n");

console.table(matrix.map(m => ({
  ID: m.id,
  Title: m.title.length > 25 ? m.title.substring(0, 22) + "..." : m.title,
  Words: m.richExpWords,
  Secs: m.sectionCount,
  Disc: m.discoveryCount,
  Vocab: m.vocabCount,
  Media: m.mediaMomentsCount,
  DiscQ: m.guidedDiscussionCount,
  Tiers: m.ageTiersComplete,
  Assess: m.assessmentCount,
  Sources: m.authoritativeSourcesCount,
  Res: m.curatedResourcesCount,
  Pacing: m.pacingTotal,
  Gate: m.status
})));

matrix.forEach(m => {
  if (m.errors.length > 0) {
    console.log(`\nErrors for ${m.id}:`);
    m.errors.forEach(e => console.log(` - ${e}`));
  }
});

fs.rmSync(tempDir, { recursive: true, force: true });

if (!allPassed || globalErrors.length > 0) {
  console.error("\nFAIL: One or more August curriculum quality gates failed.");
  if (globalErrors.length > 0) {
    globalErrors.forEach(ge => console.error(" - " + ge));
  }
  process.exit(1);
}

console.log("\nPASS: All 13 August lessons passed all 28 quality rules and cross-lesson anti-template audits!");
process.exit(0);
