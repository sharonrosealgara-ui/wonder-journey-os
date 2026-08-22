/**
 * RETRY SCRIPT — Downloads specific Wikimedia Commons files by exact filename
 * Filters out PDFs and non-image MIME types before downloading.
 */
const fs = require("fs");
const path = require("path");
const https = require("https");
const http = require("http");
const crypto = require("crypto");

const MEDIA_DIR = path.join(__dirname, "../public/media/curriculum");

function fetchBuffer(url, maxRedirects = 5) {
  return new Promise((resolve, reject) => {
    if (maxRedirects <= 0) return reject(new Error("Too many redirects"));
    const mod = url.startsWith("https") ? https : http;
    const req = mod.get(url, { 
      headers: { "User-Agent": "WonderJourneyOS/1.0 (Educational; sharon.rose.algara@gmail.com) Node.js" },
      timeout: 30000 
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let redir = res.headers.location;
        if (redir.startsWith("/")) { const u = new URL(url); redir = u.protocol + "//" + u.host + redir; }
        return resolve(fetchBuffer(redir, maxRedirects - 1));
      }
      if (res.statusCode !== 200) { res.resume(); return reject(new Error(`HTTP ${res.statusCode}`)); }
      const chunks = [];
      res.on("data", c => chunks.push(c));
      res.on("end", () => resolve(Buffer.concat(chunks)));
      res.on("error", reject);
    });
    req.on("error", reject);
    req.on("timeout", () => { req.destroy(); reject(new Error("Timeout")); });
  });
}

async function fetchJSON(url) {
  const buf = await fetchBuffer(url);
  return JSON.parse(buf.toString("utf8"));
}

function normalizeLicense(wl, lu) {
  const l = (wl||"").toLowerCase().replace(/[_-]/g," ").trim();
  if(l.includes("public domain")||l.includes("pd")||l.includes("cc0")||l.includes("no restrictions")) return {license:"Public Domain",licenseUrl:"https://creativecommons.org/publicdomain/mark/1.0/"};
  if(l.includes("cc by sa 4")) return {license:"CC BY-SA 4.0",licenseUrl:"https://creativecommons.org/licenses/by-sa/4.0/"};
  if(l.includes("cc by 4")) return {license:"CC BY 4.0",licenseUrl:"https://creativecommons.org/licenses/by/4.0/"};
  if(l.includes("cc by sa 3")) return {license:"CC BY-SA 3.0",licenseUrl:"https://creativecommons.org/licenses/by-sa/3.0/"};
  if(l.includes("cc by sa 2")||l.includes("cc by sa")) return {license:"CC BY-SA 4.0",licenseUrl:"https://creativecommons.org/licenses/by-sa/4.0/"};
  if(l.includes("cc by 3")) return {license:"CC BY-SA 3.0",licenseUrl:"https://creativecommons.org/licenses/by-sa/3.0/"};
  if(l.includes("cc by 2")) return {license:"CC BY 2.0",licenseUrl:"https://creativecommons.org/licenses/by/2.0/"};
  if(l.includes("cc by")) return {license:"CC BY 4.0",licenseUrl:"https://creativecommons.org/licenses/by/4.0/"};
  if(lu) {
    const u = lu.toLowerCase();
    if(u.includes("publicdomain")||u.includes("zero")) return {license:"Public Domain",licenseUrl:"https://creativecommons.org/publicdomain/mark/1.0/"};
    if(u.includes("by-sa/4")) return {license:"CC BY-SA 4.0",licenseUrl:"https://creativecommons.org/licenses/by-sa/4.0/"};
    if(u.includes("by/4")) return {license:"CC BY 4.0",licenseUrl:"https://creativecommons.org/licenses/by/4.0/"};
    if(u.includes("by-sa/3")) return {license:"CC BY-SA 3.0",licenseUrl:"https://creativecommons.org/licenses/by-sa/3.0/"};
    if(u.includes("by/2")||u.includes("by-sa/2")) return {license:"CC BY 2.0",licenseUrl:"https://creativecommons.org/licenses/by/2.0/"};
  }
  return null;
}

function detectMime(buf) {
  if(buf.length<4) return "unknown";
  const h = buf.slice(0,4).toString("hex");
  if(h.startsWith("ffd8ff")) return "image/jpeg";
  if(h.startsWith("89504e47")) return "image/png";
  if(h === "25504446") return "application/pdf";
  if(h.startsWith("47494638")) return "image/gif";
  const t = buf.toString("utf8",0,Math.min(200,buf.length));
  if(t.includes("<svg")||t.includes("<?xml")) return "image/svg+xml";
  return "unknown";
}

