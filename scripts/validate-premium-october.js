const fs = require("fs");
const path = require("path");

const { stage5Lessons } = require("../src/config/lessons-stage5");
const curriculumSchema = require("../src/lib/curriculum-schema");

const EXPECTED_MANIFEST = [
  { id: "lesson-27-bayanihan", date: "2026-10-02", weekday: "Friday" },
  { id: "lesson-28-jose-rizal", date: "2026-10-05", weekday: "Monday" },
  { id: "lesson-29-andres-bonifacio", date: "2026-10-06", weekday: "Tuesday" },
  { id: "lesson-30-indigenous-peoples", date: "2026-10-09", weekday: "Friday" },
  { id: "lesson-31-history-timeline", date: "2026-10-12", weekday: "Monday" },
  { id: "lesson-32-mayon-volcano", date: "2026-10-13", weekday: "Tuesday" },
  { id: "lesson-33-weather-climate", date: "2026-10-16", weekday: "Friday" },
  { id: "lesson-34-tropical-forests", date: "2026-10-19", weekday: "Monday" },
  { id: "lesson-35-coral-reefs", date: "2026-10-20", weekday: "Tuesday" },
  { id: "lesson-36-philippine-eagle", date: "2026-10-23", weekday: "Friday" },
  { id: "lesson-37-environmental-stewardship", date: "2026-10-26", weekday: "Monday" },
  { id: "lesson-38-october-review", date: "2026-10-27", weekday: "Tuesday" },
  { id: "lesson-39-october-showcase", date: "2026-10-30", weekday: "Friday" }
];

const EXPECTED_UNIT = "History, Heroes, Nature, and Science";

let hasErrors = false;
function reportError(lessonId, ruleNum, message) {
  console.error(`FAIL: [${lessonId}] Rule #${ruleNum}: ${message}`);
  hasErrors = true;
}

if (!Array.isArray(stage5Lessons) || stage5Lessons.length !== 13) {
  console.error(`FAIL: Expected exactly 13 October lessons, found ${stage5Lessons ? stage5Lessons.length : 0}`);
  process.exit(1);
}

const summaryTable = [];

// Cross-lesson uniqueness sets
const seenHooks = new Set();
const seenEssentialQuestions = new Set();
const seenGames = new Set();
const seenTasks = new Set();
const seenExplanations = new Set();

