const path = require("path");
const fs = require("fs");
const { chromium } = require("@playwright/test");

const PORT = process.env.PORT || 3000;
const BASE_URL = `http://127.0.0.1:${PORT}`;

async function capture() {
  const outputDir = path.join(__dirname, "../artifacts/screenshots/wave-a");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log("================================================================================");
  console.log("WONDER JOURNEY OS — WAVE A VISUAL RESET SCREENSHOT CAPTURE");
  console.log(`Connecting to: ${BASE_URL}`);
  console.log(`Output directory: ${outputDir}`);
  console.log("================================================================================\n");
  
  const browser = await chromium.launch({ headless: true });

  try {
    // 1. HOME 4K (3840x2160)
    console.log("▶ Capturing Home 4K (3840x2160)...");
    const ctx4k = await browser.newContext({ viewport: { width: 3840, height: 2160 } });
    const page4k = await ctx4k.newPage();
    await page4k.goto(BASE_URL, { waitUntil: "networkidle" });
    await page4k.waitForTimeout(2000);
    await page4k.screenshot({ path: path.join(outputDir, "01-home-3840x2160-viewport.png"), fullPage: false });
    await page4k.screenshot({ path: path.join(outputDir, "01-home-3840x2160-fullpage.png"), fullPage: true });
    await ctx4k.close();
    console.log("  ✓ 4K Home captured");

    // 2. HOME Desktop (1920x1080)
    console.log("▶ Capturing Home Desktop (1920x1080)...");
    const ctxDesktop = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
    const pageDesktop = await ctxDesktop.newPage();
    await pageDesktop.goto(BASE_URL, { waitUntil: "networkidle" });
    await pageDesktop.waitForTimeout(1500);
    await pageDesktop.screenshot({ path: path.join(outputDir, "02-home-1920x1080-fullpage.png"), fullPage: true });

    // Close-ups on Home Desktop
    const heroEl = await pageDesktop.$("section:has(h1)");
    if (heroEl) {
      await heroEl.screenshot({ path: path.join(outputDir, "04-home-hero-closeup.png") });
      console.log("  ✓ Home Hero close-up captured");
    }

    const passportEl = await pageDesktop.$("#passport");
    if (passportEl) {
      await passportEl.screenshot({ path: path.join(outputDir, "05-home-adventure-passport-closeup.png") });
      console.log("  ✓ Home Adventure Passport close-up captured");
    }

    const liveClassEl = await pageDesktop.$("#live-classroom");
    if (liveClassEl) {
      await liveClassEl.screenshot({ path: path.join(outputDir, "06-home-live-classroom-closeup.png") });
      console.log("  ✓ Home Live Classroom close-up captured");
    }
    await ctxDesktop.close();
    console.log("  ✓ Desktop Home captured");

    // 3. HOME Mobile (390x844)
    console.log("▶ Capturing Home Mobile (390x844)...");
    const ctxMobile = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true });
    const pageMobile = await ctxMobile.newPage();
    await pageMobile.goto(BASE_URL, { waitUntil: "networkidle" });
    await pageMobile.waitForTimeout(1500);
    await pageMobile.screenshot({ path: path.join(outputDir, "03-home-390x844-fullpage.png"), fullPage: true });
    await ctxMobile.close();
    console.log("  ✓ Mobile Home captured");

    // 4. EXPERIENCE (1920x1080)
    console.log("▶ Capturing Experience (1920x1080)...");
    const ctxExp = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
    const pageExp = await ctxExp.newPage();
    await pageExp.goto(`${BASE_URL}/experience`, { waitUntil: "networkidle" });
    await pageExp.waitForTimeout(1500);
    await pageExp.screenshot({ path: path.join(outputDir, "07-experience-1920x1080-fullpage.png"), fullPage: true });

    const trailEl = await pageExp.$("#expedition-trail");
    if (trailEl) {
      await trailEl.screenshot({ path: path.join(outputDir, "08-experience-journey-rhythm-closeup.png") });
      console.log("  ✓ Experience Expedition Trail close-up captured");
    }
    await ctxExp.close();
    console.log("  ✓ Experience captured");

    // 5. GALLERY (1920x1080)
    console.log("▶ Capturing Gallery (1920x1080)...");
    const ctxGal = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
    const pageGal = await ctxGal.newPage();
    await pageGal.goto(`${BASE_URL}/gallery`, { waitUntil: "networkidle" });
    await pageGal.waitForTimeout(1500);
    await pageGal.screenshot({ path: path.join(outputDir, "09-gallery-1920x1080-fullpage.png"), fullPage: true });

    const kitchenEl = await pageGal.$("#kitchen-cluster");
    if (kitchenEl) {
      await kitchenEl.screenshot({ path: path.join(outputDir, "10-gallery-scrapbook-kitchen-closeup.png") });
      console.log("  ✓ Gallery Kitchen Cluster close-up captured");
    }
    await ctxGal.close();
    console.log("  ✓ Gallery captured");

    console.log("\n================================================================================");
    console.log("ALL WAVE A VISUAL AUDIT CAPTURES COMPLETED SUCCESSFULLY!");
    console.log("================================================================================\n");

  } finally {
    await browser.close();
  }
}

capture().catch((err) => {
  console.error("Screenshot error:", err);
  process.exit(1);
});
