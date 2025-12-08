import {
  DefaultAdapter,
  defaultTestResourceRequirement
} from "./chunk-GD6O3ZZC.mjs";

// src/clients/index.ts
var PM = class {
  // abstract launchSideCar(
  //   n: number
  // ): Promise<[number, ITTestResourceConfiguration]>;
  // abstract stopSideCar(n: number): Promise<any>;
};

// src/clients/web.ts
var PM_Web = class extends PM {
  constructor(t) {
    super();
    this.messageCallbacks = /* @__PURE__ */ new Map();
    console.log("PM_Web constructor called with config:", JSON.stringify(t, null, 2));
    this.testResourceConfiguration = t;
    let wsUrl;
    if (t.browserWSEndpoint) {
      wsUrl = t.browserWSEndpoint;
      console.log("PM_Web using browserWSEndpoint from config:", wsUrl);
    } else {
      const wsHost = window.WS_HOST || window.location.hostname;
      const wsPort = window.WS_PORT || "3002";
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const hostname = window.location.hostname;
      let finalHost = hostname;
      if (hostname === "localhost" || hostname === "127.0.0.1") {
      }
      wsUrl = `${protocol}//${finalHost}:${wsPort}`;
      console.log("PM_Web constructed WebSocket URL:", wsUrl);
    }
    this.ws = new WebSocket(wsUrl);
    this.ws.addEventListener("open", () => {
      console.log("WebSocket connected to", wsUrl);
    });
    this.ws.addEventListener("message", (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.key && this.messageCallbacks.has(message.key)) {
          const callback = this.messageCallbacks.get(message.key);
          if (callback) {
            callback(message.payload);
            this.messageCallbacks.delete(message.key);
          }
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    });
    this.ws.addEventListener("error", (error) => {
      console.error("WebSocket error:", error);
    });
    this.ws.addEventListener("close", () => {
      console.log("WebSocket connection closed");
    });
  }
  start() {
    return new Promise((resolve) => {
      if (this.ws.readyState === WebSocket.OPEN) {
        resolve();
      } else {
        this.ws.onopen = () => resolve();
      }
    });
  }
  stop() {
    return new Promise((resolve) => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.close();
        this.ws.onclose = () => {
          resolve();
        };
      } else {
        resolve();
      }
    });
  }
  send(command, ...argz) {
    const key = Math.random().toString();
    const waitForOpen = () => {
      if (this.ws.readyState === WebSocket.OPEN) {
        return Promise.resolve();
      }
      if (this.ws.readyState === WebSocket.CONNECTING) {
        return new Promise((resolve) => {
          const onOpen = () => {
            this.ws.removeEventListener("open", onOpen);
            resolve();
          };
          this.ws.addEventListener("open", onOpen);
        });
      }
      return Promise.reject(new Error(`WebSocket is not open. State: ${this.ws.readyState}`));
    };
    return waitForOpen().then(() => {
      return new Promise((resolve, reject) => {
        this.messageCallbacks.set(key, (payload) => {
          resolve(payload);
        });
        const timeoutId = setTimeout(() => {
          if (this.messageCallbacks.has(key)) {
            console.error(`PM_Web timeout for ${command} with key ${key}`);
            this.messageCallbacks.delete(key);
            reject(new Error(`Timeout waiting for response to ${command}`));
          }
        }, 1e4);
        const message = {
          type: command,
          data: argz.length > 0 ? argz : void 0,
          key
        };
        try {
          this.ws.send(JSON.stringify(message));
          console.log(`PM_Web sent ${command} with key ${key}`);
        } catch (error) {
          console.error(`PM_Web error sending ${command}:`, error);
          clearTimeout(timeoutId);
          this.messageCallbacks.delete(key);
          reject(error);
        }
        const originalCallback = this.messageCallbacks.get(key);
        if (originalCallback) {
          this.messageCallbacks.set(key, (payload) => {
            clearTimeout(timeoutId);
            originalCallback(payload);
          });
        }
      });
    });
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
  getInnerHtml(selector, page) {
    return this.send("getInnerHtml", ...arguments);
  }
  focusOn(selector) {
    return this.send("focusOn", ...arguments);
  }
  typeInto(selector, value) {
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
  async writeFileSync(filepath, contents) {
    const fsPath = this.testResourceConfiguration?.fs;
    if (!fsPath) {
      console.error("PM_Web.writeFileSync: fs is undefined in testResourceConfiguration", this.testResourceConfiguration);
      throw new Error("fs is undefined in testResourceConfiguration");
    }
    const cleanFilepath = filepath.startsWith("/") ? filepath.substring(1) : filepath;
    const fullPath = fsPath + "/" + cleanFilepath;
    console.log("PM_Web.writeFileSync: fullPath:", fullPath);
    return await this.send(
      "writeFileSync",
      fullPath,
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
        new Promise((resolve, reject) => {
          tLog("testArtiFactory =>", fPath);
          resolve();
        })
      );
    };
  }
  // Browser context management implementations
  async createBrowserContext() {
    return await this.send("createBrowserContext");
  }
  async disposeBrowserContext(contextId) {
    return await this.send("disposeBrowserContext", contextId);
  }
  async getBrowserContexts() {
    return await this.send("getBrowserContexts");
  }
  async newPageInContext(contextId) {
    return await this.send("newPageInContext", contextId);
  }
  async getBrowserMemoryUsage() {
    return await this.send("getBrowserMemoryUsage");
  }
  async cleanupContext(contextId) {
    return await this.send("cleanupContext", contextId);
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
var butThenProxy = (pm, filepath, addArtifact) => {
  return baseProxy(pm, [
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
var andWhenProxy = (pm, filepath, addArtifact) => {
  return baseProxy(pm, [
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
var afterEachProxy = (pm, suite, given, addArtifact) => {
  return baseProxy(pm, [
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
var beforeEachProxy = (pm, suite, addArtifact) => {
  return baseProxy(pm, [
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
var beforeAllProxy = (pm, suite, addArtifact) => {
  return baseProxy(pm, [
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
var afterAllProxy = (pm, suite, addArtifact) => {
  return baseProxy(pm, [
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
  async afterEach(store, key, artifactory, pm) {
    return store;
  }
  async give(subject, key, testResourceConfiguration, tester, artifactory, tLog, pm, suiteNdx) {
    this.key = key;
    this.fails = 0;
    tLog(`
 ${this.key}`);
    tLog(`
 Given: ${this.key}`);
    const givenArtifactory = (fPath, value) => artifactory(`given-${key}/${fPath}`, value);
    this.uberCatcher((e) => {
      console.error(e.toString());
      this.error = e.error;
      tLog(e.stack);
    });
    try {
      const addArtifact = this.addArtifact.bind(this);
      const proxiedPm = beforeEachProxy(pm, suiteNdx.toString(), addArtifact);
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
            tLog,
            pm,
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
          pm,
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
  async test(store, testResourceConfiguration, tLog, pm, filepath) {
    const addArtifact = this.addArtifact.bind(this);
    const proxiedPm = butThenProxy(pm, filepath, addArtifact);
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
  async test(store, testResourceConfiguration, tLog, pm, filepath) {
    try {
      const addArtifact = this.addArtifact.bind(this);
      const proxiedPm = andWhenProxy(pm, filepath, addArtifact);
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
var Tiposkripto = class {
  constructor(input, testSpecification, testImplementation, testResourceRequirement = defaultTestResourceRequirement, testAdapter = {}, uberCatcher = (cb) => cb()) {
    this.artifacts = [];
    const fullAdapter = DefaultAdapter(testAdapter);
    const classySuites = Object.entries(testImplementation.suites).reduce(
      (a, [key], index) => {
        a[key] = (somestring, givens) => {
          return new class extends BaseSuite {
            afterAll(store, artifactory, pm) {
              return fullAdapter.afterAll(store, pm);
            }
            assertThat(t) {
              return fullAdapter.assertThis(t);
            }
            async setup(s, artifactory, tr, pm) {
              return fullAdapter.beforeAll?.(s, tr, pm) ?? s;
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
            async givenThat(subject, testResource, artifactory, initializer, initialValues2, pm) {
              return fullAdapter.beforeEach(
                subject,
                initializer,
                testResource,
                initialValues2,
                pm
              );
            }
            afterEach(store, key2, artifactory, pm) {
              return Promise.resolve(fullAdapter.afterEach(store, key2, pm));
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
            async andWhen(store, whenCB, testResource, pm) {
              return await fullAdapter.andWhen(store, whenCB, testResource, pm);
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
            async butThen(store, thenCB, testResource, pm) {
              return await fullAdapter.butThen(store, thenCB, testResource, pm);
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
          const tLog = async (...l) => {
          };
          try {
            const suiteDone = await runner(puppetMaster, tLog);
            const fails = suiteDone.fails;
            await puppetMaster.writeFileSync(
              `tests.json`,
              JSON.stringify(this.toObj(), null, 2)
              // "test"
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

// src/lib/Web.ts
var WebTiposkripto = class extends Tiposkripto {
  constructor(input, testSpecification, testImplementation, testResourceRequirement, testAdapter) {
    super(
      input,
      testSpecification,
      testImplementation,
      testResourceRequirement,
      testAdapter,
      () => {
      }
    );
  }
  async receiveTestResourceConfig(partialTestResource) {
    console.log("WebTiposkripto.receiveTestResourceConfig: raw input:", partialTestResource);
    const config = JSON.parse(partialTestResource);
    console.log("WebTiposkripto.receiveTestResourceConfig: parsed config:", config);
    return await this.testJobs[0].receiveTestResourceConfig(new PM_Web(config));
  }
};
var tiposkripto = async (input, testSpecification, testImplementation, testAdapter, testResourceRequirement = defaultTestResourceRequirement) => {
  try {
    const t = new WebTiposkripto(
      input,
      testSpecification,
      testImplementation,
      testResourceRequirement,
      testAdapter
    );
    const urlParams = new URLSearchParams(window.location.search);
    const encodedConfig = urlParams.get("config");
    const testResourceConfig = encodedConfig ? decodeURIComponent(encodedConfig) : "{}";
    console.log("Web test: parsed config from URL:", testResourceConfig);
    const results = await t.receiveTestResourceConfig(testResourceConfig);
    const event = new CustomEvent("test-complete", { detail: results });
    window.dispatchEvent(event);
    console.log("Web test completed:", results);
    return t;
  } catch (e) {
    console.error(e);
    const errorEvent = new CustomEvent("test-error", { detail: e });
    window.dispatchEvent(errorEvent);
    throw e;
  }
};
var Web_default = tiposkripto;
export {
  WebTiposkripto,
  Web_default as default
};
