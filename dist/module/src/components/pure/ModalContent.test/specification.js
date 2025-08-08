export const specification = (Suite, Given, When, Then) => {
    return [
        Suite.Default("ModalContent Component Tests", {
            basicRender: Given.Default([
                "ModalContent should render",
                "It should contain a Modal.Header",
                "It should render the ThemeCard components",
            ], [], [
                Then.hasModalHeader(),
                Then.hasThemeCards(),
                Then.takeScreenshot("modal-content.png"),
            ]),
        }),
    ];
};
