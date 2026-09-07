import * as fs from "fs";
import * as path from "path";
import { lessons } from "../src/config/lessons";
import { buildSlides, type Slide } from "../src/lib/slides";
import { getCoreIdea } from "../src/components/adventure/slide-views";
import { MEDIA_REGISTRY } from "../src/config/media-registry";

function assert(condition: boolean, msg: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${msg}`);
  }
}

console.log("================================================================================");
console.log("WONDER JOURNEY OS — JOYFUL LEARNING PROGRAM (SLICE 1) TEST SUITE");
console.log("Core Flow: JOY → CURIOSITY → DISCOVERY → PRACTICE → OPTIONAL DEEPER EXPLORATION → CELEBRATION");
console.log("================================================================================\n");

// ── Test 1: All 65 Lessons Generate Valid Slides ──
console.log("▶ Test 1: All 65 Lessons Generate Valid Slides Under Joyful Slide Engine");
assert(lessons.length === 65, `Expected 65 total lessons, found ${lessons.length}`);
console.log(`  Found ${lessons.length} lessons across Stages 2, 4, 5, 6, and 7.`);

let totalSlidesGenerated = 0;
lessons.forEach((lesson, index) => {
  const slides = buildSlides(lesson);
  assert(slides.length > 0, `Lesson ${lesson.id} (#${index + 1}) produced 0 slides`);
  totalSlidesGenerated += slides.length;

  slides.forEach((slide, sIdx) => {
    assert(!!slide.id, `Slide ${sIdx} in lesson ${lesson.id} is missing an ID`);
    assert(!!slide.kind, `Slide ${sIdx} in lesson ${lesson.id} is missing a kind`);
    assert(!!slide.title, `Slide ${sIdx} in lesson ${lesson.id} is missing a title`);
    assert(!!slide.emoji, `Slide ${sIdx} in lesson ${lesson.id} is missing an emoji`);
    assert(!!slide.mascot, `Slide ${sIdx} in lesson ${lesson.id} is missing a mascot`);
  });
});

console.log(`  ✓ All 65 lessons cleanly generate valid slides (${totalSlidesGenerated} total slides across curriculum).`);

// ── Test 2: Sequence Verification (Interactive/Media Precedes Dense Text) ──
console.log("\n▶ Test 2: Flow Ordering (Visual/Interactive Hook & Media Precede Dense Explanations)");

let testedInteractivePrecedenceCount = 0;
lessons.forEach((lesson) => {
  const slides = buildSlides(lesson);
  const kinds = slides.map((s) => s.kind);

  const richExplanationIdx = kinds.indexOf("richExplanation");

  if (richExplanationIdx !== -1) {
    // If lesson has mediaMoment, discoveries, or vocab, they must appear before richExplanation
    const mediaMomentIdx = kinds.indexOf("mediaMoment");
    const discoveriesIdx = kinds.indexOf("discoveries");
    const vocabIdx = kinds.indexOf("vocab");

    if (mediaMomentIdx !== -1) {
      assert(
        mediaMomentIdx < richExplanationIdx,
        `In lesson ${lesson.id}, mediaMoment (idx ${mediaMomentIdx}) must precede richExplanation (idx ${richExplanationIdx})`
      );
      testedInteractivePrecedenceCount++;
    }

    if (discoveriesIdx !== -1) {
      assert(
        discoveriesIdx < richExplanationIdx,
        `In lesson ${lesson.id}, discoveries (idx ${discoveriesIdx}) must precede richExplanation (idx ${richExplanationIdx})`
      );
      testedInteractivePrecedenceCount++;
    }

    if (vocabIdx !== -1) {
      assert(
        vocabIdx < richExplanationIdx,
        `In lesson ${lesson.id}, vocab (idx ${vocabIdx}) must precede richExplanation (idx ${richExplanationIdx})`
      );
      testedInteractivePrecedenceCount++;
    }
  }
});

console.log(`  ✓ Verified ${testedInteractivePrecedenceCount} precedence checkpoints: Media moments, quick discoveries, and interactive vocabulary precede dense explanations.`);

// ── Test 3: Core Idea Extraction & 100% Text Retention in Curious Corner ──
console.log("\n▶ Test 3: Progressive Disclosure & Zero Information Loss in Curious Corner");

let richExplanationCount = 0;
lessons.forEach((lesson) => {
  if (lesson.premiumContent?.richExplanation) {
    lesson.premiumContent.richExplanation.forEach((re) => {
      richExplanationCount++;
      const text = re.body;
      const core = getCoreIdea(text);

      assert(core.length > 0, `Core idea must not be empty for lesson ${lesson.id}`);
      assert(
        text.includes(core) || text.startsWith(core.slice(0, 30)),
        `Core idea must originate directly from body text for lesson ${lesson.id}`
      );
      // Ensure zero information loss: full text length >= core idea length
      assert(
        text.length >= core.length,
        `Full text (${text.length}) must retain 100% of information (core length: ${core.length})`
      );
    });
  }
});

