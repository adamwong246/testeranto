import {
  require_react_test_renderer
} from "../../../chunk-SDPG7AIW.mjs";
import {
  ClassicalComponent,
  ClassicalComponentSpec
} from "../../../chunk-RCXHALEU.mjs";
import "../../../chunk-7AHWTSRZ.mjs";
import {
  require_react
} from "../../../chunk-FH7RWEQP.mjs";
import {
  Web_default,
  assert
} from "../../../chunk-ZFPTK2OM.mjs";
import {
  __toESM
} from "../../../chunk-XALKSG2U.mjs";

// node_modules/testeranto/dist/module/SubPackages/react-test-renderer/component/index.js
var import_react = __toESM(require_react(), 1);
var import_react_test_renderer = __toESM(require_react_test_renderer(), 1);
var testInterface = {
  beforeEach: function(CComponent, propsAndChildren) {
    function Link(props) {
      const p = props.props;
      const c = props.children;
      return import_react.default.createElement(CComponent, p, c);
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

// node_modules/testeranto/dist/module/SubPackages/react-test-renderer/component/web.js
var web_default = (testImplementations, testSpecifications, testInput) => Web_default(testInput, testSpecifications, testImplementations, testInterface);

// src/ClassicalComponent/react-test-renderer/test.tsx
var testImplementation = {
  suites: {
    Default: "default"
  },
  givens: {
    AnEmptyState: { props: { foo: "bar" } }
  },
  whens: {
    IClickTheButton: (x) => (component) => {
      component.root.findByType("button").props.onClick();
    }
  },
  thens: {
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
  checks: {
    AnEmptyState: () => (CComponent) => {
      return { children: [], foo: "bar" };
    }
  }
};

// src/ClassicalComponent/react-test-renderer/web.test.tsx
var web_test_default = web_default(
  testImplementation,
  ClassicalComponentSpec,
  ClassicalComponent
);
export {
  web_test_default as default
};
