import { createRequire } from 'module';const require = createRequire(import.meta.url);
import {
  node_default
} from "../chunk-RW3YDDAM.mjs";
import {
  require_react
} from "../chunk-2UPDHKQX.mjs";
import "../chunk-Z577W6FW.mjs";
import "../chunk-CTKBT5JH.mjs";
import "../chunk-RBWPBMY4.mjs";
import "../chunk-PJC2V65J.mjs";
import "../chunk-VDOS7AVZ.mjs";
import "../chunk-FLSG3ZVV.mjs";
import {
  __toESM,
  init_cjs_shim
} from "../chunk-THMF2HPO.mjs";

// src/ReactStateAndHook.test.tsx
init_cjs_shim();
import assert from "assert";

// src/ReactStateAndHook.tsx
init_cjs_shim();
var import_react = __toESM(require_react(), 1);
var import_react2 = __toESM(require_react(), 1);
function ReactStateAndHook() {
  const [count, setCount] = (0, import_react2.useState)(0);
  (0, import_react2.useEffect)(() => {
    console.log(`You have clicked the first button ${count} times`);
  }, [count]);
  return /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("pre", null, count), /* @__PURE__ */ import_react.default.createElement("button", { onClick: () => setCount(count + 1) }, "Click me"));
}
var ReactStateAndHook_default = ReactStateAndHook;

// src/ReactStateAndHook.test.tsx
var Specification = (Suite, Given, When, Then, Check) => {
  return [
    Suite.Default(
      "Testing the ReactStateAndHook element",
      {
        "test0": Given.Default(
          [`hello`],
          [],
          [Then.TheCounterIs(0)]
        ),
        "test1": Given.Default(
          [`hello`],
          [When.IClick()],
          [Then.TheCounterIs(1)]
        ),
        "test2": Given.Default(
          [`hello`],
          [When.IClick(), When.IClick(), When.IClick()],
          [Then.TheCounterIs(3)]
        ),
        "test3": Given.Default(
          [`hello`],
          [When.IClick()],
          [Then.TheCounterIs(1)]
        )
      },
      []
    )
  ];
};
var Implementation = {
  suites: {
    Default: "a default suite"
  },
  givens: {
    Default: () => {
      return;
    }
  },
  whens: {
    IClick: () => (rtr) => rtr.root.findByType("button").props.onClick()
  },
  thens: {
    TheCounterIs: (counter) => (rtr) => {
      console.log("hello state and hook");
      return assert.deepEqual(
        rtr.toJSON().children[0],
        {
          type: "pre",
          props: {},
          children: [
            JSON.stringify(counter)
          ]
        }
      );
    }
  },
  checks: {
    /* @ts-ignore:next-line */
    AnEmptyState: () => {
      return {};
    }
  }
};
var ReactStateAndHook_test_default = node_default(
  Implementation,
  Specification,
  ReactStateAndHook_default
);
export {
  ReactStateAndHook_test_default as default
};
