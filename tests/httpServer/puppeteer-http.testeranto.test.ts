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
  Testeranto,
} from "../../index";

type IInput = () => http.Server;

class Suite extends BaseSuite<IInput, any, any, any> {}

class Given extends BaseGiven<any, any, any> {
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

  async givenThat(subject, port: number) {
    const browser = await puppeteer.launch({
      headless: true,
      executablePath:
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    });
    // const page = await browser.newPage();
    // console.log("(puppeteer) Server starting on ", port);
    const server = serverFactory();
    await server.listen(port);
    return { browser, server };
  }
}

class When<IStore> extends BaseWhen<IStore> {
  payload?: any;

  constructor(name: string, actioner: (...any) => any, payload?: any) {
    super(name, (store) => actioner(store));
    this.payload = payload;
  }

  async andWhen(store, actioner, port: number) {
    const [path, body]: [string, string] = actioner({});
    const y = await fetch(`http://localhost:${port.toString()}/${path}`, {
      method: "POST",
      body,
    });

    return y.text();
  }
}

class Then extends BaseThen<any, any> {
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
}

class Check extends BaseCheck<any, any, any> {
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
    // const page = await browser.newPage();

    console.log("(puppeteer) Server starting on ", port);
    const server = serverFactory();
    await server.listen(port);
    return { browser, server };
  }
}

type IAction = [url: string, paylaod: string];

export class PuppeteerHttpTesteranto<
  IStoreShape,
  ITestShape
> extends Testeranto<
  ITestShape,
  IStoreShape,
  IStoreShape,
  IStoreShape,
  IStoreShape,
  IAction,
  ITestResource,
  IInput
> {
  constructor(
    testImplementation: ITestImplementation<IStoreShape, IStoreShape, IAction>,
    testSpecification,
    thing
  ) {
    super(
      testImplementation,
      testSpecification,
      thing,
      (s, g, c) => new Suite(s, g, c),
      (f, w, t) => new Given(f, w, t),
      (s, o) => new When(s, o),
      (s, o) => new Then(s, o),
      (f, g, c, cb) => new Check(f, g, c, cb),
      "port"
    );
  }
}
