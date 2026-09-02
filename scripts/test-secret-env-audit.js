const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const BINARY_EXTENSIONS = new Set([
  ".png", ".jpg", ".jpeg", ".webp", ".svg", ".ico", ".gif", ".zip", ".gz", ".tar", ".pdf", ".mp3", ".mp4", ".woff", ".woff2", ".ttf", ".eot"
]);

const FORBIDDEN_FILE_NAMES = new Set([
  ".env", ".env.local", ".env.production", ".env.staging", ".env.test"
]);

const SENSITIVE_BLANK_KEYS = [
  "SUPABASE_SERVICE_ROLE_KEY",
  "LIVEKIT_API_KEY",
  "LIVEKIT_API_SECRET",
  "GAME_EVALUATION_SECRET",
  "E2E_TEACHER_PASSWORD",
  "E2E_FAMILY_PASSWORD",
  "WJ_CLASS_CODE"
];

const REQUIRED_ENV_EXAMPLE_KEYS = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "NEXT_PUBLIC_SITE_URL",
  "NEXT_PUBLIC_IS_STAGING",
  "WJ_CLASS_CODE",
  "LIVEKIT_URL",
  "LIVEKIT_API_KEY",
  "LIVEKIT_API_SECRET",
  "GAME_EVALUATION_SECRET",
  "E2E_TEACHER_PASSWORD",
  "E2E_FAMILY_PASSWORD",
  "NODE_ENV"
];

