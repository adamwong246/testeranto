export const specification = (Suite, Given, When, Then) => {
    return [
        Suite.Default("ProjectPageView Component Tests", {
            basicRender: Given.Default([
                "ProjectPageView should render",
                "It should contain a container-fluid div",
                "It should render the NavBar component",
                "NavBar should display project title",
                "It should render test results table",
                "It should display test-suite-1 results",
                "It should display test-suite-2 results",
            ], [], [
                Then.hasContainerFluid(),
                Then.hasNavBar(),
                Then.hasNavBarTitle(),
                Then.hasTestTable(),
                Then.rendersTestSuite1(),
                Then.rendersTestSuite2(),
                Then.takeScreenshot("happy-state.png"),
            ]),
            errorHandling: Given.WithError([
                "ProjectPageView should handle errors",
                "It should display error messages when present",
                "It should capture screenshots of error state",
            ], [], [Then.unhappyPath(), Then.takeScreenshot("error-state.png")]),
        }),
    ];
};
