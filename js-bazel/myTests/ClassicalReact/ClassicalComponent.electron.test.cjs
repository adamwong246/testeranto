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

// myTests/ClassicalReact/ClassicalComponent.electron.test.ts
var ClassicalComponent_electron_test_exports = {};
__export(ClassicalComponent_electron_test_exports, {
  ClassicalComponentBrowserTesteranto: () => ClassicalComponentBrowserTesteranto
});
module.exports = __toCommonJS(ClassicalComponent_electron_test_exports);
var import_chai = require("chai");

// myTests/ClassicalReact/browser.testeranto.test.mts
var import_stream = require("stream");
var import_testeranto = __toESM(require("testeranto"), 1);
var BrowserTesteranto = (testImplementations, testSpecifications, testInput, nameKey) => (0, import_testeranto.default)(
  testInput,
  testSpecifications,
  testImplementations,
  {
    beforeAll: async function([bundlePath, htmlTemplate], artificer) {
      artificer("./before.txt", "hello artificer");
      const browser = await await puppeteer.launch({
        headless: true,
        executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
      });
      return {
        browser,
        htmlBundle: htmlTemplate(
          esbuild.buildSync({
            entryPoints: [bundlePath],
            bundle: true,
            minify: true,
            format: "esm",
            target: ["esnext"],
            write: false
          }).outputFiles[0].text
        )
      };
    },
    beforeEach: async (subject, ndx, testRsource, artificer) => {
      const page = await subject.browser.newPage();
      const recorder = new PuppeteerScreenRecorder(page, {
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
      page.close();
      artificer("./afterEachScreenshot.png", await (await page).screenshot());
      artificer("./afterEachLogs.txt", consoleLogs.join(`
`));
      return;
    },
    afterAll: (store, artificer) => {
      store.page.browser().close();
      return;
    }
  },
  nameKey
);

// myTests/ClassicalReact/ClassicalComponent.tsx
var import_react = __toESM(require("react"));
var ClassicalComponent = class extends import_react.default.Component {
  constructor(props) {
    console.log("hello world!");
    super(props);
    this.state = {
      count: 0
    };
  }
  componentDidMount() {
    console.info("componentDidMount");
  }
  render() {
    return /* @__PURE__ */ import_react.default.createElement("div", { style: { border: "3px solid green" } }, /* @__PURE__ */ import_react.default.createElement("h1", null, "Hello Marcus"), /* @__PURE__ */ import_react.default.createElement("pre", { id: "theProps" }, JSON.stringify(this.props)), /* @__PURE__ */ import_react.default.createElement("p", null, "foo: ", this.props.foo), /* @__PURE__ */ import_react.default.createElement("pre", { id: "theState" }, JSON.stringify(this.state)), /* @__PURE__ */ import_react.default.createElement("p", null, "count: ", this.state.count, " times"), /* @__PURE__ */ import_react.default.createElement("button", { id: "theButton", onClick: async () => {
      this.setState({ count: this.state.count + 1 });
    } }, "Click"));
  }
};

// myTests/ClassicalReact/ClassicalComponent.electron.test.ts
var ClassicalComponentBrowserTesteranto = BrowserTesteranto(
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
      IClickTheButton: () => async ({ page }) => await page.click("#theButton")
    },
    Thens: {
      IAmAGenius: () => async ({ page, consoleLogs }) => {
      },
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
  (Suite, Given, When, Then, Check) => {
    return [
      Suite.Default(
        "a classical react component, bundled with esbuild and tested with puppeteer",
        [
          Given.AnEmptyState(
            [],
            [],
            [Then.ThePropsIs({}), Then.TheStatusIs({ count: 0 })]
          ),
          Given.AnEmptyState(
            [],
            [When.IClickTheButton()],
            [Then.ThePropsIs({}), Then.TheStatusIs({ count: 1 })]
          ),
          Given.AnEmptyState(
            [],
            [When.IClickTheButton()],
            [Then.ThePropsIs({}), Then.TheStatusIs({ count: 1 })]
          ),
          Given.AnEmptyState(
            [`hello`],
            [
              When.IClickTheButton(),
              When.IClickTheButton(),
              When.IClickTheButton()
            ],
            [Then.TheStatusIs({ count: 3 })]
          ),
          Given.AnEmptyState(
            [`hello`],
            [
              When.IClickTheButton(),
              When.IClickTheButton(),
              When.IClickTheButton(),
              When.IClickTheButton(),
              When.IClickTheButton(),
              When.IClickTheButton()
            ],
            [Then.TheStatusIs({ count: 6 }), Then.IAmAGenius()]
          )
        ],
        []
      )
    ];
  },
  [
    "./myTests/ClassicalReact/index.ts",
    (jsbundle) => `
            <!DOCTYPE html>
    <html lang="en">
    <head>
      <script type="module">${jsbundle}<\/script>
    </head>

    <body>
      <div id="root">
      </div>
    </body>

    <footer></footer>

    </html>
`,
    ClassicalComponent
  ],
  "ClassicalComponent"
);
