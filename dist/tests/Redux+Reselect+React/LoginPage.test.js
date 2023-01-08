// tests/Redux+Reselect+React/react.testeranto.test.ts
import renderer, { act } from "react-test-renderer";

// src/BaseClasses.ts
import { mapValues } from "lodash";
var BaseSuite = class {
  constructor(name, givens = [], checks = []) {
    this.name = name;
    this.givens = givens;
    this.checks = checks;
    this.fails = [];
  }
  async aborter() {
    this.aborted = true;
    await Promise.all((this.givens || []).map((g, ndx) => g.aborter(ndx)));
  }
  toObj() {
    return {
      name: this.name,
      givens: this.givens.map((g) => g.toObj()),
      fails: this.fails
    };
  }
  setup(s) {
    return new Promise((res) => res(s));
  }
  test(t) {
    return t;
  }
  async run(input, testResourceConfiguration) {
    const subject = await this.setup(input);
    for (const [ndx, giver] of this.givens.entries()) {
      try {
        if (!this.aborted) {
          this.store = await giver.give(subject, ndx, testResourceConfiguration, this.test);
        }
      } catch (e) {
        console.error(e);
        this.fails.push(giver);
        return false;
      }
    }
    for (const [ndx, thater] of this.checks.entries()) {
      await thater.check(subject, ndx, testResourceConfiguration, this.test);
    }
    return true;
  }
};
var TestArtifact = class {
  constructor(binary) {
    this.binary = binary;
  }
};
var BaseGiven = class {
  constructor(name, features2, whens, thens) {
    this.artifactSaver = {
      png: (testArtifact) => this.saveTestArtifact("afterEach", new TestArtifact(testArtifact))
    };
    this.name = name;
    this.features = features2;
    this.whens = whens;
    this.thens = thens;
    this.testArtifacts = {};
  }
  toObj() {
    return {
      name: this.name,
      whens: this.whens.map((w) => w.toObj()),
      thens: this.thens.map((t) => t.toObj()),
      errors: this.error
    };
  }
  saveTestArtifact(k, testArtifact) {
    if (!this.testArtifacts[k]) {
      this.testArtifacts[k] = [];
    }
    this.testArtifacts[k].push(testArtifact);
  }
  async aborter(ndx) {
    this.abort = true;
    return Promise.all([
      ...this.whens.map((w, ndx2) => new Promise((res) => res(w.aborter()))),
      ...this.thens.map((t, ndx2) => new Promise((res) => res(t.aborter())))
    ]).then(async () => {
      return await this.afterEach(this.store, ndx, this.artifactSaver);
    });
  }
  async afterEach(store2, ndx, cb) {
    return;
  }
  async give(subject, index, testResourceConfiguration, tester) {
    console.log(`
 Given: ${this.name}`);
    try {
      if (!this.abort) {
        this.store = await this.givenThat(subject, testResourceConfiguration);
      }
      for (const whenStep of this.whens) {
        await whenStep.test(this.store, testResourceConfiguration);
      }
      for (const thenStep of this.thens) {
        const t = await thenStep.test(this.store, testResourceConfiguration);
        tester(t);
      }
    } catch (e) {
      this.error = e;
      console.log("\x07");
      throw e;
    } finally {
      try {
        await this.afterEach(this.store, index, this.artifactSaver);
      } catch {
        console.error("afterEach failed! no error will be recorded!");
      }
    }
    return this.store;
  }
};
var BaseWhen = class {
  constructor(name, actioner) {
    this.name = name;
    this.actioner = actioner;
  }
  toObj() {
    return {
      name: this.name,
      error: this.error
    };
  }
  aborter() {
    this.abort = true;
    return this.abort;
  }
  async test(store2, testResourceConfiguration) {
    console.log(" When:", this.name);
    if (!this.abort) {
      try {
        return await this.andWhen(store2, this.actioner, testResourceConfiguration);
      } catch (e) {
        this.error = true;
        throw e;
      }
    }
  }
};
var BaseThen = class {
  constructor(name, thenCB) {
    this.name = name;
    this.thenCB = thenCB;
  }
  toObj() {
    return {
      name: this.name,
      error: this.error
    };
  }
  aborter() {
    this.abort = true;
    return this.abort;
  }
  async test(store2, testResourceConfiguration) {
    if (!this.abort) {
      console.log(" Then:", this.name);
      try {
        return await this.thenCB(await this.butThen(store2, testResourceConfiguration));
      } catch (e) {
        this.error = true;
        throw e;
      }
    }
  }
};
var BaseCheck = class {
  constructor(name, features2, checkCB, whens, thens) {
    this.name = name;
    this.features = features2;
    this.checkCB = checkCB;
    this.whens = whens;
    this.thens = thens;
  }
  async afterEach(store2, ndx, cb) {
    return;
  }
  async check(subject, ndx, testResourceConfiguration, tester) {
    console.log(`
 Check: ${this.name}`);
    const store2 = await this.checkThat(subject, testResourceConfiguration);
    await this.checkCB(
      mapValues(this.whens, (when) => {
        return async (payload) => {
          return await when(payload, testResourceConfiguration).test(
            store2,
            testResourceConfiguration
          );
        };
      }),
      mapValues(this.thens, (then) => {
        return async (payload) => {
          const t = await then(payload, testResourceConfiguration).test(
            store2,
            testResourceConfiguration
          );
          tester(t);
        };
      })
    );
    await this.afterEach(store2, ndx);
    return;
  }
};

