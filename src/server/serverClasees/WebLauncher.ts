/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from "fs";
import path from "path";
import { ConsoleMessage } from "puppeteer-core";
import ansiColors from "ansi-colors";
import { createLogStreams, LogStreams, statusMessagePretty } from "../../clients/utils";
import { IFinalResults } from "../../lib";
import { IRunTime } from "../../Types";
import { generatePromptFiles } from "../aider/generatePromptFiles";
import { webEvaluator } from "../utils";

export class WebLauncher {
  constructor(
    private projectName: string,
    private browser: any,
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

        const webArgz = JSON.stringify({
          name: src,
          ports: [],
          fs: reportDest,
          browserWSEndpoint: this.browser.wsEndpoint(),
        });

        const logs = createLogStreams(reportDest, "web");

        // Use HTTP URL instead of file:// to allow WebSocket connections
        const httpPort = Number(process.env.HTTP_PORT) || 3000;

        // Convert HTML file path to relative URL under /bundles/web/
        let relativePath: string;
        const match = htmlPath.match(/testeranto\/bundles\/web\/(.*)/);
        if (match) {
          relativePath = match[1];
        } else {
          // Try to extract from absolute path
          const absMatch = htmlPath.match(/\/bundles\/web\/(.*)/);
          if (absMatch) {
            relativePath = absMatch[1];
          } else {
            // Fallback: just use the filename
            relativePath = path.basename(htmlPath);
          }
        }

        // Encode the test resource configuration as a URL query parameter
        const encodedConfig = encodeURIComponent(webArgz);
        const url = `http://localhost:${httpPort}/bundles/web/${relativePath}?config=${encodedConfig}`;
        console.log(
          `Navigating to ${url} (HTML file exists: ${fs.existsSync(htmlPath)})`
        );

        const page = await this.browser.newPage();

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

        // Convert to relative URL for the browser
        let jsRelativePath: string;
        const jsMatch = dest.match(/testeranto\/bundles\/web\/(.*)/);
        if (jsMatch) {
          jsRelativePath = jsMatch[1];
        } else {
          const jsAbsMatch = dest.match(/\/bundles\/web\/(.*)/);
          if (jsAbsMatch) {
            jsRelativePath = jsAbsMatch[1];
          } else {
            jsRelativePath = path.basename(dest);
          }
        }
        const jsUrl = `/bundles/web/${jsRelativePath}?cacheBust=${Date.now()}`;

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
        close();
      } catch (error) {
        console.error(`Error in web test ${src}:`, error);
        this.bddTestIsNowDone(src, -1);
        throw error;
      }
    })();

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
