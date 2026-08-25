const fs = require('fs');
const data = JSON.parse(fs.readFileSync('artifacts/canonical-65-lessons.json', 'utf8'));

console.log("=== CANONICAL 65 LESSONS OVERVIEW ===");
data.forEach(l => {
  console.log(`Lesson ${l.order} [${l.id}]: ${l.title}`);
  console.log(`  Topic: ${l.topic} | Unit: ${l.unit}`);
  console.log(`  Objectives: ${Array.isArray(l.learningObjectives) ? l.learningObjectives[0] : l.learningObjectives}`);
  console.log(`  Background: ${l.factualBackground.substring(0, 120)}...`);
  console.log("");
});
