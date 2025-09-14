import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
export const SVGAttributesEditor = ({ node, onUpdateAttributes, onUpdateTextContent }) => {
    const [attributes, setAttributes] = useState(node.attributes);
    const [textContent, setTextContent] = useState('');
    useEffect(() => {
        setAttributes(node.attributes);
        // For text and tspan nodes, we might want to handle text content
        // This is a simple approach - in a real implementation, you'd need to track text content separately
    }, [node.id]);
    const handleAttributeChange = (key, value) => {
        const newAttributes = Object.assign(Object.assign({}, attributes), { [key]: value });
        setAttributes(newAttributes);
        onUpdateAttributes(newAttributes);
    };
    // const handleTextContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    //   const newText = e.target.value;
    //   setTextContent(newText);
    //   if (onUpdateTextContent) {
    //     onUpdateTextContent(newText);
    //   }
    // };
    return (React.createElement("div", null,
        (node.type === 'text' || node.type === 'tspan') && (React.createElement(Form.Group, { className: "mb-3" },
            React.createElement(Form.Label, null, "Text Content"),
            React.createElement(Form.Control, { type: "text", value: node.attributes['text-content'] || '', onChange: (e) => {
                    handleAttributeChange('text-content', e.target.value);
                    // Also update the actual text content if needed
                    if (onUpdateTextContent) {
                        onUpdateTextContent(e.target.value);
                    }
                } }))),
        Object.entries(attributes)
            .filter(([key]) => key !== 'text-content')
            .map(([key, value]) => (React.createElement(Form.Group, { key: key, className: "mb-2" },
            React.createElement(Form.Label, null, key),
            React.createElement(Form.Control, { type: "text", value: value, onChange: (e) => handleAttributeChange(key, e.target.value) })))),
        React.createElement(Form.Group, null,
            React.createElement(Form.Label, null, "Add New Attribute"),
            React.createElement(Form.Control, { type: "text", placeholder: "attribute=value", onKeyPress: (e) => {
                    if (e.key === 'Enter') {
                        const target = e.target;
                        const [key, value] = target.value.split('=');
                        if (key && value) {
                            handleAttributeChange(key.trim(), value.trim());
                            target.value = '';
                        }
                    }
                } }))));
};
