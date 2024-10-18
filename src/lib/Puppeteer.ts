import { Browser } from "puppeteer-core";
import { Page } from "puppeteer-core";

export class Puppeteer {
  browser: Browser;

  constructor(browser: Browser) {
    this.browser = browser;
  }

  screenshot(page: Page, path: string) {
    page.screenshot({
      path: `${path}`
    })
  };

  pages(): Promise<Page[]> {
    return new Promise(async (res, rej) => {
      res(
        (await this.browser.pages()).map((p) => {
          return p;
        })
      );
    });

  }

}