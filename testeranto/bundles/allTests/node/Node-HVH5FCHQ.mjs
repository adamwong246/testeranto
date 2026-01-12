import {
  DefaultAdapter,
  defaultTestResourceRequirement
} from "./chunk-GONGMDWG.mjs";

// src/lib/tiposkripto/Node.ts
import fs from "fs";

// src/lib/tiposkripto/BaseGiven.ts
var BaseGiven = class {
  constructor(features, whens, thens, givenCB, initialValues) {
    this.artifacts = [];
    this.features = features;
    this.whens = whens;
    this.thens = thens;
    this.givenCB = givenCB;
    this.initialValues = initialValues;
    this.fails = 0;
  }
  addArtifact(path) {
    if (typeof path !== "string") {
      throw new Error(
        `[ARTIFACT ERROR] Expected string, got ${typeof path}: ${JSON.stringify(
          path
        )}`
      );
    }
    const normalizedPath = path.replace(/\\/g, "/");
    this.artifacts.push(normalizedPath);
  }
  beforeAll(store) {
    return store;
  }
  toObj() {
    return {
      key: this.key,
      whens: (this.whens || []).map((w) => {
        if (w && w.toObj) return w.toObj();
        console.error("When step is not as expected!", JSON.stringify(w));
        return {};
      }),
      thens: (this.thens || []).map((t) => t && t.toObj ? t.toObj() : {}),
      error: this.error ? [this.error, this.error.stack] : null,
      failed: this.failed,
      features: this.features || [],
      artifacts: this.artifacts,
      status: this.status
    };
  }
  async afterEach(store, key, artifactory) {
    return store;
  }
  async give(subject, key, testResourceConfiguration, tester, artifactory, suiteNdx) {
    this.key = key;
    this.fails = 0;
    const givenArtifactory = (fPath, value) => artifactory(`given-${key}/${fPath}`, value);
    try {
      const addArtifact = this.addArtifact.bind(this);
      this.store = await this.givenThat(
        subject,
        testResourceConfiguration,
        givenArtifactory,
        this.givenCB,
        this.initialValues
      );
      this.status = true;
    } catch (e) {
      this.status = false;
      this.failed = true;
      this.fails++;
      this.error = e.stack;
    }
    try {
      const whens = this.whens || [];
      for (const [thenNdx, thenStep] of this.thens.entries()) {
        try {
          const t = await thenStep.test(
            this.store,
            testResourceConfiguration,
            `suite-${suiteNdx}/given-${key}/then-${thenNdx}`
          );
          tester(t);
        } catch (e) {
          this.failed = true;
          this.fails++;
          throw e;
        }
      }
    } catch (e) {
      this.error = e.stack;
      this.failed = true;
    } finally {
      try {
        const addArtifact = this.addArtifact.bind(this);
        await this.afterEach(this.store, this.key);
      } catch (e) {
        this.failed = true;
        this.fails++;
        throw e;
      }
    }
    return this.store;
  }
};

// src/lib/tiposkripto/BaseSuite.ts
var BaseSuite = class {
  constructor(name, index, givens = {}) {
    this.artifacts = [];
    const suiteName = name || "testSuite";
    if (!suiteName) {
      throw new Error("BaseSuite requires a non-empty name");
    }
    this.name = suiteName;
    this.index = index;
    this.givens = givens;
    this.fails = 0;
  }
  addArtifact(path) {
    if (typeof path !== "string") {
      throw new Error(
        `[ARTIFACT ERROR] Expected string, got ${typeof path}: ${JSON.stringify(
          path
        )}`
      );
    }
    const normalizedPath = path.replace(/\\/g, "/");
    this.artifacts.push(normalizedPath);
  }
  features() {
    try {
      const features = Object.keys(this.givens).map((k) => this.givens[k].features).flat().filter((value, index, array) => {
        return array.indexOf(value) === index;
      });
      const stringFeatures = features.map((feature) => {
        if (typeof feature === "string") {
          return feature;
        } else if (feature && typeof feature === "object") {
          return feature.name || JSON.stringify(feature);
        } else {
          return String(feature);
        }
      });
      return stringFeatures || [];
    } catch (e) {
      console.error("[ERROR] Failed to extract features:", JSON.stringify(e));
      return [];
    }
  }
  toObj() {
    const givens = Object.keys(this.givens).map((k) => {
      const givenObj = this.givens[k].toObj();
      return givenObj;
    });
    return {
      name: this.name,
      givens,
      fails: this.fails,
      failed: this.failed,
      features: this.features(),
      artifacts: this.artifacts ? this.artifacts.filter((art) => typeof art === "string") : []
    };
  }
  setup(s, artifactory, tr) {
    console.log("mark9");
    return new Promise((res) => res(s));
  }
  assertThat(t) {
    return !!t;
  }
  afterAll(store, artifactory) {
    return store;
  }
  async run(input, testResourceConfiguration) {
    this.testResourceConfiguration = testResourceConfiguration;
    const sNdx = this.index;
    const subject = await this.setup(
      input,
      // suiteArtifactory,
      testResourceConfiguration
      // proxiedPm
    );
    for (const [gKey, g] of Object.entries(this.givens)) {
      const giver = this.givens[gKey];
      try {
        this.store = await giver.give(
          subject,
          gKey,
          testResourceConfiguration,
          this.assertThat,
          sNdx
        );
        this.fails += giver.fails || 0;
      } catch (e) {
        this.failed = true;
        this.fails += 1;
        if (giver.fails) {
          this.fails += giver.fails;
        }
        console.error(`Error in given ${gKey}:`, e);
      }
    }
    if (this.fails > 0) {
      this.failed = true;
    }
    try {
      this.afterAll(this.store);
    } catch (e) {
      console.error(JSON.stringify(e));
    }
    return this;
  }
};

