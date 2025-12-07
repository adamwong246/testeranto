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
    this.testResourceConfiguration = t;
    
    // Determine WebSocket URL
    // In a browser environment, we need to connect to the same server that's serving the page
    // The server runs on a specific port, which should be included in the configuration
    // For now, use the current host and port, but fall back to default port 3000
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const hostname = window.location.hostname;
    // Try to get port from configuration or use current page's port
    let port = window.location.port;
    if (!port || port === '') {
      // If no port in URL, use default based on protocol
      port = protocol === 'wss:' ? '443' : '80';
    }
    // The server's WebSocket endpoint is on the same host:port as the HTTP server
    const wsUrl = `${protocol}//${hostname}:${port}`;
    
    console.log('PM_Web connecting to WebSocket at:', wsUrl);
    
    // Connect via WebSocket
    this.ws = new WebSocket(wsUrl);
    
    this.ws.onopen = () => {
      console.log('WebSocket connected to', wsUrl);
    };

    this.ws.onmessage = (event) => {
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
        console.error('Error parsing WebSocket message:', error);
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.ws.onclose = () => {
      console.log('WebSocket connection closed');
    };
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
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.error(
        `Tried to send "${command} (${argz})" but the WebSocket is not connected. State: ${this.ws?.readyState}`
      );
      return Promise.reject(new Error('WebSocket not connected'));
    }

    return new Promise<I>((resolve, reject) => {
      // Store the callback to handle the response
      this.messageCallbacks.set(key, (payload) => {
        resolve(payload);
      });

      // Send the message in a format the server expects
      const message = {
        type: command,
        data: argz.length > 0 ? argz : undefined,
        key: key
      };
      try {
        this.ws.send(JSON.stringify(message));
        console.log(`PM_Web sent ${command} with key ${key}`);
      } catch (error) {
        console.error(`PM_Web error sending ${command}:`, error);
        reject(error);
      }
      
      // Add a timeout to prevent hanging
      setTimeout(() => {
        if (this.messageCallbacks.has(key)) {
          console.error(`PM_Web timeout for ${command} with key ${key}`);
          this.messageCallbacks.delete(key);
          reject(new Error(`Timeout waiting for response to ${command}`));
        }
      }, 5000);
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
    return await this.send<boolean>(
      "writeFileSync",
      this.testResourceConfiguration.fs + "/" + filepath,
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

  testArtiFactoryfileWriter(tLog: ITLog, callback: (promise: Promise<any>) => void) {
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
}
