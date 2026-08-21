const fs = require("fs");
const path = require("path");
const https = require("https");
const crypto = require("crypto");

const outputDir = path.join(__dirname, "../public/media/curriculum");
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 65 lessons × 2 authentic media search definitions
const LESSON_MEDIA_TARGETS = [
  // ── AUGUST: DISCOVERING THE PHILIPPINES & IDENTITY ──
  {
    lessonId: "lesson-1",
    media1: { id: "l01-philippine-archipelago-satellite", query: "Philippines satellite Sentinel OR MODIS NASA", classification: "authoritative map", fallbackTitle: "File:Philippines on the globe (Southeast Asia centered).svg", alt: "Satellite view of the Philippine archipelago in Southeast Asia.", caption: "Satellite imagery of the Philippine archipelago showing its ~7,641 islands in Southeast Asia." },
    media2: { id: "l01-philippine-islands-landscape", query: "El Nido Palawan karst islands sea", classification: "photograph", fallbackTitle: "File:El Nido Palawan.jpg", alt: "Tropical limestone islands and turquoise waters of Palawan, Philippines.", caption: "The Philippine archipelago is blessed with diverse tropical island landscapes and pristine coastal waters." }
  },
  {
    lessonId: "lesson-2",
    media1: { id: "l02-mano-po-respect-gesture", query: "Mano po Philippines respect gesture", classification: "photograph", fallbackTitle: "File:Pagmamano.jpg", alt: "Filipino greeting gesture of Mano Po showing respect to elders.", caption: "Mano Po is a time-honored Filipino gesture of honor and blessing given to parents and elders." },
    media2: { id: "l02-philippine-languages-map", query: "Philippine languages map linguistic", classification: "authoritative map", fallbackTitle: "File:Major Philippine languages.svg", alt: "Linguistic map of the major languages across the Philippine regions.", caption: "Over 170 distinct languages and dialects are spoken across the Philippine archipelago, including Tagalog and Hiligaynon." }
  },
  {
    lessonId: "lesson-3",
    media1: { id: "l03-bayanihan-community-house-moving", query: "Bayanihan house moving Philippines", classification: "historical artwork", fallbackTitle: "File:Bayanihan.jpg", alt: "Community members working together to carry a traditional house in the Bayanihan spirit.", caption: "Bayanihan embodies the cherished Filipino virtue of communal unity, mutual cooperation, and helping neighbors." },
    media2: { id: "l03-filipino-family-salo-salo", query: "Filipino family gathering meal", classification: "photograph", fallbackTitle: "File:Filipino family meal.jpg", alt: "Filipino multi-generational family gathered around a shared dining table for salo-salo.", caption: "Salo-salo reflects the centrality of family closeness, warmth, and shared fellowship in Filipino heritage." }
  },
  {
    lessonId: "lesson-4",
    media1: { id: "l04-philippine-carabao-mangoes", query: "Carabao mango Guimaras ripe", classification: "photograph", fallbackTitle: "File:Mangifera indica (Mango) ripe.jpg", alt: "Sweet golden Philippine Carabao mangoes from Guimaras.", caption: "Philippine Carabao mangoes are world-renowned for their exceptionally sweet, aromatic golden flesh." },
    media2: { id: "l04-mango-float-dessert-dish", query: "Mango float Filipino dessert", classification: "photograph", fallbackTitle: "File:Mango float cake.jpg", alt: "Chilled Filipino Mango Float dessert layered with graham crackers, sweet cream, and mango slices.", caption: "Mango Float is a beloved classic Filipino no-bake dessert made for celebrations and family adventures." }
  },
  {
    lessonId: "lesson-5",
    media1: { id: "l05-sari-sari-store-counting", query: "Sari-sari store neighborhood Philippines", classification: "photograph", fallbackTitle: "File:Sari-sari store in the Philippines.jpg", alt: "Traditional neighborhood sari-sari store with items displayed for counting and purchase.", caption: "Sari-sari stores serve as daily community trading posts where Tagalog numbers are used for buying goods." },
    media2: { id: "l05-tagalog-numbers-chart", query: "Tagalog numbers cardinal counting chart", classification: "original diagram", isDiagram: true, alt: "Instructional diagram of Tagalog cardinal numbers from 1 to 10 with phonetic guides.", caption: "Tagalog numbers (isa, dalawa, tatlo, apat, lima, anim, pito, walo, siyam, sampu) form the basis of daily conversation." }
  },
  {
    lessonId: "lesson-6",
    media1: { id: "l06-vinta-colorful-sails-zamboanga", query: "Vinta boat colorful sail Zamboanga", classification: "photograph", fallbackTitle: "File:Vinta in Zamboanga.jpg", alt: "Traditional Vinta boat with vivid multicolored geometric woven sail in Zamboanga.", caption: "The iconic Vinta sailboat features bold, colorful patterns that showcase the vibrant visual artistry of Mindanao." },
    media2: { id: "l06-philippine-color-palette-diagram", query: "Tagalog color wheel flora fauna", classification: "original diagram", isDiagram: true, alt: "Original instructional diagram displaying Tagalog color vocabulary matched to Philippine nature.", caption: "Tagalog colors (pula, asul, dilaw, berde, puti, itim) reflect the vivid natural palette of the archipelago." }
  },
  {
    lessonId: "lesson-7",
    media1: { id: "l07-philippine-tarsier-bohol", query: "Philippine tarsier Carlito syrichta Bohol", classification: "photograph", fallbackTitle: "File:Philippine tarsier (Carlito syrichta fraterculus) Bohol.jpg", alt: "Philippine Tarsier clinging to a branch in Bohol with large round nocturnal eyes.", caption: "The Philippine Tarsier (*Carlito syrichta*) is one of the world's smallest primates, endemic to the rainforests of Bohol and Samar." },
    media2: { id: "l07-philippine-eagle-portrait", query: "Pithecophaga jefferyi Philippine Eagle", classification: "photograph", fallbackTitle: "File:Pithecophaga jefferyi.jpg", alt: "Magnificent Philippine Eagle perched with its iconic crown crest feathers.", caption: "The Philippine Eagle (*Pithecophaga jefferyi*) is the national bird of the Philippines and an apex forest canopy raptor." }
  },
  {
    lessonId: "lesson-8",
    media1: { id: "l08-tubbataha-reef-coral-marine", query: "Tubbataha Reefs marine park coral", classification: "photograph", fallbackTitle: "File:Coral reef in Tubbataha Natural Park.jpg", alt: "Pristine coral garden and diverse tropical reef fish at Tubbataha Reefs Natural Park.", caption: "Tubbataha Reefs Natural Park is a UNESCO World Heritage marine sanctuary in the Sulu Sea teeming with over 600 fish species." },
    media2: { id: "l08-whale-shark-donsol", query: "Whale shark Rhincodon typus Donsol", classification: "photograph", fallbackTitle: "File:Whale shark in the Philippines.jpg", alt: "Gentle giant Whale Shark (Butanding) swimming gracefully in Philippine coastal waters.", caption: "The Whale Shark (*Rhincodon typus*), known locally as *Butanding*, frequents the nutrient-rich waters of Donsol, Sorsogon." }
  },
  {
    lessonId: "lesson-9",
    media1: { id: "l09-palengke-market-produce", query: "Public market palengke Philippines vegetables", classification: "photograph", fallbackTitle: "File:Philippine market produce.jpg", alt: "Bustling traditional public market (palengke) stall overflowing with fresh tropical produce.", caption: "The Filipino *palengke* is a vibrant center of commerce and daily social interaction filled with fresh native vegetables and fruits." },
    media2: { id: "l09-philippine-peso-currency", query: "Philippine peso banknotes coins BSP", classification: "museum artifact", fallbackTitle: "File:Philippine peso banknotes.jpg", alt: "Philippine Peso currency banknotes and coins featuring national heroes and natural heritage.", caption: "Philippine Peso banknotes showcase national heroes on the obverse and UNESCO heritage sites and endemic wildlife on the reverse." }
  },
  {
    lessonId: "lesson-10",
    media1: { id: "l10-philippine-jeepney-classic", query: "Jeepney Manila iconic transport", classification: "photograph", fallbackTitle: "File:Jeepney in Manila.jpg", alt: "Colorful classic Philippine Jeepney with elaborate folk artwork and chrome horses.", caption: "The iconic Philippine Jeepney, originally adapted from surplus post-war vehicles, is a beloved symbol of Filipino creativity and mass transit." },
    media2: { id: "l10-motorized-tricycle-philippines", query: "Tricycle transport Philippines", classification: "photograph", fallbackTitle: "File:Tricycle in the Philippines.jpg", alt: "Philippine motorized passenger tricycle navigate neighborhood streets.", caption: "Motorized tricycles provide essential neighborhood transportation across towns and rural barangays throughout the islands." }
  },
  {
    lessonId: "lesson-11",
    media1: { id: "l11-sungka-board-game-shells", query: "Sungka wooden board game cowrie", classification: "museum artifact", fallbackTitle: "File:Sungka board.jpg", alt: "Traditional carved wooden Sungka game board with cowrie shells in oval pits.", caption: "Sungka is a traditional Philippine mancala game played on a carved wooden board (*sungkaan*) using cowrie shells or small stones." },
    media2: { id: "l11-larong-pinoy-patintero-children", query: "Children playing traditional Filipino games", classification: "photograph", fallbackTitle: "File:Filipino children playing.jpg", alt: "Filipino children joyfully playing traditional street games outdoors.", caption: "Traditional games (*Larong Pinoy*) like *Patintero*, *Tumbang Preso*, and *Piko* foster community bonding and agility." }
  },
  {
    lessonId: "lesson-12",
    media1: { id: "l12-kulintang-gong-ensemble", query: "Kulintang gongs Maguindanao ensemble", classification: "museum artifact", fallbackTitle: "File:Kulintang instrument.jpg", alt: "Set of tuned brass Kulintang bossed gongs laid horizontally on an ornate wooden frame.", caption: "The Kulintang is an ancient bronze gong chime ensemble of Mindanao, celebrated for its complex polyrhythmic melodies." },
    media2: { id: "l12-kudyapi-lute-instrument", query: "Kudyapi boat lute Philippine instrument", classification: "museum artifact", fallbackTitle: "File:Kudyapi boat lute.jpg", alt: "Carved two-stringed wooden Kudyapi boat lute from the Philippines.", caption: "The *Kudyapi* is an indigenous two-stringed fretted boat lute crafted with intricate sacred wood carvings." }
  },
  {
    lessonId: "lesson-13",
    media1: { id: "l13-philippine-national-map-regions", query: "Philippines administrative regions map", classification: "authoritative map", fallbackTitle: "File:Regions of the Philippines map.svg", alt: "Complete administrative map of the Philippines showing Luzon, Visayas, and Mindanao.", caption: "The Philippines is organized into three major island groups—Luzon, Visayas, and Mindanao—comprising 17 administrative regions." },
    media2: { id: "l13-buwan-ng-wika-celebration", query: "Buwan ng Wika children traditional costume", classification: "photograph", fallbackTitle: "File:Filipino children in traditional attire.jpg", alt: "Filipino students dressed in traditional Barong Tagalog and Filipiniana celebrating Buwan ng Wika.", caption: "August marks *Buwan ng Wikang Pambansa*, a nationwide festival honoring Filipino languages, literature, and cultural heritage." }
  },

  // ── SEPTEMBER: LUZON EXPEDITION, GEOGRAPHY & HERITAGE ──
  {
    lessonId: "lesson-14",
    media1: { id: "l14-banaue-rice-terraces-unesco", query: "Banaue Rice Terraces Ifugao", classification: "photograph", fallbackTitle: "File:Banaue Rice Terraces.jpg", alt: "Ancient Batad and Banaue rice terraces carved into the Cordillera mountain slopes.", caption: "The Rice Terraces of the Philippine Cordilleras are a 2,000-year-old UNESCO World Heritage landscape built by the indigenous Ifugao people." },
    media2: { id: "l14-cordillera-mountain-range", query: "Cordillera Central mountains Luzon", classification: "photograph", fallbackTitle: "File:Cordillera Central Luzon.jpg", alt: "Misty pine-clad ridges and peaks of the Cordillera Central mountain range in Northern Luzon.", caption: "The Cordillera Central forms the backbone of Northern Luzon, hosting rich highland ecosystems and ancestral cultural traditions." }
  },
  {
    lessonId: "lesson-15",
    media1: { id: "l15-mayon-volcano-cagsawa", query: "Mayon Volcano Albay Cagsawa Ruins", classification: "photograph", fallbackTitle: "File:Mayon Volcano in Albay.jpg", alt: "Mayon Volcano symmetrical conical peak rising behind the historic Cagsawa bell tower ruins.", caption: "Mayon Volcano in Albay is celebrated worldwide for its almost perfectly symmetrical conical stratovolcano structure." },
    media2: { id: "l15-stratovolcano-anatomy-diagram", query: "Stratovolcano geological cross section", classification: "original diagram", isDiagram: true, alt: "Original instructional diagram explaining the volcanic anatomy and crater mechanics of Mayon stratovolcano.", caption: "Stratovolcanoes are constructed of alternating layers of hardened lava flows, tephra, pumice, and volcanic ash." }
  },
  {
    lessonId: "lesson-16",
    media1: { id: "l16-fort-santiago-intramuros", query: "Fort Santiago Intramuros Manila gate", classification: "photograph", fallbackTitle: "File:Fort Santiago gate Intramuros.jpg", alt: "Historic stone gate of Fort Santiago within the walled city of Intramuros in Manila.", caption: "Fort Santiago was the premier Spanish colonial citadel in Manila, guarding the mouth of the Pasig River." },
    media2: { id: "l16-intramuros-historic-map-18th", query: "Plan of Manila Intramuros historical map", classification: "primary_source_scan", fallbackTitle: "File:Historical map of Manila Intramuros.jpg", alt: "Historic 18th-century cartographic plan of the walled city of Intramuros and Pasig River.", caption: "Colonial cartographic plan showing the defensive bastions, moats, and grid layout of 18th-century Intramuros." }
  },
  {
    lessonId: "lesson-17",
    media1: { id: "l17-dr-jose-rizal-historical-portrait", query: "Jose Rizal historical portrait Madrid 1890", classification: "primary_source_scan", fallbackTitle: "File:Jose Rizal 1890 portrait.jpg", alt: "Historical studio photograph of Dr. Jose Rizal, national hero of the Philippines.", caption: "Dr. Jose Rizal (1861–1896), polymath, physician, and national hero whose writings inspired the Philippine struggle for freedom." },
    media2: { id: "l17-rizal-monument-luneta", query: "Rizal Monument Luneta Park Manila", classification: "photograph", fallbackTitle: "File:Rizal Monument in Luneta.jpg", alt: "Granite and bronze Rizal Monument standing in Luneta Park (Rizal Park), Manila.", caption: "The Rizal Monument in Luneta Park stands as the solemn national memorial marking the resting place of Dr. Jose Rizal." }
  },
  {
    lessonId: "lesson-18",
    media1: { id: "l18-lagundi-herbal-plant", query: "Lagundi Vitex negundo medicinal plant Philippines", classification: "photograph", fallbackTitle: "File:Vitex negundo plant.jpg", alt: "Fresh leaves of the Lagundi medicinal plant used in traditional Filipino healing.", caption: "Lagundi (*Vitex negundo*) is an officially recognized Philippine herbal plant valued for promoting respiratory wellness." },
    media2: { id: "l18-tagalog-body-parts-diagram", query: "Tagalog body parts anatomy chart", classification: "original diagram", isDiagram: true, alt: "Original educational diagram identifying Tagalog terms for body parts with pronunciation.", caption: "Tagalog anatomical vocabulary (ulo, mata, ilong, bibig, tainga, kamay, paa) teaches children self-care and health communication." }
  },
  {
    lessonId: "lesson-19",
    media1: { id: "l19-barong-tagalog-pina-embroidery", query: "Barong Tagalog Pina fabric embroidery", classification: "museum artifact", fallbackTitle: "File:Barong Tagalog embroidery.jpg", alt: "Intricate hand-embroidered floral patterns on delicate translucent Piña fabric of a Barong Tagalog.", caption: "The Barong Tagalog is the national formal garment of the Philippines, handcrafted from pineapple fiber (*piña*) with delicate embroidery." },
    media2: { id: "l19-barot-saya-traditional-dress", query: "Baro't saya Maria Clara gown traditional", classification: "museum artifact", fallbackTitle: "File:Traditional Baro't Saya.jpg", alt: "Traditional Filipino Baro't Saya gown with butterfly sleeves on museum display.", caption: "The *Baro't Saya* and *Maria Clara* dress represent traditional Filipino women's attire featuring graceful butterfly sleeves (*terno*)." }
  },
  {
    lessonId: "lesson-20",
    media1: { id: "l20-sampaguita-garland-flowers", query: "Sampaguita garland Jasminum sambac", classification: "photograph", fallbackTitle: "File:Sampaguita flowers.jpg", alt: "Fragrant white Sampaguita flower buds strung into a traditional welcoming garland.", caption: "The *Sampaguita* (*Jasminum sambac*) is the national flower of the Philippines, symbolizing purity, humility, and honor." },
    media2: { id: "l20-narra-tree-philippines", query: "Narra tree Pterocarpus indicus", classification: "photograph", fallbackTitle: "File:Narra tree.jpg", alt: "Majestic tall Narra hardwood tree with broad green canopy.", caption: "The *Narra* (*Pterocarpus indicus*) is the national tree of the Philippines, famed for its strength, durability, and fragrant golden blossoms." }
  },
  {
    lessonId: "lesson-21",
    media1: { id: "l21-flag-ceremony-philippine-school", query: "Philippine flag ceremony morning school", classification: "photograph", fallbackTitle: "File:Philippine flag ceremony.jpg", alt: "Students and teachers standing respectfully with hands over hearts during morning flag ceremony.", caption: "Every school day begins with the solemn singing of the national anthem *Lupang Hinirang* and recitation of the *Panatang Makabayan*." },
    media2: { id: "l21-classroom-supplies-tagalog-diagram", query: "School supplies Tagalog classroom chart", classification: "original diagram", isDiagram: true, alt: "Original instructional chart showing school supplies labeled in Tagalog and English.", caption: "Tagalog school vocabulary (aklat, kuwaderno, lapis, pambura, gunting) supports bilingual literacy." }
  },
  {
    lessonId: "lesson-22",
    media1: { id: "l22-sari-sari-window-counter", query: "Sari-sari store window counter Philippines", classification: "photograph", fallbackTitle: "File:Sari-sari store close-up.jpg", alt: "Close-up of a wooden sari-sari store counter with glass candy jars and packaged snacks.", caption: "Sari-sari store counters are designed for intimate, friendly neighborhood exchanges and quick household necessities." },
    media2: { id: "l22-peso-coinage-series", query: "Philippine Peso coins BSP series", classification: "museum artifact", fallbackTitle: "File:Philippine coins BSP.jpg", alt: "Set of modern Philippine coins showing denominations from 1 Peso to 20 Pesos.", caption: "Philippine coins feature endemic flora including the *Kapa-kapa*, *Tayabak*, and *Nilad* on the reverse." }
  },
  {
    lessonId: "lesson-23",
    media1: { id: "l23-pagasa-monsoon-satellite-map", query: "PAGASA weather satellite cyclone typhoon map", classification: "authoritative map", fallbackTitle: "File:PAGASA satellite weather map.jpg", alt: "Meteorological satellite image showing tropical cloud bands over the Philippine Area of Responsibility.", caption: "PAGASA monitors the Philippine Area of Responsibility (PAR) to provide vital weather forecasts and typhoon warnings." },
    media2: { id: "l23-amihan-habagat-wind-pattern", query: "Amihan Habagat monsoon wind seasons Philippines", classification: "original diagram", isDiagram: true, alt: "Original diagram mapping the northeast monsoon (Amihan) and southwest monsoon (Habagat) wind flows.", caption: "The Philippine climate is governed by two dominant wind seasons: the cool, dry *Amihan* and the warm, moist *Habagat*." }
  },
  {
    lessonId: "lesson-24",
    media1: { id: "l24-carabao-plowing-rice-field", query: "Carabao water buffalo rice paddy field Philippines", classification: "photograph", fallbackTitle: "File:Carabao in rice field.jpg", alt: "Water buffalo (Carabao) pulling a traditional plow through a flooded green rice field.", caption: "The Carabao (*Kalabaw*) is the farmer's steadfast companion, representing hard work, resilience, and rural industry." },
    media2: { id: "l24-carabao-wooden-cart-karuwata", query: "Carabao pulling wooden cart Philippines", classification: "photograph", fallbackTitle: "File:Carabao cart.jpg", alt: "Carabao resting beside a wooden agricultural transport cart in the Philippine countryside.", caption: "Carabaos have transported agricultural harvests from mountain fields to village markets for centuries." }
  },
  {
    lessonId: "lesson-25",
    media1: { id: "l25-tnalak-weaving-loom-mindanao", query: "T'nalak weaving abaca loom T'boli", classification: "museum artifact", fallbackTitle: "File:T'nalak weaving.jpg", alt: "Master indigenous weaver working at a backstrap loom creating sacred geometric T'nalak abaca patterns.", caption: "T'nalak is sacred cloth handwoven by T'boli dreamweavers from dyed wild abaca fibers in South Cotabato." },
    media2: { id: "l25-manunggul-jar-neolithic-artifact", query: "Manunggul Jar National Museum of the Philippines", classification: "museum artifact", fallbackTitle: "File:Manunggul Jar.jpg", alt: "The ancient Manunggul burial jar featuring two figures rowing a boat to the afterlife on its lid.", caption: "The *Manunggul Jar* (890–710 BC), discovered in Palawan, is a National Cultural Treasure depicting the maritime spiritual journey." }
  },
  {
    lessonId: "lesson-26",
    media1: { id: "l26-luzon-topographic-relief-map", query: "Luzon topographic relief physical map", classification: "authoritative map", fallbackTitle: "File:Luzon topographic map.jpg", alt: "Detailed topographic relief map of Luzon showing Sierra Madre, Cagayan Valley, and Central Plains.", caption: "Luzon is the largest and most populous island in the Philippines, characterized by vast fertile plains and mountain cordilleras." },
    media2: { id: "l26-pahiyas-festival-lucban-decorations", query: "Pahiyas Festival Lucban kiping rice decorations", classification: "photograph", fallbackTitle: "File:Pahiyas festival.jpg", alt: "Houses decorated with colorful leaf-shaped translucent rice wafers (kiping) during the Pahiyas Festival.", caption: "The *Pahiyas Festival* in Lucban, Quezon is a harvest thanksgiving celebration where homes are adorned with vibrant *kiping* rice wafers." }
  }
];

console.log(`Configured ${LESSON_MEDIA_TARGETS.length} target lessons.`);
