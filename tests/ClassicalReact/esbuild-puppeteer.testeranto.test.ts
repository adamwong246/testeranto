import React from "react";
import puppeteer, { Page } from "puppeteer";
import esbuild from "esbuild";

import {
  BaseCheck,
  BaseGiven,
  BaseSuite,
  BaseThen,
  BaseWhen,
  Testeranto,
} from "../../index";

export default async <ISS, IGS, IWS, ITS, ICheckExtensions>(
  reactComponent: typeof React.Component,
  tests: (
    Suite: Record<
      keyof ISS,
      (
        name: string,
        givens: BaseGiven<any, any, any>[],
        checks: BaseCheck<any, any, any>[]
      ) => BaseSuite<any, any, any>
    >,
    Given: Record<
      keyof IGS,
      (
        feature: string,
        whens: BaseWhen<any>[],
        thens: BaseThen<any>[],
        ...xtraArgsForGiven: any //{ [ISuite in keyof IGS]: IGS[ISuite] }[]
      ) => BaseGiven<any, any, any>
    >,
    When: Record<keyof IWS, any>,
    Then: Record<keyof ITS, any>,

    Check: Record<
      keyof ICheckExtensions,
      (
        feature: string,
        callback: (whens, thens) => any,
        ...xtraArgsForGiven: any //{ [ISuite in keyof IGS]: IGS[ISuite] }[]
      ) => BaseCheck<any, any, any>
    >
  ) => BaseSuite<any, any, any>[]
) => {
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

  return Testeranto<any, any, any, any, ISS, IGS, IWS, ITS, ICheckExtensions>(
    reactComponent,
    tests,
    class Suite extends BaseSuite<any, any, any> {},

    class Given extends BaseGiven<any, any, any> {
      async givenThat(subject: React.ReactElement): Promise<any> {
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

      async teardown(subject: any, ndx: number): Promise<any> {
        await page.screenshot({
          path: `./dist/teardown-${ndx}-screenshot.jpg`,
        });
      }
    },

    class ClassicalReactWhen<IStore extends Page> extends BaseWhen<IStore> {
      payload?: any;

      constructor(name: string, actioner: (...any) => any, payload?: any) {
        super(name, (store) => actioner(store));
        this.payload = payload;
      }

      async andWhen(page: IStore) {
        return this.actioner(page);
      }
    },

    class ClassicalReactThen extends BaseThen<any> {
      constructor(name: string, callback: (val: any) => any) {
        super(name, callback);
      }

      async butThen(component) {
        return component;
      }
    },

    class ClassicalReactCheck extends BaseCheck<any, any, any> {
      async checkThat(subject: React.ReactElement): Promise<any> {
        // await page.reload();
        // await page.setContent(`<html>
        // <head></head<>
        // ${webpacked}
        // </html>`);
        // return page;
      }
    }
  );
};
