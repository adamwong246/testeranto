import { assert } from "chai";
import http, { get, request } from "http";

import {
  BaseGiven,
  BaseSuite,
  BaseThen,
  BaseWhen,
  Testeranto,
} from "../../index";
import { serverFactory } from "./server";

type ISimpleThensForRedux<IThens> = {
  [IThen in keyof IThens]: (
    /* @ts-ignore:next-line */
    ...xtras: IThens[IThen]
  ) => any;
};

export default <ISS, IGS, IWS, ITS>(
  serverfactory: () => http.Server,
  tests: (
    Suite: Record<
      keyof ISS,
      (
        name: string,
        givens: BaseGiven<any, any, any>[]
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
    Then: Record<keyof ITS, any>
  ) => BaseSuite<any, any, any>[]
) => {
  return Testeranto<
    any,
    any,
    any,
    any,
    ISS,
    IGS,
    IWS,
    ITS,
    ISimpleThensForRedux<ITS>
  >(
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
        const server = serverFactory();
        await server.listen(3000);
        return server;
      }
    },

    class HttpWhen<IStore> extends BaseWhen<IStore> {
      payload?: any;

      constructor(name: string, actioner: (...any) => any, payload?: any) {
        super(name, (store) => actioner(store));
        this.payload = payload;
      }

      async andWhen(store, actioner) {
        const [path, payload]: [string, string] = actioner();
        const x = await fetch(`http://localhost:3000/${path}`, {
          method: "POST",
          body: payload,
        });
      }
    },
    class HttpThen extends BaseThen<any> {
      constructor(name: string, callback: (val: any) => any) {
        super(name, callback);
      }

      async butThen() {
        const [path, expectation]: [string, string] = this.callback({});
        const x = await fetch(`http://localhost:3000/${path}`);
        assert.equal(await x.text(), expectation);
        return;
      }
    }
  );
};
