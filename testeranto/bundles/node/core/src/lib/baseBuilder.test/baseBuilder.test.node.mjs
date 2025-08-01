import { createRequire } from 'module';const require = createRequire(import.meta.url);

// src/lib/index.ts
var BaseAdapter = () => ({
  beforeAll: async (s) => s,
  beforeEach: async function(subject, initialValues, x, testResource, pm) {
    return subject;
  },
  afterEach: async (s) => s,
  afterAll: (store) => void 0,
  butThen: async (store, thenCb) => {
    return thenCb(store);
  },
  andWhen: async (store, whenCB, testResource, pm) => {
    try {
      await whenCB(store, testResource, pm);
    } catch (error) {
      console.error("Error in andWhen:", error);
      throw error;
    }
  },
  assertThis: (x) => x
});
var DefaultAdapter = (p) => {
  return {
    ...BaseAdapter,
    ...p
  };
};
var defaultTestResourceRequirement = {
  ports: 0
};

// src/lib/pmProxy.ts
var baseProxy = function(pm, mappings) {
  return new Proxy(pm, {
    get: (target, prop, receiver) => {
      for (const mapping of mappings) {
        const method = mapping[0];
        const arger = mapping[1];
        if (prop === method) {
          return (...x) => target[prop](arger(...x));
        }
      }
      return (...x) => target[prop](...x);
    }
  });
};
var butThenProxy = (pm, filepath) => {
  return baseProxy(pm, [
    [
      "screencast",
      (opts, p) => {
        const path2 = `${filepath}/butThen/${opts.path}`;
        pm.currentStep?.artifacts?.push(path2);
        return [
          {
            ...opts,
            path: path2
          },
          p
        ];
      }
    ],
    [
      "createWriteStream",
      (fp) => {
        const path2 = `${filepath}/butThen/${fp}`;
        pm.currentStep?.artifacts?.push(path2);
        return [path2];
      }
    ],
    [
      "writeFileSync",
      (fp, contents) => {
        const path2 = `${filepath}/butThen/${fp}`;
        pm.currentStep?.artifacts?.push(path2);
        return [path2, contents];
      }
    ],
    [
      "customScreenShot",
      (opts, p) => {
        const path2 = `${filepath}/butThen/${opts.path}`;
        pm.currentStep?.artifacts?.push(path2);
        return [
          {
            ...opts,
            path: path2
          },
          p
        ];
      }
    ]
  ]);
};
var andWhenProxy = (pm, filepath) => baseProxy(pm, [
  [
    "screencast",
    (opts, p) => [
      {
        ...opts,
        path: `${filepath}/andWhen/${opts.path}`
      },
      p
    ]
  ],
  ["createWriteStream", (fp) => [`${filepath}/andWhen/${fp}`]],
  ["writeFileSync", (fp, contents) => [`${filepath}/andWhen${fp}`, contents]],
  [
    "customScreenShot",
    (opts, p) => [
      {
        ...opts,
        path: `${filepath}/andWhen${opts.path}`
      },
      p
    ]
  ]
]);
var afterEachProxy = (pm, suite, given) => baseProxy(pm, [
  [
    "screencast",
    (opts, p) => [
      {
        ...opts,
        path: `suite-${suite}/given-${given}/afterEach/${opts.path}`
      },
      p
    ]
  ],
  ["createWriteStream", (fp) => [`suite-${suite}/afterEach/${fp}`]],
  [
    "writeFileSync",
    (fp, contents) => [
      `suite-${suite}/given-${given}/afterEach/${fp}`,
      contents
    ]
  ],
  [
    "customScreenShot",
    (opts, p) => [
      {
        ...opts,
        path: `suite-${suite}/given-${given}/afterEach/${opts.path}`
      },
      p
    ]
  ]
]);
var beforeEachProxy = (pm, suite) => baseProxy(pm, [
  [
    "screencast",
    (opts, p) => [
      {
        ...opts,
        path: `suite-${suite}/beforeEach/${opts.path}`
      },
      p
    ]
  ],
  [
    "writeFileSync",
    (fp, contents) => [`suite-${suite}/beforeEach/${fp}`, contents]
  ],
  [
    "customScreenShot",
    (opts, p) => [
      {
        ...opts,
        path: `suite-${suite}/beforeEach/${opts.path}`
      },
      p
    ]
  ],
  ["createWriteStream", (fp) => [`suite-${suite}/beforeEach/${fp}`]]
]);
var beforeAllProxy = (pm, suite) => baseProxy(pm, [
  [
    "writeFileSync",
    (fp, contents) => [`suite-${suite}/beforeAll/${fp}`, contents]
  ],
  [
    "customScreenShot",
    (opts, p) => [
      {
        ...opts,
        path: `suite-${suite}/beforeAll/${opts.path}`
      },
      p
    ]
  ],
  ["createWriteStream", (fp) => [`suite-${suite}/beforeAll/${fp}`]]
]);
var afterAllProxy = (pm, suite) => baseProxy(pm, [
  ["createWriteStream", (fp) => [`suite-${suite}/afterAll/${fp}`]],
  [
    "writeFileSync",
    (fp, contents) => [`suite-${suite}/afterAll/${fp}`, contents]
  ],
  [
    "customScreenShot",
    (opts, p) => [
      {
        ...opts,
        path: `suite-${suite}/afterAll/${opts.path}`
      },
      p
    ]
  ]
]);

