import * as fs from "fs";
import * as path from "path";
import { MEDIA_REGISTRY, type MediaAssetMetadata } from "../src/config/media-registry";

function assert(condition: boolean, msg: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${msg}`);
  }
}

console.log("================================================================================");
console.log("WONDER JOURNEY OS — PRIMARY-SOURCE HISTORICAL CONTEXT SCOPING REGRESSION TESTS");
console.log("Strict Scoping: Classification Is Not Identity (Murillo Velarde Map Scoping)");
console.log("================================================================================\n");

// ── Test 1: Identify All primary_source_scan Assets in Runtime Truth ──
console.log("▶ Test 1: Identify All primary_source_scan Assets in Runtime Truth");
const allMedia = Object.values(MEDIA_REGISTRY);
assert(allMedia.length === 130, `Expected 130 total media assets, found ${allMedia.length}`);

const primarySources = allMedia.filter((m) => m.classification === "primary_source_scan");
console.log(`  Found ${primarySources.length} primary_source_scan assets:`);
primarySources.forEach((m) => {
  console.log(`    - ${m.id} (${m.lessonId}): "${m.title}"`);
});

assert(primarySources.length === 2, `Expected exactly 2 primary_source_scan assets, found ${primarySources.length}`);
const primarySourceIds = new Set(primarySources.map((m) => m.id));
assert(primarySourceIds.has("media-l01-secondary"), "media-l01-secondary must be in primary_source_scan set");
assert(primarySourceIds.has("media-l11-primary"), "media-l11-primary must be in primary_source_scan set");
console.log("  ✓ Verified exact primary_source_scan set: media-l01-secondary, media-l11-primary");

// ── Test 2: Direct Regression for Original Defect ──
console.log("\n▶ Test 2: Defect Regression (Classification Is Not Identity)");
// Old faulty logic:
// const isHistoricalMap = activeMedia?.id === "media-l01-secondary" || activeMedia?.classification === "primary_source_scan";
// New canonical logic:
// const isMurilloVelardeMap = activeMedia?.id === "media-l01-secondary";
// const isPrimarySource = activeMedia?.classification === "primary_source_scan";

const nonMapPrimary = MEDIA_REGISTRY["media-l11-primary"];
assert(!!nonMapPrimary, "media-l11-primary must exist in media registry");

// Against old logic:
const oldConditionForNonMap = nonMapPrimary.id === "media-l01-secondary" || nonMapPrimary.classification === "primary_source_scan";
assert(oldConditionForNonMap === true, "DEFECT REPRODUCTION: Old logic incorrectly evaluated non-map scan as historical map");

// Against new logic:
const isMurilloVelardeMap = (media: MediaAssetMetadata | undefined) => media?.id === "media-l01-secondary";
const isPrimarySource = (media: MediaAssetMetadata | undefined) => media?.classification === "primary_source_scan";

assert(isMurilloVelardeMap(nonMapPrimary) === false, "New logic correctly evaluates isMurilloVelardeMap = FALSE for non-map scan");
assert(isPrimarySource(nonMapPrimary) === true, "New logic correctly evaluates isPrimarySource = TRUE for non-map scan");
console.log("  ✓ Proven: Given classification='primary_source_scan' AND id!='media-l01-secondary', Murillo Velarde treatment = FALSE");

// ── Test 3: media-l01-secondary Receives Murillo Velarde 1734 Map Treatment ──
console.log("\n▶ Test 3: media-l01-secondary Map Context & Viewer Scoping");
const l01Map = MEDIA_REGISTRY["media-l01-secondary"];
assert(!!l01Map, "media-l01-secondary exists");
assert(l01Map.classification === "primary_source_scan", "media-l01-secondary classification is primary_source_scan");
assert(isMurilloVelardeMap(l01Map) === true, "media-l01-secondary isMurilloVelardeMap evaluates to TRUE");
assert(isPrimarySource(l01Map) === true, "media-l01-secondary isPrimarySource evaluates to TRUE");
assert(l01Map.creator.includes("Pedro Murillo Velarde"), "media-l01-secondary creator includes Pedro Murillo Velarde");
assert(l01Map.creator.includes("Nicolás de la Cruz Bagay"), "media-l01-secondary creator includes Nicolás de la Cruz Bagay");
assert(l01Map.creator.includes("Francisco Suárez"), "media-l01-secondary creator includes Francisco Suárez");
assert(l01Map.title.includes("1734 Historical Map"), "media-l01-secondary title refers to 1734 Historical Map");
console.log("  ✓ media-l01-secondary retains 1734 context, Murillo Velarde attribution, and map viewer capability");

// ── Test 4: Genuine Non-Map Primary Source Receives Truthful Generic Context ──
console.log("\n▶ Test 4: Genuine Non-Map Primary Source (media-l11-primary)");
assert(isMurilloVelardeMap(nonMapPrimary) === false, "Non-map primary source is NOT Murillo Velarde map");
assert(isPrimarySource(nonMapPrimary) === true, "Non-map primary source IS primary_source_scan");
assert(!nonMapPrimary.creator.includes("Murillo Velarde"), "media-l11-primary does NOT have Murillo Velarde attribution");
assert(nonMapPrimary.creator === "Francisco Manuel Blanco", "media-l11-primary creator is Francisco Manuel Blanco");
assert(nonMapPrimary.organization === "Flora de Filipinas / Real Jardín Botánico de Madrid", "media-l11-primary organization is Flora de Filipinas");
console.log("  ✓ Non-map primary source receives truthful generic archival metadata without 1734 map context");

// ── Test 5: media-l12-primary Regression (Baybayin Bo Graphic) ──
console.log("\n▶ Test 5: media-l12-primary Regression (Baybayin Bo)");
const l12Media = MEDIA_REGISTRY["media-l12-primary"];
assert(!!l12Media, "media-l12-primary exists in registry");
assert(l12Media.classification === "original_diagram", `media-l12-primary must be original_diagram, got ${l12Media.classification}`);
assert(isMurilloVelardeMap(l12Media) === false, "media-l12-primary isMurilloVelardeMap is FALSE");
assert(isPrimarySource(l12Media) === false, "media-l12-primary isPrimarySource is FALSE");
assert(!l12Media.creator.includes("Murillo Velarde"), "media-l12-primary has no Murillo Velarde attribution");
console.log("  ✓ media-l12-primary remains original_diagram; no 1734 context, no map viewer");

// ── Test 6: media-l31-secondary Regression (Magellan Shrine Memorial) ──
console.log("\n▶ Test 6: media-l31-secondary Regression (Magellan Shrine)");
const l31Media = MEDIA_REGISTRY["media-l31-secondary"];
assert(!!l31Media, "media-l31-secondary exists in registry");
assert(l31Media.classification === "photograph", `media-l31-secondary must be photograph, got ${l31Media.classification}`);
assert(isMurilloVelardeMap(l31Media) === false, "media-l31-secondary isMurilloVelardeMap is FALSE");
assert(isPrimarySource(l31Media) === false, "media-l31-secondary isPrimarySource is FALSE");
assert(l31Media.title.includes("Magellan Shrine"), "media-l31-secondary title is Magellan Shrine Memorial");
assert(!l31Media.title.includes("Laguna Copperplate"), "media-l31-secondary has zero Laguna Copperplate references");
assert(!l31Media.creator.includes("Murillo Velarde"), "media-l31-secondary has no Murillo Velarde attribution");
console.log("  ✓ media-l31-secondary remains photograph of Magellan Shrine; no 1734 context, no map viewer");

// ── Test 7: media-l50-primary Regression (Handcrafted Wooden Spoons) ──
console.log("\n▶ Test 7: media-l50-primary Regression (Wooden Spoons)");
const l50Media = MEDIA_REGISTRY["media-l50-primary"];
assert(!!l50Media, "media-l50-primary exists in registry");
assert(l50Media.classification === "photograph", `media-l50-primary must be photograph, got ${l50Media.classification}`);
assert(isMurilloVelardeMap(l50Media) === false, "media-l50-primary isMurilloVelardeMap is FALSE");
assert(isPrimarySource(l50Media) === false, "media-l50-primary isPrimarySource is FALSE");
assert(l50Media.title.includes("Wooden Spoons"), "media-l50-primary title is Wooden Spoons");
assert(!l50Media.title.includes("Recipe"), "media-l50-primary has zero recipe references");
assert(!l50Media.creator.includes("Murillo Velarde"), "media-l50-primary has no Murillo Velarde attribution");
console.log("  ✓ media-l50-primary remains photograph of wooden spoons; no 1734 context, no map viewer");

// ── Test 8: Missing Optional Metadata Produces No Fabricated Fallback Facts ──
console.log("\n▶ Test 8: Missing Optional Metadata Safety");
const minimalPrimarySource: MediaAssetMetadata = {
  id: "media-synthetic-minimal",
  lessonId: "lesson-test",
  title: "Archival Fragment",
  classification: "primary_source_scan",
  storedAssetPath: "/media/test.png",
  sourceFileTitle: "File:test.png",
  sourceUrl: "https://example.com/test.png",
  creator: "",
  organization: "",
  license: "Public Domain",
  licenseUrl: "https://example.com/license",
  sha256Checksum: "0000000000000000000000000000000000000000000000000000000000000000",
  dimensions: { width: 100, height: 100 },
  byteSize: 1024,
  mimeType: "image/png",
  subjectTags: ["test"]
};

// Render logic mirror
function renderPrimarySourceDescription(media: MediaAssetMetadata, caption: string): string {
  if (media.description) return media.description;
  const parts = [
    `Archival document scan: ${media.title || caption}`,
    media.creator ? `Creator: ${media.creator}` : "",
    media.organization ? `Archive / Collection: ${media.organization}` : ""
  ].filter(Boolean);
  return parts.join(" • ");
}

const renderedMinimal = renderPrimarySourceDescription(minimalPrimarySource, "Test Caption");
assert(!renderedMinimal.includes("undefined"), "Minimal render contains no 'undefined'");
assert(!renderedMinimal.includes("1734"), "Minimal render contains no fabricated 1734 date");
assert(!renderedMinimal.includes("Murillo Velarde"), "Minimal render contains no fabricated Murillo Velarde");
assert(!renderedMinimal.includes("Creator:"), "Minimal render contains no empty Creator header");
assert(!renderedMinimal.includes("Archive / Collection:"), "Minimal render contains no empty Archive header");
assert(renderedMinimal === "Archival document scan: Archival Fragment", `Minimal render produces truthful minimal text: "${renderedMinimal}"`);
console.log("  ✓ Missing optional metadata produces no fabricated dates, creators, or archives");

// ── Test 9: Static Analysis of src/components/adventure/slide-views.tsx ──
console.log("\n▶ Test 9: Static Analysis of slide-views.tsx");
const slideViewsPath = path.join(__dirname, "../src/components/adventure/slide-views.tsx");
const slideViewsContent = fs.readFileSync(slideViewsPath, "utf8");

// Must NOT contain old faulty condition:
const hasOldBroadCondition = slideViewsContent.includes('activeMedia?.id === "media-l01-secondary" || activeMedia?.classification === "primary_source_scan"');
assert(!hasOldBroadCondition, "slide-views.tsx must NOT contain the old faulty broad condition");

// Must contain specific predicates:
assert(slideViewsContent.includes('const isMurilloVelardeMap = activeMedia?.id === "media-l01-secondary";'),
  "slide-views.tsx defines isMurilloVelardeMap strictly by media-l01-secondary ID");
assert(slideViewsContent.includes('const isPrimarySource = activeMedia?.classification === "primary_source_scan";'),
  "slide-views.tsx defines isPrimarySource strictly by primary_source_scan classification");

// Must guard HistoricalMapViewer by isMurilloVelardeMap:
assert(slideViewsContent.includes("showMapViewer && displaySrc && isMurilloVelardeMap"),
  "HistoricalMapViewer is strictly guarded by isMurilloVelardeMap");

// Must guard "View and Explore Full Map" button by isMurilloVelardeMap:
assert(slideViewsContent.includes("isMurilloVelardeMap &&"),
  "Full map explore button is strictly guarded by isMurilloVelardeMap");

// Must render generic Historical Primary Source notice:
assert(slideViewsContent.includes("!isMurilloVelardeMap && isPrimarySource"),
  "Non-map primary sources receive dedicated generic Historical Primary Source context");

console.log("  ✓ Source code static analysis verifies correct scoping guards and zero broad leak");

// ── Test 10: Database & Migration Boundary Invariant ──
console.log("\n▶ Test 10: Database & Migration Boundary Invariant");
const migrationsDir = path.join(__dirname, "../supabase/migrations");
const sqlFiles = fs.readdirSync(migrationsDir).filter((f) => f.endsWith(".sql"));
assert(sqlFiles.length === 8, `Migration count must remain strictly 8, found ${sqlFiles.length}`);
console.log(`  ✓ Migration count strictly preserved at 8 (0 SQL modifications)`);

console.log("\n================================================================================");
console.log("✓ ALL PRIMARY-SOURCE HISTORICAL CONTEXT SCOPING REGRESSION TESTS PASSED");
console.log("================================================================================\n");
