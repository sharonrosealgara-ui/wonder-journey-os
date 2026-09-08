const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

async function run() {
  const outDir = path.resolve(__dirname, '../artifacts/screenshots/sections-audit');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });

  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  const sections = [
    { id: 'live-experience', name: '01-live-classroom' },
    { id: 'celebrations', name: '02-celebrations' },
    { id: 'reflection', name: '03-parent-reflection' },
  ];

  for (const sec of sections) {
    const el = await page.$(`#${sec.id}`);
    if (el) {
      await el.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      await el.screenshot({ path: path.join(outDir, `${sec.name}.png`) });
      console.log(`Captured #${sec.id} to ${sec.name}.png`);
    } else {
      console.log(`Element #${sec.id} not found`);
    }
  }

  await browser.close();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