// src/lib/abstractBase.ts
var BaseGiven = class {
  constructor(name, features, whens, thens, givenCB, initialValues) {
    this.artifacts = [];
    this.name = name;
    this.features = features;
    this.whens = whens;
    this.thens = thens;
    this.givenCB = givenCB;
    this.initialValues = initialValues;
  }
  addArtifact(path2) {
    console.log(`[Artifact] Adding to ${this.constructor.name}:`, path2);
    this.artifacts.push(path2);
  }
  beforeAll(store) {
    return store;
  }
  toObj() {
    return {
      key: this.key,
      name: this.name,
      whens: this.whens.map((w) => {
        if (w && w.toObj)
          return w.toObj();
        console.error("w is not as expected!", w.toString());
        return {};
      }),
      thens: this.thens.map((t) => t.toObj()),
      error: this.error ? [this.error, this.error.stack] : null,
      failed: this.failed,
      features: this.features,
      artifacts: this.artifacts
    };
  }
  async afterEach(store, key, artifactory, pm) {
    return store;
  }
  async give(subject, key, testResourceConfiguration, tester, artifactory, tLog, pm, suiteNdx) {
    this.key = key;
    tLog(`
 ${this.key}`);
    tLog(`
 Given: ${this.name}`);
    const givenArtifactory = (fPath, value) => artifactory(`given-${key}/${fPath}`, value);
    this.uberCatcher((e) => {
      console.error(e.toString());
      this.error = e.error;
      tLog(e.stack);
    });
    try {
      const proxiedPm = beforeEachProxy(pm, suiteNdx.toString());
      console.log(`[Given] Setting currentStep for beforeEach:`, this.name);
      proxiedPm.currentStep = this;
      this.store = await this.givenThat(
        subject,
        testResourceConfiguration,
        givenArtifactory,
        this.givenCB,
        this.initialValues,
        proxiedPm
      );
    } catch (e) {
      console.error("Given failure: ", e.toString());
      this.error = e;
      throw e;
    }
    try {
      for (const [whenNdx, whenStep] of this.whens.entries()) {
        await whenStep.test(
          this.store,
          testResourceConfiguration,
          tLog,
          pm,
          `suite-${suiteNdx}/given-${key}/when/${whenNdx}`
        );
      }
      for (const [thenNdx, thenStep] of this.thens.entries()) {
        const t = await thenStep.test(
          this.store,
          testResourceConfiguration,
          tLog,
          pm,
          `suite-${suiteNdx}/given-${key}/then-${thenNdx}`
        );
        tester(t);
      }
    } catch (e) {
      this.failed = true;
      tLog(e.stack);
      throw e;
    } finally {
      try {
        await this.afterEach(
          this.store,
          this.key,
          givenArtifactory,
          afterEachProxy(pm, suiteNdx.toString(), key)
        );
      } catch (e) {
        console.error("afterEach failed!", e.toString());
        this.failed = e;
        throw e;
      }
    }
    return this.store;
  }
};
var BaseWhen = class {
  constructor(name, whenCB) {
    this.artifacts = [];
    this.name = name;
    this.whenCB = whenCB;
  }
  toObj() {
    console.log("toObj error", this.error);
    if (this.error) {
      return {
        name: this.name,
        error: this.error && this.error.name + this.error.stack,
        artifacts: this.artifacts
      };
    } else {
      return {
        name: this.name,
        artifacts: this.artifacts
      };
    }
  }
  async test(store, testResourceConfiguration, tLog, pm, filepath) {
    try {
      tLog(" When:", this.name);
      console.debug("[DEBUG] Executing When step:", this.name.toString());
      const proxiedPm = andWhenProxy(pm, filepath);
      console.log(`[When] Setting currentStep for andWhen:`, this.name);
      proxiedPm.currentStep = this;
      const result = await this.andWhen(
        store,
        this.whenCB,
        testResourceConfiguration,
        proxiedPm
      );
      console.debug("[DEBUG] When step completed:", this.name.toString());
      return result;
    } catch (e) {
      console.error(
        "[ERROR] When step failed:",
        this.name.toString(),
        e.toString()
      );
      this.error = e;
      throw e;
    }
  }
};
var BaseThen = class {
  constructor(name, thenCB) {
    this.artifacts = [];
    this.name = name;
    this.thenCB = thenCB;
    this.error = false;
  }
  toObj() {
    return {
      name: this.name,
      error: this.error,
      artifacts: this.artifacts
    };
  }
  async test(store, testResourceConfiguration, tLog, pm, filepath) {
    const proxiedPm = butThenProxy(pm, filepath);
    console.log(`[Then] Setting currentStep for butThen:`, this.name);
    proxiedPm.currentStep = this;
    return this.butThen(
      store,
      async (s) => {
        if (typeof this.thenCB === "function") {
          return await this.thenCB(s, proxiedPm);
        } else {
          return this.thenCB;
        }
      },
      testResourceConfiguration,
      butThenProxy(pm, filepath)
    ).catch((e) => {
      this.error = e.toString();
    });
  }
};

