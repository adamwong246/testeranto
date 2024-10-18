"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Puppeteer = void 0;
class Puppeteer {
    constructor(browser) {
        this.browser = browser;
    }
    screenshot(page, path) {
        page.screenshot({
            path: `${path}`
        });
    }
    ;
    pages() {
        return new Promise(async (res, rej) => {
            res((await this.browser.pages()).map((p) => {
                return p;
            }));
        });
    }
}
exports.Puppeteer = Puppeteer;
