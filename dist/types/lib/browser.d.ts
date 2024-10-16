import { Browser, Page } from "puppeteer-core";
export declare class TBrowser {
    browser: Browser;
    constructor(browser: Browser);
    pages(): Promise<Page[]>;
}
