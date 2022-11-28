import assert from "assert";
import { Store, AnyAction, Reducer, Selector } from "@reduxjs/toolkit";

// import ReduxToolkitTesterantoFactory from "./reduxToolkit.test";
import TesteranoFactory from "./react-on-puppeteer.testeranto.test";

// import { IStoreState as IState } from "./app";
// import app from "./app";
// import { ILoginPageSelection } from "./LoginPage";

import { ClassicalComponent } from "./ClassicalComponent";
import type { IProps, IState } from "./ClassicalComponent";

// const core = app();
// const selector = core.select.loginPageSelection;
// const actions = core.app.actions;
// const reducer = core.app.reducer;

// type IStore = Store<IState, AnyAction>;

// export type ISubject = {
//   reducer: Reducer<IState, AnyAction>;
//   selector: Selector;
// };

type ISuites = {
  Default: string;
};

type IGivens = {
  AnEmptyState: [];
};

type IWhens = {
  IClickTheButton;
};

type IThens = {
  ThePropsIs: [IProps];
  TheStatusIs: [IState];
};

type IChecks = {
  AnEmptyState: [];
};

const LoginSelectorTesteranto = TesteranoFactory<
  ISuites,
  IGivens,
  IWhens,
  IThens,
  IChecks
>(() => new ClassicalComponent({}), (Suite, Given, When, Then, Check) => {
  return [
    Suite.Default("idk", [
      Given.AStateWithEmail(
        "something",
        [When.TheEmailIsSetTo("bob"), Then.TheEmailIs("bob")],
        [When.TheEmailIsSetTo("foo"), Then.TheEmailIs("foo")],
        3
      ),

    ], [

    ]),
  ];
});

export default async () => {
  await LoginSelectorTesteranto.run(
    {
      Default: "a default suite",
    },
    {
      AnEmptyState: () => {
        return {
          password: "",
          email: "",
          error: "no_error",
        };
      },
      /* @ts-ignore:next-line */
      AStateWithEmail: (email) => {
        return {
          password: "",
          email,
          error: "no_error",
        };
      },
    },
    {
      TheLoginIsSubmitted: () => [core.app.actions.signIn],
      TheEmailIsSetTo: (email) => [core.app.actions.setEmail, email],
      ThePasswordIsSetTo: (password) => [
        core.app.actions.setPassword,
        password,
      ],
    },
    {
      TheEmailIs: (email) => (selection) =>
        assert.equal(selection.email, email),
      TheEmailIsNot: (email) => (selection) =>
        assert.notEqual(selection.email, email),
      ThePasswordIs: (password) => (selection) =>
        assert.equal(selection.password, password),
      ThePasswordIsNot: (password) => (selection) =>
        assert.notEqual(selection.password, password),
      ThereIsNotAnEmailError: () => (selection) =>
        assert.notEqual(selection.error, "invalidEmail"),
      TheSubmitButtonShouldBeEnabled: () => (selection) =>
        assert(!selection.disableSubmit),
      TheSubmitButtonShouldNotBeEnabled: () => (selection) =>
        assert(selection.disableSubmit),
      ThereIsAnEmailError: () => (selection) =>
        assert.equal(selection.error, "invalidEmail"),
    },

    {
      AnEmptyState: () => {
        return {
          password: "",
          email: "",
          error: "no_error",
        };
      },
    }
  );
};
