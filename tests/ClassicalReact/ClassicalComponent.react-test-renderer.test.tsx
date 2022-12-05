import renderer, { ReactTestRenderer } from "react-test-renderer";
import assert from "assert";

import { ClassicalComponent } from "./ClassicalComponent";
import type { IProps, IState } from "./ClassicalComponent";
import { ReactTestRendererTesteranto } from "./react-test-renderer.testeranto.test";


export class ClassicalComponentReactTestRendererTesteranto extends ReactTestRendererTesteranto<{
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
          AnEmptyState: () => { },
        },
        Whens: {
          IClickTheButton: () => async (component: ReactTestRenderer) =>
            component.root.findByType("button").props.onClick(),
        },
        Thens: {
          ThePropsIs: (expectation) => (component: renderer.ReactTestRenderer) => {
            const x = component.toJSON() as any;

            return assert.deepEqual(x.children[1], {
              type: 'pre',
              props: { id: 'theProps' },
              children: [
                JSON.stringify(expectation)
              ]
            })
          },

          TheStatusIs: (expectation) => (component) => {
            const x = component.toJSON() as any;

            return assert.deepEqual(x.children[3], {
              type: 'pre',
              props: { id: 'theState' },
              children: [
                JSON.stringify(expectation)
              ]
            })
          },
        },
        Checks: {
          /* @ts-ignore:next-line */
          AnEmptyState: () => { },
        },
      },

      (Suite, Given, When, Then, Check) => {
        return [
          Suite.Default(
            "a classical react component, bundled with esbuild and tested with puppeteer",
            [
              Given.AnEmptyState("idk",
                [
                  When.IClickTheButton()
                ],
                [
                  Then.ThePropsIs({ "children": [] }),
                  Then.TheStatusIs({ "count": 1 }),
                ]
              ),

            ], [

          ]
          ),
        ];
      },

      ClassicalComponent
    );
  }
}
