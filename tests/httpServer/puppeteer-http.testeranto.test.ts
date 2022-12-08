import puppeteer, { Browser, Page } from "puppeteer";

import http from "http";

import { assert } from "chai";

import { serverFactory } from "./server";
import { ITestResource } from "..";
import {
  BaseCheck,
  BaseGiven,
  BaseSuite,
  BaseThen,
  BaseWhen,
  ITestImplementation,
  ITTestShape,
  Testeranto,
} from "../../index";

type IInput = () => http.Server;
type IThenShape = any;
type IWhenShape = [url: string, paylaod: string];

type TB = { browser: Browser; server: http.Server };

export class PuppeteerHttpTesteranto<
  ITestShape extends ITTestShape
> extends Testeranto<
  ITestShape,
  void,
  http.Server,
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
      http.Server,
      IWhenShape,
      IThenShape,
      ITestShape
    >,
    testSpecification,
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
          http.Server,
          IThenShape
        > {})(s, g, c),
      (f, w, t) =>
        new (class Given extends BaseGiven<
          http.Server,
          Promise<TB>,
          http.Server,
          IThenShape
        > {
          async teardown(subject, ndx) {
            return new Promise<void>((resolve) => {
              subject.browser.close();
              subject.server.close(() => {
                resolve();
              });
            });
          }

          async givenThat(subject, port: number) {
            const browser = await puppeteer.launch({
              headless: true,
              executablePath:
                "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
            });
            const server = serverFactory();
            await server.listen(port);
            return (new Promise<TB>((res) => res({ browser, server })));
          }
        })(f, w, t),
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
        new (class Check extends BaseCheck<any, any, any> {
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
            const server = serverFactory();
            await server.listen(port);
            return { browser, server };
          }
        })(f, g, c, cb),
      "port"
    );
  }
}
