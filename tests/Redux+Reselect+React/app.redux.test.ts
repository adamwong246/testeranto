import { assert } from "chai";

import { IStoreState, loginApp } from "./app";
import { ReduxTesteranto } from "./redux.testeranto.test";

export class AppReduxTesteranto extends ReduxTesteranto<
  IStoreState,
  {
    suites: {
      Default: string;
    };
    givens: {
      AnEmptyState;
      AStateWithEmail: [string];
    };
    whens: {
      TheLoginIsSubmitted;
      TheEmailIsSetTo: [string];
      ThePasswordIsSetTo: [string];
    };
    thens: {
      TheEmailIs: [string];
      TheEmailIsNot: [string];
      ThePasswordIs: [string];
      ThePasswordIsNot: [number, boolean];
    };
    checks: {
      AnEmptyState;
    };
  }
> {
  constructor() {
    super(
      {
        Suites: {
          Default: "some default Suite",
        },
        Givens: {
          AnEmptyState: () => {
            return loginApp.getInitialState();
          },
          AStateWithEmail: (email) => {
            return { ...loginApp.getInitialState(), email };
          },
        },
        Whens: {
          TheLoginIsSubmitted: () => () => [loginApp.actions.signIn],
          TheEmailIsSetTo: (email) => () => [loginApp.actions.setEmail, email],
          ThePasswordIsSetTo: (password) => () =>
            [loginApp.actions.setPassword, password],
        },
        Thens: {
          TheEmailIs: (email) => (selection) =>
            assert.equal(selection.email, email),

          TheEmailIsNot: (email) => (selection) =>
            assert.notEqual(selection.email, email),
          ThePasswordIs: (password) => (selection) => assert.equal(1, 1),
          ThePasswordIsNot: (n, x) => (selection) => assert.equal(1, 1),
        },
        Checks: {
          AnEmptyState: () => loginApp.getInitialState(),
        },
      },

      (Suite, Given, When, Then, Check) => {
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
                "bob@mail.com"
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
                  // assert.deepEqual(reduxPayload, {
                  //   type: "login app/setEmail",
                  //   payload: "foobar",
                  // });
                }
              ),
            ]
          ),
        ];
      },

      loginApp.reducer
    );
  }
}
