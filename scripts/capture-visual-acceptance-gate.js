const path = require("path");
const fs = require("fs");
const { chromium } = require("@playwright/test");

const PORT = process.env.PORT || 3000;
const BASE_URL = `http://127.0.0.1:${PORT}`;

const VIEWPORTS = [
  { id: "01-homepage-4k-3840x2160", width: 3840, height: 2160 },
  { id: "02-homepage-qhd-2560x1440", width: 2560, height: 1440 },
  { id: "03-homepage-desktop-1920x1080", width: 1920, height: 1080 },
  { id: "04-homepage-laptop-1440x900", width: 1440, height: 900 },
  { id: "05-homepage-tablet-landscape-1024x768", width: 1024, height: 768 },
  { id: "06-homepage-tablet-portrait-768x1024", width: 768, height: 1024 },
  { id: "07-homepage-mobile-390x844", width: 390, height: 844, isMobile: true },
];

const SECTIONS = [
  { id: "08-section-hero", selector: "section:has(h1)", name: "1. Hero" },
  { id: "08b-section-feels-like", selector: "#feels-like", name: "2. What It Feels Like" },
  { id: "09-section-live-classroom", selector: "#live-classroom", name: "3. Real Classroom" },
  { id: "10-section-passport", selector: "#passport", name: "4. Passport" },
  { id: "11-section-storybook", selector: "#storybook", name: "5. Storybook Learning" },
  { id: "12-section-gallery-teaser", selector: "#gallery-teaser", name: "6. Gallery Teaser" },
  { id: "13-section-celebrations", selector: "#celebrations", name: "7. Celebrations" },
  { id: "14-section-teacher-sharon", selector: "#teacher-sharon", name: "8. Teacher Sharon" },
  { id: "15-section-parent-reflection", selector: "#reflection", name: "9. Parent Reflection" },
  { id: "16-section-inquiry-cta", selector: "#inquiry", name: "10. Final Inquiry CTA" },
];

async function capture() {
  const repoOutputDir = path.join(__dirname, "../artifacts/screenshots/visual-acceptance-gate");
  const brainOutputDir = path.join("C:/Users/hp/.gemini/antigravity-ide/brain/743fb3b4-a5bf-4bfd-805e-2669cdd70dc5/visual-acceptance-gate");

  [repoOutputDir, brainOutputDir].forEach((dir) => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  });

  console.log("================================================================================");
  console.log("WONDER JOURNEY — VISUAL ACCEPTANCE GATE SCREENSHOT CAPTURE");
  console.log(`Connecting to: ${BASE_URL}`);
  console.log(`Repo Output: ${repoOutputDir}`);
  console.log(`Brain Output: ${brainOutputDir}`);
  console.log("================================================================================\n");

  const browser = await chromium.launch({ headless: true });

  try {
    // 1. Capture 7 viewports (viewport and full-page)
    console.log("▶ Capturing 7 Required Viewports (Above-the-Fold + Full Page):");
    for (const vp of VIEWPORTS) {
      process.stdout.write(`  [${vp.width}x${vp.height}] ${vp.id}... `);
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        deviceScaleFactor: 1,
        isMobile: vp.isMobile || false,
      });

      const page = await context.newPage();
      await page.goto(BASE_URL, { waitUntil: "networkidle" });
      await page.waitForTimeout(1200);

      // Above the fold
      const vpFilename = `${vp.id}.png`;
      const vpPathRepo = path.join(repoOutputDir, vpFilename);
      const vpPathBrain = path.join(brainOutputDir, vpFilename);
      await page.screenshot({ path: vpPathRepo, fullPage: false });
      fs.copyFileSync(vpPathRepo, vpPathBrain);

      // Full page
      const fpFilename = `${vp.id}-fullpage.png`;
      const fpPathRepo = path.join(repoOutputDir, fpFilename);
      const fpPathBrain = path.join(brainOutputDir, fpFilename);
      await page.screenshot({ path: fpPathRepo, fullPage: true });
      fs.copyFileSync(fpPathRepo, fpPathBrain);

      console.log("✓ Saved viewport & fullpage");
      await context.close();
    }

    // 2. Focused sections on desktop (1440x900)
    console.log("\n▶ Capturing 9 Focused Sections:");
    const sectionContext = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 1,
    });
    const sectionPage = await sectionContext.newPage();
    await sectionPage.goto(BASE_URL, { waitUntil: "networkidle" });
    await sectionPage.waitForTimeout(1000);

    for (const sec of SECTIONS) {
      process.stdout.write(`  ${sec.name}... `);
      const el = sectionPage.locator(sec.selector);
      if ((await el.count()) > 0) {
        const filename = `${sec.id}.png`;
        const repoPath = path.join(repoOutputDir, filename);
        const brainPath = path.join(brainOutputDir, filename);
        await el.first().screenshot({ path: repoPath });
        fs.copyFileSync(repoPath, brainPath);
        console.log(`✓ Saved ${filename}`);
      } else {
        console.warn(`✗ Selector '${sec.selector}' not found`);
      }
    }
    await sectionContext.close();

    console.log("\n================================================================================");
    console.log("✓ ALL SCREENSHOTS SUCCESSFULLY CAPTURED!");
    console.log("================================================================================\n");
  } finally {
    await browser.close();
  }
}

capture().catch((err) => {
  console.error("Capture failed:", err);
  process.exit(1);
});
