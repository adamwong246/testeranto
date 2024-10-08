import { assert } from "chai";

import { ReactTestRendererTesteranto } from "../myTests/react-test-renderer-jsx.testeranto.test";

import LoginPage from "../src/LoginPage";
import { ILoginPageSpecifications, LoginPageImplementations } from "../src/LoginPage/test";

export const AppReactTesteranto = ReactTestRendererTesteranto<
  ILoginPageSpecifications,
  object
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
      TheLoginIsSubmitted: () => (component) =>
        component.root.findByType("button").props.onClick(),

      TheEmailIsSetTo: (email) => (component) =>
        component.root
          .findByProps({ type: "email" })
          .props.onChange({ target: { value: email } }),

      ThePasswordIsSetTo: (password) => (component) =>
        component.root
          .findByProps({ type: "password" })
          .props.onChange({ target: { value: password } }),
    },

    Thens: {
      TheEmailIs: (email) => (component) => {
        assert.equal(
          component.root.findByProps({ type: "email" }).props.value,
          email
        )
      },
      TheEmailIsNot: (email) => (component) =>
        assert.notEqual(
          component.root.findByProps({ type: "email" }).props.value,
          email
        ),
      ThePasswordIs: (password) => (component) =>
        assert.equal(
          component.root.findByProps({ type: "password" }).props.value,
          password
        ),
      ThePasswordIsNot: (password) => (component) =>
        assert.notEqual(
          component.root.findByProps({ type: "password" }).props.value,
          password
        ),
      ThereIsAnEmailError: () => (component) =>
        assert.notEqual(
          component.root.findByProps({ type: "password" }).props.value,
          'password'
        ),
      ThereIsNotAnEmailError: () => (component) =>
        assert.notEqual(
          component.root.findByProps({ type: "password" }).props.value,
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
