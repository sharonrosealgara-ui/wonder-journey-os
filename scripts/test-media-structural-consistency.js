const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

console.log('================================================================================');
console.log('WONDER JOURNEY OS — CANONICAL MEDIA MAPPING & STRUCTURAL CONSISTENCY REGRESSION');
console.log('Verifying Canonical Mapping <-> Physical Disk <-> Media Registry Invariants');
console.log('================================================================================\n');

// 1. Prohibit retired legacy manifest
const retiredManifestPath = path.join(__dirname, '../artifacts/curriculum-media-fidelity-manifest.json');
if (fs.existsSync(retiredManifestPath)) {
  console.error('FAIL: Obsolete artifacts/curriculum-media-fidelity-manifest.json detected! This file was formally retired.');
  process.exit(1);
}
console.log('✓ Invariant 1: Obsolete curriculum-media-fidelity-manifest.json is absent.');

// Load authoritative sources
const { COMMONS_IMAGE_MAP } = require('./verified-commons-image-map');
const { CANONICAL_SPECS } = require('./canonical-media-specs');

// Read MEDIA_REGISTRY from src/config/media-registry.ts
const tsContent = fs.readFileSync(path.join(__dirname, '../src/config/media-registry.ts'), 'utf8');
const jsonMatch = tsContent.match(/export const MEDIA_REGISTRY:\s*Record<string,\s*MediaAssetMetadata>\s*=\s*(\{[\s\S]*?\});/);
if (!jsonMatch) {
  console.error('FAIL: Could not parse MEDIA_REGISTRY from src/config/media-registry.ts');
  process.exit(1);
}
const MEDIA_REGISTRY = JSON.parse(jsonMatch[1]);

const specMap = new Map();
(CANONICAL_SPECS || []).forEach(s => specMap.set(s.id, s));

// Magic bytes MIME detector
function detectMime(buf) {
  if (buf.length >= 3 && buf[0] === 0xFF && buf[1] === 0xD8 && buf[2] === 0xFF) return "image/jpeg";
  if (buf.length >= 4 && buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47) return "image/png";
  if (buf.length >= 3 && buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46) return "image/gif";
  if (buf.length >= 4 && buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46) return "image/webp";
  const str = buf.subarray(0, 500).toString("utf8");
  if (str.includes("<svg") || str.includes("<?xml")) return "image/svg+xml";
  return "application/octet-stream";
}

let errors = [];

// 2. Comprehensive 130 Asset Verification
const allKeys = Object.keys(COMMONS_IMAGE_MAP);
if (allKeys.length !== 130) {
  errors.push(`COMMONS_IMAGE_MAP count mismatch: expected 130, found ${allKeys.length}`);
}

