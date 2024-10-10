import {
  LoginPageSpecs,
  LoginPage_default,
  actions
} from "../../../chunk-GMVT2KMC.mjs";
import "../../../chunk-K6VSGQWW.mjs";
import "../../../chunk-Y2IYZMNU.mjs";
import "../../../chunk-P32AR2RA.mjs";
import {
  assert
} from "../../../chunk-TM6NCEZK.mjs";
import {
  Node_default,
  init_cjs_shim
} from "../../../chunk-ZUOHA3DK.mjs";

// src/LoginPage/react/node.test.tsx
init_cjs_shim();

// node_modules/testeranto/dist/module/SubPackages/react/jsx/node.js
init_cjs_shim();

// node_modules/testeranto/dist/module/SubPackages/react/jsx/index.js
init_cjs_shim();
var testInterface = (z) => {
  return {
    beforeEach: async (x, ndx, testRsource, artificer) => {
      return new Promise((resolve, rej) => {
        resolve(x());
      });
    },
    andWhen: function(s, whenCB) {
      return whenCB(s);
    }
  };
};

// node_modules/testeranto/dist/module/SubPackages/react/jsx/node.js
var node_default = (testImplementations, testSpecifications, testInput, testInterface2 = testInterface) => {
  return Node_default(testInput, testSpecifications, testImplementations, testInterface2(testInput));
};

// src/LoginPage/react/test.tsx
init_cjs_shim();
var LoginPageReactTestInterface = (testInput) => {
  return {
    beforeEach: async (x, ndx, testRsource, artificer) => {
      return new Promise((resolve, rej) => {
        const t = testInput();
        t.props.store.dispatch(actions.reset());
        resolve(t);
      });
    },
    andWhen: function(s, whenCB) {
      return whenCB(s);
    }
  };
};
var implementations = {
  Suites: {
    Default: "a default suite"
  },
  Givens: {
    default: () => (i) => {
      return i;
    }
  },
  Whens: {
    TheLoginIsSubmitted: () => (reactElem) => {
      reactElem.props.store.dispatch(actions.signIn());
    },
    TheEmailIsSetTo: (email) => (reactElem) => {
      reactElem.props.store.dispatch(actions.setEmail(email));
    },
    ThePasswordIsSetTo: (password) => (reactElem) => {
      reactElem.props.store.dispatch(actions.setPassword(password));
    }
  },
  Thens: {
    TheEmailIs: (email) => (reactElem) => {
      assert.equal(reactElem.props.store.getState().email, email);
    },
    TheEmailIsNot: (email) => (reactElem) => {
      assert.notEqual(reactElem.props.store.getState().email, email);
    },
    ThePasswordIs: (password) => (reactElem) => {
      assert.equal(reactElem.props.store.getState().password, password);
    },
    ThePasswordIsNot: (password) => (reactElem) => {
      assert.notEqual(reactElem.props.store.getState().password, password);
    },
    ThereIsAnEmailError: () => (reactElem) => {
      assert.notEqual(reactElem.props.store.getState().error, "no_error");
    },
    ThereIsNotAnEmailError: () => (reactElem) => {
      assert.equal(reactElem.props.store.getState().error, "no_error");
    }
  },
  Checks: {
    default: () => (i) => {
      return i;
    }
  }
};
var test_default = implementations;

// src/LoginPage/react/node.test.tsx
var node_test_default = node_default(
  test_default,
  LoginPageSpecs,
  LoginPage_default,
  LoginPageReactTestInterface
);
export {
  node_test_default as default
};
