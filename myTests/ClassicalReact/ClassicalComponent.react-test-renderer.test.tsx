import renderer, { ReactTestRenderer } from "react-test-renderer";
import assert from "assert";

import { ClassicalComponent } from "./ClassicalComponent";
import type { IProps, IState } from "./ClassicalComponent";
import { ReactTestRendererTesteranto } from "./react-test-renderer.testeranto.test";
import { IClassicalComponentTesteranto, testSpecification } from "./ClassicalComponent.test";

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
  ClassicalComponent,
  `ClassicalComponent, react-test-renderer`
);
