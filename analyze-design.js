const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  console.log('Navigating to URL...');
  await page.goto('https://dynamiq.framer.website/cases/enhancing-inventory-management-for-brightmart', {
    waitUntil: 'networkidle'
  });

  console.log('Page loaded. Waiting for content...');
  await page.waitForLoadState('networkidle');

  console.log('Scrolling to end of page...');
  await page.evaluate(() => {
    return new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        window.scrollBy(0, distance);
        totalHeight += distance;
        if (totalHeight >= document.body.scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });

  console.log('Taking screenshot...');
  await page.screenshot({ path: 'design-screenshot.png', fullPage: true });

  console.log('Analyzing HTML structure...');
  const htmlContent = await page.content();
  fs.writeFileSync('page-html.html', htmlContent);

  console.log('Extracting computed styles...');
  const styleAnalysis = await page.evaluate(() => {
    const analysis = {
      colors: {},
      fonts: {},
      layout: {},
      components: {}
    };

    // Get background colors
    const html = document.documentElement;
    const body = document.body;
    const htmlStyle = window.getComputedStyle(html);
    const bodyStyle = window.getComputedStyle(body);

    analysis.backgroundColor = bodyStyle.backgroundColor || htmlStyle.backgroundColor;
    analysis.textColor = bodyStyle.color || htmlStyle.color;

    // Collect all unique colors
    const colors = new Set();
    const fonts = new Set();

    document.querySelectorAll('*').forEach(el => {
      const style = window.getComputedStyle(el);
      colors.add(style.color);
      colors.add(style.backgroundColor);
      colors.add(style.borderColor);
      const fontFamily = style.fontFamily;
      if (fontFamily) fonts.add(fontFamily);
    });

    analysis.colorsFound = Array.from(colors).filter(c => c && c !== 'rgba(0, 0, 0, 0)' && c !== 'transparent').slice(0, 20);
    analysis.fontsFound = Array.from(fonts).slice(0, 10);

    // Analyze layout structure
    const header = document.querySelector('header, nav, [role="banner"]');
    const hero = document.querySelector('[class*="hero"], [class*="banner"], main > div:first-child');
    const sections = document.querySelectorAll('section, [class*="section"], article');
    const buttons = document.querySelectorAll('button, a[class*="button"], input[type="button"]');
    const cards = document.querySelectorAll('[class*="card"], article, [class*="item"]');

    analysis.structure = {
      hasHeader: !!header,
      hasHero: !!hero,
      sectionCount: sections.length,
      buttonCount: buttons.length,
      cardCount: cards.length
    };

    return analysis;
  });

  fs.writeFileSync('style-analysis.json', JSON.stringify(styleAnalysis, null, 2));

  console.log('Analysis complete!');
  console.log('Files created:');
  console.log('- design-screenshot.png');
  console.log('- page-html.html');
  console.log('- style-analysis.json');

  console.log('\nStyle Analysis Results:');
  console.log(JSON.stringify(styleAnalysis, null, 2));

  await browser.close();
})();
