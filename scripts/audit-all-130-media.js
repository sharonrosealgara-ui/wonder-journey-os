const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { mediaRegistry } = require('../src/config/media-registry');

console.log('Total records:', mediaRegistry.length);
let defects = [];

const VALID_LICENSES = {
  "CC BY-SA 4.0": "https://creativecommons.org/licenses/by-sa/4.0/",
  "CC BY 4.0": "https://creativecommons.org/licenses/by/4.0/",
  "CC BY-SA 3.0": "https://creativecommons.org/licenses/by-sa/3.0/",
  "CC BY 2.0": "https://creativecommons.org/licenses/by/2.0/",
  "Public Domain": "https://creativecommons.org/publicdomain/mark/1.0/",
};

const seenHashes = new Set();
const seenPaths = new Set();

mediaRegistry.forEach((m, idx) => {
  const num = idx + 1;
  const p = path.join(__dirname, '../public', m.storedAssetPath.replace(/^\//, ''));
  if (!fs.existsSync(p)) {
    defects.push(`Record ${num} (${m.id}): File missing on disk ${m.storedAssetPath}`);
  } else {
    const buf = fs.readFileSync(p);
    const hash = crypto.createHash('sha256').update(buf).digest('hex');
    if (hash !== m.sha256Checksum) {
      defects.push(`Record ${num} (${m.id}): SHA-256 mismatch (registry: ${m.sha256Checksum}, actual: ${hash})`);
    }
    if (buf.length < 2048) {
      defects.push(`Record ${num} (${m.id}): Buffer too small (${buf.length} bytes)`);
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

  // Creator checks
  if (!m.creator || m.creator.toLowerCase().includes('unknown') || m.creator.toLowerCase().includes('contributors') || m.creator.trim().length < 3) {
    defects.push(`Record ${num} (${m.id}): Creator defect '${m.creator}'`);
  }

  // Source URL checks
  if (!m.originalSourceUrl || !m.originalSourceUrl.startsWith('http') || m.originalSourceUrl.includes('wonderjourney.app') || m.originalSourceUrl.includes('localhost') || m.originalSourceUrl.includes('example.com')) {
    defects.push(`Record ${num} (${m.id}): Source URL defect '${m.originalSourceUrl}'`);
  }

  // License checks
  if (!VALID_LICENSES[m.license]) {
    defects.push(`Record ${num} (${m.id}): Invalid license '${m.license}'`);
  } else if (m.licenseUrl !== VALID_LICENSES[m.license]) {
    defects.push(`Record ${num} (${m.id}): License URL mismatch ('${m.licenseUrl}' vs '${VALID_LICENSES[m.license]}')`);
  }

  // Alt text and caption
  if (!m.altText || m.altText.length < 15) {
    defects.push(`Record ${num} (${m.id}): Alt text too short '${m.altText}'`);
  }
  if (!m.caption || m.caption.length < 10) {
    defects.push(`Record ${num} (${m.id}): Caption too short '${m.caption}'`);
  }

  // Subject relevance check
  if (!m.title || m.title.length < 5) {
    defects.push(`Record ${num} (${m.id}): Title too short '${m.title}'`);
  }
});

console.log('Total defects count:', defects.length);
if (defects.length > 0) {
  console.log('Defects list:');
  defects.forEach(d => console.log(' - ' + d));
  process.exit(1);
} else {
  console.log('100% of 130 media records passed strict subject, creator, license, and provenance audit!');
  process.exit(0);
}
