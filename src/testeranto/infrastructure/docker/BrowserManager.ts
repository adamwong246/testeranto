import { Browser, Page } from "puppeteer-core/lib/esm/puppeteer";

export class BrowserManager {
  private browser: Browser | null = null;
  private webPages: Map<string, Page> = new Map();
  private logger: {
    log: (...args: any[]) => void;
    error: (...args: any[]) => void;
    warn?: (...args: any[]) => void;
    info?: (...args: any[]) => void;
  };

  constructor(logger?: {
    log: (...args: any[]) => void;
    error: (...args: any[]) => void;
    warn?: (...args: any[]) => void;
    info?: (...args: any[]) => void;
  }) {
    this.logger = {
      log: logger?.log || console.log,
      error: logger?.error || console.error,
      warn: logger?.warn || console.warn,
      info: logger?.info || console.info,
    };
    this.logger.log(`🌐 BrowserManager initialized`);
  }

  public async initialize(): Promise<void> {
    this.logger.log(
      `🌐 Puppeteer will be launched by individual web test wrappers`
    );
    // Browser initialization is handled by individual test wrappers
  }

  public async createPage(testId: string): Promise<Page> {
    if (!this.browser) {
      throw new Error("Puppeteer browser not initialized");
    }
    const page = await this.browser.newPage();
    this.webPages.set(testId, page);
    return page;
  }

  public async closePage(testId: string): Promise<void> {
    const page = this.webPages.get(testId);
    if (page) {
      await page.close();
      this.webPages.delete(testId);
    }
  }

  public setBrowser(browser: Browser): void {
    this.browser = browser;
  }

  public getBrowser(): Browser | null {
    return this.browser;
  }

  public async closeAll(): Promise<void> {
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
