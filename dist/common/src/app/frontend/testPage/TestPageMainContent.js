"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestPageMainContent = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
const react_1 = __importDefault(require("react"));
const react_bootstrap_1 = require("react-bootstrap");
const TestPageView_utils_1 = require("./TestPageView_utils");
const TestPageMainContent = ({ selectedFile, buildErrors, projectName, testName, runtime, }) => (react_1.default.createElement("div", { className: "p-3" },
    (selectedFile === null || selectedFile === void 0 ? void 0 : selectedFile.path.endsWith("tests.json")) && (react_1.default.createElement("div", { className: "test-results-preview" }, typeof selectedFile.content === "string"
        ? (0, TestPageView_utils_1.renderTestResults)(JSON.parse(selectedFile.content), buildErrors, projectName, testName, runtime)
        : (0, TestPageView_utils_1.renderTestResults)(selectedFile.content, buildErrors, projectName, testName, runtime))),
    (selectedFile === null || selectedFile === void 0 ? void 0 : selectedFile.path.match(/\.(png|jpg|jpeg|gif|svg)$/i)) && (react_1.default.createElement("div", { className: "text-center" },
        react_1.default.createElement("img", { src: selectedFile.content, alt: selectedFile.path, className: "img-fluid", style: { maxHeight: "300px" } }),
        react_1.default.createElement("div", { className: "mt-2" },
            react_1.default.createElement("a", { href: selectedFile.content, target: "_blank", rel: "noopener noreferrer", className: "btn btn-sm btn-outline-primary" }, "Open Full Size")))),
    (selectedFile === null || selectedFile === void 0 ? void 0 : selectedFile.path.endsWith("build.json")) && (react_1.default.createElement("div", null,
        react_1.default.createElement("h5", null, "Build Information"),
        (() => {
            var _a, _b;
            try {
                const buildData = JSON.parse(selectedFile.content);
                return (react_1.default.createElement(react_1.default.Fragment, null,
                    ((_a = buildData.errors) === null || _a === void 0 ? void 0 : _a.length) > 0 && (react_1.default.createElement("div", { className: "mb-3" },
                        react_1.default.createElement("h6", { className: "text-danger" },
                            "Errors (",
                            buildData.errors.length,
                            ")"),
                        react_1.default.createElement("ul", { className: "list-unstyled" }, buildData.errors.map((error, index) => (react_1.default.createElement("li", { key: index, className: "mb-2 p-2  rounded" },
                            react_1.default.createElement("div", { className: "text-danger fw-bold" }, error.text),
                            error.location && (react_1.default.createElement("div", { className: "small text-muted" },
                                "File: ",
                                error.location.file,
                                "Line: ",
                                error.location.line,
                                "Column: ",
                                error.location.column)),
                            error.notes && error.notes.length > 0 && (react_1.default.createElement("div", { className: "small" },
                                "Notes:",
                                react_1.default.createElement("ul", null, error.notes.map((note, noteIndex) => (react_1.default.createElement("li", { key: noteIndex }, note.text)))))))))))),
                    ((_b = buildData.warnings) === null || _b === void 0 ? void 0 : _b.length) > 0 && (react_1.default.createElement("div", { className: "mb-3" },
                        react_1.default.createElement("h6", { className: "text-warning" },
                            "Warnings (",
                            buildData.warnings.length,
                            ")"),
                        react_1.default.createElement("ul", { className: "list-unstyled" }, buildData.warnings.map((warning, index) => (react_1.default.createElement("li", { key: index, className: "mb-2 p-2  rounded" },
                            react_1.default.createElement("div", { className: "text-warning fw-bold" }, warning.text),
                            warning.location && (react_1.default.createElement("div", { className: "small text-muted" },
                                "File: ",
                                warning.location.file,
                                "Line: ",
                                warning.location.line,
                                "Column: ",
                                warning.location.column)),
                            warning.notes && warning.notes.length > 0 && (react_1.default.createElement("div", { className: "small" },
                                "Notes:",
                                react_1.default.createElement("ul", null, warning.notes.map((note, noteIndex) => (react_1.default.createElement("li", { key: noteIndex }, note.text)))))))))))),
                    (!buildData.errors || buildData.errors.length === 0) &&
                        (!buildData.warnings || buildData.warnings.length === 0) && (react_1.default.createElement("div", { className: "alert alert-success" }, "No build errors or warnings"))));
            }
            catch (e) {
                return (react_1.default.createElement("div", { className: "alert alert-danger" },
                    "Error parsing build.json: ",
                    e.message));
            }
        })())),
    (selectedFile === null || selectedFile === void 0 ? void 0 : selectedFile.path.endsWith(".json")) &&
        !selectedFile.path.endsWith("tests.json") &&
        !selectedFile.path.endsWith("build.json") && (react_1.default.createElement("pre", { className: " p-2 small" },
        react_1.default.createElement("code", null, selectedFile.content))),
    (selectedFile === null || selectedFile === void 0 ? void 0 : selectedFile.path.includes("source_files")) && (react_1.default.createElement("div", null,
        react_1.default.createElement("div", { className: "mb-2 small text-muted" },
            react_1.default.createElement("i", { className: "bi bi-file-earmark-text me-1" }),
            selectedFile.path.split("/").pop()),
        react_1.default.createElement(react_bootstrap_1.Button, { variant: "outline-primary", size: "sm", className: "mb-2", onClick: () => {
                // TODO: Add save functionality
                alert("Save functionality will be implemented here");
            } }, "Save Changes")))));
exports.TestPageMainContent = TestPageMainContent;
