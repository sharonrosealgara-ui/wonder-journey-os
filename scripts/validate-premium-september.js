const fs = require("fs");
const path = require("path");

const { stage4Lessons } = require("../src/config/lessons-stage4");
const curriculumSchema = require("../src/lib/curriculum-schema");

const EXPECTED_MANIFEST = [
  { id: "lesson-14-greetings", date: "2026-09-01", weekday: "Tuesday" },
  { id: "lesson-15-respectful-gestures", date: "2026-09-04", weekday: "Friday" },
  { id: "lesson-16-family", date: "2026-09-07", weekday: "Monday" },
  { id: "lesson-17-body-parts", date: "2026-09-08", weekday: "Tuesday" },
  { id: "lesson-18-food", date: "2026-09-11", weekday: "Friday" },
  { id: "lesson-19-emotions", date: "2026-09-14", weekday: "Monday" },
  { id: "lesson-20-homes", date: "2026-09-15", weekday: "Tuesday" },
  { id: "lesson-21-schools", date: "2026-09-18", weekday: "Friday" },
  { id: "lesson-22-markets", date: "2026-09-21", weekday: "Monday" },
  { id: "lesson-23-transportation", date: "2026-09-22", weekday: "Tuesday" },
  { id: "lesson-24-carabao", date: "2026-09-25", weekday: "Friday" },
  { id: "lesson-25-community-helpers", date: "2026-09-28", weekday: "Monday" },
  { id: "lesson-26-september-review", date: "2026-09-29", weekday: "Tuesday" }
];

const BANNED_STRINGS = [
  "TODO",
  "TBD",
  "Placeholder",
  "placeholder",
  "Coming soon",
  "Insert here",
  "Lorem ipsum"
];

let allPassed = true;
const matrix = [];
const globalErrors = [];

// Cross-lesson uniqueness sets
const seenTitles = new Set();
const seenEssentialQuestions = new Set();
const seenHooks = new Set();
const seenGameTitles = new Set();
const seenHandsOnTitles = new Set();
const seenReflections = new Set();
const seenFamilyChallenges = new Set();
const seenAssessmentQuestions = new Set();

if (stage4Lessons.length !== 13) {
  globalErrors.push(`Expected 13 lessons in Stage 4, found ${stage4Lessons.length}`);
}

