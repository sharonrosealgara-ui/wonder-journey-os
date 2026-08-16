
const fs = require("fs");
const path = require("path");

const filepath = path.join(__dirname, "../src/config/lessons-stage2.ts");
let content = fs.readFileSync(filepath, "utf8");

const newLesson1 = {
  id: "lesson-1-world-map",
  date: "2026-08-03",
  weekday: "Monday",
  title: "Our Place in the World",
  topic: "World Geography & The Philippines",
  ageRange: "7-12",
  unit: "Unit 1: The Philippine Archipelago",
  learningObjectives: [
    "Locate the Philippines on a world map in relation to the equator and other continents.",
    "Understand that the Philippines is part of Southeast Asia.",
    "Define what an archipelago is and how it shapes the country."
  ],
  essentialQuestion: "If you were to look at Earth from space, how would you describe where the Philippines is located?",
  factualBackground: "The Philippines is an archipelago in Southeast Asia, located in the western Pacific Ocean. It consists of 7,641 islands.",
  adventureHook: "Imagine you are an astronaut floating high above the Earth. You look down and see oceans, continents, and finally, a beautiful cluster of islands sparkling in the blue water. Today, we are going to zoom in from outer space to find exactly where our home, the Philippines, is on the giant map of the world!",
  discoveries: [
    { title: "The Equator", description: "The Philippines is located just above the equator, giving us our warm, tropical climate." },
    { title: "Southeast Asia", description: "We are part of a region called Southeast Asia, sharing similar climates and cultures with our neighbors." },
    { title: "An Archipelago", description: "Our country is not just one piece of land, but an archipelago made of 7,641 islands!" }
  ],
  richExplanation: [
    {
      heading: "Zooming In From Space",
      emoji: "??",
      body: "If we were to look at our planet from space, we would see huge pieces of land called continents and massive bodies of water called oceans. The Earth is a giant sphere, and right in the middle, around its waist, is an imaginary line called the Equator. The Equator divides the Earth into the Northern and Southern Hemispheres. Countries near the Equator get a lot of direct sunlight, which makes them very warm. The Philippines is located just a little bit above this line, in the Northern Hemisphere. This is why we don't have snow during winter; instead, we have a tropical climate with a dry season and a wet season. Our closeness to the Equator means we have lush rainforests, warm beaches, and plenty of sunshine all year round!"
    },
    {
      heading: "Our Neighborhood: Southeast Asia",
      emoji: "???",
      body: "As we zoom in closer from our view in space, we can focus on the largest continent on Earth: Asia. Asia is massive, so geographers divide it into smaller regions. The Philippines belongs to a vibrant and diverse neighborhood called Southeast Asia. This region is located south of China, east of India, and north of Australia. Our neighbors include countries like Indonesia, Malaysia, Thailand, and Vietnam. Because we are in the same corner of the world, we share many things with our neighbors. We experience similar tropical weather, grow similar crops like rice and coconuts, and even have words in our languages that sound alike! However, the Philippines is unique because it is situated on the eastern edge of Southeast Asia, facing the vast Pacific Ocean. This location has made our islands a historic crossroads for trade and travel."
    },
    {
      heading: "A Country of Many Islands",
      emoji: "???",
      body: "Unlike some countries that are just one solid, unbroken piece of land, the Philippines is an archipelago. An archipelago is a group or chain of islands clustered together in a sea or ocean. The Philippine archipelago is incredibly large, consisting of exactly 7,641 islands! Some of these islands are huge, with sprawling mountain ranges and large cities, while others are tiny patches of sand that peek above the water only when the tide is low. Being an archipelago shapes everything about how we live. It means that the ocean is always a part of our lives, providing us with food, transportation, and beautiful natural wonders. It also means that over thousands of years, different groups of people on different islands developed their own unique languages, traditions, and ways of life. Even though we are separated by water, we are all connected as one nation."
    },
    {
      heading: "The Ring of Fire",
      emoji: "??",
      body: "Another fascinating fact about where the Philippines is located is that it sits right on the Pacific Ring of Fire. This is a horseshoe-shaped path along the edge of the Pacific Ocean where many of Earth's volcanoes are found and where earthquakes happen frequently. The Earth's crust is made of giant puzzle pieces called tectonic plates, and the Philippines is right where several of these plates meet and push against each other. This incredible geological activity is what originally formed our beautiful mountains and islands! The rich, volcanic soil makes our land perfect for farming and growing delicious fruits. So, while being on the Ring of Fire means we have to be prepared for natural events like earthquakes, it is also the reason why our archipelago is so beautifully formed and full of life today."
    }
  ],
  keyFacts: [
    "The Philippines is located in Southeast Asia, facing the Pacific Ocean.",
    "It is an archipelago consisting of 7,641 islands.",
    "Because it is near the Equator, it has a tropical climate.",
    "It sits on the Pacific Ring of Fire, which created its mountains."
  ],
  vocabulary: [
    {
      word: "Archipelago",
      translation: "Kapuluan",
      language: "Tagalog",
      pronunciation: "ka-pu-lu-an",
      contextualExample: "The Philippines is a beautiful archipelago of 7,641 islands."
    },
    {
      word: "Equator",
      translation: "Ekwador",
      language: "Tagalog",
      pronunciation: "ek-wa-dor",
      contextualExample: "Our country is warm because it is near the equator."
    },
    {
      word: "Island",
      translation: "Isla / Pulo",
      language: "Tagalog",
      pronunciation: "is-la / pu-lo",
      contextualExample: "We live on a big island."
    }
  ],
  mediaMoments: [
    {
      description: "A world map zooming into Southeast Asia.",
      purpose: "Visual introduction.",
      requiredType: "Image",
      sourceRequirement: "Authentic map.",
      altTextGuidance: "Map of Southeast Asia"
    }
  ],
  guidedDiscussion: [
    "If you could have your very own island in the archipelago, what would you name it and what would be on it?",
    "How do you think living on an island changes the way people travel or get their food compared to living in the middle of a huge continent?"
  ],
  ageDifferentiation: {
    explorer: "Can you draw a map of a made-up island? Make sure it has a beach, a mountain, and a fun name!",
    adventure: "Write down three things that make living in an archipelago different from living in a landlocked country.",
    trailblazer: "Research one other country in Southeast Asia. Write down two things we share in common and one thing that makes the Philippines unique."
  },
  handsOnTask: {
    title: "Make your own mini-archipelago",
    materials: ["Playdough", "Plate"],
    setup: "Get playdough",
    steps: ["Make islands", "Place on plate"],
    finishCondition: "Plate with islands",
    accessibilityAlternative: "Draw a map of islands on paper",
    safetyNotes: "Don't eat playdough"
  },
  checkUnderstanding: [],
  premiumAssessment: [
    { type: "multiple-choice", question: "Where is the Philippines located?", options: ["Southeast Asia", "East Asia", "South Asia", "North Asia"], correctAnswer: "Southeast Asia" },
    { type: "true-false-with-explanation", question: "The Philippines has snow in the winter.", correctAnswer: "False", explanation: "It is near the equator." },
    { type: "short-answer", question: "What is an archipelago?", expectedAnswerKeywords: ["islands", "group"] },
    { type: "multiple-choice", question: "How many islands are there?", options: ["7,641", "1,000", "500", "10,000"], correctAnswer: "7,641" },
    { type: "multiple-choice", question: "Which ring is it part of?", options: ["Ring of Fire", "Ring of Water", "Ring of Ice", "Ring of Wind"], correctAnswer: "Ring of Fire" }
  ],
  learnerReflection: "Today I discovered that our country is made of 7,641 islands! The most interesting part of zooming in from space was...",
  familyChallenge: "Find a map or globe in your house (or use a phone). Challenge your family to find the Philippines in less than 5 seconds!",
  curatedResources: [
    {
      id: "res-map-1",
      title: "Interactive World Globe",
      type: "Website",
      url: "https://earth.google.com",
      visibility: "both",
      whyUseful: "Allows families to zoom from space down to their actual street.",
      verificationStatus: "verified",
      verifiedDate: "2026-08-16",
      provider: "Google"
    }
  ],
  authoritativeSources: [],
  teacherAnswerKey: { "Q1": "Southeast Asia", "Q2": "False", "Q3": "Group of islands", "Q4": "7,641", "Q5": "Ring of Fire" },
  subjectConnections: { "science": "Geography" },
  materials: ["Playdough"],
  factualMediaRequirements: [],
  activities: { beginnerSupport: "Draw", coreActivity: "Write", advancedChallenge: "Research" },
  interactiveGame: "Map Finder",
  handsOnActivity: "Make an island",
  progressBadge: "badge-map-world",
  sourceNotes: "Geography textbook",
  mediaAttributionNotes: "NASA imagery",
  accessibilityNotes: "Drawing alternative",
  privacyClassification: "family-safe",
  publicationStatus: "pilot",
  teacherPreparation: "Get maps ready"
};

const startMarker = `export const stage2Lessons: CurriculumLesson[] = [`;
const lesson2Marker = `  {\n    "id": "lesson-2-luzon"`;

const startIndex = content.indexOf(startMarker);
const lesson2Index = content.indexOf(lesson2Marker);

if (startIndex === -1 || lesson2Index === -1) {
  console.error("Could not find markers");
  process.exit(1);
}

const before = content.slice(0, startIndex + startMarker.length);
const after = content.slice(lesson2Index);

const newContent = before + "\n  " + JSON.stringify(newLesson1, null, 2).split("\n").join("\n  ") + ",\n" + after;

fs.writeFileSync(filepath, newContent, "utf8");
console.log("Successfully updated lesson-1-world-map in lessons-stage2.ts");

