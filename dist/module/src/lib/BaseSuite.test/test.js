import { MockSuite } from "./mock";
// 3. Enhanced Test Specification with more test cases
export const specification = (Suite, Given, When, Then) => [
    Suite.Default("BaseSuite Core Functionality Tests", {
        // Test initialization and basic properties
        initialization: Given.Default(["BaseSuite should initialize with correct name and index"], [], [
            Then.SuiteNameMatches("testSuite"),
            Then.SuiteIndexMatches(0),
            Then.FeaturesIncludes("testFeature"),
        ]),
        // Test execution flow
        execution: Given.Default(["BaseSuite should execute all phases successfully"], [When.RunSuite()], [Then.StoreValid(), Then.NoErrorsOccurred()]),
        // Test multiple features
        multipleFeatures: Given.Default(["BaseSuite should handle multiple features"], [When.AddFeature("additionalFeature")], [
            Then.FeaturesIncludes("testFeature"),
            Then.FeaturesIncludes("additionalFeature"),
            Then.FeatureCountMatches(2),
        ]),
        // Test error handling
        errorHandling: Given.Default(["BaseSuite should handle errors gracefully"], [When.RunSuiteWithError()], [
            Then.ErrorCountMatches(1),
            // Then.FailedFlagSet(),
        ]),
    }),
    Suite.Default("Comprehensive Integration", {
        fullStackTest: Given.Default(["All components should work together"], [
            When.addArtifact(Promise.resolve("test")),
            When.modifySpecs((specs) => [...specs, "extra"]),
            When.modifyJobs((jobs) => [...jobs, {}]),
        ], [
            Then.specsModified(1),
            Then.jobsModified(1),
            Then.artifactsTracked(),
            Then.testRunSuccessful(),
        ]),
    }),
];
// 4. Enhanced Test Implementation with more operations
export const implementation = {
    suites: {
        Default: "BaseSuite Comprehensive Test Suite",
    },
    givens: {
        Default: () => new MockSuite("testSuite", 0),
    },
    whens: {
        RunSuite: () => async (suite) => {
            const mockConfig = {
                name: "test",
                fs: "/tmp",
                ports: [3000],
                environment: {},
                timeout: 5000,
                retries: 3,
            };
            const mockArtifactory = (key, value) => { };
            const mockTLog = (...args) => { };
            const mockPM = {
                server: null,
                testResourceConfiguration: mockConfig,
                start: async () => { },
                stop: async () => { },
                testArtiFactoryfileWriter: () => { },
                $: () => { },
                click: () => { },
                closePage: () => { },
                createWriteStream: async () => "",
            };
            return await suite.run(null, mockConfig, mockArtifactory, mockTLog, mockPM);
        },
        RunSuiteWithError: () => async (suite) => {
            // Force an error by passing invalid config
            try {
                await suite.run(null, {}, // Invalid config
                () => { }, () => { }, {});
            }
            catch (e) {
                // Error is caught and counted by BaseSuite
            }
            return suite;
        },
        AddFeature: (feature) => (suite) => {
            // Add a feature to the first given
            const firstGivenKey = Object.keys(suite.givens)[0];
            if (firstGivenKey) {
                suite.givens[firstGivenKey].features.push(feature);
            }
            return suite;
        },
    },
    thens: {
        SuiteNameMatches: (expectedName) => (suite) => {
            if (suite.name !== expectedName) {
                throw new Error(`Expected suite name '${expectedName}', got '${suite.name}'`);
            }
            return suite;
        },
        SuiteIndexMatches: (expectedIndex) => (suite) => {
            if (suite.index !== expectedIndex) {
                throw new Error(`Expected suite index ${expectedIndex}, got ${suite.index}`);
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
                throw new Error(`Expected ${expectedCount} features, got ${actualCount}`);
            }
            return suite;
        },
        StoreValid: () => (suite) => {
            var _a;
            if (!((_a = suite.store) === null || _a === void 0 ? void 0 : _a.testStore)) {
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
                throw new Error(`Expected ${expectedCount} errors, got ${suite.fails}`);
            }
            return suite;
        },
        FailedFlagSet: () => (suite) => {
            if (!suite.failed) {
                throw new Error("Expected failed flag to be set after error");
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
        },
    },
};
// 5. Fully typed Test Interface
export const testInterface = {
    beforeEach: async (subject, initializer) => initializer(),
    andWhen: async (store, whenCB, testResource, pm) => whenCB(store, pm),
    butThen: async (store, thenCB, testResource, pm) => thenCB(store, pm),
    afterEach: (store) => store,
    afterAll: (store, pm) => { },
    assertThis: (result) => !!result,
    beforeAll: async (input, testResource, pm) => input,
};
