import {
  require_react_test_renderer
} from "./chunk-GFODJQ5I.mjs";
import {
  Node_default,
  __toESM,
  init_cjs_shim
} from "./chunk-NZ4HNE5B.mjs";

// node_modules/testeranto/dist/module/SubPackages/react-test-renderer/jsx/node.js
init_cjs_shim();

// node_modules/testeranto/dist/module/SubPackages/react-test-renderer/jsx/index.js
init_cjs_shim();
var import_react_test_renderer = __toESM(require_react_test_renderer(), 1);
import React from "react";
var testInterface = {
  butThen: async function(s, thenCB, tr) {
    console.log("butThen", thenCB.toString());
    return thenCB(s);
  },
  beforeEach: function(CComponent, props) {
    console.log("ASDASDx");
    let component;
    (0, import_react_test_renderer.act)(() => {
      component = import_react_test_renderer.default.create(React.createElement(CComponent, props, []));
    });
    return component;
  },
  andWhen: async function(renderer2, whenCB) {
    await (0, import_react_test_renderer.act)(() => whenCB(renderer2));
    return renderer2;
  }
};

// node_modules/testeranto/dist/module/SubPackages/react-test-renderer/jsx/node.js
var node_default = (testImplementations, testSpecifications, testInput, testInterface2 = testInterface) => {
  return Node_default(testInput, testSpecifications, testImplementations, testInterface2);
};

export {
  node_default
};
