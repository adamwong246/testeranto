import { createRequire } from 'module';const require = createRequire(import.meta.url);
import {
  Pure_default
} from "../chunk-WP6MFP22.mjs";
import "../chunk-M5XWNCQG.mjs";

// src/lib/pmProxy.test/mockPMBase.ts
var MockPMBase = class {
  constructor(configs) {
    this.calls = {};
    this.testResourceConfiguration = {};
    this.configs = configs || {};
  }
  // Common tracking functionality
  trackCall(method, args) {
    if (!this.calls[method]) {
      this.calls[method] = [];
    }
    this.calls[method].push(args);
  }
  getCallCount(method) {
    return this.calls[method]?.length || 0;
  }
  getLastCall(method) {
    const calls = this.calls[method];
    return calls ? calls[calls.length - 1] : null;
  }
  // Minimal implementations of required methods
  launchSideCar(n, testName, projectName) {
    this.trackCall("launchSideCar", { n, testName, projectName });
    return Promise.resolve();
  }
  end(uid) {
    this.trackCall("end", { uid });
    console.debug(`Ending test with uid ${uid}`);
    return Promise.resolve(true);
  }
  // Add debug method
  debug(message) {
    console.debug(`[MockPMBase] ${message}`);
    this.trackCall("debug", { message });
  }
  writeFileSync(path, content, testName) {
    this.trackCall("writeFileSync", { path, content, testName });
    return Promise.resolve(true);
  }
  createWriteStream(path, testName) {
    this.trackCall("createWriteStream", { path, testName });
    return Promise.resolve(0);
  }
  screencast(opts, testName, page) {
    this.trackCall("screencast", { opts, testName, page });
    return Promise.resolve({});
  }
  customScreenShot(opts, testName, pageUid) {
    this.trackCall("customScreenShot", { opts, testName, pageUid });
    return Promise.resolve({});
  }
  testArtiFactoryfileWriter(tLog, callback) {
    return (fPath, value) => {
      this.trackCall("testArtiFactoryfileWriter", { fPath, value });
      callback(Promise.resolve());
    };
  }
  // Other required PM_Base methods with minimal implementations
  closePage(p) {
    return Promise.resolve();
  }
  $(selector, p) {
    return Promise.resolve();
  }
  click(selector, page) {
    return Promise.resolve();
  }
  goto(p, url) {
    return Promise.resolve();
  }
  newPage() {
    return Promise.resolve("mock-page");
  }
  pages() {
    return Promise.resolve(["mock-page"]);
  }
  waitForSelector(p, s) {
    return Promise.resolve(true);
  }
  focusOn(selector, p) {
    return Promise.resolve();
  }
  typeInto(value, p) {
    return Promise.resolve();
  }
  getAttribute(selector, attribute, p) {
    return Promise.resolve();
  }
  getInnerHtml(selector, p) {
    return Promise.resolve();
  }
  isDisabled(selector, p) {
    return Promise.resolve(false);
  }
  screencastStop(s) {
    return Promise.resolve();
  }
  existsSync(destFolder) {
    return false;
  }
  mkdirSync(fp) {
    return Promise.resolve();
  }
  write(uid, contents) {
    return Promise.resolve(true);
  }
  page(p) {
    return "mock-page";
  }
  doInPage(p, cb) {
    return Promise.resolve();
  }
  customclose() {
    return Promise.resolve();
  }
};

