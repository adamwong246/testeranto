import test from "testeranto/src/SubPackages/react-dom/component/web";
import { IPartialWebInterface } from "testeranto/src/Types";

import ReactDom from "react-dom/client";
import { assert } from "chai";

import { ClassicalComponent } from "..";
import { ClassicalComponentSpec } from "../test.specification";

type IStore = {
  htmlElement: HTMLElement;
  reactElement: any; //CElement<any, any>,
  domRoot: ReactDom.Root;
};

const ClassicalComponentReactDomImplementation = {
  suites: {
    Default: "Classical Component, react-dom, client.web",
  },
  givens: {
    AnEmptyState: { props: { foo: "bar" } },
  },
  whens: {
    IClickTheHeader: () =>
      async ({ htmlElement }) => {
        console.log("IClickTheHeader", htmlElement)
        htmlElement.querySelector("#theHeader").click()
      },
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

const testInterface: IPartialWebInterface<any> = {
  afterEach: async function (store: IStore, ndx, artificer, utils) {
    utils.writeFileSync("aftereachlog", store.toString());

    const page = (await utils.browser.pages()).filter((x) => {
      const parsedUrl = new URL(x.url());
      parsedUrl.search = "";
      const strippedUrl = parsedUrl.toString();

      return (
        strippedUrl ===
        "file:///Users/adam/Code/kokomoBay/docs/web/src/ClassicalComponent/react-dom/client.web.test.html"
      );
      // return true;
    })[0];

    await page.screenshot({
      path: "screenshot.jpg",
    });

    return store;
  },
};

export default test(
  ClassicalComponent,
  ClassicalComponentSpec,
  ClassicalComponentReactDomImplementation,
  testInterface
);
