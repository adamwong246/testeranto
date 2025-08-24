"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.implementation = void 0;
const MockTiposkripto_1 = require("./MockTiposkripto");
const Tiposkripto_specification_1 = require("./Tiposkripto.specification");
const Tiposkripto_adapter_1 = require("./Tiposkripto.adapter");
exports.implementation = {
    suites: {
        Default: "Tiposkripto test suite",
        ExtendedSuite: "Extended Tiposkripto test suite",
    },
    givens: {
        Default: () => {
            console.log("Creating default test builder instance");
            // Use a function to defer the implementation reference
            const createBuilder = (impl) => {
                return new MockTiposkripto_1.MockTiposkripto({}, // input
                Tiposkripto_specification_1.specification, // Use the current specification
                impl, // Use the passed implementation
                { ports: [] }, // Default resource requirements
                Tiposkripto_adapter_1.testAdapter, // Default adapter
                (cb) => cb() // Default uberCatcher
                );
            };
            const builder = createBuilder(exports.implementation);
            console.log("Builder created:", builder);
            return builder;
        },
        WithCustomInput: (input) => {
            return new MockTiposkripto_1.MockTiposkripto(input, Tiposkripto_specification_1.specification, exports.implementation, { ports: [] }, Tiposkripto_adapter_1.testAdapter, (cb) => cb());
        },
        WithResourceRequirements: (requirements) => {
            return new MockTiposkripto_1.MockTiposkripto({}, Tiposkripto_specification_1.specification, exports.implementation, requirements, Tiposkripto_adapter_1.testAdapter, (cb) => cb());
        },
        WithCustomImplementation: (impl) => {
            return new MockTiposkripto_1.MockTiposkripto({}, Tiposkripto_specification_1.specification, impl, { ports: [] }, Tiposkripto_adapter_1.testAdapter, (cb) => cb());
        },
        WithCustomSpecification: (spec) => {
            return new MockTiposkripto_1.MockTiposkripto({}, spec, exports.implementation, { ports: [] }, Tiposkripto_adapter_1.testAdapter, (cb) => cb());
        },
        WithCustomAdapter: (customAdapter) => {
            return new MockTiposkripto_1.MockTiposkripto({}, Tiposkripto_specification_1.specification, exports.implementation, { ports: [] }, Object.assign(Object.assign({}, Tiposkripto_adapter_1.testAdapter), customAdapter), (cb) => cb());
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
    },
    thens: {
        "it is initialized": () => (builder, utils) => {
            var _a;
            utils.writeFileSync("hello.txt", "world");
            if (!builder) {
                throw new Error("Builder is undefined");
            }
            if (!(builder instanceof MockTiposkripto_1.MockTiposkripto)) {
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
            try {
                await builder.receiveTestResourceConfig("");
                return builder;
            }
            catch (e) {
                throw new Error(`Test run failed: ${e.message}`);
            }
        },
    },
};
