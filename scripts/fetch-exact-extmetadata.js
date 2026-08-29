const fs = require('fs');
const path = require('path');
const https = require('https');
const crypto = require('crypto');
const sharp = require('sharp');
const { CANONICAL_SPECS } = require('./canonical-media-specs');

function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>?/gm, '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim();
}

function fetchWikimediaMetadata(fileName) {
  return new Promise((resolve) => {
    const cleanTitle = fileName.replace(/^File:/i, '').replace(/ /g, '_');
    const apiUrl = `https://commons.wikimedia.org/w/api.php?action=query&prop=imageinfo&iiprop=extmetadata|size|mime|url&titles=File:${encodeURIComponent(cleanTitle)}&format=json`;
    
    https.get(apiUrl, { headers: { 'User-Agent': 'WonderJourneyExactProvenanceAuditor/1.0 (edu@wonderjourney.app)' } }, (res) => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const pages = json.query?.pages;
          if (!pages) return resolve(null);
          const page = Object.values(pages)[0];
          if (!page || page.missing !== undefined || !page.imageinfo || !page.imageinfo[0]) {
            return resolve(null);
          }
          const info = page.imageinfo[0];
          const meta = info.extmetadata || {};
          
          const artist = stripHtml(meta.Artist?.value || meta.Credit?.value || '');
          const credit = stripHtml(meta.Credit?.value || '');
          const licenseShortName = meta.LicenseShortName?.value || meta.License?.value || '';
          const licenseUrl = meta.LicenseUrl?.value || '';
          const attribution = stripHtml(meta.Attribution?.value || '');
          const objectName = stripHtml(meta.ObjectName?.value || '');
          
          resolve({
            artist,
            credit,
            licenseShortName,
            licenseUrl,
            attribution,
            objectName,
            description: stripHtml(meta.ImageDescription?.value || ''),
            sourceUrl: info.descriptionurl || `https://commons.wikimedia.org/wiki/File:${cleanTitle}`,
          });
        } catch (e) {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

async function run() {
  console.log(`Auditing exact Wikimedia extmetadata for all ${CANONICAL_SPECS.length} assets...`);
  const results = [];
  
  for (let i = 0; i < CANONICAL_SPECS.length; i++) {
    const spec = CANONICAL_SPECS[i];
    const localFileName = `l${String(Math.floor(i / 2) + 1).padStart(2, '0')}-visual-${i % 2 === 0 ? 'a' : 'b'}.${spec.commonsFile.endsWith('.png') ? 'png' : spec.commonsFile.endsWith('.svg') ? 'svg' : 'jpg'}`;
    const localPath = path.join(__dirname, '../public/media/curriculum', localFileName);
    
    let sha256 = '';
    let byteSize = 0;
    let width = 1280;
    let height = 720;
    
    if (fs.existsSync(localPath)) {
      const buf = fs.readFileSync(localPath);
      byteSize = buf.length;
      sha256 = crypto.createHash('sha256').update(buf).digest('hex');
      try {
        if (!localFileName.endsWith('.svg')) {
          const meta = await sharp(buf).metadata();
          width = meta.width || 1280;
          height = meta.height || 720;
        }
      } catch (e) {}
    }
    
    const wikiMeta = await fetchWikimediaMetadata(spec.commonsFile);
    results.push({
      index: i + 1,
      id: spec.id,
      lessonId: spec.lessonId,
      commonsFile: spec.commonsFile,
      localFileName,
      sha256,
      byteSize,
      width,
      height,
      wikiMeta,
    });
    
    process.stdout.write(`Processed ${i + 1}/${CANONICAL_SPECS.length}: ${spec.commonsFile} -> ${wikiMeta ? 'FOUND' : 'MISSING'}\n`);
    await new Promise(r => setTimeout(r, 100)); // Respectful rate limit
  }
  
  fs.writeFileSync(path.join(__dirname, '../artifacts/raw-wiki-metadata.json'), JSON.stringify(results, null, 2), 'utf8');
  console.log('Saved raw metadata to artifacts/raw-wiki-metadata.json');
}

run();
