import { PassThrough } from "stream";

import { ScreencastOptions, ScreenshotOptions } from "puppeteer-core";
import { CdpPage, Page } from "puppeteer-core/lib/esm/puppeteer";

import { ITLog, ITTestResourceConfiguration } from "../lib";

export class PM_Web {
  testResourceConfiguration: ITTestResourceConfiguration;

  constructor(t: ITTestResourceConfiguration) {
    this.testResourceConfiguration = t;
  }

  start(): Promise<void> {
    return new Promise((r) => r());
  }

  stop(): Promise<void> {
    return new Promise((r) => r());
  }

  waitForSelector(p: string, s: string): any {
    return window["waitForSelector"](p, s);
  }

  screencast(opts: ScreencastOptions, page: Page) {
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

  goto(p, url: string): any {
    return window["goto"](p, url);
  }

  newPage(): CdpPage {
    return window["newPage"]();
  }

  $(selector: string): boolean {
    return window["$"](selector);
  }

  isDisabled(selector: string): Promise<boolean> {
    return window["isDisabled"](selector);
  }

  getAttribute(selector: string, attribute: string) {
    return window["getValue"](selector, attribute);
  }

  getValue(selector: string) {
    return window["getValue"](selector);
  }

  focusOn(selector: string) {
    return window["focusOn"](selector);
  }
  typeInto(value: string) {
    return window["typeInto"](value);
  }

  page(): string | undefined {
    return window["page"]();
  }

  click(selector: string): any {
    return window["click"](selector);
  }

  customScreenShot(opts: ScreenshotOptions, page: Page) {
    return window["customScreenShot"](
      {
        ...opts,
        path: this.testResourceConfiguration.fs + "/" + opts.path,
      },
      this.testResourceConfiguration.name
    );
  }

  existsSync(destFolder: string): boolean {
    return window["existsSync"](destFolder);
  }

  mkdirSync(x) {
    return window["mkdirSync"](this.testResourceConfiguration.fs + "/");
  }

  write(uid: number, contents: string): Promise<boolean> {
    return window["write"](uid, contents);
  }

  writeFileSync(filepath: string, contents: string) {
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

  end(uid: number): boolean {
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
}
