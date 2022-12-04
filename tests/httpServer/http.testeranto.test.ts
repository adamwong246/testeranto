import http from "http";

import { assert } from "chai";

import { serverFactory } from "./server";

import { createStore, Store, AnyAction, PreloadedState } from "redux";
import {
  BaseCheck,
  BaseGiven,
  BaseSuite,
  BaseThen,
  BaseWhen,
  ITestImplementation,
  TesterantoV2,
} from "../../index";

class Suite extends BaseSuite<any, any, any> {}

class Given extends BaseGiven<any, any, any> {
  async teardown(server: http.Server) {
    return new Promise((resolve, reject) => {
      server.close(() => {
        resolve(server);
      });
    });
  }

  async givenThat(subject) {
    const server = serverFactory();
    await server.listen(3000);
    return server;
  }
}

class When<IStore> extends BaseWhen<IStore> {
  payload?: any;

  constructor(name: string, actioner: (...any) => any, payload?: any) {
    super(name, (store) => actioner(store));
    this.payload = payload;
  }

  async andWhen(store, actioner) {
    const [path, body]: [string, string] = actioner({});
    const y = await fetch(`http://localhost:3000/${path}`, {
      method: "POST",
      body,
    });

    return y.text();
  }
}

class Then extends BaseThen<any> {
  constructor(name: string, callback: (val: any) => any) {
    super(name, callback);
  }

  async butThen(store) {
    const [path, expectation]: [string, string] = this.callback({});
    const bodytext = await (
      await fetch(`http://localhost:3000/${path}`)
    ).text();
    assert.equal(bodytext, expectation);
    return;
  }
}

class Check extends BaseCheck<any, any, any> {
  async teardown(server: http.Server) {
    return new Promise((resolve, reject) => {
      server.close(() => {
        resolve(server);
      });
    });
  }

  async checkThat(subject) {
    const server = serverFactory();
    await server.listen(3000);
    return server;
  }
}

type IAction = [url: string, paylaod: string];

export class HttpTesteranto<IStoreShape, ITestShape> extends TesterantoV2<
  ITestShape,
  IStoreShape,
  IStoreShape,
  IStoreShape,
  IStoreShape,
  IAction
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
      (f, g, c, cb) => new Check(f, g, c, cb)
    );
  }
}
