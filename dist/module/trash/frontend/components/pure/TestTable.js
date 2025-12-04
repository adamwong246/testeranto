import React from "react";
import { Table, Badge } from "react-bootstrap";
import { TestStatusBadge } from "../TestStatusBadge";
export const TestTable = ({ testStatuses, projectName, }) => {
    return (React.createElement(Table, { striped: true, bordered: true, hover: true },
        React.createElement("thead", null,
            React.createElement("tr", null,
                React.createElement("th", null, "Test"),
                React.createElement("th", null, "Runtime"),
                React.createElement("th", null, "Status"),
                React.createElement("th", null, "Total Tests"),
                React.createElement("th", null, "Type Errors"),
                React.createElement("th", null, "Lint Errors"))),
        React.createElement("tbody", null, testStatuses.map((test) => (React.createElement("tr", { key: test.testName, "data-testid": `test-row-${test.testName}` },
            React.createElement("td", null,
                React.createElement("a", { href: `#/projects/${projectName}/tests/${encodeURIComponent(test.testName)}/${test.runTime}` }, test.testName)),
            React.createElement("td", null,
                React.createElement(Badge, { bg: "secondary", className: "ms-2" }, test.runTime)),
            React.createElement("td", null,
                React.createElement(TestStatusBadge, { testName: test.testName, testsExist: test.testsExist, runTimeErrors: test.runTimeErrors, typeErrors: test.typeErrors, staticErrors: test.staticErrors })),
            React.createElement("td", null, test.runTimeTests >= 0 ? test.runTimeTests : "N/A"),
            React.createElement("td", null,
                React.createElement("a", { href: `#/projects/${projectName}/tests/${encodeURIComponent(test.testName)}/${test.runTime}#types` }, test.typeErrors > 0 ? `❌ ${test.typeErrors}` : "✅")),
            React.createElement("td", null,
                React.createElement("a", { href: `#/projects/${projectName}/tests/${encodeURIComponent(test.testName)}/${test.runTime}#lint` }, test.staticErrors > 0 ? `❌ ${test.staticErrors}` : "✅"))))))));
};
