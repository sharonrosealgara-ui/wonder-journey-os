// ─────────────────────────────────────────────────────────────
// RESOURCE LIBRARY — videos, links & materials for classes.
// The teacher can also add links per-lesson in lessons.ts.
// ─────────────────────────────────────────────────────────────

export type Resource = {
  id: string;
  title: string;
  emoji: string;
  type: "Video" | "Website" | "Printable" | "Presentation";
  url: string;
  description: string;
  category: string;
};

export const resources: Resource[] = [
  {
    id: "philippines-4k",
    title: "The Philippines from Above",
    emoji: "🚁",
    type: "Video",
    url: "https://www.youtube.com/results?search_query=philippines+from+above+4k",
    description: "Breathtaking aerial views of islands, beaches, and rice terraces.",
    category: "Discover the Philippines",
  },
  {
    id: "tagalog-kids",
    title: "Tagalog for Kids — Greetings",
    emoji: "💬",
    type: "Video",
    url: "https://www.youtube.com/results?search_query=tagalog+greetings+for+kids",
    description: "Simple, sing-along Tagalog greeting videos.",
    category: "Languages",
  },
  {
    id: "hiligaynon-basics",
    title: "Hiligaynon Basics",
    emoji: "🗣️",
    type: "Video",
    url: "https://www.youtube.com/results?search_query=hiligaynon+basic+phrases",
    description: "Learn the language of Iloilo and Negros.",
    category: "Languages",
  },
  {
    id: "bayanihan-video",
    title: "Bayanihan — Moving a House Together",
    emoji: "🤝",
    type: "Video",
    url: "https://www.youtube.com/results?search_query=bayanihan+filipino+tradition",
    description: "See the amazing tradition of neighbors carrying a whole house!",
    category: "Family Values",
  },
  {
    id: "chocolate-hills",
    title: "Chocolate Hills & Tarsiers of Bohol",
    emoji: "🍫",
    type: "Video",
    url: "https://www.youtube.com/results?search_query=chocolate+hills+bohol+tarsier",
    description: "Explore 1,268 chocolate-colored hills and the world's tiniest primate.",
    category: "Discover the Philippines",
  },
  {
    id: "mango-float-video",
    title: "Mango Float Recipe Walkthrough",
    emoji: "🥭",
    type: "Video",
    url: "https://www.youtube.com/results?search_query=mango+float+recipe+easy",
    description: "Watch a family make mango float step by step before class.",
    category: "Cooking & Baking",
  },
  {
    id: "canva-lessons",
    title: "Canva Lesson Presentations",
    emoji: "🎨",
    type: "Presentation",
    url: "https://www.canva.com/",
    description: "Teacher Sharon's slide decks for each lesson (links added per lesson).",
    category: "Class Materials",
  },
  {
    id: "philippines-map",
    title: "Printable Philippines Map",
    emoji: "🗺️",
    type: "Printable",
    url: "https://www.google.com/search?q=printable+philippines+map+for+kids&tbm=isch",
    description: "A map to color and label Luzon, Visayas, and Mindanao.",
    category: "Discover the Philippines",
  },
];
