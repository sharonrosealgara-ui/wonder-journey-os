const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

console.log("Generating family-safe lesson datasets for all curriculum stages...");

const stages = [
  { rawFile: "src/config/lessons-stage2.ts", outFile: "src/config/lessons-stage2-family.ts", exportName: "stage2Lessons", outExport: "stage2LessonsFamily" },
  { rawFile: "src/config/lessons-stage4.ts", outFile: "src/config/lessons-stage4-family.ts", exportName: "stage4Lessons", outExport: "stage4LessonsFamily" },
  { rawFile: "src/config/lessons-stage5.ts", outFile: "src/config/lessons-stage5-family.ts", exportName: "stage5Lessons", outExport: "stage5LessonsFamily" },
  { rawFile: "src/config/lessons-stage6.ts", outFile: "src/config/lessons-stage6-family.ts", exportName: "stage6Lessons", outExport: "stage6LessonsFamily" },
  { rawFile: "src/config/lessons-stage7.ts", outFile: "src/config/lessons-stage7-family.ts", exportName: "stage7Lessons", outExport: "stage7LessonsFamily" }
];

const tempTsconfig = {
  compilerOptions: {
    target: "ES2022",
    module: "commonjs",
    moduleResolution: "node",
    esModuleInterop: true,
    baseUrl: ".",
    paths: {
      "@/*": ["src/*"]
    },
    outDir: "temp-family-gen",
    noEmit: false,
    skipLibCheck: true
  },
  include: [
    "src/config/lessons-stage2.ts",
    "src/config/lessons-stage4.ts",
    "src/config/lessons-stage5.ts",
    "src/config/lessons-stage6.ts",
    "src/config/lessons-stage7.ts",
    "src/lib/curriculum-schema.ts",
    "src/lib/assessment-state.ts"
  ]
};

const tempConfigPath = path.join(__dirname, "../temp-family-tsconfig.json");
fs.writeFileSync(tempConfigPath, JSON.stringify(tempTsconfig, null, 2), "utf8");

try {
  execSync(`npx tsc --project temp-family-tsconfig.json`, { stdio: "pipe" });
} catch (e) {
  console.error("Compilation failed:", e.stdout ? e.stdout.toString() : e);
  if (fs.existsSync(tempConfigPath)) fs.unlinkSync(tempConfigPath);
  process.exit(1);
}

if (fs.existsSync(tempConfigPath)) fs.unlinkSync(tempConfigPath);

const { serializeForFamily } = require("../temp-family-gen/lib/curriculum-schema.js");

stages.forEach(s => {
  const modPath = path.join(__dirname, `../temp-family-gen/${s.rawFile.replace(/^src\//, '').replace(/\.ts$/, '.js')}`);
  const mod = require(modPath);
  const rawList = mod[s.exportName] || [];
  const familyList = rawList.map(item => serializeForFamily(item));

  const outContent = `import type { FamilyVisibleCurriculumLesson } from "@/lib/curriculum-schema";

// Pre-projected learner-safe Family lessons (ZERO answers, scoring keys, or teacher metadata)
export const ${s.outExport}: FamilyVisibleCurriculumLesson[] = ${JSON.stringify(familyList, null, 2)};
`;

  fs.writeFileSync(path.join(__dirname, `../${s.outFile}`), outContent, "utf8");
  console.log(`Generated ${s.outFile}`);
});

fs.rmSync(path.join(__dirname, "../temp-family-gen"), { recursive: true, force: true });
console.log("All family lesson datasets successfully generated.");
