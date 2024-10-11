import {
  AppSpecification
} from "../chunk-QABUTIBG.mjs";
import {
  loginApp,
  require_redux
} from "../chunk-GHI2MTJQ.mjs";
import "../chunk-UANIJ4EA.mjs";
import {
  assert
} from "../chunk-ZIFLG7BR.mjs";
import {
  Node_default,
  __toESM,
  init_cjs_shim
} from "../chunk-4YYJXUVQ.mjs";

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
var AppReduxTesteranto = ReduxTesteranto(
  loginApp.reducer,
  AppSpecification,
  {
    suites: {
      Default: "some default Suite"
    },
    givens: {
      AnEmptyState: () => () => {
        return loginApp.getInitialState();
      },
      AStateWithEmail: (x) => (email) => {
        console.log("mark106", email, x);
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
        console.log("mark40", email, storeState);
        assert.equal(storeState.email, email);
      },
      TheEmailIsNot: (email) => (storeState) => assert.notEqual(storeState.email, email),
      ThePasswordIs: (password) => (selection) => assert.equal(selection.password, password),
      ThePasswordIsNot: (password) => (selection) => assert.notEqual(selection.password, password)
    },
    checks: {
      AnEmptyState: () => loginApp.getInitialState()
    }
  }
);
export {
  AppReduxTesteranto
};
