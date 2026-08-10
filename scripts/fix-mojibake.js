const fs = require('fs');

const replacements = {
  "≡ƒÄÑ": "🎥",
  "ΓÇö": "—",
  "≡ƒÆ¢": "💙",
  "ΓöÇ": "─",
  "≡ƒô╖": "📷",
  "≡ƒûÑ∩╕Å": "🖥️",
  "Γ£Å∩╕Å": "✏️",
  "Γ£ï": "✋",
  "≡ƒÆ¼": "💬",
  "≡ƒÅü": "🏁",
  "≡ƒô₧": "📞",
  "≡ƒîà": "🌅",
  "≡ƒºá": "🧠",
  "≡ƒ¢é": "🛂",
  "≡ƒôö": "📔",
  "≡ƒöä": "🔄",
  "≡ƒöç": "🔇",
  "≡ƒ¢í∩╕Å": "🛡️",
  "Γ£¿": "✨",
  "≡ƒÜÇ": "🚀",
  "≡ƒî┤": "🌴",
  "≡ƒÄ¼": "🎬",
  "≡ƒæ¿ΓÇì≡ƒæ⌐ΓÇì≡ƒæºΓÇì≡ƒæª": "👨‍👩‍👧‍👦",
  "≡ƒæ⌐ΓÇì≡ƒÅ½": "👩‍🏫",
  "≡ƒÄñ": "🎤",
  "≡ƒ¢╢": "🛶",
  "&apos;": "'"
};

const filePath = "src/app/(app)/classroom/page.tsx";
let content = fs.readFileSync(filePath, "utf8");

for (const [bad, good] of Object.entries(replacements)) {
  content = content.split(bad).join(good);
}

fs.writeFileSync(filePath, content, "utf8");
console.log("Replacements done.");
