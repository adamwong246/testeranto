/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Tab, Container, Alert, Table, Badge, Nav, Card, ListGroup, Col, Row } from 'react-bootstrap';
import { TestStatusBadge } from '../TestStatusBadge';
import { NavBar } from './NavBar';
import "./../../App.scss";
const BuildLogViewer = ({ logs, runtime }) => {
    var _a, _b, _c, _d, _e, _f;
    if (!logs)
        return React.createElement(Alert, { variant: "info" },
            "Loading ",
            runtime.toLowerCase(),
            " build logs...");
    const hasErrors = ((_a = logs.errors) === null || _a === void 0 ? void 0 : _a.length) > 0;
    const hasWarnings = ((_b = logs.warnings) === null || _b === void 0 ? void 0 : _b.length) > 0;
    const [activeTab, setActiveTab] = React.useState('summary');
    return (React.createElement("div", null,
        React.createElement(Tab.Container, { activeKey: activeTab, onSelect: (k) => setActiveTab(k || 'summary') },
            React.createElement(Nav, { variant: "tabs", className: "mb-3" },
                React.createElement(Nav.Item, null,
                    React.createElement(Nav.Link, { eventKey: "summary" }, "Build Summary")),
                React.createElement(Nav.Item, null,
                    React.createElement(Nav.Link, { eventKey: "warnings" }, hasWarnings ? `⚠️ Warnings (${logs.warnings.length})` : 'Warnings')),
                React.createElement(Nav.Item, null,
                    React.createElement(Nav.Link, { eventKey: "errors" }, hasErrors ? `❌ Errors (${logs.errors.length})` : 'Errors'))),
            React.createElement(Tab.Content, null,
                React.createElement(Tab.Pane, { eventKey: "summary" },
                    React.createElement(Card, null,
                        React.createElement(Card.Header, { className: "d-flex justify-content-between align-items-center" },
                            React.createElement("h5", null, "Build Summary"),
                            React.createElement("div", null,
                                hasErrors && (React.createElement(Badge, { bg: "danger", className: "me-2" },
                                    logs.errors.length,
                                    " Error",
                                    logs.errors.length !== 1 ? 's' : '')),
                                hasWarnings && (React.createElement(Badge, { bg: "warning", text: "dark" },
                                    logs.warnings.length,
                                    " Warning",
                                    logs.warnings.length !== 1 ? 's' : '')),
                                !hasErrors && !hasWarnings && (React.createElement(Badge, { bg: "success" }, "Build Successful")))),
                        React.createElement(Card.Body, null,
                            React.createElement("div", { className: "mb-3" },
                                React.createElement("h6", null,
                                    "Input Files (",
                                    Object.keys(((_c = logs.metafile) === null || _c === void 0 ? void 0 : _c.inputs) || {}).length,
                                    ")"),
                                React.createElement(ListGroup, { className: "max-h-200 overflow-auto" }, Object.keys(((_d = logs.metafile) === null || _d === void 0 ? void 0 : _d.inputs) || {}).map((file) => (React.createElement(ListGroup.Item, { key: file, className: "py-2" },
                                    React.createElement("code", null, file),
                                    React.createElement("div", { className: "text-muted small" },
                                        logs.metafile.inputs[file].bytes,
                                        " bytes")))))),
                            React.createElement("div", null,
                                React.createElement("h6", null,
                                    "Output Files (",
                                    Object.keys(((_e = logs.metafile) === null || _e === void 0 ? void 0 : _e.outputs) || {}).length,
                                    ")"),
                                React.createElement(ListGroup, { className: "max-h-200 overflow-auto" }, Object.keys(((_f = logs.metafile) === null || _f === void 0 ? void 0 : _f.outputs) || {}).map((file) => (React.createElement(ListGroup.Item, { key: file, className: "py-2" },
                                    React.createElement("code", null, file),
                                    React.createElement("div", { className: "text-muted small" },
                                        logs.metafile.outputs[file].bytes,
                                        " bytes",
                                        logs.metafile.outputs[file].entryPoint && (React.createElement("span", { className: "ms-2 badge bg-info" }, "Entry Point"))))))))))),
                React.createElement(Tab.Pane, { eventKey: "warnings" }, hasWarnings ? (React.createElement(Card, { className: "border-warning" },
                    React.createElement(Card.Header, { className: "bg-warning text-white d-flex justify-content-between align-items-center" },
                        React.createElement("span", null,
                            "Build Warnings (",
                            logs.warnings.length,
                            ")"),
                        React.createElement(Badge, { bg: "light", text: "dark" }, new Date().toLocaleString())),
                    React.createElement(Card.Body, { className: "p-0" },
                        React.createElement(ListGroup, { variant: "flush" }, logs.warnings.map((warn, i) => {
                            var _a, _b;
                            return (React.createElement(ListGroup.Item, { key: i, className: "text-warning" },
                                React.createElement("div", { className: "d-flex justify-content-between" },
                                    React.createElement("strong", null,
                                        ((_a = warn.location) === null || _a === void 0 ? void 0 : _a.file) || 'Unknown file',
                                        ((_b = warn.location) === null || _b === void 0 ? void 0 : _b.line) && `:${warn.location.line}`),
                                    React.createElement("small", { className: "text-muted" }, warn.pluginName ? `[${warn.pluginName}]` : '')),
                                React.createElement("div", { className: "mt-1" },
                                    React.createElement("pre", { className: "mb-0 p-2 bg-light rounded" }, JSON.stringify(warn)))));
                        }))))) : (React.createElement(Alert, { variant: "info" }, "No warnings found"))),
                React.createElement(Tab.Pane, { eventKey: "errors" }, hasErrors ? (React.createElement(Card, { className: "border-danger" },
                    React.createElement(Card.Header, { className: "bg-danger text-white d-flex justify-content-between align-items-center" },
                        React.createElement("span", null,
                            "Build Errors (",
                            logs.errors.length,
                            ")"),
                        React.createElement(Badge, { bg: "light", text: "dark" }, new Date().toLocaleString())),
                    React.createElement(Card.Body, { className: "p-0" },
                        React.createElement(ListGroup, { variant: "flush" }, logs.errors.map((err, i) => {
                            var _a, _b;
                            return (React.createElement(ListGroup.Item, { key: i, className: "text-danger" },
                                React.createElement("div", { className: "d-flex justify-content-between" },
                                    React.createElement("strong", null,
                                        ((_a = err.location) === null || _a === void 0 ? void 0 : _a.file) || 'Unknown file',
                                        ((_b = err.location) === null || _b === void 0 ? void 0 : _b.line) && `:${err.location.line}`),
                                    React.createElement("small", { className: "text-muted" }, err.pluginName ? `[${err.pluginName}]` : '')),
                                React.createElement("div", { className: "mt-1" },
                                    React.createElement("pre", { className: "mb-0 p-2 bg-light rounded" }, JSON.stringify(err)))));
                        }))))) : (React.createElement(Alert, { variant: "success" },
                    React.createElement("h5", null, "No Errors Found"),
                    React.createElement("p", { className: "mb-0" }, "The build completed without any errors."))))))));
};
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
                React.createElement("div", { className: "p-3" }, activeTab === 'tests' ? (React.createElement(Table, { striped: true, bordered: true, hover: true },
                    React.createElement("thead", null,
                        React.createElement("tr", null,
                            React.createElement("th", null, "Test"),
                            React.createElement("th", null, "Runtime"),
                            React.createElement("th", null, "Status"),
                            React.createElement("th", null, "Type Errors"),
                            React.createElement("th", null, "Lint Errors"))),
                    React.createElement("tbody", null, testStatuses.map((test) => (React.createElement("tr", { key: test.testName, "data-testid": `test-row-${test.testName}` },
                        React.createElement("td", null,
                            React.createElement("a", { href: `#/projects/${projectName}/tests/${encodeURIComponent(test.testName)}/${test.runTime}` }, test.testName)),
                        React.createElement("td", null,
                            React.createElement(Badge, { bg: "secondary", className: "ms-2" }, test.runTime)),
                        React.createElement("td", null,
                            React.createElement(TestStatusBadge, { testName: test.testName, testsExist: test.testsExist, runTimeErrors: test.runTimeErrors, typeErrors: test.typeErrors, staticErrors: test.staticErrors })),
                        React.createElement("td", null,
                            React.createElement("a", { href: `#/projects/${projectName}/tests/${encodeURIComponent(test.testName)}/${test.runTime}#types` }, test.typeErrors > 0 ? `❌ ${test.typeErrors}` : '✅')),
                        React.createElement("td", null,
                            React.createElement("a", { href: `#/projects/${projectName}/tests/${encodeURIComponent(test.testName)}/${test.runTime}#lint` }, test.staticErrors > 0 ? `❌ ${test.staticErrors}` : '✅')))))))) : activeTab === 'node' ? (React.createElement(BuildLogViewer, { logs: nodeLogs, runtime: "Node" })) : activeTab === 'web' ? (React.createElement(BuildLogViewer, { logs: webLogs, runtime: "Web" })) : activeTab === 'pure' ? (React.createElement(BuildLogViewer, { logs: pureLogs, runtime: "Pure" })) : null)))));
};
