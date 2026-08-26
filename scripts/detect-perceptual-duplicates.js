const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const sharp = require('sharp');

console.log("Starting 130-Media Perceptual & SHA-256 Near-Duplicate Detection Gate...");

const MEDIA_DIR = path.join(__dirname, '../public/media/curriculum');

function hammingDistance(h1, h2) {
  let dist = 0;
  for (let i = 0; i < Math.min(h1.length, h2.length); i++) {
    if (h1[i] !== h2[i]) dist++;
  }
  return dist + Math.abs(h1.length - h2.length);
}

async function computeImageHashes(filePath) {
  const buf = fs.readFileSync(filePath);
  const sha256 = crypto.createHash('sha256').update(buf).digest('hex');

  // Compute 64-bit dHash (difference hash)
  const dRaw = await sharp(buf)
    .resize(9, 8, { fit: 'fill' })
    .grayscale()
    .raw()
    .toBuffer();

  let dHash = '';
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const left = dRaw[row * 9 + col];
      const right = dRaw[row * 9 + col + 1];
      dHash += (left > right ? '1' : '0');
    }
  }

  // Compute 64-bit aHash (average hash)
  const aRaw = await sharp(buf)
    .resize(8, 8, { fit: 'fill' })
    .grayscale()
    .raw()
    .toBuffer();

  let sum = 0;
  for (let i = 0; i < 64; i++) sum += aRaw[i];
  const avg = sum / 64;

  let aHash = '';
  for (let i = 0; i < 64; i++) {
    aHash += (aRaw[i] >= avg ? '1' : '0');
  }

  return { sha256, dHash, aHash, byteSize: buf.length };
}

async function main() {
  if (!fs.existsSync(MEDIA_DIR)) {
    console.error(`FAIL: Media directory does not exist at ${MEDIA_DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(MEDIA_DIR).filter(f => f.startsWith('l') && (
    f.endsWith('.jpg') || f.endsWith('.jpeg') || f.endsWith('.png') || f.endsWith('.svg') || f.endsWith('.gif') || f.endsWith('.webp')
  ));

  if (files.length !== 130) {
    console.error(`FAIL: Expected exactly 130 media assets on disk, but found ${files.length}`);
    process.exit(1);
  }

  console.log(`Analyzing perceptual hashes across all ${files.length} media assets...`);

  const assetHashes = [];
  for (const f of files) {
    const fullPath = path.join(MEDIA_DIR, f);
    const hashes = await computeImageHashes(fullPath);
    assetHashes.push({ file: f, ...hashes });
  }

  // 1. SHA-256 Exact Duplicate Check
  const shaMap = new Map();
  const exactDuplicates = [];
  for (const item of assetHashes) {
    if (shaMap.has(item.sha256)) {
      exactDuplicates.push({ fileA: shaMap.get(item.sha256), fileB: item.file, sha256: item.sha256 });
    } else {
      shaMap.set(item.sha256, item.file);
    }
  }

  // 2. Perceptual Near-Duplicate Check across all pairs
  const perceptualDuplicates = [];
  const comparisons = [];
  for (let i = 0; i < assetHashes.length; i++) {
    for (let j = i + 1; j < assetHashes.length; j++) {
      const a = assetHashes[i];
      const b = assetHashes[j];
      const dDist = hammingDistance(a.dHash, b.dHash);
      const aDist = hammingDistance(a.aHash, b.aHash);

      // Flag if both dHash and aHash indicate high visual similarity (Hamming dist <= 4 out of 64)
      if (dDist <= 4 && aDist <= 4) {
        perceptualDuplicates.push({
          fileA: a.file,
          fileB: b.file,
          dHashDistance: dDist,
          aHashDistance: aDist,
        });
      }
    }
  }

  console.log("\n================================================================================");
  console.log("PERCEPTUAL & CRYPTOGRAPHIC DUPLICATE DETECTION RESULTS");
  console.log("================================================================================");
  console.log(`Total Media Assets Analyzed:          ${assetHashes.length} / 130`);
  console.log(`Unique SHA-256 Checksums:             ${shaMap.size} / 130`);
  console.log(`Exact Duplicate Pairs Found:          ${exactDuplicates.length}`);
  console.log(`Perceptual Near-Duplicate Pairs:      ${perceptualDuplicates.length} (out of ${(assetHashes.length * (assetHashes.length - 1)) / 2} pairs)`);
  console.log("================================================================================\n");

  if (exactDuplicates.length > 0) {
    console.error("FAIL: Exact duplicate media files detected on disk:");
    exactDuplicates.forEach(d => console.error(`  - ${d.fileA} and ${d.fileB} share SHA-256: ${d.sha256}`));
    process.exit(1);
  }

  if (perceptualDuplicates.length > 0) {
    console.error("FAIL: Perceptual near-duplicate media files detected:");
    perceptualDuplicates.forEach(d => console.error(`  - ${d.fileA} and ${d.fileB} (dHash distance: ${d.dHashDistance}, aHash distance: ${d.aHashDistance})`));
    process.exit(1);
  }

  console.log("PASS: All 130 media assets are perceptually and cryptographically unique!");
  process.exit(0);
}

main().catch(err => {
  console.error("Fatal error in perceptual duplicate gate:", err);
  process.exit(1);
});
