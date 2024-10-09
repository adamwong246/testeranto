import { createRequire } from 'module';const require = createRequire(import.meta.url);
import {
  AppSpecification
} from "../chunk-P37RQIVG.mjs";
import {
  app_default,
  loginApp,
  require_redux
} from "../chunk-NXTG6YV5.mjs";
import {
  assert
} from "../chunk-NLCBXMNY.mjs";
import {
  Node_default,
  __toESM
} from "../chunk-WJAA5JYT.mjs";

// myTests/reduxToolkit.testeranto.test.ts
var import_redux = __toESM(require_redux());
var ReduxToolkitTesteranto = (testImplementations, testSpecifications, testInput) => Node_default(
  testInput,
  testSpecifications,
  testImplementations,
  {
    beforeEach: (subject, initializer, art, tr, initialValues) => {
      return (0, import_redux.createStore)(subject.reducer, initializer()(initialValues));
    },
    andWhen: async function(store, actioner) {
      const a = actioner;
      store.dispatch(a[0](a[1]));
      return await store;
    },
    butThen: function(store, assertion) {
      const state = store.getState();
      const t = assertion(state);
      t[0](t[1], t[2], t[3]);
      return state;
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
      AnEmptyState: () => () => {
        return loginApp.getInitialState();
      },
      AStateWithEmail: () => (email) => {
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
