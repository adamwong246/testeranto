import puppeteer, { Page } from "puppeteer";
import esbuild from "esbuild";

import { Testeranto } from "testeranto";
import { ITestImplementation, ITestSpecification, ITTestShape } from "testeranto";

type Input = [string, (string) => string, any];
type InitialState = unknown;
type WhenShape = any;
type ThenShape = any;
type Selection = { page: Page };
type State = void;
type Store = { page: Page };
type Subject = { page: Page; htmlBundle: string };

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
  testSpecifications: ITestSpecification<ITestShape, IFeatureShape>,
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
      beforeEach: function (subject: Subject): Promise<Store> {
        return subject.page.setContent(subject.htmlBundle).then(() => {
          return { page: subject.page };
        });
      },
      andWhen: function ({ page }: Store, actioner): Promise<Selection> {
        return actioner()({ page });
      },
      butThen: async function ({ page }: Store): Promise<Selection> {
        return { page };
      },
      afterEach: async function ({ page }: Store, ndx: number, saveTestArtifact) {
        saveTestArtifact.png(
          await (await page).screenshot()
        );
        return { page };
      }
    }
  )
