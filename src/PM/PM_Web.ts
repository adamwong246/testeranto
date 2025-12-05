/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { PassThrough } from "stream";
import { ScreencastOptions, ScreenshotOptions, Frame } from "puppeteer-core";
import { Page } from "puppeteer-core";

import { ITLog, ITTestResourceConfiguration } from "../lib";
import { PM } from ".";

declare module "puppeteer-core" {
  interface Frame {
    _id: string;
  }
}

export class PM_Web extends PM {
  testResourceConfiguration: ITTestResourceConfiguration;
  private ws: WebSocket | null = null;
  private messageIdCounter: number = 0;
  private pendingCallbacks: Map<number, { resolve: (value: any) => void; reject: (reason?: any) => void }> = new Map();
  private wsConnected: boolean = false;
  private wsUrl: string | null = null;

  constructor(t: ITTestResourceConfiguration) {
    super();
    this.testResourceConfiguration = t;
    // Try to get WebSocket URL from test configuration or environment
    this.initializeWebSocket();
  }

  private initializeWebSocket(): void {
    // Get WebSocket URL from testResourceConfiguration environment
    const wsPort = parseInt(this.testResourceConfiguration.environment?.WEBSOCKET_PORT || "0");
    const wsHost = this.testResourceConfiguration.environment?.DOCKERMAN_HOST || "host.docker.internal";
    
    if (wsPort > 0) {
      this.wsUrl = `ws://${wsHost}:${wsPort}`;
      this.connectWebSocket();
    } else {
      throw new Error("PM_Web: WebSocket port not available in testResourceConfiguration.environment.WEBSOCKET_PORT");
    }
  }

