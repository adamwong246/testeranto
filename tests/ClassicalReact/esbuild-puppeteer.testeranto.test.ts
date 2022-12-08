import puppeteer, { Page } from "puppeteer";
import esbuild from "esbuild";

import {
  BaseCheck,
  BaseGiven,
  BaseSuite,
  BaseThen,
  BaseWhen,
  ITestImplementation,
  ITTestShape,
  Testeranto,
} from "../../index";

type IInput = [string, (string) => string];
type ISubjectStore = { page: Page; htmlBundle: string };
type IWhenShape = any;
type IThenShape = any;
type ISelection = { page: Page };

class Given extends BaseGiven<ISubjectStore, any, ISelection, any> {
  async givenThat(
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
}

class When<IStore extends Page> extends BaseWhen<IStore, any, any> {
  async andWhen(page: IStore) {
    return this.actioner(page);
  }
}

class Then extends BaseThen<ISubjectStore, ISubjectStore, any> {
  butThen(store: any, testResourceConfiguration?: any): ISubjectStore {
    return store;
  }
}

class Check extends BaseCheck<ISubjectStore, any, ISelection> {
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
}

export class EsbuildPuppeteerTesteranto<
  ITestShape extends ITTestShape
> extends Testeranto<
  ITestShape,
  ISubjectStore, // state
  ISelection, // selection
  ISubjectStore, // store
  ISubjectStore, // subject
  IWhenShape,
  IThenShape,
  any, // test resource
  IInput
> {
  constructor(
    testImplementation: ITestImplementation<
      ISubjectStore, // state
      ISelection, // selection
      IWhenShape,
      IThenShape,
      ITestShape
    >,
    testSpecification,
    thing: IInput
  ) {
    super(
      testImplementation,
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
      (n, w, t, f) =>
        new Given(
          n,
          w,
          t
          // f
        ),
      (s, o) => new When(s, o),
      (s, o) => new Then(s, o),
      (f, g, c, cb) => new Check(f, g, c, cb)
    );
  }
}