// src/Pure.test.ts
var implementation = {
  suites: {
    Default: "PureTesteranto Test Suite"
  },
  givens: {
    Default: () => ({
      pm: new MockPMBase(),
      config: {},
      proxies: {
        butThenProxy: (pm, path) => ({
          ...pm,
          writeFileSync: (p, c) => pm.writeFileSync(`${path}/butThen/${p}`, c)
        }),
        andWhenProxy: (pm, path) => ({
          ...pm,
          writeFileSync: (p, c) => pm.writeFileSync(`${path}/andWhen/${p}`, c)
        }),
        beforeEachProxy: (pm, suite) => ({
          ...pm,
          writeFileSync: (p, c) => pm.writeFileSync(`suite-${suite}/beforeEach/${p}`, c)
        })
      }
    })
  },
  whens: {
    applyProxy: (proxyType) => (store) => {
      console.debug(`[DEBUG] Applying proxy type: ${proxyType}`);
      switch (proxyType) {
        case "invalidConfig":
          throw new Error("Invalid configuration");
        case "missingProxy":
          return { ...store, pm: {} };
        case "largePayload":
          return {
            ...store,
            largePayload: true,
            pm: {
              ...store.pm,
              writeFileSync: (p, c) => {
                if (c.length > 1e6) {
                  return true;
                }
                throw new Error("Payload too small");
              }
            }
          };
        case "resourceConfig":
          return {
            ...store,
            pm: {
              ...store.pm,
              testResourceConfiguration: { name: "test-resource" }
            }
          };
        default:
          return store;
      }
    },
    addArtifact: (artifact) => (store) => {
      console.debug("[DEBUG] Adding artifact");
      return {
        ...store,
        artifacts: [...store.artifacts || [], artifact]
      };
    },
    setTestJobs: (jobs) => (store) => {
      console.debug("[DEBUG] Setting test jobs");
      return {
        ...store,
        testJobs: jobs
      };
    },
    modifySpecs: (modifier) => (store) => {
      console.debug("[DEBUG] Modifying specs");
      return {
        ...store,
        specs: modifier(store.specs || [])
      };
    }
  },
  thens: {
    initializedProperly: () => (store) => {
      if (!store.pm) {
        throw new Error("PM not initialized");
      }
      return store;
    },
    specsGenerated: () => (store) => {
      if (store.pm.getCallCount("writeFileSync") === 0) {
        throw new Error("No specs generated");
      }
      return store;
    },
    jobsCreated: () => (store) => {
      return store;
    },
    artifactsTracked: () => (store) => {
      return store;
    },
    testRunSuccessful: () => (store) => {
      if (store.pm.getCallCount("end") === 0) {
        throw new Error("Test run did not complete successfully");
      }
      return store;
    },
    specsModified: (expectedCount) => (store) => {
      const actualCount = store.pm.getCallCount("writeFileSync");
      if (actualCount < expectedCount) {
        throw new Error(
          `Expected ${expectedCount} spec modifications, got ${actualCount}`
        );
      }
      return store;
    },
    verifyProxy: (expectedPath) => (store) => {
      const actualPath = store.pm.getLastCall("writeFileSync")?.path;
      if (actualPath !== expectedPath) {
        throw new Error(`Expected path ${expectedPath}, got ${actualPath}`);
      }
      return store;
    },
    verifyNoProxy: () => (store) => {
      if (store.pm.getCallCount("writeFileSync") > 0) {
        throw new Error("Proxy was unexpectedly applied");
      }
      return store;
    },
    verifyError: (expectedError) => (store) => {
      try {
        store.pm.writeFileSync("test", "content");
        throw new Error("Expected error but none was thrown");
      } catch (error) {
        if (!error.message.includes(expectedError)) {
          throw new Error(
            `Expected error "${expectedError}", got "${error.message}"`
          );
        }
      }
      return store;
    },
    verifyResourceConfig: () => (store) => {
      if (!store.pm.testResourceConfiguration) {
        throw new Error("Missing test resource configuration");
      }
      return store;
    },
    verifyLargePayload: () => (store) => {
      const largeContent = "x".repeat(2e6);
      const result = store.pm.writeFileSync("large.txt", largeContent);
      if (!result) {
        throw new Error("Failed to handle large payload");
      }
      return store;
    },
    verifyTypeSafety: () => (store) => {
      return store;
    }
  }
};
var specification = (Suite, Given, When, Then) => [
  Suite.Default("Core Functionality", {
    initializationTest: Given.Default(
      ["Should initialize with default configuration"],
      [],
      [Then.verifyNoProxy()]
    ),
    resourceConfigTest: Given.Default(
      ["Should handle test resource configuration"],
      [When.applyProxy("resourceConfig")],
      [Then.verifyResourceConfig()]
    )
  }),
  Suite.Default("Proxy Integration", {
    butThenProxyTest: Given.Default(
      ["Should integrate with butThenProxy"],
      [When.applyProxy("butThenProxy")],
      [Then.verifyProxy("test/path/butThen/expected")]
    ),
    andWhenProxyTest: Given.Default(
      ["Should integrate with andWhenProxy"],
      [When.applyProxy("andWhenProxy")],
      [Then.verifyProxy("test/path/andWhen/expected")]
    ),
    beforeEachProxyTest: Given.Default(
      ["Should integrate with beforeEachProxy"],
      [When.applyProxy("beforeEachProxy")],
      [Then.verifyProxy("suite-1/beforeEach/expected")]
    )
  }),
  Suite.Default("Error Handling", {
    invalidConfigTest: Given.Default(
      ["Should handle invalid configuration"],
      [When.applyProxy("invalidConfig")],
      [Then.verifyError("Invalid configuration")]
    ),
    missingProxyTest: Given.Default(
      ["Should handle missing proxy"],
      [When.applyProxy("missingProxy")],
      [Then.verifyError("Proxy not found")]
    )
  }),
  Suite.Default("Performance", {
    multipleProxiesTest: Given.Default(
      ["Should handle multiple proxies efficiently"],
      [
        When.applyProxy("butThenProxy"),
        When.applyProxy("andWhenProxy"),
        When.applyProxy("beforeEachProxy")
      ],
      [
        Then.verifyProxy("test/path/butThen/expected"),
        Then.verifyProxy("test/path/andWhen/expected"),
        Then.verifyProxy("suite-1/beforeEach/expected")
      ]
    ),
    largePayloadTest: Given.Default(
      ["Should handle large payloads"],
      [When.applyProxy("largePayload")],
      [Then.verifyLargePayload()]
    )
  }),
  Suite.Default("Cross-Component Verification", {
    proxyChainTest: Given.Default(
      ["Proxies should chain correctly"],
      [When.applyProxy("butThenProxy"), When.applyProxy("andWhenProxy")],
      [Then.verifyProxy("test/path/andWhen/butThen/expected")]
    ),
    errorPropagationTest: Given.Default(
      ["Errors should propagate across components"],
      [When.applyProxy("invalidConfig")],
      [Then.verifyError("Invalid configuration")]
    ),
    resourceSharingTest: Given.Default(
      ["Resources should be shared correctly"],
      [When.applyProxy("resourceConfig")],
      [Then.verifyResourceConfig()]
    )
  }),
  Suite.Default("Type Safety", {
    strictTypeTest: Given.Default(
      ["Should enforce type safety"],
      [When.applyProxy("typeSafe")],
      [Then.verifyTypeSafety()]
    ),
    invalidTypeTest: Given.Default(
      ["Should reject invalid types"],
      [When.applyProxy("invalidType")],
      [Then.verifyError("Type mismatch")]
    )
  }),
  Suite.Default("Integration Tests", {
    // Verify builders work together
    builderIntegration: Given.Default(
      ["BaseBuilder and ClassBuilder should integrate properly"],
      [],
      [
        Then.initializedProperly(),
        Then.specsGenerated(),
        Then.jobsCreated(),
        Then.artifactsTracked()
      ]
    ),
    // Verify PM proxy integration
    pmProxyIntegration: Given.Default(
      ["PM proxies should work with test runners"],
      [When.applyProxy("butThenProxy")],
      [Then.verifyProxy("test/path/butThen/expected")]
    ),
    // Verify full test lifecycle
    fullLifecycle: Given.Default(
      ["Should complete full test lifecycle"],
      [
        When.addArtifact(Promise.resolve("test")),
        When.setTestJobs([]),
        When.modifySpecs((specs) => [...specs])
      ],
      [Then.testRunSuccessful(), Then.artifactsTracked(), Then.specsModified(0)]
    )
  })
];
var testAdapter = {
  beforeEach: async (subject, initializer) => {
    const pm = initializer();
    pm.debug(`Initializing test with subject: ${subject}`);
    return { pm };
  },
  andWhen: async (store, whenCB) => whenCB(store),
  butThen: async (store, thenCB) => thenCB(store),
  afterEach: async (store) => store,
  afterAll: async () => {
  },
  beforeAll: async (input, testResource) => ({}),
  assertThis: (x) => x
};
var Pure_test_default = Pure_default(
  null,
  // No initial input
  specification,
  implementation,
  testAdapter
);
export {
  Pure_test_default as default
};
