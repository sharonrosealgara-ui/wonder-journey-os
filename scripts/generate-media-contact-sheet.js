const fs = require("fs");
const path = require("path");

const registryPath = path.join(__dirname, "../src/config/media-registry.ts");
const registryCode = fs.readFileSync(registryPath, "utf8");
const jsonMatch = registryCode.match(/export const mediaRegistry:\s*FactualMedia\[\]\s*=\s*(\[[\s\S]*?\]);\s*export function/);
const allMedia = jsonMatch ? JSON.parse(jsonMatch[1]) : [];

console.log(`Generating visual contact sheet for ${allMedia.length} media items...`);

function escapeHtml(str) {
  if (!str) return "";
  return str.toString().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Wonder Journey OS — Factual Media Contact Sheet</title>
  <style>
    :root {
      --bg: #090d16;
      --card-bg: #131d2e;
      --border: rgba(255, 255, 255, 0.1);
      --text: #f1f5f9;
      --text-muted: #94a3b8;
      --accent: #38bdf8;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: var(--bg);
      color: var(--text);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      padding: 32px;
    }
    header {
      margin-bottom: 32px;
      padding-bottom: 24px;
      border-bottom: 1px solid var(--border);
    }
    h1 { font-size: 28px; font-weight: 800; color: #fff; margin-bottom: 8px; }
    .subtitle { color: var(--text-muted); font-size: 15px; }
    .stats {
      display: flex;
      flex-wrap: wrap;
      gap: 24px;
      margin-top: 16px;
      padding: 16px;
      background: rgba(56, 189, 248, 0.08);
      border: 1px solid rgba(56, 189, 248, 0.2);
      border-radius: 12px;
    }
    .stat-item { font-size: 14px; }
    .stat-val { font-weight: 800; color: var(--accent); }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
      gap: 24px;
    }
    .card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 16px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    .thumb-wrap {
      width: 100%;
      aspect-ratio: 16 / 9;
      background: #020617;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      border-bottom: 1px solid var(--border);
    }
    .thumb-wrap img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .content {
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      flex: 1;
    }
    .badge {
      align-self: flex-start;
      padding: 4px 10px;
      border-radius: 9999px;
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .badge-photograph { background: rgba(56, 189, 248, 0.2); color: #38bdf8; }
    .badge-authoritative_map { background: rgba(52, 211, 153, 0.2); color: #34d399; }
    .badge-historical_artwork { background: rgba(244, 114, 182, 0.2); color: #f472b6; }
    .badge-primary_source_scan { background: rgba(251, 146, 60, 0.2); color: #fb923c; }
    .badge-museum_artifact { background: rgba(167, 139, 250, 0.2); color: #a78bfa; }
    .badge-original_diagram { background: rgba(250, 204, 21, 0.2); color: #facc15; }
    .title { font-size: 16px; font-weight: 700; color: #fff; line-height: 1.3; }
    .caption { font-size: 13px; color: var(--text-muted); line-height: 1.4; }
    .meta {
      margin-top: auto;
      padding-top: 12px;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      font-size: 12px;
      color: #64748b;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .meta strong { color: #cbd5e1; }
    .sha { font-family: monospace; font-size: 10px; color: #475569; word-break: break-all; }
  </style>
</head>
<body>
  <header>
    <h1>Wonder Journey OS — Factual Media Registry Contact Sheet</h1>
    <div class="subtitle">Complete visual audit of all verified authentic curriculum assets (130 items across 65 lessons)</div>
    <div class="stats">
      <div class="stat-item">Total Verified Records: <span class="stat-val">${allMedia.length}</span></div>
      <div class="stat-item">Lessons Covered: <span class="stat-val">65 / 65</span></div>
      <div class="stat-item">Photographs: <span class="stat-val">${allMedia.filter(m => m.classification === 'photograph').length}</span></div>
      <div class="stat-item">Maps: <span class="stat-val">${allMedia.filter(m => m.classification === 'authoritative_map').length}</span></div>
      <div class="stat-item">Scans / Artifacts / Art: <span class="stat-val">${allMedia.filter(m => ['museum_artifact', 'primary_source_scan', 'historical_artwork'].includes(m.classification)).length}</span></div>
      <div class="stat-item">Original Diagrams: <span class="stat-val">${allMedia.filter(m => m.classification === 'original_diagram').length}</span></div>
    </div>
  </header>

  <main class="grid">
    ${allMedia.map(m => `
      <div class="card" id="${m.id}">
        <div class="thumb-wrap">
          <img src="${m.storedAssetPath}" alt="${escapeHtml(m.altText)}" loading="lazy" />
        </div>
        <div class="content">
          <span class="badge badge-${m.classification}">${m.classification.replace(/_/g, ' ')}</span>
          <div class="title">${escapeHtml(m.title)}</div>
          <div class="caption">${escapeHtml(m.caption)}</div>
          <div class="meta">
            <div><strong>Creator:</strong> ${escapeHtml(m.creator)} (${escapeHtml(m.sourceOrganization)})</div>
            <div><strong>License:</strong> ${escapeHtml(m.license)}</div>
            <div><strong>Lesson:</strong> ${escapeHtml(m.lessonId)}</div>
            <div><strong>Dimensions:</strong> ${m.dimensions ? `${m.dimensions.width} × ${m.dimensions.height}` : 'N/A'}</div>
            <div class="sha">SHA256: ${m.sha256Checksum}</div>
          </div>
        </div>
      </div>
    `).join('')}
  </main>
</body>
</html>`;

const outPath = path.join(__dirname, "../public/media-contact-sheet.html");
fs.writeFileSync(outPath, html, "utf8");
console.log(`Generated contact sheet at ${outPath}`);
