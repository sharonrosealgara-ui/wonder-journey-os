const fs = require("fs");
let code = fs.readFileSync("src/components/adventure/slide-views.tsx", "utf8");

const replacements = {
  "â€”": "—",
  "ðŸ …": "🏆",
  "ðŸ‘¨â€ ðŸ‘©â€ ðŸ‘§â€ ðŸ‘¦": "👨‍👩‍👧‍👦",
  "ðŸŒ´": "🌴",
  "ðŸ§º": "🧽",
  "ðŸ‘£": "👣",
  "ðŸ‘©â€ ðŸ ³": "👩‍🍳",
  "ðŸ’­": "💭",
  "ðŸ“”âœ¨": "📓✨",
  "ðŸ“”": "📓",
  "ðŸ †": "🏆",
  "ðŸ“·": "📸",
  "ðŸŽ’âœ¨": "🎒✨",
  "ðŸ“¸": "📸",
  "ðŸŽ’": "🎒",
  "ðŸŒ…": "🌅",
  "ðŸ’¬": "💬",
  "ðŸ§ ": "🧠",
  "ðŸ›‚": "🛂",
  "ðŸ’›": "💛",
  "âœ…": "✅",
  "ðŸŽ¥": "🎥",
  "ðŸŽ®": "🎮",
  "â ±ï¸ ": "⏱️",
  "Â·": "·"
};

for (const [bad, good] of Object.entries(replacements)) {
  code = code.split(bad).join(good);
}

// Replace literal "??" and "???" with appropriate emojis in the new premium slides
code = code.replace(/{content.emoji \|\| "\?\?"}/g, `{content.emoji || "💡"}`);
code = code.replace(/<div className="mb-3 text-6xl">\?\?<\/div>/g, `<div className="mb-3 text-6xl">📌</div>`);
code = code.replace(/<div className="mb-3 text-6xl">{content\.type === "video" \? "\?\?" : "\?\?"}<\/div>/g, `<div className="mb-3 text-6xl">{content.type === "video" ? "🎬" : "🖼️"}</div>`);
code = code.replace(/className="font-hand text-xl text-ocean-deep">\?\? {content\.discussionPrompt}<\/p>/g, `className="font-hand text-xl text-ocean-deep">🗣️ {content.discussionPrompt}</p>`);
code = code.replace(/<div className="mb-3 text-6xl">\?\?\?<\/div>/g, `<div className="mb-3 text-6xl">💬</div>`);
code = code.replace(/<div className="mb-3 text-6xl">\?<\/div>/g, `<div className="mb-3 text-6xl">🎯</div>`);

fs.writeFileSync("src/components/adventure/slide-views.tsx", code, "utf8");
