import {
  LoginPageSpecs,
  LoginPage_default,
  actions
} from "../../../chunk-6JXA32GL.mjs";
import "../../../chunk-FH7RWEQP.mjs";
import {
  Web_default,
  assert
} from "../../../chunk-ZFPTK2OM.mjs";
import "../../../chunk-XALKSG2U.mjs";

// node_modules/testeranto/dist/module/SubPackages/react/jsx/index.js
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

// node_modules/testeranto/dist/module/SubPackages/react/jsx/web.js
var web_default = (testImplementations, testSpecifications, testInput, testInterface2 = testInterface) => {
  return Web_default(testInput, testSpecifications, testImplementations, testInterface2(testInput));
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

// src/LoginPage/react/web.test.tsx
var web_test_default = web_default(
  test_default,
  LoginPageSpecs,
  LoginPage_default,
  LoginPageReactTestInterface
);
export {
  web_test_default as default
};
