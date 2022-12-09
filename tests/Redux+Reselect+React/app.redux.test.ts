import { assert } from "chai";

import { IStoreState, loginApp } from "./app";
import { ReduxTesteranto } from "./redux.testeranto.test";

import features from "../testerantoFeatures.test"

export class AppReduxTesteranto extends ReduxTesteranto<
  IStoreState,
  {
    suites: {
      Default: string;
    };
    givens: {
      AnEmptyState: [];
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
      ThePasswordIsNot: [string];
    };
    checks: {
      AnEmptyState: [];
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
          TheEmailIs: (email) => (storeState) =>
            assert.equal(storeState.email, email),
          TheEmailIsNot: (email) => (storeState) =>
            assert.notEqual(storeState.email, email),
          ThePasswordIs: (password) => (selection) =>
            assert.equal(selection.password, password),
          ThePasswordIsNot: (password) => (selection) =>
            assert.notEqual(selection.password, password),
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
                [features.hello],
                [When.TheEmailIsSetTo("adam@email.com")],
                [Then.TheEmailIs("adam@email.com")]
              ),
              Given.AStateWithEmail(
                "another feature",
                [features.hello],
                [],
                [
                  Then.TheEmailIsNot("adam@email.com"),
                  Then.TheEmailIs("bob@mail.com"),
                ],
                "bob@mail.com"
              ),
              Given.AnEmptyState(
                "yet another feature",
                [features.hello],
                [When.TheEmailIsSetTo("hello"), When.TheEmailIsSetTo("aloha")],
                [Then.TheEmailIs("aloha")]
              ),
              Given.AnEmptyState(
                "OMG a feature!",
                [features.aloha, features.hello],
                [],
                [Then.TheEmailIs("")]
              ),
            ],
            [
              Check.AnEmptyState(
                "imperative style",
                [features.aloha],
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
