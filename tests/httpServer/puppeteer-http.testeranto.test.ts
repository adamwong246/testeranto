import puppeteer, { Browser, Page } from "puppeteer";
import http from "http";
import { assert } from "chai";

import { TesterantoFactory } from "../../src/index";
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
  testInput: Input,
  entryPath: string,
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
    "port",
    {
      beforeEach: function (serverFactory : Subject, initialValues: any, port): Promise<Store> {
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
      andWhen: async function (store: Store, actioner: any, port): Promise<string> {
        const [path, body]: [string, string] = actioner(store)();
        const y = await fetch(
          `http://localhost:${port.toString()}/${path}`,
          {
            method: "POST",
            body,
          }
        );
        return await y.text();
      },
      butThen: async function (store: Store, callback: any, port): Promise<string> {
        const [path, expectation]: [string, string] = callback(store);
        const bodytext = await(
          await fetch(`http://localhost:${port.toString()}/${path}`)
        ).text();
        assert.equal(bodytext, expectation);
        return bodytext;
      },
      afterEach: function (store: Store, ndx: number): unknown {
        return new Promise<void>((resolve) => {
          store.browser.close();
          store.server.close(() => {
            resolve();
          });
        });
      }
    },
    entryPath
  )
