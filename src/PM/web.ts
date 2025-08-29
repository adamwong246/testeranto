/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { PassThrough } from "stream";

import { ScreencastOptions, ScreenshotOptions, Frame } from "puppeteer-core";

declare module "puppeteer-core" {
  interface Frame {
    _id: string;
  }
}
import { Page } from "puppeteer-core";

import { ITLog, ITTestResourceConfiguration } from "../lib";
import { PM } from ".";

export class PM_Web extends PM {
  testResourceConfiguration: ITTestResourceConfiguration;

  constructor(t: ITTestResourceConfiguration) {
    super();
    this.testResourceConfiguration = t;
  }

  start(): Promise<void> {
    return new Promise((r) => r());
  }

  stop(): Promise<void> {
    return new Promise((r) => r());
  }

  getInnerHtml(selector: string, page: string) {
    throw new Error("web.ts getInnHtml not implemented");
  }

  pages(): Promise<string[]> {
    throw new Error("Method not implemented.");
  }

  waitForSelector(p: string, s: string): any {
    return window["waitForSelector"](p, s);
  }

  screencast(opts: ScreencastOptions, page: string | Page): Promise<string> {
    return window["screencast"](
      {
        ...opts,
        path: this.testResourceConfiguration.fs + "/" + opts.path,
      },
      page.mainFrame()._id,
      this.testResourceConfiguration.name
    );
  }

  screencastStop(recorder: string) {
    return window["screencastStop"](recorder);
  }

  closePage(p): string {
    return window["closePage"](p);
  }

  goto(p, url: string) {
    return window["goto"](p, url);
  }

  newPage() {
    return window["newPage"]();
  }

  $(selector: string): boolean {
    return window["$"](selector);
  }

  isDisabled(selector: string): Promise<boolean> {
    return window["isDisabled"](selector);
  }

  getAttribute(selector: string, attribute: string) {
    return window["getAttribute"](selector, attribute);
  }

  getValue(selector: number) {
    return window["getValue"](selector);
  }

  focusOn(selector: string) {
    return window["focusOn"](selector);
  }
  typeInto(value: string) {
    return window["typeInto"](value);
  }

  async page(x?): Promise<string | undefined> {
    return window["page"](x);
  }

  click(selector: string): any {
    return window["click"](selector);
  }

  customScreenShot(x: ScreenshotOptions, y: any) {
    const opts = x[0];
    const page = x[1];
    // console.log("customScreenShot 2 opts", opts);
    // console.log("customScreenShot 2 page", page);
    return window["customScreenShot"](
      {
        ...opts,
        path: this.testResourceConfiguration.fs + "/" + opts.path,
      },
      this.testResourceConfiguration.name,
      page
    );
  }

  existsSync(destFolder: string): Promise<boolean> {
    return window["existsSync"](destFolder);
  }

  mkdirSync(x) {
    return window["mkdirSync"](this.testResourceConfiguration.fs + "/");
  }

  write(uid: number, contents: string): Promise<boolean> {
    return window["write"](uid, contents);
  }

  writeFileSync(x) {
    // eslint-disable-next-line prefer-rest-params
    // const z = arguments["0"];

    // const filepath = z[0];
    // const contents = z[1];

    const filepath = arguments[0];
    const contents = arguments[1];

    return window["writeFileSync"](
      this.testResourceConfiguration.fs + "/" + filepath,
      contents,
      this.testResourceConfiguration.name
    );
  }

  createWriteStream(filepath: string): any {
    return window["createWriteStream"](
      this.testResourceConfiguration.fs + "/" + filepath,
      this.testResourceConfiguration.name
    );
  }

  end(uid: number): Promise<boolean> {
    return window["end"](uid);
  }

  customclose() {
    window["customclose"](
      this.testResourceConfiguration.fs,
      this.testResourceConfiguration.name
    );
  }

  testArtiFactoryfileWriter(tLog: ITLog, callback: (Promise) => void) {
    return (fPath, value: string | Buffer | PassThrough) => {
      callback(
        new Promise<void>((res, rej) => {
          tLog("testArtiFactory =>", fPath);
        })
      );
    };
  }

  // stopSideCar(n: number): Promise<any> {
  //   return window["stopSideCar"](n, this.testResourceConfiguration.name);
  // }

  // launchSideCar(n: number): Promise<[number, ITTestResourceConfiguration]> {
  //   return window["launchSideCar"](n, this.testResourceConfiguration.name);
  // }
}
