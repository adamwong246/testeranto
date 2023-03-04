import { assert } from "chai";
import { features } from "../testerantoFeatures.test.mjs";
import { ReduxTesteranto } from "./redux.testeranto.test";
import { IStoreState, loginApp } from "./app";

export const AppReduxTesteranto = ReduxTesteranto<
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
  },
  typeof features
>(
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
      TheLoginIsSubmitted: () => [loginApp.actions.signIn],
      TheEmailIsSetTo: (email) => [loginApp.actions.setEmail, email],
      ThePasswordIsSetTo: (password) => [loginApp.actions.setPassword, password],
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
            [`hello`],
            [
              When.TheEmailIsSetTo("adam@email.com")
            ],
            [
              Then.TheEmailIs("adam@email.com")
            ]
          ),
          Given.AStateWithEmail(
            [`hello`],
            [],
            [
              Then.TheEmailIsNot("adam@email.com"),
              Then.TheEmailIs("bob@mail.com"),
            ],
            "bob@mail.com"
          ),
          Given.AnEmptyState(
            [`hello`],
            [When.TheEmailIsSetTo("hello"), When.TheEmailIsSetTo("aloha")],
            [Then.TheEmailIs("aloha")]
          ),
          Given.AnEmptyState(
            [`aloha`, `hello`],
            [],
            [Then.TheEmailIs("")]
          ),

          Given.AnEmptyState(
            [`aloha`, `hello`],
            [When.TheEmailIsSetTo("hey there")],
            [Then.TheEmailIs("hey there")]
          ),

        ],
        [
          // Check.AnEmptyState(
          //   "imperative style",
          //   [`aloha`],
          //   async ({ TheEmailIsSetTo }, { TheEmailIs }) => {
          //     await TheEmailIsSetTo("foo");
          //     await TheEmailIs("foo");
          //     const reduxPayload = await TheEmailIsSetTo("foobar");
          //     await TheEmailIs("foobar");
          //     // assert.deepEqual(reduxPayload, {
          //     //   type: "login app/setEmail",
          //     //   payload: "foobar",
          //     // });
          //   }
          // ),
        ]
      ),
    ];
  },
  loginApp.reducer
);
