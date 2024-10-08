import { assert } from "chai";

import ReactTesteranto from "../myTests/react-jsx.testeranto.test";

import LoginPage from "../src/LoginPage";
import { ILoginPageSpecifications, LoginPageImplementations } from "../src/LoginPage/test";

export const AppReactTesteranto = ReactTesteranto<
  ILoginPageSpecifications
>(
  {
    Suites: {
      Default: "a default suite",
    },
    Givens: {
      default: () => {
        return {};
      },
    },

    Whens: {
      TheLoginIsSubmitted: () => ({ root, react }) => {
        const elem = react.querySelector("button")
        console.log("elem")
        console.log(elem)
        elem?.click();
      },
      TheEmailIsSetTo: (email) => ({ root, react }) => {
        const e = (react.querySelector("input[type='email']") as HTMLInputElement);
        e.focus();
        document.execCommand('insertText', false, email);
      },

      ThePasswordIsSetTo: (password) => ({ react }) => {
        const e = (react.querySelector("input[type='password']") as HTMLInputElement);
        e.focus();
        document.execCommand('insertText', false, password);
      }
    },

    Thens: {
      TheEmailIs: (email) => ({ react }) => {
        assert.equal(
          (react.querySelector("input[type='email']") as HTMLInputElement).value,
          email
        )
      },
      TheEmailIsNot: (email) => ({ react }) =>
        assert.notEqual(
          (react.querySelector("input[type='email']") as HTMLInputElement).value,
          email
        ),
      ThePasswordIs: (password) => ({ react }) =>
        assert.equal(
          (react.querySelector("input[type='password']") as HTMLInputElement).value,
          password
        ),
      ThePasswordIsNot: (password) => ({ react }) =>
        assert.notEqual(
          (react.querySelector("input[type='password']") as HTMLInputElement).value,
          password
        ),
      ThereIsAnEmailError: () => ({ react }) =>
        assert.notEqual(
          (react.querySelector("input[type='password']") as HTMLInputElement).value,
          'password'
        ),
      ThereIsNotAnEmailError: () => ({ react }) =>
        assert.notEqual(
          (react.querySelector("input[type='password']") as HTMLInputElement).value,
          'password'
        ),
    },

    Checks: {
      AnEmptyState: () => {
        return {};
      },
    },
  },
  LoginPageImplementations,
  LoginPage,
);
