import { assert } from "chai";

import { features } from "./testerantoFeatures.test";
import { StorefrontTesteranto } from "./storefront.testeranto.test";

import storefront from "../src/storefront";

export const StorefrontTest = StorefrontTesteranto<
  {
    suites: {
      Default: string;
    };
    givens: {
      AnEmptyState: [];
    };
    whens: {
      Increment: [];
      Decrement: [];
    };
    thens: {
      TheCounterIs: [number];
    };
    checks: {
      AnEmptyState;
    }
  }
>(
  {
    Suites: {
      Default: "default storefront suite",
    },
    Givens: {
      AnEmptyState: () => {
        return;
      },
    },
    Whens: {
      Increment: () =>
        async ({ page }) => {
          await page.click("#inc")
        }
      ,
      Decrement: () =>
        async ({ page }) =>
          await page.click("#dec"),
    },
    Thens: {
      TheCounterIs:
        (expectation) =>
          async ({ page }) => {
            assert.deepEqual(
              await page.$eval("#counter", (el) => el.innerHTML),
              JSON.stringify(expectation)
            )
          },

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
        "the storefront?",
        [
          Given.AnEmptyState(
            [features.federatedSplitContract],
            [],
            [
              Then.TheCounterIs(0)
            ]
          ),
          Given.AnEmptyState(
            [],
            [When.Increment()],
            [
              Then.TheCounterIs(1)
            ]
          ),
          Given.AnEmptyState(
            [],
            [
              When.Increment(), When.Increment(), When.Increment(),
              When.Increment(), When.Increment(), When.Increment(),
            ],
            [
              Then.TheCounterIs(6)
            ]
          ),
          Given.AnEmptyState(
            [],
            [

              When.Increment(), When.Increment(), When.Increment(), When.Increment(), When.Increment(), When.Increment(),
              When.Increment(), When.Increment(), When.Increment(), When.Increment(), When.Increment(), When.Increment(),
              When.Increment(), When.Increment(), When.Increment(), When.Increment(), When.Increment(), When.Increment(),
              When.Increment(), When.Increment(), When.Increment(), When.Increment(), When.Increment(), When.Increment(),
              When.Increment(), When.Increment(), When.Increment(), When.Increment(), When.Increment(), When.Increment(),
              When.Increment(), When.Increment(), When.Increment(), When.Increment(), When.Increment(), When.Increment(),
            ],
            [
              Then.TheCounterIs(36)
            ]
          ),

        ],
        []
      ),
    ];
  },

  [

    "./tests/storefrontIndex.test.tsx",

    (jsbundle: string): string => `
            <!DOCTYPE html>
    <html lang="en">
    <head>
      <script type="module">${jsbundle}</script>
    </head>

    <h1>hello world</h1>
    <body>
      <div id="root">
        <p>loading...</p>
      </div>
    </body>

    <footer></footer>

    </html>
`,
    storefront,
  ],

  "MyFirstContract"
);
