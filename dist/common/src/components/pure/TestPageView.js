"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestPageView = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const react_1 = __importDefault(require("react"));
const react_bootstrap_1 = require("react-bootstrap");
const NavBar_1 = require("./NavBar");
const TestStatusBadge_1 = require("../TestStatusBadge");
const TestPageView = ({ projectName, testName, decodedTestPath, runtime, testsExist, errorCounts, logs, }) => {
    const [activeTab, setActiveTab] = react_1.default.useState('tests.json');
    const renderTestResults = (testData) => {
        return (react_1.default.createElement("div", { className: "test-results" }, testData.givens.map((given, i) => (react_1.default.createElement("div", { key: i, className: "mb-4 card" },
            react_1.default.createElement("div", { className: "card-header bg-primary text-white" },
                react_1.default.createElement("div", { className: "d-flex justify-content-between align-items-center" },
                    react_1.default.createElement("div", null,
                        react_1.default.createElement("h4", null,
                            "Given: ",
                            given.name),
                        given.features && given.features.length > 0 && (react_1.default.createElement("div", { className: "mt-1" },
                            react_1.default.createElement("small", null, "Features:"),
                            react_1.default.createElement("ul", { className: "list-unstyled" }, given.features.map((feature, fi) => (react_1.default.createElement("li", { key: fi }, feature.startsWith('http') ? (react_1.default.createElement("a", { href: feature, target: "_blank", rel: "noopener noreferrer", className: "text-white" }, new URL(feature).hostname)) : (react_1.default.createElement("span", { className: "text-white" }, feature))))))))),
                    given.artifacts && given.artifacts.length > 0 && (react_1.default.createElement("div", { className: "dropdown" },
                        react_1.default.createElement("button", { className: "btn btn-sm btn-light dropdown-toggle", type: "button", "data-bs-toggle": "dropdown" },
                            "Artifacts (",
                            given.artifacts.length,
                            ")"),
                        react_1.default.createElement("ul", { className: "dropdown-menu dropdown-menu-end" }, given.artifacts.map((artifact, ai) => (react_1.default.createElement("li", { key: ai },
                            react_1.default.createElement("a", { className: "dropdown-item", href: `reports/${projectName}/${testName.split('.').slice(0, -1).join('.')}/${runtime}/${artifact}`, target: "_blank", rel: "noopener noreferrer" }, artifact.split('/').pop()))))))))),
            react_1.default.createElement("div", { className: "card-body" },
                given.whens.map((when, j) => (react_1.default.createElement("div", { key: `w-${j}`, className: `p-3 mb-2 ${when.error ? 'bg-danger text-white' : 'bg-success text-white'}` },
                    react_1.default.createElement("div", { className: "d-flex justify-content-between align-items-start" },
                        react_1.default.createElement("div", null,
                            react_1.default.createElement("div", null,
                                react_1.default.createElement("strong", null, "When:"),
                                " ",
                                when.name,
                                when.features && when.features.length > 0 && (react_1.default.createElement("div", { className: "mt-2" },
                                    react_1.default.createElement("small", null, "Features:"),
                                    react_1.default.createElement("ul", { className: "list-unstyled" }, when.features.map((feature, fi) => (react_1.default.createElement("li", { key: fi }, feature.startsWith('http') ? (react_1.default.createElement("a", { href: feature, target: "_blank", rel: "noopener noreferrer" }, new URL(feature).hostname)) : (feature))))))),
                                when.error && react_1.default.createElement("pre", { className: "mt-2" }, when.error))),
                        when.artifacts && when.artifacts.length > 0 && (react_1.default.createElement("div", { className: "ms-3" },
                            react_1.default.createElement("strong", null, "Artifacts:"),
                            react_1.default.createElement("ul", { className: "list-unstyled" }, when.artifacts.map((artifact, ai) => (react_1.default.createElement("li", { key: ai },
                                react_1.default.createElement("a", { href: `reports/${projectName}/${testName.split('.').slice(0, -1).join('.')}/${runtime}/${artifact}`, target: "_blank", className: "text-white", rel: "noopener noreferrer" }, artifact.split('/').pop()))))))))))),
                given.thens.map((then, k) => (react_1.default.createElement("div", { key: `t-${k}`, className: `p-3 mb-2 ${then.error ? 'bg-danger text-white' : 'bg-success text-white'}` },
                    react_1.default.createElement("div", { className: "d-flex justify-content-between align-items-start" },
                        react_1.default.createElement("div", null,
                            react_1.default.createElement("div", null,
                                react_1.default.createElement("strong", null, "Then:"),
                                " ",
                                then.name,
                                then.features && then.features.length > 0 && (react_1.default.createElement("div", { className: "mt-2" },
                                    react_1.default.createElement("small", null, "Features:"),
                                    react_1.default.createElement("ul", { className: "list-unstyled" }, then.features.map((feature, fi) => (react_1.default.createElement("li", { key: fi }, feature.startsWith('http') ? (react_1.default.createElement("a", { href: feature, target: "_blank", rel: "noopener noreferrer" }, new URL(feature).hostname)) : (feature))))))),
                                then.error && react_1.default.createElement("pre", { className: "mt-2" }, then.error))),
                        then.artifacts && then.artifacts.length > 0 && (react_1.default.createElement("div", { className: "ms-3" },
                            react_1.default.createElement("strong", null, "Artifacts:"),
                            react_1.default.createElement("ul", { className: "list-unstyled" }, then.artifacts.map((artifact, ai) => (react_1.default.createElement("li", { key: ai },
                                react_1.default.createElement("a", { href: `reports/${projectName}/${testName.split('.').slice(0, -1).join('.')}/${runtime}/${artifact}`, target: "_blank", className: "text-white", rel: "noopener noreferrer" }, artifact.split('/').pop())))))))))))))))));
    };
    return (react_1.default.createElement(react_bootstrap_1.Container, { fluid: true, className: "px-0" },
        react_1.default.createElement(NavBar_1.NavBar, { title: decodedTestPath, backLink: `/projects/${projectName}`, navItems: [
                {
                    label: '',
                    badge: {
                        variant: runtime === 'node' ? 'primary' :
                            runtime === 'web' ? 'success' :
                                'info',
                        text: runtime
                    },
                    className: 'pe-none d-flex align-items-center gap-2'
                }
            ], rightContent: react_1.default.createElement(react_bootstrap_1.Button, { variant: "info", onClick: async () => {
                    try {
                        const promptPath = `testeranto/reports/${projectName}/${testName.split('.').slice(0, -1).join('.')}/${runtime}/prompt.txt`;
                        const messagePath = `testeranto/reports/${projectName}/${testName.split('.').slice(0, -1).join('.')}/${runtime}/message.txt`;
                        const command = `aider --load ${promptPath} --message-file ${messagePath}`;
                        await navigator.clipboard.writeText(command);
                        alert("Copied aider command to clipboard!");
                    }
                    catch (err) {
                        alert("Failed to copy command to clipboard");
                        console.error("Copy failed:", err);
                    }
                }, className: "ms-2" }, "\uD83E\uDD16") }),
        react_1.default.createElement(react_bootstrap_1.Row, { className: "g-0" },
            react_1.default.createElement(react_bootstrap_1.Col, { sm: 3, className: "border-end" },
                react_1.default.createElement(react_bootstrap_1.Nav, { variant: "pills", className: "flex-column" }, Object.keys(logs).map((logName) => {
                    var _a;
                    const displayName = logName.replace('.json', '').replace(/_/g, ' ');
                    let statusIndicator = null;
                    // Add error indicators for specific log types
                    if (logName === 'type_errors.txt' && errorCounts.typeErrors > 0) {
                        statusIndicator = react_1.default.createElement("span", { className: "ms-1" },
                            "\u274C ",
                            errorCounts.typeErrors);
                    }
                    else if (logName === 'lint_errors.txt' && errorCounts.staticErrors > 0) {
                        statusIndicator = react_1.default.createElement("span", { className: "ms-1" },
                            "\u274C ",
                            errorCounts.staticErrors);
                    }
                    else if (logName === 'stderr.log' && errorCounts.runTimeErrors > 0) {
                        statusIndicator = react_1.default.createElement("span", { className: "ms-1" },
                            "\u274C ",
                            errorCounts.runTimeErrors);
                    }
                    else if (logName === 'exit.log' && ((_a = logs['exit.log']) === null || _a === void 0 ? void 0 : _a.trim()) !== '0') {
                        statusIndicator = react_1.default.createElement("span", { className: "ms-1" }, "\u26A0\uFE0F");
                    }
                    else if (logName === 'tests.json' && logs['tests.json']) {
                        statusIndicator = react_1.default.createElement("div", { className: "ms-1" },
                            react_1.default.createElement(TestStatusBadge_1.TestStatusBadge, { testName: decodedTestPath, testsExist: testsExist, runTimeErrors: errorCounts.runTimeErrors, typeErrors: errorCounts.typeErrors, staticErrors: errorCounts.staticErrors, variant: "compact", className: "mt-1" }));
                    }
                    return (react_1.default.createElement(react_bootstrap_1.Nav.Item, { key: logName },
                        react_1.default.createElement(react_bootstrap_1.Nav.Link, { eventKey: logName, active: activeTab === logName, onClick: () => setActiveTab(logName), className: "d-flex flex-column align-items-start" },
                            react_1.default.createElement("div", { className: "d-flex justify-content-between w-100" },
                                react_1.default.createElement("span", { className: "text-capitalize" }, displayName),
                                statusIndicator))));
                }))),
            react_1.default.createElement(react_bootstrap_1.Col, { sm: 9 },
                react_1.default.createElement("div", { className: "p-3" }, !testsExist && activeTab === 'tests.json' ? (react_1.default.createElement(react_bootstrap_1.Alert, { variant: "danger" },
                    react_1.default.createElement("h4", null, "Tests did not run to completion"),
                    react_1.default.createElement("p", null, "The test results file (tests.json) was not found or could not be loaded."))) : activeTab === 'tests.json' && logs['tests.json'] ? (typeof logs['tests.json'] === 'string'
                    ? renderTestResults(JSON.parse(logs['tests.json']))
                    : renderTestResults(logs['tests.json'])) : logs[activeTab] ? (react_1.default.createElement("pre", { className: "bg-dark text-white p-3" },
                    react_1.default.createElement("code", null, typeof logs[activeTab] === 'string'
                        ? logs[activeTab]
                        : JSON.stringify(logs[activeTab], null, 2)))) : (react_1.default.createElement(react_bootstrap_1.Alert, { variant: "info" }, "No content available for this log")))))));
};
exports.TestPageView = TestPageView;
