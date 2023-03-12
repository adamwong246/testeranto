var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b ||= {})
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));

// myTests/Redux+Reselect+React/app.reduxToolkit.test.ts
import { assert } from "chai";

// myTests/Redux+Reselect+React/reduxToolkit.testeranto.test.ts
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

// myTests/Redux+Reselect+React/app.ts
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
  return __spreadProps(__spreadValues({}, root), {
    disableSubmit: root.email == "" || root.password == ""
  });
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

// myTests/Redux+Reselect+React/app.reduxToolkit.test.ts
var core = app_default();
var selector = core.select.loginPageSelection;
var actions = core.app.actions;
var reducer = core.app.reducer;
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
        return __spreadProps(__spreadValues({}, loginApp.getInitialState()), { email });
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
