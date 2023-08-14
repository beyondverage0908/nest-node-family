import { chromium } from 'playwright';

export default class Baidu {
  async start() {
    const browser = await chromium.launch();
    const userAgent =
      'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1';
    const context = await browser.newContext({ userAgent: userAgent });
    const page = await context.newPage();

    await page.goto('https://www.baidu.com', { waitUntil: 'domcontentloaded' });
    const btnText = await page.$eval('#index-bn', (btn) => btn.textContent);
    console.log('12345', btnText);

    await page.close();
    await context.close();
    await browser.close();
  }
}
