import React from "react";
import { Table, Alert } from "react-bootstrap";
export const ProjectsPageView = ({ projects, summaries, configs, loading, error, navigate, }) => {
    const getStatusIcon = (status) => {
        switch (status) {
            case "success":
                return "✅";
            case "failed":
                return "❌";
            case "warning":
                return "⚠️";
            default:
                return "❓";
        }
    };
    if (loading)
        return React.createElement("div", null, "Loading projects...");
    if (error)
        return React.createElement(Alert, { variant: "danger" },
            "Error: ",
            error);
    return (React.createElement("div", { className: "" },
        React.createElement(Table, { striped: true, bordered: true, hover: true, responsive: true },
            React.createElement("thead", null,
                React.createElement("tr", null,
                    React.createElement("th", null, "Project"),
                    React.createElement("th", null, "Tests"),
                    React.createElement("th", null, "Node"),
                    React.createElement("th", null, "Web"),
                    React.createElement("th", null, "Pure"))),
            React.createElement("tbody", null, projects.map((project) => (React.createElement("tr", { key: project.name },
                React.createElement("td", null,
                    React.createElement("a", { href: "#", onClick: (e) => {
                            e.preventDefault();
                            navigate(`/projects/${project.name}`);
                        } }, project.name)),
                React.createElement("td", null,
                    React.createElement("div", null, summaries[project.name] ? (Object.keys(summaries[project.name]).map((testName) => {
                        var _a, _b, _c;
                        const testData = summaries[project.name][testName];
                        const runTime = ((_c = (_b = (_a = configs[project.name]) === null || _a === void 0 ? void 0 : _a.tests) === null || _b === void 0 ? void 0 : _b.find((t) => t[0] === testName)) === null || _c === void 0 ? void 0 : _c[1]) || "node";
                        const hasRuntimeErrors = testData.runTimeErrors > 0;
                        const hasStaticErrors = testData.typeErrors > 0 || testData.staticErrors > 0;
                        return (React.createElement("div", { key: testName },
                            React.createElement("a", { href: `#/projects/${project.name}/tests/${encodeURIComponent(testName)}/${runTime}` },
                                hasRuntimeErrors
                                    ? "❌ "
                                    : hasStaticErrors
                                        ? "⚠️ "
                                        : "",
                                testName.split("/").pop() || testName)));
                    })) : (React.createElement("div", null, "Loading tests...")))),
                React.createElement("td", null,
                    React.createElement("a", { href: `#/projects/${project.name}#node` },
                        getStatusIcon(project.nodeStatus),
                        " Node build logs")),
                React.createElement("td", null,
                    React.createElement("a", { href: `#/projects/${project.name}#web` },
                        getStatusIcon(project.webStatus),
                        " Web build logs")),
                React.createElement("td", null,
                    React.createElement("a", { href: `#/projects/${project.name}#pure` },
                        getStatusIcon(project.pureStatus),
                        " Pure build logs")))))))));
};
