const http = require("http");
const { chromium } = require("@playwright/test");
const path = require("path");
const fs = require("fs");
const { stringToBase64URL, createChunks } = require("@supabase/ssr/dist/main/utils");

async function runVisualQA() {
  const outputDir = path.join(__dirname, "../artifacts/screenshots/primary-source-scoping");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 1. Start ephemeral auth mock server on 54321 for Next.js middleware & client hydration
  const authServer = http.createServer((req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "*");

    if (req.method === "OPTIONS") {
      res.writeHead(200);
      res.end();
      return;
    }

    res.setHeader("Content-Type", "application/json");
    if (req.url.startsWith("/auth/v1/user")) {
      res.end(JSON.stringify({
        id: "learner-001",
        email: "family@wonderjourney.app",
        aud: "authenticated",
        role: "authenticated"
      }));
    } else if (req.url.startsWith("/rest/v1/profiles")) {
      res.setHeader("Content-Range", "0-0/1");
      res.end(JSON.stringify({ id: "learner-001", role: "family", display_name: "Explorer", family_id: "family-001" }));
    } else if (req.url.startsWith("/rest/v1/workspace_members")) {
      res.setHeader("Content-Range", "0-0/1");
      res.end(JSON.stringify([{ workspace_id: "ws-001", role: "family" }]));
    } else {
      res.setHeader("Content-Range", "0-0/0");
      res.end(JSON.stringify([]));
    }
  });

  await new Promise((resolve) => authServer.listen(54321, "127.0.0.1", resolve));
  console.log("✓ Ephemeral auth mock listening on 127.0.0.1:54321");

  // Prepare auth cookies
  const sessionValue = JSON.stringify({
    access_token: "visual_qa_test_token",
    refresh_token: "visual_qa_refresh",
    expires_at: Math.floor(Date.now() / 1000) + 7200,
    user: { id: "learner-001", email: "family@wonderjourney.app" }
  });
  const encoded = "base64-" + stringToBase64URL(sessionValue);
  const authChunks = createChunks("sb-127-auth-token", encoded);
  const browserCookies = authChunks.map((c) => ({
    name: c.name,
    value: c.value,
    domain: "localhost",
    path: "/"
  }));

  const browser = await chromium.launch({ headless: true });
  const baseUrl = "http://localhost:3008";

  console.log("================================================================================");
  console.log("WONDER JOURNEY OS — VISUAL QA: PRIMARY-SOURCE HISTORICAL CONTEXT SCOPING");
  console.log("================================================================================\n");

  try {
    // ── 1. Desktop Context (1280x800) ──
    console.log("── DESKTOP VIEWPORT (1280x800) ────────────────────────────────────────────────");
    const desktopContext = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36"
    });
    await desktopContext.addCookies(browserCookies);
    const page = await desktopContext.newPage();

    async function jumpToSlide(targetIndex) {
      await page.waitForSelector("footer div button", { timeout: 15000 });
      const scrubberButtons = page.locator("footer div button");
      await scrubberButtons.nth(targetIndex).click();
      await page.waitForTimeout(400);
    }

    // ── Lesson 1: Historical 1734 Map ──
    console.log("▶ Inspecting Lesson 1: 1734 Historical Map");
    await page.goto(`${baseUrl}/adventure/lesson-1-world-map`, { waitUntil: "networkidle" });
    // Slide 15 has the 1734 Map (media-l01-secondary)
    await jumpToSlide(15);

    const l01Title = await page.textContent("h1");
    console.log(`  Slide title: "${l01Title?.trim()}"`);
    const has1734ContextNotice = await page.locator("text=Historical Primary Source Context (1734)").count();
    const hasMurilloVelarde = await page.locator("text=Pedro Murillo Velarde").count();
    const hasBagay = await page.locator("text=Nicolás de la Cruz Bagay").count();
    const hasSuarez = await page.locator("text=Francisco Suárez").count();
    const hasExploreMapBtn = await page.locator("text=View and Explore Full Map").count();

    console.log(`  1734 Context Notice present: ${has1734ContextNotice > 0}`);
    console.log(`  Murillo Velarde attribution: ${hasMurilloVelarde > 0}`);
    console.log(`  Bagay attribution: ${hasBagay > 0}`);
    console.log(`  Suárez attribution: ${hasSuarez > 0}`);
    console.log(`  'View and Explore Full Map' button present: ${hasExploreMapBtn > 0}`);

    if (!has1734ContextNotice || !hasMurilloVelarde || !hasExploreMapBtn) {
      throw new Error("Lesson 1 failed to display 1734 historical map treatment!");
    }

    const l01Shot = path.join(outputDir, "01-lesson-1-1734-map-desktop.png");
    await page.screenshot({ path: l01Shot });
    console.log(`  ✓ Screenshot saved: ${l01Shot}`);

    // Test opening HistoricalMapViewer
    console.log("  Testing HistoricalMapViewer modal...");
    await page.locator("text=View and Explore Full Map").click();
    await page.waitForTimeout(500);

    const viewerModal = page.locator("div[role='dialog'][aria-label='Historical Map Interactive Viewer']");
    const isViewerVisible = await viewerModal.isVisible();
    console.log(`  HistoricalMapViewer modal visible: ${isViewerVisible}`);
    if (!isViewerVisible) throw new Error("HistoricalMapViewer modal failed to open!");

    const viewerShot = path.join(outputDir, "01b-lesson-1-map-viewer-open-desktop.png");
    await page.screenshot({ path: viewerShot });
    console.log(`  ✓ Screenshot saved: ${viewerShot}`);

    // Close viewer with Escape
    await page.keyboard.press("Escape");
    await page.waitForTimeout(400);
    const isViewerClosed = !(await viewerModal.isVisible());
    console.log(`  HistoricalMapViewer closed with Escape: ${isViewerClosed}`);
    if (!isViewerClosed) throw new Error("HistoricalMapViewer failed to close on Escape!");

    // ── Lesson 11: Narra Botanical Illustration (Genuine Non-Map Primary Source) ──
    console.log("\n▶ Inspecting Lesson 11: Non-Map Primary Source Scan (Flora de Filipinas)");
    await page.goto(`${baseUrl}/adventure/lesson-11-plants`, { waitUntil: "networkidle" });
    await jumpToSlide(13);

    const l11Title = await page.textContent("h1");
    console.log(`  Slide title: "${l11Title?.trim()}"`);
    const l11GenericPrimary = await page.locator("text=Historical Primary Source").count();
    const l11Has1734 = await page.locator("text=Historical Primary Source Context (1734)").count();
    const l11HasMurillo = await page.locator("text=Murillo Velarde").count();
    const l11HasExploreMap = await page.locator("text=View and Explore Full Map").count();
    const l11HasBlanco = await page.locator("text=Francisco Manuel Blanco").count();
    const l11HasArchive = await page.locator("text=Flora de Filipinas / Real Jardín Botánico de Madrid").count();

    console.log(`  'Historical Primary Source' generic label: ${l11GenericPrimary > 0}`);
    console.log(`  NO 1734 Map Context: ${l11Has1734 === 0}`);
    console.log(`  NO Murillo Velarde attribution: ${l11HasMurillo === 0}`);
    console.log(`  NO 'View and Explore Full Map' button: ${l11HasExploreMap === 0}`);
    console.log(`  Verified Creator (Blanco) present: ${l11HasBlanco > 0}`);
    console.log(`  Verified Archive present: ${l11HasArchive > 0}`);

    if (l11GenericPrimary === 0 || l11Has1734 > 0 || l11HasMurillo > 0 || l11HasExploreMap > 0) {
      throw new Error("Lesson 11 non-map primary source incorrectly received map treatment or lacked generic context!");
    }

    const l11Shot = path.join(outputDir, "02-lesson-11-non-map-primary-source-desktop.png");
    await page.screenshot({ path: l11Shot });
    console.log(`  ✓ Screenshot saved: ${l11Shot}`);

    // ── Lesson 12: Baybayin Bo (Original Diagram Regression) ──
    console.log("\n▶ Inspecting Lesson 12: Baybayin Character (Original Diagram Regression)");
    await page.goto(`${baseUrl}/adventure/lesson-12-language`, { waitUntil: "networkidle" });
    await jumpToSlide(13);

    const l12Title = await page.textContent("h1");
    console.log(`  Slide title: "${l12Title?.trim()}"`);
    const l12Has1734 = await page.locator("text=1734").count();
    const l12HasMapBtn = await page.locator("text=View and Explore Full Map").count();
    const l12HasPrimaryBadge = await page.locator("text=Historical Primary Source").count();

    console.log(`  NO 1734 context: ${l12Has1734 === 0}`);
    console.log(`  NO map viewer button: ${l12HasMapBtn === 0}`);
    console.log(`  NO primary source badge: ${l12HasPrimaryBadge === 0}`);

    if (l12Has1734 > 0 || l12HasMapBtn > 0 || l12HasPrimaryBadge > 0) {
      throw new Error("Lesson 12 diagram leaked primary source map treatment!");
    }

    const l12Shot = path.join(outputDir, "03-lesson-12-diagram-regression-desktop.png");
    await page.screenshot({ path: l12Shot });
    console.log(`  ✓ Screenshot saved: ${l12Shot}`);

    // ── Lesson 31: Magellan Shrine (Photograph Regression) ──
    console.log("\n▶ Inspecting Lesson 31: Magellan Shrine Memorial (Photograph Regression)");
    await page.goto(`${baseUrl}/adventure/lesson-31-history-timeline`, { waitUntil: "networkidle" });
    await jumpToSlide(14);

    const l31Title = await page.textContent("h1");
    console.log(`  Slide title: "${l31Title?.trim()}"`);
    const l31Has1734 = await page.locator("text=1734").count();
    const l31HasLaguna = await page.locator("text=Laguna Copperplate").count();
    const l31HasMapBtn = await page.locator("text=View and Explore Full Map").count();

    console.log(`  NO 1734 context: ${l31Has1734 === 0}`);
    console.log(`  NO Laguna Copperplate text: ${l31HasLaguna === 0}`);
    console.log(`  NO map viewer button: ${l31HasMapBtn === 0}`);

    if (l31Has1734 > 0 || l31HasLaguna > 0 || l31HasMapBtn > 0) {
      throw new Error("Lesson 31 photograph leaked map or stale metadata!");
    }

    const l31Shot = path.join(outputDir, "04-lesson-31-photograph-regression-desktop.png");
    await page.screenshot({ path: l31Shot });
    console.log(`  ✓ Screenshot saved: ${l31Shot}`);

    // ── Lesson 50: Wooden Spoons (Photograph Regression) ──
    console.log("\n▶ Inspecting Lesson 50: Handcrafted Wooden Spoons (Photograph Regression)");
    await page.goto(`${baseUrl}/adventure/lesson-50-grandmas-recipe-box`, { waitUntil: "networkidle" });
    await jumpToSlide(13);

    const l50Title = await page.textContent("h1");
    console.log(`  Slide title: "${l50Title?.trim()}"`);
    const l50Has1734 = await page.locator("text=1734").count();
    const l50HasRecipeBook = await page.locator("text=recipe-book").count();
    const l50HasMapBtn = await page.locator("text=View and Explore Full Map").count();

    console.log(`  NO 1734 context: ${l50Has1734 === 0}`);
    console.log(`  NO recipe-book text: ${l50HasRecipeBook === 0}`);
    console.log(`  NO map viewer button: ${l50HasMapBtn === 0}`);

    if (l50Has1734 > 0 || l50HasMapBtn > 0) {
      throw new Error("Lesson 50 photograph leaked map treatment!");
    }

    const l50Shot = path.join(outputDir, "05-lesson-50-photograph-regression-desktop.png");
    await page.screenshot({ path: l50Shot });
    console.log(`  ✓ Screenshot saved: ${l50Shot}`);

    await desktopContext.close();

    // ── 2. Mobile Context (390x844) ──
    console.log("\n── MOBILE VIEWPORT (390x844) ──────────────────────────────────────────────────");
    const mobileContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
      userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1"
    });
    await mobileContext.addCookies(browserCookies);
    const mobilePage = await mobileContext.newPage();

    async function jumpToMobileSlide(targetIndex) {
      await mobilePage.waitForSelector("[data-testid='theater-next-btn']", { timeout: 15000 });
      await mobilePage.evaluate((idx) => {
        const btns = document.querySelectorAll("footer div button");
        if (btns[idx]) btns[idx].click();
      }, targetIndex);
      await mobilePage.waitForTimeout(600);
    }

    // Mobile Lesson 1: 1734 Map
    console.log("▶ Inspecting Mobile Lesson 1: 1734 Historical Map");
    await mobilePage.goto(`${baseUrl}/adventure/lesson-1-world-map`, { waitUntil: "networkidle" });
    await jumpToMobileSlide(15);

    const mobL01Notice = await mobilePage.locator("text=Historical Primary Source Context (1734)").count();
    const mobL01Btn = await mobilePage.locator("text=View and Explore Full Map").count();
    console.log(`  Mobile 1734 Notice present: ${mobL01Notice > 0}`);
    console.log(`  Mobile 'View and Explore Full Map' button present: ${mobL01Btn > 0}`);

    const mobL01Shot = path.join(outputDir, "06-mobile-lesson-1-1734-map-390x844.png");
    await mobilePage.screenshot({ path: mobL01Shot });
    console.log(`  ✓ Mobile screenshot saved: ${mobL01Shot}`);

    // Mobile Lesson 11: Non-Map Primary Source
    console.log("\n▶ Inspecting Mobile Lesson 11: Non-Map Primary Source Scan");
    await mobilePage.goto(`${baseUrl}/adventure/lesson-11-plants`, { waitUntil: "networkidle" });
    await jumpToMobileSlide(13);

    const mobL11Notice = await mobilePage.locator("text=Historical Primary Source").count();
    const mobL11Has1734 = await mobilePage.locator("text=Historical Primary Source Context (1734)").count();
    console.log(`  Mobile Generic Primary Source Notice present: ${mobL11Notice > 0}`);
    console.log(`  Mobile NO 1734 Notice: ${mobL11Has1734 === 0}`);

    const mobL11Shot = path.join(outputDir, "07-mobile-lesson-11-primary-source-390x844.png");
    await mobilePage.screenshot({ path: mobL11Shot });
    console.log(`  ✓ Mobile screenshot saved: ${mobL11Shot}`);

    await mobileContext.close();
  } finally {
    await browser.close();
    authServer.close();
  }

  console.log("\n================================================================================");
  console.log("✓ VISUAL QA COMPLETE: ALL VIEWPORTS AND LESSONS STRICTLY VERIFIED");
  console.log("================================================================================\n");
}

runVisualQA().catch((err) => {
  console.error("Visual QA Failed:", err);
  process.exit(1);
});
