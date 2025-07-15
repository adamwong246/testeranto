import Testeranto from "../Node";

import { BaseSuite } from "./BaseSuite";
import { BaseGiven, BaseWhen, BaseThen, BaseCheck } from "./abstractBase";
import { ITTestResourceConfiguration, ITestArtifactory, ITLog } from ".";
import { IPM, ITestCheckCallback } from "./types";
import {
  Ibdd_in,
  Ibdd_out,
  ITestSpecification,
  ITestImplementation,
  ITestInterface,
} from "../CoreTypes";
import { WhenSpecification } from "../Types";

// 1. Define our test types with full type safety
type TestStore = {
  testStore: boolean;
  testSelection?: boolean;
  error?: Error;
};

type TestSelection = {
  testSelection: boolean;
  error?: boolean;
};

type I = Ibdd_in<
  null, // iinput
  BaseSuite<any, any>, // isubject
  TestStore, // istore
  TestSelection, // iselection
  () => Promise<TestStore>, // given
  (store: TestStore) => Promise<TestStore>, // when
  (store: TestStore) => Promise<TestSelection> // then
>;

type O = Ibdd_out<
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
  },
  {
    TestCheck: []; // Check validations
  }
>;

// 2. Mock implementations with proper typing
class MockGiven extends BaseGiven<I> {
  constructor(
    name: string,
    features: string[],
    whens: BaseWhen<I>[],
    thens: BaseThen<I>[]
  ) {
    super(
      name,
      features,
      whens,
      thens,
      async () => ({ testStore: true }), // givenCB
      {} // initialValues
    );
  }

  async givenThat(
    subject: I["isubject"],
    testResourceConfiguration: ITTestResourceConfiguration,
    artifactory: ITestArtifactory,
    givenCB: I["given"],
    initialValues: any,
    pm: IPM
  ): Promise<TestStore> {
    return { testStore: true };
  }

  uberCatcher(e: Error): void {
    console.error("Given error:", e);
  }
}

class MockWhen extends BaseWhen<I> {
  async andWhen(
    store: TestStore,
    whenCB: (x: TestSelection) => Promise<TestStore>,
    testResource: ITTestResourceConfiguration,
    pm: IPM
  ): Promise<TestStore> {
    return { ...store, testStore: true };
  }
}

class MockThen extends BaseThen<I> {
  async butThen(
    store: TestStore,
    thenCB: (s: TestSelection) => Promise<TestSelection>,
    testResourceConfiguration: ITTestResourceConfiguration,
    pm: IPM
  ): Promise<TestSelection> {
    return { testSelection: true };
  }
}

class MockCheck extends BaseCheck<I> {
  async checkThat(
    subject: I["isubject"],
    testResourceConfiguration: ITTestResourceConfiguration,
    artifactory: ITestArtifactory,
    initializer: any,
    initialValues: any,
    pm: IPM
  ): Promise<TestStore> {
    return { testStore: true };
  }
}

class TestableSuite extends BaseSuite<I, O> {
  constructor(name: string, index: number) {
    super(
      name,
      index,
      {
        testGiven: new MockGiven(
          "testGiven",
          ["testFeature"],
          [
            new MockWhen("testWhen", () =>
              Promise.resolve({ testStore: true })
            ),
          ],
          [
            new MockThen("testThen", async () =>
              Promise.resolve({ testSelection: true })
            ),
          ]
        ),
      },
      [
        new MockCheck(
          "testCheck",
          ["testFeature"],
          () => Promise.resolve({ testStore: true }),
          null,
          () => {}
        ),
      ]
    );
  }
}

// 3. Enhanced Test Specification with more test cases
const specification: ITestSpecification<I, O> = (
  Suite: ITestSpecification<I, O>,
  Given: WhenSpecification<I, O>,
  When: WhenSpecification<I, O>,
  Then: WhenSpecification<I, O>,
  Check: ITestCheckCallback<I, O>
) => [
  Suite.Default(
    "BaseSuite Core Functionality Tests",
    {
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
        [Then.StoreValid(), Then.NoErrorsOccurred(), Then.AllChecksCompleted()]
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
    },
    [
      // Additional validation checks
      // Check.Default(
      //   ["Verify suite state after all tests"],
      //   [],
      //   [
      //     Then.AllTestsCompleted(),
      //     Then.CleanExit()
      //   ]
      // )
    ]
  ),
];

