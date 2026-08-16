const fs = require('fs');
const path = require('path');

const suspiciousPatterns = [
  /\uFFFD/, /�/, /\?\? The Premium Journey/, /\?\? Explorer/, /\?\? Adventure/, /\?\? Trailblazer/, /\?\?\?/,

  /ðŸ/, /Ã/, /â€/, /â€™/, /â€œ/, /â€ /, /â€“/, /â€”/, /â†/, /ï¸/, /Â/,
  /ΓÇ/, /Γö/, /≡ƒ/, /Γ£/, /Γé/, /Γä/
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
  process.exit(0);
}
