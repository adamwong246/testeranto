import renderer, { ReactTestRenderer } from "react-test-renderer";
import assert from "assert";
import { features } from "../testerantoFeatures.test.mjs";
import { ClassicalComponent } from "./ClassicalComponent";
import type { IProps, IState } from "./ClassicalComponent";
import { ReactTestRendererTesteranto } from "./react-test-renderer.testeranto.test";

const myFeature = `hello`;

export const ClassicalComponentReactTestRendererTesteranto = ReactTestRendererTesteranto<
  {
    suites: {
      Default: string;
    };
    givens: {
      AnEmptyState;
      SomeState;
    };
    whens: {
      IClickTheButton;
    };
    thens: {
      ThePropsIs: [object];
      TheStatusIs: [object];
    };
    checks: {
      AnEmptyState;
    }
  },
  IProps,
  IState
>(
  {
    Suites: {
      Default: "some default Suite",
    },
    Givens: {
      AnEmptyState: () => {
        return {};
      },
      SomeState: () => {
        return { foo: "bar" };
      }
    },
    Whens: {
      IClickTheButton: () => (component: ReactTestRenderer) =>
        component.root.findByType("button").props.onClick(),
    },
    Thens: {
      ThePropsIs: (expectation) => (component: renderer.ReactTestRenderer) => {
        return assert.deepEqual((component.toJSON() as { children: object[] }).children[1], {
          type: 'pre',
          props: { id: 'theProps' },
          children: [
            JSON.stringify(expectation)
          ]
        })
      },

      TheStatusIs: (expectation) => (component) => {
        return assert.deepEqual((component.toJSON() as { children: object[] }).children[3], {
          type: 'pre',
          props: { id: 'theState' },
          children: [
            JSON.stringify(expectation)
          ]
        })
      },
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
        [
          Given.AnEmptyState(
            [],
            [
              When.IClickTheButton()
            ],
            [
              Then.ThePropsIs({ "children": [] }),
              Then.TheStatusIs({ "count": 1 }),
            ]
          ),

          Given.AnEmptyState(
            [],
            [
              When.IClickTheButton(),
              When.IClickTheButton(),
              When.IClickTheButton(),
            ],
            [
              Then.TheStatusIs({ "count": 3 }),
            ]
          ),

        ], [

      ]
      ),
    ];
  },

  ClassicalComponent
);