// src/lib/tiposkripto/BaseThen.ts
var BaseThen = class {
  constructor(name, thenCB) {
    this.artifacts = [];
    this.name = name;
    this.thenCB = thenCB;
    this.error = false;
    this.artifacts = [];
  }
  addArtifact(path) {
    if (typeof path !== "string") {
      throw new Error(
        `[ARTIFACT ERROR] Expected string, got ${typeof path}: ${JSON.stringify(
          path
        )}`
      );
    }
    const normalizedPath = path.replace(/\\/g, "/");
    this.artifacts.push(normalizedPath);
  }
  toObj() {
    const obj = {
      name: this.name,
      error: this.error,
      artifacts: this.artifacts,
      status: this.status
    };
    return obj;
  }
  async test(store, testResourceConfiguration, filepath) {
    const addArtifact = this.addArtifact.bind(this);
    try {
      const x = await this.butThen(
        store,
        async (s) => {
          try {
            if (typeof this.thenCB === "function") {
              const result = await this.thenCB(s);
              return result;
            } else {
              return this.thenCB;
            }
          } catch (e) {
            this.error = true;
            throw e;
          }
        },
        testResourceConfiguration
        // proxiedPm
      );
      this.status = true;
      return x;
    } catch (e) {
      this.status = false;
      this.error = true;
      throw e;
    }
  }
};

// src/lib/tiposkripto/BaseWhen.ts
var BaseWhen = class {
  constructor(name, whenCB) {
    this.artifacts = [];
    this.name = name;
    this.whenCB = whenCB;
  }
  addArtifact(path) {
    if (typeof path !== "string") {
      throw new Error(
        `[ARTIFACT ERROR] Expected string, got ${typeof path}: ${JSON.stringify(
          path
        )}`
      );
    }
    const normalizedPath = path.replace(/\\/g, "/");
    this.artifacts.push(normalizedPath);
  }
  toObj() {
    const obj = {
      name: this.name,
      status: this.status,
      error: this.error ? `${this.error.name}: ${this.error.message}
${this.error.stack}` : null,
      artifacts: this.artifacts
    };
    return obj;
  }
  async test(store, testResourceConfiguration) {
    try {
      const result = await this.andWhen(
        store,
        this.whenCB,
        testResourceConfiguration
        // proxiedPm
      );
      this.status = true;
      return result;
    } catch (e) {
      this.status = false;
      this.error = e;
      throw e;
    }
  }
};

