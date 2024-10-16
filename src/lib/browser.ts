import { Browser, Page } from "puppeteer-core";

export class TBrowser {
  browser: Browser;
  constructor(browser: Browser) {
    this.browser = browser;
  }
  pages(): Promise<Page[]> {

    return new Promise(async (res, rej) => {


      res(
        (await this.browser.pages()).map((p) => {
          // const handler = {
          //   apply: function (target, thisArg, argumentsList) {
          //     console.log('screenshot was called with ' + JSON.stringify(argumentsList));
          //     const x: ScreenshotOptions = argumentsList[0]
          //     x.path = "./dist/" + x.path;
          //     console.log('x.path' + x.path, target, thisArg);
          //     return target(...argumentsList);
          //   }
          // };
          // p.screenshot = new Proxy(p.screenshot, handler);
          return p;
        })
      );
    });

  }
  // pages(): Promise<TPage[]> {
  //   return super.pages();
  // }
}