// src/lib/level1.ts
import { createHash } from "node:crypto";
import fs2 from "fs";
import path2 from "path";
import esbuild from "esbuild";
import { mapValues as mapValues2 } from "lodash";

// src/lib/level0.ts
var TesterantoLevelZero = class {
  constructor(cc, suitesOverrides, givenOverides, whenOverides, thenOverides, checkOverides) {
    this.cc = cc;
    this.constructorator = cc;
    this.suitesOverrides = suitesOverrides;
    this.givenOverides = givenOverides;
    this.whenOverides = whenOverides;
    this.thenOverides = thenOverides;
    this.checkOverides = checkOverides;
  }
  Suites() {
    return this.suitesOverrides;
  }
  Given() {
    return this.givenOverides;
  }
  When() {
    return this.whenOverides;
  }
  Then() {
    return this.thenOverides;
  }
  Check() {
    return this.checkOverides;
  }
};

// src/Project.ts
import fs from "fs";
import path from "path";
var TesterantoProject = class {
  constructor(tests, features2, ports) {
    this.tests = tests;
    this.features = features2;
    this.ports = ports;
  }
  builder() {
    const text = JSON.stringify({ tests: this.tests, features: this.features });
    const p = "./dist/testeranto.config.json";
    fs.promises.mkdir(path.dirname(p), { recursive: true }).then((x) => {
      fs.promises.writeFile(p, text);
    });
  }
};

// testeranto.config.ts
var testeranto_config_default = new TesterantoProject(
  [
    ["MyFirstContract", "./tests/solidity/MyFirstContract.solidity.test.ts", "MyFirstContractTesteranto"],
    ["MyFirstContractPlusRpc", "./tests/solidity/MyFirstContract.solidity-rpc.test.ts", "MyFirstContractPlusRpcTesteranto"],
    [
      "Rectangle",
      "./tests/Rectangle/Rectangle.test.ts",
      "RectangleTesteranto"
    ],
    [
      "Redux",
      "./tests/Redux+Reselect+React/app.redux.test.ts",
      "AppReduxTesteranto"
    ],
    [
      "ReduxToolkit",
      "./tests/Redux+Reselect+React/app.reduxToolkit.test.ts",
      "AppReduxToolkitTesteranto"
    ],
    [
      "ReactTesteranto",
      "./tests/Redux+Reselect+React/LoginPage.test.ts",
      "AppReactTesteranto"
    ],
    ["ServerHttp", "./tests/httpServer/server.http.test.ts", "ServerHttpTesteranto"],
    ["ServerHttpPuppeteer", "./tests/httpServer/server.puppeteer.test.ts", "ServerHttpPuppeteerTesteranto"],
    ["ServerHttp2x", "./tests/httpServer/server.http2x.test.ts", "ServerHttp2xTesteranto"],
    [
      "ClassicalComponentReactTestRenderer",
      "./tests/ClassicalReact/ClassicalComponent.react-test-renderer.test.tsx",
      "ClassicalComponentReactTestRendererTesteranto"
    ],
    [
      "ClassicalComponentEsbuildPuppeteer",
      "./tests/ClassicalReact/ClassicalComponent.esbuild-puppeteer.test.ts",
      "ClassicalComponentEsbuildPuppeteerTesteranto"
    ]
  ],
  "./tests/testerantoFeatures.test.ts",
  ["3001", "3002", "3003"]
);

