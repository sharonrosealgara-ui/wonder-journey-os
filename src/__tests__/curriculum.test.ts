import { serializeForFamily, validateCurriculumLesson } from '../lib/curriculum-schema';
import { stage2Lessons } from '../config/lessons-stage2';
import { stage4Lessons } from '../config/lessons-stage4';
import { stage5Lessons } from '../config/lessons-stage5';
import { stage6Lessons } from '../config/lessons-stage6';
import { stage7Lessons } from '../config/lessons-stage7';

function fail(message: string): never {
  console.error(`FAIL: ${message}`);
  process.exit(1);
}

function pass(message: string): void {
  console.log(`PASS: ${message}`);
}

console.log('Running Stages 2, 4, 5, 6 & 7 curriculum validation tests...');

// Stage 2 (August) Tests
if (!Array.isArray(stage2Lessons) || stage2Lessons.length !== 13) {
  fail(`Expected 13 Stage 2 lessons in lessons-stage2.ts, got ${stage2Lessons?.length}`);
}
pass('Stage 2 lesson count is correct (13 lessons)');

const stage2Ids = stage2Lessons.map((lesson) => lesson.id);
const uniqueStage2Ids = new Set(stage2Ids);
if (uniqueStage2Ids.size !== stage2Ids.length) {
  fail('Duplicate lesson IDs found in stage2Lessons');
}
pass('No duplicate lesson IDs in stage2Lessons');

stage2Lessons.forEach((lesson, idx) => {
  const validation = validateCurriculumLesson(lesson);
  if (!validation.ok) {
    fail(`Stage 2 Lesson ${idx + 1} (${lesson.id}) failed schema validation: ${validation.errors.join('; ')}`);
  }
});
pass('All 13 Stage 2 lessons validated against curriculum schema');

// Stage 4 (September) Tests
if (!Array.isArray(stage4Lessons) || stage4Lessons.length !== 13) {
  fail(`Expected 13 Stage 4 lessons in lessons-stage4.ts, got ${stage4Lessons?.length}`);
}
pass('Stage 4 lesson count is correct (13 lessons)');

const stage4Ids = stage4Lessons.map((lesson) => lesson.id);
const uniqueStage4Ids = new Set(stage4Ids);
if (uniqueStage4Ids.size !== stage4Ids.length) {
  fail('Duplicate lesson IDs found in stage4Lessons');
}
pass('No duplicate lesson IDs in stage4Lessons');

stage4Lessons.forEach((lesson, idx) => {
  const validation = validateCurriculumLesson(lesson);
  if (!validation.ok) {
    fail(`Stage 4 Lesson ${idx + 1} (${lesson.id}) failed schema validation: ${validation.errors.join('; ')}`);
  }
});
pass('All 13 Stage 4 lessons validated against curriculum schema');

// Stage 5 (October) Tests
if (!Array.isArray(stage5Lessons) || stage5Lessons.length !== 13) {
  fail(`Expected 13 Stage 5 lessons in lessons-stage5.ts, got ${stage5Lessons?.length}`);
}
pass('Stage 5 lesson count is correct (13 lessons)');

const stage5Ids = stage5Lessons.map((lesson) => lesson.id);
const uniqueStage5Ids = new Set(stage5Ids);
if (uniqueStage5Ids.size !== stage5Ids.length) {
  fail('Duplicate lesson IDs found in stage5Lessons');
}
pass('No duplicate lesson IDs in stage5Lessons');

stage5Lessons.forEach((lesson, idx) => {
  const validation = validateCurriculumLesson(lesson);
  if (!validation.ok) {
    fail(`Stage 5 Lesson ${idx + 1} (${lesson.id}) failed schema validation: ${validation.errors.join('; ')}`);
  }
});
pass('All 13 Stage 5 lessons validated against curriculum schema');

// Stage 6 (November) Tests
if (!Array.isArray(stage6Lessons) || stage6Lessons.length !== 13) {
  fail(`Expected 13 Stage 6 lessons in lessons-stage6.ts, got ${stage6Lessons?.length}`);
}
pass('Stage 6 lesson count is correct (13 lessons)');

const stage6Ids = stage6Lessons.map((lesson) => lesson.id);
const uniqueStage6Ids = new Set(stage6Ids);
if (uniqueStage6Ids.size !== stage6Ids.length) {
  fail('Duplicate lesson IDs found in stage6Lessons');
}
pass('No duplicate lesson IDs in stage6Lessons');

stage6Lessons.forEach((lesson, idx) => {
  const validation = validateCurriculumLesson(lesson);
  if (!validation.ok) {
    fail(`Stage 6 Lesson ${idx + 1} (${lesson.id}) failed schema validation: ${validation.errors.join('; ')}`);
  }
});
pass('All 13 Stage 6 lessons validated against curriculum schema');

// Stage 7 (December) Tests
if (!Array.isArray(stage7Lessons) || stage7Lessons.length !== 13) {
  fail(`Expected 13 Stage 7 lessons in lessons-stage7.ts, got ${stage7Lessons?.length}`);
}
pass('Stage 7 lesson count is correct (13 lessons)');

const stage7Ids = stage7Lessons.map((lesson) => lesson.id);
const uniqueStage7Ids = new Set(stage7Ids);
if (uniqueStage7Ids.size !== stage7Ids.length) {
  fail('Duplicate lesson IDs found in stage7Lessons');
}
pass('No duplicate lesson IDs in stage7Lessons');

stage7Lessons.forEach((lesson, idx) => {
  const validation = validateCurriculumLesson(lesson);
  if (!validation.ok) {
    fail(`Stage 7 Lesson ${idx + 1} (${lesson.id}) failed schema validation: ${validation.errors.join('; ')}`);
  }
});
pass('All 13 Stage 7 lessons validated against curriculum schema');

// Global uniqueness check across all 65 lessons
const allIds = [...stage2Ids, ...stage4Ids, ...stage5Ids, ...stage6Ids, ...stage7Ids];
if (new Set(allIds).size !== allIds.length) {
  fail('Duplicate lesson IDs detected across Stages 2, 4, 5, 6, and 7');
}
pass('All 65 lesson IDs across Stages 2, 4, 5, 6, and 7 are globally unique');

// Family serialization safety check across all 65 lessons
[...stage2Lessons, ...stage4Lessons, ...stage5Lessons, ...stage6Lessons, ...stage7Lessons].forEach((lesson) => {
  const serialized = serializeForFamily(lesson);
  if (
    'teacherPreparation' in serialized ||
    'teacherAnswerKey' in serialized ||
    'privateTeacherNotes' in serialized ||
    'internalFactCheckNotes' in serialized ||
    'sourceNotes' in serialized ||
    'mediaAttributionNotes' in serialized ||
    'factualSources' in serialized ||
    'authoritativeSources' in serialized
  ) {
    fail(`Teacher-only or internal fields leaked in Family serialization for ${lesson.id}`);
  }
  if (typeof serialized.familyChallenge !== 'string' || serialized.familyChallenge.length === 0) {
    fail(`Family-visible content missing familyChallenge after serialization for ${lesson.id}`);
  }
});
pass('Family serialization excludes teacher-only fields across all 65 lessons');

pass('All Stage 2, Stage 4, Stage 5, Stage 6, and Stage 7 curriculum schema tests passed successfully!');
