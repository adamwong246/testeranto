// import React, { Component } from "react";
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

class Suite extends BaseSuite<any, any, any> {
  async setup(bundlePath: string) {
    console.log("setup");
    return {
      page: await (
        await puppeteer.launch({
          headless: true,
          executablePath:
            "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
        })
      ).newPage(),
      jsbundle: esbuild.buildSync({
        entryPoints: [bundlePath],
        bundle: true,
        minify: true,
        format: "esm",
        target: ["esnext"],
        write: false,
      }).outputFiles[0].text,
    };
  }
}

class Given extends BaseGiven<any, any, any> {
  async givenThat(
    [jsFilePath],
    htmlTemplate: [string, (string) => string],
    { jsbundle, page }
  ): Promise<any> {
    await page.setContent();
  }

  async teardown(page: Page, ndx: number): Promise<any> {
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

class Then extends BaseThen<any> {
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
    console.log("mark11");
    super(
      testImplementation,
      testSpecification,
      thing,
      (s, g, c) => {
        console.log("mark12");
        return new Suite(s, g, c);
      },
      (n, w, t, f) => new Given(n, w, t, f),
      (s, o) => new When(s, o),
      (s, o) => new Then(s, o),
      (f, g, c, cb) => new Check(f, g, c, cb)
    );
  }
}
