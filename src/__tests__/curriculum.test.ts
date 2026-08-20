import { serializeForFamily, validateCurriculumLesson } from '../lib/curriculum-schema';
import { stage2Lessons } from '../config/lessons-stage2';

function fail(message: string): never {
  console.error(`FAIL: ${message}`);
  process.exit(1);
}

function pass(message: string): void {
  console.log(`PASS: ${message}`);
}

console.log('Running Stage 2 curriculum validation tests...');

if (!Array.isArray(stage2Lessons) || stage2Lessons.length !== 13) {
  fail(`Expected 13 Stage 2 lessons in lessons-stage2.ts, got ${stage2Lessons?.length}`);
}
pass('Stage 2 lesson count is correct (13 lessons)');

const lessonIds = stage2Lessons.map((lesson) => lesson.id);
const uniqueLessonIds = new Set(lessonIds);
if (uniqueLessonIds.size !== lessonIds.length) {
  fail('Duplicate lesson IDs found in stage2Lessons');
}
pass('No duplicate lesson IDs in stage2Lessons');

stage2Lessons.forEach((lesson, idx) => {
  const validation = validateCurriculumLesson(lesson);
  if (!validation.ok) {
    fail(`Lesson ${idx + 1} (${lesson.id}) failed schema validation: ${validation.errors.join('; ')}`);
  }
});
pass('All 13 Stage 2 lessons validated against curriculum schema');

stage2Lessons.forEach((lesson) => {
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
pass('Family serialization excludes teacher-only fields across all 13 lessons');

pass('All curriculum tests passed');
