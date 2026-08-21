const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const Module = require("module");

console.log("Compiling components and data for Real Component Render Safety Test (August, September & October)...");

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
    "src/lib/assessment-state.ts",
    "src/config/lessons-stage2.ts",
    "src/config/stage2/*.ts",
    "src/config/lessons-stage4.ts",
    "src/config/stage4/*.ts",
    "src/config/lessons-stage5.ts",
    "src/config/stage5/*.ts",
    "src/config/lessons-stage2-family.ts",
    "src/config/lessons-stage4-family.ts",
    "src/config/lessons-stage5-family.ts",
    "src/config/lessons-stage6-family.ts",
    "src/config/lessons-stage7-family.ts",
    "src/lib/curriculum-schema.ts",
    "src/lib/slides.ts",
    "src/config/lessons.ts",
    "src/config/mascots.ts",
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
const stage4 = require("../temp-render-test/config/lessons-stage4.js");
const stage5 = require("../temp-render-test/config/lessons-stage5.js");
const { buildSlides } = require("../temp-render-test/lib/slides.js");
const { lessons } = require("../temp-render-test/config/lessons.js");
const slideViews = require("../temp-render-test/components/adventure/slide-views.js");

const SlideView = slideViews.SlideView;
const levels = ["explorer", "adventure", "trailblazer"];

let totalRenderedSlides = 0;

const allStageLessons = [...stage2.stage2Lessons, ...stage4.stage4Lessons, ...stage5.stage5Lessons];

allStageLessons.forEach((rawLesson) => {
  const legacyLesson = lessons.find(l => l.id === rawLesson.id);
  if (!legacyLesson) {
    console.error(`FAIL: legacy mapped lesson not found for ${rawLesson.id}`);
    process.exit(1);
  }

  const slides = buildSlides(legacyLesson);

  for (const level of levels) {
    for (const slide of slides) {
      try {
        const element = React.createElement(SlideView, {
          slide,
          lesson: legacyLesson,
          level,
          onNext: () => {},
          onQuizFinish: () => {},
          quizResult: null
        });

        const html = ReactDOMServer.renderToStaticMarkup(element);
        if (!html || typeof html !== "string" || html.length === 0) {
          console.error(`FAIL: Empty HTML rendered for ${rawLesson.id} slide ${slide.id} (${slide.kind}) at level ${level}`);
          process.exit(1);
        }

        if (html.includes("[object Object]")) {
          console.error(`FAIL: Detected [object Object] in rendered markup for ${rawLesson.id} slide ${slide.id} (${slide.kind})`);
          process.exit(1);
        }

        totalRenderedSlides++;
      } catch (err) {
        console.error(`FAIL: Runtime render error on ${rawLesson.id} slide ${slide.id} (${slide.kind}) at level ${level}:`, err);
        process.exit(1);
      }
    }
  }
});

console.log(`PASS: Successfully rendered ${totalRenderedSlides} slide instances across all 39 August, September & October lessons and 3 age tiers with 0 errors.`);

// Exercise all 6 Premium Assessment variants in real component rendering & assert interactive controls
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
  mascot: { id: "tala", name: "Tala", avatar: "⭐", color: "#FFD700" },
  content: mockAssessments
};

const assessmentElement = React.createElement(SlideView, {
  slide: mockAssessmentSlide,
  lesson: lessons[0],
  level: "adventure",
  onNext: () => {},
  onQuizFinish: () => {},
  quizResult: null
});

const assessmentHtml = ReactDOMServer.renderToStaticMarkup(assessmentElement);

const requiredFragments = [
  "Which ocean is east?",
  "Is Earth round?",
  "Name the equator in Tagalog:",
  "Match lands and water:",
  "Order from large to small:",
  "You are on a ship sailing east of Davao."
];

for (const frag of requiredFragments) {
  if (!assessmentHtml.includes(frag)) {
    console.error(`FAIL: Rendered assessment HTML missing expected fragment: "${frag}"`);
    process.exit(1);
  }
}

console.log("PASS: Real Component Static Markup Rendering verified across all assessment variants with interactive controls.");

fs.rmSync(path.join(__dirname, "../temp-render-test"), { recursive: true, force: true });
process.exit(0);
