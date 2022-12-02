import renderer, { act, ReactTestRenderer } from "react-test-renderer";
import assert from "assert";

import TesteranoFactory from "./esbuild-puppeteer.testeranto.test";

import { ClassicalComponent } from "./ClassicalComponent";
import type { IProps, IState } from "./ClassicalComponent";
import { Page } from "puppeteer";

const ClassicalReactTesteranto = TesteranoFactory<
  {
    Default: string;
  },
  {
    AnEmptyState: [];
  },
  {
    IClickTheButton;
  },
  {
    ThePropsIs: [IProps];
    TheStatusIs: [IState];
  },
  {
    AnEmptyState: [];
  }
>(ClassicalComponent, (Suite, Given, When, Then, Check) => {
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
});

export default async () =>
  await (
    await ClassicalReactTesteranto
  ).run(
    {
      Default: "a default suite",
    },
    {
      AnEmptyState: () => {
        return {};
      },
    },
    {
      IClickTheButton: () => async (page: Page) =>
        await page.click("#theButton"),
    },
    {
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

    {
      AnEmptyState: () => {
        return {};
      },
    }
  );
