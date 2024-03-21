import {
  assert,
  core_electron_default
} from "../chunk-UZ5QK7XM.js";
import {
  require_client
} from "../chunk-INCPOGSQ.js";
import {
  LoginPage_default
} from "../chunk-3TPAPAKL.js";
import {
  require_react
} from "../chunk-YZAXQEPE.js";
import {
  __toESM
} from "../chunk-4ATCX2XT.js";

// myTests/react-jsx.testeranto.test.ts
var import_react = __toESM(require_react());
var import_client = __toESM(require_client());
var react_jsx_testeranto_test_default = (testImplementations, testSpecifications, testInput) => {
  const TesterantoComponent = function(props) {
    const myContainer = (0, import_react.useRef)(null);
    (0, import_react.useEffect)(() => {
      console.log(
        "This only happens ONCE. It happens AFTER the initial render."
      );
      props.done(myContainer.current);
    }, []);
    return import_react.default.createElement("div", { ref: myContainer }, testInput());
  };
  return core_electron_default(
    testInput,
    testSpecifications,
    testImplementations,
    {
      beforeAll: async (prototype, artificer) => {
        artificer("./before.txt", "hello artificer");
        return await new Promise((resolve, rej) => {
          document.addEventListener("DOMContentLoaded", function() {
            const elem = document.getElementById("root");
            if (elem) {
              resolve({ root: elem });
            }
          });
        });
      },
      beforeEach: async ({ root }, ndx, testRsource, artificer) => {
        return new Promise((resolve, rej) => {
          import_client.default.createRoot(root).render(
            import_react.default.createElement(
              TesterantoComponent,
              {
                done: (react) => resolve({ root, react })
              },
              []
            )
          );
        });
      },
      andWhen: function(s, actioner) {
        return actioner()(s);
      },
      butThen: async function(s) {
        return s;
      },
      afterEach: async function(store, ndx, artificer) {
        return {};
      },
      afterAll: (store, artificer) => {
        return;
      }
    }
  );
};

// src/LoginPage.test.ts
var LoginPageImplementations = (Suite, Given, When, Then, Check) => {
  return [
    Suite.Default(
      "Testing the LoginPage as react",
      {
        // "test0": Given.default(
        //   [],
        //   [
        //     When.TheEmailIsSetTo("adam@email.com")
        //   ],
        //   [
        //     Then.TheEmailIs("adam@email.com")
        //   ]
        // ),
        // "test1": Given.default(
        //   [],
        //   [
        //     When.TheEmailIsSetTo("adam@email.com"),
        //     When.ThePasswordIsSetTo("secret"),
        //   ],
        //   [
        //     Then.TheEmailIsNot("wade@rpc"),
        //     Then.TheEmailIs("adam@email.com"),
        //     Then.ThePasswordIs("secret"),
        //     Then.ThePasswordIsNot("idk"),
        //   ]
        // ),
        // "test2": Given.default(
        //   [],
        //   [When.TheEmailIsSetTo("adam")],
        //   [Then.ThereIsNotAnEmailError()]
        // ),
        // "test3": Given.default(
        //   [],
        //   [When.TheEmailIsSetTo("bob"), When.TheLoginIsSubmitted()],
        //   [Then.ThereIsNotAnEmailError()]
        // ),
        "test4": Given.default(
          [],
          [
            When.TheEmailIsSetTo("adam@mail.com"),
            When.ThePasswordIsSetTo("foo")
          ],
          [
            Then.ThereIsNotAnEmailError()
          ]
        )
      },
      []
    )
  ];
};

// src/LoginPage.electron.test.ts
var AppReactTesteranto = react_jsx_testeranto_test_default(
  {
    Suites: {
      Default: "a default suite"
    },
    Givens: {
      default: () => {
        return {};
      }
    },
    Whens: {
      TheLoginIsSubmitted: () => ({ root, react }) => {
        const elem = react.querySelector("button");
        console.log("elem");
        console.log(elem);
        elem == null ? void 0 : elem.click();
      },
      TheEmailIsSetTo: (email) => ({ root, react }) => {
        const e = react.querySelector("input[type='email']");
        e.focus();
        document.execCommand("insertText", false, email);
      },
      ThePasswordIsSetTo: (password) => ({ react }) => {
        const e = react.querySelector("input[type='password']");
        e.focus();
        document.execCommand("insertText", false, password);
      }
    },
    Thens: {
      TheEmailIs: (email) => ({ react }) => {
        assert.equal(
          react.querySelector("input[type='email']").value,
          email
        );
      },
      TheEmailIsNot: (email) => ({ react }) => assert.notEqual(
        react.querySelector("input[type='email']").value,
        email
      ),
      ThePasswordIs: (password) => ({ react }) => assert.equal(
        react.querySelector("input[type='password']").value,
        password
      ),
      ThePasswordIsNot: (password) => ({ react }) => assert.notEqual(
        react.querySelector("input[type='password']").value,
        password
      ),
      ThereIsAnEmailError: () => ({ react }) => assert.notEqual(
        react.querySelector("input[type='password']").value,
        "password"
      ),
      ThereIsNotAnEmailError: () => ({ react }) => assert.notEqual(
        react.querySelector("input[type='password']").value,
        "password"
      )
    },
    Checks: {
      AnEmptyState: () => {
        return {};
      }
    }
  },
  LoginPageImplementations,
  LoginPage_default
);
export {
  AppReactTesteranto
};
