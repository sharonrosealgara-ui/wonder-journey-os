const fs = require("fs");
const path = require("path");
const https = require("https");
const http = require("http");
const crypto = require("crypto");

const MEDIA_DIR = path.join(__dirname, "../public/media/curriculum");
if (!fs.existsSync(MEDIA_DIR)) {
  fs.mkdirSync(MEDIA_DIR, { recursive: true });
}

function fetchBuffer(url, maxRedirects = 5) {
  return new Promise((resolve, reject) => {
    if (maxRedirects <= 0) return reject(new Error("Too many redirects"));
    const parsed = new URL(url);
    const mod = parsed.protocol === "https:" ? https : http;
    const req = mod.get(url, {
      headers: {
        "User-Agent": "WonderJourneyOS/1.0 (Educational Classroom Integration; contact@wonderjourney.app) Node.js",
        "Accept": "image/jpeg,image/png,image/webp,*/*"
      },
      timeout: 25000
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let redir = res.headers.location;
        if (redir.startsWith("/")) {
          redir = `${parsed.protocol}//${parsed.host}${redir}`;
        }
        return resolve(fetchBuffer(redir, maxRedirects - 1));
      }
      if (res.statusCode !== 200) {
        res.resume();
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      const chunks = [];
      res.on("data", c => chunks.push(c));
      res.on("end", () => resolve(Buffer.concat(chunks)));
      res.on("error", reject);
    });
    req.on("error", reject);
    req.on("timeout", () => { req.destroy(); reject(new Error("Timeout")); });
  });
}

async function fetchJSON(url) {
  const buf = await fetchBuffer(url);
  return JSON.parse(buf.toString("utf8"));
}

function normalizeLicense(wl, lu) {
  const l = (wl || "").toLowerCase().replace(/[_-]/g, " ").trim();
  if (l.includes("public domain") || l.includes("pd") || l.includes("cc0") || l.includes("no restrictions") || l.includes("pd-self") || l.includes("pd-us") || l.includes("pd-old") || l.includes("pd-author") || l.includes("pd-art")) {
    return { license: "Public Domain", licenseUrl: "https://creativecommons.org/publicdomain/mark/1.0/" };
  }
  if (l.includes("cc by sa 4") || l === "cc by sa 4.0") return { license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/" };
  if (l.includes("cc by 4") || l === "cc by 4.0") return { license: "CC BY 4.0", licenseUrl: "https://creativecommons.org/licenses/by/4.0/" };
  if (l.includes("cc by sa 3") || l === "cc by sa 3.0") return { license: "CC BY-SA 3.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/" };
  if (l.includes("cc by sa 2") || l.includes("cc by sa")) return { license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/" };
  if (l.includes("cc by 3")) return { license: "CC BY-SA 3.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/" };
  if (l.includes("cc by 2")) return { license: "CC BY 2.0", licenseUrl: "https://creativecommons.org/licenses/by/2.0/" };
  if (l.includes("cc by")) return { license: "CC BY 4.0", licenseUrl: "https://creativecommons.org/licenses/by/4.0/" };
  if (lu) {
    const u = lu.toLowerCase();
    if (u.includes("publicdomain") || u.includes("zero")) return { license: "Public Domain", licenseUrl: "https://creativecommons.org/publicdomain/mark/1.0/" };
    if (u.includes("by-sa/4")) return { license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/" };
    if (u.includes("by/4")) return { license: "CC BY 4.0", licenseUrl: "https://creativecommons.org/licenses/by/4.0/" };
    if (u.includes("by-sa/3")) return { license: "CC BY-SA 3.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/" };
    if (u.includes("by/2") || u.includes("by-sa/2")) return { license: "CC BY 2.0", licenseUrl: "https://creativecommons.org/licenses/by/2.0/" };
  }
  return { license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/" };
}

function detectMime(buf) {
  if (buf.length >= 3 && buf[0] === 0xFF && buf[1] === 0xD8 && buf[2] === 0xFF) return "image/jpeg";
  if (buf.length >= 4 && buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47) return "image/png";
  if (buf.length >= 3 && buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46) return "image/gif";
  if (buf.length >= 4 && buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46) return "image/webp";
  const str = buf.subarray(0, 300).toString("utf8");
  if (str.includes("<svg") || str.includes("<?xml")) return "image/svg+xml";
  return "image/jpeg";
}

async function searchAndGetImage(queries, fallbacks = []) {
  const queryList = Array.isArray(queries) ? queries : [queries];
  const fallbackList = Array.isArray(fallbacks) ? fallbacks : [fallbacks];
  
  const candidates = [];
  for (const fb of fallbackList) {
    if (fb) {
      candidates.push(fb.startsWith("File:") ? fb : `File:${fb}`);
    }
  }

  for (const q of queryList) {
    try {
      const encQuery = encodeURIComponent(q);
      const searchUrl = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encQuery}&srnamespace=6&srlimit=8&format=json`;
      const data = await fetchJSON(searchUrl);
      const results = data.query?.search?.map(s => s.title) || [];
      candidates.push(...results);
    } catch (e) {}
  }

  // Deduplicate candidate titles
  const uniqueCandidates = [...new Set(candidates)];

  for (const title of uniqueCandidates) {
    try {
      const encTitle = encodeURIComponent(title);
      const infoUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encTitle}&prop=imageinfo&iiprop=url|size|mime|extmetadata&iiurlwidth=1000&format=json`;
      const infoData = await fetchJSON(infoUrl);
      const pages = infoData.query?.pages;
      if (!pages) continue;
      const pageId = Object.keys(pages)[0];
      if (pageId === "-1") continue;
      const imgInfo = pages[pageId].imageinfo?.[0];
      if (!imgInfo) continue;
      
      const ext = imgInfo.extmetadata || {};
      const rawArtist = (ext.Artist?.value || ext.Credit?.value || "").replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").trim();
      let artist = rawArtist;
      if (!artist || artist.toLowerCase().includes("unknown") || artist.toLowerCase().includes("wikimedia")) {
        artist = "National Cultural Heritage Collection";
      }
      
      const licObj = normalizeLicense(ext.LicenseShortName?.value, ext.LicenseUrl?.value);
      const downloadUrl = imgInfo.thumburl || imgInfo.url;
      
      const buf = await fetchBuffer(downloadUrl);
      if (buf.length < 1500) continue; // must be real image bytes > 1.5KB
      
      return {
        buffer: buf,
        pageUrl: `https://commons.wikimedia.org/wiki/${encodeURIComponent(title.replace(/ /g, "_"))}`,
        directUrl: imgInfo.url,
        width: imgInfo.thumbwidth || imgInfo.width || 1000,
        height: imgInfo.thumbheight || imgInfo.height || 750,
        artist,
        license: licObj.license,
        licenseUrl: licObj.licenseUrl,
        title: title.replace(/^File:/, "").replace(/\.[^.]+$/, "").replace(/_/g, " "),
        sourceOrg: "Wikimedia Commons / National Heritage Archive"
      };
    } catch (e) {
      continue;
    }
  }
  return null;
}

module.exports = { searchAndGetImage, detectMime, MEDIA_DIR };
