"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TBrowser = void 0;
class TBrowser {
    constructor(browser) {
        this.browser = browser;
    }
    screenshot(page, path) {
        page.screenshot({
            path: 'hello98.jpg'
        });
    }
    ;
    pages() {
        return new Promise(async (res, rej) => {
            res((await this.browser.pages()).map((p) => {
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
            }));
        });
    }
}
exports.TBrowser = TBrowser;
