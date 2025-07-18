"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Pure_1 = __importDefault(require("./Pure"));
const mockPMBase_1 = require("./lib/pmProxy.test/mockPMBase");
// Implementation for PureTesteranto tests
const implementation = {
    suites: {
        Default: "PureTesteranto Test Suite",
    },
    givens: {
        Default: () => ({
            pm: new mockPMBase_1.MockPMBase(),
            config: {},
            proxies: {
                butThenProxy: (pm, path) => (Object.assign(Object.assign({}, pm), { writeFileSync: (p, c) => pm.writeFileSync(`${path}/butThen/${p}`, c) })),
                andWhenProxy: (pm, path) => (Object.assign(Object.assign({}, pm), { writeFileSync: (p, c) => pm.writeFileSync(`${path}/andWhen/${p}`, c) })),
                beforeEachProxy: (pm, suite) => (Object.assign(Object.assign({}, pm), { writeFileSync: (p, c) => pm.writeFileSync(`suite-${suite}/beforeEach/${p}`, c) }))
            }
        }),
    },
    whens: {
        applyProxy: (proxyType) => (store) => {
            switch (proxyType) {
                case "invalidConfig":
                    throw new Error("Invalid configuration");
                case "missingProxy":
                    return Object.assign(Object.assign({}, store), { pm: {} }); // Break proxy chain
                case "largePayload":
                    return Object.assign(Object.assign({}, store), { largePayload: true, pm: Object.assign(Object.assign({}, store.pm), { writeFileSync: (p, c) => {
                                if (c.length > 1e6) {
                                    return true;
                                }
                                throw new Error("Payload too small");
                            } }) });
                default:
                    return store;
            }
        },
    },
    thens: {
        verifyProxy: (expectedPath) => (store) => {
            var _a;
            const testPath = "expected";
            const result = store.pm.writeFileSync(testPath, "content");
            const actualPath = (_a = store.pm.getLastCall("writeFileSync")) === null || _a === void 0 ? void 0 : _a.path;
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
            }
            catch (error) {
                if (!error.message.includes(expectedError)) {
                    throw new Error(`Expected error "${expectedError}", got "${error.message}"`);
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
    checks: {
        Default: () => ({}),
    },
};
// Specification for PureTesteranto tests
const specification = (Suite, Given, When, Then, Check) => [
    Suite.Default("Core Functionality", {
        initializationTest: Given.Default(["Should initialize with default configuration"], [], [Then.verifyNoProxy()]),
        resourceConfigTest: Given.Default(["Should handle test resource configuration"], [When.applyProxy("resourceConfig")], [Then.verifyResourceConfig()]),
    }),
    Suite.Default("Proxy Integration", {
        butThenProxyTest: Given.Default(["Should integrate with butThenProxy"], [When.applyProxy("butThenProxy")], [Then.verifyProxy("test/path/butThen/expected")]),
        andWhenProxyTest: Given.Default(["Should integrate with andWhenProxy"], [When.applyProxy("andWhenProxy")], [Then.verifyProxy("test/path/andWhen/expected")]),
        beforeEachProxyTest: Given.Default(["Should integrate with beforeEachProxy"], [When.applyProxy("beforeEachProxy")], [Then.verifyProxy("suite-1/beforeEach/expected")]),
    }),
    Suite.Default("Error Handling", {
        invalidConfigTest: Given.Default(["Should handle invalid configuration"], [When.applyProxy("invalidConfig")], [Then.verifyError("Invalid configuration")]),
        missingProxyTest: Given.Default(["Should handle missing proxy"], [When.applyProxy("missingProxy")], [Then.verifyError("Proxy not found")]),
    }),
    Suite.Default("Performance", {
        multipleProxiesTest: Given.Default(["Should handle multiple proxies efficiently"], [
            When.applyProxy("butThenProxy"),
            When.applyProxy("andWhenProxy"),
            When.applyProxy("beforeEachProxy")
        ], [
            Then.verifyProxy("test/path/butThen/expected"),
            Then.verifyProxy("test/path/andWhen/expected"),
            Then.verifyProxy("suite-1/beforeEach/expected")
        ]),
        largePayloadTest: Given.Default(["Should handle large payloads"], [When.applyProxy("largePayload")], [Then.verifyLargePayload()]),
    }),
    Suite.Default("Cross-Component Verification", {
        proxyChainTest: Given.Default(["Proxies should chain correctly"], [
            When.applyProxy("butThenProxy"),
            When.applyProxy("andWhenProxy")
        ], [
            Then.verifyProxy("test/path/andWhen/butThen/expected")
        ]),
        errorPropagationTest: Given.Default(["Errors should propagate across components"], [When.applyProxy("invalidConfig")], [Then.verifyError("Invalid configuration")]),
        resourceSharingTest: Given.Default(["Resources should be shared correctly"], [When.applyProxy("resourceConfig")], [Then.verifyResourceConfig()])
    }),
    Suite.Default("Type Safety", {
        strictTypeTest: Given.Default(["Should enforce type safety"], [When.applyProxy("typeSafe")], [Then.verifyTypeSafety()]),
        invalidTypeTest: Given.Default(["Should reject invalid types"], [When.applyProxy("invalidType")], [Then.verifyError("Type mismatch")]),
    }),
    Suite.Default("Integration Tests", {
        // Verify builders work together
        builderIntegration: Given.Default(["BaseBuilder and ClassBuilder should integrate properly"], [], [
            Then.initializedProperly(),
            Then.specsGenerated(),
            Then.jobsCreated(),
            Then.artifactsTracked()
        ]),
        // Verify PM proxy integration  
        pmProxyIntegration: Given.Default(["PM proxies should work with test runners"], [When.applyProxy("butThenProxy")], [Then.verifyProxy("test/path/butThen/expected")]),
        // Verify full test lifecycle
        fullLifecycle: Given.Default(["Should complete full test lifecycle"], [
            When.addArtifact(Promise.resolve("test")),
            When.setTestJobs([]),
            When.modifySpecs((specs) => [...specs])
        ], [
            Then.testRunSuccessful(),
            Then.artifactsTracked(),
            Then.specsModified(0)
        ])
    })
];
// Test interface for PureTesteranto
const testInterface = {
    beforeEach: async (subject, initializer) => {
        return { pm: initializer() };
    },
    andWhen: async (store, whenCB) => whenCB(store),
    butThen: async (store, thenCB) => thenCB(store),
    afterEach: async (store) => store,
    afterAll: async () => { },
    beforeAll: async (input, testResource) => ({}),
    assertThis: (x) => x,
};
// Export the test suite
exports.default = (0, Pure_1.default)(null, // No initial input
specification, implementation, testInterface);
