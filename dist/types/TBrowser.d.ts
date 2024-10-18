import { Browser } from "puppeteer-core";
import { Page } from "puppeteer-core";
export declare class TBrowser {
    browser: Browser;
    constructor(browser: Browser);
    screenshot(page: Page, path: string): void;
    pages(): Promise<Page[]>;
}
