import { createRequire } from 'module';const require = createRequire(import.meta.url);
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

// dist/cjs-shim.js
import path from "node:path";
import url from "node:url";
var init_cjs_shim = __esm({
  "dist/cjs-shim.js"() {
    globalThis.__filename = url.fileURLToPath(import.meta.url);
    globalThis.__dirname = path.dirname(__filename);
  }
});

// src/lib/pmProxy.ts
init_cjs_shim();
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
var butThenProxy = (pm, filepath, addArtifact) => {
  return baseProxy(pm, [
    [
      "screencast",
      (opts, p) => {
        const path2 = `${filepath}/butThen/${opts.path}`;
        addArtifact(path2);
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
        addArtifact(path2);
        return [path2];
      }
    ],
    [
      "writeFileSync",
      (fp, contents) => {
        const path2 = `${filepath}/butThen/${fp}`;
        addArtifact(path2);
        return [path2, contents];
      }
    ],
    [
      "customScreenShot",
      (opts, p) => {
        const path2 = `${filepath}/butThen/${opts.path}`;
        addArtifact(path2);
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
var andWhenProxy = (pm, filepath, addArtifact) => {
  return baseProxy(pm, [
    [
      "screencast",
      (opts, p) => {
        const path2 = `${filepath}/andWhen/${opts.path}`;
        addArtifact(path2);
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
        const path2 = `${filepath}/andWhen/${fp}`;
        addArtifact(path2);
        return [path2];
      }
    ],
    [
      "writeFileSync",
      (fp, contents) => {
        const path2 = `${filepath}/andWhen/${fp}`;
        addArtifact(path2);
        return [path2, contents];
      }
    ],
    [
      "customScreenShot",
      (opts, p) => {
        const path2 = `${filepath}/andWhen/${opts.path}`;
        addArtifact(path2);
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
var afterEachProxy = (pm, suite, given, addArtifact) => {
  return baseProxy(pm, [
    [
      "screencast",
      (opts, p) => {
        const path2 = `suite-${suite}/given-${given}/afterEach/${opts.path}`;
        addArtifact(path2);
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
        const path2 = `suite-${suite}/afterEach/${fp}`;
        addArtifact(path2);
        return [path2];
      }
    ],
    [
      "writeFileSync",
      (fp, contents) => {
        const path2 = `suite-${suite}/given-${given}/afterEach/${fp}`;
        addArtifact(path2);
        return [path2, contents];
      }
    ],
    [
      "customScreenShot",
      (opts, p) => {
        const path2 = `suite-${suite}/given-${given}/afterEach/${opts.path}`;
        addArtifact(path2);
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
var beforeEachProxy = (pm, suite, addArtifact) => {
  return baseProxy(pm, [
    [
      "screencast",
      (opts, p) => {
        const path2 = `suite-${suite}/beforeEach/${opts.path}`;
        addArtifact(path2);
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
      "writeFileSync",
      (fp, contents) => {
        const path2 = `suite-${suite}/beforeEach/${fp}`;
        addArtifact(path2);
        return [path2, contents];
      }
    ],
    [
      "customScreenShot",
      (opts, p) => {
        const path2 = `suite-${suite}/beforeEach/${opts.path}`;
        addArtifact(path2);
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
        const path2 = `suite-${suite}/beforeEach/${fp}`;
        addArtifact(path2);
        return [path2];
      }
    ]
  ]);
};
var beforeAllProxy = (pm, suite, addArtifact) => {
  return baseProxy(pm, [
    [
      "writeFileSync",
      (fp, contents) => {
        const path2 = `suite-${suite}/beforeAll/${fp}`;
        addArtifact(path2);
        return [path2, contents];
      }
    ],
    [
      "customScreenShot",
      (opts, p) => {
        const path2 = `suite-${suite}/beforeAll/${opts.path}`;
        addArtifact(path2);
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
        const path2 = `suite-${suite}/beforeAll/${fp}`;
        addArtifact(path2);
        return [path2];
      }
    ]
  ]);
};
var afterAllProxy = (pm, suite, addArtifact) => {
  return baseProxy(pm, [
    [
      "createWriteStream",
      (fp) => {
        const path2 = `suite-${suite}/afterAll/${fp}`;
        addArtifact(path2);
        return [path2];
      }
    ],
    [
      "writeFileSync",
      (fp, contents) => {
        const path2 = `suite-${suite}/afterAll/${fp}`;
        addArtifact(path2);
        return [path2, contents];
      }
    ],
    [
      "customScreenShot",
      (opts, p) => {
        const path2 = `suite-${suite}/afterAll/${opts.path}`;
        addArtifact(path2);
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

// src/lib/classBuilder.ts
init_cjs_shim();

// src/lib/basebuilder.ts
init_cjs_shim();
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
        try {
          const x = await suite2.run(
            input,
            puppetMaster.testResourceConfiguration,
            (fPath, value) => puppetMaster.testArtiFactoryfileWriter(
              tLog,
              (p) => {
                this.artifacts.push(p);
              }
            )(
              puppetMaster.testResourceConfiguration.fs + "/" + fPath,
              value
            ),
            tLog,
            puppetMaster
          );
          return x;
        } catch (e) {
          console.error(e.stack);
        }
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
          try {
            const suiteDone = await runner(puppetMaster, tLog);
            const fails = suiteDone.fails;
            await puppetMaster.writeFileSync([
              `tests.json`,
              JSON.stringify(this.toObj(), null, 2)
            ]);
            return {
              failed: fails > 0,
              fails,
              artifacts: this.artifacts || [],
              features: suiteDone.features()
            };
          } catch (e) {
            console.error(e.stack);
            return {
              failed: true,
              fails: -1,
              artifacts: this.artifacts || [],
              features: []
            };
          }
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
init_cjs_shim();
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
  addArtifact(path2) {
    console.log("Suite addArtifact", path2);
    const normalizedPath = path2.replace(/\\/g, "/");
    this.artifacts.push(normalizedPath);
  }
  features() {
    try {
      const features = Object.keys(this.givens).map((k) => this.givens[k].features).flat().filter((value, index, array) => {
        return array.indexOf(value) === index;
      });
      return features || [];
    } catch (e) {
      console.error("[ERROR] Failed to extract features:", JSON.stringify(e));
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
    const sNdx = this.index;
    const proxiedPm = beforeAllProxy(pm, sNdx.toString(), this);
    const subject = await this.setup(
      input,
      suiteArtifactory,
      testResourceConfiguration,
      proxiedPm
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
      const afterAllPm = afterAllProxy(pm, sNdx.toString(), this);
      this.afterAll(this.store, artifactory, afterAllPm);
    } catch (e) {
      console.error(JSON.stringify(e));
    }
    return this;
  }
};

// src/lib/index.ts
init_cjs_shim();
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

// src/lib/core.ts
init_cjs_shim();

// src/lib/abstractBase.ts
init_cjs_shim();
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
    console.log("Given addArtifact", path2);
    const normalizedPath = path2.replace(/\\/g, "/");
    this.artifacts.push(normalizedPath);
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
        console.error("w is not as expected!", JSON.stringify(w));
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
      const proxiedPm = beforeEachProxy(
        pm,
        suiteNdx.toString(),
        this.addArtifact.bind(this)
      );
      this.store = await this.givenThat(
        subject,
        testResourceConfiguration,
        givenArtifactory,
        this.givenCB,
        this.initialValues,
        proxiedPm
      );
    } catch (e) {
      this.failed = true;
      this.error = e.stack;
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
      this.error = e.stack;
      this.failed = true;
    } finally {
      try {
        const proxiedPm = afterEachProxy(
          pm,
          suiteNdx.toString(),
          key,
          this.addArtifact.bind(this)
        );
        await this.afterEach(this.store, this.key, givenArtifactory, proxiedPm);
      } catch (e) {
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
  addArtifact(path2) {
    console.log("When addArtifact", path2);
    const normalizedPath = path2.replace(/\\/g, "/");
    this.artifacts.push(normalizedPath);
  }
  toObj() {
    const obj = {
      name: this.name,
      error: this.error ? `${this.error.name}: ${this.error.message}
${this.error.stack}` : null,
      artifacts: this.artifacts || []
    };
    console.log(
      `[TOOBJ] Serializing ${this.constructor.name} with artifacts:`,
      obj.artifacts
    );
    return obj;
  }
  async test(store, testResourceConfiguration, tLog, pm, filepath) {
    try {
      const proxiedPm = andWhenProxy(pm, filepath, this.addArtifact.bind(this));
      const result = await this.andWhen(
        store,
        this.whenCB,
        testResourceConfiguration,
        proxiedPm
      );
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
    this.artifacts = [];
  }
  addArtifact(path2) {
    console.log("Then addArtifact", path2);
    const normalizedPath = path2.replace(/\\/g, "/");
    this.artifacts.push(normalizedPath);
  }
  toObj() {
    const obj = {
      name: this.name,
      error: this.error,
      artifacts: this.artifacts
    };
    return obj;
  }
  async test(store, testResourceConfiguration, tLog, pm, filepath) {
    const proxiedPm = butThenProxy(pm, filepath, this.addArtifact.bind(this));
    return this.butThen(
      store,
      async (s) => {
        try {
          if (typeof this.thenCB === "function") {
            return await this.thenCB(s, proxiedPm);
          } else {
            return this.thenCB;
          }
        } catch (e) {
          console.error(e.stack);
        }
      },
      testResourceConfiguration,
      proxiedPm
    ).catch((e) => {
      this.error = e.stack;
    });
  }
};

// src/lib/core.ts
var TesterantoCore = class extends ClassBuilder {
  constructor(input, testSpecification, testImplementation, testResourceRequirement = defaultTestResourceRequirement, testAdapter, uberCatcher) {
    const fullAdapter = DefaultAdapter(testAdapter);
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

// src/PM/index.ts
init_cjs_shim();
var PM = class {
};

export {
  __require,
  __commonJS,
  __toESM,
  init_cjs_shim,
  defaultTestResourceRequirement,
  butThenProxy,
  andWhenProxy,
  BaseGiven,
  BaseWhen,
  BaseThen,
  BaseBuilder,
  ClassBuilder,
  BaseSuite,
  TesterantoCore,
  PM
};
