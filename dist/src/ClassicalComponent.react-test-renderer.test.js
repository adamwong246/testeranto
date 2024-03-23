"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/ClassicalComponent.react-test-renderer.test.tsx
var ClassicalComponent_react_test_renderer_test_exports = {};
__export(ClassicalComponent_react_test_renderer_test_exports, {
  ClassicalComponentReactTestRendererTesteranto: () => ClassicalComponentReactTestRendererTesteranto
});
module.exports = __toCommonJS(ClassicalComponent_react_test_renderer_test_exports);
var import_assert = __toESM(require("assert"));

// myTests/react-test-renderer-componnent.testeranto.test.ts
var import_react = __toESM(require("react"));
var import_react_test_renderer = __toESM(require("react-test-renderer"));
var import_Node = __toESM(require("testeranto/src/Node"));
var ReactTestRendererTesteranto = (testImplementations, testSpecifications, testInput) => (0, import_Node.default)(
  testInput,
  testSpecifications,
  testImplementations,
  {
    beforeEach: function(CComponent, props) {
      let component;
      (0, import_react_test_renderer.act)(() => {
        component = import_react_test_renderer.default.create(
          import_react.default.createElement(CComponent, props, [])
        );
      });
      return component;
    },
    andWhen: async function(renderer2, actioner) {
      await (0, import_react_test_renderer.act)(() => actioner()(renderer2));
      return renderer2;
    }
  }
);

// src/ClassicalComponent.tsx
var import_react2 = __toESM(require("react"));
var import_client = __toESM(require("react-dom/client"));
var ClassicalComponent = class extends import_react2.default.Component {
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
    return /* @__PURE__ */ import_react2.default.createElement("div", { style: { border: "3px solid green" } }, /* @__PURE__ */ import_react2.default.createElement("h1", null, "Hello Marcus"), /* @__PURE__ */ import_react2.default.createElement("pre", { id: "theProps" }, JSON.stringify(this.props)), /* @__PURE__ */ import_react2.default.createElement("p", null, "foo: ", this.props.foo), /* @__PURE__ */ import_react2.default.createElement("pre", { id: "theState" }, JSON.stringify(this.state)), /* @__PURE__ */ import_react2.default.createElement("p", null, "count: ", this.state.count, " times"), /* @__PURE__ */ import_react2.default.createElement("button", { id: "theButton", onClick: async () => {
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

// src/ClassicalComponent.react-test-renderer.test.tsx
var ClassicalComponentReactTestRendererTesteranto = ReactTestRendererTesteranto(
  {
    Suites: {
      Default: "some default Suite"
    },
    Givens: {
      AnEmptyState: () => {
        return { children: [] };
      }
    },
    Whens: {
      IClickTheButton: () => (component) => component.root.findByType("button").props.onClick()
    },
    Thens: {
      ThePropsIs: (expectation) => (component) => {
        return import_assert.default.deepEqual(component.toJSON().children[1], {
          type: "pre",
          props: { id: "theProps" },
          children: [
            JSON.stringify(expectation)
          ]
        });
      },
      TheStatusIs: (expectation) => (component) => {
        return import_assert.default.deepEqual(component.toJSON().children[3], {
          type: "pre",
          props: { id: "theState" },
          children: [
            JSON.stringify(expectation)
          ]
        });
      }
    },
    Checks: {
      AnEmptyState: () => {
        return { children: [] };
      }
    }
  },
  testSpecification,
  ClassicalComponent
);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ClassicalComponentReactTestRendererTesteranto
});
