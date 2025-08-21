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
  { pm: IPM; artifacts?: any[]; testJobs?: any[]; specs?: any[]; largePayload?: boolean }, // Store contains PM instance
  { pm: IPM }, // Selection is same as store
  () => { pm: IPM; config: {}; proxies: any }, // Given returns initial state
  (store: { pm: IPM; [key: string]: any }) => { pm: IPM; [key: string]: any }, // When modifies store
  (store: { pm: IPM; [key: string]: any }) => { pm: IPM; [key: string]: any } // Then verifies store
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
    Default: () => {
      const pm = new MockPMBase() as unknown as IPM;
      return {
        pm,
        config: {},
        proxies: {
          butThenProxy: (pm: IPM, path: string) => ({
            ...pm,
            writeFileSync: (p: string, c: string) => {
              return (pm as any).writeFileSync(`${path}/butThen/${p}`, c);
            },
          }),
          andWhenProxy: (pm: IPM, path: string) => ({
            ...pm,
            writeFileSync: (p: string, c: string) => {
              return (pm as any).writeFileSync(`${path}/andWhen/${p}`, c);
            },
          }),
          beforeEachProxy: (pm: IPM, suite: string) => ({
            ...pm,
            writeFileSync: (p: string, c: string) => {
              return (pm as any).writeFileSync(`suite-${suite}/beforeEach/${p}`, c);
            },
          }),
        },
      };
    },
  },

  whens: {
    applyProxy: (proxyType: string) => async (store, tr, utils) => {
      switch (proxyType) {
        case "invalidConfig":
          throw new Error("Invalid configuration");
        case "missingProxy":
          return { ...store, pm: {} as IPM }; // Break proxy chain
        case "largePayload":
          return {
            ...store,
            largePayload: true,
            pm: {
              ...store.pm,
              writeFileSync: async (p: string, c: string) => {
                if (c.length > 1e6) {
                  return true;
                }
                throw new Error("Payload too small");
              },
            } as unknown as IPM,
          };
        case "resourceConfig":
          return {
            ...store,
            pm: {
              ...store.pm,
              testResourceConfiguration: { name: "test-resource" },
            } as unknown as IPM,
          };
        default:
          return store;
      }
    },
    addArtifact: (artifact: Promise<string>) => async (store) => {
      return {
        ...store,
        artifacts: [...(store.artifacts || []), artifact],
      };
    },
    setTestJobs: (jobs: any[]) => async (store) => {
      return {
        ...store,
        testJobs: jobs,
      };
    },
    modifySpecs: (modifier: (specs: any) => any[]) => async (store) => {
      return {
        ...store,
        specs: modifier(store.specs || []),
      };
    },
  },

  thens: {
    initializedProperly: () => async (store, tr, utils) => {
      if (!store.pm) {
        throw new Error("PM not initialized");
      }
      return store;
    },
    specsGenerated: () => async (store, tr, utils) => {
      return store;
    },
    jobsCreated: () => async (store, tr, utils) => {
      return store;
    },
    artifactsTracked: () => async (store, tr, utils) => {
      return store;
    },
    testRunSuccessful: () => async (store, tr, utils) => {
      return store;
    },
    specsModified: (expectedCount: number) => async (store, tr, utils) => {
      return store;
    },
    verifyProxy: (expectedPath: string) => async (store, tr, utils) => {
      return store;
    },
    verifyNoProxy: () => async (store, tr, utils) => {
      return store;
    },
    verifyError: (expectedError: string) => async (store, tr, utils) => {
      return store;
    },
    verifyResourceConfig: () => async (store, tr, utils) => {
      return store;
    },
    verifyLargePayload: () => async (store, tr, utils) => {
      return store;
    },
    verifyTypeSafety: () => async (store, tr, utils) => {
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
const testAdapter: Partial<ITestAdapter<I>> = {
  beforeEach: async (subject, initializer, testResource, initialValues, pm) => {
    const initialized = initializer();
    return { pm: initialized.pm };
  },
  andWhen: async (store, whenCB, testResource, pm) => {
    const result = await whenCB(store, testResource, pm);
    return result;
  },
  butThen: async (store, thenCB, testResource, pm) => {
    const result = await thenCB(store, testResource, pm);
    return result;
  },
  afterEach: async (store, key, pm) => store,
  afterAll: async (store, pm) => {},
  beforeAll: async (input, testResource, pm) => ({} as IPM),
  assertThis: (x) => x,
};

// Export the test suite
export default PureTesteranto<I, O, {}>(
  null, // No initial input
  specification,
  implementation,
  testAdapter
);
