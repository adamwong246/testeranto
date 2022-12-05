import React from "react";
import puppeteer, { Page } from "puppeteer";
import esbuild from "esbuild";

import {
  BaseCheck,
  BaseGiven,
  BaseSuite,
  BaseThen,
  BaseWhen,
  ITestImplementation,
  Testeranto,
} from "../../index";

class Suite extends BaseSuite<any, any, any> {}

class Given extends BaseGiven<any, any, any> {
  async givenThat(subject: React.ReactElement): Promise<any> {
    const script = esbuild.buildSync({
      entryPoints: ["./tests/ClassicalReact/index.ts"],
      bundle: true,
      minify: true,
      format: "esm",
      target: ["esnext"],
      write: false,
    });

    const browser = await puppeteer.launch({
      headless: true,
      executablePath:
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    });
    const page = await browser.newPage();

    await page.setContent(`
<!DOCTYPE html>
<html lang="en">
<head>
  <script type="module">${script.outputFiles[0].text}</script>
</head>

<body>
  <div id="root">
  </div>
</body>

<footer></footer>

</html>
        `);
    return page;
  }

  async teardown(page: Page, ndx: number): Promise<any> {
    await page.screenshot({
      path: `./dist/teardown-${ndx}-screenshot.jpg`,
    });
  }
}

class When<IStore extends Page> extends BaseWhen<IStore> {
  payload?: any;

  constructor(name: string, actioner: (...any) => any, payload?: any) {
    super(name, (store) => actioner(store));
    this.payload = payload;
  }

  async andWhen(page: IStore) {
    return this.actioner(page);
  }
}

class Then extends BaseThen<any> {
  constructor(name: string, callback: (val: any) => any) {
    super(name, callback);
  }

  async butThen(component) {
    return component;
  }
}

class Check extends BaseCheck<any, any, any> {
  async checkThat(subject: React.ReactElement): Promise<any> {
    // await page.reload();
    // await page.setContent(`<html>
    // <head></head<>
    // ${webpacked}
    // </html>`);
    // return page;
  }
}

type IAction = any;

export class EsbuildPuppeteerTesteranto<ITestShape> extends Testeranto<
  ITestShape,
  any,
  any,
  any,
  any,
  IAction
> {
  constructor(
    testImplementation: ITestImplementation<any, any, IAction>,
    testSpecification,
    thing
  ) {
    super(
      testImplementation,
      testSpecification,
      thing,
      (s, g, c) => new Suite(s, g, c),
      (f, w, t) => new Given(f, w, t),
      (s, o) => new When(s, o),
      (s, o) => new Then(s, o),
      (f, g, c, cb) => new Check(f, g, c, cb)
    );
  }
}
