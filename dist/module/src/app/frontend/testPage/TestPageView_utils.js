import React from "react";
// Determine language from file extension
export const getLanguage = (path) => {
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
        case "py":
            return "python";
        default:
            return "plaintext";
    }
};
const statusToClassName = (status) => {
    if (status === undefined)
        return "bg-secondary";
    if (status === false)
        return "bg-danger";
    if (status === true)
        return "bg-success";
    throw `idk status: ${status}`;
};
export const renderTestResults = (testData, buildErrors, projectName, testName, runtime) => {
    return (React.createElement("div", { className: "test-results" },
        testData.givens.map((given, i) => (React.createElement("div", { key: i, className: "mb-4 card " },
            React.createElement("div", { className: `card-header ${statusToClassName(given.status)} text-white` },
                React.createElement("div", { className: "d-flex justify-content-between align-items-center" },
                    React.createElement("div", null,
                        React.createElement("h4", null,
                            "Given: ",
                            given.name),
                        given.features && given.features.length > 0 && (React.createElement("div", { className: "mt-1" },
                            React.createElement("small", null, "Features:"),
                            React.createElement("ul", { className: "list-unstyled" }, given.features.map((feature, fi) => (React.createElement("li", { key: fi }, feature.startsWith("http") ? (React.createElement("a", { href: feature, target: "_blank", rel: "noopener noreferrer", className: "text-white" }, new URL(feature).hostname)) : (React.createElement("span", { className: "text-white" }, feature))))))))),
                    given.artifacts && given.artifacts.length > 0 && (React.createElement("div", { className: "dropdown" },
                        React.createElement("button", { className: "btn btn-sm btn-light dropdown-toggle", type: "button", "data-bs-toggle": "dropdown" },
                            "Artifacts (",
                            given.artifacts.length,
                            ")"),
                        React.createElement("ul", { className: "dropdown-menu dropdown-menu-end" }, given.artifacts.map((artifact, ai) => (React.createElement("li", { key: ai },
                            React.createElement("a", { className: "dropdown-item", href: `reports/${projectName}/${testName
                                    .split(".")
                                    .slice(0, -1)
                                    .join(".")}/${runtime}/${artifact}`, target: "_blank", rel: "noopener noreferrer" }, artifact.split("/").pop()))))))))),
            React.createElement("div", { className: "card-body" },
                given.whens.map((when, j) => (React.createElement("div", { key: `w-${j}`, className: `p-3 mb-2 text-white ${statusToClassName(when.status)}` },
                    React.createElement("div", { className: "d-flex justify-content-between align-items-start" },
                        React.createElement("div", null,
                            React.createElement("div", null,
                                React.createElement("strong", null, "When:"),
                                " ",
                                when.name,
                                when.features && when.features.length > 0 && (React.createElement("div", { className: "mt-2" },
                                    React.createElement("small", null, "Features:"),
                                    React.createElement("ul", { className: "list-unstyled" }, when.features.map((feature, fi) => (React.createElement("li", { key: fi }, feature.startsWith("http") ? (React.createElement("a", { href: feature, target: "_blank", rel: "noopener noreferrer" }, new URL(feature).hostname)) : (feature))))))),
                                when.error && React.createElement("pre", { className: "mt-2" }, when.error))),
                        when.artifacts && when.artifacts.length > 0 && (React.createElement("div", { className: "ms-3" },
                            React.createElement("strong", null, "Artifacts:"),
                            React.createElement("ul", { className: "list-unstyled" }, when.artifacts.map((artifact, ai) => (React.createElement("li", { key: ai },
                                React.createElement("a", { href: `reports/${projectName}/${testName
                                        .split(".")
                                        .slice(0, -1)
                                        .join(".")}/${runtime}/${artifact}`, target: "_blank", className: "text-white", rel: "noopener noreferrer" }, artifact.split("/").pop()))))))))))),
                given.thens.map((then, k) => (React.createElement("div", { key: `t-${k}`, className: `p-3 mb-2 text-white ${statusToClassName(then.status)}` },
                    React.createElement("div", { className: "d-flex justify-content-between align-items-start" },
                        React.createElement("div", null,
                            React.createElement("div", null,
                                React.createElement("strong", null, "Then:"),
                                " ",
                                then.name,
                                then.features && then.features.length > 0 && (React.createElement("div", { className: "mt-2" },
                                    React.createElement("small", null, "Features:"),
                                    React.createElement("ul", { className: "list-unstyled" }, then.features.map((feature, fi) => (React.createElement("li", { key: fi }, feature.startsWith("http") ? (React.createElement("a", { href: feature, target: "_blank", rel: "noopener noreferrer" }, new URL(feature).hostname)) : (feature))))))),
                                then.error && React.createElement("pre", { className: "mt-2" }, then.error))),
                        then.artifacts && then.artifacts.length > 0 && (React.createElement("div", { className: "ms-3" },
                            React.createElement("strong", null, "Artifacts:"),
                            React.createElement("ul", { className: "list-unstyled" }, then.artifacts.map((artifact, ai) => (React.createElement("li", { key: ai },
                                React.createElement("a", { href: `reports/${projectName}/${testName
                                        .split(".")
                                        .slice(0, -1)
                                        .join(".")}/${runtime}/${artifact}`, target: "_blank", className: "text-white", rel: "noopener noreferrer" }, artifact.split("/").pop()))))))))))))))),
        (buildErrors.errors.length > 0 || buildErrors.warnings.length > 0) && (React.createElement("div", { className: "mb-4 card border-danger" },
            React.createElement("div", { className: "card-header bg-danger text-white" },
                React.createElement("h4", null, "Build Errors and Warnings")),
            React.createElement("div", { className: "card-body" },
                buildErrors.errors.length > 0 && (React.createElement(React.Fragment, null,
                    React.createElement("h5", null, "Errors"),
                    React.createElement("ul", null, buildErrors.errors.map((error, idx) => (React.createElement("li", { key: `build-error-${idx}` },
                        React.createElement("strong", null, error.text),
                        error.location && (React.createElement("div", null,
                            "File: ",
                            error.location.file,
                            " Line:",
                            " ",
                            error.location.line,
                            " Column: ",
                            error.location.column)))))))),
                buildErrors.warnings.length > 0 && (React.createElement(React.Fragment, null,
                    React.createElement("h5", null, "Warnings"),
                    React.createElement("ul", null, buildErrors.warnings.map((warning, idx) => (React.createElement("li", { key: `build-warning-${idx}` },
                        React.createElement("strong", null, warning.text),
                        warning.location && (React.createElement("div", null,
                            "File: ",
                            warning.location.file,
                            " Line:",
                            " ",
                            warning.location.line,
                            " Column:",
                            " ",
                            warning.location.column)))))))))))));
};
