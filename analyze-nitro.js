const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  console.log('Loading Nitro template...');
  await page.goto('https://www.framer.com/marketplace/templates/nitro/', {
    waitUntil: 'networkidle'
  });
  await page.waitForLoadState('networkidle');

  console.log('Scrolling to analyze...');
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
  await page.screenshot({ path: 'nitro-screenshot.png', fullPage: true });

  const analysis = await page.evaluate(() => {
    const analysis = {
      colors: { backgrounds: [], text: [], accents: [] },
      typography: { fontFamilies: [], fontSizes: [], fontWeights: [] },
      layout: {},
      components: { buttons: [], cards: [], sections: [] },
      structure: []
    };

    // Color extraction
    const uniqueColors = new Map();
    document.querySelectorAll('*').forEach(el => {
      const style = window.getComputedStyle(el);
      const bg = style.backgroundColor;
      const color = style.color;
      const border = style.borderColor;

      [bg, color, border].forEach(c => {
        if (c && c !== 'rgba(0, 0, 0, 0)' && c !== 'transparent') {
          uniqueColors.set(c, (uniqueColors.get(c) || 0) + 1);
        }
      });
    });

    const sortedColors = Array.from(uniqueColors.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .map(([color]) => color);

    analysis.colors.found = sortedColors;

    // Typography
    const fontFamilies = new Set();
    const fontSizes = new Set();
    const fontWeights = new Set();

    document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, button, a').forEach(el => {
      const style = window.getComputedStyle(el);
      fontFamilies.add(style.fontFamily);
      fontSizes.add(style.fontSize);
      fontWeights.add(style.fontWeight);
    });

    analysis.typography = {
      fontFamilies: Array.from(fontFamilies).slice(0, 8),
      fontSizes: Array.from(fontSizes).slice(0, 12),
      fontWeights: Array.from(fontWeights).slice(0, 6)
    };

    // Structure analysis
    const sections = document.querySelectorAll('section, [class*="section"], article, main > div');
    let sectionIndex = 0;

    sections.forEach((section, idx) => {
      const heading = section.querySelector('h1, h2, h3, h4');
      const text = section.innerText ? section.innerText.substring(0, 80) : '';
      const buttons = section.querySelectorAll('button, a[class*="button"]');
      const images = section.querySelectorAll('img');

      analysis.structure.push({
        index: idx,
        hasHeading: !!heading,
        headingText: heading ? heading.innerText.substring(0, 50) : '',
        preview: text.replace(/\n/g, ' ').trim(),
        buttonCount: buttons.length,
        imageCount: images.length,
        backgroundColor: window.getComputedStyle(section).backgroundColor
      });
    });

    // Component analysis
    const buttons = document.querySelectorAll('button, a[class*="button"], [role="button"]');
    buttons.forEach(btn => {
      const style = window.getComputedStyle(btn);
      analysis.components.buttons.push({
        text: btn.innerText?.substring(0, 30) || '',
        bgColor: style.backgroundColor,
        textColor: style.color,
        padding: style.padding
      });
    });

    // Layout
    analysis.layout = {
      bodyWidth: document.body.offsetWidth,
      scrollHeight: document.documentElement.scrollHeight,
      mainBg: window.getComputedStyle(document.body).backgroundColor
    };

    return analysis;
  });

  fs.writeFileSync('nitro-analysis.json', JSON.stringify(analysis, null, 2));

  console.log('\n=== Nitro Template Analysis ===');
  console.log('\nTop Colors:');
  analysis.colors.found.forEach((color, i) => console.log(`  ${i + 1}. ${color}`));

  console.log('\nFont Families:');
  analysis.typography.fontFamilies.forEach(font => console.log(`  - ${font}`));

  console.log('\nFont Sizes:');
  analysis.typography.fontSizes.forEach(size => console.log(`  - ${size}`));

  console.log('\nStructure (first 10 sections):');
  analysis.structure.slice(0, 10).forEach((sec, i) => {
    console.log(`  ${i + 1}. ${sec.headingText || 'No heading'} | Btns: ${sec.buttonCount} | Imgs: ${sec.imageCount}`);
    if (sec.preview) console.log(`     "${sec.preview.substring(0, 60)}..."`);
  });

  console.log('\nAnalysis saved to nitro-analysis.json');

  await browser.close();
})();
