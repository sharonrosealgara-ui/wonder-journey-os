
const fs = require("fs");
let code = fs.readFileSync("src/config/lessons-stage2.ts", "utf8");

const lesson1New = `{
    "id": "lesson-1-world-map",
    "date": "2026-08-03",
    "weekday": "Monday",
    "title": "Our Place in the World",
    "topic": "World Geography & The Philippines",
    "ageRange": "7-12",
    "unit": "Unit 1: The Philippine Archipelago",
    "learningObjectives": [
      "Locate the Philippines on a world map in relation to the equator and other continents.",
      "Understand that the Philippines is part of Southeast Asia.",
      "Identify the basic geography of the Earth, continents, and the Philippines."
    ],
    "essentialQuestion": "If you were to look at Earth from space, how would you describe where the Philippines is located?",
    "factualBackground": "The Philippines is located in Southeast Asia, in the western Pacific Ocean. It consists of about 7,641 islands.",
    "adventureHook": "Imagine you are an astronaut floating high above the Earth. You look down and see oceans, continents, and finally, a beautiful cluster of islands sparkling in the blue water. Today, we are going to zoom in from outer space to find exactly where our home, the Philippines, is on the giant map of the world!",
    "discoveries": [
      {
        "title": "The Equator",
        "description": "The Philippines is located just above the equator, giving us a warm, tropical climate."
      },
      {
        "title": "Southeast Asia",
        "description": "We are part of a vibrant region called Southeast Asia."
      },
      {
        "title": "A Chain of Islands",
        "description": "Our country is an archipelago made of about 7,641 islands!"
      }
    ],
    "richExplanation": [
      {
        "heading": "Zooming In From Space",
        "emoji": "??",
        "body": "If we were to look at our planet from space, we would see huge pieces of land called continents and massive bodies of water called oceans. The Earth is a giant sphere, and right in the middle, around its waist, is an imaginary line called the Equator. The Equator divides the Earth into the Northern and Southern Hemispheres. The Philippines is located just a little bit above this line, in the Northern Hemisphere. This means we have a tropical maritime climate. We generally experience two major seasons—wet and dry—though actual rainfall patterns vary greatly depending on where you are in the country."
      },
      {
        "heading": "The Giant Continents",
        "emoji": "???",
        "body": "As we get closer to Earth, we can see the seven large continents. The largest of them all is Asia. It is so massive that it stretches across many time zones and climates! To make it easier to study, geographers divide Asia into different regions. The Philippines belongs to a vibrant and diverse neighborhood called Southeast Asia. This region is located south of China, east of India, and north of Australia."
      },
      {
        "heading": "Our Neighborhood: Southeast Asia",
        "emoji": "??",
        "body": "Because we are in the same corner of the world as countries like Indonesia, Malaysia, Thailand, and Vietnam, we share many things with our neighbors. We experience similar weather patterns and grow similar crops like rice and coconuts. However, the Philippines is unique because it is situated on the easternmost edge of Southeast Asia, directly facing the vast Pacific Ocean. This specific location has made our islands a historic crossroads for trade and travel over many centuries."
      },
      {
        "heading": "A Preview of Our Archipelago",
        "emoji": "???",
        "body": "Unlike countries that sit on massive continental landmasses, the Philippines is an archipelago. An archipelago is a group or chain of islands clustered together in a body of water. According to official mapping authorities, the Philippine archipelago consists of about 7,641 islands! Some of these islands are large enough to hold sprawling mountain ranges and bustling cities, while others are tiny sandbars. This geography shapes everything about how we live, from our transportation to our diverse local cultures and languages."
      },
      {
        "heading": "A Restless Earth",
        "emoji": "??",
        "body": "Our location has another interesting feature: we sit along the Pacific Ring of Fire. This is a path along the edge of the Pacific Ocean known for active volcanoes and frequent earthquakes. As the Philippine Institute of Volcanology and Seismology (PHIVOLCS) explains, the Philippines is situated at the boundaries of major tectonic plates that are constantly moving and interacting. This incredible geological activity has shaped much of our dramatic landscape, creating the beautiful mountains and deep ocean trenches we see today."
      }
    ],
    "keyFacts": [
      "The Philippines is located in Southeast Asia, facing the Pacific Ocean.",
      "It is an archipelago consisting of about 7,641 islands.",
      "It is situated just above the equator, giving it a tropical maritime climate.",
      "It sits on the Pacific Ring of Fire, leading to active geology and beautiful landscapes."
    ],
    "realWorldConnection": "Next time you look at a globe or open a map app on a phone, try to find the equator first, then look for Asia, and finally spot the Philippines! Recognizing how close we are to other countries helps us understand international news, weather, and trade.",
    "crossSubjectConnections": {
      "science": "Understanding how the equator affects sunlight and climate.",
      "geography": "Reading a world map, identifying continents and oceans."
    },
    "misconceptions": [
      "Misconception: The Philippines has four seasons like America. Fact: The Philippines has a tropical maritime climate with primarily wet and dry seasons, though rainfall varies locally.",
      "Misconception: The Philippines is just one big island. Fact: It is an archipelago of about 7,641 islands."
    ],
    "vocabulary": [
      {
        "word": "Archipelago",
        "translation": "Kapuluan",
        "language": "Tagalog",
        "pronunciation": "ka-pu-lu-an",
        "contextualExample": "The Philippines is a beautiful archipelago of about 7,641 islands."
      },
      {
        "word": "Equator",
        "translation": "Ekwador",
        "language": "Tagalog",
        "pronunciation": "ek-wa-dor",
        "contextualExample": "Our country is warm because it is near the equator."
      },
      {
        "word": "Continent",
        "translation": "Kontinente",
        "language": "Tagalog",
        "pronunciation": "kon-ti-nen-te",
        "contextualExample": "Asia is the largest continent on Earth."
      }
    ],
    "mediaMoments": [
      {
        "description": "A spinning globe zooming in from space down to Southeast Asia.",
        "purpose": "Visual introduction.",
        "requiredType": "Video",
        "sourceRequirement": "Authentic map simulation.",
        "altTextGuidance": "Globe zooming to Asia"
      },
      {
        "description": "A world map highlighting the Equator in red.",
        "purpose": "Show our latitude.",
        "requiredType": "Image",
        "sourceRequirement": "Educational map.",
        "altTextGuidance": "Map showing the equator"
      },
      {
        "description": "A close-up map of the Pacific Ring of Fire highlighting the Philippines.",
        "purpose": "Show our tectonic location.",
        "requiredType": "Image",
        "sourceRequirement": "Geological map.",
        "altTextGuidance": "Map of the Ring of Fire"
      }
    ],
    "guidedDiscussion": [
      "If you could have your very own island in the archipelago, what would you name it and what would be on it?",
      "How do you think living close to the equator changes the kinds of houses people build or the clothes they wear?"
    ],
    "ageDifferentiation": {
      "explorer": "Can you draw a map of Earth and put a big star where the Philippines is? Color the oceans blue and the land green!",
      "adventure": "Write down three things that make living in a tropical archipelago different from living in a cold, landlocked country."
    },
    "handsOnTask": {
      "title": "Mapping Our Place in the World",
      "description": "Create a tiered map to understand global scale.",
      "materials": ["Paper", "Crayons or markers", "Scissors", "Glue"],
      "steps": [
        "Draw a large circle to represent the Earth.",
        "Inside the Earth, draw a smaller shape for the continent of Asia.",
        "Inside Asia, draw an even smaller shape for Southeast Asia.",
        "Finally, draw a tiny star to represent the Philippines.",
        "Label each part and explain to a family member how we zoom in from Earth to our country."
      ],
      "finishCondition": "A labeled, tiered drawing showing the progression from Earth down to the Philippines.",
      "accessibilityAlternative": "Use pre-cut concentric circles of different sizes to represent Earth, Asia, Southeast Asia, and the Philippines, and assemble them in order."
    },
    "authoritativeSources": [
      {
        "id": "source-1",
        "title": "NAMRIA Official Map",
        "url": "https://www.namria.gov.ph",
        "publisher": "National Mapping and Resource Information Authority",
        "verificationStatus": "verified",
        "verifiedDate": "2026-08-01",
        "context": "Used to verify the count of about 7,641 islands."
      },
      {
        "id": "source-2",
        "title": "PHIVOLCS Tectonic Map",
        "url": "https://www.phivolcs.dost.gov.ph",
        "publisher": "PHIVOLCS",
        "verificationStatus": "verified",
        "verifiedDate": "2026-08-01",
        "context": "Used to describe the tectonic location of the Philippines."
      }
    ],
    "curatedResources": [
      {
        "id": "res-1",
        "title": "Google Earth: The Philippines",
        "url": "https://earth.google.com",
        "type": "Interactive Map",
        "publisher": "Google",
        "description": "Explore the Philippines from a satellite view.",
        "verificationStatus": "verified",
        "verifiedDate": "2026-08-01",
        "tags": ["geography", "map"]
      },
      {
        "id": "res-2",
        "title": "National Geographic Kids: Asia",
        "url": "https://kids.nationalgeographic.com/geography/countries/article/asia",
        "type": "Article",
        "publisher": "National Geographic",
        "description": "Learn more about the vast continent of Asia.",
        "verificationStatus": "verified",
        "verifiedDate": "2026-08-01",
        "tags": ["continent", "reading"]
      }
    ],
    "premiumAssessment": [
      {
        "id": "q1",
        "type": "multiple-choice",
        "question": "Which continent is the Philippines a part of?",
        "options": ["Europe", "Africa", "Asia", "South America"],
        "correctOptionId": "Asia"
      },
      {
        "id": "q2",
        "type": "multiple-choice",
        "question": "The Philippines is located in which specific region?",
        "options": ["East Asia", "Southeast Asia", "South Asia", "Central Asia"],
        "correctOptionId": "Southeast Asia"
      },
      {
        "id": "q3",
        "type": "true-false-with-explanation",
        "question": "The Philippines is mostly made of one single large landmass.",
        "options": ["True", "False"],
        "correctOptionId": "False"
      },
      {
        "id": "q4",
        "type": "short-answer",
        "question": "What is the imaginary line around the middle of the Earth that the Philippines is near?",
        "options": [],
        "correctOptionId": "Equator"
      },
      {
        "id": "q5",
        "type": "multiple-choice",
        "question": "About how many islands make up the Philippine archipelago?",
        "options": ["Around 100", "About 7,641", "Exactly 50", "Over 100,000"],
        "correctOptionId": "About 7,641"
      }
    ],
    "suggestedPacing": "30-45 minutes.",
    "optionalExtensions": "Use a globe or interactive digital map to find other countries that sit on the equator.",
    "learnerReflection": "Think about our place on the globe. What makes you proud to live in a tropical archipelago?",
    "familyChallenge": "Find the equator on a map in your house. Then try to find three other countries that are also near the equator.",
    "teacherPreparation": "Ensure you have a globe, a large world map, or a digital map loaded on a tablet ready for the lesson. Review the concept of hemispheres and tectonic plates beforehand.",
    "teacherAnswerKey": {
      "q1": "Asia",
      "q2": "Southeast Asia",
      "q3": "False. It is an archipelago of about 7,641 islands.",
      "q4": "The Equator",
      "q5": "About 7,641"
    },
    "publicationStatus": "pilot",
    "privacyClassification": "family-safe"
  }`;

// Inject new lesson 1 into the file
code = code.replace(/\{\s*"id":\s*"lesson-1-world-map"[\s\S]*?(?=\{\s*"id":\s*"lesson-2-archipelago")/, lesson1New + ",\n  ");

fs.writeFileSync("src/config/lessons-stage2.ts", code, "utf8");
console.log("Lesson 1 updated successfully.");

