import { assert } from "chai";

import { features } from "../../testerantoFeatures.test.mjs";
import { StorefrontTesteranto } from "./index.testeranto.test";

import Storefront from "../../../src/storefront";

export const StorefrontTestBeta = StorefrontTesteranto<
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
      TheCounterIs: [string];
    };
    checks: {
      AnEmptyState;
    }
  },
  typeof features
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
        async ({ rendereredComponent }) =>
          await rendereredComponent.root.findByProps({ id: "inc" }).props.onClick(),
      Decrement: () =>
        async ({ rendereredComponent }) =>
          await rendereredComponent.root.findByProps({ id: "dec" }).props.onClick()
    },
    Thens: {
      TheCounterIs:
        (expectation) =>
          async ({ rendereredComponent }) =>
            assert.deepEqual(expectation, (rendereredComponent.toTree().rendered.rendered[1].rendered.toString())),

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
        "the storefront react app, beta",
        [
          Given.AnEmptyState(
            [`federatedSplitContract`],
            [],
            [
              Then.TheCounterIs('0')
            ]
          ),
          Given.AnEmptyState(
            [],
            [
              When.Increment(),
              When.Increment(),
              When.Increment(),
              When.Increment()
            ],
            [
              Then.TheCounterIs('4'),

            ]
          ),
          Given.AnEmptyState(
            [],
            [
              When.Increment(), When.Increment(), When.Increment(),
              When.Increment(), When.Increment(), When.Increment(),
            ],
            [
              Then.TheCounterIs("6")
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
              Then.TheCounterIs("36")
            ]
          ),

        ],
        []
      ),
    ];
  },

  {
    contractName: "MyFirstContract",
    component: Storefront
  }

);