// 4. Enhanced Test Implementation with more operations
const implementation: ITestImplementation<I, O> = {
  suites: {
    Default: "BaseSuite Comprehensive Test Suite" as const,
  },

  givens: {
    Default: (): TestableSuite => new TestableSuite("testSuite", 0),
  },

  whens: {
    RunSuite:
      (): ((suite: TestableSuite) => Promise<TestableSuite>) =>
      async (suite: TestableSuite) => {
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
      (): ((suite: TestableSuite) => Promise<TestableSuite>) =>
      async (suite: TestableSuite) => {
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
      (feature: string): ((suite: TestableSuite) => TestableSuite) =>
      (suite: TestableSuite) => {
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
      (expectedName: string): ((suite: TestableSuite) => TestableSuite) =>
      (suite: TestableSuite) => {
        if (suite.name !== expectedName) {
          throw new Error(
            `Expected suite name '${expectedName}', got '${suite.name}'`
          );
        }
        return suite;
      },

    SuiteIndexMatches:
      (expectedIndex: number): ((suite: TestableSuite) => TestableSuite) =>
      (suite: TestableSuite) => {
        if (suite.index !== expectedIndex) {
          throw new Error(
            `Expected suite index ${expectedIndex}, got ${suite.index}`
          );
        }
        return suite;
      },

    FeaturesIncludes:
      (feature: string): ((suite: TestableSuite) => TestableSuite) =>
      (suite: TestableSuite) => {
        if (!suite.features().includes(feature)) {
          throw new Error(`Expected features to include ${feature}`);
        }
        return suite;
      },

    FeatureCountMatches:
      (expectedCount: number): ((suite: TestableSuite) => TestableSuite) =>
      (suite: TestableSuite) => {
        const actualCount = suite.features().length;
        if (actualCount !== expectedCount) {
          throw new Error(
            `Expected ${expectedCount} features, got ${actualCount}`
          );
        }
        return suite;
      },

    StoreValid:
      (): ((suite: TestableSuite) => TestableSuite) =>
      (suite: TestableSuite) => {
        if (!suite.store?.testStore) {
          throw new Error("Expected valid store after execution");
        }
        return suite;
      },

    NoErrorsOccurred:
      (): ((suite: TestableSuite) => TestableSuite) =>
      (suite: TestableSuite) => {
        if (suite.failed || suite.fails > 0) {
          throw new Error("Expected no errors to occur during execution");
        }
        return suite;
      },

    ErrorCountMatches:
      (expectedCount: number): ((suite: TestableSuite) => TestableSuite) =>
      (suite: TestableSuite) => {
        if (suite.fails !== expectedCount) {
          throw new Error(
            `Expected ${expectedCount} errors, got ${suite.fails}`
          );
        }
        return suite;
      },

    FailedFlagSet:
      (): ((suite: TestableSuite) => TestableSuite) =>
      (suite: TestableSuite) => {
        if (!suite.failed) {
          throw new Error("Expected failed flag to be set after error");
        }
        return suite;
      },

    AllChecksCompleted:
      (): ((suite: TestableSuite) => TestableSuite) =>
      (suite: TestableSuite) => {
        if (suite.checks.some((check) => !check.key)) {
          throw new Error("Expected all checks to be completed");
        }
        return suite;
      },

    AllTestsCompleted:
      (): ((suite: TestableSuite) => TestableSuite) =>
      (suite: TestableSuite) => {
        if (!suite.store) {
          throw new Error("Expected all tests to be completed");
        }
        return suite;
      },

    CleanExit:
      (): ((suite: TestableSuite) => TestableSuite) =>
      (suite: TestableSuite) => {
        if (suite.failed && suite.fails === 0) {
          throw new Error("Expected clean exit state");
        }
        return suite;
      },
  },

  checks: {
    Default: (): TestableSuite => new TestableSuite("testCheck", 1),
  },
};

// 5. Fully typed Test Interface
const testInterface: ITestInterface<I> = {
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

// 6. Run the tests
export default Testeranto<I, O, {}>(
  BaseSuite.prototype,
  specification,
  implementation,
  testInterface
);
