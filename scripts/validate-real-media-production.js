const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

console.log("================================================================================");
console.log("WONDER JOURNEY OS — REAL MEDIA & FACTUAL ASSET PRODUCTION VALIDATOR (HARDENED)");
console.log("================================================================================\n");

const registryPath = path.join(__dirname, "../src/config/media-registry.ts");
const registryCode = fs.readFileSync(registryPath, "utf8");

// Parse mediaRegistry from TS file directly or require compiled
let mediaRegistry = [];
try {
  const jsonMatch = registryCode.match(/export const mediaRegistry:\s*FactualMedia\[\]\s*=\s*(\[[\s\S]*?\]);\s*export function/);
  if (jsonMatch) {
    mediaRegistry = JSON.parse(jsonMatch[1]);
  } else {
    throw new Error("Could not parse mediaRegistry JSON");
  }
} catch (err) {
  console.error("Failed to parse media registry:", err.message);
  process.exit(1);
}

const errors = [];
const warnings = [];
const uniqueSha256 = new Set();
const uniqueLocalPaths = new Set();
const lessonMediaMap = new Map();

// License to URL mappings
const VALID_LICENSES = {
  "CC BY-SA 4.0": "https://creativecommons.org/licenses/by-sa/4.0/",
  "CC BY 4.0": "https://creativecommons.org/licenses/by/4.0/",
  "CC BY-SA 3.0": "https://creativecommons.org/licenses/by-sa/3.0/",
  "CC BY 2.0": "https://creativecommons.org/licenses/by/2.0/",
  "Public Domain": "https://creativecommons.org/publicdomain/mark/1.0/",
};

const FORBIDDEN_HOSTS = ["wonderjourney.app", "localhost", "127.0.0.1", "pinterest.com", "example.com"];

const VALID_CLASSIFICATIONS = [
  "photograph",
  "historical_artwork",
  "primary_source_scan",
  "authoritative_map",
  "museum_artifact",
  "original_diagram",
];

const AUTHENTIC_TYPES = [
  "photograph",
  "historical_artwork",
  "primary_source_scan",
  "authoritative_map",
  "museum_artifact",
];

console.log(`Auditing ${mediaRegistry.length} registry records against strict provenance rules...\n`);

if (mediaRegistry.length < 130) {
  errors.push(`Expected at least 130 distinct media records, found ${mediaRegistry.length}`);
}

