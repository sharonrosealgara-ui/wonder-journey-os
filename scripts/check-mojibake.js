const fs = require('fs');
const path = require('path');

const SUSPICIOUS_PATTERNS = [
  'ðŸ', 'Ã', 'â€', 'â€™', 'â€œ', 'â€', 'â€“', 'â€”', 'â†', 'ï¸', 'Â'
];

function getFiles(dir, filesList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getFiles(fullPath, filesList);
    } else {
      if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx') || fullPath.endsWith('.json')) {
        filesList.push(fullPath);
      }
    }
  }
  return filesList;
}

const files = getFiles('src');
let totalHits = 0;
let fileHits = 0;

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  let hasHit = false;

  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Instead of checking all patterns separately and causing duplicates, check if line matches any
    let matchedPattern = null;
    for (const pattern of SUSPICIOUS_PATTERNS) {
      if (line.includes(pattern)) {
        matchedPattern = pattern;
        break;
      }
    }

    if (matchedPattern) {
        console.log(`[${file}:${i + 1}] SUSPICIOUS: ${matchedPattern}`);
        console.log(`  Line: ${line.trim()}`);

        // try to decode using the Buffer latin1 to utf8 trick as a proposed repair
        try {
          const matchRegex = new RegExp(`[\\x80-\\xFF]+`, 'g');
          const proposedLine = line.replace(matchRegex, (match) => {
             return Buffer.from(match, 'latin1').toString('utf8');
          });

          if (proposedLine !== line) {
             console.log(`  Proposed: ${proposedLine.trim()}`);
          }
        } catch(e) {}

        totalHits++;
        hasHit = true;
    }
  }

  if (hasHit) {
    fileHits++;
  }
}

console.log(`\nFound ${totalHits} suspicious occurrences across ${fileHits} files.`);
