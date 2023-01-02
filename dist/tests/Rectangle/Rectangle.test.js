// tests/Rectangle/Rectangle.test.ts
import assert from "assert";

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
  constructor(tests, features2) {
    this.tests = tests;
    this.features = features2;
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
  "./tests/testerantoFeatures.test.ts"
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
      (z) => (name, features2, whens, thens, ...xtrasW) => new givenKlasser.prototype.constructor(name, features2, whens, thens, z(...xtrasW))
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

// tests/Rectangle/Rectangle.ts
var Rectangle = class {
  constructor(height = 2, width = 2) {
    this.height = height;
    this.width = width;
  }
  getHeight() {
    return this.height;
  }
  getWidth() {
    return this.width;
  }
  setHeight(height) {
    this.height = height;
  }
  setWidth(width) {
    this.width = width;
  }
  area() {
    return this.width * this.height;
  }
  circumference() {
    return this.width * 2 + this.height * 2;
  }
};
var Rectangle_default = Rectangle;

// tests/Rectangle/Rectangle.test.ts
import { features } from "/Users/adam/Code/testeranto.ts/dist/tests/testerantoFeatures.test.js";
var RectangleTesteranto = TesterantoFactory(
  Rectangle_default.prototype,
  (Suite, Given, When, Then, Check) => {
    return [
      Suite.Default(
        "Testing the Rectangle class",
        [
          Given.Default(
            "test 1",
            [features.hello],
            [When.setWidth(4), When.setHeight(9)],
            [Then.getWidth(4), Then.getHeight(9)]
          ),
          Given.WidthOfOneAndHeightOfOne(
            "test 2",
            [],
            [When.setWidth(4), When.setHeight(5)],
            [
              Then.getWidth(4),
              Then.getHeight(5),
              Then.area(20),
              Then.AreaPlusCircumference(38)
            ]
          ),
          Given.WidthOfOneAndHeightOfOne(
            "test 3",
            [features.hola],
            [When.setHeight(4), When.setWidth(3)],
            [Then.area(12)]
          ),
          Given.WidthOfOneAndHeightOfOne(
            "test 4",
            [features.hola],
            [
              When.setHeight(3),
              When.setWidth(4),
              When.setHeight(5),
              When.setWidth(6)
            ],
            [Then.area(30), Then.circumference(22)]
          ),
          Given.WidthOfOneAndHeightOfOne(
            "test 5",
            [features.gutentag, features.aloha],
            [When.setHeight(3), When.setWidth(4)],
            [
              Then.getHeight(3),
              Then.getWidth(4),
              Then.area(12),
              Then.circumference(14)
            ]
          ),
          Given.WidthOfOneAndHeightOfOne(
            "this test will fail",
            [features.hello],
            [When.setHeight(33), When.setWidth(34)],
            [
              Then.getHeight(3)
            ]
          )
        ],
        []
      )
    ];
  },
  {
    Suites: {
      Default: "a default suite"
    },
    Givens: {
      Default: () => new Rectangle_default(),
      WidthOfOneAndHeightOfOne: () => new Rectangle_default(1, 1),
      WidthAndHeightOf: (width, height) => new Rectangle_default(width, height)
    },
    Whens: {
      HeightIsPubliclySetTo: (height) => (rectangle) => rectangle.height = height,
      WidthIsPubliclySetTo: (width) => (rectangle) => rectangle.width = width,
      setWidth: (width) => (rectangle) => rectangle.setWidth(width),
      setHeight: (height) => (rectangle) => rectangle.setHeight(height)
    },
    Thens: {
      AreaPlusCircumference: (combined) => (rectangle) => {
        assert.equal(
          rectangle.area() + rectangle.circumference(),
          combined
        );
      },
      getWidth: (width) => (rectangle) => assert.equal(rectangle.width, width),
      getHeight: (height) => (rectangle) => assert.equal(rectangle.height, height),
      area: (area) => (rectangle) => assert.equal(rectangle.area(), area),
      prototype: (name) => (rectangle) => assert.equal(1, 1),
      circumference: (circumference) => (rectangle) => assert.equal(rectangle.circumference(), circumference)
    },
    Checks: {
      AnEmptyState: () => {
        return {};
      }
    }
  },
  "na",
  {
    andWhen: async function(renderer, actioner, testResource) {
      actioner()(renderer);
      return renderer;
    }
  },
  __filename
);
export {
  RectangleTesteranto
};
