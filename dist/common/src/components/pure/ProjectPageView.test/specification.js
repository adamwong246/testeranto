"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.specification = void 0;
const specification = (Suite, Given, When, Then) => {
    return [
        Suite.Default("ProjectPageView Component Tests", {
            basicRender: Given.Default([
                "ProjectPageView should render",
                "It should contain a container-fluid div",
                "It should render the NavBar component",
            ], [], [Then.happyPath()]),
            // errorHandling: Given.WithError(
            //   [
            //     "ProjectPageView should handle errors",
            //     "It should display error messages when present",
            //   ],
            //   [],
            //   [Then.unhappyPath()]
            // ),
        }),
    ];
};
exports.specification = specification;
