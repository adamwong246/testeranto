import { assert } from "chai";
import { IImpl as BaseIImple } from "testeranto/src/SubPackages/react-test-renderer/component/index";

import type { IClassicalComponentSpec } from "../testeranto";
import type { IProps } from "../index";

export const testImplementation: BaseIImple<
  IClassicalComponentSpec,
  IProps
> = {
  suites: {
    Default: "default",
  },
  givens: {
    AnEmptyState: () => { return { foo: "bar" } },

  },
  whens: {
    IClickTheButton: () => (component) => {
      component.root.findByType("button").props.onClick();
    }

  },
  thens: {
    ThePropsIs: (expectation) => (component) => {
      console.log("ThePropsIs", (component.toJSON() as { children: object[] }).children[1]);
      return assert.deepEqual((component.toJSON() as { children: object[] }).children[1], {
        type: 'pre',
        props: { id: 'theProps' },
        children: expectation
      })
    },

    TheStatusIs: (expectation) => (component) => {
      throw new Error('not yet implemented');
      // console.log(component.toJSON());
      // return assert.deepEqual((component.toJSON() as { children: object[] }).children[3], {
      //   type: 'pre',
      //   props: { id: 'theState' },
      //   children: [
      //     JSON.stringify(expectation)
      //   ]
      // })
    },
  },
  checks: {
    AnEmptyState: () => { return { foo: "bar" } },
  },
}