// src/lib/tiposkripto/BaseTiposkripto.ts
var BaseTiposkripto = class {
  constructor(input, testSpecification, testImplementation, testResourceRequirement = defaultTestResourceRequirement, testAdapter = {}, testResourceConfiguration, wsPort = "3456", wsHost = "localhost") {
    this.totalTests = 0;
    this.artifacts = [];
    this.testResourceConfiguration = testResourceConfiguration;
    const fullAdapter = DefaultAdapter(testAdapter);
    if (!testImplementation.suites || typeof testImplementation.suites !== "object") {
      throw new Error(
        `testImplementation.suites must be an object, got ${typeof testImplementation.suites}: ${JSON.stringify(
          testImplementation.suites
        )}`
      );
    }
    const classySuites = Object.entries(testImplementation.suites).reduce(
      (a, [key], index) => {
        a[key] = (somestring, givens) => {
          return new class extends BaseSuite {
            afterAll(store) {
              return fullAdapter.afterAll(store);
            }
            assertThat(t) {
              return fullAdapter.assertThis(t);
            }
            async setup(s, tr) {
              return fullAdapter.beforeAll?.(s, tr) ?? s;
            }
          }(somestring, index, givens);
        };
        return a;
      },
      {}
    );
    const classyGivens = Object.entries(testImplementation.givens).reduce(
      (a, [key, g]) => {
        a[key] = (features, whens, thens, gcb, initialValues) => {
          const safeFeatures = Array.isArray(features) ? [...features] : [];
          const safeWhens = Array.isArray(whens) ? [...whens] : [];
          const safeThens = Array.isArray(thens) ? [...thens] : [];
          return new class extends BaseGiven {
            async givenThat(subject, testResource, initializer, initialValues2) {
              return fullAdapter.beforeEach(
                subject,
                initializer,
                testResource,
                initialValues2
              );
            }
            afterEach(store, key2) {
              return Promise.resolve(fullAdapter.afterEach(store, key2));
            }
          }(
            safeFeatures,
            safeWhens,
            safeThens,
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
          const whenInstance = new class extends BaseWhen {
            async andWhen(store, whenCB, testResource) {
              return await fullAdapter.andWhen(store, whenCB, testResource);
            }
          }(`${key}: ${payload && payload.toString()}`, whEn(...payload));
          return whenInstance;
        };
        return a;
      },
      {}
    );
    const classyThens = Object.entries(testImplementation.thens).reduce(
      (a, [key, thEn]) => {
        a[key] = (...args) => {
          const thenInstance = new class extends BaseThen {
            async butThen(store, thenCB, testResource) {
              return await fullAdapter.butThen(store, thenCB, testResource);
            }
          }(`${key}: ${args && args.toString()}`, thEn(...args));
          return thenInstance;
        };
        return a;
      },
      {}
    );
    this.suitesOverrides = classySuites;
    this.givenOverrides = classyGivens;
    this.whenOverrides = classyWhens;
    this.thenOverrides = classyThens;
    this.testResourceRequirement = testResourceRequirement;
    this.testSpecification = testSpecification;
    this.specs = testSpecification(
      this.Suites(),
      this.Given(),
      this.When(),
      this.Then()
    );
    this.totalTests = this.calculateTotalTests();
    this.testJobs = this.specs.map((suite) => {
      const suiteRunner = (suite2) => async (testResourceConfiguration2) => {
        try {
          const x = await suite2.run(
            input,
            testResourceConfiguration2 || {
              name: suite2.name,
              fs: process.cwd(),
              ports: [],
              timeout: 3e4,
              retries: 3,
              environment: {}
            }
          );
          return x;
        } catch (e) {
          console.error(e.stack);
          throw e;
        }
      };
      const runner = suiteRunner(suite);
      const totalTests = this.totalTests;
      const testJob = {
        test: suite,
        toObj: () => {
          return suite.toObj();
        },
        runner,
        receiveTestResourceConfig: async (testResourceConfiguration2) => {
          try {
            const suiteDone = await runner(
              testResourceConfiguration2
            );
            const fails = suiteDone.fails;
            return {
              failed: fails > 0,
              fails,
              artifacts: [],
              // this.artifacts is not accessible here
              features: suiteDone.features(),
              tests: 0,
              runTimeTests: totalTests,
              testJob: testJob.toObj()
            };
          } catch (e) {
            console.error(e.stack);
            return {
              failed: true,
              fails: -1,
              artifacts: [],
              features: [],
              tests: 0,
              runTimeTests: -1,
              testJob: testJob.toObj()
            };
          }
        }
      };
      return testJob;
    });
    const results = this.testJobs[0].receiveTestResourceConfig(
      testResourceConfiguration
    );
    this.writeFileSync();
  }
  async receiveTestResourceConfig(testResourceConfig) {
    if (this.testJobs && this.testJobs.length > 0) {
      return this.testJobs[0].receiveTestResourceConfig(testResourceConfig);
    } else {
      throw new Error("No test jobs available");
    }
  }
  Specs() {
    return this.specs;
  }
  Suites() {
    if (!this.suitesOverrides) {
      throw new Error(
        `suitesOverrides is undefined. classySuites: ${JSON.stringify(
          Object.keys(this.suitesOverrides || {})
        )}`
      );
    }
    return this.suitesOverrides;
  }
  Given() {
    return this.givenOverrides;
  }
  When() {
    return this.whenOverrides;
  }
  Then() {
    return this.thenOverrides;
  }
  // Add a method to access test jobs which can be used by receiveTestResourceConfig
  getTestJobs() {
    return this.testJobs;
  }
  calculateTotalTests() {
    let total = 0;
    for (const suite of this.specs) {
      if (suite && typeof suite === "object") {
        if ("givens" in suite) {
          const givens = suite.givens;
          if (givens && typeof givens === "object") {
            total += Object.keys(givens).length;
          }
        }
      }
    }
    return total;
  }
};

// src/lib/tiposkripto/Node.ts
var NodeTiposkripto = class extends BaseTiposkripto {
  constructor(input, testSpecification, testImplementation, testResourceRequirement, testAdapter) {
    super(
      input,
      testSpecification,
      testImplementation,
      testResourceRequirement,
      testAdapter,
      JSON.parse(process.argv[3])
    );
  }
  async writeFileSync({
    filename,
    payload
  }) {
    fs.writeFileSync(filename, payload);
  }
};
var tiposkripto = async (input, testSpecification, testImplementation, testAdapter, testResourceRequirement = defaultTestResourceRequirement) => {
  try {
    const t = new NodeTiposkripto(
      input,
      testSpecification,
      testImplementation,
      testResourceRequirement,
      testAdapter
    );
    return t;
  } catch (e) {
    console.error(`[Node] Error creating Tiposkripto:`, e);
    console.error(e.stack);
    process.exit(-1);
  }
};
var Node_default = tiposkripto;
export {
  NodeTiposkripto,
  Node_default as default
};
