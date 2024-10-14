import { assert } from "chai";

import { ClassicalComponent } from "..";
import { IClassicalComponentSpec, ClassicalComponentSpec } from "../test";

import test from "testeranto/src/SubPackages/react-dom/component/web";

const ClassicalComponentReactDomImplementation = {
  suites: {
    Default: "Classical Component, react-dom, client.web",
  },
  givens: {
    AnEmptyState: { props: { foo: "bar" } },
  },
  whens: {
    IClickTheButton:
      () =>
        async ({ htmlElement }) =>
          htmlElement.querySelector("#theButton").click()
  },
  thens: {
    ThePropsIs:
      (expectation) =>
        async ({ htmlElement, reactElement }) => {
          const btxpctn = JSON.parse(expectation[0]);
          btxpctn.children = [];
          const elem = htmlElement.querySelector("#theProps")
          const found = elem.innerHTML;
          assert.deepEqual(
            JSON.parse(found),
            btxpctn
          );
        },

    TheStatusIs:
      (expectation) =>
        async ({ htmlElement }) => {
          const elem = htmlElement.querySelector("#theStat")
          const found = elem.innerHTML;
          assert.deepEqual(
            found,
            JSON.stringify(expectation)
          );

        }
  },
  checks: {
    AnEmptyState: () => () => {
      return {};
    },
  },
};

export default test(
  ClassicalComponent,
  ClassicalComponentSpec,
  ClassicalComponentReactDomImplementation,


);
