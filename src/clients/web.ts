/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { PassThrough } from "stream";
import { ScreencastOptions, ScreenshotOptions } from "puppeteer-core";

import { ITLog, ITTestResourceConfiguration } from "../lib";
import { PM } from ".";

export class PM_Web extends PM {
  testResourceConfiguration: ITTestResourceConfiguration;
  ws: WebSocket;
  private messageCallbacks: Map<string, (data: any) => void> = new Map();

  constructor(t: ITTestResourceConfiguration) {
    super();
    console.log(
      "PM_Web constructor called with config:",
      JSON.stringify(t, null, 2)
    );
    this.testResourceConfiguration = t;

    let wsUrl: string;

    // Check if browserWSEndpoint is provided in configuration
    if (t.browserWSEndpoint) {
      wsUrl = t.browserWSEndpoint;
      console.log("PM_Web using browserWSEndpoint from config:", wsUrl);
    } else {
      // Try to get WebSocket URL from environment variables passed to the page
      // The server should inject this information
      const wsHost = (window as any).WS_HOST || window.location.hostname;
      const wsPort = (window as any).WS_PORT;
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";

      // In Docker, web tests run in browserless/chrome which can access host.docker.internal
      // But the page itself is served from somewhere else
      // For now, use the same host as the page
      const hostname = window.location.hostname;

      // If we're in a Docker container, we might need to use host.docker.internal
      // But we don't know for sure. Let's check if we're accessing via localhost
      // and use host.docker.internal as fallback
      let finalHost = hostname;
      if (hostname === "localhost" || hostname === "127.0.0.1") {
        // We might be in Docker, try to use host.docker.internal
        // But only if we're not in a browser on the host
        // This is tricky
      }

      wsUrl = `${protocol}//${finalHost}:${wsPort}`;
      console.log("PM_Web constructed WebSocket URL:", wsUrl);
    }

    // Connect via WebSocket
    this.ws = new WebSocket(wsUrl);

    this.ws.addEventListener("open", () => {
      console.log("WebSocket connected to", wsUrl);
    });

    this.ws.addEventListener("message", (event) => {
      try {
        const message = JSON.parse(event.data);
        // Handle responses with keys
        if (message.key && this.messageCallbacks.has(message.key)) {
          const callback = this.messageCallbacks.get(message.key);
          if (callback) {
            callback(message.payload);
            this.messageCallbacks.delete(message.key);
          }
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    });

    this.ws.addEventListener("error", (error) => {
      console.error("WebSocket error:", error);
    });

    this.ws.addEventListener("close", () => {
      console.log("WebSocket connection closed");
    });
  }

  start(): Promise<void> {
    return new Promise((resolve) => {
      if (this.ws.readyState === WebSocket.OPEN) {
        resolve();
      } else {
        this.ws.onopen = () => resolve();
      }
    });
  }

  stop(): Promise<void> {
    return new Promise((resolve) => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.close();
        this.ws.onclose = () => {
          resolve();
        };
      } else {
        resolve();
      }
    });
  }

  private send<I>(command: string, ...argz: any[]): Promise<I> {
    const key = Math.random().toString();

    // Wait for WebSocket to be open
    const waitForOpen = (): Promise<void> => {
      if (this.ws.readyState === WebSocket.OPEN) {
        return Promise.resolve();
      }
      if (this.ws.readyState === WebSocket.CONNECTING) {
        return new Promise((resolve) => {
          const onOpen = () => {
            this.ws.removeEventListener("open", onOpen);
            resolve();
          };
          this.ws.addEventListener("open", onOpen);
        });
      }
      // If closing or closed, reject
      return Promise.reject(
        new Error(`WebSocket is not open. State: ${this.ws.readyState}`)
      );
    };

    return waitForOpen().then(() => {
      return new Promise<I>((resolve, reject) => {
        // Store the callback to handle the response
        this.messageCallbacks.set(key, (payload) => {
          resolve(payload);
        });

        // Set a timeout for the response
        const timeoutId = setTimeout(() => {
          if (this.messageCallbacks.has(key)) {
            console.error(`PM_Web timeout for ${command} with key ${key}`);
            this.messageCallbacks.delete(key);
            reject(new Error(`Timeout waiting for response to ${command}`));
          }
        }, 10000); // 10 second timeout

        // Send the message in a format the server expects
        const message = {
          type: command,
          data: argz.length > 0 ? argz : undefined,
          key: key,
        };
        try {
          this.ws.send(JSON.stringify(message));
          console.log(`PM_Web sent ${command} with key ${key}`);
        } catch (error) {
          console.error(`PM_Web error sending ${command}:`, error);
          clearTimeout(timeoutId);
          this.messageCallbacks.delete(key);
          reject(error);
        }

        // Clean up timeout on response
        const originalCallback = this.messageCallbacks.get(key);
        if (originalCallback) {
          this.messageCallbacks.set(key, (payload) => {
            clearTimeout(timeoutId);
            originalCallback(payload);
          });
        }
      });
    });
  }

