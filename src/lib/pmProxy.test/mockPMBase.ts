/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Browser } from "puppeteer-core";

import { IBuiltConfig, ITLog } from "../index";
import { PM_Base } from "../../server/PM_0";

export class MockPMBase implements PM_Base {
  browser: Browser;
  configs: IBuiltConfig;
  calls: Record<string, any[]> = {};
  testResourceConfiguration: any = {};

  constructor(configs?: IBuiltConfig) {
    this.configs = configs || ({} as IBuiltConfig);
  }

  // Common tracking functionality
  protected trackCall(method: string, args: any) {
    if (!this.calls[method]) {
      this.calls[method] = [];
    }
    this.calls[method].push(args);
  }

  getCallCount(method: string): number {
    return this.calls[method]?.length || 0;
  }

  getLastCall(method: string): any {
    const calls = this.calls[method];
    return calls ? calls[calls.length - 1] : null;
  }

  // Add missing methods used in tests
  // writeFileSync(path: string, content: string): Promise<boolean> {
  //   this.trackCall('writeFileSync', { path, content });
  //   return Promise.resolve(true);
  // }

  // end(uid: number): Promise<boolean> {
  //   this.trackCall('end', { uid });
  //   return Promise.resolve(true);
  // }

  // Minimal implementations of required methods
  launchSideCar(n: number, testName: string, projectName: string) {
    this.trackCall("launchSideCar", { n, testName, projectName });
    return Promise.resolve();
  }

  end(uid: number): Promise<boolean> {
    this.trackCall("end", { uid });
    // Add debug logging
    console.debug(`Ending test with uid ${uid}`);
    return Promise.resolve(true);
  }

  // Add debug method
  debug(message: string) {
    console.debug(`[MockPMBase] ${message}`);
    this.trackCall("debug", { message });
  }

  writeFileSync(
    path: string,
    content: string,
    testName?: string
  ): Promise<boolean> {
    this.trackCall("writeFileSync", { path, content, testName });
    return Promise.resolve(true);
  }

  createWriteStream(path: string, testName?: string): Promise<number> {
    this.trackCall("createWriteStream", { path, testName });
    return Promise.resolve(0);
  }

  screencast(opts: any, testName: string, page?: any): Promise<any> {
    this.trackCall("screencast", { opts, testName, page });
    return Promise.resolve({});
  }

  customScreenShot(opts: any, testName: string, pageUid?: any): Promise<any> {
    this.trackCall("customScreenShot", { opts, testName, pageUid });
    return Promise.resolve({});
  }

  testArtiFactoryfileWriter(
    tLog: ITLog,
    callback: (promise: Promise<any>) => void
  ): any {
    return (fPath: string, value: string | Buffer | any) => {
      this.trackCall("testArtiFactoryfileWriter", { fPath, value });
      callback(Promise.resolve());
    };
  }

  // Other required PM_Base methods with minimal implementations
  closePage(p: any): any {
    return Promise.resolve();
  }
  $(selector: string, p: string): Promise<any> {
    return Promise.resolve();
  }
  click(selector: string, page: any): any {
    return Promise.resolve();
  }
  goto(p: string, url: string): any {
    return Promise.resolve();
  }
  newPage(): Promise<string> {
    return Promise.resolve("mock-page");
  }
  pages(): Promise<string[]> {
    return Promise.resolve(["mock-page"]);
  }
  waitForSelector(p: string, s: string): any {
    return Promise.resolve(true);
  }
  focusOn(selector: string, p: string): any {
    return Promise.resolve();
  }
  typeInto(value: string, p: string): any {
    return Promise.resolve();
  }
  getAttribute(selector: string, attribute: string, p: string): any {
    return Promise.resolve();
  }
  getInnerHtml(selector: string, p: string): Promise<any> {
    return Promise.resolve();
  }
  isDisabled(selector: string, p: string): any {
    return Promise.resolve(false);
  }
  screencastStop(s: string): any {
    return Promise.resolve();
  }
  existsSync(destFolder: string): boolean {
    return false;
  }
  mkdirSync(fp: string): any {
    return Promise.resolve();
  }
  write(uid: number, contents: string): Promise<boolean> {
    return Promise.resolve(true);
  }
  page(p: any): string | undefined {
    return "mock-page";
  }
  doInPage(p: string, cb: (p: any) => unknown): any {
    return Promise.resolve();
  }
  customclose(): any {
    return Promise.resolve();
  }
}
