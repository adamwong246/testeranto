// This file is for testing implementations of types supplied by the "redux" package.
// It's purpose is to test a redux Store mand nothing more

import assert from "assert";
import { Store, AnyAction, Reducer } from "redux";

import { Given, When, Then, Suite } from "./redux.test";

import { IStoreState as IState } from "./app";
import app from "./app";
const core = app();


const actions = core.app.actions;
type IStore = Store<IState, AnyAction>;

const GivenAnEmptyState = (
  feature: string,
  whens: When[],
  thens: Then<IStore, IState>[]
) => new Given(
  `the state is empty`,
  whens,
  thens,
  feature,
  core.app.getInitialState(),
);

const GivenAStateWithEmail = (
  feature: string,
  email: string,
  whens: When[],
  thens: Then<IStore, IState>[]
) => new Given(
  `the email is already ${email}`,
  whens,
  thens,
  feature,
  {
    ...core.app.getInitialState(),
    email,
    password: "",
  },
);

const WhenTheLoginIsSubmitted = () =>
  new When(`the login form is submitted`, actions.signIn);
const WhenTheEmailIsSetTo = (email: string) =>
  new When(`the email is set to "${email}"`, actions.setEmail, email);
const WhenThePasswordIsSetTo = (password: string) =>
  new When(`the password is set to "${password}"`, actions.setPassword, password);

const ThenTheEmailIs = (email: string) =>
  new Then<IStore, IState>(`the email is "${email}"`, (state) =>
    assert.equal(state.email, email)
  );
const ThenTheEmailIsNot = (email: string) =>
  new Then<IStore, IState>(`the email is not "${email}"`, (state) =>
    assert.notEqual(state.email, email)
  );
const ThenThereIsAnEmailError = () =>
  new Then<IStore, IState>(`there should be an email error`, (state) =>
    assert.equal(state.error, 'invalidEmail')
  );
const ThenThereIsNotAnEmailError = () =>
  new Then<IStore, IState>(`there should not be an email error`, (state) => {
    assert.notEqual(state.error, 'invalidEmail')
  }

  );
const ThenThePasswordIs = (password: string) =>
  new Then<IStore, IState>(`the password is "${password}"`, (state) =>
    assert.equal(state.password, password)
  )
function ThenThePasswordIsNot(password: string) {
  return new Then<IStore, IState>(`the password is not "${password}"`, (state) => {
    assert.notEqual(state.password, password);
  })
};

const LoginStoreTesteranto = {
  Suite: {
    default: (
      description: string,
      store: Store<IState, AnyAction>,
      givens: any[]
    ) => new Suite(
      description,
      store,
      givens
    )
  },
  Given: {},
  When: {},
  Then: {

  }
}

const LoginStoreSuite = LoginStoreTesteranto.Suite.default;

export default () => {
  LoginStoreSuite('testing only the redux store', core.store, [
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
      ThenTheEmailIsNot("wade@rpc"),
      ThenTheEmailIs("adam"),
      ThenThereIsNotAnEmailError(),
    ]),

    GivenAnEmptyState("Do show an email error after submitting", [
      WhenTheEmailIsSetTo("adam"),
      WhenTheLoginIsSubmitted()
    ], [
      ThenThereIsAnEmailError()
    ]),

  ]).test();
}