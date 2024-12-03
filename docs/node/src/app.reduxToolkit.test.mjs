import { createRequire } from 'module';const require = createRequire(import.meta.url);
import {
  AppSpecification
} from "../chunk-5K2J4QBY.mjs";
import {
  app_default,
  loginApp,
  require_redux
} from "../chunk-EP6GCRJ6.mjs";
import {
  Node_default
} from "../chunk-R2PNGDRN.mjs";
import {
  assert
} from "../chunk-MSVTAS6Q.mjs";
import "../chunk-Z577W6FW.mjs";
import "../chunk-CTKBT5JH.mjs";
import "../chunk-RBWPBMY4.mjs";
import "../chunk-PJC2V65J.mjs";
import "../chunk-VDOS7AVZ.mjs";
import "../chunk-FLSG3ZVV.mjs";
import {
  __toESM,
  init_cjs_shim
} from "../chunk-THMF2HPO.mjs";

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
