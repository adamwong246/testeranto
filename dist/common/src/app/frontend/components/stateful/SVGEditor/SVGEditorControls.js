"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SVGEditorControls = void 0;
const react_1 = __importDefault(require("react"));
const react_bootstrap_1 = require("react-bootstrap");
const SVGEditorControls = ({ selectedNode, onAddNode, onRemoveNode }) => {
    return (react_1.default.createElement(react_bootstrap_1.Card, null,
        react_1.default.createElement(react_bootstrap_1.Card.Header, null, "Controls"),
        react_1.default.createElement(react_bootstrap_1.Card.Body, null,
            react_1.default.createElement(react_bootstrap_1.ButtonGroup, { vertical: true, className: "w-100" },
                react_1.default.createElement("h6", null, "Add Elements:"),
                react_1.default.createElement(react_bootstrap_1.Button, { variant: "outline-primary", onClick: () => onAddNode('rect') }, "Rectangle"),
                react_1.default.createElement(react_bootstrap_1.Button, { variant: "outline-primary", onClick: () => onAddNode('circle') }, "Circle"),
                react_1.default.createElement(react_bootstrap_1.Button, { variant: "outline-primary", onClick: () => onAddNode('path') }, "Path"),
                react_1.default.createElement(react_bootstrap_1.Button, { variant: "outline-primary", onClick: () => onAddNode('text') }, "Text"),
                react_1.default.createElement(react_bootstrap_1.Button, { variant: "outline-primary", onClick: () => onAddNode('g') }, "Group"),
                react_1.default.createElement("hr", null),
                react_1.default.createElement(react_bootstrap_1.Button, { variant: "outline-danger", onClick: onRemoveNode }, "Remove This Element")))));
};
exports.SVGEditorControls = SVGEditorControls;
