// A testeranto which operates puppeteer

import { assert } from "chai";
import html from "html";
import Testeranto from "testeranto/src/core-node";
import {
  ITestImplementation,
  ITestSpecification,
  ITTestShape,
} from "testeranto/src/core";
import { PassThrough } from "stream";
import puppeteer, { Browser, HTTPRequest, Page } from "puppeteer";

import { PuppeteerScreenRecorder } from "puppeteer-screen-recorder";

type Input = {
  headless: boolean;
  slowMo: number;
};
type InitialState = unknown;
type WhenShape = any;
type ThenShape = any;

type Store = {
  recorder: PuppeteerScreenRecorder;
  pipeStream: PassThrough;
  page: any;
  consoleLogs: string[];
  pageErrors: string[];
  urlLog: string[];
  applications: string[];
  sfIds: string[];
};
type Selection = Store;
type Subject = Browser;

export const PuppeteerTesteranto = <ITestShape extends ITTestShape>(
  input: Input,
  testImplementations: ITestImplementation<
    InitialState,
    Selection,
    WhenShape,
    ThenShape,
    ITestShape
  >,
  testSpecifications: ITestSpecification<ITestShape>
) =>
  Testeranto<
    ITestShape,
    Input,
    Subject,
    Store,
    Selection,
    WhenShape,
    ThenShape,
    InitialState
  >(
    input,
    testSpecifications,
    testImplementations,
    {
      beforeAll: async (input) => {

        return await puppeteer.launch({
          // slowMo: input?.slowMo || 0,
          // headless: input.headless,
          // devtools: true,
          args: ["--disable-features=site-per-process"],
          executablePath:
            "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
        });
      },
      beforeEach: async (
        browser: Subject,
        ndx,
        testRsource,
        artificer
      ): Promise<Store> => {
        const page = await (
          await browser.createIncognitoBrowserContext()
        ).newPage();
        await page.setUserAgent(
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36"
        );
        // page.setDefaultTimeout(2500000);
        // page.setViewport({
        //   width: 1600,
        //   height: 1200,
        // });
        const recorder = new PuppeteerScreenRecorder(page, {
          followNewTab: false,
          // fps: 25,
          // videoFrame: {
          //   width: 1600,
          //   height: 1200,
          // },
          // videoCrf: 18,
          // videoCodec: 'libx264',
          // videoPreset: 'ultrafast',
          // videoBitrate: 1000,
          // autopad: {
          //   color: 'black',
          // },
          // aspectRatio: '4:3',
        });

        const consoleLogs: string[] = [];
        const pageErrors: string[] = [];
        const urlLog: string[] = [];
        await page.setRequestInterception(true);

        page
          .on("console", (message) =>
            consoleLogs.push(
              `${message
                .type()
                .substr(0, 3)
                .toUpperCase()}\t\t\t${message.text()}`
            )
          )
          .on("pageerror", ({ message }) => pageErrors.push(message))
          .on("response", async (response) => {
            // networkLogs.push(`Res\t\t\t${response.status()} ${response.url()} ${JSON.stringify(response.request().headers())}`);
            // response.continue();
          })
          .on("requestfailed", (request) => {
            // networkLogs.push(`REQ_FAIL\t${request.failure().errorText} ${request.url()}`))
          })
          .on("request", (request: any) => {
            request.continue();
          })
          .on("framenavigated", (frame) => {
            urlLog.push(`${Date.now()}\t${frame.url()}`);
          });

        const pipeStream = new PassThrough();
        artificer("./screencap.mp4", pipeStream);
        await recorder.startStream(pipeStream);

        return {
          page,
          recorder: recorder,
          consoleLogs,

          pageErrors,
          pipeStream,
          urlLog,
          applications: [],
          sfIds: [],
        };
      },
      andWhen: async (store: Store, actioner): Promise<Selection> => {
        return actioner()(store);
      },
      butThen: async function (store: Store): Promise<Selection> {
        return store;
      },
      afterEach: async function (store: Store, ndx, artificer) {
        await store.recorder.stop();
        store.pipeStream.end();
        artificer(
          "./afterEachScreenshot.png",
          await (await store.page).screenshot({ fullPage: true })
        );
        // store.page.close();
        artificer("./consoleLogs.txt", store.consoleLogs.join(`\n`));
        artificer("./pageErrors.txt", store.pageErrors.join(`\n`));
        artificer("./urls.txt", store.urlLog.join(`\n`));
        artificer(
          "./afterEach.html",
          html.prettyPrint(await store.page.content(), { indent_size: 2 })
        );

        return store;
      },
      afterAll: async (store: Store, artificer) => {
        await store.page.browser().close();
        return;
      },
    }
  );
