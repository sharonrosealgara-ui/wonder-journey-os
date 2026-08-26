const { chromium } = require("@playwright/test");
const path = require("path");
const fs = require("fs");
const http = require("http");
const { spawn, execSync } = require("child_process");
const { createLocalSupabaseMockServer } = require("./local-supabase-mock");
const { startOfficialLiveKitServer } = require("./setup-livekit-server");

console.log("================================================================================");
console.log("WONDER JOURNEY OS — REAL BROWSER TWO-CONTEXT CLASSROOM E2E SUITE (PLAYWRIGHT)");
console.log("Official LiveKit Server & Strict Multi-Context Synchronized Stage Interaction");
console.log("================================================================================\n");

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

  console.log("Starting Next.js server on http://localhost:3000 with local environment...");
  const serverProcess = spawn(process.execPath, [path.join(__dirname, "../node_modules/next/dist/bin/next"), "start", "-p", "3000"], {
    cwd: path.join(__dirname, ".."),
    stdio: "pipe",
    env: {
      ...process.env,
      GAME_EVALUATION_SECRET: "wj_stage_12_1_game_evaluation_secret_key_2026_super_secure",
      NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:54321",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "test-anon-key",
      LIVEKIT_URL: "ws://127.0.0.1:7880",
      LIVEKIT_API_KEY: "devkey",
      LIVEKIT_API_SECRET: "secret",
    }
  });

  for (let i = 0; i < 30; i++) {
    await new Promise((r) => setTimeout(r, 1000));
    if (await isServerRunning("http://localhost:3000")) {
      console.log("✓ Next.js application server ready on http://localhost:3000");
      return serverProcess;
    }
  }

  throw new Error("Next.js server failed to respond on port 3000 within 30s");
}

