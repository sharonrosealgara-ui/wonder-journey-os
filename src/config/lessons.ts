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
  hiligaynon?: string; // legacy — kept optional; the app teaches Tagalog only now
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
  {
    id: "visayas-our-home-islands",
    order: 16,
    title: "Visayas — Our Home Islands",
    subtitle: "The middle islands where Teacher Sharon grew up — beaches, festivals, and Hiligaynon hearts",
    emoji: "🏝️",
    category: "Philippines",
    date: "2026-08-17",
    time: "9:00 AM",
    materials: ["A map of the Philippines (printed or drawn)", "Blue and green crayons", "Small paper boats (we'll make them!)"],
    canvaLink: "https://www.canva.com/",
    videoLinks: [
      { label: "Visayas islands from above (search on YouTube)", url: "https://www.youtube.com/results?search_query=visayas+philippines+islands+4k" },
    ],
    familyChallenge:
      "Fold a fleet of paper boats — one for each explorer — and name them after Visayan islands. Then 'sail' them across a blue blanket sea from island to island while Teacher Sharon tells you what makes each one special.",
    notes: "Regional intro — Teacher Sharon's personal geography! Iloilo & Bago stamps were earned in July; Cebu/Bohol/Boracay stamps come with their own future episodes.",
    sections: [
      {
        heading: "The Ferry Horn at First Light",
        emoji: "⛴️",
        body: "A deep horn sounds across the water — HHRRRMMM! — and the big white ferry pulls away from Iloilo's port, its deck full of sleepy passengers, sacks of mangoes, and one excited grandmother going home to Negros. In the Visayas, the sea isn't a wall between places. It's the ROAD. Islands here are neighbors who wave at each other across the water — and today, we're sailing right through the middle of Teacher Sharon's world.",
      },
      {
        heading: "The Middle Kingdom of Islands",
        emoji: "🗺️",
        body: "The Visayas is the heart of the Philippines — thousands of islands gathered like a family around a dinner table of sea.",
        bullets: [
          "The big siblings: Panay (Iloilo!), Negros (Bago City!), Cebu, Bohol, Leyte, Samar",
          "Home of the country's most famous beaches — including Boracay's powder-white sand",
          "Where Hiligaynon and Cebuano are spoken — the languages of markets, lullabies, and Lola's kitchen",
          "Festival country: MassKara, Dinagyang, Sinulog all happen here (October will be festival month!)",
        ],
      },
      {
        heading: "Teacher Sharon's Sea",
        emoji: "💛",
        body: "Somewhere on that map, between Panay and Negros, is the stretch of water Teacher Sharon has crossed her whole life — the Guimaras Strait, where the sweetest mangoes on Earth grow on the little island in the middle (you already earned that stamp!). When she says 'home,' this is the blue and green she means. Today, ask her anything about it — this is the lesson where your teacher IS the textbook.",
      },
      {
        heading: "Words That Cross the Water",
        emoji: "💬",
        body: "Sea words, island words — the vocabulary of a Visayan childhood. Say them like the ferry horn: loud and happy!",
      },
    ],
    phrases: [
      { english: "Island", tagalog: "Isla", hiligaynon: "Isla", pronunciation: "EES-lah" },
      { english: "Beach / shore", tagalog: "Dalampasigan", hiligaynon: "Baybay", pronunciation: "dah-lahm-pah-SEE-gahn / BAI-bai" },
      { english: "Boat", tagalog: "Bangka", hiligaynon: "Baroto", pronunciation: "bahng-KAH / bah-ROH-toh" },
      { english: "Wave (in the sea)", tagalog: "Alon", hiligaynon: "Balod", pronunciation: "AH-lon / bah-LOD" },
      { english: "Fish", tagalog: "Isda", hiligaynon: "Isda", pronunciation: "ees-DAH" },
      { english: "Beautiful!", tagalog: "Ang ganda!", hiligaynon: "Katahum!", pronunciation: "ahng gahn-DAH / kah-TAH-hoom" },
    ],
    reflection: "Teacher Sharon's home is islands connected by sea-roads. What connects YOUR family to the places and people you call home?",
    gratitudePrompt: "Today I am grateful to the Lord because...",
  },
  {
    id: "hiligaynon-simple-sentences",
    order: 17,
    title: "Hiligaynon — Your First Sentences",
    subtitle: "Teacher Sharon's home language — now YOU can speak it in whole sentences",
    emoji: "🗣️",
    category: "Language",
    date: "2026-08-19",
    time: "9:00 AM",
    materials: ["Index cards or paper strips", "A marker", "A small mirror (watch yourself speak!)"],
    canvaLink: "https://www.canva.com/",
    videoLinks: [
      { label: "Basic Hiligaynon phrases (search on YouTube)", url: "https://www.youtube.com/results?search_query=hiligaynon+ilonggo+basic+phrases" },
    ],
    familyChallenge:
      "Sentence-strip relay! Write each sentence on a card. Explorers take turns drawing a card and saying it TO someone in the family who must respond correctly. Winner is whoever makes Teacher Sharon smile biggest at the next class.",
    notes: "Unit 3 — Hiligaynon as a first-class language, never a footnote. Teacher: these sentences are yours to correct and re-record in your own voice someday.",
    sections: [
      {
        heading: "The Language That Sings",
        emoji: "🎵",
        body: "People in Iloilo and Negros say their language is malambing — sweet, gentle, almost sung instead of spoken. When two Ilonggos meet far from home, they can hear it in each other's voices in three words flat, and suddenly they're family. Today you learn to make whole sentences in the language Teacher Sharon dreamed in as a little girl. Speak them softly — this language likes kindness.",
      },
      {
        heading: "The Sentence Machine",
        emoji: "🧩",
        body: "Hiligaynon sentences snap together like blocks. Learn a few patterns and you can build dozens of sentences!",
        bullets: [
          "Kamusta ka? — How are you? · answer: Maayo man! — I'm fine!",
          "Ano ang ngalan mo? — What is your name? · Ako si ___ — I am ___",
          "Gutom na ako! — I'm hungry! (the most useful sentence in any language)",
          "Palangga ta ka — I love you (say THIS one at home tonight 💛)",
        ],
      },
      {
        heading: "Speak It Like Home",
        emoji: "🪞",
        body: "Hold the mirror and watch your mouth as you speak — Hiligaynon vowels are round and open, like the language is smiling. Don't worry about mistakes; Ilonggos famously love ANYONE who tries their language. Every sentence you attempt is a gift to your teacher.",
      },
      {
        heading: "Today's Sentences",
        emoji: "💬",
        body: "Practice each pair — question and answer, like a tiny conversation. Partner up!",
      },
    ],
    phrases: [
      { english: "How are you?", tagalog: "Kumusta ka?", hiligaynon: "Kamusta ka?", pronunciation: "kah-moos-TAH kah" },
      { english: "I'm fine!", tagalog: "Mabuti naman!", hiligaynon: "Maayo man!", pronunciation: "mah-BOO-tee / mah-AH-yoh mahn" },
      { english: "What is your name?", tagalog: "Anong pangalan mo?", hiligaynon: "Ano ang ngalan mo?", pronunciation: "AH-noh ahng NGAH-lahn moh" },
      { english: "I am ___", tagalog: "Ako si ___", hiligaynon: "Ako si ___", pronunciation: "ah-KOH see" },
      { english: "I'm hungry!", tagalog: "Gutom na ako!", hiligaynon: "Gutom na ako!", pronunciation: "goo-TOM nah ah-KOH" },
      { english: "I love you", tagalog: "Mahal kita", hiligaynon: "Palangga ta ka", pronunciation: "mah-HAHL kee-TAH / pah-LAHNG-gah tah kah" },
    ],
    reflection: "'Palangga ta ka' — who did you say it to, and what did their face do?",
    gratitudePrompt: "Today I am grateful to the Lord because...",
  },
  {
    id: "banana-cue-adventure",
    order: 18,
    title: "Banana Cue Cooking Adventure",
    subtitle: "The after-school street snack on a stick — caramel, bananas, and happy lines",
    emoji: "🍌",
    category: "Cooking",
    recipeId: "banana-cue",
    date: "2026-08-21",
    time: "9:00 AM",
    materials: ["See the recipe's shopping list (Cooking Academy)", "Bamboo skewers", "Adult hands for the hot caramel step!"],
    canvaLink: "https://www.canva.com/",
    videoLinks: [
      { label: "Banana cue street style (search on YouTube)", url: "https://www.youtube.com/results?search_query=banana+cue+filipino+street+food" },
    ],
    familyChallenge:
      "Set up a Banana Cue Stand at snack time — a real sign, real prices in pesos (Numbers to Market skills!), and family members as customers. Shopkeepers must take orders in Tagalog or Hiligaynon.",
    notes: "Safety emphasis: caramelizing sugar is a grown-ups-only step — kids skewer, count, sell, and eat. Ties back to the Numbers lesson beautifully.",
    sections: [
      {
        heading: "Three O'Clock at the Corner Stand",
        emoji: "🏪",
        body: "School's out, and half the neighborhood is walking the same direction — toward the sizzle. At the corner, Aling Baby stands over a huge black pan where saba bananas tumble in bubbling golden caramel. She spears three onto a stick — thunk, thunk, thunk — and hands it over, still warm, sugar crackling like glass. Fifteen pesos of pure happiness. That's banana cue: the snack that ends every Filipino school day sweetly.",
      },
      {
        heading: "Why 'Cue'?",
        emoji: "🍢",
        body: "The name is a funny story: it comes from 'barbecue' — because it's served on a barbecue stick! Filipinos love putting snacks on sticks.",
        bullets: [
          "Made with saba — a chunky cooking banana, sturdier and less sweet than eating bananas",
          "Rolled in caramelized brown sugar until it forms a crunchy amber shell",
          "Cousin snacks: camote cue (sweet potato) and your old friend turon from July!",
        ],
      },
      {
        heading: "The Sweet Science",
        emoji: "🔥",
        body: "Watch (from a safe distance!) what heat does to plain brown sugar: it melts, turns to liquid gold, then hardens into glassy candy on the banana. That's caramelization — real kitchen chemistry! The grown-ups handle the hot pan; explorers handle the skewers, the counting, and the taste-testing. Everyone handles the eating.",
      },
      {
        heading: "Snack-Stand Words",
        emoji: "💬",
        body: "Every street-food stand runs on these words — practice for your family stand!",
      },
    ],
    phrases: [
      { english: "Banana (cooking type)", tagalog: "Saging na saba", hiligaynon: "Saging nga saba", pronunciation: "SAH-ging (nah/ngah) sah-BAH" },
      { english: "Sugar", tagalog: "Asukal", hiligaynon: "Kalamay", pronunciation: "ah-SOO-kahl / kah-lah-MAI" },
      { english: "Hot! (careful!)", tagalog: "Mainit!", hiligaynon: "Mainit!", pronunciation: "mah-EE-nit" },
      { english: "One stick, please", tagalog: "Isang tusok po", hiligaynon: "Isa ka tusok palihog", pronunciation: "ee-SAHNG TOO-sok poh / ee-SAH kah TOO-sok pah-LEE-hog" },
      { english: "Snack / afternoon treat", tagalog: "Merienda", hiligaynon: "Merienda", pronunciation: "meh-ree-EHN-dah" },
    ],
    reflection: "If your family opened a real snack stand, what would you sell, what would you name it, and who gets to hold the money box?",
    gratitudePrompt: "Today I am grateful to the Lord because...",
  },
  {
    id: "mayon-the-perfect-volcano",
    order: 19,
    title: "Mayon — The Perfect Volcano",
    subtitle: "The most beautiful — and most dramatic — mountain in the Philippines",
    emoji: "🌋",
    category: "Philippines",
    destinationId: "mayon",
    date: "2026-08-24",
    time: "9:00 AM",
    materials: ["Baking soda + vinegar (eruption experiment!)", "A tray and a paper cone", "Red and orange food coloring (optional)"],
    canvaLink: "https://www.canva.com/",
    videoLinks: [
      { label: "Mayon Volcano (search on YouTube)", url: "https://www.youtube.com/results?search_query=mayon+volcano+perfect+cone+4k" },
    ],
    familyChallenge:
      "Build and ERUPT your own Mayon! Paper-cone volcano on a tray, baking soda inside, vinegar with red coloring poured in — stand back and cheer. Then rebuild the villages around it with blocks, because that's what Bicolanos have always done: live bravely beside beauty.",
    notes: "Awards the Mayon passport stamp. Science + geography + resilience in one. Asa's volcano dreams come true today.",
    sections: [
      {
        heading: "The Mountain Too Beautiful to Be Real",
        emoji: "🌋",
        body: "Travelers coming into Albay all do the same thing: they go quiet. Rising out of the green fields is a mountain so perfectly shaped it looks drawn with a compass — a flawless cone wearing a scarf of cloud. Farmers plant rice at its feet. Kids race bikes down its lower roads. And every so often, Mayon reminds everyone she's alive, glowing orange at her peak. The people of Bicol love her anyway. They always have.",
      },
      {
        heading: "The Science of the Perfect Cone",
        emoji: "🔬",
        body: "Mayon is called the world's most perfect volcanic cone — and there's real science behind the beauty.",
        bullets: [
          "A stratovolcano: built layer by layer from its own eruptions, like nature icing a cake for 20,000 years",
          "About 2,462 meters tall — the pride of the Bicol region of Luzon",
          "The most active volcano in the Philippines — scientists watch it around the clock",
          "'Mayon' comes from 'Magayon' — the Bicolano word for BEAUTIFUL",
        ],
      },
      {
        heading: "Living Beside a Giant",
        emoji: "🏡",
        body: "Why do families farm beside a volcano? Because volcano soil is a GIFT — ash makes the land unbelievably rich, growing the greenest rice and the famous spicy Bicol chilies. When Mayon stirs, neighbors help neighbors move to safety — bayanihan again! — and when she calms, they return and replant. It's one of the bravest, most beautiful friendships between people and nature on Earth.",
      },
      {
        heading: "Fire Mountain Words",
        emoji: "💬",
        body: "Words for the day the ground rumbles — say them with drama!",
      },
    ],
    phrases: [
      { english: "Volcano", tagalog: "Bulkan", hiligaynon: "Bulkan", pronunciation: "bool-KAHN" },
      { english: "Fire", tagalog: "Apoy", hiligaynon: "Kalayo", pronunciation: "ah-POY / kah-LAH-yoh" },
      { english: "Smoke", tagalog: "Usok", hiligaynon: "Aso", pronunciation: "OO-sok / ah-SOH" },
      { english: "Beautiful (Bicolano!)", tagalog: "Magayon", hiligaynon: "Magayon", pronunciation: "mah-GAH-yon" },
      { english: "Be careful!", tagalog: "Mag-ingat!", hiligaynon: "Halong!", pronunciation: "mahg-EE-ngaht / HAH-long" },
    ],
    reflection: "The people of Bicol rebuild and replant every time. When something knocks YOUR plans down, what helps your family start again?",
    gratitudePrompt: "Today I am grateful to the Lord because...",
  },
  {
    id: "colors-in-two-languages",
    order: 20,
    title: "A World of Colors",
    subtitle: "Paint your words — every color in Tagalog and Hiligaynon",
    emoji: "🎨",
    category: "Language",
    date: "2026-08-26",
    time: "9:00 AM",
    materials: ["Crayons, markers, or paint", "Paper", "A basket of colorful objects from around the house"],
    canvaLink: "https://www.canva.com/",
    videoLinks: [
      { label: "Colors in Tagalog for kids (search on YouTube)", url: "https://www.youtube.com/results?search_query=colors+in+tagalog+for+kids" },
    ],
    familyChallenge:
      "Color Scavenger Hunt! Teacher calls a color in Tagalog or Hiligaynon — explorers race to bring back something in that color. Last round: everyone paints a mini Philippine flag and labels its colors in both languages.",
    notes: "Unit 2/3 — links back to the flag lesson (Lesson 1) beautifully. Selah's drawing unit-let!",
    sections: [
      {
        heading: "The Jeepney Painter's Rainbow",
        emoji: "🖌️",
        body: "In a workshop in Manila, Mang Rudy dips his brush and lays a stripe of screaming pink down the side of a jeepney, right next to electric blue, mango yellow, and apple green. 'In the Philippines,' he laughs, 'we don't choose ONE color. We choose ALL of them.' Look around any Filipino street — the tricycles, the fiesta banners, the halo-halo — this is a country that speaks in color. Today, you learn to speak it back.",
      },
      {
        heading: "Your Color Words",
        emoji: "🌈",
        body: "Some colors are twins in both languages, some are cousins — listen closely!",
        bullets: [
          "Twins: pula (red), asul (blue), berde (green), puti (white) — same in both!",
          "Cousins: yellow is dilaw in Tagalog but dalag in Hiligaynon; black is itim vs itom",
          "Flag check: what colors did we learn in Lesson 1? Pula, asul, puti, dilaw — now say the flag in Filipino!",
        ],
      },
      {
        heading: "Colors That Mean Something",
        emoji: "🚩",
        body: "Remember the flag: blue for peace, red for courage, white for hope, gold for freedom. Colors in the Philippines aren't just pretty — they carry meaning. Fiesta banners are every color at once because a fiesta celebrates EVERYTHING. What color would your family choose to mean 'us'?",
      },
      {
        heading: "Say It in Color",
        emoji: "💬",
        body: "Point at things while you say them — color words stick when your finger helps!",
      },
    ],
    phrases: [
      { english: "Red", tagalog: "Pula", hiligaynon: "Pula", pronunciation: "poo-LAH" },
      { english: "Blue", tagalog: "Asul", hiligaynon: "Asul", pronunciation: "ah-SOOL" },
      { english: "Yellow", tagalog: "Dilaw", hiligaynon: "Dalag", pronunciation: "dee-LAO / DAH-lahg" },
      { english: "Green", tagalog: "Berde", hiligaynon: "Berde", pronunciation: "BEHR-deh" },
      { english: "White", tagalog: "Puti", hiligaynon: "Puti", pronunciation: "poo-TEE" },
      { english: "Black", tagalog: "Itim", hiligaynon: "Itom", pronunciation: "ee-TEEM / ee-TOM" },
      { english: "What color?", tagalog: "Anong kulay?", hiligaynon: "Ano nga duag?", pronunciation: "AH-nohng KOO-lai / AH-noh ngah doo-AHG" },
    ],
    reflection: "If your family were a color, which would it be — and how do you say it in Tagalog and Hiligaynon?",
    gratitudePrompt: "Today I am grateful to the Lord because...",
  },
  {
    id: "chicken-adobo-family-feast",
    order: 21,
    title: "Chicken Adobo — The Family Feast",
    subtitle: "The unofficial national dish — every Filipino family's most argued-about recipe",
    emoji: "🍗",
    category: "Cooking",
    recipeId: "chicken-adobo",
    date: "2026-08-28",
    time: "9:00 AM",
    materials: ["See the recipe's shopping list (Cooking Academy)", "A big pot with a lid", "Rice for serving (always rice!)"],
    canvaLink: "https://www.canva.com/",
    videoLinks: [
      { label: "Classic chicken adobo (search on YouTube)", url: "https://www.youtube.com/results?search_query=filipino+chicken+adobo+classic+recipe" },
    ],
    familyChallenge:
      "The Adobo Council: after tasting, the whole family votes on ONE change for your next batch — more garlic? sweeter? extra sauce? Write your official family adobo rules in the Cookbook. This recipe will now evolve for generations. Handle with care.",
    notes: "The big one — Ezra's episode. Grandma Jeannie's cooking wisdom formally requested. Longer cook time; start the pot early in class.",
    sections: [
      {
        heading: "The Smell That Means 'Come Home'",
        emoji: "🏠",
        body: "Ask any Filipino living far away what smell makes them homesick, and you'll get one answer: adobo day. Garlic hitting the pan. Soy sauce and vinegar starting their slow, magical argument. Bay leaves floating like little boats. It's the smell that pulled kids in from the street for a hundred years — the smell that says someone loves you enough to make the good dinner.",
      },
      {
        heading: "The Dish That Keeps Itself",
        emoji: "🧪",
        body: "Adobo has a secret superpower — it was invented before refrigerators, and it PRESERVES itself.",
        bullets: [
          "Vinegar + salt + garlic keep the meat good for days — old-time Filipino food science!",
          "Even better: adobo tastes BETTER the next day, after the flavors marry overnight",
          "Every region argues its version is correct: with coconut milk in the south, sweeter in some homes, drier in others",
          "There is no single 'true' adobo — there is only YOUR family's adobo",
        ],
      },
      {
        heading: "The Great Adobo Debate",
        emoji: "⚖️",
        body: "Tonight your family joins a debate as old as the dish: sauce-y or dry? Sweet or sharp? Potatoes — genius or crime? Filipino families defend their adobo style like a family crest, because that's what it is. Whatever you decide today becomes the founding recipe of the Ferrell adobo dynasty. Choose wisely. Or deliciously. Ideally both.",
      },
      {
        heading: "Words from the Adobo Kitchen",
        emoji: "💬",
        body: "The vocabulary of the most important pot in the house:",
      },
    ],
    phrases: [
      { english: "Garlic", tagalog: "Bawang", hiligaynon: "Ahos", pronunciation: "BAH-wahng / AH-hos" },
      { english: "Vinegar", tagalog: "Suka", hiligaynon: "Langgaw", pronunciation: "SOO-kah / lahng-GAO" },
      { english: "Salty", tagalog: "Maalat", hiligaynon: "Maasin", pronunciation: "mah-AH-laht / mah-ah-SEEN" },
      { english: "Sour", tagalog: "Maasim", hiligaynon: "Maaslom", pronunciation: "mah-ah-SEEM / mah-ahs-LOM" },
      { english: "Let's eat!", tagalog: "Kain na!", hiligaynon: "Kaon na!", pronunciation: "KAH-in nah / KAH-on nah" },
      { english: "It's delicious!", tagalog: "Ang sarap!", hiligaynon: "Kanamit!", pronunciation: "ahng sah-RAHP / kah-NAH-meet" },
    ],
    reflection: "Adobo gets better overnight, after everything has time to come together. What else in family life works like that?",
    gratitudePrompt: "Today I am grateful to the Lord because...",
  },
  {
    id: "palawan-the-last-frontier",
    order: 22,
    title: "Palawan — The Last Frontier",
    subtitle: "Underground rivers, glowing lagoons, and the wildest island of them all",
    emoji: "🏞️",
    category: "Philippines",
    destinationId: "palawan",
    date: "2026-08-31",
    time: "9:00 AM",
    materials: ["A cardboard box + blanket (cave build!)", "Flashlights", "Blue and green cellophane or paper (lagoon light)"],
    canvaLink: "https://www.canva.com/",
    videoLinks: [
      { label: "Palawan underground river & lagoons (search on YouTube)", url: "https://www.youtube.com/results?search_query=palawan+underground+river+el+nido+4k" },
    ],
    familyChallenge:
      "Build the Underground River! Make a cave from a box or blanket-fort, line it with blue-green paper, turn off the lights, and paddle through with flashlights while one explorer narrates like a river guide. Bats optional (stuffed animals accepted).",
    notes: "Awards the Palawan passport stamp — completing August's island collection. Strong stewardship/creation-care thread (Unit 10 preview).",
    sections: [
      {
        heading: "The River That Swallows Boats",
        emoji: "🛶",
        body: "The paddle dips quietly. Your little boat slides toward a cliff face — and then, a mouth in the rock, and the world goes dark and cool. You're floating INSIDE a mountain now, on a river that runs underground for kilometers, past rock formations shaped like vegetables and cathedrals, while sleepy swiftlets chirp somewhere above. This is Palawan's Underground River — one of the New 7 Wonders of Nature — and it's real, and it's in the Philippines.",
      },
      {
        heading: "The Last Frontier",
        emoji: "🦜",
        body: "Palawan is called the Philippines' Last Frontier because so much of it is still wonderfully wild.",
        bullets: [
          "The Puerto Princesa Underground River — over 8 km of river inside a mountain",
          "El Nido and Coron — turquoise lagoons between black limestone cliffs that look painted",
          "Home to animals found almost nowhere else: mouse-deer, bearcats, peacock-pheasants, giant sea turtles",
          "Voted the world's most beautiful island — more than once!",
        ],
      },
      {
        heading: "Keeping the Frontier Wild",
        emoji: "🌱",
        body: "Here's what makes Palawan truly special: Filipinos have fought hard to KEEP it this way. Visitor numbers to the Underground River are limited every day. Divers protect the reefs. Kids in Palawan grow up learning that the island isn't theirs to use up — it's theirs to take care of. God's creation, kept carefully — stewardship you can see from a boat. (Nature Explorers unit is coming in October, Asa — this is your preview.)",
      },
      {
        heading: "Explorer Words for Wild Places",
        emoji: "💬",
        body: "The vocabulary of caves, rivers and wild islands — whisper them like you're inside the cave!",
      },
    ],
    phrases: [
      { english: "River", tagalog: "Ilog", hiligaynon: "Suba", pronunciation: "EE-log / SOO-bah" },
      { english: "Cave", tagalog: "Kuweba", hiligaynon: "Kuweba", pronunciation: "koo-WEH-bah" },
      { english: "Forest", tagalog: "Gubat", hiligaynon: "Kagulangan", pronunciation: "GOO-baht / kah-goo-LAH-ngahn" },
      { english: "Animal", tagalog: "Hayop", hiligaynon: "Sapat", pronunciation: "HAH-yop / sah-PAHT" },
      { english: "Dark", tagalog: "Madilim", hiligaynon: "Madulom", pronunciation: "mah-dee-LEEM / mah-doo-LOM" },
      { english: "Amazing / wow!", tagalog: "Grabe!", hiligaynon: "Grabe!", pronunciation: "GRAH-beh" },
    ],
    reflection: "Palawan stays beautiful because people choose to protect it. What's one beautiful thing — a place, a habit, a friendship — your family wants to protect together?",
    gratitudePrompt: "Today I am grateful to the Lord because...",
  },

  // ═══════════════════════════════════════════════════════════
  // SEPTEMBER — "Creatures & Character" (Units 2 · 8 · 6 · 4)
  // ⭐ Feast season: Sep 21 (Day of Atonement) is marked no-class in
  // the Season Calendar; Tabernacles week (~Sep 28–Oct 2) pauses.
  // Dates STILL pending confirmation from Shaun & Taylor.
  // ═══════════════════════════════════════════════════════════
  {
    id: "food-words-around-the-table",
    order: 23,
    title: "Busog na Ako! Food Words",
    subtitle: "The words that fill a Filipino table — say them and you'll never go hungry",
    emoji: "🍚",
    category: "Language",
    date: "2026-09-02",
    time: "9:00 AM",
    materials: ["Real or toy food items", "Paper plates", "A basket or bayong (market bag)"],
    canvaLink: "https://www.canva.com/",
    videoLinks: [
      { label: "Filipino food words for kids (search on YouTube)", url: "https://www.youtube.com/results?search_query=filipino+food+words+for+kids" },
    ],
    familyChallenge:
      "Play 'Merienda Market'! Set out real or toy food, put paper-peso prices on each, and take turns buying snacks — but you can only ask for food using its Tagalog or Hiligaynon name. No name, no snack!",
    notes: "Unit 2/3 vocabulary. Teacher: verify Hiligaynon food terms below.",
    sections: [
      {
        heading: "The Table That Always Has Room",
        emoji: "🍽️",
        body: "Walk past any Filipino home around noon and you'll hear the same beautiful sentence float out the window: 'Kain tayo!' — Let's eat! It isn't just an invitation to family. It's for the neighbor, the delivery driver, the friend who 'just dropped by.' In the Philippines, there is always one more plate, always more rice in the pot. Food isn't only for filling tummies — it's how love is served. Today you learn the words for the fullest table in the world.",
      },
      {
        heading: "The Words on Every Plate",
        emoji: "🍛",
        body: "Rice is the center of every Filipino meal — so important it has its own words. Around it goes everything else!",
        bullets: [
          "Kanin (rice) is the star — a meal without rice barely counts as a meal!",
          "Ulam is the word for 'the thing you eat WITH rice' — chicken, fish, vegetables, anything",
          "Manok (chicken), isda (fish), gulay (vegetables), itlog (egg) — the everyday ulam",
          "Tubig (water) and, for merienda, something sweet — your halo-halo and banana cue!",
        ],
      },
      {
        heading: "From Hungry to Happy-Full",
        emoji: "😋",
        body: "Filipinos have a wonderful word most languages don't: 'busog' — that warm, sleepy, perfectly-full feeling after a good meal. You go from 'gutom' (hungry) to 'busog' (full), and the whole journey is delicious. When someone feeds you well, the kindest thank-you is: 'Salamat, busog na ako!' — Thank you, I'm full!",
      },
      {
        heading: "Say It Before You Eat It",
        emoji: "💬",
        body: "Point at each food and say its name before your next meal — your tummy will learn the words with you!",
      },
    ],
    phrases: [
      { english: "Let's eat!", tagalog: "Kain na!", hiligaynon: "Kaon na!", pronunciation: "KAH-in nah / KAH-on nah" },
      { english: "Chicken", tagalog: "Manok", hiligaynon: "Manok", pronunciation: "mah-NOK" },
      { english: "Vegetables", tagalog: "Gulay", hiligaynon: "Utan", pronunciation: "GOO-lai / OO-tahn" },
      { english: "Egg", tagalog: "Itlog", hiligaynon: "Itlog", pronunciation: "eet-LOG" },
      { english: "Bread", tagalog: "Tinapay", hiligaynon: "Tinapay", pronunciation: "tee-nah-PAI" },
      { english: "I'm hungry", tagalog: "Gutom na ako", hiligaynon: "Gutom na ako", pronunciation: "goo-TOM nah ah-KOH" },
      { english: "I'm full!", tagalog: "Busog na ako!", hiligaynon: "Busog na ako!", pronunciation: "boo-SOG nah ah-KOH" },
    ],
    reflection: "'Kain tayo' means everyone is welcome at the table. Who could YOUR family invite to share a meal this week?",
    gratitudePrompt: "Today I am grateful to the Lord because...",
  },
  {
    id: "baking-academy-sweet-cookies",
    order: 24,
    title: "Baking Academy: Sweet Cookies",
    subtitle: "The Baking Academy opens — measuring, mixing, and the magic of the oven",
    emoji: "🍪",
    category: "Cooking",
    date: "2026-09-04",
    time: "9:00 AM",
    materials: ["1½ cups flour", "½ cup butter (softened)", "½ cup sugar", "1 egg", "1 tsp vanilla", "½ tsp baking soda, pinch of salt", "Mixing bowls, spoons, measuring cups", "Baking tray + oven (grown-up's job!)"],
    canvaLink: "https://www.canva.com/",
    videoLinks: [
      { label: "Easy cookies with kids (search on YouTube)", url: "https://www.youtube.com/results?search_query=easy+cookies+baking+with+kids" },
    ],
    familyChallenge:
      "Head Baker Selah leads! After baking, decorate your cookies and give each one a name. Deliver a plate to someone outside your family — a neighbor, a friend — because the best part of baking is sharing it.",
    notes: "Baking Academy opens (Selah's unit). No linked recipe card — the simple recipe lives in the sections below. Teaches measuring (real math!), mixing, patience, sharing.",
    sections: [
      {
        heading: "Selah's Big Day",
        emoji: "👩‍🍳",
        body: "Today the kitchen belongs to Selah. She ties on the apron, stands on the little stool, and looks at the flour, the butter, the sugar — and something wonderful happens. These plain, boring ingredients are about to become warm, golden cookies that make the whole house smell like a hug. That's the secret of baking: it's a little bit science, a little bit patience, and a whole lot of love. Welcome to the Baking Academy, explorers!",
      },
      {
        heading: "What You'll Bake",
        emoji: "🧺",
        body: "Gather your ingredients like a real baker — line them up before you start (bakers call this 'mise en place,' which just means 'everything in its place').",
        bullets: [
          "1½ cups flour · ½ cup soft butter · ½ cup sugar",
          "1 egg · 1 teaspoon vanilla",
          "½ teaspoon baking soda · a pinch of salt",
          "Makes about 12 cookies — enough to share!",
        ],
      },
      {
        heading: "Let's Bake! (Measuring Is Math)",
        emoji: "🥄",
        body: "Here's the explorer's secret — baking is MATH you can eat. Every 'half cup' and 'one teaspoon' is a fraction; doubling the recipe is multiplication. Measure carefully and you're doing math without a worksheet!",
        bullets: [
          "1. Cream the soft butter and sugar until fluffy — count 100 stirs together!",
          "2. Mix in the egg and vanilla",
          "3. Add flour, baking soda, and salt — stir until it's dough",
          "4. Roll little balls, place on the tray, and let a grown-up bake at 180°C (350°F) for about 10 minutes",
          "5. Wait for them to cool (the hardest part!) — patience is a baking ingredient too",
        ],
      },
      {
        heading: "Baker's Words",
        emoji: "💬",
        body: "Every kitchen has its own language — learn the baker's words!",
      },
    ],
    phrases: [
      { english: "Flour", tagalog: "Harina", hiligaynon: "Harina", pronunciation: "hah-REE-nah" },
      { english: "Sugar", tagalog: "Asukal", hiligaynon: "Kalamay", pronunciation: "ah-SOO-kahl / kah-lah-MAI" },
      { english: "To mix", tagalog: "Haluin", hiligaynon: "Lakton", pronunciation: "hah-loo-EEN / lahk-TON" },
      { english: "To bake", tagalog: "Maghurno", hiligaynon: "Maghurno", pronunciation: "mahg-HOOR-noh" },
      { english: "Sweet", tagalog: "Matamis", hiligaynon: "Matam-is", pronunciation: "mah-tah-MEES / mah-TAHM-ees" },
      { english: "Share", tagalog: "Magbahagi", hiligaynon: "Magpartihanay", pronunciation: "mahg-bah-HAH-gee / mahg-pahr-tee-HAH-nai" },
    ],
    reflection: "Baking takes patience and careful measuring. What's something you're learning to do slowly and carefully, one step at a time?",
    gratitudePrompt: "Today I am grateful to the Lord because...",
  },
  {
    id: "tarsier-big-eyes-in-the-forest",
    order: 25,
    title: "The Tarsier — Big Eyes in the Forest",
    subtitle: "Meet the tiny wide-eyed creature that fits in your hand and only lives here",
    emoji: "🐒",
    category: "Philippines",
    date: "2026-09-07",
    time: "9:00 AM",
    materials: ["Paper plates or cardboard (mask-making!)", "Big googly eyes or paper circles", "Crayons, markers", "Selah's drawing supplies"],
    canvaLink: "https://www.canva.com/",
    videoLinks: [
      { label: "Philippine tarsier (search on YouTube)", url: "https://www.youtube.com/results?search_query=philippine+tarsier+bohol" },
    ],
    familyChallenge:
      "Two-part animal adventure! Selah draws the tarsier's giant eyes up close; Rylee leads a tarsier mask craft from paper plates. Then everyone tries the tarsier challenge: sit perfectly STILL and QUIET for two whole minutes, like a tarsier hiding — hardest game ever!",
    notes: "Unit 6 Animals opens. Conservation = stewardship of God's creation. Rylee (animals) + Selah (drawing) both lead. Animal words also in config/languages.ts.",
    sections: [
      {
        heading: "The Eyes in the Dark",
        emoji: "🌙",
        body: "It's midnight in the forest of Bohol, and something is watching. Two enormous round eyes — each one bigger than its own brain — blink from a tree branch. It's a tarsier: a creature so small it could sit in your palm, so shy it hides all day, and so special it lives almost nowhere else on Earth but here. It turns its head almost all the way around, like a tiny owl, fixes those huge eyes on a moth… and leaps. Meet one of the Philippines' most precious little treasures.",
      },
      {
        heading: "The Smallest Big-Eyed Wonder",
        emoji: "👀",
        body: "The Philippine tarsier is packed with 'world's most' surprises for something so tiny!",
        bullets: [
          "One of the smallest primates on Earth — about the size of your fist",
          "Its eyes are so big it CAN'T move them — so it turns its head almost 180°, like an owl",
          "It can leap many times its own length between trees in the dark",
          "It talks in sounds too high for humans to hear — a secret song only tarsiers know",
        ],
      },
      {
        heading: "Tiny, and in Trouble",
        emoji: "🌳",
        body: "Here's the serious part, explorers. Tarsiers are endangered — there aren't many left, because their forest homes are being cut down. They're so gentle and shy that being kept as pets makes them sad and sick. But the good news: Filipinos have built safe sanctuaries in Bohol where tarsiers live protected, and where visitors must be quiet and kind. Caring for the smallest creatures is part of caring for God's creation — every wide-eyed one matters.",
      },
      {
        heading: "Forest Words",
        emoji: "💬",
        body: "The vocabulary of the night forest — say the small words softly, like you might scare a tarsier!",
      },
    ],
    phrases: [
      { english: "Animal", tagalog: "Hayop", hiligaynon: "Sapat", pronunciation: "HAH-yop / sah-PAHT" },
      { english: "Eyes", tagalog: "Mata", hiligaynon: "Mata", pronunciation: "mah-TAH" },
      { english: "Small", tagalog: "Maliit", hiligaynon: "Gamay", pronunciation: "mah-lee-EET / gah-MAI" },
      { english: "Tree", tagalog: "Puno", hiligaynon: "Kahoy", pronunciation: "POO-noh / KAH-hoy" },
      { english: "Night", tagalog: "Gabi", hiligaynon: "Gab-i", pronunciation: "gah-BEE / GAHB-ee" },
      { english: "Forest", tagalog: "Gubat", hiligaynon: "Kagulangan", pronunciation: "GOO-baht / kah-goo-LAH-ngahn" },
    ],
    reflection: "The tiny, shy tarsier is protected because people decided it was worth caring for. Who or what is small and gentle that YOUR family can help take care of?",
    gratitudePrompt: "Today I am grateful to the Lord because...",
  },
  {
    id: "helping-others-bayanihan-hearts",
    order: 26,
    title: "Helping Others — Tulong",
    subtitle: "Serving one another humbly in love — the Filipino way of the helping hand",
    emoji: "🤲",
    category: "Values",
    date: "2026-09-09",
    time: "9:00 AM",
    materials: ["A jar or box (the 'Helper's Jar')", "Small paper slips", "A pen"],
    canvaLink: "https://www.canva.com/",
    videoLinks: [
      { label: "Kindness & helping stories for kids (search on YouTube)", url: "https://www.youtube.com/results?search_query=helping+others+kindness+story+for+kids" },
    ],
    familyChallenge:
      "Start a Helper's Jar this week. Every time someone in the family helps another person — without being asked — write it on a slip and drop it in. On Friday, read them all aloud together and thank each helper. Watch the jar fill up with love!",
    notes: "Unit 4/11 Values. Verse: Galatians 5:13. Includes Story · Discussion · Reflection · Challenge · Real example (per CONTENT_GUIDELINES values structure). Deepens the bayanihan lesson.",
    sections: [
      {
        heading: "The Boy Who Carried the Basket",
        emoji: "🧺",
        body: "Old Aling Rosa was walking home from the market, her basket heavy with rice and vegetables, stopping every few steps to rest her tired arms. A boy named Miguel was playing basketball with his friends nearby. He could have kept playing — nobody would have blamed him. But he saw her, jogged over, and simply said, 'Ako na po' — let me carry it. He walked the whole way to her door, chatting about her grandchildren, then ran back to his game. He didn't do it for a reward. He did it because a heavy basket and a helping hand belong together.",
      },
      {
        heading: "Let's Talk About It",
        emoji: "💬",
        body: "Gather close — this is family table talk, not a test. There are no wrong answers.",
        bullets: [
          "Why do you think Miguel helped, even though no one asked him to?",
          "When was a time someone helped YOU when you really needed it? How did it feel?",
          "Is it still helping if you only do it hoping to be thanked or paid?",
          "Who around us — at home, next door, at church — might need a helping hand this week?",
        ],
      },
      {
        heading: "What God Says About Helping",
        emoji: "📖",
        body: "The Bible gives us the heart behind the helping hand: 'Serve one another humbly in love.' (Galatians 5:13) 'Humbly' is the key word — real helping doesn't show off or keep score. It just quietly makes someone's load lighter, the way Miguel did. This is bayanihan grown small enough to fit in one kind child's hands.",
      },
      {
        heading: "Words of the Helping Hand",
        emoji: "🤝",
        body: "Say these — then go find someone to say 'Ako na' to!",
      },
    ],
    phrases: [
      { english: "Help", tagalog: "Tulong", hiligaynon: "Bulig", pronunciation: "TOO-long / BOO-lig" },
      { english: "Let me (do it)", tagalog: "Ako na", hiligaynon: "Ako na lang", pronunciation: "ah-KOH nah" },
      { english: "Can I help you?", tagalog: "Tutulong ako?", hiligaynon: "Mabulig ako?", pronunciation: "too-TOO-long ah-KOH / mah-BOO-lig ah-KOH" },
      { english: "Thank you", tagalog: "Salamat", hiligaynon: "Salamat", pronunciation: "sah-LAH-maht" },
      { english: "You're welcome", tagalog: "Walang anuman", hiligaynon: "Wala sing ano man", pronunciation: "wah-LAHNG ah-noo-MAHN / wah-LAH sing AH-noh mahn" },
    ],
    reflection: "Miguel helped without being asked. What is one thing you could do this week to make someone's 'basket' a little lighter?",
    gratitudePrompt: "Today I am grateful to the Lord because...",
  },
  {
    id: "baking-academy-cupcakes",
    order: 27,
    title: "Baking Academy: Happy Cupcakes",
    subtitle: "Little cakes with big hats of frosting — where baking becomes art",
    emoji: "🧁",
    category: "Cooking",
    date: "2026-09-11",
    time: "9:00 AM",
    materials: ["1 cup flour", "½ cup sugar", "⅓ cup butter (soft)", "1 egg, ½ cup milk", "1 tsp baking powder, splash of vanilla", "Frosting + sprinkles for decorating", "Cupcake liners + muffin tray (oven = grown-up!)"],
    canvaLink: "https://www.canva.com/",
    videoLinks: [
      { label: "Cupcake decorating for kids (search on YouTube)", url: "https://www.youtube.com/results?search_query=cupcake+decorating+for+kids" },
    ],
    familyChallenge:
      "Cupcake Art Show! Everyone decorates their own cupcake into a 'character' — a face, an animal, a tiny scene. Selah is head judge. Photograph your gallery for the Family Cookbook before you eat the artwork!",
    notes: "Baking Academy (Selah's unit). Recipe lives in the sections (no recipe card). Focus: measuring, following steps in order, decorating creativity, patience.",
    sections: [
      {
        heading: "Cakes You Can Hold",
        emoji: "🧁",
        body: "Last week we baked cookies — today we go BIGGER (well, taller!). A cupcake is a whole little cake that fits in your hand, wearing a swirl of frosting like a fancy hat. The best part? Every single one can be different. In a Filipino fiesta, the dessert table is a rainbow, and cupcakes are little edible gifts you can decorate to match anyone you love. Aprons on — today the Baking Academy becomes an art studio.",
      },
      {
        heading: "What You'll Bake",
        emoji: "🧺",
        body: "Line up your ingredients first — a good baker is a tidy baker!",
        bullets: [
          "1 cup flour · ½ cup sugar · ⅓ cup soft butter",
          "1 egg · ½ cup milk · a splash of vanilla",
          "1 teaspoon baking powder",
          "Makes about 8 cupcakes — plus frosting and sprinkles to decorate",
        ],
      },
      {
        heading: "Let's Bake! (Follow the Order)",
        emoji: "🥄",
        body: "Baking is like a treasure map — the steps must happen IN ORDER, or the treasure doesn't appear. Read each step aloud before you do it!",
        bullets: [
          "1. Cream soft butter and sugar until pale and fluffy",
          "2. Beat in the egg and vanilla, then add milk",
          "3. Gently stir in flour and baking powder — don't over-mix!",
          "4. Spoon into liners, filling each ⅔ full (that's a fraction — leave room to rise!)",
          "5. Grown-up bakes at 180°C (350°F) about 18 minutes; cool completely, THEN decorate",
        ],
      },
      {
        heading: "Sweet Studio Words",
        emoji: "💬",
        body: "The vocabulary of the frosting artist:",
      },
    ],
    phrases: [
      { english: "Cake", tagalog: "Keyk", hiligaynon: "Keyk", pronunciation: "kayk" },
      { english: "Milk", tagalog: "Gatas", hiligaynon: "Gatas", pronunciation: "GAH-tahs" },
      { english: "Egg", tagalog: "Itlog", hiligaynon: "Itlog", pronunciation: "eet-LOG" },
      { english: "Colorful", tagalog: "Makulay", hiligaynon: "Madamo nga kolor", pronunciation: "mah-KOO-lai / mah-DAH-moh ngah KOH-lor" },
      { english: "Beautiful!", tagalog: "Ang ganda!", hiligaynon: "Katahum!", pronunciation: "ahng gahn-DAH / kah-TAH-hoom" },
      { english: "For you", tagalog: "Para sa'yo", hiligaynon: "Para sa imo", pronunciation: "PAH-rah sah-YOH / PAH-rah sah EE-moh" },
    ],
    reflection: "You made a cupcake into something special just for someone. Who did you think of — and why them?",
    gratitudePrompt: "Today I am grateful to the Lord because...",
  },
  {
    id: "philippine-eagle-king-of-the-sky",
    order: 28,
    title: "The Philippine Eagle — King of the Sky",
    subtitle: "One of the biggest, rarest eagles on Earth — the proud national bird",
    emoji: "🦅",
    category: "Philippines",
    date: "2026-09-14",
    time: "9:00 AM",
    materials: ["Paper + crayons (feather drawing)", "Paper towel rolls (spyglass for eagle-watching!)", "Rylee's craft supplies"],
    canvaLink: "https://www.canva.com/",
    videoLinks: [
      { label: "Philippine Eagle (search on YouTube)", url: "https://www.youtube.com/results?search_query=philippine+eagle+haribon" },
    ],
    familyChallenge:
      "Become Eagle Guardians! Rylee leads a feather-craft or eagle-wing drawing. Then make paper-roll 'spyglasses' and go on a backyard bird-watch — count every bird you spot and give thanks that your family is helping watch over God's flying creatures.",
    notes: "Unit 6 Animals. The national bird — pairs with the national symbols lesson (Lesson 5). Strong stewardship theme; critically endangered. Rylee (animals) leads.",
    sections: [
      {
        heading: "The Shadow with a Ten-Foot Reach",
        emoji: "🌤️",
        body: "High over the rainforests of Mindanao, a shadow slides across the treetops. Look up — it's enormous. Wings wider than a doorway, a proud crown of feathers standing up like a lion's mane, and eyes that can spot a monkey moving in the leaves from far, far away. This is the Philippine Eagle, once called the 'monkey-eating eagle,' now known by a prouder name: Haribon — from 'Hari ng mga Ibon,' the KING of the birds. And it lives nowhere on Earth but here.",
      },
      {
        heading: "A Bird of Records",
        emoji: "🦅",
        body: "The Philippine Eagle is one of the largest and most powerful eagles alive — and the national bird of the Philippines.",
        bullets: [
          "Wingspan up to 2 meters — stretch your arms wide, then imagine wider!",
          "That crown of feathers makes it look like it's wearing a spiky headdress",
          "Eagle pairs stay together for life and raise just ONE eaglet every two years",
          "Declared the national bird — harming one is against the law in the Philippines",
        ],
      },
      {
        heading: "The King That Needs Our Help",
        emoji: "🌳",
        body: "Here's the part that matters most, Eagle Guardians. There are only a few hundred Philippine Eagles left in the wild — they're critically endangered, because their rainforest homes are disappearing. But Filipinos refuse to let the king fall: scientists at the Philippine Eagle Center raise eaglets and release them, and schoolchildren all over the country plant trees to grow the forests back. Protecting the mightiest bird is part of caring for all of God's creation — even the king of the sky needs a helping hand.",
      },
      {
        heading: "Words That Soar",
        emoji: "💬",
        body: "Sky words and bird words — say them big and bold, like an eagle's cry!",
      },
    ],
    phrases: [
      { english: "Bird", tagalog: "Ibon", hiligaynon: "Pispis", pronunciation: "EE-bon / PEES-pees" },
      { english: "King", tagalog: "Hari", hiligaynon: "Hari", pronunciation: "HAH-ree" },
      { english: "Wing", tagalog: "Pakpak", hiligaynon: "Pakpak", pronunciation: "pahk-PAHK" },
      { english: "To fly", tagalog: "Lumipad", hiligaynon: "Maglupad", pronunciation: "loo-mee-PAHD / mahg-loo-PAHD" },
      { english: "Sky", tagalog: "Langit", hiligaynon: "Langit", pronunciation: "LAH-ngit" },
      { english: "Big / great", tagalog: "Malaki", hiligaynon: "Daku", pronunciation: "mah-lah-KEE / dah-KOO" },
    ],
    reflection: "Filipinos protect the eagle because it's a treasure worth saving. What's something precious your family works together to protect?",
    gratitudePrompt: "Today I am grateful to the Lord because...",
  },
  {
    id: "gratitude-a-thankful-heart",
    order: 29,
    title: "Gratitude — A Thankful Heart",
    subtitle: "Giving thanks in all things — the secret to a happy Filipino home",
    emoji: "🙏",
    category: "Values",
    date: "2026-09-16",
    time: "9:00 AM",
    materials: ["A jar or box (Gratitude Jar)", "Colorful paper slips", "Pens or crayons"],
    canvaLink: "https://www.canva.com/",
    videoLinks: [
      { label: "Gratitude for kids (search on YouTube)", url: "https://www.youtube.com/results?search_query=gratitude+thankfulness+for+kids" },
    ],
    familyChallenge:
      "Build a Gratitude Jar for the whole family. Each night this week, everyone writes (or draws) ONE thing they're thankful to God for and drops it in. Next Sunday, read them all aloud — a jar full of blessings you almost forgot you had.",
    notes: "Unit 4/11 Values. Verse: 1 Thessalonians 5:18. Connects directly to the daily Morning Blessings feature. Full values structure.",
    sections: [
      {
        heading: "The Girl Who Counted Stars Instead of Problems",
        emoji: "🌟",
        body: "Ana's family didn't have much. The roof leaked when it rained, and dinner was often just rice and dried fish. One night, tired and a little sad, Ana climbed to the window with her Lola. 'Apo,' Lola whispered, 'let's not count what's missing tonight. Let's count what's here.' So they did. A dry corner to sleep in. Rice in their bellies. Each other. The stars, which are free. By the time they finished counting, Ana was smiling — and she hadn't gotten a single new thing. She'd just remembered what she already had.",
      },
      {
        heading: "Let's Talk About It",
        emoji: "💬",
        body: "Pull up close for family talk — every answer is welcome.",
        bullets: [
          "Lola said 'count what's here, not what's missing.' Why does that change how you feel?",
          "What's something small you have that's easy to forget to be thankful for?",
          "Is it harder to be grateful on a hard day? Can we still find one thing?",
          "How does it feel when someone says a real 'thank you' to YOU?",
        ],
      },
      {
        heading: "What God Says About Thankfulness",
        emoji: "📖",
        body: "The Bible gives gratitude a beautiful home: 'Give thanks in all circumstances.' (1 Thessalonians 5:18) Not only on the good days — in ALL of them. That's the secret Lola knew. A thankful heart doesn't wait for everything to be perfect; it finds the gifts already there. This is why every Wonder Journey morning begins with Morning Blessings — we start each day counting what's here.",
      },
      {
        heading: "Words of Thanks",
        emoji: "💛",
        body: "The most important words in any language — say them like you mean them!",
      },
    ],
    phrases: [
      { english: "Thank you", tagalog: "Salamat", hiligaynon: "Salamat", pronunciation: "sah-LAH-maht" },
      { english: "Thank you very much", tagalog: "Maraming salamat", hiligaynon: "Salamat gid", pronunciation: "mah-RAH-ming sah-LAH-maht / sah-LAH-maht geed" },
      { english: "Thanks be to God", tagalog: "Salamat sa Diyos", hiligaynon: "Salamat sa Dios", pronunciation: "sah-LAH-maht sah dee-YOS" },
      { english: "Blessing", tagalog: "Biyaya", hiligaynon: "Bugay", pronunciation: "bee-YAH-yah / BOO-gai" },
      { english: "Happy / glad", tagalog: "Masaya", hiligaynon: "Malipayon", pronunciation: "mah-SAH-yah / mah-lee-pah-YON" },
    ],
    reflection: "Ana felt richer just by remembering her blessings. What are three things you're thankful to God for right now — small ones count most!",
    gratitudePrompt: "Today I am grateful to the Lord because...",
  },
  {
    id: "baking-academy-brownies",
    order: 30,
    title: "Baking Academy: Fudgy Brownies",
    subtitle: "Warm, chocolatey squares — and a little kitchen chemistry",
    emoji: "🍫",
    category: "Cooking",
    date: "2026-09-18",
    time: "9:00 AM",
    materials: ["½ cup butter", "1 cup sugar", "2 eggs, 1 tsp vanilla", "½ cup flour", "⅓ cup cocoa powder, pinch of salt", "Square pan + oven (grown-up!)"],
    canvaLink: "https://www.canva.com/",
    videoLinks: [
      { label: "Easy brownies with kids (search on YouTube)", url: "https://www.youtube.com/results?search_query=easy+fudgy+brownies+kids" },
    ],
    familyChallenge:
      "The Great Cut-and-Share: brownies are baked in one big pan, so YOU must divide them fairly for everyone (more fraction math — halves, quarters, equal squares!). Then deliver two squares to someone who had a hard week.",
    notes: "Baking Academy. Recipe in sections. Focus: kitchen chemistry (melting, cocoa), fair-sharing fractions, generosity. Grown-ups handle melting + oven.",
    sections: [
      {
        heading: "The Smell That Stops Everyone",
        emoji: "🍫",
        body: "There is no smell on Earth quite like brownies in the oven. It drifts through the whole house, and one by one, everyone appears in the kitchen doorway with the same hopeful question in their eyes: 'Is it ready yet?' Brownies are the coziest thing the Baking Academy makes — a little crackly on top, warm and fudgy inside. Today we bake happiness in a square pan, and then we do the hardest, most generous thing: we share it fairly.",
      },
      {
        heading: "What You'll Bake",
        emoji: "🧺",
        body: "Everything in its place before the mixing begins!",
        bullets: [
          "½ cup melted butter · 1 cup sugar",
          "2 eggs · 1 teaspoon vanilla",
          "½ cup flour · ⅓ cup cocoa powder · a pinch of salt",
          "Makes one pan — enough squares to share generously",
        ],
      },
      {
        heading: "Let's Bake! (A Little Chemistry)",
        emoji: "🔬",
        body: "Watch the science! A grown-up MELTS the butter — solid turns to liquid with heat. Cocoa powder is dried, ground-up chocolate that wakes up when it meets the wet ingredients. Baking is chemistry you can eat!",
        bullets: [
          "1. Grown-up melts the butter, then stir in the sugar",
          "2. Beat in eggs and vanilla until glossy",
          "3. Sift in flour, cocoa, and salt — fold gently until just mixed",
          "4. Pour into the pan and smooth the top",
          "5. Grown-up bakes at 175°C (350°F) about 25 minutes; cool before cutting so they hold their shape",
        ],
      },
      {
        heading: "Chocolate Kitchen Words",
        emoji: "💬",
        body: "The vocabulary of the coziest bake — say the sweet ones twice!",
      },
    ],
    phrases: [
      { english: "Chocolate", tagalog: "Tsokolate", hiligaynon: "Tsokolate", pronunciation: "choh-koh-LAH-teh" },
      { english: "To melt", tagalog: "Matunaw", hiligaynon: "Matunaw", pronunciation: "mah-TOO-nao" },
      { english: "Warm", tagalog: "Mainit-init", hiligaynon: "Mainit-init", pronunciation: "mah-ee-nit-EE-nit" },
      { english: "To divide / share out", tagalog: "Hatiin", hiligaynon: "Partihon", pronunciation: "hah-tee-EEN / pahr-tee-HON" },
      { english: "Equal / fair", tagalog: "Patas / pantay", hiligaynon: "Patas", pronunciation: "PAH-tahs / pahn-TAI" },
      { english: "Delicious!", tagalog: "Ang sarap!", hiligaynon: "Kanamit!", pronunciation: "ahng sah-RAHP / kah-NAH-meet" },
    ],
    reflection: "Sharing one pan fairly takes both math AND kindness. Was it easy or hard to share equally — and who did you choose to give brownies to?",
    gratitudePrompt: "Today I am grateful to the Lord because...",
  },
  {
    id: "carabao-the-farmers-best-friend",
    order: 31,
    title: "The Carabao — The Farmer's Best Friend",
    subtitle: "The strong, gentle water buffalo who helped build the whole countryside",
    emoji: "🐃",
    category: "Philippines",
    date: "2026-09-23",
    time: "9:00 AM",
    materials: ["Brown clay or playdough (sculpt a carabao!)", "Craft sticks (for a little plow/cart)", "Asa's building supplies"],
    canvaLink: "https://www.canva.com/",
    videoLinks: [
      { label: "Carabao — the Filipino water buffalo (search on YouTube)", url: "https://www.youtube.com/results?search_query=carabao+philippines+farm" },
    ],
    familyChallenge:
      "Asa leads a Carabao Build! Sculpt a carabao from clay and build it a little cart or plow from craft sticks. Then try the 'carabao's job': everyone slowly, patiently pulls a loaded laundry basket across the room — feel how hard the carabao works every single day!",
    notes: "Unit 6 Animals. The beloved national animal / hardest worker in the barrio — pairs with the National Symbols lesson. Asa (building/animals/vehicles) leads. Tagalog-only vocabulary.",
    sections: [
      {
        heading: "Before the Sun, the Carabao",
        emoji: "🌅",
        body: "Long before the rooster finishes crowing, Mang Tino is already in the rice field — and beside him, calm and enormous, is Toto the carabao. Together they walk the muddy rows, the carabao pulling the heavy plow through the earth without complaint, its great curved horns swinging slowly, its wide feet made perfectly for the mud. When the sun gets hot, Toto sinks into a cool puddle with a happy sigh. Farmer and carabao have worked side by side like this in the Philippines for hundreds of years — the truest of friends.",
      },
      {
        heading: "The Gentle Giant of the Barrio",
        emoji: "🐃",
        body: "The carabao — a kind of water buffalo — is the beloved national animal of the Philippines, and the hardest worker in the countryside.",
        bullets: [
          "Incredibly strong — it pulls plows and carts loaded with rice, coconuts, and firewood",
          "Loves water and mud — a cool wallow keeps its skin protected from the hot sun",
          "Gives creamy milk that makes a special cheese called kesong puti and the sweet treat pastillas",
          "Famous for being patient and gentle — Filipinos even call a calm, hardworking person 'parang carabao' (like a carabao)",
        ],
      },
      {
        heading: "Slow, Steady, and Strong",
        emoji: "💪",
        body: "The carabao teaches something the fast world forgets: you don't have to be quick to be mighty. Step by patient step, the carabao helped grow the rice that fed the nation and helped carve those Banaue terraces we visited. It never rushes and it never quits. When your family has a big, hard, slow job ahead — remember Toto. Steady wins.",
      },
      {
        heading: "Farm Words (Tagalog)",
        emoji: "💬",
        body: "The vocabulary of the rice field — say each one, then use it while you build!",
      },
    ],
    phrases: [
      { english: "Water buffalo (carabao)", tagalog: "Kalabaw", pronunciation: "kah-lah-BAO" },
      { english: "Farmer", tagalog: "Magsasaka", pronunciation: "mahg-sah-SAH-kah" },
      { english: "Field / farm", tagalog: "Bukid", pronunciation: "boo-KID" },
      { english: "Strong", tagalog: "Malakas", pronunciation: "mah-lah-KAHS" },
      { english: "To work", tagalog: "Magtrabaho", pronunciation: "mahg-trah-BAH-hoh" },
      { english: "Patient", tagalog: "Matiyaga", pronunciation: "mah-tee-YAH-gah" },
    ],
    reflection: "The carabao is strong because it's patient and never quits. What's a slow, hard job your family can tackle 'like a carabao' — one steady step at a time?",
    gratitudePrompt: "Today I am grateful to the Lord because...",
  },
  {
    id: "baking-academy-banana-bread",
    order: 32,
    title: "Baking Academy: Banana Bread",
    subtitle: "Turning too-ripe bananas into the coziest loaf — nothing wasted, everything loved",
    emoji: "🍞",
    category: "Cooking",
    date: "2026-09-25",
    time: "9:00 AM",
    materials: ["3 very ripe bananas", "⅓ cup melted butter", "½ cup sugar, 1 egg, 1 tsp vanilla", "1½ cups flour, 1 tsp baking soda, pinch of salt", "A loaf pan + oven (grown-up!)"],
    canvaLink: "https://www.canva.com/",
    videoLinks: [
      { label: "Easy banana bread with kids (search on YouTube)", url: "https://www.youtube.com/results?search_query=easy+banana+bread+with+kids" },
    ],
    familyChallenge:
      "Banana Bread Kindness Delivery: your loaf makes the house smell amazing — so bake it, slice it, wrap two pieces, and bring them warm to a neighbor or friend 'just because.' Baking is best when it leaves your own kitchen.",
    notes: "Baking Academy finale-ish for September. Recipe in sections. Themes: no-waste resourcefulness (rescuing ripe bananas), mashing/mixing, generosity. Tagalog-only vocabulary.",
    sections: [
      {
        heading: "The Bananas Nobody Wanted",
        emoji: "🍌",
        body: "On the kitchen counter sit three sad bananas — brown, spotty, too soft to peel and eat. Most people would throw them away. But a Filipino lola knows a secret: those are not spoiled bananas. Those are banana bread WAITING to happen! The riper and browner the banana, the sweeter and cozier the loaf. Today the Baking Academy performs a little kitchen magic — turning something nobody wanted into something everybody loves. Nothing wasted, everything loved.",
      },
      {
        heading: "What You'll Bake",
        emoji: "🧺",
        body: "The riper the bananas, the better — this is the recipe that saves them!",
        bullets: [
          "3 very ripe (brown-spotted) bananas · ⅓ cup melted butter",
          "½ cup sugar · 1 egg · 1 teaspoon vanilla",
          "1½ cups flour · 1 teaspoon baking soda · a pinch of salt",
          "Makes one loaf — about 8 cozy slices to share",
        ],
      },
      {
        heading: "Let's Bake! (Mash and Mix)",
        emoji: "🥄",
        body: "This is the most fun mixing job in the whole Academy — the mashing! Little hands are perfect for it.",
        bullets: [
          "1. Mash the ripe bananas with a fork until smooth (squish away — get the wiggles out!)",
          "2. Stir in the melted butter, then the sugar, egg, and vanilla",
          "3. Sprinkle in flour, baking soda, and salt — fold gently until just combined",
          "4. Pour into the loaf pan",
          "5. Grown-up bakes at 175°C (350°F) about 50 minutes — the whole house will smell like a hug",
        ],
      },
      {
        heading: "Cozy Kitchen Words (Tagalog)",
        emoji: "💬",
        body: "The warm vocabulary of the banana-bread kitchen:",
      },
    ],
    phrases: [
      { english: "Banana", tagalog: "Saging", pronunciation: "SAH-ging" },
      { english: "Ripe", tagalog: "Hinog", pronunciation: "hee-NOG" },
      { english: "To mash", tagalog: "Pisain", pronunciation: "pee-sah-EEN" },
      { english: "Bread", tagalog: "Tinapay", pronunciation: "tee-nah-PAI" },
      { english: "Warm", tagalog: "Mainit-init", pronunciation: "mah-ee-nit-EE-nit" },
      { english: "Nothing wasted", tagalog: "Walang sayang", pronunciation: "WAH-lahng SAH-yahng" },
    ],
    reflection: "Banana bread turns 'too ripe to want' into 'too good to waste.' What's something your family could rescue, reuse, or give a second life instead of throwing away?",
    gratitudePrompt: "Today I am grateful to the Lord because...",
  },

  // ═══════════════════════════════════════════════════════════
  // OCTOBER — "Fiesta & Trails" (Units 6 · 10 · 7 · 9 · 8)
  // Resumes after the Feast of Tabernacles pause (~Sep 28–Oct 2).
  // ═══════════════════════════════════════════════════════════
  {
    id: "gentle-giants-of-the-sea",
    order: 33,
    title: "Gentle Giants of the Sea",
    subtitle: "Swim beside the whale shark and the wise old sea turtle",
    emoji: "🐋",
    category: "Philippines",
    date: "2026-10-05",
    time: "9:00 AM",
    materials: ["Large paper or cardboard (life-size fin drawing!)", "Measuring tape", "Blue crayons, markers, or paint"],
    canvaLink: "https://www.canva.com/",
    videoLinks: [
      { label: "Whale sharks in the Philippines (search on YouTube)", url: "https://www.youtube.com/results?search_query=whale+shark+philippines+gentle+giant" },
    ],
    familyChallenge:
      "Measure a whale shark in your own home! A butanding can reach 10 meters — use a measuring tape to mark 10 meters down your hallway or yard (that's the whole fish!). Then draw its spotted back on paper: every whale shark's spots are unique, like a fingerprint — invent your family's own spot pattern.",
    notes: "Unit 6 Animals — the sea giants. Conservation/stewardship thread continues. Tagalog-only vocabulary.",
    sections: [
      {
        heading: "The Shadow Bigger Than the Boat",
        emoji: "🌊",
        body: "The fishermen of Donsol were mending nets when the water beside their little boat went dark. Something enormous was rising — bigger than the boat itself — and the youngest fisherman gripped the side. Then it surfaced: a mouth as wide as a doorway, a back covered in white polka dots, moving slow as a cloud. 'Butanding,' the old fisherman smiled, not afraid at all. 'The gentle one.' The biggest fish in the entire ocean — and it eats only tiny, tiny plankton, and has never hurt anyone.",
      },
      {
        heading: "Meet the Giants",
        emoji: "🐋",
        body: "Philippine waters are home to some of the most magnificent sea creatures on Earth.",
        bullets: [
          "The whale shark (butanding) — the world's BIGGEST fish, up to 10 meters, with spots unique as fingerprints",
          "It's not a whale! It's a shark — but a filter-feeder that swims with its giant mouth open for plankton",
          "The pawikan (sea turtle) — can live for decades and swims thousands of kilometers, yet returns to the very beach where it hatched to lay its own eggs",
          "Baby turtles hatch at night and race to the sea by moonlight — one of nature's bravest journeys",
        ],
      },
      {
        heading: "Guardians of the Giants",
        emoji: "🛡️",
        body: "Filipinos protect both giants fiercely. In Donsol, whale-shark tourism follows strict kind rules — no touching, no chasing, keep your distance. On beaches all over the country, volunteers guard pawikan nests at night and escort the hatchlings safely to the waves. When people choose gentleness toward the biggest fish and the smallest hatchling alike, that's stewardship of God's ocean — and kids can be guardians too.",
      },
      {
        heading: "Ocean Words (Tagalog)",
        emoji: "💬",
        body: "The vocabulary of the deep blue — say them in a slow, giant voice!",
      },
    ],
    phrases: [
      { english: "Whale shark", tagalog: "Butanding", pronunciation: "boo-tahn-DING" },
      { english: "Sea turtle", tagalog: "Pawikan", pronunciation: "pah-WEE-kahn" },
      { english: "Ocean / sea", tagalog: "Karagatan", pronunciation: "kah-rah-GAH-tahn" },
      { english: "Gentle", tagalog: "Maamo", pronunciation: "mah-AH-moh" },
      { english: "Giant / huge", tagalog: "Higante", pronunciation: "hee-GAHN-teh" },
      { english: "To swim", tagalog: "Lumangoy", pronunciation: "loo-mah-NGOY" },
    ],
    reflection: "The biggest fish in the ocean is also one of the gentlest. What does the butanding teach us about what real strength looks like?",
    gratitudePrompt: "Today I am grateful to the Lord because...",
  },
  {
    id: "rainforest-the-green-cathedral",
    order: 34,
    title: "The Rainforest — A Green Cathedral",
    subtitle: "Step under the giant trees where half the country's creatures make their home",
    emoji: "🌳",
    category: "Philippines",
    date: "2026-10-07",
    time: "9:00 AM",
    materials: ["Paper + green/brown art supplies", "A shoebox (rainforest diorama!)", "Leaves and twigs from outside (with permission)", "Asa's outdoor kit"],
    canvaLink: "https://www.canva.com/",
    videoLinks: [
      { label: "Philippine rainforest (search on YouTube)", url: "https://www.youtube.com/results?search_query=philippine+rainforest+wildlife" },
    ],
    familyChallenge:
      "Asa leads a Rainforest Expedition! Build a shoebox rainforest with its four layers — forest floor, understory, canopy, emergent giants — using real leaves and twigs you gather outside. Hide a paper tarsier and an eagle inside for the family to find (they're hiding in the real one too!).",
    notes: "Unit 10 Nature Explorer opens (Asa's unit). Layers of the forest + creation care. Connects the tarsier and eagle lessons to their HOME. Tagalog-only vocabulary.",
    sections: [
      {
        heading: "Where the Trees Touch the Clouds",
        emoji: "🌫️",
        body: "Step off the sunny trail and into the forest, and the world changes in three steps. The air goes cool and green. Somewhere above, water drips leaf to leaf from last night's rain, and the canopy is so thick you can barely find the sky. A hornbill calls far away. Something rustles — gone before you see it. Old Filipinos called the great forest a place to walk quietly and respectfully, and standing here, you understand: it feels like a giant green cathedral that God planted long before anyone arrived.",
      },
      {
        heading: "A Forest Built in Layers",
        emoji: "🍃",
        body: "A rainforest isn't just trees — it's a four-story home, and every floor has its own residents!",
        bullets: [
          "Emergent giants — the tallest trees poke above everything; the Philippine Eagle nests up here",
          "The canopy — the thick green roof where most creatures live: hornbills, monkeys, flying lizards",
          "The understory — shady middle floor of vines and young trees; our friend the tarsier's bedroom",
          "The forest floor — dark and busy with wild pigs, insects, and the roots of everything above",
        ],
      },
      {
        heading: "The Forest Gives, So We Guard",
        emoji: "💚",
        body: "Rainforests are the islands' quiet heroes: their roots hold the mountainsides in place during typhoons, they clean the air, they cradle the rivers, and they house most of the country's rarest creatures — many living NOWHERE else on Earth. That's why Filipino kids join tree-planting days and why new forest parks keep being protected. Every tree planted is a future eagle's nest, a tarsier's bedroom, a cleaner river. Caring for the forest is caring for everything that calls it home.",
      },
      {
        heading: "Forest Words (Tagalog)",
        emoji: "💬",
        body: "Whisper the forest vocabulary — the rainforest likes quiet visitors!",
      },
    ],
    phrases: [
      { english: "Forest", tagalog: "Gubat", pronunciation: "GOO-baht" },
      { english: "Tree", tagalog: "Puno", pronunciation: "POO-noh" },
      { english: "Leaf", tagalog: "Dahon", pronunciation: "DAH-hon" },
      { english: "Green", tagalog: "Berde", pronunciation: "BEHR-deh" },
      { english: "To plant", tagalog: "Magtanim", pronunciation: "mahg-tah-NEEM" },
      { english: "Alive / living", tagalog: "Buhay", pronunciation: "BOO-hai" },
    ],
    reflection: "The forest quietly takes care of the islands — holding the soil, cleaning the air, sheltering the animals. Who quietly takes care of things in YOUR family, and how can you thank them today?",
    gratitudePrompt: "Today I am grateful to the Lord because...",
  },
  {
    id: "pancit-long-life-noodles",
    order: 35,
    title: "Pancit — The Long-Life Noodles",
    subtitle: "The birthday dish of the Philippines — long noodles for a long, happy life",
    emoji: "🍜",
    category: "Cooking",
    recipeId: "pancit",
    date: "2026-10-09",
    time: "9:00 AM",
    materials: ["See the recipe's shopping list (Cooking Academy)", "A big pan or wok", "Tongs (noodle-lifting practice!)"],
    canvaLink: "https://www.canva.com/",
    videoLinks: [
      { label: "How to cook pancit (search on YouTube)", url: "https://www.youtube.com/results?search_query=pancit+bihon+recipe+filipino" },
    ],
    familyChallenge:
      "The Longest Noodle Ceremony! At the table, everyone lifts their noodles high with their fork before the first bite — the higher the lift, the longer the life, say the lolas. Measure who found the longest unbroken noodle. Then each person shares one hope for their long, happy life.",
    notes: "Unit 7 Cooking — linked to the existing pancit recipe. Birthday-tradition framing (and a wink: Sharon's birthday was in July, but pancit is for EVERY celebration). Tagalog-only vocabulary.",
    sections: [
      {
        heading: "The Dish That Comes to Every Birthday",
        emoji: "🎂",
        body: "At every Filipino birthday party — every single one — somewhere on the table sits a great glorious platter of pancit: golden noodles tangled with vegetables, chicken, and little shrimp, glistening and fragrant. Why always pancit? Lean close, because every lola will tell you the same secret: the noodles are LONG, and long noodles mean LONG LIFE. Cutting them short is bad luck — you lift them high and slurp them whole. It's a wish you can eat.",
      },
      {
        heading: "A Noodle's Journey",
        emoji: "🍜",
        body: "Pancit has been part of Filipino tables for hundreds of years, with a story woven right through it.",
        bullets: [
          "Noodles came to the islands with Chinese traders long ago — 'pancit' comes from a Hokkien word for something conveniently cooked",
          "Every region made it its own: pancit bihon (thin rice noodles), pancit canton (thick egg noodles), and dozens more",
          "It's stir-fried fast in a hot pan with vegetables, meat, and soy-calamansi sauce",
          "Served at birthdays, fiestas, graduations — any day that deserves a long-life wish",
        ],
      },
      {
        heading: "Fast Pan, Many Hands",
        emoji: "🔥",
        body: "Pancit cooking is quick and busy — which makes it PERFECT for a family kitchen brigade! Little hands snap the beans and soak the noodles, middle hands measure the sauce, grown-up hands command the hot pan. Everything must be chopped and ready BEFORE the fire starts (your mise en place from Baking Academy!), because once the pan is hot, pancit waits for no one.",
      },
      {
        heading: "Noodle Words (Tagalog)",
        emoji: "💬",
        body: "The vocabulary of the birthday table — slurp the words up!",
      },
    ],
    phrases: [
      { english: "Noodles", tagalog: "Pancit", pronunciation: "pahn-SEET" },
      { english: "Long", tagalog: "Mahaba", pronunciation: "mah-HAH-bah" },
      { english: "Life", tagalog: "Buhay", pronunciation: "BOO-hai" },
      { english: "Happy Birthday!", tagalog: "Maligayang kaarawan!", pronunciation: "mah-lee-GAH-yahng kah-ah-RAH-wahn" },
      { english: "Long live!", tagalog: "Mabuhay!", pronunciation: "mah-BOO-hai" },
      { english: "Shrimp", tagalog: "Hipon", pronunciation: "HEE-pon" },
    ],
    reflection: "Pancit carries a wish for long life. If you could cook one wish into a dish for someone you love, what would the wish be — and who gets the first plate?",
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
