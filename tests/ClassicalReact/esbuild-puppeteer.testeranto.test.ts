import puppeteer, { Page } from "puppeteer";
import esbuild from "esbuild";

import { TesterantoFactory } from "../../src/index";
import { ITestImplementation, ITestSpecification, ITTestShape } from "../../src/testShapes";

type Input = [string, (string) => string];
type TestResource = "never";
type InitialState = unknown;
type WhenShape = any;
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
    {
      beforeAll: async function ([bundlePath, htmlTemplate]: Input): Promise<Subject> {
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
      beforeEach: function (subject: Subject, initialValues: any, testResource: "never"): Promise<Store> {
        return subject.page.setContent(subject.htmlBundle).then(() => {
          return { page: subject.page };
        });
      },
      andWhen: function ({ page }: Store, actioner: any, testResource: "never"): Promise<Selection> {
        return actioner()({ page });
      },
      butThen: async function ({ page }: Store, callback: any, testResource: "never"): Promise<Selection> {
        return { page };
      },
      afterEach: async function ({ page }: Store, ndx: number) {
        await (await page).screenshot({
          path: `./dist/afterEach-${ndx}-screenshot.jpg`,
        });
        return { page };
      }
    }
  )
