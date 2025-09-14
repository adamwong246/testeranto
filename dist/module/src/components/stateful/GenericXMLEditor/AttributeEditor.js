import React from 'react';
import { Form } from 'react-bootstrap';
export const AttributeEditor = ({ selectedNode, onUpdateNode }) => {
    if (!selectedNode) {
        return (React.createElement("div", { className: "p-3 text-muted" }, "Select a node to edit its attributes"));
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
    return (React.createElement("div", { className: "p-3" },
        React.createElement("div", { className: "d-flex justify-content-between align-items-center mb-3" },
            React.createElement("h6", null,
                "Attributes for ",
                selectedNode.type),
            React.createElement("button", { className: "btn btn-sm btn-outline-success", onClick: handleAddAttribute }, "+ Add")),
        Object.entries(selectedNode.attributes).map(([key, value]) => (React.createElement("div", { key: key, className: "mb-2 d-flex align-items-center" },
            React.createElement(Form.Group, { className: "flex-grow-1 me-2" },
                React.createElement(Form.Label, { className: "small mb-0" }, key),
                React.createElement(Form.Control, { type: "text", size: "sm", value: value, onChange: (e) => handleAttributeChange(key, e.target.value), placeholder: "Value" })),
            React.createElement("button", { className: "btn btn-sm btn-outline-danger", onClick: () => handleRemoveAttribute(key), style: { marginTop: '1.5rem' } }, "\u00D7")))),
        Object.keys(selectedNode.attributes).length === 0 && (React.createElement("div", { className: "text-muted small" }, "No attributes defined"))));
};
