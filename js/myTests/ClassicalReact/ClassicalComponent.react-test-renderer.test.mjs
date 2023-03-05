var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// myTests/ClassicalReact/ClassicalComponent.react-test-renderer.test.tsx
import assert from "assert";

// myTests/ClassicalReact/ClassicalComponent.tsx
import React from "react";
var ClassicalComponent = class extends React.Component {
  constructor(props) {
    console.log("hello ClassicalComponent");
    super(props);
    this.state = {
      count: 0
    };
  }
  componentDidMount() {
    console.info("componentDidMount");
    const y = fetch("http://www.google.com/", { mode: `no-cors` }).then((x) => {
      console.log("i am a genius!");
    });
  }
  render() {
    return /* @__PURE__ */ React.createElement("div", { style: { border: "3px solid green" } }, /* @__PURE__ */ React.createElement("h1", null, "Hello Classical React"), /* @__PURE__ */ React.createElement("pre", { id: "theProps" }, JSON.stringify(this.props)), /* @__PURE__ */ React.createElement("p", null, "foo: ", this.props.foo), /* @__PURE__ */ React.createElement("pre", { id: "theState" }, JSON.stringify(this.state)), /* @__PURE__ */ React.createElement("p", null, "count: ", this.state.count, " times"), /* @__PURE__ */ React.createElement("button", { id: "theButton", onClick: () => __async(this, null, function* () {
      this.setState({ count: this.state.count + 1 });
    }) }, "Click"));
  }
};

// myTests/ClassicalReact/react-test-renderer.testeranto.test.ts
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
    andWhen: function(renderer2, actioner) {
      return __async(this, null, function* () {
        yield act(() => actioner()(renderer2));
        return renderer2;
      });
    }
  }
);

// myTests/ClassicalReact/ClassicalComponent.react-test-renderer.test.tsx
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
