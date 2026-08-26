const { spawn } = require("child_process");
const path = require("path");

console.log("Starting Local Production-Server Smoke Test Suite...");

const PORT = 3088;
const BASE_URL = `http://127.0.0.1:${PORT}`;

async function waitForServer(url, timeoutMs = 60000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.status === 200) {
        console.log(`Production server responded 200 OK after ${Date.now() - start}ms`);
        return true;
      }
    } catch (e) {
      // Server not ready yet
    }
    await new Promise(r => setTimeout(r, 1000));
  }
  throw new Error(`Timed out waiting for production server at ${url}`);
}

async function runTests() {
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (!condition) {
      console.error(`FAIL: ${message}`);
      failed++;
    } else {
      console.log(`PASS: ${message}`);
      passed++;
    }
  }

  // 1. GET / (Marketing / Home)
  const homeRes = await fetch(`${BASE_URL}/`, { redirect: "manual" });
  assert(homeRes.status === 200, `GET / returned HTTP ${homeRes.status} (expected 200)`);
  assert(homeRes.headers.get("x-frame-options") === "SAMEORIGIN", "Security header X-Frame-Options: SAMEORIGIN present");
  assert(homeRes.headers.get("x-content-type-options") === "nosniff", "Security header X-Content-Type-Options: nosniff present");
  assert(homeRes.headers.get("referrer-policy") === "strict-origin-when-cross-origin", "Security header Referrer-Policy present");
  assert(homeRes.headers.get("permissions-policy")?.includes("camera=(self)"), "Security header Permissions-Policy present");

  // 2. GET /login
  const loginRes = await fetch(`${BASE_URL}/login`, { redirect: "manual" });
  assert(loginRes.status === 200, `GET /login returned HTTP ${loginRes.status} (expected 200)`);

  // 3. GET /forgot-password
  const forgotRes = await fetch(`${BASE_URL}/forgot-password`, { redirect: "manual" });
  assert(forgotRes.status === 200, `GET /forgot-password returned HTTP ${forgotRes.status} (expected 200)`);

  // 4. GET /reset-password
  const resetRes = await fetch(`${BASE_URL}/reset-password`, { redirect: "manual" });
  assert(resetRes.status === 200, `GET /reset-password returned HTTP ${resetRes.status} (expected 200)`);

  // 5. GET /robots.txt
  const robotsRes = await fetch(`${BASE_URL}/robots.txt`, { redirect: "manual" });
  assert(robotsRes.status === 200, `GET /robots.txt returned HTTP ${robotsRes.status} (expected 200)`);

  // 6. GET /sitemap.xml
  const sitemapRes = await fetch(`${BASE_URL}/sitemap.xml`, { redirect: "manual" });
  assert(sitemapRes.status === 200, `GET /sitemap.xml returned HTTP ${sitemapRes.status} (expected 200)`);

  // 7. GET /manifest.webmanifest
  const manifestRes = await fetch(`${BASE_URL}/manifest.webmanifest`, { redirect: "manual" });
  assert(manifestRes.status === 200, `GET /manifest.webmanifest returned HTTP ${manifestRes.status} (expected 200)`);

  // 8. GET /family (Unauthenticated Redirect)
  const familyRes = await fetch(`${BASE_URL}/family`, { redirect: "manual" });
  assert([307, 308, 302].includes(familyRes.status), `GET /family unauthenticated returned redirect ${familyRes.status}`);
  assert(familyRes.headers.get("location")?.includes("/login"), "Unauthenticated /family redirected to /login");

  // 9. GET /teacher (Unauthenticated Redirect)
  const teacherRes = await fetch(`${BASE_URL}/teacher`, { redirect: "manual" });
  assert([307, 308, 302].includes(teacherRes.status), `GET /teacher unauthenticated returned redirect ${teacherRes.status}`);
  assert(teacherRes.headers.get("location")?.includes("/login"), "Unauthenticated /teacher redirected to /login");

  // 10. GET /prep-email (Unauthenticated Redirect)
  const prepRes = await fetch(`${BASE_URL}/prep-email`, { redirect: "manual" });
  assert([307, 308, 302].includes(prepRes.status), `GET /prep-email unauthenticated returned redirect ${prepRes.status}`);
  assert(prepRes.headers.get("location")?.includes("/login"), "Unauthenticated /prep-email redirected to /login");

  // 11. GET /adventure/lesson-1-world-map (Unauthenticated Redirect)
  const advRes = await fetch(`${BASE_URL}/adventure/lesson-1-world-map`, { redirect: "manual" });
  assert([307, 308, 302].includes(advRes.status), `GET /adventure/... unauthenticated returned redirect ${advRes.status}`);

  // 12. GET /non-existent-public-asset.png (404 behavior for public assets)
  const notFoundRes = await fetch(`${BASE_URL}/non-existent-public-asset.png`, { redirect: "manual" });
  assert(notFoundRes.status === 404, `GET /non-existent-public-asset.png returned HTTP ${notFoundRes.status} (expected 404)`);

  // 13. POST /api/livekit-token (Empty body -> 400 Bad Request)
  const lkEmptyRes = await fetch(`${BASE_URL}/api/livekit-token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({})
  });
  assert(lkEmptyRes.status === 400, `POST /api/livekit-token empty body returned HTTP ${lkEmptyRes.status} (expected 400)`);

  // 14. POST /api/livekit-token (Valid body but unauthenticated -> 401 Unauthorized)
  const lkUnauthRes = await fetch(`${BASE_URL}/api/livekit-token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Student", room: "classroom-1" })
  });
  assert(lkUnauthRes.status === 401, `POST /api/livekit-token unauthenticated returned HTTP ${lkUnauthRes.status} (expected 401)`);

  // 15. GET /api/game/dto (Unauthenticated -> 401 Unauthorized)
  const gameDtoUnauth = await fetch(`${BASE_URL}/api/game/dto?lessonId=lesson-1-world-map`, {
    method: "GET"
  });
  assert(gameDtoUnauth.status === 401, `GET /api/game/dto unauthenticated returned HTTP ${gameDtoUnauth.status} (expected 401)`);

  // 16. POST /api/game/evaluate (Unauthenticated -> 401 Unauthorized)
  const gameEvalUnauth = await fetch(`${BASE_URL}/api/game/evaluate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ lessonId: "lesson-1-world-map", gameType: "quiz", attemptData: {} })
  });
  assert(gameEvalUnauth.status === 401, `POST /api/game/evaluate unauthenticated returned HTTP ${gameEvalUnauth.status} (expected 401)`);

  return { passed, failed };
}

async function main() {
  console.log(`Spawning Next.js production server on port ${PORT}...`);
  const nextBin = path.join(__dirname, "../node_modules/next/dist/bin/next");
  const serverProcess = spawn(process.execPath, [nextBin, "start", "-p", String(PORT)], {
    stdio: "pipe",
    env: { ...process.env, PORT: String(PORT), NODE_ENV: "production" }
  });

  serverProcess.stdout.on("data", () => {});
  serverProcess.stderr.on("data", () => {});

  try {
    await waitForServer(`${BASE_URL}/`);
    const { passed, failed } = await runTests();

    console.log("\n=========================================================");
    console.log(`LOCAL PRODUCTION SMOKE TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    console.log("=========================================================\n");

    if (failed > 0) {
      process.exit(1);
    }
  } finally {
    console.log("Shutting down local production server...");
    serverProcess.kill("SIGTERM");
    if (process.platform === "win32") {
      try {
        const killer = spawn("taskkill", ["/pid", String(serverProcess.pid), "/f", "/t"]);
        killer.on("error", () => {});
      } catch (e) {}
    }
  }
}

main().catch(err => {
  console.error("Fatal error during production smoke tests:", err);
  process.exit(1);
});
