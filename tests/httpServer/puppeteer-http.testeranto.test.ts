import puppeteer, { Browser, Page } from "puppeteer";
import http from "http";
import { assert } from "chai";

import { TesterantoFactory } from "../../index";
import { ITestImplementation, ITestSpecification, ITTestShape } from "../../src/testShapes";

type TestResource = "port";
type WhenShape = [url: string, paylaod: string];
type ThenShape = any;
type Input = () => http.Server;
type Subject = () => http.Server;
type InitialState = unknown;
type Store = { browser: Browser; server: http.Server };
type Selection = string;

export const PuppeteerHttpTesteranto = <
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
    async (serverFactory, initialValues, port) => {

      return new Promise((res) => {
        puppeteer
          .launch({
            headless: true,
            executablePath:
              "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
          })
          .then((browser) => {
            const server = serverFactory();
            res({ server: server.listen(port), browser });
          });
      });
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
    async (store, callback, port) => {
      const [path, expectation]: [string, string] = callback({});
      const bodytext = await (
        await fetch(`http://localhost:${port.toString()}/${path}`)
      ).text();
      assert.equal(bodytext, expectation);
      return bodytext;

    },
    (t) => t,
    async (subject) => {
      return new Promise<void>((resolve) => {
        subject.browser.close();
        subject.server.close(() => {
          resolve();
        });
      });
    },
    (actioner) => actioner,
    "port"
  )
