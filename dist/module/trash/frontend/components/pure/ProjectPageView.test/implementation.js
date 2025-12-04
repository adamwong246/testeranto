/* eslint-disable @typescript-eslint/no-explicit-any */
import { assert } from "chai";
export const implementation = {
    suites: {
        Default: "Project Page View Tests",
    },
    givens: {
        Default: () => {
            // Create a container to mount the component
            const container = document.createElement('div');
            document.body.appendChild(container);
            return {
                summary: {
                    "test-suite-1": {
                        testsExist: true,
                        runTimeErrors: 0,
                        typeErrors: 2,
                        staticErrors: 1
                    },
                    "test-suite-2": {
                        testsExist: true,
                        runTimeErrors: 1,
                        typeErrors: 0,
                        staticErrors: 0
                    }
                },
                nodeLogs: {
                    errors: [],
                    warnings: [
                        {
                            text: "Unused variable",
                            location: { file: "src/file1.ts", line: 10 },
                            pluginName: "typescript"
                        }
                    ],
                    metafile: {
                        inputs: {
                            "src/file1.ts": { bytes: 1024 },
                            "src/file2.ts": { bytes: 2048 }
                        },
                        outputs: {
                            "dist/file1.js": { bytes: 1536, entryPoint: true },
                            "dist/file2.js": { bytes: 2560 }
                        }
                    }
                },
                webLogs: {
                    errors: [],
                    warnings: [],
                    metafile: {
                        inputs: {
                            "src/file1.ts": { bytes: 1024 },
                            "src/file2.ts": { bytes: 2048 }
                        },
                        outputs: {
                            "dist/file1.js": { bytes: 1536, entryPoint: true },
                            "dist/file2.js": { bytes: 2560 }
                        }
                    }
                },
                pureLogs: {
                    errors: [
                        {
                            text: "Syntax error",
                            location: { file: "src/file3.ts", line: 5 },
                            pluginName: "typescript"
                        }
                    ],
                    warnings: [],
                    metafile: {
                        inputs: {
                            "src/file3.ts": { bytes: 512 },
                            "src/file4.ts": { bytes: 768 }
                        },
                        outputs: {
                            "dist/file3.js": { bytes: 1024, entryPoint: true },
                            "dist/file4.js": { bytes: 1280 }
                        }
                    }
                },
                config: {
                    tests: [
                        ["test-suite-1", "node"],
                        ["test-suite-2", "web"]
                    ]
                },
                loading: false,
                error: null,
                projectName: "test-project",
                activeTab: "tests",
                setActiveTab: () => { },
                route: "tests",
                setRoute: () => { },
                navigate: () => { },
                // Add the required properties for ISelection
                htmlElement: container,
                reactElement: null,
                domRoot: null
            };
        },
        WithError: () => {
            const container = document.createElement('div');
            document.body.appendChild(container);
            return {
                summary: null,
                nodeLogs: null,
                webLogs: null,
                pureLogs: null,
                config: { tests: [] },
                loading: false,
                error: "Test error message",
                projectName: "test-project",
                activeTab: "tests",
                setActiveTab: () => { },
                route: "tests",
                setRoute: () => { },
                navigate: () => { },
                // Add the required properties for ISelection
                htmlElement: container,
                reactElement: null,
                domRoot: null
            };
        },
    },
    whens: {},
    thens: {
        hasContainerFluid: () => (state) => {
            const htmlElement = state.htmlElement;
            const container = htmlElement.querySelector('.container-fluid');
            assert.exists(container, 'Should have container-fluid div');
            return state;
        },
        hasNavBar: () => (state) => {
            const htmlElement = state.htmlElement;
            const navBar = htmlElement.querySelector('nav.navbar');
            assert.exists(navBar, 'Should render NavBar component');
            return state;
        },
        hasNavBarTitle: () => (state) => {
            var _a;
            const htmlElement = state.htmlElement;
            const navBarTitle = (_a = htmlElement.querySelector('nav.navbar .navbar-brand')) === null || _a === void 0 ? void 0 : _a.textContent;
            assert.isNotEmpty(navBarTitle, 'NavBar should have title');
            return state;
        },
        hasTestTable: () => (state) => {
            const htmlElement = state.htmlElement;
            const testTable = htmlElement.querySelector('table');
            assert.exists(testTable, 'Should render test table');
            return state;
        },
        rendersTestSuite1: () => (state) => {
            const htmlElement = state.htmlElement;
            const testTable = htmlElement.querySelector('table');
            const testNames = Array.from(testTable.querySelectorAll('tbody tr td:first-child'))
                .map(el => el.textContent);
            assert.include(testNames, 'test-suite-1', 'Should render test-suite-1');
            return state;
        },
        rendersTestSuite2: () => (state) => {
            const htmlElement = state.htmlElement;
            const testTable = htmlElement.querySelector('table');
            const testNames = Array.from(testTable.querySelectorAll('tbody tr td:first-child'))
                .map(el => el.textContent);
            assert.include(testNames, 'test-suite-2', 'Should render test-suite-2');
            return state;
        },
        unhappyPath: () => (state) => {
            const htmlElement = state.htmlElement;
            const errorAlert = htmlElement.querySelector('.alert-danger');
            assert.exists(errorAlert, 'Should show error alert');
            const errorText = errorAlert === null || errorAlert === void 0 ? void 0 : errorAlert.textContent;
            assert.include(errorText, 'Test error message', 'Should display error message');
            return state;
        },
        takeScreenshot: (name) => async (state, pm) => {
            const p = await pm.page();
            await pm.customScreenShot({ path: name }, p);
            return state;
        },
    },
};
