// This file is for testing implementations of types supplied by the "redux-toolkit" package.
// It's purpose is to test reselect Selectors backed by a redux Store

import assert from "assert";
import { Store, AnyAction, Reducer, Selector } from "@reduxjs/toolkit";

import {
  Suite,
  Given as TGiven,
  When as TWhen,
  Then as TThen,
} from "./reduxToolkit.test";

import { ILoginPageSelection } from "./LoginPage";
import { IStoreState as IState } from "./app";
import app from "./app";
const core = app();

const selector = core.select.loginPageSelection;
const actions = core.app.actions;
const reducer = core.app.reducer;

type IStore = Store<IState, AnyAction>;

type IThen = TThen<ILoginPageSelection>[]
type IWhen = TWhen[];
type IGiven = TGiven<IStore, any>[]
const Thener = TThen<ILoginPageSelection>;
const Whener = TWhen;
const Givener = TGiven;

export type ISubject = {
  reducer: Reducer<IState, AnyAction>,
  selector: Selector
};

const ReduxToolkitSuite = (
  description: string,
  subject: ISubject,
  givens: IGiven
) => new Suite(
  description,
  subject,
  givens
);

const GivenAnEmptyState = (
  feature: string,
  whens: IWhen,
  thens: IThen,
) => new Givener(
  `the state is empty`,
  whens,
  thens,
  feature,
  core.app.getInitialState(),
);

const GivenAStateWithEmail = (
  feature: string,
  email: string,
  whens: IWhen,
  thens: IThen,
) => new Givener(
  `the email is already ${email}`,
  whens,
  thens,
  feature,
  {
    ...core.app.getInitialState(),
    email
  },
);
const WhenTheLoginIsSubmitted = () =>
  new Whener(`the login form is submitted`, actions.signIn);
const WhenTheEmailIsSetTo = (email: string) =>
  new Whener(`the email is set to "${email}"`, actions.setEmail, email);
const WhenThePasswordIsSetTo = (password: string) =>
  new Whener(`the password is set to "${password}"`, actions.setPassword, password);

const ThenTheEmailIs = (email: string) =>
  new Thener(`the email is "${email}"`,
    (selection) => {
      assert.equal(selection.email, email)
    }
  );
const ThenTheEmailIsNot = (email: string) =>
  new Thener(`the email is not "${email}"`,
    (selection) => assert.notEqual(selection.email, email)
  );
const ThenThereIsAnEmailError = () =>
  new Thener(`there should be an email error`, (selection) =>
    assert.equal(selection.error, 'invalidEmail')
  );
const ThenThereIsNotAnEmailError = () =>
  new Thener(`there should not be an email error`, (selection) =>
    assert.notEqual(selection.error, 'invalidEmail')
  );
const ThenTheSubmitButtonShouldBeEnabled = () =>
  new Thener(`the submit button should be enabled`, (selection) =>
    assert(!selection.disableSubmit)
  );
const ThenTheSubmitButtonShouldNotBeEnabled = () =>
  new Thener(`the submit button should not be enabled`, (selection) =>
    assert(selection.disableSubmit)
  );
const ThenThePasswordIs = (password: string) =>
  new Thener(`the password is "${password}"`, (selection) =>
    assert.equal(selection.password, password)
  )
function ThenThePasswordIsNot(password: string) {
  return new Thener(`the password is not "${password}"`, (selection) => {
    assert.notEqual(selection.password, password);
  })
};

export default () => {
  ReduxToolkitSuite('testing redux store + reselect selectors', { reducer, selector }, [
    GivenAnEmptyState(`Set the email and check the email`, [
      WhenTheEmailIsSetTo("adam@email.com"),
    ], [
      ThenTheEmailIs("adam@email.com"),
    ]),

    GivenAStateWithEmail(`Set the email by initial state, then set the email normally, and then check some other stuff`, "wade@rpc", [
      WhenTheEmailIsSetTo("adam@email.com"),
      WhenThePasswordIsSetTo("secret"),
    ], [
      ThenTheEmailIsNot("wade@rpc"),
      ThenThePasswordIs("secret"),
      ThenThePasswordIsNot("idk"),
    ]),


    GivenAnEmptyState("Don't show an email error just because the email does not validate", [
      WhenTheEmailIsSetTo("adam")
    ], [
      ThenThereIsNotAnEmailError()
    ]),

    GivenAnEmptyState(`Put some data in both fields to enable the submit button. Email does not need to be valid!`, [
      WhenTheEmailIsSetTo("adam"),
      WhenThePasswordIsSetTo("adam"),
    ], [
      ThenTheSubmitButtonShouldBeEnabled()
    ]),


    GivenAnEmptyState(`Don't enable the submit button if password is blank`, [
      WhenTheEmailIsSetTo("adam"),
      WhenThePasswordIsSetTo(""),
    ], [
      ThenTheSubmitButtonShouldNotBeEnabled()
    ]),


    GivenAnEmptyState(`Don't enable the submit button if email is blank`, [
      WhenTheEmailIsSetTo(""),
      WhenThePasswordIsSetTo("something"),
    ], [
      ThenTheSubmitButtonShouldNotBeEnabled()
    ]),


    GivenAnEmptyState(`Don't enable the submit button if you haven't entered a password`, [
      WhenTheEmailIsSetTo("adam")
    ], [
      ThenTheSubmitButtonShouldNotBeEnabled()
    ]),


    GivenAnEmptyState(`Don't enable the submit button if you haven't entered an email`, [
      WhenThePasswordIsSetTo("something"),
    ], [
      ThenTheSubmitButtonShouldNotBeEnabled()
    ]),

    GivenAnEmptyState(`Check for email validations only after you've pressed the submit button 1/2`, [
      WhenTheEmailIsSetTo("adam"),
    ], [
      ThenThereIsNotAnEmailError(),
      ThenTheSubmitButtonShouldNotBeEnabled()
    ]),

    GivenAnEmptyState(`Check for email validations only after you've pressed the submit button 2/2`, [
      WhenTheEmailIsSetTo("adam"),
      WhenThePasswordIsSetTo("adam"),
      WhenTheLoginIsSubmitted()
    ], [
      ThenThereIsAnEmailError(),
      ThenTheSubmitButtonShouldBeEnabled()
    ]),


  ]).run();
}