const fs = require("fs");
const path = require("path");

console.log("Running Broken Links & Local Asset Verification Audit...");

const publicDir = path.join(__dirname, "../public");
const appDir = path.join(__dirname, "../src/app");
let failures = [];
let checkedAssets = 0;
let checkedRoutes = 0;

// 1. Verify mandatory PWA and brand icons exist in public/
const mandatoryAssets = [
  "apple-touch-icon.png",
  "icon.svg",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/icon-maskable-512.png"
];

mandatoryAssets.forEach(assetRel => {
  checkedAssets++;
  const fullPath = path.join(publicDir, assetRel);
  if (!fs.existsSync(fullPath)) {
    failures.push(`Missing mandatory public asset: /public/${assetRel}`);
  }
});

// 2. Scan navigation and route configurations
const navContent = fs.readFileSync(path.join(__dirname, "../src/config/navigation.ts"), "utf8");
const navPathMatches = navContent.matchAll(/href:\s*["']([^"']+)["']/g);

for (const match of navPathMatches) {
  const route = match[1];
  checkedRoutes++;

  // Ignore root and external links
  if (route === "/" || route.startsWith("http")) continue;

  // Check if corresponding directory or route exists in src/app/(app)/ or src/app/(auth)/ or src/app/
  const routeSlug = route.replace(/^\//, "");
  const inApp = fs.existsSync(path.join(appDir, "(app)", routeSlug, "page.tsx"));
  const inAuth = fs.existsSync(path.join(appDir, "(auth)", routeSlug, "page.tsx"));
  const inRoot = fs.existsSync(path.join(appDir, routeSlug, "page.tsx"));
  const inDynamic = fs.existsSync(path.join(appDir, "(app)", routeSlug.split("/")[0], "[id]", "page.tsx"));

  if (!inApp && !inAuth && !inRoot && !inDynamic) {
    failures.push(`Navigation route "${route}" does not correspond to an existing Next.js page.`);
  }
}

if (failures.length > 0) {
  console.error("FAIL: Broken Links & Asset Audit failed:");
  failures.forEach(f => console.error(`  - ${f}`));
  process.exit(1);
}

console.log(`PASS: Verified ${checkedAssets} static brand/PWA assets and ${checkedRoutes} navigation paths with 0 broken links.`);
process.exit(0);
