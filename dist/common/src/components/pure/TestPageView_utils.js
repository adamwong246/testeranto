"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderTestResults = exports.getLanguage = void 0;
const react_1 = __importDefault(require("react"));
// Determine language from file extension
const getLanguage = (path) => {
    var _a;
    const ext = (_a = path.split(".").pop()) === null || _a === void 0 ? void 0 : _a.toLowerCase();
    switch (ext) {
        case "ts":
            return "typescript";
        case "tsx":
            return "typescript";
        case "js":
            return "javascript";
        case "json":
            return "json";
        case "md":
            return "markdown";
        default:
            return "plaintext";
    }
};
exports.getLanguage = getLanguage;
const renderTestResults = (testData, buildErrors, projectName, testName, runtime) => {
    return (react_1.default.createElement("div", { className: "test-results" },
        testData.givens.map((given, i) => (react_1.default.createElement("div", { key: i, className: "mb-4 card" },
            react_1.default.createElement("div", { className: "card-header bg-primary text-white" },
                react_1.default.createElement("div", { className: "d-flex justify-content-between align-items-center" },
                    react_1.default.createElement("div", null,
                        react_1.default.createElement("h4", null,
                            "Given: ",
                            given.name),
                        given.features && given.features.length > 0 && (react_1.default.createElement("div", { className: "mt-1" },
                            react_1.default.createElement("small", null, "Features:"),
                            react_1.default.createElement("ul", { className: "list-unstyled" }, given.features.map((feature, fi) => (react_1.default.createElement("li", { key: fi }, feature.startsWith("http") ? (react_1.default.createElement("a", { href: feature, target: "_blank", rel: "noopener noreferrer", className: "text-white" }, new URL(feature).hostname)) : (react_1.default.createElement("span", { className: "text-white" }, feature))))))))),
                    given.artifacts && given.artifacts.length > 0 && (react_1.default.createElement("div", { className: "dropdown" },
                        react_1.default.createElement("button", { className: "btn btn-sm btn-light dropdown-toggle", type: "button", "data-bs-toggle": "dropdown" },
                            "Artifacts (",
                            given.artifacts.length,
                            ")"),
                        react_1.default.createElement("ul", { className: "dropdown-menu dropdown-menu-end" }, given.artifacts.map((artifact, ai) => (react_1.default.createElement("li", { key: ai },
                            react_1.default.createElement("a", { className: "dropdown-item", href: `reports/${projectName}/${testName
                                    .split(".")
                                    .slice(0, -1)
                                    .join(".")}/${runtime}/${artifact}`, target: "_blank", rel: "noopener noreferrer" }, artifact.split("/").pop()))))))))),
            react_1.default.createElement("div", { className: "card-body" },
                given.whens.map((when, j) => (react_1.default.createElement("div", { key: `w-${j}`, className: `p-3 mb-2 ${when.error ? "bg-danger text-white" : "bg-success text-white"}` },
                    react_1.default.createElement("div", { className: "d-flex justify-content-between align-items-start" },
                        react_1.default.createElement("div", null,
                            react_1.default.createElement("div", null,
                                react_1.default.createElement("strong", null, "When:"),
                                " ",
                                when.name,
                                when.features && when.features.length > 0 && (react_1.default.createElement("div", { className: "mt-2" },
                                    react_1.default.createElement("small", null, "Features:"),
                                    react_1.default.createElement("ul", { className: "list-unstyled" }, when.features.map((feature, fi) => (react_1.default.createElement("li", { key: fi }, feature.startsWith("http") ? (react_1.default.createElement("a", { href: feature, target: "_blank", rel: "noopener noreferrer" }, new URL(feature).hostname)) : (feature))))))),
                                when.error && react_1.default.createElement("pre", { className: "mt-2" }, when.error))),
                        when.artifacts && when.artifacts.length > 0 && (react_1.default.createElement("div", { className: "ms-3" },
                            react_1.default.createElement("strong", null, "Artifacts:"),
                            react_1.default.createElement("ul", { className: "list-unstyled" }, when.artifacts.map((artifact, ai) => (react_1.default.createElement("li", { key: ai },
                                react_1.default.createElement("a", { href: `reports/${projectName}/${testName
                                        .split(".")
                                        .slice(0, -1)
                                        .join(".")}/${runtime}/${artifact}`, target: "_blank", className: "text-white", rel: "noopener noreferrer" }, artifact.split("/").pop()))))))))))),
                given.thens.map((then, k) => (react_1.default.createElement("div", { key: `t-${k}`, className: `p-3 mb-2 ${then.error ? "bg-danger text-white" : "bg-success text-white"}` },
                    react_1.default.createElement("div", { className: "d-flex justify-content-between align-items-start" },
                        react_1.default.createElement("div", null,
                            react_1.default.createElement("div", null,
                                react_1.default.createElement("strong", null, "Then:"),
                                " ",
                                then.name,
                                then.features && then.features.length > 0 && (react_1.default.createElement("div", { className: "mt-2" },
                                    react_1.default.createElement("small", null, "Features:"),
                                    react_1.default.createElement("ul", { className: "list-unstyled" }, then.features.map((feature, fi) => (react_1.default.createElement("li", { key: fi }, feature.startsWith("http") ? (react_1.default.createElement("a", { href: feature, target: "_blank", rel: "noopener noreferrer" }, new URL(feature).hostname)) : (feature))))))),
                                then.error && react_1.default.createElement("pre", { className: "mt-2" }, then.error))),
                        then.artifacts && then.artifacts.length > 0 && (react_1.default.createElement("div", { className: "ms-3" },
                            react_1.default.createElement("strong", null, "Artifacts:"),
                            react_1.default.createElement("ul", { className: "list-unstyled" }, then.artifacts.map((artifact, ai) => (react_1.default.createElement("li", { key: ai },
                                react_1.default.createElement("a", { href: `reports/${projectName}/${testName
                                        .split(".")
                                        .slice(0, -1)
                                        .join(".")}/${runtime}/${artifact}`, target: "_blank", className: "text-white", rel: "noopener noreferrer" }, artifact.split("/").pop()))))))))))))))),
        (buildErrors.errors.length > 0 || buildErrors.warnings.length > 0) && (react_1.default.createElement("div", { className: "mb-4 card border-danger" },
            react_1.default.createElement("div", { className: "card-header bg-danger text-white" },
                react_1.default.createElement("h4", null, "Build Errors and Warnings")),
            react_1.default.createElement("div", { className: "card-body" },
                buildErrors.errors.length > 0 && (react_1.default.createElement(react_1.default.Fragment, null,
                    react_1.default.createElement("h5", null, "Errors"),
                    react_1.default.createElement("ul", null, buildErrors.errors.map((error, idx) => (react_1.default.createElement("li", { key: `build-error-${idx}` },
                        react_1.default.createElement("strong", null, error.text),
                        error.location && (react_1.default.createElement("div", null,
                            "File: ",
                            error.location.file,
                            " Line:",
                            " ",
                            error.location.line,
                            " Column: ",
                            error.location.column)))))))),
                buildErrors.warnings.length > 0 && (react_1.default.createElement(react_1.default.Fragment, null,
                    react_1.default.createElement("h5", null, "Warnings"),
                    react_1.default.createElement("ul", null, buildErrors.warnings.map((warning, idx) => (react_1.default.createElement("li", { key: `build-warning-${idx}` },
                        react_1.default.createElement("strong", null, warning.text),
                        warning.location && (react_1.default.createElement("div", null,
                            "File: ",
                            warning.location.file,
                            " Line:",
                            " ",
                            warning.location.line,
                            " Column:",
                            " ",
                            warning.location.column)))))))))))));
};
exports.renderTestResults = renderTestResults;
