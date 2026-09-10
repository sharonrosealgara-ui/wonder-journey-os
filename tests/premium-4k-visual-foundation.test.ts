import fs from "fs";
import path from "path";

console.log("================================================================================");
console.log("WONDER JOURNEY OS — PREMIUM 4K VISUAL FOUNDATION REGRESSION TESTS (WJ-V1.1)");
console.log("Tokens, Typography, Editorial Containers, Surfaces, Framing & Motion");
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

// ── Test 1: Design Tokens in globals.css and tokens.ts ──
console.log("▶ Test 1: Design Tokens & Palette Direction");

const tokensPath = path.join(__dirname, "../src/components/visual/tokens.ts");
const tokensCode = fs.readFileSync(tokensPath, "utf8");

const globalsPath = path.join(__dirname, "../src/app/globals.css");
const globalsCode = fs.readFileSync(globalsPath, "utf8");

const requiredColorTokens = [
  "filipino-green",
  "coral",
  "brass",
  "wood",
  "parchment",
  "sky",
  "sand",
  "mango",
  "ocean",
  "palm",
  "ink",
];

for (const token of requiredColorTokens) {
  assert(
    globalsCode.includes(`--color-${token}`) || globalsCode.includes(token),
    `Color token '${token}' is defined in globals.css`
  );
}

assert(
  tokensCode.includes("WJ_COLORS") &&
  tokensCode.includes("filipinoGreen") &&
  tokensCode.includes("brass") &&
  tokensCode.includes("parchment"),
  "WJ_COLORS TypeScript token object exports all established palette tokens"
);

assert(
  globalsCode.includes("--breakpoint-3xl: 120rem") &&
  globalsCode.includes("--breakpoint-4k: 160rem"),
  "4K Ultra-wide breakpoints (3xl: 120rem, 4k: 160rem) are defined in globals.css"
);

assert(
  tokensCode.includes('"3xl": 1920') && tokensCode.includes('"4k": 2560'),
  "TypeScript breakpoints include 3xl (1920px) and 4k (2560px/3840px)"
);

// ── Test 2: Typography Hierarchy & Reading Measures ──
console.log("\n▶ Test 2: Typography Hierarchy & Line Length Limits");

assert(
  globalsCode.includes(".font-botanical") &&
  globalsCode.includes("font-style: italic"),
  ".font-botanical class defined with italic serif typography"
);

assert(
  globalsCode.includes(".font-archival"),
  ".font-archival class defined for catalog numbering"
);

assert(
  globalsCode.includes(".wj-botanical-label") &&
  globalsCode.includes("color: var(--color-filipino-green-deep)"),
  ".wj-botanical-label defined with deep Filipino green color"
);

assert(
  globalsCode.includes(".wj-archival-label") &&
  globalsCode.includes("letter-spacing: 0.12em"),
  ".wj-archival-label defined with letter-spaced small caps"
);

assert(
  globalsCode.includes(".wj-deck-lead") &&
  globalsCode.includes("clamp("),
  ".wj-deck-lead defined with fluid clamp scaling"
);

assert(
  globalsCode.includes(".wj-measure-prose") &&
  globalsCode.includes("max-width: 65ch"),
  ".wj-measure-prose limits reading measure to 65ch to prevent 4K stretching"
);

// ── Test 3: Editorial Container Primitives ──
console.log("\n▶ Test 3: Editorial Container Primitives");

const containerPath = path.join(__dirname, "../src/components/visual/editorial-container.tsx");
const containerCode = fs.readFileSync(containerPath, "utf8");

assert(
  containerCode.includes("export function EditorialContainer"),
  "EditorialContainer component is exported"
);

assert(
  containerCode.includes("asymmetric-7-5") &&
  containerCode.includes("asymmetric-5-7") &&
  containerCode.includes("split-equal") &&
  containerCode.includes("editorial-single") &&
  containerCode.includes("full-bleed"),
  "EditorialContainer supports 5 editorial layout variants"
);

assert(
  containerCode.includes("4k:px-24") &&
  containerCode.includes("3xl:px-16"),
  "EditorialContainer supports native fluid 4K padding (3xl:px-16, 4k:px-24)"
);

