// ─────────────────────────────────────────────────────────────
// LANGUAGE LEARNING — word sets power the flashcards & matching game.
// Add a new category and it appears automatically on the Languages page.
// ─────────────────────────────────────────────────────────────

export type Phrase = {
  english: string;
  tagalog: string;
  hiligaynon: string;
  pronunciation: string;
  emoji: string;
};

export type PhraseCategory = {
  id: string;
  title: string;
  emoji: string;
  phrases: Phrase[];
};

export const phraseCategories: PhraseCategory[] = [
  {
    id: "greetings",
    title: "Greetings & Introductions",
    emoji: "👋",
    phrases: [
      { english: "Hello", tagalog: "Kumusta", hiligaynon: "Kamusta", pronunciation: "koo-MOOS-tah", emoji: "👋" },
      { english: "Good morning", tagalog: "Magandang umaga", hiligaynon: "Maayong aga", pronunciation: "mah-gahn-DAHNG oo-MAH-gah", emoji: "🌅" },
      { english: "Good afternoon", tagalog: "Magandang hapon", hiligaynon: "Maayong hapon", pronunciation: "mah-gahn-DAHNG HAH-pon", emoji: "☀️" },
      { english: "Good evening", tagalog: "Magandang gabi", hiligaynon: "Maayong gab-i", pronunciation: "mah-gahn-DAHNG gah-BEE", emoji: "🌙" },
      { english: "How are you?", tagalog: "Kumusta ka?", hiligaynon: "Kamusta ka?", pronunciation: "koo-MOOS-tah kah", emoji: "🙂" },
      { english: "I am fine", tagalog: "Mabuti ako", hiligaynon: "Maayo man ako", pronunciation: "mah-BOO-tee ah-KOH", emoji: "😊" },
      { english: "I am happy", tagalog: "Masaya ako", hiligaynon: "Malipayon ako", pronunciation: "mah-sah-YAH ah-KOH", emoji: "😄" },
      { english: "My name is...", tagalog: "Ang pangalan ko ay...", hiligaynon: "Ang ngalan ko...", pronunciation: "ahng pah-NGAH-lahn koh", emoji: "📛" },
      { english: "Thank you", tagalog: "Salamat", hiligaynon: "Salamat", pronunciation: "sah-LAH-maht", emoji: "🙏" },
      { english: "Thank you very much", tagalog: "Maraming salamat", hiligaynon: "Madamo nga salamat", pronunciation: "mah-RAH-ming sah-LAH-maht", emoji: "💖" },
      { english: "You're welcome", tagalog: "Walang anuman", hiligaynon: "Wala sang ano man", pronunciation: "wah-LAHNG ah-noo-MAHN", emoji: "🤗" },
      { english: "Goodbye", tagalog: "Paalam", hiligaynon: "Asta sa liwat", pronunciation: "pah-AH-lahm", emoji: "👋" },
    ],
  },
  {
    id: "family",
    title: "Family Words",
    emoji: "👨‍👩‍👧‍👦",
    phrases: [
      { english: "Family", tagalog: "Pamilya", hiligaynon: "Pamilya", pronunciation: "pah-MEEL-yah", emoji: "👨‍👩‍👧‍👦" },
      { english: "Father / Dad", tagalog: "Tatay / Itay", hiligaynon: "Tatay", pronunciation: "TAH-tie", emoji: "👨" },
      { english: "Mother / Mom", tagalog: "Nanay / Inay", hiligaynon: "Nanay", pronunciation: "NAH-nigh", emoji: "👩" },
      { english: "Older brother", tagalog: "Kuya", hiligaynon: "Manong", pronunciation: "KOO-yah / mah-NONG", emoji: "👦" },
      { english: "Older sister", tagalog: "Ate", hiligaynon: "Manang", pronunciation: "AH-teh / mah-NAHNG", emoji: "👧" },
      { english: "Younger sibling", tagalog: "Bunso (youngest)", hiligaynon: "Manghod", pronunciation: "boon-SOH / mahng-HOD", emoji: "🧒" },
      { english: "Grandfather", tagalog: "Lolo", hiligaynon: "Lolo", pronunciation: "LOH-loh", emoji: "👴" },
      { english: "Grandmother", tagalog: "Lola", hiligaynon: "Lola", pronunciation: "LOH-lah", emoji: "👵" },
      { english: "Love", tagalog: "Pagmamahal", hiligaynon: "Gugma", pronunciation: "pahg-mah-mah-HAHL / GOOG-mah", emoji: "❤️" },
      { english: "Home", tagalog: "Tahanan", hiligaynon: "Balay", pronunciation: "tah-HAH-nahn / BAH-lie", emoji: "🏠" },
    ],
  },
  {
    id: "food",
    title: "Food Words",
    emoji: "🍚",
    phrases: [
      { english: "Food", tagalog: "Pagkain", hiligaynon: "Pagkaon", pronunciation: "pahg-KAH-in / pahg-KAH-on", emoji: "🍽️" },
      { english: "Rice (cooked)", tagalog: "Kanin", hiligaynon: "Kan-on", pronunciation: "KAH-nin / KAHN-on", emoji: "🍚" },
      { english: "Water", tagalog: "Tubig", hiligaynon: "Tubig", pronunciation: "TOO-big", emoji: "💧" },
      { english: "Mango", tagalog: "Mangga", hiligaynon: "Pahò", pronunciation: "mahng-GAH / pah-HO", emoji: "🥭" },
      { english: "Banana", tagalog: "Saging", hiligaynon: "Saging", pronunciation: "SAH-ging", emoji: "🍌" },
      { english: "Chicken", tagalog: "Manok", hiligaynon: "Manok", pronunciation: "mah-NOHK", emoji: "🍗" },
      { english: "Fish", tagalog: "Isda", hiligaynon: "Isda", pronunciation: "is-DAH", emoji: "🐟" },
      { english: "Egg", tagalog: "Itlog", hiligaynon: "Itlog", pronunciation: "it-LOHG", emoji: "🥚" },
      { english: "Delicious", tagalog: "Masarap", hiligaynon: "Namit", pronunciation: "mah-sah-RAHP / NAH-mit", emoji: "😋" },
      { english: "Let's eat!", tagalog: "Kain tayo!", hiligaynon: "Kaon ta!", pronunciation: "KAH-in TAH-yo / KAH-on tah", emoji: "🍴" },
      { english: "I'm hungry", tagalog: "Gutom ako", hiligaynon: "Gutom ako", pronunciation: "goo-TOHM ah-KOH", emoji: "🤤" },
      { english: "Sweet", tagalog: "Matamis", hiligaynon: "Matam-is", pronunciation: "mah-tah-MIS", emoji: "🍬" },
    ],
  },
  {
    id: "animals",
    title: "Animals",
    emoji: "🐾",
    phrases: [
      { english: "Dog", tagalog: "Aso", hiligaynon: "Ido", pronunciation: "AH-soh / EE-doh", emoji: "🐕" },
      { english: "Cat", tagalog: "Pusa", hiligaynon: "Kuring", pronunciation: "POO-sah / koo-RING", emoji: "🐈" },
      { english: "Bird", tagalog: "Ibon", hiligaynon: "Pispis", pronunciation: "EE-bon / pis-PIS", emoji: "🐦" },
      { english: "Fish", tagalog: "Isda", hiligaynon: "Isda", pronunciation: "is-DAH", emoji: "🐠" },
      { english: "Carabao (water buffalo)", tagalog: "Kalabaw", hiligaynon: "Karbaw", pronunciation: "kah-lah-BAW", emoji: "🐃" },
      { english: "Chicken", tagalog: "Manok", hiligaynon: "Manok", pronunciation: "mah-NOHK", emoji: "🐓" },
      { english: "Pig", tagalog: "Baboy", hiligaynon: "Baboy", pronunciation: "BAH-boy", emoji: "🐖" },
      { english: "Monkey", tagalog: "Unggoy", hiligaynon: "Amo", pronunciation: "oong-GOY / AH-moh", emoji: "🐒" },
      { english: "Butterfly", tagalog: "Paru-paro", hiligaynon: "Alibangbang", pronunciation: "pah-roo-pah-ROH / ah-lee-BAHNG-bahng", emoji: "🦋" },
      { english: "Tarsier (tiny Bohol primate!)", tagalog: "Tarsier", hiligaynon: "Tarsier", pronunciation: "TAR-see-er", emoji: "🐵" },
    ],
  },
  {
    id: "numbers",
    title: "Numbers 1–10",
    emoji: "🔢",
    phrases: [
      { english: "One", tagalog: "Isa", hiligaynon: "Isa", pronunciation: "ee-SAH", emoji: "1️⃣" },
      { english: "Two", tagalog: "Dalawa", hiligaynon: "Duha", pronunciation: "dah-lah-WAH / doo-HAH", emoji: "2️⃣" },
      { english: "Three", tagalog: "Tatlo", hiligaynon: "Tatlo", pronunciation: "taht-LOH", emoji: "3️⃣" },
      { english: "Four", tagalog: "Apat", hiligaynon: "Apat", pronunciation: "AH-paht", emoji: "4️⃣" },
      { english: "Five", tagalog: "Lima", hiligaynon: "Lima", pronunciation: "lee-MAH", emoji: "5️⃣" },
      { english: "Six", tagalog: "Anim", hiligaynon: "Anum", pronunciation: "AH-nim / AH-noom", emoji: "6️⃣" },
      { english: "Seven", tagalog: "Pito", hiligaynon: "Pito", pronunciation: "pee-TOH", emoji: "7️⃣" },
      { english: "Eight", tagalog: "Walo", hiligaynon: "Walo", pronunciation: "wah-LOH", emoji: "8️⃣" },
      { english: "Nine", tagalog: "Siyam", hiligaynon: "Siyam", pronunciation: "see-YAHM", emoji: "9️⃣" },
      { english: "Ten", tagalog: "Sampu", hiligaynon: "Napulo", pronunciation: "sahm-POO / nah-poo-LOH", emoji: "🔟" },
    ],
  },
  {
    id: "colors",
    title: "Colors",
    emoji: "🌈",
    phrases: [
      { english: "Red", tagalog: "Pula", hiligaynon: "Pula", pronunciation: "poo-LAH", emoji: "🔴" },
      { english: "Blue", tagalog: "Asul", hiligaynon: "Asul", pronunciation: "ah-SOOL", emoji: "🔵" },
      { english: "Yellow", tagalog: "Dilaw", hiligaynon: "Dalag", pronunciation: "dee-LAW / dah-LAHG", emoji: "🟡" },
      { english: "Green", tagalog: "Berde", hiligaynon: "Berde", pronunciation: "BER-deh", emoji: "🟢" },
      { english: "White", tagalog: "Puti", hiligaynon: "Puti", pronunciation: "poo-TEE", emoji: "⚪" },
      { english: "Black", tagalog: "Itim", hiligaynon: "Itom", pronunciation: "ee-TIM / ee-TOHM", emoji: "⚫" },
      { english: "Orange", tagalog: "Kahel", hiligaynon: "Kahel", pronunciation: "kah-HEL", emoji: "🟠" },
      { english: "Purple", tagalog: "Lila / Ube", hiligaynon: "Lila", pronunciation: "LEE-lah / OO-beh", emoji: "🟣" },
    ],
  },
  {
    id: "everyday",
    title: "Everyday Phrases",
    emoji: "💬",
    phrases: [
      { english: "Yes", tagalog: "Oo (Opo - respectful)", hiligaynon: "Huo", pronunciation: "OH-oh / OH-poh / HOO-oh", emoji: "✅" },
      { english: "No", tagalog: "Hindi", hiligaynon: "Indi", pronunciation: "hin-DEE / in-DEE", emoji: "❌" },
      { english: "Please", tagalog: "Pakiusap", hiligaynon: "Palihog", pronunciation: "pah-kee-OO-sahp / pah-LEE-hog", emoji: "🥺" },
      { english: "Excuse me / Sorry", tagalog: "Paumanhin", hiligaynon: "Pasensya na", pronunciation: "pah-oo-mahn-HIN", emoji: "🙇" },
      { english: "I love you", tagalog: "Mahal kita", hiligaynon: "Palangga ta ka", pronunciation: "mah-HAHL kee-TAH / pah-LAHNG-gah tah kah", emoji: "💗" },
      { english: "Beautiful", tagalog: "Maganda", hiligaynon: "Matahum", pronunciation: "mah-gahn-DAH / mah-TAH-hoom", emoji: "🌺" },
      { english: "Let's go!", tagalog: "Tara na!", hiligaynon: "Dali na!", pronunciation: "TAH-rah nah / dah-LEE nah", emoji: "🏃" },
      { english: "Take care", tagalog: "Ingat", hiligaynon: "Halong", pronunciation: "EE-ngaht / HAH-long", emoji: "🤗" },
      { english: "God bless you", tagalog: "Pagpalain ka ng Diyos", hiligaynon: "Kabay pa nga pakamaayuhon ka sang Dios", pronunciation: "pahg-pah-LAH-in kah nahng Jee-OHS", emoji: "✝️" },
    ],
  },
];
