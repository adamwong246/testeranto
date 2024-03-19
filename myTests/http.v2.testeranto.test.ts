// WIP 
// a less crude test of an http server which exists mostly as a POC.
// It can only POST and GET via WHEN and THEN, but can check multiple conditions

import { assert } from "chai";
import http from "http";

import Testeranto from "testeranto/src/core-node";
import {
  ITestArtificer,
  ITestImplementation, ITestSpecification, ITTestShape, Modify
} from "testeranto/src/core";

type WhenShape = [url: string, payload: string];
type ThenShape = [url: string, response: string];
type Store = http.Server;
type Selection = string;

type Input = () => Store;
type Subject = () => Store;
type InitialState = unknown;

export type IHttpTesterantoTestImplementation<ITestShape extends ITTestShape> = Modify<ITestImplementation<
  InitialState,
  Selection,
  WhenShape,
  ThenShape,
  ITestShape
>, {
  Whens: {
    [K in keyof ITestShape["whens"]]: (
      ...Iw: ITestShape["whens"][K]
    ) => WhenShape;
  }
}>;

// we need to sleep to give the http time to drain the connectionss
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export const HttpTesteranto = <
  ITestShape extends ITTestShape
>(
  testInput: Input,
  testImplementations: IHttpTesterantoTestImplementation<ITestShape>,

  testSpecifications: ITestSpecification<ITestShape>,
) =>
  Testeranto<
    ITestShape,
    Input,
    Subject,
    Store,
    Selection,
    ThenShape,
    WhenShape,
    InitialState
  >(
    testInput,
    testSpecifications,
    testImplementations,
    {
      beforeEach: async function (
        serverFactory: Subject,
        initialValues: any,
        testResource
      ): Promise<Store> {
        const server = serverFactory();
        return new Promise((res, rej) => {
          server.timeout = 0;
          server.keepAliveTimeout = 0;
          server.listen(testResource.ports[0], async () => {
            await sleep(1);
            res(server);
          });
        });


      },
      andWhen: async function (store: Store, actioner: any, testResource): Promise<string> {
        const [path, body]: [string, string] = actioner(store);
        return fetch(
          `http://localhost:${testResource.ports[0]}/${path}`,
          {
            method: "POST",
            body,
            keepalive: false,
          }
        ).then(async (r) => {
          return await r.text();
        })
      },
      butThen: async function (store: Store, callback: any, testResource): Promise<string> {
        const [path, expectation]: [string, string] = callback({});
        return fetch(`http://localhost:${testResource.ports[0]}/${path}`, {
          keepalive: false,
        })
          .then(async (r) => {
            const bodytext = await r.text();
            assert.equal(bodytext, expectation);
            return bodytext;
          })
      },
      afterEach: function (
        store: Store,
        key: string,
        artificer: ITestArtificer
      ): Promise<void> {
        return new Promise((res) => {
          store.closeAllConnections();
          store.close(async (e) => {
            await sleep(1);
            res();
          })
        })
      }
    },
    { ports: 1 },
  )
