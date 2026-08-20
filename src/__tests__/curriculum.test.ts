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

const lesson1 = stage2Lessons[0];
const validation = validateCurriculumLesson(lesson1);
if (!validation.ok) {
  fail(`Lesson 1 failed schema validation: ${validation.errors.join('; ')}`);
}
pass('Lesson 1 validated against curriculum schema');

const sampleLesson = stage2Lessons[0];
const serialized = serializeForFamily(sampleLesson);
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
  fail('Teacher-only or internal fields leaked in Family serialization');
}
if (typeof serialized.familyChallenge !== 'string' || serialized.familyChallenge.length === 0) {
  fail('Family-visible content missing familyChallenge after serialization');
}
pass('Family serialization excludes teacher-only fields and preserves family-visible content');

pass('All curriculum tests passed');