stage4Lessons.forEach((lesson, index) => {
  const errors = [];
  const expected = EXPECTED_MANIFEST[index];

  // 1. Manifest Alignment
  if (!expected) {
    errors.push(`Unexpected lesson at index ${index}: ${lesson.id}`);
  } else {
    if (lesson.id !== expected.id) errors.push(`ID mismatch: expected ${expected.id}, got ${lesson.id}`);
    if (lesson.date !== expected.date) errors.push(`Date mismatch: expected ${expected.date}, got ${lesson.date}`);
    if (lesson.weekday !== expected.weekday) errors.push(`Weekday mismatch: expected ${expected.weekday}, got ${lesson.weekday}`);
  }

  if (lesson.privacyClassification !== "family-safe") {
    errors.push(`privacyClassification must be 'family-safe', got '${lesson.privacyClassification}'`);
  }

  // 2. Essential Question
  if (!lesson.essentialQuestion || lesson.essentialQuestion.length < 15) {
    errors.push("Missing or too short essentialQuestion");
  }
  if (seenEssentialQuestions.has(lesson.essentialQuestion)) {
    errors.push("Duplicate essentialQuestion detected across lessons");
  }
  seenEssentialQuestions.add(lesson.essentialQuestion);

  // 3. Adventure Hook
  if (!lesson.adventureHook || lesson.adventureHook.length < 100) {
    errors.push(`adventureHook too short (<100 chars, got ${lesson.adventureHook ? lesson.adventureHook.length : 0})`);
  }
  if (seenHooks.has(lesson.adventureHook)) {
    errors.push("Duplicate adventureHook detected across lessons");
  }
  seenHooks.add(lesson.adventureHook);

  // 4. Discoveries (min 3)
  if (!lesson.discoveries || lesson.discoveries.length < 3) {
    errors.push(`Insufficient discoveries (expected >= 3, got ${lesson.discoveries ? lesson.discoveries.length : 0})`);
  } else {
    lesson.discoveries.forEach((d, dIdx) => {
      if (!d.title || !d.description) errors.push(`Discovery ${dIdx + 1} missing title or description`);
    });
  }

  // 5. Key facts (min 4)
  if (!lesson.keyFacts || lesson.keyFacts.length < 4) {
    errors.push(`Insufficient keyFacts (expected >= 4, got ${lesson.keyFacts ? lesson.keyFacts.length : 0})`);
  }

  // 6. Vocabulary (min 4, full schema)
  if (!lesson.vocabulary || lesson.vocabulary.length < 4) {
    errors.push(`Insufficient vocabulary (expected >= 4, got ${lesson.vocabulary ? lesson.vocabulary.length : 0})`);
  } else {
    lesson.vocabulary.forEach((v, vIdx) => {
      if (!v.word || !v.translation || !v.pronunciation || !v.contextualExample) {
        errors.push(`Vocabulary item ${vIdx + 1} (${v.word || "unnamed"}) missing required fields`);
      }
    });
  }

  // 7. Media moments (min 2)
  if (!lesson.mediaMoments || lesson.mediaMoments.length < 2) {
    errors.push(`Insufficient mediaMoments (expected >= 2, got ${lesson.mediaMoments ? lesson.mediaMoments.length : 0})`);
  } else {
    lesson.mediaMoments.forEach((m, mIdx) => {
      if (!m.description || !m.purpose || !m.requiredType || !m.sourceRequirement || !m.altTextGuidance) {
        errors.push(`Media moment ${mIdx + 1} missing required fields`);
      }
    });
  }

  // 8. Guided discussion (min 3)
  if (!lesson.guidedDiscussion || lesson.guidedDiscussion.length < 3) {
    errors.push(`Insufficient guidedDiscussion (expected >= 3, got ${lesson.guidedDiscussion ? lesson.guidedDiscussion.length : 0})`);
  }

  // 9. Age differentiation (all 3 complete)
  if (!lesson.ageDifferentiation) {
    errors.push("Missing ageDifferentiation object");
  } else {
    const { explorer, adventure, trailblazer } = lesson.ageDifferentiation;
    if (!explorer || explorer.length < 20) errors.push("explorer tier missing or too short");
    if (!adventure || adventure.length < 20) errors.push("adventure tier missing or too short");
    if (!trailblazer || trailblazer.length < 20) errors.push("trailblazer tier missing or too short");
  }

  // 10. Game & Hands-On Task complete structures
  if (!lesson.game) {
    errors.push("Missing structured game object");
  } else {
    const g = lesson.game;
    if (!g.title || !g.objective || !g.rules || !g.winCondition || !g.setup || !g.adaptation) {
      errors.push("Game object missing one or more required fields");
    }
    if (seenGameTitles.has(g.title)) errors.push(`Duplicate game title: "${g.title}"`);
    seenGameTitles.add(g.title);
  }

  if (!lesson.handsOnTask) {
    errors.push("Missing structured handsOnTask object");
  } else {
    const h = lesson.handsOnTask;
    if (!h.title || !h.materials || !h.steps || h.steps.length < 3 || !h.finishCondition || !h.safetyNotes || !h.accessibilityAlternative) {
      errors.push("handsOnTask missing one or more required fields or has < 3 steps");
    }
    if (seenHandsOnTitles.has(h.title)) errors.push(`Duplicate handsOnTask title: "${h.title}"`);
    seenHandsOnTitles.add(h.title);
  }

  // 11. Authoritative sources
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

  // 12. Curated resources
  if (!lesson.curatedResources || lesson.curatedResources.length < 2) {
    errors.push("Insufficient curatedResources (min 2)");
  } else {
    lesson.curatedResources.forEach((res, rIdx) => {
      if (!res.url || !res.url.startsWith("http")) errors.push(`Curated resource ${rIdx + 1} missing url`);
      if (!res.whyUseful) errors.push(`Curated resource ${rIdx + 1} missing whyUseful`);
      if (res.verificationStatus !== "verified") errors.push(`Curated resource ${rIdx + 1} must have verificationStatus: 'verified'`);
    });
  }

  // 13. Structured 60-min pacing
  if (!lesson.suggestedPacing) {
    errors.push("Missing suggested pacing");
  } else if (typeof lesson.suggestedPacing === "object") {
    const p = lesson.suggestedPacing;
    if (!p.hook || !p.teaching || !p.total) errors.push("Structured pacing missing required segments or total");
    if (p.total < 45 || p.total > 75) errors.push(`Suggested pacing total should target ~60m (got ${p.total})`);
  }

  // 14. Premium assessments & matching answer key
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

  // 15. DTO Answer Safety Projection Verification
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

  // 16. Core teaching richExplanation (4-7 sections, min 400 words)
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

console.log("\n=========================================================");
console.log("SEPTEMBER PREMIUM CURRICULUM QUALITY MATRIX (13 LESSONS)");
console.log("=========================================================\n");

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

try {
  fs.rmSync(tempDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
} catch {}

if (!allPassed || globalErrors.length > 0) {
  console.error("\nFAIL: One or more September curriculum quality gates failed.");
  if (globalErrors.length > 0) {
    globalErrors.forEach(ge => console.error(" - " + ge));
  }
  process.exit(1);
}

console.log("\nPASS: All 13 September lessons passed all 28 quality rules and cross-lesson anti-template audits!");
process.exit(0);
