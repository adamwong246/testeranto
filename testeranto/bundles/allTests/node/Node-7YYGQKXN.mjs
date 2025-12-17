import {
  DefaultAdapter,
  defaultTestResourceRequirement
} from "./chunk-GD6O3ZZC.mjs";

// src/lib/pmProxy.ts
var baseProxy = function(pm2, mappings) {
  return new Proxy(pm2, {
    get: (target, prop, receiver) => {
      for (const mapping of mappings) {
        const method = mapping[0];
        const arger = mapping[1];
        if (prop === method) {
          return (...x) => {
            const modifiedArgs = arger(...x);
            return target[prop](...modifiedArgs);
          };
        }
      }
      return (...x) => {
        return target[prop](...x);
      };
    }
  });
};
var butThenProxy = (pm2, filepath, addArtifact) => {
  return baseProxy(pm2, [
    [
      "screencast",
      (opts, p) => {
        const path = `${filepath}/butThen/${opts.path}`;
        addArtifact(path);
        return [
          {
            ...opts,
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
        addArtifact(path);
        return [path];
      }
    ],
    [
      "writeFileSync",
      (fp, contents, testName) => {
        const path = `${filepath}/butThen/${fp}`;
        addArtifact(path);
        return [path, contents, testName];
      }
    ],
    [
      "customScreenShot",
      (opts, p) => {
        const path = `${filepath}/butThen/${opts.path}`;
        addArtifact(path);
        return [
          {
            ...opts,
            path
          },
          p
        ];
      }
    ]
  ]);
};
var andWhenProxy = (pm2, filepath, addArtifact) => {
  return baseProxy(pm2, [
    [
      "screencast",
      (opts, p) => {
        const path = `${filepath}/andWhen/${opts.path}`;
        addArtifact(path);
        return [
          {
            ...opts,
            path
          },
          p
        ];
      }
    ],
    [
      "createWriteStream",
      (fp) => {
        const path = `${filepath}/andWhen/${fp}`;
        addArtifact(path);
        return [path];
      }
    ],
    [
      "writeFileSync",
      (fp, contents, testName) => {
        const path = `${filepath}/andWhen/${fp}`;
        addArtifact(path);
        return [path, contents, testName];
      }
    ],
    [
      "customScreenShot",
      (opts, p) => {
        const path = `${filepath}/andWhen/${opts.path}`;
        addArtifact(path);
        return [
          {
            ...opts,
            path
          },
          p
        ];
      }
    ]
  ]);
};
var afterEachProxy = (pm2, suite, given, addArtifact) => {
  return baseProxy(pm2, [
    [
      "screencast",
      (opts, p) => {
        const path = `suite-${suite}/given-${given}/afterEach/${opts.path}`;
        addArtifact(path);
        return [
          {
            ...opts,
            path
          },
          p
        ];
      }
    ],
    [
      "createWriteStream",
      (fp) => {
        const path = `suite-${suite}/afterEach/${fp}`;
        addArtifact(path);
        return [path];
      }
    ],
    [
      "writeFileSync",
      (fp, contents, testName) => {
        const path = `suite-${suite}/given-${given}/afterEach/${fp}`;
        addArtifact(path);
        return [path, contents, testName];
      }
    ],
    [
      "customScreenShot",
      (opts, p) => {
        const path = `suite-${suite}/given-${given}/afterEach/${opts.path}`;
        addArtifact(path);
        return [
          {
            ...opts,
            path
          },
          p
        ];
      }
    ]
  ]);
};
var beforeEachProxy = (pm2, suite, addArtifact) => {
  return baseProxy(pm2, [
    [
      "screencast",
      (opts, p) => {
        const path = `suite-${suite}/beforeEach/${opts.path}`;
        addArtifact(path);
        return [
          {
            ...opts,
            path
          },
          p
        ];
      }
    ],
    [
      "writeFileSync",
      (fp, contents, testName) => {
        const path = `suite-${suite}/beforeEach/${fp}`;
        addArtifact(path);
        return [path, contents, testName];
      }
    ],
    [
      "customScreenShot",
      (opts, p) => {
        const path = `suite-${suite}/beforeEach/${opts.path}`;
        addArtifact(path);
        return [
          {
            ...opts,
            path
          },
          p
        ];
      }
    ],
    [
      "createWriteStream",
      (fp) => {
        const path = `suite-${suite}/beforeEach/${fp}`;
        addArtifact(path);
        return [path];
      }
    ]
  ]);
};
var beforeAllProxy = (pm2, suite, addArtifact) => {
  return baseProxy(pm2, [
    [
      "writeFileSync",
      (fp, contents, testName) => {
        const path = `suite-${suite}/beforeAll/${fp}`;
        addArtifact(path);
        return [path, contents, testName];
      }
    ],
    [
      "customScreenShot",
      (opts, p) => {
        const path = `suite-${suite}/beforeAll/${opts.path}`;
        addArtifact(path);
        return [
          {
            ...opts,
            path
          },
          p
        ];
      }
    ],
    [
      "createWriteStream",
      (fp) => {
        const path = `suite-${suite}/beforeAll/${fp}`;
        addArtifact(path);
        return [path];
      }
    ]
  ]);
};
var afterAllProxy = (pm2, suite, addArtifact) => {
  return baseProxy(pm2, [
    [
      "createWriteStream",
      (fp) => {
        const path = `suite-${suite}/afterAll/${fp}`;
        addArtifact(path);
        return [path];
      }
    ],
    [
      "writeFileSync",
      (fp, contents, testName) => {
        const path = `suite-${suite}/afterAll/${fp}`;
        addArtifact(path);
        return [path, contents, testName];
      }
    ],
    [
      "customScreenShot",
      (opts, p) => {
        const path = `suite-${suite}/afterAll/${opts.path}`;
        addArtifact(path);
        return [
          {
            ...opts,
            path
          },
          p
        ];
      }
    ]
  ]);
};

// src/lib/BaseGiven.ts
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
        if (w && w.toObj)
          return w.toObj();
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
  async afterEach(store, key, artifactory2, pm2) {
    return store;
  }
  async give(subject, key, testResourceConfiguration, tester, artifactory2, tLog2, pm2, suiteNdx) {
    this.key = key;
    this.fails = 0;
    tLog2(`
 ${this.key}`);
    tLog2(`
 Given: ${this.key}`);
    const givenArtifactory = (fPath, value) => artifactory2(`given-${key}/${fPath}`, value);
    this.uberCatcher((e) => {
      console.error(e.toString());
      this.error = e.error;
      tLog2(e.stack);
    });
    try {
      const addArtifact = this.addArtifact.bind(this);
      const proxiedPm = beforeEachProxy(pm2, suiteNdx.toString(), addArtifact);
      this.store = await this.givenThat(
        subject,
        testResourceConfiguration,
        givenArtifactory,
        this.givenCB,
        this.initialValues,
        proxiedPm
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
            tLog2,
            pm2,
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
        const proxiedPm = afterEachProxy(
          pm2,
          suiteNdx.toString(),
          key,
          addArtifact
        );
        await this.afterEach(this.store, this.key, givenArtifactory, proxiedPm);
      } catch (e) {
        this.failed = true;
        this.fails++;
        throw e;
      }
    }
    return this.store;
  }
};

// src/lib/BaseSuite.ts
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
  setup(s, artifactory2, tr) {
    return new Promise((res) => res(s));
  }
  assertThat(t) {
    return !!t;
  }
  afterAll(store, artifactory2) {
    return store;
  }
  async run(input, testResourceConfiguration) {
    this.testResourceConfiguration = testResourceConfiguration;
    const suiteArtifactory = (fPath, value) => artifactory(`suite-${this.index}-${this.name}/${fPath}`, value);
    const sNdx = this.index;
    const addArtifact = this.addArtifact.bind(this);
    const proxiedPm = beforeAllProxy(pm, sNdx.toString(), addArtifact);
    const subject = await this.setup(
      input,
      suiteArtifactory,
      testResourceConfiguration,
      proxiedPm
    );
    for (const [gKey, g] of Object.entries(this.givens)) {
      const giver = this.givens[gKey];
      try {
        this.store = await giver.give(
          subject,
          gKey,
          testResourceConfiguration,
          this.assertThat,
          suiteArtifactory,
          tLog,
          pm,
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
      const addArtifact2 = this.addArtifact.bind(this);
      const afterAllPm = afterAllProxy(pm, sNdx.toString(), addArtifact2);
      this.afterAll(this.store, artifactory, afterAllPm);
    } catch (e) {
      console.error(JSON.stringify(e));
    }
    return this;
  }
};

// src/lib/BaseThen.ts
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
  async test(store, testResourceConfiguration, tLog2, pm2, filepath) {
    const addArtifact = this.addArtifact.bind(this);
    const proxiedPm = butThenProxy(pm2, filepath, addArtifact);
    try {
      const x = await this.butThen(
        store,
        async (s) => {
          try {
            if (typeof this.thenCB === "function") {
              const result = await this.thenCB(s, proxiedPm);
              return result;
            } else {
              return this.thenCB;
            }
          } catch (e) {
            this.error = true;
            throw e;
          }
        },
        testResourceConfiguration,
        proxiedPm
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

// src/lib/BaseWhen.ts
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
  async test(store, testResourceConfiguration, tLog2, pm2, filepath) {
    try {
      const addArtifact = this.addArtifact.bind(this);
      const proxiedPm = andWhenProxy(pm2, filepath, addArtifact);
      const result = await this.andWhen(
        store,
        this.whenCB,
        testResourceConfiguration,
        proxiedPm
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

// src/lib/Tiposkripto.ts
import WebSocket from "ws";
var Tiposkripto = class {
  constructor(input, testSpecification, testImplementation, testResourceRequirement = defaultTestResourceRequirement, testAdapter = {}, uberCatcher, port, host) {
    this.artifacts = [];
    // puppetMaster: IPM;
    // WebSocket handling
    this.ws = null;
    this.messageCallbacks = /* @__PURE__ */ new Map();
    const fullAdapter = DefaultAdapter(testAdapter);
    const classySuites = Object.entries(testImplementation.suites).reduce(
      (a, [key], index) => {
        a[key] = (somestring, givens) => {
          return new class extends BaseSuite {
            afterAll(store, artifactory2, pm2) {
              return fullAdapter.afterAll(store, pm2);
            }
            assertThat(t) {
              return fullAdapter.assertThis(t);
            }
            async setup(s, artifactory2, tr, pm2) {
              return fullAdapter.beforeAll?.(s, tr, pm2) ?? s;
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
            constructor() {
              super(...arguments);
              this.uberCatcher = uberCatcher;
            }
            async givenThat(subject, testResource, artifactory2, initializer, initialValues2, pm2) {
              return fullAdapter.beforeEach(
                subject,
                initializer,
                testResource,
                initialValues2,
                pm2
              );
            }
            afterEach(store, key2, artifactory2, pm2) {
              return Promise.resolve(fullAdapter.afterEach(store, key2, pm2));
            }
          }(
            // name,
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
            async andWhen(store, whenCB, testResource, pm2) {
              return await fullAdapter.andWhen(store, whenCB, testResource, pm2);
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
            async butThen(store, thenCB, testResource, pm2) {
              return await fullAdapter.butThen(store, thenCB, testResource, pm2);
            }
          }(`${key}: ${args && args.toString()}`, thEn(...args));
          return thenInstance;
        };
        return a;
      },
      {}
    );
    this.suitesOverrides = classySuites;
    this.givenOverides = classyGivens;
    this.whenOverides = classyWhens;
    this.thenOverides = classyThens;
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
      const suiteRunner = (suite2) => async (puppetMaster, tLog2) => {
        try {
          const x = await suite2.run(
            input,
            puppetMaster.testResourceConfiguration,
            (fPath, value) => puppetMaster.testArtiFactoryfileWriter(
              tLog2,
              (p) => {
                this.artifacts.push(p);
              }
            )(
              puppetMaster.testResourceConfiguration.fs + "/" + fPath,
              value
            ),
            tLog2,
            puppetMaster
          );
          return x;
        } catch (e) {
          console.error(e.stack);
          throw e;
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
          const tLog2 = async (...l) => {
          };
          try {
            const suiteDone = await runner(puppetMaster, tLog2);
            const fails = suiteDone.fails;
            await puppetMaster.writeFileSync(
              `tests.json`,
              JSON.stringify(this.toObj(), null, 2),
              "test"
            );
            return {
              failed: fails > 0,
              fails,
              artifacts: this.artifacts || [],
              features: suiteDone.features(),
              tests: 0,
              // Keep existing field
              runTimeTests: this.totalTests
              // Add the total number of tests
            };
          } catch (e) {
            console.error(e.stack);
            return {
              failed: true,
              fails: -1,
              artifacts: this.artifacts || [],
              features: [],
              tests: 0,
              // Keep existing field
              runTimeTests: -1
              // Set to -1 on hard error
            };
          }
        }
      };
    });
    this.connectWebSocket(port, host);
  }
  // WebSocket methods
  async connectWebSocket(port, host) {
    const wsHost = host || process.env.WS_HOST || "localhost";
    const protocol = "ws";
    const url = `${protocol}://${wsHost}:${port}`;
    console.log(`[Tiposkripto] === WebSocket Connection Attempt ===`);
    console.log(`[Tiposkripto] Target URL: ${url}`);
    console.log(
      `[Tiposkripto] Protocol: ${protocol}, Host: ${wsHost}, Port: ${port}`
    );
    console.log(`[Tiposkripto] Current time: ${(/* @__PURE__ */ new Date()).toISOString()}`);
    console.log(`[Tiposkripto] Process ID: ${process.pid}`);
    console.log(`[Tiposkripto] Creating WebSocket instance...`);
    return new Promise((resolve, reject) => {
      let timeoutFired = false;
      const timeout = setTimeout(() => {
        timeoutFired = true;
        console.log(
          `[Tiposkripto] \u274C WebSocket connection timeout after 10 seconds to ${url}`
        );
        console.log(`[Tiposkripto] This usually means:`);
        console.log(
          `[Tiposkripto]   1. No WebSocket server is running on port ${port}`
        );
        console.log(
          `[Tiposkripto]   2. The server is not accepting connections`
        );
        console.log(
          `[Tiposkripto]   3. There's a firewall blocking the connection`
        );
        console.log(
          `[Tiposkripto] Please ensure a WebSocket server is running on port ${port}`
        );
        reject(new Error(`WebSocket connection timeout to ${url}`));
      }, 1e4);
      this.ws = new WebSocket(url);
      this.ws.on("open", () => {
        if (timeoutFired)
          return;
        clearTimeout(timeout);
        console.log(
          `[Tiposkripto] \u2705 WebSocket connected successfully to ${url}`
        );
        console.log(`[Tiposkripto] Ready to send and receive messages`);
        resolve();
      });
      this.ws.on("error", (error) => {
        if (timeoutFired)
          return;
        clearTimeout(timeout);
        console.error(`[Tiposkripto] \u274C WebSocket connection error to ${url}:`);
        console.error(`[Tiposkripto] Error name: ${error.name}`);
        console.error(`[Tiposkripto] Error message: ${error.message}`);
        console.error(`[Tiposkripto] Error stack: ${error.stack}`);
        console.log(
          `[Tiposkripto] This usually means the WebSocket server is not running`
        );
        console.log(
          `[Tiposkripto] Check if something is listening on port ${port}`
        );
        reject(error);
      });
      this.ws.on("message", (data) => {
        const dataStr = data.toString();
        console.log(
          `[Tiposkripto] \u{1F4E8} Received WebSocket message (${dataStr.length} chars)`
        );
        if (dataStr.length > 500) {
          console.log(
            `[Tiposkripto] Message preview: ${dataStr.substring(0, 500)}...`
          );
        } else {
          console.log(`[Tiposkripto] Message: ${dataStr}`);
        }
        try {
          const message = JSON.parse(dataStr);
          console.log(
            `[Tiposkripto] Parsed message type: ${message.type || "unknown"}`
          );
          if (message.key && this.messageCallbacks.has(message.key)) {
            const callback = this.messageCallbacks.get(message.key);
            if (callback) {
              callback(message.payload);
              this.messageCallbacks.delete(message.key);
            }
          }
        } catch (error) {
          console.error(
            `[Tiposkripto] Error parsing WebSocket message:`,
            error
          );
        }
      });
      this.ws.on("close", (code, reason) => {
        console.log(
          `[Tiposkripto] \u{1F50C} WebSocket connection closed. Code: ${code}, Reason: ${reason.toString()}`
        );
      });
    });
  }
  sendCommand(command, ...args) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      return Promise.reject(new Error("WebSocket is not connected"));
    }
    const key = Math.random().toString();
    return new Promise((resolve, reject) => {
      this.messageCallbacks.set(key, (payload) => {
        resolve(payload);
      });
      const timeoutId = setTimeout(() => {
        this.messageCallbacks.delete(key);
        reject(
          new Error(`Timeout waiting for response to command: ${command}`)
        );
      }, 1e4);
      const message = {
        type: command,
        data: args.length > 0 ? args : void 0,
        key
      };
      const originalCallback = this.messageCallbacks.get(key);
      if (originalCallback) {
        this.messageCallbacks.set(key, (payload) => {
          clearTimeout(timeoutId);
          originalCallback(payload);
        });
      }
      this.ws.send(JSON.stringify(message));
    });
  }
  closeWebSocket() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
  async receiveTestResourceConfig(partialTestResource) {
    console.log("Tiposkripto.receiveTestResourceConfig - starting");
    const testResource = JSON.parse(partialTestResource);
    console.log("Parsed test resource:", testResource);
    const puppetMaster = {
      testResourceConfiguration: testResource,
      writeFileSync: async (filepath, contents) => {
        console.log(`Would write to ${filepath}: ${contents.length} bytes`);
        return true;
      },
      // Add other required properties with dummy implementations
      testArtiFactoryfileWriter: () => {
        return () => {
        };
      }
    };
    return await this.testJobs[0].receiveTestResourceConfig(puppetMaster);
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

// src/lib/Node.ts
var tiposkripto = async (input, testSpecification, testImplementation, testAdapter, testResourceRequirement = defaultTestResourceRequirement) => {
  try {
    const wsPort = process.env.WS_PORT || "3456";
    const wsHost = process.env.WS_HOST || "localhost";
    console.log(`[Node] Creating Tiposkripto instance with WebSocket host: ${wsHost}, port: ${wsPort}`);
    console.log(`[Node] Current directory: ${process.cwd()}`);
    console.log(`[Node] Environment WS_PORT: ${process.env.WS_PORT}`);
    console.log(`[Node] Environment WS_HOST: ${process.env.WS_HOST}`);
    const t = new Tiposkripto(
      input,
      testSpecification,
      testImplementation,
      testResourceRequirement,
      testAdapter,
      () => {
      },
      wsPort,
      wsHost
    );
    console.log(`[Node] Tiposkripto instance created successfully`);
    console.log(`[Node] WebSocket connection status: ${t.ws ? "ws exists" : "ws is null"}`);
    return t;
  } catch (e) {
    console.error(`[Node] Error creating Tiposkripto:`, e);
    console.error(e.stack);
    process.exit(-1);
  }
};
var Node_default = tiposkripto;
export {
  Node_default as default
};
