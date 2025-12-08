/* eslint-disable @typescript-eslint/no-explicit-any */
import { Page } from "puppeteer-core";
import { ScreenRecorderOptions } from "puppeteer-core/lib/esm/puppeteer";

import { ITLog, ITTestResourceConfiguration } from "../lib";

export abstract class PM {
  server: any;
  testResourceConfiguration: ITTestResourceConfiguration;

  abstract start(): Promise<void>;
  abstract stop(): Promise<void>;
  abstract testArtiFactoryfileWriter(
    tLog: ITLog,
    callback: (promise: Promise<any>) => void
  ): any;

  abstract $(selector: string, page: string): any;
  abstract click(selector: string): any;
  abstract closePage(p): any;
  abstract createWriteStream(
    filepath: string,
    testName: string
  ): Promise<string>;
  abstract customclose();
  abstract customScreenShot(opts: { path: string }, page?: string): any;
  abstract end(uid: number): Promise<boolean>;
  abstract existsSync(fp: string): Promise<boolean>;
  abstract focusOn(selector: string): any;
  abstract getAttribute(selector: string, attribute: string, page: string): any;
  abstract getInnerHtml(selector: string, page: string): any;
  abstract goto(p, url: string): any;
  abstract isDisabled(selector: string): Promise<boolean>;
  abstract mkdirSync(a: string);
  abstract newPage(): Promise<string>;
  abstract page(): Promise<string | undefined>;
  abstract pages(): Promise<string[]>;
  abstract screencast(o: ScreenRecorderOptions, p: Page | string): any;
  abstract screencastStop(s: string): any;
  abstract typeInto(selector: string, value: string): any;
  abstract waitForSelector(p, sel: string);
  abstract write(uid: number, contents: string): Promise<boolean>;
  abstract writeFileSync(f: string, c: string): Promise<boolean>;

  // Browser context management for web tests (shared Chrome instance)
  abstract createBrowserContext(): Promise<string>;
  abstract disposeBrowserContext(contextId: string): Promise<void>;
  abstract getBrowserContexts(): Promise<string[]>;
  abstract newPageInContext(contextId: string): Promise<string>;
  
  // Resource management
  abstract getBrowserMemoryUsage(): Promise<{
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  }>;
  abstract cleanupContext(contextId: string): Promise<void>;

  // abstract launchSideCar(
  //   n: number
  // ): Promise<[number, ITTestResourceConfiguration]>;
  // abstract stopSideCar(n: number): Promise<any>;
}