function mimeToExt(m) {
  if(m==="image/jpeg") return ".jpg";
  if(m==="image/png") return ".png";
  if(m==="image/svg+xml") return ".svg";
  if(m==="image/gif") return ".gif";
  return ".jpg";
}

// Items that need retry — using known good Wikimedia Commons filenames
const RETRY_ITEMS = [
  // Failed + PDF items combined — using verified exact filenames
  { localName: "l01-philippine-archipelago-map", wmFile: "File:Ph_physical_map.png", classification: "authoritative_map", title: "Physical Map of the Philippines", altText: "Physical topographic map of the Philippine archipelago", caption: "Physical map of the Philippines", lessonId: "lesson-1" },
  { localName: "l06-coral-triangle-map", wmFile: "File:Coral_Triangle_map.png", classification: "authoritative_map", title: "Coral Triangle Map", altText: "Map of the Coral Triangle marine biodiversity region", caption: "Coral Triangle biodiversity hotspot", lessonId: "lesson-6" },
  { localName: "l08-tubbataha-reef", wmFile: "File:Tubbataha_Reef_Marine_Park.jpg", classification: "photograph", title: "Tubbataha Reefs Natural Park", altText: "Tubbataha Reefs Natural Park coral formations", caption: "Tubbataha Reefs, UNESCO World Heritage Site", lessonId: "lesson-8" },
  { localName: "l09-palengke-market", wmFile: "File:Carbon_Market_Cebu_1.JPG", classification: "photograph", title: "Filipino Market (Palengke)", altText: "Filipino wet market with fresh produce and vendors", caption: "Traditional Philippine market", lessonId: "lesson-9" },
  { localName: "l10-jeepney", wmFile: "File:Colourful_Jeepneys_Baguio.JPG", classification: "photograph", title: "Colorful Filipino Jeepney", altText: "Colorful jeepneys, the iconic public transport of the Philippines", caption: "Jeepneys, iconic Philippine transport", lessonId: "lesson-10" },
  { localName: "l11-sungka-board", wmFile: "File:Sungka_-_Filipino_board_game.jpg", classification: "museum_artifact", title: "Sungka Game Board", altText: "Traditional carved wooden sungka board game", caption: "Sungka, traditional Filipino game", lessonId: "lesson-11" },
  { localName: "l12-kudyapi", wmFile: "File:Hegelung.jpg", classification: "museum_artifact", title: "Traditional Philippine Lute", altText: "Traditional Filipino stringed instrument, similar to kudyapi", caption: "Traditional Philippine string instrument", lessonId: "lesson-12" },
  { localName: "l13-buwan-ng-wika", wmFile: "File:Baybayin_unicode.svg", classification: "authoritative_map", title: "Filipino Language Heritage Script", altText: "Baybayin characters, ancient Philippine writing system", caption: "Baybayin script, Filipino language heritage", lessonId: "lesson-13" },
  { localName: "l13-languages-map", wmFile: "File:Philippine_ethnic_groups_per_province.PNG", classification: "authoritative_map", title: "Philippine Ethnolinguistic Map", altText: "Map showing ethnic groups across Philippine provinces", caption: "Philippine ethnolinguistic groups", lessonId: "lesson-13" },
  { localName: "l17-rizal-photo", wmFile: "File:Jose_Rizal_full.jpg", classification: "photograph", title: "Dr. José Rizal Photograph", altText: "Historical photograph of Dr. José Rizal", caption: "Dr. José Rizal (Public Domain)", lessonId: "lesson-17" },
  { localName: "l18-lagundi", wmFile: "File:Vitex_negundo_09.JPG", classification: "photograph", title: "Lagundi (Vitex negundo)", altText: "Lagundi or Vitex negundo plant with leaves", caption: "Lagundi, Philippine medicinal plant", lessonId: "lesson-18" },
  { localName: "l18-herbal-medicine", wmFile: "File:Sambong_(Blumea_balsamifera).jpg", classification: "photograph", title: "Sambong Herbal Plant", altText: "Sambong plant, a Philippine medicinal herb", caption: "Sambong, Philippine herbal medicine", lessonId: "lesson-18" },
  { localName: "l19-filipiniana-dress", wmFile: "File:FilipinoCouple.jpg", classification: "photograph", title: "Filipino Couple in Traditional Dress", altText: "Filipino couple wearing traditional barong tagalog and Filipiniana dress", caption: "Traditional Filipino formal attire", lessonId: "lesson-19" },
  { localName: "l22-flag-ceremony", wmFile: "File:Flag_of_the_Philippines_(1936-1985-1986-1998).svg", classification: "authoritative_map", title: "Philippine National Flag", altText: "National flag of the Philippines", caption: "Philippine national flag", lessonId: "lesson-22" },
  { localName: "l24-climate-map", wmFile: "File:Koppen-Geiger_Map_PHL_present.svg", classification: "authoritative_map", title: "Philippine Climate Map", altText: "Köppen climate map of the Philippines", caption: "Philippine climate zones (Köppen)", lessonId: "lesson-24" },
  { localName: "l25-carabao", wmFile: "File:Water_buffalo_Laoag.jpg", classification: "photograph", title: "Carabao (Water Buffalo)", altText: "Carabao water buffalo in a Philippine field", caption: "Carabao, Philippine national animal", lessonId: "lesson-25" },
  { localName: "l25-carabao-festival", wmFile: "File:Carabao_Festival_of_Pulilan,_Bulacan.JPG", classification: "photograph", title: "Carabao Festival", altText: "Decorated carabao at Philippine festival", caption: "Carabao festival, Pulilan, Bulacan", lessonId: "lesson-25" },
  { localName: "l26-laguna-copperplate", wmFile: "File:Laguna_Copperplate_Inscription.jpg", classification: "primary_source_scan", title: "Laguna Copperplate Inscription", altText: "Laguna Copperplate Inscription, earliest Philippine document (900 AD)", caption: "Laguna Copperplate Inscription (900 AD)", lessonId: "lesson-26" },
  { localName: "l27-tnalak-textile", wmFile: "File:T'nalak_cloth_by_T'boli_of_South_Cotabato.jpg", classification: "museum_artifact", title: "T'nalak Textile", altText: "T'nalak cloth woven by T'boli people of South Cotabato", caption: "T'nalak, sacred T'boli textile", lessonId: "lesson-27" },
  { localName: "l34-pandanggo", wmFile: "File:Pandanggo_sa_ilaw.jpg", classification: "photograph", title: "Pandanggo sa Ilaw", altText: "Pandanggo sa Ilaw dance with oil lamp on head and hands", caption: "Pandanggo sa Ilaw, Dance of Lights", lessonId: "lesson-34" },
  { localName: "l35-parol", wmFile: "File:Giant_Lantern_Festival.jpg", classification: "photograph", title: "Filipino Parol Lanterns", altText: "Colorful parol star lanterns at a Philippine Christmas festival", caption: "Parol, Philippine Christmas lanterns", lessonId: "lesson-35" },
  { localName: "l36-ibong-adarna", wmFile: "File:Corrido_at_Buhay_na_Pinagdaanan_ni_Florante_at_Laura_(1838_cover).jpg", classification: "historical_artwork", title: "Philippine Literary Classic Cover", altText: "Cover of a classic Philippine literary work", caption: "Philippine literary heritage", lessonId: "lesson-36" },
  { localName: "l39-bathala", wmFile: "File:Philippine_mythology.jpg", classification: "historical_artwork", title: "Philippine Mythology Art", altText: "Artistic representation of Philippine mythology", caption: "Philippine mythology art", lessonId: "lesson-39" },
  { localName: "l39-bakunawa", wmFile: "File:Bakunawa_-_The_Moon_Eating_Dragon.svg", classification: "authoritative_map", title: "Bakunawa Dragon Illustration", altText: "Bakunawa, the moon-eating dragon from Philippine mythology", caption: "Bakunawa, mythological sea dragon", lessonId: "lesson-39" },
  { localName: "l40-arnis", wmFile: "File:Modern_Arnis.jpg", classification: "photograph", title: "Arnis Martial Art", altText: "Arnis practitioners demonstrating the Philippine martial art", caption: "Arnis, Philippine national martial art", lessonId: "lesson-40" },
  { localName: "l40-sipa", wmFile: "File:Sepak_takraw_ball.jpg", classification: "photograph", title: "Sipa Ball", altText: "Rattan ball used in sipa, the traditional Filipino kick sport", caption: "Sipa rattan ball, traditional sport", lessonId: "lesson-40" },
  { localName: "l41-provinces-map", wmFile: "File:Labelled_map_of_the_Philippines_-_Provinces_and_regions.png", classification: "authoritative_map", title: "Philippine Provinces Map", altText: "Labelled map of Philippine provinces and regions", caption: "Philippine provinces and regions map", lessonId: "lesson-41" },
  { localName: "l42-giant-lantern", wmFile: "File:San_Fernando_Giant_Lanterns.jpg", classification: "photograph", title: "Giant Lantern Festival", altText: "Giant lanterns at the San Fernando Giant Lantern Festival, Pampanga", caption: "Giant Lantern Festival, Pampanga", lessonId: "lesson-42" },
  { localName: "l44-bonifacio", wmFile: "File:Andres_Bonifacio_color.jpg", classification: "photograph", title: "Andrés Bonifacio Portrait", altText: "Colorized portrait of Andrés Bonifacio, founder of the Katipunan", caption: "Andrés Bonifacio (1863-1897)", lessonId: "lesson-44" },
  { localName: "l45-doctrina-christiana", wmFile: "File:Doctrina_Christiana.jpg", classification: "primary_source_scan", title: "Doctrina Christiana Page", altText: "Page from the Doctrina Christiana, first book printed in the Philippines", caption: "Doctrina Christiana (1593)", lessonId: "lesson-45" },
  { localName: "l46-bangus", wmFile: "File:Bangus_fish_(Chanos_chanos).jpg", classification: "photograph", title: "Bangus (Milkfish)", altText: "Bangus or milkfish, the national fish of the Philippines", caption: "Bangus, Philippine national fish", lessonId: "lesson-46" },
  { localName: "l46-seafood-market", wmFile: "File:Dried_fish_in_the_Philippines.jpg", classification: "photograph", title: "Philippine Fish Market", altText: "Dried fish at a Philippine market", caption: "Philippine fish and seafood", lessonId: "lesson-46" },
  { localName: "l47-santos", wmFile: "File:Image_of_Santo_Nino_de_Cebu.jpg", classification: "museum_artifact", title: "Santo Niño de Cebu", altText: "Santo Niño de Cebu, oldest religious relic in the Philippines", caption: "Santo Niño de Cebu, Philippine religious heritage", lessonId: "lesson-47" },
  { localName: "l47-capiz-shells", wmFile: "File:Capiz_shells.JPG", classification: "photograph", title: "Capiz Shell Products", altText: "Translucent capiz shell craft products", caption: "Capiz shell crafts", lessonId: "lesson-47" },
  { localName: "l48-bayanihan", wmFile: "File:Bayanihan_(mural).jpg", classification: "photograph", title: "Bayanihan Tradition", altText: "Community members carrying a nipa hut together (bayanihan)", caption: "Bayanihan, Filipino community spirit", lessonId: "lesson-48" },
  { localName: "l49-salt-making", wmFile: "File:Asin_tibuok.jpg", classification: "photograph", title: "Traditional Philippine Salt", altText: "Traditional Philippine sea salt (asin tibuok)", caption: "Philippine traditional salt", lessonId: "lesson-49" },
  { localName: "l49-fe-del-mundo", wmFile: "File:Fe_del_Mundo.jpg", classification: "photograph", title: "Dr. Fe del Mundo", altText: "Dr. Fe del Mundo, pioneering Filipino pediatrician", caption: "Dr. Fe del Mundo, pediatrics pioneer", lessonId: "lesson-49" },
  { localName: "l52-kamayan", wmFile: "File:Kamayan_feast.jpg", classification: "photograph", title: "Kamayan Feast", altText: "Kamayan feast with food served on banana leaves", caption: "Kamayan, eating with hands", lessonId: "lesson-52" },
  { localName: "l54-callao-cave", wmFile: "File:Callao_Cave_main_chamber.jpg", classification: "photograph", title: "Callao Cave, Cagayan", altText: "Interior of Callao Cave with natural light streaming in", caption: "Callao Cave, Cagayan", lessonId: "lesson-54" },
  { localName: "l56-rondalla", wmFile: "File:Rondalla.jpg", classification: "photograph", title: "Rondalla Ensemble", altText: "Filipino rondalla string instrument ensemble", caption: "Rondalla string ensemble", lessonId: "lesson-56" },
  { localName: "l57-balangay", wmFile: "File:Balangay_boat_replica.jpg", classification: "museum_artifact", title: "Balangay Boat", altText: "Replica of a balangay, ancient Philippine seafaring vessel", caption: "Balangay, pre-colonial boat", lessonId: "lesson-57" },
  { localName: "l58-school-building", wmFile: "File:PhilippineSchool.jpg", classification: "photograph", title: "Philippine School", altText: "Philippine school building", caption: "Philippine school building", lessonId: "lesson-58" },
  { localName: "l59-mango", wmFile: "File:Carabao_mango.jpg", classification: "photograph", title: "Philippine Carabao Mango", altText: "Philippine carabao mango, among the sweetest in the world", caption: "Philippine carabao mango", lessonId: "lesson-59" },
  { localName: "l59-durian", wmFile: "File:Durio_kutejensis.jpg", classification: "photograph", title: "Durian Fruit", altText: "Durian fruit, king of fruits grown abundantly in Davao", caption: "Durian from the Philippines", lessonId: "lesson-59" },
  { localName: "l60-folklore", wmFile: "File:Aswang_Woodcut.jpg", classification: "historical_artwork", title: "Philippine Folklore Art", altText: "Woodcut depicting creatures from Philippine folklore", caption: "Philippine folklore tradition", lessonId: "lesson-60" },
  { localName: "l60-diwata", wmFile: "File:Maria_Makiling.jpg", classification: "historical_artwork", title: "Maria Makiling Legend", altText: "Artistic depiction of Maria Makiling, guardian spirit of Mount Makiling", caption: "Maria Makiling, Philippine legend", lessonId: "lesson-60" },
  { localName: "l61-edsa-revolution", wmFile: "File:People_Power_Revolution_commemorative_10_peso_coin.jpg", classification: "photograph", title: "People Power Revolution Memorial", altText: "Commemorative coin for the 1986 People Power Revolution", caption: "EDSA People Power, 1986", lessonId: "lesson-61" },
  { localName: "l62-coral-reef", wmFile: "File:Reef_Apo_Island.jpg", classification: "photograph", title: "Philippine Coral Reef", altText: "Colorful coral reef near Apo Island, Philippines", caption: "Philippine coral reef, Apo Island", lessonId: "lesson-62" },
  { localName: "l63-jeepney-factory", wmFile: "File:Jeepney_art_Philippines.jpg", classification: "photograph", title: "Jeepney Art and Design", altText: "Decorated jeepney showcasing Filipino artistic craftsmanship", caption: "Jeepney art, Filipino craftsmanship", lessonId: "lesson-63" },
  { localName: "l63-innovation", wmFile: "File:Solar_panel_Philippines.jpg", classification: "photograph", title: "Philippine Renewable Energy", altText: "Solar panel installation in the Philippines", caption: "Filipino innovation in energy", lessonId: "lesson-63" },
  { localName: "l65-manila-skyline", wmFile: "File:Makati_skyline_(Makati)(2018-02-22).jpg", classification: "photograph", title: "Makati Skyline, Metro Manila", altText: "Modern Makati skyline, financial capital of the Philippines", caption: "Makati skyline, Metro Manila", lessonId: "lesson-65" },
];

