const fs = require("fs");
const path = require("path");

const file = path.join(__dirname, "../src/config/media-registry.ts");
let content = fs.readFileSync(file, "utf8");

content = content.replaceAll('"classification": "authoritative map"', '"classification": "authoritative_map"');
content = content.replaceAll('"classification": "historical artwork"', '"classification": "historical_artwork"');
content = content.replaceAll('"classification": "original diagram"', '"classification": "original_diagram"');
content = content.replaceAll('"classification": "museum artifact"', '"classification": "museum_artifact"');
content = content.replaceAll('"classification": "primary source scan"', '"classification": "primary_source_scan"');

if (!content.includes("export function getMedia(")) {
  content = content.replace("export function getMediaById(", "export function getMedia(id: string): FactualMedia | undefined { return getMediaById(id); }\n\nexport function getMediaById(");
}

fs.writeFileSync(file, content, "utf8");
console.log("Fixed media-registry.ts!");
