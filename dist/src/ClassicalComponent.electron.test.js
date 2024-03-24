import {
  require_client,
  require_react
} from "../chunk-YI7SC5VN.js";
import {
  Web_default,
  assert
} from "../chunk-BVWPBNJS.js";
import {
  __toESM
} from "../chunk-4ATCX2XT.js";

// src/ClassicalComponent.tsx
var import_react = __toESM(require_react());
var import_client = __toESM(require_client());
var ClassicalComponent = class extends import_react.default.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }
  // componentDidMount() {
  //   console.info("componentDidMount");
  //   // const x = fetch("http://www.google.com")
  //   //   .then((response) => response.text())
  //   //   .then(x => {
  //   //     console.warn("i am a genius", x)
  //   //   });
  //   // console.info("x", x);
  //   // const y = fetch("http://www.google.com/", { mode: `no-cors` })
  //   //   // .then((response) => response.text())
  //   //   .then(x => {
  //   //     console.log("i am a genius!")
  //   //   });
  //   // console.info(y);
  // }
  render() {
    return /* @__PURE__ */ import_react.default.createElement("div", { style: { border: "3px solid green" } }, /* @__PURE__ */ import_react.default.createElement("h1", null, "Hello Marcus"), /* @__PURE__ */ import_react.default.createElement("pre", { id: "theProps" }, JSON.stringify(this.props)), /* @__PURE__ */ import_react.default.createElement("p", null, "foo: ", this.props.foo), /* @__PURE__ */ import_react.default.createElement("pre", { id: "theState" }, JSON.stringify(this.state)), /* @__PURE__ */ import_react.default.createElement("p", null, "count: ", this.state.count, " times"), /* @__PURE__ */ import_react.default.createElement("button", { id: "theButton", onClick: async () => {
      this.setState({ count: this.state.count + 1 });
    } }, "Click"));
  }
};

// src/ClassicalComponent.test.ts
var testSpecification = (Suite, Given, When, Then, Check) => {
  return [
    Suite.Default(
      "a classical react component",
      {
        "test0": Given.AnEmptyState(
          ["test"],
          [],
          [
            Then.ThePropsIs({ children: [] }),
            Then.TheStatusIs({ count: 0 })
          ]
        ),
        "test1": Given.AnEmptyState(
          ["test"],
          [When.IClickTheButton()],
          [Then.ThePropsIs({ children: [] }), Then.TheStatusIs({ count: 1 })]
        ),
        "test2": Given.AnEmptyState(
          ["test"],
          [
            When.IClickTheButton(),
            When.IClickTheButton(),
            When.IClickTheButton(),
            When.IClickTheButton(),
            When.IClickTheButton(),
            When.IClickTheButton()
          ],
          [Then.TheStatusIs({ count: 6 })]
        ),
        "test3": Given.AnEmptyState(
          ["test"],
          [
            When.IClickTheButton(),
            When.IClickTheButton()
          ],
          [Then.TheStatusIs({ count: 2 })]
        )
      },
      []
    )
  ];
};

// myTests/react-component.testeranto.test.tsx
var import_react2 = __toESM(require_react());
var import_client2 = __toESM(require_client());
var react_component_testeranto_test_default = (testImplementations, testSpecifications, testInput) => {
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
  return Web_default(
    testInput,
    testSpecifications,
    testImplementations,
    {
      beforeAll: async (prototype, artificer) => {
        artificer("./before.txt", "hello artificer");
        return await new Promise((resolve, rej) => {
          document.addEventListener("DOMContentLoaded", function() {
            const elem = document.getElementById("root");
            if (elem) {
              resolve({ htmlElement: elem });
            }
          });
        });
      },
      beforeEach: async ({ htmlElement }, ndx, testRsource, artificer) => {
        return new Promise((resolve, rej) => {
          const reactElement = import_react2.default.createElement(TesterantoComponent, {
            done: (reactElement2) => {
              resolve(
                {
                  htmlElement,
                  reactElement: reactElement2
                }
              );
            }
          }, []);
          import_client2.default.createRoot(htmlElement).render(reactElement);
        });
      },
      andWhen: function(s, actioner) {
        return actioner()(s);
      },
      butThen: async function(s) {
        return s;
      },
      afterEach: async function(store, ndx, artificer) {
        return {};
      },
      afterAll: (store, artificer) => {
        return;
      }
    }
  );
};

// src/ClassicalComponent.electron.test.ts
var ClassicalComponentBrowserTesteranto = react_component_testeranto_test_default(
  {
    Suites: {
      Default: "some default Suite"
    },
    Givens: {
      AnEmptyState: () => {
        return;
      }
    },
    Whens: {
      IClickTheButton: () => async ({ htmlElement }) => htmlElement.querySelector("#theButton").click()
    },
    Thens: {
      ThePropsIs: (expectation) => async ({ htmlElement, reactElement }) => {
        const elem = htmlElement.querySelector("#theProps");
        console.log("elem");
        console.log(elem);
        const found = elem.innerHTML;
        console.log("found");
        console.log(found);
        assert.deepEqual(
          found,
          JSON.stringify(expectation)
        );
      },
      TheStatusIs: (expectation) => async ({ htmlElement }) => {
        const elem = htmlElement.querySelector("#theState");
        console.log("elem");
        console.log(elem);
        const found = elem.innerHTML;
        console.log("found");
        console.log(found);
        assert.deepEqual(
          found,
          JSON.stringify(expectation)
        );
      }
    },
    Checks: {
      AnEmptyState: () => {
        return {};
      }
    }
  },
  testSpecification,
  ClassicalComponent
);
export {
  ClassicalComponentBrowserTesteranto
};
