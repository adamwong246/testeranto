export const specification = (Suite, Given, When, Then) => {
    return [
        Suite.Default("FeaturesReporterView Component Tests", {
            basicRender: Given.Default([
                "FeaturesReporterView should render",
                "It should show project names",
                "It should show file paths",
                "It should show test names",
                "It should show test statuses"
            ], [], [
                Then.hasProjectNames(),
                Then.hasFilePaths(),
                Then.hasTestNames(),
                Then.hasStatusBadges(),
                Then.takeScreenshot("features-reporter.png")
            ]),
            emptyState: Given.WithEmptyData([
                "FeaturesReporterView should handle empty state",
                "It should show empty message when no projects exist"
            ], [], [Then.showsEmptyMessage()]),
        }),
    ];
};
