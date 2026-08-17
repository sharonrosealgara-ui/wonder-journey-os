const fs = require('fs');
const path = require('path');

const suspiciousPatterns = [
  /\uFFFD/, // Replacement character
  /\u00E2\u201D/, // box drawing mojibake (â”)
  /\u00E2\u2022/, // box drawing double lines mojibake (â•)
  /\u00E2\u02DC/, // star/symbol mojibake (â˜)
  /\u00E2\u2026/, // fraction mojibake (â…)
  /\u00E2\u00AD/, // star mojibake (â­)
  /\u00E2\u20AC/, // quote/dash mojibake (â€)
  /\u00C3[\u0080-\u00BF]/, // UTF-8 misinterpreted as latin1 (Ã...)
  /\u00C2[\u0080-\u00BF]/, // UTF-8 misinterpreted as latin1 (Â...)
  /\?\? The Premium Journey/,
  /\?\? Explorer/,
  /\?\? Adventure/,
  /\?\? Trailblazer/
];

let filesScanned = 0;
let filesWithHits = 0;
let totalHits = 0;

function scanDirectory(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      scanDirectory(fullPath);
    } else if (stat.isFile()) {
      if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx') || fullPath.endsWith('.json')) {
        filesScanned++;
        const content = fs.readFileSync(fullPath, 'utf8');
        let fileHasHit = false;

        const lines = content.split('\n');
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          for (const pattern of suspiciousPatterns) {
            if (pattern.test(line)) {
              totalHits++;
              fileHasHit = true;
              console.log(`[HIT] ${fullPath}:${i + 1} -> ${line.trim()}`);
              break;
            }
          }
        }

        if (fileHasHit) {
          filesWithHits++;
        }
      }
    }
  }
}

scanDirectory(path.join(process.cwd(), 'src'));

console.log('---');
console.log(`Files scanned: ${filesScanned}`);
console.log(`Files containing hits: ${filesWithHits}`);
console.log(`Total hits: ${totalHits}`);

if (totalHits > 0) {
  process.exit(1);
} else {
  console.log('All source files clean! 0 mojibake hits.');
  process.exit(0);
}
