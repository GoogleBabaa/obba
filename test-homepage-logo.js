import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  console.log('🏠 Testing Homepage with New Logo...\n');

  try {
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle', timeout: 10000 });

    // Take screenshot of full header
    const header = await page.locator('header').first();
    await header.waitFor({ timeout: 5000 });

    const box = await header.boundingBox();
    if (box) {
      await page.screenshot({
        path: 'homepage-logo.png',
        clip: {
          x: box.x,
          y: box.y,
          width: box.width,
          height: box.height + 50
        }
      });
      console.log('✅ Screenshot saved: homepage-logo.png');

      // Check logo image
      const logoImg = await page.locator('header img[src="/logo.png"]').first();
      const isVisible = await logoImg.isVisible();

      console.log(`\n🖼️  Logo Image Status:`);
      console.log(`   Visible: ${isVisible}`);

      if (isVisible) {
        const src = await logoImg.getAttribute('src');
        const alt = await logoImg.getAttribute('alt');
        console.log(`   src: ${src}`);
        console.log(`   alt: ${alt}`);
        console.log('\n✅ Logo displaying correctly!');
      } else {
        console.log('   ❌ Logo image not visible');
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }

  await browser.close();
})();
