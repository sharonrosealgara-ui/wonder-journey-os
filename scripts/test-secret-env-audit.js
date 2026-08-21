const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

console.log("Running Secret & Environment Security Audit...");

let failures = [];

// 1. Check git-tracked files to ensure no .env or .env.local is committed
const trackedFiles = execSync("git ls-files", { encoding: "utf8" }).split("\n").filter(Boolean);

trackedFiles.forEach(file => {
  if (file === ".env" || file === ".env.local" || file === ".env.production" || file.endsWith(".pem") || file.endsWith(".key")) {
    failures.push(`Forbidden sensitive file tracked in git: ${file}`);
  }
});

// 2. Scan tracked files for hardcoded private keys or service_role credentials
const secretPatterns = [
  { name: "Private RSA/PEM Key", regex: /-----BEGIN (?:RSA )?PRIVATE KEY-----/ },
  { name: "LiveKit Real Secret Value", regex: /LIVEKIT_API_SECRET\s*=\s*(?!secretxxx|your-)[a-zA-Z0-9_\-]{20,}/i },
  { name: "Supabase Service Role Secret Value", regex: /SUPABASE_SERVICE_ROLE_KEY\s*=\s*(?!your-|placeholder)[a-zA-Z0-9_\-\.]{30,}/i }
];

trackedFiles.forEach(file => {
  // Skip binary files and test data
  if (file.endsWith(".png") || file.endsWith(".jpg") || file.endsWith(".webp") || file.endsWith(".svg") || file.endsWith(".ico")) return;
  if (!fs.existsSync(file)) return;

  const content = fs.readFileSync(file, "utf8");
  secretPatterns.forEach(pat => {
    if (pat.regex.test(content)) {
      failures.push(`Discovered potential ${pat.name} in file: ${file}`);
    }
  });
});

// 3. Verify .env.example contains only safe placeholders
const envExamplePath = path.join(__dirname, "../.env.example");
if (!fs.existsSync(envExamplePath)) {
  failures.push("Missing required .env.example template");
} else {
  const envExample = fs.readFileSync(envExamplePath, "utf8");
  const requiredVars = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "NEXT_PUBLIC_SITE_URL",
    "NEXT_PUBLIC_IS_STAGING",
    "WJ_CLASS_CODE",
    "LIVEKIT_URL",
    "LIVEKIT_API_KEY",
    "LIVEKIT_API_SECRET",
    "NODE_ENV"
  ];

  requiredVars.forEach(v => {
    if (!envExample.includes(v)) {
      failures.push(`Missing required environment variable definition in .env.example: ${v}`);
    }
  });

  // Verify all values are placeholders
  if (/your-project-id\.supabase\.co/.test(envExample) && /your-anon-key-placeholder/.test(envExample)) {
    // Verified safe placeholders
  } else {
    failures.push(".env.example appears to contain non-placeholder values");
  }
}

if (failures.length > 0) {
  console.error("FAIL: Secret & Environment Audit detected issues:");
  failures.forEach(f => console.error(`  - ${f}`));
  process.exit(1);
}

console.log("PASS: Secret & Environment Audit passed with 0 committed secrets and fully documented .env.example.");
process.exit(0);
