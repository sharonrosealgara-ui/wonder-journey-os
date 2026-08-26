const https = require("https");
const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        "User-Agent": "WonderJourneyOS/1.0 (Educational Classroom Integration; contact@wonderjourney.app) Node.js"
      }
    }, (res) => {
      let body = "";
      res.on("data", c => body += c);
      res.on("end", () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          reject(e);
        }
      });
      res.on("error", reject);
    }).on("error", reject);
  });
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
        if (redir.startsWith("/")) redir = `${parsed.protocol}//${parsed.host}${redir}`;
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

function cleanHtml(str) {
  if (!str) return "";
  return str.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

async function getCommonsFileMetadata(filename) {
  const cleanFilename = filename.replace(/^File:/i, "").trim();
  const apiUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=File:${encodeURIComponent(cleanFilename)}&prop=imageinfo&iiprop=url|size|mime|extmetadata|sha1&format=json`;
  const data = await fetchJSON(apiUrl);
  const pages = data.query?.pages || {};
  const pageKey = Object.keys(pages)[0];
  if (!pageKey || pageKey === "-1") {
    throw new Error(`File not found on Wikimedia Commons: ${cleanFilename}`);
  }
  const info = pages[pageKey]?.imageinfo?.[0];
  if (!info) {
    throw new Error(`No imageinfo for: ${cleanFilename}`);
  }

  const meta = info.extmetadata || {};
  const artist = cleanHtml(meta.Artist?.value || meta.Author?.value || meta.Credit?.value || "");
  const licenseShort = meta.LicenseShortName?.value || meta.UsageTerms?.value || "";
  const licenseUrl = meta.LicenseUrl?.value || "";
  const description = cleanHtml(meta.ImageDescription?.value || meta.ObjectName?.value || cleanFilename);
  const objectName = cleanHtml(meta.ObjectName?.value || "");

  // Map license strictly
  let license = "Public Domain";
  let finalLicenseUrl = "https://creativecommons.org/publicdomain/mark/1.0/";

  const lNorm = (licenseShort || "").toLowerCase();
  if (lNorm.includes("public domain") || lNorm.includes("pd") || lNorm.includes("cc0")) {
    license = "Public Domain";
    finalLicenseUrl = "https://creativecommons.org/publicdomain/mark/1.0/";
  } else if (lNorm.includes("by-sa 4") || lNorm.includes("by-sa-4")) {
    license = "CC BY-SA 4.0";
    finalLicenseUrl = "https://creativecommons.org/licenses/by-sa/4.0/";
  } else if (lNorm.includes("by 4") || lNorm.includes("by-4")) {
    license = "CC BY 4.0";
    finalLicenseUrl = "https://creativecommons.org/licenses/by/4.0/";
  } else if (lNorm.includes("by-sa 3") || lNorm.includes("by-sa-3")) {
    license = "CC BY-SA 3.0";
    finalLicenseUrl = "https://creativecommons.org/licenses/by-sa/3.0/";
  } else if (lNorm.includes("by 3") || lNorm.includes("by-3")) {
    license = "CC BY-SA 3.0";
    finalLicenseUrl = "https://creativecommons.org/licenses/by-sa/3.0/";
  } else if (lNorm.includes("by 2") || lNorm.includes("by-2")) {
    license = "CC BY 2.0";
    finalLicenseUrl = "https://creativecommons.org/licenses/by/2.0/";
  } else if (licenseUrl) {
    if (licenseUrl.includes("by-sa/4.0")) { license = "CC BY-SA 4.0"; finalLicenseUrl = "https://creativecommons.org/licenses/by-sa/4.0/"; }
    else if (licenseUrl.includes("by/4.0")) { license = "CC BY 4.0"; finalLicenseUrl = "https://creativecommons.org/licenses/by/4.0/"; }
    else if (licenseUrl.includes("by-sa/3.0")) { license = "CC BY-SA 3.0"; finalLicenseUrl = "https://creativecommons.org/licenses/by-sa/3.0/"; }
    else if (licenseUrl.includes("by/2.0")) { license = "CC BY 2.0"; finalLicenseUrl = "https://creativecommons.org/licenses/by/2.0/"; }
    else if (licenseUrl.includes("publicdomain") || licenseUrl.includes("zero")) { license = "Public Domain"; finalLicenseUrl = "https://creativecommons.org/publicdomain/mark/1.0/"; }
  }

  return {
    filename: cleanFilename,
    url: info.url,
    width: info.width,
    height: info.height,
    mime: info.mime,
    artist: artist || "Wikimedia Commons Contributor",
    license,
    licenseUrl: finalLicenseUrl,
    description,
    objectName: objectName || cleanFilename.replace(/\.[^.]+$/, "").replace(/_/g, " "),
    sourceUrl: `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(cleanFilename)}`
  };
}

module.exports = {
  getCommonsFileMetadata,
  fetchBuffer,
  fetchJSON,
  cleanHtml
};
