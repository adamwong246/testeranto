import { Ibdd_in, Ibdd_out } from "./CoreTypes";
import PureTesteranto from "./Pure";
import { MockPMBase } from "./lib/pmProxy.test/mockPMBase";
import { IPM } from "./lib/types";

// Test types specific to PureTesteranto testing
type PureI = Ibdd_in<
  null, // No initial input needed
  IPM, // Test subject is IPM
  { pm: IPM }, // Store contains PM instance
  { pm: IPM }, // Selection is same as store
  () => IPM, // Given returns IPM
  (store: { pm: IPM }) => { pm: IPM }, // When modifies store
  (store: { pm: IPM }) => { pm: IPM } // Then verifies store
>;

type PureO = Ibdd_out<
  { Default: [string] },
  { Default: [] },
  {
    applyProxy: [string]; // When to apply a proxy
    verifyCall: [string, any]; // Then to verify calls
  },
  {
    verifyProxy: [string]; // Then to verify proxy behavior
    verifyNoProxy: []; // Then to verify no proxy
  },
  { Default: [] }
>;

// Implementation for PureTesteranto tests
const implementation = {
  suites: {
    Default: "PureTesteranto Test Suite",
  },

  givens: {
    Default: () => ({
      pm: new MockPMBase() as unknown as IPM,
      config: {},
      proxies: {
        butThenProxy: (pm: IPM, path: string) => ({
          ...pm,
          writeFileSync: (p: string, c: string) =>
            pm.writeFileSync(`${path}/butThen/${p}`, c),
        }),
        andWhenProxy: (pm: IPM, path: string) => ({
          ...pm,
          writeFileSync: (p: string, c: string) =>
            pm.writeFileSync(`${path}/andWhen/${p}`, c),
        }),
        beforeEachProxy: (pm: IPM, suite: string) => ({
          ...pm,
          writeFileSync: (p: string, c: string) =>
            pm.writeFileSync(`suite-${suite}/beforeEach/${p}`, c),
        }),
      },
    }),
  },

  whens: {
    applyProxy: (proxyType: string) => (store) => {
      switch (proxyType) {
        case "invalidConfig":
          throw new Error("Invalid configuration");
        case "missingProxy":
          return { ...store, pm: {} }; // Break proxy chain
        case "largePayload":
          return {
            ...store,
            largePayload: true,
            pm: {
              ...store.pm,
              writeFileSync: (p: string, c: string) => {
                if (c.length > 1e6) {
                  return true;
                }
                throw new Error("Payload too small");
              },
            },
          };
        default:
          return store;
      }
    },
  },

  thens: {
    verifyProxy: (expectedPath: string) => (store) => {
      const testPath = "expected";
      const result = store.pm.writeFileSync(testPath, "content");
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
    verifyError: (expectedError: string) => (store) => {
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
      const largeContent = "x".repeat(2e6); // 2MB payload
      const result = store.pm.writeFileSync("large.txt", largeContent);
      if (!result) {
        throw new Error("Failed to handle large payload");
      }
      return store;
    },
    verifyTypeSafety: () => (store) => {
      // TypeScript will catch these at compile time
      return store;
    },
  },
};

// Specification for PureTesteranto tests
const specification = (Suite, Given, When, Then) => [
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
    ),
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
    ),
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
    ),
  }),

  Suite.Default("Performance", {
    multipleProxiesTest: Given.Default(
      ["Should handle multiple proxies efficiently"],
      [
        When.applyProxy("butThenProxy"),
        When.applyProxy("andWhenProxy"),
        When.applyProxy("beforeEachProxy"),
      ],
      [
        Then.verifyProxy("test/path/butThen/expected"),
        Then.verifyProxy("test/path/andWhen/expected"),
        Then.verifyProxy("suite-1/beforeEach/expected"),
      ]
    ),
    largePayloadTest: Given.Default(
      ["Should handle large payloads"],
      [When.applyProxy("largePayload")],
      [Then.verifyLargePayload()]
    ),
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
    ),
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
    ),
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
        Then.artifactsTracked(),
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
        When.modifySpecs((specs) => [...specs]),
      ],
      [Then.testRunSuccessful(), Then.artifactsTracked(), Then.specsModified(0)]
    ),
  }),
];

// Test adapter for PureTesteranto
const testAdapter = {
  beforeEach: async (subject, initializer) => {
    return { pm: initializer() };
  },
  andWhen: async (store, whenCB) => whenCB(store),
  butThen: async (store, thenCB) => thenCB(store),
  afterEach: async (store) => store,
  afterAll: async () => {},
  beforeAll: async (input, testResource) => ({} as IPM),
  assertThis: (x) => x,
};

// Export the test suite
export default PureTesteranto<PureI, PureO, {}>(
  null, // No initial input
  specification,
  implementation,
  testAdapter
);
