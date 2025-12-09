/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from "fs";
import path from "path";
import { ConsoleMessage } from "puppeteer-core";
import ansiColors from "ansi-colors";
import { createLogStreams, statusMessagePretty } from "../../clients/utils";
import { IFinalResults } from "../../lib";
import { IRunTime } from "../../Types";
import { generatePromptFiles } from "../aider/generatePromptFiles";
import { webEvaluator } from "../utils";

export class WebLauncher {
  constructor(
    private projectName: string,
    private httpPort: number,
    private chromiumPort: number,
    private bddTestIsRunning: (src: string) => void,
    private bddTestIsNowDone: (src: string, failures: number) => void,
    private addPromiseProcess: (
      processId: string,
      promise: Promise<any>,
      command: string,
      category: "aider" | "bdd-test" | "build-time" | "other",
      entrypoint: string,
      platform: IRunTime,
      onResolve?: () => void,
      onReject?: () => void
    ) => void,
    private checkQueue: () => void
  ) {}

  async launchWeb(src: string, dest: string): Promise<void> {
    console.log(ansiColors.green(ansiColors.inverse(`web < ${src}`)));

    const processId = `web-${src}-${Date.now()}`;
    const command = `web test: ${src}`;

    // Create the promise
    const webPromise = (async () => {
      let browser: any = null;
      try {
        this.bddTestIsRunning(src);

        const reportDest = `testeranto/reports/${this.projectName}/${src
          .split(".")
          .slice(0, -1)
          .join(".")}/web`;
        if (!fs.existsSync(reportDest)) {
          fs.mkdirSync(reportDest, { recursive: true });
        }

        const destFolder = dest.replace(".mjs", "");
        const htmlPath = `${destFolder}.html`;

        // Always connect to the shared chromium service in Docker
        // Use the service name 'chromium' when running in Docker
        // Check if we're in Docker by looking for IN_DOCKER environment variable
        const inDocker = process.env.IN_DOCKER === "true";
        const chromeHost = inDocker
          ? "chromium"
          : process.env.CHROME_HOST || "host.docker.internal";
        const chromePort = process.env.CHROME_PORT || this.chromiumPort.toString();

        console.log(
          `Connecting to Chrome at ${chromeHost}:${chromePort} (IN_DOCKER=${inDocker})`
        );
        const puppeteer = await import("puppeteer-core");

        // Try multiple possible WebSocket endpoints
        const endpoints = [
          `ws://${chromeHost}:${chromePort}/devtools/browser`,
          `ws://${chromeHost}:${chromePort}/json/version`,
          `ws://${chromeHost}:${chromePort}/`,
        ];

        const maxRetries = 10;
        let lastError;

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
          for (const endpoint of endpoints) {
            try {
              console.log(
                `Attempt ${attempt}/${maxRetries}: Trying to connect to Chrome at ${endpoint}`
              );
              browser = await puppeteer.connect({
                browserWSEndpoint: endpoint,
                defaultViewport: null,
              });
              console.log("Connected to Chrome via WebSocket at", endpoint);
              break;
            } catch (error) {
              lastError = error;
              console.log(
                `Attempt ${attempt} failed for ${endpoint}:`,
                error.message
              );
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
          if (browser) break;
        }

        if (!browser) {
          console.error(
            `Failed to connect to Chrome after ${maxRetries} attempts`
          );
          console.error(
            `Make sure the chromium service is running and healthy at ${chromeHost}:${chromePort}`
          );
          console.error(`Last error:`, lastError?.message);
          throw new Error(
            `Failed to connect to Chrome. Check that the chromium service is running and the network is configured correctly.`
          );
        }

        // Get the actual WebSocket endpoint from the browser
        const browserWSEndpoint = browser.wsEndpoint();
        const webArgz = JSON.stringify({
          name: src,
          ports: [],
          fs: reportDest,
          browserWSEndpoint: browserWSEndpoint,
        });

        const logs = createLogStreams(reportDest, "web");

        // Use Server_TCP's HTTP server to serve web test files
        // Server_TCP runs on the host and serves files from /web/ path
        const httpPort = Number(process.env.HTTP_PORT) || this.httpPort;
        // In Docker, we need to connect to the host machine
        // Use the service name if available, otherwise use host.docker.internal
        // When in Docker, we can use 'host.docker.internal' to reach the host
        // Use the existing inDocker variable
        const serverHost = inDocker
          ? "host.docker.internal"
          : process.env.SERVER_HOST || "localhost";

        console.log(
          `Using Server_TCP host: ${serverHost}:${httpPort} (IN_DOCKER=${inDocker})`
        );

        // Convert HTML file path to relative URL under Server_TCP's /web/ endpoint
        // The files are in testeranto/bundles/allTests/web/
        // Server_TCP serves them from /web/
        let relativePath: string;
        // Try to match the path after 'testeranto/bundles/allTests/web/'
        const match = htmlPath.match(
          /testeranto\/bundles\/allTests\/web\/(.*)/
        );
        if (match) {
          relativePath = match[1];
        } else {
          // Try to match the path after '/bundles/allTests/web/'
          const absMatch = htmlPath.match(/\/bundles\/allTests\/web\/(.*)/);
          if (absMatch) {
            relativePath = absMatch[1];
          } else {
            // Fallback: try to match after 'bundles/web/' (old pattern)
            const oldMatch = htmlPath.match(/bundles\/web\/(.*)/);
            if (oldMatch) {
              relativePath = oldMatch[1];
            } else {
              // Final fallback: just use the filename
              relativePath = path.basename(htmlPath);
            }
          }
        }

        // Encode the test resource configuration as a URL query parameter
        const encodedConfig = encodeURIComponent(webArgz);
        // Server_TCP serves from /web/ path
        const url = `http://${serverHost}:${httpPort}/web/${relativePath}?config=${encodedConfig}`;
        console.log(
          `Navigating to ${url} (HTML file exists: ${fs.existsSync(htmlPath)})`
        );

        const page = await browser.newPage();

        page.on("console", (log: ConsoleMessage) => {
          const msg = `${log.text()}\n`;
          switch (log.type()) {
            case "info":
              logs.info?.write(msg);
              break;
            case "warn":
              logs.warn?.write(msg);
              break;
            case "error":
              logs.error?.write(msg);
              break;
            case "debug":
              logs.debug?.write(msg);
              break;
            default:
              break;
          }
        });

        page.on("close", () => {
          logs.writeExitCode(0);
          logs.closeAll();
        });

        const close = () => {
          // Cleanup function
        };

        page.on("pageerror", (err: Error) => {
          logs.info?.write("pageerror: " + err.message);
          console.error("Page error in web test:", err);
          logs.writeExitCode(-1, err);
          console.log(
            ansiColors.red(
              `web ! ${src} failed to execute. No "tests.json" file was generated. Check ${reportDest}/error.log for more info`
            )
          );
          this.bddTestIsNowDone(src, -1);
          close();
          throw err;
        });

        // Log console messages for debugging
        page.on("console", (msg) => {
          const text = msg.text();
          console.log(`Browser console [${msg.type()}]: ${text}`);
        });

        // Navigate to the HTML page with the config in the query parameter
        await page.goto(url, { waitUntil: "networkidle0" });

        // Convert to relative URL for Server_TCP
        let jsRelativePath: string;
        // Try to match the path after 'testeranto/bundles/allTests/web/'
        const jsMatch = dest.match(/testeranto\/bundles\/allTests\/web\/(.*)/);
        if (jsMatch) {
          jsRelativePath = jsMatch[1];
        } else {
          const jsAbsMatch = dest.match(/\/bundles\/allTests\/web\/(.*)/);
          if (jsAbsMatch) {
            jsRelativePath = jsAbsMatch[1];
          } else {
            // Fallback: try old pattern
            const oldMatch = dest.match(/bundles\/web\/(.*)/);
            if (oldMatch) {
              jsRelativePath = oldMatch[1];
            } else {
              jsRelativePath = path.basename(dest);
            }
          }
        }
        // Server_TCP serves from /web/ path
        const jsUrl = `/web/${jsRelativePath}?cacheBust=${Date.now()}`;

        // Evaluate the test using webEvaluator
        const evaluation = webEvaluator(jsUrl, webArgz);
        console.log("Evaluating web test with URL:", jsUrl);

        try {
          const results = (await page.evaluate(evaluation)) as IFinalResults;
          const { fails } = results;
          logs.info?.write("\n idk1");
          statusMessagePretty(fails, src, "web");
          this.bddTestIsNowDone(src, fails);
        } catch (error) {
          console.error("Error evaluating web test:", error);
          logs.info?.write("\n Error evaluating web test");
          statusMessagePretty(-1, src, "web");
          this.bddTestIsNowDone(src, -1);
        }

        // Generate prompt files for Web tests
        generatePromptFiles(reportDest, src);

        await page.close();
        await browser.disconnect();
        close();
      } catch (error) {
        console.error(`Error in web test ${src}:`, error);
        // Try to disconnect browser if it exists
        try {
          if (browser) {
            await browser.disconnect();
          }
        } catch (disconnectError) {
          // Ignore disconnect errors
        }
        this.bddTestIsNowDone(src, -1);
        throw error;
      }
    })();

    // Ensure webPromise is defined
    if (!webPromise) {
      console.error('WebLauncher: webPromise is undefined for', src);
      throw new Error(`webPromise is undefined for ${src}`);
    }
    
    // Add to process manager
    this.addPromiseProcess(
      processId,
      webPromise,
      command,
      "bdd-test",
      src,
      "web",
      () => {
        setTimeout(() => this.checkQueue(), 100);
      },
      () => {
        setTimeout(() => this.checkQueue(), 100);
      }
    );
  }
}
