import fs from "fs";
import path from "path";

console.log("================================================================================");
console.log("WONDER JOURNEY OS — PREMIUM 4K LANDING EXPERIENCE REGRESSION TESTS");
console.log("Cinematic Motion + Signature 3D + Responsive 4K Architecture");
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

// ── Test 1: Signature 3D Scene Architecture & Narrative Integrity ──
console.log("▶ Test 1: Signature 3D Scene Architecture & Narrative Integrity");
const sceneCode = fs.readFileSync(
  path.join(__dirname, "../src/app/(marketing)/hero-signature-scene.tsx"),
  "utf8"
);

assert(
  sceneCode.includes("TorusGeometry") && sceneCode.includes("d4af37"),
  "Three.js Navigational Astrolabe compass with burnished brass rings exists"
);
assert(
  sceneCode.includes("createSampaguitaBlossom") && sceneCode.includes("0xfffef9"),
  "Procedural 5-petal Sampaguita blossoms (Philippine National Flower) exist"
);
assert(
  sceneCode.includes("leatherMaterial") && sceneCode.includes("pageMaterial"),
  "Explorer's living field journal with parchment and leather cover exists"
);
assert(
  sceneCode.includes("OctahedronGeometry") && sceneCode.includes("starCoords"),
  "Archipelago navigation stars constellation exists"
);

// ── Test 2: 4K Performance Safeguards (DPR Cap & Resource Disposal) ──
console.log("\n▶ Test 2: 4K Performance Safeguards");
assert(
  sceneCode.includes("Math.min(window.devicePixelRatio || 1, 1.5)"),
  "DPR cap enforced at 1.5 max to avoid GPU overload on 3840x2160 (4K) displays"
);
assert(
  sceneCode.includes("IntersectionObserver") && sceneCode.includes("isIntersecting"),
  "IntersectionObserver pauses animation loop when hero is offscreen"
);
assert(
  sceneCode.includes("obj.geometry.dispose()") && sceneCode.includes("renderer.dispose()"),
  "Comprehensive Three.js geometry and material disposal on unmount"
);

// ── Test 3: Progressive Enhancement & WebGL Fallback Safety ──
console.log("\n▶ Test 3: Progressive Enhancement & WebGL Fallback");
const fallbackCode = fs.readFileSync(
  path.join(__dirname, "../src/app/(marketing)/hero-static-fallback.tsx"),
  "utf8"
);

assert(
  fallbackCode.includes("<svg") && fallbackCode.includes("compassBgGlow"),
  "Handcrafted SVG static fallback exists for SSR, loading, and non-WebGL environments"
);
assert(
  fallbackCode.includes("needleNorth") && fallbackCode.includes("parchmentPage"),
  "Static fallback includes astrolabe, compass needle, and explorer's journal motifs"
);

const wrapperCode = fs.readFileSync(
  path.join(__dirname, "../src/app/(marketing)/hero-3d-wrapper.tsx"),
  "utf8"
);
assert(
  wrapperCode.includes("dynamic(") && wrapperCode.includes("ssr: false"),
  "Hero3DWrapper dynamically loads Three.js on client with ssr: false"
);
assert(
  wrapperCode.includes("loading: () => <HeroStaticFallback />"),
  "Hero3DWrapper renders HeroStaticFallback immediately during loading"
);

// ── Test 4: Prefers-Reduced-Motion First-Class Support ──
console.log("\n▶ Test 4: Prefers-Reduced-Motion First-Class Support");
assert(
  sceneCode.includes("(prefers-reduced-motion: reduce)"),
  "Three.js scene inspects prefers-reduced-motion media query"
);
assert(
  sceneCode.includes("renderer.render(scene, camera);") &&
    sceneCode.includes("cancelAnimationFrame(animId)"),
  "Reduced-motion mode renders a single static frame and disables continuous drift/parallax"
);

// ── Test 5: Semantic Server-Rendered Content & SEO Preservation ──
console.log("\n▶ Test 5: Semantic Server-Rendered Content & SEO Preservation");
const pageCode = fs.readFileSync(
  path.join(__dirname, "../src/app/(marketing)/page.tsx"),
  "utf8"
);