// src/lib/basebuilder.ts
var BaseBuilder = class {
  constructor(input, suitesOverrides, givenOverides, whenOverides, thenOverides, testResourceRequirement, testSpecification) {
    this.artifacts = [];
    this.artifacts = [];
    this.testResourceRequirement = testResourceRequirement;
    this.suitesOverrides = suitesOverrides;
    this.givenOverides = givenOverides;
    this.whenOverides = whenOverides;
    this.thenOverides = thenOverides;
    this.testSpecification = testSpecification;
    this.specs = testSpecification(
      this.Suites(),
      this.Given(),
      this.When(),
      this.Then()
    );
    this.testJobs = this.specs.map((suite) => {
      const suiteRunner = (suite2) => async (puppetMaster, tLog) => {
        const x = await suite2.run(
          input,
          puppetMaster.testResourceConfiguration,
          (fPath, value) => puppetMaster.testArtiFactoryfileWriter(
            tLog,
            (p) => {
              this.artifacts.push(p);
            }
          )(puppetMaster.testResourceConfiguration.fs + "/" + fPath, value),
          tLog,
          puppetMaster
        );
        return x;
      };
      const runner = suiteRunner(suite);
      return {
        test: suite,
        toObj: () => {
          return suite.toObj();
        },
        runner,
        receiveTestResourceConfig: async function(puppetMaster) {
          const tLog = async (...l) => {
          };
          const suiteDone = await runner(puppetMaster, tLog);
          const fails = suiteDone.fails;
          await puppetMaster.writeFileSync([
            `bdd_errors.txt`,
            fails.toString()
          ]);
          await puppetMaster.writeFileSync([
            `tests.json`,
            JSON.stringify(this.toObj(), null, 2)
          ]);
          return {
            failed: fails > 0,
            fails,
            artifacts: this.artifacts || [],
            // logPromise,
            features: suiteDone.features()
          };
        }
      };
    });
  }
  // testsJson() {
  //   puppetMaster.writeFileSync(
  //     `tests.json`,
  //     JSON.stringify({ features: suiteDone.features() }, null, 2)
  //   );
  // }
  Specs() {
    return this.specs;
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
};

// src/lib/classBuilder.ts
var ClassBuilder = class extends BaseBuilder {
  constructor(testImplementation, testSpecification, input, suiteKlasser, givenKlasser, whenKlasser, thenKlasser, testResourceRequirement) {
    const classySuites = Object.entries(testImplementation.suites).reduce(
      (a, [key], index) => {
        a[key] = (somestring, givens) => {
          return new suiteKlasser.prototype.constructor(
            somestring,
            index,
            givens
          );
        };
        return a;
      },
      {}
    );
    const classyGivens = Object.entries(testImplementation.givens).reduce(
      (a, [key, g]) => {
        a[key] = (features, whens, thens, ...initialValues) => {
          return new givenKlasser.prototype.constructor(
            key,
            features,
            whens,
            thens,
            testImplementation.givens[key],
            initialValues
          );
        };
        return a;
      },
      {}
    );
    const classyWhens = Object.entries(testImplementation.whens).reduce(
      (a, [key, whEn]) => {
        a[key] = (...payload) => {
          return new whenKlasser.prototype.constructor(
            `${whEn.name}: ${payload && payload.toString()}`,
            whEn(...payload)
          );
        };
        return a;
      },
      {}
    );
    const classyThens = Object.entries(
      testImplementation.thens
    ).reduce(
      (a, [key, thEn]) => {
        a[key] = (expected, ...x) => {
          return new thenKlasser.prototype.constructor(
            `${thEn.name}: ${expected && expected.toString()}`,
            thEn(expected, ...x)
          );
        };
        return a;
      },
      {}
    );
    super(
      input,
      classySuites,
      classyGivens,
      classyWhens,
      classyThens,
      testResourceRequirement,
      testSpecification
    );
  }
};

// src/lib/BaseSuite.ts
var BaseSuite = class {
  constructor(name, index, givens = {}) {
    const suiteName = name || "testSuite";
    if (!suiteName) {
      throw new Error("BaseSuite requires a non-empty name");
    }
    console.log(
      "[DEBUG] BaseSuite constructor - name:",
      suiteName,
      "index:",
      index
    );
    this.name = suiteName;
    this.index = index;
    this.givens = givens;
    this.fails = 0;
    console.log("[DEBUG] BaseSuite initialized:", this.name, this.index);
    console.log("[DEBUG] BaseSuite givens:", Object.keys(givens).toString());
  }
  features() {
    try {
      const features = Object.keys(this.givens).map((k) => this.givens[k].features).flat().filter((value, index, array) => {
        return array.indexOf(value) === index;
      });
      console.debug("[DEBUG] Features extracted:", features.toString());
      return features || [];
    } catch (e) {
      console.error("[ERROR] Failed to extract features:", e);
      return [];
    }
  }
  toObj() {
    const givens = Object.keys(this.givens).map((k) => this.givens[k].toObj());
    return {
      name: this.name,
      givens,
      fails: this.fails,
      failed: this.failed,
      features: this.features()
    };
  }
  setup(s, artifactory, tr, pm) {
    return new Promise((res) => res(s));
  }
  assertThat(t) {
    return !!t;
  }
  afterAll(store, artifactory, pm) {
    return store;
  }
  async run(input, testResourceConfiguration, artifactory, tLog, pm) {
    this.testResourceConfiguration = testResourceConfiguration;
    const suiteArtifactory = (fPath, value) => artifactory(`suite-${this.index}-${this.name}/${fPath}`, value);
    tLog("\nSuite:", this.index, this.name);
    const sNdx = this.index;
    const subject = await this.setup(
      input,
      suiteArtifactory,
      testResourceConfiguration,
      beforeAllProxy(pm, sNdx.toString())
    );
    for (const [gKey, g] of Object.entries(this.givens)) {
      const giver = this.givens[gKey];
      this.store = await giver.give(
        subject,
        gKey,
        testResourceConfiguration,
        this.assertThat,
        suiteArtifactory,
        tLog,
        pm,
        sNdx
      ).catch((e) => {
        this.failed = true;
        this.fails = this.fails + 1;
        throw e;
      });
    }
    try {
      this.afterAll(
        this.store,
        artifactory,
        afterAllProxy(pm, sNdx.toString())
      );
    } catch (e) {
      console.error(e);
    }
    return this;
  }
};

// src/lib/core.ts
var TesterantoCore = class extends ClassBuilder {
  constructor(input, testSpecification, testImplementation, testResourceRequirement = defaultTestResourceRequirement, testAdapter2, uberCatcher) {
    const fullAdapter = DefaultAdapter(testAdapter2);
    super(
      testImplementation,
      testSpecification,
      input,
      class extends BaseSuite {
        afterAll(store, artifactory, pm) {
          return fullAdapter.afterAll(store, pm);
        }
        assertThat(t) {
          return fullAdapter.assertThis(t);
        }
        async setup(s, artifactory, tr, pm) {
          return (fullAdapter.beforeAll || (async (input2, artifactory2, tr2, pm2) => input2))(
            s,
            this.testResourceConfiguration,
            // artifactory,
            pm
          );
        }
      },
      class Given extends BaseGiven {
        constructor() {
          super(...arguments);
          this.uberCatcher = uberCatcher;
        }
        async givenThat(subject, testResource, artifactory, initializer, initialValues, pm) {
          return fullAdapter.beforeEach(
            subject,
            initializer,
            testResource,
            initialValues,
            pm
          );
        }
        afterEach(store, key, artifactory, pm) {
          return new Promise(
            (res) => res(fullAdapter.afterEach(store, key, pm))
          );
        }
      },
      class When extends BaseWhen {
        async andWhen(store, whenCB, testResource, pm) {
          return await fullAdapter.andWhen(store, whenCB, testResource, pm);
        }
      },
      class Then extends BaseThen {
        async butThen(store, thenCB, testResource, pm) {
          return await fullAdapter.butThen(store, thenCB, testResource, pm);
        }
      },
      testResourceRequirement
    );
  }
};

// src/PM/node.ts
import net from "net";
import fs from "fs";
import path from "path";

// src/PM/index.ts
var PM = class {
};

// src/PM/node.ts
var fPaths = [];
var PM_Node = class extends PM {
  constructor(t, ipcFile) {
    super();
    this.testResourceConfiguration = t;
    this.client = net.createConnection(ipcFile, () => {
      return;
    });
  }
  start() {
    throw new Error("DEPRECATED");
  }
  stop() {
    throw new Error("stop not implemented.");
  }
  send(command, ...argz) {
    const key = Math.random().toString();
    if (!this.client) {
      console.error(
        `Tried to send "${command} (${argz})" but the test has not been started and the IPC client is not established. Exiting as failure!`
      );
      process.exit(-1);
    }
    return new Promise((res) => {
      const myListener = (event) => {
        const x = JSON.parse(event);
        if (x.key === key) {
          process.removeListener("message", myListener);
          res(x.payload);
        }
      };
      process.addListener("message", myListener);
      this.client.write(JSON.stringify([command, ...argz, key]));
    });
  }
  async launchSideCar(n) {
    return this.send(
      "launchSideCar",
      n,
      this.testResourceConfiguration.name
    );
  }
  stopSideCar(n) {
    return this.send(
      "stopSideCar",
      n,
      this.testResourceConfiguration.name
    );
  }
  async pages() {
    return this.send("pages", ...arguments);
  }
  waitForSelector(p, s) {
    return this.send("waitForSelector", ...arguments);
  }
  closePage(p) {
    return this.send("closePage", ...arguments);
  }
  goto(page, url) {
    return this.send("goto", ...arguments);
  }
  async newPage() {
    return this.send("newPage");
  }
  $(selector, page) {
    return this.send("$", ...arguments);
  }
  isDisabled(selector) {
    return this.send("isDisabled", ...arguments);
  }
  getAttribute(selector, attribute, p) {
    return this.send("getAttribute", ...arguments);
  }
  getInnerHtml(selector, p) {
    return this.send("getInnerHtml", ...arguments);
  }
  // setValue(selector: string) {
  //   return this.send("getValue", ...arguments);
  // }
  focusOn(selector) {
    return this.send("focusOn", ...arguments);
  }
  typeInto(selector) {
    return this.send("typeInto", ...arguments);
  }
  page() {
    return this.send("page");
  }
  click(selector) {
    return this.send("click", ...arguments);
  }
  screencast(opts, page) {
    return this.send(
      "screencast",
      {
        ...opts,
        path: this.testResourceConfiguration.fs + "/" + opts.path
      },
      page,
      this.testResourceConfiguration.name
    );
  }
  screencastStop(p) {
    return this.send("screencastStop", ...arguments);
  }
  customScreenShot(x, y) {
    const opts = x[0];
    const page = x[1];
    return this.send(
      "customScreenShot",
      {
        ...opts,
        path: this.testResourceConfiguration.fs + "/" + opts.path
      },
      this.testResourceConfiguration.name,
      page
    );
  }
  async existsSync(destFolder) {
    return await this.send(
      "existsSync",
      this.testResourceConfiguration.fs + "/" + destFolder
    );
  }
  mkdirSync() {
    return this.send("mkdirSync", this.testResourceConfiguration.fs + "/");
  }
  async write(uid, contents) {
    return await this.send("write", ...arguments);
  }
  async writeFileSync([filepath, contents]) {
    return await this.send(
      "writeFileSync",
      this.testResourceConfiguration.fs + "/" + filepath,
      contents,
      this.testResourceConfiguration.name
    );
  }
  async createWriteStream(filepath) {
    return await this.send(
      "createWriteStream",
      this.testResourceConfiguration.fs + "/" + filepath,
      this.testResourceConfiguration.name
    );
  }
  async end(uid) {
    return await this.send("end", ...arguments);
  }
  async customclose() {
    return await this.send(
      "customclose",
      this.testResourceConfiguration.fs,
      this.testResourceConfiguration.name
    );
  }
  testArtiFactoryfileWriter(tLog, callback) {
    return (fPath, value) => {
      callback(
        new Promise((res, rej) => {
          tLog("testArtiFactory =>", fPath);
          const cleanPath = path.resolve(fPath);
          fPaths.push(cleanPath.replace(process.cwd(), ``));
          const targetDir = cleanPath.split("/").slice(0, -1).join("/");
          fs.mkdir(targetDir, { recursive: true }, async (error) => {
            if (error) {
              console.error(`\u2757\uFE0FtestArtiFactory failed`, targetDir, error);
            }
            if (Buffer.isBuffer(value)) {
              fs.writeFileSync(fPath, value, "binary");
              res();
            } else if (`string` === typeof value) {
              fs.writeFileSync(fPath, value.toString(), {
                encoding: "utf-8"
              });
              res();
            } else {
              const pipeStream = value;
              const myFile = fs.createWriteStream(fPath);
              pipeStream.pipe(myFile);
              pipeStream.on("close", () => {
                myFile.close();
                res();
              });
            }
          });
        })
      );
    };
  }
  // launch(options?: PuppeteerLaunchOptions): Promise<Browser>;
  startPuppeteer(options) {
  }
};

// src/Node.ts
var ipcfile;
var NodeTesteranto = class extends TesterantoCore {
  constructor(input, testSpecification, testImplementation, testResourceRequirement, testAdapter2) {
    super(
      input,
      testSpecification,
      testImplementation,
      testResourceRequirement,
      testAdapter2,
      () => {
      }
    );
  }
  async receiveTestResourceConfig(partialTestResource) {
    console.log("receiveTestResourceConfig", partialTestResource);
    const t = JSON.parse(partialTestResource);
    const pm = new PM_Node(t, ipcfile);
    return await this.testJobs[0].receiveTestResourceConfig(pm);
  }
};
var testeranto = async (input, testSpecification, testImplementation, testAdapter2, testResourceRequirement = defaultTestResourceRequirement) => {
  try {
    const t = new NodeTesteranto(
      input,
      testSpecification,
      testImplementation,
      testResourceRequirement,
      testAdapter2
    );
    process.on("unhandledRejection", (reason, promise) => {
      console.error("Unhandled Rejection at:", promise, "reason:", reason);
    });
    ipcfile = process.argv[3];
    const f = await t.receiveTestResourceConfig(process.argv[2]);
    console.error("goodbye node with failures", f.fails);
    process.exit(f.fails);
  } catch (e) {
    console.error("goodbye node with caught error", e);
    process.exit(-1);
  }
};
var Node_default = testeranto;

// src/lib/baseBuilder.test/baseBuilder.test.specification.ts
var specification = (Suite, Given, When, Then) => {
  return [
    Suite.Default("Testing BaseBuilder functionality", {
      testInitialization: Given["the default BaseBuilder"](
        ["BaseBuilder should initialize correctly"],
        [],
        [
          Then["it is initialized"](),
          Then["it tracks artifacts"]()
          // Then["it creates jobs"](),
          // Then["it generates TestSpecifications"](),
        ]
      ),
      testSpecsGeneration: Given["the default BaseBuilder"](
        ["BaseBuilder should generate specs from test specification"],
        [],
        [Then["it generates TestSpecifications"]()]
      ),
      testJobsCreation: Given["the default BaseBuilder"](
        ["BaseBuilder should create test jobs"],
        [],
        [Then["it creates jobs"]()]
      )
    })
  ];
};

// src/lib/baseBuilder.test/baseBuilder.test.mock.ts
var MockBaseBuilder = class extends BaseBuilder {
  constructor(input, suitesOverrides = {}, givenOverrides = {}, whenOverrides = {}, thenOverrides = {}, testResourceRequirement = { ports: 0 }, testSpecification = () => []) {
    super(
      input,
      suitesOverrides,
      givenOverrides,
      whenOverrides,
      thenOverrides,
      testResourceRequirement,
      testSpecification
    );
    this.summary = {};
  }
  /**
   * Simplified version for testing that doesn't actually run tests
   */
  testRun(puppetMaster) {
    this.summary = {
      [puppetMaster.testResourceConfiguration.name]: {
        typeErrors: 0,
        staticErrors: 0,
        runTimeError: "",
        prompt: "",
        failingFeatures: {}
      }
    };
    return Promise.resolve({
      failed: false,
      fails: 0,
      artifacts: [],
      // logPromise: Promise.resolve(),
      features: []
    });
  }
};

// src/lib/baseBuilder.test/baseBuilder.test.implementation.ts
var implementation = {
  suites: {
    Default: "BaseBuilder test suite"
  },
  givens: {
    "the default BaseBuilder": () => {
      return new MockBaseBuilder(
        {},
        // input
        {},
        // suitesOverrides
        {},
        // givenOverrides
        {},
        // whenOverrides
        {},
        // thenOverrides
        { ports: 0 },
        // testResourceRequirement
        () => []
        // testSpecification
      );
    },
    "a BaseBuilder with TestInput": (input) => {
      return new MockBaseBuilder(
        input,
        {},
        {},
        {},
        {},
        { ports: [] },
        () => []
      );
    },
    "a BaseBuilder with Test Resource Requirements": (requirements) => {
      return new MockBaseBuilder({}, {}, {}, {}, {}, requirements, () => []);
    }
  },
  whens: {
    addArtifact: (artifact) => (builder) => {
      builder.artifacts.push(artifact);
      return builder;
    },
    setTestJobs: (jobs) => (builder) => {
      builder.testJobs = jobs;
      return builder;
    }
  },
  thens: {
    "it is initialized": () => (builder, utils) => {
      utils.writeFileSync("hello.txt", "world");
      if (!(builder instanceof BaseBuilder)) {
        console.error("Builder instance:", builder);
        throw new Error(
          `Builder was not properly initialized - expected BaseBuilder instance but got ${builder?.constructor?.name}`
        );
      }
      [
        "artifacts",
        "testJobs",
        "specs",
        "suitesOverrides",
        "givenOverides",
        "whenOverides",
        "thenOverides"
      ].forEach((prop) => {
        if (!(prop in builder)) {
          throw new Error(`Builder missing required property: ${prop}`);
        }
      });
      return builder;
    },
    "it generates TestSpecifications": () => (builder) => {
      if (!Array.isArray(builder.specs)) {
        throw new Error("Specs were not generated");
      }
      return builder;
    },
    "it creates jobs": () => (builder) => {
      if (!Array.isArray(builder.testJobs)) {
        throw new Error("Test jobs were not created");
      }
      return builder;
    },
    "it tracks artifacts": () => (builder) => {
      if (!Array.isArray(builder.artifacts)) {
        throw new Error("Artifacts array not initialized");
      }
      return builder;
    },
    resourceRequirementsSet: () => (builder) => {
      if (!builder.testResourceRequirement) {
        throw new Error("Resource requirements not set");
      }
      return builder;
    },
    suitesOverridesConfigured: () => (builder) => {
      if (!builder.suitesOverrides) {
        throw new Error("Suites overrides not configured");
      }
      return builder;
    },
    givensOverridesConfigured: () => (builder) => {
      if (!builder.givenOverides) {
        throw new Error("Givens overrides not configured");
      }
      return builder;
    },
    whensOverridesConfigured: () => (builder) => {
      if (!builder.whenOverides) {
        throw new Error("Whens overrides not configured");
      }
      return builder;
    },
    thensOverridesConfigured: () => (builder) => {
      if (!builder.thenOverides) {
        throw new Error("Thens overrides not configured");
      }
      return builder;
    }
  }
};

// src/lib/baseBuilder.test/baseBuilder.test.adapter.ts
var testAdapter = {
  beforeAll: async (input, testResource, pm) => input,
  beforeEach: async (subject, initializer, testResource, initialValues, pm) => {
    console.log("Initializing test with:", {
      subject,
      initializer,
      initialValues
    });
    const result = initializer();
    console.log("Initialization result:", result.toString());
    return result;
  },
  andWhen: async (store, whenCB, testResource, utils) => {
    return whenCB(store, utils);
  },
  butThen: async (store, thenCB, testResource, pm) => {
    return thenCB(store, pm);
  },
  afterEach: (store) => store,
  afterAll: () => {
  },
  assertThis: (x) => x
};

// src/lib/baseBuilder.test/baseBuilder.test.node.ts
var baseBuilder_test_node_default = Node_default(
  MockBaseBuilder.prototype,
  specification,
  implementation,
  testAdapter
);
export {
  baseBuilder_test_node_default as default
};
