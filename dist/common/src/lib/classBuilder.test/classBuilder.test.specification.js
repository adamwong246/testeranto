"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.specification = void 0;
const specification = (Suite, Given, When, Then, Check) => {
    return [
        Suite.Default("Basic ClassBuilder Functionality", {
            // Basic initialization tests
            initialization: Given.Default(["ClassBuilder should initialize with default values"], [], [Then.initializedProperly()]),
            customInput: Given.WithCustomInput({ custom: "input" }, [], [Then.initializedProperly()]),
            resourceRequirements: Given.WithResourceRequirements({ ports: [3000, 3001] }, [], [Then.resourceRequirementsSet()]),
            // Core functionality tests
            specGeneration: Given.Default(["Should generate specs from test specification"], [], [Then.specsGenerated()]),
            jobCreation: Given.Default(["Should create test jobs from specs"], [], [Then.jobsCreated()]),
            artifactTracking: Given.Default(["Should track artifacts"], [When.addArtifact(Promise.resolve("test"))], [Then.artifactsTracked()]),
            // Configuration tests
            overridesConfiguration: Given.Default(["Should properly configure all overrides"], [], [
                Then.suitesOverridesConfigured(),
                Then.givensOverridesConfigured(),
                Then.whensOverridesConfigured(),
                Then.thensOverridesConfigured(),
                Then.checksOverridesConfigured(),
            ]),
        }, []),
        Suite.ExtendedSuite("Advanced ClassBuilder Functionality", {
            // Custom implementations
            customImplementation: Given.WithCustomImplementation(implementation, [], [Then.specsGenerated(), Then.jobsCreated()]),
            customSpecification: Given.WithCustomSpecification(exports.specification, [], [Then.specsGenerated(), Then.jobsCreated()]),
            // Dynamic modification tests
            modifySpecs: Given.Default(["Should allow modifying specs"], [When.modifySpecs((specs) => [...specs, "extra"])], [Then.specsModified(1)]),
            modifyJobs: Given.Default(["Should allow modifying jobs"], [When.modifyJobs((jobs) => [...jobs, {}])], [Then.jobsModified(1)]),
            // Error handling
            errorHandling: Given.Default(["Should properly handle errors"], [When.triggerError("test error")], [Then.errorThrown("test error")]),
            // Full test run
            testRun: Given.Default(["Should complete a full test run successfully"], [], [Then.testRunSuccessful()]),
        }, [
            Check.ImplementationCheck((impl) => impl !== null),
            Check.SpecificationCheck((spec) => spec !== null),
        ]),
    ];
};
exports.specification = specification;
