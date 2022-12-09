import puppeteer, { Browser, Page } from "puppeteer";

import http from "http";

import { assert } from "chai";

import { ITestResource } from "..";
import {
  BaseCheck,
  BaseGiven,
  BaseSuite,
  BaseThen,
  BaseWhen,
  ITestImplementation,
  ITestSpecification,
  ITTestShape,
  Testeranto,
} from "../../index";

type IInput = () => http.Server;
type IThenShape = any;
type IWhenShape = [url: string, paylaod: string];
type ISelection = any;
type TB = { browser: Browser; server: http.Server };

export class PuppeteerHttpTesteranto<
  ITestShape extends ITTestShape
> extends Testeranto<
  ITestShape,
  void,
  ISelection,
  TB,
  http.Server,
  IWhenShape,
  IThenShape,
  ITestResource,
  IInput
> {
  constructor(
    testImplementation: ITestImplementation<
      void,
      ISelection,
      IWhenShape,
      IThenShape,
      ITestShape
    >,
    testSpecification: ITestSpecification<ITestShape>,
    thing
  ) {
    super(
      testImplementation,
      testSpecification,
      thing,
      (s, g, c) =>
        new (class Suite extends BaseSuite<
          IInput,
          http.Server,
          TB,
          ISelection,
          IThenShape
        > {})(s, g, c),
      (n, f, w, t) =>
        new (class Given extends BaseGiven<
          () => http.Server,
          TB,
          ISelection,
          IThenShape
        > {
          async givenThat(
            subject: () => http.Server,
            port: number
          ): Promise<TB> {
            return new Promise((res) => {
              puppeteer
                .launch({
                  headless: true,
                  executablePath:
                    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
                })
                .then((browser) => {
                  const server = subject();
                  res({ server: server.listen(port), browser });
                });
            });
          }

          async teardown(subject, ndx) {
            return new Promise<void>((resolve) => {
              subject.browser.close();
              subject.server.close(() => {
                resolve();
              });
            });
          }
        })(n, f, w, t),
      (s, o) =>
        new (class When<IStore> extends BaseWhen<IStore, any, any> {
          payload?: any;

          constructor(name: string, actioner: (...any) => any, payload?: any) {
            super(name, (store) => actioner(store));
            this.payload = payload;
          }

          async andWhen(store, actioner, port: number) {
            const [path, body]: [string, string] = actioner({});
            const y = await fetch(
              `http://localhost:${port.toString()}/${path}`,
              {
                method: "POST",
                body,
              }
            );

            return y.text();
          }
        })(s, o),
      (s, o) =>
        new (class Then extends BaseThen<any, any, any> {
          constructor(name: string, callback: (val: any) => any) {
            super(name, callback);
          }

          async butThen(store, port: number) {
            const [path, expectation]: [string, string] = this.callback({});
            const bodytext = await (
              await fetch(`http://localhost:${port.toString()}/${path}`)
            ).text();
            assert.equal(bodytext, expectation);
            return;
          }
        })(s, o),
      (f, g, c, cb) =>
        new (class Check extends BaseCheck<any, any, ISelection, IThenShape> {
          async teardown({
            browser,
            server,
          }: {
            browser: Browser;
            server: http.Server;
          }) {
            return new Promise((resolve, reject) => {
              browser.close();
              server.close(() => {
                resolve(server);
              });
            });
          }

          async checkThat(subject, port: number) {
            const browser = await puppeteer.launch({
              headless: true,
              executablePath:
                "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
            });
            const server = thing();
            await server.listen(port);
            return { browser, server };
          }
        })(f, g, c, cb),
      "port"
    );
  }
}
