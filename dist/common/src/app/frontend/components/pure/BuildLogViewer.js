"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildLogViewer = void 0;
const react_1 = __importDefault(require("react"));
const react_bootstrap_1 = require("react-bootstrap");
const BuildLogViewer = ({ logs, runtime }) => {
    var _a, _b, _c, _d, _e, _f;
    if (!logs)
        return react_1.default.createElement(react_bootstrap_1.Alert, { variant: "info" },
            "Loading ",
            runtime.toLowerCase(),
            " build logs...");
    const hasErrors = ((_a = logs.errors) === null || _a === void 0 ? void 0 : _a.length) > 0;
    const hasWarnings = ((_b = logs.warnings) === null || _b === void 0 ? void 0 : _b.length) > 0;
    const [activeTab, setActiveTab] = react_1.default.useState('summary');
    return (react_1.default.createElement("div", null,
        react_1.default.createElement(react_bootstrap_1.Tab.Container, { activeKey: activeTab, onSelect: (k) => setActiveTab(k || 'summary') },
            react_1.default.createElement(react_bootstrap_1.Nav, { variant: "tabs", className: "mb-3" },
                react_1.default.createElement(react_bootstrap_1.Nav.Item, null,
                    react_1.default.createElement(react_bootstrap_1.Nav.Link, { eventKey: "summary" }, "Build Summary")),
                react_1.default.createElement(react_bootstrap_1.Nav.Item, null,
                    react_1.default.createElement(react_bootstrap_1.Nav.Link, { eventKey: "warnings" }, hasWarnings ? `⚠️ Warnings (${logs.warnings.length})` : 'Warnings')),
                react_1.default.createElement(react_bootstrap_1.Nav.Item, null,
                    react_1.default.createElement(react_bootstrap_1.Nav.Link, { eventKey: "errors" }, hasErrors ? `❌ Errors (${logs.errors.length})` : 'Errors'))),
            react_1.default.createElement(react_bootstrap_1.Tab.Content, null,
                react_1.default.createElement(react_bootstrap_1.Tab.Pane, { eventKey: "summary" },
                    react_1.default.createElement(react_bootstrap_1.Card, null,
                        react_1.default.createElement(react_bootstrap_1.Card.Header, { className: "d-flex justify-content-between align-items-center" },
                            react_1.default.createElement("h5", null, "Build Summary"),
                            react_1.default.createElement("div", null,
                                hasErrors && (react_1.default.createElement(react_bootstrap_1.Badge, { bg: "danger", className: "me-2" },
                                    logs.errors.length,
                                    " Error",
                                    logs.errors.length !== 1 ? 's' : '')),
                                hasWarnings && (react_1.default.createElement(react_bootstrap_1.Badge, { bg: "warning", text: "dark" },
                                    logs.warnings.length,
                                    " Warning",
                                    logs.warnings.length !== 1 ? 's' : '')),
                                !hasErrors && !hasWarnings && (react_1.default.createElement(react_bootstrap_1.Badge, { bg: "success" }, "Build Successful")))),
                        react_1.default.createElement(react_bootstrap_1.Card.Body, null,
                            react_1.default.createElement("div", { className: "mb-3" },
                                react_1.default.createElement("h6", null,
                                    "Input Files (",
                                    Object.keys(((_c = logs.metafile) === null || _c === void 0 ? void 0 : _c.inputs) || {}).length,
                                    ")"),
                                react_1.default.createElement(react_bootstrap_1.ListGroup, { className: "max-h-200 overflow-auto" }, Object.keys(((_d = logs.metafile) === null || _d === void 0 ? void 0 : _d.inputs) || {}).map((file) => (react_1.default.createElement(react_bootstrap_1.ListGroup.Item, { key: file, className: "py-2" },
                                    react_1.default.createElement("code", null, file),
                                    react_1.default.createElement("div", { className: "text-muted small" },
                                        logs.metafile.inputs[file].bytes,
                                        " bytes")))))),
                            react_1.default.createElement("div", null,
                                react_1.default.createElement("h6", null,
                                    "Output Files (",
                                    Object.keys(((_e = logs.metafile) === null || _e === void 0 ? void 0 : _e.outputs) || {}).length,
                                    ")"),
                                react_1.default.createElement(react_bootstrap_1.ListGroup, { className: "max-h-200 overflow-auto" }, Object.keys(((_f = logs.metafile) === null || _f === void 0 ? void 0 : _f.outputs) || {}).map((file) => (react_1.default.createElement(react_bootstrap_1.ListGroup.Item, { key: file, className: "py-2" },
                                    react_1.default.createElement("code", null, file),
                                    react_1.default.createElement("div", { className: "text-muted small" },
                                        logs.metafile.outputs[file].bytes,
                                        " bytes",
                                        logs.metafile.outputs[file].entryPoint && (react_1.default.createElement("span", { className: "ms-2 badge bg-info" }, "Entry Point"))))))))))),
                react_1.default.createElement(react_bootstrap_1.Tab.Pane, { eventKey: "warnings" }, hasWarnings ? (react_1.default.createElement(react_bootstrap_1.Card, { className: "border-warning" },
                    react_1.default.createElement(react_bootstrap_1.Card.Header, { className: "bg-warning text-white d-flex justify-content-between align-items-center" },
                        react_1.default.createElement("span", null,
                            "Build Warnings (",
                            logs.warnings.length,
                            ")"),
                        react_1.default.createElement(react_bootstrap_1.Badge, { bg: "light", text: "dark" }, new Date().toLocaleString())),
                    react_1.default.createElement(react_bootstrap_1.Card.Body, { className: "p-0" },
                        react_1.default.createElement(react_bootstrap_1.ListGroup, { variant: "flush" }, logs.warnings.map((warn, i) => {
                            var _a, _b;
                            return (react_1.default.createElement(react_bootstrap_1.ListGroup.Item, { key: i, className: "text-warning" },
                                react_1.default.createElement("div", { className: "d-flex justify-content-between" },
                                    react_1.default.createElement("strong", null,
                                        ((_a = warn.location) === null || _a === void 0 ? void 0 : _a.file) || 'Unknown file',
                                        ((_b = warn.location) === null || _b === void 0 ? void 0 : _b.line) && `:${warn.location.line}`),
                                    react_1.default.createElement("small", { className: "text-muted" }, warn.pluginName ? `[${warn.pluginName}]` : '')),
                                react_1.default.createElement("div", { className: "mt-1" },
                                    react_1.default.createElement("pre", { className: "mb-0 p-2  rounded" }, JSON.stringify(warn)))));
                        }))))) : (react_1.default.createElement(react_bootstrap_1.Alert, { variant: "info" }, "No warnings found"))),
                react_1.default.createElement(react_bootstrap_1.Tab.Pane, { eventKey: "errors" }, hasErrors ? (react_1.default.createElement(react_bootstrap_1.Card, { className: "border-danger" },
                    react_1.default.createElement(react_bootstrap_1.Card.Header, { className: "bg-danger text-white d-flex justify-content-between align-items-center" },
                        react_1.default.createElement("span", null,
                            "Build Errors (",
                            logs.errors.length,
                            ")"),
                        react_1.default.createElement(react_bootstrap_1.Badge, { bg: "light", text: "dark" }, new Date().toLocaleString())),
                    react_1.default.createElement(react_bootstrap_1.Card.Body, { className: "p-0" },
                        react_1.default.createElement(react_bootstrap_1.ListGroup, { variant: "flush" }, logs.errors.map((err, i) => {
                            var _a, _b;
                            return (react_1.default.createElement(react_bootstrap_1.ListGroup.Item, { key: i, className: "text-danger" },
                                react_1.default.createElement("div", { className: "d-flex justify-content-between" },
                                    react_1.default.createElement("strong", null,
                                        ((_a = err.location) === null || _a === void 0 ? void 0 : _a.file) || 'Unknown file',
                                        ((_b = err.location) === null || _b === void 0 ? void 0 : _b.line) && `:${err.location.line}`),
                                    react_1.default.createElement("small", { className: "text-muted" }, err.pluginName ? `[${err.pluginName}]` : '')),
                                react_1.default.createElement("div", { className: "mt-1" },
                                    react_1.default.createElement("pre", { className: "mb-0 p-2  rounded" }, JSON.stringify(err)))));
                        }))))) : (react_1.default.createElement(react_bootstrap_1.Alert, { variant: "success" },
                    react_1.default.createElement("h5", null, "No Errors Found"),
                    react_1.default.createElement("p", { className: "mb-0" }, "The build completed without any errors."))))))));
};
exports.BuildLogViewer = BuildLogViewer;
