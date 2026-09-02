const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

console.log("=========================================================");
console.log("HOSTINGER DEPLOYMENT READINESS & STAGING PREPARATION GATE");
console.log("=========================================================\n");

let failures = [];
let passes = [];

function assert(condition, message) {
  if (condition) {
    passes.push(message);
    console.log(`✓ PASS: ${message}`);
  } else {
    failures.push(message);
    console.error(`✗ FAIL: ${message}`);
  }
}

// 1. Root package.json & scripts
try {
  const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
  assert(pkg.name === "wonder-journey-os", "Root package.json exists with valid name");
  assert(pkg.scripts && pkg.scripts.build && pkg.scripts.start && pkg.scripts.dev, "package.json contains dev, build, and start scripts");
  assert(pkg.engines && pkg.engines.node, `package.json specifies Node.js engine: ${pkg.engines?.node}`);
  assert(!pkg.dependencies?.["@netlify/blobs"], "package.json does not depend on legacy @netlify/blobs");
} catch (e) {
  assert(false, `package.json is missing or invalid JSON: ${e.message}`);
}

// 2. Package lockfile consistency
assert(fs.existsSync("package-lock.json"), "package-lock.json exists for deterministic npm installs");

// 3. Node version synchronization
const nodeVersion = fs.existsSync(".node-version") ? fs.readFileSync(".node-version", "utf8").trim() : null;
const nvmrcVersion = fs.existsSync(".nvmrc") ? fs.readFileSync(".nvmrc", "utf8").trim() : null;
assert(nodeVersion === "22" || nodeVersion === "22.x", `.node-version specifies Node 22 (found '${nodeVersion}')`);
assert(nvmrcVersion === "22" || nvmrcVersion === "22.x", `.nvmrc specifies Node 22 (found '${nvmrcVersion}')`);

// 4. Secret & .env exclusion check
const sensitiveEnvFiles = [".env", ".env.local", ".env.production", ".env.staging"];
const committedSecrets = sensitiveEnvFiles.filter(f => fs.existsSync(f));
assert(committedSecrets.length === 0, `No private .env files present in repository root (found: ${committedSecrets.join(", ") || "none"})`);

// 5. .env.example coverage
assert(fs.existsSync(".env.example"), ".env.example template exists");
if (fs.existsSync(".env.example")) {
  const exampleContent = fs.readFileSync(".env.example", "utf8");
  const requiredEnvKeys = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
    "NEXT_PUBLIC_SITE_URL",
    "NEXT_PUBLIC_IS_STAGING",
    "LIVEKIT_URL",
    "LIVEKIT_API_KEY",
    "LIVEKIT_API_SECRET",
    "GAME_EVALUATION_SECRET",
    "NODE_ENV"
  ];
  requiredEnvKeys.forEach(k => {
    assert(exampleContent.includes(k), `.env.example documents environment variable '${k}'`);
  });
}

// 6. Next.js Managed Server Configuration
assert(fs.existsSync("next.config.ts"), "next.config.ts exists");
if (fs.existsSync("next.config.ts")) {
  const nextConfig = fs.readFileSync("next.config.ts", "utf8");
  assert(!nextConfig.includes("output: 'export'") && !nextConfig.includes('output: "export"'), "Next.js configuration preserves dynamic server mode (no forced static export)");
}

// 7. Dynamic Server Middleware & API Handlers
assert(fs.existsSync("src/middleware.ts"), "src/middleware.ts exists for auth session refresh and role route guarding");
assert(fs.existsSync("src/app/api/livekit-token/route.ts"), "src/app/api/livekit-token/route.ts exists for dynamic token minting");
assert(fs.existsSync("src/app/auth/callback/route.ts"), "src/app/auth/callback/route.ts exists for auth code exchange");

// 8. Client/Server Supabase Separation
assert(fs.existsSync("src/lib/supabase/client.ts"), "src/lib/supabase/client.ts exists (Browser client)");
assert(fs.existsSync("src/lib/supabase/server.ts"), "src/lib/supabase/server.ts exists (Server component client)");
const clientContent = fs.existsSync("src/lib/supabase/client.ts") ? fs.readFileSync("src/lib/supabase/client.ts", "utf8") : "";
assert(!clientContent.includes("SUPABASE_SERVICE_ROLE_KEY"), "Browser Supabase client does not reference service-role key");

