import { assert } from "chai";

import { IStoreState, loginApp } from "./app";
import { AppSpecification, IAppSpecification, IImplementation } from "./app.test";

import { ReduxTesteranto } from "../myTests/redux.testeranto.test";

const implementations: IImplementation = {
  suites: {
    Default: "some default Suite",
  },
  givens: {
    AnEmptyState: () => () => {
      return loginApp.getInitialState();
    },
    AStateWithEmail: () => (email) => {
      return { ...loginApp.getInitialState(), email };
    },
  },
  whens: {
    TheLoginIsSubmitted: () => [loginApp.actions.signIn],
    TheEmailIsSetTo: (email) => [loginApp.actions.setEmail, email],
    ThePasswordIsSetTo: (password) => [loginApp.actions.setPassword, password],
  },
  thens: {
    TheEmailIs: (email) => (storeState) => {
      assert.equal(storeState.email, email)
    }
    ,
    TheEmailIsNot: (email) => (storeState) =>
      assert.notEqual(storeState.email, email),
    ThePasswordIs: (password) => (selection) =>
      assert.equal(selection.password, password),
    ThePasswordIsNot: (password) => (selection) =>
      assert.notEqual(selection.password, password),
  },
  checks: {
    AnEmptyState: () => () => loginApp.getInitialState(),
  },
};

export const AppReduxTesteranto = ReduxTesteranto<
  IStoreState,
  IAppSpecification
>(
  loginApp.reducer,
  AppSpecification,
  implementations,
);
