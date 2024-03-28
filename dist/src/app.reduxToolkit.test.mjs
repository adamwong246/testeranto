import { createRequire } from 'module';const require = createRequire(import.meta.url);
import {
  AppSpecification
} from "../chunk-P37RQIVG.mjs";
import {
  app_default,
  loginApp,
  require_redux
} from "../chunk-3BX56FIJ.mjs";
import {
  assert
} from "../chunk-NMBJLDFX.mjs";
import {
  Node_default
} from "../chunk-NXHDALJ3.mjs";
import {
  __toESM
} from "../chunk-UDP42ARI.mjs";

// myTests/reduxToolkit.testeranto.test.ts
var import_redux = __toESM(require_redux());
var ReduxToolkitTesteranto = (testImplementations, testSpecifications, testInput) => Node_default(
  testInput,
  testSpecifications,
  testImplementations,
  {
    beforeEach: (subject, initialValues) => (0, import_redux.createStore)(subject.reducer, initialValues),
    andWhen: function(store, actioner) {
      const a = actioner();
      return store.dispatch(a[0](a[1]));
    },
    butThen: function(store) {
      return store.getState();
    },
    assertioner: function(t) {
      return t[0](t[1], t[2], t[3]);
    }
  }
);

// src/app.reduxToolkit.test.ts
var core = app_default();
var selector = core.select.loginPageSelection;
var reducer = core.app.reducer;
var AppReduxToolkitTesteranto = ReduxToolkitTesteranto(
  {
    Suites: {
      Default: "some default Suite"
    },
    Givens: {
      AnEmptyState: () => {
        return loginApp.getInitialState();
      },
      AStateWithEmail: (email) => {
        return { ...loginApp.getInitialState(), email };
      }
    },
    Whens: {
      TheLoginIsSubmitted: () => [loginApp.actions.signIn],
      TheEmailIsSetTo: (email) => [loginApp.actions.setEmail, email],
      ThePasswordIsSetTo: (password) => [loginApp.actions.setPassword, password]
    },
    Thens: {
      TheEmailIs: (email) => (selection) => [assert.equal, selection.email, email, "a nice message"],
      TheEmailIsNot: (email) => (selection) => [assert.notEqual, selection.email, email],
      ThePasswordIs: (password) => (selection) => [assert.equal, selection.password, password],
      ThePasswordIsNot: (password) => (selection) => [assert.notEqual, selection.password, password]
    },
    Checks: {
      AnEmptyState: () => loginApp.getInitialState()
    }
  },
  AppSpecification,
  { reducer, selector }
);
export {
  AppReduxToolkitTesteranto
};
