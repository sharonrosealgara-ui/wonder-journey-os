// ─────────────────────────────────────────────────────────────
// TRAVEL PASSPORT DESTINATIONS — lessons award stamps for these.
// ─────────────────────────────────────────────────────────────

export type Destination = {
  id: string;
  name: string;
  region: "Luzon" | "Visayas" | "Mindanao" | "Nationwide";
  emoji: string;
  knownFor: string;
  funFact: string;
};

export const destinations: Destination[] = [
  {
    id: "philippines",
    name: "The Philippines",
    region: "Nationwide",
    emoji: "🇵🇭",
    knownFor: "7,641 islands of sunshine, smiles, and adventure",
    funFact: "The Philippines has more than 7,000 islands — you could visit a new one every day for 20 years!",
  },
  {
    id: "manila",
    name: "Manila",
    region: "Luzon",
    emoji: "🏙️",
    knownFor: "The capital city and historic walled city of Intramuros",
    funFact: "Manila's old walled city, Intramuros, is over 400 years old — you can ride a horse-drawn kalesa through it!",
  },
  {
    id: "banaue",
    name: "Banaue Rice Terraces",
    region: "Luzon",
    emoji: "🌾",
    knownFor: "2,000-year-old rice terraces carved into the mountains",
    funFact: "If you laid the Banaue terraces end to end, they would stretch halfway around the world!",
  },
  {
    id: "mayon",
    name: "Mayon Volcano",
    region: "Luzon",
    emoji: "🌋",
    knownFor: "The world's most perfectly cone-shaped volcano",
    funFact: "Mayon is so perfectly shaped that scientists from around the world come just to admire its cone!",
  },
  {
    id: "palawan",
    name: "Palawan",
    region: "Luzon",
    emoji: "🛶",
    knownFor: "Crystal lagoons and an underground river",
    funFact: "Palawan's Underground River is one of the New 7 Wonders of Nature — a river that flows through a cave for 5 miles!",
  },
  {
    id: "iloilo",
    name: "Iloilo",
    region: "Visayas",
    emoji: "⛪",
    knownFor: "The heart of Hiligaynon language and warm hospitality",
    funFact: "Iloilo is called the 'City of Love' — Teacher Sharon's home region, where Hiligaynon is spoken!",
  },
  {
    id: "bago",
    name: "Bago City, Negros Occidental",
    region: "Visayas",
    emoji: "🌱",
    knownFor: "Sugarcane fields and beautiful waterfalls",
    funFact: "Negros is called the 'Sugarbowl of the Philippines' — sweet fields as far as the eye can see!",
  },
  {
    id: "guimaras",
    name: "Guimaras",
    region: "Visayas",
    emoji: "🥭",
    knownFor: "The sweetest mangoes in the world",
    funFact: "Guimaras mangoes are so prized that the island holds a Mango Festival every May with mango-eating contests!",
  },
  {
    id: "boracay",
    name: "Boracay",
    region: "Visayas",
    emoji: "🏖️",
    knownFor: "Powdery white sand beaches",
    funFact: "Boracay's sand is so fine and white it stays cool even under the hot tropical sun!",
  },
  {
    id: "cebu",
    name: "Cebu",
    region: "Visayas",
    emoji: "🐋",
    knownFor: "Historic sites and whale sharks",
    funFact: "In Cebu you can swim near gentle whale sharks — the biggest fish in the ocean!",
  },
  {
    id: "bohol",
    name: "Bohol & the Chocolate Hills",
    region: "Visayas",
    emoji: "🍫",
    knownFor: "1,268 chocolate-colored hills and tiny tarsiers",
    funFact: "The Chocolate Hills turn brown in summer like giant chocolate kisses — and Bohol's tarsier is one of the smallest primates on Earth, small enough to fit in your hand!",
  },
  {
    id: "siargao",
    name: "Siargao",
    region: "Mindanao",
    emoji: "🏄",
    knownFor: "The surfing capital of the Philippines",
    funFact: "Siargao's famous wave is called 'Cloud 9' — surfers travel across the world to ride it!",
  },
];

export function getDestination(id: string): Destination | undefined {
  return destinations.find((d) => d.id === id);
}
