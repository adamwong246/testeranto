import { ITTestResourceConfiguration, ITestArtifactory, ITLog } from "..";
import {
  Ibdd_in,
  Ibdd_out,
  ITestSpecification,
  ITestImplementation,
  ITestInterface,
} from "../../CoreTypes";
import { WhenSpecification } from "../../Types";
import { BaseSuite } from "../BaseSuite";
import { IPM } from "../types";
import { MockSuite } from "./mock";

// 1. Define our test types with full type safety
export type TestStore = {
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
  }
>;

// 3. Enhanced Test Specification with more test cases
export const specification: ITestSpecification<I, O> = (
  Suite: ITestSpecification<I, O>,
  Given: WhenSpecification<I, O>,
  When: WhenSpecification<I, O>,
  Then: WhenSpecification<I, O>
) => [
  Suite.Default("BaseSuite Core Functionality Tests", {
    // Test initialization and basic properties
    initialization: Given.Default(
      ["BaseSuite should initialize with correct name and index"],
      [],
      [
        Then.SuiteNameMatches("testSuite"),
        Then.SuiteIndexMatches(0),
        Then.FeaturesIncludes("testFeature"),
      ]
    ),

    // Test execution flow
    execution: Given.Default(
      ["BaseSuite should execute all phases successfully"],
      [When.RunSuite()],
      [Then.StoreValid(), Then.NoErrorsOccurred()]
    ),

    // Test multiple features
    multipleFeatures: Given.Default(
      ["BaseSuite should handle multiple features"],
      [When.AddFeature("additionalFeature")],
      [
        Then.FeaturesIncludes("testFeature"),
        Then.FeaturesIncludes("additionalFeature"),
        Then.FeatureCountMatches(2),
      ]
    ),

    // Test error handling
    errorHandling: Given.Default(
      ["BaseSuite should handle errors gracefully"],
      [When.RunSuiteWithError()],
      [
        Then.ErrorCountMatches(1),
        // Then.FailedFlagSet(),
      ]
    ),
  }),

  Suite.Default("Comprehensive Integration", {
    fullStackTest: Given.Default(
      ["All components should work together"],
      [
        When.addArtifact(Promise.resolve("test")),
        When.modifySpecs((specs) => [...specs, "extra"]),
        When.modifyJobs((jobs) => [...jobs, {}]),
      ],
      [
        Then.specsModified(1),
        Then.jobsModified(1),
        Then.artifactsTracked(),
        Then.testRunSuccessful(),
      ]
    ),
  }),
];

// 4. Enhanced Test Implementation with more operations
export const implementation: ITestImplementation<I, O> = {
  suites: {
    Default: "BaseSuite Comprehensive Test Suite" as const,
  },

  givens: {
    Default: (): MockSuite => new MockSuite("testSuite", 0),
  },

  whens: {
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
      (expectedName: string): ((suite: MockSuite) => MockSuite) =>
      (suite: MockSuite) => {
        if (suite.name !== expectedName) {
          throw new Error(
            `Expected suite name '${expectedName}', got '${suite.name}'`
          );
        }
        return suite;
      },

    SuiteIndexMatches:
      (expectedIndex: number): ((suite: MockSuite) => MockSuite) =>
      (suite: MockSuite) => {
        if (suite.index !== expectedIndex) {
          throw new Error(
            `Expected suite index ${expectedIndex}, got ${suite.index}`
          );
        }
        return suite;
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
  },
};

// 5. Fully typed Test Interface
export const testInterface: ITestInterface<I> = {
  beforeEach: async (
    subject: I["isubject"],
    initializer: (context?: any) => I["given"]
  ): Promise<I["istore"]> => initializer(),

  andWhen: async (
    store: I["istore"],
    whenCB: I["when"],
    testResource: ITTestResourceConfiguration,
    pm: IPM
  ): Promise<I["istore"]> => whenCB(store, pm),

  butThen: async (
    store: I["istore"],
    thenCB: I["then"],
    testResource: ITTestResourceConfiguration,
    pm: IPM
  ): Promise<I["iselection"]> => thenCB(store, pm),

  afterEach: (store: I["istore"]): I["istore"] => store,

  afterAll: (store: I["istore"], pm: IPM): void => {},

  assertThis: (result: I["then"] | undefined): boolean => !!result,

  beforeAll: async (
    input: I["iinput"],
    testResource: ITTestResourceConfiguration,
    pm: IPM
  ): Promise<I["isubject"]> => input as unknown as I["isubject"],
};
