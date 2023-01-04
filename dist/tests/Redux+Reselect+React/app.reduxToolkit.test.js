// tests/Redux+Reselect+React/app.reduxToolkit.test.ts
import { assert } from "chai";

// tests/Redux+Reselect+React/reduxToolkit.testeranto.test.ts
import { createStore } from "redux";

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
  async afterEach(store, ndx, cb) {
    return;
  }
  async give(subject, index, testResourceConfiguration, tester) {
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
      throw e;
    } finally {
      await this.afterEach(this.store, index, this.artifactSaver);
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
  async test(store, testResourceConfiguration) {
    if (!this.abort) {
      try {
        return await this.andWhen(store, this.actioner, testResourceConfiguration);
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
  async test(store, testResourceConfiguration) {
    if (!this.abort) {
      try {
        return this.thenCB(await this.butThen(store, testResourceConfiguration));
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
  async afterEach(store, ndx, cb) {
    return;
  }
  async check(subject, ndx, testResourceConfiguration, tester) {
    const store = await this.checkThat(subject, testResourceConfiguration);
    await this.checkCB(
      mapValues(this.whens, (when) => {
        return async (payload) => {
          return await when(payload, testResourceConfiguration).test(
            store,
            testResourceConfiguration
          );
        };
      }),
      mapValues(this.thens, (then) => {
        return async (payload) => {
          const t = await then(payload, testResourceConfiguration).test(
            store,
            testResourceConfiguration
          );
          tester(t);
        };
      })
    );
    await this.afterEach(store, ndx);
    return;
  }
};

// src/level1.ts
import { createHash } from "node:crypto";
import fs2 from "fs";
import path2 from "path";
import esbuild from "esbuild";
import { mapValues as mapValues2 } from "lodash";

// src/level0.ts
var TesterantoBasic = class {
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
    [
      "ServerHttpPuppeteer",
      "./tests/httpServer/server.http.test.ts",
      "ServerHttpTesteranto"
    ],
    [
      "ServerHttp",
      "./tests/httpServer/server.puppeteer.test.ts",
      "ServerHttpPuppeteerTesteranto"
    ],
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
  ["3000", "3001", "3002"]
);

// src/level1.ts
var Testeranto = class {
  constructor(testImplementation, testSpecification, input, suiteKlasser, givenKlasser, whenKlasser, thenKlasser, checkKlasser, testResource, entryPath) {
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
    const classyTesteranto = new class extends TesterantoBasic {
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
        runner: async (testResourceConfiguration) => suite.run(input, testResourceConfiguration[testResource]),
        builder: () => {
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
            const p = "./dist" + entryPath.split(process.cwd()).pop()?.split(".ts")[0] + ".js";
            fs2.promises.mkdir(path2.dirname(p), { recursive: true }).then((x) => {
              fs2.promises.writeFile(p, text);
              fs2.promises.writeFile("./dist" + entryPath.split(process.cwd()).pop()?.split(".ts")[0] + `.md5`, createHash("md5").update(text).digest("hex"));
            });
          });
        }
      };
    });
    return toReturn;
  }
};

// src/index.ts
var TesterantoFactory = (input, testSpecification, testImplementation, testResource, testInterface, entryPath) => {
  const { andWhen } = testInterface;
  const actionHandler = testInterface.actionHandler || function(b) {
    return b;
  };
  const afterEach = testInterface.afterEach || (async (s) => s);
  const assertioner = testInterface.assertioner || (async (t) => t);
  const beforeAll = testInterface.beforeAll || (async (input2) => input2);
  const butThen = testInterface.butThen || (async (a) => a);
  const beforeEach = testInterface.beforeEach || async function(subject, initialValues, testResource2) {
    return subject;
  };
  return class extends Testeranto {
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
          afterEach(store, ndx, cb) {
            return new Promise((res) => res(afterEach(store, ndx, cb)));
          }
        },
        class When extends BaseWhen {
          constructor(name, actioner, payload) {
            super(name, (store) => {
              return actionHandler(actioner);
            });
            this.payload = payload;
          }
          andWhen(store, actioner, testResource2) {
            return andWhen(store, actioner, testResource2);
          }
        },
        class Then extends BaseThen {
          constructor(name, callback) {
            super(name, callback);
          }
          butThen(store, testResourceConfiguration) {
            return butThen(store, this.thenCB, testResourceConfiguration);
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
          afterEach(store, ndx, cb) {
            return new Promise((res) => res(afterEach(store, ndx, cb)));
          }
        },
        testResource,
        entryPath
      );
    }
  };
};

