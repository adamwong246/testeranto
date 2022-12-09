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

type IInput = [string, (string) => string];
type ISubjectStore = { page: Page; htmlBundle: string };
type IWhenShape = any;
type IThenShape = any;
type ISelection = { page: Page };
type IState = void;

export class EsbuildPuppeteerTesteranto<
  ITestShape extends ITTestShape
> extends Testeranto<
  ITestShape,
  IState,
  ISelection,
  ISubjectStore, // store
  ISubjectStore, // subject
  IWhenShape,
  IThenShape,
  never,         // test resource
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
      (s, g, c) => {
        return new (class Suite extends BaseSuite<
          IInput,
          ISubjectStore,
          ISubjectStore,
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
        })(s, g, c);
      },
      (n, f, w, t) =>
        new (class Given extends BaseGiven<
          ISubjectStore,
          {page: Page},
          ISelection,
          IThenShape
        > {
          givenThat(
            subject: ISubjectStore,
            testResourceConfiguration?: any
          ): Promise<{page: Page}> {
            return subject.page.setContent(subject.htmlBundle).then(() => {
              return {page: subject.page};
            });
          }

          async teardown({page}: {page: Page}, ndx: number) {
            (await page).screenshot({
              path: `./dist/teardown-${ndx}-screenshot.jpg`,
            });

            return page;
          }
        })(
          n,
          f,
          w,
          t
        ),
      (s, o) =>
        new (class When<IStore extends Page> extends BaseWhen<
          IStore,
          any,
          any
        > {
          async andWhen(page: IStore) {
            return this.actioner(page);
          }
        })(s, o),
      (s, o) =>
        new (class Then extends BaseThen<ISubjectStore, ISubjectStore, IThenShape> {
          butThen(store: any, testResourceConfiguration?: any): ISubjectStore {
            return store;
          }
        })(s, o),
      (n, f, cb, w, t) =>
        new (class Check extends BaseCheck<ISubjectStore, any, ISelection, IThenShape> {
          async checkThat(
            { page, htmlBundle }: ISubjectStore,
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
        })(n, f, cb, w, t)
    );
  }
}
