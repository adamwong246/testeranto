import assert from "assert";

import ReactTesteranto from "./react.test";

import LoginPage from "./LoginPage";

const LoginPageTesteranto = ReactTesteranto<
  typeof LoginPage,
  {
    Default: "default";
  },
  {
    AnEmptyState: () => any;
  },
  {
    TheLoginIsSubmitted;
    TheEmailIsSetTo: [string];
    ThePasswordIsSetTo: [string];
    ThePasswordIsNotSetTo: [string];
  },
  {
    TheEmailIs: [string];
    TheEmailIsNot: [string];
    ThePasswordIs: [string];
    ThePasswordIsNot: [string];
    ThereIsNotAnEmailError;
    TheSubmitButtonShouldBeEnabled;
    TheSubmitButtonShouldNotBeEnabled;
    ThereIsAnEmailError;
  },
  {
    AnEmptyState: () => any;
  },
  {
    TheEmailIs: [string];
    TheEmailIsNot: [string];
    ThePasswordIs: [string];
    ThePasswordIsNot: [string];
    ThereIsNotAnEmailError;
    TheSubmitButtonShouldBeEnabled;
    TheSubmitButtonShouldNotBeEnabled;
    ThereIsAnEmailError;
  }
>(LoginPage, (Suite, Given, When, Then) => {
  return [
    Suite.Default(
      "testing redux store + reselect selectors",
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
});

export default async () =>
  await LoginPageTesteranto.run(
    {
      Default: "a default suite",
    },
    {
      /* @ts-ignore:next-line */
      AnEmptyState: () => {},
    },
    {
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
    {
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

    // checks
    {
      /* @ts-ignore:next-line */
      AnEmptyState: () => {},
    },

    // thats
    {
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
    }
  );
