// This file is for testing an implementation of types supplied by the "redux-toolkit" package.
// It's purpose is to test reselect Selectors backed by a redux Store

import assert from "assert";
import { Store, AnyAction, Reducer, Selector } from "@reduxjs/toolkit";

import {
  Given as ReduxToolkitGiven,
  When as ReduxToolkitWhen,
  Then as ReduxToolkitThen,
  Suite as ReduxToolkitSuite,
  Testeranto as ReduxToolkitTesteranto
} from "./reduxToolkit.test";

import { ILoginPageSelection } from "./LoginPage";
import { IStoreState as IState } from "./app";
import app from "./app";
const core = app();

const selector = core.select.loginPageSelection;
const actions = core.app.actions;
const reducer = core.app.reducer;

type IStore = Store<IState, AnyAction>;

export type ISubject = {
  reducer: Reducer<IState, AnyAction>,
  selector: Selector
};

const LoginSelectorTesteranto = new ReduxToolkitTesteranto<
  ISubject,
  IStore,
  ILoginPageSelection,
  {
    Default: (givens: ReduxToolkitGiven<IStore, IState>[]) =>
      ReduxToolkitSuite<ISubject, IStore, ILoginPageSelection>
  },
  {
    AnEmptyState: (feature: string, whens: ReduxToolkitWhen[], thens: ReduxToolkitThen<ILoginPageSelection>[]) =>
      ReduxToolkitGiven<IStore, IState>,
    AStateWithEmail: (feature: string, whens: ReduxToolkitWhen[], thens: ReduxToolkitThen<ILoginPageSelection>[]) =>
      ReduxToolkitGiven<IStore, IState>,
  },
  {
    TheLoginIsSubmitted: () => ReduxToolkitWhen,
    TheEmailIsSetTo: (email: string) => ReduxToolkitWhen,
    ThePasswordIsSetTo: (password: string) => ReduxToolkitWhen,

  },
  {
    TheEmailIs: (email: string) => ReduxToolkitThen<ILoginPageSelection>,
    TheEmailIsNot: (email: string) => ReduxToolkitThen<ILoginPageSelection>,
    ThereIsAnEmailError: () => ReduxToolkitThen<ILoginPageSelection>,
    ThereIsNotAnEmailError: () => ReduxToolkitThen<ILoginPageSelection>,
    ThePasswordIs: (password) => ReduxToolkitThen<ILoginPageSelection>,
    ThePasswordIsNot: (password) => ReduxToolkitThen<ILoginPageSelection>,
    TheSubmitButtonShouldBeEnabled: (password) => ReduxToolkitThen<ILoginPageSelection>,
    TheSubmitButtonShouldNotBeEnabled: (password) => ReduxToolkitThen<ILoginPageSelection>,
  }
>(
  core.store,
  {
    Default: (a, subject, givens) =>
      new ReduxToolkitSuite('testing the redux store of the login page', subject, givens)
  },
  {
    AnEmptyState: (feature, whens, thens, x) =>
      new ReduxToolkitGiven(`the state is empty`, whens, thens, feature, core.app.getInitialState()),

    AStateWithEmail: (feature, whens, thens, email) =>
      new ReduxToolkitGiven(`the email is already ${email}`, whens, thens, feature, {
        ...core.app.getInitialState(),
        email,
        password: "",
      },
      )
  },
  {
    TheLoginIsSubmitted: () => new ReduxToolkitWhen(`the login form is submitted`, actions.signIn),
    TheEmailIsSetTo: (email) => new ReduxToolkitWhen(`the email is set to "${email}"`, actions.setEmail, email),
    ThePasswordIsSetTo: (password) => new ReduxToolkitWhen(`the password is set to "${password}"`, actions.setPassword, password),
  },
  {
    TheEmailIs: (email) =>
      new ReduxToolkitThen(`the email is "${email}"`, (state) =>
        assert.equal(state.email, email)
      ),
    TheEmailIsNot: (email) =>
      new ReduxToolkitThen(`the email is not "${email}"`, (state) =>
        assert.notEqual(state.email, email)
      ),
    ThereIsAnEmailError: () =>
      new ReduxToolkitThen(`there should be an email error`, (state) =>
        assert.equal(state.error, 'invalidEmail')
      ),
    ThereIsNotAnEmailError: () =>
      new ReduxToolkitThen(`there should not be an email error`, (state) =>
        assert.notEqual(state.error, 'invalidEmail')
      ),
    ThePasswordIs: (password: string) =>
      new ReduxToolkitThen(`the password is "${password}"`, (state) =>
        assert.equal(state.password, password)
      ),
    ThePasswordIsNot: (password: string) =>
      new ReduxToolkitThen(`the password is not "${password}"`, (state) => {
        assert.notEqual(state.password, password);
      }),

    TheSubmitButtonShouldBeEnabled: () =>
      new ReduxToolkitThen(`the submit button should be enabled`, (selection) =>
        assert(!selection.disableSubmit)
      ),
    TheSubmitButtonShouldNotBeEnabled: () =>
      new ReduxToolkitThen(`the submit button should not be enabled`, (selection) =>
        assert(selection.disableSubmit)
      )
  }
)

