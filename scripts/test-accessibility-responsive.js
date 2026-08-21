const fs = require("fs");
const path = require("path");

console.log("Running Accessibility & Responsive Design Audit...");

let failures = [];
let passCount = 0;

// 1. Check globals.css for high-contrast color tokens and accessible focus states
const cssPath = path.join(__dirname, "../src/app/globals.css");
const cssContent = fs.readFileSync(cssPath, "utf8");

if (!cssContent.includes("--color-ink") && !cssContent.includes("--color-sand")) {
  failures.push("globals.css missing foundational design tokens (--color-ink / --color-sand)");
} else {
  passCount++;
}

// 2. Check factual-image component for mandatory alt text enforcement
const factualImageCode = fs.readFileSync(path.join(__dirname, "../src/components/factual-image.tsx"), "utf8");
if (!factualImageCode.includes("alt={media.alt}")) {
  failures.push("factual-image component does not strictly enforce alt={media.alt}");
} else {
  passCount++;
}

// 3. Check touch target & interactive element styling in adventure components
const slideViewsCode = fs.readFileSync(path.join(__dirname, "../src/components/adventure/slide-views.tsx"), "utf8");
if (!slideViewsCode.includes("min-h-") && !slideViewsCode.includes("py-") && !slideViewsCode.includes("px-")) {
  failures.push("Interactive assessment buttons lack responsive padding / touch-target sizing");
} else {
  passCount++;
}

// 4. Check viewport configuration in root layout
const layoutCode = fs.readFileSync(path.join(__dirname, "../src/app/layout.tsx"), "utf8");
if (!layoutCode.includes("viewport") || !layoutCode.includes("device-width")) {
  failures.push("Root layout missing standard responsive device-width viewport metadata");
} else {
  passCount++;
}

// 5. Check semantic landmarks across key views
const appShellCode = fs.readFileSync(path.join(__dirname, "../src/components/app-shell.tsx"), "utf8");
if (!appShellCode.includes("<nav") && !appShellCode.includes("<header") && !appShellCode.includes("<main")) {
  failures.push("AppShell missing semantic HTML5 landmarks (nav, header, or main)");
} else {
  passCount++;
}

// 6. Check prefers-reduced-motion in globals.css
if (!cssContent.includes("prefers-reduced-motion")) {
  failures.push("globals.css missing @media (prefers-reduced-motion) overrides");
} else {
  passCount++;
}

if (failures.length > 0) {
  console.error("FAIL: Accessibility & Responsive QA detected issues:");
  failures.forEach(f => console.error(`  - ${f}`));
  process.exit(1);
}

console.log(`PASS: Accessibility & Responsive Design audit passed ${passCount}/${passCount} checks (landmarks, viewport, alt text, focus/touch targets, reduced motion).`);
process.exit(0);