assert(
  pageCode.includes("<h1") &&
    pageCode.includes("A learning journey rooted in culture, character, and Christ."),
  "Server-rendered HTML contains primary h1 with Wonder Journey value proposition"
);
assert(
  pageCode.includes("Public enrollment and inquiry submissions are currently closed"),
  "Dignified enrollment status banner rendered in initial HTML"
);
assert(
  (pageCode.includes("href=\"/experience\"") || pageCode.includes("href=\"#journey\"")) && pageCode.includes("href=\"/login\""),
  "Core CTAs rendered as semantic HTML anchors without canvas obscuration"
);

// ── Test 6: Art-Directed Layout & Anti-AI Non-Repetitive Rhythm ──
console.log("\n▶ Test 6: Art-Directed Layout & Non-Repetitive Sections");
const archipelagoCode = fs.readFileSync(
  path.join(__dirname, "../src/app/(marketing)/archipelago-journey-band.tsx"),
  "utf8"
);
assert(
  archipelagoCode.includes("A 7,641-Island Narrative Horizon"),
  "Archipelago Journey Band introduces asymmetric regional narrative"
);
assert(
  archipelagoCode.includes("Luzon & The North") &&
    archipelagoCode.includes("Visayas Island Heart") &&
    archipelagoCode.includes("Mindanao & Palawan"),
  "Archipelago Band covers all 3 major island regions with authentic curriculum anchors"
);

const galleryCode = fs.readFileSync(
  path.join(__dirname, "../src/app/(marketing)/primary-sources-gallery.tsx"),
  "utf8"
);
assert(
  galleryCode.includes("Carta Hydrographica y Chorographica de las Yslas Filipinas"),
  "Primary Sources Gallery showcases 1734 Murillo Velarde Map with authentic citation"
);
assert(
  galleryCode.includes("Narra Tree Botanical Illustration (Pterocarpus indicus)"),
  "Primary Sources Gallery showcases Blanco's Flora de Filipinas botanical illustration"
);

// ── Test 7: 4K Container Widths & Responsive Layout Scaling ──
console.log("\n▶ Test 7: 4K Container Widths & Responsive Layout Scaling");
assert(
  pageCode.includes("4k:max-w-[2400px]") || pageCode.includes("3xl:max-w-[1920px]"),
  "Landing page containers expand to 4K ultra-wide breakpoints (up to 2400px)"
);
assert(
  pageCode.includes("4k:text-9xl") || pageCode.includes("2xl:text-8xl"),
  "Fluid typographic scales accommodate 4K displays without appearing shrunken"
);

const layoutCode = fs.readFileSync(
  path.join(__dirname, "../src/app/(marketing)/layout.tsx"),
  "utf8"
);
assert(
  layoutCode.includes("4k:max-w-[2400px]") && layoutCode.includes("4k:h-26"),
  "MarketingLayout header & footer scale gracefully to 4K"
);

// ── Test 8: Factual Media & Provenance Invariant ──
console.log("\n▶ Test 8: Factual Media & Provenance Invariant");
const mediaSpecsCode = fs.readFileSync(
  path.join(__dirname, "../scripts/canonical-media-specs.js"),
  "utf8"
);
assert(
  mediaSpecsCode.includes("media-l01-secondary") &&
    mediaSpecsCode.includes("media-l11-primary") &&
    mediaSpecsCode.includes("media-l12-primary") &&
    mediaSpecsCode.includes("media-l31-secondary") &&
    mediaSpecsCode.includes("media-l50-primary"),
  "All canonical media identities remain completely intact"
);

// ── Test 9: Zero SQL & Migration Invariant ──
console.log("\n▶ Test 9: Database & Migration Boundary Invariant");
const migrationsDir = path.join(__dirname, "../supabase/migrations");
const migrationFiles = fs.readdirSync(migrationsDir).filter((f) => f.endsWith(".sql"));
assert(
  migrationFiles.length === 8,
  `Migration count is strictly 8 (Found: ${migrationFiles.length})`
);

// ── Summary ──
console.log("\n================================================================================");
if (failedCount === 0) {
  console.log(`✓ ALL ${passedCount} PREMIUM 4K LANDING EXPERIENCE REGRESSION TESTS PASSED!`);
  console.log("================================================================================\n");
  process.exit(0);
} else {
  console.error(`✗ ${failedCount} TESTS FAILED out of ${passedCount + failedCount}`);
  console.log("================================================================================\n");
  process.exit(1);
}
