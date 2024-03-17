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

// src/ClassicalComponent.esbuild-puppeteer.test.ts
var ClassicalComponent_esbuild_puppeteer_test_exports = {};
__export(ClassicalComponent_esbuild_puppeteer_test_exports, {
  ClassicalComponentEsbuildPuppeteerTesteranto: () => ClassicalComponentEsbuildPuppeteerTesteranto
});
module.exports = __toCommonJS(ClassicalComponent_esbuild_puppeteer_test_exports);
var import_chai = require("chai");

// myTests/esbuild-puppeteer.testeranto.test.ts
var import_fs = __toESM(require("fs"));
var import_puppeteer = __toESM(require("puppeteer"));
var import_puppeteer_screen_recorder = require("puppeteer-screen-recorder");
var import_stream = require("stream");
var import_core_node = __toESM(require("testeranto/src/core-node"));
var htmlTemplate = (jsbundle) => `
<!DOCTYPE html><html lang="en">
  <head>
    <script type="module" src="./ClassicalComponent">
      ${jsbundle}
    </script>
    <script type="module">
      import { LaunchClassicalComponent } from "ClassicalComponent";
      LaunchClassicalComponent();
    </script>
  </head>

  <body>
    <h2>hello esbuild-puppeteer.testeranto</h2>
    <div id="root">
    </div>
  </body>

  <footer></footer>
</html>`;
var EsbuildPuppeteerTesteranto = (testImplementations, testSpecifications, testInput) => (0, import_core_node.default)(
  testInput,
  testSpecifications,
  testImplementations,
  {
    beforeAll: async function(prebuilt, artificer) {
      const browser = await await import_puppeteer.default.launch({
        headless: false,
        devtools: true,
        executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
      });
      return new Promise((res, rej) => {
        import_fs.default.readFile(`./js-bazel/` + testInput, "utf8", (err, data) => {
          if (err) {
            console.error(err);
            return;
          }
          console.log(data);
          res({
            browser,
            htmlBundle: htmlTemplate(
              data
            )
          });
        });
      });
    },
    beforeEach: async (subject, ndx, testResource, artificer) => {
      const page = await subject.browser.newPage();
      const recorder = new import_puppeteer_screen_recorder.PuppeteerScreenRecorder(page, {
        followNewTab: false,
        fps: 25,
        videoFrame: {
          width: 1024,
          height: 768
        },
        videoCrf: 18,
        videoCodec: "libx264",
        videoPreset: "ultrafast",
        videoBitrate: 1e3,
        autopad: {
          color: "black"
        },
        aspectRatio: "4:3"
      });
      const consoleLogs = [];
      await page.setRequestInterception(true);
      page.on(
        "console",
        (message) => consoleLogs.push(
          `${message.type().substr(0, 3).toUpperCase()}			${message.text()}`
        )
      ).on("pageerror", ({ message }) => consoleLogs.push(message)).on("response", async (response) => {
        consoleLogs.push(
          `Res			${response.status()} ${response.url()} ${JSON.stringify(
            response.request().headers()
          )}`
        );
      }).on(
        "requestfailed",
        (request) => consoleLogs.push(
          `REQ_FAIL	${request.failure().errorText} ${request.url()}`
        )
      ).on("request", (request) => {
        consoleLogs.push("REQUEST	", request);
        request.continue();
      });
      const pipeStream = new import_stream.PassThrough();
      artificer("./screencap.mp4", pipeStream);
      return page.setContent(subject.htmlBundle).then(async () => {
        await recorder.startStream(pipeStream);
        artificer(
          "./beforeEachScreenshot.png",
          await (await page).screenshot()
        );
        return {
          page,
          recorder,
          consoleLogs,
          pipeStream
        };
      });
    },
    andWhen: function({ page }, actioner) {
      return actioner()({ page });
    },
    butThen: async function({ page }) {
      return { page };
    },
    afterEach: async function({ page, recorder, consoleLogs, pipeStream }, ndx, artificer) {
      await recorder.stop();
      pipeStream.end();
      artificer("./afterEachScreenshot.png", await (await page).screenshot());
      artificer("./afterEachLogs.txt", consoleLogs.join(`
`));
      return;
    },
    afterAll: (store, artificer) => {
      store.page.browser().close();
      return;
    }
  }
);

// src/ClassicalComponent.test.ts
var testSpecification = (Suite, Given, When, Then, Check) => {
  return [
    Suite.Default(
      "a classical react component",
      {
        "test0": Given.AnEmptyState(
          ["test"],
          [],
          [
            Then.ThePropsIs({ children: [] }),
            Then.TheStatusIs({ count: 0 })
          ]
        ),
        "test1": Given.AnEmptyState(
          ["test"],
          [When.IClickTheButton()],
          [Then.ThePropsIs({ children: [] }), Then.TheStatusIs({ count: 1 })]
        ),
        "test2": Given.AnEmptyState(
          ["test"],
          [
            When.IClickTheButton(),
            When.IClickTheButton(),
            When.IClickTheButton(),
            When.IClickTheButton(),
            When.IClickTheButton(),
            When.IClickTheButton()
          ],
          [Then.TheStatusIs({ count: 6 })]
        ),
        "test3": Given.AnEmptyState(
          ["test"],
          [
            When.IClickTheButton(),
            When.IClickTheButton()
          ],
          [Then.TheStatusIs({ count: 2 })]
        )
      },
      []
    )
  ];
};

// src/ClassicalComponent.esbuild-puppeteer.test.ts
var ClassicalComponentEsbuildPuppeteerTesteranto = EsbuildPuppeteerTesteranto(
  {
    Suites: {
      Default: "some default Suite"
    },
    Givens: {
      AnEmptyState: () => {
        return;
      }
    },
    Whens: {
      IClickTheButton: () => async ({ page }) => {
        await page.click("#theButton");
      }
    },
    Thens: {
      ThePropsIs: (expectation) => async ({ page }) => {
        import_chai.assert.deepEqual(
          await page.$eval("#theProps", (el) => el.innerHTML),
          JSON.stringify(expectation)
        );
      },
      TheStatusIs: (expectation) => async ({ page }) => import_chai.assert.deepEqual(
        await page.$eval("#theState", (el) => el.innerHTML),
        JSON.stringify(expectation)
      )
    },
    Checks: {
      AnEmptyState: () => {
        return {};
      }
    }
  },
  testSpecification,
  "src/ClassicalComponent.js"
);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ClassicalComponentEsbuildPuppeteerTesteranto
});
