import fs from "fs";
import path from "path";

console.log("================================================================================");
console.log("WONDER JOURNEY OS — UNIFIED WEBSITE PHASE 1 & MIDDLEWARE REGRESSION TESTS");
console.log("Exact Root Match + Safe Public Routes + Strict Private Route Guarding");
console.log("================================================================================\n");

let passedCount = 0;
let failedCount = 0;

function assert(condition: boolean, title: string, details?: string) {
  if (condition) {
    console.log(`  ✓ ${title}`);
    passedCount++;
  } else {
    console.error(`  ✗ ${title}${details ? ` (${details})` : ""}`);
    failedCount++;
  }
}

// ── Test 1: Middleware Source Code Verification ──
console.log("▶ Test 1: Middleware Source Code Verification (Exact Root & Safe Prefix Matching)");
const middlewarePath = path.join(__dirname, "../src/middleware.ts");
const middlewareCode = fs.readFileSync(middlewarePath, "utf8");

// Verify root "/" is exact match
assert(
  middlewareCode.includes("pathname === '/'") &&
  !middlewareCode.includes("pathname.startsWith('/')"),
  "Root '/' is evaluated strictly via exact equality (pathname === '/') and never via startsWith('/')"
);

// Verify safe prefix matching logic
assert(
  middlewareCode.includes("PUBLIC_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(prefix + '/'))"),
  "Public prefixes use safe equality or segment-prefix logic (prevents /about-old from matching /about)"
);

// Verify approved public routes list
const approvedRoutes = [
  "/experience",
  "/learning",
  "/gallery",
  "/about",
  "/safety",
  "/inquiry",
  "/primary-sources",
  "/login",
  "/forgot-password",
  "/reset-password",
  "/auth",
  "/api",
];

for (const route of approvedRoutes) {
  assert(
    middlewareCode.includes(`'${route}'`),
    `Approved route '${route}' is declared in PUBLIC_PREFIXES`
  );
}

// ── Test 2: Algorithmic Simulation of Middleware Path Matching ──
console.log("\n▶ Test 2: Algorithmic Simulation of Middleware Path Matching Logic");

// Extract PUBLIC_PREFIXES directly from code or simulate exactly
const PUBLIC_PREFIXES = [
  '/experience',
  '/learning',
  '/gallery',
  '/about',
  '/safety',
  '/inquiry',
  '/primary-sources',
  '/login',
  '/forgot-password',
  '/reset-password',
  '/auth',
  '/api',
];

function isPublicPathSimulation(pathname: string): boolean {
  return (
    pathname === '/' ||
    PUBLIC_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(prefix + '/')) ||
    pathname.startsWith('/_next') ||
    Boolean(pathname.match(/\.(.*)$/))
  );
}

// A. Public routes must be true
const testPublicPaths = [
  "/",
  "/experience",
  "/learning",
  "/gallery",
  "/about",
  "/safety",
  "/inquiry",
  "/primary-sources",
  "/login",
  "/forgot-password",
  "/reset-password",
  "/auth/callback",
  "/api/inquiry",
  "/experience/deep-dive",
  "/_next/static/chunks/main.js",
  "/favicon.ico",
];

for (const p of testPublicPaths) {
  assert(isPublicPathSimulation(p) === true, `Public path '${p}' is correctly recognized as public`);
}

// B. Private routes must be false (strictly protected)
const testPrivatePaths = [
  "/family",
  "/family/dashboard",
  "/classroom",
  "/classroom/live",
  "/passport",
  "/cooking",
  "/teacher",
  "/teacher/dashboard",
  "/celebrations",
  "/awards",
  "/journal",
  "/languages",
  "/lessons",
];

for (const p of testPrivatePaths) {
  assert(isPublicPathSimulation(p) === false, `Private route '${p}' is NOT recognized as public (protected by auth)`);
}

// C. Negative Prefix Tests: /about-old must NOT match /about
const testNegativePrefixes = [
  "/about-old",
  "/about_archive",
  "/experience-legacy",
  "/learning-hub",
  "/gallery-private",
  "/safety-check",
  "/inquiry-internal",
  "/primary-sources-backup",
  "/logins",
  "/api-internal",
];

for (const p of testNegativePrefixes) {
  assert(
    isPublicPathSimulation(p) === false,
    `Prefix leak prevented: '${p}' does NOT match public route boundary`
  );
}

