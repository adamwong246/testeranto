import type { IProps, IState } from "./ClassicalComponent";
import { assert } from "chai";
import { features } from "../testerantoFeatures.test.mjs";
import { EsbuildPuppeteerTesteranto } from "./esbuild-puppeteer.testeranto.test";

import { ClassicalComponent } from "./ClassicalComponent";

const myFeature = `hello`;

export const ClassicalComponentEsbuildPuppeteerTesteranto = EsbuildPuppeteerTesteranto<
  {
    suites: {
      Default: string;
    };
    givens: {
      AnEmptyState: [];
    };
    whens: {
      IClickTheButton: [];
    };
    thens: {
      ThePropsIs: [IProps];
      TheStatusIs: [IState];
    };
    checks: {
      AnEmptyState;
    }
  },
  typeof features
>(
  {
    Suites: {
      Default: "some default Suite",
    },
    Givens: {
      AnEmptyState: () => {
        return;
      },
    },
    Whens: {
      IClickTheButton:
        () =>
          async ({ page }) =>
            await page.click("#theButton"),
    },
    Thens: {
      ThePropsIs:
        (expectation) =>
          async ({ page }) => {
            assert.deepEqual(
              await page.$eval("#theProps", (el) => el.innerHTML),
              JSON.stringify(expectation)
            )
          },


      TheStatusIs:
        (expectation) =>
          async ({ page }) =>
            assert.deepEqual(
              await page.$eval("#theState", (el) => el.innerHTML),
              JSON.stringify(expectation)
            ),
    },
    Checks: {
      AnEmptyState: () => {
        return {}
      },
    },
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
              When.IClickTheButton(),
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
              When.IClickTheButton(),
            ],
            [Then.TheStatusIs({ count: 6 })]
          ),
        ],
        []
      ),
    ];
  },

  [

    "./myTests/ClassicalReact/index.ts",

    (jsbundle: string): string => `
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
    ClassicalComponent,
  ]
);
