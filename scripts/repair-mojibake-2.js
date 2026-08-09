const fs = require('fs');

const MOJIBAKE_MAP = {
  // Punctuation
  'â€”': '—',
  'â€“': '–',
  'â€™': '’',
  'â€˜': '‘',
  'â€œ': '“',
  'â€\u009d': '”',
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

  // Some explicit overrides
  'ï¸ ': '️',
  'â­ ': '⭐'
};

function getFiles(dir, filesList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = dir + '/' + file;
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

  // Replace using explicit map
  for (const [bad, good] of Object.entries(MOJIBAKE_MAP)) {
    const parts = newContent.split(bad);
    if (parts.length > 1) {
       fileReplacements += (parts.length - 1);
       newContent = parts.join(good);
    }
  }

  // Regex to match ANY corrupted emoji starting with ðŸ and followed by 2 to 10 characters
  // that can be decoded using the Windows-1252 hack.
  // Actually, we'll just match `ðŸ` followed by 2 characters for a standard emoji,
  // or `ðŸ` followed by 6 for sequence emojis (e.g., ZWJ).
  // A standard 4-byte emoji is `ð` + 3 chars. Wait, `ð` (1 byte) + 3 chars = 4 chars total.
  // `ðŸŒ…` is 4 chars long!

  // So we match `ð` followed by at least 3 characters that are typical mojibake characters.
  const emojiRegex = /ð[\u0080-\uFFFF]{3,15}/g;

  newContent = newContent.replace(emojiRegex, (match) => {
    try {
      // we only want to decode the part that corresponds to a valid UTF-8 sequence
      // so we iterate over the characters, trying to decode the longest possible sequence
      for(let len = match.length; len >= 4; len -= 1) {
          const subMatch = match.substring(0, len);
          const bytes = Array.from(subMatch).map(c => {
             const code = c.charCodeAt(0);
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
             if (code <= 0xFF) return code;
             return null;
          });

          if (bytes.includes(null)) continue;

          const decoded = Buffer.from(bytes).toString('utf8');
          if (!decoded.includes('\ufffd')) {
             fileReplacements++;
             return decoded + match.substring(len); // keep any trailing chars
          }
      }
    } catch(e) {}
    return match;
  });

  // some specific cleanups
  newContent = newContent.replace(/â€\?/g, '”');

  if (newContent !== content) {
    fs.writeFileSync(file, newContent, 'utf8');
    filesModified++;
    totalReplacements += fileReplacements;
    console.log(`Fixed additional occurrences in ${file}`);
  }
}

console.log(`\nCompleted. Repaired additional occurrences across ${filesModified} files.`);