  private connectWebSocket(): void {
    if (!this.wsUrl) return;
    
    try {
      this.ws = new WebSocket(this.wsUrl);
      
      this.ws.onopen = () => {
        console.log("PM_Web: WebSocket connected to", this.wsUrl);
        this.wsConnected = true;
        // Register this service
        this.sendWebSocketMessage(["register", "web-test"]);
      };
      
      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.id !== undefined && this.pendingCallbacks.has(data.id)) {
            const callback = this.pendingCallbacks.get(data.id);
            this.pendingCallbacks.delete(data.id);
            if (data.error) {
              callback?.reject(new Error(data.error));
            } else {
              callback?.resolve(data.result);
            }
          }
        } catch (error) {
          console.error("PM_Web: Failed to parse WebSocket message", error);
        }
      };
      
      this.ws.onerror = (error) => {
        console.error("PM_Web: WebSocket error", error);
        this.wsConnected = false;
      };
      
      this.ws.onclose = () => {
        console.log("PM_Web: WebSocket disconnected");
        this.wsConnected = false;
        // Try to reconnect after a delay
        setTimeout(() => {
          if (!this.wsConnected) {
            this.connectWebSocket();
          }
        }, 5000);
      };
    } catch (error) {
      console.error("PM_Web: Failed to create WebSocket", error);
    }
  }

  private sendWebSocketMessage(message: any[]): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.wsConnected || !this.ws) {
        // Fall back to window functions if WebSocket is not available
        console.warn("PM_Web: WebSocket not connected, falling back to window functions");
        reject(new Error("WebSocket not connected"));
        return;
      }
      
      const messageId = ++this.messageIdCounter;
      const fullMessage = [...message, messageId];
      
      this.pendingCallbacks.set(messageId, { resolve, reject });
      
      try {
        this.ws.send(JSON.stringify(fullMessage));
      } catch (error) {
        this.pendingCallbacks.delete(messageId);
        reject(error);
      }
    });
  }

  private async callFunction(functionName: string, ...args: any[]): Promise<any> {
    if (!this.wsConnected || !this.ws) {
      throw new Error(`PM_Web: WebSocket not connected. Cannot call function ${functionName}`);
    }
    
    return await this.sendWebSocketMessage([functionName, ...args]);
  }

  async start(): Promise<void> {
    // Ensure WebSocket is connected
    if (this.wsUrl && !this.wsConnected) {
      await new Promise<void>((resolve, reject) => {
        const maxAttempts = 50; // 5 seconds total (50 * 100ms)
        let attempts = 0;
        
        const check = () => {
          if (this.wsConnected) {
            resolve();
          } else if (attempts >= maxAttempts) {
            reject(new Error("PM_Web: Failed to connect to WebSocket after 5 seconds"));
          } else {
            attempts++;
            setTimeout(check, 100);
          }
        };
        check();
      });
    }
    return Promise.resolve();
  }

  async stop(): Promise<void> {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      this.wsConnected = false;
    }
    return Promise.resolve();
  }

  async getInnerHtml(selector: string, page: string): Promise<any> {
    return this.callFunction("getInnerHtml", selector, page);
  }

  async pages(): Promise<string[]> {
    return this.callFunction("pages");
  }

  async waitForSelector(p: string, s: string): Promise<any> {
    return this.callFunction("waitForSelector", p, s);
  }

  async screencast(opts: ScreencastOptions, page: Page): Promise<string> {
    const modifiedOpts = {
      ...opts,
      path: this.testResourceConfiguration.fs + "/" + opts.path,
    };
    return this.callFunction("screencast", modifiedOpts, page.mainFrame()._id, this.testResourceConfiguration.name);
  }

  async screencastStop(recorder: string): Promise<any> {
    return this.callFunction("screencastStop", recorder);
  }

  async closePage(p: any): Promise<string> {
    return this.callFunction("closePage", p);
  }

  async goto(p: any, url: string): Promise<any> {
    return this.callFunction("goto", p, url);
  }

  async newPage(): Promise<string> {
    return this.callFunction("newPage");
  }

  async $(selector: string): Promise<boolean> {
    return this.callFunction("$", selector);
  }

  async isDisabled(selector: string): Promise<boolean> {
    return this.callFunction("isDisabled", selector);
  }

  async getAttribute(selector: string, attribute: string): Promise<any> {
    return this.callFunction("getAttribute", selector, attribute);
  }

  async getValue(selector: number): Promise<any> {
    return this.callFunction("getValue", selector);
  }

  async focusOn(selector: string): Promise<any> {
    return this.callFunction("focusOn", selector);
  }

  async typeInto(value: string): Promise<any> {
    return this.callFunction("typeInto", value);
  }

  async page(x?: any): Promise<string | undefined> {
    return this.callFunction("page", x);
  }

  async click(selector: string): Promise<any> {
    return this.callFunction("click", selector);
  }

  async customScreenShot(x: ScreenshotOptions, y: any): Promise<any> {
    const opts = x[0];
    const page = x[1];
    const modifiedOpts = {
      ...opts,
      path: this.testResourceConfiguration.fs + "/" + opts.path,
    };
    return this.callFunction("customScreenShot", modifiedOpts, this.testResourceConfiguration.name, page);
  }

  async existsSync(destFolder: string): Promise<boolean> {
    return this.callFunction("existsSync", destFolder);
  }

  async mkdirSync(x: any): Promise<any> {
    return this.callFunction("mkdirSync", this.testResourceConfiguration.fs + "/");
  }

  async write(uid: number, contents: string): Promise<boolean> {
    return this.callFunction("write", uid, contents);
  }

  async writeFileSync(x: any, y: any): Promise<any> {
    const filepath = x;
    const contents = y;
    return this.callFunction("writeFileSync", 
      this.testResourceConfiguration.fs + "/" + filepath, 
      contents, 
      this.testResourceConfiguration.name
    );
  }

  async createWriteStream(filepath: string): Promise<any> {
    return this.callFunction("createWriteStream", 
      this.testResourceConfiguration.fs + "/" + filepath, 
      this.testResourceConfiguration.name
    );
  }

  async end(uid: number): Promise<boolean> {
    return this.callFunction("end", uid);
  }

  async customclose(): Promise<void> {
    return this.callFunction("customclose", 
      this.testResourceConfiguration.fs,
      this.testResourceConfiguration.name
    );
  }

  testArtiFactoryfileWriter(tLog: ITLog, callback: (promise: Promise<any>) => void) {
    return (fPath: string, value: string | Buffer | PassThrough) => {
      callback(
        new Promise<void>((res, rej) => {
          tLog("testArtiFactory =>", fPath);
          res();
        })
      );
    };
  }
}
