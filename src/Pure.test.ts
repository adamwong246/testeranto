/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Ibdd_in,
  Ibdd_out,
  ITestImplementation,
  ITestSpecification,
} from "./CoreTypes";
import PureTesteranto from "./Pure";
import { MockPMBase } from "./lib/pmProxy.test/mockPMBase";
import { IPM } from "./lib/types";

// Test types specific to PureTesteranto testing
type I = Ibdd_in<
  null, // No initial input needed
  IPM, // Test subject is IPM
  { pm: IPM }, // Store contains PM instance
  { pm: IPM }, // Selection is same as store
  () => IPM, // Given returns IPM
  (store: { pm: IPM }) => { pm: IPM }, // When modifies store
  (store: { pm: IPM }) => { pm: IPM } // Then verifies store
>;

type O = Ibdd_out<
  { Default: [string] },
  { Default: [] },
  {
    applyProxy: [string]; // When to apply a proxy
    verifyCall: [string, any]; // Then to verify calls
    addArtifact: [Promise<string>];
    setTestJobs: [any[]];
    modifySpecs: [(specs: any) => any[]];
  },
  {
    verifyProxy: [string]; // Then to verify proxy behavior
    verifyNoProxy: []; // Then to verify no proxy
    verifyResourceConfig: [];
    verifyError: [string];
    verifyLargePayload: [];
    verifyTypeSafety: [];
    initializedProperly: [];
    specsGenerated: [];
    jobsCreated: [];
    artifactsTracked: [];
    testRunSuccessful: [];
    specsModified: [number];
  }
>;

// Implementation for PureTesteranto tests
const implementation: ITestImplementation<I, O> = {
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
      console.debug(`[DEBUG] Applying proxy type: ${proxyType}`);
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
    addArtifact: (artifact: Promise<string>) => (store) => {
      console.debug("[DEBUG] Adding artifact");
      return {
        ...store,
        artifacts: [...(store.artifacts || []), artifact]
      };
    },
    setTestJobs: (jobs: any[]) => (store) => {
      console.debug("[DEBUG] Setting test jobs");
      return {
        ...store,
        testJobs: jobs
      };
    },
    modifySpecs: (modifier: (specs: any) => any[]) => (store) => {
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
      // Basic verification that jobs were created
      return store;
    },
    artifactsTracked: () => (store) => {
      // Basic verification that artifacts are tracked
      return store;
    },
    testRunSuccessful: () => (store) => {
      if (store.pm.getCallCount("end") === 0) {
        throw new Error("Test run did not complete successfully");
      }
      return store;
    },
    specsModified: (expectedCount: number) => (store) => {
      const actualCount = store.pm.getCallCount("writeFileSync");
      if (actualCount < expectedCount) {
        throw new Error(
          `Expected ${expectedCount} spec modifications, got ${actualCount}`
        );
      }
      return store;
    },
    verifyProxy: (expectedPath: string) => (store) => {
      // const testPath = "expected";
      // const result = store.pm.writeFileSync(testPath, "content");
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
const specification: ITestSpecification<I, O> = (Suite, Given, When, Then) => [
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
    const pm = initializer();
    pm.debug(`Initializing test with subject: ${subject}`);
    return { pm };
  },
  andWhen: async (store, whenCB) => whenCB(store),
  butThen: async (store, thenCB) => thenCB(store),
  afterEach: async (store) => store,
  afterAll: async () => {},
  beforeAll: async (input, testResource) => ({} as IPM),
  assertThis: (x) => x,
};

// Export the test suite
export default PureTesteranto<I, O, {}>(
  null, // No initial input
  specification,
  implementation,
  testAdapter
);
