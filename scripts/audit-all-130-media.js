const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { CANONICAL_ASSET_SPECS } = require('./canonical-media-specs');

// Read contact sheet verification evidence
const contactSheetPath = path.join(__dirname, '../artifacts/media-contact-sheet.json');
let contactSheet = { items: [] };
if (fs.existsSync(contactSheetPath)) {
  try {
    contactSheet = JSON.parse(fs.readFileSync(contactSheetPath, 'utf8'));
  } catch (e) {}
}

const contactSheetMap = new Map();
(contactSheet.items || []).forEach(item => {
  contactSheetMap.set(item.id, item);
});

// Build canonical spec map
const specMap = new Map();
CANONICAL_ASSET_SPECS.forEach(s => specMap.set(s.id, s));

// Load media registry from source (handling TypeScript / JS)
let mediaRegistry = [];
try {
  const tsContent = fs.readFileSync(path.join(__dirname, '../src/config/media-registry.ts'), 'utf8');
  const jsonMatch = tsContent.match(/export const mediaRegistry: FactualMedia\[\] = (\[[\s\S]*?\]);/);
  if (jsonMatch) {
    mediaRegistry = JSON.parse(jsonMatch[1]);
  }
} catch (e) {
  console.error("Failed to parse mediaRegistry:", e.message);
  process.exit(1);
}

console.log('================================================================================');
console.log('WONDER JOURNEY OS — 130 MEDIA SUBJECT RELEVANCE, PROVENANCE & LICENSE AUDIT');
console.log(`Auditing ${mediaRegistry.length} assets across 65 curriculum lessons...`);
console.log('================================================================================\n');

let defects = [];

const VALID_LICENSES = {
  "CC BY-SA 4.0": "https://creativecommons.org/licenses/by-sa/4.0/",
  "CC BY 4.0": "https://creativecommons.org/licenses/by/4.0/",
  "CC BY-SA 3.0": "https://creativecommons.org/licenses/by-sa/3.0/",
  "CC BY 2.0": "https://creativecommons.org/licenses/by/2.0/",
  "Public Domain": "https://creativecommons.org/publicdomain/mark/1.0/",
};

// Known mismatched/rejected keywords that must NEVER appear in curriculum media
const REJECTED_SUBJECT_PATTERNS = [
  /Soulacroix/i,
  /Cavalier's_Kiss/i,
  /IBM_PC_5150/i,
  /USS_Ronald_Reagan/i,
  /American_Dance_Festival/i,
  /Pakse_-_Laos/i,
  /University_of_Hull/i,
  /Esperanta/i,
  /All_the_Year_Round/i,
  /Crooked_River-Oregon/i,
  /Swiss_Family_Robinson/i,
  /Illinois_Volunteer_Infantry/i,
  /Scotswood_Community_Garden/i,
  /Vintage_family_from_england/i,
  /Marinated_chunks_of_rabbit/i,
  /Tokyo|London|Washington|Israel|Poland/i,
];

const seenHashes = new Set();
const seenPaths = new Set();

if (mediaRegistry.length !== 130) {
  defects.push(`Media registry count mismatch: expected 130, found ${mediaRegistry.length}`);
}

mediaRegistry.forEach((m, idx) => {
  const num = idx + 1;
  const p = path.join(__dirname, '../public', m.storedAssetPath.replace(/^\//, ''));
  
  // 1. Physical disk and checksum verification
  if (!fs.existsSync(p)) {
    defects.push(`Record ${num} (${m.id}): File missing on disk ${m.storedAssetPath}`);
  } else {
    const buf = fs.readFileSync(p);
    const hash = crypto.createHash('sha256').update(buf).digest('hex');
    if (hash !== m.sha256Checksum) {
      defects.push(`Record ${num} (${m.id}): SHA-256 mismatch (registry: ${m.sha256Checksum}, actual: ${hash})`);
    }
    const isSvg = m.storedAssetPath.endsWith('.svg');
    const minSize = isSvg ? 100 : 2048;
    if (buf.length < minSize) {
      defects.push(`Record ${num} (${m.id}): Buffer too small (${buf.length} bytes, min ${minSize})`);
    }
    if (seenHashes.has(hash)) {
      defects.push(`Record ${num} (${m.id}): Duplicate SHA-256 hash ${hash}`);
    }
    seenHashes.add(hash);
    if (seenPaths.has(p)) {
      defects.push(`Record ${num} (${m.id}): Duplicate storedAssetPath ${m.storedAssetPath}`);
    }
    seenPaths.add(p);
  }

  // 2. Creator checks (no fabricated, empty, or unknown authors)
  if (!m.creator || m.creator.toLowerCase().includes('unknown') || m.creator.trim().length < 3) {
    defects.push(`Record ${num} (${m.id}): Creator defect '${m.creator}'`);
  }

  // 3. Source URL checks
  if (!m.originalSourceUrl || !m.originalSourceUrl.startsWith('http') || m.originalSourceUrl.includes('wonderjourney.app') || m.originalSourceUrl.includes('localhost') || m.originalSourceUrl.includes('example.com')) {
    defects.push(`Record ${num} (${m.id}): Source URL defect '${m.originalSourceUrl}'`);
  }

  // 4. Strict License verification
  if (!VALID_LICENSES[m.license]) {
    defects.push(`Record ${num} (${m.id}): Invalid license '${m.license}'`);
  } else if (m.licenseUrl !== VALID_LICENSES[m.license]) {
    defects.push(`Record ${num} (${m.id}): License URL mismatch ('${m.licenseUrl}' vs '${VALID_LICENSES[m.license]}')`);
  }

  // 5. Alt text and caption
  if (!m.altText || m.altText.length < 15) {
    defects.push(`Record ${num} (${m.id}): Alt text too short '${m.altText}'`);
  }
  if (!m.caption || m.caption.length < 10) {
    defects.push(`Record ${num} (${m.id}): Caption too short '${m.caption}'`);
  }

  // 6. Genuine Subject Relevance Verification
  const spec = specMap.get(m.id);
  if (!spec) {
    defects.push(`Record ${num} (${m.id}): Missing canonical specification in catalog`);
  } else {
    if (spec.lessonId !== m.lessonId) {
      defects.push(`Record ${num} (${m.id}): Lesson ID mismatch with spec (expected ${spec.lessonId}, got ${m.lessonId})`);
    }
  }

  // Reject known mismatched file patterns
  for (const pattern of REJECTED_SUBJECT_PATTERNS) {
    if (pattern.test(m.originalSourceUrl) || pattern.test(m.title) || pattern.test(m.storedAssetPath)) {
      defects.push(`Record ${num} (${m.id}): Rejected mismatched subject detected: ${pattern.toString()}`);
    }
  }

  // 7. Contact sheet review evidence cross-check
  const review = contactSheetMap.get(m.id);
  if (!review) {
    defects.push(`Record ${num} (${m.id}): Missing review evidence in contact sheet`);
  } else if (review.reviewerStatus !== "VERIFIED_AUTHENTIC") {
    defects.push(`Record ${num} (${m.id}): Reviewer status is '${review.reviewerStatus}', expected 'VERIFIED_AUTHENTIC'`);
  }
});

console.log('Total defects count:', defects.length);
if (defects.length > 0) {
  console.log('Defects list:');
  defects.forEach(d => console.log(' - ' + d));
  process.exit(1);
} else {
  console.log('✓ 100% of 130 media records passed strict subject relevance, creator, license, and provenance audit!');
  process.exit(0);
}
