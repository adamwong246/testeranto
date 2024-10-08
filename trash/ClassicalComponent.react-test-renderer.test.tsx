import renderer, { ReactTestRenderer } from "react-test-renderer";
import assert from "assert";

import { ReactTestRendererTesteranto } from "../../myTests/react-test-renderer-componnent.testeranto.test";

import { ClassicalComponent } from "../src/ClassicalComponent";
import type { IProps, IState } from "../src/ClassicalComponent";
import { IClassicalComponentTesteranto, testSpecification } from "../src/ClassicalComponent/test";

export const ClassicalComponentReactTestRendererTesteranto = ReactTestRendererTesteranto<
  IClassicalComponentTesteranto,
  IProps,
  IState
>(
  {
    Suites: {
      Default: "some default Suite",
    },
    Givens: {
      AnEmptyState: () => {
        return { children: [] };
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
        return { children: [] };
      },
    },
  },

  testSpecification,
  ClassicalComponent
);
