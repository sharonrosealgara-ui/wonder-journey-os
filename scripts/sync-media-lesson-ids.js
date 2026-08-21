const fs = require("fs");
const path = require("path");

// Array of all 65 exact lesson IDs
const LESSON_IDS = [
  "lesson-1-world-map", "lesson-2-archipelago", "lesson-3-luzon-visayas-mindanao", "lesson-4-region", "lesson-5-province",
  "lesson-6-city", "lesson-7-national-symbols", "lesson-8-mountains", "lesson-9-rivers-beaches", "lesson-10-animals",
  "lesson-11-plants", "lesson-12-language", "lesson-13-august-review", "lesson-14-greetings", "lesson-15-respectful-gestures",
  "lesson-16-family", "lesson-17-body-parts", "lesson-18-food", "lesson-19-emotions", "lesson-20-homes",
  "lesson-21-schools", "lesson-22-markets", "lesson-23-transportation", "lesson-24-carabao", "lesson-25-community-helpers",
  "lesson-26-september-review", "lesson-27-bayanihan", "lesson-28-jose-rizal", "lesson-29-andres-bonifacio", "lesson-30-indigenous-peoples",
  "lesson-31-history-timeline", "lesson-32-mayon-volcano", "lesson-33-weather-climate", "lesson-34-tropical-forests", "lesson-35-coral-reefs",
  "lesson-36-philippine-eagle", "lesson-37-environmental-stewardship", "lesson-38-october-review", "lesson-39-october-showcase", "lesson-40-kitchen-safety",
  "lesson-41-measurements", "lesson-42-nutrition", "lesson-43-rice-basics", "lesson-44-adobo-history", "lesson-45-sinigang-flavors",
  "lesson-46-pancit-celebration", "lesson-47-halo-halo", "lesson-48-mango-float", "lesson-49-kakanin", "lesson-50-grandmas-recipe-box",
  "lesson-51-family-heritage-wall", "lesson-52-november-showcase", "lesson-53-geography-championship", "lesson-54-cultural-game-show", "lesson-55-family-recipe-showcase",
  "lesson-56-gratitude-journal", "lesson-57-biblical-stewardship", "lesson-58-bayanihan-review", "lesson-59-faith-and-heroes", "lesson-60-christmas-traditions",
  "lesson-61-simbang-gabi", "lesson-62-showcase-prep", "lesson-63-the-nativity", "lesson-64-looking-forward", "lesson-65-year-end-showcase"
];

const registryFile = path.join(__dirname, "../src/config/media-registry.ts");
let content = fs.readFileSync(registryFile, "utf8");

// Parse JSON from media-registry.ts
const match = content.match(/export const mediaRegistry: Record<string, FactualMedia> = (\{[\s\S]*?\});\n\nexport function/);
if (match) {
  const jsonStr = match[1];
  const registry = JSON.parse(jsonStr);

  for (const id in registry) {
    const item = registry[id];
    // Find lesson number from ID (e.g. l01-...)
    const numMatch = id.match(/^l(\d{2})-/);
    if (numMatch) {
      const num = parseInt(numMatch[1], 10);
      const fullLessonId = LESSON_IDS[num - 1];
      if (fullLessonId) {
        item.associatedLessonIds = [fullLessonId, `lesson-${num}`];
      }
    }
  }

  const updatedTs = content.replace(
    /export const mediaRegistry: Record<string, FactualMedia> = \{[\s\S]*?\};\n\nexport function/,
    `export const mediaRegistry: Record<string, FactualMedia> = ${JSON.stringify(registry, null, 2)};\n\nexport function`
  );
  fs.writeFileSync(registryFile, updatedTs, "utf8");
  console.log("Successfully updated all associatedLessonIds in media-registry.ts!");
} else {
  console.error("Could not parse mediaRegistry in media-registry.ts");
}
