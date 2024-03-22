"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/google.puppeteer.testeranto.test.ts
var google_puppeteer_testeranto_test_exports = {};
__export(google_puppeteer_testeranto_test_exports, {
  default: () => google_puppeteer_testeranto_test_default
});
module.exports = __toCommonJS(google_puppeteer_testeranto_test_exports);
var import_chai = require("chai");

// myTests/puppeteer.testeranto.test.ts
var import_html = __toESM(require("html"));
var import_core_node = __toESM(require("testeranto/src/core-node"));
var import_stream = require("stream");
var import_puppeteer = __toESM(require("puppeteer"));
var import_puppeteer_screen_recorder = require("puppeteer-screen-recorder");
var PuppeteerTesteranto = (input, testImplementations, testSpecifications) => (0, import_core_node.default)(
  input,
  testSpecifications,
  testImplementations,
  {
    beforeAll: async (input2) => {
      return await import_puppeteer.default.launch({
        // slowMo: input?.slowMo || 0,
        // headless: input.headless,
        // devtools: true,
        args: ["--disable-features=site-per-process"],
        executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
      });
    },
    beforeEach: async (browser, ndx, testRsource, artificer) => {
      const page = await (await browser.createIncognitoBrowserContext()).newPage();
      await page.setUserAgent(
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36"
      );
      const recorder = new import_puppeteer_screen_recorder.PuppeteerScreenRecorder(page, {
        followNewTab: false
        // fps: 25,
        // videoFrame: {
        //   width: 1600,
        //   height: 1200,
        // },
        // videoCrf: 18,
        // videoCodec: 'libx264',
        // videoPreset: 'ultrafast',
        // videoBitrate: 1000,
        // autopad: {
        //   color: 'black',
        // },
        // aspectRatio: '4:3',
      });
      const consoleLogs = [];
      const pageErrors = [];
      const urlLog = [];
      await page.setRequestInterception(true);
      page.on(
        "console",
        (message) => consoleLogs.push(
          `${message.type().substr(0, 3).toUpperCase()}			${message.text()}`
        )
      ).on("pageerror", ({ message }) => pageErrors.push(message)).on("response", async (response) => {
      }).on("requestfailed", (request) => {
      }).on("request", (request) => {
        request.continue();
      }).on("framenavigated", (frame) => {
        urlLog.push(`${Date.now()}	${frame.url()}`);
      });
      const pipeStream = new import_stream.PassThrough();
      artificer("./screencap.mp4", pipeStream);
      await recorder.startStream(pipeStream);
      return {
        page,
        recorder,
        consoleLogs,
        pageErrors,
        pipeStream,
        urlLog,
        applications: [],
        sfIds: []
      };
    },
    andWhen: async (store, actioner) => {
      return actioner()(store);
    },
    butThen: async function(store) {
      return store;
    },
    afterEach: async function(store, ndx, artificer) {
      await store.recorder.stop();
      store.pipeStream.end();
      artificer(
        "./afterEachScreenshot.png",
        await (await store.page).screenshot({ fullPage: true })
      );
      artificer("./consoleLogs.txt", store.consoleLogs.join(`
`));
      artificer("./pageErrors.txt", store.pageErrors.join(`
`));
      artificer("./urls.txt", store.urlLog.join(`
`));
      artificer(
        "./afterEach.html",
        import_html.default.prettyPrint(await store.page.content(), { indent_size: 2 })
      );
      return store;
    },
    afterAll: async (store, artificer) => {
      await store.page.browser().close();
      return;
    }
  }
);

// src/google.puppeteer.testeranto.test.ts
var google_puppeteer_testeranto_test_default = PuppeteerTesteranto(
  {
    headless: true,
    slowMo: 1
  },
  {
    Suites: {
      Default: "some default Suite."
    },
    Givens: {
      AnEmptyState: async () => {
      }
    },
    Whens: {
      IGoto: (url) => async (store) => {
        await store.page.goto(url);
      }
    },
    Thens: {
      WaitForXPath: (someString) => async ({ page }) => {
        try {
          await page.waitForXPath(`//*[text()="${someString}"]`, { timeout: 1e3 });
          return [import_chai.assert.equal, true, false];
        } catch (e) {
          return [import_chai.assert.equal, true, true];
        }
      }
    },
    Checks: {
      AnEmptyState: () => {
        return;
      }
    }
  },
  (Suite, Given, When, Then, Check) => {
    return [
      Suite.Default(
        "Testing the AOF portal.",
        {
          "test0": Given.AnEmptyState(
            [],
            [
              When.IGoto("https://www.google.com")
            ],
            [
              Then.WaitForXPath(`//*[@value="I'm Feeling Lucky"]`)
            ]
          )
        },
        []
      )
    ];
  }
);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
