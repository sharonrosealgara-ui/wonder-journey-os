
const fs = require("fs");
let code = fs.readFileSync("src/config/lessons-stage2.ts", "utf8");

const newResourcesStr = `"curatedResources": [
      {
        "id": "res-1",
        "title": "Google Earth: The Philippines",
        "url": "https://earth.google.com",
        "type": "Interactive Map",
        "provider": "Google",
        "visibility": "both",
        "whyUseful": "Explore the Philippines from a satellite view.",
        "verificationStatus": "verified",
        "verifiedDate": "2026-08-01"
      },
      {
        "id": "res-2",
        "title": "National Geographic Kids: Asia",
        "url": "https://kids.nationalgeographic.com/geography/countries/article/asia",
        "type": "Article",
        "provider": "National Geographic",
        "visibility": "both",
        "whyUseful": "Learn more about the vast continent of Asia.",
        "verificationStatus": "verified",
        "verifiedDate": "2026-08-01"
      }
    ],`;

const newSourcesStr = `"authoritativeSources": [
      {
        "source": "NAMRIA Official Map",
        "url": "https://www.namria.gov.ph",
        "note": "Used to verify the count of about 7,641 islands.",
        "publisher": "National Mapping and Resource Information Authority",
        "verificationStatus": "verified",
        "verifiedDate": "2026-08-01",
        "context": "Used to verify the count of about 7,641 islands."
      },
      {
        "source": "PHIVOLCS Tectonic Map",
        "url": "https://www.phivolcs.dost.gov.ph",
        "note": "Used to describe the tectonic location of the Philippines.",
        "publisher": "PHIVOLCS",
        "verificationStatus": "verified",
        "verifiedDate": "2026-08-01",
        "context": "Used to describe the tectonic location of the Philippines."
      }
    ],`;

code = code.replace(/"curatedResources": \[[\s\S]*?\],\s*"premiumAssessment"/, newResourcesStr + "\n    \"premiumAssessment\"");
code = code.replace(/"authoritativeSources": \[[\s\S]*?\],\s*"curatedResources"/, newSourcesStr + "\n    \"curatedResources\"");

fs.writeFileSync("src/config/lessons-stage2.ts", code, "utf8");

