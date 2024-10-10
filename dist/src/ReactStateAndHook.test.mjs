import {
  node_default
} from "../chunk-VZHBZ4OD.mjs";
import "../chunk-SZTMN6AQ.mjs";
import {
  init_cjs_shim
} from "../chunk-ZUOHA3DK.mjs";

// src/ReactStateAndHook.test.tsx
init_cjs_shim();
import assert from "assert";

// src/ReactStateAndHook.tsx
init_cjs_shim();
import React from "react";
import { useState, useEffect } from "react";
function ReactStateAndHook() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    console.log(`You have clicked the first button ${count} times`);
  }, [count]);
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("pre", null, count), /* @__PURE__ */ React.createElement("button", { onClick: () => setCount(count + 1) }, "Click me"));
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
  Suites: {
    Default: "a default suite"
  },
  Givens: {
    Default: () => {
      return;
    }
  },
  Whens: {
    IClick: () => (rtr) => rtr.root.findByType("button").props.onClick()
  },
  Thens: {
    TheCounterIs: (counter) => (rtr) => {
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
  Checks: {
    /* @ts-ignore:next-line */
    AnEmptyState: () => {
      return {};
    }
  }
};
var ClassicalComponentReactTestRendererTesteranto = node_default(
  Implementation,
  Specification,
  ReactStateAndHook_default
);
export {
  ClassicalComponentReactTestRendererTesteranto
};
