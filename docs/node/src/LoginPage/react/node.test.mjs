import { createRequire } from 'module';const require = createRequire(import.meta.url);
import {
  LoginPageSpecs,
  LoginPage_default,
  actions
} from "../../../chunk-WKEXWKBI.mjs";
import {
  Node_default
} from "../../../chunk-MHG2GESM.mjs";
import "../../../chunk-EP6GCRJ6.mjs";
import {
  assert
} from "../../../chunk-MSVTAS6Q.mjs";
import "../../../chunk-Z577W6FW.mjs";
import "../../../chunk-CTKBT5JH.mjs";
import "../../../chunk-RBWPBMY4.mjs";
import "../../../chunk-PJC2V65J.mjs";
import "../../../chunk-VDOS7AVZ.mjs";
import "../../../chunk-FLSG3ZVV.mjs";
import {
  init_cjs_shim
} from "../../../chunk-THMF2HPO.mjs";

// src/LoginPage/react/node.test.tsx
init_cjs_shim();

// ../testeranto/dist/module/SubPackages/react/jsx/node.js
init_cjs_shim();

// ../testeranto/dist/module/SubPackages/react/jsx/index.js
init_cjs_shim();
var testInterface = {
  beforeEach: async (x, ndx, testRsource, artificer) => {
    return new Promise((resolve, rej) => {
      resolve(x());
    });
  },
  andWhen: function(s, whenCB) {
    return whenCB(s);
  }
};

// ../testeranto/dist/module/SubPackages/react/jsx/node.js
var node_default = (testImplementations, testSpecifications, testInput, testInterface2) => {
  return Node_default(testInput, testSpecifications, testImplementations, Object.assign(Object.assign({}, testInterface), testInterface2));
};

// src/LoginPage/react/test.tsx
init_cjs_shim();
var implementations = {
  suites: {
    Default: "a default suite"
  },
  givens: {
    default: () => (i) => {
      return i;
    }
  },
  whens: {
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
  thens: {
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
      console.log("hello");
      assert.equal(reactElem.props.store.getState().error, "no_error");
    }
  },
  checks: {
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
  LoginPage_default
  // {
  //   afterAll: () => {
  //   }
  // }
);
export {
  node_test_default as default
};
