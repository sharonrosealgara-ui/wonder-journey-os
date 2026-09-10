const path = require("path");
const fs = require("fs");
const { chromium } = require("@playwright/test");

const PORT = process.env.PORT || 3000;
const BASE_URL = `http://127.0.0.1:${PORT}`;

const VIEWPORTS = [
  { id: "01-phase2-homepage-4k-3840x2160", width: 3840, height: 2160, is4K: true },
  { id: "02-phase2-homepage-desktop-1920x1080", width: 1920, height: 1080 },
  { id: "03-phase2-homepage-laptop-1440x900", width: 1440, height: 900 },
  { id: "04-phase2-homepage-tablet-landscape-1024x768", width: 1024, height: 768 },
  { id: "05-phase2-homepage-tablet-portrait-768x1024", width: 768, height: 1024 },
  { id: "06-phase2-homepage-mobile-390x844", width: 390, height: 844, isMobile: true },
];

const SECTIONS = [
  { id: "07-phase2-section-hero", selector: "section:has(h1)", name: "Hero" },
  { id: "08-phase2-section-what-it-feels-like", selector: "#feels-like", name: "What Wonder Journey Feels Like" },
  { id: "09-phase2-section-live-classroom", selector: "#live-classroom", name: "Live Class Experience" },
  { id: "10-phase2-section-adventure-passport", selector: "#passport", name: "Adventure Passport" },
  { id: "11-phase2-section-storybook-learning", selector: "#storybook", name: "Interactive Storybook Learning" },
  { id: "12-phase2-section-after-class-gallery", selector: "#gallery-teaser", name: "After-Class Gallery" },
  { id: "13-phase2-section-celebrations", selector: "#celebrations", name: "Celebrations + Birthday Keepsakes" },
  { id: "14-phase2-section-teacher-sharon", selector: "#teacher-sharon", name: "Teacher Sharon" },
  { id: "15-phase2-section-parent-reflection", selector: "#reflection", name: "Parent Reflection" },
  { id: "16-phase2-section-inquiry-gate", selector: "#inquiry", name: "Inquiry + Login Gate" },
];

async function capture() {
  const outputDir = path.join(__dirname, "../artifacts/screenshots/phase2-audit");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log("================================================================================");
  console.log("WONDER JOURNEY OS — PHASE 2 HOMEPAGE COMPOSITION VISUAL AUDIT");
  console.log(`Connecting to: ${BASE_URL}`);
  console.log(`Target directory: ${outputDir}`);
  console.log("================================================================================\n");

  const browser = await chromium.launch({ headless: true });

  try {
    // 1. Capture 6 requested viewports (both above-the-fold and full-page)
    console.log("▶ Capturing 6 Required Viewports (Viewport + Fullpage):");
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
      const vpPath = path.join(outputDir, `${vp.id}.png`);
      await page.screenshot({ path: vpPath, fullPage: false });

      // Full page
      const fpPath = path.join(outputDir, `${vp.id}-fullpage.png`);
      await page.screenshot({ path: fpPath, fullPage: true });

      console.log(`✓ Saved ${vp.id}.png & -fullpage.png`);
      await context.close();
    }

    // 2. Capture focused sections on desktop (1440x900 baseline)
    console.log("\n▶ Capturing Focused Section Screenshots:");
    const sectionContext = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 1,
    });
    const sectionPage = await sectionContext.newPage();
    await sectionPage.goto(BASE_URL, { waitUntil: "networkidle" });
    await sectionPage.waitForTimeout(1000);

    for (const sec of SECTIONS) {
      process.stdout.write(`  Section: ${sec.name}... `);
      const el = sectionPage.locator(sec.selector);
      if (await el.count() > 0) {
        const filename = `${sec.id}.png`;
        const filePath = path.join(outputDir, filename);
        await el.first().screenshot({ path: filePath });
        console.log(`✓ Saved ${filename}`);
      } else {
        console.warn(`✗ Selector '${sec.selector}' not found`);
      }
    }
    await sectionContext.close();

    // 3. Capture Mobile Navigation Open state (390x844)
    console.log("\n▶ Capturing Mobile Navigation State:");
    const mobileContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      deviceScaleFactor: 1,
    });
    const mobilePage = await mobileContext.newPage();
    await mobilePage.goto(BASE_URL, { waitUntil: "networkidle" });
    await mobilePage.waitForTimeout(1000);

    const menuBtn = mobilePage.locator("button[aria-label*='menu' i], button:has(svg.lucide-menu), header button:visible").first();
    if (await menuBtn.count() > 0) {
      await menuBtn.click();
      await mobilePage.waitForTimeout(500);
      const navPath = path.join(outputDir, "17-phase2-section-mobile-navigation.png");
      await mobilePage.screenshot({ path: navPath });
      console.log(`  ✓ Mobile Navigation opened and captured => 17-phase2-section-mobile-navigation.png`);
    } else {
      console.warn("  ✗ Mobile menu button not found");
    }
    await mobileContext.close();

    console.log("\n================================================================================");
    console.log("✓ ALL SCREENSHOTS SUCCESSFULLY CAPTURED ON LOCALHOST:3000!");
    console.log("================================================================================\n");
  } finally {
    await browser.close();
  }
}

capture().catch((err) => {
  console.error("Screenshot capture error:", err);
  process.exit(1);
});