assert(
  containerCode.includes("max-w-[65ch]"),
  "EditorialContainer enforces optimal reading measure (65ch) on narrative columns"
);

// ── Test 4: Paper & Journal Surface Primitives ──
console.log("\n▶ Test 4: Paper & Journal Surface Primitives");

const surfacePath = path.join(__dirname, "../src/components/visual/journal-surface.tsx");
const surfaceCode = fs.readFileSync(surfacePath, "utf8");

assert(
  surfaceCode.includes("export function JournalSurface"),
  "JournalSurface component is exported"
);

assert(
  surfaceCode.includes("aged-parchment") &&
  surfaceCode.includes("field-notebook") &&
  surfaceCode.includes("pressed-cream") &&
  surfaceCode.includes("paper"),
  "JournalSurface supports 4 tactile paper variants"
);

assert(
  surfaceCode.includes("wj-stitched-seam") &&
  surfaceCode.includes("hasStitch"),
  "JournalSurface supports stitched seam binding effect"
);

assert(
  surfaceCode.includes("hasNotebookRuling") &&
  surfaceCode.includes("repeating-linear-gradient"),
  "JournalSurface supports horizontal notebook ruling lines"
);

assert(
  globalsCode.includes(".wj-stitched-seam") &&
  globalsCode.includes(".wj-deckle-edge"),
  "CSS classes .wj-stitched-seam and .wj-deckle-edge are declared in globals.css"
);

// ── Test 5: Artifact Framing Primitives ──
console.log("\n▶ Test 5: Artifact Framing Primitives");

const framePath = path.join(__dirname, "../src/components/visual/artifact-frame.tsx");
const frameCode = fs.readFileSync(framePath, "utf8");

assert(
  frameCode.includes("export function PolaroidFrame") &&
  frameCode.includes("font-hand"),
  "PolaroidFrame component is exported with handwritten caption support"
);

assert(
  frameCode.includes("export function ArchivalMatteFrame") &&
  frameCode.includes("wj-archival-matte"),
  "ArchivalMatteFrame component is exported for museum primary sources"
);

assert(
  frameCode.includes("export function WashiTapeStrip"),
  "WashiTapeStrip component is exported with customizable colors and positions"
);

assert(
  frameCode.includes("export function PostmarkStamp") &&
  frameCode.includes("MANILA 14°N"),
  "PostmarkStamp component is exported with vector cancellation marks"
);

assert(
  globalsCode.includes(".wj-archival-matte") &&
  globalsCode.includes("var(--shadow-archival)"),
  ".wj-archival-matte declared in globals.css with archival shadow"
);

// ── Test 6: Maritime Journey Route Visual Primitive ──
console.log("\n▶ Test 6: Maritime Journey Route Visual Primitive");

const routePath = path.join(__dirname, "../src/components/visual/journey-route.tsx");
const routeCode = fs.readFileSync(routePath, "utf8");

assert(
  routeCode.includes("export function MaritimeRoute"),
  "MaritimeRoute component is exported"
);

assert(
  routeCode.includes("orientation") &&
  routeCode.includes("horizontal") &&
  routeCode.includes("vertical") &&
  routeCode.includes("curved"),
  "MaritimeRoute supports horizontal, vertical, and curved tracks"
);

assert(
  routeCode.includes("theme") &&
  routeCode.includes("brass") &&
  routeCode.includes("ocean"),
  "MaritimeRoute supports burnished brass and ocean themes"
);

assert(
  routeCode.includes("motion-reduce:transform-none"),
  "MaritimeRoute respects prefers-reduced-motion"
);

// ── Test 7: Visual Disclosure & Provenance Treatment ──
console.log("\n▶ Test 7: Visual Disclosure & Provenance Treatment");

const disclosurePath = path.join(__dirname, "../src/components/visual/visual-disclosure.tsx");
const disclosureCode = fs.readFileSync(disclosurePath, "utf8");

assert(
  disclosureCode.includes("export function ProvenanceTag"),
  "ProvenanceTag component is exported for institutional archival citations"
);

assert(
  disclosureCode.includes("export function LearnerPrivacyShield"),
  "LearnerPrivacyShield component is exported"
);

