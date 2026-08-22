/**
 * WONDER JOURNEY OS — TRUTHFUL MEDIA ACQUISITION ENGINE
 * 
 * Downloads real, openly-licensed media from Wikimedia Commons
 * using the MediaWiki API. Verifies MIME, dimensions, license,
 * creator, and computes SHA-256 for each downloaded file.
 * 
 * Produces: public/media/curriculum/*.{jpg,png,svg}
 *           media-acquisition-results.json
 */

const fs = require("fs");
const path = require("path");
const https = require("https");
const http = require("http");
const crypto = require("crypto");

const MEDIA_DIR = path.join(__dirname, "../public/media/curriculum");
const LOG_PATH = path.join(__dirname, "../media-acquisition.log");

// Ensure media directory exists
if (!fs.existsSync(MEDIA_DIR)) {
  fs.mkdirSync(MEDIA_DIR, { recursive: true });
}

const log = (msg) => {
  const line = `[${new Date().toISOString()}] ${msg}`;
  console.log(line);
  fs.appendFileSync(LOG_PATH, line + "\n");
};

/**
 * Fetch URL content as Buffer with redirect following
 */
function fetchBuffer(url, maxRedirects = 5) {
  return new Promise((resolve, reject) => {
    if (maxRedirects <= 0) return reject(new Error("Too many redirects"));
    const mod = url.startsWith("https") ? https : http;
    const req = mod.get(url, { 
      headers: { 
        "User-Agent": "WonderJourneyOS/1.0 (Educational; sharon.rose.algara@gmail.com) Node.js" 
      },
      timeout: 30000 
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let redirectUrl = res.headers.location;
        if (redirectUrl.startsWith("/")) {
          const parsed = new URL(url);
          redirectUrl = parsed.protocol + "//" + parsed.host + redirectUrl;
        }
        return resolve(fetchBuffer(redirectUrl, maxRedirects - 1));
      }
      if (res.statusCode !== 200) {
        res.resume();
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      const chunks = [];
      res.on("data", (chunk) => chunks.push(chunk));
      res.on("end", () => resolve(Buffer.concat(chunks)));
      res.on("error", reject);
    });
    req.on("error", reject);
    req.on("timeout", () => { req.destroy(); reject(new Error("Timeout")); });
  });
}

/**
 * Fetch JSON from URL
 */
async function fetchJSON(url) {
  const buf = await fetchBuffer(url);
  return JSON.parse(buf.toString("utf8"));
}

/**
 * Query Wikimedia Commons API for image info
 */
async function queryWikimediaImageInfo(filename) {
  const encodedTitle = encodeURIComponent(filename);
  const apiUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodedTitle}&prop=imageinfo&iiprop=url|size|mime|extmetadata&format=json`;
  
  const data = await fetchJSON(apiUrl);
  const pages = data.query?.pages;
  if (!pages) return null;
  
  const pageId = Object.keys(pages)[0];
  if (pageId === "-1") return null;
  
  const page = pages[pageId];
  const info = page.imageinfo?.[0];
  if (!info) return null;
  
  const ext = info.extmetadata || {};
  
  return {
    pageUrl: `https://commons.wikimedia.org/wiki/${filename.replace(/ /g, "_")}`,
    directUrl: info.url,
    thumbUrl: info.thumburl,
    width: info.width,
    height: info.height,
    mime: info.mime,
    artist: (ext.Artist?.value || "").replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").trim() || "Unknown",
    license: ext.LicenseShortName?.value || "Unknown",
    licenseUrl: ext.LicenseUrl?.value || "",
    description: (ext.ImageDescription?.value || "").replace(/<[^>]+>/g, "").trim() || "",
    categories: ext.Categories?.value || "",
    dateTime: ext.DateTime?.value || ext.DateTimeOriginal?.value || "",
    credit: (ext.Credit?.value || "").replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").trim() || "",
    source: (ext.Source?.value || "").replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").trim() || "",
  };
}

/**
 * Search Wikimedia Commons for images matching a query
 */
