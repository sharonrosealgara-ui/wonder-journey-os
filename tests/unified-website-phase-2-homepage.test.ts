import fs from "fs";
import path from "path";

console.log("================================================================================");
console.log("WONDER JOURNEY OS — UNIFIED WEBSITE PHASE 2 HOMEPAGE REGRESSION TESTS");
console.log("Experience-First Homepage Composition + Content Relocation Invariants");
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

function normalizeHtmlEntities(str: string): string {
  return str
    .replace(/&apos;/g, "'")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/&bull;/g, "•")
    .replace(/&quot;/g, '"')
    .replace(/&ldquo;/g, "“")
    .replace(/&rdquo;/g, "”")
    .replace(/&amp;/g, "&");
}

// Read homepage source code
const pagePath = path.join(__dirname, "../src/app/(marketing)/page.tsx");
const pageCode = fs.readFileSync(pagePath, "utf8");

// ── Test 1: Locked 10-Section Homepage Order ──
console.log("▶ Test 1: Locked 10-Section Homepage Order");

const returnIndex = pageCode.indexOf("return (");
const jsxBody = returnIndex !== -1 ? pageCode.slice(returnIndex) : pageCode;

const sectionOrderTokens = [
  "1. CINEMATIC HERO",
  "<WhatWonderJourneyFeelsLike",
  "<LiveClassroomExperience",
  "<AdventurePassportShowcase",
  "<StorybookLearningTeaser",
  "<AfterClassGalleryTeaser",
  "<CelebrationsShowcase",
  "<TeacherSharonPreview",
  "<ParentReflection",
  'id="inquiry"',
];

let lastIndex = -1;
let orderMaintained = true;

for (const token of sectionOrderTokens) {
  const currentIndex = jsxBody.indexOf(token);
  if (currentIndex === -1) {
    assert(false, `Required homepage section token '${token}' is present in rendered JSX`);
    orderMaintained = false;
  } else if (currentIndex < lastIndex) {
    assert(false, `Homepage section token '${token}' appears out of order in rendered JSX`);
    orderMaintained = false;
  } else {
    lastIndex = currentIndex;
  }
}

if (orderMaintained) {
  assert(true, "All 10 homepage sections appear in exact locked narrative sequence");
}

// ── Test 2: Removed Deep Curriculum & Primary Source Sections Off Home ──
console.log("\n▶ Test 2: Deep Curriculum & Archival Gallery Excluded from Homepage");

assert(
  !pageCode.includes("<ArchipelagoJourneyBand") &&
  !pageCode.includes("import ArchipelagoJourneyBand"),
  "ArchipelagoJourneyBand is removed from Home (housed on /learning)"
);

assert(
  !pageCode.includes("<LearningFocusTabs") &&
  !pageCode.includes("import LearningFocusTabs"),
  "LearningFocusTabs is removed from Home (housed on /learning)"
);

assert(
  !pageCode.includes("<PrimarySourcesGallery") &&
  !pageCode.includes("import PrimarySourcesGallery"),
  "PrimarySourcesGallery is removed from Home (housed on /primary-sources)"
);

assert(
  !pageCode.includes("<ProductTour") &&
  !pageCode.includes("import ProductTour"),
  "Dense ProductTour is removed from Home (housed on /experience)"
);

// ── Test 3: CTAs Point to Correct Deeper Routes ──
console.log("\n▶ Test 3: Strategic CTAs Point to Deeper Routes");

assert(
  pageCode.includes('href="/experience"'),
  "Hero links to '/experience' for full experience overview"
);

assert(
  pageCode.includes('href="/learning"'),
  "Hero links to '/learning' for living curriculum discovery"
);

assert(
  pageCode.includes('href="/login"'),
  "Hero links to '/login' for existing family portal"
);

// ── Test 4: Live Classroom Privacy & Safeguards ──
console.log("\n▶ Test 4: Live Classroom Experience Truth & Child Privacy Note");

const liveClassCode = fs.readFileSync(
  path.join(__dirname, "../src/app/(marketing)/live-classroom-experience.tsx"),
  "utf8"
);
const normalizedLiveClass = normalizeHtmlEntities(liveClassCode);

assert(
  normalizedLiveClass.includes("Real Live Sessions. Real Connection."),
  "Live Classroom headline matches exact approved wording: 'Real Live Sessions. Real Connection.'"
);

assert(
  normalizedLiveClass.includes("Designed for focused, small-group learning."),
  "Supporting wording states 'Designed for focused, small-group learning.'"
);

assert(
  !liveClassCode.includes("max 6 learners") &&
  !liveClassCode.includes("maximum of 6"),
  "No unsupported numeric cohort maximum is asserted"
);

assert(
  normalizedLiveClass.includes(
    "Learner visuals are illustrated/anonymized representations used to protect children's identities. The classroom experience shown is based on a real Wonder Journey session."
  ),
  "Required exact child privacy note is present and visible"
);

assert(
  liveClassCode.includes("Teacher Sharon") &&
  liveClassCode.includes("SA"),
  "Teacher Sharon remains the only real visible guide"
);

// ── Test 5: Adventure Passport Canonical Badges & Narrative Truth ──
console.log("\n▶ Test 5: Adventure Passport Canonical Badges & Narrative Truth");

const passportCode = fs.readFileSync(
  path.join(__dirname, "../src/app/(marketing)/adventure-passport-showcase.tsx"),
  "utf8"
);
const normalizedPassport = normalizeHtmlEntities(passportCode);

const canonicalBadgeIds = [
  "island-explorer",
  "language-star",
  "kind-heart",
  "little-chef",
  "bayanihan",
];

