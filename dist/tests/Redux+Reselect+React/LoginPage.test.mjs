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
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// tests/Redux+Reselect+React/LoginPage.test.ts
import { assert } from "chai";

// tests/Redux+Reselect+React/react.testeranto.test.ts
import renderer, { act } from "react-test-renderer";
import { Testeranto } from "testeranto";
var ReactTesteranto = (testImplementations, testSpecifications, testInput) => Testeranto(
  testInput,
  testSpecifications,
  testImplementations,
  { ports: 0 },
  {
    beforeEach: function(subject) {
      return __async(this, null, function* () {
        let component;
        yield act(() => {
          component = renderer.create(subject());
        });
        return component;
      });
    },
    andWhen: function(renderer2, actioner) {
      return __async(this, null, function* () {
        yield act(() => actioner()(renderer2));
        return renderer2;
      });
    }
  }
);

// tests/Redux+Reselect+React/LoginPage.tsx
import React from "react";
import { Provider, useSelector } from "react-redux";

// tests/Redux+Reselect+React/app.ts
import pkg from "@reduxjs/toolkit";
var { createSelector, createSlice, createStore } = pkg;
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
  const store2 = createStore(loginApp.reducer);
  return {
    app: loginApp,
    select: {
      loginPageSelection
    },
    store: store2
  };
};

// tests/Redux+Reselect+React/LoginPage.tsx
var core = app_default();
var selector = core.select.loginPageSelection;
var actions = core.app.actions;
var store = core.store;
function LoginPage() {
  const selection = useSelector(selector);
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", null, "Welcome back!"), /* @__PURE__ */ React.createElement("p", null, "Sign in and get to it."), /* @__PURE__ */ React.createElement("form", null, /* @__PURE__ */ React.createElement("input", { type: "email", value: selection.email, onChange: (e) => store.dispatch(actions.setEmail(e.target.value)) }), /* @__PURE__ */ React.createElement("p", { id: "invalid-email-warning", className: "warning" }, selection.error === "invalidEmail" && "Something isn\u2019t right. Please double check your email format"), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("input", { type: "password", value: selection.password, onChange: (e) => store.dispatch(actions.setPassword(e.target.value)) }), /* @__PURE__ */ React.createElement("p", null, selection.error === "credentialFail" && "You entered an incorrect email, password, or both."), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("button", { disabled: selection.disableSubmit, onClick: (event) => {
    store.dispatch(actions.signIn());
  } }, "Sign In")), /* @__PURE__ */ React.createElement("pre", null, JSON.stringify(selection, null, 2)));
}
function LoginPage_default() {
  return /* @__PURE__ */ React.createElement(Provider, { store }, /* @__PURE__ */ React.createElement(LoginPage, null));
}

// tests/Redux+Reselect+React/LoginPage.test.ts
var AppReactTesteranto = ReactTesteranto(
  // test implementation
  {
    Suites: {
      Default: "a default suite"
    },
    Givens: {
      default: () => {
        return {};
      }
    },
    Whens: {
      TheLoginIsSubmitted: () => (component) => component.root.findByType("button").props.onClick(),
      TheEmailIsSetTo: (email) => (component) => component.root.findByProps({ type: "email" }).props.onChange({ target: { value: email } }),
      ThePasswordIsSetTo: (password) => (component) => component.root.findByProps({ type: "password" }).props.onChange({ target: { value: password } })
    },
    Thens: {
      TheEmailIs: (email) => (component) => {
        assert.equal(
          component.root.findByProps({ type: "email" }).props.value,
          email
        );
      },
      TheEmailIsNot: (email) => (component) => assert.notEqual(
        component.root.findByProps({ type: "email" }).props.value,
        email
      ),
      ThePasswordIs: (password) => (component) => assert.equal(
        component.root.findByProps({ type: "password" }).props.value,
        password
      ),
      ThePasswordIsNot: (password) => (component) => assert.notEqual(
        component.root.findByProps({ type: "password" }).props.value,
        password
      ),
      ThereIsAnEmailError: () => (component) => assert.notEqual(
        component.root.findByProps({ type: "password" }).props.value,
        "password"
      ),
      ThereIsNotAnEmailError: () => (component) => assert.notEqual(
        component.root.findByProps({ type: "password" }).props.value,
        "password"
      )
    },
    Checks: {
      AnEmptyState: () => {
        return {};
      }
    }
  },
  (Suite, Given, When, Then, Check) => {
    return [
      Suite.Default(
        "Testing the LoginPage as react",
        [
          Given.default(
            ["hello", "bienVenidos"],
            [
              When.TheEmailIsSetTo("adam@email.com")
            ],
            [
              Then.TheEmailIs("adam@email.com")
            ]
          ),
          Given.default(
            [],
            [
              When.TheEmailIsSetTo("adam@email.com"),
              When.ThePasswordIsSetTo("secret")
            ],
            [
              Then.TheEmailIsNot("wade@rpc"),
              Then.TheEmailIs("adam@email.com"),
              Then.ThePasswordIs("secret"),
              Then.ThePasswordIsNot("idk")
            ]
          ),
          Given.default(
            [],
            [When.TheEmailIsSetTo("adam")],
            [Then.ThereIsNotAnEmailError()]
          ),
          Given.default(
            [],
            [When.TheEmailIsSetTo("adam"), When.TheLoginIsSubmitted()],
            [Then.ThereIsNotAnEmailError()]
          )
        ],
        []
      )
    ];
  },
  LoginPage_default
);
export {
  AppReactTesteranto
};
