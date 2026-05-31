const { chromium } = require('playwright');

(async () => {
  const b = await chromium.launch({ headless: true });
  const p = await b.newPage({ viewport: { width: 1440, height: 2000 } });
  const base = 'http://127.0.0.1:5173';
  const out = [];
  const check = async (name, fn) => { try { await fn(); out.push([name,'PASS']); } catch (e) { out.push([name,'FAIL',e.message.split('\n')[0]]); } };

  await p.goto(base, { waitUntil: 'networkidle' });
  await check('Cards visible', async () => {
    for (const t of ['No Tax on Overtime','No Tax on Tips','Senior Deduction','Car Loan Interest']) {
      await p.locator(`text=${t}`).first().waitFor();
    }
  });

  await check('Overtime fields + calc changes', async () => {
    await p.click('a:has-text("No Tax on Overtime")');
    await p.locator('text=No Tax on Overtime Calculator').waitFor();
    const before = await p.locator('text=Tax Savings').textContent();
    await p.locator('input[type="number"]').nth(0).fill('30');
    await p.locator('input[type="number"]').nth(1).fill('7');
    await p.waitForTimeout(120);
    const after = await p.locator('text=Tax Savings').textContent();
    if (before === after) throw new Error('No update');
  });

  await check('Tips fields + calc changes', async () => {
    await p.goto(base + '/tips', { waitUntil: 'networkidle' });
    const before = await p.locator('text=Tax Savings').textContent();
    await p.locator('input[type="number"]').nth(0).fill('12000');
    await p.locator('input[type="number"]').nth(1).fill('200000');
    await p.waitForTimeout(120);
    const after = await p.locator('text=Tax Savings').textContent();
    if (before === after) throw new Error('No update');
  });

  await check('Senior fields + calc changes', async () => {
    await p.goto(base + '/senior', { waitUntil: 'networkidle' });
    const before = await p.locator('text=Tax Savings').textContent();
    await p.locator('input[type="number"]').nth(0).fill('68');
    await p.locator('input[type="number"]').nth(1).fill('90000');
    await p.waitForTimeout(120);
    const after = await p.locator('text=Tax Savings').textContent();
    if (before === after) throw new Error('No update');
  });

  await check('Car fields + calc changes', async () => {
    await p.goto(base + '/car-loan', { waitUntil: 'networkidle' });
    const before = await p.locator('text=Tax Savings').textContent();
    await p.locator('input[type="number"]').nth(0).fill('40000');
    await p.locator('input[type="number"]').nth(1).fill('7.2');
    await p.waitForTimeout(120);
    const after = await p.locator('text=Tax Savings').textContent();
    if (before === after) throw new Error('No update');
    // Verify required eligibility fields exist
    for (const lbl of ['Vehicle is NEW','Personal use only','NOT business use','NOT lease','Loan date after Dec 31, 2024','Vehicle GVWR under 14,000 lbs']) {
      await p.locator(`text=${lbl}`).first().waitFor();
    }
  });

  console.log(JSON.stringify(out));
  await b.close();
})();
