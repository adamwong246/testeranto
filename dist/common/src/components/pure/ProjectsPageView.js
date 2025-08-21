"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectsPageView = void 0;
const react_1 = __importDefault(require("react"));
const react_bootstrap_1 = require("react-bootstrap");
const ProjectsPageView = ({ projects, summaries, configs, loading, error, navigate, }) => {
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
        return react_1.default.createElement("div", null, "Loading projects...");
    if (error)
        return react_1.default.createElement(react_bootstrap_1.Alert, { variant: "danger" },
            "Error: ",
            error);
    return (react_1.default.createElement("div", { className: "" },
        react_1.default.createElement(react_bootstrap_1.Table, { striped: true, bordered: true, hover: true, responsive: true },
            react_1.default.createElement("thead", null,
                react_1.default.createElement("tr", null,
                    react_1.default.createElement("th", null, "Project"),
                    react_1.default.createElement("th", null, "Tests"),
                    react_1.default.createElement("th", null, "Node"),
                    react_1.default.createElement("th", null, "Web"),
                    react_1.default.createElement("th", null, "Pure"))),
            react_1.default.createElement("tbody", null, projects.map((project) => (react_1.default.createElement("tr", { key: project.name },
                react_1.default.createElement("td", null,
                    react_1.default.createElement("a", { href: "#", onClick: (e) => {
                            e.preventDefault();
                            navigate(`/projects/${project.name}`);
                        } }, project.name)),
                react_1.default.createElement("td", null,
                    react_1.default.createElement("div", null, summaries[project.name] ? (Object.keys(summaries[project.name]).map((testName) => {
                        var _a, _b, _c;
                        const testData = summaries[project.name][testName];
                        const runTime = ((_c = (_b = (_a = configs[project.name]) === null || _a === void 0 ? void 0 : _a.tests) === null || _b === void 0 ? void 0 : _b.find((t) => t[0] === testName)) === null || _c === void 0 ? void 0 : _c[1]) || "node";
                        const hasRuntimeErrors = testData.runTimeErrors > 0;
                        const hasStaticErrors = testData.typeErrors > 0 || testData.staticErrors > 0;
                        return (react_1.default.createElement("div", { key: testName },
                            react_1.default.createElement("a", { href: `#/projects/${project.name}/tests/${encodeURIComponent(testName)}/${runTime}` },
                                hasRuntimeErrors
                                    ? "❌ "
                                    : hasStaticErrors
                                        ? "⚠️ "
                                        : "",
                                testName.split("/").pop() || testName)));
                    })) : (react_1.default.createElement("div", null, "Loading tests...")))),
                react_1.default.createElement("td", null,
                    react_1.default.createElement("a", { href: `#/projects/${project.name}#node` },
                        getStatusIcon(project.nodeStatus),
                        " Node build logs")),
                react_1.default.createElement("td", null,
                    react_1.default.createElement("a", { href: `#/projects/${project.name}#web` },
                        getStatusIcon(project.webStatus),
                        " Web build logs")),
                react_1.default.createElement("td", null,
                    react_1.default.createElement("a", { href: `#/projects/${project.name}#pure` },
                        getStatusIcon(project.pureStatus),
                        " Pure build logs")))))))));
};
exports.ProjectsPageView = ProjectsPageView;
