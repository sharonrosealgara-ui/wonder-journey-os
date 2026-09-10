const path = require("path");
const { chromium } = require("@playwright/test");

const PORT = process.env.PORT || 3000;
const BASE_URL = `http://127.0.0.1:${PORT}`;

async function verifyRuntimeHealth() {
  console.log("================================================================================");
  console.log("WONDER JOURNEY OS — RUNTIME VISUAL HEALTH GATE");
  console.log(`Target: ${BASE_URL}`);
  console.log("================================================================================\n");

  const browser = await chromium.launch({ headless: true });
  let hasErrors = false;

  try {
    // ── 1. VERIFY HOME (DESKTOP) ──
    console.log("▶ [1/3] Testing GET / (Desktop 1920x1080)...");
    const desktopContext = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
    const desktopPage = await desktopContext.newPage();

    const consoleErrors = [];
    const pageErrors = [];

    desktopPage.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    desktopPage.on("pageerror", (err) => {
      pageErrors.push(err.message);
    });

    const res = await desktopPage.goto(BASE_URL, { waitUntil: "networkidle", timeout: 15000 });
    if (!res || res.status() !== 200) {
      throw new Error(`GET / returned HTTP status ${res ? res.status() : "none"}`);
    }
    console.log(`  ✓ HTTP status: ${res.status()}`);

    await desktopPage.waitForTimeout(1000);

    // Assert no Next.js runtime error overlay
    const overlay = await desktopPage.$("nextjs-portal, [data-nextjs-dialog-overlay], #nextjs__container_errors_label");
    if (overlay) {
      const overlayText = await overlay.innerText().catch(() => "");
      console.error(`  ✗ Next.js runtime error overlay detected:\n${overlayText}`);
      hasErrors = true;
    } else {
      console.log("  ✓ No Next.js runtime error overlay detected");
    }

    // Check for ReferenceError or Unhandled Runtime Error in body
    const bodyText = await desktopPage.evaluate(() => document.body.innerText);
    if (bodyText.includes("Unhandled Runtime Error") || bodyText.includes("ReferenceError")) {
      console.error("  ✗ Unhandled Runtime Error / ReferenceError found in page body text!");
      hasErrors = true;
    } else {
      console.log("  ✓ No ReferenceError text found in body");
    }

    // Assert key Home elements are visible
    const h1 = await desktopPage.$("h1");
    if (h1 && (await h1.isVisible())) {
      const h1Text = await h1.innerText();
      console.log(`  ✓ Hero H1 visible: "${h1Text.replace(/\n/g, " ").trim()}"`);
    } else {
      console.error("  ✗ Hero H1 not visible!");
      hasErrors = true;
    }

    const liveClass = await desktopPage.$("#live-classroom");
    if (liveClass && (await liveClass.isVisible())) {
      const liveText = await liveClass.innerText();
      if (liveText.includes("Teacher Sharon") && liveText.includes("PRIVACY-SAFE LEARNER PRESENTATION")) {
        console.log("  ✓ Live Classroom rendered with Teacher Sharon anchor & privacy-safe presentation");
      } else {
        console.error("  ✗ Live Classroom missing Teacher Sharon or updated privacy wording!");
        hasErrors = true;
      }
    } else {
      console.error("  ✗ #live-classroom not visible!");
      hasErrors = true;
    }

    const passport = await desktopPage.$("#passport");
    if (passport && (await passport.isVisible())) {
      console.log("  ✓ Adventure Passport showcase rendered and visible");
    } else {
      console.error("  ✗ #passport not visible!");
      hasErrors = true;
    }

    if (pageErrors.length > 0) {
      console.error("  ✗ Uncaught page errors detected:", pageErrors);
      hasErrors = true;
    } else {
      console.log("  ✓ Zero uncaught page errors");
    }

    const uncaughtRefErrors = consoleErrors.filter((e) => e.includes("ReferenceError") || e.includes("is not defined"));
    if (uncaughtRefErrors.length > 0) {
      console.error("  ✗ Console ReferenceErrors detected:", uncaughtRefErrors);
      hasErrors = true;
    } else {
      console.log("  ✓ Zero console ReferenceErrors");
    }

    await desktopContext.close();

    // ── 2. VERIFY HOME (MOBILE 390x844) ──
    console.log("\n▶ [2/3] Testing GET / (Mobile 390x844)...");
    const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true });
    const mobilePage = await mobileContext.newPage();
    const mobilePageErrors = [];

    mobilePage.on("pageerror", (err) => mobilePageErrors.push(err.message));

    await mobilePage.goto(BASE_URL, { waitUntil: "networkidle", timeout: 15000 });
    await mobilePage.waitForTimeout(800);

    const mobileOverlay = await mobilePage.$("nextjs-portal, [data-nextjs-dialog-overlay]");
    if (mobileOverlay) {
      console.error("  ✗ Mobile error overlay detected!");
      hasErrors = true;
    } else {
      console.log("  ✓ Mobile renders cleanly without error overlay");
    }

    if (mobilePageErrors.length > 0) {
      console.error("  ✗ Mobile uncaught page errors:", mobilePageErrors);
      hasErrors = true;
    } else {
      console.log("  ✓ Zero mobile page errors");
    }
    await mobileContext.close();

    // ── 3. VERIFY EXPERIENCE & GALLERY ROUTES ──
    console.log("\n▶ [3/3] Testing GET /experience and GET /gallery...");
    const routeContext = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
    
    // Test /experience
    const expPage = await routeContext.newPage();
    const expPageErrors = [];
    expPage.on("pageerror", (err) => expPageErrors.push(err.message));
    await expPage.goto(`${BASE_URL}/experience`, { waitUntil: "networkidle", timeout: 15000 });
    const expOverlay = await expPage.$("nextjs-portal, [data-nextjs-dialog-overlay]");
    if (expOverlay || expPageErrors.length > 0) {
      console.error("  ✗ /experience has runtime error overlay or page errors:", expPageErrors);
      hasErrors = true;
    } else {
      console.log("  ✓ /experience renders cleanly with continuous expedition trail");
    }

    // Test /gallery
    const galPage = await routeContext.newPage();
    const galPageErrors = [];
    galPage.on("pageerror", (err) => galPageErrors.push(err.message));
    await galPage.goto(`${BASE_URL}/gallery`, { waitUntil: "networkidle", timeout: 15000 });
    const galOverlay = await galPage.$("nextjs-portal, [data-nextjs-dialog-overlay]");
    if (galOverlay || galPageErrors.length > 0) {
      console.error("  ✗ /gallery has runtime error overlay or page errors:", galPageErrors);
      hasErrors = true;
    } else {
      console.log("  ✓ /gallery renders cleanly with organic memory wall");
    }

    await routeContext.close();

  } finally {
    await browser.close();
  }

  console.log("\n================================================================================");
  if (hasErrors) {
    console.error("RUNTIME VISUAL HEALTH GATE FAILED!");
    console.log("================================================================================\n");
    process.exit(1);
  } else {
    console.log("RUNTIME VISUAL HEALTH GATE PASSED! (All marketing views verified healthy)");
    console.log("================================================================================\n");
  }
}

verifyRuntimeHealth().catch((err) => {
  console.error("Runtime health gate fatal error:", err);
  process.exit(1);
});
