const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

async function run() {
  const outDir = path.resolve(__dirname, '../artifacts/screenshots/portfolio-audit');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });

  const viewports = [
    { name: '01-landing-4k-3840x2160', width: 3840, height: 2160 },
    { name: '02-landing-desktop-1920x1080', width: 1920, height: 1080 },
    { name: '03-landing-laptop-1440x900', width: 1440, height: 900 },
    { name: '04-landing-tablet-portrait-768x1024', width: 768, height: 1024 },
    { name: '05-landing-tablet-landscape-1024x768', width: 1024, height: 768 },
    { name: '06-landing-mobile-390x844', width: 390, height: 844 },
  ];

  for (const vp of viewports) {
    console.log(`Capturing ${vp.name} (${vp.width}x${vp.height})...`);
    const page = await browser.newPage({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: vp.width >= 3840 ? 1 : 2,
    });

    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000); // Allow 3D canvas and animations to stabilize

    // Viewport screenshot (above-the-fold hero impression)
    await page.screenshot({
      path: path.join(outDir, `${vp.name}-hero.png`),
      fullPage: false,
    });

    // Full-page screenshot (entire page flow, layout, typography, sections)
    await page.screenshot({
      path: path.join(outDir, `${vp.name}-fullpage.png`),
      fullPage: true,
    });

    await page.close();
  }

  await browser.close();
  console.log('Portfolio audit captures complete!');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
