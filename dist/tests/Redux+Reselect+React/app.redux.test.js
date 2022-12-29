// tests/Redux+Reselect+React/app.redux.test.ts
import { assert } from "chai";
import features from "/Users/adam/Code/testeranto.ts/tests/Redux+Reselect+React/../testerantoFeatures.test.ts";
import { ReduxTesteranto } from "/Users/adam/Code/testeranto.ts/tests/Redux+Reselect+React/./redux.testeranto.test.ts";
import { loginApp } from "/Users/adam/Code/testeranto.ts/tests/Redux+Reselect+React/./app.ts";
var AppReduxTesteranto = ReduxTesteranto(
  {
    Suites: {
      Default: "some default Suite"
    },
    Givens: {
      AnEmptyState: () => {
        return loginApp.getInitialState();
      },
      AStateWithEmail: (email) => {
        return { ...loginApp.getInitialState(), email };
      }
    },
    Whens: {
      TheLoginIsSubmitted: () => () => [loginApp.actions.signIn],
      TheEmailIsSetTo: (email) => () => [loginApp.actions.setEmail, email],
      ThePasswordIsSetTo: (password) => () => [loginApp.actions.setPassword, password]
    },
    Thens: {
      TheEmailIs: (email) => (storeState) => assert.equal(storeState.email, email),
      TheEmailIsNot: (email) => (storeState) => assert.notEqual(storeState.email, email),
      ThePasswordIs: (password) => (selection) => assert.equal(selection.password, password),
      ThePasswordIsNot: (password) => (selection) => assert.notEqual(selection.password, password)
    },
    Checks: {
      AnEmptyState: () => loginApp.getInitialState()
    }
  },
  (Suite, Given, When, Then, Check) => {
    return [
      Suite.Default(
        "Testing the Redux store",
        [
          Given.AnEmptyState(
            "BDD gherkin style",
            [features.hello],
            [
              When.TheEmailIsSetTo("adam@email.com")
            ],
            [
              Then.TheEmailIs("adam@email.com")
            ]
          ),
          Given.AStateWithEmail(
            "another feature",
            [features.hello],
            [],
            [
              Then.TheEmailIsNot("adam@email.com"),
              Then.TheEmailIs("bob@mail.com")
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
          Given.AnEmptyState(
            "yes more features plz",
            [features.aloha, features.hello],
            [When.TheEmailIsSetTo("hey there")],
            [Then.TheEmailIs("hey there")]
          )
        ],
        []
      )
    ];
  },
  loginApp.reducer,
  __filename
);
export {
  AppReduxTesteranto
};
