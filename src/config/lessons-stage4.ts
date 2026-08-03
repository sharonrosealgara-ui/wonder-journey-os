import { CurriculumLesson } from "@/lib/curriculum-schema";

export const stage4Lessons: CurriculumLesson[] = [
  {
    id: "lesson-14-greetings",
    date: "2026-09-01",
    weekday: "Tuesday",
    title: "Kumusta? Greetings and Introductions",
    unit: "Language, Family, and Daily Life",
    topic: "Language and Culture",
    ageRange: "6-8",
    privacyClassification: "family-safe",
    publicationStatus: "pilot",
    learningObjectives: ["Say hello and ask how someone is"],
    essentialQuestion: "How do we greet our friends?",
    factualBackground: "Kumusta is derived from the Spanish 'como esta' and is the standard greeting.",
    vocabulary: [
      { word: "Kumusta", translation: "How are you?", language: "Tagalog", hiligaynon: "Kamusta" },
      { word: "Magandang umaga", translation: "Good morning", language: "Tagalog", hiligaynon: "Maayong aga" }
    ],
    subjectConnections: { language: "Greetings" },
    materials: ["Greeting cards"],
    factualMediaRequirements: ["kumusta-diagram"],
    activities: {
      beginnerSupport: "Say Kumusta.",
      coreActivity: "Practice greeting classmates with Kumusta.",
      advancedChallenge: "Roleplay a morning greeting."
    },
    interactiveGame: "Greeting Match",
    handsOnActivity: "Make a Kumusta card",
    knowledgeCheck: [
      { question: "What does Kumusta mean?", options: ["How are you?", "Goodbye"], correctAnswer: "How are you?" }
    ],
    learnerReflection: "I can greet my friends.",
    familyChallenge: "Greet everyone with Magandang umaga tomorrow.",
    progressBadge: "Friendly Greeter",
    sourceNotes: "KWF standard",
    mediaAttributionNotes: "Verified diagram",
    accessibilityNotes: "Clear audio needed",
    teacherPreparation: "Prepare greeting cards",
    teacherAnswerKey: { "Q1": "How are you?" }
  },
  {
    id: "lesson-15-respectful-gestures",
    date: "2026-09-04",
    weekday: "Friday",
    title: "Po, Opo, and Mano Po",
    unit: "Language, Family, and Daily Life",
    topic: "Language and Culture",
    ageRange: "6-8",
    privacyClassification: "family-safe",
    publicationStatus: "pilot",
    learningObjectives: ["Use respectful words and gestures"],
    essentialQuestion: "How do we show respect to elders?",
    factualBackground: "Po and opo are used to show respect, and Mano po is a traditional gesture.",
    vocabulary: [
      { word: "Opo", translation: "Yes (respectful)", language: "Tagalog", hiligaynon: "Huo (respect via tone)" }
    ],
    subjectConnections: { culture: "Respect" },
    materials: ["None"],
    factualMediaRequirements: ["mano-po-photo"],
    activities: {
      beginnerSupport: "Say Opo.",
      coreActivity: "Practice Mano po.",
      advancedChallenge: "Explain when to use po."
    },
    interactiveGame: "Respect Sort",
    handsOnActivity: "Roleplay with elders",
    knowledgeCheck: [
      { question: "Which word shows respect?", options: ["Po", "Oo"], correctAnswer: "Po" }
    ],
    learnerReflection: "I show respect to my elders.",
    familyChallenge: "Practice Mano po with grandparents.",
    progressBadge: "Respectful Learner",
    sourceNotes: "KWF standard",
    mediaAttributionNotes: "Verified photo",
    accessibilityNotes: "Physical gesture adaptation",
    teacherPreparation: "Review gestures",
    teacherAnswerKey: { "Q1": "Po" }
  },
  {
    id: "lesson-16-family",
    date: "2026-09-07",
    weekday: "Monday",
    title: "Family Vocabulary",
    unit: "Language, Family, and Daily Life",
    topic: "Language and Culture",
    ageRange: "6-8",
    privacyClassification: "family-safe",
    publicationStatus: "pilot",
    learningObjectives: ["Identify family members in Tagalog"],
    essentialQuestion: "Who makes up our family?",
    factualBackground: "Family (Pamilya) is central to Filipino culture.",
    vocabulary: [
      { word: "Tatay", translation: "Father", language: "Tagalog", hiligaynon: "Tatay" },
      { word: "Nanay", translation: "Mother", language: "Tagalog", hiligaynon: "Nanay" }
    ],
    subjectConnections: { language: "Family" },
    materials: ["Family photos"],
    factualMediaRequirements: ["filipino-family-photo"],
    activities: {
      beginnerSupport: "Point to Nanay.",
      coreActivity: "Draw your family and label them.",
      advancedChallenge: "Introduce your family in Tagalog."
    },
    interactiveGame: "Family Tree Match",
    handsOnActivity: "Make a family tree",
    knowledgeCheck: [
      { question: "What is the Tagalog word for mother?", options: ["Nanay", "Ate"], correctAnswer: "Nanay" }
    ],
    learnerReflection: "I love my family.",
    familyChallenge: "Show your family tree to your parents.",
    progressBadge: "Family Expert",
    sourceNotes: "KWF",
    mediaAttributionNotes: "Verified photo",
    accessibilityNotes: "None",
    teacherPreparation: "Gather sample photos",
    teacherAnswerKey: { "Q1": "Nanay" }
  },
  {
    id: "lesson-17-body-parts",
    date: "2026-09-08",
    weekday: "Tuesday",
    title: "Parts of the Body",
    unit: "Language, Family, and Daily Life",
    topic: "Language and Culture",
    ageRange: "6-8",
    privacyClassification: "family-safe",
    publicationStatus: "pilot",
    learningObjectives: ["Learn body parts in Tagalog"],
    essentialQuestion: "What are the parts of our body?",
    factualBackground: "Ulo (head), balikat (shoulders), tuhod (knees), and paa (toes).",
    vocabulary: [
      { word: "Ulo", translation: "Head", language: "Tagalog", hiligaynon: "Ulo" },
      { word: "Paa", translation: "Foot", language: "Tagalog", hiligaynon: "Tiil" }
    ],
    subjectConnections: { language: "Body Parts" },
    materials: ["Body chart"],
    factualMediaRequirements: ["body-parts-diagram"],
    activities: {
      beginnerSupport: "Point to your Ulo.",
      coreActivity: "Sing Ulo, Balikat, Tuhod, at Paa.",
      advancedChallenge: "Label a body diagram."
    },
    interactiveGame: "Simon Says",
    handsOnActivity: "Sing and dance",
    knowledgeCheck: [
      { question: "What is 'Ulo'?", options: ["Head", "Foot"], correctAnswer: "Head" }
    ],
    learnerReflection: "I can name my body parts.",
    familyChallenge: "Teach the song to your family.",
    progressBadge: "Body Parts Guide",
    sourceNotes: "KWF",
    mediaAttributionNotes: "Verified diagram",
    accessibilityNotes: "Adapted movement",
    teacherPreparation: "Prepare song",
    teacherAnswerKey: { "Q1": "Head" }
  },
  {
    id: "lesson-18-food",
    date: "2026-09-11",
    weekday: "Friday",
    title: "Food Vocabulary and Kain Tayo",
    unit: "Language, Family, and Daily Life",
    topic: "Language and Culture",
    ageRange: "6-8",
    privacyClassification: "family-safe",
    publicationStatus: "pilot",
    learningObjectives: ["Learn words for food and eating"],
    essentialQuestion: "What do we say when it's time to eat?",
    factualBackground: "Kain tayo means 'Let's eat', a common invitation.",
    vocabulary: [
      { word: "Kain tayo", translation: "Let's eat", language: "Tagalog", hiligaynon: "Kaon ta" },
      { word: "Pagkain", translation: "Food", language: "Tagalog", hiligaynon: "Pagkaon" }
    ],
    subjectConnections: { language: "Food" },
    materials: ["Food photos"],
    factualMediaRequirements: ["filipino-meal-photo"],
    activities: {
      beginnerSupport: "Say Kain tayo.",
      coreActivity: "Roleplay setting the table and inviting others.",
      advancedChallenge: "List 3 favorite foods in Tagalog."
    },
    interactiveGame: "Food Match",
    handsOnActivity: "Play restaurant",
    knowledgeCheck: [
      { question: "What does 'Kain tayo' mean?", options: ["Let's eat", "Let's sleep"], correctAnswer: "Let's eat" }
    ],
    learnerReflection: "I know how to invite someone to eat.",
    familyChallenge: "Say Kain tayo at dinner.",
    progressBadge: "Food Friend",
    sourceNotes: "KWF",
    mediaAttributionNotes: "Verified photo",
    accessibilityNotes: "Allergy notes",
    teacherPreparation: "Prepare food cards",
    teacherAnswerKey: { "Q1": "Let's eat" }
  },
  {
    id: "lesson-19-emotions",
    date: "2026-09-14",
    weekday: "Monday",
    title: "Feelings and Masaya Ako",
    unit: "Language, Family, and Daily Life",
    topic: "Language and Culture",
    ageRange: "6-8",
    privacyClassification: "family-safe",
    publicationStatus: "pilot",
    learningObjectives: ["Express feelings in Tagalog"],
    essentialQuestion: "How do we say how we feel?",
    factualBackground: "Masaya (happy) and Malungkot (sad) are basic emotion words.",
    vocabulary: [
      { word: "Masaya", translation: "Happy", language: "Tagalog", hiligaynon: "Malipayon" },
      { word: "Malungkot", translation: "Sad", language: "Tagalog", hiligaynon: "Masubo" }
    ],
    subjectConnections: { language: "Emotions" },
    materials: ["Emotion cards"],
    factualMediaRequirements: ["emotions-diagram"],
    activities: {
      beginnerSupport: "Make a happy face.",
      coreActivity: "Match emotion words to faces.",
      advancedChallenge: "Write a sentence: Masaya ako dahil..."
    },
    interactiveGame: "Emotion Charades",
    handsOnActivity: "Draw how you feel",
    knowledgeCheck: [
      { question: "What does 'Masaya' mean?", options: ["Happy", "Sad"], correctAnswer: "Happy" }
    ],
    learnerReflection: "I can share my feelings.",
    familyChallenge: "Tell your family how you feel today.",
    progressBadge: "Emotion Explorer",
    sourceNotes: "KWF",
    mediaAttributionNotes: "Verified diagram",
    accessibilityNotes: "Visual emotion support",
    teacherPreparation: "Prepare emotion cards",
    teacherAnswerKey: { "Q1": "Happy" }
  },
  {
    id: "lesson-20-homes",
    date: "2026-09-15",
    weekday: "Tuesday",
    title: "Filipino Homes",
    unit: "Language, Family, and Daily Life",
    topic: "Language and Culture",
    ageRange: "6-8",
    privacyClassification: "family-safe",
    publicationStatus: "pilot",
    learningObjectives: ["Describe different types of Filipino homes"],
    essentialQuestion: "Where do Filipino families live?",
    factualBackground: "Homes range from traditional bahay kubo to modern city apartments.",
    vocabulary: [
      { word: "Bahay", translation: "House", language: "Tagalog", hiligaynon: "Balay" }
    ],
    subjectConnections: { culture: "Homes" },
    materials: ["Photos of homes"],
    factualMediaRequirements: ["bahay-kubo-photo"],
    activities: {
      beginnerSupport: "Say Bahay.",
      coreActivity: "Compare a bahay kubo to a modern house.",
      advancedChallenge: "Build a model house."
    },
    interactiveGame: "Home Sort",
    handsOnActivity: "Build a bahay kubo with sticks",
    knowledgeCheck: [
      { question: "What is the Tagalog word for house?", options: ["Bahay", "Araw"], correctAnswer: "Bahay" }
    ],
    learnerReflection: "There are many types of homes.",
    familyChallenge: "Draw your own house.",
    progressBadge: "Home Builder",
    sourceNotes: "Cultural standard",
    mediaAttributionNotes: "Verified photo",
    accessibilityNotes: "Tactile building",
    teacherPreparation: "Gather craft sticks",
    teacherAnswerKey: { "Q1": "Bahay" }
  },
  {
    id: "lesson-21-schools",
    date: "2026-09-18",
    weekday: "Friday",
    title: "Schools and Classroom Life",
    unit: "Language, Family, and Daily Life",
    topic: "Language and Culture",
    ageRange: "6-8",
    privacyClassification: "family-safe",
    publicationStatus: "pilot",
    learningObjectives: ["Learn vocabulary for school"],
    essentialQuestion: "What is school like in the Philippines?",
    factualBackground: "Paaralan is the word for school.",
    vocabulary: [
      { word: "Paaralan", translation: "School", language: "Tagalog", hiligaynon: "Eskwelahan" },
      { word: "Guro", translation: "Teacher", language: "Tagalog", hiligaynon: "Maestra/Maestro" }
    ],
    subjectConnections: { culture: "School" },
    materials: ["Classroom photos"],
    factualMediaRequirements: ["philippine-school-photo"],
    activities: {
      beginnerSupport: "Point to the Guro.",
      coreActivity: "Roleplay a classroom greeting.",
      advancedChallenge: "Write a thank you note to a teacher."
    },
    interactiveGame: "School Bingo",
    handsOnActivity: "Play school",
    knowledgeCheck: [
      { question: "What is a 'Guro'?", options: ["Teacher", "Student"], correctAnswer: "Teacher" }
    ],
    learnerReflection: "I respect my teachers.",
    familyChallenge: "Tell your family what you learned.",
    progressBadge: "Star Student",
    sourceNotes: "DepEd",
    mediaAttributionNotes: "Verified photo",
    accessibilityNotes: "None",
    teacherPreparation: "Prepare props",
    teacherAnswerKey: { "Q1": "Teacher" }
  },
  {
    id: "lesson-22-markets",
    date: "2026-09-21",
    weekday: "Monday",
    title: "Going to the Market",
    unit: "Language, Family, and Daily Life",
    topic: "Language and Culture",
    ageRange: "6-8",
    privacyClassification: "family-safe",
    publicationStatus: "pilot",
    learningObjectives: ["Learn market vocabulary"],
    essentialQuestion: "What do we find in a palengke?",
    factualBackground: "A palengke is a traditional public market.",
    vocabulary: [
      { word: "Palengke", translation: "Market", language: "Tagalog", hiligaynon: "Tienda / Merkado" }
    ],
    subjectConnections: { culture: "Markets" },
    materials: ["Market items (fruit, veg)"],
    factualMediaRequirements: ["palengke-photo"],
    activities: {
      beginnerSupport: "Pretend to buy an apple.",
      coreActivity: "Set up a pretend palengke and buy items.",
      advancedChallenge: "Use Tagalog numbers to buy items."
    },
    interactiveGame: "Market Shopping Cart",
    handsOnActivity: "Palengke roleplay",
    knowledgeCheck: [
      { question: "What is a traditional market called?", options: ["Palengke", "Bahay"], correctAnswer: "Palengke" }
    ],
    learnerReflection: "Shopping at the palengke is fun.",
    familyChallenge: "Help with grocery shopping.",
    progressBadge: "Smart Shopper",
    sourceNotes: "Cultural standard",
    mediaAttributionNotes: "Verified photo",
    accessibilityNotes: "Sensory items",
    teacherPreparation: "Prepare play money",
    teacherAnswerKey: { "Q1": "Palengke" }
  },
  {
    id: "lesson-23-transportation",
    date: "2026-09-22",
    weekday: "Tuesday",
    title: "Jeepneys and Transportation",
    unit: "Language, Family, and Daily Life",
    topic: "Language and Culture",
    ageRange: "6-8",
    privacyClassification: "family-safe",
    publicationStatus: "pilot",
    learningObjectives: ["Identify the jeepney and other transport"],
    essentialQuestion: "How do people travel in the Philippines?",
    factualBackground: "Jeepneys are a popular and iconic form of public transport.",
    vocabulary: [
      { word: "Jeepney", translation: "Jeepney", language: "Tagalog", hiligaynon: "Jeep" },
      { word: "Tricycle", translation: "Tricycle", language: "Tagalog", hiligaynon: "Traysikel" }
    ],
    subjectConnections: { culture: "Transportation" },
    materials: ["Transport photos"],
    factualMediaRequirements: ["jeepney-photo"],
    activities: {
      beginnerSupport: "Make car sounds.",
      coreActivity: "Design your own jeepney on paper.",
      advancedChallenge: "Explain why jeepneys are unique."
    },
    interactiveGame: "Transport Sort",
    handsOnActivity: "Jeepney craft",
    knowledgeCheck: [
      { question: "What is a famous colorful transport in the Philippines?", options: ["Jeepney", "Train"], correctAnswer: "Jeepney" }
    ],
    learnerReflection: "Jeepneys are colorful.",
    familyChallenge: "Watch a video of a jeepney ride.",
    progressBadge: "Jeepney Driver",
    sourceNotes: "LTFRB",
    mediaAttributionNotes: "Verified photo",
    accessibilityNotes: "None",
    teacherPreparation: "Print craft templates",
    teacherAnswerKey: { "Q1": "Jeepney" }
  },
  {
    id: "lesson-24-carabao",
    date: "2026-09-25",
    weekday: "Friday",
    title: "The Carabao and Farming Life",
    unit: "Language, Family, and Daily Life",
    topic: "Language and Culture",
    ageRange: "6-8",
    privacyClassification: "family-safe",
    publicationStatus: "pilot",
    learningObjectives: ["Learn about the carabao's role"],
    essentialQuestion: "Why is the carabao important?",
    factualBackground: "The carabao is the national working animal, vital for farming.",
    vocabulary: [
      { word: "Kalabaw", translation: "Carabao", language: "Tagalog", hiligaynon: "Karabaw" }
    ],
    subjectConnections: { science: "Animals" },
    materials: ["Carabao photo"],
    factualMediaRequirements: ["carabao-photo"],
    activities: {
      beginnerSupport: "Say Kalabaw.",
      coreActivity: "Act like a strong working carabao.",
      advancedChallenge: "Write about how carabaos help farmers."
    },
    interactiveGame: "Farm Animal Match",
    handsOnActivity: "Make a carabao mask",
    knowledgeCheck: [
      { question: "What is the national working animal?", options: ["Carabao", "Dog"], correctAnswer: "Carabao" }
    ],
    learnerReflection: "The carabao works hard.",
    familyChallenge: "Appreciate farmers at dinner.",
    progressBadge: "Farm Helper",
    sourceNotes: "DA",
    mediaAttributionNotes: "Verified photo",
    accessibilityNotes: "Adapted movement",
    teacherPreparation: "Prepare mask templates",
    teacherAnswerKey: { "Q1": "Carabao" }
  },
  {
    id: "lesson-25-community-helpers",
    date: "2026-09-28",
    weekday: "Monday",
    title: "Community Helpers",
    unit: "Language, Family, and Daily Life",
    topic: "Language and Culture",
    ageRange: "6-8",
    privacyClassification: "family-safe",
    publicationStatus: "pilot",
    learningObjectives: ["Identify roles in the community"],
    essentialQuestion: "Who helps us in our community?",
    factualBackground: "Pulis (police), Bumbero (firefighter), Doktor (doctor) help the community.",
    vocabulary: [
      { word: "Doktor", translation: "Doctor", language: "Tagalog", hiligaynon: "Doktor" },
      { word: "Pulis", translation: "Police", language: "Tagalog", hiligaynon: "Pulis" }
    ],
    subjectConnections: { culture: "Community" },
    materials: ["Helper hats"],
    factualMediaRequirements: ["community-helpers-diagram"],
    activities: {
      beginnerSupport: "Wear a helper hat.",
      coreActivity: "Roleplay different community helpers.",
      advancedChallenge: "Interview a helper."
    },
    interactiveGame: "Helper Match",
    handsOnActivity: "Dress up",
    knowledgeCheck: [
      { question: "What is the Tagalog word for Doctor?", options: ["Doktor", "Guro"], correctAnswer: "Doktor" }
    ],
    learnerReflection: "Helpers are important.",
    familyChallenge: "Thank a community helper.",
    progressBadge: "Community Friend",
    sourceNotes: "General Knowledge",
    mediaAttributionNotes: "Verified diagram",
    accessibilityNotes: "None",
    teacherPreparation: "Prepare hats",
    teacherAnswerKey: { "Q1": "Doktor" }
  },
  {
    id: "lesson-26-september-review",
    date: "2026-09-29",
    weekday: "Tuesday",
    title: "Language and Daily Life Review",
    unit: "Language, Family, and Daily Life",
    topic: "Language and Culture",
    ageRange: "6-8",
    privacyClassification: "family-safe",
    publicationStatus: "pilot",
    learningObjectives: ["Review September vocabulary"],
    essentialQuestion: "What was your favorite new word?",
    factualBackground: "Review of family, school, market, and transportation terms.",
    vocabulary: [
      { word: "Salamat", translation: "Thank you", language: "Tagalog", hiligaynon: "Salamat" }
    ],
    subjectConnections: { language: "Review" },
    materials: ["All September projects"],
    factualMediaRequirements: ["kumusta-diagram"],
    activities: {
      beginnerSupport: "Say Salamat.",
      coreActivity: "Present one project from the month.",
      advancedChallenge: "Write a short story using 3 Tagalog words."
    },
    interactiveGame: "September Quiz Show",
    handsOnActivity: "Showcase prep",
    knowledgeCheck: [
      { question: "Are you ready for October?", options: ["Yes!", "Oo!"], correctAnswer: "Yes!" }
    ],
    learnerReflection: "I learned so many new words.",
    familyChallenge: "Host a vocabulary game night.",
    progressBadge: "September Champion",
    sourceNotes: "Curriculum",
    mediaAttributionNotes: "Reused diagram",
    accessibilityNotes: "Flexible showcase",
    teacherPreparation: "Setup showcase area",
    teacherAnswerKey: { "Q1": "Yes!" }
  }
];
