import {
  Web_default
} from "../../../chunk-YCRVKDXD.mjs";
import {
  assert
} from "../../../chunk-GEWWKFQY.mjs";
import {
  ClassicalComponent,
  require_client
} from "../../../chunk-2FNPKSAA.mjs";
import {
  require_react
} from "../../../chunk-JE6WFJZI.mjs";
import "../../../chunk-2MX732QA.mjs";
import "../../../chunk-KKQOQNY2.mjs";
import "../../../chunk-EXETZ625.mjs";
import {
  __toESM
} from "../../../chunk-3KGMXYRN.mjs";

// node_modules/testeranto/dist/module/SubPackages/react-dom/component/web.js
var import_react = __toESM(require_react(), 1);
var import_client = __toESM(require_client(), 1);
var web_default = (testInput, testSpecifications, testImplementations) => {
  class TesterantoComponent extends testInput {
    constructor(props) {
      super(props);
      this.done = props.done;
    }
    componentDidMount() {
      super.componentDidMount && super.componentDidMount();
      return this.done(this);
    }
  }
  const t = Web_default(testInput, testSpecifications, testImplementations, {
    beforeAll: async (initialProps, artificer) => {
      console.log("mark5", initialProps);
      return await new Promise((resolve, rej) => {
        const htmlElement = document.getElementById("root");
        if (htmlElement) {
          const domRoot = import_client.default.createRoot(htmlElement);
          domRoot.render((0, import_react.createElement)(TesterantoComponent, Object.assign(Object.assign({}, initialProps), { done: (reactElement) => {
            resolve({
              htmlElement,
              reactElement,
              domRoot
            });
          } }), []));
        }
      });
    },
    // beforeEach: async (
    //   s,
    //   initializer,
    //   testResource,
    //   artificer,
    //   initialValues
    // ): Promise<IStore> => {
    //   return new Promise((resolve, rej) => {
    //     console.log("beforeEach" + TesterantoComponent);
    //     // const domRoot = ReactDom.createRoot(htmlElement);
    //     // // Ignore these type errors
    //     // domRoot.render(
    //     //   createElement(
    //     //     TesterantoComponent,
    //     //     {
    //     //       ...initializer,
    //     //       done: (reactElement) => {
    //     //         resolve({
    //     //           htmlElement,
    //     //           reactElement,
    //     //           domRoot,
    //     //         });
    //     //       },
    //     //     },
    //     //     []
    //     //   )
    //     // );
    //   });
    // },
    andWhen: function(s, whenCB) {
      return whenCB(s);
    },
    butThen: async function(s, thenCB) {
      return thenCB(s);
    },
    afterEach: async function(store, ndx, artificer, utils) {
      console.log("afterEach", store);
      utils.writeFileSync("aftereachlog", store.toString());
      const page = (await utils.browser.pages()).filter((x2) => {
        const parsedUrl = new URL(x2.url());
        parsedUrl.search = "";
        const strippedUrl = parsedUrl.toString();
        return strippedUrl === "file:///Users/adam/Code/kokomoBay/docs/web/src/ClassicalComponent/react-dom/client.web.test.html";
      })[0];
      const x = await page.screenshot({
        path: "afterEachLog.jpg"
      });
      console.log("x", x);
      return store;
    },
    afterAll: async (store, artificer, utils) => {
      return store;
    }
  });
  document.addEventListener("DOMContentLoaded", function() {
    const elem = document.getElementById("root");
    if (elem) {
      return t;
    }
  });
  return t;
};

// src/ClassicalComponent/testeranto.ts
var ClassicalComponentSpec = (Suite, Given, When, Then, Check) => {
  return [
    Suite.Default(
      "a classical react component",
      {
        test0: Given.AnEmptyState(
          ["test"],
          [
            When.IClickTheButton(),
            When.IClickTheButton(),
            When.IClickTheButton(),
            When.IClickTheHeader()
            // When.IClickTheButton(),
          ],
          [Then.ThePropsIs({ children: [] }), Then.TheStatusIs({ count: 3 })]
        ),
        test1: Given.AnEmptyState(
          ["test"],
          [When.IClickTheButton()],
          [Then.ThePropsIs({ children: [] }), Then.TheStatusIs({ count: 1 })]
        ),
        test2: Given.AnEmptyState(
          ["test"],
          [
            When.IClickTheButton(),
            When.IClickTheButton(),
            When.IClickTheButton(),
            When.IClickTheButton(),
            When.IClickTheButton(),
            When.IClickTheButton(),
            When.IClickTheButton(),
            When.IClickTheButton(),
            When.IClickTheButton()
          ],
          [Then.TheStatusIs({ count: 9 })]
        ),
        test3: Given.AnEmptyState(
          ["test"],
          [When.IClickTheButton(), When.IClickTheButton()],
          [Then.TheStatusIs({ count: 2 })]
        )
      },
      []
    )
  ];
};

// src/ClassicalComponent/react-dom/client.web.test.tsx
var ClassicalComponentReactDomImplementation = {
  suites: {
    Default: "Classical Component, react-dom, client.web"
  },
  givens: {
    AnEmptyState: { props: { foo: "bar" } }
  },
  whens: {
    IClickTheHeader: () => async ({ htmlElement }) => {
      console.log("IClickTheHeader", htmlElement);
      htmlElement.querySelector("#theHeader").click();
    },
    IClickTheButton: () => async ({ htmlElement }) => {
      console.log("IClickTheButton", htmlElement);
      htmlElement.querySelector("#theButton").click();
    }
  },
  thens: {
    ThePropsIs: (expectation) => async ({ htmlElement, reactElement }) => {
      console.log("ThePropsIs", htmlElement, expectation);
      const elem = htmlElement.querySelector("#theProps");
      const found = elem.innerHTML;
      assert.deepEqual(
        JSON.parse(found),
        expectation
      );
    },
    TheStatusIs: (expectation) => async ({ htmlElement }) => {
      console.log("TheStatusIs", htmlElement);
      const elem = htmlElement.querySelector("#theStat");
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
    }
  }
};
var client_web_test_default = web_default(
  ClassicalComponent,
  ClassicalComponentSpec,
  ClassicalComponentReactDomImplementation
);
export {
  client_web_test_default as default
};
