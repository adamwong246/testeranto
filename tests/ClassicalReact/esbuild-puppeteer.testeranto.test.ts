// This file defines the test of a client-side webpack

// import { fs, createFsFromVolume, Volume } from "memfs";
import React from "react";
import puppeteer, { Page } from "puppeteer";
import esbuild from "esbuild";

// import webpack, { WebpackOptionsDefaulter } from "webpack";
// import webpackConfig from "./webpack.config";
// import path from "path";

const webpacked = "await webpack(webpackConfig)";

// This will be able to remove at webpack v5
// @ts-ignore https://github.com/webpack/webpack/pull/9251
// fs.join = path.join;

async function compile() {
  console.log("mark0");

  // const mfs = createFsFromVolume(new Volume());
  // console.log("mark2");

  const compiler = await esbuild.build({}); //webpack(webpackConfig());
  console.log(compiler);
  // console.log("webpacked", compiler);

  // const compiler = webpack({
  //   output: {
  //     filename: "bundle.js",
  //     path: "/",
  //   },
  // });

  /* @ts-ignore:next-line */
  // compiler.outputFileSystem = new MemoryFs();

  // compiler.outputFileSystem = fs;

  // const outputFileSystem = new webpack.MemoryOutputFileSystem();
  // compiler.outputFileSystem = outputFileSystem;

  console.log("mark4");

  new Promise((resolve, reject) => {
    console.log("mark5");

    // compiler.run((err, stats) => {
    //   console.log("mark10");
    //   if (err) {
    //     console.log("mark6");
    //     console.error(err);
    //     return reject(err);
    //   }

    //   if (stats?.hasErrors() || stats?.hasWarnings()) {
    //     console.log("mark7");
    //     console.error(stats);
    //     return reject(
    //       new Error(
    //         stats.toString({
    //           errorDetails: true,
    //           warnings: true,
    //         })
    //       )
    //     );
    //   }

    // const content = outputFileSystem.readFileSync("...");
    // compiler.close((closeErr) => {
    //   console.log(content);
    //   resolve({ content, stats });
    // });

    /* @ts-ignore:next-line */
    // const result = compiler.outputFileSystem.data["bundle.js"].toString();
    // console.log(result);
    // console.log("mark9");
    // });
  });
}

await compile();

console.log("mark-1");
// process.exit(1);

// const browser = await puppeteer.launch({
//   headless: true,
//   executablePath:
//     "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
// });
// const page = await browser.newPage();

import {
  BaseCheck,
  BaseGiven,
  BaseSuite,
  BaseThen,
  BaseWhen,
  Testeranto,
} from "../../index";

type ISimpleThensForRedux<IThens> = {
  [IThen in keyof IThens]: (
    /* @ts-ignore:next-line */
    ...xtras: IThens[IThen]
  ) => any;
};

export default <ISS, IGS, IWS, ITS, ICheckExtensions>(
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
  return Testeranto<any, any, any, any, ISS, IGS, IWS, ITS, ICheckExtensions>(
    reactComponent,
    tests,
    class ClassicalReactSuite extends BaseSuite<any, any, any> {},

    class ClassicalReactGiven extends BaseGiven<any, any, any> {
      async givenThat(subject: React.ReactElement): Promise<any> {
        // await page.reload();
        // await page.setContent(`<html>
        // <head></head<>
        // ${webpacked}
        // </html>`);
        // return page;
      }
    },

    class ClassicalReactWhen<IStore extends Page> extends BaseWhen<IStore> {
      payload?: any;

      constructor(name: string, actioner: (...any) => any, payload?: any) {
        super(name, (store) => actioner(store));
        this.payload = payload;
      }

      async andWhen(page: IStore) {
        // page.$(do something)
        // return act(() => this.actioner(renderer));
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
