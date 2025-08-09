"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.specification = void 0;
const specification = (Suite, Given, When, Then) => {
    return [
        Suite.Default("AppFrame basic rendering", {
            "renders container": Given.Default([], [], [Then.RendersContainer()]),
            "has main content area": Given.Default([], [], [Then.HasMainContent()]),
            has_footer: Given.Default([], [], [Then.HasFooter(), Then.takeScreenshot("hello.png")]),
        }),
        // Suite.Layout("AppFrame layout structure", {
        //   "contains settings button": Given.Default(
        //     [],
        //     [],
        //     [Then.HasSettingsButton()]
        //   ),
        //   "contains testeranto link": Given.Default(
        //     [],
        //     [],
        //     [Then.HasTesterantoLink(), Then.takeScreenshot("hello.png")]
        //   ),
        // }),
    ];
};
exports.specification = specification;
