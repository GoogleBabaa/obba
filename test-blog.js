import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  console.log('🔍 Testing Florida Paycheck Calculator Blog...\n');

  try {
    // Navigate with proper wait
    await page.goto('http://localhost:5173/blogs/florida-paycheck-calculator-guide', { waitUntil: 'networkidle' });
    await page.waitForSelector('article', { timeout: 5000 });

    console.log('✅ Blog page loaded\n');

    // Check title
    const title = await page.title();
    console.log(`📄 Page Title: ${title}\n`);

    // Check H2 headings
    const h2s = await page.$$eval('h2', els => els.map(el => el.textContent.trim()));
    console.log(`📚 H2 Headings found (${h2s.length}):`);
    h2s.forEach((h, i) => console.log(`  ${i+1}. ${h}`));
    console.log();

    // Check H3 headings
    const h3s = await page.$$eval('h3', els => els.map(el => el.textContent.trim()));
    console.log(`📑 H3 Headings found (${h3s.length}):`);
    h3s.forEach((h, i) => console.log(`  ${i+1}. ${h}`));
    console.log();

    // Check images
    const images = await page.$$eval('img', imgs =>
      imgs.map(img => ({
        src: img.src,
        alt: img.alt,
        visible: img.offsetHeight > 0 && img.offsetWidth > 0,
        loaded: img.complete && img.naturalHeight > 0
      }))
    );
    console.log(`🖼️  Images found (${images.length}):`);
    images.forEach((img, i) => {
      console.log(`  ${i+1}. ${img.alt || 'No alt text'}`);
      console.log(`     src: ${img.src}`);
      console.log(`     visible: ${img.visible}, loaded: ${img.loaded}`);
    });
    console.log();

    // Check for Key Takeaways section
    const hasKeyTakeaways = await page.evaluate(() => {
      return document.body.textContent.includes('Key Takeaways');
    });
    console.log(`📌 Key Takeaways Section: ${hasKeyTakeaways ? '✅ Found' : '❌ Missing'}`);

    // Check for FAQ section
    const hasFAQ = await page.evaluate(() => {
      return document.body.textContent.includes('FAQ');
    });
    console.log(`❓ FAQ Section: ${hasFAQ ? '✅ Found' : '❌ Missing'}`);

    // Check for Related Calculators section
    const hasRelated = await page.evaluate(() => {
      return document.body.textContent.includes('Related Paycheck Calculators');
    });
    console.log(`🔗 Related Calculators: ${hasRelated ? '✅ Found' : '❌ Missing'}`);

    // Check for Conclusion section
    const hasConclusion = await page.evaluate(() => {
      return document.body.textContent.includes('Conclusion');
    });
    console.log(`📝 Conclusion Section: ${hasConclusion ? '✅ Found' : '❌ Missing'}`);

    console.log('\n✨ Test Complete!');

    // Summary
    console.log('\n📊 SUMMARY:');
    const issueCount = (images.length === 0 ? 1 : 0) + (h2s.length === 0 ? 1 : 0);
    if (issueCount === 0) {
      console.log('✅ All checks passed!');
    } else {
      console.log(`❌ ${issueCount} issue(s) found`);
      if (images.length === 0) console.log('   - Images not loading (check /images folder)');
      if (h2s.length === 0) console.log('   - H2 headings missing');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }

  await browser.close();
})();