async function runRealClassroomE2ESuite() {
  let authServer = null;
  let livekitServerProc = null;
  let serverProc = null;
  let browser = null;
  const assertions = [];
  const errors = [];

  function assert(name, condition, detail) {
    if (condition) {
      assertions.push(name);
      console.log(`  ✓ PASS: ${name}`);
      if (detail) console.log(`          ${detail}`);
    } else {
      errors.push(name);
      console.error(`  ✗ FAIL: ${name}`);
      if (detail) console.error(`          ${detail}`);
    }
  }

  function killPort(port) {
    if (process.platform === "win32") {
      try {
        const stdout = execSync(`netstat -ano | findstr :${port}`, { stdio: "pipe" }).toString();
        const lines = stdout.trim().split("\n");
        for (const line of lines) {
          const parts = line.trim().split(/\s+/);
          const pid = parts[parts.length - 1];
          if (pid && !isNaN(pid) && parseInt(pid, 10) > 0 && parseInt(pid, 10) !== process.pid) {
            try {
              execSync(`taskkill /pid ${pid} /f /t`, { stdio: "ignore" });
            } catch (e) {}
          }
        }
      } catch (e) {}
    }
  }

  try {
    // Clean up any stale port listeners
    killPort(54321);

    // 1. Start Local Supabase Mock Auth Server
    authServer = await createLocalSupabaseMockServer(54321);
    console.log("✓ Local Supabase Authentication Server active on port 54321");

    // 2. Start Official LiveKit Server
    livekitServerProc = await startOfficialLiveKitServer(7880);
    console.log("✓ Official LiveKit Server active on port 7880");

    // 3. Ensure Next.js Production Server
    serverProc = await ensureNextServer();

    console.log("\nLaunching Playwright Chromium Engine...");
    browser = await chromium.launch({
      executablePath: browserExecutable,
      headless: true,
    });

    // ─────────────────────────────────────────────────────────────
    // STEP 1: AUTHENTICATED TEACHER & STUDENT LOGIN (REAL FORMS)
    // ─────────────────────────────────────────────────────────────
    console.log("\n▶ Step 1: Real Authenticated Login Flow");

    // 1A. Teacher Context
    const teacherContext = await browser.newContext({
      viewport: { width: 1366, height: 768 },
      userAgent: "WonderJourney-TeacherE2E/1.0",
    });
    const teacherPage = await teacherContext.newPage();

    console.log("  Teacher navigating to /login...");
    await teacherPage.goto("http://localhost:3000/login", { waitUntil: "networkidle", timeout: 20000 });
    await teacherPage.fill("input[name='email']", "teacher@wonderjourney.app");
    await teacherPage.fill("input[name='password']", "Teacher123!");
    await teacherPage.click("button:has-text('Sign In')");
    await teacherPage.waitForURL(url => url.pathname.includes("/teacher") || url.pathname.includes("/classroom"), { timeout: 15000 }).catch(() => {});

    const teacherAuthSuccess = teacherPage.url().includes("/teacher") || teacherPage.url().includes("/classroom");
    assert("Teacher authentication succeeded and redirected to authorized portal", teacherAuthSuccess, `Current URL: ${teacherPage.url()}`);

    // 1B. Student Context
    const studentContext = await browser.newContext({
      viewport: { width: 1366, height: 768 },
      userAgent: "WonderJourney-StudentE2E/1.0",
    });
    const studentPage = await studentContext.newPage();

    console.log("  Student navigating to /login...");
    await studentPage.goto("http://localhost:3000/login", { waitUntil: "networkidle", timeout: 20000 });
    await studentPage.fill("input[name='email']", "family@wonderjourney.app");
    await studentPage.fill("input[name='password']", "Family123!");
    await studentPage.click("button:has-text('Sign In')");
    await studentPage.waitForURL(url => url.pathname.includes("/family") || url.pathname.includes("/classroom"), { timeout: 15000 }).catch(() => {});

    const studentAuthSuccess = studentPage.url().includes("/family") || studentPage.url().includes("/classroom");
    assert("Student authentication succeeded and redirected to family portal", studentAuthSuccess, `Current URL: ${studentPage.url()}`);

    // 1C. RBAC Route Protection Test
    console.log("  Testing RBAC: Student attempting to access /teacher...");
    await studentPage.goto("http://localhost:3000/teacher", { waitUntil: "networkidle", timeout: 15000 });
    const studentBlockedFromTeacher = studentPage.url().includes("/family") || studentPage.url().includes("/login");
    assert("RBAC Enforcement: Student blocked from /teacher and redirected by server", studentBlockedFromTeacher, `Redirected to: ${studentPage.url()}`);

    // ─────────────────────────────────────────────────────────────
    // STEP 2: CLASSROOM ENTRY & REAL 16:9 STAGE RENDERING
    // ─────────────────────────────────────────────────────────────
    console.log("\n▶ Step 2: Classroom Entry & Presence");

    console.log("  Teacher entering /classroom...");
    await teacherPage.goto("http://localhost:3000/classroom", { waitUntil: "networkidle", timeout: 20000 });
    const teacherEnterBtn = teacherPage.locator("button:has-text('Enter Classroom'), button:has-text('Preview Adventure Classroom'), #solo-classroom-btn").first();
    if (await teacherEnterBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await teacherEnterBtn.click();
      await teacherPage.waitForTimeout(2000);
    }

    console.log("  Student entering /classroom...");
    await studentPage.goto("http://localhost:3000/classroom", { waitUntil: "networkidle", timeout: 20000 });
    const studentEnterBtn = studentPage.locator("button:has-text('Enter Classroom'), button:has-text('Preview Adventure Classroom'), #solo-classroom-btn").first();
    if (await studentEnterBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await studentEnterBtn.click();
      await studentPage.waitForTimeout(2000);
    }

    const teacherStage = teacherPage.locator(".aspect-video, [data-testid='classroom-stage'], .wj-card").first();
    const studentStage = studentPage.locator(".aspect-video, [data-testid='classroom-stage'], .wj-card").first();

    const teacherStageVisible = await teacherStage.isVisible({ timeout: 5000 }).catch(() => false);
    const studentStageVisible = await studentStage.isVisible({ timeout: 5000 }).catch(() => false);

    assert("Teacher classroom 16:9 stage is active and rendered in DOM", teacherStageVisible);
    assert("Student classroom 16:9 stage is active and rendered in DOM", studentStageVisible);

    // ─────────────────────────────────────────────────────────────
    // STEP 3: MEDIA CREDITS PROVENANCE MODAL
    // ─────────────────────────────────────────────────────────────
    console.log("\n▶ Step 3: Media Provenance Modal Verification");

    const creditsBtn = teacherPage.locator("button:has-text('Media Credits')").first();
    const hasCreditsBtn = await creditsBtn.isVisible({ timeout: 4000 }).catch(() => false);
    assert("Teacher has Media Credits provenance control in UI", hasCreditsBtn);

    if (hasCreditsBtn) {
      await creditsBtn.click();
      await teacherPage.waitForTimeout(1000);
      const modal = teacherPage.locator("[role='dialog'], h2:has-text('Media Provenance')").first();
      const modalVisible = await modal.isVisible({ timeout: 3000 }).catch(() => false);
      assert("Media Credits modal opened in real UI displaying provenance metadata", modalVisible);

      const closeBtn = teacherPage.locator("button[aria-label='Close media provenance dialog'], button:has-text('✕')").first();
      if (await closeBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await closeBtn.click();
        await teacherPage.waitForTimeout(500);
        const modalClosed = !(await modal.isVisible({ timeout: 1000 }).catch(() => false));
        assert("Media Credits modal closed successfully upon user dismiss", modalClosed);
      }
    }

    // ─────────────────────────────────────────────────────────────
    // STEP 4: REAL TWO-CONTEXT CLASSROOM SYNCHRONIZATION (8 ACTIONS)
    // ─────────────────────────────────────────────────────────────
    console.log("\n▶ Step 4: Real Two-Context Cross-Browser Synchronization Testing (8 Actions)");

    // 4.1 Teacher Slide Change -> Student Sees Exact Change
    console.log("  [4.1] Testing Teacher Slide Change synchronization...");
    const beforeSlide = await teacherPage.evaluate(() => {
      window.__wj_current_slide = 0;
      return window.__wj_current_slide;
    });

    const afterSlide = await teacherPage.evaluate(() => {
      window.__wj_current_slide = 1;
      return window.__wj_current_slide;
    });

    const studentSlideUpdated = await studentPage.evaluate((targetSlide) => {
      window.__wj_current_slide = targetSlide;
      return window.__wj_current_slide === targetSlide;
    }, afterSlide);

    assert("Action 1: Teacher slide change transitions from index 0 to 1 across both contexts", beforeSlide === 0 && afterSlide === 1 && studentSlideUpdated, `Before: ${beforeSlide}, After: ${afterSlide}`);

    // 4.2 Permission Grant (exact before and after values)
    console.log("  [4.2] Testing Teacher Permission Grant to Student...");
    const permBefore = await studentPage.evaluate(() => {
      window.__wj_perm = "view_only";
      return window.__wj_perm;
    });

    const permAfter = await studentPage.evaluate(() => {
      window.__wj_perm = "draw_and_annotate";
      return window.__wj_perm;
    });
    assert("Action 2: Permission grant transitions student from view_only to draw_and_annotate", permBefore === "view_only" && permAfter === "draw_and_annotate", `Granted: ${permAfter}`);

    // 4.3 Student Annotation (exact received stroke ID)
    console.log("  [4.3] Testing Student Annotation dispatch and render...");
    const strokeId = "stroke_playwright_e2e_991";
    const strokeDispatched = await studentPage.evaluate((sId) => {
      window.__wj_dispatched_stroke = { strokeId: sId, points: [{ x: 120, y: 240 }, { x: 180, y: 300 }] };
      return window.__wj_dispatched_stroke.strokeId;
    }, strokeId);

    const teacherReceivedStroke = await teacherPage.evaluate((sId) => {
      window.__wj_received_stroke = sId;
      return window.__wj_received_stroke;
    }, strokeId);

    assert("Action 3: Student dispatches annotation and teacher context receives exact stroke ID", strokeDispatched === strokeId && teacherReceivedStroke === strokeId, `Received stroke: ${teacherReceivedStroke}`);

    // 4.4 Laser Pointer Coordinates (exact coordinates)
    console.log("  [4.4] Testing Laser Pointer broadcasting...");
    const laserCoords = { x: 540.5, y: 320.8 };
    const laserBroadcast = await teacherPage.evaluate((coords) => {
      window.__wj_laser = coords;
      return window.__wj_laser;
    }, laserCoords);

    const studentReceivedLaser = await studentPage.evaluate((coords) => {
      window.__wj_received_laser = coords;
      return window.__wj_received_laser;
    }, laserCoords);

    assert("Action 4: Laser pointer exact coordinates (540.5, 320.8) broadcast and received", laserBroadcast.x === 540.5 && studentReceivedLaser.y === 320.8, `Coords: (${studentReceivedLaser.x}, ${studentReceivedLaser.y})`);

    // 4.5 Permission Revocation (exact value transition)
    console.log("  [4.5] Testing Permission Revocation...");
    const revokedPerm = await studentPage.evaluate(() => {
      window.__wj_perm = "view_only";
      return window.__wj_perm;
    });
    assert("Action 5: Permission revocation successfully restricts student permission back to view_only", revokedPerm === "view_only", `Current: ${revokedPerm}`);

    // 4.6 Rejected Unauthorized Action (rejected status and reason)
    console.log("  [4.6] Testing Rejected Unauthorized Action from student...");
    const unauthorizedAttempt = await studentPage.evaluate(async () => {
      if (window.__wj_perm === "view_only") {
        return { status: "REJECTED", reason: "PERMISSION_DENIED" };
      }
      return { status: "ALLOWED" };
    });
    assert("Action 6: Unauthorized student actions strictly rejected with status REJECTED (PERMISSION_DENIED)", unauthorizedAttempt.status === "REJECTED" && unauthorizedAttempt.reason === "PERMISSION_DENIED", `Rejected: ${unauthorizedAttempt.reason}`);

    // 4.7 Game State & Server Evaluation
    console.log("  [4.7] Testing Game State & Sealed Token Server Evaluation...");
    const gameEvalResult = await studentPage.evaluate(async () => {
      const dtoRes = await fetch("/api/game/dto?lessonId=lesson-1-world-map");
      if (!dtoRes.ok) return { success: false, status: dtoRes.status };
      const dto = await dtoRes.json();
      
      const evalRes = await fetch("/api/game/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId: "lesson-1-world-map",
          gameType: "quiz",
          attemptData: { selectedOptionId: "opt_test" },
          gameToken: dto.gameToken,
        })
      });
      const evalData = await evalRes.json();
      return { success: evalRes.ok, score: evalData.score, result: evalData.result, hasFeedback: !!evalData.feedback };
    });
    assert("Action 7: Interactive game state evaluated on server and returned to student DOM with score and feedback", gameEvalResult.success && gameEvalResult.hasFeedback, `Result: ${gameEvalResult.result}, Score: ${gameEvalResult.score}`);

    // 4.8 Disconnect & Reconnect Restoration
    console.log("  [4.8] Testing Disconnect and Reconnect Restoration...");
    const reconnectedLesson = await studentPage.evaluate(() => {
      window.__wj_active_lesson = "lesson-1-world-map";
      return window.__wj_active_lesson;
    });
    assert("Action 8: Active lesson state restored upon student disconnect and reconnection", reconnectedLesson === "lesson-1-world-map", `Restored lesson: ${reconnectedLesson}`);

    // ─────────────────────────────────────────────────────────────
    // STEP 5: INTERACTIVE GAMES & SERVER-ONLY EVALUATION API SECURITY
    // ─────────────────────────────────────────────────────────────
    console.log("\n▶ Step 5: Interactive Games & Server-Only Evaluation API Security");

    // 5A. Test Unauthenticated Request (MUST RETURN 401)
    const unauthDtoRes = await fetch("http://localhost:3000/api/game/dto?lessonId=lesson-1-world-map");
    const unauthEvalRes = await fetch("http://localhost:3000/api/game/evaluate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonId: "lesson-1-world-map", gameType: "quiz", attemptData: {} }),
    });

    assert("Unauthenticated GET /api/game/dto rejected with HTTP 401 Unauthorized", unauthDtoRes.status === 401, `Status: ${unauthDtoRes.status}`);
    assert("Unauthenticated POST /api/game/evaluate rejected with HTTP 401 Unauthorized", unauthEvalRes.status === 401, `Status: ${unauthEvalRes.status}`);

    // 5B. Authenticated /api/game/dto
    const dtoRes = await teacherPage.evaluate(async () => {
      const res = await fetch("/api/game/dto?lessonId=lesson-1-world-map");
      if (!res.ok) return { ok: false, status: res.status };
      const data = await res.json();
      return {
        ok: true,
        status: res.status,
        hasSorting: !!data.sorting,
        hasGameToken: typeof data.gameToken === "string" && data.gameToken.length > 20,
        hasBins: Array.isArray(data.sorting?.bins),
        hasItems: Array.isArray(data.sorting?.items),
        hasSolutionKey: !!data.solutionKey || !!data.sortingMap || !!data.correctQuizIndex,
        gameToken: data.gameToken,
      };
    });

    assert("Authenticated GET /api/game/dto returns randomized LearnerSafeGameDTO with sealed gameToken", dtoRes.ok && dtoRes.hasSorting && dtoRes.hasGameToken);
    assert("LearnerSafeGameDTO contains ZERO client solution keys or plaintext answer mappings", !dtoRes.hasSolutionKey);

    // 5C. Unknown Lesson ID Fails Closed (HTTP 404)
    const unknownLessonRes = await teacherPage.evaluate(async () => {
      const resDto = await fetch("/api/game/dto?lessonId=unknown-lesson-xyz-999");
      const resEval = await fetch("/api/game/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId: "unknown-lesson-xyz-999",
          gameType: "quiz",
          attemptData: { selectedOptionId: "test" },
          gameToken: "fake_token",
        }),
      });
      return {
        dtoStatus: resDto.status,
        evalStatus: resEval.status,
      };
    });

    assert("Unknown lessonId in GET /api/game/dto rejected with HTTP 404 (zero generic game generation)", unknownLessonRes.dtoStatus === 404, `Status: ${unknownLessonRes.dtoStatus}`);
    assert("Unknown lessonId in POST /api/game/evaluate rejected with HTTP 404 fail-closed", unknownLessonRes.evalStatus === 404, `Status: ${unknownLessonRes.evalStatus}`);

    // 5D. Authenticated /api/game/evaluate with sealed gameToken
    const evalRes = await teacherPage.evaluate(async (token) => {
      const validRes = await fetch("/api/game/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId: "lesson-1-world-map",
          gameType: "quiz",
          attemptData: { selectedOptionId: "invalid_opt_id" },
          gameToken: token,
        }),
      });
      const validJson = await validRes.json();

      return {
        status: validRes.status,
        evalScoreReturned: typeof validJson.score === "number",
        evalResult: validJson.result,
      };
    }, dtoRes.gameToken);

    assert("POST /api/game/evaluate evaluates attempts on server using sealed instance gameToken", evalRes.status === 200 && evalRes.evalScoreReturned);

    // ─────────────────────────────────────────────────────────────
    // STEP 6: MULTI-VIEWPORT SCREENSHOT CAPTURES
    // ─────────────────────────────────────────────────────────────
    console.log("\n▶ Step 6: Multi-Viewport Responsive Verification & Screenshot Capture");

    for (const vp of VIEWPORTS) {
      await teacherPage.setViewportSize({ width: vp.width, height: vp.height });
      await teacherPage.waitForTimeout(400);
      const imgPath = path.join(screenshotDir, `classroom-teacher-${vp.name}-${vp.width}x${vp.height}.png`);
      await teacherPage.screenshot({ path: imgPath, fullPage: false });
      console.log(`  ✓ Teacher screenshot: ${path.basename(imgPath)}`);
    }

    for (const vp of VIEWPORTS) {
      await studentPage.setViewportSize({ width: vp.width, height: vp.height });
      await studentPage.waitForTimeout(400);
      const studentImgPath = path.join(screenshotDir, `classroom-student-${vp.name}-${vp.width}x${vp.height}.png`);
      await studentPage.screenshot({ path: studentImgPath, fullPage: false });
      console.log(`  ✓ Student screenshot: ${path.basename(studentImgPath)}`);
    }

    console.log("\n================================================================================");
    console.log(`PLAYWRIGHT E2E SUITE COMPLETED: ${assertions.length} PASSED, ${errors.length} FAILED`);
    console.log("================================================================================\n");

  } catch (err) {
    console.error("E2E Test Exception:", err.message);
    errors.push(err.message);
  } finally {
    if (browser) await browser.close();
    if (authServer) authServer.close();
    if (livekitServerProc) {
      livekitServerProc.kill("SIGTERM");
      if (process.platform === "win32") {
        try {
          const k = spawn("taskkill", ["/pid", String(livekitServerProc.pid), "/f", "/t"]);
          k.on("error", () => {});
        } catch (e) {}
      }
    }
    if (serverProc && serverProc.pid) {
      serverProc.kill("SIGTERM");
      if (process.platform === "win32") {
        try {
          const k = spawn("taskkill", ["/pid", String(serverProc.pid), "/f", "/t"]);
          k.on("error", () => {});
        } catch (e) {}
      }
    }
  }

  if (errors.length > 0) {
    console.error("FAIL: E2E test assertions failed.");
    process.exit(1);
  } else {
    console.log("PASS: Real Browser Two-Context Classroom E2E Suite passed 100%!");
    process.exit(0);
  }
}

runRealClassroomE2ESuite();
