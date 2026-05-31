const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 2200 } });
  const base = 'http://127.0.0.1:5173/';
  const results = [];

  const check = async (name, fn) => {
    try { await fn(); results.push({ name, status: 'PASS' }); }
    catch (e) { results.push({ name, status: 'FAIL', error: e.message.split('\n')[0] }); }
  };

  const fillVisibleCalcInput = async (value) => {
    const vis = page.locator('#calculator input[type="number"]:visible');
    const c = await vis.count();
    if (c < 2) throw new Error('Expected calculator-specific visible input not found');
    await vis.nth(c - 1).fill(String(value));
  };

  await page.goto(base, { waitUntil: 'networkidle' });

  await check('Header nav Home', async () => { await page.click('nav a:has-text("Home")'); });
  await check('Header nav Overtime', async () => { await page.click('nav a:has-text("Overtime")'); await page.waitForSelector('#calculator'); });
  await check('Header nav Tips', async () => { await page.click('nav a:has-text("Tips")'); await page.waitForSelector('#calculator'); });
  await check('Header nav Senior', async () => { await page.click('nav a:has-text("Senior")'); await page.waitForSelector('#calculator'); });
  await check('Header nav Car Loan', async () => { await page.click('nav a:has-text("Car Loan")'); await page.waitForSelector('#calculator'); });
  await check('Footer link Privacy Policy', async () => { await page.click('a:has-text("Privacy Policy")'); });
  await check('Theme toggle', async () => { await page.locator('header button').first().click(); await page.locator('header button').first().click(); });

  await check('Overtime calculator input updates', async () => {
    await page.click('#calculator button:has-text("Overtime")');
    const before = await page.locator('text=Estimated annual federal savings').first().textContent();
    await fillVisibleCalcInput(320);
    await page.waitForTimeout(120);
    const after = await page.locator('text=Estimated annual federal savings').first().textContent();
    if (before === after) throw new Error('Savings unchanged');
  });

  await check('Tips calculator input updates', async () => {
    await page.click('#calculator button:has-text("Tips")');
    const before = await page.locator('text=Estimated annual federal savings').first().textContent();
    await fillVisibleCalcInput(18000);
    await page.waitForTimeout(120);
    const after = await page.locator('text=Estimated annual federal savings').first().textContent();
    if (before === after) throw new Error('Savings unchanged');
  });

  await check('Senior calculator input updates', async () => {
    await page.click('#calculator button:has-text("Senior")');
    const before = await page.locator('text=Estimated annual federal savings').first().textContent();
    await fillVisibleCalcInput(1);
    await page.waitForTimeout(120);
    const after = await page.locator('text=Estimated annual federal savings').first().textContent();
    if (!after || before === null) throw new Error('Result missing');
  });

  await check('Car Loan calculator input updates', async () => {
    await page.click('#calculator button:has-text("Car Loan")');
    const before = await page.locator('text=Estimated annual federal savings').first().textContent();
    await fillVisibleCalcInput(5000);
    await page.waitForTimeout(120);
    const after = await page.locator('text=Estimated annual federal savings').first().textContent();
    if (before === after) throw new Error('Savings unchanged');
  });

  await check('Mobile menu Terms', async () => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload({ waitUntil: 'networkidle' });
    await page.locator('header button').nth(1).click();
    await page.click('a:has-text("Terms")');
  });

  await page.setViewportSize({ width: 1440, height: 2200 });
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'playwright-verify-desktop.png', fullPage: true });
  console.log(JSON.stringify(results, null, 2));
  await browser.close();
})();
