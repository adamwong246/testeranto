/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ITTestResourceConfiguration } from "../lib";

import { ITLog } from "../lib";

export abstract class PM_sidecar {
  testResourceConfiguration: ITTestResourceConfiguration;

  abstract start(stopper: () => any): Promise<void>;
  abstract stop(): Promise<void>;

  testArtiFactoryfileWriter(tLog: ITLog, callback: (p: Promise<void>) => void) {
    return (fPath: string, value: unknown) => {
      callback(Promise.resolve());
    };
  }

  // abstract $(selector: string): any;
  // abstract click(selector: string): any;
  // abstract closePage(p): any;
  // abstract createWriteStream(
  //   filepath: string,
  //   testName: string
  // ): Promise<string>;
  // abstract customclose();
  // abstract customScreenShot(opts: object, page?: string): any;
  // abstract end(uid: number): Promise<boolean>;
  // abstract existsSync(fp: string): Promise<boolean>;
  // abstract focusOn(selector: string): any;
  // abstract getAttribute(selector: string, attribute: string): any;
  // abstract getValue(value: string): any;
  // abstract goto(p, url: string): any;
  // abstract isDisabled(selector: string): Promise<boolean>;
  // abstract mkdirSync(a: string);
  // abstract newPage(): Promise<string>;
  // abstract page(): Promise<string | undefined>;
  // abstract pages(): Promise<string[]>;
  // abstract screencast(o: ScreenRecorderOptions, p: Page | string): any;
  // abstract screencastStop(s: string): any;
  // abstract typeInto(selector: string, value: string): any;
  // abstract waitForSelector(p, sel: string);
  // abstract write(uid: number, contents: string): Promise<boolean>;
  // abstract writeFileSync(f: string, c: string, t: string): Promise<boolean>;

  // abstract launchSideCar(
  //   n: number
  // ): Promise<[number, ITTestResourceConfiguration]>;
  // abstract stopSideCar(n: number): Promise<any>;
}
