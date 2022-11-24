import { assert } from "chai";
import { Store, AnyAction } from "redux";

import ReduxTesterantoFactory from "./redux.test";
import { IStoreState as IState } from "./app";

import { loginApp } from "./app";

type IStore = Store<IState, AnyAction>;

const LoginStoreTesteranto = ReduxTesterantoFactory<
  IStore,
  IState,
  {
    Default: "default";
  },
  {
    AnEmptyState: [never];
    AStateWithEmail: [string];
  },
  {
    TheLoginIsSubmitted: [never];
    TheEmailIsSetTo: [string];
    ThePasswordIsSetTo: [string];
  },
  {
    TheEmailIs: [string];
    TheEmailIsNot: [string];
  }
>(loginApp.reducer, (Suite, Given, When, Then) => {
  return [
    Suite.Default("idk", [
      Given.AnEmptyState(
        "xyz",
        [When.TheEmailIsSetTo("adam@email.com")],
        [Then.TheEmailIs("adam@email.com")]
      ),
      Given.AnEmptyState(
        "xyz",
        [When.TheEmailIsSetTo("hello")],
        [Then.TheEmailIsNot("adam@email.com")]
      ),
      Given.AnEmptyState(
        "xyz",
        [When.TheEmailIsSetTo("hello"), When.TheEmailIsSetTo("aloha")],
        [Then.TheEmailIs("aloha")]
      ),

      Given.AnEmptyState("xyz", [], [Then.TheEmailIs("")]),
    ]),
  ];
});

export default () => {
  LoginStoreTesteranto.run(
    {
      Default: "a default suite",
    },
    {
      /* @ts-ignore:next-line */
      AnEmptyState: () => loginApp.getInitialState(),
      /* @ts-ignore:next-line */
      AStateWithEmail: (email) => {
        return { ...loginApp.getInitialState(), email };
      },
    },
    {
      TheLoginIsSubmitted: () => [loginApp.actions.signIn],
      TheEmailIsSetTo: (email) => [loginApp.actions.setEmail, email],
      ThePasswordIsSetTo: (password) => [
        loginApp.actions.setPassword,
        password,
      ],
    },
    {
      TheEmailIs: (email) => (selection) =>
        assert.equal(selection.email, email),

      TheEmailIsNot: (email) => (selection) =>
        assert.notEqual(selection.email, email),
    }
  );
};