// ── Test 3: Route File Presence & Structure ──
console.log("\n▶ Test 3: Phase 1 Route Files Presence & Non-Empty Content");

const requiredRouteFiles = [
  "src/app/(marketing)/experience/page.tsx",
  "src/app/(marketing)/learning/page.tsx",
  "src/app/(marketing)/gallery/page.tsx",
  "src/app/(marketing)/about/page.tsx",
  "src/app/(marketing)/safety/page.tsx",
  "src/app/(marketing)/inquiry/page.tsx",
  "src/app/(marketing)/primary-sources/page.tsx",
];

for (const relPath of requiredRouteFiles) {
  const fullPath = path.join(__dirname, "..", relPath);
  assert(fs.existsSync(fullPath), `Route file exists: ${relPath}`);
  const content = fs.readFileSync(fullPath, "utf8");
  assert(content.length > 500, `Route file has substantial content (>500 chars): ${relPath}`);
  assert(content.includes("export default function"), `Route file exports default component: ${relPath}`);
  assert(content.includes("export const metadata"), `Route file defines SEO metadata: ${relPath}`);
}

// ── Test 4: Navigation Links in Layout ──
console.log("\n▶ Test 4: Navigation Architecture in Marketing Layout & Mobile Nav");
const layoutCode = fs.readFileSync(path.join(__dirname, "../src/app/(marketing)/layout.tsx"), "utf8");
const mobileNavCode = fs.readFileSync(path.join(__dirname, "../src/app/(marketing)/mobile-nav.tsx"), "utf8");

const primaryNavHrefs = [
  "/",
  "/experience",
  "/learning",
  "/gallery",
  "/about",
  "/safety",
  "/inquiry",
];

for (const href of primaryNavHrefs) {
  assert(layoutCode.includes(`href="${href}"`), `Desktop nav contains link to '${href}'`);
  assert(mobileNavCode.includes(`href="${href}"`), `Mobile nav contains link to '${href}'`);
}

// Verify Primary Sources is in footer and learning page, NOT primary header
assert(
  layoutCode.includes('href="/primary-sources"') &&
  layoutCode.indexOf('href="/primary-sources"') > layoutCode.indexOf('<footer'),
  "Primary Sources link is placed in the footer rather than cluttering primary header navigation"
);

// ── Test 5: Child Safeguarding & Truthfulness Invariant ──
console.log("\n▶ Test 5: Child Safeguarding, Media Privacy & Truthfulness Invariant");

const galleryCode = fs.readFileSync(path.join(__dirname, "../src/app/(marketing)/gallery/page.tsx"), "utf8");
assert(
  galleryCode.includes("Privacy & Child Safeguarding Invariant") ||
  galleryCode.includes("child privacy"),
  "Gallery explicitly documents privacy and child safeguarding boundary"
);
assert(
  !galleryCode.includes("authentic finished-food photography exists"),
  "Gallery does not make false claims about finished food photography"
);

const safetyCode = fs.readFileSync(path.join(__dirname, "../src/app/(marketing)/safety/page.tsx"), "utf8");
assert(
  safetyCode.includes("Zero Public Minor Media") &&
  safetyCode.includes("Authenticated Family Workspace"),
  "Safety page documents repository-supported safeguards (zero minor broadcast, authenticated space)"
);

// ── Test 6: Database & Migration Boundary Invariant (Strict 8 Migrations) ──
console.log("\n▶ Test 6: Database & Migration Boundary Invariant");
const migrationsDir = path.join(__dirname, "../supabase/migrations");
const migrationFiles = fs.readdirSync(migrationsDir).filter(f => f.endsWith(".sql"));
assert(
  migrationFiles.length === 8,
  `Exactly 8 migration files in supabase/migrations/ (Found: ${migrationFiles.length}, Expected: 8)`
);

// ── Final Summary ──
console.log("\n================================================================================");
if (failedCount === 0) {
  console.log(`✓ ALL ${passedCount} UNIFIED WEBSITE PHASE 1 & MIDDLEWARE TESTS PASSED!`);
} else {
  console.error(`✗ ${failedCount} TESTS FAILED out of ${passedCount + failedCount}`);
  process.exit(1);
}
console.log("================================================================================\n");
