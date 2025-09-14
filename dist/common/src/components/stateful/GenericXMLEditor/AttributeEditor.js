"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttributeEditor = void 0;
const react_1 = __importDefault(require("react"));
const react_bootstrap_1 = require("react-bootstrap");
const AttributeEditor = ({ selectedNode, onUpdateNode }) => {
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
        onUpdateNode(selectedNode.id, newAttributes);
    };
    const handleAddAttribute = () => {
        const newKey = prompt('Enter attribute name:');
        if (newKey && newKey.trim() !== '') {
            const newAttributes = Object.assign(Object.assign({}, selectedNode.attributes), { [newKey]: '' });
            onUpdateNode(selectedNode.id, newAttributes);
        }
    };
    const handleRemoveAttribute = (key) => {
        const newAttributes = Object.assign({}, selectedNode.attributes);
        delete newAttributes[key];
        onUpdateNode(selectedNode.id, newAttributes);
    };
    return (react_1.default.createElement("div", { className: "p-3" },
        react_1.default.createElement("div", { className: "d-flex justify-content-between align-items-center mb-3" },
            react_1.default.createElement("h6", null,
                "Attributes for ",
                selectedNode.type),
            react_1.default.createElement("button", { className: "btn btn-sm btn-outline-success", onClick: handleAddAttribute }, "+ Add")),
        Object.entries(selectedNode.attributes).map(([key, value]) => (react_1.default.createElement("div", { key: key, className: "mb-2 d-flex align-items-center" },
            react_1.default.createElement(react_bootstrap_1.Form.Group, { className: "flex-grow-1 me-2" },
                react_1.default.createElement(react_bootstrap_1.Form.Label, { className: "small mb-0" }, key),
                react_1.default.createElement(react_bootstrap_1.Form.Control, { type: "text", size: "sm", value: value, onChange: (e) => handleAttributeChange(key, e.target.value), placeholder: "Value" })),
            react_1.default.createElement("button", { className: "btn btn-sm btn-outline-danger", onClick: () => handleRemoveAttribute(key), style: { marginTop: '1.5rem' } }, "\u00D7")))),
        Object.keys(selectedNode.attributes).length === 0 && (react_1.default.createElement("div", { className: "text-muted small" }, "No attributes defined"))));
};
exports.AttributeEditor = AttributeEditor;