// src/lib/level1.ts
var TesterantoLevelOne = class {
  constructor(testImplementation, testSpecification, input, suiteKlasser, givenKlasser, whenKlasser, thenKlasser, checkKlasser, testResource) {
    const classySuites = mapValues2(
      testImplementation.Suites,
      () => (somestring, givens, checks) => new suiteKlasser.prototype.constructor(somestring, givens, checks)
    );
    const classyGivens = mapValues2(
      testImplementation.Givens,
      (z) => (features2, whens, thens, ...xtrasW) => {
        return new givenKlasser.prototype.constructor(z.name, features2, whens, thens, z(...xtrasW));
      }
    );
    const classyWhens = mapValues2(
      testImplementation.Whens,
      (whEn) => (payload) => new whenKlasser.prototype.constructor(
        `${whEn.name}: ${payload && payload.toString()}`,
        whEn(payload)
      )
    );
    const classyThens = mapValues2(
      testImplementation.Thens,
      (thEn) => (expected, x) => new thenKlasser.prototype.constructor(
        `${thEn.name}: ${expected && expected.toString()}`,
        thEn(expected)
      )
    );
    const classyChecks = mapValues2(
      testImplementation.Checks,
      (z) => (somestring, features2, callback) => {
        return new checkKlasser.prototype.constructor(somestring, features2, callback, classyWhens, classyThens);
      }
    );
    const classyTesteranto = new class extends TesterantoLevelZero {
    }(
      input,
      classySuites,
      classyGivens,
      classyWhens,
      classyThens,
      classyChecks
    );
    const suites = testSpecification(
      classyTesteranto.Suites(),
      classyTesteranto.Given(),
      classyTesteranto.When(),
      classyTesteranto.Then(),
      classyTesteranto.Check()
    );
    const toReturn = suites.map((suite) => {
      return {
        test: suite,
        testResource,
        toObj: () => {
          return suite.toObj();
        },
        runner: async (allocatedPorts) => {
          return suite.run(input, { ports: allocatedPorts });
        },
        builder: (entryPath) => {
          const importPathPlugin = {
            name: "import-path",
            setup(build) {
              build.onResolve({ filter: /^\.{1,2}\// }, (args) => {
                const importedPath = args.resolveDir + "/" + args.path;
                const absolutePath = path2.resolve(importedPath);
                const absolutePath2 = path2.resolve(testeranto_config_default.features).split(".ts").slice(0, -1).join(".ts");
                if (absolutePath === absolutePath2) {
                  return {
                    path: process.cwd() + "/dist/tests/testerantoFeatures.test.js",
                    external: true
                  };
                } else {
                }
              });
            }
          };
          esbuild.build({
            entryPoints: [entryPath],
            bundle: true,
            minify: false,
            format: "esm",
            target: ["esnext"],
            write: false,
            packages: "external",
            plugins: [importPathPlugin],
            external: [
              testeranto_config_default.features
            ]
          }).then((res) => {
            const text = res.outputFiles[0].text;
            const p = "./dist/" + entryPath.split(process.cwd()).pop()?.split(".ts")[0] + ".js";
            fs2.promises.mkdir(path2.dirname(p), { recursive: true }).then((x) => {
              fs2.promises.writeFile(p, text);
              fs2.promises.writeFile("./dist/" + entryPath.split(process.cwd()).pop()?.split(".ts")[0] + `.md5`, createHash("md5").update(text).digest("hex"));
            });
          });
        }
      };
    });
    return toReturn;
  }
};

