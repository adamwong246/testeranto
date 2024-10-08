import { createRequire } from 'module';const require = createRequire(import.meta.url);
import {
  LoginPageSpecs,
  LoginPage_default,
  actions
} from "../../../chunk-WM6WS5W3.mjs";
import {
  Node_default,
  assert
} from "../../../chunk-SH5JMW7W.mjs";

// node_modules/testeranto/dist/module/SubPackages/react/jsx/index.js
var testInterface = (testInput) => {
  return {
    beforeEach: async (x, ndx, testRsource, artificer) => {
      return new Promise((resolve, rej) => {
        resolve(testInput());
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
