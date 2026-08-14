
const fs = require("fs");
let file = fs.readFileSync("src/config/lessons-stage2.ts", "utf-8");

file = file.replace(/accessibilityNotes: "(.*)"/g, `accessibilityNotes: "$1",\n    subjectConnections: [],\n    progressBadge: "badge-id"`);

fs.writeFileSync("src/config/lessons-stage2.ts", file);
console.log("Added missing properties.");

