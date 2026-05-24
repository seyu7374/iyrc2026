const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  console.log('Loading page...');
  await page.goto('https://dynamiq.framer.website/cases/enhancing-inventory-management-for-brightmart', {
    waitUntil: 'networkidle'
  });
  await page.waitForLoadState('networkidle');

  console.log('Scrolling to analyze full page...');
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

  const analysis = await page.evaluate(() => {
    const analysis = {
      colors: {},
      typography: {},
      layout: {},
      components: {},
      sections: []
    };

    // Color Analysis
    const uniqueColors = new Set();
    const bgColors = new Set();
    const textColors = new Set();
    const borderColors = new Set();

    document.querySelectorAll('*').forEach(el => {
      const style = window.getComputedStyle(el);
      const bg = style.backgroundColor;
      const color = style.color;
      const border = style.borderColor;

      if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') bgColors.add(bg);
      if (color && color !== 'rgba(0, 0, 0, 0)') textColors.add(color);
      if (border && border !== 'rgba(0, 0, 0, 0)') borderColors.add(border);
    });

    analysis.colors = {
      backgrounds: Array.from(bgColors).slice(0, 10),
      text: Array.from(textColors).slice(0, 10),
      borders: Array.from(borderColors).slice(0, 5)
    };

    // Typography Analysis
    const fontFamilies = new Set();
    const fontSizes = new Set();
    const fontWeights = new Set();

    document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, a, button').forEach(el => {
      const style = window.getComputedStyle(el);
      fontFamilies.add(style.fontFamily);
      fontSizes.add(style.fontSize);
      fontWeights.add(style.fontWeight);
    });

    analysis.typography = {
      fontFamilies: Array.from(fontFamilies).slice(0, 8),
      fontSizes: Array.from(fontSizes).slice(0, 10),
      fontWeights: Array.from(fontWeights).slice(0, 6)
    };

    // Section Analysis
    const sections = document.querySelectorAll('section, [class*="section"], article, [class*="container"]');
    let sectionCount = 0;

    sections.forEach(section => {
      const heading = section.querySelector('h1, h2, h3');
      const text = section.innerText ? section.innerText.substring(0, 100) : '';
      const elementType = section.tagName.toLowerCase();
      const classes = section.className;

      analysis.sections.push({
        type: elementType,
        classes: classes.substring(0, 100),
        hasHeading: !!heading,
        headingText: heading ? heading.innerText.substring(0, 50) : '',
        preview: text
      });

      sectionCount++;
    });

    // Component Analysis
    const buttons = document.querySelectorAll('button, a[class*="button"], [role="button"]');
    const links = document.querySelectorAll('a');
    const images = document.querySelectorAll('img');
    const inputs = document.querySelectorAll('input, textarea');

    analysis.components = {
      buttons: {
        count: buttons.length,
        sample: Array.from(buttons).slice(0, 3).map(b => ({
          text: b.innerText || b.textContent,
          classes: b.className.substring(0, 50)
        }))
      },
      links: {
        count: links.length
      },
      images: {
        count: images.length
      },
      inputs: {
        count: inputs.length
      }
    };

    // Layout Analysis
    const body = document.body;
    const html = document.documentElement;
    const bodyStyle = window.getComputedStyle(body);
    const firstSection = document.querySelector('main, [role="main"], section, article');

    analysis.layout = {
      bodyWidth: body.offsetWidth,
      bodyHeight: body.offsetHeight,
      mainBg: bodyStyle.backgroundColor,
      mainPadding: bodyStyle.padding,
      mainMargin: bodyStyle.margin,
      firstSectionTag: firstSection ? firstSection.tagName.toLowerCase() : 'unknown',
      scrollHeight: document.documentElement.scrollHeight
    };

    return analysis;
  });

  fs.writeFileSync('design-analysis.json', JSON.stringify(analysis, null, 2));
  console.log('\nDetailed Analysis:');
  console.log(JSON.stringify(analysis, null, 2));

  await browser.close();
})();