for (const badge of canonicalBadgeIds) {
  assert(
    passportCode.includes(badge),
    `Canonical repository badge '${badge}' is present in passport spread`
  );
}

assert(
  normalizedPassport.includes(
    "Every completed class becomes another stamp in the learner's Wonder Journey"
  ),
  "Passport primary message matches exact approved wording"
);

assert(
  !passportCode.includes("XP points") &&
  !passportCode.includes("leaderboard") &&
  !passportCode.includes("tier level"),
  "Zero unsupported points, rankings, or gamified levels invented"
);

assert(
  passportCode.includes('href="/learning"'),
  "Passport spread contains link to '/learning'"
);

// ── Test 6: After-Class Gallery & Food Truthfulness Invariant ──
console.log("\n▶ Test 6: After-Class Gallery & Recipe Integrity");

const galleryTeaserCode = fs.readFileSync(
  path.join(__dirname, "../src/app/(marketing)/after-class-gallery-teaser.tsx"),
  "utf8"
);
const normalizedGalleryTeaser = normalizeHtmlEntities(galleryTeaserCode);

assert(
  normalizedGalleryTeaser.includes("Learning Doesn't End When the Call Ends") ||
  normalizedGalleryTeaser.includes("Learning doesn't end when the call ends"),
  "Gallery teaser headline matches 'Learning Doesn't End When the Call Ends'"
);

const requiredCategories = ["COOKING", "CREATIVE WORK", "CLASS MEMORIES", "ADVENTURE JOURNEY"];

for (const cat of requiredCategories) {
  assert(
    galleryTeaserCode.includes(cat),
    `After-class gallery includes category '${cat}'`
  );
}

assert(
  galleryTeaserCode.includes("Culinary activities and nature templates are provided as structured family guides"),
  "Gallery teaser explicitly discloses activities as structured guides without claiming fabricated food photos"
);

assert(
  galleryTeaserCode.includes('href="/gallery"'),
  "Gallery teaser links to '/gallery'"
);

// ── Test 7: Celebrations & Audio Demo Truthfulness ──
console.log("\n▶ Test 7: Celebrations Showcase & Browser-Only Audio Recording Truth");

const celebrationsCode = fs.readFileSync(
  path.join(__dirname, "../src/app/(marketing)/celebrations-showcase.tsx"),
  "utf8"
);
const normalizedCelebrations = normalizeHtmlEntities(celebrationsCode);

assert(
  normalizedCelebrations.includes(
    "Interactive Product Preview — audio stays in this browser session and is not sent."
  ),
  "Celebrations audio recorder includes required browser-only privacy notice"
);

assert(
  !celebrationsCode.includes("uploadAudio") &&
  !celebrationsCode.includes("sendToServer"),
  "Celebrations audio has no upload or remote send logic"
);

// ── Test 8: Teacher Sharon Preview & Gentle Faith Foundation ──
console.log("\n▶ Test 8: Teacher Sharon Preview & Gentle Faith Signal");

const teacherCode = fs.readFileSync(
  path.join(__dirname, "../src/app/(marketing)/teacher-sharon-preview.tsx"),
  "utf8"
);

assert(
  teacherCode.includes("Christ-Rooted • Family-Centered • Learning with Purpose") ||
  (teacherCode.includes("Christ-Rooted") && teacherCode.includes("Family-Centered")),
  "Teacher Sharon preview displays gentle, warm faith signal"
);

assert(
  teacherCode.includes('href="/about"'),
  "Teacher Sharon preview links to '/about'"
);

assert(
  teacherCode.includes('href="/safety"'),
  "Teacher Sharon preview links to '/safety'"
);

// ── Test 9: Parent Reflection Privacy Invariant ──
console.log("\n▶ Test 9: Parent Reflection Privacy & Anti-Paraphrasing Safeguard");

const reflectionCode = fs.readFileSync(
  path.join(__dirname, "../src/app/(marketing)/parent-reflection.tsx"),
  "utf8"
);

assert(
  reflectionCode.includes("PENDING EXPLICIT SENDER AUTHORIZATION FOR PUBLIC USE") ||
  reflectionCode.includes("AWAITING SENDER AUTHORIZATION"),
  "Parent Reflection remains explicitly gated pending sender authorization"
);

assert(
  reflectionCode.includes("Private Editorial Placeholder"),
  "Parent Reflection is marked as a private editorial placeholder"
);

assert(
  !reflectionCode.includes("WhatsApp") &&
  !reflectionCode.includes("+1") &&
  !reflectionCode.includes("@"),
  "Zero WhatsApp chrome, sender phone numbers, or email addresses present"
);

// ── Test 10: Signature 3D Scene Safeguards Preserved ──
console.log("\n▶ Test 10: Signature 3D Scene Safeguards Preserved");

const hero3DCode = fs.readFileSync(
  path.join(__dirname, "../src/app/(marketing)/hero-3d-wrapper.tsx"),
  "utf8"
);

assert(
  hero3DCode.includes("ssr: false"),
  "Hero3DWrapper maintains SSR: false client-side loading"
);

assert(
  hero3DCode.includes("HeroStaticFallback"),
  "Hero3DWrapper maintains handcrafted SVG static fallback"
);

// ── Test 11: Database & Migration Boundary Invariant (Strictly 8 Migrations) ──
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
  console.log(`✓ ALL ${passedCount} PHASE 2 HOMEPAGE COMPOSITION TESTS PASSED!`);
} else {
  console.error(`✗ ${failedCount} TESTS FAILED out of ${passedCount + failedCount}`);
  process.exit(1);
}
console.log("================================================================================\n");
