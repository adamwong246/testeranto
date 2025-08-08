/* eslint-disable @typescript-eslint/no-empty-object-type */
// import { IInput, ISelection, IStore, ISubject, O } from "./types";
import { assert, expect } from "chai";
import * as React from "react";
import * as ReactDom from "react-dom/client";
const mockTestData = {
    name: "Test Suite",
    givens: [
        {
            name: "Given Scenario",
            whens: [{ name: "When Action" }],
            thens: [{ name: "Then Assertion" }],
        },
    ],
};
export const implementation = {
    suites: {
        Default: "TestPageView basic rendering",
        Navigation: "TestPageView navigation behavior",
        ErrorStates: "TestPageView error handling",
    },
    givens: {
        Default: () => ({
            route: "results",
            setRoute: () => { },
            navigate: () => { },
            projectName: "test-project",
            testName: "test-suite.test.ts",
            decodedTestPath: "test-suite",
            runtime: "node",
            testData: mockTestData,
            logs: "Test logs content",
            typeErrors: "",
            lintErrors: "",
            testsExist: true,
            errorCounts: {
                runTimeErrors: 0,
                typeErrors: 0,
                staticErrors: 0,
            },
        }),
        WithErrors: () => ({
            route: "results",
            setRoute: () => { },
            navigate: () => { },
            projectName: "test-project",
            testName: "test-suite.test.ts",
            decodedTestPath: "test-suite",
            runtime: "node",
            testData: null,
            logs: undefined,
            typeErrors: "Type error message",
            lintErrors: "Lint error message",
            testsExist: false,
            errorCounts: {
                runTimeErrors: 1,
                typeErrors: 2,
                staticErrors: 3,
            },
        }),
        WithLogs: () => ({
            route: "logs",
            setRoute: () => { },
            navigate: () => { },
            projectName: "test-project",
            testName: "test-suite.test.ts",
            decodedTestPath: "test-suite",
            runtime: "node",
            testData: mockTestData,
            logs: "Detailed test logs\nLine 1\nLine 2",
            typeErrors: "",
            lintErrors: "",
            testsExist: true,
            errorCounts: {
                runTimeErrors: 0,
                typeErrors: 0,
                staticErrors: 0,
            },
        }),
    },
    whens: {
        SwitchToTab: (tabName) => (selection) => {
            selection.reactElement = React.cloneElement(selection.reactElement, {
                route: tabName,
            });
            ReactDom.createRoot(selection.domRoot).render(selection.reactElement);
            return selection;
        },
        ClickAiderButton: () => (selection) => {
            const button = selection.container.querySelector('button[aria-label="Aider"]');
            if (button) {
                button.click();
            }
            return selection;
        },
    },
    thens: {
        takeScreenshot: (name) => async ({ htmlElement }, pm) => {
            const p = await pm.page();
            await pm.customScreenShot({ path: name }, p);
            return { htmlElement };
        },
        RendersNavBar: () => async (selection) => {
            const navBar = selection.container.querySelector(".navbar");
            expect(navBar).toBeTruthy();
            return selection;
        },
        ShowsActiveTab: (tabName) => async (selection) => {
            const activeTab = selection.container.querySelector(".tab-pane.active");
            expect(activeTab === null || activeTab === void 0 ? void 0 : activeTab.textContent).toContain(tabName);
            return selection;
        },
        ShowsErrorCounts: () => async (selection) => {
            const badges = selection.container.querySelectorAll(".badge");
            expect(badges.length).toBeGreaterThan(0);
            return selection;
        },
        ShowsTestResults: () => async (selection) => {
            const testResults = selection.container.querySelector(".test-results");
            expect(testResults).toBeTruthy();
            return selection;
        },
        ShowsLogs: () => async (selection) => {
            const logs = selection.container.querySelector("pre");
            expect(logs).toBeTruthy();
            return selection;
        },
        ShowsTypeErrors: () => async (selection) => {
            const typeErrors = selection.container.querySelector("#types-tab");
            expect(typeErrors).toBeTruthy();
            return selection;
        },
        ShowsLintErrors: () => async (selection) => {
            const lintErrors = selection.container.querySelector("#lint-tab");
            assert(lintErrors).toBeTruthy();
            return selection;
        },
        AiderButtonCopiesCommand: () => async (selection) => {
            Object.assign(navigator, {
                clipboard: {
                    writeText: jest.fn().mockResolvedValue(undefined),
                },
            });
            await implementation.whens.ClickAiderButton()(selection);
            expect(navigator.clipboard.writeText).toHaveBeenCalled();
            return selection;
        },
    },
};
