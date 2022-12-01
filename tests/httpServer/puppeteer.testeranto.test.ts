// This file defines the test of an `http.Server` of the native `http` library, using puppeteer

import * as puppeteer from "puppeteer";

import { assert } from "chai";
import http from "http";

import {
  BaseCheck,
  BaseGiven,
  BaseSuite,
  BaseThen,
  BaseWhen,
  Testeranto,
} from "../../index";
import { serverFactory } from "./server";

export default <ISS, IGS, IWS, ITS, ICheckExtensions>(
  serverfactory: () => http.Server,
  tests: (
    Suite: Record<
      keyof ISS,
      (
        name: string,
        givens: BaseGiven<any, any, any>[],
        checks: BaseCheck<any, any, any>[]
      ) => BaseSuite<any, any, any>
    >,
    Given: Record<
      keyof IGS,
      (
        feature: string,
        whens: BaseWhen<any>[],
        thens: BaseThen<any>[],
        ...xtraArgsForGiven: any //{ [ISuite in keyof IGS]: IGS[ISuite] }[]
      ) => BaseGiven<any, any, any>
    >,
    When: Record<keyof IWS, any>,
    Then: Record<keyof ITS, any>,

    Check: Record<
      keyof ICheckExtensions,
      (
        feature: string,
        callback: (whens, thens) => any,
        ...xtraArgsForGiven: any //{ [ISuite in keyof IGS]: IGS[ISuite] }[]
      ) => BaseCheck<any, any, any>
    >

    // That: Record<keyof IThatExtensions, any>
  ) => BaseSuite<any, any, any>[]
) => {
  return Testeranto<any, any, any, any, ISS, IGS, IWS, ITS, ICheckExtensions>(
    serverfactory,
    tests,
    class HttpSuite extends BaseSuite<any, any, any> {},

    class HttpGiven extends BaseGiven<any, any, any> {
      async teardown(server: http.Server) {
        return new Promise((resolve, reject) => {
          server.close(() => {
            resolve(server);
          });
        });
      }

      async givenThat(subject) {
        const browser = await puppeteer.launch({
          // wtf?
          product: "firefox",
          headless: false,
        });
        const page = await browser.newPage();

        const server = serverFactory();
        await server.listen(3000);
        return { page, server };
      }
    },

    class HttpWhen<IStore extends { page; server }> extends BaseWhen<IStore> {
      payload?: any;

      constructor(name: string, actioner: (...any) => any, payload?: any) {
        super(name, (store) => actioner(store));
        this.payload = payload;
      }

      async andWhen(store: IStore, actioner) {
        const [path, body]: [string, string] = actioner({});

        await store.page.goto(`http://localhost:3000/${path}`);

        // const y = await fetch(`http://localhost:3000/${path}`, {
        //   method: "POST",
        //   body,
        // });
        // return y.text();
      }
    },
    class HttpThen extends BaseThen<any> {
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
    },

    class HttpCheck extends BaseCheck<any, any, any> {
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
  );
};
