// tests/Redux+Reselect+React/app.reduxToolkit.test.ts
import { assert } from "chai";

// tests/Redux+Reselect+React/reduxToolkit.testeranto.test.ts
import { createStore } from "redux";
import { Testeranto } from "testeranto";
var ReduxToolkitTesteranto = (testImplementations, testSpecifications, testInput) => Testeranto(
  testInput,
  testSpecifications,
  testImplementations,
  { ports: 0 },
  {
    beforeEach: (subject, initialValues) => createStore(subject.reducer, initialValues),
    andWhen: function(store, actioner) {
      const a = actioner();
      return store.dispatch(a[0](a[1]));
    },
    butThen: function(store) {
      return store.getState();
    },
    assertioner: function(t) {
      return t[0](t[1], t[2], t[3]);
    }
  }
);

// tests/Redux+Reselect+React/app.ts
import { createSelector, createSlice, createStore as createStore2 } from "@reduxjs/toolkit";
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
var app_default = () => {
  const store = createStore2(loginApp.reducer);
  return {
    app: loginApp,
    select: {
      loginPageSelection
    },
    store
  };
};

// tests/Redux+Reselect+React/app.reduxToolkit.test.ts
import { features } from "/Users/adam/Code/kokomoBay/dist/tests/testerantoFeatures.test.js";
var core = app_default();
var selector = core.select.loginPageSelection;
var actions = core.app.actions;
var reducer = core.app.reducer;
var myFeature = features.hello;
var AppReduxToolkitTesteranto = ReduxToolkitTesteranto(
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
      TheEmailIs: (email) => (selection) => [assert.equal, selection.email, email, "a nice message"],
      TheEmailIsNot: (email) => (selection) => [assert.notEqual, selection.email, email],
      ThePasswordIs: (password) => (selection) => [assert.equal, selection.password, password],
      ThePasswordIsNot: (password) => (selection) => [assert.notEqual, selection.password, password]
    },
    Checks: {
      AnEmptyState: () => loginApp.getInitialState()
    }
  },
  (Suite, Given, When, Then, Check) => {
    return [
      Suite.Default(
        "Testing the ReduxToolkit",
        [
          Given.AnEmptyState(
            [],
            [When.TheEmailIsSetTo("adam@email.com")],
            [Then.TheEmailIs("adam@email.com")]
          ),
          Given.AStateWithEmail(
            [],
            [When.TheEmailIsSetTo("hello")],
            [Then.TheEmailIsNot("adam@email.com")],
            "bob@mail.com"
          ),
          Given.AnEmptyState(
            [],
            [When.TheEmailIsSetTo("hello"), When.TheEmailIsSetTo("aloha")],
            [Then.TheEmailIs("aloha")]
          ),
          Given.AnEmptyState(
            [],
            [],
            [Then.TheEmailIs("")]
          )
        ],
        [
          Check.AnEmptyState(
            "imperative style",
            [],
            async ({ TheEmailIsSetTo }, { TheEmailIs }) => {
              await TheEmailIsSetTo("foo");
              await TheEmailIs("foo");
              const reduxPayload = await TheEmailIsSetTo("foobar");
              await TheEmailIs("foobar");
            }
          )
        ]
      )
    ];
  },
  { reducer, selector }
);
export {
  AppReduxToolkitTesteranto
};
