export const specification = (Suite, Given, When, Then) => {
    return [
        Suite.Default("Testing BaseBuilder functionality", {
            testInitialization: Given.Default(["BaseBuilder should initialize correctly"], [], [
                Then.initializedProperly(),
                Then.artifactsTracked(),
                Then.jobsCreated(),
                Then.specsGenerated(),
            ]),
            testSpecsGeneration: Given.Default(["BaseBuilder should generate specs from test specification"], [], [Then.specsGenerated()]),
            testJobsCreation: Given.Default(["BaseBuilder should create test jobs"], [], [Then.jobsCreated()]),
        }),
    ];
};
