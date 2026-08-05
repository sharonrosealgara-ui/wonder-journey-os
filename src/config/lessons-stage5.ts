import { CurriculumLesson } from "@/lib/curriculum-schema";

export const stage5Lessons: CurriculumLesson[] = [
  {
    id: "lesson-27-bayanihan",
    date: "2026-10-02",
    weekday: "Friday",
    title: "Bayanihan Spirit",
    unit: "History, Heroes, Nature, and Science",
    topic: "Culture and Values",
    ageRange: "6-8",
    privacyClassification: "family-safe",
    publicationStatus: "pilot",
    learningObjectives: ["Understand the concept of bayanihan (community cooperation)"],
    essentialQuestion: "How do Filipinos help each other in times of need?",
    factualBackground: "Bayanihan originally refers to the tradition of moving a house by gathering the community to carry it on their shoulders.",
    vocabulary: [
      { word: "Bayanihan", translation: "Community cooperation", language: "Tagalog", hiligaynon: "Bayanihan / Pag-inugyon" }
    ],
    subjectConnections: { culture: "Values" },
    materials: ["Building blocks or boxes"],
    factualMediaRequirements: ["bayanihan-photo"],
    activities: {
      beginnerSupport: "Say Bayanihan.",
      coreActivity: "Work together to build a strong tower with blocks.",
      advancedChallenge: "Draw a picture of people helping each other."
    },
    interactiveGame: "Team Building Relay",
    handsOnActivity: "Build a house together",
    knowledgeCheck: [
      { question: "What does bayanihan mean?", options: ["Working together", "Sleeping"], correctAnswer: "Working together" }
    ],
    learnerReflection: "I can help my community.",
    familyChallenge: "Do a chore together as a family today.",
    progressBadge: "Community Helper",
    sourceNotes: "KWF / NCCA",
    mediaAttributionNotes: "Verified photo of bayanihan",
    accessibilityNotes: "Adapted team activities",
    teacherPreparation: "Prepare blocks",
    teacherAnswerKey: { "Q1": "Working together" }
  },
  {
    id: "lesson-28-jose-rizal",
    date: "2026-10-05",
    weekday: "Monday",
    title: "José Rizal: Writer, Doctor, and Patriot",
    unit: "History, Heroes, Nature, and Science",
    topic: "History and Heroes",
    ageRange: "6-8",
    privacyClassification: "family-safe",
    publicationStatus: "pilot",
    learningObjectives: ["Identify Dr. José Rizal and his contributions"],
    essentialQuestion: "Who was José Rizal and how did he use his words?",
    factualBackground: "José Rizal was a writer, doctor, and patriot whose writings inspired the Philippine revolution. He is a prominent national hero, though not the sole legally designated one.",
    vocabulary: [
      { word: "Bayani", translation: "Hero", language: "Tagalog", hiligaynon: "Bayani" },
      { word: "Manggagamot", translation: "Doctor / Healer", language: "Tagalog", hiligaynon: "Manugbulong" }
    ],
    subjectConnections: { history: "Heroes" },
    materials: ["Rizal portrait", "Paper and pens"],
    factualMediaRequirements: ["jose-rizal-portrait"],
    activities: {
      beginnerSupport: "Point to José Rizal.",
      coreActivity: "Write a short poem or message of peace.",
      advancedChallenge: "Explain how writing can be powerful."
    },
    interactiveGame: "Hero Fact Match",
    handsOnActivity: "Write with a feather pen",
    knowledgeCheck: [
      { question: "What was one of José Rizal's jobs?", options: ["Doctor", "Singer"], correctAnswer: "Doctor" }
    ],
    learnerReflection: "I can use my words for good.",
    familyChallenge: "Read a story together.",
    progressBadge: "Young Writer",
    sourceNotes: "NHCP",
    mediaAttributionNotes: "Verified portrait",
    accessibilityNotes: "Visual descriptions of Rizal",
    teacherPreparation: "Prepare feather pens",
    teacherAnswerKey: { "Q1": "Doctor" }
  },
  {
    id: "lesson-29-andres-bonifacio",
    date: "2026-10-06",
    weekday: "Tuesday",
    title: "Andrés Bonifacio and the Katipunan",
    unit: "History, Heroes, Nature, and Science",
    topic: "History and Heroes",
    ageRange: "6-8",
    privacyClassification: "family-safe",
    publicationStatus: "pilot",
    learningObjectives: ["Identify Andrés Bonifacio and his bravery"],
    essentialQuestion: "How did Andrés Bonifacio show courage?",
    factualBackground: "Andrés Bonifacio founded the Katipunan, a secret society that led the Philippine revolution against Spanish rule.",
    vocabulary: [
      { word: "Katapangan", translation: "Bravery", language: "Tagalog", hiligaynon: "Kaisog" }
    ],
    subjectConnections: { history: "Heroes" },
    materials: ["Bonifacio portrait", "Red paper"],
    factualMediaRequirements: ["andres-bonifacio-portrait"],
    activities: {
      beginnerSupport: "Say Katapangan.",
      coreActivity: "Make a bravery badge.",
      advancedChallenge: "Discuss what it means to be brave."
    },
    interactiveGame: "Courage Path Game",
    handsOnActivity: "Create a Katipunero hat",
    knowledgeCheck: [
      { question: "What group did Bonifacio found?", options: ["Katipunan", "Boy Scouts"], correctAnswer: "Katipunan" }
    ],
    learnerReflection: "I can be brave like Bonifacio.",
    familyChallenge: "Share a story of when you were brave.",
    progressBadge: "Brave Explorer",
    sourceNotes: "NHCP",
    mediaAttributionNotes: "Verified portrait",
    accessibilityNotes: "Adapted crafts",
    teacherPreparation: "Prepare red paper hats",
    teacherAnswerKey: { "Q1": "Katipunan" }
  },
  {
    id: "lesson-30-indigenous-peoples",
    date: "2026-10-09",
    weekday: "Friday",
    title: "Indigenous Peoples and Cultures of the Philippines",
    unit: "History, Heroes, Nature, and Science",
    topic: "History and Culture",
    ageRange: "6-8",
    privacyClassification: "family-safe",
    publicationStatus: "pilot",
    learningObjectives: ["Appreciate the distinct indigenous communities in the Philippines respectfully"],
    essentialQuestion: "Who are the indigenous peoples of the Philippines?",
    factualBackground: "The Philippines is home to diverse indigenous groups with distinct cultures, languages, and traditions, such as the Igorot, Lumad, and Mangyan.",
    vocabulary: [
      { word: "Paggalang", translation: "Respect", language: "Tagalog", hiligaynon: "Pagtahod" }
    ],
    subjectConnections: { culture: "Indigenous Peoples" },
    materials: ["Photos of traditional weaving or crafts"],
    factualMediaRequirements: ["indigenous-weaving-photo"],
    activities: {
      beginnerSupport: "Look at the weaving patterns.",
      coreActivity: "Create a paper weaving project.",
      advancedChallenge: "Learn about one specific indigenous group's tradition."
    },
    interactiveGame: "Pattern Matching",
    handsOnActivity: "Paper weaving",
    knowledgeCheck: [
      { question: "Why should we respect indigenous cultures?", options: ["They are part of our rich heritage", "We shouldn't"], correctAnswer: "They are part of our rich heritage" }
    ],
    learnerReflection: "I respect different cultures and traditions.",
    familyChallenge: "Learn about the indigenous people native to your own region.",
    progressBadge: "Culture Learner",
    sourceNotes: "NCIP",
    mediaAttributionNotes: "Respectful, authentic cultural photos",
    accessibilityNotes: "Tactile weaving materials",
    teacherPreparation: "Prepare weaving strips",
    teacherAnswerKey: { "Q1": "They are part of our rich heritage" }
  },
  {
    id: "lesson-31-history-timeline",
    date: "2026-10-12",
    weekday: "Monday",
    title: "A Child-Friendly Philippine History Timeline",
    unit: "History, Heroes, Nature, and Science",
    topic: "History",
    ageRange: "6-8",
    privacyClassification: "family-safe",
    publicationStatus: "pilot",
    learningObjectives: ["Learn a manageable sequence of major Philippine historical periods"],
    essentialQuestion: "What are the big events in Philippine history?",
    factualBackground: "Philippine history spans pre-colonial times, Spanish colonization, American and Japanese periods, and independence.",
    vocabulary: [
      { word: "Kasaysayan", translation: "History", language: "Tagalog", hiligaynon: "Maragtas" }
    ],
    subjectConnections: { history: "Timeline" },
    materials: ["Timeline cards"],
    factualMediaRequirements: ["history-timeline-diagram"],
    activities: {
      beginnerSupport: "Sequence 3 picture cards.",
      coreActivity: "Build a visual timeline of major events.",
      advancedChallenge: "Explain one event on the timeline."
    },
    interactiveGame: "Timeline Sort",
    handsOnActivity: "Draw a historical event",
    knowledgeCheck: [
      { question: "What is Kasaysayan?", options: ["History", "Math"], correctAnswer: "History" }
    ],
    learnerReflection: "I know how the Philippines grew over time.",
    familyChallenge: "Make a timeline of your own life.",
    progressBadge: "Time Traveler",
    sourceNotes: "NHCP",
    mediaAttributionNotes: "Verified diagram",
    accessibilityNotes: "Large print timeline",
    teacherPreparation: "Print timeline cards",
    teacherAnswerKey: { "Q1": "History" }
  },
  {
    id: "lesson-32-mayon-volcano",
    date: "2026-10-13",
    weekday: "Tuesday",
    title: "Mayon Volcano",
    unit: "History, Heroes, Nature, and Science",
    topic: "Science and Nature",
    ageRange: "6-8",
    privacyClassification: "family-safe",
    publicationStatus: "pilot",
    learningObjectives: ["Describe the near-symmetrical cone shape of Mayon Volcano"],
    essentialQuestion: "What makes Mayon Volcano unique?",
    factualBackground: "Mayon is an active stratovolcano in Albay, famous for its near-symmetrical cone shape.",
    vocabulary: [
      { word: "Bulkan", translation: "Volcano", language: "Tagalog", hiligaynon: "Bulkan" }
    ],
    subjectConnections: { science: "Geology" },
    materials: ["Clay or sand"],
    factualMediaRequirements: ["mayon-volcano-photo"],
    activities: {
      beginnerSupport: "Say Bulkan.",
      coreActivity: "Build a cone-shaped volcano using clay.",
      advancedChallenge: "Explain what makes a volcano active."
    },
    interactiveGame: "Volcano Parts",
    handsOnActivity: "Clay volcano modeling",
    knowledgeCheck: [
      { question: "What shape is Mayon Volcano famous for?", options: ["Near-symmetrical cone", "Square"], correctAnswer: "Near-symmetrical cone" }
    ],
    learnerReflection: "Volcanoes are powerful and beautiful.",
    familyChallenge: "Look for cone shapes in your house.",
    progressBadge: "Geology Explorer",
    sourceNotes: "PHIVOLCS",
    mediaAttributionNotes: "Verified photo",
    accessibilityNotes: "Kinesthetic sand",
    teacherPreparation: "Prepare clay",
    teacherAnswerKey: { "Q1": "Near-symmetrical cone" }
  },
  {
    id: "lesson-33-weather-climate",
    date: "2026-10-16",
    weekday: "Friday",
    title: "Weather and Climate",
    unit: "History, Heroes, Nature, and Science",
    topic: "Science and Nature",
    ageRange: "6-8",
    privacyClassification: "family-safe",
    publicationStatus: "pilot",
    learningObjectives: ["Distinguish between daily weather and tropical climate"],
    essentialQuestion: "What is the difference between weather and climate?",
    factualBackground: "Weather is daily (rainy or sunny), while climate is the long-term pattern. The Philippines has a tropical climate.",
    vocabulary: [
      { word: "Ulan", translation: "Rain", language: "Tagalog", hiligaynon: "Ulan" },
      { word: "Araw", translation: "Sun / Day", language: "Tagalog", hiligaynon: "Adlaw" }
    ],
    subjectConnections: { science: "Meteorology" },
    materials: ["Weather chart"],
    factualMediaRequirements: ["tropical-weather-diagram"],
    activities: {
      beginnerSupport: "Point to the sun or rain.",
      coreActivity: "Track today's weather and compare it to the tropical climate.",
      advancedChallenge: "Explain climate in your own words."
    },
    interactiveGame: "Weather vs Climate Sort",
    handsOnActivity: "Make a weather dial",
    knowledgeCheck: [
      { question: "Which one describes what happens every day?", options: ["Weather", "Climate"], correctAnswer: "Weather" }
    ],
    learnerReflection: "I can observe the weather outside.",
    familyChallenge: "Record the weather for a week.",
    progressBadge: "Weather Watcher",
    sourceNotes: "PAGASA",
    mediaAttributionNotes: "Verified diagram",
    accessibilityNotes: "Tactile weather symbols",
    teacherPreparation: "Prepare weather dials",
    teacherAnswerKey: { "Q1": "Weather" }
  },
  {
    id: "lesson-34-tropical-forests",
    date: "2026-10-19",
    weekday: "Monday",
    title: "Tropical Forests",
    unit: "History, Heroes, Nature, and Science",
    topic: "Science and Nature",
    ageRange: "6-8",
    privacyClassification: "family-safe",
    publicationStatus: "pilot",
    learningObjectives: ["Explore the biodiversity of Philippine forests"],
    essentialQuestion: "What lives in a tropical forest?",
    factualBackground: "Philippine tropical forests are highly biodiverse, hosting thousands of unique plant and animal species.",
    vocabulary: [
      { word: "Kagubatan", translation: "Forest", language: "Tagalog", hiligaynon: "Katalunan" }
    ],
    subjectConnections: { science: "Biology" },
    materials: ["Leaves, forest photos"],
    factualMediaRequirements: ["philippine-forest-photo"],
    activities: {
      beginnerSupport: "Name a forest animal.",
      coreActivity: "Draw a tropical forest with different layers.",
      advancedChallenge: "List 3 endangered species in the Philippines."
    },
    interactiveGame: "Forest Layers Matching",
    handsOnActivity: "Leaf rubbing art",
    knowledgeCheck: [
      { question: "What is the Tagalog word for forest?", options: ["Kagubatan", "Dagat"], correctAnswer: "Kagubatan" }
    ],
    learnerReflection: "Forests are full of life.",
    familyChallenge: "Go on a nature walk and find different leaves.",
    progressBadge: "Forest Ranger",
    sourceNotes: "DENR",
    mediaAttributionNotes: "Verified photo",
    accessibilityNotes: "Tactile leaves",
    teacherPreparation: "Collect fallen leaves",
    teacherAnswerKey: { "Q1": "Kagubatan" }
  },
  {
    id: "lesson-35-coral-reefs",
    date: "2026-10-20",
    weekday: "Tuesday",
    title: "Coral Reefs",
    unit: "History, Heroes, Nature, and Science",
    topic: "Science and Nature",
    ageRange: "6-8",
    privacyClassification: "family-safe",
    publicationStatus: "pilot",
    learningObjectives: ["Learn about marine life and the Coral Triangle ecosystem"],
    essentialQuestion: "Why are coral reefs important?",
    factualBackground: "Coral reefs are living ecosystems. The Philippines is part of the Coral Triangle, the global center of marine biodiversity.",
    vocabulary: [
      { word: "Karagatan", translation: "Ocean", language: "Tagalog", hiligaynon: "Kadagatan" }
    ],
    subjectConnections: { science: "Marine Biology" },
    materials: ["Blue paper, fish cutouts"],
    factualMediaRequirements: ["coral-reef-photo"],
    activities: {
      beginnerSupport: "Stick fish on the blue paper.",
      coreActivity: "Create a coral reef diorama.",
      advancedChallenge: "Explain why coral is a living animal, not a rock."
    },
    interactiveGame: "Reef Creatures Bingo",
    handsOnActivity: "Shoebox diorama",
    knowledgeCheck: [
      { question: "Is a coral reef alive?", options: ["Yes, it is a living ecosystem", "No, it is just rocks"], correctAnswer: "Yes, it is a living ecosystem" }
    ],
    learnerReflection: "I know the ocean is full of living reefs.",
    familyChallenge: "Watch a video about the Coral Triangle.",
    progressBadge: "Marine Biologist",
    sourceNotes: "WWF Coral Triangle",
    mediaAttributionNotes: "Verified photo",
    accessibilityNotes: "3D diorama",
    teacherPreparation: "Gather shoeboxes",
    teacherAnswerKey: { "Q1": "Yes, it is a living ecosystem" }
  },
  {
    id: "lesson-36-philippine-eagle",
    date: "2026-10-23",
    weekday: "Friday",
    title: "The Philippine Eagle",
    unit: "History, Heroes, Nature, and Science",
    topic: "Science and Nature",
    ageRange: "6-8",
    privacyClassification: "family-safe",
    publicationStatus: "pilot",
    learningObjectives: ["Identify the national bird and its conservation needs"],
    essentialQuestion: "How can we help the Philippine Eagle?",
    factualBackground: "The Philippine Eagle is critically endangered and is the national bird of the Philippines.",
    vocabulary: [
      { word: "Agila", translation: "Eagle", language: "Tagalog", hiligaynon: "Agila" }
    ],
    subjectConnections: { science: "Conservation" },
    materials: ["Eagle wings template"],
    factualMediaRequirements: ["philippine-eagle-photo"],
    activities: {
      beginnerSupport: "Flap your arms like an eagle.",
      coreActivity: "Make eagle wings and measure their wingspan.",
      advancedChallenge: "Write one way to protect the eagle's habitat."
    },
    interactiveGame: "Wingspan Measurement",
    handsOnActivity: "Eagle wings craft",
    knowledgeCheck: [
      { question: "What is the national bird of the Philippines?", options: ["Philippine Eagle", "Maya"], correctAnswer: "Philippine Eagle" }
    ],
    learnerReflection: "I want to protect endangered animals.",
    familyChallenge: "Measure a 7-foot wingspan on the floor together.",
    progressBadge: "Eagle Guardian",
    sourceNotes: "Philippine Eagle Foundation",
    mediaAttributionNotes: "Verified photo",
    accessibilityNotes: "Physical measurements",
    teacherPreparation: "Prepare measuring tape",
    teacherAnswerKey: { "Q1": "Philippine Eagle" }
  },
  {
    id: "lesson-37-environmental-stewardship",
    date: "2026-10-26",
    weekday: "Monday",
    title: "Caring for God's Creation",
    unit: "History, Heroes, Nature, and Science",
    topic: "Science and Nature",
    ageRange: "6-8",
    privacyClassification: "family-safe",
    publicationStatus: "pilot",
    learningObjectives: ["Learn how to be good stewards of the environment"],
    essentialQuestion: "How can we take care of the world God gave us?",
    factualBackground: "Environmental stewardship means responsibly managing and protecting natural resources.",
    vocabulary: [
      { word: "Mundo", translation: "World", language: "Tagalog", hiligaynon: "Kalibutan" }
    ],
    subjectConnections: { science: "Ecology" },
    materials: ["Recyclable materials"],
    factualMediaRequirements: ["stewardship-photo"],
    activities: {
      beginnerSupport: "Sort plastic and paper.",
      coreActivity: "Create a recycling bin for your room.",
      advancedChallenge: "Invent a new use for an old plastic bottle."
    },
    interactiveGame: "Recycling Sort",
    handsOnActivity: "Upcycling craft",
    knowledgeCheck: [
      { question: "What does stewardship mean?", options: ["Taking care of the earth", "Throwing trash anywhere"], correctAnswer: "Taking care of the earth" }
    ],
    learnerReflection: "I am a steward of the earth.",
    familyChallenge: "Start a family recycling habit.",
    progressBadge: "Earth Steward",
    sourceNotes: "DENR / Biblical principles",
    mediaAttributionNotes: "Verified photo",
    accessibilityNotes: "Tactile sorting",
    teacherPreparation: "Gather clean recyclables",
    teacherAnswerKey: { "Q1": "Taking care of the earth" }
  },
  {
    id: "lesson-38-october-review",
    date: "2026-10-27",
    weekday: "Tuesday",
    title: "Reviewing Nature and Science",
    unit: "History, Heroes, Nature, and Science",
    topic: "Science and Nature",
    ageRange: "6-8",
    privacyClassification: "family-safe",
    publicationStatus: "pilot",
    learningObjectives: ["Synthesize nature and science learnings from the month"],
    essentialQuestion: "What was the most amazing thing we learned about nature?",
    factualBackground: "Review of volcanoes, weather, forests, coral reefs, and the Philippine eagle.",
    vocabulary: [
      { word: "Balik-aral", translation: "Review", language: "Tagalog", hiligaynon: "Balik-tuon" }
    ],
    subjectConnections: { science: "Review" },
    materials: ["Flashcards from past lessons"],
    factualMediaRequirements: ["mayon-volcano-photo"],
    activities: {
      beginnerSupport: "Match the animal to its home.",
      coreActivity: "Play a science trivia game.",
      advancedChallenge: "Create a quiz question for the class."
    },
    interactiveGame: "Science Trivia Challenge",
    handsOnActivity: "Review poster",
    knowledgeCheck: [
      { question: "Are coral reefs alive?", options: ["Yes", "No"], correctAnswer: "Yes" }
    ],
    learnerReflection: "I learned so much about the world.",
    familyChallenge: "Quiz your parents on what you learned.",
    progressBadge: "Science Champion",
    sourceNotes: "Curriculum",
    mediaAttributionNotes: "Reused verified photo",
    accessibilityNotes: "Auditory trivia",
    teacherPreparation: "Prepare trivia questions",
    teacherAnswerKey: { "Q1": "Yes" }
  },
  {
    id: "lesson-39-october-showcase",
    date: "2026-10-30",
    weekday: "Friday",
    title: "October Showcase",
    unit: "History, Heroes, Nature, and Science",
    topic: "Flex and Showcase",
    ageRange: "6-8",
    privacyClassification: "family-safe",
    publicationStatus: "pilot",
    learningObjectives: ["Review and showcase learning from the month"],
    essentialQuestion: "How can we share what we learned this October?",
    factualBackground: "A culmination of the history, heroes, nature, and science lessons.",
    vocabulary: [
      { word: "Pagdiriwang", translation: "Celebration", language: "Tagalog", hiligaynon: "Pagsaulog" }
    ],
    subjectConnections: { history: "Review", science: "Review" },
    materials: ["Projects from the month"],
    factualMediaRequirements: ["history-timeline-diagram"],
    activities: {
      beginnerSupport: "Show your favorite craft.",
      coreActivity: "Present one project to the family or class.",
      advancedChallenge: "Give a short speech about your favorite hero or animal."
    },
    interactiveGame: "Showcase Gallery Walk",
    handsOnActivity: "Presentation",
    knowledgeCheck: [
      { question: "What is the best way to remember what we learned?", options: ["Share it with others", "Forget it"], correctAnswer: "Share it with others" }
    ],
    learnerReflection: "I am proud of my work this month.",
    familyChallenge: "Host a mini-showcase for the family.",
    progressBadge: "October Presenter",
    sourceNotes: "Curriculum",
    mediaAttributionNotes: "Reused verified diagram",
    accessibilityNotes: "Flexible presentation options",
    teacherPreparation: "Set up showcase area",
    teacherAnswerKey: { "Q1": "Share it with others" }
  }
];
