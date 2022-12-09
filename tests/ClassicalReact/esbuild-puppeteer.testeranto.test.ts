import puppeteer, { Page } from "puppeteer";
import esbuild from "esbuild";

import {
  BaseCheck,
  BaseGiven,
  BaseSuite,
  BaseThen,
  BaseWhen,
  ITestImplementation,
  ITestSpecification,
  ITTestShape,
  Testeranto,
} from "../../index";

type ITestResource = never;
type IInput = [string, (string) => string];

type IWhenShape = any;
type IThenShape = any;
type ISelection = { page: Page };
type IState = void;
type IStore = { page: Page };
type ISubject = { page: Page; htmlBundle: string };

export class EsbuildPuppeteerTesteranto<
  ITestShape extends ITTestShape
> extends Testeranto<
  ITestShape,
  IState,
  ISelection,
  IStore,
  ISubject,
  IWhenShape,
  IThenShape,
  ITestResource,
  IInput
> {
  constructor(
    testImplementation: ITestImplementation<
      IState,
      ISelection,
      IWhenShape,
      IThenShape,
      ITestShape
    >,
    testSpecification: ITestSpecification<ITestShape>,
    thing: IInput
  ) {
    super(
      testImplementation,
      /* @ts-ignore:next-line */
      testSpecification,
      thing,
      class Suite extends BaseSuite<
        IInput,
        ISubject,
        IStore,
        ISelection,
        IThenShape
      > {
        async setup([bundlePath, htmlTemplate]: IInput) {
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
        }
      },
      class Given extends BaseGiven<
        ISubject,
        IStore,
        ISelection,
        IThenShape
      > {
        givenThat(
          subject: ISubject,
          testResourceConfiguration?: any
        ): Promise<{ page: Page }> {
          return subject.page.setContent(subject.htmlBundle).then(() => {
            return { page: subject.page };
          });
        }

        async teardown({ page }: { page: Page }, ndx: number) {
          await (await page).screenshot({
            path: `./dist/teardown-${ndx}-screenshot.jpg`,
          });

          return page;
        }
      },
      class When<IStore extends Page> extends BaseWhen<
        IStore,
        any,
        any
      > {
        async andWhen(page: IStore) {
          return this.actioner(page);
        }
      },
      class Then extends BaseThen<ISelection, ISubject, IThenShape> {
        butThen(store: any, testResourceConfiguration?: any): ISubject {
          return store;
        }
      },
      class Check extends BaseCheck<ISubject, IStore, ISelection, IThenShape> {
        async checkThat(
          { page, htmlBundle }: ISubject,
          testResourceConfiguration?: any
        ) {
          await page.setContent(htmlBundle);
          return { page };
        }

        async teardown({ page }, ndx: number): Promise<any> {
          await page.screenshot({
            path: `./dist/teardown-${ndx}-screenshot.jpg`,
          });
        }
      }
    );
  }
}
