
const fs = require("fs");

const l1 = {
  id: "lesson-1-world-map",
  date: "2026-08-03",
  weekday: "Monday",
  title: "Our Place in the World",
  topic: "World Geography & The Philippines",
  ageRange: "7-12",
  unit: "Unit 1: The Philippine Archipelago",
  learningObjectives: ["Locate the Philippines on a world map relative to the equator and Asia.", "Understand the concept of an archipelago.", "Identify surrounding bodies of water."],
  essentialQuestion: "How does our location on Earth shape who we are and how we live?",
  factualBackground: "The Philippines is a tropical archipelago in Southeast Asia, comprising 7,641 islands.",
  adventureHook: "Imagine looking at the Earth from space. If you zoom in on the Pacific Ocean, right near the equator, you will spot a cluster of emerald islands scattered like jewels. That is the Philippines!",
  discoveries: [
    "The Philippines is made up of exactly 7,641 islands, updated by the National Mapping and Resource Information Authority.",
    "It sits on the Pacific Ring of Fire, which explains why we have active volcanoes and frequent earthquakes.",
    "Because we are close to the equator, we experience a tropical climate with distinct wet and dry seasons."
  ],
  richExplanation: [
    { heading: "Where in the World?", body: "If you take a globe and find the equator—the imaginary line around the middle of the Earth—you will see the Philippines sitting just above it. We are part of Southeast Asia. To our north is Taiwan and China, to our south is Indonesia, and to our east is the vast Pacific Ocean. This specific geographical location makes our country tropical, which is why we have warm weather all year round and never see snow. Our position in the world has also made us a historic crossroads for trade and cultural exchange between the East and the West for many centuries." },
    { heading: "An Archipelago of 7,641 Islands", body: "For a long time, textbooks said the Philippines had 7,107 islands. However, in 2016, the National Mapping and Resource Information Authority (NAMRIA) used advanced radar technology to map the country more accurately. They discovered hundreds of landmasses previously uncounted, bringing the official count to 7,641! Because we are an archipelago—a group of islands—water connects us rather than separates us. Boats, ferries, and outriggers are just as important as cars and buses for moving people and goods between provinces. Our ancestors were master navigators who traversed these waters with ease." },
    { heading: "Surrounded by Water", body: "Look closely at the map. To our west lies the West Philippine Sea, to our east is the Philippine Sea (which is part of the Pacific Ocean), and to our south is the Celebes Sea. This means the Philippines has one of the longest coastlines of any country in the world. Our oceans and seas are teeming with diverse marine life, making fishing one of the most vital industries. These bodies of water also provide beautiful beaches that attract tourists from all over the globe, but they also mean we are exposed to typhoons that form in the Pacific Ocean." },
    { heading: "The Ring of Fire", body: "Our location is not just about the water surrounding us; it is also about what lies underneath the surface. The Philippines sits right on the Pacific Ring of Fire. This is a massive horseshoe-shaped area around the Pacific basin where tectonic plates constantly shift, collide, and slide past one another. Because of this intense geological activity, our country has many volcanoes and experiences frequent earthquakes. While this might sound scary, these volcanic eruptions over millions of years actually created the incredibly fertile soil that allows us to grow delicious mangoes, rice, and coconuts!" }
  ],
  keyFacts: [
    "The Philippines is in Southeast Asia.",
    "It is an archipelago consisting of 7,641 islands.",
    "It sits on the Pacific Ring of Fire.",
    "It is surrounded by the Philippine Sea, West Philippine Sea, and Celebes Sea."
  ],
  realWorldConnection: "If you want to visit your grandparents in a different province, you might not be able to just drive. You might need to take a ferry or an airplane because of the ocean between our islands!",
  vocabulary: [
    { word: "Archipelago", translation: "Kapuluan", language: "Tagalog", pronunciation: "kah-poo-loo-ahn", contextualExample: "The Philippines is considered an archipelago because it is made of many islands grouped together." },
    { word: "Equator", translation: "Ekwador", language: "Tagalog", pronunciation: "eh-kwah-dor", contextualExample: "Countries located near the equator usually have very warm climates." },
    { word: "Island", translation: "Isla", language: "Tagalog", pronunciation: "ees-lah", contextualExample: "We live on a beautiful tropical island surrounded by blue water." }
  ],
  mediaMoments: [
    { description: "World map highlighting the Philippines in Southeast Asia.", purpose: "To show global context.", requiredType: "Image", sourceRequirement: "Must clearly show equator and Asian continent.", altTextRequirement: true },
    { description: "Graphic showing how radar mapping finds new islands.", purpose: "Explain the jump from 7,107 to 7,641 islands.", requiredType: "Diagram", sourceRequirement: "Scientific radar representation.", altTextRequirement: true },
    { description: "Map of the Pacific Ring of Fire.", purpose: "Explain tectonic activity.", requiredType: "Image", sourceRequirement: "Must show the Pacific horseshoe shape intersecting the Philippines.", altTextRequirement: true }
  ],
  guidedDiscussion: [
    "Why do you think an archipelago makes it harder to build roads connecting the whole country?",
    "If you lived on a very small island, how would your daily life be different than living in a big city?"
  ],
  ageDifferentiation: {
    explorer: "Draw a map of the Philippines and color the water blue and the islands green.",
    adventure: "Write down the names of three bodies of water surrounding the Philippines.",
    trailblazer: "Explain in a short paragraph why the number of islands changed from 7,107 to 7,641."
  },
  game: {
    title: "Island Hopper Relay",
    objective: "To jump from island to island without touching the ocean.",
    setup: "Place small mats or pillows on the floor to represent islands.",
    materials: ["Mats or pillows", "Open floor space"],
    rules: "Players must jump from one mat to the next. If a player touches the floor representing the ocean, they must start over. First one across the archipelago wins.",
    winCondition: "All players successfully navigate the islands.",
    adaptation: "Players with limited mobility can toss beanbags onto the islands instead of jumping."
  },
  handsOnTask: {
    title: "Playdough Archipelago",
    materials: ["Playdough or clay", "A blue piece of paper or tray"],
    setup: "Clear a workspace and lay out the blue paper.",
    steps: [
      "1. Roll the playdough into several small balls.",
      "2. Press them onto the blue paper to create a group of islands.",
      "3. Try to make three main clusters (representing Luzon, Visayas, and Mindanao)."
    ],
    finishCondition: "You have a complete mini-archipelago on your desk.",
    alternative: "If playdough is unavailable, draw the islands or tear pieces of green paper and glue them onto the blue background.",
    safetyNotes: "Do not eat the playdough."
  },
  crossSubjectConnections: ["Geography", "Earth Science"],
  characterConnection: "Just like the islands are separated by water but connected underneath the ocean floor, we may be different but we are all connected as God's creation.",
  misconceptions: [
    "Myth: The Philippines has 7,107 islands. Fact: It has 7,641 according to the latest NAMRIA mapping.",
    "Myth: It snows in the Philippines in December. Fact: The Philippines is tropical and never gets snow."
  ],
  premiumAssessment: [
    { type: "multiple-choice", question: "How many islands make up the Philippines today?", options: ["7,107", "7,641", "8,000", "50"], correctAnswer: "7,641" },
    { type: "true-false-with-explanation", question: "The Philippines is located in the Atlantic Ocean.", correctAnswer: "False", explanation: "It is located in the Pacific Ocean." },
    { type: "short-answer", question: "What is the name of the area with many volcanoes where the Philippines is located?", expectedAnswerKeywords: ["Ring", "Fire"] },
    { type: "multiple-choice", question: "Which direction is the equator from the Philippines?", options: ["North", "South", "East", "West"], correctAnswer: "South" },
    { type: "matching", pairs: [{ left: "Archipelago", right: "Group of islands" }, { left: "Equator", right: "Middle line of Earth" }] },
    { type: "multiple-choice", question: "Which ocean is east of the Philippines?", options: ["Atlantic", "Indian", "Pacific", "Arctic"], correctAnswer: "Pacific" }
  ],
  learnerReflection: "What is your favorite thing about living in or learning about an archipelago?",
  familyChallenge: "Look at a world map or globe together as a family and find the Philippines. Discuss what countries are nearby.",
  curatedResources: [
    { id: "namria-map", title: "NAMRIA Official Map Updates", type: "Website", url: "https://www.namria.gov.ph/", visibility: "teacher", whyUseful: "Official source for the 7,641 island count.", verificationStatus: "verified", provider: "NAMRIA" },
    { id: "ring-of-fire-natgeo", title: "Ring of Fire Explanation", type: "Article", url: "https://education.nationalgeographic.org/resource/ring-fire/", visibility: "both", whyUseful: "Great kid-friendly explanation of tectonic plates.", verificationStatus: "verified", provider: "National Geographic" }
  ],
  authoritativeSources: [
    { source: "NAMRIA", url: "https://www.namria.gov.ph/", note: "Official mapping authority of the Philippines confirming 7,641 islands in 2016." },
    { source: "USGS Earthquakes", url: "https://earthquake.usgs.gov/", note: "Details on the Pacific Ring of Fire." }
  ],
  teacherAnswerKey: { "Q1": "7,641", "Q2": "False", "Q3": "Ring of Fire", "Q4": "South", "Q5": "Equator", "Q6": "Pacific" },
  subjectConnections: { geography: "World Map placement", science: "Tectonic plates and Ring of Fire" },
  materials: ["World map or globe", "Playdough"],
  factualMediaRequirements: [],
  activities: { beginnerSupport: "Point to map", coreActivity: "Make islands", advancedChallenge: "Explain ring of fire" },
  interactiveGame: "Island Hopper Relay",
  handsOnActivity: "Playdough Archipelago",
  progressBadge: "badge-map",
  sourceNotes: "NAMRIA 2016",
  mediaAttributionNotes: "Public Domain",
  accessibilityNotes: "See hands on task",
  privacyClassification: "family-safe",
  publicationStatus: "pilot",
  teacherPreparation: "Print out world maps and prepare the playdough."
};

fs.writeFileSync("dist-temp/l1.json", JSON.stringify(l1));
console.log("Written l1");

