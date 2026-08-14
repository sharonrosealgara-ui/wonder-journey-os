
const fs = require("fs");
let file = fs.readFileSync("src/config/lessons-stage2.ts", "utf-8");

const exactLinks = {
  "lesson-1-world-map": [
    { title: "PAGASA Climate of the Philippines", url: "https://www.pagasa.dost.gov.ph/information/climate-philippines" },
    { title: "NAMRIA Philippine Map", url: "https://www.namria.gov.ph/jDownloads/CitizensCharter/BRP_CITIZENS_CHARTER.pdf" }
  ],
  "lesson-2-archipelago": [
    { title: "DENR: State of the Coasts", url: "https://r5.denr.gov.ph/index.php/about-us/regional-profile" },
    { title: "Philippine Islands Count - NAMRIA", url: "https://www.namria.gov.ph/transparency.php" }
  ],
  "lesson-3-luzon-visayas-mindanao": [
    { title: "PSA Geographic Classification", url: "https://psa.gov.ph/classification/psgc/" },
    { title: "NEDA: Philippine Regions", url: "https://neda.gov.ph/regional-development/" }
  ],
  "lesson-4-region": [
    { title: "DILG: Regional Offices", url: "https://www.dilg.gov.ph/regional-offices/" },
    { title: "PSA Standard Geographic Code", url: "https://psa.gov.ph/classification/psgc/downloads" }
  ],
  "lesson-5-province": [
    { title: "League of Provinces of the Philippines", url: "https://lpp.gov.ph/" },
    { title: "Official Gazette: Local Government", url: "https://www.officialgazette.gov.ph/about/gov/local/" }
  ],
  "lesson-6-city": [
    { title: "DILG: Barangay Officials Guide", url: "https://dilg.gov.ph/PDF_File/reports_resources/dilg-reports-resources-20161208_510a74ba1e.pdf" },
    { title: "League of Cities of the Philippines", url: "https://lcp.org.ph/" }
  ],
  "lesson-7-national-symbols": [
    { title: "NCCA: Official National Symbols", url: "https://ncca.gov.ph/about-culture-and-arts/culture-profile/official-national-symbols-of-the-philippines/" },
    { title: "Official Gazette: The National Flag", url: "https://www.officialgazette.gov.ph/about/gov/the-national-flag/" }
  ],
  "lesson-8-mountains": [
    { title: "PHIVOLCS: Volcanoes of the Philippines", url: "https://www.phivolcs.dost.gov.ph/index.php/volcano-hazard/volcanoes-of-the-philippines" },
    { title: "DENR: Mount Apo Natural Park", url: "https://r11.denr.gov.ph/index.php/about-us/regional-profile/108-mt-apo-natural-park" }
  ],
  "lesson-9-rivers-beaches": [
    { title: "DENR: Water Resources Management", url: "https://water.denr.gov.ph/" },
    { title: "DOT: Beaches of Palawan", url: "https://philippines.travel/destinations/palawan" }
  ],
  "lesson-10-animals": [
    { title: "Philippine Eagle Foundation: About the Eagle", url: "https://www.philippineeaglefoundation.org/philippine-eagle" },
    { title: "DENR: Protected Areas and Wildlife", url: "https://bmb.gov.ph/" }
  ],
  "lesson-11-plants": [
    { title: "DA: High Value Crops Program", url: "https://www.da.gov.ph/programs/high-value-crops-development-program/" },
    { title: "PCA: Philippine Coconut Authority", url: "https://pca.gov.ph/" }
  ],
  "lesson-12-language": [
    { title: "KWF: Komisyon sa Wikang Filipino", url: "https://kwf.gov.ph/" },
    { title: "NCCA: Languages of the Philippines", url: "https://ncca.gov.ph/about-culture-and-arts/culture-profile/" }
  ],
  "lesson-13-august-review": [
    { title: "National Museum: Geographic and Natural History", url: "https://www.nationalmuseum.gov.ph/" },
    { title: "NHCP: Philippine History Overview", url: "https://nhcp.gov.ph/history-of-the-philippines/" }
  ]
};

Object.keys(exactLinks).forEach(id => {
  const links = exactLinks[id];
  const searchRegex = new RegExp(`curatedResources: \\[[\\s\\S]*?\\],\\s*privacyClassification: "family-safe"`);
  
  const replacement = `curatedResources: [
      { id: "r1_${id}", title: "${links[0].title}", url: "${links[0].url}", type: "Website" },
      { id: "r2_${id}", title: "${links[1].title}", url: "${links[1].url}", type: "Website" }
    ],
    privacyClassification: "family-safe"`;
    
  // Since my gen script might have slightly different spacing, let us just replace the whole curatedResources for each lesson.
  // Actually, I can just replace by matching the lesson ID.
  let lessonBlockRegex = new RegExp(`(id: "${id}"[\\s\\S]*?curatedResources: \\[[\\s\\S]*?\\])(,\\s*privacyClassification)`, "m");
  
  let match = file.match(lessonBlockRegex);
  if(match) {
    let newBlock = match[0].replace(/curatedResources: \[[^\]]*\]/, `curatedResources: [
      { id: "r1_${id}", title: "${links[0].title}", url: "${links[0].url}", type: "Website" },
      { id: "r2_${id}", title: "${links[1].title}", url: "${links[1].url}", type: "Website" }
    ]`);
    file = file.replace(match[0], newBlock);
  }
});

fs.writeFileSync("src/config/lessons-stage2.ts", file);
console.log("Fixed resources in lessons-stage2.ts");

