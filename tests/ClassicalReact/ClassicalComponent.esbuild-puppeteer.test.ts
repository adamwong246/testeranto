import { ClassicalComponent } from "./ClassicalComponent";
import type { IProps, IState } from "./ClassicalComponent";

import { assert } from "chai";

import { EsbuildPuppeteerTesteranto } from "./esbuild-puppeteer.testeranto.test";
import { Page } from "puppeteer";

export class ClassicalComponentEsbuildPuppeteerTesteranto extends EsbuildPuppeteerTesteranto<{
  suites: {
    Default: string;
  };
  givens: {
    AnEmptyState;
  };
  whens: {
    IClickTheButton;
  };
  thens: {
    ThePropsIs: [IProps];
    TheStatusIs: [IState];
  };
  checks: {
    AnEmptyState;
  };
}> {
  constructor() {
    super(
      {
        Suites: {
          Default: "some default Suite",
        },
        Givens: {
          /* @ts-ignore:next-line */
          AnEmptyState: () => {},
        },
        Whens: {
          IClickTheButton: () => async (page: Page) =>
            await page.click("#theButton"),
        },
        Thens: {
          ThePropsIs: (expectation) => async (page: Page) =>
            assert.deepEqual(
              await page.$eval("#theProps", (el) => el.innerHTML),
              JSON.stringify(expectation)
            ),

          TheStatusIs: (expectation) => async (page: Page) =>
            assert.deepEqual(
              await page.$eval("#theState", (el) => el.innerHTML),
              JSON.stringify(expectation)
            ),
        },
        Checks: {
          /* @ts-ignore:next-line */
          AnEmptyState: () => {},
        },
      },

      (Suite, Given, When, Then, Check) => {
        return [
          Suite.Default(
            "a classical react component, bundled with esbuild and tested with puppeteer",
            [
              Given.AnEmptyState(
                "default",
                [],
                [Then.ThePropsIs({}), Then.TheStatusIs({ count: 0 })]
              ),
              Given.AnEmptyState(
                "default",
                [When.IClickTheButton()],
                [Then.ThePropsIs({}), Then.TheStatusIs({ count: 1 })]
              ),

              Given.AnEmptyState(
                "default",
                [
                  When.IClickTheButton(),
                  When.IClickTheButton(),
                  When.IClickTheButton(),
                ],
                [Then.TheStatusIs({ count: 3 })]
              ),

              Given.AnEmptyState(
                "default",
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

      ClassicalComponent
    );
  }
}