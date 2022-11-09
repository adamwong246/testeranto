// This file is for testing implementations of types supplied by the "react" package with the "react-test-renderer" package

import assert from "assert";

import { ReactGiven, ReactWhen, ReactThen, ReactSuite } from "./react.test";

import LoginPage from "./LoginPage";

const Suite = (
  description: string,
  component: () => JSX.Element,
  givens: any[]
) => new ReactSuite(description, component, givens);

const GivenAnEmptyState = (
  feature: string,
  whens: ReactWhen[],
  thens: ReactThen[]
) => new ReactGiven(
  `the state is empty`,
  whens,
  thens,
  feature
);

const GivenAStateWithEmail = (
  feature: string,
  email: string,
  whens: ReactWhen[],
  thens: ReactThen[]
) => new ReactGiven(
  `the email is already ${email}`,
  whens,
  thens,
  feature,
);

const WhenTheLoginIsSubmitted = () =>
  new ReactWhen(`the login form is submitted`, (component) => component.root.findByType('button').props.onClick());

const WhenTheEmailIsSetTo = (email: string) =>
  new ReactWhen(`the email is set to "${email}"`, (component) => {
    component.root.findByProps({ type: "email" }).props.onChange({ target: { value: email } });
  });
const WhenThePasswordIsSetTo = (password: string) =>
  new ReactWhen(`the password is set to "${password}"`, (component) => {
    component.root.findByProps({ type: "password" }).props.onChange({ target: { value: password } });
  });

const ThenTheEmailIs = (email: string) =>
  new ReactThen(
    `the email is "${email}"`,
    (component) => {
      assert.equal(
        component.root.findByProps({ type: "email" }).props.value,
        email
      )
    }

  );
const ThenTheEmailIsNot = (email: string) =>
  new ReactThen(`the email is not "${email}"`, (component) =>
    assert.notEqual(component.root.findByProps({ type: "email" }).props.value, email)
  );

const ThenThePasswordIs = (password: string) =>
  new ReactThen(`the password is "${password}"`, (component) => assert.equal(component.root.findByProps({ type: "password" }).props.value, password)
  );
const ThenThePasswordIsNot = (password: string) =>
  new ReactThen(`the password is not "${password}"`, (component) =>
    assert.notEqual(component.root.findByProps({ type: "password" }).props.value, password)
  );

const ThenThereIsAnEmailError = () =>
  new ReactThen(`there should be an email error`, (component) => {
    assert.equal(
      component.root.findByProps({ className: 'warning', id: 'invalid-email-warning' }).children.toString(),
      "Something isn’t right. Please double check your email format"
    )
  }
  );
const ThenThereIsNotAnEmailError = () =>
  new ReactThen(`there should not be an email error`, (component) =>
    assert.notEqual(
      component.root.findByProps({ className: 'warning', id: 'invalid-email-warning' }).children.toString(),
      "Something isn’t right. Please double check your email format"
    )
  );


const suite = Suite(`testing a function which returns a JSX.Element`, LoginPage, [

  GivenAnEmptyState(`Set the email and check the email`, [
    WhenTheEmailIsSetTo("adam@email.com"),
  ], [
    ThenTheEmailIs("adam@email.com"),
  ]),

  GivenAStateWithEmail(`Set the email by initial state, then set the email normally, and then check some other stuff`, "wade@rpc", [
    WhenTheEmailIsSetTo("adam@email.com"),
    WhenThePasswordIsSetTo("secret"),
  ], [
    ThenTheEmailIsNot("wade@rpc"),
    ThenTheEmailIs("adam@email.com"),
    ThenThePasswordIs("secret"),
    ThenThePasswordIsNot("idk"),
  ]),

  GivenAnEmptyState("Don't show an email error just because the email does not validate", [
    WhenTheEmailIsSetTo("adam")
  ], [
    ThenThereIsNotAnEmailError()
  ]),

  GivenAnEmptyState("Do show an email error after submitting", [
    WhenTheEmailIsSetTo("adam"),
    WhenTheLoginIsSubmitted()
  ], [
    ThenThereIsAnEmailError()
  ]),


]);

export default () => {
  suite.run();
}