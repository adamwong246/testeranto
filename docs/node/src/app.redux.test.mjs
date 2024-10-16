import { createRequire } from 'module';const require = createRequire(import.meta.url);
import {
  AppSpecification,
  Node_default
} from "../chunk-MRU4BZ2U.mjs";
import {
  loginApp,
  require_redux
} from "../chunk-562JFTRV.mjs";
import {
  assert
} from "../chunk-Q4NYQHGO.mjs";
import "../chunk-DIETH6TS.mjs";
import "../chunk-HLUKRQNO.mjs";
import "../chunk-676TEQ6V.mjs";
import {
  __toESM,
  init_cjs_shim
} from "../chunk-BJRHXCMP.mjs";

// src/app.redux.test.ts
init_cjs_shim();

// myTests/redux.testeranto.test.ts
init_cjs_shim();
var import_redux = __toESM(require_redux(), 1);
var ReduxTesteranto = (testInput, testSpecifications, testImplementations) => {
  const testInterface = {
    beforeEach: function(subject, initializer, art, tr, initialValues) {
      return (0, import_redux.createStore)(subject, initializer()(initialValues));
    },
    andWhen: async function(store, whenCB) {
      const a = whenCB;
      store.dispatch(a[0](a[1]));
      return store;
    },
    butThen: async function(store) {
      return store.getState();
    }
  };
  return Node_default(
    testInput,
    testSpecifications,
    testImplementations,
    testInterface
  );
};

// src/app.redux.test.ts
var implementations = {
  suites: {
    Default: "some default Suite!"
  },
  givens: {
    AnEmptyState: () => () => {
      return loginApp.getInitialState();
    },
    AStateWithEmail: () => (email) => {
      return { ...loginApp.getInitialState(), email };
    }
  },
  whens: {
    TheLoginIsSubmitted: () => [loginApp.actions.signIn],
    TheEmailIsSetTo: (email) => [loginApp.actions.setEmail, email],
    ThePasswordIsSetTo: (password) => [loginApp.actions.setPassword, password]
  },
  thens: {
    TheEmailIs: (email) => (storeState) => {
      assert.equal(storeState.email, email);
    },
    TheEmailIsNot: (email) => (storeState) => assert.notEqual(storeState.email, email),
    ThePasswordIs: (password) => (selection) => assert.equal(selection.password, password),
    ThePasswordIsNot: (password) => (selection) => assert.notEqual(selection.password, password)
  },
  checks: {
    AnEmptyState: () => () => loginApp.getInitialState()
  }
};
var app_redux_test_default = ReduxTesteranto(
  loginApp.reducer,
  AppSpecification,
  implementations
);
export {
  app_redux_test_default as default
};
