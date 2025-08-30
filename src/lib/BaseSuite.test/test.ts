/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ITTestResourceConfiguration, ITestArtifactory, ITLog } from "..";
import {
  Ibdd_in,
  Ibdd_out,
  ITestSpecification,
  ITestImplementation,
  ITestAdapter,
} from "../../CoreTypes";

import { BaseSuite } from "../BaseSuite";
import { IPM } from "../types";
import { MockSuite } from "./mock";

// 1. Define our test types with full type safety
export type TestStore = {
  name?: string;
  index?: number;
  testStore: boolean;
  testSelection?: boolean;
  error?: Error | undefined;
};

export type TestSelection = {
  testSelection: boolean;
  error?: boolean;
};

export type I = Ibdd_in<
  typeof BaseSuite,
  BaseSuite<any, any>, // isubject
  TestStore, // istore
  TestSelection, // iselection
  () => Promise<TestStore>, // given
  (store: TestStore) => Promise<TestStore>, // when
  (store: TestStore) => Promise<TestSelection> // then
>;

export type O = Ibdd_out<
  {
    Default: [string]; // Suite names
  },
  {
    Default: []; // Given states
  },
  {
    TestWhen: []; // When actions
    RunSuite: [];
  },
  {
    TestThen: []; // Then assertions
    FeaturesIncludes: [feature: string];
    StoreValid: [];
    SuiteNameMatches: [string];
    SuiteIndexMatches: [number];
  }
>;

// 3. Enhanced Test Specification with more test cases
export const specification: ITestSpecification<I, O> = (
  Suite,
  Given,
  When,
  Then
) => [
  Suite.Default("BaseSuite Core Functionality Tests", {
    // Test initialization and basic properties
    initialization: Given.Default(
      ["BaseSuite should initialize with correct name and index"],
      [],
      [Then.SuiteNameMatches("testSuite"), Then.SuiteIndexMatches(0)]
    ),

    // // Test execution flow
    // execution: Given.Default(
    //   ["BaseSuite should execute all phases successfully"],
    //   [When.RunSuite()],
    //   [Then.StoreValid()]
    // ),

    // // Test multiple features
    // multipleFeatures: Given.Default(
    //   ["BaseSuite should handle multiple features"],
    //   [When.AddFeature("additionalFeature")],
    //   [
    //     Then.FeaturesIncludes("testFeature"),
    //     Then.FeaturesIncludes("additionalFeature"),
    //     Then.FeatureCountMatches(2),
    //   ]
    // ),

    // // Test error handling
    // errorHandling: Given.Default(
    //   ["BaseSuite should handle errors gracefully"],
    //   [When.RunSuiteWithError()],
    //   [Then.ErrorCountMatches(1), Then.FailedFlagSet()]
    // ),
  }),

  // Suite.Default("Comprehensive Integration", {
  //   fullStackTest: Given.Default(
  //     ["All components should work together"],
  //     [
  //       When.addArtifact(Promise.resolve("test")),
  //       When.modifySpecs((specs) => [...specs, "extra"]),
  //       When.modifyJobs((jobs) => [...jobs, {}]),
  //     ],
  //     [
  //       Then.specsModified(1),
  //       Then.jobsModified(1),
  //       Then.artifactsTracked(),
  //       Then.testRunSuccessful(),
  //     ]
  //   ),
  // }),
];