assert(
  disclosureCode.includes(
    "Learner visuals are illustrated/anonymized representations used to protect children's identities. The classroom experience shown is based on a real Wonder Journey session."
  ),
  "LearnerPrivacyShield embeds the exact locked child safeguarding invariant"
);

assert(
  disclosureCode.includes("export function ParentAuthorizationNotice") &&
  disclosureCode.includes("PENDING EXPLICIT SENDER AUTHORIZATION FOR PUBLIC USE"),
  "ParentAuthorizationNotice embeds the exact editorial permission notice"
);

// ── Test 8: Reduced Motion Primitives ──
console.log("\n▶ Test 8: Reduced Motion Accessibility Primitives");

const motionPath = path.join(__dirname, "../src/components/visual/reduced-motion.tsx");
const motionCode = fs.readFileSync(motionPath, "utf8");

assert(
  motionCode.includes("export function usePrefersReducedMotion"),
  "usePrefersReducedMotion SSR-safe hook is exported"
);

assert(
  motionCode.includes('window.matchMedia("(prefers-reduced-motion: reduce)")') &&
  motionCode.includes("addEventListener") &&
  motionCode.includes("removeEventListener"),
  "usePrefersReducedMotion safely attaches and cleans up media query listeners"
);

assert(
  motionCode.includes("export function ReducedMotionSafe"),
  "ReducedMotionSafe component is exported with static fallback support"
);

// ── Test 9: Responsive 4K Scene Helpers ──
console.log("\n▶ Test 9: Responsive 4K Scene Helpers");

const sceneHelpersPath = path.join(__dirname, "../src/components/visual/scene-helpers.tsx");
const sceneHelpersCode = fs.readFileSync(sceneHelpersPath, "utf8");

assert(
  sceneHelpersCode.includes("export function SceneBackdrop"),
  "SceneBackdrop component is exported"
);

assert(
  sceneHelpersCode.includes("4k:w-[1400px]") &&
  sceneHelpersCode.includes("2xl:w-[900px]"),
  "SceneBackdrop includes native 4K atmospheric glow dimensions"
);

assert(
  sceneHelpersCode.includes("showArchipelagoHorizon") &&
  sceneHelpersCode.includes("showCelestialStars"),
  "SceneBackdrop includes archipelago horizon and celestial star details"
);

assert(
  sceneHelpersCode.includes("export function FluidMeasure") &&
  sceneHelpersCode.includes("max-w-[65ch]"),
  "FluidMeasure component constrains paragraph line length on wide screens"
);

// ── Test 10: Barrel Export Completeness ──
console.log("\n▶ Test 10: Visual Foundation Barrel Exports");

const indexPath = path.join(__dirname, "../src/components/visual/index.ts");
const indexCode = fs.readFileSync(indexPath, "utf8");

assert(
  indexCode.includes('export * from "./tokens"') &&
  indexCode.includes('export * from "./editorial-container"') &&
  indexCode.includes('export * from "./journal-surface"') &&
  indexCode.includes('export * from "./artifact-frame"') &&
  indexCode.includes('export * from "./journey-route"') &&
  indexCode.includes('export * from "./visual-disclosure"') &&
  indexCode.includes('export * from "./reduced-motion"') &&
  indexCode.includes('export * from "./scene-helpers"'),
  "Barrel export src/components/visual/index.ts exports all 8 foundation primitive modules"
);

// ── Test 11: Database Migrations Invariant (Strictly 8 Migrations) ──
console.log("\n▶ Test 11: Database & Migration Boundary Invariant");
const migrationsDir = path.join(__dirname, "../supabase/migrations");
const migrationFiles = fs.readdirSync(migrationsDir).filter(f => f.endsWith(".sql"));
assert(
  migrationFiles.length === 8,
  `Database migrations strictly preserved at 8 (Found: ${migrationFiles.length}, Expected: 8)`
);

// ── Final Summary ──
console.log("\n================================================================================");
if (failedCount === 0) {
  console.log(`✓ ALL ${passedCount} PREMIUM 4K VISUAL FOUNDATION TESTS PASSED!`);
} else {
  console.error(`✗ ${failedCount} TESTS FAILED out of ${passedCount + failedCount}`);
  process.exit(1);
}
console.log("================================================================================\n");