// 9. Staging Noindex Policy
assert(fs.existsSync("src/app/robots.ts"), "src/app/robots.ts exists");
if (fs.existsSync("src/app/robots.ts")) {
  const robotsContent = fs.readFileSync("src/app/robots.ts", "utf8");
  assert(robotsContent.includes("disallow: \"/\"") || robotsContent.includes("disallow: '/'"), "robots.ts supports disallowing indexing for staging environments");
}

// 10. Linux-safe import path casing
function checkLinuxPaths(dir) {
  let issues = 0;
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    if (f === "node_modules" || f === ".next" || f === ".git" || f === "temp-render-test") continue;
    if (fs.statSync(full).isDirectory()) {
      issues += checkLinuxPaths(full);
    } else if (f.endsWith(".ts") || f.endsWith(".tsx")) {
      const c = fs.readFileSync(full, "utf8");
      // Check for Windows backslashes in import/require
      if (/from\s+["'][^"']*\\[^"']*["']/.test(c) || /require\(["'][^"']*\\[^"']*["']\)/.test(c)) {
        console.error(`Invalid Windows backslash in import in ${full}`);
        issues++;
      }
    }
  }
  return issues;
}
const pathIssues = checkLinuxPaths("src");
assert(pathIssues === 0, "All TypeScript import paths use standard POSIX forward slashes for Linux compatibility");

// 11. Legacy Runtime Absence Assertions
let trackedLegacyFiles = [];
try {
  const trackedOutput = execSync("git ls-files functions/ netlify.toml netlify/", { encoding: "utf8" });
  trackedLegacyFiles = trackedOutput.trim().split("\n").filter(Boolean);
} catch {}
const legacyFilesAbsent =
  trackedLegacyFiles.length === 0 &&
  !fs.existsSync("netlify.toml") &&
  !fs.existsSync("netlify") &&
  !fs.existsSync("functions");
assert(legacyFilesAbsent, "Legacy Cloudflare functions and Netlify files are completely absent and untracked");

// 12. Deployment Runbook Documentation
const docPath = "docs/deployment/HOSTINGER_DEPLOYMENT.md";
assert(fs.existsSync(docPath), `${docPath} exists`);
if (fs.existsSync(docPath)) {
  const doc = fs.readFileSync(docPath, "utf8");
  const requiredSections = [
    "1. Required Hostinger Plan",
    "2. hPanel Navigation",
    "3. GitHub Repository Selection",
    "4. Staging Branch Selection",
    "5. Framework Configuration",
    "6. Exact Node.js Version",
    "7. Exact Package Manager",
    "8. Exact Install Command",
    "9. Exact Build Command",
    "10. Exact Start Command",
    "11. Output & Runtime Behavior",
    "12. Complete Environment Variable Checklist",
    "13. Supabase Redirect & Authentication Configuration",
    "14. Staging Subdomain & Temporary URL Setup",
    "15. SSL & HTTPS Verification",
    "16. Deployment Log Inspection",
    "17. Safe Redeployment Procedure",
    "18. Rollback Procedure",
    "19. Production Domain Cutover Procedure",
    "20. Staging Acceptance & Verification Checklist"
  ];
  requiredSections.forEach(sec => {
    assert(doc.includes(sec), `Deployment runbook contains section: '${sec}'`);
  });
}

console.log("\n---------------------------------------------------------");
console.log(`SUMMARY: ${passes.length} Passed, ${failures.length} Failed`);
console.log("---------------------------------------------------------\n");

if (failures.length > 0) {
  console.error("FAIL: Hostinger deployment readiness validation failed!");
  process.exit(1);
} else {
  console.log("PASS: Wonder Journey OS is 100% READY FOR HOSTINGER STAGING DEPLOYMENT!");
  process.exit(0);
}
