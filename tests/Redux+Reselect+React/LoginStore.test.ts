import { assert } from "chai";
import { Store, AnyAction } from "redux";

import ReduxTesterantoFactory from "./redux.test";
import { IStoreState as IState } from "./app";

import { loginApp } from "./app";
import { ITypeDeTuple } from "../../src/shared";

type IStore = Store<IState, AnyAction>;

type ISuites = {
  Default: string;
};

type IGivens = {
  AnEmptyState: [never];
  AStateWithEmail: [string];
};

type IWhens = {
  TheLoginIsSubmitted: [never];
  TheEmailIsSetTo: [string];
  ThePasswordIsSetTo: [string];
};

type IThens = {
  TheEmailIs: [string];
  TheEmailIsNot: [string];
  ThePasswordIs: [string];
  ThePasswordIsNot: [number, boolean];
};

const LoginStoreTesteranto = ReduxTesterantoFactory<
  IStore,
  IState,
  ISuites,
  IGivens,
  IWhens,
  IThens
>(loginApp.reducer, (Suite, Given, When, Then) => {
  return [
    Suite.Default("LoginStore", [
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

      // Given.AStateWithEmail(),
    ]),
  ];
});

const suites: Record<keyof ISuites, string> = {
  Default: "some default Suite",
};

const givens: ITypeDeTuple<IGivens, IState> = {
  /* @ts-ignore:next-line */
  AnEmptyState: () => {}, //loginApp.getInitialState(),
  /* @ts-ignore:next-line */
  AStateWithEmail: (email) => {
    return { ...loginApp.getInitialState(), email };
  },
};

const thens: ITypeDeTuple<IThens, IState> = {
  TheEmailIs: (email) => (selection) => assert.equal(selection.email, email),

  TheEmailIsNot: (email) => (selection) =>
    assert.notEqual(selection.email, email),
  ThePasswordIs: function (k: IState, b): void {
    throw new Error("Function not implemented.");
  },
  ThePasswordIsNot: function (k: IState, any_0: number, any_1: boolean): void {
    throw new Error("Function not implemented.");
  },
};
const whens: ITypeDeTuple<IWhens, IState> = {
  TheLoginIsSubmitted: () => [loginApp.actions.signIn],
  TheEmailIsSetTo: (email) => [loginApp.actions.setEmail, email],
  ThePasswordIsSetTo: (password) => [loginApp.actions.setPassword, password],
};

export default async () =>
  /* @ts-ignore:next-line */
  await LoginStoreTesteranto.run(suites, givens, whens, thens);
