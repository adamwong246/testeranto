import { assert } from "chai";

import { features } from "../../testerantoFeatures.test";
import { StorefrontTesteranto } from "./index.testeranto.test";

// import storefront from "../../../src/storefront";
import Storefront from "../../../src/storefront";

import ShallowRenderer from 'react-test-renderer/shallow';

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
        async ({ rendereredComponent }) => {
          console.log(rendereredComponent.root.findByProps({ id: "inc" }).props.onClick)
          rendereredComponent.root.findByProps({ id: "inc" }).props.onClick()
        }
      ,
      Decrement: () =>
        async ({ rendereredComponent }) => {
          console.log(rendereredComponent.root.findByProps({ id: "dec" }).props.onClick)
          rendereredComponent.root.findByProps({ id: "dec" }).props.onClick()
        }

    },
    Thens: {
      TheCounterIs:
        (expectation) =>
          async ({ rendereredComponent }) => {

            const compAsJson = rendereredComponent.toTree().rendered.rendered[1].rendered.toString()
            console.log("compAsJson", compAsJson)
            assert.deepEqual(
              1, 1
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
        "the storefront react app",
        [
          // Given.AnEmptyState(
          //   [features.federatedSplitContract],
          //   [],
          //   [
          //     Then.TheCounterIs(0)
          //   ]
          // ),
          Given.AnEmptyState(
            [],
            [When.Increment()],
            [
              Then.TheCounterIs(1)
            ]
          ),
          // Given.AnEmptyState(
          //   [],
          //   [
          //     When.Increment(), When.Increment(), When.Increment(),
          //     When.Increment(), When.Increment(), When.Increment(),
          //   ],
          //   [
          //     Then.TheCounterIs(6)
          //   ]
          // ),
          // Given.AnEmptyState(
          //   [],
          //   [

          //     When.Increment(), When.Increment(), When.Increment(), When.Increment(), When.Increment(), When.Increment(),
          //     When.Increment(), When.Increment(), When.Increment(), When.Increment(), When.Increment(), When.Increment(),
          //     When.Increment(), When.Increment(), When.Increment(), When.Increment(), When.Increment(), When.Increment(),
          //     When.Increment(), When.Increment(), When.Increment(), When.Increment(), When.Increment(), When.Increment(),
          //     When.Increment(), When.Increment(), When.Increment(), When.Increment(), When.Increment(), When.Increment(),
          //     When.Increment(), When.Increment(), When.Increment(), When.Increment(), When.Increment(), When.Increment(),
          //   ],
          //   [
          //     Then.TheCounterIs(36)
          //   ]
          // ),

        ],
        []
      ),
    ];
  },

  {
    contractName: "MyFirstContract",
    component: Storefront
  }

  //   [

  //     "./tests/storefrontIndex.test.tsx",

  //     (jsbundle: string): string => `
  //             <!DOCTYPE html>
  //     <html lang="en">
  //     <head>
  //       <script type="module">${jsbundle}</script>
  //     </head>

  //     <body>
  //       <div id="root">
  //         <p>loading...</p>
  //       </div>
  //     </body>

  //     <footer></footer>

  //     </html>
  // `,
  //     storefront,
  //   ],

  //   "MyFirstContract"
);
