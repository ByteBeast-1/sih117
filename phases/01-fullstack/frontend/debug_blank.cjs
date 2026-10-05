const puppeteer = require('puppeteer');

(async () => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    // Capture console messages
    page.on('console', msg => {
      console.log(`BROWSER CONSOLE [${msg.type()}]: ${msg.text()}`);
    });

    // Capture page errors (unhandled exceptions)
    page.on('pageerror', err => {
      console.log(`BROWSER ERROR: ${err.toString()}`);
    });

    console.log('Navigating to http://localhost:3000 ...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    
    // Let it settle for a sec
    await new Promise(r => setTimeout(r, 1000));
    
    await browser.close();
  } catch (error) {
    console.error('PUPPETEER ERROR:', error);
  }
})();
