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

  public async initialize(browserWSEndpoint?: string): Promise<void> {
    if (browserWSEndpoint) {
      this.logger.log(`🌐 Connecting to browser at ${browserWSEndpoint}`);
      try {
        const puppeteer = await import("puppeteer-core");
        this.browser = await puppeteer.connect({
          browserWSEndpoint,
          defaultViewport: null,
        });
        this.logger.log(`✅ Connected to browser`);
      } catch (error) {
        this.logger.error(`❌ Failed to connect to browser:`, error);
        throw error;
      }
    } else {
      // Try to connect to the default browserless/chrome container
      // Browserless exposes CDP on port 9222 (remote debugging) and health on port 3000
      const healthUrl = "http://localhost:3000/health";
      const jsonUrl9222 = "http://localhost:9222/json/version";
      const jsonUrl3000 = "http://localhost:3000/json/version";
      
      this.logger.log(`🌐 Attempting to discover WebSocket endpoint...`);
      
      try {
        // First, check if the service is healthy
        const healthResponse = await fetch(healthUrl);
        if (!healthResponse.ok) {
          throw new Error(`Health check failed: HTTP ${healthResponse.status}`);
        }
        this.logger.log(`✅ Browserless health check passed`);
        
        // Try to get WebSocket URL from port 9222 (remote debugging)
        let webSocketDebuggerUrl: string | null = null;
        try {
          const response = await fetch(jsonUrl9222);
          if (response.ok) {
            const data = await response.json();
            webSocketDebuggerUrl = data.webSocketDebuggerUrl;
            this.logger.log(`🌐 Found WebSocket endpoint on port 9222: ${webSocketDebuggerUrl}`);
          }
        } catch (error) {
          this.logger.log(`ℹ️ Could not fetch JSON from port 9222, trying port 3000...`);
        }
        
        // If not found, try port 3000
        if (!webSocketDebuggerUrl) {
          try {
            const response = await fetch(jsonUrl3000);
            if (response.ok) {
              const data = await response.json();
              webSocketDebuggerUrl = data.webSocketDebuggerUrl;
              this.logger.log(`🌐 Found WebSocket endpoint on port 3000: ${webSocketDebuggerUrl}`);
            }
          } catch (error) {
            this.logger.log(`ℹ️ Could not fetch JSON from port 3000`);
          }
        }
        
        // If still not found, try direct WebSocket connection
        if (!webSocketDebuggerUrl) {
          // Try common WebSocket endpoints
          const possibleEndpoints = [
            "ws://localhost:9222/devtools/browser",
            "ws://localhost:3000/devtools/browser",
            "ws://localhost:3000",
          ];
          
          for (const endpoint of possibleEndpoints) {
            this.logger.log(`🌐 Trying direct connection to ${endpoint}...`);
            try {
              const puppeteer = await import("puppeteer-core");
              this.browser = await puppeteer.connect({
                browserWSEndpoint: endpoint,
                defaultViewport: null,
                timeout: 5000,
              });
              this.logger.log(`✅ Connected to browser via direct WebSocket: ${endpoint}`);
              return;
            } catch (error) {
              // Continue to next endpoint
            }
          }
          throw new Error("Could not connect to any WebSocket endpoint");
        } else {
          // Connect using the discovered WebSocket URL
          const puppeteer = await import("puppeteer-core");
          this.browser = await puppeteer.connect({
            browserWSEndpoint: webSocketDebuggerUrl,
            defaultViewport: null,
          });
          this.logger.log(`✅ Connected to browser via DevTools protocol`);
        }
      } catch (error) {
        this.logger.error(`❌ Failed to connect to browser:`, error);
        this.logger.log(
          `🌐 Puppeteer will be launched by individual web test wrappers`
        );
        // Browser initialization is handled by individual test wrappers
      }
    }
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
