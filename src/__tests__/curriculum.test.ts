import { serializeForFamily, CurriculumLesson } from '../lib/curriculum-schema';
import { stage2Lessons } from '../config/lessons-stage2';

console.log("Running Teacher-only field exclusion test...");
const sampleLesson = stage2Lessons[0];
const serialized = serializeForFamily(sampleLesson);

if (
  'teacherPreparation' in serialized ||
  'teacherAnswerKey' in serialized ||
  'privateTeacherNotes' in serialized
) {
  console.error("FAIL: Teacher fields leaked in Family serialization");
  process.exit(1);
} else {
  console.log("PASS: Family serialization excludes private fields");
}
