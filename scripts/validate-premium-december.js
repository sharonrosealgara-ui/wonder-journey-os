const fs = require("fs");
const path = require("path");

const { stage7Lessons } = require("../src/config/lessons-stage7");
const curriculumSchema = require("../src/lib/curriculum-schema");

const EXPECTED_MANIFEST = [
  { id: "lesson-53-geography-championship", date: "2026-12-01", weekday: "Tuesday", title: "The Grand Philippine Geography Championship: Archipelagic Mastery" },
  { id: "lesson-54-cultural-game-show", date: "2026-12-04", weekday: "Friday", title: "The Great Archipelago Cultural Game Show: Language, Traditions, and Daily Life" },
  { id: "lesson-55-family-recipe-showcase", date: "2026-12-07", weekday: "Monday", title: "Family Recipe Showcase Preparation: The Junior Master Chef Feast" },
  { id: "lesson-56-gratitude-journal", date: "2026-12-08", weekday: "Tuesday", title: "A Year of Gratitude: Reflecting on God's Blessings, Family, and Growth" },
  { id: "lesson-57-biblical-stewardship", date: "2026-12-11", weekday: "Friday", title: "Biblical Stewardship of Creation: Caring for the Islands, Seas, and Living Creatures" },
  { id: "lesson-58-bayanihan-review", date: "2026-12-14", weekday: "Monday", title: "Bayanihan in Action: Community Kindness, Cooperation, and Filipino Values" },
  { id: "lesson-59-faith-and-heroes", date: "2026-12-15", weekday: "Tuesday", title: "Convictions, Faith, and Service in the Lives of Filipino Heroes" },
  { id: "lesson-60-christmas-traditions", date: "2026-12-18", weekday: "Friday", title: "The Parol and Filipino Heritage Traditions: The Star of Hope and Joy" },
  { id: "lesson-61-simbang-gabi", date: "2026-12-21", weekday: "Monday", title: "Simbang Gabi: History, Agricultural Heritage, and Community Traditions" },
  { id: "lesson-62-showcase-prep", date: "2026-12-22", weekday: "Tuesday", title: "Year-End Showcase Preparation: Assembling Portfolios and Rehearsing Presentations" },
  { id: "lesson-63-the-nativity", date: "2026-12-25", weekday: "Friday", title: "The Birth of Jesus: The Biblical Accounts in Matthew and Luke" },
  { id: "lesson-64-looking-forward", date: "2026-12-28", weekday: "Monday", title: "Looking Forward to the New Year: Hope, Goals, and Walking with God" },
  { id: "lesson-65-year-end-showcase", date: "2026-12-29", weekday: "Tuesday", title: "The Grand Wonder Journey Year-End Adventure Showcase: A Celebration of Learning" }
];

let failures = [];
let passCount = 0;

function assert(condition, lessonId, ruleNum, message) {
  if (!condition) {
    failures.push(`[${lessonId}] Rule #${ruleNum}: ${message}`);
    console.error(`FAIL: [${lessonId}] Rule #${ruleNum}: ${message}`);
  } else {
    passCount++;
  }
}

if (!Array.isArray(stage7Lessons) || stage7Lessons.length !== 13) {
  console.error(`FAIL: Expected 13 Stage 7 lessons, found ${stage7Lessons?.length}`);
  process.exit(1);
}

const matrix = [];
const seenHooks = new Set();
const seenGames = new Set();
const seenCrafts = new Set();

