"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.implementation = void 0;
const React = __importStar(require("react"));
const ReactDom = __importStar(require("react-dom/client"));
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
exports.implementation = {
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
            expect(lintErrors).toBeTruthy();
            return selection;
        },
        AiderButtonCopiesCommand: () => async (selection) => {
            Object.assign(navigator, {
                clipboard: {
                    writeText: jest.fn().mockResolvedValue(undefined),
                },
            });
            await exports.implementation.whens.ClickAiderButton()(selection);
            expect(navigator.clipboard.writeText).toHaveBeenCalled();
            return selection;
        },
    },
};