// tests/Redux+Reselect+React/reduxToolkit.testeranto.test.ts
var ReduxToolkitTesteranto = (testImplementations, testSpecifications, testInput, entryPath) => TesterantoFactory(
  testInput,
  testSpecifications,
  testImplementations,
  "na",
  {
    beforeEach: (subject, initialValues, testResource) => createStore(subject.reducer, initialValues),
    andWhen: function(store, actioner, testResource) {
      const a = actioner();
      return store.dispatch(a[0](a[1]));
    },
    butThen: function(store, callback, testResource) {
      return store.getState();
    },
    assertioner: function(t) {
      return t[0](t[1], t[2], t[3]);
    },
    actionHandler: function(b) {
      return b();
    }
  },
  entryPath
);

// tests/Redux+Reselect+React/app.ts
import { createSelector, createSlice, createStore as createStore2 } from "@reduxjs/toolkit";
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
  const store = createStore2(loginApp.reducer);
  return {
    app: loginApp,
    select: {
      loginPageSelection
    },
    store
  };
};

// tests/Redux+Reselect+React/app.reduxToolkit.test.ts
import { features } from "/Users/adam/Code/testeranto.ts/dist/tests/testerantoFeatures.test.js";
var core = app_default();
var selector = core.select.loginPageSelection;
var actions = core.app.actions;
var reducer = core.app.reducer;
var myFeature = features.hello;
var AppReduxToolkitTesteranto = ReduxToolkitTesteranto(
  {
    Suites: {
      Default: "some default Suite"
    },
    Givens: {
      AnEmptyState: () => {
        return loginApp.getInitialState();
      },
      AStateWithEmail: (email) => {
        return { ...loginApp.getInitialState(), email };
      }
    },
    Whens: {
      TheLoginIsSubmitted: () => () => [loginApp.actions.signIn],
      TheEmailIsSetTo: (email) => () => [loginApp.actions.setEmail, email],
      ThePasswordIsSetTo: (password) => () => [loginApp.actions.setPassword, password]
    },
    Thens: {
      TheEmailIs: (email) => (selection) => [assert.equal, selection.email, email, "a nice message"],
      TheEmailIsNot: (email) => (selection) => [assert.notEqual, selection.email, email],
      ThePasswordIs: (password) => (selection) => [assert.equal, selection.password, password],
      ThePasswordIsNot: (password) => (selection) => [assert.notEqual, selection.password, password]
    },
    Checks: {
      AnEmptyState: () => loginApp.getInitialState()
    }
  },
  (Suite, Given, When, Then, Check) => {
    return [
      Suite.Default(
        "Testing the ReduxToolkit",
        [
          Given.AnEmptyState(
            [],
            [When.TheEmailIsSetTo("adam@email.com")],
            [Then.TheEmailIs("adam@email.com")]
          ),
          Given.AStateWithEmail(
            [],
            [When.TheEmailIsSetTo("hello")],
            [Then.TheEmailIsNot("adam@email.com")],
            "bob@mail.com"
          ),
          Given.AnEmptyState(
            [],
            [When.TheEmailIsSetTo("hello"), When.TheEmailIsSetTo("aloha")],
            [Then.TheEmailIs("aloha")]
          ),
          Given.AnEmptyState(
            [],
            [],
            [Then.TheEmailIs("")]
          )
        ],
        [
          Check.AnEmptyState(
            "imperative style",
            [],
            async ({ TheEmailIsSetTo }, { TheEmailIs }) => {
              await TheEmailIsSetTo("foo");
              await TheEmailIs("foo");
              const reduxPayload = await TheEmailIsSetTo("foobar");
              await TheEmailIs("foobar");
            }
          )
        ]
      )
    ];
  },
  { reducer, selector },
  __filename
);
export {
  AppReduxToolkitTesteranto
};