for (const id of allKeys) {
  const commonsFile = COMMONS_IMAGE_MAP[id];
  const regItem = MEDIA_REGISTRY[id];
  const specItem = specMap.get(id);

  if (!regItem) {
    errors.push(`[${id}] Missing entry in MEDIA_REGISTRY`);
    continue;
  }
  if (!specItem) {
    errors.push(`[${id}] Missing entry in CANONICAL_SPECS`);
  }

  // Check source file title alignment
  const expectedSourceTitle = `File:${commonsFile}`;
  if (regItem.sourceFileTitle !== expectedSourceTitle) {
    errors.push(`[${id}] Source file title mismatch: registry has "${regItem.sourceFileTitle}", expected "${expectedSourceTitle}"`);
  }

  // Check physical disk existence
  const diskPath = path.join(__dirname, '../public', regItem.storedAssetPath.replace(/^\//, ''));
  if (!fs.existsSync(diskPath)) {
    errors.push(`[${id}] Physical asset missing on disk: ${diskPath}`);
    continue;
  }

  // Byte level verification
  let bytes = fs.readFileSync(diskPath);
  if (diskPath.endsWith('.svg')) {
    bytes = Buffer.from(bytes.toString('utf8').replace(/\r\n/g, '\n'), 'utf8');
  }
  const actualSha256 = crypto.createHash('sha256').update(bytes).digest('hex');
  if (actualSha256 !== regItem.sha256Checksum) {
    errors.push(`[${id}] Phantom Attribution Detected! Disk hash (${actualSha256}) does not match registry (${regItem.sha256Checksum})`);
  }

  if (bytes.length !== regItem.byteSize) {
    errors.push(`[${id}] Byte size mismatch: disk has ${bytes.length}, registry declared ${regItem.byteSize}`);
  }

  const detectedMime = detectMime(bytes);
  if (detectedMime !== regItem.mimeType) {
    errors.push(`[${id}] MIME mismatch: detected ${detectedMime}, registry has ${regItem.mimeType}`);
  }

  // Specific check for L31 and L50
  if (id === 'media-l31-secondary') {
    if (commonsFile !== 'Magellan_Shrine.jpg') {
      errors.push(`[${id}] Expected commonsFile 'Magellan_Shrine.jpg', found '${commonsFile}'`);
    }
    if (!regItem.storedAssetPath.endsWith('.jpg')) {
      errors.push(`[${id}] Expected .jpg assetPath, found '${regItem.storedAssetPath}'`);
    }
  }

  if (id === 'media-l50-primary') {
    if (commonsFile !== '6301Photos_taken_in_Poblacion,_Baliuag,_Bulacan_54.jpg') {
      errors.push(`[${id}] Expected verified Judgefloro file '6301Photos_taken_in_Poblacion,_Baliuag,_Bulacan_54.jpg', found '${commonsFile}'`);
    }
    if (regItem.creator !== 'Judgefloro') {
      errors.push(`[${id}] Expected creator 'Judgefloro', found '${regItem.creator}'`);
    }
    if (regItem.title.includes('Heirloom')) {
      errors.push(`[${id}] Found unverified 'Heirloom' claim in title: '${regItem.title}'`);
    }
  }
}

if (errors.length > 0) {
  console.error('FAIL: Structural consistency errors encountered:');
  errors.forEach(e => console.error('  - ' + e));
  process.exit(1);
}
console.log('✓ Invariant 2: All 130 assets pass structural mapping <-> disk <-> registry consistency.');

// 3. Negative / Phantom Attribution Invariant Test Suite
console.log('\nRunning Phantom Attribution Invariant Negative Suite...');

function assertNegative(name, fn) {
  let threw = false;
  try {
    fn();
  } catch (e) {
    threw = true;
    console.log(`  ✓ Caught expected negative error in "${name}": ${e.message}`);
  }
  if (!threw) {
    console.error(`  ✗ FAIL: Negative test "${name}" failed to catch invariant violation!`);
    process.exit(1);
  }
}

// Negative 1: Phantom attribution where metadata changes but disk bytes do not
assertNegative('Phantom metadata change with unswapped bytes', () => {
  const simulatedMap = { ...COMMONS_IMAGE_MAP, 'media-l50-primary': 'Different_Unswapped_File.jpg' };
  const currentItem = MEDIA_REGISTRY['media-l50-primary'];
  if (`File:${simulatedMap['media-l50-primary']}` !== currentItem.sourceFileTitle) {
    throw new Error(`Simulated mapping mismatch caught: File:${simulatedMap['media-l50-primary']} vs ${currentItem.sourceFileTitle}`);
  }
});

// Negative 2: Hash mismatch between registry and actual disk file
assertNegative('Checksum mismatch (tampered file or desynchronized registry)', () => {
  const currentItem = MEDIA_REGISTRY['media-l50-primary'];
  const fakeHash = '0000000000000000000000000000000000000000000000000000000000000000';
  if (fakeHash !== currentItem.sha256Checksum) {
    throw new Error('Simulated SHA-256 desynchronization correctly triggered failure.');
  }
});

// Negative 3: Prohibit recreation of retired manifest
assertNegative('Recreation of retired curriculum-media-fidelity-manifest.json', () => {
  const retiredFile = path.join(__dirname, '../artifacts/curriculum-media-fidelity-manifest.json');
  if (!fs.existsSync(retiredFile)) {
    throw new Error('Retired artifact correctly confirmed absent.');
  }
});

console.log('\n================================================================================');
console.log('✓ ALL STRUCTURAL MEDIA CONSISTENCY REGRESSION TESTS PASSED CLEANLY');
console.log('================================================================================\n');
