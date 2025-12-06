/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { ScreencastOptions } from "puppeteer-core";
import { CdpPage } from "puppeteer-core/lib/esm/puppeteer";

import { ITLog, ITTestResourceConfiguration } from "../lib";

import { PM } from ".";

type IFPaths = string[];
const fPaths: IFPaths = [];

type PuppetMasterServer = Record<string, Promise<any>>;

export class PM_Pure extends PM {
  getInnerHtml(selector: string, page: string): Promise<string> {
    throw new Error("pure.ts getInnerHtml not implemented");
  }

  server: PuppetMasterServer;
  testResourceConfiguration: ITTestResourceConfiguration;

  constructor(t: ITTestResourceConfiguration) {
    super();
    this.server = {};
    this.testResourceConfiguration = t;
  }

  protected trackCall(method: string, args: any) {
    // Track calls if needed
  }

  start(): Promise<void> {
    return new Promise((r) => r());
  }

  stop(): Promise<void> {
    return new Promise((r) => r());
  }

  async createWriteStream(filepath: string, testName: string): Promise<string> {
    throw new Error("pure.ts createWriteStream not implemented");
  }

  pages() {
    return globalThis["pages"]();
  }

  waitForSelector(p: string, s: string): any {
    return globalThis["waitForSelector"](p, s);
  }

  closePage(p): string {
    return globalThis["closePage"](p);
  }

  goto(cdpPage: CdpPage, url: string): any {
    return globalThis["goto"](cdpPage.mainFrame()._id, url);
  }

  newPage() {
    return globalThis["newPage"]();
  }

  $(selector: string): boolean {
    return globalThis["$"](selector);
  }

  isDisabled(selector: string): Promise<boolean> {
    return globalThis["isDisabled"](selector);
  }

  getAttribute(selector: string, attribute: string) {
    return globalThis["getAttribute"](selector, attribute);
  }

  getValue(selector: string) {
    return globalThis["getValue"](selector);
  }

  focusOn(selector: string) {
    return globalThis["focusOn"](selector);
  }

  typeInto(selector: string, value: string) {
    return globalThis["typeInto"](selector, value);
  }

  page() {
    return globalThis["page"]();
  }

  click(selector: string): string | undefined {
    return globalThis["click"](selector);
  }

  screencast(opts: ScreencastOptions, page: string) {
    return globalThis["screencast"](
      {
        ...opts,
        path: this.testResourceConfiguration.fs + "/" + opts.path,
      },
      page,
      this.testResourceConfiguration.name
    );
  }

  screencastStop(p: string) {
    return globalThis["screencastStop"](p);
  }

  customScreenShot(opts: { path: string }, page?: string) {
    return globalThis["customScreenShot"](
      {
        ...opts,
        path: this.testResourceConfiguration.fs + "/" + opts.path,
      },
      page,
      this.testResourceConfiguration.name
    );
  }

  // TODO: fix these
  existsSync(destFolder: string): Promise<boolean> {
    return Promise.resolve(true);
  }

  mkdirSync() {
    return true;
  }

  write(uid: number, contents: string) {
    return Promise.resolve(true);
  }

  writeFileSync() {
    return Promise.resolve(true);
  }

  end(uid: number) {
    return globalThis["end"](uid);
  }

  customclose() {
    globalThis["customclose"](
      this.testResourceConfiguration.fs,
      this.testResourceConfiguration.name
    );
  }

  testArtiFactoryfileWriter(
    tLog: ITLog,
    callback: (promise: Promise<any>) => void
  ) {
    return (fPath: string, value: string | Buffer | any) => {
      this.trackCall("testArtiFactoryfileWriter", { fPath, value });
      callback(Promise.resolve());
    };
  }

  // launchSideCar(n: number): Promise<[number, ITTestResourceConfiguration]> {
  //   return globalThis["launchSideCar"](n, this.testResourceConfiguration.name);
  // }
  // stopSideCar(uid: number): Promise<any> {
  //   throw new Error("pure.ts stopSideCar not implemented");
  // }
}
