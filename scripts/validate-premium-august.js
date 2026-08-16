const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Compiling stage 2 lessons for validation...');
try {
  execSync('npx tsc src/config/lessons-stage2.ts --outDir ./dist-temp --esModuleInterop true --skipLibCheck true', { stdio: 'pipe' });
} catch (e) {
  // It might fail on type checks if we don't include all files, but we just want the JS.
  // Actually, we can just compile it isolated:
  execSync('npx tsc src/config/lessons-stage2.ts --module commonjs --target ES2022 --outDir ./dist-temp --esModuleInterop true', { stdio: 'pipe' });
}

let stage2;
try {
  stage2 = require('../dist-temp/config/lessons-stage2.js');
} catch (e) {
  console.error("Failed to load compiled lessons-stage2.js:", e);
  process.exit(1);
}

const lessons = stage2.stage2Lessons;

if (!lessons || !Array.isArray(lessons)) {
  console.error("Could not find stage2Lessons array.");
  process.exit(1);
}

const AUGUST_SCHEDULE = [
  { date: '2026-08-03', weekday: 'Monday' },
  { date: '2026-08-04', weekday: 'Tuesday' },
  { date: '2026-08-07', weekday: 'Friday' },
  { date: '2026-08-10', weekday: 'Monday' },
  { date: '2026-08-11', weekday: 'Tuesday' },
  { date: '2026-08-14', weekday: 'Friday' },
  { date: '2026-08-17', weekday: 'Monday' },
  { date: '2026-08-18', weekday: 'Tuesday' },
  { date: '2026-08-21', weekday: 'Friday' },
  { date: '2026-08-24', weekday: 'Monday' },
  { date: '2026-08-25', weekday: 'Tuesday' },
  { date: '2026-08-28', weekday: 'Friday' },
  { date: '2026-08-31', weekday: 'Monday' }
];

let errors = [];

if (lessons.length !== 13) {
  errors.push(`Expected 13 lessons, found ${lessons.length}`);
}

const stringifyLesson = (l) => JSON.stringify(l);
const contentSet = new Set();
const hookSet = new Set();
const explorerSet = new Set();
const adventureSet = new Set();
const gameSet = new Set();

lessons.forEach((lesson, index) => {
  const sched = AUGUST_SCHEDULE[index];
  if (!sched) return;

  if (lesson.date !== sched.date) errors.push(`Lesson ${index + 1} (${lesson.id}) date is ${lesson.date}, expected ${sched.date}`);
  if (lesson.weekday !== sched.weekday) errors.push(`Lesson ${index + 1} (${lesson.id}) weekday is ${lesson.weekday}, expected ${sched.weekday}`);

  if (lesson.publicationStatus === "published") errors.push(`Lesson ${lesson.id} has publicationStatus "published". It must be "pilot".`);

  let explanationWords = 0;
  if (Array.isArray(lesson.richExplanation)) {
    explanationWords = lesson.richExplanation.reduce((acc, chunk) => acc + chunk.body.split(/\s+/).length, 0);
  }
  if (explanationWords < 400) errors.push(`Lesson ${lesson.id} richExplanation has ${explanationWords} words, expected >= 400`);

  if (!lesson.discoveries || lesson.discoveries.length < 3) errors.push(`Lesson ${lesson.id} has fewer than 3 discoveries`);
  if (lesson.discoveries && lesson.discoveries.some(d => /^Fact \d+$/i.test(d))) errors.push(`Lesson ${lesson.id} contains generic "Fact X" discoveries`);

  if (!lesson.vocabulary || lesson.vocabulary.length < 3) errors.push(`Lesson ${lesson.id} has fewer than 3 vocabulary items`);
  if (lesson.vocabulary && lesson.vocabulary.some(v => !v.contextualExample)) errors.push(`Lesson ${lesson.id} vocabulary is missing contextualExample`);

  if (!lesson.mediaMoments || lesson.mediaMoments.length < 3) errors.push(`Lesson ${lesson.id} has fewer than 3 media moments`);
  
  if (!lesson.guidedDiscussion || lesson.guidedDiscussion.length < 2) errors.push(`Lesson ${lesson.id} has fewer than 2 guided discussions`);

  const assessments = lesson.premiumAssessment || lesson.knowledgeCheck || [];
  if (assessments.length < 5) errors.push(`Lesson ${lesson.id} has fewer than 5 assessments`);
  
  if (!lesson.authoritativeSources || lesson.authoritativeSources.length < 2) errors.push(`Lesson ${lesson.id} has fewer than 2 authoritative sources`);
  
  if (!lesson.curatedResources || lesson.curatedResources.length < 2) errors.push(`Lesson ${lesson.id} has fewer than 2 curated resources`);
  if (lesson.curatedResources && lesson.curatedResources.some(r => !r.title || !r.url || !r.type)) errors.push(`Lesson ${lesson.id} curated resources missing required metadata`);

  if (!lesson.handsOnTask || !lesson.handsOnTask.accessibilityAlternative) errors.push(`Lesson ${lesson.id} missing accessibilityAlternative in handsOnTask`);
  
  // Duplication checks
  if (lesson.adventureHook) {
    if (hookSet.has(lesson.adventureHook)) errors.push(`Lesson ${lesson.id} has repeated adventureHook`);
    hookSet.add(lesson.adventureHook);
  }

  if (lesson.ageDifferentiation) {
    if (explorerSet.has(lesson.ageDifferentiation.explorer)) errors.push(`Lesson ${lesson.id} has repeated explorer activity`);
    explorerSet.add(lesson.ageDifferentiation.explorer);
    if (adventureSet.has(lesson.ageDifferentiation.adventure)) errors.push(`Lesson ${lesson.id} has repeated adventure activity`);
    adventureSet.add(lesson.ageDifferentiation.adventure);
  }

  if (lesson.game && lesson.game.rules) {
    const gameStr = lesson.game.rules;
    if (gameSet.has(gameStr)) errors.push(`Lesson ${lesson.id} has repeated game rules`);
    gameSet.add(gameStr);
  }

  if (lesson.subjectConnections) {
    const hasKeys = Object.values(lesson.subjectConnections).some(v => v);
    if (!hasKeys) errors.push(`Lesson ${lesson.id} has empty subjectConnections`);
  }

  // Answer key mismatch
  if (lesson.teacherAnswerKey) {
    const keyCount = Object.keys(lesson.teacherAnswerKey).length;
    if (keyCount !== assessments.length) errors.push(`Lesson ${lesson.id} answer key count (${keyCount}) does not match assessment count (${assessments.length})`);
  } else {
    errors.push(`Lesson ${lesson.id} is missing teacherAnswerKey`);
  }

  const str = JSON.stringify(lesson);
  if (str.includes("badge-id")) errors.push(`Lesson ${lesson.id} contains placeholder "badge-id"`);
  if (str.includes("media_1")) errors.push(`Lesson ${lesson.id} contains placeholder "media_1"`);
  if (str.includes("??")) errors.push(`Lesson ${lesson.id} contains placeholder "??"`);
});

if (errors.length > 0) {
  console.error("Validation Failed!");
  errors.forEach(e => console.error("- " + e));
  process.exit(1);
} else {
  console.log("Validation Passed! All 13 August lessons meet premium standards.");
  process.exit(0);
}
