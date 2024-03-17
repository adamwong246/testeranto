import { assert } from "chai";
import http from "http";

import Testeranto from "testeranto/src/core-node";
import {
  ITestArtificer,
  ITestImplementation, ITestSpecification, ITTestShape, Modify
} from "testeranto/src/core";


type WhenShape = [url: string, paylaod: string];
type ThenShape = any;
type Input = () => http.Server;
type Subject = () => http.Server;
type InitialState = unknown;
type Store = http.Server;
type Selection = string;

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export const HttpTesteranto = <
  ITestShape extends ITTestShape,
  Prototype
>(
  testInput: Input,
  testImplementations: Modify<ITestImplementation<
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
  }>,

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
        // (fetch as any).__reset();
        const server = serverFactory();

        return new Promise((res, rej) => {
          server.timeout = 0;
          server.keepAliveTimeout = 0;

          server.listen(testResource.ports[0], async () => {
            await sleep(1);
            console.log("connections", server.connections)
            console.log("listening on", server.address(), server.listening);
            res(server);
          });
        });


      },
      andWhen: async function (store: Store, actioner: any, testResource): Promise<string> {
        // console.log("andWhen", store.address())
        const [path, body]: [string, string] = actioner(store);
        const f = `http://localhost:${testResource.ports[0]}/${path}`;
        console.log("fetch", f);

        return fetch(
          f,
          {
            method: "POST",
            body,
            keepalive: false,

          }
        ).then(async (r) => {
          return await r.text();
          // const z = await y.text();
          // console.log("y", y);
          // console.log("z", z);
          // return z;
        })
        //   .catch((e) => {
        //   console.error(e);
        //   return "";
        // })

      },
      butThen: async function (store: Store, callback: any, testResource): Promise<string> {
        const [path, expectation]: [string, string] = callback({});

        const f = `http://localhost:${testResource.ports[0]}/${path}`;
        // console.log("fetch", f);

        return fetch(f, {
          keepalive: false,
        })
          .then(async (r) => {
            console.log
            const bodytext = await r.text();
            assert.equal(bodytext, expectation);
            return bodytext;
          })
        // .catch((e) => {
        //   console.error(e);
        //   return "";
        // })

        // const bodytext = await (
        //   await fetch(`http://localhost:${testResource.ports[0]}/${path}`)
        // ).text();
        // assert.equal(bodytext, expectation);
        // return bodytext;
      },
      afterEach: function (
        store: Store,
        key: string,
        artificer: ITestArtificer
      ): Promise<void> {
        console.log("afterEach");
        return new Promise((res) => {
          store.closeAllConnections();

          store.close(async (e) => {
            await sleep(1);
            console.log("store is closed", e);
            res();
          })
        })
      }
    },
    { ports: 1 },
  )
