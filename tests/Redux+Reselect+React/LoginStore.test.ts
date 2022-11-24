import { assert } from "chai";
import { Store, AnyAction } from "redux";

import ReduxTesterantoFactory from "./redux.test";
import { IStoreState as IState } from "./app";

import { loginApp } from "./app";
import { ISimpleThens } from "../../src/shared";

type IStore = Store<IState, AnyAction>;

type ITS = {
  TheEmailIs: [string];
  TheEmailIsNot: [string];
  ThePasswordIs: [string];
  ThePasswordIsNot: [string];
};

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
  ITS
>(loginApp.reducer, (Suite, Given, When, Then) => {
  return [
    Suite.Default("idk", [
      Given.AnEmptyState(
        "a feature",
        [When.TheEmailIsSetTo("adam@email.com")],
        [Then.TheEmailIs("adam@email.com")]
      ),
      Given.AnEmptyState(
        "another feature",
        [When.TheEmailIsSetTo("hello")],
        [Then.TheEmailIsNot("adam@email.com")]
      ),
      Given.AnEmptyState(
        "yet another feature",
        [When.TheEmailIsSetTo("hello"), When.TheEmailIsSetTo("aloha")],
        [Then.TheEmailIs("aloha")]
      ),

      Given.AnEmptyState("OMG a feature!", [], [Then.TheEmailIs("")]),
    ]),
  ];
});

export default () => {
  const thens: ISimpleThens<ITS, IState> = {
    TheEmailIs: (email) => (selection) => assert.equal(selection.email, email),

    TheEmailIsNot: (email) => (selection) =>
      assert.notEqual(selection.email, email),
    ThePasswordIs: function (k: IState, ...any: any[]): void {
      throw new Error("Function not implemented.");
    },
    ThePasswordIsNot: function (k: IState, ...any: any[]): void {
      throw new Error("Function not implemented.");
    },
  };

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
    thens
  );
};
