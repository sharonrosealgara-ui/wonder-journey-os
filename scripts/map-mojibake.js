const fs = require('fs');
const content = fs.readFileSync('src/config/lessons.ts', 'utf8');

const mapping = {};

// We look for patterns of double-encoded UTF-8.
// A double-encoded UTF-8 string typically looks like 'Ã' followed by another char,
// or 'ðŸ' followed by 2 chars, or 'â€' followed by 1 char.

// Regex to find sequences of non-ASCII characters that look like mojibake.
const badPattern = /[\x80-\xFF]{2,4}/g;

const matches = content.match(badPattern) || [];

for (const m of matches) {
  // To reverse double encoding properly:
  // Convert the JS string characters (which were parsed as UTF-16 from the file's bytes)
  // back into their raw bytes, assuming they are in the Latin1 range (0-255).
  try {
    // If a character code is > 255, it's not a simple Windows-1252 / latin1 double-encoding,
    // it means it was parsed using a charset that mapped a byte to a high code point.
    // In many cases, it's mapped to the exact same code point in Unicode, or via Windows-1252.
    // Let's create a buffer of the raw bytes using 'binary'/'latin1' encoding.
    const buf = Buffer.from(m, 'binary');
    const decoded = buf.toString('utf8');

    // If the decoded string doesn't contain the replacement character (ufffd)
    // and looks like a valid character (emoji, em-dash, etc)
    if (!decoded.includes('\ufffd') && decoded !== m) {
       mapping[m] = decoded;
    } else {
       // if it failed, maybe we need to map Windows-1252 to bytes
       const bytes = Array.from(m).map(c => {
         const code = c.charCodeAt(0);
         // simple windows-1252 to byte conversion map for the control chars
         if (code === 0x20AC) return 0x80; // â€ => €
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
         if (code === 0x2019) return 0x92; // â€™
         if (code === 0x201C) return 0x93; // â€œ
         if (code === 0x201D) return 0x94; // â€
         if (code === 0x2022) return 0x95;
         if (code === 0x2013) return 0x96; // â€“
         if (code === 0x2014) return 0x97; // â€”
         if (code === 0x02DC) return 0x98;
         if (code === 0x2122) return 0x99;
         if (code === 0x0161) return 0x9A;
         if (code === 0x203A) return 0x9B;
         if (code === 0x0153) return 0x9C;
         if (code === 0x017E) return 0x9E;
         if (code === 0x0178) return 0x9F;
         return code & 0xFF;
       });

       const decodedWin = Buffer.from(bytes).toString('utf8');
       if (!decodedWin.includes('\ufffd') && decodedWin !== m) {
          mapping[m] = decodedWin;
       }
    }
  } catch(e) {}
}

console.log(JSON.stringify(mapping, null, 2));