// src/index.ts
var Testeranto = (input, testSpecification, testImplementation, testResource, testInterface) => {
  const butThen = testInterface.butThen || (async (a) => a);
  const { andWhen } = testInterface;
  const actionHandler = testInterface.actionHandler || function(b) {
    return b;
  };
  const assertioner = testInterface.assertioner || (async (t) => t);
  const beforeAll = testInterface.beforeAll || (async (input2) => input2);
  const beforeEach = testInterface.beforeEach || async function(subject, initialValues, testResource2) {
    return subject;
  };
  const afterEach = testInterface.afterEach || (async (s) => s);
  return class extends TesterantoLevelOne {
    constructor() {
      super(
        testImplementation,
        testSpecification,
        input,
        class extends BaseSuite {
          async setup(s) {
            return beforeAll(s);
          }
          test(t) {
            return assertioner(t);
          }
        },
        class Given extends BaseGiven {
          constructor(name, features2, whens, thens, initialValues) {
            super(name, features2, whens, thens);
            this.initialValues = initialValues;
          }
          async givenThat(subject, testResource2) {
            return beforeEach(subject, this.initialValues, testResource2);
          }
          afterEach(store2, ndx, cb) {
            return new Promise((res) => res(afterEach(store2, ndx, cb)));
          }
        },
        class When extends BaseWhen {
          constructor(name, actioner, payload) {
            super(name, (store2) => {
              return actionHandler(actioner);
            });
            this.payload = payload;
          }
          async andWhen(store2, actioner, testResource2) {
            return await andWhen(store2, actioner, testResource2);
          }
        },
        class Then extends BaseThen {
          constructor(name, callback) {
            super(name, callback);
          }
          async butThen(store2, testResourceConfiguration) {
            return await butThen(store2, this.thenCB, testResourceConfiguration);
          }
        },
        class Check extends BaseCheck {
          constructor(name, features2, checkCallback, whens, thens, initialValues) {
            super(name, features2, checkCallback, whens, thens);
            this.initialValues = initialValues;
          }
          async checkThat(subject, testResource2) {
            return beforeEach(subject, this.initialValues, testResource2);
          }
          afterEach(store2, ndx, cb) {
            return new Promise((res) => res(afterEach(store2, ndx, cb)));
          }
        },
        testResource
      );
    }
  };
};

// tests/Redux+Reselect+React/react.testeranto.test.ts
var ReactTesteranto = (testImplementations, testSpecifications, testInput) => Testeranto(
  testInput,
  testSpecifications,
  testImplementations,
  { ports: 0 },
  {
    beforeEach: async function(subject) {
      let component;
      await act(() => {
        component = renderer.create(subject());
      });
      return component;
    },
    andWhen: async function(renderer2, actioner) {
      await act(() => actioner()(renderer2));
      return renderer2;
    }
  }
);

// tests/Redux+Reselect+React/LoginPage.test.ts
import { assert } from "chai";

// tests/Redux+Reselect+React/LoginPage.tsx
import React from "react";
import { Provider, useSelector } from "react-redux";

// tests/Redux+Reselect+React/app.ts
import { createSelector, createSlice, createStore } from "@reduxjs/toolkit";
var loginApp = createSlice({
  name: "login app",
  initialState: {
    password: "",
    email: "",
    error: "no_error"
  },
  reducers: {
    setPassword: (state, action) => {
      state.password = action.payload;
    },
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    signIn: (state) => {
      state.error = checkForErrors(state);
    }
  }
});
var selectRoot = (storeState) => {
  return storeState;
};
var validateEmail = (email) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};
var checkForErrors = (storeState) => {
  if (!validateEmail(storeState.email)) {
    return "invalidEmail";
  }
  if (storeState.password !== "password" && storeState.email !== "adam@email.com") {
    return "credentialFail";
  }
  return "no_error";
};
var loginPageSelection = createSelector([selectRoot], (root) => {
  return {
    ...root,
    disableSubmit: root.email == "" || root.password == ""
  };
});
var app_default = () => {
  const store2 = createStore(loginApp.reducer);
  return {
    app: loginApp,
    select: {
      loginPageSelection
    },
    store: store2
  };
};

