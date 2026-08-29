const fs = require('fs');
const path = require('path');
const https = require('https');
const crypto = require('crypto');
const sharp = require('sharp');
const { CANONICAL_SPECS } = require('./canonical-media-specs');

function stripHtml(html) {
  if (!html) return '';
  return html
    .replace(/<[^>]*>?/gm, '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'WonderJourneyProvenanceResolver/1.0 (edu@wonderjourney.app)' } }, (res) => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

async function searchCommons(query) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srnamespace=6&format=json`;
  const data = await fetchJson(url);
  return data?.query?.search || [];
}

async function getExtMetadata(title) {
  const cleanTitle = title.replace(/^File:/i, '');
  const url = `https://commons.wikimedia.org/w/api.php?action=query&prop=imageinfo&iiprop=extmetadata|size|mime|url&titles=File:${encodeURIComponent(cleanTitle)}&format=json`;
  const data = await fetchJson(url);
  if (!data?.query?.pages) return null;
  const page = Object.values(data.query.pages)[0];
  if (!page || page.missing !== undefined || !page.imageinfo || !page.imageinfo[0]) return null;
  
  const info = page.imageinfo[0];
  const meta = info.extmetadata || {};
  
  const rawArtist = meta.Artist?.value || meta.Credit?.value || '';
  const cleanArtist = stripHtml(rawArtist);
  const rawCredit = meta.Credit?.value || '';
  const cleanCredit = stripHtml(rawCredit);
  const licenseShortName = meta.LicenseShortName?.value || meta.License?.value || '';
  const licenseUrl = meta.LicenseUrl?.value || (licenseShortName.includes('Public domain') ? 'https://commons.wikimedia.org/wiki/Public_domain' : '');
  const attribution = stripHtml(meta.Attribution?.value || '');
  const description = stripHtml(meta.ImageDescription?.value || '');
  
  return {
    sourceFileTitle: page.title,
    artist: cleanArtist || cleanCredit || 'Unknown Artist',
    credit: cleanCredit || cleanArtist,
    licenseShortName: licenseShortName || 'Public domain',
    licenseUrl: licenseUrl || 'https://commons.wikimedia.org/wiki/Public_domain',
    attribution,
    description,
    sourceUrl: info.descriptionurl || `https://commons.wikimedia.org/wiki/${encodeURIComponent(page.title)}`,
    mime: info.mime,
  };
}

async function main() {
  console.log(`Resolving exact metadata for 130 canonical items...`);
  const resolved = [];
  
  for (let i = 0; i < CANONICAL_SPECS.length; i++) {
    const spec = CANONICAL_SPECS[i];
    let meta = await getExtMetadata(spec.commonsFile);
    
    if (!meta) {
      // Search by title or keywords
      const searchQuery = spec.title.replace(/[\(\)]/g, '') + ' Philippines';
      const searchHits = await searchCommons(searchQuery);
      if (searchHits.length > 0) {
        meta = await getExtMetadata(searchHits[0].title);
      }
    }
    
    if (!meta) {
      // Fallback search with simplified query
      const simplified = spec.commonsFile.replace(/_/g, ' ').replace(/\.(jpg|png|svg|JPG)/, '');
      const searchHits = await searchCommons(simplified);
      if (searchHits.length > 0) {
        meta = await getExtMetadata(searchHits[0].title);
      }
    }
    
    resolved.push({
      index: i + 1,
      id: spec.id,
      lessonId: spec.lessonId,
      title: spec.title,
      classification: spec.classification,
      originalCommonsFile: spec.commonsFile,
      meta,
    });
    
    process.stdout.write(`[${i+1}/130] ${spec.id}: ${meta ? meta.sourceFileTitle + ' (' + meta.artist + ', ' + meta.licenseShortName + ')' : 'NOT FOUND'}\n`);
    await new Promise(r => setTimeout(r, 120));
  }
  
  fs.writeFileSync(path.join(__dirname, '../artifacts/resolved-extmetadata.json'), JSON.stringify(resolved, null, 2), 'utf8');
  console.log('Finished! Saved to artifacts/resolved-extmetadata.json');
}

main();
