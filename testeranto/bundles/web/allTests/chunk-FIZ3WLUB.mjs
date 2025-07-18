// src/lib/basebuilder.ts
var BaseBuilder = class {
  constructor(input, suitesOverrides, givenOverides, whenOverides, thenOverides, checkOverides, testResourceRequirement, testSpecification) {
    this.artifacts = [];
    this.artifacts = [];
    this.testResourceRequirement = testResourceRequirement;
    this.suitesOverrides = suitesOverrides;
    this.givenOverides = givenOverides;
    this.whenOverides = whenOverides;
    this.thenOverides = thenOverides;
    this.checkOverides = checkOverides;
    this.testSpecification = testSpecification;
    this.specs = testSpecification(
      this.Suites(),
      this.Given(),
      this.When(),
      this.Then(),
      this.Check()
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
          const logFilePath = "log.txt";
          const access = await puppetMaster.createWriteStream(
            logFilePath
          );
          const tLog = async (...l) => {
          };
          const suiteDone = await runner(puppetMaster, tLog);
          const logPromise = new Promise(async (res) => {
            await puppetMaster.end(access);
            res(true);
          });
          const fails = suiteDone.fails;
          await puppetMaster.writeFileSync(`bdd_errors.txt`, fails.toString());
          await puppetMaster.writeFileSync(
            `tests.json`,
            JSON.stringify(this.toObj(), null, 2)
          );
          return {
            failed: fails > 0,
            fails,
            artifacts: this.artifacts || [],
            logPromise,
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
  Check() {
    return this.checkOverides;
  }
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
var butThenProxy = (pm, filepath) => baseProxy(pm, [
  [
    "screencast",
    (opts2, p) => [
      {
        ...opts2,
        path: `${filepath}/butThen/${opts2.path}`
      },
      p
    ]
  ],
  ["createWriteStream", (fp) => [`${filepath}/butThen/${fp}`]],
  [
    "writeFileSync",
    (fp, contents) => [`${filepath}/butThen/${fp}`, contents]
  ],
  [
    "customScreenShot",
    (opts2, p) => [
      {
        ...opts2,
        path: `${filepath}/butThen/${opts2.path}`
      },
      p
    ]
  ]
]);
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

// src/lib/BaseSuite.ts
var BaseSuite = class {
  constructor(name, index, givens = {}, checks = []) {
    this.name = name;
    this.index = index;
    this.givens = givens;
    this.checks = checks;
    this.fails = 0;
  }
  features() {
    const features = Object.keys(this.givens).map((k) => this.givens[k].features).flat().filter((value, index, array) => {
      return array.indexOf(value) === index;
    });
    return features || [];
  }
  toObj() {
    const givens = Object.keys(this.givens).map((k) => this.givens[k].toObj());
    const checks = Object.keys(this.checks).map((k) => this.checks[k].toObj());
    return {
      name: this.name,
      givens,
      checks,
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
        console.error("Given error 1:", e);
        throw e;
      });
    }
    for (const [ndx, thater] of this.checks.entries()) {
      await thater.check(
        subject,
        thater.name,
        testResourceConfiguration,
        this.assertThat,
        suiteArtifactory,
        tLog,
        pm
      );
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
    console.log("customScreenShot 2 opts", opts2);
    console.log("customScreenShot 2 page", page2);
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
  writeFileSync(filepath, contents) {
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
var BaseTestInterface = () => ({
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
var DefaultTestInterface = (p) => {
  return {
    ...BaseTestInterface,
    ...p
  };
};
var defaultTestResourceRequirement = {
  ports: 0
};

// src/lib/abstractBase.ts
var BaseGiven = class {
  constructor(name, features, whens, thens, givenCB, initialValues) {
    this.name = name;
    this.features = features;
    this.whens = whens;
    this.thens = thens;
    this.givenCB = givenCB;
    this.initialValues = initialValues;
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
        console.error("w is not as expected!", w);
        return {};
      }),
      thens: this.thens.map((t) => t.toObj()),
      error: this.error ? [this.error, this.error.stack] : null,
      failed: this.failed,
      features: this.features
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
      console.error(e);
      this.error = e.error;
      tLog(e.stack);
    });
    try {
      this.store = await this.givenThat(
        subject,
        testResourceConfiguration,
        givenArtifactory,
        this.givenCB,
        this.initialValues,
        beforeEachProxy(pm, suiteNdx.toString())
      );
    } catch (e) {
      console.error("failure 4 ", e);
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
        console.error("afterEach failed!", e);
        this.failed = e;
        throw e;
      }
    }
    return this.store;
  }
};
var BaseWhen = class {
  constructor(name, whenCB) {
    this.name = name;
    this.whenCB = whenCB;
  }
  toObj() {
    console.log("toObj error", this.error);
    return {
      name: this.name,
      error: this.error && this.error.name + this.error.stack
    };
  }
  async test(store, testResourceConfiguration, tLog, pm, filepath) {
    tLog(" When:", this.name);
    return await this.andWhen(
      store,
      this.whenCB,
      testResourceConfiguration,
      andWhenProxy(pm, filepath)
    ).catch((e) => {
      this.error = e;
      throw e;
    });
  }
};
var BaseThen = class {
  constructor(name, thenCB) {
    this.name = name;
    this.thenCB = thenCB;
    this.error = false;
  }
  toObj() {
    return {
      name: this.name,
      error: this.error
    };
  }
  async test(store, testResourceConfiguration, tLog, pm, filepath) {
    return this.butThen(
      store,
      async (s) => {
        tLog(" Then!!!:", this.name);
        if (typeof this.thenCB === "function") {
          return await this.thenCB(s);
        } else {
          return this.thenCB;
        }
      },
      testResourceConfiguration,
      butThenProxy(pm, filepath)
    ).catch((e) => {
      this.error = e;
      throw e;
    });
  }
  check() {
  }
};
var BaseCheck = class {
  constructor(name, features, checker, x, checkCB) {
    this.name = name;
    this.features = features;
    this.checkCB = checkCB;
    this.checker = checker;
  }
  toObj() {
    return {
      key: this.key,
      name: this.name,
      // functionAsString: this.checkCB.toString(),
      features: this.features
    };
  }
  async afterEach(store, key, artifactory, pm) {
    return store;
  }
  beforeAll(store) {
    return store;
  }
  async check(subject, key, testResourceConfiguration, tester, artifactory, tLog, pm) {
    this.key = key;
    tLog(`
 Check: ${this.name}`);
    this.store = await this.checkThat(
      subject,
      testResourceConfiguration,
      artifactory,
      this.checkCB,
      this.initialValues,
      pm
    );
    await this.checker(this.store, pm);
    return;
  }
};

// src/lib/classBuilder.ts
var ClassBuilder = class extends BaseBuilder {
  constructor(testImplementation, testSpecification, input, suiteKlasser, givenKlasser, whenKlasser, thenKlasser, checkKlasser, testResourceRequirement) {
    const classySuites = Object.entries(testImplementation.suites).reduce(
      (a, [key], index) => {
        a[key] = (somestring, givens, checks) => {
          return new suiteKlasser.prototype.constructor(
            somestring,
            index,
            givens,
            checks
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
    const classyChecks = Object.entries(testImplementation.checks).reduce(
      (a, [key, chEck]) => {
        a[key] = (name, features, checker) => {
          return new checkKlasser.prototype.constructor(
            key,
            features,
            chEck,
            checker
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
      classyChecks,
      testResourceRequirement,
      testSpecification
    );
  }
};

// src/lib/core.ts
var TesterantoCore = class extends ClassBuilder {
  constructor(input, testSpecification, testImplementation, testResourceRequirement = defaultTestResourceRequirement, testInterface, uberCatcher) {
    const fullTestInterface = DefaultTestInterface(testInterface);
    super(
      testImplementation,
      testSpecification,
      input,
      class extends BaseSuite {
        afterAll(store, artifactory, pm) {
          return fullTestInterface.afterAll(store, pm);
        }
        assertThat(t) {
          return fullTestInterface.assertThis(t);
        }
        async setup(s, artifactory, tr, pm) {
          return (fullTestInterface.beforeAll || (async (input2, artifactory2, tr2, pm2) => input2))(
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
          return fullTestInterface.beforeEach(
            subject,
            initializer,
            testResource,
            initialValues,
            pm
          );
        }
        afterEach(store, key, artifactory, pm) {
          return new Promise(
            (res) => res(fullTestInterface.afterEach(store, key, pm))
          );
        }
      },
      class When extends BaseWhen {
        async andWhen(store, whenCB, testResource, pm) {
          return await fullTestInterface.andWhen(
            store,
            whenCB,
            testResource,
            pm
          );
        }
      },
      class Then extends BaseThen {
        async butThen(store, thenCB, testResource, pm) {
          return await fullTestInterface.butThen(
            store,
            thenCB,
            testResource,
            pm
          );
        }
      },
      class Check extends BaseCheck {
        constructor(name, features, checkCallback, x, i, c) {
          super(name, features, checkCallback, x, c);
          this.initialValues = i;
        }
        async checkThat(subject, testResourceConfiguration, artifactory, initializer, initialValues, pm) {
          return fullTestInterface.beforeEach(
            subject,
            initializer,
            testResourceConfiguration,
            initialValues,
            pm
          );
        }
        afterEach(store, key, artifactory, pm) {
          return new Promise(
            (res) => res(fullTestInterface.afterEach(store, key, pm))
          );
        }
      },
      testResourceRequirement
    );
  }
};

// src/Web.ts
var errorCallback = (e) => {
};
var unhandledrejectionCallback = (event) => {
  console.log("window.addEventListener unhandledrejection", event);
};
var WebTesteranto = class extends TesterantoCore {
  constructor(input, testSpecification, testImplementation, testResourceRequirement, testInterface) {
    super(
      input,
      testSpecification,
      testImplementation,
      testResourceRequirement,
      testInterface,
      (cb) => {
        window.removeEventListener("error", errorCallback);
        errorCallback = (e) => {
          console.log("window.addEventListener error", e);
          cb(e);
        };
        window.addEventListener("error", errorCallback);
        window.removeEventListener(
          "unhandledrejection",
          unhandledrejectionCallback
        );
        window.removeEventListener(
          "unhandledrejection",
          unhandledrejectionCallback
        );
        unhandledrejectionCallback = (event) => {
          console.log("window.addEventListener unhandledrejection", event);
          cb({ error: event.reason.message });
        };
        window.addEventListener(
          "unhandledrejection",
          unhandledrejectionCallback
        );
      }
    );
  }
  async receiveTestResourceConfig(partialTestResource) {
    const t = partialTestResource;
    const pm = new PM_Web(t);
    return await this.testJobs[0].receiveTestResourceConfig(pm);
  }
};
var Web_default = async (input, testSpecification, testImplementation, testInterface, testResourceRequirement = defaultTestResourceRequirement) => {
  return new WebTesteranto(
    input,
    testSpecification,
    testImplementation,
    testResourceRequirement,
    testInterface
  );
};

export {
  BaseGiven,
  BaseWhen,
  BaseThen,
  BaseCheck,
  BaseBuilder,
  BaseSuite,
  Web_default
};
