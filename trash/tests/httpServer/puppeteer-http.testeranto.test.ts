import puppeteer, { Browser, Page } from "puppeteer";
import http from "http";
import { assert } from "chai";

import { Testeranto } from "../../src/index";
import { ITestImplementation, ITestSpecification, ITTestShape, Modify } from "../../src/types";

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
  testInput: Input
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
    { ports: 1 },
    {
      beforeEach: function (serverFactory: Subject, initialValues: any, testResource): Promise<Store> {
        return new Promise((res) => {
          puppeteer
            .launch({
              headless: true,
              executablePath:
                "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
            })
            .then((browser) => {
              const server = serverFactory();
              res({ server: server.listen(testResource.ports[0]), browser });
            });
        });
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
        const [path, expectation]: [string, string] = callback(store);
        const bodytext = await (
          await fetch(`http://localhost:${testResource.ports[0]}/${path}`)
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
    }
  )
