
import { stage2Lessons } from "./lessons-stage2";

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

const globalResources: Resource[] = []; // All legacy resources were unverified placeholders and have been removed.

// Dynamically extract family-safe resources from lessons
const lessonResources: Resource[] = stage2Lessons.flatMap((lesson) => {
  if (!lesson.curatedResources) return [];
  return lesson.curatedResources
    .filter((res) => res.visibility === "family" || res.visibility === "both")
    .map((res) => ({
      id: res.id,
      title: res.title,
      emoji: res.type === "Video" ? "▶️" : res.type === "Article" ? "📄" : "🔗",
      type: res.type,
      url: res.url,
      description: `${res.whyUseful} (From: ${lesson.title})`,
      category: `Lesson Resources: ${lesson.unit || "Unit"}`
    }));
});

export const resources: Resource[] = [...globalResources, ...lessonResources];

