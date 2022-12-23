import { assert } from "chai";
import http from "http";
import puppeteer, { Page } from "puppeteer";
import esbuild from "esbuild";

import { TesterantoFactory } from "../../index";
import { ITestImplementation, ITestSpecification, ITTestShape } from "../../src/testShapes";

type Input = [string, (string) => string];
type TestResource = "never";


type InitialState = unknown;
// type Subject = () => http.Server;
// type Store = http.Server;
// type Selection = { page: Page };
type WhenShape = any; //[url: string, paylaod: string];
type ThenShape = any;
type Selection = { page: Page };
type State = void;
type Store = { page: Page };
type Subject = { page: Page; htmlBundle: string };

export const EsbuildPuppeteerTesteranto = <
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
    "na",
    async ([bundlePath, htmlTemplate]: Input) => {
      return {
        page: await (
          await puppeteer.launch({
            headless: true,
            executablePath:
              "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
          })
        ).newPage(),
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
    async (subject) => {
      return subject.page.setContent(subject.htmlBundle).then(() => {
        return { page: subject.page };
      });
    },
    // andWhen  
    async ({ page }, actioner, testResource) => {
      return actioner()({ page });
    },
    // butThen
    async ({ page }, callback, testResource) => {
      return { page };
    },
    (t) => t,
    async ({ page }, ndx) => {
      await (await page).screenshot({
        path: `./dist/teardown-${ndx}-screenshot.jpg`,
      });
      return { page };
    },
    (actioner) => actioner,
    
  )
