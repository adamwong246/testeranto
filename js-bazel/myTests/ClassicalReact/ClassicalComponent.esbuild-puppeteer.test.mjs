// myTests/ClassicalReact/ClassicalComponent.esbuild-puppeteer.test.ts
import { assert } from "chai";

// myTests/ClassicalReact/esbuild-puppeteer.testeranto.test.ts
import puppeteer from "puppeteer";
import esbuild from "esbuild";
import { PuppeteerScreenRecorder } from "puppeteer-screen-recorder";
import { PassThrough } from "stream";
import Testeranto from "testeranto";
var EsbuildPuppeteerTesteranto = (testImplementations, testSpecifications, testInput, nameKey) => Testeranto(
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
      page.on("console", (message) => consoleLogs.push(`${message.type().substr(0, 3).toUpperCase()}			${message.text()}`)).on("pageerror", ({ message }) => consoleLogs.push(message)).on("response", async (response) => {
        consoleLogs.push(`Res			${response.status()} ${response.url()} ${JSON.stringify(response.request().headers())}`);
      }).on("requestfailed", (request) => consoleLogs.push(`REQ_FAIL	${request.failure().errorText} ${request.url()}`)).on("request", (request) => {
        consoleLogs.push("REQUEST	", request);
        request.continue();
      });
      const pipeStream = new PassThrough();
      artificer("./screencap.mp4", pipeStream);
      return page.setContent(subject.htmlBundle).then(async () => {
        await recorder.startStream(pipeStream);
        artificer("./beforeEachScreenshot.png", await (await page).screenshot());
        return {
          page,
          recorder,
          consoleLogs
        };
      });
    },
    andWhen: function({ page }, actioner) {
      return actioner()({ page });
    },
    butThen: async function({ page }) {
      return { page };
    },
    afterEach: async function({
      page,
      recorder,
      consoleLogs
    }, ndx, artificer) {
      recorder.stop();
      console.log("afterEach", artificer);
      artificer("./afterEachScreenshot.png", await (await page).screenshot());
      artificer("./afterEachLogs.txt", consoleLogs.join(`
`));
    },
    afterAll: (store, artificer) => {
    }
  },
  nameKey
);

// myTests/ClassicalReact/ClassicalComponent.tsx
import React from "react";
var ClassicalComponent = class extends React.Component {
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
    return /* @__PURE__ */ React.createElement("div", { style: { border: "3px solid green" } }, /* @__PURE__ */ React.createElement("h1", null, "Hello Marcus"), /* @__PURE__ */ React.createElement("pre", { id: "theProps" }, JSON.stringify(this.props)), /* @__PURE__ */ React.createElement("p", null, "foo: ", this.props.foo), /* @__PURE__ */ React.createElement("pre", { id: "theState" }, JSON.stringify(this.state)), /* @__PURE__ */ React.createElement("p", null, "count: ", this.state.count, " times"), /* @__PURE__ */ React.createElement("button", { id: "theButton", onClick: async () => {
      this.setState({ count: this.state.count + 1 });
    } }, "Click"));
  }
};

// myTests/ClassicalReact/ClassicalComponent.esbuild-puppeteer.test.ts
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
      IClickTheButton: () => async ({ page }) => await page.click("#theButton")
    },
    Thens: {
      IAmAGenius: () => async ({ page, consoleLogs }) => {
      },
      ThePropsIs: (expectation) => async ({ page }) => {
        assert.deepEqual(
          await page.$eval("#theProps", (el) => el.innerHTML),
          JSON.stringify(expectation)
        );
      },
      TheStatusIs: (expectation) => async ({ page }) => assert.deepEqual(
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
            [
              Then.ThePropsIs({}),
              Then.TheStatusIs({ count: 0 })
            ]
          ),
          Given.AnEmptyState(
            [],
            [When.IClickTheButton()],
            [
              Then.ThePropsIs({}),
              Then.TheStatusIs({ count: 1 })
            ]
          ),
          Given.AnEmptyState(
            [],
            [When.IClickTheButton()],
            [
              Then.ThePropsIs({}),
              Then.TheStatusIs({ count: 1 })
            ]
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
            [
              Then.TheStatusIs({ count: 66 }),
              Then.IAmAGenius()
            ]
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
      <script type="module">${jsbundle}</script>
    </head>

    <body>
      <div id="root">
      </div>
    </body>

    <footer></footer>

    </html>
`,
    ClassicalComponent
  ]
);
export {
  ClassicalComponentEsbuildPuppeteerTesteranto
};
