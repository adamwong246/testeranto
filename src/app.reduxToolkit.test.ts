import { assert } from "chai";

import { AppSpecification, IAppSpecification, IImplementation } from "./app.test";
import app, { IStoreState, loginApp } from "./app";
import { ILoginPageSelection } from "./LoginPage";

import { ReduxToolkitTesteranto } from "../myTests/reduxToolkit.testeranto.test";

const core = app();
const selector = core.select.loginPageSelection;
const reducer = core.app.reducer;

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
    TheEmailIs: (email) => (selection) =>
      [assert.equal, selection.email, email, "a nice message"],
    TheEmailIsNot: (email) => (selection) =>
      [assert.notEqual, selection.email, email],
    ThePasswordIs: (password) => (selection) =>
      [assert.equal, selection.password, password],
    ThePasswordIsNot: (password) => (selection) =>
      [assert.notEqual, selection.password, password],
  },
  checks: {
    AnEmptyState: () => () => loginApp.getInitialState(),
  },
};

export const AppReduxToolkitTesteranto = ReduxToolkitTesteranto<
  IStoreState,
  ILoginPageSelection,
  IAppSpecification
>(
  implementations,
  AppSpecification,
  { reducer, selector },
);