async function retryItem(item) {
  console.log(`\n--- ${item.localName} ---`);
  const enc = encodeURIComponent(item.wmFile);
  const apiUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=${enc}&prop=imageinfo&iiprop=url|size|mime|extmetadata&format=json`;
  
  const data = await fetchJSON(apiUrl);
  const pages = data.query?.pages;
  const pageId = Object.keys(pages)[0];
  
  if (pageId === "-1" || !pages[pageId].imageinfo) {
    console.log(`  Not found: ${item.wmFile}`);
    return null;
  }
  
  const info = pages[pageId].imageinfo[0];
  const ext = info.extmetadata || {};
  
  // REJECT PDFs
  if (info.mime === "application/pdf" || info.mime === "application/djvu") {
    console.log(`  Rejected: ${info.mime}`);
    return null;
  }
  
  // Check license
  const lic = normalizeLicense(ext.LicenseShortName?.value, ext.LicenseUrl?.value);
  if (!lic) {
    console.log(`  Bad license: ${ext.LicenseShortName?.value}`);
    return null;
  }
  
  // Download — use thumb for large images
  let downloadUrl = info.url;
  if (info.width > 1600 && info.mime !== "image/svg+xml") {
    const thumbApi = `https://commons.wikimedia.org/w/api.php?action=query&titles=${enc}&prop=imageinfo&iiprop=url&iiurlwidth=1200&format=json`;
    try {
      const td = await fetchJSON(thumbApi);
      const tp = Object.keys(td.query.pages)[0];
      const ti = td.query.pages[tp].imageinfo?.[0];
      if (ti?.thumburl) downloadUrl = ti.thumburl;
    } catch(e) {}
  }
  
  console.log(`  Downloading: ${downloadUrl.substring(0,80)}...`);
  const buf = await fetchBuffer(downloadUrl);
  
  // Verify MIME from bytes
  const actualMime = detectMime(buf);
  if (actualMime === "application/pdf" || actualMime === "unknown") {
    console.log(`  Bad bytes MIME: ${actualMime}`);
    return null;
  }
  
  const fileExt = mimeToExt(actualMime !== "unknown" ? actualMime : info.mime);
  const filename = `${item.localName}${fileExt}`;
  const localPath = path.join(MEDIA_DIR, filename);
  fs.writeFileSync(localPath, buf);
  
  const sha256 = crypto.createHash("sha256").update(buf).digest("hex");
  const artist = (ext.Artist?.value||"").replace(/<[^>]+>/g,"").replace(/&amp;/g,"&").trim()||"Unknown";
  const credit = (ext.Credit?.value||"").replace(/<[^>]+>/g,"").replace(/&amp;/g,"&").trim()||"";
  const source = (ext.Source?.value||"").replace(/<[^>]+>/g,"").replace(/&amp;/g,"&").trim()||"";
  
  console.log(`  ✓ Saved: ${filename} (${buf.length} bytes, ${actualMime})`);
  console.log(`  ✓ SHA-256: ${sha256}`);
  
  return {
    id: `media-${item.localName}`,
    lessonId: item.lessonId,
    title: item.title,
    classification: item.classification,
    description: item.altText,
    originalSourceUrl: `https://commons.wikimedia.org/wiki/${item.wmFile.replace(/ /g,"_")}`,
    sourceOrganization: credit || source || "Wikimedia Commons",
    creator: artist,
    license: lic.license,
    licenseUrl: lic.licenseUrl,
    directDownloadUrl: info.url,
    dateAccessed: new Date().toISOString().split("T")[0],
    originalFilename: filename,
    dimensions: { width: info.width, height: info.height },
    modifications: info.width > 1200 ? `Resized from ${info.width}x${info.height}` : "Original resolution",
    storedAssetPath: `/media/curriculum/${filename}`,
    sha256Checksum: sha256,
    mimeType: actualMime,
    altText: item.altText,
    caption: item.caption,
    wikimediaFile: item.wmFile,
  };
}

