"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectPageView = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const react_1 = __importDefault(require("react"));
const react_bootstrap_1 = require("react-bootstrap");
const NavBar_1 = require("../../NavBar");
const TestStatusBadge_1 = require("../TestStatusBadge");
require("./../../App.scss");
const BuildLogViewer = ({ logs, runtime }) => {
    var _a, _b, _c, _d, _e, _f;
    if (!logs)
        return react_1.default.createElement(react_bootstrap_1.Alert, { variant: "info" },
            "Loading ",
            runtime.toLowerCase(),
            " build logs...");
    const hasErrors = ((_a = logs.errors) === null || _a === void 0 ? void 0 : _a.length) > 0;
    const hasWarnings = ((_b = logs.warnings) === null || _b === void 0 ? void 0 : _b.length) > 0;
    const [activeTab, setActiveTab] = react_1.default.useState('summary');
    return (react_1.default.createElement("div", null,
        react_1.default.createElement(react_bootstrap_1.Tab.Container, { activeKey: activeTab, onSelect: (k) => setActiveTab(k || 'summary') },
            react_1.default.createElement(react_bootstrap_1.Nav, { variant: "tabs", className: "mb-3" },
                react_1.default.createElement(react_bootstrap_1.Nav.Item, null,
                    react_1.default.createElement(react_bootstrap_1.Nav.Link, { eventKey: "summary" }, "Build Summary")),
                react_1.default.createElement(react_bootstrap_1.Nav.Item, null,
                    react_1.default.createElement(react_bootstrap_1.Nav.Link, { eventKey: "warnings" }, hasWarnings ? `⚠️ Warnings (${logs.warnings.length})` : 'Warnings')),
                react_1.default.createElement(react_bootstrap_1.Nav.Item, null,
                    react_1.default.createElement(react_bootstrap_1.Nav.Link, { eventKey: "errors" }, hasErrors ? `❌ Errors (${logs.errors.length})` : 'Errors'))),
            react_1.default.createElement(react_bootstrap_1.Tab.Content, null,
                react_1.default.createElement(react_bootstrap_1.Tab.Pane, { eventKey: "summary" },
                    react_1.default.createElement(react_bootstrap_1.Card, null,
                        react_1.default.createElement(react_bootstrap_1.Card.Header, { className: "d-flex justify-content-between align-items-center" },
                            react_1.default.createElement("h5", null, "Build Summary"),
                            react_1.default.createElement("div", null,
                                hasErrors && (react_1.default.createElement(react_bootstrap_1.Badge, { bg: "danger", className: "me-2" },
                                    logs.errors.length,
                                    " Error",
                                    logs.errors.length !== 1 ? 's' : '')),
                                hasWarnings && (react_1.default.createElement(react_bootstrap_1.Badge, { bg: "warning", text: "dark" },
                                    logs.warnings.length,
                                    " Warning",
                                    logs.warnings.length !== 1 ? 's' : '')),
                                !hasErrors && !hasWarnings && (react_1.default.createElement(react_bootstrap_1.Badge, { bg: "success" }, "Build Successful")))),
                        react_1.default.createElement(react_bootstrap_1.Card.Body, null,
                            react_1.default.createElement("div", { className: "mb-3" },
                                react_1.default.createElement("h6", null,
                                    "Input Files (",
                                    Object.keys(((_c = logs.metafile) === null || _c === void 0 ? void 0 : _c.inputs) || {}).length,
                                    ")"),
                                react_1.default.createElement(react_bootstrap_1.ListGroup, { className: "max-h-200 overflow-auto" }, Object.keys(((_d = logs.metafile) === null || _d === void 0 ? void 0 : _d.inputs) || {}).map((file) => (react_1.default.createElement(react_bootstrap_1.ListGroup.Item, { key: file, className: "py-2" },
                                    react_1.default.createElement("code", null, file),
                                    react_1.default.createElement("div", { className: "text-muted small" },
                                        logs.metafile.inputs[file].bytes,
                                        " bytes")))))),
                            react_1.default.createElement("div", null,
                                react_1.default.createElement("h6", null,
                                    "Output Files (",
                                    Object.keys(((_e = logs.metafile) === null || _e === void 0 ? void 0 : _e.outputs) || {}).length,
                                    ")"),
                                react_1.default.createElement(react_bootstrap_1.ListGroup, { className: "max-h-200 overflow-auto" }, Object.keys(((_f = logs.metafile) === null || _f === void 0 ? void 0 : _f.outputs) || {}).map((file) => (react_1.default.createElement(react_bootstrap_1.ListGroup.Item, { key: file, className: "py-2" },
                                    react_1.default.createElement("code", null, file),
                                    react_1.default.createElement("div", { className: "text-muted small" },
                                        logs.metafile.outputs[file].bytes,
                                        " bytes",
                                        logs.metafile.outputs[file].entryPoint && (react_1.default.createElement("span", { className: "ms-2 badge bg-info" }, "Entry Point"))))))))))),
                react_1.default.createElement(react_bootstrap_1.Tab.Pane, { eventKey: "warnings" }, hasWarnings ? (react_1.default.createElement(react_bootstrap_1.Card, { className: "border-warning" },
                    react_1.default.createElement(react_bootstrap_1.Card.Header, { className: "bg-warning text-white d-flex justify-content-between align-items-center" },
                        react_1.default.createElement("span", null,
                            "Build Warnings (",
                            logs.warnings.length,
                            ")"),
                        react_1.default.createElement(react_bootstrap_1.Badge, { bg: "light", text: "dark" }, new Date().toLocaleString())),
                    react_1.default.createElement(react_bootstrap_1.Card.Body, { className: "p-0" },
                        react_1.default.createElement(react_bootstrap_1.ListGroup, { variant: "flush" }, logs.warnings.map((warn, i) => {
                            var _a, _b;
                            return (react_1.default.createElement(react_bootstrap_1.ListGroup.Item, { key: i, className: "text-warning" },
                                react_1.default.createElement("div", { className: "d-flex justify-content-between" },
                                    react_1.default.createElement("strong", null,
                                        ((_a = warn.location) === null || _a === void 0 ? void 0 : _a.file) || 'Unknown file',
                                        ((_b = warn.location) === null || _b === void 0 ? void 0 : _b.line) && `:${warn.location.line}`),
                                    react_1.default.createElement("small", { className: "text-muted" }, warn.pluginName ? `[${warn.pluginName}]` : '')),
                                react_1.default.createElement("div", { className: "mt-1" },
                                    react_1.default.createElement("pre", { className: "mb-0 p-2 bg-light rounded" }, JSON.stringify(warn)))));
                        }))))) : (react_1.default.createElement(react_bootstrap_1.Alert, { variant: "info" }, "No warnings found"))),
                react_1.default.createElement(react_bootstrap_1.Tab.Pane, { eventKey: "errors" }, hasErrors ? (react_1.default.createElement(react_bootstrap_1.Card, { className: "border-danger" },
                    react_1.default.createElement(react_bootstrap_1.Card.Header, { className: "bg-danger text-white d-flex justify-content-between align-items-center" },
                        react_1.default.createElement("span", null,
                            "Build Errors (",
                            logs.errors.length,
                            ")"),
                        react_1.default.createElement(react_bootstrap_1.Badge, { bg: "light", text: "dark" }, new Date().toLocaleString())),
                    react_1.default.createElement(react_bootstrap_1.Card.Body, { className: "p-0" },
                        react_1.default.createElement(react_bootstrap_1.ListGroup, { variant: "flush" }, logs.errors.map((err, i) => {
                            var _a, _b;
                            return (react_1.default.createElement(react_bootstrap_1.ListGroup.Item, { key: i, className: "text-danger" },
                                react_1.default.createElement("div", { className: "d-flex justify-content-between" },
                                    react_1.default.createElement("strong", null,
                                        ((_a = err.location) === null || _a === void 0 ? void 0 : _a.file) || 'Unknown file',
                                        ((_b = err.location) === null || _b === void 0 ? void 0 : _b.line) && `:${err.location.line}`),
                                    react_1.default.createElement("small", { className: "text-muted" }, err.pluginName ? `[${err.pluginName}]` : '')),
                                react_1.default.createElement("div", { className: "mt-1" },
                                    react_1.default.createElement("pre", { className: "mb-0 p-2 bg-light rounded" }, JSON.stringify(err)))));
                        }))))) : (react_1.default.createElement(react_bootstrap_1.Alert, { variant: "success" },
                    react_1.default.createElement("h5", null, "No Errors Found"),
                    react_1.default.createElement("p", { className: "mb-0" }, "The build completed without any errors."))))))));
};
const ProjectPageView = ({ summary, nodeLogs, webLogs, pureLogs, config, loading, error, projectName, route, setRoute, navigate }) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
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
            runTime
        };
    });
    return (react_1.default.createElement(react_bootstrap_1.Container, { fluid: true },
        react_1.default.createElement(NavBar_1.NavBar, { title: projectName, backLink: "/", navItems: [
                {
                    to: `#tests`,
                    label: testStatuses.some(t => t.runTimeErrors > 0) ? '❌ Tests' :
                        testStatuses.some(t => t.typeErrors > 0 || t.staticErrors > 0) ? '⚠️ Tests' : '✅ Tests',
                    active: route === 'tests',
                    className: testStatuses.some(t => t.runTimeErrors > 0) ? 'text-danger fw-bold' :
                        testStatuses.some(t => t.typeErrors > 0 || t.staticErrors > 0) ? 'text-warning fw-bold' : ''
                },
                {
                    to: `#node`,
                    label: ((_a = nodeLogs === null || nodeLogs === void 0 ? void 0 : nodeLogs.errors) === null || _a === void 0 ? void 0 : _a.length) ? '❌ Node Build' :
                        ((_b = nodeLogs === null || nodeLogs === void 0 ? void 0 : nodeLogs.warnings) === null || _b === void 0 ? void 0 : _b.length) ? '⚠️ Node Build' : 'Node Build',
                    active: route === 'node',
                    className: ((_c = nodeLogs === null || nodeLogs === void 0 ? void 0 : nodeLogs.errors) === null || _c === void 0 ? void 0 : _c.length) ? 'text-danger fw-bold' :
                        ((_d = nodeLogs === null || nodeLogs === void 0 ? void 0 : nodeLogs.warnings) === null || _d === void 0 ? void 0 : _d.length) ? 'text-warning fw-bold' : ''
                },
                {
                    to: `#web`,
                    label: ((_e = webLogs === null || webLogs === void 0 ? void 0 : webLogs.errors) === null || _e === void 0 ? void 0 : _e.length) ? '❌ Web Build' :
                        ((_f = webLogs === null || webLogs === void 0 ? void 0 : webLogs.warnings) === null || _f === void 0 ? void 0 : _f.length) ? '⚠️ Web Build' : 'Web Build',
                    active: route === 'web',
                    className: ((_g = webLogs === null || webLogs === void 0 ? void 0 : webLogs.errors) === null || _g === void 0 ? void 0 : _g.length) ? 'text-danger fw-bold' :
                        ((_h = webLogs === null || webLogs === void 0 ? void 0 : webLogs.warnings) === null || _h === void 0 ? void 0 : _h.length) ? 'text-warning fw-bold' : ''
                },
                {
                    to: `#pure`,
                    label: ((_j = pureLogs === null || pureLogs === void 0 ? void 0 : pureLogs.errors) === null || _j === void 0 ? void 0 : _j.length) ? '❌ Pure Build' :
                        ((_k = pureLogs === null || pureLogs === void 0 ? void 0 : pureLogs.warnings) === null || _k === void 0 ? void 0 : _k.length) ? '⚠️ Pure Build' : 'Pure Build',
                    active: route === 'pure',
                    className: ((_l = pureLogs === null || pureLogs === void 0 ? void 0 : pureLogs.errors) === null || _l === void 0 ? void 0 : _l.length) ? 'text-danger fw-bold' :
                        ((_m = pureLogs === null || pureLogs === void 0 ? void 0 : pureLogs.warnings) === null || _m === void 0 ? void 0 : _m.length) ? 'text-warning fw-bold' : ''
                },
            ] }),
        react_1.default.createElement(react_bootstrap_1.Tab.Container, { activeKey: route, onSelect: (k) => {
                if (k) {
                    setRoute(k);
                    navigate(`#${k}`, { replace: true });
                }
            } },
            react_1.default.createElement(react_bootstrap_1.Tab.Content, null,
                react_1.default.createElement(react_bootstrap_1.Tab.Pane, { eventKey: "tests" },
                    react_1.default.createElement(react_bootstrap_1.Table, { striped: true, bordered: true, hover: true },
                        react_1.default.createElement("thead", null,
                            react_1.default.createElement("tr", null,
                                react_1.default.createElement("th", null, "Test"),
                                react_1.default.createElement("th", null, "Runtime"),
                                react_1.default.createElement("th", null, "Status"),
                                react_1.default.createElement("th", null, "Type Errors"),
                                react_1.default.createElement("th", null, "Lint Errors"))),
                        react_1.default.createElement("tbody", null, testStatuses.map((test) => (react_1.default.createElement("tr", { key: test.testName },
                            react_1.default.createElement("td", null,
                                react_1.default.createElement("a", { href: `#/projects/${projectName}/tests/${encodeURIComponent(test.testName)}/${test.runTime}` }, test.testName)),
                            react_1.default.createElement("td", null,
                                react_1.default.createElement(react_bootstrap_1.Badge, { bg: "secondary", className: "ms-2" }, test.runTime)),
                            react_1.default.createElement("td", null,
                                react_1.default.createElement(TestStatusBadge_1.TestStatusBadge, { testName: test.testName, testsExist: test.testsExist, runTimeErrors: test.runTimeErrors })),
                            react_1.default.createElement("td", null,
                                react_1.default.createElement("a", { href: `#/projects/${projectName}/tests/${encodeURIComponent(test.testName)}/${test.runTime}#types` }, test.typeErrors > 0 ? `❌ ${test.typeErrors}` : '✅')),
                            react_1.default.createElement("td", null,
                                react_1.default.createElement("a", { href: `#/projects/${projectName}/tests/${encodeURIComponent(test.testName)}/${test.runTime}#lint` }, test.staticErrors > 0 ? `❌ ${test.staticErrors}` : '✅')))))))),
                react_1.default.createElement(react_bootstrap_1.Tab.Pane, { eventKey: "node" },
                    react_1.default.createElement(BuildLogViewer, { logs: nodeLogs, runtime: "Node" })),
                react_1.default.createElement(react_bootstrap_1.Tab.Pane, { eventKey: "web" },
                    react_1.default.createElement(BuildLogViewer, { logs: webLogs, runtime: "Web" })),
                react_1.default.createElement(react_bootstrap_1.Tab.Pane, { eventKey: "pure" },
                    react_1.default.createElement(BuildLogViewer, { logs: pureLogs, runtime: "Pure" }))))));
};
exports.ProjectPageView = ProjectPageView;
