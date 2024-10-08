import { assert } from "chai";
import { IImpl as BaseIImple } from "testeranto/src/SubPackages/react-test-renderer/component/index";

import { IClassicalComponentSpec } from "../test";
import { IProps, IState } from "..";


export const testImplementation: BaseIImple<
  IClassicalComponentSpec,
  IProps,
  IState
> = {
  Suites: {
    Default: "default",
  },
  Givens: {
    AnEmptyState: { props: { foo: "bar" } },

  },
  Whens: {
    IClickTheButton: (x) => (component) => {
      // console.log("IClickTheButton", component, x);
      // throw new Error('not yet implemented');

      component.root.findByType("button").props.onClick();
    }

  },
  Thens: {
    ThePropsIs: (expectation) => (component) => {
      // throw new Error('not yet implemented');
      console.log("ThePropsIs", (component.toJSON() as { children: object[] }).children[1]);
      return assert.deepEqual((component.toJSON() as { children: object[] }).children[1], {
        type: 'pre',
        props: { id: 'theProps' },
        children: expectation
      })
    },

    TheStatusIs: (expectation) => (component) => {
      // throw new Error('not yet implemented');
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
  Checks: {
    AnEmptyState: () => (CComponent) => {
      return { children: [], foo: "bar" }
    },
  },
}