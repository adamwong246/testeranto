export class Puppeteer {
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
