import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const errors = [];

page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', e => errors.push(e.message));

await page.goto('http://localhost:3000/connexion', { waitUntil: 'networkidle' });
await page.screenshot({ path: '/tmp/connexion-1-loaded.png', fullPage: true });

// Chercher le champ email/identifier
const emailInput = page.locator('input[name="identifier"]').first();
const hasInput = await emailInput.count() > 0;

if (hasInput) {
  await emailInput.fill('test@example.com');
  await page.screenshot({ path: '/tmp/connexion-2-filled.png', fullPage: true });

  const submitBtn = page.locator('button[type="submit"]').first();
  await submitBtn.click();
  await page.waitForTimeout(3000);
  await page.screenshot({ path: '/tmp/connexion-3-after-click.png', fullPage: true });
} else {
  console.log('INPUT NOT FOUND — inputs on page:', await page.locator('input').allInnerTexts());
}

console.log('ERRORS:', JSON.stringify(errors, null, 2));
console.log('FINAL URL:', page.url());
console.log('INPUT FOUND:', hasInput);

await browser.close();
