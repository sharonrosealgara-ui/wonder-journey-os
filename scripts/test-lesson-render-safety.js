const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const Module = require("module");

console.log("Compiling components and data for Real Component Render Safety Test...");

// Setup path alias resolver for compiled temp modules
const origResolve = Module._resolveFilename;
Module._resolveFilename = function(request, parent, isMain) {
  if (request.startsWith("@/")) {
    const rel = request.substring(2);
    const resolvedPath = path.join(__dirname, "../temp-render-test", rel);
    return origResolve.call(this, resolvedPath, parent, isMain);
  }
  return origResolve.call(this, request, parent, isMain);
};

const tempTsconfig = {
  compilerOptions: {
    target: "ES2022",
    module: "commonjs",
    moduleResolution: "node",
    jsx: "react-jsx",
    esModuleInterop: true,
    baseUrl: ".",
    paths: {
      "@/*": ["src/*"]
    },
    outDir: "temp-render-test",
    noEmit: false,
    skipLibCheck: true
  },
  include: [
    "src/config/lessons-stage2.ts",
    "src/lib/curriculum-schema.ts",
    "src/lib/slides.ts",
    "src/config/lessons.ts",
    "src/config/mascots.ts",
    "src/config/lessons-stage4.ts",
    "src/config/lessons-stage5.ts",
    "src/config/lessons-stage6.ts",
    "src/config/lessons-stage7.ts",
    "src/components/adventure/slide-views.tsx"
  ]
};

const tempConfigPath = path.join(__dirname, "../temp-render-tsconfig.json");
fs.writeFileSync(tempConfigPath, JSON.stringify(tempTsconfig, null, 2), "utf8");

try {
  execSync(`npx tsc --project temp-render-tsconfig.json`, { stdio: "pipe" });
} catch (e) {
  console.error("Compilation error in test-lesson-render-safety:", e.stdout ? e.stdout.toString() : e);
  if (fs.existsSync(tempConfigPath)) fs.unlinkSync(tempConfigPath);
  process.exit(1);
}

if (fs.existsSync(tempConfigPath)) fs.unlinkSync(tempConfigPath);

const React = require("react");
const ReactDOMServer = require("react-dom/server");

const stage2 = require("../temp-render-test/config/lessons-stage2.js");
const lesson1 = stage2.stage2Lessons.find(l => l.id === "lesson-1-world-map");

if (!lesson1) {
  console.error("FAIL: lesson-1-world-map not found");
  process.exit(1);
}

// 1. Validate Schema and DTO projection
const { createFamilyPremiumProjection, serializeForFamily, validateCurriculumLesson } = require("../temp-render-test/lib/curriculum-schema.js");

const validationResult = validateCurriculumLesson(lesson1);
if (!validationResult.ok) {
  console.error("FAIL: CurriculumLesson validation failed:", validationResult.errors);
  process.exit(1);
}

const familyProjection = createFamilyPremiumProjection(lesson1);
const familySerialized = serializeForFamily(lesson1);

// 2. Load Slides and Components
const { buildSlides } = require("../temp-render-test/lib/slides.js");
const { lessons } = require("../temp-render-test/config/lessons.js");
const slideViews = require("../temp-render-test/components/adventure/slide-views.js");

const legacyLesson1 = lessons.find(l => l.id === "lesson-1-world-map");
if (!legacyLesson1) {
  console.error("FAIL: legacyLesson1 not found");
  process.exit(1);
}

const slides = buildSlides(legacyLesson1);
console.log(`Generated ${slides.length} slides for Lesson 1.`);

// 3. Real Component Static Markup Rendering via ReactDOMServer
const SlideView = slideViews.SlideView;
const levels = ["explorer", "adventure", "trailblazer"];

let renderedCount = 0;

for (const level of levels) {
  for (const slide of slides) {
    try {
      const element = React.createElement(SlideView, {
        slide,
        lesson: legacyLesson1,
        level,
        onNext: () => {},
        onQuizFinish: () => {},
        quizResult: null
      });

      const html = ReactDOMServer.renderToStaticMarkup(element);
      if (!html || typeof html !== "string" || html.length === 0) {
        console.error(`FAIL: Empty HTML rendered for slide ${slide.id} (${slide.kind}) at level ${level}`);
        process.exit(1);
      }

      // Assert no accidental [object Object] rendered as text in the DOM
      if (html.includes("[object Object]")) {
        console.error(`FAIL: Detected [object Object] in rendered markup for slide ${slide.id} (${slide.kind})`);
        process.exit(1);
      }

      renderedCount++;
    } catch (err) {
      console.error(`FAIL: Runtime render error on slide ${slide.id} (${slide.kind}) at level ${level}:`, err);
      process.exit(1);
    }
  }
}

// 4. Exercise all 6 Premium Assessment variants in real component rendering
const mockAssessments = [
  { id: "a1", type: "multiple-choice", question: "Which ocean is east?", options: ["Pacific", "Atlantic"] },
  { id: "a2", type: "true-false-with-explanation", question: "Is Earth round?", options: ["True", "False"] },
  { id: "a3", type: "short-answer", question: "Name the equator in Tagalog:" },
  { id: "a4", type: "matching", question: "Match lands and water:", leftItems: ["Luzon", "Pacific"], rightItems: ["Island", "Ocean"] },
  { id: "a5", type: "sequencing", question: "Order from large to small:", items: ["Earth", "Asia", "Philippines"] },
  { id: "a6", type: "scenario-application", scenario: "You are on a ship sailing east of Davao.", question: "Which ocean are you in?" }
];

const mockAssessmentSlide = {
  id: "assessment-all-types",
  kind: "premiumAssessment",
  title: "Assessment Test",
  emoji: "📝",
  mascot: { id: "tala", name: "Tala", avatar: "🌟", color: "#FFD700" },
  content: mockAssessments
};

try {
  const element = React.createElement(SlideView, {
    slide: mockAssessmentSlide,
    lesson: legacyLesson1,
    level: "trailblazer"
  });
  const html = ReactDOMServer.renderToStaticMarkup(element);
  if (html.includes("[object Object]")) {
    console.error("FAIL: [object Object] in mock assessment variant markup");
    process.exit(1);
  }
  console.log("All 6 Premium Assessment variants rendered cleanly to static markup.");
} catch (err) {
  console.error("FAIL: Error rendering mock assessment variants:", err);
  process.exit(1);
}

// Clean temp directory
fs.rmSync(path.join(__dirname, "../temp-render-test"), { recursive: true, force: true });

console.log(`PASS: Real Component Render Safety Test succeeded! Rendered ${renderedCount} slide instances + 6 assessment variants with 0 errors and 0 [object Object] leaks.`);
process.exit(0);
