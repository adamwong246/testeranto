import puppeteer from 'puppeteer';

async function main() {
  const browser = await puppeteer.connect({
    browserURL: 'http://web-builder:9222'
  });
  const page = await browser.newPage();
  await page.goto('about:blank');
  await browser.disconnect();
  return;
}

main()