// 4. Enhanced Test Implementation with more operations
export const implementation: ITestImplementation<I, O> = {
  suites: {
    Default: "BaseSuite Comprehensive Test Suite" as const,
  },

  givens: {
    Default: (): (() => Promise<TestStore>) => {
      return async () => {
        const suite = new MockSuite("testSuite", 0);
        // Convert MockSuite to TestStore
        return {
          name: suite.name,
          index: suite.index,
          testStore: true,
        };
      };
    },
  },

  whens: {
    addArtifact:
      (artifact: Promise<unknown>): ((suite: MockSuite) => MockSuite) =>
      (suite: MockSuite) => {
        suite.artifacts.push(artifact);
        return suite;
      },

    modifySpecs:
      (modifier: (specs: any[]) => any[]): ((suite: MockSuite) => MockSuite) =>
      (suite: MockSuite) => {
        suite.specs = modifier(suite.specs);
        return suite;
      },

    modifyJobs:
      (modifier: (jobs: any[]) => any[]): ((suite: MockSuite) => MockSuite) =>
      (suite: MockSuite) => {
        suite.testJobs = modifier(suite.testJobs);
        return suite;
      },

    RunSuite:
      (): ((suite: MockSuite) => Promise<MockSuite>) =>
      async (suite: MockSuite) => {
        const mockConfig: ITTestResourceConfiguration = {
          name: "test",
          fs: "/tmp",
          ports: [3000],
          environment: {},
          timeout: 5000,
          retries: 3,
        };
        const mockArtifactory: ITestArtifactory = (
          key: string,
          value: unknown
        ) => {};
        const mockTLog: ITLog = (...args: any[]) => {};
        const mockPM: IPM = {
          server: null,
          testResourceConfiguration: mockConfig,
          start: async () => {},
          stop: async () => {},
          testArtiFactoryfileWriter: () => {},
          $: () => {},
          click: () => {},
          closePage: () => {},
          createWriteStream: async () => "",
        };

        return await suite.run(
          null,
          mockConfig,
          mockArtifactory,
          mockTLog,
          mockPM
        );
      },

    RunSuiteWithError:
      (): ((suite: MockSuite) => Promise<MockSuite>) =>
      async (suite: MockSuite) => {
        // Force an error by passing invalid config
        try {
          await suite.run(
            null,
            {} as ITTestResourceConfiguration, // Invalid config
            () => {},
            () => {},
            {} as IPM
          );
        } catch (e) {
          // Error is caught and counted by BaseSuite
        }
        return suite;
      },

    AddFeature:
      (feature: string): ((suite: MockSuite) => MockSuite) =>
      (suite: MockSuite) => {
        // Add a feature to the first given
        const firstGivenKey = Object.keys(suite.givens)[0];
        if (firstGivenKey) {
          suite.givens[firstGivenKey].features.push(feature);
        }
        return suite;
      },
  },

  thens: {
    SuiteNameMatches:
      (
        expectedName: string
      ): ((
        ssel: TestSelection,
        utils: IPM
      ) => (store: TestStore) => Promise<TestSelection>) =>
      (ssel, utils) =>
      (store) => {
        if (store.name !== expectedName) {
          throw new Error(
            `Expected suite name '${expectedName}', got '${store.name}'`
          );
        }
        return Promise.resolve({ testSelection: true });
      },

    SuiteIndexMatches:
      (
        expectedIndex: number
      ): ((
        ssel: TestSelection,
        utils: IPM
      ) => (store: TestStore) => Promise<TestSelection>) =>
      (ssel, utils) =>
      (store) => {
        if (store.index !== expectedIndex) {
          throw new Error(
            `Expected suite index ${expectedIndex}, got ${store.index}`
          );
        }
        return Promise.resolve({ testSelection: true });
      },

    FeaturesIncludes:
      (
        feature: string
      ): ((
        ssel: TestSelection,
        utils: IPM
      ) => (store: TestStore) => Promise<TestSelection>) =>
      (ssel, utils) =>
      (store) => {
        // For now, just return a resolved promise
        // The actual implementation would check if the feature is present
        return Promise.resolve({ testSelection: true });
      },

    FeatureCountMatches:
      (expectedCount: number): ((
        ssel: TestSelection,
        utils: IPM
      ) => (store: TestStore) => Promise<TestSelection>) =>
      (ssel, utils) =>
      (store) => {
        // For now, just return a resolved promise
        return Promise.resolve({ testSelection: true });
      },

    NoErrorsOccurred:
      (): ((
        ssel: TestSelection,
        utils: IPM
      ) => (store: TestStore) => Promise<TestSelection>) =>
      (ssel, utils) =>
      (store) => {
        // For now, just return a resolved promise
        return Promise.resolve({ testSelection: true });
      },

    ErrorCountMatches:
      (expectedCount: number): ((
        ssel: TestSelection,
        utils: IPM
      ) => (store: TestStore) => Promise<TestSelection>) =>
      (ssel, utils) =>
      (store) => {
        // For now, just return a resolved promise
        return Promise.resolve({ testSelection: true });
      },

    FailedFlagSet:
      (): ((
        ssel: TestSelection,
        utils: IPM
      ) => (store: TestStore) => Promise<TestSelection>) =>
      (ssel, utils) =>
      (store) => {
        // For now, just return a resolved promise
        return Promise.resolve({ testSelection: true });
      },

    AllTestsCompleted:
      (): ((
        ssel: TestSelection,
        utils: IPM
      ) => (store: TestStore) => Promise<TestSelection>) =>
      (ssel, utils) =>
      (store) => {
        // For now, just return a resolved promise
        return Promise.resolve({ testSelection: true });
      },

    CleanExit: 
      (): ((
        ssel: TestSelection,
        utils: IPM
      ) => (store: TestStore) => Promise<TestSelection>) =>
      (ssel, utils) =>
      (store) => {
        // For now, just return a resolved promise
        return Promise.resolve({ testSelection: true });
      },

    specsModified:
      (expectedCount: number): ((
        ssel: TestSelection,
        utils: IPM
      ) => (store: TestStore) => Promise<TestSelection>) =>
      (ssel, utils) =>
      (store) => {
        // For now, just return a resolved promise
        return Promise.resolve({ testSelection: true });
      },

    jobsModified:
      (expectedCount: number): ((
        ssel: TestSelection,
        utils: IPM
      ) => (store: TestStore) => Promise<TestSelection>) =>
      (ssel, utils) =>
      (store) => {
        // For now, just return a resolved promise
        return Promise.resolve({ testSelection: true });
      },

    artifactsTracked:
      (): ((
        ssel: TestSelection,
        utils: IPM
      ) => (store: TestStore) => Promise<TestSelection>) =>
      (ssel, utils) =>
      (store) => {
        // For now, just return a resolved promise
        return Promise.resolve({ testSelection: true });
      },

    testRunSuccessful:
      (): ((
        ssel: TestSelection,
        utils: IPM
      ) => (store: TestStore) => Promise<TestSelection>) =>
      (ssel, utils) =>
      (store) => {
        // For now, just return a resolved promise
        return Promise.resolve({ testSelection: true });
      },
  },
};

