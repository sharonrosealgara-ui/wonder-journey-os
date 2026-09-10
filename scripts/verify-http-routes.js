const http = require("http");

const port = process.env.PORT || 3000;
const BASE_URL = process.env.TEST_BASE_URL || `http://localhost:${port}`;

const PUBLIC_ROUTES = [
  "/",
  "/experience",
  "/learning",
  "/gallery",
  "/about",
  "/safety",
  "/inquiry",
  "/primary-sources",
  "/login",
];

const PROTECTED_ROUTES = [
  "/family",
  "/classroom",
  "/passport",
  "/teacher",
  "/about-old", // Proves /about-old is NOT treated as public
];

function fetchStatus(path) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const req = http.request(
      url,
      {
        method: "GET",
        headers: {
          // No cookies -> Unauthenticated visitor
        },
      },
      (res) => {
        resolve({
          path,
          statusCode: res.statusCode,
          location: res.headers.location,
        });
      }
    );
    req.on("error", reject);
    req.end();
  });
}

async function run() {
  console.log("================================================================================");
  console.log("LIVE HTTP VERIFICATION — PUBLIC ACCESSIBILITY & PRIVATE ROUTE PROTECTION");
  console.log("================================================================================\n");

  let hasError = false;

  console.log("▶ Verifying Public Routes (Unauthenticated visitor should receive HTTP 200):");
  for (const route of PUBLIC_ROUTES) {
    try {
      const res = await fetchStatus(route);
      if (res.statusCode === 200) {
        console.log(`  ✓ GET ${route.padEnd(20)} => HTTP ${res.statusCode} (OK)`);
      } else {
        console.error(`  ✗ GET ${route.padEnd(20)} => HTTP ${res.statusCode} (Expected 200)`);
        hasError = true;
      }
    } catch (err) {
      console.error(`  ✗ GET ${route.padEnd(20)} => Connection error:`, err.message);
      hasError = true;
    }
  }

  console.log("\n▶ Verifying Private Routes (Unauthenticated visitor should be redirected to /login):");
  for (const route of PROTECTED_ROUTES) {
    try {
      const res = await fetchStatus(route);
      // Next.js middleware redirects unauthenticated users with 307 or 302 to /login
      if ((res.statusCode === 307 || res.statusCode === 302) && res.location && res.location.includes("/login")) {
        console.log(`  ✓ GET ${route.padEnd(20)} => HTTP ${res.statusCode} Redirect to: ${res.location}`);
      } else {
        console.error(`  ✗ GET ${route.padEnd(20)} => HTTP ${res.statusCode} (Expected redirect to /login, got Location: ${res.location})`);
        hasError = true;
      }
    } catch (err) {
      console.error(`  ✗ GET ${route.padEnd(20)} => Connection error:`, err.message);
      hasError = true;
    }
  }

  console.log("\n================================================================================");
  if (!hasError) {
    console.log("✓ ALL LIVE HTTP TESTS PASSED! Public routes accessible, private routes secured.");
    process.exit(0);
  } else {
    console.error("✗ ONE OR MORE LIVE HTTP TESTS FAILED.");
    process.exit(1);
  }
}

run();
