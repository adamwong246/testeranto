var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// myTests/ClassicalReact/ClassicalComponent.esbuild-puppeteer.test.ts
import { assert } from "chai";

// myTests/ClassicalReact/esbuild-puppeteer.testeranto.test.ts
import puppeteer from "puppeteer";
import esbuild from "esbuild";
import { Testeranto } from "testeranto";
var EsbuildPuppeteerTesteranto = (testImplementations, testSpecifications, testInput) => Testeranto(
  testInput,
  testSpecifications,
  testImplementations,
  { ports: 0 },
  {
    beforeAll: function(_0) {
      return __async(this, arguments, function* ([bundlePath, htmlTemplate]) {
        return {
          page: yield (yield puppeteer.launch({
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
      });
    },
    beforeEach: function(subject) {
      return subject.page.setContent(subject.htmlBundle).then(() => {
        return { page: subject.page };
      });
    },
    andWhen: function({ page }, actioner) {
      return actioner()({ page });
    },
    butThen: function(_0) {
      return __async(this, arguments, function* ({ page }) {
        return { page };
      });
    },
    afterEach: function(_0, _1, _2) {
      return __async(this, arguments, function* ({ page }, ndx, saveTestArtifact) {
        saveTestArtifact.png(
          yield (yield page).screenshot()
        );
        return { page };
      });
    }
  }
);

// myTests/ClassicalReact/ClassicalComponent.tsx
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
      IClickTheButton: () => (_0) => __async(void 0, [_0], function* ({ page }) {
        return yield page.click("#theButton");
      })
    },
    Thens: {
      ThePropsIs: (expectation) => (_0) => __async(void 0, [_0], function* ({ page }) {
        assert.deepEqual(
          yield page.$eval("#theProps", (el) => el.innerHTML),
          JSON.stringify(expectation)
        );
      }),
      TheStatusIs: (expectation) => (_0) => __async(void 0, [_0], function* ({ page }) {
        return assert.deepEqual(
          yield page.$eval("#theState", (el) => el.innerHTML),
          JSON.stringify(expectation)
        );
      })
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
            [Then.TheStatusIs({ count: 6 })]
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
  ]
);
export {
  ClassicalComponentEsbuildPuppeteerTesteranto
};
