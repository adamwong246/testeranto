// A testeranto which sideloads another process and operates puppeteer

import fs from "fs";
import puppeteer, { Browser, Page } from "puppeteer";
import esbuild from "esbuild";
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

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const htmlTemplate = (jsbundle: string): string => `
<!DOCTYPE html><html lang="en">
  <head>
    <script type="module">
      ${jsbundle}

      // window.ClassicalComponent = ClassicalComponent;
      console.log('window.ClassicalComponent')
    </script>
    <script type="module">
    // console.log(window.ClassicalComponent)
      // import { LaunchClassicalComponent } from "ClassicalComponent";
      // LaunchClassicalComponent();
    </script>
  </head>

  <body>
    <h2>hello esbuild-puppeteer.testeranto</h2>
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
        // testResource
      ): Promise<Subject> {
        const browser = await await puppeteer.launch({
          headless: false,
          devtools: true,
          executablePath:
            "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
        });

        return new Promise((res, rej) => {
          fs.readFile(`./dist/` + testInput, 'utf8', (err, data) => {
            if (err) {
              console.error(err);
              return;
            }
            // console.log(data);

            res({
              browser,
              htmlBundle: htmlTemplate(
                data,
              ),
            });
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

        artificer("./screencap.mp4", pipeStream);

        return page.setContent(subject.htmlBundle).then(async () => {
          await recorder.startStream(pipeStream);
          artificer(
            "./beforeEachScreenshot.png",
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
        await recorder.stop();
        pipeStream.end();
        // page.close();
        artificer("./afterEachScreenshot.png", await (await page).screenshot());
        artificer("./afterEachLogs.txt", consoleLogs.join(`\n`));
        return;
      },
      afterAll: (store: Store, artificer) => {
        // store.page.browser().close();
        sleep(1000)
        return;
      },
    },
  );
