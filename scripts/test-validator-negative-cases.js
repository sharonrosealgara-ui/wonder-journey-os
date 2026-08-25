const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { validateRegistry } = require("./validate-real-media-production");

console.log("================================================================================");
console.log("WONDER JOURNEY OS — REAL MEDIA VALIDATOR NEGATIVE TEST SUITE");
console.log("================================================================ drop-in\n");

// Ensure temp SVG file for testing
const tempSvgPath = path.join(__dirname, "../public/media/curriculum/test-temp.svg");
const tempSvgContent = '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100"/></svg>';
fs.writeFileSync(tempSvgPath, tempSvgContent);
const tempSvgHash = crypto.createHash("sha256").update(tempSvgContent).digest("hex");

// Helper to create a valid base record
function createValidRecord(id, lessonId = "lesson-1") {
  return {
    id: `media-${id}`,
    lessonId,
    title: `Test Title ${id}`,
    classification: "photograph",
    description: "Valid test description for educational visual",
    originalSourceUrl: "https://commons.wikimedia.org/wiki/File:Test.jpg",
    sourceOrganization: "Wikimedia Commons",
    creator: "Test Photographer",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    dateAccessed: "2026-08-22",
    originalFilename: "l01-visual-a.jpg",
    mimeType: "image/jpeg",
    dimensions: { width: 1200, height: 800 },
    modifications: "Optimized for display",
    storedAssetPath: "/media/curriculum/l01-visual-a.jpg",
    sha256Checksum: "793f7ae80e5aa66d2ed7390427ee57b923fb7d70bdc8eb9500d8617db61a3ae8",
    altText: "Valid descriptive alt text for testing purposes",
    caption: "Valid caption for testing",
  };
}

let passedTests = 0;
let totalTests = 0;

function assertFails(testName, modifiedRegistry, expectedErrorSubstring) {
  totalTests++;
  const result = validateRegistry(modifiedRegistry);
  if (result.valid) {
    console.error(`[FAIL] Test "${testName}" expected validation failure, but validator PASSED!`);
    process.exit(1);
  }
  const hasError = result.errors.some(e => e.includes(expectedErrorSubstring));
  if (!hasError) {
    console.error(`[FAIL] Test "${testName}" failed as expected, but missing expected error substring "${expectedErrorSubstring}".`);
    console.error("Actual errors:", result.errors);
    process.exit(1);
  }
  console.log(`[PASS] Test #${totalTests}: ${testName} (Caught expected error)`);
  passedTests++;
}

// 1. Negative Test: SVG labelled photograph
const test1Record = createValidRecord("test1");
test1Record.storedAssetPath = "/media/curriculum/test-temp.svg";
test1Record.originalFilename = "test-temp.svg";
test1Record.mimeType = "image/svg+xml";
test1Record.classification = "photograph";
test1Record.sha256Checksum = tempSvgHash;
assertFails(
  "SVG labelled photograph",
  [test1Record],
  "SVG file cannot be classified as \"photograph\""
);

// 2. Negative Test: Fabricated URLs
const test2Record = createValidRecord("test2");
test2Record.originalSourceUrl = "https://wonderjourney.app/fake-image.jpg";
assertFails(
  "Fabricated host URL",
  [test2Record],
  "Forbidden or fabricated host in originalSourceUrl"
);

// 3. Negative Test: Mismatched MIME
const test3Record = createValidRecord("test3");
test3Record.mimeType = "image/png"; // File on disk is JPEG
assertFails(
  "Mismatched MIME type",
  [test3Record],
  "MIME type mismatch!"
);

// 4. Negative Test: Duplicate images
const test4Record1 = createValidRecord("test4a");
const test4Record2 = createValidRecord("test4b");
test4Record2.id = "media-test4b-dup";
assertFails(
  "Duplicate SHA-256 images",
  [test4Record1, test4Record2],
  "Duplicate SHA-256 hash detected!"
);

// 5. Negative Test: Missing attribution
const test5Record = createValidRecord("test5");
test5Record.creator = "Unknown Artist Placeholder";
assertFails(
  "Missing / incomplete attribution",
  [test5Record],
  "Missing or incomplete creator"
);

// 6. Negative Test: Generic template SVGs
const test6Record = createValidRecord("test6");
test6Record.modifications = "infographic rendering optimized for Wonder Journey OS";
assertFails(
  "Generic template SVG marker",
  [test6Record],
  "Modifications field contains forbidden template marker"
);

// 7. Negative Test: Lesson without an authentic visual
const test7Record1 = createValidRecord("test7a", "lesson-1");
test7Record1.classification = "original_diagram";
const test7Record2 = createValidRecord("test7b", "lesson-1");
test7Record2.id = "media-test7b";
test7Record2.storedAssetPath = "/media/curriculum/l01-visual-b.jpg";
test7Record2.sha256Checksum = "10e4353c24ee44f58bb5250dca676f3c070628dcee1d83a01651e306c6c0f15f";
test7Record2.mimeType = "image/jpeg";
test7Record2.classification = "original_diagram";
assertFails(
  "Lesson without an authentic visual",
  [test7Record1, test7Record2],
  "missing authentic primary source"
);

// Clean up temp SVG
if (fs.existsSync(tempSvgPath)) fs.unlinkSync(tempSvgPath);

console.log("\n--------------------------------------------------------------------------------");
console.log(`ALL ${passedTests} / ${totalTests} VALIDATOR NEGATIVE TESTS PASSED CLEANLY!`);
console.log("--------------------------------------------------------------------------------\n");
