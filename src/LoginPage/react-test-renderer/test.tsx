import React from "react";
import renderer, { act } from "react-test-renderer";
import { assert } from "chai";

import { ITestImpl } from "testeranto/src/SubPackages/react-test-renderer/jsx/index";

import { ILoginPageSpecs } from "../test";
import { actions } from "..";


export const LoginPageReactTestRendererTestInterface = (testInput) => {

  return {
    beforeEach: function (CComponent, props): Promise<renderer.ReactTestRenderer> {
      let component;
      act(() => {

        const t = testInput(props);
        t.props.store.dispatch(actions.reset())
        // resolve(t)

        component = renderer.create(
          React.createElement(testInput, props, [])
        );
      });
      return component;
    },
    andWhen: async function (
      renderer: renderer.ReactTestRenderer,
      whenCB: (any) => any
    ): Promise<renderer.ReactTestRenderer> {
      await act(() => whenCB(renderer));

      renderer.update(React.createElement(testInput, {}, []));
      // const rtrI = renderer.getInstance();
      // if (rtrI) {
      //   renderer.update(rtrI);  
      // }

      return renderer
    }
  }
}
// {
//   return {
//     beforeEach: async (
//       x,
//       ndx,
//       testRsource,
//       artificer
//     ): Promise<IStore> => {
//       return new Promise((resolve, rej) => {
//         const t = testInput();
//         t.props.store.dispatch(actions.reset())
//         resolve(t)
//       });
//     },
//     andWhen: function (s: IStore, whenCB): Promise<ISelection> {
//       // console.log("mark18")
//       // debugger
//       return whenCB(s);
//     },
//   }
// }

export const loginPageImpl: ITestImpl<ILoginPageSpecs> = {
  Suites: {
    Default: "a default suite",
  },
  Givens: {
    default: () => (i) => {
      return i;
    },
  },
  Whens: {
    TheLoginIsSubmitted: () => (component) =>
      component.root.findByType("button").props.onClick(),

    TheEmailIsSetTo: (email) => (component: renderer.ReactTestRenderer) => {
      // debugger
      component.root
        .findByProps({ type: "email" })
        .props.onChange({ target: { value: email } })
    }
    ,

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
    ThereIsAnEmailError: () => (component) => {
      assert.equal(
        component.root.findByProps({ id: "invalid-email-warning" }).children[0],
        "Something isn’t right. Please double check your email format"
      )
    },
    ThereIsNotAnEmailError: () => (component: renderer.ReactTestRenderer) => {
      const errorField = component.root.findByProps({ id: "invalid-email-warning" })
      assert.isEmpty(errorField.children)
    }

  },

  Checks: {
    default: () => () => {
      return {};
    },
  },
};

