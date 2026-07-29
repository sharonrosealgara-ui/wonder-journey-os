import { serializeForFamily, validateCurriculumLesson } from '../lib/curriculum-schema';
import { stage2Lessons } from '../config/lessons-stage2';
import { getMedia } from '../config/media-registry';

function fail(message: string): never {
  console.error(`FAIL: ${message}`);
  process.exit(1);
}

function pass(message: string): void {
  console.log(`PASS: ${message}`);
}

console.log('Running Stage 2 curriculum validation tests...');

if (!Array.isArray(stage2Lessons) || stage2Lessons.length !== 3) {
  fail('Expected exactly 3 Stage 2 pilot lessons in lessons-stage2.ts');
}
pass('Stage 2 pilot lesson count is correct');

const sortedDates = [...stage2Lessons].map((lesson) => lesson.date);
const expectedDates = ['2026-08-03', '2026-08-04', '2026-08-07'];
if (JSON.stringify(sortedDates) !== JSON.stringify(expectedDates)) {
  fail(`Expected lesson dates ${expectedDates.join(', ')} but got ${sortedDates.join(', ')}`);
}
pass('Stage 2 pilot lessons have the expected first three August dates');

const lessonIds = stage2Lessons.map((lesson) => lesson.id);
const uniqueLessonIds = new Set(lessonIds);
if (uniqueLessonIds.size !== lessonIds.length) {
  fail('Duplicate lesson IDs found in stage2Lessons');
}
pass('No duplicate lesson IDs in stage2Lessons');

stage2Lessons.forEach((lesson, index) => {
  const validation = validateCurriculumLesson(lesson);
  if (!validation.ok) {
    fail(`Lesson ${lesson.id} failed schema validation: ${validation.errors.join('; ')}`);
  }
  if (lesson.topic.trim().length === 0) fail(`Lesson ${lesson.id} is missing topic`);
  if (lesson.ageRange.trim().length === 0) fail(`Lesson ${lesson.id} is missing ageRange`);
  if (lesson.privacyClassification !== 'family-safe') fail(`Lesson ${lesson.id} privacyClassification must be family-safe`);
  if (lesson.publicationStatus !== 'pilot') fail(`Lesson ${lesson.id} publicationStatus must be pilot`);
  if (!Array.isArray(lesson.mediaReferences) || lesson.mediaReferences.length === 0) {
    fail(`Lesson ${lesson.id} must include mediaReferences for factual media`);
  }
  lesson.mediaReferences.forEach((mediaId) => {
    const media = getMedia(mediaId);
    if (!media) fail(`Missing media registry entry for ${mediaId} referenced by lesson ${lesson.id}`);
    if (media.verificationStatus !== 'verified') fail(`Media ${mediaId} for lesson ${lesson.id} must be verified`);
  });
  if (!Array.isArray(lesson.factualSources) || lesson.factualSources.length === 0) {
    fail(`Lesson ${lesson.id} must include factualSources metadata`);
  }
});
pass('All Stage 2 pilot lessons validate against schema and media registry requirements');

const sampleLesson = stage2Lessons[0];
const serialized = serializeForFamily(sampleLesson);
if (
  'teacherPreparation' in serialized ||
  'teacherAnswerKey' in serialized ||
  'privateTeacherNotes' in serialized ||
  'internalFactCheckNotes' in serialized
) {
  fail('Teacher-only fields leaked in Family serialization');
}
if (typeof serialized.familyChallenge !== 'string' || serialized.familyChallenge.length === 0) {
  fail('Family-visible content missing familyChallenge after serialization');
}
pass('Family serialization excludes teacher-only fields and preserves family-visible content');

pass('All curriculum tests passed');
