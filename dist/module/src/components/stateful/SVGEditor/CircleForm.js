import React from 'react';
import { SVGAttributeField } from './SVGAttributeField';
export const CircleForm = ({ attributes, onChange }) => {
    const handleChange = (key, value) => {
        onChange(Object.assign(Object.assign({}, attributes), { [key]: value }));
    };
    return (React.createElement("div", null,
        React.createElement("h3", null, "Circle Attributes"),
        React.createElement(SVGAttributeField, { label: "Center X", value: attributes.cx, onChange: (value) => handleChange('cx', value), type: "number" }),
        React.createElement(SVGAttributeField, { label: "Center Y", value: attributes.cy, onChange: (value) => handleChange('cy', value), type: "number" }),
        React.createElement(SVGAttributeField, { label: "Radius", value: attributes.r, onChange: (value) => handleChange('r', value), type: "number" }),
        React.createElement(SVGAttributeField, { label: "Fill Color", value: attributes.fill, onChange: (value) => handleChange('fill', value), type: "color" }),
        React.createElement(SVGAttributeField, { label: "Stroke Color", value: attributes.stroke, onChange: (value) => handleChange('stroke', value), type: "color" }),
        React.createElement(SVGAttributeField, { label: "Stroke Width", value: attributes.strokeWidth, onChange: (value) => handleChange('strokeWidth', value), type: "number" }),
        React.createElement(SVGAttributeField, { label: "ID", value: attributes.id, onChange: (value) => handleChange('id', value), type: "text" }),
        React.createElement(SVGAttributeField, { label: "Class Name", value: attributes.className, onChange: (value) => handleChange('className', value), type: "text" })));
};
