"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectPageView = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const react_1 = __importDefault(require("react"));
const react_bootstrap_1 = require("react-bootstrap");
const TestTable_1 = require("./TestTable");
const BuildLogViewer_1 = require("./BuildLogViewer");
const NavBar_1 = require("./NavBar");
require("./../../App.scss");
const ProjectPageView = ({ summary, nodeLogs, webLogs, pureLogs, config, loading, error, projectName, activeTab, setActiveTab }) => {
    var _a, _b, _c, _d, _e, _f;
    if (loading)
        return react_1.default.createElement("div", null, "Loading project data...");
    if (error)
        return react_1.default.createElement(react_bootstrap_1.Alert, { variant: "danger" },
            "Error: ",
            error);
    if (!summary)
        return react_1.default.createElement(react_bootstrap_1.Alert, { variant: "warning" }, "No data found for project");
    const testStatuses = Object.entries(summary).map(([testName, testData]) => {
        var _a, _b;
        const runTime = ((_b = (_a = config.tests) === null || _a === void 0 ? void 0 : _a.find((t) => t[0] === testName)) === null || _b === void 0 ? void 0 : _b[1]) || 'node';
        return {
            testName,
            testsExist: testData.testsExist !== false,
            runTimeErrors: Number(testData.runTimeErrors) || 0,
            typeErrors: Number(testData.typeErrors) || 0,
            staticErrors: Number(testData.staticErrors) || 0,
            runTimeTests: Number(testData.runTimeTests) || 0,
            runTime
        };
    });
    return (react_1.default.createElement(react_bootstrap_1.Container, { fluid: true },
        react_1.default.createElement(NavBar_1.NavBar, { title: projectName, backLink: "/" }),
        react_1.default.createElement(react_bootstrap_1.Row, { className: "g-0" },
            react_1.default.createElement(react_bootstrap_1.Col, { sm: 3, className: "border-end" },
                react_1.default.createElement(react_bootstrap_1.Nav, { variant: "pills", className: "flex-column" },
                    react_1.default.createElement(react_bootstrap_1.Nav.Item, null,
                        react_1.default.createElement(react_bootstrap_1.Nav.Link, { active: activeTab === 'tests', onClick: () => setActiveTab('tests'), className: "d-flex flex-column align-items-start" },
                            react_1.default.createElement("div", { className: "d-flex justify-content-between w-100" },
                                react_1.default.createElement("span", null, "Tests"),
                                testStatuses.some(t => t.runTimeErrors > 0) ? (react_1.default.createElement(react_bootstrap_1.Badge, { bg: "danger" }, "\u274C")) : testStatuses.some(t => t.typeErrors > 0 || t.staticErrors > 0) ? (react_1.default.createElement(react_bootstrap_1.Badge, { bg: "warning", text: "dark" }, "\u26A0\uFE0F")) : (react_1.default.createElement(react_bootstrap_1.Badge, { bg: "success" }, "\u2713"))))),
                    react_1.default.createElement(react_bootstrap_1.Nav.Item, null,
                        react_1.default.createElement(react_bootstrap_1.Nav.Link, { active: activeTab === 'node', onClick: () => setActiveTab('node'), className: "d-flex justify-content-between align-items-center" },
                            "Node build logs",
                            ((_a = nodeLogs === null || nodeLogs === void 0 ? void 0 : nodeLogs.errors) === null || _a === void 0 ? void 0 : _a.length) ? (react_1.default.createElement(react_bootstrap_1.Badge, { bg: "danger" },
                                "\u274C ",
                                nodeLogs.errors.length)) : ((_b = nodeLogs === null || nodeLogs === void 0 ? void 0 : nodeLogs.warnings) === null || _b === void 0 ? void 0 : _b.length) ? (react_1.default.createElement(react_bootstrap_1.Badge, { bg: "warning", text: "dark" }, "\u26A0\uFE0F")) : null)),
                    react_1.default.createElement(react_bootstrap_1.Nav.Item, null,
                        react_1.default.createElement(react_bootstrap_1.Nav.Link, { active: activeTab === 'web', onClick: () => setActiveTab('web'), className: "d-flex justify-content-between align-items-center" },
                            "Web build logs",
                            ((_c = webLogs === null || webLogs === void 0 ? void 0 : webLogs.errors) === null || _c === void 0 ? void 0 : _c.length) ? (react_1.default.createElement(react_bootstrap_1.Badge, { bg: "danger" },
                                "\u274C ",
                                webLogs.errors.length)) : ((_d = webLogs === null || webLogs === void 0 ? void 0 : webLogs.warnings) === null || _d === void 0 ? void 0 : _d.length) ? (react_1.default.createElement(react_bootstrap_1.Badge, { bg: "warning", text: "dark" }, "\u26A0\uFE0F")) : null)),
                    react_1.default.createElement(react_bootstrap_1.Nav.Item, null,
                        react_1.default.createElement(react_bootstrap_1.Nav.Link, { active: activeTab === 'pure', onClick: () => setActiveTab('pure'), className: "d-flex justify-content-between align-items-center" },
                            "Pure build logs",
                            ((_e = pureLogs === null || pureLogs === void 0 ? void 0 : pureLogs.errors) === null || _e === void 0 ? void 0 : _e.length) ? (react_1.default.createElement(react_bootstrap_1.Badge, { bg: "danger" },
                                "\u274C ",
                                pureLogs.errors.length)) : ((_f = pureLogs === null || pureLogs === void 0 ? void 0 : pureLogs.warnings) === null || _f === void 0 ? void 0 : _f.length) ? (react_1.default.createElement(react_bootstrap_1.Badge, { bg: "warning", text: "dark" }, "\u26A0\uFE0F")) : null)))),
            react_1.default.createElement(react_bootstrap_1.Col, { sm: 9 },
                react_1.default.createElement("div", { className: "p-3" }, activeTab === 'tests' ? (react_1.default.createElement(TestTable_1.TestTable, { testStatuses: testStatuses, projectName: projectName })) : activeTab === 'node' ? (react_1.default.createElement(BuildLogViewer_1.BuildLogViewer, { logs: nodeLogs, runtime: "Node" })) : activeTab === 'web' ? (react_1.default.createElement(BuildLogViewer_1.BuildLogViewer, { logs: webLogs, runtime: "Web" })) : activeTab === 'pure' ? (react_1.default.createElement(BuildLogViewer_1.BuildLogViewer, { logs: pureLogs, runtime: "Pure" })) : null)))));
};
exports.ProjectPageView = ProjectPageView;
