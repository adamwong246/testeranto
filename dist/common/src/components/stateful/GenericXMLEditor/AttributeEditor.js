"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttributeEditor = void 0;
const react_1 = __importDefault(require("react"));
const react_bootstrap_1 = require("react-bootstrap");
const AttributeEditor = ({ node: selectedNode, onUpdateAttributes, onUpdateTextContent }) => {
    if (!selectedNode) {
        return (react_1.default.createElement("div", { className: "p-3 text-muted" }, "Select a node to edit its attributes"));
    }
    const handleAttributeChange = (key, value) => {
        const newAttributes = Object.assign({}, selectedNode.attributes);
        if (value === '') {
            delete newAttributes[key];
        }
        else {
            newAttributes[key] = value;
        }
        onUpdateAttributes(newAttributes);
    };
    const handleAddAttribute = () => {
        const newKey = prompt('Enter attribute name:');
        if (newKey && newKey.trim() !== '') {
            const newAttributes = Object.assign(Object.assign({}, selectedNode.attributes), { [newKey]: '' });
            onUpdateAttributes(newAttributes);
        }
    };
    const handleRemoveAttribute = (key) => {
        const newAttributes = Object.assign({}, selectedNode.attributes);
        delete newAttributes[key];
        onUpdateAttributes(newAttributes);
    };
    return (react_1.default.createElement("div", { className: "p-2" },
        react_1.default.createElement("div", { className: "d-flex justify-content-between align-items-center mb-2" },
            react_1.default.createElement("h6", { className: "mb-0 small" },
                "Attributes for ",
                selectedNode.type),
            react_1.default.createElement("button", { className: "btn btn-sm btn-outline-success py-0 px-1", onClick: handleAddAttribute }, "+ Add")),
        Object.entries(selectedNode.attributes).map(([key, value]) => (react_1.default.createElement("div", { key: key, className: "mb-1 d-flex align-items-center" },
            react_1.default.createElement(react_bootstrap_1.Form.Group, { className: "flex-grow-1 me-1" },
                react_1.default.createElement(react_bootstrap_1.Form.Label, { className: "small mb-0" }, key),
                react_1.default.createElement(react_bootstrap_1.Form.Control, { type: "text", size: "sm", value: value, onChange: (e) => handleAttributeChange(key, e.target.value), placeholder: "Value", className: "py-0" })),
            react_1.default.createElement("button", { className: "btn btn-sm btn-outline-danger py-0 px-1", onClick: () => handleRemoveAttribute(key), style: { marginTop: '1.25rem' } }, "\u00D7")))),
        Object.keys(selectedNode.attributes).length === 0 && (react_1.default.createElement("div", { className: "text-muted small" }, "No attributes")),
        onUpdateTextContent && (react_1.default.createElement(react_bootstrap_1.Form.Group, { className: "mt-2" },
            react_1.default.createElement(react_bootstrap_1.Form.Label, { className: "small mb-0" }, "Text Content"),
            react_1.default.createElement(react_bootstrap_1.Form.Control, { as: "textarea", rows: 2, value: selectedNode.textContent || '', onChange: (e) => onUpdateTextContent(e.target.value), placeholder: "Text content", className: "py-0" })))));
};
exports.AttributeEditor = AttributeEditor;
