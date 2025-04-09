"use strict";
// import { ITestImplementation } from "testeranto/src/Types";
// import { I } from "testeranto/src/SubPackages/react-test-renderer/component";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testImplementation = void 0;
const chai_1 = require("chai");
exports.testImplementation = {
    suites: {
        Default: "default",
    },
    givens: {
        AnEmptyState: () => {
            return { foo: "bar" };
        },
    },
    whens: {
        IClickTheButton: () => async (component) => {
            const button = component.root.findByType("button");
            button.props.onClick();
            return component;
        },
        IClickTheHeader: () => async (component) => {
            try {
                const header = component.root.findByType("h1");
                header.props.onClick();
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            }
            catch (error) {
                // Expected error - header click fails
            }
            return component;
        },
    },
    thens: {
        ThePropsIs: (expectation) => (component) => {
            const propsElement = component.root.findByProps({ id: "theProps" });
            return chai_1.assert.deepEqual(JSON.parse(propsElement.props.children), expectation);
        },
        TheStatusIs: (expectation) => (component) => {
            try {
                const statElement = component.root.findByProps({ id: "theStat" });
                const actual = JSON.parse(statElement.props.children);
                chai_1.assert.deepEqual(actual, expectation, "the status was not as expected");
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            }
            catch (error) {
                chai_1.assert.fail(`Element with id "theStat" not found`);
            }
            return component;
        },
    },
    checks: {
        AnEmptyState: () => {
            return { foo: "bar" };
        },
    },
};
