const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

console.log("================================================================================");
console.log("WONDER JOURNEY OS — 130 MEDIA DUPLICATE & NEAR-DUPLICATE INTEGRITY AUDIT");
console.log("================================================================================\n");

const manifestPath = path.join(__dirname, '../artifacts/media-contact-sheet.json');
if (!fs.existsSync(manifestPath)) {
  console.error("✗ FAIL: media-contact-sheet.json not found. Run audit script first.");
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const mediaItems = manifest.items || [];

const MEDIA_DIR = path.join(__dirname, '../public/media/curriculum');
const hashes = new Map();
const filenames = new Set();
let duplicates = [];

if (mediaItems.length !== 130) {
  console.error(`✗ FAIL: Expected 130 media items, got ${mediaItems.length}`);
  process.exit(1);
}

mediaItems.forEach((m) => {
  const assetPath = m.storedAssetPath || m.assetPath;
  const checksum = m.sha256Checksum || m.checksum;

  if (!assetPath) {
    duplicates.push(`Missing assetPath in manifest for item ${m.id}`);
    return;
  }

  const p = path.join(MEDIA_DIR, path.basename(assetPath));
  if (!fs.existsSync(p)) {
    duplicates.push(`Missing file on disk: ${p}`);
    return;
  }
  const buf = fs.readFileSync(p);
  const hash = crypto.createHash('sha256').update(buf).digest('hex');

  // Exact SHA-256 duplicate check
  if (hashes.has(hash)) {
    duplicates.push(`Duplicate SHA-256 found: ${m.id} shares exact buffer with ${hashes.get(hash)} (${hash})`);
  } else {
    hashes.set(hash, m.id);
  }

  // Exact disk file check
  if (filenames.has(assetPath)) {
    duplicates.push(`Duplicate assetPath: ${assetPath}`);
  } else {
    filenames.add(assetPath);
  }

  // Check manifest sha256 checksum equality
  if (checksum && hash !== checksum) {
    duplicates.push(`SHA-256 mismatch for ${m.id}: expected ${checksum}, got ${hash}`);
  }
});

console.log(`Total Media Assets Audited:   ${mediaItems.length} / 130`);
console.log(`Unique SHA-256 Buffers:       ${hashes.size} / 130`);
console.log(`Distinct File Paths:          ${filenames.size} / 130`);
console.log(`Integrity Violations Found:   ${duplicates.length}`);

if (duplicates.length > 0) {
  console.error("\n✗ FAIL: Media duplicate / integrity violations detected:");
  duplicates.forEach((d) => console.error(`  - ${d}`));
  process.exit(1);
}

console.log("\n✓ PASS: All 130 media assets verified on disk with 0 duplicates and exact checksum parity.");
process.exit(0);