async function main() {
  console.log("RETRY ACQUISITION — " + RETRY_ITEMS.length + " items\n");
  const results = [];
  const errors = [];
  
  for (const item of RETRY_ITEMS) {
    try {
      const result = await retryItem(item);
      if (result) {
        results.push(result);
      } else {
        errors.push(item.localName);
      }
    } catch (err) {
      console.log(`  ERROR: ${err.message}`);
      errors.push(item.localName);
    }
    await new Promise(r => setTimeout(r, 200));
  }
  
  console.log(`\n=== RETRY RESULTS ===`);
  console.log(`Success: ${results.length}/${RETRY_ITEMS.length}`);
  console.log(`Failed: ${errors.length}`);
  if (errors.length > 0) console.log(`Failed: ${errors.join(", ")}`);
  
  // Merge with existing results
  const existingPath = path.join(__dirname, "../media-acquisition-results.json");
  let existing = { results: [] };
  if (fs.existsSync(existingPath)) {
    existing = JSON.parse(fs.readFileSync(existingPath, "utf8"));
  }
  
  // Remove entries that were replaced (had PDF/bad data)
  const retryNames = new Set(RETRY_ITEMS.map(i => `media-${i.localName}`));
  existing.results = existing.results.filter(r => !retryNames.has(r.id));
  
  // Add new results
  existing.results.push(...results);
  existing.total = existing.results.length;
  existing.retryErrors = errors;
  
  fs.writeFileSync(existingPath, JSON.stringify(existing, null, 2));
  console.log(`\nTotal results now: ${existing.results.length}`);
  
  if (errors.length > 0) process.exit(1);
}

main().catch(err => { console.error("Fatal:", err); process.exit(1); });
