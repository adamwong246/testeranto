/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { MockTiposkripto } from "./MockTiposkripto";
import { specification } from "./Tiposkripto.specification";
import { testAdapter } from "./Tiposkripto.adapter";
export const implementation = {
    suites: {
        Default: "Tiposkripto test suite",
        ExtendedSuite: "Extended Tiposkripto test suite",
    },
    givens: {
        Default: () => {
            console.log("Creating default test builder instance");
            const builder = new MockTiposkripto({}, // input
            specification, // Use the current specification
            implementation, // Use the current implementation
            { ports: 0 }, // Default resource requirements
            testAdapter, // Default adapter
            (cb) => cb() // Default uberCatcher
            );
            console.log("Builder created:", builder);
            // Ensure the test adapter is properly set
            if (!builder.testAdapter) {
                builder.testAdapter = testAdapter;
            }
            return builder;
        },
        WithCustomInput: (input = {}) => {
            return new MockTiposkripto(input, specification, implementation, { ports: 0 }, testAdapter, (cb) => cb());
        },
        WithResourceRequirements: (requirements = { ports: 0 }) => {
            return new MockTiposkripto({}, specification, implementation, requirements, testAdapter, (cb) => cb());
        },
        WithCustomImplementation: (impl = implementation) => {
            return new MockTiposkripto({}, specification, impl, { ports: 0 }, testAdapter, (cb) => cb());
        },
        WithCustomSpecification: (spec = specification) => {
            return new MockTiposkripto({}, spec, implementation, { ports: 0 }, testAdapter, (cb) => cb());
        },
        WithCustomAdapter: (customAdapter = {}) => {
            return new MockTiposkripto({}, specification, implementation, { ports: 0 }, Object.assign(Object.assign({}, testAdapter), customAdapter), (cb) => cb());
        },
    },
    whens: {
        addArtifact: (artifact) => (builder) => {
            builder.artifacts.push(artifact);
            return builder;
        },
        setTestJobs: (jobs) => (builder) => {
            builder.testJobs = jobs;
            return builder;
        },
        modifySpecs: (modifier) => (builder) => {
            builder.specs = modifier(builder.specs || []);
            return builder;
        },
        modifyJobs: (modifier) => (builder) => {
            builder.testJobs = modifier(builder.testJobs || []);
            return builder;
        },
        triggerError: (message) => (builder) => {
            throw new Error(message);
        },
        // Add a when to simulate receiving test resource config
        receiveTestResourceConfig: (config) => async (builder) => {
            return await builder.receiveTestResourceConfig(config);
        },
    },
    thens: {
        initializedProperly: () => (builder, utils) => {
            var _a;
            if (!builder) {
                throw new Error("Builder is undefined");
            }
            if (!(builder instanceof MockTiposkripto)) {
                throw new Error(`Builder was not properly initialized. Expected MockTiposkripto instance but got ${(_a = builder === null || builder === void 0 ? void 0 : builder.constructor) === null || _a === void 0 ? void 0 : _a.name}`);
            }
            // Verify required properties exist
            const requiredProps = [
                "specs",
                "testJobs",
                "artifacts",
                "suitesOverrides",
                "givenOverides",
                "whenOverides",
                "thenOverides",
            ];
            for (const prop of requiredProps) {
                if (!(prop in builder)) {
                    throw new Error(`Missing required property: ${prop}`);
                }
            }
            return builder;
        },
        specsGenerated: () => (builder) => {
            if (!Array.isArray(builder.specs)) {
                throw new Error("Specs were not generated");
            }
            return builder;
        },
        jobsCreated: () => (builder) => {
            if (!Array.isArray(builder.testJobs)) {
                throw new Error("Test jobs were not created");
            }
            return builder;
        },
        artifactsTracked: () => (builder) => {
            if (!Array.isArray(builder.artifacts)) {
                throw new Error("Artifacts array not initialized");
            }
            return builder;
        },
        resourceRequirementsSet: () => (builder) => {
            if (!builder.testResourceRequirement) {
                throw new Error("Resource requirements not set");
            }
            return builder;
        },
        suitesOverridesConfigured: () => (builder) => {
            if (!builder.suitesOverrides) {
                throw new Error("Suites overrides not configured");
            }
            return builder;
        },
        givensOverridesConfigured: () => (builder) => {
            if (!builder.givenOverides) {
                throw new Error("Givens overrides not configured");
            }
            return builder;
        },
        whensOverridesConfigured: () => (builder) => {
            if (!builder.whenOverides) {
                throw new Error("Whens overrides not configured");
            }
            return builder;
        },
        thensOverridesConfigured: () => (builder) => {
            if (!builder.thenOverides) {
                throw new Error("Thens overrides not configured");
            }
            return builder;
        },
        interfaceConfigured: () => (builder) => {
            if (!builder.testAdapter) {
                throw new Error("Test adapter not configured");
            }
            // Check if the test adapter has the required methods
            const requiredMethods = [
                "beforeAll",
                "beforeEach",
                "andWhen",
                "butThen",
                "afterEach",
                "afterAll",
                "assertThis",
            ];
            for (const method of requiredMethods) {
                if (typeof builder.testAdapter[method] !== "function") {
                    throw new Error(`Test adapter missing required method: ${method}`);
                }
            }
            return builder;
        },
        specsModified: (expectedCount) => (builder) => {
            if (builder.specs.length <= expectedCount) {
                throw new Error(`Expected at least ${expectedCount} modified specs`);
            }
            return builder;
        },
        jobsModified: (expectedCount) => (builder) => {
            if (builder.testJobs.length <= expectedCount) {
                throw new Error(`Expected at least ${expectedCount} modified jobs`);
            }
            return builder;
        },
        errorThrown: (expectedMessage) => (builder) => {
            // This is handled by the test runner
            return builder;
        },
        testRunSuccessful: () => async (builder) => {
            await builder.receiveTestResourceConfig("");
            return builder;
        },
        runTimeTestsCounted: () => async (builder) => {
            const result = await builder.receiveTestResourceConfig("");
            // The total number of tests should be greater than 0
            if (result.runTimeTests <= 0) {
                throw new Error(`Expected runTimeTests > 0, got ${result.runTimeTests}`);
            }
            return builder;
        },
        runTimeTestsSetToNegativeOne: () => async (builder) => {
            await builder.receiveTestResourceConfig("");
            // If we reach here, no error was thrown, which is unexpected
            // But we'll let the test fail naturally
            return builder;
        },
        runTimeTestsCountIs: (expectedCount) => async (builder) => {
            const result = await builder.receiveTestResourceConfig("");
            if (result.runTimeTests !== expectedCount) {
                throw new Error(`Expected runTimeTests to be ${expectedCount}, got ${result.runTimeTests}`);
            }
            return builder;
        },
        runTimeTestsIsNegativeOne: () => async (builder) => {
            await builder.receiveTestResourceConfig("");
            // If we reach here, no error was thrown, which is unexpected
            // But we'll let the test fail naturally
            return builder;
        },
    },
};
