// tests/ClassicalReact/ClassicalComponent.react-test-renderer.test.tsx
import assert from "assert";
import { features } from "/Users/adam/Code/kokomoBay/dist/tests/testerantoFeatures.test.js";

// tests/ClassicalReact/ClassicalComponent.tsx
import React from "react";
var ClassicalComponent = class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }
  render() {
    return /* @__PURE__ */ React.createElement("div", { style: { border: "3px solid green" } }, /* @__PURE__ */ React.createElement("h1", null, "Hello Classical React"), /* @__PURE__ */ React.createElement("pre", { id: "theProps" }, JSON.stringify(this.props)), /* @__PURE__ */ React.createElement("p", null, "foo: ", this.props.foo), /* @__PURE__ */ React.createElement("pre", { id: "theState" }, JSON.stringify(this.state)), /* @__PURE__ */ React.createElement("p", null, "count: ", this.state.count, " times"), /* @__PURE__ */ React.createElement("button", { id: "theButton", onClick: () => {
      this.setState({ count: this.state.count + 1 });
    } }, "Click"));
  }
};

// tests/ClassicalReact/react-test-renderer.testeranto.test.ts
import React2 from "react";
import renderer, { act } from "react-test-renderer";
import { Testeranto } from "testeranto";
var ReactTestRendererTesteranto = (testImplementations, testSpecifications, testInput) => Testeranto(
  testInput,
  testSpecifications,
  testImplementations,
  { ports: 0 },
  {
    beforeEach: function(CComponent, props) {
      let component;
      act(() => {
        component = renderer.create(
          React2.createElement(CComponent, props, [])
        );
      });
      return component;
    },
    andWhen: async function(renderer2, actioner) {
      await act(() => actioner()(renderer2));
      return renderer2;
    }
  }
);

// tests/ClassicalReact/ClassicalComponent.react-test-renderer.test.tsx
var myFeature = features.hello;
var ClassicalComponentReactTestRendererTesteranto = ReactTestRendererTesteranto(
  {
    Suites: {
      Default: "some default Suite"
    },
    Givens: {
      AnEmptyState: () => {
        return {};
      },
      SomeState: () => {
        return { foo: "bar" };
      }
    },
    Whens: {
      IClickTheButton: () => (component) => component.root.findByType("button").props.onClick()
    },
    Thens: {
      ThePropsIs: (expectation) => (component) => {
        return assert.deepEqual(component.toJSON().children[1], {
          type: "pre",
          props: { id: "theProps" },
          children: [
            JSON.stringify(expectation)
          ]
        });
      },
      TheStatusIs: (expectation) => (component) => {
        return assert.deepEqual(component.toJSON().children[3], {
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
        return {};
      }
    }
  },
  (Suite, Given, When, Then, Check) => {
    return [
      Suite.Default(
        "a classical react component, bundled with esbuild and tested with puppeteer",
        [
          Given.AnEmptyState(
            [],
            [
              When.IClickTheButton()
            ],
            [
              Then.ThePropsIs({ "children": [] }),
              Then.TheStatusIs({ "count": 1 })
            ]
          ),
          Given.AnEmptyState(
            [],
            [
              When.IClickTheButton(),
              When.IClickTheButton(),
              When.IClickTheButton()
            ],
            [
              Then.TheStatusIs({ "count": 3 })
            ]
          )
        ],
        []
      )
    ];
  },
  ClassicalComponent
);
export {
  ClassicalComponentReactTestRendererTesteranto
};