mediaRegistry.forEach((media, idx) => {
  const id = media.id || `record-${idx}`;

  // 1. Check ID & basic strings
  if (!media.id) errors.push(`[${id}] Missing id`);
  if (!media.title || media.title.length < 5) errors.push(`[${id}] Title too short or missing`);
  if (!media.lessonId) errors.push(`[${id}] Missing lessonId`);

  // 2. Classification
  if (!VALID_CLASSIFICATIONS.includes(media.classification)) {
    errors.push(`[${id}] Invalid classification: "${media.classification}"`);
  }

  // 3. License and License URL match
  if (!VALID_LICENSES[media.license]) {
    errors.push(`[${id}] Invalid license: "${media.license}"`);
  } else {
    const expectedUrl = VALID_LICENSES[media.license];
    if (media.licenseUrl !== expectedUrl) {
      errors.push(`[${id}] License URL mismatch. Expected "${expectedUrl}", found "${media.licenseUrl}"`);
    }
  }

  // 4. Source URL verification
  if (!media.originalSourceUrl || !media.originalSourceUrl.startsWith("http")) {
    errors.push(`[${id}] Invalid originalSourceUrl: "${media.originalSourceUrl}"`);
  } else {
    for (const host of FORBIDDEN_HOSTS) {
      if (media.originalSourceUrl.toLowerCase().includes(host)) {
        errors.push(`[${id}] Forbidden host in originalSourceUrl: "${media.originalSourceUrl}"`);
      }
    }
  }

  // 5. Creator & Organization
  if (!media.sourceOrganization || media.sourceOrganization.length < 3) {
    errors.push(`[${id}] Missing or invalid sourceOrganization`);
  }
  if (!media.creator || media.creator.length < 3) {
    errors.push(`[${id}] Missing or invalid creator`);
  }

  // 6. Dimensions
  if (!media.dimensions || media.dimensions.width !== 1200 || media.dimensions.height !== 800) {
    errors.push(`[${id}] Dimensions must be exactly 1200x800, found ${JSON.stringify(media.dimensions)}`);
  }

  // 7. Alt text and caption
  if (!media.altText || media.altText.length < 15) {
    errors.push(`[${id}] Inadequate altText: "${media.altText}"`);
  }
  if (!media.caption || media.caption.length < 10) {
    errors.push(`[${id}] Inadequate caption: "${media.caption}"`);
  }

  // 8. Disk file existence and SHA-256 verification
  if (!media.storedAssetPath || !media.storedAssetPath.startsWith("/media/curriculum/")) {
    errors.push(`[${id}] Invalid storedAssetPath: "${media.storedAssetPath}"`);
  } else {
    const localDiskPath = path.join(__dirname, "../public", media.storedAssetPath.replace(/^\//, ""));
    if (!fs.existsSync(localDiskPath)) {
      errors.push(`[${id}] Local asset file not found on disk: ${localDiskPath}`);
    } else {
      uniqueLocalPaths.add(localDiskPath);
      const fileBytes = fs.readFileSync(localDiskPath);
      if (fileBytes.length < 100) {
        errors.push(`[${id}] File size too small (${fileBytes.length} bytes): ${localDiskPath}`);
      }

      // Check SHA-256 hash match
      const actualHash = crypto.createHash("sha256").update(fileBytes).digest("hex");
      if (media.sha256Checksum !== actualHash) {
        errors.push(`[${id}] Checksum mismatch! Registry: ${media.sha256Checksum}, Actual: ${actualHash}`);
      }

      // Check for duplicate SHA-256
      if (uniqueSha256.has(actualHash)) {
        errors.push(`[${id}] Duplicate SHA-256 hash detected! File shares byte-identical content with another asset.`);
      } else {
        uniqueSha256.add(actualHash);
      }

      // Check SVG structure / dimensions if SVG
      if (localDiskPath.endsWith(".svg")) {
        const svgContent = fileBytes.toString("utf8");
        if (!svgContent.includes('viewBox="0 0 1200 800"') && !svgContent.includes('width="1200"')) {
          errors.push(`[${id}] SVG missing expected 1200x800 viewBox or width attribute`);
        }
      }
    }
  }

  // Group by lesson
  const lId = media.lessonId;
  if (!lessonMediaMap.has(lId)) {
    lessonMediaMap.set(lId, []);
  }
  lessonMediaMap.get(lId).push(media);
});

// Check lesson coverage across 65 lessons
for (let l = 1; l <= 65; l++) {
  const lessonKey = `lesson-${l}`;
  const items = lessonMediaMap.get(lessonKey) || [];

  if (items.length < 2) {
    errors.push(`Lesson #${l} (${lessonKey}) has ${items.length} media assets (minimum 2 required).`);
  } else {
    // Check that at least one asset is authentic photograph/map/artifact/artwork/scan
    const hasAuthentic = items.some((item) => AUTHENTIC_TYPES.includes(item.classification));
    if (!hasAuthentic) {
      errors.push(`Lesson #${l} (${lessonKey}) missing authentic primary source (photo, map, artifact, artwork, or scan).`);
    }

    // Check that assets in the same lesson are distinct
    if (items[0].sha256Checksum === items[1].sha256Checksum) {
      errors.push(`Lesson #${l} (${lessonKey}) uses identical assets for both slots.`);
    }
  }
}

// Compute statistics
const classCounts = {};
mediaRegistry.forEach((m) => {
  classCounts[m.classification] = (classCounts[m.classification] || 0) + 1;
});

const licenseCounts = {};
mediaRegistry.forEach((m) => {
  licenseCounts[m.license] = (licenseCounts[m.license] || 0) + 1;
});

console.log("--------------------------------------------------------------------------------");
console.log("HARDENED MEDIA AUDIT SUMMARY");
console.log("--------------------------------------------------------------------------------");
console.log(`Total Media Records:            ${mediaRegistry.length} / 130 required`);
console.log(`Unique Local Files on Disk:     ${uniqueLocalPaths.size} / 130 required`);
console.log(`Unique SHA-256 Checksums:       ${uniqueSha256.size} / 130 required`);
console.log(`Distinct Lessons Covered:       ${lessonMediaMap.size} / 65 required`);
console.log(`Validation Errors Found:        ${errors.length}`);
console.log("--------------------------------------------------------------------------------");
console.log("CLASSIFICATION BREAKDOWN:");
Object.entries(classCounts).forEach(([cls, count]) => {
  console.log(`  - ${cls.padEnd(22)}: ${count} (${((count / mediaRegistry.length) * 100).toFixed(1)}%)`);
});
console.log("--------------------------------------------------------------------------------");
console.log("LICENSE BREAKDOWN:");
Object.entries(licenseCounts).forEach(([lic, count]) => {
  console.log(`  - ${lic.padEnd(22)}: ${count} (${((count / mediaRegistry.length) * 100).toFixed(1)}%)`);
});
console.log("--------------------------------------------------------------------------------\n");

if (errors.length > 0) {
  console.error("FAIL: Hardened Real Media Validator failed with errors:\n");
  errors.forEach((e) => console.error(`  - ${e}`));
  process.exit(1);
}

console.log("PASS: Hardened Real Media Validator PASSED with 130 unique SHA-256 authentic media assets!\n");
process.exit(0);
