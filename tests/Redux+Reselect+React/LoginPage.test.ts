// This file is for testing implementations of types supplied by the "react" package with the "react-test-renderer" package

import assert from "assert";

import {
  ReactGiven,
  ReactWhen,
  ReactThen,
  ReactSuite,
  ReactTesteranto
} from "./react.test";

import LoginPage from "./LoginPage";

const LoginPageTesteranto = new ReactTesteranto<
  {
    Default: (givens: ReactGiven[]) => ReactSuite
  },
  {
    AnEmptyState: (feature: string, whens: ReactWhen[], thens: ReactThen[]) => ReactGiven
    // AStateWithEmail: (feature: string, whens: ReactWhen[], thens: ReactThen[]) => ReactGiven
  },
  {
    TheLoginIsSubmitted: () => ReactWhen,
    TheEmailIsSetTo: (email: string) => ReactWhen,
    ThePasswordIsSetTo: (password: string) => ReactWhen,

  },
  {
    TheEmailIs: (email: string) => ReactThen,
    TheEmailIsNot: (email: string) => ReactThen,
    ThereIsAnEmailError: () => ReactThen,
    ThereIsNotAnEmailError: () => ReactThen,
    ThePasswordIs: (password) => ReactThen,
    ThePasswordIsNot: (password) => ReactThen,
    // TheSubmitButtonShouldBeEnabled: (password) => ReactThen,
    // TheSubmitButtonShouldNotBeEnabled: (password) => ReactThen,
  }
>(
  {
    Default: (description, component, givens) =>
      new ReactSuite(description, component, givens)

  },
  {
    AnEmptyState: (feature, whens, thens, x) =>
      new ReactGiven(`the state is empty`, whens, thens, feature),
  },
  {
    TheLoginIsSubmitted: () => new ReactWhen(`the login form is submitted`, (component) => component.root.findByType('button').props.onClick()),
    TheEmailIsSetTo: (email) => new ReactWhen(`the email is set to "${email}"`, (component) => {
      component.root.findByProps({ type: "email" }).props.onChange({ target: { value: email } });
    }),
    ThePasswordIsSetTo: (password) => new ReactWhen(`the password is set to "${password}"`, (component) => {
      component.root.findByProps({ type: "password" }).props.onChange({ target: { value: password } });
    })
  },
  {
    TheEmailIs: (email) =>
      new ReactThen(
        `the email is "${email}"`,
        (component) => {
          assert.equal(
            component.root.findByProps({ type: "email" }).props.value,
            email
          )
        }
      ),

    TheEmailIsNot: (email) =>
      new ReactThen(`the email is not "${email}"`, (component) =>
        assert.notEqual(component.root.findByProps({ type: "email" }).props.value, email)
      ),
    ThereIsAnEmailError: () =>
      new ReactThen(`there should be an email error`, (component) => {
        assert.equal(
          component.root.findByProps({ className: 'warning', id: 'invalid-email-warning' }).children.toString(),
          "Something isn’t right. Please double check your email format"
        )
      }
      ),
    ThereIsNotAnEmailError: () =>
      new ReactThen(`there should not be an email error`, (component) =>
        assert.notEqual(
          component.root.findByProps({ className: 'warning', id: 'invalid-email-warning' }).children.toString(),
          "Something isn’t right. Please double check your email format"
        )
      ),
    ThePasswordIs: (password: string) =>
      new ReactThen(`the password is "${password}"`, (component) =>
        assert.equal(component.root.findByProps({ type: "password" }).props.value, password)
      ),
    ThePasswordIsNot: (password: string) =>
      new ReactThen(`the password is not "${password}"`, (component) =>
        assert.notEqual(component.root.findByProps({ type: "password" }).props.value, password)
      ),
    // TheSubmitButtonShouldBeEnabled: () =>
    //   new ReactThen(`the submit button should be enabled`, (selection) =>
    //     assert(!selection.disableSubmit)
    //   ),
    // TheSubmitButtonShouldNotBeEnabled: () =>
    //   new ReactThen(`the submit button should not be enabled`, (selection) =>
    //     assert(selection.disableSubmit)
    //   )
  }
)

const LoginPageSuite = LoginPageTesteranto.Suites().Default;
const Given = LoginPageTesteranto.Given();
const When = LoginPageTesteranto.When();
const Then = LoginPageTesteranto.Then();

export default () => {
  LoginPageSuite('testing redux store + reselect selectors', LoginPage, [
    Given.AnEmptyState(`Set the email and check the email`, [
      When.TheEmailIsSetTo("adam@email.com"),
    ], [
      Then.TheEmailIs("adam@email.com"),
    ]),

    Given.AnEmptyState(`Set the email by initial state, then set the email normally, and then check some other stuff`, [
      When.TheEmailIsSetTo("adam@email.com"),
      When.ThePasswordIsSetTo("secret"),
    ], [
      Then.TheEmailIsNot("wade@rpc"),
      Then.TheEmailIs("adam@email.com"),
      Then.ThePasswordIs("secret"),
      Then.ThePasswordIsNot("idk"),
    ], "wade@rpc"),

    Given.AnEmptyState("Don't show an email error just because the email does not validate", [
      When.TheEmailIsSetTo("adam")
    ], [
      Then.ThereIsNotAnEmailError(),
    ]),

    Given.AnEmptyState("Do show an email error after submitting", [
      When.TheEmailIsSetTo("adam"),
      When.TheLoginIsSubmitted()
    ], [
      Then.ThereIsAnEmailError()
    ]),

  ]).test();
}
