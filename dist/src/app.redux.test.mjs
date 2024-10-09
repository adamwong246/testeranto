import { createRequire } from 'module';const require = createRequire(import.meta.url);
import {
  AppSpecification
} from "../chunk-P37RQIVG.mjs";
import {
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

// myTests/redux.testeranto.test.ts
var import_redux = __toESM(require_redux());
var ReduxTesteranto = (testInput, testSpecifications, testImplementations) => Node_default(
  testInput,
  testSpecifications,
  testImplementations,
  {
    beforeEach: function(subject, initializer, art, tr, initialValues) {
      return (0, import_redux.createStore)(subject, initializer()(initialValues));
    },
    andWhen: async function(store, actioner) {
      const a = actioner;
      store.dispatch(a[0](a[1]));
      return await store;
    },
    butThen: function(store) {
      return store.getState();
    }
  }
);

// src/app.redux.test.ts
var AppReduxTesteranto = ReduxTesteranto(
  loginApp.reducer,
  AppSpecification,
  {
    Suites: {
      Default: "some default Suite"
    },
    Givens: {
      AnEmptyState: () => () => {
        return loginApp.getInitialState();
      },
      AStateWithEmail: (x) => (email) => {
        console.log("mark106", email, x);
        return { ...loginApp.getInitialState(), email };
      }
    },
    Whens: {
      TheLoginIsSubmitted: () => [loginApp.actions.signIn],
      TheEmailIsSetTo: (email) => [loginApp.actions.setEmail, email],
      ThePasswordIsSetTo: (password) => [loginApp.actions.setPassword, password]
    },
    Thens: {
      TheEmailIs: (email) => (storeState) => {
        console.log("mark40", email, storeState);
        assert.equal(storeState.email, email);
      },
      TheEmailIsNot: (email) => (storeState) => assert.notEqual(storeState.email, email),
      ThePasswordIs: (password) => (selection) => assert.equal(selection.password, password),
      ThePasswordIsNot: (password) => (selection) => assert.notEqual(selection.password, password)
    },
    Checks: {
      AnEmptyState: () => loginApp.getInitialState()
    }
  }
);
export {
  AppReduxTesteranto
};
