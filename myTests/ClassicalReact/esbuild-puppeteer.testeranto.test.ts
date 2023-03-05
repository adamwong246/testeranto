import puppeteer, { Browser, Page } from "puppeteer";
import esbuild from "esbuild";
import { PuppeteerScreenRecorder } from 'puppeteer-screen-recorder';
import { PassThrough } from "stream";
import { Testeranto } from "testeranto";
import { ITestImplementation, ITestSpecification, ITTestShape } from "testeranto";

type Input = [string, (string) => string, any];
type InitialState = unknown;
type WhenShape = any;
type ThenShape = any;
type Selection = { page: Page };

type Store = {
  page: Page;
  recorder: PuppeteerScreenRecorder;
  consoleLogs: string[];
};

type Subject = {
  browser: Browser;
  htmlBundle: string
};

export const EsbuildPuppeteerTesteranto = <
  ITestShape extends ITTestShape,
  IFeatureShape
>(
  testImplementations: ITestImplementation<
    InitialState,
    Selection,
    WhenShape,
    ThenShape,
    ITestShape
  >,
  testSpecifications: ITestSpecification<
    ITestShape,
    IFeatureShape
  >,
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
    InitialState,
    IFeatureShape
  >(
    testInput,
    testSpecifications,
    testImplementations,
    { ports: 0 },
    {
      beforeAll: async function ([bundlePath, htmlTemplate]: Input, artificer): Promise<Subject> {

        artificer("./before.txt", "hello artificer");

        const browser = await (
          await puppeteer.launch({
            headless: true,
            executablePath:
              "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
          })
        );

        return {
          browser,
          htmlBundle: htmlTemplate(
            esbuild.buildSync({
              entryPoints: [bundlePath],
              bundle: true,
              minify: true,
              format: "esm",
              target: ["esnext"],
              write: false,
            }).outputFiles[0].text
          ),
        };
      },
      beforeEach: async (subject: Subject, ndx, testRsource, artificer): Promise<Store> => {
        const page = await subject.browser.newPage();

        const recorder = new PuppeteerScreenRecorder(page, {
          followNewTab: false,
          fps: 25,
          videoFrame: {
            width: 1024,
            height: 768,
          },
          videoCrf: 18,
          videoCodec: 'libx264',
          videoPreset: 'ultrafast',
          videoBitrate: 1000,
          autopad: {
            color: 'black',
          },
          aspectRatio: '4:3',
        });

        const consoleLogs: string[] = [];
        await page.setRequestInterception(true);

        page
          .on('console', message =>
            consoleLogs.push(`${message.type().substr(0, 3).toUpperCase()}\t\t\t${message.text()}`))
          .on('pageerror', ({ message }) => consoleLogs.push(message))
          .on('response', async (response) => {
            consoleLogs.push(`Res\t\t\t${response.status()} ${response.url()} ${JSON.stringify(response.request().headers())}`);
            // response.continue();
          }).on('requestfailed', request =>
            consoleLogs.push(`REQ_FAIL\t${request.failure().errorText} ${request.url()}`))
          .on('request', (request) => {
            consoleLogs.push("REQUEST\t", request)
            request.continue();
          });

        const pipeStream = new PassThrough();

        artificer("./screencap.mp4", pipeStream);

        return page.setContent(subject.htmlBundle).then(async () => {
          await recorder.startStream(pipeStream);
          artificer("./beforeEachScreenshot.png", await ((await page).screenshot()));
          return {
            page,
            recorder: recorder,
            consoleLogs,
          };
        });
      },
      andWhen: function ({ page }: Store, actioner): Promise<Selection> {
        return actioner()({ page });
      },
      butThen: async function ({ page }: Store): Promise<Selection> {
        return { page };
      },
      afterEach: async function ({
        page,
        recorder,
        consoleLogs,
      }: Store, ndx, artificer) {
        recorder.stop();
        console.log("afterEach", artificer)
        artificer("./afterEachScreenshot.png", await ((await page).screenshot()));
        artificer("./afterEachLogs.txt", consoleLogs.join(`\n`));
      },
      afterAll: (store, artificer) => {
        // console.log("afterAll")
      }
    }
  )