// tests/Redux+Reselect+React/LoginPage.tsx
var core = app_default();
var selector = core.select.loginPageSelection;
var actions = core.app.actions;
var store = core.store;
function LoginPage() {
  const selection = useSelector(selector);
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", null, "Welcome back!"), /* @__PURE__ */ React.createElement("p", null, "Sign in and get to it."), /* @__PURE__ */ React.createElement("form", null, /* @__PURE__ */ React.createElement("input", { type: "email", value: selection.email, onChange: (e) => store.dispatch(actions.setEmail(e.target.value)) }), /* @__PURE__ */ React.createElement("p", { id: "invalid-email-warning", className: "warning" }, selection.error === "invalidEmail" && "Something isn\u2019t right. Please double check your email format"), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("input", { type: "password", value: selection.password, onChange: (e) => store.dispatch(actions.setPassword(e.target.value)) }), /* @__PURE__ */ React.createElement("p", null, selection.error === "credentialFail" && "You entered an incorrect email, password, or both."), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("button", { disabled: selection.disableSubmit, onClick: (event) => {
    store.dispatch(actions.signIn());
  } }, "Sign In")), /* @__PURE__ */ React.createElement("pre", null, JSON.stringify(selection, null, 2)));
}
function LoginPage_default() {
  return /* @__PURE__ */ React.createElement(Provider, { store }, /* @__PURE__ */ React.createElement(LoginPage, null));
}

// tests/Redux+Reselect+React/LoginPage.test.ts
import { features } from "/Users/adam/Code/testeranto.ts/dist/tests/testerantoFeatures.test.js";
var myFeature = features.hello;
var AppReactTesteranto = ReactTesteranto(
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
      TheLoginIsSubmitted: () => (component) => component.root.findByType("button").props.onClick(),
      TheEmailIsSetTo: (email) => (component) => component.root.findByProps({ type: "email" }).props.onChange({ target: { value: email } }),
      ThePasswordIsSetTo: (password) => (component) => component.root.findByProps({ type: "password" }).props.onChange({ target: { value: password } })
    },
    Thens: {
      TheEmailIs: (email) => (component) => {
        assert.equal(
          component.root.findByProps({ type: "email" }).props.value,
          email
        );
      },
      TheEmailIsNot: (email) => (component) => assert.notEqual(
        component.root.findByProps({ type: "email" }).props.value,
        email
      ),
      ThePasswordIs: (password) => (component) => assert.equal(
        component.root.findByProps({ type: "password" }).props.value,
        password
      ),
      ThePasswordIsNot: (password) => (component) => assert.notEqual(
        component.root.findByProps({ type: "password" }).props.value,
        password
      ),
      ThereIsAnEmailError: () => (component) => assert.notEqual(
        component.root.findByProps({ type: "password" }).props.value,
        "password"
      ),
      ThereIsNotAnEmailError: () => (component) => assert.notEqual(
        component.root.findByProps({ type: "password" }).props.value,
        "password"
      )
    },
    Checks: {
      AnEmptyState: () => {
        return {};
      }
    }
  },
  (Suite, Given, When, Then, Check) => {
    return [
      Suite.Default(
        "Testing the LoginPage as react",
        [
          Given.default(
            [myFeature],
            [
              When.TheEmailIsSetTo("adam@email.com")
            ],
            [
              Then.TheEmailIs("adam@email.com")
            ]
          ),
          Given.default(
            [],
            [
              When.TheEmailIsSetTo("adam@email.com"),
              When.ThePasswordIsSetTo("secret")
            ],
            [
              Then.TheEmailIsNot("wade@rpc"),
              Then.TheEmailIs("adam@email.com"),
              Then.ThePasswordIs("secret"),
              Then.ThePasswordIsNot("idk")
            ]
          ),
          Given.default(
            [],
            [When.TheEmailIsSetTo("adam")],
            [Then.ThereIsNotAnEmailError()]
          ),
          Given.default(
            [],
            [When.TheEmailIsSetTo("adam"), When.TheLoginIsSubmitted()],
            [Then.ThereIsNotAnEmailError()]
          )
        ],
        []
      )
    ];
  },
  LoginPage_default
);
export {
  AppReactTesteranto
};
