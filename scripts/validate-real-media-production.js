const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

console.log("================================================================================");
console.log("WONDER JOURNEY OS — REAL MEDIA & FACTUAL ASSET PRODUCTION VALIDATOR");
console.log("================================================================================\n");

const { mediaRegistry, getAllMedia } = require("../src/config/media-registry");
const { lessons } = require("../src/config/lessons");

let errors = [];
let warnings = [];
let validPlacements = 0;
let uniqueLocalFiles = new Set();
let checkedLessonIds = new Set();

const lessonsCount = lessons.length;
if (lessonsCount !== 65) {
  errors.push(`Expected exactly 65 lessons in curriculum, found ${lessonsCount}`);
}

const allMedia = getAllMedia();
console.log(`Auditing ${allMedia.length} registry media assets across ${lessonsCount} lessons...\n`);

if (allMedia.length < 130) {
  errors.push(`Expected at least 130 media registry records, found ${allMedia.length}`);
}

const COMPLIANT_LICENSES = [
  "Public Domain",
  "Public Domain / Open Access",
  "Public Domain / Philippine Government Work",
  "Public Domain / DOST Open Access",
  "Public Domain / NHCP Open Access",
  "Public Domain / BFAR Open Access",
  "Public Domain / NPC Open Archive",
  "Public Domain / DENR PAMB",
  "Public Domain / DENR Official",
  "Public Domain / PEF",
  "CC0",
  "CC0 1.0",
  "CC BY",
  "CC BY 4.0",
  "CC BY-SA",
  "CC BY-SA 4.0",
  "CC BY-SA 3.0",
  "Open Access",
  "Smithsonian Open Access",
  "Met Open Access"
];

const VALID_MIME_TYPES = ["image/svg+xml", "image/webp", "image/png", "image/jpeg"];

allMedia.forEach((media) => {
  // 1. Mandatory metadata fields
  if (!media.id) errors.push(`Media record missing id`);
  if (!media.title || media.title.length < 3) errors.push(`[${media.id}] Invalid or missing title`);
  if (!media.subject || media.subject.length < 3) errors.push(`[${media.id}] Invalid or missing subject`);
  if (!media.creatorOrOrganization) errors.push(`[${media.id}] Missing creator/organization`);
  if (!media.license) errors.push(`[${media.id}] Missing license field`);
  if (!media.licenseUrl || !media.licenseUrl.startsWith("http")) errors.push(`[${media.id}] Missing or invalid license URL: ${media.licenseUrl}`);
  if (!media.originalSourceUrl || !media.originalSourceUrl.startsWith("http")) errors.push(`[${media.id}] Missing or invalid original source URL: ${media.originalSourceUrl}`);
  if (!media.storedAssetPath || !media.storedAssetPath.startsWith("/")) errors.push(`[${media.id}] Missing or invalid storedAssetPath: ${media.storedAssetPath}`);
  if (!media.descriptiveAltText || media.descriptiveAltText.length < 10) errors.push(`[${media.id}] Inadequate alt text: "${media.descriptiveAltText}"`);
  if (!media.factualCaption || media.factualCaption.length < 10) errors.push(`[${media.id}] Inadequate caption: "${media.factualCaption}"`);
  if (!media.educationalPurpose || media.educationalPurpose.length < 10) errors.push(`[${media.id}] Inadequate educational purpose`);
  if (!media.attribution || media.attribution.length < 5) errors.push(`[${media.id}] Missing attribution`);
  if (media.verificationStatus !== "verified") errors.push(`[${media.id}] Verification status is not 'verified' (${media.verificationStatus})`);

  // 2. License compliance
  const isCompliant = COMPLIANT_LICENSES.some((lic) => media.license.includes(lic) || lic.includes(media.license));
  if (!isCompliant) {
    errors.push(`[${media.id}] Non-compliant license: "${media.license}"`);
  }

  // 3. MIME type and dimensions
  if (!VALID_MIME_TYPES.includes(media.mimeType)) {
    errors.push(`[${media.id}] Unsupported MIME type: ${media.mimeType}`);
  }
  if (!media.width || media.width < 400 || !media.height || media.height < 300) {
    errors.push(`[${media.id}] Inadequate dimensions: ${media.width}x${media.height}`);
  }

  // 4. Local file verification & Checksum
  const localDiskPath = path.join(__dirname, "../public", media.storedAssetPath.replace(/^\//, ""));
  if (!fs.existsSync(localDiskPath)) {
    errors.push(`[${media.id}] Local asset file not found on disk: ${localDiskPath}`);
  } else {
    uniqueLocalFiles.add(localDiskPath);
    const stat = fs.statSync(localDiskPath);
    if (stat.size === 0) {
      errors.push(`[${media.id}] Zero-byte file: ${localDiskPath}`);
    }
    const fileBuf = fs.readFileSync(localDiskPath);
    const actualHash = crypto.createHash("sha256").update(fileBuf).digest("hex");
    if (media.sha256 && media.sha256 !== actualHash) {
      errors.push(`[${media.id}] SHA-256 Checksum mismatch! Recorded: ${media.sha256}, Actual: ${actualHash}`);
    }

    // Check for prohibited keywords in content (e.g. placeholder, TODO, Lorem ipsum)
    const strContent = fileBuf.toString("utf8");
    if (/lorem\s+ipsum/i.test(strContent)) {
      errors.push(`[${media.id}] Prohibited Lorem Ipsum text found in asset`);
    }
    if (/image\s+pending/i.test(strContent) || /placeholder/i.test(strContent)) {
      errors.push(`[${media.id}] Prohibited placeholder indicator in asset`);
    }
  }

  // 5. Associated lessons
  if (!Array.isArray(media.associatedLessonIds) || media.associatedLessonIds.length === 0) {
    errors.push(`[${media.id}] Missing associated lesson IDs`);
  } else {
    media.associatedLessonIds.forEach((lId) => {
      checkedLessonIds.add(lId);
      validPlacements++;
    });
  }
});

// Check lesson coverage (every lesson must have >= 2 media placements)
lessons.forEach((lesson, index) => {
  const lessonMedia = allMedia.filter((m) => m.associatedLessonIds.includes(lesson.id));
  if (lessonMedia.length < 2) {
    errors.push(`Lesson #${index + 1} (${lesson.id}) has ${lessonMedia.length} media placements (minimum 2 required).`);
  }
});

console.log("--------------------------------------------------------------------------------");
console.log("MEDIA AUDIT SUMMARY");
console.log("--------------------------------------------------------------------------------");
console.log(`Total Lessons Audited:          ${lessonsCount} / 65`);
console.log(`Total Verified Media Records:   ${allMedia.length}`);
console.log(`Unique Local Asset Files:       ${uniqueLocalFiles.size}`);
console.log(`Total Valid Rendered Placements:${validPlacements} (Minimum 130 required)`);
console.log(`Covered Lessons:                ${checkedLessonIds.size} / 65`);
console.log(`Validation Errors Found:        ${errors.length}`);
console.log("--------------------------------------------------------------------------------\n");

if (errors.length > 0) {
  console.error("FAIL: Real Media Production validation failed with the following errors:\n");
  errors.forEach((e) => console.error(`  - ${e}`));
  process.exit(1);
}

console.log("PASS: Real Media Production Validator PASSED with 100% verified authentic assets!\n");
process.exit(0);
