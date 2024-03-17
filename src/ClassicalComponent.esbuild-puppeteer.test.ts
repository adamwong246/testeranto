
import { assert } from "chai";

import { EsbuildPuppeteerTesteranto } from "../myTests/esbuild-puppeteer.testeranto.test";

import { IClassicalComponentTesteranto, testSpecification } from "./ClassicalComponent.test";

export const ClassicalComponentEsbuildPuppeteerTesteranto =
  EsbuildPuppeteerTesteranto<IClassicalComponentTesteranto>(
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
            async ({ page }) => {
              await page.click("#theButton")
            },
      },
      Thens: {
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
    testSpecification,
    "src/ClassicalComponent.js"
  );
