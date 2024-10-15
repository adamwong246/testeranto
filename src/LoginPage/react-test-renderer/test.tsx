import renderer, { act } from "react-test-renderer";
import { assert } from "chai";

import { ILoginPageSpecs } from "../test.js";
import { actions, emailwarning } from "../index.js";
import { ITestImplementation } from "testeranto/src/Types";

export const LoginPageReactTestRendererTestInterface = {

  butThen: async function (s: any, thenCB, tr) {
    return thenCB(s);
  },
  beforeEach: async function (CComponent, props) {
    let component;
    let elem;
    await act(async () => {
      elem = CComponent()
      component = renderer.create(elem);
    });
    await component.root.props.store.dispatch(actions.reset());
    return component;
  },
  andWhen: async function (
    renderer: renderer.ReactTestRenderer,
    whenCB: (any) => any
  ): Promise<renderer.ReactTestRenderer> {
    await act(() => whenCB(renderer));

    return renderer
  }

}

export const loginPageImpl: ITestImplementation<ILoginPageSpecs, object> = {
  suites: {
    Default: "a default suite",
  },
  givens: {
    default: () => (i) => {
      return i;
    },
  },
  whens: {
    TheLoginIsSubmitted: () => (component) =>
      component.root.findByType("button").props.onClick(),

    TheEmailIsSetTo: (email) => (component) => {
      component.root
        .findByProps({ type: "email" })
        .props.onChange({ target: { value: email } })
    },

    ThePasswordIsSetTo: (password) => (component) =>
      component.root
        .findByProps({ type: "password" })
        .props.onChange({ target: { value: password } }),
  },

  thens: {
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
    ThereIsAnEmailError: () => (component) => {
      assert.equal(
        component.root.findByProps({ id: "invalid-email-warning" }).children[0],
        emailwarning
      )
    },
    ThereIsNotAnEmailError: () => (component: renderer.ReactTestRenderer) => {
      const errorField = component.root.findByProps({ id: "invalid-email-warning" })
      console.log(errorField.children)
      assert.isEmpty(errorField.children)
    }

  },

  checks: {
    default: () => () => {
      return {};
    },
  },
};