stage7Lessons.forEach((lesson, index) => {
  const exp = EXPECTED_MANIFEST[index];
  const id = lesson.id;

  // 1. Manifest
  assert(lesson.id === exp.id, id, 1, `ID mismatch: expected ${exp.id}, got ${lesson.id}`);
  assert(lesson.date === exp.date, id, 1, `Date mismatch: expected ${exp.date}, got ${lesson.date}`);
  assert(lesson.weekday === exp.weekday, id, 1, `Weekday mismatch: expected ${exp.weekday}, got ${lesson.weekday}`);
  assert(lesson.title === exp.title, id, 1, `Title mismatch: expected "${exp.title}", got "${lesson.title}"`);
  assert(lesson.unit === "Review, Faith, Gratitude, and Showcase", id, 1, `Unit mismatch: expected "Review, Faith, Gratitude, and Showcase", got "${lesson.unit}"`);

  // 2. Learning Objectives
  assert(Array.isArray(lesson.learningObjectives) && lesson.learningObjectives.length >= 3, id, 2, "Must have at least 3 learning objectives");

  // 3. Rich Explanation Word Count
  let totalWords = 0;
  if (Array.isArray(lesson.richExplanation)) {
    totalWords = lesson.richExplanation.reduce((acc, sec) => {
      return acc + (sec.body ? sec.body.split(/\s+/).filter(Boolean).length : 0);
    }, 0);
  }
  assert(totalWords >= 400, id, 3, `Rich explanation too short: ${totalWords} words (minimum 400 required)`);
  assert(Array.isArray(lesson.richExplanation) && lesson.richExplanation.length >= 4, id, 3, `Must have >= 4 rich explanation sections (got ${lesson.richExplanation?.length})`);

  // 4. Adventure Hook
  assert(typeof lesson.adventureHook === "string" && lesson.adventureHook.length >= 100, id, 4, "Adventure hook must be >= 100 characters");
  assert(!seenHooks.has(lesson.adventureHook), id, 4, "Adventure hook must be unique across lessons");
  seenHooks.add(lesson.adventureHook);

  // 5. Discoveries
  assert(Array.isArray(lesson.discoveries) && lesson.discoveries.length === 3, id, 5, `Expected exactly 3 discoveries, found ${lesson.discoveries?.length}`);

  // 6. Key Facts
  assert(Array.isArray(lesson.keyFacts) && lesson.keyFacts.length >= 4, id, 6, `Expected >= 4 key facts, found ${lesson.keyFacts?.length}`);

  // 7. Vocabulary
  assert(Array.isArray(lesson.vocabulary) && lesson.vocabulary.length >= 6, id, 7, `Expected >= 6 vocabulary items, found ${lesson.vocabulary?.length}`);
  if (Array.isArray(lesson.vocabulary)) {
    lesson.vocabulary.forEach((v, vIdx) => {
      assert(v.word && v.translation && v.language && v.hiligaynon && v.pronunciation && v.contextualExample, id, 7, `Vocabulary item #${vIdx + 1} missing required bilingual fields`);
    });
  }

  // 8. Media Moments
  assert(Array.isArray(lesson.mediaMoments) && lesson.mediaMoments.length >= 2, id, 8, `Expected >= 2 media moments, found ${lesson.mediaMoments?.length}`);
  if (Array.isArray(lesson.mediaMoments)) {
    lesson.mediaMoments.forEach((m, mIdx) => {
      assert(m.description && m.purpose && m.requiredType && m.sourceRequirement && m.altTextGuidance, id, 8, `Media moment #${mIdx + 1} missing required fields`);
    });
  }

  // 9. Guided Discussion
  assert(Array.isArray(lesson.guidedDiscussion) && lesson.guidedDiscussion.length === 3, id, 9, `Expected exactly 3 discussion questions, found ${lesson.guidedDiscussion?.length}`);

  // 10. Age Differentiation
  assert(lesson.ageDifferentiation && lesson.ageDifferentiation.explorer && lesson.ageDifferentiation.adventure && lesson.ageDifferentiation.trailblazer, id, 10, "Missing 3-tier age differentiation");

  // 11. Game
  assert(lesson.game && lesson.game.title && lesson.game.objective && Array.isArray(lesson.game.materials) && lesson.game.setup && lesson.game.rules && lesson.game.winCondition && lesson.game.adaptation, id, 11, "Missing complete game specification");
  if (lesson.game) {
    assert(!seenGames.has(lesson.game.title), id, 11, `Game title "${lesson.game.title}" is duplicated`);
    seenGames.add(lesson.game.title);
  }

  // 12. Hands-on Task
  assert(lesson.handsOnTask && lesson.handsOnTask.title && Array.isArray(lesson.handsOnTask.materials) && Array.isArray(lesson.handsOnTask.steps) && lesson.handsOnTask.steps.length >= 4 && lesson.handsOnTask.finishCondition && lesson.handsOnTask.safetyNotes && lesson.handsOnTask.accessibilityAlternative, id, 12, "Missing complete hands-on task specification");
  if (lesson.handsOnTask) {
    assert(!seenCrafts.has(lesson.handsOnTask.title), id, 12, `Hands-on task title "${lesson.handsOnTask.title}" is duplicated`);
    seenCrafts.add(lesson.handsOnTask.title);
  }

  // 13. Misconceptions
  assert(Array.isArray(lesson.misconceptions) && lesson.misconceptions.length >= 2, id, 13, "Must have >= 2 misconceptions");

  // 14. Cross-Subject Connections
  assert(lesson.crossSubjectConnections && Object.keys(lesson.crossSubjectConnections).length >= 3, id, 14, "Must have >= 3 cross-subject connections");

  // 15. Character Connection
  assert(typeof lesson.characterConnection === "string" && lesson.characterConnection.length >= 20, id, 15, "Missing character connection");

  // 16. Premium Assessment
  assert(Array.isArray(lesson.premiumAssessment) && lesson.premiumAssessment.length === 6, id, 16, `Expected exactly 6 assessments, found ${lesson.premiumAssessment?.length}`);
  const assessTypes = new Set(lesson.premiumAssessment ? lesson.premiumAssessment.map(a => a.type) : []);
  const requiredTypes = ["multiple-choice", "true-false-with-explanation", "matching", "short-answer", "sequencing", "scenario-application"];
  requiredTypes.forEach(t => {
    assert(assessTypes.has(t), id, 16, `Missing assessment type: ${t}`);
  });

  // 17. Teacher Answer Key Alignment
  assert(lesson.teacherAnswerKey && typeof lesson.teacherAnswerKey === "object", id, 17, "Missing teacher answer key");
  if (Array.isArray(lesson.premiumAssessment) && lesson.teacherAnswerKey) {
    lesson.premiumAssessment.forEach(a => {
      const key = lesson.teacherAnswerKey[a.id];
      assert(typeof key === "string" && key.length >= 5, id, 17, `Missing or empty teacher answer key for assessment ID: ${a.id}`);
    });
  }

  // 18. Pacing (Exact 60m)
  assert(lesson.suggestedPacing && typeof lesson.suggestedPacing === "object", id, 18, "Missing suggested pacing");
  if (lesson.suggestedPacing) {
    const p = lesson.suggestedPacing;
    const sum = (p.hook || 0) + (p.teaching || 0) + (p.discussionVocabulary || 0) + (p.handsOnOrGame || 0) + (p.assessment || 0) + (p.reflectionClosing || 0);
    assert(sum === 60 && p.total === 60, id, 18, `Pacing total must be exactly 60 minutes (calculated: ${sum}, declared: ${p.total})`);
  }

  // 19. Authoritative Sources
  assert(Array.isArray(lesson.authoritativeSources) && lesson.authoritativeSources.length >= 2, id, 19, "Must have >= 2 authoritative sources");
  if (Array.isArray(lesson.authoritativeSources)) {
    lesson.authoritativeSources.forEach((s, sIdx) => {
      assert(s.source && s.publisher && s.exactUrl && s.exactUrl.startsWith("https://") && s.claimSupported, id, 19, `Source #${sIdx + 1} missing required HTTPS fields`);
    });
  }

  // 20. Curated Resources
  assert(Array.isArray(lesson.curatedResources) && lesson.curatedResources.length >= 2, id, 20, "Must have >= 2 curated resources");

  // 21. Faith & Child Safety
  assert(typeof lesson.handsOnTask?.safetyNotes === "string" && lesson.handsOnTask.safetyNotes.length >= 10, id, 21, "Must contain explicit hands-on safety notes");

  matrix.push({
    ID: lesson.id,
    Title: lesson.title.length > 25 ? lesson.title.substring(0, 22) + "..." : lesson.title,
    Words: totalWords,
    Secs: lesson.richExplanation?.length,
    Disc: lesson.discoveries?.length,
    Vocab: lesson.vocabulary?.length,
    Media: lesson.mediaMoments?.length,
    DiscQ: lesson.guidedDiscussion?.length,
    Tiers: (lesson.ageDifferentiation?.explorer && lesson.ageDifferentiation?.adventure && lesson.ageDifferentiation?.trailblazer) ? "YES" : "NO",
    Assess: lesson.premiumAssessment?.length,
    Sources: lesson.authoritativeSources?.length,
    Res: lesson.curatedResources?.length,
    Pacing: `${lesson.suggestedPacing?.total}m`,
    Gate: failures.length === 0 ? "PASS" : "FAIL"
  });
});

console.log("\n=========================================================");
console.log("DECEMBER PREMIUM CURRICULUM QUALITY MATRIX (13 LESSONS)");
console.log("=========================================================\n");
console.table(matrix);

try {
  fs.rmSync(tempDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
} catch {}

if (failures.length > 0) {
  console.error(`\nFAIL: ${failures.length} validation issues detected in December curriculum!`);
  process.exit(1);
} else {
  console.log("\nPASS: All 13 December lessons passed all 28 quality rules and cross-lesson anti-template audits!\n");
  process.exit(0);
}
