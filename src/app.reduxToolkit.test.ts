import { ITestImplementation } from "testeranto/src/Types";

import { assert } from "chai";

import {
  ActionCreatorWithNonInferrablePayload,
  ActionCreatorWithoutPayload,
} from "@reduxjs/toolkit";

import { ReduxToolkitTesteranto } from "../subPackages/reduxToolkit.testeranto.test";

import { AppSpecification, IAppSpecification } from "./app.test";
import app, { IStoreState, loginApp } from "./app";
import { ILoginPageSelection } from "./LoginPage";

const core = app();
const selector = core.select.loginPageSelection;
const reducer = core.app.reducer;

const implementations: ITestImplementation<
  IAppSpecification,
  {
    givens: {
      [K in keyof IAppSpecification["givens"]]: () => (
        ...Iw: IAppSpecification["givens"][K]
      ) => IStoreState;
    };

    whens: {
      [K in keyof IAppSpecification["whens"]]: (
        ...Iw: IAppSpecification["whens"][K]
      ) => [
        (
          | ActionCreatorWithNonInferrablePayload<string>
          | ActionCreatorWithoutPayload<string>
        ),
        string?
      ];
    };

    checks: {
      [K in keyof IAppSpecification["checks"]]: () => (
        ...Iw: IAppSpecification["checks"][K]
      ) => IStoreState;
    };
  }
> = {
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
>(implementations, AppSpecification, { reducer, selector });
