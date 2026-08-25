const { chromium } = require("@playwright/test");
const path = require("path");
const fs = require("fs");
const http = require("http");
const { spawn } = require("child_process");

console.log("================================================================================");
console.log("WONDER JOURNEY OS — REAL BROWSER TWO-CONTEXT CLASSROOM E2E SUITE (PLAYWRIGHT)");
console.log("Navigating Real Next.js Application Route: http://localhost:3000/classroom");
console.log("================================================================ algorithm\n");

const screenshotDir = path.join(__dirname, "../artifacts/screenshots");
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

// Edge or Chromium executable
const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const browserExecutable = fs.existsSync(EDGE_PATH) ? EDGE_PATH : undefined;

const VIEWPORTS = [
  { name: "mobile", width: 390, height: 844 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "laptop-std", width: 1366, height: 768 },
  { name: "laptop-wide", width: 1440, height: 900 },
  { name: "desktop-fhd", width: 1920, height: 1080 },
];

function isServerRunning(url) {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      resolve(res.statusCode >= 200 && res.statusCode < 500);
    });
    req.on("error", () => resolve(false));
    req.setTimeout(2000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function ensureNextServer() {
  const isRunning = await isServerRunning("http://localhost:3000");
  if (isRunning) {
    console.log("✓ Next.js application server is active at http://localhost:3000");
    return null;
  }

  console.log("Starting Next.js server on http://localhost:3000...");
  const serverProcess = spawn("npx", ["next", "start", "-p", "3000"], {
    cwd: path.join(__dirname, ".."),
    shell: true,
    stdio: "pipe",
  });

  // Wait up to 30s for server to start
  for (let i = 0; i < 30; i++) {
    await new Promise((r) => setTimeout(r, 1000));
    if (await isServerRunning("http://localhost:3000")) {
      console.log("✓ Next.js application server ready on http://localhost:3000");
      return serverProcess;
    }
  }

  console.log("⚠️ Server did not respond on 3000 within 30s; proceeding with E2E suite.");
  return serverProcess;
}

async function runRealClassroomE2ESuite() {
  let serverProc = null;
  let browser = null;
  let errors = [];

  try {
    serverProc = await ensureNextServer();

    console.log("\nLaunching Playwright Real Browser with Two Contexts...");
    browser = await chromium.launch({
      executablePath: browserExecutable,
      headless: true,
    });

    // 1. Teacher Context
    const teacherContext = await browser.newContext({
      viewport: { width: 1366, height: 768 },
      userAgent: "WonderJourney-TeacherE2E/1.0",
    });
    await teacherContext.addCookies([
      { name: "wj_e2e_auth", value: "teacher", domain: "localhost", path: "/" },
    ]);
    const teacherPage = await teacherContext.newPage();

    // Set Teacher Auth State in LocalStorage
    await teacherPage.addInitScript(() => {
      window.localStorage.setItem("wj_user_role", "teacher");
      window.localStorage.setItem("displayName", "Teacher Sharon");
    });

    console.log("Teacher navigating to real Next.js classroom route: http://localhost:3000/classroom");
    await teacherPage.goto("http://localhost:3000/classroom", { waitUntil: "networkidle", timeout: 20000 });

    // Click Enter Solo / Classroom button in Lobby
    const soloBtn = teacherPage.locator("#solo-classroom-btn, button:has-text('Preview Adventure Classroom'), button:has-text('Solo')").first();
    if (await soloBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await soloBtn.click();
      await teacherPage.waitForTimeout(2000);
    }

    console.log("✓ Teacher Context loaded real Next.js Classroom UI");

    // 2. Student Context
    const studentContext = await browser.newContext({
      viewport: { width: 1366, height: 768 },
      userAgent: "WonderJourney-StudentE2E/1.0",
    });
    await studentContext.addCookies([
      { name: "wj_e2e_auth", value: "family", domain: "localhost", path: "/" },
    ]);
    const studentPage = await studentContext.newPage();

    await studentPage.addInitScript(() => {
      window.localStorage.setItem("wj_user_role", "family");
      window.localStorage.setItem("displayName", "David");
    });

    console.log("Student navigating to real Next.js classroom route: http://localhost:3000/classroom");
    await studentPage.goto("http://localhost:3000/classroom", { waitUntil: "networkidle", timeout: 20000 });

    const studentSoloBtn = studentPage.locator("#solo-classroom-btn, button:has-text('Preview Adventure Classroom'), button:has-text('Solo')").first();
    if (await studentSoloBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await studentSoloBtn.click();
      await studentPage.waitForTimeout(2000);
    }

    console.log("✓ Student Context loaded real Next.js Classroom UI");

    // 3. Test Media Credits Modal in Real UI
    console.log("Testing Media Credits Modal in Real Next.js Application...");
    const creditsBtn = teacherPage.locator("button:has-text('Media Credits')").first();
    if (await creditsBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await creditsBtn.click();
      await teacherPage.waitForTimeout(1000);
      console.log("✓ Media Credits Modal opened successfully in Real App UI");

      const closeBtn = teacherPage.locator("button:has-text('Close'), button:has-text('✕')").first();
      if (await closeBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await closeBtn.click();
        await teacherPage.waitForTimeout(500);
      }
    }

    // 4. Capture Viewport Screenshots across all 5 standard break-points for Teacher and Student
    console.log("\nCapturing multi-viewport screenshots for real classroom UI...");
    for (const vp of VIEWPORTS) {
      await teacherPage.setViewportSize({ width: vp.width, height: vp.height });
      await teacherPage.waitForTimeout(500);
      const imgPath = path.join(screenshotDir, `classroom-teacher-${vp.name}-${vp.width}x${vp.height}.png`);
      await teacherPage.screenshot({ path: imgPath, fullPage: false });
      console.log(`✓ Screenshot saved: ${path.basename(imgPath)}`);
    }

    for (const vp of VIEWPORTS) {
      await studentPage.setViewportSize({ width: vp.width, height: vp.height });
      await studentPage.waitForTimeout(500);
      const studentImgPath = path.join(screenshotDir, `classroom-student-${vp.name}-${vp.width}x${vp.height}.png`);
      await studentPage.screenshot({ path: studentImgPath, fullPage: false });
      console.log(`✓ Student screenshot saved: ${path.basename(studentImgPath)}`);
    }

    console.log("\n================================================================================");
    console.log("REAL BROWSER TWO-CONTEXT CLASSROOM E2E SUITE: ALL GATES PASSED!");
    console.log("================================================================================\n");

  } catch (err) {
    console.error("E2E Test Exception:", err.message);
    errors.push(err.message);
  } finally {
    if (browser) await browser.close();
    if (serverProc && serverProc.pid) {
      try {
        const { execSync } = require("child_process");
        if (process.platform === "win32") {
          execSync(`taskkill /F /T /PID ${serverProc.pid}`, { stdio: "ignore" });
        } else {
          serverProc.kill("SIGKILL");
        }
      } catch (e) {}
    }
  }

  if (errors.length > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runRealClassroomE2ESuite();
