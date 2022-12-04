import { assert } from "chai";

import ReduxTesterantoFactory from "../../tests/Redux+Reselect+React/redux.testeranto.test";
import { IStoreState as IState } from "../../tests/Redux+Reselect+React/app";

import { loginApp } from "../../tests/Redux+Reselect+React/app";

const LoginStoreTesteranto = ReduxTesterantoFactory<
  IState,
  {
    Default: string;
  },
  {
    AnEmptyState;
    AStateWithEmail: [string];
  },
  {
    TheLoginIsSubmitted;
    TheEmailIsSetTo: [string];
    ThePasswordIsSetTo: [string];
  },
  {
    TheEmailIs: [string];
    TheEmailIsNot: [string];
    ThePasswordIs: [string];
    ThePasswordIsNot: [number, boolean];
  },
  {
    AnEmptyState;
  }
>(loginApp.reducer, (Suite, Given, When, Then, Check) => {
  return [
    Suite.Default(
      "Testing the Redux store",
      [
        Given.AnEmptyState(
          "BDD gherkin style",
          [When.TheEmailIsSetTo("adam@email.com")],
          [Then.TheEmailIs("adam@email.com")]
        ),
        Given.AStateWithEmail(
          "another feature",
          [When.TheEmailIsSetTo("hello")],
          [Then.TheEmailIsNot("adam@email.com")],
          "12"
        ),
        Given.AnEmptyState(
          "yet another feature",
          [When.TheEmailIsSetTo("hello"), When.TheEmailIsSetTo("aloha")],
          [Then.TheEmailIs("aloha")]
        ),
        Given.AnEmptyState("OMG a feature!", [], [Then.TheEmailIs("")]),
      ],
      [
        Check.AnEmptyState(
          "imperative style",
          async ({ TheEmailIsSetTo }, { TheEmailIs }) => {
            await TheEmailIsSetTo("foo");
            await TheEmailIs("foo");
            const reduxPayload = await TheEmailIsSetTo("foobar");
            await TheEmailIs("foobar");
            assert.deepEqual(reduxPayload, {
              type: "login app/setEmail",
              payload: "foobar",
            });
          }
        ),
      ]
    ),
  ];
});

export default async () =>
  await LoginStoreTesteranto.run(
    {
      Default: "some default Suite",
    },
    {
      AnEmptyState: () => {
        return loginApp.getInitialState();
      },
      AStateWithEmail: (email) => {
        return { ...loginApp.getInitialState(), email };
      },
    },
    {
      TheLoginIsSubmitted: () => () => [loginApp.actions.signIn],
      TheEmailIsSetTo: (email) => () => [loginApp.actions.setEmail, email],
      ThePasswordIsSetTo: (password) => () =>
        [loginApp.actions.setPassword, password],
    },
    {
      TheEmailIs: (email) => (selection) =>
        assert.equal(selection.email, email),

      TheEmailIsNot: (email) => (selection) =>
        assert.notEqual(selection.email, email),
      ThePasswordIs: function (k: IState, b): void {
        throw new Error("Function not implemented.");
      },
      ThePasswordIsNot: function (
        k: IState,
        any_0: number,
        any_1: boolean
      ): void {
        throw new Error("Function not implemented.");
      },
    },
    {
      AnEmptyState: () => loginApp.getInitialState(),
    }
  );
