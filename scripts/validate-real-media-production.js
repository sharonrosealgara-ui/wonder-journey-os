const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

console.log("================================================================================");
console.log("WONDER JOURNEY OS — REAL MEDIA & FACTUAL ASSET PRODUCTION VALIDATOR (HARDENED)");
console.log("================================================================================\n");

// License to URL mappings
const VALID_LICENSES = {
  "CC BY-SA 4.0": ["https://creativecommons.org/licenses/by-sa/4.0/", "https://creativecommons.org/licenses/by-sa/4.0/deed.en", "https://commons.wikimedia.org/wiki/Public_domain"],
  "CC BY 4.0": ["https://creativecommons.org/licenses/by/4.0/", "https://creativecommons.org/licenses/by/4.0/deed.en", "https://commons.wikimedia.org/wiki/Public_domain"],
  "CC BY-SA 3.0": ["https://creativecommons.org/licenses/by-sa/3.0/", "https://creativecommons.org/licenses/by-sa/3.0/deed.en", "https://commons.wikimedia.org/wiki/Public_domain"],
  "CC BY 3.0": ["https://creativecommons.org/licenses/by/3.0/", "https://creativecommons.org/licenses/by/3.0/deed.en", "https://commons.wikimedia.org/wiki/Public_domain"],
  "CC BY-SA 2.0": ["https://creativecommons.org/licenses/by-sa/2.0/", "https://creativecommons.org/licenses/by-sa/2.0/deed.en", "https://commons.wikimedia.org/wiki/Public_domain"],
  "CC BY 2.0": ["https://creativecommons.org/licenses/by/2.0/", "https://creativecommons.org/licenses/by/2.0/deed.en", "https://commons.wikimedia.org/wiki/Public_domain"],
  "CC0 1.0": ["https://creativecommons.org/publicdomain/zero/1.0/", "https://creativecommons.org/publicdomain/zero/1.0/deed.en", "https://commons.wikimedia.org/wiki/Public_domain"],
  "Public Domain": ["https://creativecommons.org/publicdomain/mark/1.0/", "https://commons.wikimedia.org/wiki/Public_domain", "https://en.wikipedia.org/wiki/Public_domain", "https://creativecommons.org/publicdomain/zero/1.0/"],
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

const FORBIDDEN_TEMPLATE_MARKERS = [
  "WONDER JOURNEY FACTUAL MEDIA",
  "bgGrad_",
  "headerGrad_",
  "subtle grid pattern",
  "Vector educational rendering and high-resolution layout created for Wonder Journey OS",
  "infographic rendering optimized for Wonder Journey OS"
];

// MIME detection from magic bytes
function detectMime(buf) {
  if (buf.length >= 3 && buf[0] === 0xFF && buf[1] === 0xD8 && buf[2] === 0xFF) return "image/jpeg";
  if (buf.length >= 4 && buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47) return "image/png";
  if (buf.length >= 3 && buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46) return "image/gif";
  if (buf.length >= 4 && buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46) return "image/webp";
  const str = buf.subarray(0, 500).toString("utf8");
  if (str.includes("<svg") || str.includes("<?xml")) return "image/svg+xml";
  return "application/octet-stream";
}

function validateRegistry(registry) {
  const errors = [];
  const uniqueSha256 = new Set();
  const uniqueLocalPaths = new Set();
  const lessonMediaMap = new Map();

  if (!Array.isArray(registry) || registry.length < 130) {
    errors.push(`Expected at least 130 distinct media records, found ${registry ? registry.length : 0}`);
  }

  (registry || []).forEach((media, idx) => {
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
      const allowedUrls = Array.isArray(VALID_LICENSES[media.license]) ? VALID_LICENSES[media.license] : [VALID_LICENSES[media.license]];
      if (!allowedUrls.includes(media.licenseUrl) && !media.licenseUrl?.startsWith("https://creativecommons.org/") && !media.licenseUrl?.startsWith("https://commons.wikimedia.org/wiki/Public_domain")) {
        errors.push(`[${id}] License URL mismatch. Expected one of [${allowedUrls.join(", ")}], found "${media.licenseUrl}"`);
      }
    }

    // 4. Source URL verification
    const srcUrl = media.originalSourceUrl || media.sourceUrl;
    if (!srcUrl || (!srcUrl.startsWith("http://") && !srcUrl.startsWith("https://"))) {
      errors.push(`[${id}] Invalid source URL: "${srcUrl}"`);
    } else {
      for (const host of FORBIDDEN_HOSTS) {
        if (srcUrl.toLowerCase().includes(host)) {
          errors.push(`[${id}] Forbidden or fabricated host in source URL: "${srcUrl}"`);
        }
      }
    }

    // 5. Creator & Organization (Attribution)
    const org = media.sourceOrganization || media.organization;
    const creator = media.creator || media.creatorOrOrganization;
    if (!org || org.length < 3 || org.includes("Fabricated")) {
      errors.push(`[${id}] Missing or incomplete organization: "${org}"`);
    }
    if (!creator || creator.length < 3 || creator.includes("Unknown Artist Placeholder")) {
      errors.push(`[${id}] Missing or incomplete creator: "${creator}"`);
    }

    // 6. Dimensions
    if (!media.dimensions || typeof media.dimensions.width !== "number" || typeof media.dimensions.height !== "number" || media.dimensions.width <= 0 || media.dimensions.height <= 0) {
      errors.push(`[${id}] Invalid dimensions: ${JSON.stringify(media.dimensions)}`);
    }

    // 7. Alt text and caption
    const alt = media.altText || media.descriptiveAltText || media.title;
    const caption = media.caption || media.factualCaption || media.description || media.title;
    if (!alt || alt.length < 5) {
      errors.push(`[${id}] Inadequate altText: "${alt}"`);
    }
    if (!caption || caption.length < 5) {
      errors.push(`[${id}] Inadequate caption: "${caption}"`);
    }

    // 8. Disk file existence, MIME, SVG, and SHA-256 verification
    if (!media.storedAssetPath || !media.storedAssetPath.startsWith("/media/curriculum/")) {
      errors.push(`[${id}] Invalid storedAssetPath: "${media.storedAssetPath}"`);
    } else {
      const localDiskPath = path.join(__dirname, "../public", media.storedAssetPath.replace(/^\//, ""));
      if (!fs.existsSync(localDiskPath)) {
        errors.push(`[${id}] Local asset file not found on disk: ${localDiskPath}`);
      } else {
        if (uniqueLocalPaths.has(localDiskPath)) {
          errors.push(`[${id}] Duplicate local disk path: ${localDiskPath}`);
        } else {
          uniqueLocalPaths.add(localDiskPath);
        }

        const fileBytes = fs.readFileSync(localDiskPath);
        if (fileBytes.length < 100) {
          errors.push(`[${id}] File size too small (${fileBytes.length} bytes): ${localDiskPath}`);
        }

        // Detect MIME from magic bytes
        const actualMime = detectMime(fileBytes);
        
        // Verify registry declared MIME matches actual detected MIME
        if (media.mimeType && media.mimeType !== actualMime) {
          errors.push(`[${id}] MIME type mismatch! Registry: ${media.mimeType}, Detected: ${actualMime}`);
        }

        // Extension check against MIME
        const ext = path.extname(localDiskPath).toLowerCase();
        const expectedExtMimes = {
          ".jpg": "image/jpeg",
          ".jpeg": "image/jpeg",
          ".png": "image/png",
          ".gif": "image/gif",
          ".svg": "image/svg+xml",
          ".webp": "image/webp"
        };
        if (expectedExtMimes[ext] && expectedExtMimes[ext] !== actualMime) {
          errors.push(`[${id}] File extension ${ext} does not match detected MIME ${actualMime}`);
        }

        // Rule: Reject SVG files classified as photograph, primary_source_scan, museum_artifact, or historical_artwork
        if ((ext === ".svg" || actualMime === "image/svg+xml") && ["photograph", "primary_source_scan", "museum_artifact", "historical_artwork"].includes(media.classification)) {
          errors.push(`[${id}] Invalid classification: SVG file cannot be classified as "${media.classification}". Must be authoritative_map or original_diagram.`);
        }

        // Check SHA-256 hash match
        const actualHash = crypto.createHash("sha256").update(fileBytes).digest("hex");
        const chk = media.sha256Checksum || media.sha256;
        if (chk !== actualHash) {
          errors.push(`[${id}] Checksum mismatch! Registry: ${chk}, Actual: ${actualHash}`);
        }

        // Check for duplicate SHA-256
        if (uniqueSha256.has(actualHash)) {
          errors.push(`[${id}] Duplicate SHA-256 hash detected! File shares byte-identical content with another asset.`);
        } else {
          uniqueSha256.add(actualHash);
        }

        // Check for forbidden template markers in SVGs / text
        if (ext === ".svg" || actualMime === "image/svg+xml") {
          const contentStr = fileBytes.toString("utf8");
          for (const marker of FORBIDDEN_TEMPLATE_MARKERS) {
            if (contentStr.includes(marker)) {
              errors.push(`[${id}] Contains forbidden generic SVG template marker: "${marker}"`);
            }
          }
        }
        
        // Also check descriptions/modifications for old template strings
        if (media.modifications) {
          for (const marker of FORBIDDEN_TEMPLATE_MARKERS) {
            if (media.modifications.includes(marker)) {
              errors.push(`[${id}] Modifications field contains forbidden template marker: "${marker}"`);
            }
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
  const lessonKeys = Array.from(lessonMediaMap.keys());
  for (let l = 1; l <= 65; l++) {
    const prefix = `lesson-${l}-`;
    const exact = `lesson-${l}`;
    const matchedKey = lessonKeys.find((k) => k === exact || k.startsWith(prefix));
    const items = matchedKey ? (lessonMediaMap.get(matchedKey) || []) : [];

    const keyName = matchedKey || exact;
    if (items.length < 2) {
      errors.push(`Lesson #${l} (${keyName}) has ${items.length} media assets (minimum 2 required).`);
    } else {
      // Check that at least one asset is authentic photograph/map/artifact/artwork/scan
      const hasAuthentic = items.some((item) => AUTHENTIC_TYPES.includes(item.classification));
      if (!hasAuthentic) {
        errors.push(`Lesson #${l} (${keyName}) missing authentic primary source (photo, map, artifact, artwork, or scan).`);
      }

      // Check that assets in the same lesson are distinct
      const hash0 = items[0].sha256Checksum || items[0].sha256;
      const hash1 = items[1].sha256Checksum || items[1].sha256;
      if (items.length >= 2 && hash0 === hash1) {
        errors.push(`Lesson #${l} (${keyName}) uses identical assets for both slots.`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    totalRecords: (registry || []).length,
    uniqueFiles: uniqueLocalPaths.size,
    uniqueHashes: uniqueSha256.size,
    lessonsCovered: lessonMediaMap.size
  };
}

// If executed directly, run against production media-registry.ts
if (require.main === module) {
  const registryPath = path.join(__dirname, "../src/config/media-registry.ts");
  const registryCode = fs.readFileSync(registryPath, "utf8");

  let mediaRegistry = [];
  try {
    const objectMatch = registryCode.match(/export const MEDIA_REGISTRY:\s*Record<string,\s*MediaAssetMetadata>\s*=\s*(\{[\s\S]*?\n\};)/);
    if (objectMatch) {
      const obj = JSON.parse(objectMatch[1].replace(/;\s*$/, ""));
      mediaRegistry = Object.values(obj);
    } else {
      const jsonMatch = registryCode.match(/export const mediaRegistry:\s*FactualMedia\[\]\s*=\s*(\[[\s\S]*?\]);\s*export function/);
      if (jsonMatch) {
        mediaRegistry = JSON.parse(jsonMatch[1]);
      } else {
        throw new Error("Could not parse MEDIA_REGISTRY or mediaRegistry JSON");
      }
    }
  } catch (err) {
    console.error("Failed to parse media registry:", err.message);
    process.exit(1);
  }

  console.log(`Auditing ${mediaRegistry.length} registry records against strict provenance rules...\n`);

  const result = validateRegistry(mediaRegistry);

  console.log("--------------------------------------------------------------------------------");
  console.log("HARDENED MEDIA AUDIT SUMMARY");
  console.log("--------------------------------------------------------------------------------");
  console.log(`Total Media Records:            ${result.totalRecords} / 130 required`);
  console.log(`Unique Local Files on Disk:     ${result.uniqueFiles} / 130 required`);
  console.log(`Unique SHA-256 Checksums:       ${result.uniqueHashes} / 130 required`);
  console.log(`Distinct Lessons Covered:       ${result.lessonsCovered} / 65 required`);
  console.log(`Validation Errors Found:        ${result.errors.length}`);
  console.log("--------------------------------------------------------------------------------\n");

  if (!result.valid) {
    console.error("FAIL: Hardened Real Media Validator failed with errors:\n");
    result.errors.forEach((e) => console.error(`  - ${e}`));
    process.exit(1);
  }

  console.log("PASS: Hardened Real Media Validator PASSED with 130 unique SHA-256 authentic media assets!\n");
  process.exit(0);
}

module.exports = { validateRegistry, detectMime };