const LoginSelectorSuite = LoginSelectorTesteranto.Suites().Default;
const Given = LoginSelectorTesteranto.Given();
const When = LoginSelectorTesteranto.When();
const Then = LoginSelectorTesteranto.Then();

export default () => {
  LoginSelectorSuite('testing redux store + reselect selectors', { reducer, selector }, [
    Given.AnEmptyState(`Set the email and check the email`, [
      When.TheEmailIsSetTo("adam@email.com"),
    ], [
      Then.TheEmailIs("adam@email.com")
    ]),

    Given.AStateWithEmail(`Set the email by initial state, then set the email normally, and then check some other stuff`, [
      When.TheEmailIsSetTo("adam@email.com"),
      When.ThePasswordIsSetTo("secret"),
    ], [
      Then.TheEmailIsNot("wade@rpc"),
      Then.ThePasswordIs("secret"),
      Then.ThePasswordIsNot("idk"),
    ], "wade@rpc"),

    Given.AnEmptyState("Don't show an email error just because the email does not validate", [
      When.TheEmailIsSetTo("adam")
    ], [
      Then.ThereIsNotAnEmailError()
    ]),

    Given.AnEmptyState(`Put some data in both fields to enable the submit button. Email does not need to be valid!`, [
      When.TheEmailIsSetTo("adam"),
      When.ThePasswordIsSetTo("adam"),
    ], [
      Then.TheSubmitButtonShouldBeEnabled()
    ]),

    Given.AnEmptyState(`Don't enable the submit button if password is blank`, [
      When.TheEmailIsSetTo("adam"),
      When.ThePasswordIsSetTo(""),
    ], [
      Then.TheSubmitButtonShouldNotBeEnabled()
    ]),

    Given.AnEmptyState(`Don't enable the submit button if email is blank`, [
      When.TheEmailIsSetTo(""),
      When.ThePasswordIsSetTo("something"),
    ], [
      Then.TheSubmitButtonShouldNotBeEnabled()
    ]),

    Given.AnEmptyState(`Don't enable the submit button if you haven't entered a password`, [
      When.TheEmailIsSetTo("adam")
    ], [
      Then.TheSubmitButtonShouldNotBeEnabled()
    ]),

    Given.AnEmptyState(`Don't enable the submit button if you haven't entered an email`, [
      When.ThePasswordIsSetTo("something"),
    ], [
      Then.TheSubmitButtonShouldNotBeEnabled()
    ]),

    Given.AnEmptyState(`Check for email validations only after you've pressed the submit button 1/2`, [
      When.TheEmailIsSetTo("adam"),
    ], [
      Then.ThereIsNotAnEmailError(),
      Then.TheSubmitButtonShouldNotBeEnabled()
    ]),

    Given.AnEmptyState(`Check for email validations only after you've pressed the submit button 2/2`, [
      When.TheEmailIsSetTo("adam"),
      When.ThePasswordIsSetTo("adam"),
      When.TheLoginIsSubmitted()
    ], [
      Then.ThereIsAnEmailError(),
      Then.TheSubmitButtonShouldBeEnabled()
    ]),

  ]).test();
}
