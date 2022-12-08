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
type ISubject = { page: Page; htmlBundle: string };
type IStore = { page: Page; htmlbundle: string };
type IAction = any;
type ISelection = { page: Page };

class Suite extends BaseSuite<IInput, ISubject, IStore, ISelection> {
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
}

class Given extends BaseGiven<ISubject, any, ISelection> {
  async givenThat(
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

class When<IStore extends Page> extends BaseWhen<IStore> {
  async andWhen(page: IStore) {
    return this.actioner(page);
  }
}

class Then extends BaseThen<IStore, IStore> {
  butThen(store: any, testResourceConfiguration?: any): IStore {
    return store;
  }
}

class Check extends BaseCheck<ISubject, any, ISelection> {
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

export class EsbuildPuppeteerTesteranto<ITestShape extends ITTestShape> extends Testeranto<
  ITestShape,
  IStore,
  IStore,
  IStore,
  IStore,
  ISelection,
  any,
  any,
  IInput
> {
  constructor(
    testImplementation: ITestImplementation<
      any,
      ISelection,
      IAction,
      any,
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
        return new Suite(s, g, c);
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
