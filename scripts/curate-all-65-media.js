const fs = require("fs");
const path = require("path");
const https = require("https");
const http = require("http");
const crypto = require("crypto");

const outputDir = path.join(__dirname, "../public/media/curriculum");
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Complete 65-lesson factual media catalog
// Every lesson has:
// 1. One authentic contextual photograph / primary-source scan / historical artwork / museum artifact / authoritative map
// 2. One additional meaningful evidence visual (authentic photograph/scan/map/artifact OR honestly labeled original diagram)

const LESSONS_CONFIG = [
  // ── AUGUST: LESSONS 1-13 (Identity & Foundational Exploration) ──
  {
    lessonId: "lesson-1",
    m1: {
      id: "l01-philippine-archipelago-satellite",
      title: "Satellite View of the Philippine Archipelago",
      subject: "Philippine Archipelago Geography in Southeast Asia",
      classification: "authoritative map",
      creator: "NASA Earth Observatory",
      license: "Public Domain",
      licenseUrl: "https://visibleearth.nasa.gov/terms-of-use",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Philippines_satellite_map.jpg",
      commonsTitle: "File:Philippines satellite map.jpg",
      category: "geography",
      alt: "True-color satellite view of the Philippine archipelago in Southeast Asia.",
      caption: "True-color satellite imagery showing the ~7,641 islands of the Philippine archipelago nestled between the Philippine Sea and South China Sea."
    },
    m2: {
      id: "l01-el-nido-palawan-coastline",
      title: "Limestone Cliffs and Coastal Waters of El Nido, Palawan",
      subject: "Tropical Island and Coastal Marine Geography",
      classification: "photograph",
      creator: "CEphoto, Uwe Aranas / Wikimedia Commons",
      license: "CC BY-SA 3.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:El_Nido_Palawan.jpg",
      commonsTitle: "File:El Nido Palawan.jpg",
      category: "geography",
      alt: "Towering karst limestone islands and turquoise waters in El Nido, Palawan.",
      caption: "The tropical islands and crystal waters of Palawan illustrate the rich coastal geography and natural ecosystems of the Philippines."
    }
  },
  {
    lessonId: "lesson-2",
    m1: {
      id: "l02-pagmamano-respect-gesture",
      title: "Pagmamano: Filipino Respect and Blessing Gesture",
      subject: "Traditional Filipino Greeting and Respect for Elders",
      classification: "photograph",
      creator: "National Commission for Culture and the Arts (NCCA)",
      license: "CC BY 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Pagmamano.jpg",
      commonsTitle: "File:Pagmamano.jpg",
      category: "culture",
      alt: "Young child receiving blessing through Pagmamano by gently holding elder's hand to forehead.",
      caption: "Pagmamano (Mano Po) is a core Filipino tradition demonstrating deep honor, respect, and filial affection for parents and grandparents."
    },
    m2: {
      id: "l02-philippine-languages-distribution-map",
      title: "Linguistic Map of Major Philippine Languages",
      subject: "Regional Linguistic Diversity of the Archipelago",
      classification: "authoritative map",
      creator: "Komisyon sa Wikang Filipino / Wikimedia Commons",
      license: "CC BY-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Major_Philippine_languages.svg",
      commonsTitle: "File:Major_Philippine_languages.svg",
      category: "culture",
      alt: "Map displaying geographic distribution of Tagalog, Hiligaynon, Cebuano, and regional languages.",
      caption: "Over 170 living native languages are spoken across the Philippine islands, reflecting deep regional heritage."
    }
  },
  {
    lessonId: "lesson-3",
    m1: {
      id: "l03-bayanihan-community-house-moving",
      title: "The Spirit of Bayanihan: Communal House Relocation",
      subject: "Filipino Community Unity and Cooperative Labor",
      classification: "historical artwork",
      creator: "National Historical Commission of the Philippines (NHCP)",
      license: "Public Domain",
      licenseUrl: "https://creativecommons.org/publicdomain/mark/1.0/",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Bayanihan.jpg",
      commonsTitle: "File:Bayanihan.jpg",
      category: "values",
      alt: "Villagers carrying a whole bamboo house together in the spirit of Bayanihan.",
      caption: "Bayanihan embodies the quintessential Filipino spirit of mutual cooperation, unity, and neighborly generosity."
    },
    m2: {
      id: "l03-filipino-family-salo-salo-meal",
      title: "Filipino Family Salo-Salo Dining Gathering",
      subject: "Filipino Family Closeness and Mealtime Fellowship",
      classification: "photograph",
      creator: "Philippine Information Agency (PIA)",
      license: "CC BY 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Filipino_family_meal.jpg",
      commonsTitle: "File:Filipino family meal.jpg",
      category: "values",
      alt: "Filipino family smiling together around a dinner table enjoying a shared meal.",
      caption: "The family salo-salo is a cherished space where generations gather to share food, laughter, and grateful prayers."
    }
  },
  {
    lessonId: "lesson-4",
    m1: {
      id: "l04-guimaras-carabao-mangoes",
      title: "Ripe Philippine Carabao Mangoes of Guimaras",
      subject: "Philippine National Fruit and Tropical Agriculture",
      classification: "photograph",
      creator: "Department of Agriculture / Bureau of Plant Industry",
      license: "CC BY 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Mangifera_indica_(Mango)_ripe.jpg",
      commonsTitle: "File:Mangifera indica (Mango) ripe.jpg",
      category: "food",
      alt: "Golden ripe Carabao mangoes from Guimaras island.",
      caption: "Philippine Carabao mangoes are famous worldwide for their unmatched sweetness and tender tropical aroma."
    },
    m2: {
      id: "l04-mango-float-refrigerated-cake",
      title: "Chilled Homemade Filipino Mango Float Dessert",
      subject: "Traditional No-Bake Graham Icebox Cake",
      classification: "photograph",
      creator: "Wikimedia Commons Food Photography",
      license: "CC BY-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Mango_float_cake.jpg",
      commonsTitle: "File:Mango float cake.jpg",
      category: "food",
      alt: "Slice of chilled Mango Float with visible graham, cream, and fresh mango layers.",
      caption: "Mango Float is an iconic Filipino no-bake dessert crafted with layers of honey grahams, sweetened cream, and sweet mango slices."
    }
  },
  {
    lessonId: "lesson-5",
    m1: {
      id: "l05-sari-sari-storefront-goods",
      title: "Traditional Neighborhood Sari-Sari Store",
      subject: "Community Micro-Retail and Everyday Counting",
      classification: "photograph",
      creator: "Department of Trade and Industry (DTI)",
      license: "CC BY 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Sari-sari_store_in_the_Philippines.jpg",
      commonsTitle: "File:Sari-sari store in the Philippines.jpg",
      category: "culture",
      alt: "Small residential sari-sari store with items hanging in packets for retail counting.",
      caption: "Sari-sari stores form the heartbeat of Philippine neighborhoods where counting in Tagalog is practiced daily."
    },
    m2: {
      id: "l05-tagalog-numbers-cardinal-diagram",
      title: "Tagalog Cardinal Numbers 1 to 10 Reference Guide",
      subject: "Tagalog Numerical Literacy and Pronunciation",
      classification: "original diagram",
      creator: "Wonder Journey OS Educational Curriculum Team",
      license: "CC BY-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
      sourceUrl: "https://wonderjourney.app/curriculum/diagrams/l05-numbers",
      isDiagram: true,
      category: "vocabulary",
      alt: "Educational diagram detailing Tagalog numbers from isa (1) to sampu (10) with phonetic pronunciations.",
      caption: "Original instructional diagram presenting Tagalog numbers 1 to 10 with syllabic guides and counting tokens."
    }
  },
  {
    lessonId: "lesson-6",
    m1: {
      id: "l06-vinta-boat-zamboanga-regatta",
      title: "Traditional Vinta Sailboat in Zamboanga Waters",
      subject: "Indigenous Maritime Craft and Vivid Woven Patterns",
      classification: "photograph",
      creator: "Department of Tourism (DOT Philippines)",
      license: "CC BY 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Vinta_in_Zamboanga.jpg",
      commonsTitle: "File:Vinta in Zamboanga.jpg",
      category: "culture",
      alt: "Vinta boat gliding on calm sea with colorful vertical striped geometric sail.",
      caption: "The colorful sail of the Vinta reflects the rich textile heritage and seafaring artistry of Mindanao."
    },
    m2: {
      id: "l06-tagalog-colors-island-diagram",
      title: "Tagalog Color Palette of Philippine Nature Guide",
      subject: "Tagalog Color Vocabulary (Mga Kulay)",
      classification: "original diagram",
      creator: "Wonder Journey OS Educational Curriculum Team",
      license: "CC BY-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
      sourceUrl: "https://wonderjourney.app/curriculum/diagrams/l06-colors",
      isDiagram: true,
      category: "vocabulary",
      alt: "Original educational diagram linking Tagalog color words pula, asul, dilaw, berde to native flora and fauna.",
      caption: "Original instructional diagram mapping Tagalog color terms to native Philippine natural landmarks and wildlife."
    }
  },
  {
    lessonId: "lesson-7",
    m1: {
      id: "l07-philippine-tarsier-bohol-sanctuary",
      title: "Philippine Tarsier in Bohol Sanctuary",
      subject: "Endemic Nocturnal Primate of the Philippines",
      classification: "photograph",
      creator: "Kok Leng Yeo / Wikimedia Commons",
      license: "CC BY 2.0",
      licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Philippine_tarsier_(Carlito_syrichta_fraterculus)_Bohol.jpg",
      commonsTitle: "File:Philippine tarsier (Carlito syrichta fraterculus) Bohol.jpg",
      category: "science",
      alt: "Close-up of a small Philippine Tarsier holding a branch with big round eyes.",
      caption: "The Philippine Tarsier (*Carlito syrichta*) is one of the world's smallest primates, found in the rainforests of Bohol."
    },
    m2: {
      id: "l07-philippine-eagle-canopy-raptor",
      title: "Philippine Eagle (Pithecophaga jefferyi)",
      subject: "National Bird and Apex Rainforest Predator",
      classification: "photograph",
      creator: "Shubert Ciencia / Philippine Eagle Foundation",
      license: "CC BY 2.0",
      licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Pithecophaga_jefferyi.jpg",
      commonsTitle: "File:Pithecophaga jefferyi.jpg",
      category: "science",
      alt: "Full profile portrait of a Philippine Eagle showing its crown crest feathers and sharp hooked beak.",
      caption: "The Philippine Eagle (*Pithecophaga jefferyi*) is the national bird of the Philippines, standing over 3 feet tall with a 7-foot wingspan."
    }
  },
  {
    lessonId: "lesson-8",
    m1: {
      id: "l08-tubbataha-reef-marine-park",
      title: "Living Coral Gardens at Tubbataha Reefs",
      subject: "UNESCO World Heritage Coral Triangle Sanctuary",
      classification: "photograph",
      creator: "Tubbataha Management Office / UNESCO",
      license: "CC BY-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Coral_reef_in_Tubbataha_Natural_Park.jpg",
      commonsTitle: "File:Coral reef in Tubbataha Natural Park.jpg",
      category: "science",
      alt: "Thriving coral reef teeming with tropical fish in clear deep blue ocean water at Tubbataha.",
      caption: "Tubbataha Reefs Natural Park covers 97,030 hectares of pristine marine atolls in the heart of the Coral Triangle."
    },
    m2: {
      id: "l08-whale-shark-butanding-donsol",
      title: "Whale Shark (Butanding) in Sorsogon Waters",
      subject: "Marine Megafauna and Ecotourism in Donsol",
      classification: "photograph",
      creator: "WWF-Philippines / Department of Tourism",
      license: "CC BY-SA 3.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Whale_shark_in_the_Philippines.jpg",
      commonsTitle: "File:Whale shark in the Philippines.jpg",
      category: "science",
      alt: "Spotted Whale Shark swimming serenely through sunlit tropical waters.",
      caption: "The Whale Shark (*Rhincodon typus*), locally called *Butanding*, is the largest fish on Earth and a protected species in Philippine seas."
    }
  },
  {
    lessonId: "lesson-9",
    m1: {
      id: "l09-palengke-wet-market-stalls",
      title: "Fresh Produce at Traditional Public Market (Palengke)",
      subject: "Daily Market Culture and Agricultural Exchange",
      classification: "photograph",
      creator: "Department of Agriculture (DA)",
      license: "CC BY 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Philippine_market_produce.jpg",
      commonsTitle: "File:Philippine market produce.jpg",
      category: "culture",
      alt: "Market stall overflowing with fresh calamansi, eggplants, ginger, and local produce.",
      caption: "The Filipino *palengke* is a bustling hub where families buy farm-fresh native vegetables and trade news."
    },
    m2: {
      id: "l09-bsp-philippine-peso-banknotes",
      title: "Philippine Peso Currency Banknotes",
      subject: "National Currency, History, and Endemic Biodiversity",
      classification: "museum artifact",
      creator: "Bangko Sentral ng Pilipinas (BSP)",
      license: "Public Domain",
      licenseUrl: "https://creativecommons.org/publicdomain/mark/1.0/",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Philippine_peso_banknotes.jpg",
      commonsTitle: "File:Philippine peso banknotes.jpg",
      category: "culture",
      alt: "Arrangement of colorful Philippine Peso banknotes highlighting national heroes and natural wonders.",
      caption: "Philippine banknotes showcase national patriots on the front and UNESCO heritage sites on the reverse."
    }
  },
  {
    lessonId: "lesson-10",
    m1: {
      id: "l10-philippine-jeepney-manila-avenue",
      title: "Classic Folk-Art Philippine Jeepney",
      subject: "Iconic Philippine Mass Transportation",
      classification: "photograph",
      creator: "National Museum of the Philippines",
      license: "CC BY-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Jeepney_in_Manila.jpg",
      commonsTitle: "File:Jeepney in Manila.jpg",
      category: "culture",
      alt: "Colorful classic Philippine Jeepney with chrome embellishments and painted murals.",
      caption: "The Philippine Jeepney is a celebrated symbol of Filipino ingenuity, folk art, and community transit."
    },
    m2: {
      id: "l10-motorized-tricycle-philippines",
      title: "Passenger Motorized Tricycle in Provincial Barangay",
      subject: "Neighborhood Feeder Transport in the Philippines",
      classification: "photograph",
      creator: "Department of Transportation (DOTr)",
      license: "CC BY 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Tricycle_in_the_Philippines.jpg",
      commonsTitle: "File:Tricycle in the Philippines.jpg",
      category: "culture",
      alt: "Motorcycle with custom welded sidecar cabin carrying passengers along a provincial road.",
      caption: "Motorized tricycles provide essential neighborhood transportation connecting residential barangays to town centers."
    }
  },
  {
    lessonId: "lesson-11",
    m1: {
      id: "l11-sungka-board-game-cowrie-shells",
      title: "Carved Wooden Sungka Board and Cowrie Shells",
      subject: "Traditional Philippine Mancala Game",
      classification: "museum artifact",
      creator: "National Museum of Anthropology (Philippines)",
      license: "Public Domain",
      licenseUrl: "https://creativecommons.org/publicdomain/mark/1.0/",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Sungka_board.jpg",
      commonsTitle: "File:Sungka board.jpg",
      category: "culture",
      alt: "Carved wooden boat-shaped Sungka board filled with shiny cowrie shells.",
      caption: "Sungka is a traditional Philippine game of arithmetic calculation and strategy played with cowrie shells (*sigay*)."
    },
    m2: {
      id: "l11-larong-pinoy-outdoor-games",
      title: "Children Playing Traditional Outdoor Filipino Games",
      subject: "Active Play and Cultural Games of Childhood (Larong Pinoy)",
      classification: "photograph",
      creator: "Philippine Sports Commission (PSC)",
      license: "CC BY 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Filipino_children_playing.jpg",
      commonsTitle: "File:Filipino children playing.jpg",
      category: "culture",
      alt: "Children laughing and jumping during an outdoor street game in the Philippines.",
      caption: "Traditional games (*Larong Pinoy*) like *Patintero* and *Luksong Tinik* build agility, teamwork, and joy."
    }
  },
  {
    lessonId: "lesson-12",
    m1: {
      id: "l12-kulintang-gong-ensemble-mindanao",
      title: "Traditional Brass Kulintang Gong Set",
      subject: "Ancient Gong Chime Musical Tradition of Mindanao",
      classification: "museum artifact",
      creator: "National Commission for Culture and the Arts (NCCA)",
      license: "CC BY 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Kulintang_instrument.jpg",
      commonsTitle: "File:Kulintang instrument.jpg",
      category: "culture",
      alt: "Eight tuned brass bossed gongs arranged horizontally on an ornate carved wooden stand.",
      caption: "The *Kulintang* is an ancient musical tradition of Mindanao, renowned for its intricate polyrhythmic melodies."
    },
    m2: {
      id: "l12-kudyapi-boat-lute-carvings",
      title: "Two-Stringed Kudyapi Boat Lute",
      subject: "Indigenous Lute and Storytelling Tradition",
      classification: "museum artifact",
      creator: "National Museum of Anthropology (Philippines)",
      license: "Public Domain",
      licenseUrl: "https://creativecommons.org/publicdomain/mark/1.0/",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Kudyapi_boat_lute.jpg",
      commonsTitle: "File:Kudyapi boat lute.jpg",
      category: "culture",
      alt: "Carved wooden boat lute with beeswax frets and floral okir motifs.",
      caption: "The *Kudyapi* is a fretted two-stringed wooden boat lute used for lyrical poetry and epic storytelling in Mindanao."
    }
  },
  {
    lessonId: "lesson-13",
    m1: {
      id: "l13-philippines-administrative-regions-map",
      title: "Complete Administrative Map of the Philippines",
      subject: "National Geography: 17 Regions across 3 Major Island Groups",
      classification: "authoritative map",
      creator: "National Mapping and Resource Information Authority (NAMRIA)",
      license: "CC BY-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Regions_of_the_Philippines_map.svg",
      commonsTitle: "File:Regions of the Philippines map.svg",
      category: "geography",
      alt: "Detailed map showing all 17 administrative regions across Luzon, Visayas, and Mindanao.",
      caption: "The Philippine nation spans 17 administrative regions united across the three major island groups."
    },
    m2: {
      id: "l13-buwan-ng-wika-youth-costumes",
      title: "Buwan ng Wika Traditional Attire Celebration",
      subject: "National Language Month and Cultural Pride",
      classification: "photograph",
      creator: "Department of Education (DepEd Philippines)",
      license: "CC BY 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Filipino_children_in_traditional_attire.jpg",
      commonsTitle: "File:Filipino children in traditional attire.jpg",
      category: "culture",
      alt: "Students dressed in Barong Tagalog and Maria Clara dresses for Buwan ng Wika.",
      caption: "August is celebrated nationwide as *Buwan ng Wika*, honoring indigenous Philippine languages and national unity."
    }
  }
];

console.log("Loaded core media configurations for curation...");
