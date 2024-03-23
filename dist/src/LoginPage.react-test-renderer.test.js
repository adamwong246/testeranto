"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
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
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/LoginPage.react-test-renderer.test.ts
var LoginPage_react_test_renderer_test_exports = {};
__export(LoginPage_react_test_renderer_test_exports, {
  AppReactTesteranto: () => AppReactTesteranto
});
module.exports = __toCommonJS(LoginPage_react_test_renderer_test_exports);
var import_chai = require("chai");

// myTests/react-test-renderer-jsx.testeranto.test.ts
var import_react = __toESM(require("react"));
var import_react_test_renderer = __toESM(require("react-test-renderer"));
var import_Node = __toESM(require("testeranto/src/Node"));
var ReactTestRendererTesteranto = (testImplementations, testSpecifications, testInput) => (0, import_Node.default)(
  testInput,
  testSpecifications,
  testImplementations,
  {
    beforeEach: function(CComponent, props) {
      let component;
      (0, import_react_test_renderer.act)(() => {
        component = import_react_test_renderer.default.create(
          import_react.default.createElement(CComponent, props, [])
        );
      });
      return component;
    },
    andWhen: async function(renderer2, actioner) {
      await (0, import_react_test_renderer.act)(() => actioner()(renderer2));
      return renderer2;
    }
  }
);

// src/LoginPage.tsx
var import_react2 = __toESM(require("react"));
var import_react_redux = require("react-redux");

// src/app.ts
var import_toolkit = require("@reduxjs/toolkit");
var loginApp = (0, import_toolkit.createSlice)({
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
    // eslint-disable-next-line no-useless-escape
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
var loginPageSelection = (0, import_toolkit.createSelector)([selectRoot], (root) => {
  return __spreadProps(__spreadValues({}, root), {
    disableSubmit: root.email == "" || root.password == ""
  });
});
var app_default = () => {
  const store2 = (0, import_toolkit.createStore)(loginApp.reducer);
  return {
    app: loginApp,
    select: {
      loginPageSelection
    },
    store: store2
  };
};

// src/LoginPage.tsx
var core = app_default();
var selector = core.select.loginPageSelection;
var actions = core.app.actions;
var store = core.store;
function LoginPage() {
  const selection = (0, import_react_redux.useSelector)(selector);
  return /* @__PURE__ */ import_react2.default.createElement("div", null, /* @__PURE__ */ import_react2.default.createElement("h2", null, "Welcome back!"), /* @__PURE__ */ import_react2.default.createElement("p", null, "Sign in and get to it."), /* @__PURE__ */ import_react2.default.createElement("form", null, /* @__PURE__ */ import_react2.default.createElement("input", { type: "email", value: selection.email, onChange: (e) => store.dispatch(actions.setEmail(e.target.value)) }), /* @__PURE__ */ import_react2.default.createElement("p", { id: "invalid-email-warning", className: "warning" }, selection.error === "invalidEmail" && "Something isn\u2019t right. Please double check your email format"), /* @__PURE__ */ import_react2.default.createElement("br", null), /* @__PURE__ */ import_react2.default.createElement("input", { type: "password", value: selection.password, onChange: (e) => store.dispatch(actions.setPassword(e.target.value)) }), /* @__PURE__ */ import_react2.default.createElement("p", null, selection.error === "credentialFail" && "You entered an incorrect email, password, or both."), /* @__PURE__ */ import_react2.default.createElement("br", null), /* @__PURE__ */ import_react2.default.createElement("button", { disabled: selection.disableSubmit, onClick: (event) => {
    store.dispatch(actions.signIn());
  } }, "Sign In")), /* @__PURE__ */ import_react2.default.createElement("pre", null, JSON.stringify(selection, null, 2)));
}
function LoginPage_default() {
  return /* @__PURE__ */ import_react2.default.createElement(import_react_redux.Provider, { store }, /* @__PURE__ */ import_react2.default.createElement(LoginPage, null));
}

// src/LoginPage.test.ts
var LoginPageImplementations = (Suite, Given, When, Then, Check) => {
  return [
    Suite.Default(
      "Testing the LoginPage as react",
      {
        // "test0": Given.default(
        //   [],
        //   [
        //     When.TheEmailIsSetTo("adam@email.com")
        //   ],
        //   [
        //     Then.TheEmailIs("adam@email.com")
        //   ]
        // ),
        // "test1": Given.default(
        //   [],
        //   [
        //     When.TheEmailIsSetTo("adam@email.com"),
        //     When.ThePasswordIsSetTo("secret"),
        //   ],
        //   [
        //     Then.TheEmailIsNot("wade@rpc"),
        //     Then.TheEmailIs("adam@email.com"),
        //     Then.ThePasswordIs("secret"),
        //     Then.ThePasswordIsNot("idk"),
        //   ]
        // ),
        // "test2": Given.default(
        //   [],
        //   [When.TheEmailIsSetTo("adam")],
        //   [Then.ThereIsNotAnEmailError()]
        // ),
        // "test3": Given.default(
        //   [],
        //   [When.TheEmailIsSetTo("bob"), When.TheLoginIsSubmitted()],
        //   [Then.ThereIsNotAnEmailError()]
        // ),
        "test4": Given.default(
          [],
          [
            When.TheEmailIsSetTo("adam@mail.com"),
            When.ThePasswordIsSetTo("foo")
          ],
          [
            Then.ThereIsNotAnEmailError()
          ]
        )
      },
      []
    )
  ];
};

// src/LoginPage.react-test-renderer.test.ts
var AppReactTesteranto = ReactTestRendererTesteranto(
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
        import_chai.assert.equal(
          component.root.findByProps({ type: "email" }).props.value,
          email
        );
      },
      TheEmailIsNot: (email) => (component) => import_chai.assert.notEqual(
        component.root.findByProps({ type: "email" }).props.value,
        email
      ),
      ThePasswordIs: (password) => (component) => import_chai.assert.equal(
        component.root.findByProps({ type: "password" }).props.value,
        password
      ),
      ThePasswordIsNot: (password) => (component) => import_chai.assert.notEqual(
        component.root.findByProps({ type: "password" }).props.value,
        password
      ),
      ThereIsAnEmailError: () => (component) => import_chai.assert.notEqual(
        component.root.findByProps({ type: "password" }).props.value,
        "password"
      ),
      ThereIsNotAnEmailError: () => (component) => import_chai.assert.notEqual(
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
  LoginPageImplementations,
  LoginPage_default
);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AppReactTesteranto
});
