import { assert } from "chai";

import { ClassicalComponent } from "./ClassicalComponent";
import { IClassicalComponentTesteranto, testSpecification } from "./ClassicalComponent.test";

import ReactTesteranto from "../../myTests/react-component.web.test";

export const ClassicalComponentBrowserTesteranto = ReactTesteranto<IClassicalComponentTesteranto>(
  {
    Suites: {
      Default: "some default Suite",
    },
    Givens: {
      AnEmptyState: () => {
        return;
      },
    },
    Whens: {
      IClickTheButton:
        () =>
          async ({ htmlElement }) =>
            htmlElement.querySelector("#theButton").click()
    },
    Thens: {
      ThePropsIs:
        (expectation) =>
          async ({ htmlElement, reactElement }) => {
            const elem = htmlElement.querySelector("#theProps")
            const found = elem.innerHTML;
            assert.deepEqual(
              found,
              JSON.stringify(expectation)
            );
          },

      TheStatusIs:
        (expectation) =>
          async ({ htmlElement }) => {
            const elem = htmlElement.querySelector("#theState")
            const found = elem.innerHTML;
            assert.deepEqual(
              found,
              JSON.stringify(expectation)
            );

          }
    },
    Checks: {
      AnEmptyState: () => {
        return {};
      },
    },
  },
  testSpecification,
  ClassicalComponent,
);
