import assert from "assert";
import { Store, AnyAction } from "redux";

import {
  Given as ReduxGiven,
  When as ReduxWhen,
  Then as ReduxThen,
  Suite as ReduxSuite,
  Testeranto as ReduxTesteranto
} from "./redux.test";

import { IStoreState as IState } from "./app";
import app from "./app";

const core = app();
const actions = core.app.actions;

type IStore = Store<IState, AnyAction>;

const LoginStoreTesteranto = new ReduxTesteranto<
  IStore,
  IState,
  {
    Default: (givens: ReduxGiven<IStore, IState>[]) => ReduxSuite<IStore, IState>
  },
  {
    AnEmptyState: (feature: string, whens: ReduxWhen<IStore>[], thens: ReduxThen<IStore, IState>[]) => ReduxGiven<IStore, IState>,
    AStateWithEmail: (feature: string, whens: ReduxWhen<IStore>[], thens: ReduxThen<IStore, IState>[]) => ReduxGiven<IStore, IState>,
  },
  {
    TheLoginIsSubmitted: () => ReduxWhen<IStore>,
    TheEmailIsSetTo: (email: string) => ReduxWhen<IStore>,
    ThePasswordIsSetTo: (password: string) => ReduxWhen<IStore>,

  },
  {
    TheEmailIs: (email: string) => ReduxThen<IStore, IState>,
    TheEmailIsNot: (email: string) => ReduxThen<IStore, IState>,
    ThereIsAnEmailError: () => ReduxThen<IStore, IState>,
    ThereIsNotAnEmailError: () => ReduxThen<IStore, IState>,
    ThePasswordIs: (password) => ReduxThen<IStore, IState>,
    ThePasswordIsNot: (password) => ReduxThen<IStore, IState>,
  }
>(
  core.store,
  {
    Default: (a, b, givens) =>
      new ReduxSuite<IStore, IState>('testing the redux store of the login page', core.store, givens)
  },
  {
    AnEmptyState: (feature, whens, thens) =>
      new ReduxGiven(`the state is empty`, whens, thens, feature, core.app.getInitialState()),

    AStateWithEmail: (feature, whens, thens, email) =>
      new ReduxGiven(`the email is already ${email}`, whens, thens, feature, {
        ...core.app.getInitialState(),
        email,
        password: "",
      },
      )
  },
  {
    TheLoginIsSubmitted: () => new ReduxWhen(`the login form is submitted`, actions.signIn),
    TheEmailIsSetTo: (email) => new ReduxWhen(`the email is set to "${email}"`, actions.setEmail, email),
    ThePasswordIsSetTo: (password) => new ReduxWhen(`the password is set to "${password}"`, actions.setPassword, password),
  },
  {
    TheEmailIs: (email) =>
      new ReduxThen(`the email is "${email}"`, (state) =>
        assert.equal(state.email, email)
      ),
    TheEmailIsNot: (email) =>
      new ReduxThen(`the email is not "${email}"`, (state) =>
        assert.notEqual(state.email, email)
      ),
    ThereIsAnEmailError: () =>
      new ReduxThen(`there should be an email error`, (state) =>
        assert.equal(state.error, 'invalidEmail')
      ),
    ThereIsNotAnEmailError: () =>
      new ReduxThen(`there should not be an email error`, (state) =>
        assert.notEqual(state.error, 'invalidEmail')
      ),
    ThePasswordIs: (password: string) =>
      new ReduxThen(`the password is "${password}"`, (state) =>
        assert.equal(state.password, password)
      ),
    ThePasswordIsNot: (password: string) =>
      new ReduxThen(`the password is not "${password}"`, (state) => {
        assert.notEqual(state.password, password);
      })
  }
)

const LoginStoreSuite = LoginStoreTesteranto.Suites().Default;
const Given = LoginStoreTesteranto.Given();
const When = LoginStoreTesteranto.When();
const Then = LoginStoreTesteranto.Then();

export default () => {
  LoginStoreSuite("hello", core.store, [
    Given.AnEmptyState(`Set the email and check the email`, [
      When.TheEmailIsSetTo("adam@email.com"),
    ], [
      Then.TheEmailIs("adam@email.com"),
    ]),

    Given.AStateWithEmail(
      `Set the email by initial state, then set the email normally, and then check some other stuff`,

      [
        When.TheEmailIsSetTo("adam@email.com"),
        When.ThePasswordIsSetTo("secret"),
      ], [
      Then.TheEmailIsNot("wade@rpc"),
      Then.ThePasswordIs("secret"),
      Then.ThePasswordIsNot("idk"),
    ], "wade@rpc",),

    Given.AnEmptyState("Don't show an email error just because the email does not validate", [
      When.TheEmailIsSetTo("adam")
    ], [
      Then.TheEmailIsNot("wade@rpc"),
      Then.TheEmailIs("adam"),
      Then.ThereIsNotAnEmailError(),
    ]),

    Given.AnEmptyState("Do show an email error after submitting", [
      When.TheEmailIsSetTo("adam"),
      When.TheLoginIsSubmitted()
    ], [
      Then.ThereIsAnEmailError()
    ]),

  ]).test();
}