stage5Lessons.forEach((lesson, index) => {
  const expected = EXPECTED_MANIFEST[index];
  const lid = lesson.id;

  // 1. Manifest Alignment
  if (lesson.id !== expected.id) reportError(lid, 1, `ID mismatch. Expected ${expected.id}, got ${lesson.id}`);
  if (lesson.date !== expected.date) reportError(lid, 1, `Date mismatch. Expected ${expected.date}, got ${lesson.date}`);
  if (lesson.weekday !== expected.weekday) reportError(lid, 1, `Weekday mismatch. Expected ${expected.weekday}, got ${lesson.weekday}`);
  if (lesson.unit !== EXPECTED_UNIT) reportError(lid, 1, `Unit mismatch. Expected ${EXPECTED_UNIT}, got ${lesson.unit}`);

  // 2. Schema Validation
  const validation = curriculumSchema.validateCurriculumLesson(lesson);
  if (!validation.ok) {
    reportError(lid, 2, `Schema errors: ${validation.errors.join("; ")}`);
  }

  // 3. Rich Explanation Depth (Min 400 total words, 4-7 sections)
  let wordCount = 0;
  if (Array.isArray(lesson.richExplanation)) {
    if (lesson.richExplanation.length < 4 || lesson.richExplanation.length > 7) {
      reportError(lid, 3, `Expected 4-7 richExplanation sections, got ${lesson.richExplanation.length}`);
    }
    lesson.richExplanation.forEach((sec, sIdx) => {
      if (!sec.heading || !sec.emoji || !sec.body) {
        reportError(lid, 3, `Section ${sIdx} missing heading, emoji, or body`);
      }
      const words = (sec.body.match(/\S+/g) || []).length;
      wordCount += words;
    });
    if (wordCount < 400) {
      reportError(lid, 3, `Rich explanation too short: ${wordCount} words (minimum 400 required)`);
    }
  } else {
    reportError(lid, 3, "richExplanation is not an array");
  }

  // 4. Adventure Hook
  if (!lesson.adventureHook || lesson.adventureHook.length < 100) {
    reportError(lid, 4, "adventureHook missing or under 100 characters");
  }

  // 5. Discoveries
  if (!Array.isArray(lesson.discoveries) || lesson.discoveries.length < 3) {
    reportError(lid, 5, `Expected >= 3 discoveries, found ${lesson.discoveries ? lesson.discoveries.length : 0}`);
  }

  // 6. Key Facts
  if (!Array.isArray(lesson.keyFacts) || lesson.keyFacts.length < 4) {
    reportError(lid, 6, `Expected >= 4 key facts, found ${lesson.keyFacts ? lesson.keyFacts.length : 0}`);
  }

  // 7. Vocabulary
  if (!Array.isArray(lesson.vocabulary) || lesson.vocabulary.length < 4) {
    reportError(lid, 7, `Expected >= 4 vocabulary terms, found ${lesson.vocabulary ? lesson.vocabulary.length : 0}`);
  } else {
    lesson.vocabulary.forEach((v, vIdx) => {
      if (!v.word || !v.translation || !v.pronunciation || !v.contextualExample) {
        reportError(lid, 7, `Vocabulary #${vIdx} (${v.word}) missing required fields`);
      }
    });
  }

  // 8. Media Moments
  if (!Array.isArray(lesson.mediaMoments) || lesson.mediaMoments.length < 2) {
    reportError(lid, 8, `Expected >= 2 mediaMoments, found ${lesson.mediaMoments ? lesson.mediaMoments.length : 0}`);
  } else {
    lesson.mediaMoments.forEach((mm, mIdx) => {
      if (!mm.description || !mm.purpose || !mm.requiredType || !mm.sourceRequirement || !mm.altTextGuidance) {
        reportError(lid, 8, `MediaMoment #${mIdx} missing required field`);
      }
    });
  }

  // 9. Guided Discussion
  if (!Array.isArray(lesson.guidedDiscussion) || lesson.guidedDiscussion.length < 3) {
    reportError(lid, 9, `Expected >= 3 guidedDiscussion questions, found ${lesson.guidedDiscussion ? lesson.guidedDiscussion.length : 0}`);
  }

  // 10. Age Differentiation
  if (!lesson.ageDifferentiation || !lesson.ageDifferentiation.explorer || !lesson.ageDifferentiation.adventure || !lesson.ageDifferentiation.trailblazer) {
    reportError(lid, 10, "Missing one or more age tiers in ageDifferentiation");
  }

  // 11. Structured Game
  if (!lesson.game || !lesson.game.title || !lesson.game.objective || !lesson.game.rules || !lesson.game.materials || !lesson.game.winCondition || !lesson.game.adaptation) {
    reportError(lid, 11, "Missing structured fields in game");
  }

  // 12. Hands-on Task
  if (!lesson.handsOnTask || !lesson.handsOnTask.title || !Array.isArray(lesson.handsOnTask.materials) || !Array.isArray(lesson.handsOnTask.steps) || !lesson.handsOnTask.finishCondition || !lesson.handsOnTask.safetyNotes || !lesson.handsOnTask.accessibilityAlternative) {
    reportError(lid, 12, "Missing structured fields in handsOnTask");
  }

  // 13. Misconceptions
  if (!Array.isArray(lesson.misconceptions) || lesson.misconceptions.length < 2) {
    reportError(lid, 13, `Expected >= 2 misconceptions, found ${lesson.misconceptions ? lesson.misconceptions.length : 0}`);
  }

  // 14. Cross-Subject Connections
  if (!lesson.crossSubjectConnections || Object.keys(lesson.crossSubjectConnections).length < 2) {
    reportError(lid, 14, "crossSubjectConnections missing or has < 2 subject areas");
  }

  // 15. Character Connection
  if (!lesson.characterConnection || lesson.characterConnection.length < 20) {
    reportError(lid, 15, "characterConnection missing or too short");
  }

  // 16. Premium Assessment (6 items covering diverse question types)
  const expectedTypes = ["multiple-choice", "true-false-with-explanation", "matching", "short-answer", "sequencing", "scenario-application"];
  if (!Array.isArray(lesson.premiumAssessment) || lesson.premiumAssessment.length < 5) {
    reportError(lid, 16, `Expected 5-6 premium assessments, found ${lesson.premiumAssessment ? lesson.premiumAssessment.length : 0}`);
  } else {
    lesson.premiumAssessment.forEach((q) => {
      if (!expectedTypes.includes(q.type)) {
        reportError(lid, 16, `Unexpected question type: ${q.type} in ${q.id}`);
      }
      if (q.type === "multiple-choice" && (!Array.isArray(q.options) || q.options.length < 2)) {
        reportError(lid, 16, `Multiple choice question ${q.id} missing options`);
      }
      if (q.type === "matching" && (!Array.isArray(q.pairs) || q.pairs.length < 2)) {
        reportError(lid, 16, `Matching question ${q.id} missing pairs`);
      }
      if (q.type === "sequencing" && (!Array.isArray(q.correctOrder) || q.correctOrder.length < 3)) {
        reportError(lid, 16, `Sequencing question ${q.id} missing correctOrder items`);
      }
    });
  }

  // 17. Teacher Answer Key (1:1 matching with premium assessment)
  if (!lesson.teacherAnswerKey || typeof lesson.teacherAnswerKey !== "object") {
    reportError(lid, 17, "teacherAnswerKey is missing or not an object");
  } else if (Array.isArray(lesson.premiumAssessment)) {
    lesson.premiumAssessment.forEach((q) => {
      if (!lesson.teacherAnswerKey[q.id]) {
        reportError(lid, 17, `Missing answer key for assessment item ${q.id}`);
      } else if (typeof lesson.teacherAnswerKey[q.id] !== "string" || lesson.teacherAnswerKey[q.id].length < 5) {
        reportError(lid, 17, `Answer key explanation too short for item ${q.id}`);
      }
    });
  }

  // 18. Teacher Preparation
  if (!lesson.teacherPreparation || lesson.teacherPreparation.length < 20) {
    reportError(lid, 18, "teacherPreparation missing or too short");
  }

  // 19. Private Teacher Notes
  if (!lesson.privateTeacherNotes || lesson.privateTeacherNotes.length < 15) {
    reportError(lid, 19, "privateTeacherNotes missing or too short");
  }

  // 20. Internal Fact Check Notes
  if (!lesson.internalFactCheckNotes || lesson.internalFactCheckNotes.length < 15) {
    reportError(lid, 20, "internalFactCheckNotes missing or too short");
  }

  // 21. Learner Reflection
  if (!lesson.learnerReflection || lesson.learnerReflection.length < 15) {
    reportError(lid, 21, "learnerReflection missing or too short");
  }

  // 22. Family Challenge
  if (!lesson.familyChallenge || lesson.familyChallenge.length < 15) {
    reportError(lid, 22, "familyChallenge missing or too short");
  }

  // 23. Authoritative Sources (Min 2 verified government / academic sources)
  if (!Array.isArray(lesson.authoritativeSources) || lesson.authoritativeSources.length < 2) {
    reportError(lid, 23, `Expected >= 2 authoritativeSources, found ${lesson.authoritativeSources ? lesson.authoritativeSources.length : 0}`);
  } else {
    lesson.authoritativeSources.forEach((src, sIdx) => {
      if (!src.source || !src.publisher || !src.exactUrl || !src.claimSupported || !src.verifiedDate) {
        reportError(lid, 23, `Authoritative source #${sIdx} missing required fields`);
      }
      if (!src.exactUrl.startsWith("https://")) {
        reportError(lid, 23, `Authoritative source #${sIdx} URL must be secure HTTPS`);
      }
    });
  }

  // 24. Curated Resources (Min 2 verified resources)
  if (!Array.isArray(lesson.curatedResources) || lesson.curatedResources.length < 2) {
    reportError(lid, 24, `Expected >= 2 curatedResources, found ${lesson.curatedResources ? lesson.curatedResources.length : 0}`);
  } else {
    lesson.curatedResources.forEach((res, rIdx) => {
      if (!res.id || !res.title || !res.type || !res.provider || !res.url || !res.whyUseful || !res.verificationStatus || !res.visibility) {
        reportError(lid, 24, `Curated resource #${rIdx} missing required fields`);
      }
      if (!res.url.startsWith("https://")) {
        reportError(lid, 24, `Curated resource #${rIdx} URL must be secure HTTPS`);
      }
      if (res.verificationStatus !== "verified") {
        reportError(lid, 24, `Curated resource #${rIdx} status must be 'verified'`);
      }
    });
  }

  // 25. Suggested Pacing (Exact 60m total)
  if (!lesson.suggestedPacing) {
    reportError(lid, 25, "suggestedPacing missing");
  } else {
    const p = lesson.suggestedPacing;
    const total = (p.hook || 0) + (p.teaching || 0) + (p.discussionVocabulary || 0) + (p.handsOnOrGame || 0) + (p.assessment || 0) + (p.reflectionClosing || 0);
    if (p.total !== 60 || total !== 60) {
      reportError(lid, 25, `Suggested pacing total must be exactly 60m (got total=${p.total}, sum=${total})`);
    }
  }

  // 26. Progress Badge
  if (!lesson.progressBadge || !lesson.progressBadge.startsWith("badge-october-")) {
    reportError(lid, 26, `progressBadge must match 'badge-october-XX', got '${lesson.progressBadge}'`);
  }

  // 27. Family DTO Safety (Zero teacher answer keys or internal notes in family projection)
  const familySerialized = curriculumSchema.serializeForFamily(lesson);
  const leakedKeys = Object.keys(familySerialized).filter(k => [
    "teacherPreparation",
    "teacherAnswerKey",
    "privateTeacherNotes",
    "internalFactCheckNotes",
    "sourceNotes",
    "mediaAttributionNotes",
    "factualSources",
    "authoritativeSources"
  ].includes(k));
  if (leakedKeys.length > 0) {
    reportError(lid, 27, `Teacher-only keys leaked in family projection: ${leakedKeys.join(", ")}`);
  }

  // 28. Cross-Lesson Anti-Template Originality Audit
  if (seenHooks.has(lesson.adventureHook)) {
    reportError(lid, 28, "Duplicate adventureHook detected across lessons");
  }
  seenHooks.add(lesson.adventureHook);

  if (seenEssentialQuestions.has(lesson.essentialQuestion)) {
    reportError(lid, 28, "Duplicate essentialQuestion detected across lessons");
  }
  seenEssentialQuestions.add(lesson.essentialQuestion);

  if (lesson.game && seenGames.has(lesson.game.title)) {
    reportError(lid, 28, `Duplicate game title detected: "${lesson.game.title}"`);
  }
  if (lesson.game) seenGames.add(lesson.game.title);

  if (lesson.handsOnTask && seenTasks.has(lesson.handsOnTask.title)) {
    reportError(lid, 28, `Duplicate handsOnTask title detected: "${lesson.handsOnTask.title}"`);
  }
  if (lesson.handsOnTask) seenTasks.add(lesson.handsOnTask.title);

  const fullExp = (lesson.richExplanation || []).map(s => s.body).join(" ");
  if (seenExplanations.has(fullExp)) {
    reportError(lid, 28, "Duplicate richExplanation content detected across lessons");
  }
  seenExplanations.add(fullExp);

  summaryTable.push({
    ID: lesson.id,
    Title: lesson.title.length > 25 ? lesson.title.substring(0, 22) + "..." : lesson.title,
    Words: wordCount,
    Secs: (lesson.richExplanation || []).length,
    Disc: (lesson.discoveries || []).length,
    Vocab: (lesson.vocabulary || []).length,
    Media: (lesson.mediaMoments || []).length,
    DiscQ: (lesson.guidedDiscussion || []).length,
    Tiers: lesson.ageDifferentiation ? "YES" : "NO",
    Assess: (lesson.premiumAssessment || []).length,
    Sources: (lesson.authoritativeSources || []).length,
    Res: (lesson.curatedResources || []).length,
    Pacing: `${lesson.suggestedPacing?.total || 0}m`,
    Gate: validation.ok && wordCount >= 400 ? "PASS" : "FAIL"
  });
});

console.log("\n=========================================================");
console.log("OCTOBER PREMIUM CURRICULUM QUALITY MATRIX (13 LESSONS)");
console.log("=========================================================\n");
console.table(summaryTable);

try {
  fs.rmSync(tempDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
} catch {}

if (hasErrors) {
  console.error("\nFAIL: One or more October curriculum validation rules failed!");
  process.exit(1);
} else {
  console.log("\nPASS: All 13 October lessons passed all 28 quality rules and cross-lesson anti-template audits!");
  process.exit(0);
}
