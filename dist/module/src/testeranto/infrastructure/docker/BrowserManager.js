export class BrowserManager {
    constructor() {
        this.browser = null;
        this.webPages = new Map();
        console.log(`🌐 BrowserManager initialized`);
    }
    async initialize() {
        console.log(`🌐 Puppeteer will be launched by individual web test wrappers`);
        // Browser initialization is handled by individual test wrappers
    }
    async createPage(testId) {
        if (!this.browser) {
            throw new Error("Puppeteer browser not initialized");
        }
        const page = await this.browser.newPage();
        this.webPages.set(testId, page);
        return page;
    }
    async closePage(testId) {
        const page = this.webPages.get(testId);
        if (page) {
            await page.close();
            this.webPages.delete(testId);
        }
    }
    setBrowser(browser) {
        this.browser = browser;
    }
    getBrowser() {
        return this.browser;
    }
    async closeAll() {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for (const [testId, page] of this.webPages) {
            await page.close();
        }
        this.webPages.clear();
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
        }
    }
}
