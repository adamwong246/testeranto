import assert from "assert";
import { Store, AnyAction, Reducer, Selector } from "@reduxjs/toolkit";

import ReduxToolkitTesterantoFactory from "./reduxToolkit.test";

import { IStoreState as IState } from "./app";
import app from "./app";
import { ILoginPageSelection } from "./LoginPage";

const core = app();
const selector = core.select.loginPageSelection;
const actions = core.app.actions;
const reducer = core.app.reducer;

type IStore = Store<IState, AnyAction>;

export type ISubject = {
  reducer: Reducer<IState, AnyAction>;
  selector: Selector;
};

type ISuites = {
  Default: string;
};

type IGivens = {
  AnEmptyState: [];
  AStateWithEmail: string;
};

type IWhens = {
  TheLoginIsSubmitted;
  TheEmailIsSetTo: [string];
  ThePasswordIsSetTo: [string];
};

type IThens = {
  TheEmailIs: [string];
  TheEmailIsNot: [string];
  ThePasswordIs: [string];
  ThePasswordIsNot: [string];
  ThereIsNotAnEmailError;
  TheSubmitButtonShouldBeEnabled;
  TheSubmitButtonShouldNotBeEnabled;
  ThereIsAnEmailError;
};

type IChecks = {
  AnEmptyState: [];
};

const LoginSelectorTesteranto = ReduxToolkitTesterantoFactory<
  IStore,
  ILoginPageSelection,
  IState,
  ISuites,
  IGivens,
  IWhens,
  IThens,
  IChecks
>({ reducer, selector }, (Suite, Given, When, Then, Check) => {
  return [
    Suite.Default("LoginSelector", [
      Given.AStateWithEmail(
        "something",
        [When.TheEmailIsSetTo("bob"), Then.TheEmailIs("bob")],
        [When.TheEmailIsSetTo("foo"), Then.TheEmailIs("foo")],
        3
      ),

      Given.AnEmptyState(
        `Set the email and check the email`,
        [When.TheEmailIsSetTo("adam@email.com")],
        [Then.TheEmailIs("adam@email.com")]
      ),

      Given.AStateWithEmail(
        `Set the email by initial state, then set the email normally, and then check some other stuff`,
        [
          When.TheEmailIsSetTo("adam@email.com"),
          When.ThePasswordIsSetTo("secret"),
        ],
        [
          Then.TheEmailIsNot("wade@rpc"),
          Then.ThePasswordIs("secret"),
          Then.ThePasswordIsNot("idk"),
        ],
        "wade@rpc"
      ),

      Given.AnEmptyState(
        "Don't show an email error just because the email does not validate",
        [When.TheEmailIsSetTo("adam")],
        [Then.ThereIsNotAnEmailError()]
      ),

      Given.AnEmptyState(
        `Put some data in both fields to enable the submit button. Email does not need to be valid!`,
        [When.TheEmailIsSetTo("adam"), When.ThePasswordIsSetTo("adam")],
        [Then.TheSubmitButtonShouldBeEnabled()]
      ),

      Given.AnEmptyState(
        `Don't enable the submit button if password is blank`,
        [When.TheEmailIsSetTo("adam"), When.ThePasswordIsSetTo("")],
        [Then.TheSubmitButtonShouldNotBeEnabled()]
      ),

      Given.AnEmptyState(
        `Don't enable the submit button if email is blank`,
        [When.TheEmailIsSetTo(""), When.ThePasswordIsSetTo("something")],
        [Then.TheSubmitButtonShouldNotBeEnabled()]
      ),

      Given.AnEmptyState(
        `Don't enable the submit button if you haven't entered a password`,
        [When.TheEmailIsSetTo("adam")],
        [Then.TheSubmitButtonShouldNotBeEnabled()]
      ),

      Given.AnEmptyState(
        `Don't enable the submit button if you haven't entered an email`,
        [When.ThePasswordIsSetTo("something")],
        [Then.TheSubmitButtonShouldNotBeEnabled()]
      ),

      Given.AnEmptyState(
        `Check for email validations only after you've pressed the submit button 1/2`,
        [When.TheEmailIsSetTo("adam")],
        [
          Then.ThereIsNotAnEmailError(),
          Then.TheSubmitButtonShouldNotBeEnabled(),
        ]
      ),

      Given.AnEmptyState(
        `Check for email validations only after you've pressed the submit button 2/2`,
        [
          When.TheEmailIsSetTo("adam"),
          When.ThePasswordIsSetTo("adam"),
          When.TheLoginIsSubmitted(),
        ],
        [Then.ThereIsAnEmailError(), Then.TheSubmitButtonShouldBeEnabled()]
      ),
    ]),
  ];
});

export default async () =>
  await LoginSelectorTesteranto.run(
    {
      Default: "a default suite",
    },
    {
      AnEmptyState: () => {
        return {
          password: "",
          email: "",
          error: "no_error",
        };
      },
      /* @ts-ignore:next-line */
      AStateWithEmail: (email) => {
        return {
          password: "",
          email,
          error: "no_error",
        };
      },
    },
    {
      TheLoginIsSubmitted: () => [core.app.actions.signIn],
      TheEmailIsSetTo: (email) => [core.app.actions.setEmail, email],
      ThePasswordIsSetTo: (password) => [
        core.app.actions.setPassword,
        password,
      ],
    },
    {
      TheEmailIs: (email) => (selection) =>
        assert.equal(selection.email, email),
      TheEmailIsNot: (email) => (selection) =>
        assert.notEqual(selection.email, email),
      ThePasswordIs: (password) => (selection) =>
        assert.equal(selection.password, password),
      ThePasswordIsNot: (password) => (selection) =>
        assert.notEqual(selection.password, password),
      ThereIsNotAnEmailError: () => (selection) =>
        assert.notEqual(selection.error, "invalidEmail"),
      TheSubmitButtonShouldBeEnabled: () => (selection) =>
        assert(!selection.disableSubmit),
      TheSubmitButtonShouldNotBeEnabled: () => (selection) =>
        assert(selection.disableSubmit),
      ThereIsAnEmailError: () => (selection) =>
        assert.equal(selection.error, "invalidEmail"),
    },

    {
      AnEmptyState: () => {
        return {
          password: "",
          email: "",
          error: "no_error",
        };
      },
    }
  );
