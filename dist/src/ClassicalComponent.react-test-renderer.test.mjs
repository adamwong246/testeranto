import { createRequire } from 'module';const require = createRequire(import.meta.url);
import {
  require_react,
  require_react_dom,
  require_react_test_renderer
} from "../chunk-LYYFLGDM.mjs";
import {
  testSpecification
} from "../chunk-DWQ3RVS7.mjs";
import {
  Node_default
} from "../chunk-NXHDALJ3.mjs";
import {
  __commonJS,
  __toESM
} from "../chunk-UDP42ARI.mjs";

// node_modules/react-dom/client.js
var require_client = __commonJS({
  "node_modules/react-dom/client.js"(exports) {
    "use strict";
    var m = require_react_dom();
    if (process.env.NODE_ENV === "production") {
      exports.createRoot = m.createRoot;
      exports.hydrateRoot = m.hydrateRoot;
    } else {
      i = m.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
      exports.createRoot = function(c, o) {
        i.usingClientEntryPoint = true;
        try {
          return m.createRoot(c, o);
        } finally {
          i.usingClientEntryPoint = false;
        }
      };
      exports.hydrateRoot = function(c, h, o) {
        i.usingClientEntryPoint = true;
        try {
          return m.hydrateRoot(c, h, o);
        } finally {
          i.usingClientEntryPoint = false;
        }
      };
    }
    var i;
  }
});

// src/ClassicalComponent.react-test-renderer.test.tsx
import assert from "assert";

// myTests/react-test-renderer-componnent.testeranto.test.ts
var import_react = __toESM(require_react());
var import_react_test_renderer = __toESM(require_react_test_renderer());
var ReactTestRendererTesteranto = (testImplementations, testSpecifications, testInput) => Node_default(
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
var import_react2 = __toESM(require_react());
var import_client = __toESM(require_client());
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
        return { children: [] };
      }
    }
  },
  testSpecification,
  ClassicalComponent
);
export {
  ClassicalComponentReactTestRendererTesteranto
};
