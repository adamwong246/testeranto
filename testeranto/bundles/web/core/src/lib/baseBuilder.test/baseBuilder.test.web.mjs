// src/PM/index.ts
var PM = class {
};

// src/PM/web.ts
var PM_Web = class extends PM {
  constructor(t) {
    super();
    this.testResourceConfiguration = t;
  }
  start() {
    return new Promise((r) => r());
  }
  stop() {
    return new Promise((r) => r());
  }
  getInnerHtml(selector, page2) {
    throw new Error("web.ts getInnHtml not implemented");
  }
  pages() {
    throw new Error("Method not implemented.");
  }
  stopSideCar(n) {
    return window["stopSideCar"](n, this.testResourceConfiguration.name);
  }
  launchSideCar(n) {
    return window["launchSideCar"](n, this.testResourceConfiguration.name);
  }
  waitForSelector(p, s) {
    return window["waitForSelector"](p, s);
  }
  screencast(o, p) {
    return window["screencast"](
      {
        ...opts,
        path: this.testResourceConfiguration.fs + "/" + opts.path
      },
      page.mainFrame()._id,
      this.testResourceConfiguration.name
    );
  }
  screencastStop(recorder) {
    return window["screencastStop"](recorder);
  }
  closePage(p) {
    return window["closePage"](p);
  }
  goto(p, url) {
    return window["goto"](p, url);
  }
  newPage() {
    return window["newPage"]();
  }
  $(selector) {
    return window["$"](selector);
  }
  isDisabled(selector) {
    return window["isDisabled"](selector);
  }
  getAttribute(selector, attribute) {
    return window["getAttribute"](selector, attribute);
  }
  getValue(selector) {
    return window["getValue"](selector);
  }
  focusOn(selector) {
    return window["focusOn"](selector);
  }
  typeInto(value) {
    return window["typeInto"](value);
  }
  async page(x) {
    return window["page"](x);
  }
  click(selector) {
    return window["click"](selector);
  }
  customScreenShot(x, y) {
    const opts2 = x[0];
    const page2 = x[1];
    return window["customScreenShot"](
      {
        ...opts2,
        path: this.testResourceConfiguration.fs + "/" + opts2.path
      },
      this.testResourceConfiguration.name,
      page2
    );
  }
  existsSync(destFolder) {
    return window["existsSync"](destFolder);
  }
  mkdirSync(x) {
    return window["mkdirSync"](this.testResourceConfiguration.fs + "/");
  }
  write(uid, contents) {
    return window["write"](uid, contents);
  }
  writeFileSync([filepath, contents]) {
    return window["writeFileSync"](
      this.testResourceConfiguration.fs + "/" + filepath,
      contents,
      this.testResourceConfiguration.name
    );
  }
  createWriteStream(filepath) {
    return window["createWriteStream"](
      this.testResourceConfiguration.fs + "/" + filepath,
      this.testResourceConfiguration.name
    );
  }
  end(uid) {
    return window["end"](uid);
  }
  customclose() {
    window["customclose"](
      this.testResourceConfiguration.fs,
      this.testResourceConfiguration.name
    );
  }
  testArtiFactoryfileWriter(tLog, callback) {
    return (fPath, value) => {
      callback(
        new Promise((res, rej) => {
          tLog("testArtiFactory =>", fPath);
        })
      );
    };
  }
};

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
      (opts2, p) => {
        const path = `${filepath}/butThen/${opts2.path}`;
        pm.currentStep?.artifacts?.push(path);
        return [
          {
            ...opts2,
            path
          },
          p
        ];
      }
    ],
    [
      "createWriteStream",
      (fp) => {
        const path = `${filepath}/butThen/${fp}`;
        pm.currentStep?.artifacts?.push(path);
        return [path];
      }
    ],
    [
      "writeFileSync",
      (fp, contents) => {
        const path = `${filepath}/butThen/${fp}`;
        pm.currentStep?.artifacts?.push(path);
        return [path, contents];
      }
    ],
    [
      "customScreenShot",
      (opts2, p) => {
        const path = `${filepath}/butThen/${opts2.path}`;
        pm.currentStep?.artifacts?.push(path);
        return [
          {
            ...opts2,
            path
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
    (opts2, p) => [
      {
        ...opts2,
        path: `${filepath}/andWhen/${opts2.path}`
      },
      p
    ]
  ],
  ["createWriteStream", (fp) => [`${filepath}/andWhen/${fp}`]],
  ["writeFileSync", (fp, contents) => [`${filepath}/andWhen${fp}`, contents]],
  [
    "customScreenShot",
    (opts2, p) => [
      {
        ...opts2,
        path: `${filepath}/andWhen${opts2.path}`
      },
      p
    ]
  ]
]);
var afterEachProxy = (pm, suite, given) => baseProxy(pm, [
  [
    "screencast",
    (opts2, p) => [
      {
        ...opts2,
        path: `suite-${suite}/given-${given}/afterEach/${opts2.path}`
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
    (opts2, p) => [
      {
        ...opts2,
        path: `suite-${suite}/given-${given}/afterEach/${opts2.path}`
      },
      p
    ]
  ]
]);
var beforeEachProxy = (pm, suite) => baseProxy(pm, [
  [
    "screencast",
    (opts2, p) => [
      {
        ...opts2,
        path: `suite-${suite}/beforeEach/${opts2.path}`
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
    (opts2, p) => [
      {
        ...opts2,
        path: `suite-${suite}/beforeEach/${opts2.path}`
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
    (opts2, p) => [
      {
        ...opts2,
        path: `suite-${suite}/beforeAll/${opts2.path}`
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
    (opts2, p) => [
      {
        ...opts2,
        path: `suite-${suite}/afterAll/${opts2.path}`
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
  addArtifact(path) {
    console.log(`[Artifact] Adding to ${this.constructor.name}:`, path);
    this.artifacts.push(path);
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

// src/Web.ts
var WebTesteranto = class extends TesterantoCore {
  constructor(input, testSpecification, testImplementation, testResourceRequirement, testAdapter2) {
    super(
      input,
      testSpecification,
      testImplementation,
      testResourceRequirement,
      testAdapter2,
      (cb) => {
      }
    );
  }
  async receiveTestResourceConfig(partialTestResource) {
    const t = partialTestResource;
    const pm = new PM_Web(t);
    return await this.testJobs[0].receiveTestResourceConfig(pm);
  }
};
var Web_default = async (input, testSpecification, testImplementation, testAdapter2, testResourceRequirement = defaultTestResourceRequirement) => {
  return new WebTesteranto(
    input,
    testSpecification,
    testImplementation,
    testResourceRequirement,
    testAdapter2
  );
};

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

// src/lib/baseBuilder.test/baseBuilder.test.web.ts
var baseBuilder_test_web_default = Web_default(
  MockBaseBuilder.prototype,
  specification,
  implementation,
  testAdapter
);
export {
  baseBuilder_test_web_default as default
};
