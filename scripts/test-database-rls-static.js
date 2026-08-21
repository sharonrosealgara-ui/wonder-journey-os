const fs = require("fs");
const path = require("path");

console.log("Running Supabase Database & RLS Static Security Audit...");

const migrationsDir = path.join(__dirname, "../supabase/migrations");
const migrationFiles = fs.readdirSync(migrationsDir).filter(f => f.endsWith(".sql")).sort();

if (migrationFiles.length < 4) {
  console.error(`FAIL: Expected at least 4 migration files, found ${migrationFiles.length}`);
  process.exit(1);
}

console.log(`Found ${migrationFiles.length} migration files:`, migrationFiles.join(", "));

let totalPolicies = 0;
let enabledRlsTables = new Set();
let checkedTables = new Set();
let failures = [];

const REQUIRED_TABLES = [
  "workspaces",
  "workspace_members",
  "profiles",
  "family_media",
  "journal_entries",
  "gratitude_entries",
  "lesson_progress",
  "awards",
  "student_xp",
  "cookbook_entries",
  "voice_gifts"
];

migrationFiles.forEach(file => {
  const content = fs.readFileSync(path.join(migrationsDir, file), "utf8");

  // Check for forbidden raw secrets in SQL
  if (/service_role/i.test(content) && !/auth\.jwt\(\)/i.test(content)) {
    failures.push(`Potential service_role mention in ${file}`);
  }
  if (/(?:password|secret)\s*[:=]\s*['"][a-zA-Z0-9_-]{10,}['"]/i.test(content)) {
    failures.push(`Hardcoded password or secret detected in ${file}`);
  }

  // Find ENABLE ROW LEVEL SECURITY
  const rlsMatches = content.matchAll(/ALTER\s+TABLE\s+(?:public\.)?([a-zA-Z0-9_]+)\s+ENABLE\s+ROW\s+LEVEL\s+SECURITY/gi);
  for (const match of rlsMatches) {
    enabledRlsTables.add(match[1]);
  }

  // Count CREATE POLICY
  const policyMatches = content.matchAll(/CREATE\s+POLICY\s+["']?([^"'\n]+)["']?\s+ON\s+(?:public\.)?([a-zA-Z0-9_]+)/gi);
  for (const match of policyMatches) {
    totalPolicies++;
    checkedTables.add(match[2]);
  }
});

REQUIRED_TABLES.forEach(table => {
  if (!enabledRlsTables.has(table)) {
    failures.push(`Missing ENABLE ROW LEVEL SECURITY on table "${table}"`);
  }
  if (!checkedTables.has(table)) {
    failures.push(`Missing RLS policies on table "${table}"`);
  }
});

if (failures.length > 0) {
  console.error("FAIL: Database & RLS Static Security Audit failed with issues:");
  failures.forEach(f => console.error(`  - ${f}`));
  process.exit(1);
}

console.log(`PASS: All ${REQUIRED_TABLES.length} application tables have RLS enabled with ${totalPolicies} active policies across ${migrationFiles.length} ordered migrations.`);
process.exit(0);
