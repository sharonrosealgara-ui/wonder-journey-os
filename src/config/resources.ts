import { stage2LessonsFamily } from "./lessons-stage2-family";
import { stage4LessonsFamily } from "./lessons-stage4-family";

// -------------------------------------------------------------
// RESOURCE LIBRARY - videos, links & materials for classes.
// Includes dynamic lesson curated resources.
// -------------------------------------------------------------

export type Resource = {
  id: string;
  title: string;
  emoji: string;
  type: "Video" | "Website" | "Printable" | "Presentation" | "Article" | "Activity" | string;
  url: string;
  description: string;
  category: string;
};

const globalResources: Resource[] = [];

// Approved lesson IDs whose curated resources are validated and authorized for the Family Library
export const APPROVED_RESOURCE_LESSON_IDS = new Set([
  // Stage 2 (August)
  "lesson-1-world-map",
  "lesson-2-archipelago",
  "lesson-3-luzon-visayas-mindanao",
  "lesson-4-region",
  "lesson-5-province",
  "lesson-6-city",
  "lesson-7-national-symbols",
  "lesson-8-mountains",
  "lesson-9-rivers-beaches",
  "lesson-10-animals",
  "lesson-11-plants",
  "lesson-12-language",
  "lesson-13-august-review",
  // Stage 4 (September)
  "lesson-14-greetings",
  "lesson-15-respectful-gestures",
  "lesson-16-family",
  "lesson-17-body-parts",
  "lesson-18-food",
  "lesson-19-emotions",
  "lesson-20-homes",
  "lesson-21-schools",
  "lesson-22-markets",
  "lesson-23-transportation",
  "lesson-24-carabao",
  "lesson-25-community-helpers",
  "lesson-26-september-review"
]);

const allApprovedFamilyLessons = [...stage2LessonsFamily, ...stage4LessonsFamily];

// Dynamically extract family-safe resources from approved lessons
const lessonResources: Resource[] = allApprovedFamilyLessons.flatMap((lesson) => {
  if (!APPROVED_RESOURCE_LESSON_IDS.has(lesson.id)) return [];
  if (lesson.publicationStatus !== "published" && lesson.publicationStatus !== "pilot") return [];
  if (!lesson.curatedResources) return [];
  return lesson.curatedResources
    .filter((res) => res.visibility === "family" || res.visibility === "both")
    .map((res) => ({
      id: res.id,
      title: res.title,
      emoji: res.type === "Video" ? "🎥" : res.type === "Article" ? "📖" : "🔗",
      type: res.type,
      url: res.url,
      description: `${res.whyUseful} (From: ${lesson.title})`,
      category: `Lesson Resources: ${lesson.unit || "Unit"}`
    }));
});

export const resources: Resource[] = [...globalResources, ...lessonResources];
