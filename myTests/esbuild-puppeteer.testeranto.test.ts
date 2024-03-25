// A testeranto which sideloads another process and operates puppeteer

import puppeteer, { Browser, Page } from "puppeteer";
import { PuppeteerScreenRecorder } from "puppeteer-screen-recorder";
import { PassThrough } from "stream";

import Testeranto from "testeranto/src/Node";
import {
  ITestImplementation,
  ITestSpecification,
  ITTestShape,
} from "testeranto/src/core";

type Input = string;
type InitialState = unknown;
type WhenShape = any;
type ThenShape = any;
type Selection = { page: Page };

type Store = {
  page: Page;
  recorder: PuppeteerScreenRecorder;
  consoleLogs: string[];
  pipeStream: PassThrough;
};

type Subject = {
  browser: Browser;
  htmlBundle: string;
};

const htmlTemplate = (jsBundle: string): string => `
<!DOCTYPE html><html lang="en">
  <head>
    <script type="importmap">
      {
      "imports": {
        "main.js": "http://localhost:8000/${jsBundle}"
      }
    }
    </script>

    <script type="module" crossorigin="anonymous" src="http://localhost:8000/${jsBundle}"></script>
    <script type="module">
      import LaunchClassicalComponent from "main.js"
      LaunchClassicalComponent()
    </script>
  </head>

  <body>
    <div id="root">
    </div>
  </body>

  <footer></footer>
</html>`;

export const EsbuildPuppeteerTesteranto = <ITestShape extends ITTestShape>(
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
      beforeAll: async function (
        prebuilt: Input,
        artificer,
      ): Promise<Subject> {
        const browser = await await puppeteer.launch({
          args: [
            '--disable-web-security',
            '--disable-features=IsolateOrigins',
            '--disable-site-isolation-trials'
          ],

          headless: true,
          devtools: false,
          executablePath:
            "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
        });

        return new Promise((res, rej) => {
          res({
            browser,
            htmlBundle: htmlTemplate("./dist/src/ClassicalComponent.js"),
          });
        });

      },
      beforeEach: async (
        subject: Subject,
        ndx,
        testResource,
        artificer
      ): Promise<Store> => {
        const page = await subject.browser.newPage();

        const recorder = new PuppeteerScreenRecorder(page, {
          followNewTab: false,
          fps: 25,
          videoFrame: {
            width: 1024,
            height: 768,
          },
          videoCrf: 18,
          videoCodec: "libx264",
          videoPreset: "ultrafast",
          videoBitrate: 1000,
          autopad: {
            color: "black",
          },
          aspectRatio: "4:3",
        });

        const consoleLogs: string[] = [];
        await page.setRequestInterception(true);

        page
          .on("console", (message) => {
            console.log(message)
            consoleLogs.push(
              `${message
                .type()
                .substr(0, 3)
                .toUpperCase()}\t\t\t${message.text()}`
            )
          }

          )
          .on("pageerror", ({ message }) => consoleLogs.push(message))
          .on("response", async (response) => {
            consoleLogs.push(
              `Res\t\t\t${response.status()} ${response.url()} ${JSON.stringify(
                response.request().headers()
              )}`
            );
            // response.continue();
          })
          .on("requestfailed", (request) =>
            consoleLogs.push(
              `REQ_FAIL\t${request.failure().errorText} ${request.url()}`
            )
          )
          .on("request", (request) => {
            consoleLogs.push("REQUEST\t", request);
            request.continue();
          });

        const pipeStream = new PassThrough();
        return page.setContent(subject.htmlBundle).then(async () => {
          await recorder.startStream(pipeStream);
          artificer(
            "./screenshot.png",
            await (await page).screenshot()
          );
          return {
            page,
            recorder: recorder,
            consoleLogs,
            pipeStream,
          };
        });
      },
      andWhen: function ({ page }: Store, actioner): Promise<Selection> {
        return actioner()({ page });
      },
      butThen: async function ({ page }: Store): Promise<Selection> {
        return { page };
      },
      afterEach: async function (
        { page, recorder, consoleLogs, pipeStream }: Store,
        ndx,
        artificer
      ) {
        artificer("./screencap.mp4", pipeStream);
        await recorder.stop();
        pipeStream.end();
        // page.close();
        artificer(`./screenshot.png`, await page.screenshot());
        artificer("./consoleLogs.txt", consoleLogs.join(`\n`));
        return;
      },
      afterAll: (store: Store, artificer) => {
        store.page.browser().close();
        return;
      },
    },
  );
