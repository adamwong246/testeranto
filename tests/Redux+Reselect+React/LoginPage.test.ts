import { ReactTesteranto } from "./react.testeranto.test";
import { assert } from "chai";
import LoginPage from "./LoginPage";
export class AppReactTesteranto extends ReactTesteranto<{
  suites: {
    Default: string;
  };
  givens: {
    AnEmptyState;
    AStateWithEmail: [string];
  };
  whens: {
    TheLoginIsSubmitted;
    TheEmailIsSetTo: [string];
    ThePasswordIsSetTo: [string];
  };
  thens: {
    TheEmailIs: [string];
    TheEmailIsNot: [string];
    ThePasswordIs: [string];
    ThePasswordIsNot: [number, boolean];
  };
  checks: {
    AnEmptyState;
  };
}> {
  constructor() {
    super(
      {
        Suites: {
          Default: "a default suite",
        },

        Givens: {
          /* @ts-ignore:next-line */
          AnEmptyState: () => {},
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
          TheEmailIs: (email) => (component) =>
            assert.equal(
              component.root.findByProps({ type: "email" }).props.value,
              email
            ),

          TheEmailIsNot: (email) => (component) =>
            assert.notEqual(
              component.root.findByProps({ type: "email" }).props.value,
              email
            ),
          ThereIsAnEmailError: () => (component) =>
            assert.equal(
              component.root
                .findByProps({
                  className: "warning",
                  id: "invalid-email-warning",
                })
                .children.toString(),
              "Something isn’t right. Please double check your email format"
            ),
          ThereIsNotAnEmailError: () => (component) =>
            assert.notEqual(
              component.root
                .findByProps({
                  className: "warning",
                  id: "invalid-email-warning",
                })
                .children.toString(),
              "Something isn’t right. Please double check your email format"
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
        },

        Checks: {
          /* @ts-ignore:next-line */
          AnEmptyState: () => {},
        },
      },

      (Suite, Given, When, Then, Check) => {
        return [
          Suite.Default(
            "Testing the LoginPage as react",
            [
              Given.AnEmptyState(
                `Set the email and check the email`,
                [When.TheEmailIsSetTo("adam@email.com")],
                [Then.TheEmailIs("adam@email.com")]
              ),

              Given.AnEmptyState(
                `Set the email by initial state, then set the email normally, and then check some other stuff`,
                [
                  When.TheEmailIsSetTo("adam@email.com"),
                  When.ThePasswordIsSetTo("secret"),
                ],
                [
                  Then.TheEmailIsNot("wade@rpc"),
                  Then.TheEmailIs("adam@email.com"),
                  Then.ThePasswordIs("secret"),
                  Then.ThePasswordIsNot("idk"),
                ],
                "wade@rpc"
              ),

              Given.AnEmptyState(
                "Don't show an email error just because the email does not validate",
                [When.TheEmailIsSetTo("adam")],
                [Then.ThereIsNotAnEmailError()]
              ),

              Given.AnEmptyState(
                "Do show an email error after submitting",
                [When.TheEmailIsSetTo("adam"), When.TheLoginIsSubmitted()],
                [Then.ThereIsAnEmailError()]
              ),
            ],
            []
          ),
        ];
      },

      LoginPage
    );
  }
}
