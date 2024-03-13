
import { assert } from "chai";

import { ClassicalComponent } from "../../src/ClassicalComponent";
import type { IProps, IState } from "../../src//ClassicalComponent";

import { features } from "../testerantoFeatures.test.mjs";

import { EsbuildPuppeteerTesteranto } from "./esbuild-puppeteer.testeranto.test";

export const ClassicalComponentEsbuildPuppeteerTesteranto =
  EsbuildPuppeteerTesteranto<{
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
      IAmAGenius;
    };
    checks: {
      AnEmptyState;
    };
  }>(
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
        IAmAGenius:
          () =>
            async ({ page }) => {
              // console.log("consoleLogs", consoleLogs);
              // assert.deepEqual(
              //   await page.$eval("#theProps", (el) => el.innerHTML),
              //   JSON.stringify(expectation)
              // )
            },

        ThePropsIs:
          (expectation) =>
            async ({ page }) => {
              assert.deepEqual(
                await page.$eval("#theProps", (el) => el.innerHTML),
                JSON.stringify(expectation)
              );
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
          return {};
        },
      },
    },

    (Suite, Given, When, Then, Check) => {
      return [
        Suite.Default(
          "a classical react component, bundled with esbuild and tested with puppeteer",
          {},
          // [
          //   Given.AnEmptyState(
          //     [],
          //     [],
          //     [Then.ThePropsIs({}), Then.TheStatusIs({ count: 0 })]
          //   ),
          //   Given.AnEmptyState(
          //     [],
          //     [When.IClickTheButton()],
          //     [Then.ThePropsIs({}), Then.TheStatusIs({ count: 1 })]
          //   ),
          //   Given.AnEmptyState(
          //     [],
          //     [When.IClickTheButton()],
          //     [Then.ThePropsIs({}), Then.TheStatusIs({ count: 1 })]
          //   ),
          //   Given.AnEmptyState(
          //     [`hello`],
          //     [
          //       When.IClickTheButton(),
          //       When.IClickTheButton(),
          //       When.IClickTheButton(),
          //     ],
          //     [Then.TheStatusIs({ count: 3 })]
          //   ),

          //   Given.AnEmptyState(
          //     [`hello`],
          //     [
          //       When.IClickTheButton(),
          //       When.IClickTheButton(),
          //       When.IClickTheButton(),
          //       When.IClickTheButton(),
          //       When.IClickTheButton(),
          //       When.IClickTheButton(),
          //     ],
          //     [Then.TheStatusIs({ count: 6 }), Then.IAmAGenius()]
          //   ),
          // ],
          []
        ),
      ];
    },

    [
      // "./myTests/ClassicalReact/index.ts",

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
    ],
    "ClassicalComponent"
  );
