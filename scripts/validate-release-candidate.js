const { execSync } = require("child_process");
const path = require("path");

if (!process.env.GAME_EVALUATION_SECRET || process.env.GAME_EVALUATION_SECRET.trim().length === 0) {
  console.error("FAIL: GAME_EVALUATION_SECRET environment variable is required.");
  process.exit(1);
}

process.env.LIVEKIT_URL = process.env.LIVEKIT_URL || "ws://127.0.0.1:7880";
process.env.NEXT_PUBLIC_LIVEKIT_WS_URL = process.env.NEXT_PUBLIC_LIVEKIT_WS_URL || "ws://127.0.0.1:7880";


console.log("================================================================================");
console.log("WONDER JOURNEY OS — STAGE 12.1R.10 RELEASE CANDIDATE VERIFICATION (30 GATES)");
console.log("================================================================================\n");

const GATES = [
  { name: "1. Hostinger Readiness Gate", cmd: "node scripts/validate-hostinger-readiness.js" },
  { name: "2. Encoding & Mojibake Audit", cmd: "node scripts/check-mojibake.js" },
  { name: "3. Secret & Environment Security Audit", cmd: "node scripts/test-secret-env-audit.js" },
  { name: "4. Database & RLS Static Security Audit", cmd: "node scripts/test-database-rls-static.js" },
  { name: "5. API & LiveKit Security Regression", cmd: "node scripts/test-api-security.js" },
  { name: "6. Route Access & RBAC Matrix", cmd: "node scripts/test-route-access-matrix.js" },
  { name: "7. Broken Links & Public Asset Audit", cmd: "node scripts/test-broken-links-assets.js" },
  { name: "8. Accessibility & Responsive QA", cmd: "node scripts/test-accessibility-responsive.js" },
  { name: "9. August Curriculum Premium Gate", cmd: "npx tsx scripts/validate-premium-august.js" },
  { name: "10. September Curriculum Premium Gate", cmd: "npx tsx scripts/validate-premium-september.js" },
  { name: "11. October Curriculum Premium Gate", cmd: "npx tsx scripts/validate-premium-october.js" },
  { name: "12. November Curriculum Premium Gate", cmd: "npx tsx scripts/validate-premium-november.js" },
  { name: "13. December Curriculum Premium Gate", cmd: "npx tsx scripts/validate-premium-december.js" },
  { name: "14. DTO Leak & Projection Sync Gate", cmd: "npx tsx scripts/test-dto-leak.ts && npx tsx scripts/test-family-projection-sync.ts" },
  { name: "15. 65-Lesson Render Safety (4,908 slides)", cmd: "node scripts/test-lesson-render-safety.js" },
  { name: "16. Assessment Response State Model", cmd: "node scripts/test-assessment-response-model.js" },
  { name: "17. Curriculum Schema & Uniqueness Tests", cmd: "npx tsx src/__tests__/curriculum.test.ts" },
  { name: "18. Real Media 130 SHA-256 Verified Asset Production Gate", cmd: "node scripts/validate-real-media-production.js" },
  { name: "19. Real Media Validator Negative Test Suite", cmd: "node scripts/test-validator-negative-cases.js" },
  { name: "20. 130 Media Exact Duplicate & Perceptual Near-Duplicate Gate", cmd: "node scripts/detect-media-duplicates.js && node scripts/detect-perceptual-duplicates.js" },
  { name: "21. 130 Authentic Media Provenance & Subject Audit Gate", cmd: "node scripts/audit-all-130-media.js" },
  { name: "22. Stage 12.1R 16-Defect Regression Prevention Suite", cmd: "node scripts/test-regression-stage12-defects.js" },
  { name: "23. ESLint Static Code Analysis", cmd: "npm run lint" },
  { name: "24. TypeScript Full Typecheck", cmd: "npx tsc --noEmit" },
  { name: "25. Production Next.js Build", cmd: "npm run build" },
  { name: "26. Real Browser Two-Context Classroom E2E Suite (Playwright)", cmd: "node scripts/run-playwright-e2e.js" },
  { name: "27. Comprehensive Security & Answer Safety Suite", cmd: "npx tsx scripts/test-classroom-security-comprehensive.js" },
  { name: "28. Local Production Server Smoke Tests", cmd: "node scripts/test-production-server.js" },
  { name: "29. Client-Bundle Answer & Key Leak Gate", cmd: "node scripts/test-client-bundle-leak.js" },
  { name: "30. Stage 12.1R.10 Sealed Token & Behavioral Security Suite", cmd: "npx tsx scripts/test-negative-cases.js" }
];

let results = [];
let overallSuccess = true;

for (const gate of GATES) {
  const start = Date.now();
  process.stdout.write(`Executing ${gate.name}... `);
  try {
    execSync(gate.cmd, { stdio: "pipe", encoding: "utf8", env: process.env });
    const duration = ((Date.now() - start) / 1000).toFixed(1);
    console.log(`[PASS] (${duration}s)`);
    results.push({ Gate: gate.name, Status: "PASSED", Duration: `${duration}s` });
  } catch (err) {
    const duration = ((Date.now() - start) / 1000).toFixed(1);
    console.log(`[FAIL] (${duration}s)`);
    console.error(`\nError in ${gate.name}:\n`, err.stdout || err.stderr || err.message);
    results.push({ Gate: gate.name, Status: "FAILED", Duration: `${duration}s` });
    overallSuccess = false;
    break;
  }
}

console.log("\n================================================================================");
console.log("STAGE 12.1R.10 RELEASE CANDIDATE ORCHESTRATION SUMMARY");
console.log("================================================================================\n");
console.table(results);

if (!overallSuccess) {
  console.error("\nFAIL: Stage 12.1R.10 Release Candidate verification failed. Resolve blockers before release.\n");
  process.exit(1);
} else {
  console.log(`\nPASS: ALL ${GATES.length} RELEASE CANDIDATE GATES PASSED! APPLICATION IS 100% HARDENED AND VERIFIED.\n`);
  process.exit(0);
}
