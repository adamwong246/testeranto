import { assert } from "chai";
import http from "http";

import { Testeranto } from "../../src/index";
import { ITestImplementation, ITestSpecification, ITTestShape, Modify } from "../../src/types";

type WhenShape = [url: string, payload: string, port: number];
type ThenShape = any;
type Input = () => http.Server;
type Subject = () => http.Server;
type InitialState = unknown;
type Store = { serverA: http.Server, serverB: http.Server };
type Selection = string;

export const Http2xTesteranto = <
  ITestShape extends ITTestShape
>(
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
  testInput: Input,
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
    { ports: 2 },

    {
      beforeEach: async function (serverFactory: Subject, initialValues: any, testResource): Promise<Store> {
        const serverA = serverFactory();
        await serverA.listen(testResource.ports[0]);
        const serverB = serverFactory();
        await serverB.listen(testResource.ports[1]);
        return { serverA, serverB };
      },

      afterEach: function ({ serverA, serverB }, ndx: number): unknown {
        return new Promise((res) => {
          serverA.close(() => {
            serverB.close(() => {
              res(true)
            })
          })
        })
      },


      andWhen: async function (store: Store, actioner: any, testResource): Promise<string> {
        const [path, body, portSlot]: [string, string, number] = actioner(store);
        const y = await fetch(
          `http://localhost:${testResource.ports[portSlot]}/${path}`,
          {
            method: "POST",
            body,
          }
        );
        return await y.text();
      },

      butThen: async function (store: Store, callback: any, testResource): Promise<string> {
        const [path, expectation, portSlot]: [string, string, number] = callback({});
        const bodytext = await (
          await fetch(`http://localhost:${testResource.ports[portSlot]}/${path}`)
        ).text();
        assert.equal(bodytext, expectation);
        return bodytext;
      },

    }
  )
