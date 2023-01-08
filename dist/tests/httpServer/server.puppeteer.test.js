// tests/httpServer/server.puppeteer.test.ts
import { features } from "/Users/adam/Code/testeranto.ts/dist/tests/testerantoFeatures.test.js";

// tests/httpServer/puppeteer-http.testeranto.test.ts
import puppeteer from "puppeteer";
import { assert } from "chai";

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
var Testeranto = (input, testSpecification, testImplementation, testResource, testInterface, entryPath) => {
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
        testResource,
        entryPath
      );
    }
  };
};

// tests/httpServer/puppeteer-http.testeranto.test.ts
var PuppeteerHttpTesteranto = (testImplementations, testSpecifications, testInput, entryPath) => Testeranto(
  testInput,
  testSpecifications,
  testImplementations,
  { ports: 1 },
  {
    beforeEach: function(serverFactory2, initialValues, testResource) {
      return new Promise((res) => {
        puppeteer.launch({
          headless: true,
          executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
        }).then((browser) => {
          const server = serverFactory2();
          res({ server: server.listen(testResource.ports[0]), browser });
        });
      });
    },
    andWhen: async function(store, actioner, testResource) {
      const [path3, body] = actioner(store);
      const y = await fetch(
        `http://localhost:${testResource.ports[0]}/${path3}`,
        {
          method: "POST",
          body
        }
      );
      return await y.text();
    },
    butThen: async function(store, callback, testResource) {
      const [path3, expectation] = callback(store);
      const bodytext = await (await fetch(`http://localhost:${testResource.ports[0]}/${path3}`)).text();
      assert.equal(bodytext, expectation);
      return bodytext;
    },
    afterEach: function(store, ndx) {
      return new Promise((resolve) => {
        store.browser.close();
        store.server.close(() => {
          resolve();
        });
      });
    }
  },
  entryPath
);

// tests/httpServer/server.ts
import http from "http";
var serverFactory = () => {
  let status = "some great status";
  let counter = 0;
  return http.createServer(function(req, res) {
    if (req.method === "GET") {
      if (req.url === "/get_status") {
        res.write(status);
        res.end();
        return;
      } else if (req.url === "/get_number") {
        res.write(counter.toString());
        res.end();
        return;
      } else {
        res.write("<p>error 404<p>");
        res.end();
        return;
      }
    } else if (req.method === "POST") {
      let body = "";
      req.on("data", function(chunk) {
        body += chunk;
      });
      req.on("end", function() {
        if (req.url === "/put_status") {
          status = body.toString();
          res.write("aok");
          res.end();
          return;
        } else if (req.url === "/put_number") {
          counter = counter + parseInt(body);
          res.write(counter.toString());
          res.end();
          return;
        } else {
          res.write("<p>error 404<p>");
          res.end();
          return;
        }
      });
    }
  });
};

// tests/httpServer/server.puppeteer.test.ts
var myFeature = features.hello;
var ServerHttpPuppeteerTesteranto = PuppeteerHttpTesteranto(
  {
    Suites: {
      Default: "some default Suite"
    },
    Givens: {
      AnEmptyState: () => {
        return {};
      }
    },
    Whens: {
      PostToStatus: (status) => ["put_status", status],
      PostToAdd: (n) => ["put_number", n.toString()]
    },
    Thens: {
      TheStatusIs: (status) => (store) => ["get_status", status],
      TheNumberIs: (number) => (store) => ["get_number", number]
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
        "Testing the Server with Puppeteer",
        [
          Given.AnEmptyState(
            [],
            [],
            [Then.TheStatusIs("some great status")]
          ),
          Given.AnEmptyState(
            [],
            [When.PostToStatus("goodbye")],
            [Then.TheStatusIs("goodbye")]
          ),
          Given.AnEmptyState(
            [myFeature],
            [When.PostToStatus("hello"), When.PostToStatus("aloha")],
            [Then.TheStatusIs("aloha")]
          ),
          Given.AnEmptyState(
            [],
            [],
            [Then.TheNumberIs(0)]
          ),
          Given.AnEmptyState(
            [myFeature],
            [When.PostToAdd(1), When.PostToAdd(2)],
            [Then.TheNumberIs(3)]
          ),
          Given.AnEmptyState(
            [myFeature],
            [
              When.PostToStatus("aloha"),
              When.PostToAdd(4),
              When.PostToStatus("hello"),
              When.PostToAdd(3)
            ],
            [Then.TheStatusIs("hello"), Then.TheNumberIs(7)]
          )
        ],
        []
      )
    ];
  },
  serverFactory,
  __filename
);
export {
  ServerHttpPuppeteerTesteranto
};
