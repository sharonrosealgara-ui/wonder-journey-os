const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const screenshotsDir = path.join(__dirname, "../artifacts/screenshots");
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

console.log("================================================================================");
console.log("WONDER JOURNEY OS — VISUAL PROOF & MULTI-VIEWPORT SCREENSHOT CAPTURE");
console.log("================================================================================\n");

const contactSheetPath = path.join(__dirname, "../public/media-contact-sheet.html");
const contactSheetUrl = `file:///${contactSheetPath.replace(/\\/g, "/")}`;

const viewports = [
  { name: "mobile-390x844", width: 390, height: 844 },
  { name: "tablet-768x1024", width: 768, height: 1024 },
  { name: "laptop-1366x768", width: 1366, height: 768 },
  { name: "laptop-1440x900", width: 1440, height: 900 },
  { name: "desktop-1920x1080", width: 1920, height: 1080 },
];

const captured = [];

for (const vp of viewports) {
  const outFileName = `contact-sheet-${vp.name}.png`;
  const outFilePath = path.join(screenshotsDir, outFileName);

  const cmd = `"${edgePath}" --headless --disable-gpu --hide-scrollbars --window-size=${vp.width},${vp.height} --screenshot="${outFilePath}" "${contactSheetUrl}"`;
  try {
    execSync(cmd, { stdio: "pipe" });
    if (fs.existsSync(outFilePath)) {
      const stats = fs.statSync(outFilePath);
      console.log(`✓ Captured ${vp.name} (${vp.width}x${vp.height}) -> ${outFileName} [${(stats.size / 1024).toFixed(1)} KB]`);
      captured.push({
        name: vp.name,
        width: vp.width,
        height: vp.height,
        path: outFilePath,
        sizeBytes: stats.size,
      });
    }
  } catch (err) {
    console.error(`✗ Failed to capture ${vp.name}:`, err.message);
  }
}

console.log("\n--------------------------------------------------------------------------------");
console.log(`TOTAL SCREENSHOTS CAPTURED: ${captured.length} / ${viewports.length}`);
console.log("Screenshots saved to: artifacts/screenshots/");
console.log("--------------------------------------------------------------------------------\n");

if (captured.length !== viewports.length) {
  console.error("FAIL: Not all viewports were captured.");
  process.exit(1);
}

console.log("PASS: Multi-viewport visual proof generated successfully!\n");
process.exit(0);