// Content scanning rules (file, line -> category)
const CONTENT_RULES = [
  {
    category: "Private Key Literal",
    test: (line) => /-----BEGIN (?:RSA )?PRIVATE KEY-----/.test(line),
  },
  {
    category: "Hardcoded LiveKit API Secret Literal",
    test: (line, file) => {
      if (file.endsWith(".env.example") || file.endsWith("HOSTINGER_DEPLOYMENT.md") || file.endsWith("CLOUDFLARE_SETUP.md") || file.endsWith("LIVEKIT_SETUP.md") || file.endsWith("RELEASE_CANDIDATE.md")) return false;
      return /(?:LIVEKIT_API_SECRET|livekitApiSecret)\s*[:=]\s*["'](?!\s*["'])[a-zA-Z0-9_\-]{16,}["']/i.test(line);
    },
  },
  {
    category: "Hardcoded LiveKit API Key Literal",
    test: (line, file) => {
      if (file.endsWith(".env.example") || file.endsWith("HOSTINGER_DEPLOYMENT.md") || file.endsWith("CLOUDFLARE_SETUP.md") || file.endsWith("LIVEKIT_SETUP.md") || file.endsWith("RELEASE_CANDIDATE.md")) return false;
      return /(?:LIVEKIT_API_KEY|livekitApiKey)\s*[:=]\s*["'](?!\s*["'])[a-zA-Z0-9_\-]{8,}["']/i.test(line);
    },
  },
  {
    category: "Hardcoded Supabase Service Role Key Literal",
    test: (line, file) => {
      if (file.endsWith(".env.example") || file.endsWith("HOSTINGER_DEPLOYMENT.md")) return false;
      return /(?:SUPABASE_SERVICE_ROLE_KEY|serviceKey|serviceRoleKey)\s*[:=]\s*["'](?!\s*["'])[a-zA-Z0-9_\-\.]{30,}["']/i.test(line);
    },
  },
  {
    category: "Hardcoded Password Literal",
    test: (line, file) => {
      if (file.endsWith(".env.example")) return false;
      if (/(?:teacherPassword|familyPassword|password)\s*[:=]\s*["'](?!\s*["'])(?:Teacher|Family|admin|password|secret|123456)[^"']*["']/i.test(line)) return true;
      if (/\.fill\s*\(\s*["'][^"']*password[^"']*["']\s*,\s*["'][^"']+["']\s*\)/i.test(line)) return true;
      return false;
    },
  },
  {
    category: "Hardcoded Game Evaluation Secret Literal",
    test: (line, file) => {
      if (file.endsWith(".env.example")) return false;
      return /(?:GAME_EVALUATION_SECRET|gameEvaluationSecret)\s*[:=]\s*["'](?!\s*["'])[a-zA-Z0-9_\-]{16,}["']/i.test(line);
    },
  },
  {
    category: "Hardcoded JWT Token Literal",
    test: (line, file) => {
      if (file.endsWith(".env.example")) return false;
      return /eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.[a-zA-Z0-9_\-]{20,}/.test(line);
    },
  },
];

/**
 * Scans all tracked git files in targetDir using git ls-files -z.
 * Reports findings strictly formatted as: path:line [Category].
 * Never returns or prints sensitive token values.
 */
function scanTrackedFiles(targetDir = process.cwd()) {
  const failures = [];

  let rawFiles;
  try {
    rawFiles = execSync("git ls-files -z", { cwd: targetDir, encoding: "buffer" });
  } catch (err) {
    failures.push({
      path: targetDir,
      line: 0,
      category: `Git Execution Error: ${err.message}`,
    });
    return { failures, summary: "Failed to enumerate git tracked files." };
  }

  const trackedFiles = rawFiles
    .toString("utf8")
    .split("\0")
    .map((f) => f.trim())
    .filter(Boolean);

  let hasEnvExample = false;

  for (const relativeFile of trackedFiles) {
    const baseName = path.basename(relativeFile);
    const fullPath = path.join(targetDir, relativeFile);

    // 1. Check for forbidden file names
    if (FORBIDDEN_FILE_NAMES.has(baseName) || (baseName.startsWith(".env.") && baseName !== ".env.example")) {
      failures.push({
        path: relativeFile,
        line: 1,
        category: "Forbidden Tracked Sensitive Environment File",
      });
      continue;
    }

    if (relativeFile.endsWith(".pem") || relativeFile.endsWith(".key")) {
      failures.push({
        path: relativeFile,
        line: 1,
        category: "Forbidden Tracked Key/Certificate File",
      });
      continue;
    }

    if (relativeFile === ".env.example") {
      hasEnvExample = true;
    }

    // Skip binary files
    const ext = path.extname(relativeFile).toLowerCase();
    if (BINARY_EXTENSIONS.has(ext)) {
      continue;
    }

    if (!fs.existsSync(fullPath)) {
      continue;
    }

    let content;
    try {
      content = fs.readFileSync(fullPath, "utf8");
    } catch {
      continue;
    }

    const lines = content.split("\n");
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineNum = i + 1;

      for (const rule of CONTENT_RULES) {
        if (rule.test(line, relativeFile)) {
          failures.push({
            path: relativeFile,
            line: lineNum,
            category: rule.category,
          });
        }
      }
    }
  }

  // 2. Validate .env.example if present in the target repo
  const envExamplePath = path.join(targetDir, ".env.example");
  if (fs.existsSync(envExamplePath)) {
    const envExampleContent = fs.readFileSync(envExamplePath, "utf8");

    for (const key of REQUIRED_ENV_EXAMPLE_KEYS) {
      if (!envExampleContent.includes(key)) {
        failures.push({
          path: ".env.example",
          line: 1,
          category: `Missing Required Environment Variable Definition: ${key}`,
        });
      }
    }

    for (const secretKey of SENSITIVE_BLANK_KEYS) {
      const regex = new RegExp(`^${secretKey}=(.*)$`, "m");
      const match = envExampleContent.match(regex);
      if (match && match[1].trim().length > 0) {
        failures.push({
          path: ".env.example",
          line: 1,
          category: `Non-Blank Sensitive Assignment in .env.example: ${secretKey}`,
        });
      }
    }

    if (!envExampleContent.includes("your-project-id.supabase.co") || !envExampleContent.includes("your-anon-key-placeholder")) {
      failures.push({
        path: ".env.example",
        line: 1,
        category: "Invalid or Non-Placeholder Public Values in .env.example",
      });
    }
  } else if (hasEnvExample) {
    failures.push({
      path: ".env.example",
      line: 0,
      category: "Missing Required .env.example File",
    });
  }

  return {
    failures,
    summary:
      failures.length === 0
        ? "PASS: Secret & Environment Audit passed with 0 committed secrets and fully hardened secret governance."
        : `FAIL: Secret & Environment Audit detected ${failures.length} issue(s).`,
  };
}

// CLI Execution Entry Point
if (require.main === module) {
  console.log("Running Secret & Environment Security Audit (git ls-files -z)...");
  const targetDir = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();
  const result = scanTrackedFiles(targetDir);

  if (result.failures.length > 0) {
    console.error(`\n${result.summary}`);
    result.failures.forEach((f) => {
      console.error(`  - ${f.path}:${f.line} [${f.category}]`);
    });
    process.exit(1);
  } else {
    console.log(result.summary);
    process.exit(0);
  }
}

module.exports = {
  scanTrackedFiles,
};
