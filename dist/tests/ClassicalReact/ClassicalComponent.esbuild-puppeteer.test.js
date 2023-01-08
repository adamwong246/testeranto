// tests/ClassicalReact/ClassicalComponent.esbuild-puppeteer.test.ts
import { assert } from "chai";
import { features } from "/Users/adam/Code/kokomoBay/dist/tests/testerantoFeatures.test.js";

// tests/ClassicalReact/esbuild-puppeteer.testeranto.test.ts
import puppeteer from "puppeteer";
import esbuild from "esbuild";
import { Testeranto } from "testeranto";
var EsbuildPuppeteerTesteranto = (testImplementations, testSpecifications, testInput) => Testeranto(
  testInput,
  testSpecifications,
  testImplementations,
  { ports: 0 },
  {
    beforeAll: async function([bundlePath, htmlTemplate]) {
      return {
        page: await (await puppeteer.launch({
          headless: true,
          executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
        })).newPage(),
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
    beforeEach: function(subject) {
      return subject.page.setContent(subject.htmlBundle).then(() => {
        return { page: subject.page };
      });
    },
    andWhen: function({ page }, actioner) {
      return actioner()({ page });
    },
    butThen: async function({ page }) {
      return { page };
    },
    afterEach: async function({ page }, ndx, saveTestArtifact) {
      saveTestArtifact.png(
        await (await page).screenshot()
      );
      return { page };
    }
  }
);

// tests/ClassicalReact/ClassicalComponent.tsx
import React from "react";
var ClassicalComponent = class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }
  render() {
    return /* @__PURE__ */ React.createElement("div", { style: { border: "3px solid green" } }, /* @__PURE__ */ React.createElement("h1", null, "Hello Classical React"), /* @__PURE__ */ React.createElement("pre", { id: "theProps" }, JSON.stringify(this.props)), /* @__PURE__ */ React.createElement("p", null, "foo: ", this.props.foo), /* @__PURE__ */ React.createElement("pre", { id: "theState" }, JSON.stringify(this.state)), /* @__PURE__ */ React.createElement("p", null, "count: ", this.state.count, " times"), /* @__PURE__ */ React.createElement("button", { id: "theButton", onClick: () => {
      this.setState({ count: this.state.count + 1 });
    } }, "Click"));
  }
};

// tests/ClassicalReact/ClassicalComponent.esbuild-puppeteer.test.ts
var myFeature = features.hello;
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
            [features.hello],
            [
              When.IClickTheButton(),
              When.IClickTheButton(),
              When.IClickTheButton()
            ],
            [Then.TheStatusIs({ count: 3 })]
          ),
          Given.AnEmptyState(
            [features.hello],
            [
              When.IClickTheButton(),
              When.IClickTheButton(),
              When.IClickTheButton(),
              When.IClickTheButton(),
              When.IClickTheButton(),
              When.IClickTheButton()
            ],
            [Then.TheStatusIs({ count: 66 })]
          )
        ],
        []
      )
    ];
  },
  [
    "./tests/ClassicalReact/index.ts",
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
  ]
);
export {
  ClassicalComponentEsbuildPuppeteerTesteranto
};
