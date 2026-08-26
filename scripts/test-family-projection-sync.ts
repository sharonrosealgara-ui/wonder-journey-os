import { stage2Lessons } from "../src/config/lessons-stage2";
import { stage2LessonsFamily } from "../src/config/lessons-stage2-family";
import { stage4Lessons } from "../src/config/lessons-stage4";
import { stage4LessonsFamily } from "../src/config/lessons-stage4-family";
import { stage5Lessons } from "../src/config/lessons-stage5";
import { stage5LessonsFamily } from "../src/config/lessons-stage5-family";
import { stage6Lessons } from "../src/config/lessons-stage6";
import { stage6LessonsFamily } from "../src/config/lessons-stage6-family";
import { stage7Lessons } from "../src/config/lessons-stage7";
import { stage7LessonsFamily } from "../src/config/lessons-stage7-family";
import { serializeForFamily } from "../src/lib/curriculum-schema";

console.log("Running Family Dataset Projection Sync Test via tsx...");

const stages = [
  { name: "Stage 2", rawLessons: stage2Lessons, familyLessons: stage2LessonsFamily },
  { name: "Stage 4", rawLessons: stage4Lessons, familyLessons: stage4LessonsFamily },
  { name: "Stage 5", rawLessons: stage5Lessons, familyLessons: stage5LessonsFamily },
  { name: "Stage 6", rawLessons: stage6Lessons, familyLessons: stage6LessonsFamily },
  { name: "Stage 7", rawLessons: stage7Lessons, familyLessons: stage7LessonsFamily },
];

const forbiddenTeacherKeys = [
  "teacherAnswerKey",
  "teacherPreparation",
  "privateTeacherNotes",
  "internalFactCheckNotes",
  "authoritativeSources",
  "sourceNotes",
  "mediaAttributionNotes",
  "factualSources"
];

const errors: string[] = [];

stages.forEach((s) => {
  const { name, rawLessons, familyLessons } = s;

  if (rawLessons.length !== familyLessons.length) {
    errors.push(`${name}: Count mismatch. Raw has ${rawLessons.length} lessons, Family has ${familyLessons.length} lessons.`);
    return;
  }

  rawLessons.forEach((rawLesson: any, idx: number) => {
    const familyLesson: any = familyLessons[idx];
    if (!familyLesson || rawLesson.id !== familyLesson.id) {
      errors.push(`${name}[${idx}]: ID mismatch. Expected ${rawLesson.id}, got ${familyLesson ? familyLesson.id : "undefined"}.`);
      return;
    }

    const expectedProjection = serializeForFamily(rawLesson);

    forbiddenTeacherKeys.forEach((key) => {
      if (key in familyLesson) {
        errors.push(`${name} (${rawLesson.id}): Leaked teacher key "${key}" in Family dataset.`);
      }
    });

    if (rawLesson.premiumAssessment) {
      if (!familyLesson.premiumAssessment) {
        errors.push(`${name} (${rawLesson.id}): Missing premiumAssessment in Family projection.`);
      } else if (rawLesson.premiumAssessment.length !== familyLesson.premiumAssessment.length) {
        errors.push(`${name} (${rawLesson.id}): Assessment count mismatch.`);
      } else {
        familyLesson.premiumAssessment.forEach((q: any, qIdx: number) => {
          if ("correctAnswer" in q || "correctOptionId" in q || "expectedAnswerKeywords" in q || "expectedResolution" in q || "correctOrder" in q || "pairs" in q) {
            errors.push(`${name} (${rawLesson.id}) Q${qIdx + 1}: Learner assessment DTO contains answer or internal key!`);
          }
        });
      }
    }

    if (familyLesson.title !== expectedProjection.title || familyLesson.topic !== expectedProjection.topic) {
      errors.push(`${name} (${rawLesson.id}): Desynchronized title or topic with raw lesson.`);
    }
    if (familyLesson.familyChallenge !== expectedProjection.familyChallenge) {
      errors.push(`${name} (${rawLesson.id}): Desynchronized familyChallenge with raw lesson.`);
    }
  });
});

if (errors.length > 0) {
  console.error("FAIL: Family projection sync test detected errors:");
  errors.forEach((e) => console.error(" - " + e));
  process.exit(1);
} else {
  console.log("PASS: All 5 curriculum stages Family projections are 100% in sync with zero leaked teacher keys.");
  process.exit(0);
}
