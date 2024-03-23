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

// src/app.reduxToolkit.test.ts
var app_reduxToolkit_test_exports = {};
__export(app_reduxToolkit_test_exports, {
  AppReduxToolkitTesteranto: () => AppReduxToolkitTesteranto
});
module.exports = __toCommonJS(app_reduxToolkit_test_exports);
var import_chai = require("chai");

// src/app.test.ts
var AppSpecification = (Suite, Given, When, Then, Check) => {
  return [
    Suite.Default(
      "Testing the Redux store",
      {
        "test0": Given.AnEmptyState(
          ["hello"],
          [When.TheEmailIsSetTo("adam@email.com")],
          [Then.TheEmailIs("adam@email.com")]
        ),
        "test1": Given.AStateWithEmail(
          ["hello"],
          [],
          [
            Then.TheEmailIsNot("adam@email.com"),
            Then.TheEmailIs("bob@mail.com")
          ],
          "bob@mail.com"
        ),
        "test2": Given.AnEmptyState(
          ["hello"],
          [When.TheEmailIsSetTo("hello"), When.TheEmailIsSetTo("aloha")],
          [Then.TheEmailIs("aloha")]
        ),
        "test3": Given.AnEmptyState(
          [`aloha`, `hello`],
          [],
          [Then.TheEmailIs("")]
        ),
        "test4": Given.AnEmptyState(
          [`aloha`, `hello`],
          [When.TheEmailIsSetTo("hey there")],
          [Then.TheEmailIs("hey there")]
        )
      },
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
};

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
  const store = (0, import_toolkit.createStore)(loginApp.reducer);
  return {
    app: loginApp,
    select: {
      loginPageSelection
    },
    store
  };
};

// myTests/reduxToolkit.testeranto.test.ts
var import_redux = require("redux");
var import_Node = __toESM(require("testeranto/src/Node"));
var ReduxToolkitTesteranto = (testImplementations, testSpecifications, testInput) => (0, import_Node.default)(
  testInput,
  testSpecifications,
  testImplementations,
  {
    beforeEach: (subject, initialValues) => (0, import_redux.createStore)(subject.reducer, initialValues),
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

// src/app.reduxToolkit.test.ts
var core = app_default();
var selector = core.select.loginPageSelection;
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
      TheEmailIs: (email) => (selection) => [import_chai.assert.equal, selection.email, email, "a nice message"],
      TheEmailIsNot: (email) => (selection) => [import_chai.assert.notEqual, selection.email, email],
      ThePasswordIs: (password) => (selection) => [import_chai.assert.equal, selection.password, password],
      ThePasswordIsNot: (password) => (selection) => [import_chai.assert.notEqual, selection.password, password]
    },
    Checks: {
      AnEmptyState: () => loginApp.getInitialState()
    }
  },
  AppSpecification,
  { reducer, selector }
);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AppReduxToolkitTesteranto
});
