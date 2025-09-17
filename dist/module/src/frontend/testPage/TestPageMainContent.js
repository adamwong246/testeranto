/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Col, Button } from "react-bootstrap";
import { renderTestResults } from "./TestPageView_utils";
export const TestPageMainContent = ({ selectedFile, buildErrors, projectName, testName, runtime, }) => (React.createElement(Col, { sm: 3, className: "p-0 border-start", style: { height: "calc(100vh - 56px)", overflow: "auto" } },
    React.createElement("div", { className: "p-3" },
        (selectedFile === null || selectedFile === void 0 ? void 0 : selectedFile.path.endsWith("tests.json")) && (React.createElement("div", { className: "test-results-preview" }, typeof selectedFile.content === "string"
            ? renderTestResults(JSON.parse(selectedFile.content), buildErrors, projectName, testName, runtime)
            : renderTestResults(selectedFile.content, buildErrors, projectName, testName, runtime))),
        (selectedFile === null || selectedFile === void 0 ? void 0 : selectedFile.path.match(/\.(png|jpg|jpeg|gif|svg)$/i)) && (React.createElement("div", { className: "text-center" },
            React.createElement("img", { src: selectedFile.content, alt: selectedFile.path, className: "img-fluid", style: { maxHeight: "300px" } }),
            React.createElement("div", { className: "mt-2" },
                React.createElement("a", { href: selectedFile.content, target: "_blank", rel: "noopener noreferrer", className: "btn btn-sm btn-outline-primary" }, "Open Full Size")))),
        (selectedFile === null || selectedFile === void 0 ? void 0 : selectedFile.path.endsWith("build.json")) && (React.createElement("div", null,
            React.createElement("h5", null, "Build Information"),
            (() => {
                var _a, _b;
                try {
                    const buildData = JSON.parse(selectedFile.content);
                    return (React.createElement(React.Fragment, null,
                        ((_a = buildData.errors) === null || _a === void 0 ? void 0 : _a.length) > 0 && (React.createElement("div", { className: "mb-3" },
                            React.createElement("h6", { className: "text-danger" },
                                "Errors (",
                                buildData.errors.length,
                                ")"),
                            React.createElement("ul", { className: "list-unstyled" }, buildData.errors.map((error, index) => (React.createElement("li", { key: index, className: "mb-2 p-2  rounded" },
                                React.createElement("div", { className: "text-danger fw-bold" }, error.text),
                                error.location && (React.createElement("div", { className: "small text-muted" },
                                    "File: ",
                                    error.location.file,
                                    "Line: ",
                                    error.location.line,
                                    "Column: ",
                                    error.location.column)),
                                error.notes && error.notes.length > 0 && (React.createElement("div", { className: "small" },
                                    "Notes:",
                                    React.createElement("ul", null, error.notes.map((note, noteIndex) => (React.createElement("li", { key: noteIndex }, note.text)))))))))))),
                        ((_b = buildData.warnings) === null || _b === void 0 ? void 0 : _b.length) > 0 && (React.createElement("div", { className: "mb-3" },
                            React.createElement("h6", { className: "text-warning" },
                                "Warnings (",
                                buildData.warnings.length,
                                ")"),
                            React.createElement("ul", { className: "list-unstyled" }, buildData.warnings.map((warning, index) => (React.createElement("li", { key: index, className: "mb-2 p-2  rounded" },
                                React.createElement("div", { className: "text-warning fw-bold" }, warning.text),
                                warning.location && (React.createElement("div", { className: "small text-muted" },
                                    "File: ",
                                    warning.location.file,
                                    "Line: ",
                                    warning.location.line,
                                    "Column: ",
                                    warning.location.column)),
                                warning.notes && warning.notes.length > 0 && (React.createElement("div", { className: "small" },
                                    "Notes:",
                                    React.createElement("ul", null, warning.notes.map((note, noteIndex) => (React.createElement("li", { key: noteIndex }, note.text)))))))))))),
                        (!buildData.errors || buildData.errors.length === 0) &&
                            (!buildData.warnings ||
                                buildData.warnings.length === 0) && (React.createElement("div", { className: "alert alert-success" }, "No build errors or warnings"))));
                }
                catch (e) {
                    return (React.createElement("div", { className: "alert alert-danger" },
                        "Error parsing build.json: ",
                        e.message));
                }
            })())),
        (selectedFile === null || selectedFile === void 0 ? void 0 : selectedFile.path.endsWith(".json")) &&
            !selectedFile.path.endsWith("tests.json") &&
            !selectedFile.path.endsWith("build.json") && (React.createElement("pre", { className: " p-2 small" },
            React.createElement("code", null, selectedFile.content))),
        (selectedFile === null || selectedFile === void 0 ? void 0 : selectedFile.path.includes("source_files")) && (React.createElement("div", null,
            React.createElement("div", { className: "mb-2 small text-muted" },
                React.createElement("i", { className: "bi bi-file-earmark-text me-1" }),
                selectedFile.path.split("/").pop()),
            React.createElement(Button, { variant: "outline-primary", size: "sm", className: "mb-2", onClick: () => {
                    // TODO: Add save functionality
                    alert("Save functionality will be implemented here");
                } }, "Save Changes"))))));
