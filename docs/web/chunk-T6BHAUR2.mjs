import {
  require_renderer
} from "./chunk-SNPBLUOM.mjs";

// ../testeranto/dist/module/lib/index.js
var BaseTestInterface = {
  beforeAll: async (s) => s,
  beforeEach: async function(subject, initialValues, testResource) {
    return subject;
  },
  afterEach: async (s) => s,
  afterAll: (store) => void 0,
  butThen: async (store, thenCb) => thenCb(store),
  andWhen: (a) => a,
  assertThis: () => null
};
var DefaultTestInterface = (p) => {
  return Object.assign(Object.assign({}, BaseTestInterface), p);
};
var defaultTestResourceRequirement = {
  ports: 0
};

// ../testeranto/dist/module/lib/abstractBase.js
var BaseSuite = class {
  constructor(name, index, givens = {}, checks = []) {
    this.name = name;
    this.index = index;
    this.givens = givens;
    this.checks = checks;
    this.fails = [];
  }
  toObj() {
    return {
      name: this.name,
      givens: Object.keys(this.givens).map((k) => this.givens[k].toObj()),
      fails: this.fails
    };
  }
  setup(s, artifactory, tr, utils) {
    return new Promise((res) => res(s));
  }
  assertThat(t) {
    return t;
  }
  async run(input, testResourceConfiguration, artifactory, tLog, utils) {
    this.testResourceConfiguration = testResourceConfiguration;
    tLog("test resources: ", testResourceConfiguration);
    const suiteArtifactory = (fPath, value) => artifactory(`suite-${this.index}-${this.name}/${fPath}`, value);
    const subject = await this.setup(input, suiteArtifactory, testResourceConfiguration, utils);
    tLog("\nSuite:", this.index, this.name);
    for (const k of Object.keys(this.givens)) {
      const giver = this.givens[k];
      try {
        this.store = await giver.give(subject, k, testResourceConfiguration, this.assertThat, suiteArtifactory, tLog, utils);
      } catch (e) {
        console.error(e);
        this.fails.push(giver);
        return this;
      }
    }
    for (const [ndx, thater] of this.checks.entries()) {
      await thater.check(subject, thater.name, testResourceConfiguration, this.assertThat, suiteArtifactory, tLog, utils);
    }
    for (const k of Object.keys(this.givens)) {
      const giver = this.givens[k];
      giver.afterAll(this.store, artifactory, utils);
    }
    return this;
  }
};
var BaseGiven = class {
  constructor(name, features, whens, thens, givenCB, initialValues) {
    this.name = name;
    this.features = features;
    this.whens = whens;
    this.thens = thens;
    this.givenCB = givenCB;
    this.initialValues = initialValues;
  }
  beforeAll(store, artifactory) {
    return store;
  }
  afterAll(store, artifactory, utils) {
    return store;
  }
  toObj() {
    return {
      name: this.name,
      whens: this.whens.map((w) => w.toObj()),
      thens: this.thens.map((t) => t.toObj()),
      error: this.error ? [this.error, this.error.stack] : null,
      features: this.features
    };
  }
  async afterEach(store, key, artifactory) {
    return store;
  }
  async give(subject, key, testResourceConfiguration, tester, artifactory, tLog, utils) {
    tLog(`
 Given: ${this.name}`);
    const givenArtifactory = (fPath, value) => artifactory(`given-${key}/${fPath}`, value);
    try {
      this.store = await this.givenThat(subject, testResourceConfiguration, givenArtifactory, this.givenCB);
      for (const whenStep of this.whens) {
        await whenStep.test(this.store, testResourceConfiguration, tLog, utils);
      }
      for (const thenStep of this.thens) {
        const t = await thenStep.test(this.store, testResourceConfiguration, tLog, utils);
        tester(t);
      }
    } catch (e) {
      this.error = e;
      tLog(e);
      tLog("\x07");
    } finally {
      try {
        await this.afterEach(this.store, key, givenArtifactory);
      } catch (e) {
        console.error("afterEach failed! no error will be recorded!", e);
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
    return {
      name: this.name,
      error: this.error
    };
  }
  async test(store, testResourceConfiguration, tLog, utils) {
    tLog(" When:", this.name);
    try {
      return await this.andWhen(store, this.whenCB, testResourceConfiguration);
    } catch (e) {
      this.error = true;
      throw e;
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
  async test(store, testResourceConfiguration, tLog, utils) {
    tLog(" Then:", this.name);
    try {
      const x = await this.butThen(store, this.thenCB, testResourceConfiguration);
      return x;
    } catch (e) {
      console.log("test failed", e);
      this.error = true;
      throw e;
    }
  }
};
var BaseCheck = class {
  constructor(name, features, checkCB, whens, thens) {
    this.name = name;
    this.features = features;
    this.checkCB = checkCB;
    this.whens = whens;
    this.thens = thens;
  }
  async afterEach(store, key, cb) {
    return;
  }
  async check(subject, key, testResourceConfiguration, tester, artifactory, tLog, utils) {
    tLog(`
 Check: ${this.name}`);
    const store = await this.checkThat(subject, testResourceConfiguration, artifactory);
    await this.checkCB(Object.entries(this.whens).reduce((a, [key2, when]) => {
      a[key2] = async (payload) => {
        return await when(payload, testResourceConfiguration).test(store, testResourceConfiguration, tLog, utils);
      };
      return a;
    }, {}), Object.entries(this.thens).reduce((a, [key2, then]) => {
      a[key2] = async (payload) => {
        const t = await then(payload, testResourceConfiguration).test(store, testResourceConfiguration, tLog, utils);
        tester(t);
      };
      return a;
    }, {}));
    await this.afterEach(store, key);
    return;
  }
};

// ../testeranto/dist/module/lib/basebuilder.js
var BaseBuilder = class {
  constructor(input, suitesOverrides, givenOverides, whenOverides, thenOverides, checkOverides, logWriter, testResourceRequirement, testSpecification) {
    this.input = input;
    this.artifacts = [];
    this.artifacts = [];
    this.testResourceRequirement = testResourceRequirement;
    this.suitesOverrides = suitesOverrides;
    this.givenOverides = givenOverides;
    this.whenOverides = whenOverides;
    this.thenOverides = thenOverides;
    this.checkOverides = checkOverides;
    this.testSpecification = testSpecification;
    this.specs = testSpecification(this.Suites(), this.Given(), this.When(), this.Then(), this.Check());
    const suiteRunner = (suite, utils) => async (testResourceConfiguration, tLog, utils2) => {
      return await suite.run(input, testResourceConfiguration, (fPath, value) => logWriter.testArtiFactoryfileWriter(tLog, (p) => {
        this.artifacts.push(p);
      })(testResourceConfiguration.fs + "/" + fPath, value), tLog, utils2);
    };
    this.testJobs = this.specs.map((suite, utils) => {
      const runner = suiteRunner(suite, utils);
      return {
        test: suite,
        testResourceRequirement,
        toObj: () => {
          return suite.toObj();
        },
        runner,
        receiveTestResourceConfig: async function(testResourceConfiguration = {
          name: "",
          fs: ".",
          ports: [],
          scheduled: false
        }, y) {
          console.log(`testResourceConfiguration ${JSON.stringify(testResourceConfiguration, null, 2)}`);
          logWriter.writeFileSync(`${testResourceConfiguration.fs}/tests.json`, JSON.stringify(this.toObj(), null, 2));
          const logFilePath = `${testResourceConfiguration.fs}/log.txt`;
          const access = await logWriter.createWriteStream(logFilePath);
          const tLog = (...l) => {
            access.write(`${l.toString()}
`);
          };
          const suiteDone = await runner(testResourceConfiguration, tLog, y);
          const logPromise = new Promise((res, rej) => {
            access.on("finish", () => {
              res(true);
            });
          });
          access.end();
          const numberOfFailures = Object.keys(suiteDone.givens).filter((k) => {
            return suiteDone.givens[k].error;
          }).length;
          logWriter.writeFileSync(`${testResourceConfiguration.fs}/exitcode`, numberOfFailures.toString());
          console.log(`exiting gracefully with ${numberOfFailures} failures.`);
          return {
            failed: numberOfFailures,
            artifacts: this.artifacts || [],
            logPromise
          };
        }
      };
    });
  }
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

// ../testeranto/dist/module/lib/classBuilder.js
var ClassBuilder = class extends BaseBuilder {
  constructor(testImplementation, testSpecification, input, suiteKlasser, givenKlasser, whenKlasser, thenKlasser, checkKlasser, testResourceRequirement, logWriter) {
    const classySuites = Object.entries(testImplementation.suites).reduce((a, [key], index) => {
      a[key] = (somestring, givens, checks) => {
        return new suiteKlasser.prototype.constructor(somestring, index, givens, checks);
      };
      return a;
    }, {});
    const classyGivens = Object.entries(testImplementation.givens).reduce((a, [key, givEn]) => {
      a[key] = (features, whens, thens, givEn2) => {
        return new givenKlasser.prototype.constructor(key, features, whens, thens, testImplementation.givens[key], givEn2);
      };
      return a;
    }, {});
    const classyWhens = Object.entries(testImplementation.whens).reduce((a, [key, whEn]) => {
      a[key] = (payload) => {
        return new whenKlasser.prototype.constructor(`${whEn.name}: ${payload && payload.toString()}`, whEn(payload));
      };
      return a;
    }, {});
    const classyThens = Object.entries(testImplementation.thens).reduce((a, [key, thEn]) => {
      a[key] = (expected, x) => {
        return new thenKlasser.prototype.constructor(`${thEn.name}: ${expected && expected.toString()}`, thEn(expected));
      };
      return a;
    }, {});
    const classyChecks = Object.entries(testImplementation.checks).reduce((a, [key, z]) => {
      a[key] = (somestring, features, callback) => {
        return new checkKlasser.prototype.constructor(somestring, features, callback, classyWhens, classyThens);
      };
      return a;
    }, {});
    super(input, classySuites, classyGivens, classyWhens, classyThens, classyChecks, logWriter, testResourceRequirement, testSpecification);
  }
};

// ../testeranto/dist/module/lib/core.js
var Testeranto = class extends ClassBuilder {
  constructor(input, testSpecification, testImplementation, testResourceRequirement = defaultTestResourceRequirement, logWriter, testInterface) {
    const fullTestInterface = DefaultTestInterface(testInterface);
    super(testImplementation, testSpecification, input, class extends BaseSuite {
      assertThat(t) {
        fullTestInterface.assertThis(t);
      }
      async setup(s, artifactory, tr) {
        return (fullTestInterface.beforeAll || (async (input2, artifactory2, tr2) => input2))(s, this.testResourceConfiguration, artifactory);
      }
    }, class Given extends BaseGiven {
      async givenThat(subject, testResource, artifactory, initializer) {
        return fullTestInterface.beforeEach(
          subject,
          initializer,
          (fPath, value) => (
            // TODO does not work?
            artifactory(`beforeEach/${fPath}`, value)
          ),
          testResource,
          this.initialValues
          // utils,
        );
      }
      afterEach(store, key, artifactory) {
        return new Promise((res) => res(fullTestInterface.afterEach(store, key, (fPath, value) => artifactory(`after/${fPath}`, value))));
      }
      afterAll(store, artifactory, utils) {
        return fullTestInterface.afterAll(store, (fPath, value) => {
          artifactory(`afterAll4-${this.name}/${fPath}`, value);
        }, utils);
      }
    }, class When extends BaseWhen {
      async andWhen(store, whenCB, testResource) {
        return await fullTestInterface.andWhen(store, whenCB, testResource);
      }
    }, class Then extends BaseThen {
      async butThen(store, thenCB, testResourceConfiguration) {
        return await fullTestInterface.butThen(store, thenCB, testResourceConfiguration);
      }
    }, class Check extends BaseCheck {
      constructor(name, features, checkCallback, whens, thens, initialValues) {
        super(name, features, checkCallback, whens, thens);
        this.initialValues = initialValues;
      }
      async checkThat(subject, testResourceConfiguration, artifactory) {
        return fullTestInterface.beforeEach(subject, this.initialValues, (fPath, value) => artifactory(`before/${fPath}`, value), testResourceConfiguration, this.initialValues);
      }
      afterEach(store, key, artifactory) {
        return new Promise((res) => res(fullTestInterface.afterEach(store, key, (fPath, value) => (
          // TODO does not work?
          artifactory(`afterEach2-${this.name}/${fPath}`, value)
        ))));
      }
    }, testResourceRequirement, logWriter);
  }
};

// ../testeranto/dist/module/Web.js
var remote = require_renderer();
var WebTesteranto = class extends Testeranto {
  constructor(input, testSpecification, testImplementation, testResourceRequirement, testInterface) {
    super(
      input,
      testSpecification,
      testImplementation,
      testResourceRequirement,
      window.NodeWriter,
      testInterface
      // BrowserWindow
    );
    if (process.argv[2]) {
      const testResourceArg = decodeURIComponent(new URLSearchParams(location.search).get("requesting") || "");
      try {
        const partialTestResource = JSON.parse(testResourceArg);
        this.receiveTestResourceConfig(this.testJobs[0], partialTestResource);
      } catch (e) {
        console.error(e);
      }
    } else {
    }
    const requesting = new URLSearchParams(location.search).get("requesting");
    if (requesting) {
      const testResourceArg = decodeURIComponent(requesting);
      try {
        const partialTestResource = JSON.parse(testResourceArg);
        console.log("initial test resource", partialTestResource);
        this.receiveTestResourceConfig(this.testJobs[0], partialTestResource);
      } catch (e) {
        console.error(e);
      }
    }
  }
  async receiveTestResourceConfig(t, partialTestResource) {
    const { failed, artifacts, logPromise } = await t.receiveTestResourceConfig(partialTestResource, remote);
    Promise.all([...artifacts, logPromise]).then(async () => {
      var window2 = remote.getCurrentWindow();
      window2.close();
    });
  }
};
var Web_default = async (input, testSpecification, testImplementation, testInterface, testResourceRequirement = defaultTestResourceRequirement) => {
  return new WebTesteranto(input, testSpecification, testImplementation, testResourceRequirement, testInterface);
};

export {
  Web_default
};
