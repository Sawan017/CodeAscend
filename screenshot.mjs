import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SHOTS = path.join(__dirname, 'verify_shots');
if (!fs.existsSync(SHOTS)) fs.mkdirSync(SHOTS, { recursive: true });

const take = async (page, name, clip) => {
  const opts = { path: path.join(SHOTS, 'F_' + name), type: 'jpeg', quality: 92 };
  if (clip) opts.clip = clip;
  await page.screenshot(opts);
  console.log('✓', name);
};

const clickTab = async (page, label) => {
  const btns = await page.$$('button');
  for (const btn of btns) {
    const t = await page.evaluate(el => el.textContent?.trim() ?? '', btn);
    if (t.includes(label)) { await btn.click(); await new Promise(r => setTimeout(r, 650)); return; }
  }
  console.warn('Tab not found:', label);
};

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });

  // Desktop 1440
  {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto('http://localhost:5179', { waitUntil: 'domcontentloaded', timeout: 20000 });
    await new Promise(r => setTimeout(r, 2500));

    // VIDEO CHECK
    const vid = await page.$('video');
    console.log('VIDEO in DOM:', !!vid);
    if (vid) {
      const src = await page.evaluate(el => el.currentSrc || el.src || el.getAttribute('src') || 'none', vid);
      console.log('VIDEO src:', src);
      const rect = await page.evaluate(el => {
        const r = el.getBoundingClientRect();
        return { w: r.width, h: r.height, top: r.top };
      }, vid);
      console.log('VIDEO rect:', rect);
    }

    await take(page, '01_hero.jpg');
    await take(page, '02_nav.jpg', { x: 0, y: 0, width: 1440, height: 80 });

    await page.evaluate(() => window.scrollBy(0, 850));
    await new Promise(r => setTimeout(r, 500));
    await take(page, '03_skills.jpg');

    for (const label of ['Knowledge Checks', 'Coding Challenges', 'Achievements', 'Learning Sessions']) {
      await clickTab(page, label);
      await take(page, `04_${label.replace(/ /g, '_')}.jpg`);
    }

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await new Promise(r => setTimeout(r, 400));
    await take(page, '05_footer.jpg');
    await page.close();
  }

  // Tablet 768
  {
    const page = await browser.newPage();
    await page.setViewport({ width: 768, height: 1024 });
    await page.goto('http://localhost:5179', { waitUntil: 'domcontentloaded', timeout: 15000 });
    await new Promise(r => setTimeout(r, 1500));
    await take(page, '06_tablet.jpg');
    await page.close();
  }

  // Mobile 390
  {
    const page = await browser.newPage();
    await page.setViewport({ width: 390, height: 844 });
    await page.goto('http://localhost:5179', { waitUntil: 'domcontentloaded', timeout: 15000 });
    await new Promise(r => setTimeout(r, 1500));
    await take(page, '07_mobile.jpg');
    const sw = await page.evaluate(() => document.body.scrollWidth);
    console.log(`Mobile scrollWidth=${sw} ${sw > 390 ? '❌ OVERFLOW' : '✅ NO OVERFLOW'}`);
    await page.close();
  }

  await browser.close();
  console.log('All done. Saved to:', SHOTS);
})().catch(err => { console.error('ERROR:', err.message); process.exit(1); });
