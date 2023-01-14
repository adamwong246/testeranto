// tests/storefront.test.ts
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

// src/storefront.tsx
import React from "react";
function App() {
  const greeting = "Hello Testeranto!";
  return /* @__PURE__ */ React.createElement("div", { style: { border: "1px solid blue" } }, /* @__PURE__ */ React.createElement("h1", null, greeting), /* @__PURE__ */ React.createElement("h2", null, "Hello there"));
}
var storefront_default = App;

// tests/storefront.test.ts
var StorefrontTesteranto = EsbuildPuppeteerTesteranto(
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
        "the storefront",
        [
          Given.AnEmptyState(
            [features.federatedSplitContract],
            [],
            [
              Then.ThePropsIs({}),
              Then.TheStatusIs({ count: 0 })
            ]
          )
        ],
        []
      )
    ];
  },
  [
    "./src/index.tsx",
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
    storefront_default
  ]
);
export {
  StorefrontTesteranto
};
