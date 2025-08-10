/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Container, Row, Col, Nav, Alert, Button } from 'react-bootstrap';
import { NavBar } from './NavBar';
import { TestStatusBadge } from '../TestStatusBadge';
export const TestPageView = ({ projectName, testName, decodedTestPath, runtime, testsExist, errorCounts, logs, }) => {
    const [activeTab, setActiveTab] = React.useState('tests.json');
    const renderTestResults = (testData) => {
        return (React.createElement("div", { className: "test-results" }, testData.givens.map((given, i) => (React.createElement("div", { key: i, className: "mb-4 card" },
            React.createElement("div", { className: "card-header bg-primary text-white" },
                React.createElement("div", { className: "d-flex justify-content-between align-items-center" },
                    React.createElement("div", null,
                        React.createElement("h4", null,
                            "Given: ",
                            given.name),
                        given.features && given.features.length > 0 && (React.createElement("div", { className: "mt-1" },
                            React.createElement("small", null, "Features:"),
                            React.createElement("ul", { className: "list-unstyled" }, given.features.map((feature, fi) => (React.createElement("li", { key: fi }, feature.startsWith('http') ? (React.createElement("a", { href: feature, target: "_blank", rel: "noopener noreferrer", className: "text-white" }, new URL(feature).hostname)) : (React.createElement("span", { className: "text-white" }, feature))))))))),
                    given.artifacts && given.artifacts.length > 0 && (React.createElement("div", { className: "dropdown" },
                        React.createElement("button", { className: "btn btn-sm btn-light dropdown-toggle", type: "button", "data-bs-toggle": "dropdown" },
                            "Artifacts (",
                            given.artifacts.length,
                            ")"),
                        React.createElement("ul", { className: "dropdown-menu dropdown-menu-end" }, given.artifacts.map((artifact, ai) => (React.createElement("li", { key: ai },
                            React.createElement("a", { className: "dropdown-item", href: `reports/${projectName}/${testName.split('.').slice(0, -1).join('.')}/${runtime}/${artifact}`, target: "_blank", rel: "noopener noreferrer" }, artifact.split('/').pop()))))))))),
            React.createElement("div", { className: "card-body" },
                given.whens.map((when, j) => (React.createElement("div", { key: `w-${j}`, className: `p-3 mb-2 ${when.error ? 'bg-danger text-white' : 'bg-success text-white'}` },
                    React.createElement("div", { className: "d-flex justify-content-between align-items-start" },
                        React.createElement("div", null,
                            React.createElement("div", null,
                                React.createElement("strong", null, "When:"),
                                " ",
                                when.name,
                                when.features && when.features.length > 0 && (React.createElement("div", { className: "mt-2" },
                                    React.createElement("small", null, "Features:"),
                                    React.createElement("ul", { className: "list-unstyled" }, when.features.map((feature, fi) => (React.createElement("li", { key: fi }, feature.startsWith('http') ? (React.createElement("a", { href: feature, target: "_blank", rel: "noopener noreferrer" }, new URL(feature).hostname)) : (feature))))))),
                                when.error && React.createElement("pre", { className: "mt-2" }, when.error))),
                        when.artifacts && when.artifacts.length > 0 && (React.createElement("div", { className: "ms-3" },
                            React.createElement("strong", null, "Artifacts:"),
                            React.createElement("ul", { className: "list-unstyled" }, when.artifacts.map((artifact, ai) => (React.createElement("li", { key: ai },
                                React.createElement("a", { href: `reports/${projectName}/${testName.split('.').slice(0, -1).join('.')}/${runtime}/${artifact}`, target: "_blank", className: "text-white", rel: "noopener noreferrer" }, artifact.split('/').pop()))))))))))),
                given.thens.map((then, k) => (React.createElement("div", { key: `t-${k}`, className: `p-3 mb-2 ${then.error ? 'bg-danger text-white' : 'bg-success text-white'}` },
                    React.createElement("div", { className: "d-flex justify-content-between align-items-start" },
                        React.createElement("div", null,
                            React.createElement("div", null,
                                React.createElement("strong", null, "Then:"),
                                " ",
                                then.name,
                                then.features && then.features.length > 0 && (React.createElement("div", { className: "mt-2" },
                                    React.createElement("small", null, "Features:"),
                                    React.createElement("ul", { className: "list-unstyled" }, then.features.map((feature, fi) => (React.createElement("li", { key: fi }, feature.startsWith('http') ? (React.createElement("a", { href: feature, target: "_blank", rel: "noopener noreferrer" }, new URL(feature).hostname)) : (feature))))))),
                                then.error && React.createElement("pre", { className: "mt-2" }, then.error))),
                        then.artifacts && then.artifacts.length > 0 && (React.createElement("div", { className: "ms-3" },
                            React.createElement("strong", null, "Artifacts:"),
                            React.createElement("ul", { className: "list-unstyled" }, then.artifacts.map((artifact, ai) => (React.createElement("li", { key: ai },
                                React.createElement("a", { href: `reports/${projectName}/${testName.split('.').slice(0, -1).join('.')}/${runtime}/${artifact}`, target: "_blank", className: "text-white", rel: "noopener noreferrer" }, artifact.split('/').pop())))))))))))))))));
    };
    return (React.createElement(Container, { fluid: true, className: "px-0" },
        React.createElement(NavBar, { title: decodedTestPath, backLink: `/projects/${projectName}`, navItems: [
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
            ], rightContent: React.createElement(Button, { variant: "info", onClick: async () => {
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
        React.createElement(Row, { className: "g-0" },
            React.createElement(Col, { sm: 3, className: "border-end" },
                React.createElement(Nav, { variant: "pills", className: "flex-column" }, Object.keys(logs).map((logName) => {
                    var _a;
                    const displayName = logName.replace('.json', '').replace(/_/g, ' ');
                    let statusIndicator = null;
                    // Add error indicators for specific log types
                    if (logName === 'type_errors.txt' && errorCounts.typeErrors > 0) {
                        statusIndicator = React.createElement("span", { className: "ms-1" },
                            "\u274C ",
                            errorCounts.typeErrors);
                    }
                    else if (logName === 'lint_errors.txt' && errorCounts.staticErrors > 0) {
                        statusIndicator = React.createElement("span", { className: "ms-1" },
                            "\u274C ",
                            errorCounts.staticErrors);
                    }
                    else if (logName === 'stderr.log' && errorCounts.runTimeErrors > 0) {
                        statusIndicator = React.createElement("span", { className: "ms-1" },
                            "\u274C ",
                            errorCounts.runTimeErrors);
                    }
                    else if (logName === 'exit.log' && ((_a = logs['exit.log']) === null || _a === void 0 ? void 0 : _a.trim()) !== '0') {
                        statusIndicator = React.createElement("span", { className: "ms-1" }, "\u26A0\uFE0F");
                    }
                    else if (logName === 'tests.json' && logs['tests.json']) {
                        statusIndicator = React.createElement("div", { className: "ms-1" },
                            React.createElement(TestStatusBadge, { testName: decodedTestPath, testsExist: testsExist, runTimeErrors: errorCounts.runTimeErrors, typeErrors: errorCounts.typeErrors, staticErrors: errorCounts.staticErrors, variant: "compact", className: "mt-1" }));
                    }
                    return (React.createElement(Nav.Item, { key: logName },
                        React.createElement(Nav.Link, { eventKey: logName, active: activeTab === logName, onClick: () => setActiveTab(logName), className: "d-flex flex-column align-items-start" },
                            React.createElement("div", { className: "d-flex justify-content-between w-100" },
                                React.createElement("span", { className: "text-capitalize" }, displayName),
                                statusIndicator))));
                }))),
            React.createElement(Col, { sm: 9 },
                React.createElement("div", { className: "p-3" }, !testsExist && activeTab === 'tests.json' ? (React.createElement(Alert, { variant: "danger" },
                    React.createElement("h4", null, "Tests did not run to completion"),
                    React.createElement("p", null, "The test results file (tests.json) was not found or could not be loaded."))) : activeTab === 'tests.json' && logs['tests.json'] ? (typeof logs['tests.json'] === 'string'
                    ? renderTestResults(JSON.parse(logs['tests.json']))
                    : renderTestResults(logs['tests.json'])) : logs[activeTab] ? (React.createElement("pre", { className: "bg-dark text-white p-3" },
                    React.createElement("code", null, typeof logs[activeTab] === 'string'
                        ? logs[activeTab]
                        : JSON.stringify(logs[activeTab], null, 2)))) : (React.createElement(Alert, { variant: "info" }, "No content available for this log")))))));
};
