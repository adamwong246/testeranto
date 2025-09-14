"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.specification = void 0;
const specification = (Suite, Given, When, Then) => {
    return [
        Suite.Default("Tiposkripto Core Functionality", {
            // Basic initialization tests
            initialization: Given.Default(["Tiposkripto should initialize with default values"], [], [Then.initializedProperly()]),
            customInput: Given.WithCustomInput(["Custom input test"], [], [Then.initializedProperly()]),
            resourceRequirements: Given.WithResourceRequirements(["Resource requirements test"], [], [Then.resourceRequirementsSet()]),
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
            ]),
            interfaceConfiguration: Given.WithCustomAdapter(["Interface configuration test"], [], [Then.interfaceConfigured()], {
                assertThis: (x) => !!x,
                beforeEach: async (s, i) => i(),
            }),
        }),
        Suite.ExtendedSuite("Tiposkripto Advanced Features", {
            // Custom implementations
            customImplementation: Given.WithCustomImplementation(["Custom implementation test"], [], [Then.specsGenerated(), Then.jobsCreated()]),
            customSpecification: Given.WithCustomSpecification(["Custom specification test"], [], [Then.specsGenerated(), Then.jobsCreated()]),
            // Dynamic modification tests
            specModification: Given.Default(["Should allow modifying specs"], [When.modifySpecs((specs) => [...specs, "extra"])], [Then.specsModified(1)]),
            jobModification: Given.Default(["Should allow modifying jobs"], [When.modifyJobs((jobs) => [...jobs, {}])], [Then.jobsModified(1)]),
            // Error handling
            errorHandling: Given.Default(["Should properly handle errors"], [When.triggerError("test error")], [Then.errorThrown("test error")]),
            // Full test run
            fullTestRun: Given.Default(["Should complete a full test run successfully"], [], [Then.testRunSuccessful()]),
            // runTimeTests behavior
            runTimeTestsCount: Given.Default(["Should correctly count the number of tests"], [], [Then.runTimeTestsCounted()]),
            runTimeTestsOnError: Given.Default(["Should set runTimeTests to -1 on hard errors"], [When.triggerError("test error")], [Then.runTimeTestsSetToNegativeOne()]),
            // Specific test cases for runTimeTests behavior
            runTimeTestsSingleSuiteFiveTests: Given.WithCustomInput(["Given a config that has 1 suite containing 5 GivenWhenThens"], [], [Then.runTimeTestsCountIs(5)], { testCount: 5 }),
            runTimeTestsSingleSuiteFiveTestsError: Given.WithCustomInput(["Given a config that has 1 suite containing 5 GivenWhenThens"], [When.triggerError("hard error")], [Then.runTimeTestsIsNegativeOne()], { testCount: 5 }),
            runTimeTestsTwoSuitesThreeTestsEach: Given.WithCustomInput([
                "Given a config that has 1 suite containing 3 GivenWhenThens and 1 suite containing 3 GivenWhenThens",
            ], [], [Then.runTimeTestsCountIs(6)], { testCount: 6 }),
            runTimeTestsTwoSuitesThreeTestsEachError: Given.WithCustomInput([
                "Given a config that has 1 suite containing 3 GivenWhenThens and 1 suite containing 3 GivenWhenThens",
            ], [When.triggerError("hard error")], [Then.runTimeTestsIsNegativeOne()], { testCount: 6 }),
        }),
    ];
};
exports.specification = specification;
