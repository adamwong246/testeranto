/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Container, Alert, Badge, Nav, Col, Row } from 'react-bootstrap';
import { TestTable } from './TestTable';
import { BuildLogViewer } from './BuildLogViewer';
import { NavBar } from './NavBar';
import "./../../App.scss";
export const ProjectPageView = ({ summary, nodeLogs, webLogs, pureLogs, config, loading, error, projectName, activeTab, setActiveTab }) => {
    var _a, _b, _c, _d, _e, _f;
    if (loading)
        return React.createElement("div", null, "Loading project data...");
    if (error)
        return React.createElement(Alert, { variant: "danger" },
            "Error: ",
            error);
    if (!summary)
        return React.createElement(Alert, { variant: "warning" }, "No data found for project");
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
    return (React.createElement(Container, { fluid: true },
        React.createElement(NavBar, { title: projectName, backLink: "/" }),
        React.createElement(Row, { className: "g-0" },
            React.createElement(Col, { sm: 3, className: "border-end" },
                React.createElement(Nav, { variant: "pills", className: "flex-column" },
                    React.createElement(Nav.Item, null,
                        React.createElement(Nav.Link, { active: activeTab === 'tests', onClick: () => setActiveTab('tests'), className: "d-flex flex-column align-items-start" },
                            React.createElement("div", { className: "d-flex justify-content-between w-100" },
                                React.createElement("span", null, "Tests"),
                                testStatuses.some(t => t.runTimeErrors > 0) ? (React.createElement(Badge, { bg: "danger" }, "\u274C")) : testStatuses.some(t => t.typeErrors > 0 || t.staticErrors > 0) ? (React.createElement(Badge, { bg: "warning", text: "dark" }, "\u26A0\uFE0F")) : (React.createElement(Badge, { bg: "success" }, "\u2713"))))),
                    React.createElement(Nav.Item, null,
                        React.createElement(Nav.Link, { active: activeTab === 'node', onClick: () => setActiveTab('node'), className: "d-flex justify-content-between align-items-center" },
                            "Node build logs",
                            ((_a = nodeLogs === null || nodeLogs === void 0 ? void 0 : nodeLogs.errors) === null || _a === void 0 ? void 0 : _a.length) ? (React.createElement(Badge, { bg: "danger" },
                                "\u274C ",
                                nodeLogs.errors.length)) : ((_b = nodeLogs === null || nodeLogs === void 0 ? void 0 : nodeLogs.warnings) === null || _b === void 0 ? void 0 : _b.length) ? (React.createElement(Badge, { bg: "warning", text: "dark" }, "\u26A0\uFE0F")) : null)),
                    React.createElement(Nav.Item, null,
                        React.createElement(Nav.Link, { active: activeTab === 'web', onClick: () => setActiveTab('web'), className: "d-flex justify-content-between align-items-center" },
                            "Web build logs",
                            ((_c = webLogs === null || webLogs === void 0 ? void 0 : webLogs.errors) === null || _c === void 0 ? void 0 : _c.length) ? (React.createElement(Badge, { bg: "danger" },
                                "\u274C ",
                                webLogs.errors.length)) : ((_d = webLogs === null || webLogs === void 0 ? void 0 : webLogs.warnings) === null || _d === void 0 ? void 0 : _d.length) ? (React.createElement(Badge, { bg: "warning", text: "dark" }, "\u26A0\uFE0F")) : null)),
                    React.createElement(Nav.Item, null,
                        React.createElement(Nav.Link, { active: activeTab === 'pure', onClick: () => setActiveTab('pure'), className: "d-flex justify-content-between align-items-center" },
                            "Pure build logs",
                            ((_e = pureLogs === null || pureLogs === void 0 ? void 0 : pureLogs.errors) === null || _e === void 0 ? void 0 : _e.length) ? (React.createElement(Badge, { bg: "danger" },
                                "\u274C ",
                                pureLogs.errors.length)) : ((_f = pureLogs === null || pureLogs === void 0 ? void 0 : pureLogs.warnings) === null || _f === void 0 ? void 0 : _f.length) ? (React.createElement(Badge, { bg: "warning", text: "dark" }, "\u26A0\uFE0F")) : null)))),
            React.createElement(Col, { sm: 9 },
                React.createElement("div", { className: "p-3" }, activeTab === 'tests' ? (React.createElement(TestTable, { testStatuses: testStatuses, projectName: projectName })) : activeTab === 'node' ? (React.createElement(BuildLogViewer, { logs: nodeLogs, runtime: "Node" })) : activeTab === 'web' ? (React.createElement(BuildLogViewer, { logs: webLogs, runtime: "Web" })) : activeTab === 'pure' ? (React.createElement(BuildLogViewer, { logs: pureLogs, runtime: "Pure" })) : null)))));
};