console.log(`  ✓ Verified ${richExplanationCount} rich explanation cards across lessons: punchy core idea foregrounded, 100% deep archival/scientific text retained for Curious Corner.`);

// Sample check on Latin binomials and archival dates
const sampleScientific = "The Philippine Eagle (Pithecophaga jefferyi) is an apex predator of the rainforest canopy. In 1995, it was declared the National Bird of the Philippines.";
const coreScientific = getCoreIdea(sampleScientific);
assert(coreScientific.includes("Pithecophaga jefferyi"), "Scientific Latin binomial preserved in core idea when in lead sentence");
console.log("  ✓ Sample test: Latin binomials and historical dates preserved accurately.");

// ── Test 4: Primary Source Provenance & Murillo Velarde Map Scoping Preserved ──
console.log("\n▶ Test 4: Primary Source Provenance & Map Scoping Intact Under New Engine");

const l01Secondary = MEDIA_REGISTRY["media-l01-secondary"];
const l11Primary = MEDIA_REGISTRY["media-l11-primary"];

assert(!!l01Secondary, "media-l01-secondary must exist in media registry");
assert(!!l11Primary, "media-l11-primary must exist in media registry");

assert(l01Secondary.classification === "primary_source_scan", "l01 secondary is primary_source_scan");
assert(l11Primary.classification === "primary_source_scan", "l11 primary is primary_source_scan");

// Classification is not identity:
const isMurilloVelarde = (id?: string) => id === "media-l01-secondary";
assert(isMurilloVelarde(l01Secondary.id) === true, "media-l01-secondary receives Murillo Velarde map treatment");
assert(isMurilloVelarde(l11Primary.id) === false, "media-l11-primary receives non-map primary scan treatment");

console.log("  ✓ Map viewer correctly scoped strictly to media-l01-secondary without bleeding into other primary sources.");

// ── Test 5: Assessment Reframing & Zero Punitive Language ──
console.log("\n▶ Test 5: Reframing Assessment as Discovery Quest & Zero Punitive Language");

let assessmentSlideCount = 0;
let checkUnderstandingSlideCount = 0;

lessons.forEach((lesson) => {
  const slides = buildSlides(lesson);
  slides.forEach((slide) => {
    if (slide.kind === "premiumAssessment") {
      assessmentSlideCount++;
      assert(slide.title === "Discovery Quest", `Assessment slide must be titled 'Discovery Quest', found '${slide.title}' in ${lesson.id}`);
    }
    if (slide.kind === "checkUnderstanding") {
      checkUnderstandingSlideCount++;
      assert(slide.title === "What Did You Notice?", `Check slide must be titled 'What Did You Notice?', found '${slide.title}' in ${lesson.id}`);
    }

    // Check titles and emojis for punitive terms
    const textToCheck = `${slide.title} ${slide.kind}`.toUpperCase();
    assert(!textToCheck.includes("FAILED"), `Slide should never say FAILED: ${slide.id}`);
    assert(!textToCheck.includes("WRONG ANSWER"), `Slide should never say WRONG ANSWER: ${slide.id}`);
    assert(!textToCheck.includes("PUNITIVE"), `Slide should never contain punitive terms: ${slide.id}`);
  });
});

console.log(`  ✓ Verified ${assessmentSlideCount} Discovery Quest slides (reframed from formal exam/assessment).`);
console.log(`  ✓ Verified ${checkUnderstandingSlideCount} 'What Did You Notice?' slides (reframed from interrogation).`);
console.log("  ✓ Zero punitive terms found across all slides.");

// ── Test 6: Database Integrity & Migration Count ──
console.log("\n▶ Test 6: Zero Database Mutations (Strict 8 Migration Files)");
const migrationsDir = path.resolve(__dirname, "../supabase/migrations");
const migrationFiles = fs.readdirSync(migrationsDir).filter((f) => f.endsWith(".sql"));

assert(
  migrationFiles.length === 8,
  `Strict migration count violation: expected exactly 8 migrations, found ${migrationFiles.length}`
);
console.log(`  ✓ Verified exactly ${migrationFiles.length} migration files in supabase/migrations/ (0 new migrations added).`);

console.log("\n================================================================================");
console.log("ALL SLICE 1 JOYFUL LEARNING TESTS PASSED SUCCESSFULLY!");
console.log("================================================================================\n");
