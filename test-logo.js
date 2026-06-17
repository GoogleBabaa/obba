import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  console.log('🔍 Checking Logo...\n');

  try {
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });

    // Get logo element info
    const logoBox = await page.locator('header > div > div:first-child > div:first-child').boundingBox();
    console.log('📦 Logo Box Dimensions:');
    console.log(`  Width: ${logoBox?.width}, Height: ${logoBox?.height}`);
    console.log(`  X: ${logoBox?.x}, Y: ${logoBox?.y}`);

    // Get computed styles
    const bgColor = await page.locator('header > div > div:first-child > div:first-child').evaluate(el => {
      return window.getComputedStyle(el).backgroundImage;
    });
    console.log(`\n🎨 Background:${bgColor}`);

    // Get logo text
    const logoText = await page.locator('header div:has-text("OBBBA Tax Calculators")').first().textContent();
    console.log(`\n📝 Logo Text: ${logoText?.trim()}`);

    // Take screenshot of header
    const headerBox = await page.locator('header').first().boundingBox();
    if (headerBox) {
      await page.screenshot({
        path: 'logo-screenshot.png',
        clip: {
          x: headerBox.x,
          y: headerBox.y,
          width: headerBox.width,
          height: headerBox.height
        }
      });
      console.log('\n✅ Screenshot saved: logo-screenshot.png');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }

  await browser.close();
})();
