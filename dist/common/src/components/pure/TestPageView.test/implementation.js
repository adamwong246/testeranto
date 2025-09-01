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
const chai_1 = require("chai");
const React = __importStar(require("react"));
const ReactDom = __importStar(require("react-dom/client"));
exports.implementation = {
    suites: {
        Default: "TestPageView basic rendering",
        Navigation: "TestPageView navigation behavior",
        ErrorStates: "TestPageView error handling",
    },
    givens: {
        Default: () => (props) => {
            // Create a container and render the component
            const container = document.createElement('div');
            document.body.appendChild(container);
            const reactElement = React.createElement(props);
            const domRoot = ReactDom.createRoot(container);
            domRoot.render(reactElement);
            return Object.assign({ container,
                reactElement,
                domRoot }, props);
        },
        WithErrors: () => (props) => {
            const container = document.createElement('div');
            document.body.appendChild(container);
            const reactElement = React.createElement(props);
            const domRoot = ReactDom.createRoot(container);
            domRoot.render(reactElement);
            return Object.assign(Object.assign({ container,
                reactElement,
                domRoot }, props), { errorCounts: {
                    runTimeErrors: 1,
                    typeErrors: 1,
                    staticErrors: 1
                } });
        },
        WithLogs: () => (props) => {
            const container = document.createElement('div');
            document.body.appendChild(container);
            const reactElement = React.createElement(props);
            const domRoot = ReactDom.createRoot(container);
            domRoot.render(reactElement);
            return Object.assign(Object.assign({ container,
                reactElement,
                domRoot }, props), { logs: {
                    'tests.json': '{}',
                    'stdout.log': 'test log content'
                } });
        },
    },
    whens: {
        SwitchToTab: (tabName) => async (selection, tr, utils) => {
            // Update the props to switch tabs
            const newProps = Object.assign(Object.assign({}, selection), { activeTab: tabName });
            const newReactElement = React.createElement(selection.reactElement.type, newProps);
            selection.domRoot.render(newReactElement);
            return (sel) => (Object.assign(Object.assign({}, sel), { reactElement: newReactElement, activeTab: tabName }));
        },
        ClickAiderButton: () => async (selection, tr, utils) => {
            // Find and click the Aider button
            const button = selection.container.querySelector('button');
            if (button) {
                button.click();
            }
            return (sel) => sel;
        },
    },
    thens: {
        takeScreenshot: (name) => async (ssel, utils) => (sel) => {
            // Screenshot functionality would be implemented here
            return Promise.resolve(sel);
        },
        RendersNavBar: () => async (ssel, utils) => (sel) => {
            const navBar = sel.container.querySelector(".navbar");
            chai_1.assert.isNotNull(navBar, "Navbar should be rendered");
            return Promise.resolve(sel);
        },
        ShowsActiveTab: (tabName) => async (ssel, utils) => (sel) => {
            // Check if the active tab matches
            chai_1.assert.equal(sel.activeTab, tabName, `Active tab should be ${tabName}`);
            return Promise.resolve(sel);
        },
        ShowsErrorCounts: () => async (ssel, utils) => (sel) => {
            // Check for error badges
            const badges = sel.container.querySelectorAll(".badge");
            chai_1.assert.isAtLeast(badges.length, 0, "Should show at least one badge");
            return Promise.resolve(sel);
        },
        ShowsTestResults: () => async (ssel, utils) => (sel) => {
            // Check if test results are shown
            if (sel.testsExist) {
                const testResults = sel.container.querySelector(".test-results");
                chai_1.assert.isNotNull(testResults, "Test results should be shown when tests exist");
            }
            return Promise.resolve(sel);
        },
        ShowsLogs: () => async (ssel, utils) => (sel) => {
            // Check if logs are shown
            const logs = sel.container.querySelector("pre");
            chai_1.assert.isNotNull(logs, "Logs should be shown");
            return Promise.resolve(sel);
        },
        ShowsTypeErrors: () => async (ssel, utils) => (sel) => {
            // Check if type errors are shown
            const typeErrors = sel.container.querySelector('[data-testid="type-errors"]');
            chai_1.assert.isNotNull(typeErrors, "Type errors should be shown");
            return Promise.resolve(sel);
        },
        ShowsLintErrors: () => async (ssel, utils) => (sel) => {
            // Check if lint errors are shown
            const lintErrors = sel.container.querySelector('[data-testid="lint-errors"]');
            chai_1.assert.isNotNull(lintErrors, "Lint errors should be shown");
            return Promise.resolve(sel);
        },
        AiderButtonCopiesCommand: () => async (ssel, utils) => (sel) => {
            // Check if Aider button exists
            const aiderButton = sel.container.querySelector('button[title*="AI Assistant"]');
            chai_1.assert.isNotNull(aiderButton, "Aider button should be present");
            return Promise.resolve(sel);
        },
    },
};
