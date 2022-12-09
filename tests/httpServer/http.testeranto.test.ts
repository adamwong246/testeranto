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
  ITestSpecification,
  ITTestShape,
  Testeranto,
} from "../../index";

type IInput = () => http.Server;
type IWhenShape = [url: string, paylaod: string];
type IThenShape = any;

export class HttpTesteranto<
  IStoreShape,
  ITestShape extends ITTestShape
> extends Testeranto<
  ITestShape,
  IStoreShape,
  IStoreShape,
  IStoreShape,
  IStoreShape,
  IWhenShape,
  IThenShape,
  ITestResource,
  IInput
> {
  constructor(
    testImplementation: ITestImplementation<
      IStoreShape,
      IStoreShape,
      IWhenShape,
      IThenShape,
      ITestShape
    >,
    testSpecification: ITestSpecification<ITestShape>,
    thing
  ) {
    super(
      testImplementation,
      /* @ts-ignore:next-line */
      testSpecification,
      
      thing,
      class Suite extends BaseSuite<IInput, any, any, any, any> { },

      class Given extends BaseGiven<any, any, any, any> {
          async teardown(server: http.Server, ndx) {
            return new Promise<void>((resolve) => {
              server.close(() => {
                resolve();
              });
            });
          }

          async givenThat(subject, port: number) {
            const server = serverFactory();
            await server.listen(port);
            return server;
          }
      },
      
      class When<IStore> extends BaseWhen<IStore, any, any> {
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
      },

      class Then extends BaseThen<any, any, any> {
        constructor(name: string, callback: (val: any) => any) {
          super(name, callback);
        }

        async butThen(store, port: number) {
          const [path, expectation]: [string, string] = this.thenCB({});
          const bodytext = await (
            await fetch(`http://localhost:${port.toString()}/${path}`)
          ).text();
          assert.equal(bodytext, expectation);
          return;
        }
      },

      class Check extends BaseCheck<any, any, any, IThenShape> {
        async teardown(server: http.Server) {
          return new Promise((resolve, reject) => {
            server.close(() => {
              resolve(server);
            });
          });
        }

        async checkThat(subject, port: number) {
          const server = serverFactory();
          await server.listen(port);
          return server;
        }
      },
      
      "port"
    );
  }
}
