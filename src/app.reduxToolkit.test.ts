import { assert } from "chai";

import { AppSpecification, IAppSpecification } from "./app.test";
import app, { IStoreState, loginApp } from "./app";
import { ILoginPageSelection } from "./LoginPage";

import { ReduxToolkitTesteranto } from "../myTests/reduxToolkit.testeranto.test";

const core = app();
const selector = core.select.loginPageSelection;
const reducer = core.app.reducer;

export const AppReduxToolkitTesteranto = ReduxToolkitTesteranto<
  IStoreState,
  ILoginPageSelection,
  IAppSpecification
>(
  {
    Suites: {
      Default: "some default Suite",
    },
    Givens: {
      AnEmptyState: () => {
        return loginApp.getInitialState();
      },
      AStateWithEmail: (email) => {
        return { ...loginApp.getInitialState(), email };
      },
    },
    Whens: {
      TheLoginIsSubmitted: () => [loginApp.actions.signIn],
      TheEmailIsSetTo: (email) => [loginApp.actions.setEmail, email],
      ThePasswordIsSetTo: (password) => [loginApp.actions.setPassword, password],
    },
    Thens: {
      TheEmailIs: (email) => (selection) =>
        [assert.equal, selection.email, email, "a nice message"],
      TheEmailIsNot: (email) => (selection) =>
        [assert.notEqual, selection.email, email],
      ThePasswordIs: (password) => (selection) =>
        [assert.equal, selection.password, password],
      ThePasswordIsNot: (password) => (selection) =>
        [assert.notEqual, selection.password, password],
    },
    Checks: {
      AnEmptyState: () => loginApp.getInitialState(),
    },
  },
  AppSpecification,
  { reducer, selector },
);
