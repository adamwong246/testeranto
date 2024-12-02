// import {
//   Browser,
//   BrowserContext,
//   BrowserContextOptions,
//   DebugInfo,
//   Page,
//   PuppeteerNode,
//   Target,
// } from "puppeteer-core";

import { Browser } from "puppeteer-core/lib/esm/puppeteer/puppeteer-core-browser";
import { ITLog, ITTestResourceConfiguration } from "../lib";
import { ChildProcess } from "child_process";
import { PuppeteerLaunchOptions } from "puppeteer-core/lib/esm/puppeteer";
// import { ILogWriter, ITLog } from "./lib";

type IFPaths = string[];
const fPaths: IFPaths = [];

export abstract class PM {
  server: any;
  browser: Browser;
  testResourceConfiguration: ITTestResourceConfiguration;

  // constructor(testResourceConfiguration: ITTestResourceConfiguration) {
  //   this.testResourceConfiguration = testResourceConfiguration;
  //   console.log("mkdirsync2", this.testResourceConfiguration);
  // }

  abstract startPuppeteer(options: any, destfolder: string): Promise<Browser>;

  abstract testArtiFactoryfileWriter(tLog: ITLog, callback: (Promise) => void);
  abstract createWriteStream(filepath: string): any;
  abstract writeFileSync(fp: string, contents: string);
  abstract mkdirSync();
  abstract existsSync(fp: string): boolean;
  abstract write(accessObject: { uid: number }, contents: string): boolean;
  abstract end(accessObject: { uid: number }): boolean;

  // pages(): Promise<Page[]>;
  // pages(): Promise<Page[]> {
  //   return new Promise<Page[]>((res, rej) => {
  //     res(super.pages());
  //   });
  // }
}

// export class PuppetMasterBrowser extends Browser {
//   process(): ChildProcess | null {
//     return super.process();
//   }
//   createBrowserContext(
//     options?: BrowserContextOptions
//   ): Promise<BrowserContext> {
//     throw new Error("Method not implemented.");
//   }
//   browserContexts(): BrowserContext[] {
//     throw new Error("Method not implemented.");
//   }
//   defaultBrowserContext(): BrowserContext {
//     throw new Error("Method not implemented.");
//   }
//   wsEndpoint(): string {
//     throw new Error("Method not implemented.");
//   }
//   newPage(): Promise<Page> {
//     throw new Error("Method not implemented.");
//   }
//   targets(): Target[] {
//     throw new Error("Method not implemented.");
//   }
//   target(): Target {
//     throw new Error("Method not implemented.");
//   }
//   version(): Promise<string> {
//     throw new Error("Method not implemented.");
//   }
//   userAgent(): Promise<string> {
//     throw new Error("Method not implemented.");
//   }
//   close(): Promise<void> {
//     throw new Error("Method not implemented.");
//   }
//   disconnect(): Promise<void> {
//     throw new Error("Method not implemented.");
//   }
//   get connected(): boolean {
//     throw new Error("Method not implemented.");
//   }
//   get debugInfo(): DebugInfo {
//     throw new Error("Method not implemented.");
//   }
//   constructor(...z: []) {
//     super(...z);
//   }
//   // pages(): Promise<Page[]>;
//   pages(): Promise<Page[]> {
//     return new Promise<Page[]>((res, rej) => {
//       res(super.pages());
//     });
//   }
// }
