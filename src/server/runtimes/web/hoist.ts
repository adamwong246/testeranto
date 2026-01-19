import puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';

console.log("hoist");

/**
 * Web test hoist - runs a JavaScript bundle in a headless Chromium browser
 */
async function main() {
  const maxRetries = 30;
  const retryDelay = 2000; // 2 seconds
  const host = 'browser-allTests';
  const port = 3000;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempt ${attempt}/${maxRetries} to connect to Chrome...`);

      // Always fetch the WebSocket endpoint directly from Chrome's debugger
      // This ensures we get the current browser ID
      console.log(`Fetching Chrome debugger info from http://${host}:${port}/json/version...`);

      // Use a simple fetch with a timeout
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);

      try {
        const response = await fetch(`http://${host}:${port}/json/version`, {
          signal: controller.signal
        });
        clearTimeout(timeout);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        const wsEndpoint = data.webSocketDebuggerUrl;

        if (!wsEndpoint) {
          throw new Error('No WebSocket endpoint in debugger response');
        }

        // Replace 127.0.0.1 with the container hostname
        const correctedWsEndpoint = wsEndpoint.replace('127.0.0.1', host);
        console.log(`Fetched WebSocket endpoint: ${wsEndpoint}`);
        console.log(`Corrected WebSocket endpoint: ${correctedWsEndpoint}`);

        // Connect to Chrome using the WebSocket endpoint
        console.log(`Connecting to Chrome at ${correctedWsEndpoint}...`);
        const browser = await puppeteer.connect({
          browserWSEndpoint: correctedWsEndpoint,
          defaultViewport: null,
        });

        console.log('Successfully connected to Chrome browser');

        // Now we can run our tests
        // For now, just open a page to verify connection
        const page = await browser.newPage();
        await page.goto('about:blank');
        console.log('Opened a new page');

        // Close the browser connection
        await browser.disconnect();
        console.log('Disconnected from Chrome');

        // Success - exit the loop
        return;

      } catch (fetchError: any) {
        clearTimeout(timeout);
        if (fetchError.name === 'AbortError') {
          throw new Error('Fetch timeout');
        }
        throw fetchError;
      }

    } catch (error: any) {
      console.error(`Attempt ${attempt} failed:`, error.message);
      if (attempt < maxRetries) {
        console.log(`Retrying in ${retryDelay / 1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      } else {
        console.error('All connection attempts failed');
        process.exit(1);
      }
    }
  }
}

main()
