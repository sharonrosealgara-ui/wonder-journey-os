// ─────────────────────────────────────────────────────────────
// LESSON LIBRARY — add new lessons here; pages render them automatically.
// ─────────────────────────────────────────────────────────────

export type LessonSection = {
  heading: string;
  emoji: string;
  body: string;
  bullets?: string[];
};

export type PhrasePair = {
  english: string;
  tagalog: string;
  hiligaynon: string;
  pronunciation?: string;
};

export type Lesson = {
  id: string;
  order: number;
  title: string;
  subtitle: string;
  emoji: string;
  category: "Philippines" | "Language" | "Values" | "Cooking";
  destinationId?: string; // passport stamp earned on completion
  recipeId?: string; // linked recipe for cooking lessons
  date: string; // ISO date of the scheduled class
  time: string;
  materials: string[];
  canvaLink: string;
  videoLinks: { label: string; url: string }[];
  familyChallenge: string;
  notes: string;
  sections: LessonSection[];
  phrases?: PhrasePair[];
  reflection: string;
  gratitudePrompt: string;
};

export const lessons: Lesson[] = [
  {
    id: "welcome-to-the-philippines",
    order: 1,
    title: "Welcome to the Philippines",
    subtitle: "Meet a nation of 7,000+ beautiful islands",
    emoji: "🇵🇭",
    category: "Philippines",
    destinationId: "philippines",
    date: "2026-07-13",
    time: "9:00 AM",
    materials: ["World map or globe (optional)", "Crayons or markers", "Paper for island drawing"],
    canvaLink: "https://www.canva.com/", // paste your presentation link here
    videoLinks: [
      { label: "Philippines from Above (search on YouTube)", url: "https://www.youtube.com/results?search_query=philippines+from+above+4k" },
    ],
    familyChallenge: "Draw your own imaginary Philippine island together. What animals live there? What food grows there? Give it a name!",
    notes: "Keep the pace gentle for the first class — the goal is wonder, not memorizing.",
    sections: [
      {
        heading: "A Country of Islands",
        emoji: "🏝️",
        body: "The Philippines is made of more than 7,000 islands in the warm Pacific Ocean! Some islands are big with cities and mountains. Some are so tiny that no one lives there — just birds, crabs, and coconut trees.",
        bullets: [
          "7,641 islands (only about 2,000 have people living on them!)",
          "Warm and tropical all year long",
          "Surrounded by some of the most beautiful beaches in the world",
        ],
      },
      {
        heading: "Three Big Island Groups",
        emoji: "🗺️",
        body: "The islands are grouped into three main regions. Think of them like three big neighborhoods of one happy country.",
        bullets: [
          "LUZON (north) — home of the capital city Manila and the famous Banaue Rice Terraces",
          "VISAYAS (middle) — islands of beaches and festivals, including Iloilo and Bago City where Teacher Sharon is from!",
          "MINDANAO (south) — land of mountains, fruit farms, and the tallest peak, Mt. Apo",
        ],
      },
      {
        heading: "The Philippine Flag",
        emoji: "🚩",
        body: "The flag has a white triangle with a golden sun and three stars. The sun's eight rays stand for the first eight provinces that fought for freedom. The three stars stand for Luzon, Visayas, and Mindanao — the three island groups you just learned!",
        bullets: [
          "Blue stripe — peace and justice",
          "Red stripe — courage",
          "White triangle — equality and hope",
          "Golden sun and 3 stars — freedom and the 3 island groups",
        ],
      },
      {
        heading: "Your First Filipino Words",
        emoji: "💬",
        body: "Let's learn to say hello! In the Philippines people greet each other with a warm smile — try these greetings out loud together.",
      },
    ],
    phrases: [
      { english: "Hello! (How are you?)", tagalog: "Kumusta!", hiligaynon: "Kamusta!", pronunciation: "koo-MOOS-tah" },
      { english: "Good morning", tagalog: "Magandang umaga", hiligaynon: "Maayong aga", pronunciation: "mah-gahn-DAHNG oo-MAH-gah / mah-AH-yong AH-gah" },
      { english: "Thank you", tagalog: "Salamat", hiligaynon: "Salamat", pronunciation: "sah-LAH-maht" },
    ],
    reflection: "If you could visit one island in the Philippines, what would you hope to see there?",
    gratitudePrompt: "Today I am grateful to the Lord for the beautiful world He made, especially...",
  },
  {
    id: "tagalog-hiligaynon-greetings",
    order: 2,
    title: "Tagalog & Hiligaynon Greetings",
    subtitle: "Learn to greet like a Filipino friend",
    emoji: "👋",
    category: "Language",
    destinationId: "manila",
    date: "2026-07-15",
    time: "9:00 AM",
    materials: ["Flashcards (or paper to make them)", "A mirror for pronunciation practice (fun!)"],
    canvaLink: "https://www.canva.com/",
    videoLinks: [
      { label: "Basic Tagalog Greetings (search on YouTube)", url: "https://www.youtube.com/results?search_query=basic+tagalog+greetings+for+kids" },
    ],
    familyChallenge: "Greet each family member in Tagalog or Hiligaynon every morning this week. Whoever remembers the most greetings by Friday wins a high-five parade!",
    notes: "Practice the matching game on the Languages page before class.",
    sections: [
      {
        heading: "Two Beautiful Languages",
        emoji: "🗣️",
        body: "The Philippines has over 170 languages! Today we learn greetings in two of them: Tagalog (spoken in and around Manila and understood everywhere) and Hiligaynon (spoken in Western Visayas — Iloilo and Negros, Teacher Sharon's home region).",
      },
      {
        heading: "Speaking Practice",
        emoji: "🎤",
        body: "Say each phrase three times: once slowly, once normally, and once with a big smile. Filipinos say greetings with lots of warmth — the smile is part of the word!",
      },
      {
        heading: "Play the Matching Game",
        emoji: "🎮",
        body: "Head to the Languages page and play the matching game to test your memory. Then try the flashcards with a partner!",
      },
    ],
    phrases: [
      { english: "Hello", tagalog: "Kumusta", hiligaynon: "Kamusta", pronunciation: "koo-MOOS-tah" },
      { english: "Good morning", tagalog: "Magandang umaga", hiligaynon: "Maayong aga", pronunciation: "mah-gahn-DAHNG oo-MAH-gah" },
      { english: "Thank you", tagalog: "Salamat", hiligaynon: "Salamat", pronunciation: "sah-LAH-maht" },
      { english: "How are you?", tagalog: "Kumusta ka?", hiligaynon: "Kamusta ka?", pronunciation: "koo-MOOS-tah kah" },
      { english: "I am happy", tagalog: "Masaya ako", hiligaynon: "Malipayon ako", pronunciation: "mah-sah-YAH ah-KOH / mah-lee-PAH-yon ah-KOH" },
      { english: "Goodbye", tagalog: "Paalam", hiligaynon: "Asta sa liwat", pronunciation: "pah-AH-lahm / AHS-tah sah LEE-waht" },
    ],
    reflection: "Which greeting was your favorite to say, and who will you greet with it first?",
    gratitudePrompt: "One blessing I noticed today is...",
  },
  {
    id: "filipino-family-values",
    order: 3,
    title: "Filipino Family Values",
    subtitle: "Respect, hospitality, and the spirit of bayanihan",
    emoji: "❤️",
    category: "Values",
    destinationId: "iloilo",
    date: "2026-07-17",
    time: "9:00 AM",
    materials: ["Paper and pencils for the kindness challenge chart"],
    canvaLink: "https://www.canva.com/",
    videoLinks: [
      { label: "Bayanihan: Moving a House Together (search on YouTube)", url: "https://www.youtube.com/results?search_query=bayanihan+filipino+tradition" },
    ],
    familyChallenge: "Kindness Challenge: each family member secretly does one kind thing for another family member every day this week. On Friday, guess who your secret kindness helper was!",
    notes: "Storytelling works best here — share a real story of hospitality from the Philippines.",
    sections: [
      {
        heading: "Po and Opo — Words of Respect",
        emoji: "🙇",
        body: "Filipino children show respect for parents and elders with special words: 'po' and 'opo'. Saying 'Opo' instead of just 'yes' to a grandparent is like giving them a little bow with your words. Children also do 'mano po' — gently pressing an elder's hand to their forehead to receive a blessing.",
      },
      {
        heading: "Hospitality — Everyone Is Welcome",
        emoji: "🏠",
        body: "In a Filipino home, a visitor is always offered food — even if the family has little, they share the best they have. Guests are treated like family. 'Kain tayo!' means 'Let's eat!' and you'll hear it the moment you walk in the door.",
      },
      {
        heading: "Bayanihan — Helping Together",
        emoji: "🤝",
        body: "Long ago, when a family needed to move, the whole village would literally lift their bamboo house and carry it to its new spot! This spirit of joyfully helping neighbors is called 'bayanihan'. Today it means any time a community comes together to help someone in need.",
      },
      {
        heading: "A Grateful, Giving Heart",
        emoji: "💝",
        body: "Filipino families practice gratitude ('utang na loob' — a heart that remembers kindness), humility, and caring for God's creation. Helping family is not a chore — it is love in action.",
        bullets: [
          "Respect for parents and elders",
          "Gratitude and remembering kindness",
          "Helping family without being asked",
          "Sharing with neighbors and strangers",
          "Being a good steward of God's creation",
        ],
      },
      {
        heading: "Family Discussion",
        emoji: "💭",
        body: "Talk together: Which of these values does our family already practice well? Which one could we grow in this week? How is bayanihan like the way the early church shared everything in Acts?",
      },
    ],
    phrases: [
      { english: "Yes (respectful)", tagalog: "Opo", hiligaynon: "Huo", pronunciation: "OH-poh / HOO-oh" },
      { english: "Let's eat!", tagalog: "Kain tayo!", hiligaynon: "Kaon ta!", pronunciation: "KAH-in TAH-yo / KAH-on tah" },
      { english: "Helping together", tagalog: "Bayanihan", hiligaynon: "Bayanihan", pronunciation: "bah-yah-NEE-han" },
    ],
    reflection: "What is one kind thing someone in your family did for you recently? Did you remember to thank them?",
    gratitudePrompt: "One thing that made me happy today is...",
  },
  {
    id: "mango-float-adventure",
    order: 4,
    title: "Mango Float Cooking Adventure",
    subtitle: "Make the Philippines' favorite no-bake dessert!",
    emoji: "🥭",
    category: "Cooking",
    destinationId: "guimaras",
    recipeId: "mango-float",
    date: "2026-07-20",
    time: "9:00 AM",
    materials: [
      "Ripe mangoes (3–4)",
      "Graham crackers (2 packs)",
      "All-purpose cream or heavy whipping cream (2 cups)",
      "Sweetened condensed milk (1 can)",
      "8x8 glass dish or similar pan",
      "Mixing bowl, whisk, spatula, knife (adult help!)",
    ],
    canvaLink: "https://www.canva.com/",
    videoLinks: [
      { label: "How to Make Mango Float (search on YouTube)", url: "https://www.youtube.com/results?search_query=mango+float+recipe+easy" },
    ],
    familyChallenge: "Take a family photo with your finished mango float and upload it to the Family Cookbook! Rate your creation with a family taste test — thumbs up scale from 1 to 10 thumbs.",
    notes: "Make it the night before if possible — mango float tastes best after chilling overnight.",
    sections: [
      {
        heading: "The Sweetest Fruit in the World",
        emoji: "🥭",
        body: "Philippine mangoes are famous — the island of Guimaras (right next to Iloilo!) grows mangoes so sweet they once held a world record. Mango float is the dessert every Filipino family makes for birthdays, Christmas... and any day that needs a little sweetness.",
      },
      {
        heading: "Cook Together",
        emoji: "👩‍🍳",
        body: "Open the Mango Float recipe in the Cooking & Baking Studio and follow the steps together. Ezra and Selah — this one is for you! Everyone gets a job: slicing (with help), whipping, layering, and the most important job of all... taste testing.",
      },
    ],
    phrases: [
      { english: "Mango", tagalog: "Mangga", hiligaynon: "Pahò", pronunciation: "mahng-GAH / pah-HO" },
      { english: "Delicious!", tagalog: "Masarap!", hiligaynon: "Namit!", pronunciation: "mah-sah-RAHP / NAH-mit" },
      { english: "Let's eat!", tagalog: "Kain tayo!", hiligaynon: "Kaon ta!", pronunciation: "KAH-in TAH-yo" },
    ],
    reflection: "What was your favorite part of making the mango float together? What dessert should our family try next?",
    gratitudePrompt: "Today I am grateful to the Lord because...",
  },
  {
    id: "national-symbols",
    order: 5,
    title: "Treasures of the Philippines",
    subtitle: "The national symbols — a flower, an eagle, a tree, and a very colorful ride",
    emoji: "🌼",
    category: "Philippines",
    date: "2026-07-22",
    time: "9:00 AM",
    materials: ["Drawing paper and colors", "White flower or flower photo (optional)", "Building blocks or Legos for the jeepney build"],
    canvaLink: "https://www.canva.com/", // paste your presentation link here
    videoLinks: [
      { label: "Philippine Eagle up close (search on YouTube)", url: "https://www.youtube.com/results?search_query=philippine+eagle+documentary+kids" },
      { label: "Jeepney ride tour (search on YouTube)", url: "https://www.youtube.com/results?search_query=jeepney+ride+philippines+tour" },
    ],
    familyChallenge:
      "Design your own family jeepney! Draw or build (Legos welcome, Ezra and Asa!) a jeepney decorated with things your family loves. Give it a route name — where would it drive?",
    notes: "Let each child pick a favorite symbol to present to the family in one sentence — tiny practice in confident speaking.",
    sections: [
      {
        heading: "A Treasure Chest of a Country",
        emoji: "🗝️",
        body: "Every country keeps a treasure chest — not of gold, but of living things and beloved objects that tell you who its people are. Today we open the Philippines' treasure chest. Inside: a tiny flower with a giant perfume, the king of all eagles, a tree as strong as family, and the most colorful ride on planet Earth.",
      },
      {
        heading: "Sampaguita — the National Flower",
        emoji: "🌼",
        body: "The sampaguita is small and white, but in the evening its sweet smell fills whole streets. Filipinos string sampaguita into garlands to welcome guests and honor visitors — hospitality you can wear! Its name comes from 'sumpa kita' — 'I promise you' — a flower of loyalty and love.",
        bullets: [
          "Small, white, star-shaped — blooms at night",
          "Sold as fragrant garlands outside churches",
          "Stands for purity, loyalty, and warm welcome",
        ],
      },
      {
        heading: "The Philippine Eagle — King of Birds",
        emoji: "🦅",
        body: "The Philippine Eagle is one of the largest, rarest eagles in the whole world — with a wild crown of feathers and wings wider than a door! It lives only in Philippine forests, which makes protecting those forests a very important job. Caring for this eagle is caring for God's creation.",
        bullets: [
          "One of the biggest eagles on Earth — up to 7 feet of wingspan!",
          "Lives ONLY in the Philippines",
          "Endangered — fewer than 400 pairs left, so every forest matters",
        ],
      },
      {
        heading: "Narra Tree & Carabao — Strong and Faithful",
        emoji: "🌳",
        body: "The narra is the national tree — hard, golden wood that stands strong through storms, just like a family. And the carabao (water buffalo) is the farmer's faithful best friend, pulling plows through rice fields with quiet patience. Strength plus faithfulness — very Filipino treasures.",
      },
      {
        heading: "The Jeepney — the Ride with a Smile",
        emoji: "🚙",
        body: "After World War II, Filipinos took leftover army jeeps and transformed them into rainbow-painted, chrome-shining, family-carrying works of art called jeepneys. Every jeepney is decorated differently — horses, names, Bible verses, sunbursts! It is creativity and bayanihan on wheels: when you ride, you pass your fare hand-to-hand through other passengers, saying 'Bayad po!' (Here's my payment, please!)",
      },
    ],
    phrases: [
      { english: "Flower", tagalog: "Bulaklak", hiligaynon: "Bulak", pronunciation: "boo-lahk-LAHK / boo-LAHK" },
      { english: "Eagle", tagalog: "Agila", hiligaynon: "Agila", pronunciation: "ah-GHEE-lah" },
      { english: "Tree", tagalog: "Puno", hiligaynon: "Kahoy", pronunciation: "POO-noh / KAH-hoy" },
      { english: "Beautiful", tagalog: "Maganda", hiligaynon: "Matahum", pronunciation: "mah-gahn-DAH / mah-TAH-hoom" },
    ],
    reflection: "If our family had a treasure chest of symbols, what five things would be inside it — and why?",
    gratitudePrompt: "One beautiful thing the Lord made that I noticed today is...",
  },
  {
    id: "turon-adventure",
    order: 6,
    title: "Turon Cooking Adventure",
    subtitle: "Golden crispy banana rolls — the sweet smell of Filipino afternoons",
    emoji: "🍌",
    category: "Cooking",
    recipeId: "turon",
    date: "2026-07-24",
    time: "9:00 AM",
    materials: [
      "6 saba or regular bananas",
      "Lumpia/spring roll wrappers (12)",
      "1 cup brown sugar",
      "Cooking oil for frying (adult job!)",
      "Frying pan, tongs, paper towels",
    ],
    canvaLink: "https://www.canva.com/",
    videoLinks: [
      { label: "How to roll turon (search on YouTube)", url: "https://www.youtube.com/results?search_query=how+to+make+turon+easy" },
    ],
    familyChallenge:
      "Set up a pretend turon street cart! Make a sign with your price in pesos, and take turns being the vendor and the customer. Vendors must say 'Salamat!' with a big smile.",
    notes: "Kids roll, adults fry — assembly-line style. Make extra; turon disappears fast.",
    sections: [
      {
        heading: "The Three O'Clock Smell",
        emoji: "🕒",
        body: "Imagine walking home in a Filipino neighborhood at three in the afternoon. From down the street comes a sound — sizzle, sizzle — and then THE SMELL: warm caramel and banana. That's the turon cart! Kids appear from everywhere. This is merienda time — the beloved Filipino afternoon snack break — and today, your kitchen becomes the neighborhood cart.",
      },
      {
        heading: "Merienda — the Snack That Gathers People",
        emoji: "🧺",
        body: "Merienda is more than a snack — it's a pause in the day when family and neighbors sit together, share something warm, and talk. Workers stop, kids gather, grandmothers tell stories. Food in the Philippines is never just food; it's an invitation.",
      },
      {
        heading: "Roll Together, Like Lumpia's Sweet Cousin",
        emoji: "🤝",
        body: "Turon is rolled exactly like lumpia — which means it's a family assembly line! One person sugars the bananas, one rolls, one seals with water. Open the Turon recipe in the Cooking & Baking Studio and follow the steps. Remember the golden rule: rolling is a kid job, frying is 100% an adult job.",
      },
    ],
    phrases: [
      { english: "Banana", tagalog: "Saging", hiligaynon: "Saging", pronunciation: "SAH-ging" },
      { english: "Afternoon snack", tagalog: "Merienda", hiligaynon: "Merienda", pronunciation: "meh-ree-EN-dah" },
      { english: "Hot!", tagalog: "Mainit!", hiligaynon: "Mainit!", pronunciation: "mah-EE-nit" },
      { english: "Delicious!", tagalog: "Masarap!", hiligaynon: "Namit!", pronunciation: "mah-sah-RAHP / NAH-mit" },
    ],
    reflection: "Merienda is a pause to be together. When is our family's favorite time to pause and share food?",
    gratitudePrompt: "One thing that made me happy today is...",
  },
  {
    id: "meet-teacher-sharon",
    order: 7,
    title: "Meet Teacher Sharon",
    subtitle: "A real friend from the other side of the world",
    emoji: "👩‍🏫",
    category: "Philippines",
    date: "2026-07-27",
    time: "9:00 AM",
    materials: ["Interview questions prepared by each child (see Family Challenge)", "World map or globe to find Negros"],
    canvaLink: "https://www.canva.com/",
    videoLinks: [
      { label: "Negros Occidental from above (search on YouTube)", url: "https://www.youtube.com/results?search_query=negros+occidental+aerial+tour" },
    ],
    familyChallenge:
      "Before class, each explorer prepares 2 interview questions for Teacher Sharon — one about growing up in the Philippines, and one about her favorites (food? animal? place?). Ask them live during class!",
    notes: "This episode is mostly conversation — share photos of home, answer their questions, and let the relationship grow. Personalize the sections below with your own stories!",
    sections: [
      {
        heading: "A Letter Across the Ocean",
        emoji: "✉️",
        body: "Imagine getting a letter from the other side of the world: 'Dear explorers — while you are eating breakfast, I am watching the sunset. While you have winter, I have mangoes. Come and see my world!' Today the letter-writer introduces herself: your guide for this whole adventure, Teacher Sharon.",
      },
      {
        heading: "From the Land of Sugar and Smiles",
        emoji: "🌱",
        body: "Teacher Sharon comes from Negros Occidental in the Visayas — the 'Sugarbowl of the Philippines,' where green sugarcane fields stretch to the mountains. Her language is Hiligaynon, called one of the sweetest-sounding languages in the world — from the sweetest-sounding region, of course!",
        bullets: [
          "Home region: Negros Occidental, Western Visayas",
          "Home language: Hiligaynon — 'Kamusta!'",
          "Time difference: when it's morning for you, it's evening for her!",
        ],
      },
      {
        heading: "The Interview",
        emoji: "🎤",
        body: "Now it's your turn to be explorers AND reporters. Ask Teacher Sharon your prepared questions! Listen for one surprising thing — you'll write it in your journal afterward.",
      },
      {
        heading: "Friends Across the World",
        emoji: "🌏",
        body: "Here's the wonderful secret of this whole adventure: the Philippines isn't just a place on the map anymore. It's where your friend lives. Learning a country is good; loving a friend from that country is even better.",
      },
    ],
    phrases: [
      { english: "Nice to meet you", tagalog: "Ikinagagalak kitang makilala", hiligaynon: "Nalipay ako nga makilala ka", pronunciation: "ee-kee-nah-gah-gah-LAHK / nah-LEE-pie ah-KOH" },
      { english: "My name is...", tagalog: "Ang pangalan ko ay...", hiligaynon: "Ang ngalan ko...", pronunciation: "ahng pah-NGAH-lahn koh" },
      { english: "Where do you live?", tagalog: "Saan ka nakatira?", hiligaynon: "Diin ka nagapuyo?", pronunciation: "sah-AHN kah nah-kah-TEE-rah / dee-IN kah nah-gah-POO-yoh" },
      { english: "Friend", tagalog: "Kaibigan", hiligaynon: "Abyan", pronunciation: "kah-ee-BEE-gahn / AHB-yahn" },
    ],
    reflection: "What was the most surprising thing you learned about Teacher Sharon today? What would you tell her about YOUR daily life?",
    gratitudePrompt: "Today I am grateful to the Lord for a person in my life because...",
  },
  {
    id: "where-i-live",
    order: 8,
    title: "Where I Live: Bago City",
    subtitle: "Sugarcane fields, waterfalls, and Teacher Sharon's hometown",
    emoji: "🏞️",
    category: "Philippines",
    destinationId: "bago",
    date: "2026-07-29",
    time: "9:00 AM",
    materials: ["Green and gold colors for the sugarcane landscape drawing", "Sugar (a spoonful per explorer for the taste-and-think moment!)"],
    canvaLink: "https://www.canva.com/",
    videoLinks: [
      { label: "Kipot Falls, Bago City (search on YouTube)", url: "https://www.youtube.com/results?search_query=kipot+falls+bago+city" },
      { label: "Sugarcane harvest in Negros (search on YouTube)", url: "https://www.youtube.com/results?search_query=sugarcane+harvest+negros+philippines" },
    ],
    familyChallenge:
      "Sweet hunt! Find three things in your kitchen that contain sugar. Then guess together: did that sugar maybe begin as sugarcane in a field like the ones around Bago City? The world is more connected than we think!",
    notes: "Share your own photos of Bago in the Canva deck — real photos of real places beat any stock image.",
    sections: [
      {
        heading: "The Green Ocean",
        emoji: "🌾",
        body: "Close your eyes and picture an ocean — but green. Waves of tall sugarcane swaying in the wind, as far as you can see, with blue mountains standing behind them. That's the road to Bago City, Teacher Sharon's hometown in Negros Occidental. Locals call Negros the 'Sugarbowl of the Philippines' — and today you'll see why.",
      },
      {
        heading: "A City of Farms and Waterfalls",
        emoji: "💧",
        body: "Bago City is one of the biggest rice and sugar producers in the region — a hardworking farm city. But hidden in its green hills are treasures: waterfalls like Kipot Falls where families swim on hot days, and rivers that water all those fields. Farm work in front, adventure in the back!",
        bullets: [
          "Part of Negros Occidental, Western Visayas",
          "Famous for sugarcane and rice farming",
          "Home to beautiful waterfalls and the Bago River",
        ],
      },
      {
        heading: "Taste and Think",
        emoji: "🥄",
        body: "Put one small spoonful of sugar on your tongue. As it melts, think about its journey: a farmer in a field like Bago's planted cane under the hot sun, harvested it, and a mill turned it into these sparkling crystals — which crossed the ocean to your kitchen. Sweetness is somebody's hard work. 'Salamat' to farmers!",
      },
      {
        heading: "Home Is Worth Knowing",
        emoji: "🏠",
        body: "Every place on Earth is somebody's hometown — somebody's fields, somebody's waterfall, somebody's Sunday afternoon. Today Bago City stopped being a dot on the map and became a real place where your friend grew up. That's what explorers do: they turn dots into homes.",
      },
    ],
    phrases: [
      { english: "Sugar", tagalog: "Asukal", hiligaynon: "Kalamay", pronunciation: "ah-SOO-kahl / kah-lah-MY" },
      { english: "Waterfall", tagalog: "Talon", hiligaynon: "Busay", pronunciation: "tah-LOHN / boo-SIGH" },
      { english: "Field / farm", tagalog: "Bukid", hiligaynon: "Uma", pronunciation: "boo-KID / oo-MAH" },
      { english: "Home / house", tagalog: "Tahanan / Bahay", hiligaynon: "Balay", pronunciation: "tah-HAH-nahn / BAH-lie" },
    ],
    reflection: "What makes YOUR hometown special? If Teacher Sharon visited you, what three places would you show her?",
    gratitudePrompt: "One blessing I noticed today is...",
  },
  {
    id: "daily-life-philippines",
    order: 9,
    title: "A Day in a Filipino Kid's Life",
    subtitle: "Jeepneys, sari-sari stores, mano po, and merienda",
    emoji: "🌞",
    category: "Philippines",
    date: "2026-07-31",
    time: "9:00 AM",
    materials: ["Small items + coins to set up a pretend sari-sari store", "Paper for the 'my day vs. their day' comparison chart"],
    canvaLink: "https://www.canva.com/",
    videoLinks: [
      { label: "A day in the life — Filipino kids (search on YouTube)", url: "https://www.youtube.com/results?search_query=day+in+the+life+filipino+kids" },
      { label: "Sari-sari store tour (search on YouTube)", url: "https://www.youtube.com/results?search_query=sari+sari+store+philippines" },
    ],
    familyChallenge:
      "Open your own family sari-sari store for one evening! Set up a tiny shop window with snacks, make price tags in pesos, and take turns shopkeeping. Customers must greet the shopkeeper in Tagalog or Hiligaynon!",
    notes: "End with the comparison chart: same/same/different between their day and a Filipino kid's day. Sameness builds friendship; difference builds wonder.",
    sections: [
      {
        heading: "Sunrise with Roosters",
        emoji: "🐓",
        body: "It's 5:30 AM somewhere in the Philippines, and the neighborhood rooster is louder than any alarm clock. A Filipino kid wakes up, and the first stop is grandma — taking her hand and pressing it gently to the forehead. 'Mano po.' It means: bless me, I honor you. Every single morning begins with respect.",
      },
      {
        heading: "The Sari-Sari Store",
        emoji: "🏪",
        body: "On nearly every street corner stands a sari-sari store — a tiny window-shop attached to a neighbor's house, selling a little bit of EVERYTHING ('sari-sari' means 'variety'!). Candy, soap, ice water, one egg, a single banana cue stick. Kids run errands there all day: 'Bili ka ng suka!' — go buy vinegar! It's the neighborhood's kitchen cupboard and news station in one.",
      },
      {
        heading: "School, Jeepneys, and Games",
        emoji: "🎒",
        body: "Kids ride jeepneys or tricycles to school in bright white-and-colored uniforms. After school? Street games! Patintero (tag with lines), tumbang preso (knock down the can), luksong baka (leapfrog — literally 'jump over the cow'!). No batteries needed — just chalk, a can, and a whole street of friends.",
        bullets: [
          "Mano po to elders — every morning, every visit",
          "Jeepney or tricycle rides to school",
          "Street games with the whole neighborhood",
          "Merienda at three o'clock — always",
        ],
      },
      {
        heading: "Evening: Family Around the Table",
        emoji: "🍚",
        body: "Dinner is rice (always rice!) with the whole family — often grandparents too, because many Filipino homes hold three generations under one roof. After dinner: stories, teasing, maybe karaoke (Filipinos LOVE karaoke). The day ends the way it began — together.",
      },
      {
        heading: "Same Sun, Different Streets",
        emoji: "🌏",
        body: "Make your chart: what's the SAME about your day and theirs (family, games, school, dinner together) and what's DIFFERENT (roosters, jeepneys, sari-sari stores, rice at every meal)? Here's the explorer's discovery: the differences are fun, but the sameness is family. Kids everywhere want to play, eat, and be loved.",
      },
    ],
    phrases: [
      { english: "Respect greeting to elders", tagalog: "Mano po", hiligaynon: "Mano po", pronunciation: "MAH-noh poh" },
      { english: "Store (little variety shop)", tagalog: "Sari-sari store", hiligaynon: "Sari-sari store", pronunciation: "SAH-ree SAH-ree" },
      { english: "Rice (cooked)", tagalog: "Kanin", hiligaynon: "Kan-on", pronunciation: "KAH-nin / KAHN-on" },
      { english: "Let's play!", tagalog: "Maglaro tayo!", hiligaynon: "Mahampang kita!", pronunciation: "mahg-lah-ROH TAH-yoh / mah-hahm-PAHNG kee-TAH" },
    ],
    reflection: "Which part of a Filipino kid's day would you most like to try — and which part of YOUR day do you think they would enjoy?",
    gratitudePrompt: "Today I am grateful to the Lord because...",
  },

  // ═══════════════════════════════════════════════════════════
  // AUGUST — "Islands & Words" (Season Calendar, Units 5 · 2 · 7)
  // ═══════════════════════════════════════════════════════════
  {
    id: "luzon-land-of-the-rising-capital",
    order: 10,
    title: "Luzon — Land of the Rising Capital",
    subtitle: "Ride a jeepney through the biggest island of them all",
    emoji: "🚍",
    category: "Philippines",
    date: "2026-08-03",
    time: "9:00 AM",
    materials: ["A shoebox or building blocks (jeepney build!)", "Crayons or markers", "Paper for a route map"],
    canvaLink: "https://www.canva.com/",
    videoLinks: [
      { label: "Manila & Luzon from above (search on YouTube)", url: "https://www.youtube.com/results?search_query=luzon+manila+from+above+4k" },
    ],
    familyChallenge:
      "Build your own jeepney from a shoebox or blocks — paint it bright, give it a name like real drivers do, and draw the route map of YOUR town for its first trip!",
    notes: "Regional intro — the Banaue, Mayon, and Palawan episodes award this month's stamps.",
    sections: [
      {
        heading: "The City That Wakes Before the Sun",
        emoji: "🌅",
        body: "It is 4:30 in the morning in Manila, and Mang Ben is already polishing his jeepney — a long, shiny silver bus-car covered in painted horses, family names, and little flags. Before the sun is even up, his jeepney rumbles to life and joins thousands of others, carrying students, lolas with market baskets, and workers across the biggest island in the Philippines. Climb in — today, Luzon is our route!",
      },
      {
        heading: "One Giant Island, a Thousand Faces",
        emoji: "🗺️",
        body: "Luzon is the largest of the three island groups — so big it holds almost every kind of place you can imagine.",
        bullets: [
          "Home of Manila, the capital city, and Quezon City, the biggest city",
          "The cool Cordillera mountains in the north — where the rice terraces climb the sky (next Monday's adventure!)",
          "Fiery volcanoes like Mayon and Taal — and black-sand beaches beneath them",
          "More than half of all Filipinos live on Luzon",
        ],
      },
      {
        heading: "Manila — the Capital by the Bay",
        emoji: "🏙️",
        body: "Manila sits beside a bay famous for the most beautiful sunsets in Asia. Inside the city hides Intramuros — 'the walled city' — with stone walls over 400 years old that you can walk on top of! Nearby is Rizal Park, named for the national hero the kids will meet again and again on this journey.",
        bullets: [
          "Intramuros — a Spanish-era walled city you can explore by bamboo bike",
          "Manila Bay — famous worldwide for its orange-pink sunsets",
          "Jeepneys everywhere — the 'kings of the road,' each one decorated like a rolling artwork",
        ],
      },
      {
        heading: "Words for the Road",
        emoji: "🧭",
        body: "Every traveler needs road words! Practice these out loud, then use them on your jeepney build.",
      },
    ],
    phrases: [
      { english: "Trip / journey", tagalog: "Byahe", hiligaynon: "Byahe", pronunciation: "BYAH-heh" },
      { english: "City", tagalog: "Lungsod", hiligaynon: "Siyudad", pronunciation: "loong-SOD / see-yoo-DAHD" },
      { english: "Mountain", tagalog: "Bundok", hiligaynon: "Bukid", pronunciation: "boon-DOK / boo-KID" },
      { english: "Sea", tagalog: "Dagat", hiligaynon: "Dagat", pronunciation: "DAH-gaht" },
      { english: "Street", tagalog: "Kalye", hiligaynon: "Kalye", pronunciation: "KAHL-yeh" },
      { english: "Let's ride!", tagalog: "Sakay na!", hiligaynon: "Sakay na!", pronunciation: "sah-KAI nah" },
    ],
    reflection: "If your family had its own jeepney, what would you paint on it — and where would its very first route go?",
    gratitudePrompt: "Today I am grateful to the Lord because...",
  },
  {
    id: "tagalog-family-words",
    order: 11,
    title: "Pamilya! Family Words",
    subtitle: "Ate, Kuya, Lola, Lolo — every person in a Filipino family has a special name",
    emoji: "👨‍👩‍👧‍👦",
    category: "Language",
    date: "2026-08-05",
    time: "9:00 AM",
    materials: ["Large paper or poster board (family tree)", "Family photos or drawing supplies", "Glue or tape"],
    canvaLink: "https://www.canva.com/",
    videoLinks: [
      { label: "Filipino family words song (search on YouTube)", url: "https://www.youtube.com/results?search_query=tagalog+family+words+for+kids" },
    ],
    familyChallenge:
      "Make a family tree poster with photos or drawings — label every person with their Filipino title. Then use Ate, Kuya, Manang, and Manong for each other ALL WEEK. (Rylee and Ezra just became Ate and Kuya!)",
    notes: "Teacher: please double-check the Hiligaynon terms below — your ear is final. Word set also lives in config/languages.ts (Family Words).",
    sections: [
      {
        heading: "Sunday at Lola's House",
        emoji: "🏡",
        body: "The tricycle stops in front of a blue house and the door bursts open before you even knock. 'Apo!' cries Lola, pulling you in. Inside, Ate Liza is setting the table, Kuya Miko is carrying a giant pot of rice, and Tatay is laughing at something Nanay said. In a Filipino home, nobody is just a name — everyone has a TITLE that says 'you belong to me, and I belong to you.'",
      },
      {
        heading: "Who's Who sa Pamilya",
        emoji: "💛",
        body: "These titles are little gifts of respect — using them tells someone their place in your heart.",
        bullets: [
          "Ate (AH-teh) — older sister · Kuya (KOO-yah) — older brother (Tagalog)",
          "Manang — older sister · Manong — older brother (Hiligaynon, Teacher Sharon's home words!)",
          "Lola — grandmother · Lolo — grandfather — the most beloved words in any Filipino house",
          "Even friends and neighbors get titles — a kind older lady is 'Tita,' a family friend is 'Tito'",
        ],
      },
      {
        heading: "Po and Opo Live at Home",
        emoji: "🙏",
        body: "Remember 'po' and 'opo,' the respect words? Their favorite place is inside the family. 'Opo, Lola' — yes, grandmother. 'Salamat po, Tatay' — thank you, father. Respect isn't a rule in a Filipino family; it's the way love talks.",
      },
      {
        heading: "Your Words for the People You Love",
        emoji: "💬",
        body: "Say each one out loud — then look at the person in YOUR family it belongs to and say it to them!",
      },
    ],
    phrases: [
      { english: "Mother", tagalog: "Nanay", hiligaynon: "Nanay / Iloy", pronunciation: "NAH-nai / EE-loy" },
      { english: "Father", tagalog: "Tatay", hiligaynon: "Tatay / Amay", pronunciation: "TAH-tai / AH-mai" },
      { english: "Older sister", tagalog: "Ate", hiligaynon: "Manang", pronunciation: "AH-teh / mah-NAHNG" },
      { english: "Older brother", tagalog: "Kuya", hiligaynon: "Manong", pronunciation: "KOO-yah / mah-NOHNG" },
      { english: "Grandmother", tagalog: "Lola", hiligaynon: "Lola", pronunciation: "LOH-lah" },
      { english: "Grandfather", tagalog: "Lolo", hiligaynon: "Lolo", pronunciation: "LOH-loh" },
      { english: "Sibling", tagalog: "Kapatid", hiligaynon: "Utod", pronunciation: "kah-pah-TEED / oo-TOD" },
      { english: "Family", tagalog: "Pamilya", hiligaynon: "Pamilya", pronunciation: "pah-MEEL-yah" },
    ],
    reflection: "Which family title feels the most special to you — and who in your family will you call by their Filipino title first?",
    gratitudePrompt: "Today I am grateful to the Lord because...",
  },
  {
    id: "halo-halo-adventure",
    order: 12,
    title: "Halo-Halo Cooking Adventure",
    subtitle: "The dessert whose name means 'mix-mix' — everything wonderful in one glass",
    emoji: "🍧",
    category: "Cooking",
    recipeId: "halo-halo",
    date: "2026-08-07",
    time: "9:00 AM",
    materials: ["See the recipe's shopping list (Cooking Academy)", "Tall clear glasses", "Long spoons", "Crushed ice"],
    canvaLink: "https://www.canva.com/",
    videoLinks: [
      { label: "How halo-halo is made (search on YouTube)", url: "https://www.youtube.com/results?search_query=halo+halo+filipino+dessert+how+to" },
    ],
    familyChallenge:
      "Invent your family's OWN halo-halo layer! Each explorer adds one ingredient nobody expects — name your creation and draw its 'menu card' for the Family Cookbook.",
    notes: "Teacher: verify Hiligaynon kitchen words below. Grandma Jeannie will love this one — layering is a perfect job for many hands.",
    sections: [
      {
        heading: "The Bell on the Hottest Day",
        emoji: "🔔",
        body: "It is the hottest afternoon of April in Bacolod, the kind where even the dogs nap in the shade. Then — kiling-kiling! — a little bell rings down the street, and every kid on the block sits straight up. The halo-halo cart is coming! Crushed ice, purple ube, sweet bananas, jellies like little jewels, and milk poured over everything. One glass, a hundred colors, and the whole street lines up smiling.",
      },
      {
        heading: "What Does Halo-Halo Mean?",
        emoji: "🥄",
        body: "'Halo' means MIX — so halo-halo means 'mix-mix!' The magic rule: everything goes in together, and somehow it all belongs. Sweet beans next to jelly, ice next to flan, purple yam on top. A little like a family, isn't it? Different colors and flavors — one wonderful glass.",
        bullets: [
          "Layered, never stirred — until YOU mix it at the table (that's the fun part)",
          "Ube (purple yam) makes it purple, leche flan makes it golden",
          "Every region — and every family — builds theirs differently",
        ],
      },
      {
        heading: "Kitchen Words for Today",
        emoji: "💬",
        body: "Cooks in the Philippines call across the kitchen in these words — now your kitchen can too!",
      },
    ],
    phrases: [
      { english: "Mix", tagalog: "Halo", hiligaynon: "Lakot", pronunciation: "HAH-loh / LAH-kot" },
      { english: "Ice", tagalog: "Yelo", hiligaynon: "Yelo", pronunciation: "YEH-loh" },
      { english: "Sweet", tagalog: "Matamis", hiligaynon: "Matam-is", pronunciation: "mah-tah-MEES / mah-TAHM-ees" },
      { english: "Delicious!", tagalog: "Masarap!", hiligaynon: "Manamit!", pronunciation: "mah-sah-RAHP / mah-NAH-meet" },
      { english: "Milk", tagalog: "Gatas", hiligaynon: "Gatas", pronunciation: "GAH-tahs" },
    ],
    reflection: "Halo-halo means many different things making one delicious whole. How is your family like a halo-halo?",
    gratitudePrompt: "Today I am grateful to the Lord because...",
  },
  {
    id: "banaue-stairways-to-the-sky",
    order: 13,
    title: "Banaue — Stairways to the Sky",
    subtitle: "Rice terraces carved by hand two thousand years ago — and still growing rice today",
    emoji: "🌾",
    category: "Philippines",
    destinationId: "banaue",
    date: "2026-08-10",
    time: "9:00 AM",
    materials: ["A tray, baking pan, or shallow box", "Soil or playdough (terrace building!)", "A few seeds or dried beans", "Cardboard strips"],
    canvaLink: "https://www.canva.com/",
    videoLinks: [
      { label: "Banaue Rice Terraces from above (search on YouTube)", url: "https://www.youtube.com/results?search_query=banaue+rice+terraces+4k+drone" },
    ],
    familyChallenge:
      "Build your own mini rice terraces! Layer soil or playdough into stair-steps in a tray, hold the walls with cardboard, and plant real seeds on each step. Water them all month and watch your mountain turn green — just like the Ifugao. (Asa, this one's yours to lead!)",
    notes: "Awards the Banaue passport stamp. Strong bayanihan tie-in — the terraces are Unit 4 values made visible.",
    sections: [
      {
        heading: "The Grandmother on the Mountain Stairs",
        emoji: "🌄",
        body: "High in the cold morning mist of the Cordillera mountains, Apo Rosa walks a narrow green ledge the way her mother did, and her mother's mother, back further than anyone can count. On her back is a basket of rice seedlings. Below her — and above her — the whole mountain is carved into giant green steps, like a stairway built for the sky itself. Her family didn't buy this mountain. They didn't find it this way. Two thousand years ago, her ancestors carved it — by hand.",
      },
      {
        heading: "The Eighth Wonder of the World",
        emoji: "🌾",
        body: "The Banaue Rice Terraces might be the greatest thing ever built by families working together.",
        bullets: [
          "Carved around 2,000 years ago by the Ifugao people — with hand tools, no machines",
          "The walls climb higher than a 5-story building in places, following the mountain's own shape",
          "Some say if you laid the terrace walls end to end, they would stretch halfway around the world",
          "They are STILL farmed today — the same families, the same rice, parent to child to grandchild",
        ],
      },
      {
        heading: "Built the Bayanihan Way",
        emoji: "🤝",
        body: "Remember bayanihan — the whole village lifting the house together? The terraces are bayanihan carved into a mountain. No single family could build them. Neighbors carved together, shared water down the steps fairly, and repaired each other's walls after storms — for two thousand years. When you see the terraces, you're not just seeing farming. You're seeing what 'helping each other' looks like when it never, ever stops.",
      },
      {
        heading: "Words from the Rice Mountain",
        emoji: "💬",
        body: "Rice has different names for every stage of its life in the Philippines — that's how much it matters. Say them out loud!",
      },
    ],
    phrases: [
      { english: "Rice plant (growing)", tagalog: "Palay", hiligaynon: "Humay", pronunciation: "PAH-lai / HOO-mai" },
      { english: "Rice (uncooked)", tagalog: "Bigas", hiligaynon: "Bugas", pronunciation: "bee-GAHS / boo-GAHS" },
      { english: "Rice (cooked)", tagalog: "Kanin", hiligaynon: "Kan-on", pronunciation: "KAH-nin / KAHN-on" },
      { english: "Stairs", tagalog: "Hagdan", hiligaynon: "Hagdanan", pronunciation: "hahg-DAHN / hahg-DAH-nahn" },
      { english: "Rain", tagalog: "Ulan", hiligaynon: "Ulan", pronunciation: "OO-lahn" },
      { english: "Water", tagalog: "Tubig", hiligaynon: "Tubig", pronunciation: "TOO-big" },
    ],
    reflection: "The Ifugao built something amazing by helping each other for generations. What could YOUR family build or start today that your family's future kids might still care for?",
    gratitudePrompt: "Today I am grateful to the Lord because...",
  },
  {
    id: "numbers-to-market",
    order: 14,
    title: "Numbers to Market!",
    subtitle: "Count to ten in two languages — then buy mangoes like a pro",
    emoji: "🔢",
    category: "Language",
    date: "2026-08-12",
    time: "9:00 AM",
    materials: ["Play money or paper coins", "5 small items to 'sell' (fruit, toys, cans)", "Paper for price tags"],
    canvaLink: "https://www.canva.com/",
    videoLinks: [
      { label: "Counting in Tagalog for kids (search on YouTube)", url: "https://www.youtube.com/results?search_query=counting+tagalog+1+to+10+kids" },
    ],
    familyChallenge:
      "Open your own sari-sari store at home! Price 5 items with paper tags (in pesos!), take turns as shopkeeper and shopper, and do all the counting out loud in Tagalog or Hiligaynon. Shopkeeper Ezra, what's three mangoes at 10 pesos each? (Psst — that's times tables sneaking in. Don't tell anyone.)",
    notes: "Unit 2 Numbers — deliberately seeds Shaun's times-tables request through market pricing. Teacher: verify Hiligaynon numbers.",
    sections: [
      {
        heading: "Tuesday at the Palengke",
        emoji: "🧺",
        body: "The palengke — the market — is the loudest, most wonderful place in town on a Tuesday morning. 'Mangga! Tig-singkwenta!' calls Aling Nena from behind a golden mountain of mangoes. Nanay squeezes one, sniffs it like an expert, and holds up three fingers. Now comes the magic part — the counting, the pesos, the friendly back-and-forth. In the market, numbers aren't homework. Numbers are how you get mangoes.",
      },
      {
        heading: "One to Ten, Two Ways",
        emoji: "🔟",
        body: "Tagalog and Hiligaynon count almost like cousins — some numbers are twins, some wear different clothes. Listen for which is which!",
        bullets: [
          "Twins in both languages: isa (1), tatlo (3), apat (4), lima (5), pito (7), walo (8), siyam (9)",
          "Different clothes: two is dalawa in Tagalog but duha in Hiligaynon; six is anim vs anom; ten is sampu vs napulo",
          "Fun secret: for MONEY and TIME, Filipinos often switch to Spanish numbers — uno, dos, tres! A market price is 'singkwenta' (50)",
        ],
      },
      {
        heading: "Market Math — the Explorer's Times Table",
        emoji: "🥭",
        body: "Here's where counting becomes power. If one mango costs 10 pesos... two mangoes cost 20... three cost 30! You just did multiplication the market way — no worksheet, just mangoes. Every market kid in the Philippines learns numbers exactly like this: by helping, buying, and counting change.",
      },
      {
        heading: "Say Your Numbers Loud!",
        emoji: "💬",
        body: "Count everything today — steps, spoons, siblings. Out loud, both languages, big voice!",
      },
    ],
    phrases: [
      { english: "One", tagalog: "Isa", hiligaynon: "Isa", pronunciation: "ee-SAH" },
      { english: "Two", tagalog: "Dalawa", hiligaynon: "Duha", pronunciation: "dah-lah-WAH / doo-HAH" },
      { english: "Three", tagalog: "Tatlo", hiligaynon: "Tatlo", pronunciation: "taht-LOH" },
      { english: "Five", tagalog: "Lima", hiligaynon: "Lima", pronunciation: "lee-MAH" },
      { english: "Six", tagalog: "Anim", hiligaynon: "Anom", pronunciation: "AH-nim / AH-nom" },
      { english: "Ten", tagalog: "Sampu", hiligaynon: "Napulo", pronunciation: "sahm-POO / nah-poo-LOH" },
      { english: "How much?", tagalog: "Magkano?", hiligaynon: "Tagpila?", pronunciation: "mahg-KAH-noh / tahg-pee-LAH" },
      { english: "Money", tagalog: "Pera", hiligaynon: "Kwarta", pronunciation: "PEH-rah / KWAHR-tah" },
    ],
    reflection: "Where do numbers show up in YOUR family's day? Could you do tomorrow's counting — steps, plates, toys — in Tagalog or Hiligaynon?",
    gratitudePrompt: "Today I am grateful to the Lord because...",
  },
  {
    id: "rainbow-fruit-salad",
    order: 15,
    title: "Rainbow Fruit Salad Adventure",
    subtitle: "The creamy fiesta dessert every Filipino family makes its own way",
    emoji: "🥭",
    category: "Cooking",
    recipeId: "fruit-salad",
    date: "2026-08-14",
    time: "9:00 AM",
    materials: ["See the recipe's shopping list (Cooking Academy)", "A big glass bowl (rainbows deserve to be seen!)", "Can opener", "Mixing spoons for everyone"],
    canvaLink: "https://www.canva.com/",
    videoLinks: [
      { label: "Filipino fruit salad (search on YouTube)", url: "https://www.youtube.com/results?search_query=filipino+fruit+salad+creamy+recipe" },
    ],
    familyChallenge:
      "Before mixing, make Fruit Rainbow Art: arrange your fruit on a big plate in rainbow order and let Selah direct the design. Photograph it for the Family Cookbook — THEN mix it into the bowl. Art first, dessert second!",
    notes: "Fiesta/celebration dish framing (per family guidelines). Grandma Jeannie's travel-and-cooking stories fit beautifully here — invite her to share a fruit memory.",
    sections: [
      {
        heading: "The Bowl That Comes Out for Happy Days",
        emoji: "🎉",
        body: "In every Filipino kitchen there is one big glass bowl that only comes out when something wonderful is happening — a birthday, a graduation, a fiesta, a homecoming. And when the cousins see Lola reaching for that bowl, a cheer goes up, because everyone knows what's coming: creamy, dreamy, ice-cold fruit salad. Sweet corn kernels of young coconut, golden fruit cocktail, and the secret every family argues about lovingly — how much cream is 'enough'.",
      },
      {
        heading: "A Rainbow You Can Eat",
        emoji: "🌈",
        body: "Filipino fruit salad is a treasure chest of colors and textures.",
        bullets: [
          "Golden fruit cocktail and ripe mango — the sunshine layer",
          "Soft white buko (young coconut) — the cloud layer",
          "Red cherries or strawberries on top — the crown jewels",
          "All folded in sweet cream and condensed milk, then chilled until icy",
        ],
      },
      {
        heading: "Every Family's Bowl Is Different",
        emoji: "👨‍👩‍👧‍👦",
        body: "Ask ten Filipino families for their fruit salad recipe and you'll get ten proud answers. Some add cheese (yes, cheese — try it before you laugh!), some add jelly pearls, some guard a secret ingredient for generations. Today YOUR family starts its own version — whatever you add today becomes 'how we've always made it' tomorrow.",
      },
      {
        heading: "Sweet Words for a Sweet Day",
        emoji: "💬",
        body: "Fruit names are some of the happiest words in any language — say them like you're at the market!",
      },
    ],
    phrases: [
      { english: "Mango", tagalog: "Mangga", hiligaynon: "Mangga", pronunciation: "mahng-GAH" },
      { english: "Banana", tagalog: "Saging", hiligaynon: "Saging", pronunciation: "SAH-ging" },
      { english: "Pineapple", tagalog: "Pinya", hiligaynon: "Pinya", pronunciation: "PEEN-yah" },
      { english: "Coconut", tagalog: "Niyog", hiligaynon: "Lubi", pronunciation: "nee-YOG / loo-BEE" },
      { english: "Fruit", tagalog: "Prutas", hiligaynon: "Prutas", pronunciation: "PROO-tahs" },
      { english: "So sweet!", tagalog: "Ang tamis!", hiligaynon: "Katam-is!", pronunciation: "ahng tah-MEES / kah-TAHM-ees" },
    ],
    reflection: "What ingredient did YOUR family add to make the fruit salad your own — and what happy day will you make it for next?",
    gratitudePrompt: "Today I am grateful to the Lord because...",
  },
];

export function getLesson(id: string): Lesson | undefined {
  return lessons.find((l) => l.id === id);
}

// The next lesson on or after today; falls back to the last lesson.
export function getTodaysLesson(today = new Date()): Lesson {
  const sorted = [...lessons].sort((a, b) => a.date.localeCompare(b.date));
  const todayStr = today.toISOString().slice(0, 10);
  return sorted.find((l) => l.date >= todayStr) ?? sorted[sorted.length - 1];
}
