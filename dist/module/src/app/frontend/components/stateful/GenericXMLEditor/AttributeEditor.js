import React from 'react';
import { Form } from 'react-bootstrap';
export const AttributeEditor = ({ node: selectedNode, onUpdateAttributes, onUpdateTextContent }) => {
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
    return (React.createElement("div", { className: "p-2" },
        React.createElement("div", { className: "d-flex justify-content-between align-items-center mb-2" },
            React.createElement("h6", { className: "mb-0 small" },
                "Attributes for ",
                selectedNode.type),
            React.createElement("button", { className: "btn btn-sm btn-outline-success py-0 px-1", onClick: handleAddAttribute }, "+ Add")),
        Object.entries(selectedNode.attributes).map(([key, value]) => (React.createElement("div", { key: key, className: "mb-1 d-flex align-items-center" },
            React.createElement(Form.Group, { className: "flex-grow-1 me-1" },
                React.createElement(Form.Label, { className: "small mb-0" }, key),
                React.createElement(Form.Control, { type: "text", size: "sm", value: value, onChange: (e) => handleAttributeChange(key, e.target.value), placeholder: "Value", className: "py-0" })),
            React.createElement("button", { className: "btn btn-sm btn-outline-danger py-0 px-1", onClick: () => handleRemoveAttribute(key), style: { marginTop: '1.25rem' } }, "\u00D7")))),
        Object.keys(selectedNode.attributes).length === 0 && (React.createElement("div", { className: "text-muted small" }, "No attributes")),
        onUpdateTextContent && (React.createElement(Form.Group, { className: "mt-2" },
            React.createElement(Form.Label, { className: "small mb-0" }, "Text Content"),
            React.createElement(Form.Control, { as: "textarea", rows: 2, value: selectedNode.textContent || '', onChange: (e) => onUpdateTextContent(e.target.value), placeholder: "Text content", className: "py-0" })))));
};
