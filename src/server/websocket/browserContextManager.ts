import puppeteer, { Browser, BrowserContext } from "puppeteer-core";

export class BrowserContextManager {
  private browser: Browser | null = null;
  private contexts: Map<string, BrowserContext> = new Map();
  private contextCounter: number = 0;
  // Track pages per context
  private pages: Map<string, any> = new Map();

  async initialize(): Promise<void> {
    if (this.browser) {
      return;
    }
    // Connect to the existing browserless/chrome service
    // The chromium service is running on the Docker network
    // Use environment variable or default to the service name
    const chromeHost = process.env.CHROME_HOST || "chromium";
    const chromePort = process.env.CHROME_PORT || "9222";

    // Add retry logic for DNS resolution
    const maxRetries = 10;
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      // Try multiple possible WebSocket endpoints
      const endpoints = [
        `ws://${chromeHost}:${chromePort}/devtools/browser`,
        `ws://${chromeHost}:${chromePort}/json/version`,
        `ws://${chromeHost}:${chromePort}/`,
      ];

      for (const endpoint of endpoints) {
        try {
          console.log(
            `Attempt ${attempt}/${maxRetries}: Trying to connect to Chrome at ${endpoint}`
          );
          this.browser = await puppeteer.connect({
            browserWSEndpoint: endpoint,
            defaultViewport: null,
          });
          console.log("Connected to Chrome via WebSocket at", endpoint);
          return;
        } catch (error) {
          console.log(
            `Attempt ${attempt} failed for ${endpoint}:`,
            error.message
          );
          lastError = error as Error;
          // If it's a DNS error, wait and retry
          if (
            error.message.includes("ENOTFOUND") ||
            error.message.includes("getaddrinfo")
          ) {
            // Wait before retrying
            const delay = 2000 * attempt;
            console.log(
              `DNS resolution failed, waiting ${delay}ms before next attempt...`
            );
            await new Promise((resolve) => setTimeout(resolve, delay));
            break; // Break out of endpoints loop to retry from beginning
          }
          // Continue to next endpoint
        }
      }
    }

    // If we get here, all endpoints failed
    console.error(
      "Failed to connect to Chrome via any endpoint after",
      maxRetries,
      "attempts"
    );
    throw new Error(
      `Could not connect to Chrome. Make sure the chromium service is running at ${chromeHost}:${chromePort}. Last error: ${lastError?.message}`
    );
  }

  async createBrowserContext(): Promise<string> {
    await this.initialize();
    if (!this.browser) {
      throw new Error("Browser not initialized");
    }
    const context = await this.browser.createBrowserContext();
    const contextId = `context-${++this.contextCounter}`;
    this.contexts.set(contextId, context);
    return contextId;
  }

  async disposeBrowserContext(contextId: string): Promise<void> {
    const context = this.contexts.get(contextId);
    if (context) {
      await context.close();
      this.contexts.delete(contextId);
    }
  }

  async getBrowserContexts(): Promise<string[]> {
    return Array.from(this.contexts.keys());
  }

  async newPageInContext(contextId: string): Promise<string> {
    const context = this.contexts.get(contextId);
    if (!context) {
      throw new Error(`Context ${contextId} not found`);
    }
    const page = await context.newPage();
    // Generate a page ID
    const pageId = `page-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    // Store the page for future reference
    // We'll need to track pages separately, but for now return the pageId
    // In a real implementation, we would store the page in a map
    return pageId;
  }

  async getBrowserMemoryUsage(): Promise<{
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  }> {
    // This is a simplified implementation
    // In reality, we would get this from Chrome DevTools Protocol
    return {
      usedJSHeapSize: 0,
      totalJSHeapSize: 0,
      jsHeapSizeLimit: 0,
    };
  }

  async cleanupContext(contextId: string): Promise<void> {
    const context = this.contexts.get(contextId);
    if (context) {
      // Close all pages in the context
      const pages = await context.pages();
      for (const page of pages) {
        await page.close();
      }
      // Clear cookies and storage
      // Note: This is a simplified cleanup
    }
  }

  async shutdown(): Promise<void> {
    for (const [contextId, context] of this.contexts) {
      await context.close();
    }
    this.contexts.clear();
    if (this.browser) {
      await this.browser.disconnect();
      this.browser = null;
    }
  }
}
