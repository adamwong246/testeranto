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
  nameKey: string,
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
        await server.listen(testResource.ports[0]);
        console.log("listening on port", testResource.ports[0]);
        return server;
      },
      andWhen: async function (store: Store, actioner: any, testResource): Promise<string> {
        const [path, body]: [string, string] = actioner(store);
        const y = await fetch(
          `http://localhost:${testResource.ports[0]}/${path}`,
          {
            method: "POST",
            body,
          }
        );
        return await y.text();
      },
      butThen: async function (store: Store, callback: any, testResource): Promise<string> {
        const [path, expectation]: [string, string] = callback({});
        const bodytext = await (
          await fetch(`http://localhost:${testResource.ports[0]}/${path}`)
        ).text();
        assert.equal(bodytext, expectation);
        return bodytext;
      },
      afterEach: function (
        store: Store,
        key: string,
        artificer: ITestArtificer
      ): Promise<unknown> {
        return new Promise((res) => {
          store.close(() => {
            res(true)
          })
        })
      }
    },
    nameKey,
    { ports: 1 },
  )
