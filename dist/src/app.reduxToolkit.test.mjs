import {
  AppSpecification
} from "../chunk-FQ5MI744.mjs";
import {
  app_default,
  loginApp,
  require_redux
} from "../chunk-44S2XTSJ.mjs";
import {
  assert
} from "../chunk-JBK64OIJ.mjs";
import {
  Node_default,
  __toESM,
  init_cjs_shim
} from "../chunk-37RU6URC.mjs";

// src/app.reduxToolkit.test.ts
init_cjs_shim();

// myTests/reduxToolkit.testeranto.test.ts
init_cjs_shim();
var import_redux = __toESM(require_redux(), 1);
var ReduxToolkitTesteranto = (testImplementations, testSpecifications, testInput) => {
  const testInterface = {
    assertThis: (t) => {
      t[0](t[1], t[2], t[3]);
    },
    beforeEach: (subject, initializer, art, tr, initialValues) => {
      return (0, import_redux.createStore)(subject.reducer, initializer()(initialValues));
    },
    andWhen: async function(store, actioner) {
      const a = actioner;
      store.dispatch(a[0](a[1]));
      return await store;
    },
    butThen: function(store, tr) {
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
