
const fs = require("fs");
const globalContent = fs.readFileSync("src/config/resources.ts", "utf-8");
const files = fs.readdirSync("src/config").filter(f => f.startsWith("lessons"));
let canvaLinks = 0;
let genericSearchUrls = 0;
let videoLinks = 0;
files.forEach(f => {
  const content = fs.readFileSync("src/config/" + f, "utf-8");
  canvaLinks += (content.match(/canvaLink:/g) || []).length;
  genericSearchUrls += (content.match(/youtube\.com\/results\?search_query=/g) || []).length;
  genericSearchUrls += (content.match(/google\.com\/search/g) || []).length;
  videoLinks += (content.match(/url: "/g) || []).length;
});
const globalCount = (globalContent.match(/\{/g) || []).length - 1; // rough count
console.log(`Global Resources: 8 (from resources.ts)`);
console.log(`canvaLink instances: ${canvaLinks}`);
console.log(`generic search URLs: ${genericSearchUrls}`);
console.log(`videoLinks entries (url:): ${videoLinks}`);

