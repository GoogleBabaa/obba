import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  console.log('🔍 Debugging Florida Blog Page...\n');

  try {
    await page.goto('http://localhost:5173/blogs/florida-paycheck-calculator-guide', { waitUntil: 'networkidle' });

    // Wait for blog content to load
    await page.waitForSelector('h2', { timeout: 5000 }).catch(() => console.log('⚠️  No h2 found after wait'));

    // Get page content
    const content = await page.content();

    // Check if blog content is in DOM
    const hasBlogTitle = content.includes('Florida Paycheck Calculator – Estimate Your Take-Home Pay');
    const hasUnderstandingHeading = content.includes('Understanding Your Florida Paycheck');
    const hasKeyTakeaways = content.includes('Key Takeaways');

    console.log('📋 Content Check:');
    console.log(`  Blog Title in DOM: ${hasBlogTitle}`);
    console.log(`  Understanding Heading in DOM: ${hasUnderstandingHeading}`);
    console.log(`  Key Takeaways in DOM: ${hasKeyTakeaways}`);
    console.log();

    // Check document title
    const title = await page.title();
    console.log(`📄 Document Title: ${title}`);
    console.log();

    // Check if we're on /blogs page (redirect)
    const url = page.url();
    console.log(`🔗 Current URL: ${url}`);
    console.log();

    // Look for specific elements
    const articleCount = await page.$$eval('article', els => els.length);
    console.log(`📦 Article elements found: ${articleCount}`);

    const h2s = await page.$$eval('h2', els => els.map(e => e.textContent.trim()));
    console.log(`📚 H2 Headings: ${h2s.length}`);
    h2s.slice(0, 5).forEach(h => console.log(`   - ${h}`));

    // Get all text content for debugging
    const bodyText = await page.evaluate(() => document.body.innerText);
    const lines = bodyText.split('\n').filter(l => l.trim()).slice(0, 20);
    console.log('\n📄 First 20 lines of page text:');
    lines.forEach((line, i) => console.log(`  ${i+1}. ${line.substring(0, 70)}`));

  } catch (error) {
    console.error('❌ Error:', error.message);
  }

  await browser.close();
})();
