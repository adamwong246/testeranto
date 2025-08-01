export const specification = (Suite, Given, When, Then) => {
    return [
        Suite.Default("Testing BaseBuilder functionality", {
            testInitialization: Given["the default BaseBuilder"](["BaseBuilder should initialize correctly"], [], [
                Then["it is initialized"](),
                Then["it tracks artifacts"](),
                // Then["it creates jobs"](),
                // Then["it generates TestSpecifications"](),
            ]),
            testSpecsGeneration: Given["the default BaseBuilder"](["BaseBuilder should generate specs from test specification"], [], [Then["it generates TestSpecifications"]()]),
            testJobsCreation: Given["the default BaseBuilder"](["BaseBuilder should create test jobs"], [], [Then["it creates jobs"]()]),
        }),
    ];
};
