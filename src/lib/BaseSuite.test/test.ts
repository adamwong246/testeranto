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
  error?: Error;
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
    Default: (): MockSuite => {
      const suite = new MockSuite("testSuite", 0);

      return suite;
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
      (expectedName: string): ((selection: TestSelection) => TestSelection) =>
      (selection) => {
        if (!selection.name) {
          throw new Error(`Suite name is undefined. Expected: ${expectedName}`);
        }
        if (selection.name !== expectedName) {
          throw new Error(
            `Expected suite name '${expectedName}', got '${selection.name}'`
          );
        }
        return selection;
      },

    SuiteIndexMatches:
      (expectedIndex: number): ((selection: TestSelection) => TestSelection) =>
      (selection) => {
        if (selection.index !== expectedIndex) {
          throw new Error(
            `Expected suite index ${expectedIndex}, got ${selection.index}`
          );
        }
        return selection;
      },

    FeaturesIncludes:
      (feature: string): ((suite: MockSuite) => MockSuite) =>
      (suite: MockSuite) => {
        if (!suite.features().includes(feature)) {
          throw new Error(`Expected features to include ${feature}`);
        }
        return suite;
      },

    FeatureCountMatches:
      (expectedCount: number): ((suite: MockSuite) => MockSuite) =>
      (suite: MockSuite) => {
        const actualCount = suite.features().length;
        if (actualCount !== expectedCount) {
          throw new Error(
            `Expected ${expectedCount} features, got ${actualCount}`
          );
        }
        return suite;
      },

    StoreValid: (): ((suite: MockSuite) => MockSuite) => (suite: MockSuite) => {
      if (!suite.store?.testStore) {
        throw new Error("Expected valid store after execution");
      }
      return suite;
    },

    NoErrorsOccurred:
      (): ((suite: MockSuite) => MockSuite) => (suite: MockSuite) => {
        if (suite.failed || suite.fails > 0) {
          throw new Error("Expected no errors to occur during execution");
        }
        return suite;
      },

    ErrorCountMatches:
      (expectedCount: number): ((suite: MockSuite) => MockSuite) =>
      (suite: MockSuite) => {
        if (suite.fails !== expectedCount) {
          throw new Error(
            `Expected ${expectedCount} errors, got ${suite.fails}`
          );
        }
        return suite;
      },

    FailedFlagSet:
      (): ((suite: MockSuite) => MockSuite) => (suite: MockSuite) => {
        if (!suite.failed) {
          throw new Error("Expected failed flag to be set after error");
        }
        return suite;
      },

    AllTestsCompleted:
      (): ((suite: MockSuite) => MockSuite) => (suite: MockSuite) => {
        if (!suite.store) {
          throw new Error("Expected all tests to be completed");
        }
        return suite;
      },

    CleanExit: (): ((suite: MockSuite) => MockSuite) => (suite: MockSuite) => {
      if (suite.failed && suite.fails === 0) {
        throw new Error("Expected clean exit state");
      }
      return suite;
    },

    specsModified:
      (expectedCount: number): ((suite: MockSuite) => MockSuite) =>
      (suite: MockSuite) => {
        if (suite.specs.length !== expectedCount) {
          throw new Error(`Expected ${expectedCount} modified specs`);
        }
        return suite;
      },

    jobsModified:
      (expectedCount: number): ((suite: MockSuite) => MockSuite) =>
      (suite: MockSuite) => {
        if (suite.testJobs.length !== expectedCount) {
          throw new Error(`Expected ${expectedCount} modified jobs`);
        }
        return suite;
      },

    artifactsTracked:
      (): ((suite: MockSuite) => MockSuite) => (suite: MockSuite) => {
        if (suite.artifacts.length === 0) {
          throw new Error("Expected artifacts to be tracked");
        }
        return suite;
      },

    testRunSuccessful:
      (): ((suite: MockSuite) => MockSuite) => (suite: MockSuite) => {
        if (suite.failed) {
          throw new Error("Expected test run to be successful");
        }
        return suite;
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
  ): Promise<I["istore"]> => whenCB(store, pm),

  butThen: async (
    store: TestStore,
    thenCB: (selection: TestSelection) => Promise<TestSelection>,
    testResource: ITTestResourceConfiguration,
    pm: IPM
  ): Promise<TestSelection> => {
    const testSelection: TestSelection = {
      testSelection: store.testSelection || false,
      error: store.error ? true : undefined,
      name: store.name,
      index: store.index,
    };

    try {
      const result = await thenCB(testSelection);

      if (!result || typeof result.testSelection === "undefined") {
        throw new Error(
          `Invalid test selection result: ${JSON.stringify(result)}`
        );
      }

      return result;
    } catch (e) {
      console.error("Then error:", e.toString());
      console.error("Full store state:", JSON.stringify(store, null, 2));
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
