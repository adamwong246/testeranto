"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestTable = void 0;
const react_1 = __importDefault(require("react"));
const react_bootstrap_1 = require("react-bootstrap");
const TestStatusBadge_1 = require("../TestStatusBadge");
const TestTable = ({ testStatuses, projectName, }) => {
    return (react_1.default.createElement(react_bootstrap_1.Table, { striped: true, bordered: true, hover: true },
        react_1.default.createElement("thead", null,
            react_1.default.createElement("tr", null,
                react_1.default.createElement("th", null, "Test"),
                react_1.default.createElement("th", null, "Runtime"),
                react_1.default.createElement("th", null, "Status"),
                react_1.default.createElement("th", null, "Total Tests"),
                react_1.default.createElement("th", null, "Type Errors"),
                react_1.default.createElement("th", null, "Lint Errors"))),
        react_1.default.createElement("tbody", null, testStatuses.map((test) => (react_1.default.createElement("tr", { key: test.testName, "data-testid": `test-row-${test.testName}` },
            react_1.default.createElement("td", null,
                react_1.default.createElement("a", { href: `#/projects/${projectName}/tests/${encodeURIComponent(test.testName)}/${test.runTime}` }, test.testName)),
            react_1.default.createElement("td", null,
                react_1.default.createElement(react_bootstrap_1.Badge, { bg: "secondary", className: "ms-2" }, test.runTime)),
            react_1.default.createElement("td", null,
                react_1.default.createElement(TestStatusBadge_1.TestStatusBadge, { testName: test.testName, testsExist: test.testsExist, runTimeErrors: test.runTimeErrors, typeErrors: test.typeErrors, staticErrors: test.staticErrors })),
            react_1.default.createElement("td", null, test.runTimeTests >= 0 ? test.runTimeTests : "N/A"),
            react_1.default.createElement("td", null,
                react_1.default.createElement("a", { href: `#/projects/${projectName}/tests/${encodeURIComponent(test.testName)}/${test.runTime}#types` }, test.typeErrors > 0 ? `❌ ${test.typeErrors}` : "✅")),
            react_1.default.createElement("td", null,
                react_1.default.createElement("a", { href: `#/projects/${projectName}/tests/${encodeURIComponent(test.testName)}/${test.runTime}#lint` }, test.staticErrors > 0 ? `❌ ${test.staticErrors}` : "✅"))))))));
};
exports.TestTable = TestTable;
