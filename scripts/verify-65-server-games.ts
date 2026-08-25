import { generateServerLearnerGame } from "../src/lib/server-game-definitions";

console.log("Testing generateServerLearnerGame for lessons 1 to 65...");
for (let i = 1; i <= 65; i++) {
  const lessonId = `lesson-${i}`;
  const dto = generateServerLearnerGame(lessonId);
  if (!dto || !dto.sorting || !dto.quiz) {
    console.error(`Failed for lesson ${i}`);
    process.exit(1);
  }
}
console.log("All 65 lessons generated valid server game DTOs successfully!");