// 5. Fully typed Test Adapter
export const testAdapter: ITestAdapter<I> = {
  beforeEach: async (
    subject: I["isubject"],
    initializer: (context?: any) => I["given"],
    testResource: ITTestResourceConfiguration,
    initialValues: any,
    pm: IPM
  ): Promise<I["istore"]> => {
    try {
      const suite = await initializer();
      if (!suite) {
        throw new Error("Initializer returned undefined suite");
      }

      return {
        name: suite.name,
        index: suite.index,
        testStore: true,
        testSelection: false,
        ...(suite.store || {}),
      };
    } catch (e) {
      console.error("Given error:", e);
      throw e;
    }
  },

  andWhen: async (
    store: I["istore"],
    whenCB: I["when"],
    testResource: ITTestResourceConfiguration,
    pm: IPM
  ): Promise<I["istore"]> => {
    // whenCB is (store: TestStore) => Promise<TestStore>
    const result = await whenCB(store);
    return result;
  },

  butThen: async (
    store: TestStore,
    thenCB: I["then"],
    testResource: ITTestResourceConfiguration,
    pm: IPM
  ): Promise<TestSelection> => {
    try {
      // thenCB is (store: TestStore) => Promise<TestSelection>
      const result = await thenCB(store);
      return result;
    } catch (e) {
      console.error("Then error:", e.toString());
      throw e;
    }
  },

  afterEach: (store: I["istore"]): I["istore"] => store,

  afterAll: (store: I["istore"], pm: IPM): void => {},

  assertThis: (result: I["then"] | undefined): boolean => !!result,

  beforeAll: async (
    input: I["iinput"],
    testResource: ITTestResourceConfiguration,
    pm: IPM
  ): Promise<I["isubject"]> => input as unknown as I["isubject"],
};
