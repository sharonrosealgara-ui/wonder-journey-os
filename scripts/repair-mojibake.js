const fs = require('fs');
const path = require('path');

const MOJIBAKE_MAP = {
  // Punctuation
  'â€”': '—',
  'â€“': '–',
  'â€™': '’',
  'â€˜': '‘',
  'â€œ': '“',
  'â€\u009d': '”', // right double quote (often just seen as â€ followed by space or end)
  'â€¦': '…',
  'Â·': '·',
  'Â½': '½',
  'Â°': '°',
  'Ã²': 'ò',
  'Ã¡': 'á',
  'Ã©': 'é',
  'Ã­': 'í',
  'Ã³': 'ó',
  'Ãº': 'ú',
  'Ã±': 'ñ',

  // Emojis (double encoded)
  // These sequences were double-encoded UTF-8.
  'ðŸŒŽ': '🌎',
  'ðŸŽ¯': '🎯',
  'ðŸ’¡': '💡',
  'ðŸŒ±': '🌱',
  'ðŸš€': '🚀',
  'ðŸŒŸ': '🌟',
  'ðŸ’¬': '💬',
  'ðŸ›‘': '🛑',
  'ðŸŒŠ': '🌊',
  'ðŸ§³': '🧳',
  'ðŸ“–': '📖',
  'ðŸŽ¨': '🎨',
  'ðŸ¥˜': '🥘',
  'ðŸ‘¥': '👥',
  'ðŸ§©': '🧩',
  'ðŸŽ¶': '🎶',
  'ðŸ‘€': '👀',
  'â­ ': '⭐',
  'ï¸ ': '️', // variation selector 16

  // Handling cases where â€ was followed by something else that didn't parse properly
  'â€?': '”', // literal '?' replacing bad char in previous output
};

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
let totalReplacements = 0;
let filesModified = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content;

  let fileReplacements = 0;

  for (const [bad, good] of Object.entries(MOJIBAKE_MAP)) {
    // global replacement
    const parts = newContent.split(bad);
    if (parts.length > 1) {
       fileReplacements += (parts.length - 1);
       newContent = parts.join(good);
    }
  }

  // Also replace a very specific pattern that happens due to bad char mapping:
  // "â€ " (followed by space or punctuation or closing quote)
  // Actually, we should just let the map handle it if possible.

  // To handle unknown double-encoded emojis starting with ðŸ:
  const emojiRegex = /ðŸ[\x80-\xFF]{2}/g;
  newContent = newContent.replace(emojiRegex, (match) => {
    try {
      const bytes = Array.from(match).map(c => {
         const code = c.charCodeAt(0);
         // windows-1252 map for some control chars if present
         if (code === 0x20AC) return 0x80;
         if (code === 0x201A) return 0x82;
         if (code === 0x0192) return 0x83;
         if (code === 0x201E) return 0x84;
         if (code === 0x2026) return 0x85;
         if (code === 0x2020) return 0x86;
         if (code === 0x2021) return 0x87;
         if (code === 0x02C6) return 0x88;
         if (code === 0x2030) return 0x89;
         if (code === 0x0160) return 0x8A;
         if (code === 0x2039) return 0x8B;
         if (code === 0x0152) return 0x8C;
         if (code === 0x017D) return 0x8E;
         if (code === 0x2018) return 0x91;
         if (code === 0x2019) return 0x92;
         if (code === 0x201C) return 0x93;
         if (code === 0x201D) return 0x94;
         if (code === 0x2022) return 0x95;
         if (code === 0x2013) return 0x96;
         if (code === 0x2014) return 0x97;
         if (code === 0x02DC) return 0x98;
         if (code === 0x2122) return 0x99;
         if (code === 0x0161) return 0x9A;
         if (code === 0x203A) return 0x9B;
         if (code === 0x0153) return 0x9C;
         if (code === 0x017E) return 0x9E;
         if (code === 0x0178) return 0x9F;
         return code & 0xFF;
      });
      const decoded = Buffer.from(bytes).toString('utf8');
      if (!decoded.includes('\ufffd') && decoded !== match) {
         fileReplacements++;
         return decoded;
      }
    } catch(e) {}
    return match;
  });

  if (newContent !== content) {
    fs.writeFileSync(file, newContent, 'utf8');
    filesModified++;
    totalReplacements += fileReplacements;
    console.log(`Fixed ${fileReplacements} occurrences in ${file}`);
  }
}

console.log(`\nCompleted. Repaired ${totalReplacements} occurrences across ${filesModified} files.`);
