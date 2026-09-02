const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');

let gitSha = "HEAD";
let gitBranch = "unknown";
try {
  gitSha = execSync("git rev-parse HEAD", { encoding: "utf8" }).trim();
  gitBranch = execSync("git rev-parse --abbrev-ref HEAD", { encoding: "utf8" }).trim();
} catch (e) {}

const mediaContactSheetPath = path.join(__dirname, '../artifacts/media-contact-sheet.json');
let mediaManifestHash = "";
let mediaCount = 0;
if (fs.existsSync(mediaContactSheetPath)) {
  const content = fs.readFileSync(mediaContactSheetPath);
  mediaManifestHash = crypto.createHash('sha256').update(content).digest('hex');
  try {
    mediaCount = JSON.parse(content.toString('utf8')).items.length;
  } catch (e) {}
}

const runId = process.env.GITHUB_RUN_ID || "local-execution";
const repo = process.env.GITHUB_REPOSITORY || "sharonrosealgara-ui/wonder-journey-os";
const serverUrl = process.env.GITHUB_SERVER_URL || "https://github.com";
const workflowRunUrl = `${serverUrl}/${repo}/actions/runs/${runId}`;

const evidence = {
  stage: "Stage 12.1R.10",
  title: "Stage 12.1R.10 Exact-SHA CI Verification Evidence",
  generatedAt: new Date().toISOString(),
  runnerContext: {
    platform: process.env.CI ? "GitHub Actions CI Runner" : "Local Environment",
    workflow: process.env.GITHUB_WORKFLOW || "CI Verification & Quality Gates",
    runId: runId,
    runNumber: process.env.GITHUB_RUN_NUMBER || "N/A",
    workflowRunUrl: workflowRunUrl,
    commitSha: process.env.GITHUB_SHA || gitSha,
    branch: process.env.GITHUB_REF_NAME || gitBranch,
  },
  observedArtifacts: {
    mediaContactSheetCount: mediaCount,
    mediaContactSheetSha256: mediaManifestHash,
    visualReviewReportPresent: fs.existsSync(path.join(__dirname, '../artifacts/media-visual-review.json')),
  },
};

const outputPath = path.join(__dirname, '../artifacts/ci-verification-evidence.json');
fs.writeFileSync(outputPath, JSON.stringify(evidence, null, 2), 'utf8');
console.log(`[CI EVIDENCE] CI execution record written to ${outputPath}`);
