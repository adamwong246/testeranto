import { createRequire } from 'module';const require = createRequire(import.meta.url);
import {
  AppSpecification
} from "../chunk-EYV3TTNW.mjs";
import {
  app_default,
  loginApp,
  require_redux
} from "../chunk-FWCV2CYO.mjs";
import {
  Node_default
} from "../chunk-O3OSUFIX.mjs";
import {
  assert
} from "../chunk-7DTFZFDN.mjs";
import "../chunk-CDRQ6FZS.mjs";
import "../chunk-6SZJES2S.mjs";
import "../chunk-BRBW5YJH.mjs";
import "../chunk-S5L4ZC6L.mjs";
import "../chunk-LE3VN4X4.mjs";
import "../chunk-GF7QN4NN.mjs";
import {
  __toESM,
  init_cjs_shim
} from "../chunk-4IESOCHA.mjs";

// src/app.reduxToolkit.test.ts
init_cjs_shim();

// subPackages/reduxToolkit.testeranto.test.ts
init_cjs_shim();
var import_redux = __toESM(require_redux(), 1);
var ReduxToolkitTesteranto = (testImplementations, testSpecifications, testInput) => {
  const testInterface = {
    assertThis: (t) => {
      t[0](t[1], t[2], t[3]);
    },
    beforeEach: (subject, initializer, art, tr, initialValues) => {
      return (0, import_redux.createStore)(
        subject.reducer,
        initializer()(initialValues)
      );
    },
    andWhen: async function(store, actioner, tr) {
      const a = actioner;
      store.dispatch(a[0](a[1]));
      return store;
    },
    butThen: async function(store, actioner, tr) {
      console.log("args", arguments);
      return actioner(store.getState());
    }
  };
  return Node_default(
    testInput,
    testSpecifications,
    testImplementations,
    testInterface
  );
};

// src/app.reduxToolkit.test.ts
var core = app_default();
var selector = core.select.loginPageSelection;
var reducer = core.app.reducer;
var implementations = {
  suites: {
    Default: "some default Suite"
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
    TheEmailIs: (email) => (selection) => [assert.equal, selection.email, email, "a nice message"],
    TheEmailIsNot: (email) => (selection) => [assert.notEqual, selection.email, email],
    ThePasswordIs: (password) => (selection) => [assert.equal, selection.password, password],
    ThePasswordIsNot: (password) => (selection) => [assert.notEqual, selection.password, password]
  },
  checks: {
    AnEmptyState: () => () => loginApp.getInitialState()
  }
};
var app_reduxToolkit_test_default = ReduxToolkitTesteranto(implementations, AppSpecification, { reducer, selector });
export {
  app_reduxToolkit_test_default as default
};
