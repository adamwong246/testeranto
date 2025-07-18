import { createRequire } from 'module';const require = createRequire(import.meta.url);
import {
  BaseCheck,
  BaseGiven,
  BaseSuite,
  BaseThen,
  BaseWhen,
  Pure_default
} from "../../../chunk-W22WOQNK.mjs";

// src/lib/BaseSuite.test/test.ts
var MockGiven = class extends BaseGiven {
  constructor(name, features, whens, thens) {
    super(
      name,
      features,
      whens,
      thens,
      async () => ({ testStore: true }),
      // givenCB
      {}
      // initialValues
    );
  }
  async givenThat(subject, testResourceConfiguration, artifactory, givenCB, initialValues, pm) {
    return { testStore: true };
  }
  uberCatcher(e) {
    console.error("Given error 2:", e);
  }
};
var MockWhen = class extends BaseWhen {
  async andWhen(store, whenCB, testResource, pm) {
    return { ...store, testStore: true };
  }
};
var MockThen = class extends BaseThen {
  async butThen(store, thenCB, testResourceConfiguration, pm) {
    return { testSelection: true };
  }
};
var MockCheck = class extends BaseCheck {
  async checkThat(subject, testResourceConfiguration, artifactory, initializer, initialValues, pm) {
    return { testStore: true };
  }
};
var TestableSuite = class extends BaseSuite {
  constructor(name, index) {
    super(
      name,
      index,
      {
        testGiven: new MockGiven(
          "testGiven",
          ["testFeature"],
          [
            new MockWhen(
              "testWhen",
              () => Promise.resolve({ testStore: true })
            )
          ],
          [
            new MockThen(
              "testThen",
              async () => Promise.resolve({ testSelection: true })
            )
          ]
        )
      },
      [
        new MockCheck(
          "testCheck",
          ["testFeature"],
          () => Promise.resolve({ testStore: true }),
          null,
          () => {
          }
        )
      ]
    );
  }
};
var specification = (Suite, Given, When, Then, Check) => [
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
          Then.FeaturesIncludes("testFeature")
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
          Then.FeatureCountMatches(2)
        ]
      ),
      // Test error handling
      errorHandling: Given.Default(
        ["BaseSuite should handle errors gracefully"],
        [When.RunSuiteWithError()],
        [
          Then.ErrorCountMatches(1)
          // Then.FailedFlagSet(),
        ]
      )
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
  Suite.Default("Comprehensive Integration", {
    fullStackTest: Given.Default(
      ["All components should work together"],
      [
        When.addArtifact(Promise.resolve("test")),
        When.modifySpecs((specs) => [...specs, "extra"]),
        When.modifyJobs((jobs) => [...jobs, {}])
      ],
      [
        Then.specsModified(1),
        Then.jobsModified(1),
        Then.artifactsTracked(),
        Then.testRunSuccessful()
      ]
    )
  })
];
var implementation = {
  suites: {
    Default: "BaseSuite Comprehensive Test Suite"
  },
  givens: {
    Default: () => new TestableSuite("testSuite", 0)
  },
  whens: {
    RunSuite: () => async (suite) => {
      const mockConfig = {
        name: "test",
        fs: "/tmp",
        ports: [3e3],
        environment: {},
        timeout: 5e3,
        retries: 3
      };
      const mockArtifactory = (key, value) => {
      };
      const mockTLog = (...args) => {
      };
      const mockPM = {
        server: null,
        testResourceConfiguration: mockConfig,
        start: async () => {
        },
        stop: async () => {
        },
        testArtiFactoryfileWriter: () => {
        },
        $: () => {
        },
        click: () => {
        },
        closePage: () => {
        },
        createWriteStream: async () => ""
      };
      return await suite.run(
        null,
        mockConfig,
        mockArtifactory,
        mockTLog,
        mockPM
      );
    },
    RunSuiteWithError: () => async (suite) => {
      try {
        await suite.run(
          null,
          {},
          // Invalid config
          () => {
          },
          () => {
          },
          {}
        );
      } catch (e) {
      }
      return suite;
    },
    AddFeature: (feature) => (suite) => {
      const firstGivenKey = Object.keys(suite.givens)[0];
      if (firstGivenKey) {
        suite.givens[firstGivenKey].features.push(feature);
      }
      return suite;
    }
  },
  thens: {
    SuiteNameMatches: (expectedName) => (suite) => {
      if (suite.name !== expectedName) {
        throw new Error(
          `Expected suite name '${expectedName}', got '${suite.name}'`
        );
      }
      return suite;
    },
    SuiteIndexMatches: (expectedIndex) => (suite) => {
      if (suite.index !== expectedIndex) {
        throw new Error(
          `Expected suite index ${expectedIndex}, got ${suite.index}`
        );
      }
      return suite;
    },
    FeaturesIncludes: (feature) => (suite) => {
      if (!suite.features().includes(feature)) {
        throw new Error(`Expected features to include ${feature}`);
      }
      return suite;
    },
    FeatureCountMatches: (expectedCount) => (suite) => {
      const actualCount = suite.features().length;
      if (actualCount !== expectedCount) {
        throw new Error(
          `Expected ${expectedCount} features, got ${actualCount}`
        );
      }
      return suite;
    },
    StoreValid: () => (suite) => {
      if (!suite.store?.testStore) {
        throw new Error("Expected valid store after execution");
      }
      return suite;
    },
    NoErrorsOccurred: () => (suite) => {
      if (suite.failed || suite.fails > 0) {
        throw new Error("Expected no errors to occur during execution");
      }
      return suite;
    },
    ErrorCountMatches: (expectedCount) => (suite) => {
      if (suite.fails !== expectedCount) {
        throw new Error(
          `Expected ${expectedCount} errors, got ${suite.fails}`
        );
      }
      return suite;
    },
    FailedFlagSet: () => (suite) => {
      if (!suite.failed) {
        throw new Error("Expected failed flag to be set after error");
      }
      return suite;
    },
    AllChecksCompleted: () => (suite) => {
      if (suite.checks.some((check) => !check.key)) {
        throw new Error("Expected all checks to be completed");
      }
      return suite;
    },
    AllTestsCompleted: () => (suite) => {
      if (!suite.store) {
        throw new Error("Expected all tests to be completed");
      }
      return suite;
    },
    CleanExit: () => (suite) => {
      if (suite.failed && suite.fails === 0) {
        throw new Error("Expected clean exit state");
      }
      return suite;
    }
  },
  checks: {
    Default: () => new TestableSuite("testCheck", 1)
  }
};
var testInterface = {
  beforeEach: async (subject, initializer) => initializer(),
  andWhen: async (store, whenCB, testResource, pm) => whenCB(store, pm),
  butThen: async (store, thenCB, testResource, pm) => thenCB(store, pm),
  afterEach: (store) => store,
  afterAll: (store, pm) => {
  },
  assertThis: (result) => !!result,
  beforeAll: async (input, testResource, pm) => input
};

// src/lib/BaseSuite.test/pure.test.ts
var pure_test_default = Pure_default(
  BaseSuite,
  specification,
  implementation,
  testInterface
);
export {
  pure_test_default as default
};
