const fs = require('fs');

const replacements = {
  "ConnectingΓÇª ≡ƒîÉ": "Connecting… 🌐",
  "≡ƒƒí": "🟡",
  "≡ƒƒó": "🟢",
  "≡ƒö┤": "🔴",
  "≡ƒôí": "📡",
  "≡ƒô║": "📺",
  "≡ƒæÑ": "👥",
  "≡ƒæç": "👇",
  "ΓÇª": "…",
  "≡ƒæï": "👋"
};

const filePath = "src/app/(app)/classroom/page.tsx";
let content = fs.readFileSync(filePath, "utf8");

for (const [bad, good] of Object.entries(replacements)) {
  content = content.split(bad).join(good);
}

fs.writeFileSync(filePath, content, "utf8");
console.log("Replacements done.");
