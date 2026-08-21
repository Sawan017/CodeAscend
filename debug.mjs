import puppeteer from 'puppeteer';

(async () => {
  let browser;
  try {
    browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.error('BROWSER ERROR:', msg.text());
      } else {
        console.log('BROWSER:', msg.text());
      }
    });
    
    page.on('pageerror', error => {
      console.error('UNCAUGHT EXCEPTION:', error.message);
    });

    console.log('Navigating to projects page...');
    await page.goto('http://localhost:5173/#view=projects', { waitUntil: 'networkidle0' });
    
    // Give time to render
    await new Promise(r => setTimeout(r, 2000));
    
    console.log('Finding a project to click...');
    const clicked = await page.evaluate(() => {
      const projects = Array.from(document.querySelectorAll('h4')).filter(h4 => h4.innerText.includes('GitHub') || h4.parentElement);
      if (projects.length > 0) {
        // Find closest clickable div
        let curr = projects[0];
        while (curr && curr !== document.body) {
           const style = curr.getAttribute('style') || '';
           if (style.includes('cursor: pointer') || curr.onclick) {
             curr.click();
             return true;
           }
           curr = curr.parentElement;
        }
      }
      return false;
    });
    
    console.log('Clicked?', clicked);
    
    await new Promise(r => setTimeout(r, 2000));
    
    console.log('Current URL:', page.url());
    const text = await page.evaluate(() => document.body.innerText);
    console.log('Page text snapshot:', text.slice(0, 200));
    
  } catch (err) {
    console.error('SCRIPT EXCEPTION:', err);
  } finally {
    if (browser) await browser.close();
  }
})();