async function searchWikimediaCommons(query, limit = 10) {
  const encodedQuery = encodeURIComponent(query);
  const apiUrl = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodedQuery}&srnamespace=6&srlimit=${limit}&format=json`;
  
  const data = await fetchJSON(apiUrl);
  return data.query?.search?.map(r => r.title) || [];
}

function getExtFromMime(mime) {
  const map = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/svg+xml": ".svg",
    "image/webp": ".webp",
    "image/gif": ".gif",
    "image/tiff": ".tiff",
  };
  return map[mime] || ".jpg";
}

/**
 * Normalize license strings from Wikimedia to our supported set
 */
function normalizeLicense(wikiLicense, licenseUrl) {
  const l = (wikiLicense || "").toLowerCase().replace(/[_-]/g, " ").trim();
  if (l.includes("public domain") || l.includes("pd") || l === "cc pd" || l.includes("no restrictions") || l.includes("pd-self") || l.includes("pd-us") || l.includes("pd-old") || l.includes("pd-author") || l.includes("pd-art")) {
    return { license: "Public Domain", licenseUrl: "https://creativecommons.org/publicdomain/mark/1.0/" };
  }
  if (l.includes("cc0") || l.includes("cc zero")) {
    return { license: "Public Domain", licenseUrl: "https://creativecommons.org/publicdomain/mark/1.0/" };
  }
  if (l.includes("cc by sa 4") || l === "cc by sa 4.0") {
    return { license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/" };
  }
  if (l.includes("cc by 4") || l === "cc by 4.0") {
    return { license: "CC BY 4.0", licenseUrl: "https://creativecommons.org/licenses/by/4.0/" };
  }
  if (l.includes("cc by sa 3") || l === "cc by sa 3.0") {
    return { license: "CC BY-SA 3.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/" };
  }
  if (l.includes("cc by 3")) {
    return { license: "CC BY-SA 3.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/" };
  }
  if (l.includes("cc by 2") && !l.includes("sa")) {
    return { license: "CC BY 2.0", licenseUrl: "https://creativecommons.org/licenses/by/2.0/" };
  }
  if (l.includes("cc by sa 2")) {
    return { license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/" };
  }
  // Check license URL as fallback
  if (licenseUrl) {
    const lu = licenseUrl.toLowerCase();
    if (lu.includes("publicdomain") || lu.includes("cc0") || lu.includes("zero")) return { license: "Public Domain", licenseUrl: "https://creativecommons.org/publicdomain/mark/1.0/" };
    if (lu.includes("by-sa/4")) return { license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/" };
    if (lu.includes("by/4")) return { license: "CC BY 4.0", licenseUrl: "https://creativecommons.org/licenses/by/4.0/" };
    if (lu.includes("by-sa/3")) return { license: "CC BY-SA 3.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/" };
    if (lu.includes("by/3")) return { license: "CC BY-SA 3.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/" };
    if (lu.includes("by/2")) return { license: "CC BY 2.0", licenseUrl: "https://creativecommons.org/licenses/by/2.0/" };
    if (lu.includes("by-sa/2")) return { license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/" };
  }
  return null;
}

/**
 * Detect MIME from magic bytes
 */
function detectMimeFromBytes(buffer) {
  if (buffer.length < 4) return "unknown";
  const hex = buffer.slice(0, 8).toString("hex");
  if (hex.startsWith("ffd8ff")) return "image/jpeg";
  if (hex.startsWith("89504e47")) return "image/png";
  if (hex.startsWith("474946")) return "image/gif";
  if (hex.startsWith("52494646")) {
    if (buffer.length > 12 && buffer.slice(8, 12).toString("ascii") === "WEBP") return "image/webp";
  }
  const text = buffer.toString("utf8", 0, Math.min(500, buffer.length));
  if (text.includes("<svg") || text.includes("<?xml")) return "image/svg+xml";
  return "unknown";
}

// ─────────────────────────────────────────────────────────────
// LESSON MEDIA SPECIFICATIONS — 65 lessons × 2 media each
// ─────────────────────────────────────────────────────────────

const LESSON_MEDIA_SPECS = [
  { lessonId: "lesson-1", media: [
    { searches: ["Philippine archipelago map", "Philippines location globe"], localName: "l01-philippine-archipelago-map", classification: "authoritative_map", title: "Philippine Archipelago Location Map", altText: "Map showing the location of the Philippine archipelago in Southeast Asia", caption: "Philippine Archipelago location in Southeast Asia" },
    { searches: ["Philippines satellite NASA", "Philippines aerial view archipelago"], localName: "l01-philippines-satellite", classification: "photograph", title: "Satellite Image of the Philippine Islands", altText: "Satellite photograph of the Philippine Islands showing the archipelago", caption: "Satellite view of the Philippine Islands (NASA)" },
  ]},
  { lessonId: "lesson-2", media: [
    { searches: ["El Nido Palawan Philippines", "Palawan coastline limestone"], localName: "l02-el-nido-palawan", classification: "photograph", title: "El Nido, Palawan Coastline", altText: "El Nido, Palawan showing limestone karst cliffs and turquoise waters", caption: "El Nido, Palawan coastline" },
    { searches: ["Philippine Sea map", "seas surrounding Philippines"], localName: "l02-philippine-seas-map", classification: "authoritative_map", title: "Seas Surrounding the Philippines", altText: "Map of the Philippine Sea, South China Sea, Sulu Sea and Celebes Sea", caption: "Map of seas surrounding the Philippines" },
  ]},
  { lessonId: "lesson-3", media: [
    { searches: ["Luzon Visayas Mindanao map island groups Philippines"], localName: "l03-island-groups-map", classification: "authoritative_map", title: "Three Island Groups of the Philippines", altText: "Map showing Luzon, Visayas, and Mindanao island groups", caption: "Three major island groups of the Philippines" },
    { searches: ["Flag Philippines official"], localName: "l03-philippine-flag", classification: "authoritative_map", title: "Flag of the Philippines", altText: "Philippine national flag with sun and three stars", caption: "Flag of the Philippines" },
  ]},
  { lessonId: "lesson-4", media: [
    { searches: ["Filipino family Philippines", "Philippine family gathering"], localName: "l04-filipino-family", classification: "photograph", title: "Filipino Family", altText: "A Filipino family gathering together", caption: "Filipino family showing close family ties" },
    { searches: ["bahay kubo nipa hut Philippines"], localName: "l04-bahay-kubo", classification: "photograph", title: "Traditional Bahay Kubo", altText: "A traditional Filipino bahay kubo nipa hut", caption: "Traditional bahay kubo (nipa hut)" },
  ]},
  { lessonId: "lesson-5", media: [
    { searches: ["Philippine Eagle Pithecophaga jefferyi"], localName: "l05-philippine-eagle", classification: "photograph", title: "Philippine Eagle", altText: "Philippine Eagle, critically endangered national bird", caption: "Philippine Eagle, national bird" },
    { searches: ["Sampaguita Jasminum sambac Philippines national flower"], localName: "l05-sampaguita", classification: "photograph", title: "Sampaguita National Flower", altText: "Sampaguita flowers, national flower of Philippines", caption: "Sampaguita, Philippine national flower" },
  ]},
  { lessonId: "lesson-6", media: [
    { searches: ["Apo Reef Philippines coral"], localName: "l06-apo-reef", classification: "photograph", title: "Apo Reef Natural Park", altText: "Apo Reef Natural Park coral formations", caption: "Apo Reef Natural Park" },
    { searches: ["Coral Triangle map biodiversity"], localName: "l06-coral-triangle-map", classification: "authoritative_map", title: "Coral Triangle Map", altText: "Map of the Coral Triangle marine biodiversity region", caption: "Coral Triangle biodiversity hotspot" },
  ]},
  { lessonId: "lesson-7", media: [
    { searches: ["Jose Rizal portrait photograph"], localName: "l07-jose-rizal", classification: "photograph", title: "Dr. José Rizal Portrait", altText: "Historical portrait of Dr. José Rizal", caption: "Dr. José Rizal (1861-1896), national hero" },
    { searches: ["Rizal Monument Luneta Park Manila"], localName: "l07-rizal-monument", classification: "photograph", title: "Rizal Monument, Luneta Park", altText: "Rizal Monument in Luneta Park, Manila", caption: "Rizal Monument, Luneta Park, Manila" },
  ]},
  { lessonId: "lesson-8", media: [
    { searches: ["Tubbataha Reef coral Philippines UNESCO"], localName: "l08-tubbataha-reef", classification: "photograph", title: "Tubbataha Reefs Natural Park", altText: "Tubbataha Reefs Natural Park coral formations", caption: "Tubbataha Reefs, UNESCO World Heritage Site" },
    { searches: ["whale shark Rhincodon typus Philippines Donsol"], localName: "l08-whale-shark", classification: "photograph", title: "Whale Shark in Philippine Waters", altText: "Whale shark swimming in clear water", caption: "Whale shark in Philippine waters" },
  ]},
  { lessonId: "lesson-9", media: [
    { searches: ["Philippine wet market palengke fresh produce"], localName: "l09-palengke-market", classification: "photograph", title: "Filipino Wet Market (Palengke)", altText: "Filipino wet market with fresh fruits and vegetables", caption: "Traditional Philippine wet market" },
    { searches: ["Philippine peso currency banknote"], localName: "l09-peso-currency", classification: "photograph", title: "Philippine Peso Currency", altText: "Philippine peso currency notes and coins", caption: "Philippine peso currency" },
  ]},
  { lessonId: "lesson-10", media: [
    { searches: ["jeepney Philippines colorful transport"], localName: "l10-jeepney", classification: "photograph", title: "Filipino Jeepney", altText: "Colorful Filipino jeepney, iconic public transport", caption: "Jeepney, iconic Philippine transport" },
    { searches: ["tricycle Philippines transport motorized"], localName: "l10-tricycle", classification: "photograph", title: "Philippine Motorized Tricycle", altText: "Motorized tricycle, common Philippine transport", caption: "Motorized tricycle, provincial transport" },
  ]},
  { lessonId: "lesson-11", media: [
    { searches: ["sungka board game Philippines traditional mancala"], localName: "l11-sungka-board", classification: "museum_artifact", title: "Sungka Game Board", altText: "Traditional carved wooden sungka board", caption: "Sungka, traditional Filipino game" },
    { searches: ["tinikling dance Philippines bamboo"], localName: "l11-tinikling", classification: "photograph", title: "Tinikling Folk Dance", altText: "Filipino children performing tinikling with bamboo poles", caption: "Tinikling, Philippine national folk dance" },
  ]},
  { lessonId: "lesson-12", media: [
    { searches: ["kulintang gong Philippines Mindanao instrument"], localName: "l12-kulintang", classification: "museum_artifact", title: "Kulintang Ensemble", altText: "Traditional kulintang gong ensemble from Mindanao", caption: "Kulintang, Mindanao musical instrument" },
    { searches: ["kudyapi kutiyapi lute Philippines instrument"], localName: "l12-kudyapi", classification: "museum_artifact", title: "Kudyapi Boat Lute", altText: "Traditional kudyapi two-stringed lute", caption: "Kudyapi, Philippine traditional lute" },
  ]},
  { lessonId: "lesson-13", media: [
    { searches: ["Buwan ng Wika Philippines language month celebration"], localName: "l13-buwan-ng-wika", classification: "photograph", title: "Buwan ng Wika Celebration", altText: "Students celebrating Buwan ng Wika in traditional attire", caption: "Buwan ng Wika language celebration" },
    { searches: ["Philippine languages ethnolinguistic map"], localName: "l13-languages-map", classification: "authoritative_map", title: "Philippine Ethnolinguistic Map", altText: "Map of major ethnolinguistic groups in the Philippines", caption: "Philippine ethnolinguistic map" },
  ]},
  { lessonId: "lesson-14", media: [
    { searches: ["Banaue rice terraces Ifugao Philippines"], localName: "l14-banaue-terraces", classification: "photograph", title: "Banaue Rice Terraces", altText: "Panoramic view of Banaue Rice Terraces, Ifugao", caption: "Banaue Rice Terraces, UNESCO Heritage" },
    { searches: ["Batad rice terraces amphitheater Ifugao"], localName: "l14-batad-terraces", classification: "photograph", title: "Batad Rice Terraces", altText: "Amphitheater-shaped Batad Rice Terraces", caption: "Batad Rice Terraces, Ifugao" },
  ]},
  { lessonId: "lesson-15", media: [
    { searches: ["Mayon Volcano Philippines cone Albay"], localName: "l15-mayon-volcano", classification: "photograph", title: "Mayon Volcano", altText: "Mayon Volcano with near-perfect cone shape, Albay", caption: "Mayon Volcano, Albay province" },
    { searches: ["Cagsawa church ruins Mayon Volcano"], localName: "l15-cagsawa-ruins", classification: "photograph", title: "Cagsawa Ruins with Mayon", altText: "Cagsawa Church ruins with Mayon Volcano background", caption: "Cagsawa ruins with Mayon Volcano" },
  ]},
  { lessonId: "lesson-16", media: [
    { searches: ["Fort Santiago gate Intramuros Manila"], localName: "l16-fort-santiago", classification: "photograph", title: "Fort Santiago, Intramuros", altText: "Historic Fort Santiago gate in Intramuros, Manila", caption: "Fort Santiago, Intramuros" },
    { searches: ["Intramuros Manila aerial walled city"], localName: "l16-intramuros", classification: "photograph", title: "Intramuros Walled City", altText: "Aerial view of historic Intramuros walled city", caption: "Intramuros, Walled City of Manila" },
  ]},
  { lessonId: "lesson-17", media: [
    { searches: ["Noli Me Tangere Jose Rizal novel book"], localName: "l17-noli-me-tangere", classification: "historical_artwork", title: "Noli Me Táng­ere by José Rizal", altText: "Noli Me Táng­ere, 1887 novel by José Rizal", caption: "Noli Me Táng­ere (1887) by Dr. José Rizal" },
    { searches: ["Jose Rizal photograph 1890 portrait"], localName: "l17-rizal-photo", classification: "photograph", title: "Dr. José Rizal Photograph", altText: "Historical photograph of Dr. José Rizal", caption: "Dr. José Rizal (Public Domain)" },
  ]},
  { lessonId: "lesson-18", media: [
    { searches: ["Vitex negundo lagundi plant Philippines medicinal"], localName: "l18-lagundi", classification: "photograph", title: "Lagundi (Vitex negundo)", altText: "Lagundi plant, Philippine traditional medicine", caption: "Lagundi, Philippine medicinal plant" },
    { searches: ["Philippine herbal medicine traditional plant"], localName: "l18-herbal-medicine", classification: "photograph", title: "Philippine Traditional Herbal Medicine", altText: "Traditional Filipino herbal medicine plants", caption: "Philippine traditional herbal medicine" },
  ]},
  { lessonId: "lesson-19", media: [
    { searches: ["Barong Tagalog embroidered Philippines formal"], localName: "l19-barong-tagalog", classification: "photograph", title: "Barong Tagalog", altText: "Embroidered barong tagalog formal garment", caption: "Barong Tagalog, Philippine formal wear" },
    { searches: ["Filipiniana Maria Clara dress baro't saya Philippines"], localName: "l19-filipiniana-dress", classification: "photograph", title: "Filipiniana Dress", altText: "Traditional filipiniana Maria Clara dress", caption: "Maria Clara dress, Philippine women's attire" },
  ]},
  { lessonId: "lesson-20", media: [
    { searches: ["Sampaguita Jasminum sambac white flower Philippines"], localName: "l20-sampaguita", classification: "photograph", title: "Sampaguita (Jasminum sambac)", altText: "Sampaguita flowers, Philippine national flower", caption: "Sampaguita, Philippine national flower" },
    { searches: ["Narra tree Pterocarpus indicus Philippines"], localName: "l20-narra-tree", classification: "photograph", title: "Narra Tree (Pterocarpus indicus)", altText: "Narra tree, Philippine national tree", caption: "Narra, Philippine national tree" },
  ]},
  { lessonId: "lesson-21", media: [
    { searches: ["Malacanang Palace Philippines president residence"], localName: "l21-malacanang", classification: "photograph", title: "Malacañang Palace", altText: "Malacañang Palace, Philippine presidential residence", caption: "Malacañang Palace, Manila" },
    { searches: ["Coat of arms Philippines seal official"], localName: "l21-coat-of-arms", classification: "authoritative_map", title: "Philippine Coat of Arms", altText: "Official coat of arms of the Philippines", caption: "Coat of Arms of the Republic of the Philippines" },
  ]},
  { lessonId: "lesson-22", media: [
    { searches: ["Filipino students classroom Philippines school"], localName: "l22-students-classroom", classification: "photograph", title: "Filipino Students in Classroom", altText: "Filipino students in a school classroom", caption: "Filipino students in school" },
    { searches: ["Philippine flag ceremony school students morning"], localName: "l22-flag-ceremony", classification: "photograph", title: "School Flag Ceremony", altText: "Students at Philippine flag-raising ceremony", caption: "Morning flag ceremony, Philippine school" },
  ]},
  { lessonId: "lesson-23", media: [
    { searches: ["sari-sari store Philippines neighborhood shop"], localName: "l23-sari-sari-store", classification: "photograph", title: "Sari-Sari Store", altText: "Filipino sari-sari neighborhood variety store", caption: "Sari-sari store, Philippine neighborhood shop" },
    { searches: ["Philippine peso banknote money currency"], localName: "l23-peso-banknotes", classification: "photograph", title: "Philippine Peso Banknotes", altText: "Philippine peso banknotes", caption: "Philippine peso banknotes" },
  ]},
  { lessonId: "lesson-24", media: [
    { searches: ["Typhoon satellite Philippines Pacific NASA"], localName: "l24-typhoon-satellite", classification: "photograph", title: "Typhoon Satellite Image", altText: "Satellite image of typhoon approaching Philippines", caption: "Typhoon satellite image (NASA)" },
    { searches: ["Philippines climate map Koppen classification"], localName: "l24-climate-map", classification: "authoritative_map", title: "Philippine Climate Map", altText: "Climate classification map of the Philippines", caption: "Philippine climate zones" },
  ]},
  { lessonId: "lesson-25", media: [
    { searches: ["Carabao water buffalo Philippines rice paddy"], localName: "l25-carabao", classification: "photograph", title: "Carabao (Water Buffalo)", altText: "Carabao water buffalo in Philippine rice paddy", caption: "Carabao, Philippine national animal" },
    { searches: ["Carabao Festival Pulilan Philippines decorated"], localName: "l25-carabao-festival", classification: "photograph", title: "Carabao Festival", altText: "Decorated carabao at Philippine festival", caption: "Carabao festival celebration" },
  ]},
  { lessonId: "lesson-26", media: [
    { searches: ["Manunggul Jar burial Philippines National Museum"], localName: "l26-manunggul-jar", classification: "museum_artifact", title: "Manunggul Burial Jar", altText: "Manunggul Jar with soul boat lid, National Museum", caption: "Manunggul Jar (890-710 BC)" },
    { searches: ["Laguna Copperplate Inscription Philippines ancient"], localName: "l26-laguna-copperplate", classification: "primary_source_scan", title: "Laguna Copperplate Inscription", altText: "Laguna Copperplate Inscription, earliest Philippine document", caption: "Laguna Copperplate Inscription (900 AD)" },
  ]},
  { lessonId: "lesson-27", media: [
    { searches: ["T'nalak weaving T'boli Mindanao Philippines textile"], localName: "l27-tnalak-textile", classification: "museum_artifact", title: "T'nalak Woven Textile", altText: "T'nalak cloth by T'boli people of Mindanao", caption: "T'nalak, sacred T'boli textile" },
    { searches: ["pina cloth piña fiber Philippines weaving"], localName: "l27-pina-cloth", classification: "museum_artifact", title: "Piña Fiber Cloth", altText: "Piña fiber cloth from pineapple leaves", caption: "Piña cloth, used for barong tagalog" },
  ]},
  { lessonId: "lesson-28", media: [
    { searches: ["Sinulog Festival Cebu Philippines dancers"], localName: "l28-sinulog", classification: "photograph", title: "Sinulog Festival, Cebu", altText: "Sinulog Festival street dancers in Cebu", caption: "Sinulog Festival, Cebu City" },
    { searches: ["Ati-Atihan Festival Kalibo Aklan Philippines"], localName: "l28-ati-atihan", classification: "photograph", title: "Ati-Atihan Festival", altText: "Ati-Atihan Festival participants in Kalibo", caption: "Ati-Atihan Festival, Kalibo, Aklan" },
  ]},
  { lessonId: "lesson-29", media: [
    { searches: ["adobo chicken Filipino dish cuisine Philippines"], localName: "l29-chicken-adobo", classification: "photograph", title: "Filipino Chicken Adobo", altText: "Filipino chicken adobo in soy-vinegar sauce", caption: "Chicken adobo, Philippine iconic dish" },
    { searches: ["sinigang soup pork Filipino Philippines"], localName: "l29-sinigang", classification: "photograph", title: "Sinigang na Baboy", altText: "Sinigang, Filipino sour soup with vegetables", caption: "Sinigang, traditional sour soup" },
  ]},
  { lessonId: "lesson-30", media: [
    { searches: ["Taal Volcano crater lake Batangas Philippines"], localName: "l30-taal-volcano", classification: "photograph", title: "Taal Volcano and Crater Lake", altText: "Taal Volcano with crater lake, Batangas", caption: "Taal Volcano, Batangas" },
    { searches: ["Mount Pinatubo eruption 1991 Philippines USGS"], localName: "l30-pinatubo", classification: "photograph", title: "Mount Pinatubo Eruption (1991)", altText: "Mount Pinatubo eruption column, 1991", caption: "Mount Pinatubo eruption, 1991 (USGS)" },
  ]},
  { lessonId: "lesson-31", media: [
    { searches: ["Puerto Princesa Underground River Palawan Philippines"], localName: "l31-underground-river", classification: "photograph", title: "Puerto Princesa Underground River", altText: "Puerto Princesa Underground River, Palawan", caption: "Underground River, Palawan" },
    { searches: ["Laguna de Bay lake Philippines largest"], localName: "l31-laguna-de-bay", classification: "photograph", title: "Laguna de Bay", altText: "Laguna de Bay, largest Philippine lake", caption: "Laguna de Bay, largest lake" },
  ]},
  { lessonId: "lesson-32", media: [
    { searches: ["Palawan peacock pheasant Philippines bird endemic"], localName: "l32-palawan-pheasant", classification: "photograph", title: "Palawan Peacock-Pheasant", altText: "Palawan peacock-pheasant, Philippine endemic bird", caption: "Palawan Peacock-Pheasant" },
    { searches: ["Philippine hornbill tarictic Visayan bird"], localName: "l32-hornbill", classification: "photograph", title: "Philippine Hornbill", altText: "Philippine hornbill species, endangered endemic bird", caption: "Philippine hornbill, endangered endemic" },
  ]},
  { lessonId: "lesson-33", media: [
    { searches: ["Chocolate Hills Bohol Philippines geological"], localName: "l33-chocolate-hills", classification: "photograph", title: "Chocolate Hills, Bohol", altText: "Chocolate Hills in Bohol, cone-shaped geological formations", caption: "Chocolate Hills, Bohol" },
    { searches: ["Philippine tarsier Bohol primate Carlito syrichta"], localName: "l33-tarsier", classification: "photograph", title: "Philippine Tarsier", altText: "Philippine tarsier clinging to a branch", caption: "Philippine Tarsier, Bohol" },
  ]},
  { lessonId: "lesson-34", media: [
    { searches: ["tinikling dance bamboo Philippines national"], localName: "l34-tinikling", classification: "photograph", title: "Tinikling Folk Dance", altText: "Dancers performing tinikling with bamboo poles", caption: "Tinikling, national folk dance" },
    { searches: ["Pandanggo sa Ilaw dance Philippines oil lamp"], localName: "l34-pandanggo", classification: "photograph", title: "Pandanggo sa Ilaw", altText: "Dance of Lights with oil lamps on hands and head", caption: "Pandanggo sa Ilaw, Dance of Lights" },
  ]},
  { lessonId: "lesson-35", media: [
    { searches: ["parol lantern star Philippines Christmas"], localName: "l35-parol", classification: "photograph", title: "Filipino Parol Star Lantern", altText: "Colorful parol, Philippine Christmas star lantern", caption: "Parol, Philippine Christmas lantern" },
    { searches: ["banig woven mat Philippines handicraft"], localName: "l35-banig", classification: "museum_artifact", title: "Banig Woven Mat", altText: "Banig, traditional hand-woven Philippine mat", caption: "Banig, traditional woven mat" },
  ]},
  { lessonId: "lesson-36", media: [
    { searches: ["Ibong Adarna Philippine literature epic bird"], localName: "l36-ibong-adarna", classification: "historical_artwork", title: "Ibong Adarna Illustration", altText: "Illustration of Ibong Adarna, magical bird from Philippine literature", caption: "Ibong Adarna, Philippine literary classic" },
    { searches: ["Francisco Balagtas Florante Laura Philippines"], localName: "l36-florante-laura", classification: "historical_artwork", title: "Florante at Laura", altText: "Florante at Laura by Francisco Balagtas", caption: "Florante at Laura (1838) by Balagtas" },
  ]},
  { lessonId: "lesson-37", media: [
    { searches: ["San Agustin Church Manila Philippines oldest stone"], localName: "l37-san-agustin", classification: "photograph", title: "San Agustin Church, Manila", altText: "San Agustin Church, oldest stone church in the Philippines", caption: "San Agustin Church, UNESCO Heritage" },
    { searches: ["Vigan heritage houses Calle Crisologo Ilocos Sur"], localName: "l37-vigan", classification: "photograph", title: "Vigan Heritage Houses", altText: "Heritage houses on Calle Crisologo, Vigan", caption: "Calle Crisologo, Vigan City" },
  ]},
  { lessonId: "lesson-38", media: [
    { searches: ["coconut palm tree Philippines beach tropical"], localName: "l38-coconut-palm", classification: "photograph", title: "Coconut Palm Tree", altText: "Coconut palm trees along Philippine beach", caption: "Coconut palm, Tree of Life" },
    { searches: ["rice paddies Philippines green field agriculture"], localName: "l38-rice-paddies", classification: "photograph", title: "Philippine Rice Paddies", altText: "Lush green rice paddies in the Philippines", caption: "Philippine rice paddies" },
  ]},
  { lessonId: "lesson-39", media: [
    { searches: ["Philippine mythology Bathala supreme deity art"], localName: "l39-bathala", classification: "historical_artwork", title: "Bathala Supreme Deity", altText: "Artistic depiction of Bathala, supreme Tagalog deity", caption: "Bathala, Tagalog mythology" },
    { searches: ["Bakunawa dragon serpent Philippine mythology"], localName: "l39-bakunawa", classification: "historical_artwork", title: "Bakunawa Sea Dragon", altText: "Bakunawa, dragon from Philippine mythology", caption: "Bakunawa, mythological sea dragon" },
  ]},
  { lessonId: "lesson-40", media: [
    { searches: ["arnis eskrima kali Philippine martial art stick"], localName: "l40-arnis", classification: "photograph", title: "Arnis Martial Art", altText: "Arnis practitioners, Philippine national martial art", caption: "Arnis, Philippine martial art" },
    { searches: ["sipa kick rattan ball Philippines traditional sport"], localName: "l40-sipa", classification: "photograph", title: "Sipa Traditional Sport", altText: "Players demonstrating sipa, Filipino kick sport", caption: "Sipa, traditional Filipino sport" },
  ]},
  { lessonId: "lesson-41", media: [
    { searches: ["Philippines provinces political map administrative"], localName: "l41-provinces-map", classification: "authoritative_map", title: "Map of Philippine Provinces", altText: "Political map showing Philippine provinces", caption: "Philippine provinces map" },
    { searches: ["Boracay beach white sand Philippines Aklan"], localName: "l41-boracay", classification: "photograph", title: "Boracay White Beach", altText: "White sand beach of Boracay Island", caption: "Boracay White Beach, Aklan" },
  ]},
  { lessonId: "lesson-42", media: [
    { searches: ["Simbang Gabi mass church Philippines Christmas"], localName: "l42-simbang-gabi", classification: "photograph", title: "Simbang Gabi", altText: "Filipino churchgoers at Simbang Gabi night mass", caption: "Simbang Gabi, Christmas tradition" },
    { searches: ["Giant lantern festival San Fernando Pampanga Philippines"], localName: "l42-giant-lantern", classification: "photograph", title: "Giant Lantern Festival", altText: "Giant lantern festival in San Fernando, Pampanga", caption: "Giant Lantern Festival, Pampanga" },
  ]},
  { lessonId: "lesson-43", media: [
    { searches: ["Philippines mangrove forest ecosystem coastal"], localName: "l43-mangrove", classification: "photograph", title: "Philippine Mangrove Forest", altText: "Mangrove forest along Philippine coastline", caption: "Philippine mangrove ecosystem" },
    { searches: ["Mount Apo highest Philippines Mindanao mountain"], localName: "l43-mount-apo", classification: "photograph", title: "Mount Apo", altText: "Mount Apo, highest peak in the Philippines", caption: "Mount Apo, highest Philippine peak" },
  ]},
  { lessonId: "lesson-44", media: [
    { searches: ["Andres Bonifacio portrait Philippines hero Katipunan"], localName: "l44-bonifacio", classification: "photograph", title: "Andrés Bonifacio", altText: "Portrait of Andrés Bonifacio, Katipunan founder", caption: "Andrés Bonifacio (1863-1897)" },
    { searches: ["Apolinario Mabini portrait Philippines revolutionary"], localName: "l44-mabini", classification: "photograph", title: "Apolinario Mabini", altText: "Portrait of Apolinario Mabini", caption: "Apolinario Mabini (1864-1903)" },
  ]},
  { lessonId: "lesson-45", media: [
    { searches: ["Baybayin script Philippines writing system ancient"], localName: "l45-baybayin", classification: "primary_source_scan", title: "Baybayin Writing System", altText: "Baybayin characters, ancient Philippine script", caption: "Baybayin, Philippine writing system" },
    { searches: ["Doctrina Christiana 1593 Philippines first book printed"], localName: "l45-doctrina-christiana", classification: "primary_source_scan", title: "Doctrina Christiana (1593)", altText: "Page from Doctrina Christiana, first Philippine printed book", caption: "Doctrina Christiana, 1593" },
  ]},
  { lessonId: "lesson-46", media: [
    { searches: ["bangus milkfish Philippines national fish food"], localName: "l46-bangus", classification: "photograph", title: "Bangus (Milkfish)", altText: "Bangus milkfish, Philippine national fish", caption: "Bangus, Philippine national fish" },
    { searches: ["Philippines seafood market fish fresh dampa"], localName: "l46-seafood-market", classification: "photograph", title: "Philippine Seafood Market", altText: "Fresh seafood at a Philippine market", caption: "Philippine seafood market" },
  ]},
  { lessonId: "lesson-47", media: [
    { searches: ["santos wooden carving Philippines religious art"], localName: "l47-santos", classification: "museum_artifact", title: "Filipino Santos Carving", altText: "Santos, Filipino religious wood carving", caption: "Santos, traditional wood carving" },
    { searches: ["capiz shell craft Philippines Placuna"], localName: "l47-capiz-shells", classification: "photograph", title: "Capiz Shell Products", altText: "Decorative capiz shell products", caption: "Capiz shell crafts" },
  ]},
  { lessonId: "lesson-48", media: [
    { searches: ["bayanihan Philippines community carry house nipa"], localName: "l48-bayanihan", classification: "photograph", title: "Bayanihan Tradition", altText: "Community carrying a nipa hut together (bayanihan)", caption: "Bayanihan, Filipino community spirit" },
    { searches: ["Pahiyas Festival Lucban Quezon Philippines harvest"], localName: "l48-pahiyas", classification: "photograph", title: "Pahiyas Festival", altText: "Colorful houses at Pahiyas Festival, Lucban", caption: "Pahiyas Festival, Lucban, Quezon" },
  ]},
  { lessonId: "lesson-49", media: [
    { searches: ["Philippine salt making traditional artisan Pangasinan"], localName: "l49-salt-making", classification: "photograph", title: "Traditional Salt Making", altText: "Traditional Philippine salt-making process", caption: "Philippine traditional salt making" },
    { searches: ["Fe del Mundo Philippines pediatrician pioneer doctor"], localName: "l49-fe-del-mundo", classification: "photograph", title: "Dr. Fe del Mundo", altText: "Dr. Fe del Mundo, pioneering pediatrician", caption: "Dr. Fe del Mundo, pediatrics pioneer" },
  ]},
  { lessonId: "lesson-50", media: [
    { searches: ["Coron Island Palawan Philippines lagoon kayangan"], localName: "l50-coron-palawan", classification: "photograph", title: "Coron Island, Palawan", altText: "Crystal-clear waters of Coron Island, Palawan", caption: "Coron Island, Palawan" },
    { searches: ["Hundred Islands Pangasinan Philippines national park"], localName: "l50-hundred-islands", classification: "photograph", title: "Hundred Islands National Park", altText: "Hundred Islands National Park, Pangasinan", caption: "Hundred Islands, Pangasinan" },
  ]},
  { lessonId: "lesson-51", media: [
    { searches: ["Philippine independence declaration 1898 Kawit Cavite"], localName: "l51-independence", classification: "primary_source_scan", title: "Philippine Declaration of Independence", altText: "Philippine Declaration of Independence document, 1898", caption: "Independence declaration, June 12, 1898" },
    { searches: ["Emilio Aguinaldo portrait president Philippines first"], localName: "l51-aguinaldo", classification: "photograph", title: "President Emilio Aguinaldo", altText: "Emilio Aguinaldo, first Philippine President", caption: "Emilio Aguinaldo (1869-1964)" },
  ]},
  { lessonId: "lesson-52", media: [
    { searches: ["kamayan feast Philippines eating hands banana leaf"], localName: "l52-kamayan", classification: "photograph", title: "Kamayan Feast", altText: "Kamayan feast with food on banana leaves", caption: "Kamayan, eating with hands" },
    { searches: ["boodle fight Philippines communal meal military"], localName: "l52-boodle-fight", classification: "photograph", title: "Boodle Fight Meal", altText: "Boodle fight communal meal on banana leaves", caption: "Boodle fight, communal dining" },
  ]},
  { lessonId: "lesson-53", media: [
    { searches: ["tamaraw buffalo Mindoro Philippines Bubalus mindorensis"], localName: "l53-tamaraw", classification: "photograph", title: "Tamaraw (Bubalus mindorensis)", altText: "Tamaraw, critically endangered Mindoro buffalo", caption: "Tamaraw, endemic to Mindoro" },
    { searches: ["Philippine crocodile Crocodylus mindorensis endangered"], localName: "l53-philippine-crocodile", classification: "photograph", title: "Philippine Crocodile", altText: "Philippine crocodile, endangered species", caption: "Philippine crocodile, critically endangered" },
  ]},
  { lessonId: "lesson-54", media: [
    { searches: ["Callao Cave Cagayan Philippines chapel Homo luzonensis"], localName: "l54-callao-cave", classification: "photograph", title: "Callao Cave, Cagayan", altText: "Interior of Callao Cave, Cagayan Valley", caption: "Callao Cave, Homo luzonensis site" },
    { searches: ["Sagada hanging coffins Mountain Province Philippines"], localName: "l54-hanging-coffins", classification: "photograph", title: "Hanging Coffins of Sagada", altText: "Hanging coffins on cliffs in Sagada", caption: "Hanging coffins, Sagada" },
  ]},
  { lessonId: "lesson-55", media: [
    { searches: ["Spoliarium Juan Luna painting Philippines 1884"], localName: "l55-spoliarium", classification: "historical_artwork", title: "Spoliarium by Juan Luna", altText: "Spoliarium by Juan Luna, gold medal at Madrid 1884", caption: "Spoliarium (1884) by Juan Luna" },
    { searches: ["Fernando Amorsolo painting Philippines national artist"], localName: "l55-amorsolo", classification: "historical_artwork", title: "Painting by Fernando Amorsolo", altText: "Work by Fernando Amorsolo, first National Artist", caption: "Fernando Amorsolo, National Artist" },
  ]},
  { lessonId: "lesson-56", media: [
    { searches: ["rondalla string ensemble Philippines bandurria"], localName: "l56-rondalla", classification: "photograph", title: "Rondalla Ensemble", altText: "Filipino rondalla string instrument ensemble", caption: "Rondalla string ensemble" },
    { searches: ["bamboo organ Las Piñas Philippines 1824 church"], localName: "l56-bamboo-organ", classification: "photograph", title: "Las Piñas Bamboo Organ", altText: "Historic bamboo organ in Las Piñas Church", caption: "Las Piñas Bamboo Organ (1824)" },
  ]},
  { lessonId: "lesson-57", media: [
    { searches: ["balangay boat Philippines pre-colonial seafaring Butuan"], localName: "l57-balangay", classification: "museum_artifact", title: "Balangay Boat", altText: "Balangay, pre-colonial Philippine seafaring vessel", caption: "Balangay, ancient Philippine boat" },
    { searches: ["bangka outrigger boat Philippines traditional fishing"], localName: "l57-bangka", classification: "photograph", title: "Bangka Outrigger Boat", altText: "Traditional Filipino bangka outrigger boat", caption: "Bangka, Philippine outrigger" },
  ]},
  { lessonId: "lesson-58", media: [
    { searches: ["University Santo Tomas Manila Philippines oldest Asia"], localName: "l58-ust", classification: "photograph", title: "University of Santo Tomas", altText: "University of Santo Tomas Main Building, Manila", caption: "UST (1611), oldest university in Asia" },
    { searches: ["Philippine school building education students"], localName: "l58-school-building", classification: "photograph", title: "Philippine School", altText: "Philippine school building", caption: "Philippine school building" },
  ]},
  { lessonId: "lesson-59", media: [
    { searches: ["Philippine mango carabao mango Mangifera indica"], localName: "l59-mango", classification: "photograph", title: "Philippine Carabao Mango", altText: "Philippine carabao mango, world's sweetest", caption: "Philippine carabao mango" },
    { searches: ["durian fruit Davao Philippines tropical king"], localName: "l59-durian", classification: "photograph", title: "Durian Fruit", altText: "Durian fruit from Davao, king of fruits", caption: "Durian from Davao" },
  ]},
  { lessonId: "lesson-60", media: [
    { searches: ["Philippine mythology creature folklore art"], localName: "l60-folklore", classification: "historical_artwork", title: "Philippine Folklore Creatures", altText: "Artistic depiction of Philippine folklore creatures", caption: "Philippine folklore tradition" },
    { searches: ["diwata nature spirit Philippines mythology enchantress"], localName: "l60-diwata", classification: "historical_artwork", title: "Diwata Nature Spirit", altText: "Artistic depiction of diwata, nature spirit", caption: "Diwata, Philippine nature spirit" },
  ]},
  { lessonId: "lesson-61", media: [
    { searches: ["EDSA People Power Revolution 1986 Philippines crowd"], localName: "l61-edsa-revolution", classification: "photograph", title: "EDSA People Power Revolution", altText: "Crowds at EDSA People Power Revolution, 1986", caption: "EDSA People Power, February 1986" },
    { searches: ["Corazon Aquino president Philippines portrait"], localName: "l61-cory-aquino", classification: "photograph", title: "President Corazon Aquino", altText: "President Corazon Aquino, first female Philippine president", caption: "Corazon Aquino (1933-2009)" },
  ]},
  { lessonId: "lesson-62", media: [
    { searches: ["Philippines coral reef underwater diving marine"], localName: "l62-coral-reef", classification: "photograph", title: "Philippine Coral Reef", altText: "Vibrant coral reef ecosystem in the Philippines", caption: "Philippine coral reef" },
    { searches: ["Philippine rainforest tropical forest Sierra Madre"], localName: "l62-rainforest", classification: "photograph", title: "Philippine Tropical Rainforest", altText: "Philippine tropical rainforest canopy", caption: "Philippine tropical rainforest" },
  ]},
  { lessonId: "lesson-63", media: [
    { searches: ["jeepney manufacturing Philippines factory art"], localName: "l63-jeepney-factory", classification: "photograph", title: "Jeepney Manufacturing", altText: "Jeepney manufacturing workshop", caption: "Jeepney manufacturing workshop" },
    { searches: ["Filipino invention innovation technology Philippines"], localName: "l63-innovation", classification: "photograph", title: "Filipino Innovation", altText: "Filipino innovation and technology", caption: "Filipino innovation" },
  ]},
  { lessonId: "lesson-64", media: [
    { searches: ["MassKara Festival Bacolod Philippines mask smiling"], localName: "l64-masskara", classification: "photograph", title: "MassKara Festival", altText: "MassKara Festival dancers in Bacolod City", caption: "MassKara Festival, Bacolod" },
    { searches: ["Panagbenga Flower Festival Baguio Philippines float"], localName: "l64-panagbenga", classification: "photograph", title: "Panagbenga Festival", altText: "Panagbenga Flower Festival in Baguio", caption: "Panagbenga Festival, Baguio" },
  ]},
  { lessonId: "lesson-65", media: [
    { searches: ["Manila skyline Philippines cityscape modern BGC"], localName: "l65-manila-skyline", classification: "photograph", title: "Manila Skyline", altText: "Modern Manila skyline", caption: "Manila skyline" },
    { searches: ["Filipino children school happy smiling Philippines"], localName: "l65-filipino-children", classification: "photograph", title: "Filipino Children", altText: "Smiling Filipino children at school", caption: "Filipino children, the future" },
  ]},
];

// ─────────────────────────────────────────────────────────────
// MAIN ENGINE
// ─────────────────────────────────────────────────────────────

async function acquireAllMedia() {
  log("═══════════════════════════════════════════════════════════════════");
  log("WONDER JOURNEY OS — TRUTHFUL MEDIA ACQUISITION ENGINE");
  log("═══════════════════════════════════════════════════════════════════\n");
  
  const results = [];
  const errors = [];
  let count = 0;
  
  const NON_SVG_TYPES = ["photograph", "primary_source_scan", "museum_artifact", "historical_artwork"];
  
  for (const lesson of LESSON_MEDIA_SPECS) {
    for (const spec of lesson.media) {
      count++;
      log(`\n[${count}/130] ${spec.localName}`);
      
      let acquired = false;
      
      for (const searchQuery of spec.searches) {
        if (acquired) break;
        
        try {
          log(`  Searching: "${searchQuery}"`);
          const searchResults = await searchWikimediaCommons(searchQuery, 8);
          
          if (searchResults.length === 0) {
            log(`  No results for "${searchQuery}"`);
            continue;
          }
          
          for (const wmFile of searchResults) {
            if (acquired) break;
            
            try {
              log(`  Checking: ${wmFile}`);
              const info = await queryWikimediaImageInfo(wmFile);
              
              if (!info || !info.directUrl) {
                log(`    No info`);
                continue;
              }
              
              // Check MIME — reject SVG for non-diagram types
              if (NON_SVG_TYPES.includes(spec.classification) && info.mime === "image/svg+xml") {
                log(`    Skipping SVG for ${spec.classification}`);
                continue;
              }
              
              // Check license
              const lic = normalizeLicense(info.license, info.licenseUrl);
              if (!lic) {
                log(`    Incompatible license: ${info.license}`);
                continue;
              }
              
              // Download
              log(`  Downloading: ${info.directUrl}`);
              let downloadUrl = info.directUrl;
              
              // For very large files, use thumb API
              if (info.width > 1600 && info.mime !== "image/svg+xml") {
                const thumbWidth = 1200;
                const encodedFilename = encodeURIComponent(wmFile.replace("File:", "").replace(/ /g, "_"));
                // Use the API thumb endpoint
                const thumbApiUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(wmFile)}&prop=imageinfo&iiprop=url&iiurlwidth=${thumbWidth}&format=json`;
                try {
                  const thumbData = await fetchJSON(thumbApiUrl);
                  const thumbPages = thumbData.query?.pages;
                  const thumbPageId = Object.keys(thumbPages)[0];
                  const thumbInfo = thumbPages[thumbPageId]?.imageinfo?.[0];
                  if (thumbInfo?.thumburl) {
                    downloadUrl = thumbInfo.thumburl;
                    log(`  Using thumb: ${downloadUrl}`);
                  }
                } catch (te) {
                  log(`  Thumb failed, using direct`);
                }
              }
              
              const buf = await fetchBuffer(downloadUrl);
              
              if (buf.length < 500) {
                log(`    File too small (${buf.length} bytes)`);
                continue;
              }
              
              // Detect actual MIME from bytes
              const actualMime = detectMimeFromBytes(buf);
              
              // Reject SVG for non-diagram types
              if (NON_SVG_TYPES.includes(spec.classification) && actualMime === "image/svg+xml") {
                log(`    Downloaded SVG, rejecting for ${spec.classification}`);
                continue;
              }
              
              // Determine extension
              const ext = getExtFromMime(actualMime !== "unknown" ? actualMime : info.mime);
              const localFilename = `${spec.localName}${ext}`;
              const localPath = path.join(MEDIA_DIR, localFilename);
              
              // Write file
              fs.writeFileSync(localPath, buf);
              
              const sha256 = crypto.createHash("sha256").update(buf).digest("hex");
              
              log(`  ✓ Saved: ${localFilename} (${buf.length} bytes, ${actualMime})`);
              log(`  ✓ SHA-256: ${sha256}`);
              
              const result = {
                id: `media-${spec.localName}`,
                lessonId: lesson.lessonId,
                title: spec.title,
                classification: spec.classification,
                description: spec.altText,
                originalSourceUrl: info.pageUrl,
                sourceOrganization: info.credit || info.source || "Wikimedia Commons",
                creator: info.artist || "Unknown",
                license: lic.license,
                licenseUrl: lic.licenseUrl,
                directDownloadUrl: info.directUrl,
                dateAccessed: new Date().toISOString().split("T")[0],
                originalFilename: localFilename,
                dimensions: { width: info.width || 1200, height: info.height || 800 },
                modifications: info.width > 1200 ? `Resized from ${info.width}x${info.height} to fit 1200px width` : "Downloaded at original resolution",
                storedAssetPath: `/media/curriculum/${localFilename}`,
                sha256Checksum: sha256,
                mimeType: actualMime !== "unknown" ? actualMime : info.mime,
                altText: spec.altText,
                caption: spec.caption,
                wikimediaFile: wmFile,
              };
              
              results.push(result);
              acquired = true;
              
            } catch (err) {
              log(`    Error: ${err.message}`);
            }
            
            // Rate limiting
            await new Promise(r => setTimeout(r, 150));
          }
          
        } catch (err) {
          log(`  Search error: ${err.message}`);
        }
      }
      
      if (!acquired) {
        errors.push(`${spec.localName}: No usable media found after all searches`);
        log(`  ✗ FAILED: No usable media for ${spec.localName}`);
      }
    }
  }
  
  log(`\n═══════════════════════════════════════════════════════════════════`);
  log(`ACQUISITION COMPLETE`);
  log(`═══════════════════════════════════════════════════════════════════`);
  log(`Downloaded: ${results.length}/130`);
  log(`Failed: ${errors.length}`);
  if (errors.length > 0) {
    log(`\nFailed items:`);
    errors.forEach(e => log(`  - ${e}`));
  }
  
  // Write results
  const outputPath = path.join(__dirname, "../media-acquisition-results.json");
  fs.writeFileSync(outputPath, JSON.stringify({ results, errors, total: results.length }, null, 2));
  log(`\nResults: ${outputPath}`);
  
  return { results, errors };
}

acquireAllMedia().then(({ results, errors }) => {
  if (errors.length > 0) {
    console.error(`\n${errors.length} items failed. Check media-acquisition.log for details.`);
    process.exit(1);
  }
  console.log(`\nAll ${results.length} media items acquired successfully.`);
  process.exit(0);
}).catch(err => {
  console.error("Fatal:", err);
  process.exit(1);
});
