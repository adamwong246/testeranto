import { ILoginPageSpecs } from "../test.js";
import { actions } from "../index.js";
import { assert } from "chai";
import type { IStore, ISelection } from "testeranto/dist/types/SubPackages/react/jsx/index";
import { ITestImplementation } from "testeranto/src/Types";

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
      return whenCB(s);
    },
  }
}

type IImpl = ITestImplementation<
  ILoginPageSpecs, object
>

const implementations: IImpl = {
  suites: {
    Default: "a default suite",
  },
  givens: {
    default: () => (i) => {
      return i;
    },
  },

  whens: {
    TheLoginIsSubmitted: () => (reactElem) => {
      reactElem.props.store.dispatch(actions.signIn());
    },
    TheEmailIsSetTo: (email) => (reactElem) => {
      reactElem.props.store.dispatch(actions.setEmail(email as never));
    },

    ThePasswordIsSetTo: (password) => (reactElem) => {
      reactElem.props.store.dispatch(actions.setPassword(password as never));
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
