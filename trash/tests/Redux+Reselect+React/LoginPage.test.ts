import { ReactTesteranto } from "./react.testeranto.test";
import { assert } from "chai";
import LoginPage from "./LoginPage";
import { features } from "../testerantoFeatures.test";

const myFeature = features.hello;

export const AppReactTesteranto = ReactTesteranto<
  {
    suites: {
      Default: string;
    },
    givens: {
      default: []
    };
    whens: {
      TheLoginIsSubmitted: [];
      TheEmailIsSetTo: [string];
      ThePasswordIsSetTo: [string];
    };
    thens: {
      TheEmailIs: [string];
      TheEmailIsNot: [string];
      ThePasswordIs: [string];
      ThePasswordIsNot: [string];
      ThereIsAnEmailError: [];
      ThereIsNotAnEmailError: [];
    };
    checks: {
      AnEmptyState;
    }
  }
>(
  // test implementation
  {
    Suites: {
      Default: "a default suite",
    },
    Givens: {
      default: () => {
        return {}
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

  // test specification
  (Suite, Given, When, Then, Check) => {
    return [
      Suite.Default(
        "Testing the LoginPage as react",
        [
          Given.default(
            [myFeature],
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
              When.ThePasswordIsSetTo("secret"),
            ],
            [
              Then.TheEmailIsNot("wade@rpc"),
              Then.TheEmailIs("adam@email.com"),
              Then.ThePasswordIs("secret"),
              Then.ThePasswordIsNot("idk"),
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
          ),
        ],
        []
      ),
    ];
  },

  LoginPage,

);
