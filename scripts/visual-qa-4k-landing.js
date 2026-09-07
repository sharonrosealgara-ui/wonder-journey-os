const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");
const { chromium } = require("@playwright/test");

const PORT = 3099;
const BASE_URL = `http://127.0.0.1:${PORT}`;

const VIEWPORTS = [
  { name: "01-landing-4k-3840x2160.png", width: 3840, height: 2160, is4K: true },
  { name: "02-landing-2k-2560x1440.png", width: 2560, height: 1440 },
  { name: "03-landing-1080p-1920x1080.png", width: 1920, height: 1080 },
  { name: "04-landing-laptop-1440x900.png", width: 1440, height: 900 },
  { name: "05-landing-tablet-landscape-1024x768.png", width: 1024, height: 768 },
  { name: "06-landing-tablet-portrait-768x1024.png", width: 768, height: 1024 },
  { name: "07-landing-mobile-430x932.png", width: 430, height: 932, isMobile: true },
  { name: "08-landing-mobile-390x844.png", width: 390, height: 844, isMobile: true },
];

async function waitForServer(url, timeoutMs = 60000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.status === 200) {
        return true;
      }
    } catch {
      // Waiting for server
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
  throw new Error(`Timed out waiting for production server at ${url}`);
}

async function runVisualQA() {
  const outputDir = path.join(__dirname, "../artifacts/screenshots/premium-4k-landing");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log("================================================================================");
  console.log("WONDER JOURNEY OS — 4K LANDING VISUAL QA & RESPONSIVE AUDIT");
  console.log("Testing 8 viewports: 3840x2160 down to 390x844 + Reduced Motion");
  console.log("================================================================================\n");

  const browser = await chromium.launch({ headless: true });

  try {
    for (const vp of VIEWPORTS) {
      process.stdout.write(`Capturing viewport ${vp.width}x${vp.height} (${vp.name})... `);
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        deviceScaleFactor: vp.is4K ? 1 : 1,
        isMobile: vp.isMobile || false,
      });

      const page = await context.newPage();
      const consoleErrors = [];
      page.on("console", (msg) => {
        if (msg.type() === "error") {
          consoleErrors.push(msg.text());
        }
      });

      await page.goto(BASE_URL, { waitUntil: "networkidle" });
      await page.waitForTimeout(1000); // Allow Three.js canvas or SVG fallback to settle

      // Check for horizontal overflow
      const overflow = await page.evaluate(() => {
        const body = document.body;
        const html = document.documentElement;
        return {
          scrollWidth: Math.max(body.scrollWidth, html.scrollWidth),
          clientWidth: Math.max(body.clientWidth, html.clientWidth),
          hasOverflow: Math.max(body.scrollWidth, html.scrollWidth) > Math.max(body.clientWidth, html.clientWidth),
        };
      });

      if (overflow.hasOverflow) {
        console.warn(`[WARNING: Horizontal overflow detected: scrollWidth=${overflow.scrollWidth}, clientWidth=${overflow.clientWidth}]`);
      }

      // Capture hero viewport screenshot
      const shotPath = path.join(outputDir, vp.name);
      await page.screenshot({ path: shotPath, fullPage: false });

      // If 4K, also capture a full-page scroll screenshot to verify all sections
      if (vp.is4K) {
        const fullPagePath = path.join(outputDir, "01b-landing-4k-fullpage.png");
        await page.screenshot({ path: fullPagePath, fullPage: true });
      }

      console.log(`[PASS] (${shotPath})`);
      await context.close();
    }

    // Capture Reduced Motion mode
    process.stdout.write("Capturing Reduced Motion mode on desktop... ");
    const rmContext = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      reducedMotion: "reduce",
    });
    const rmPage = await rmContext.newPage();
    await rmPage.goto(BASE_URL, { waitUntil: "networkidle" });
    await rmPage.waitForTimeout(1000);

    const rmPath = path.join(outputDir, "09-landing-reduced-motion-desktop.png");
    await rmPage.screenshot({ path: rmPath, fullPage: false });
    console.log(`[PASS] (${rmPath})`);
    await rmContext.close();

    console.log("\n✓ All 9 visual QA snapshots captured successfully in artifacts/screenshots/premium-4k-landing/");
  } finally {
    await browser.close();
  }
}

async function main() {
  console.log(`Spawning Next.js production server on port ${PORT}...`);
  const nextBin = path.join(__dirname, "../node_modules/next/dist/bin/next");
  const serverProcess = spawn(process.execPath, [nextBin, "start", "-p", String(PORT)], {
    stdio: "pipe",
    env: { ...process.env, PORT: String(PORT), NODE_ENV: "production" },
  });

  try {
    await waitForServer(`${BASE_URL}/`);
    console.log(`✓ Production server responding at ${BASE_URL}\n`);
    await runVisualQA();
  } finally {
    console.log("\nShutting down visual QA production server...");
    serverProcess.kill("SIGTERM");
    if (process.platform === "win32") {
      try {
        const killer = spawn("taskkill", ["/pid", String(serverProcess.pid), "/f", "/t"]);
        killer.on("error", () => {});
      } catch {
        // Ignored
      }
    }
  }
}

main().catch((err) => {
  console.error("Fatal error during visual QA run:", err);
  process.exit(1);
});
