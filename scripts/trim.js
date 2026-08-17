
const fs = require("fs");
let code = fs.readFileSync("scripts/validate-premium-august.js", "utf8");
code = code.split("\n").map(line => line.trimEnd()).join("\n").trim() + "\n";
fs.writeFileSync("scripts/validate-premium-august.js", code, "utf8");

