const fs = require("fs");
let code = fs.readFileSync("src/components/adventure/slide-views.tsx", "utf8");

const replacements = {
  "ðŸŒº": "🌺",
  "ðŸ—ºï¸ ": "🗺️",
  "ðŸŽ“": "🎓",
  "ðŸ“–": "📖",
  "ðŸŒ»": "🌻",
  "ðŸŒ±": "🌱",
  "ðŸ•Šï¸ ": "🕊️",
  "ðŸŒŸ": "🌟",
  "ðŸŽ¯": "🎯",
  "ðŸ§­": "🧭",
  "ðŸ¥„": "🥥",
  "ðŸ¦…": "🦅",
  "ðŸ ”ï¸ ": "🏔️",
  "ðŸ‡µðŸ‡­": "🇵🇭",
  "ðŸ—£ï¸ ": "🗣️",
  "ðŸ”Š": "🔊",
  "ðŸŽ¬": "🎬",
  "ðŸ“´": "📼",
  "ðŸŽ¨": "🎨",
  "ðŸ” ": "🔍",
  "ðŸƒ ": "🃏",
  "ðŸ”¤": "🔠",
  "â† ": "←"
};

for (const [bad, good] of Object.entries(replacements)) {
  code = code.split(bad).join(good);
}

fs.writeFileSync("src/components/adventure/slide-views.tsx", code, "utf8");
