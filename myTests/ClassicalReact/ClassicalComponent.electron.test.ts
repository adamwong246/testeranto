import { assert } from "chai";

import { ClassicalComponent } from "../../src/ClassicalComponent";
import { IClassicalComponentTesteranto, testSpecification } from "../../src/ClassicalComponent.test";

import ReactTesteranto from "./React.testeranto.test";

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
            console.log("elem")
            console.log(elem)
            const found = elem.innerHTML;
            console.log("found")
            console.log(found)

            assert.deepEqual(
              found,
              JSON.stringify(expectation)
            );
          },

      TheStatusIs:
        (expectation) =>
          async ({ htmlElement }) => {
            const elem = htmlElement.querySelector("#theState")
            console.log("elem")
            console.log(elem)
            const found = elem.innerHTML;
            console.log("found")
            console.log(found)

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
  "ClassicalComponent"
);
