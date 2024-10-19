import {
  LoginPageSpecs,
  LoginPage_default,
  actions
} from "../../../chunk-EJ237YM2.mjs";
import {
  Web_default
} from "../../../chunk-33GBFJ4G.mjs";
import {
  assert
} from "../../../chunk-3HEJ35MW.mjs";
import "../../../chunk-X4RTFM5S.mjs";
import "../../../chunk-TTFRSOOU.mjs";

// ../testeranto/src/SubPackages/react/jsx/index.ts
var testInterface = {
  beforeEach: async (x, ndx, testRsource, artificer) => {
    return new Promise((resolve, rej) => {
      resolve(x());
    });
  },
  andWhen: function(s, whenCB) {
    return whenCB(s);
  }
};

// ../testeranto/src/SubPackages/react/jsx/web.ts
var web_default = (testImplementations, testSpecifications, testInput, testInterface2) => {
  return Web_default(
    testInput,
    testSpecifications,
    testImplementations,
    {
      ...testInterface,
      ...testInterface2
    }
  );
};

// src/LoginPage/react/test.tsx
var implementations = {
  suites: {
    Default: "a default suite"
  },
  givens: {
    default: () => (i) => {
      return i;
    }
  },
  whens: {
    TheLoginIsSubmitted: () => (reactElem) => {
      reactElem.props.store.dispatch(actions.signIn());
    },
    TheEmailIsSetTo: (email) => (reactElem) => {
      reactElem.props.store.dispatch(actions.setEmail(email));
    },
    ThePasswordIsSetTo: (password) => (reactElem) => {
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
      console.log("hello");
      assert.equal(reactElem.props.store.getState().error, "no_error");
    }
  },
  checks: {
    default: () => (i) => {
      return i;
    }
  }
};
var test_default = implementations;

// src/LoginPage/react/web.test.tsx
var web_test_default = web_default(
  test_default,
  LoginPageSpecs,
  LoginPage_default,
  {
    afterAll: (store, artificer, utils) => {
      console.log("domoarigato");
      utils.browser.webContents.capturePage({
        x: 0,
        y: 0,
        width: 100,
        height: 200
      }, (img) => {
        console.log("testing123");
        artificer("hello.png", img.toPng());
      }).then((x) => {
        console.log("done", x);
      });
    }
  }
);
export {
  web_test_default as default
};
