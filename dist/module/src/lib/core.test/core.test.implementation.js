import { MockCore } from "./MockCore";
export const implementation = {
    suites: {
        Default: "Testeranto test suite",
        ExtendedSuite: "Extended Testeranto test suite",
    },
    givens: {
        Default: () => {
            return new MockCore({}, // input
            specification, // testSpecification
            implementation, // testImplementation
            { ports: [] }, // testResourceRequirement
            testAdapter, // testAdapter
            (cb) => cb() // uberCatcher
            );
        },
        WithCustomInput: (input) => {
            return new MockCore(input, specification, implementation, { ports: [] }, testAdapter, (cb) => cb());
        },
        WithResourceRequirements: (requirements) => {
            return new MockCore({}, specification, implementation, requirements, testAdapter, (cb) => cb());
        },
        WithCustomAdapter: (customAdapter) => {
            return new MockCore({}, specification, implementation, { ports: [] }, Object.assign(Object.assign({}, testAdapter), customAdapter), (cb) => cb());
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
        triggerError: (message) => (builder) => {
            throw new Error(message);
        },
    },
    thens: {
        initializedProperly: () => (builder) => {
            if (!(builder instanceof MockCore)) {
                throw new Error("Builder was not properly initialized");
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
        interfaceConfigured: () => (builder) => {
            if (!builder.testAdapter) {
                throw new Error("Test adapter not configured");
            }
            return builder;
        },
        errorThrown: (expectedMessage) => (builder) => {
            // Handled by test runner
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
