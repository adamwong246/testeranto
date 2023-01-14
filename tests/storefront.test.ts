import { assert } from "chai";

// import type { IProps, IState } from "./ClassicalReact/ClassicalComponent";
import { features } from "./testerantoFeatures.test";
import { EsbuildPuppeteerTesteranto } from "./ClassicalReact/esbuild-puppeteer.testeranto.test";

import storefront from "../src/storefront";

// const myFeature = features.federatedSplitContract;

export const StorefrontTesteranto = EsbuildPuppeteerTesteranto<
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
      ThePropsIs: [any];
      TheStatusIs: [any];
    };
    checks: {
      AnEmptyState;
    }
  }
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
        "the storefront",
        [
          Given.AnEmptyState(
            [features.federatedSplitContract],
            [],
            [
              Then.ThePropsIs({}),
              Then.TheStatusIs({ count: 0 })
            ]
          ),
          // Given.AnEmptyState(
          //   [],
          //   [When.IClickTheButton()],
          //   [
          //     Then.ThePropsIs({}),
          //     Then.TheStatusIs({ count: 1 })
          //   ]
          // ),

          // Given.AnEmptyState(
          //   [features.hello],
          //   [
          //     When.IClickTheButton(),
          //     When.IClickTheButton(),
          //     When.IClickTheButton(),
          //   ],
          //   [Then.TheStatusIs({ count: 3 })]
          // ),

          // Given.AnEmptyState(
          //   [features.hello],
          //   [
          //     When.IClickTheButton(),
          //     When.IClickTheButton(),
          //     When.IClickTheButton(),
          //     When.IClickTheButton(),
          //     When.IClickTheButton(),
          //     When.IClickTheButton(),
          //   ],
          //   [Then.TheStatusIs({ count: 6 })]
          // ),
        ],
        []
      ),
    ];
  },

  [

    "./src/index.tsx",

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
    storefront,
  ]
);
