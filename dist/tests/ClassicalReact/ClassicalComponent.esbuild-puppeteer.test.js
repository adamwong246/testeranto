// tests/ClassicalReact/ClassicalComponent.esbuild-puppeteer.test.ts
import { assert } from "chai";
import { features } from "/Users/adam/Code/testeranto.ts/dist/tests/testerantoFeatures.test.js";

// tests/ClassicalReact/esbuild-puppeteer.testeranto.test.ts
import puppeteer from "puppeteer";
import esbuild2 from "esbuild";

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
  async test(store, testResourceConfiguration) {
    console.log(" When:", this.name);
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
      console.log(" Then:", this.name);
      try {
        return await this.thenCB(await this.butThen(store, testResourceConfiguration));
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
    console.log(`
 Check: ${this.name}`);
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

// src/lib/level1.ts
import { createHash } from "node:crypto";
import fs from "fs";
import path from "path";
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
        builder: (entryPath, featureFile) => {
          const importPathPlugin = {
            name: "import-path",
            setup(build) {
              build.onResolve({ filter: /^\.{1,2}\// }, (args) => {
                const importedPath = args.resolveDir + "/" + args.path;
                const absolutePath = path.resolve(importedPath);
                const absolutePath2 = path.resolve(featureFile).split(".ts").slice(0, -1).join(".ts");
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
              featureFile
            ]
          }).then((res) => {
            const text = res.outputFiles[0].text;
            const p = "./dist/" + entryPath.split(process.cwd()).pop()?.split(".ts")[0] + ".js";
            fs.promises.mkdir(path.dirname(p), { recursive: true }).then((x) => {
              fs.promises.writeFile(p, text);
              fs.promises.writeFile("./dist/" + entryPath.split(process.cwd()).pop()?.split(".ts")[0] + `.md5`, createHash("md5").update(text).digest("hex"));
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
          async andWhen(store, actioner, testResource2) {
            return await andWhen(store, actioner, testResource2);
          }
        },
        class Then extends BaseThen {
          constructor(name, callback) {
            super(name, callback);
          }
          async butThen(store, testResourceConfiguration) {
            return await butThen(store, this.thenCB, testResourceConfiguration);
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
        testResource
      );
    }
  };
};

// tests/ClassicalReact/esbuild-puppeteer.testeranto.test.ts
var EsbuildPuppeteerTesteranto = (testImplementations, testSpecifications, testInput) => Testeranto(
  testInput,
  testSpecifications,
  testImplementations,
  { ports: 0 },
  {
    beforeAll: async function([bundlePath, htmlTemplate]) {
      return {
        page: await (await puppeteer.launch({
          headless: true,
          executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
        })).newPage(),
        htmlBundle: htmlTemplate(
          esbuild2.buildSync({
            entryPoints: [bundlePath],
            bundle: true,
            minify: true,
            format: "esm",
            target: ["esnext"],
            write: false
          }).outputFiles[0].text
        )
      };
    },
    beforeEach: function(subject) {
      return subject.page.setContent(subject.htmlBundle).then(() => {
        return { page: subject.page };
      });
    },
    andWhen: function({ page }, actioner) {
      return actioner()({ page });
    },
    butThen: async function({ page }) {
      return { page };
    },
    afterEach: async function({ page }, ndx, saveTestArtifact) {
      saveTestArtifact.png(
        await (await page).screenshot()
      );
      return { page };
    }
  }
);

// tests/ClassicalReact/ClassicalComponent.tsx
import React from "react";
var ClassicalComponent = class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }
  render() {
    return /* @__PURE__ */ React.createElement("div", { style: { border: "3px solid green" } }, /* @__PURE__ */ React.createElement("h1", null, "Hello Classical React"), /* @__PURE__ */ React.createElement("pre", { id: "theProps" }, JSON.stringify(this.props)), /* @__PURE__ */ React.createElement("p", null, "foo: ", this.props.foo), /* @__PURE__ */ React.createElement("pre", { id: "theState" }, JSON.stringify(this.state)), /* @__PURE__ */ React.createElement("p", null, "count: ", this.state.count, " times"), /* @__PURE__ */ React.createElement("button", { id: "theButton", onClick: () => {
      this.setState({ count: this.state.count + 1 });
    } }, "Click"));
  }
};

// tests/ClassicalReact/ClassicalComponent.esbuild-puppeteer.test.ts
var myFeature = features.hello;
var ClassicalComponentEsbuildPuppeteerTesteranto = EsbuildPuppeteerTesteranto(
  {
    Suites: {
      Default: "some default Suite"
    },
    Givens: {
      AnEmptyState: () => {
        return;
      }
    },
    Whens: {
      IClickTheButton: () => async ({ page }) => await page.click("#theButton")
    },
    Thens: {
      ThePropsIs: (expectation) => async ({ page }) => {
        assert.deepEqual(
          await page.$eval("#theProps", (el) => el.innerHTML),
          JSON.stringify(expectation)
        );
      },
      TheStatusIs: (expectation) => async ({ page }) => assert.deepEqual(
        await page.$eval("#theState", (el) => el.innerHTML),
        JSON.stringify(expectation)
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
        "a classical react component, bundled with esbuild and tested with puppeteer",
        [
          Given.AnEmptyState(
            [],
            [],
            [
              Then.ThePropsIs({}),
              Then.TheStatusIs({ count: 0 })
            ]
          ),
          Given.AnEmptyState(
            [],
            [When.IClickTheButton()],
            [
              Then.ThePropsIs({}),
              Then.TheStatusIs({ count: 1 })
            ]
          ),
          Given.AnEmptyState(
            [features.hello],
            [
              When.IClickTheButton(),
              When.IClickTheButton(),
              When.IClickTheButton()
            ],
            [Then.TheStatusIs({ count: 3 })]
          ),
          Given.AnEmptyState(
            [features.hello],
            [
              When.IClickTheButton(),
              When.IClickTheButton(),
              When.IClickTheButton(),
              When.IClickTheButton(),
              When.IClickTheButton(),
              When.IClickTheButton()
            ],
            [Then.TheStatusIs({ count: 6 })]
          )
        ],
        []
      )
    ];
  },
  [
    "./tests/ClassicalReact/index.ts",
    (jsbundle) => `
            <!DOCTYPE html>
    <html lang="en">
    <head>
      <script type="module">${jsbundle}<\/script>
    </head>

    <body>
      <div id="root">
      </div>
    </body>

    <footer></footer>

    </html>
`,
    ClassicalComponent
  ]
);
export {
  ClassicalComponentEsbuildPuppeteerTesteranto
};
