import { assert } from "chai";

import { ClassicalComponent } from "..";


import test from "testeranto/src/SubPackages/react-dom/component/web";
import { ClassicalComponentSpec } from "../testeranto";

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
        async ({ htmlElement }) => {
          console.log("IClickTheButton", htmlElement)
          htmlElement.querySelector("#theButton").click()
        }

  },
  thens: {
    ThePropsIs:
      (expectation) =>
        async ({ htmlElement, reactElement }) => {
          console.log("ThePropsIs", htmlElement, expectation)
          // const btxpctn = JSON.parse(expectation);
          // btxpctn.children = [];
          const elem = htmlElement.querySelector("#theProps")
          const found = elem.innerHTML;
          assert.deepEqual(
            JSON.parse(found),
            expectation
          );
        },

    TheStatusIs:
      (expectation) =>
        async ({ htmlElement }) => {
          console.log("TheStatusIs", htmlElement)

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
