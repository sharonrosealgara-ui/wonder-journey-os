
const fs = require("fs");
let code = fs.readFileSync("src/config/lessons-stage2.ts", "utf8");

// The original file is full of ?? due to mojibake from Set-Content.
code = code.replace(/\"emoji\": \"\?\?\"/g, \"\\\"emoji\\\": \\\"\\u{1F30D}\\\"\"); // Earth globe
code = code.replace(/\"emoji\": \"\?\?\?\"/g, \"\\\"emoji\\\": \\\"\\u{1F5FA}\\u{FE0F}\\\"\"); // Map

// Let us specifically target the 3rd and 4th etc
code = code.replace(/\"heading\": \"Our Neighborhood: Southeast Asia\",\s*\"emoji\": \"\\u{1F5FA}\\u{FE0F}\"/, \"\\\"heading\\\": \\\"Our Neighborhood: Southeast Asia\\\",\\n        \\\"emoji\\\": \\\"\\u{1F91D}\\\"\"); // Handshake
code = code.replace(/\"heading\": \"A Preview of Our Archipelago\",\s*\"emoji\": \"\\u{1F5FA}\\u{FE0F}\"/, \"\\\"heading\\\": \\\"A Preview of Our Archipelago\\\",\\n        \\\"emoji\\\": \\\"\\u{1F3DD}\\u{FE0F}\\\"\"); // Island
code = code.replace(/\"heading\": \"A Restless Earth\",\s*\"emoji\": \"\\u{1F30D}\"/, \"\\\"heading\\\": \\\"A Restless Earth\\\",\\n        \\\"emoji\\\": \\\"\\u{1F30B}\\\"\"); // Volcano

code = code.replace(/seasonswet and drythough/, "seasons—wet and dry—though");

fs.writeFileSync("src/config/lessons-stage2.ts", code, "utf8");
console.log("Emojis fixed.");

