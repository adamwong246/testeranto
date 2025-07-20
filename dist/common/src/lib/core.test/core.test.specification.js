"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.specification = void 0;
const specification = (Suite, Given, When, Then) => {
    return [
        Suite.Default("Testeranto Core Functionality", {
            // Initialization tests
            defaultInitialization: Given.Default(["Should initialize with default values"], [], [Then.initializedProperly()]),
            customInputInitialization: Given.WithCustomInput({ test: "input" }, [], [Then.initializedProperly()]),
            // Configuration tests
            resourceConfig: Given.WithResourceRequirements({ ports: [3000, 3001] }, [], [Then.resourceRequirementsSet()]),
            interfaceConfig: Given.WithCustomAdapter({
                assertThis: (x) => !!x,
                beforeEach: async (s, i) => i(),
            }, [], [Then.interfaceConfigured()]),
            // Core operations
            specGeneration: Given.Default(["Should generate test specs"], [], [Then.specsGenerated()]),
            jobCreation: Given.Default(["Should create test jobs"], [], [Then.jobsCreated()]),
            artifactHandling: Given.Default(["Should track artifacts"], [When.addArtifact(Promise.resolve("test"))], [Then.artifactsTracked()]),
        }, []),
        Suite.ExtendedSuite("Testeranto Advanced Features", {
            // Error handling
            errorPropagation: Given.Default(["Should propagate errors properly"], [When.triggerError("test error")], [Then.errorThrown("test error")]),
            // Dynamic behavior
            specModification: Given.Default(["Should allow spec modification"], [When.modifySpecs((specs) => [...specs, { name: "extra" }])], [Then.specsModified(1)]),
            // Full lifecycle
            testExecution: Given.Default(["Should execute full test lifecycle"], [], [Then.testRunSuccessful()]),
            // Custom implementations
            customImpl: Given.WithCustomImplementation(Object.assign(Object.assign({}, implementation), { suites: { Default: "Custom suite" } }), [], [Then.specsGenerated()]),
        }),
    ];
};
exports.specification = specification;
