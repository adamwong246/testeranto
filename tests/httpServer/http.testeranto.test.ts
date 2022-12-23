import { assert } from "chai";
import http from "http";

import {TesterantoFactory} from "../../index";
import { ITestImplementation, ITestSpecification, ITTestShape } from "../../src/testShapes";

type TestResource = "port";
type WhenShape = [url: string, paylaod: string];
type ThenShape = any;
type Input = () => http.Server;
type Subject = () => http.Server;
type InitialState = unknown;
type Store = http.Server;
type Selection = string;

export const HttpTesteranto = <
  ITestShape extends ITTestShape
>(
  testImplementations: ITestImplementation<
    InitialState,
    Selection,
    WhenShape,
    ThenShape,
    ITestShape
  >,
  testSpecifications: ITestSpecification<ITestShape>,
  testInput: Input
) =>
  TesterantoFactory<
    ITestShape,
    Input,
    Subject,
    Store,
    Selection,
    ThenShape,
    WhenShape,
    TestResource,
    InitialState
  >(
    testInput,
    testSpecifications,
    testImplementations,
    async (input) => input,
    async (serverFactory, initialValues, testResource) => {
      const server = serverFactory();
      await server.listen(testResource);
      return server;
    },
    
    // andWhen  
    async (store, actioner, testResource) => {
      const [path, body]: [string, string] = actioner(store)();
      const y = await fetch(
        `http://localhost:${testResource.toString()}/${path}`,
        {
          method: "POST",
          body,
        }
      );
      return await y.text();
    },
    // butThen
    async (store, callback, testResource) => {
      const [path, expectation]: [string, string] = callback({});
      const bodytext = await (
        await fetch(`http://localhost:${testResource.toString()}/${path}`)
      ).text();
      assert.equal(bodytext, expectation);
      return bodytext;
    },
    (t) => t,
    async (server) => {
      return new Promise((res) => {
        server.close(() => {
          res(server)
        })
      })
    },
    (actioner) => actioner,
    "port"
  )
 