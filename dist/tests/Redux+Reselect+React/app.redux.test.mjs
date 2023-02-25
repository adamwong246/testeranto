// tests/Redux+Reselect+React/app.redux.test.ts
import { assert } from "chai";

// tests/Redux+Reselect+React/redux.testeranto.test.ts
import { createStore } from "redux";
import { Testeranto } from "testeranto";
var ReduxTesteranto = (testImplementations, testSpecifications, testInput) => Testeranto(
  testInput,
  testSpecifications,
  testImplementations,
  { ports: 0 },
  {
    beforeEach: function(subject, initialValues) {
      return createStore(subject, initialValues);
    },
    andWhen: function(store, actioner) {
      const a = actioner();
      return store.dispatch(a[0](a[1]));
    },
    butThen: function(store) {
      return store.getState();
    }
  }
);

// tests/Redux+Reselect+React/app.ts
import pkg from "@reduxjs/toolkit";
var { createSelector, createSlice, createStore: createStore2 } = pkg;
var loginApp = createSlice({
  name: "login app",
  initialState: {
    password: "",
    email: "",
    error: "no_error"
  },
  reducers: {
    setPassword: (state, action) => {
      state.password = action.payload;
    },
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    signIn: (state) => {
      state.error = checkForErrors(state);
    }
  }
});
var selectRoot = (storeState) => {
  return storeState;
};
var validateEmail = (email) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};
var checkForErrors = (storeState) => {
  if (!validateEmail(storeState.email)) {
    return "invalidEmail";
  }
  if (storeState.password !== "password" && storeState.email !== "adam@email.com") {
    return "credentialFail";
  }
  return "no_error";
};
var loginPageSelection = createSelector([selectRoot], (root) => {
  return {
    ...root,
    disableSubmit: root.email == "" || root.password == ""
  };
});

// tests/Redux+Reselect+React/app.redux.test.ts
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
      TheLoginIsSubmitted: () => [loginApp.actions.signIn],
      TheEmailIsSetTo: (email) => [loginApp.actions.setEmail, email],
      ThePasswordIsSetTo: (password) => [loginApp.actions.setPassword, password]
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
              Then.TheEmailIs("bob@mail.com")
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
          )
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
      )
    ];
  },
  loginApp.reducer
);
export {
  AppReduxTesteranto
};
