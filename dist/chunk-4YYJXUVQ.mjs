var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined")
    return require.apply(this, arguments);
  throw new Error('Dynamic require of "' + x + '" is not supported');
});
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/testeranto/dist/cjs-shim.js
import { createRequire } from "node:module";
import path from "node:path";
import url from "node:url";
var init_cjs_shim = __esm({
  "node_modules/testeranto/dist/cjs-shim.js"() {
    globalThis.require = createRequire(import.meta.url);
    globalThis.__filename = url.fileURLToPath(import.meta.url);
    globalThis.__dirname = path.dirname(__filename);
  }
});

// node_modules/testeranto/dist/module/Node.js
init_cjs_shim();

// node_modules/testeranto/dist/module/core.js
init_cjs_shim();

// node_modules/testeranto/dist/module/base.js
init_cjs_shim();
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
  setup(s, artifactory) {
    return new Promise((res) => res(s));
  }
  assertThat(t) {
    console.log("base assertThat");
    return t;
  }
  async run(input, testResourceConfiguration, artifactory, tLog) {
    this.testResourceConfiguration = testResourceConfiguration;
    const suiteArtifactory = (fPath, value) => artifactory(`suite-${this.index}-${this.name}/${fPath}`, value);
    const subject = await this.setup(input, suiteArtifactory);
    tLog("\nSuite:", this.index, this.name);
    for (const k of Object.keys(this.givens)) {
      const giver = this.givens[k];
      try {
        this.store = await giver.give(subject, k, testResourceConfiguration, this.assertThat, suiteArtifactory, tLog);
      } catch (e) {
        console.error(e);
        this.fails.push(giver);
        return this;
      }
    }
    for (const [ndx, thater] of this.checks.entries()) {
      await thater.check(subject, thater.name, testResourceConfiguration, this.assertThat, suiteArtifactory, tLog);
    }
    for (const k of Object.keys(this.givens)) {
      const giver = this.givens[k];
      giver.afterAll(this.store, artifactory);
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
  afterAll(store, artifactory) {
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
  async give(subject, key, testResourceConfiguration, tester, artifactory, tLog) {
    tLog(`
 Given: ${this.name}`);
    const givenArtifactory = (fPath, value) => artifactory(`given-${key}/${fPath}`, value);
    try {
      this.store = await this.givenThat(subject, testResourceConfiguration, givenArtifactory, this.givenCB);
      for (const whenStep of this.whens) {
        await whenStep.test(this.store, testResourceConfiguration, tLog);
      }
      for (const thenStep of this.thens) {
        const t = await thenStep.test(this.store, testResourceConfiguration, tLog);
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
  async test(store, testResourceConfiguration, tLog) {
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
  async test(store, testResourceConfiguration, tLog) {
    tLog(" Then:", this.name);
    try {
      const x = this.thenCB(await this.butThen(store, testResourceConfiguration));
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
  async check(subject, key, testResourceConfiguration, tester, artifactory, tLog) {
    tLog(`
 Check: ${this.name}`);
    const store = await this.checkThat(subject, testResourceConfiguration, artifactory);
    await this.checkCB(Object.entries(this.whens).reduce((a, [key2, when]) => {
      a[key2] = async (payload) => {
        return await when(payload, testResourceConfiguration).test(store, testResourceConfiguration, tLog);
      };
      return a;
    }, {}), Object.entries(this.thens).reduce((a, [key2, then]) => {
      a[key2] = async (payload) => {
        const t = await then(payload, testResourceConfiguration).test(store, testResourceConfiguration, tLog);
        tester(t);
      };
      return a;
    }, {}));
    await this.afterEach(store, key);
    return;
  }
};
var BaseBuilder = class {
  constructor(input, suitesOverrides, givenOverides, whenOverides, thenOverides, checkOverides, logWriter, testResourceRequirement, testSpecification) {
    this.input = input;
    this.artifacts = [];
    this.testResourceRequirement = testResourceRequirement;
    this.suitesOverrides = suitesOverrides;
    this.givenOverides = givenOverides;
    this.whenOverides = whenOverides;
    this.thenOverides = thenOverides;
    this.checkOverides = checkOverides;
    const suites = testSpecification(this.Suites(), this.Given(), this.When(), this.Then(), this.Check(), logWriter);
    const suiteRunner = (suite) => async (testResourceConfiguration, tLog) => {
      return await suite.run(input, testResourceConfiguration, (fPath, value) => logWriter.testArtiFactoryfileWriter(tLog, (p) => {
        artifacts.push(p);
      })(testResourceConfiguration.fs + "/" + fPath, value), tLog);
    };
    const artifacts = this.artifacts;
    this.testJobs = suites.map((suite) => {
      const runner = suiteRunner(suite);
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
        }) {
          console.log(`testResourceConfiguration ${JSON.stringify(testResourceConfiguration, null, 2)}`);
          await logWriter.mkdirSync(testResourceConfiguration.fs);
          const logFilePath = `${testResourceConfiguration.fs}/log.txt`;
          const access = await logWriter.createWriteStream(logFilePath);
          const tLog = (...l) => {
            console.log(...l);
            access.write(`${l.toString()}
`);
          };
          const suiteDone = await runner(testResourceConfiguration, tLog);
          const resultsFilePath = `${testResourceConfiguration.fs}/results.json`;
          logWriter.writeFileSync(resultsFilePath, JSON.stringify(suiteDone.toObj(), null, 2));
          const logPromise = new Promise((res, rej) => {
            access.on("finish", () => {
              res(true);
            });
          });
          access.end();
          const numberOfFailures = Object.keys(suiteDone.givens).filter((k) => {
            return suiteDone.givens[k].error;
          }).length;
          console.log(`exiting gracefully with ${numberOfFailures} failures.`);
          return {
            failed: numberOfFailures,
            artifacts,
            logPromise
          };
        }
      };
    });
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

// node_modules/testeranto/dist/module/lib.js
init_cjs_shim();
var defaultTestResourceRequirement = {
  ports: 0
};

// node_modules/testeranto/dist/module/core.js
var Testeranto = class extends ClassBuilder {
  constructor(input, testSpecification, testImplementation, testResourceRequirement = defaultTestResourceRequirement, logWriter, beforeAll, beforeEach, afterEach, afterAll, butThen, andWhen, assertThis) {
    super(testImplementation, testSpecification, input, class extends BaseSuite {
      assertThat(t) {
        assertThis(t);
      }
      async setup(s, artifactory) {
        return (beforeAll || (async (input2, artificer) => input2))(s, artifactory, this.testResourceConfiguration);
      }
    }, class Given extends BaseGiven {
      async givenThat(subject, testResource, artifactory, initializer) {
        return beforeEach(subject, initializer, testResource, (fPath, value) => (
          // TODO does not work?
          artifactory(`beforeEach/${fPath}`, value)
        ), this.initialValues);
      }
      afterEach(store, key, artifactory) {
        return new Promise((res) => res(afterEach(store, key, (fPath, value) => artifactory(`after/${fPath}`, value))));
      }
      afterAll(store, artifactory) {
        return afterAll(store, (fPath, value) => (
          // TODO does not work?
          artifactory(`afterAll4-${this.name}/${fPath}`, value)
        ));
      }
    }, class When extends BaseWhen {
      async andWhen(store, whenCB, testResource) {
        return await andWhen(store, whenCB, testResource);
      }
    }, class Then extends BaseThen {
      async butThen(store, testResourceConfiguration) {
        return await butThen(store, testResourceConfiguration);
      }
    }, class Check extends BaseCheck {
      constructor(name, features, checkCallback, whens, thens, initialValues) {
        super(name, features, checkCallback, whens, thens);
        this.initialValues = initialValues;
      }
      async checkThat(subject, testResourceConfiguration, artifactory) {
        return beforeEach(subject, this.initialValues, testResourceConfiguration, (fPath, value) => artifactory(`before/${fPath}`, value), this.initialValues);
      }
      afterEach(store, key, artifactory) {
        return new Promise((res) => res(afterEach(store, key, (fPath, value) => (
          // TODO does not work?
          artifactory(`afterEach2-${this.name}/${fPath}`, value)
        ))));
      }
    }, testResourceRequirement, logWriter);
  }
};

// node_modules/testeranto/dist/module/nodeWriter.js
init_cjs_shim();
import fs from "fs";
import path2 from "path";
var fPaths = [];
var NodeWriter = {
  createWriteStream: (filepath) => {
    return fs.createWriteStream(filepath);
  },
  writeFileSync: (fp, contents) => {
    fs.writeFileSync(fp, contents);
  },
  mkdirSync: async (fp) => {
    await fs.mkdirSync(fp, { recursive: true });
  },
  testArtiFactoryfileWriter: (tLog, callback) => (fPath, value) => {
    callback(new Promise((res, rej) => {
      tLog("testArtiFactory =>", fPath);
      const cleanPath = path2.resolve(fPath);
      fPaths.push(cleanPath.replace(process.cwd(), ``));
      const targetDir = cleanPath.split("/").slice(0, -1).join("/");
      fs.mkdir(targetDir, { recursive: true }, async (error) => {
        if (error) {
          console.error(`\u2757\uFE0FtestArtiFactory failed`, targetDir, error);
        }
        fs.writeFileSync(path2.resolve(targetDir.split("/").slice(0, -1).join("/"), "manifest"), fPaths.join(`
`), {
          encoding: "utf-8"
        });
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
    }));
  }
};

// node_modules/testeranto/dist/module/Node.js
var NodeTesteranto = class extends Testeranto {
  constructor(input, testSpecification, testImplementation, testResourceRequirement, beforeAll, beforeEach, afterEach, afterAll, butThen, andWhen, assertioner) {
    super(input, testSpecification, testImplementation, testResourceRequirement, NodeWriter, beforeAll, beforeEach, afterEach, afterAll, butThen, andWhen, assertioner);
    const t = this.testJobs[0];
    const testResourceArg = process.argv[2] || `{}`;
    try {
      const partialTestResource = JSON.parse(testResourceArg);
      if (partialTestResource.scheduled) {
        console.log("test is scheduled", partialTestResource);
        console.log("requesting test resources via IPC ...", this.testResourceRequirement);
        process.send({
          type: "testeranto:hola",
          data: {
            requirement: Object.assign(Object.assign({}, this.testResourceRequirement), { name: partialTestResource.name })
          }
        });
        console.log("awaiting test resources via IPC...");
        process.on("message", async (packet) => {
          const resourcesFromPm2 = packet.data.testResourceConfiguration;
          const secondTestResource = Object.assign(Object.assign({ fs: "." }, JSON.parse(JSON.stringify(partialTestResource))), JSON.parse(JSON.stringify(resourcesFromPm2)));
          this.receiveTestResourceConfigScheduled(t, secondTestResource);
        });
      } else {
        console.log("receiveTestResourceConfigUnscheduled", this.receiveTestResourceConfigUnscheduled);
        this.receiveTestResourceConfigUnscheduled(t, partialTestResource);
      }
    } catch (e) {
      console.error(e);
      process.exit(-1);
    }
  }
  async receiveTestResourceConfigUnscheduled(t, partialTestResource) {
    const { failed, artifacts, logPromise } = await t.receiveTestResourceConfig(partialTestResource);
    Promise.all([...artifacts, logPromise]).then(async () => {
      process.exit(await failed ? 1 : 0);
    });
  }
  async receiveTestResourceConfigScheduled(t, partialTestResource) {
    const { failed, artifacts, logPromise } = await t.receiveTestResourceConfig(partialTestResource);
    process.send({
      type: "testeranto:adios",
      data: {
        failed,
        testResourceConfiguration: t.test.testResourceConfiguration,
        results: t.toObj()
      }
    }, async (err) => {
      if (!err) {
        Promise.all([...artifacts, logPromise]).then(async () => {
          process.exit(await failed ? 1 : 0);
        });
      } else {
        console.error(err);
        process.exit(1);
      }
    });
  }
};
var Node_default = async (input, testSpecification, testImplementation, testInterface, testResourceRequirement = defaultTestResourceRequirement) => {
  new NodeTesteranto(input, testSpecification, testImplementation, testResourceRequirement, testInterface.beforeAll || (async (s) => s), testInterface.beforeEach || async function(subject, initialValues, testResource) {
    return subject;
  }, testInterface.afterEach || (async (s) => s), testInterface.afterAll || ((store) => void 0), testInterface.butThen || (async (a) => a), testInterface.andWhen || ((a) => a), testInterface.assertThis || (() => null));
};

export {
  __require,
  __esm,
  __commonJS,
  __export,
  __toESM,
  __toCommonJS,
  init_cjs_shim,
  Node_default
};