  async pages(): Promise<string[]> {
    return this.send<string[]>("pages", ...arguments);
  }

  waitForSelector(p: string, s: string): any {
    return this.send("waitForSelector", ...arguments);
  }

  closePage(p: any): any {
    return this.send("closePage", ...arguments);
  }

  goto(page: string, url: string): any {
    return this.send("goto", ...arguments);
  }

  async newPage(): Promise<string> {
    return this.send<string>("newPage");
  }

  $(selector: string, page: string): any {
    return this.send("$", ...arguments);
  }

  isDisabled(selector: string): Promise<boolean> {
    return this.send("isDisabled", ...arguments);
  }

  getAttribute(selector: string, attribute: string, p: string): any {
    return this.send("getAttribute", ...arguments);
  }

  getInnerHtml(selector: string, page: string): any {
    return this.send("getInnerHtml", ...arguments);
  }

  focusOn(selector: string): any {
    return this.send("focusOn", ...arguments);
  }

  typeInto(selector: string, value: string): any {
    return this.send("typeInto", ...arguments);
  }

  page(): Promise<string | undefined> {
    return this.send<string | undefined>("page");
  }

  click(selector: string): any {
    return this.send("click", ...arguments);
  }

  screencast(opts: ScreencastOptions, page: string): any {
    return this.send(
      "screencast",
      {
        ...opts,
        path: this.testResourceConfiguration.fs + "/" + opts.path,
      },
      page,
      this.testResourceConfiguration.name
    );
  }

  screencastStop(p: string): any {
    return this.send("screencastStop", ...arguments);
  }

  customScreenShot(x: ScreenshotOptions, y?: string): any {
    const opts = x[0];
    const page = x[1];

    return this.send(
      "customScreenShot",
      {
        ...opts,
        path: this.testResourceConfiguration.fs + "/" + opts.path,
      },
      this.testResourceConfiguration.name,
      page
    );
  }

  async existsSync(destFolder: string): Promise<boolean> {
    return await this.send<boolean>(
      "existsSync",
      this.testResourceConfiguration.fs + "/" + destFolder
    );
  }

  mkdirSync(): any {
    return this.send("mkdirSync", this.testResourceConfiguration.fs + "/");
  }

  async write(uid: number, contents: string): Promise<boolean> {
    return await this.send("write", ...arguments);
  }

  async writeFileSync(filepath: string, contents: string): Promise<boolean> {
    // Ensure fs is defined
    const fsPath = this.testResourceConfiguration?.fs;
    if (!fsPath) {
      console.error(
        "PM_Web.writeFileSync: fs is undefined in testResourceConfiguration",
        this.testResourceConfiguration
      );
      throw new Error("fs is undefined in testResourceConfiguration");
    }
    // Ensure filepath doesn't start with a slash to avoid double slashes
    const cleanFilepath = filepath.startsWith("/")
      ? filepath.substring(1)
      : filepath;
    const fullPath = fsPath + "/" + cleanFilepath;
    console.log("PM_Web.writeFileSync: fullPath:", fullPath);
    return await this.send<boolean>(
      "writeFileSync",
      fullPath,
      contents,
      this.testResourceConfiguration.name
    );
  }

  async createWriteStream(filepath: string): Promise<string> {
    return await this.send<string>(
      "createWriteStream",
      this.testResourceConfiguration.fs + "/" + filepath,
      this.testResourceConfiguration.name
    );
  }

  async end(uid: number): Promise<boolean> {
    return await this.send<boolean>("end", ...arguments);
  }

  async customclose(): Promise<any> {
    return await this.send(
      "customclose",
      this.testResourceConfiguration.fs,
      this.testResourceConfiguration.name
    );
  }

  testArtiFactoryfileWriter(
    tLog: ITLog,
    callback: (promise: Promise<any>) => void
  ) {
    return (fPath: string, value: string | Buffer | PassThrough) => {
      callback(
        new Promise<void>((resolve, reject) => {
          tLog("testArtiFactory =>", fPath);
          // For now, just resolve immediately
          // In a real implementation, we would send via WebSocket
          resolve();
        })
      );
    };
  }

  // Browser context management implementations
  async createBrowserContext(): Promise<string> {
    return await this.send<string>("createBrowserContext");
  }

  async disposeBrowserContext(contextId: string): Promise<void> {
    return await this.send<void>("disposeBrowserContext", contextId);
  }

  async getBrowserContexts(): Promise<string[]> {
    return await this.send<string[]>("getBrowserContexts");
  }

  async newPageInContext(contextId: string): Promise<string> {
    return await this.send<string>("newPageInContext", contextId);
  }

  async getBrowserMemoryUsage(): Promise<{
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  }> {
    return await this.send("getBrowserMemoryUsage");
  }

  async cleanupContext(contextId: string): Promise<void> {
    return await this.send<void>("cleanupContext", contextId);
  }
}
