import { CElement } from "react";

import { ITestImpl } from "testeranto/src/SubPackages/react/jsx/index";

import { ILoginPageSpecs } from "../test";
import { actions } from "../index";
import { assert } from "chai";
import { IStore, ISelection } from "testeranto/src/SubPackages/react/jsx/index";

export const LoginPageReactTestInterface = (testInput) => {
  return {
    beforeEach: async (
      x,
      ndx,
      testRsource,
      artificer
    ): Promise<IStore> => {
      return new Promise((resolve, rej) => {
        const t = testInput();
        t.props.store.dispatch(actions.reset())
        resolve(t)
      });
    },
    andWhen: function (s: IStore, whenCB): Promise<ISelection> {
      // console.log("mark18")
      // debugger
      return whenCB(s);
    },
  }
}

const implementations: ITestImpl<
  ILoginPageSpecs
> = {
  suites: {
    Default: "a default suite",
  },
  givens: {
    default: () => (i) => {
      return i;
    },
  },

  whens: {
    TheLoginIsSubmitted: () => (reactElem: CElement<any, any>) => {
      reactElem.props.store.dispatch(actions.signIn());
    },
    TheEmailIsSetTo: (email) => (reactElem: CElement<any, any>) => {
      reactElem.props.store.dispatch(actions.setEmail(email));
    },

    ThePasswordIsSetTo: (password) => (reactElem: CElement<any, any>) => {
      reactElem.props.store.dispatch(actions.setPassword(password));
    }
  },

  thens: {
    TheEmailIs: (email) => (reactElem) => {
      assert.equal(reactElem.props.store.getState().email, email);
    },
    TheEmailIsNot: (email) => (reactElem) => {
      assert.notEqual(reactElem.props.store.getState().email, email);
    },
    ThePasswordIs: (password) => (reactElem) => {
      assert.equal(reactElem.props.store.getState().password, password);
    },
    ThePasswordIsNot: (password) => (reactElem) => {
      assert.notEqual(reactElem.props.store.getState().password, password);
    },
    ThereIsAnEmailError: () => (reactElem) => {
      assert.notEqual(reactElem.props.store.getState().error, "no_error");
    },
    ThereIsNotAnEmailError: () => (reactElem) => {
      assert.equal(reactElem.props.store.getState().error, "no_error");
    },
  },

  checks: {
    default: () => (i) => {
      return i;
    },
  },
}

export default implementations;
