import {
  ClassicalComponent
} from "../../../chunk-44RV3NTB.mjs";
import {
  require_react_test_renderer
} from "../../../chunk-SZTMN6AQ.mjs";
import {
  assert
} from "../../../chunk-TM6NCEZK.mjs";
import {
  Node_default,
  __toESM,
  init_cjs_shim
} from "../../../chunk-ZUOHA3DK.mjs";

// src/ClassicalComponent/react-test-renderer/node.test.tsx
init_cjs_shim();

// node_modules/testeranto/dist/module/SubPackages/react-test-renderer/component/node.js
init_cjs_shim();

// node_modules/testeranto/dist/module/SubPackages/react-test-renderer/component/index.js
init_cjs_shim();
var import_react_test_renderer = __toESM(require_react_test_renderer(), 1);
import React from "react";
var testInterface = {
  beforeEach: function(CComponent, propsAndChildren) {
    function Link(props) {
      const p = props.props;
      const c = props.children;
      return React.createElement(CComponent, p, c);
    }
    return new Promise((res, rej) => {
      (0, import_react_test_renderer.act)(async () => {
        const p = propsAndChildren;
        const y = new CComponent(p.props);
        const testRenderer = await import_react_test_renderer.default.create(Link(propsAndChildren));
        res(testRenderer);
      });
    });
  },
  andWhen: async function(renderer2, whenCB) {
    console.log("andWhen", whenCB);
    await (0, import_react_test_renderer.act)(() => whenCB(renderer2));
    return renderer2;
  },
  // andWhen: function (s: Store, whenCB): Promise<Selection> {
  //   return whenCB()(s);
  // },
  butThen: async function(s) {
    return s;
  },
  afterEach: async function(store, ndx, artificer) {
    return {};
  },
  afterAll: (store, artificer) => {
    return;
  }
};

// node_modules/testeranto/dist/module/SubPackages/react-test-renderer/component/node.js
var node_default = (testImplementations, testSpecifications, testInput) => Node_default(testInput, testSpecifications, testImplementations, testInterface);

// src/ClassicalComponent/test.ts
init_cjs_shim();
var ClassicalComponentSpec = (Suite, Given, When, Then, Check) => {
  return [
    Suite.Default(
      "a classical react component",
      {
        "test0": Given.AnEmptyState(
          ["test"],
          [],
          [
            Then.ThePropsIs(['{"foo":"bar"}']),
            Then.TheStatusIs({ count: 0 })
          ]
        ),
        "test1": Given.AnEmptyState(
          ["test"],
          [When.IClickTheButton()],
          [Then.ThePropsIs(['{"foo":"bar"}']), Then.TheStatusIs({ count: 1 })]
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

// src/ClassicalComponent/react-test-renderer/test.tsx
init_cjs_shim();
var testImplementation = {
  Suites: {
    Default: "default"
  },
  Givens: {
    AnEmptyState: { props: { foo: "bar" } }
  },
  Whens: {
    IClickTheButton: (x) => (component) => {
      component.root.findByType("button").props.onClick();
    }
  },
  Thens: {
    ThePropsIs: (expectation) => (component) => {
      console.log("ThePropsIs", component.toJSON().children[1]);
      return assert.deepEqual(component.toJSON().children[1], {
        type: "pre",
        props: { id: "theProps" },
        children: expectation
      });
    },
    TheStatusIs: (expectation) => (component) => {
    }
  },
  Checks: {
    AnEmptyState: () => (CComponent) => {
      return { children: [], foo: "bar" };
    }
  }
};

// src/ClassicalComponent/react-test-renderer/node.test.tsx
var node_test_default = node_default(
  testImplementation,
  ClassicalComponentSpec,
  ClassicalComponent
);
export {
  node_test_default as default
};
