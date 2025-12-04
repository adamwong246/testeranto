import React from 'react';
import { SVGAttributeField } from './SVGAttributeField';
export const RectForm = ({ attributes, onChange }) => {
    const handleChange = (key, value) => {
        onChange(Object.assign(Object.assign({}, attributes), { [key]: value }));
    };
    return (React.createElement("div", null,
        React.createElement("h3", null, "Rectangle Attributes"),
        React.createElement(SVGAttributeField, { label: "X Position", value: attributes.x, onChange: (value) => handleChange('x', value), type: "number" }),
        React.createElement(SVGAttributeField, { label: "Y Position", value: attributes.y, onChange: (value) => handleChange('y', value), type: "number" }),
        React.createElement(SVGAttributeField, { label: "Width", value: attributes.width, onChange: (value) => handleChange('width', value), type: "number" }),
        React.createElement(SVGAttributeField, { label: "Height", value: attributes.height, onChange: (value) => handleChange('height', value), type: "number" }),
        React.createElement(SVGAttributeField, { label: "RX (Corner Radius X)", value: attributes.rx, onChange: (value) => handleChange('rx', value), type: "number" }),
        React.createElement(SVGAttributeField, { label: "RY (Corner Radius Y)", value: attributes.ry, onChange: (value) => handleChange('ry', value), type: "number" }),
        React.createElement(SVGAttributeField, { label: "Fill Color", value: attributes.fill, onChange: (value) => handleChange('fill', value), type: "color" }),
        React.createElement(SVGAttributeField, { label: "Stroke Color", value: attributes.stroke, onChange: (value) => handleChange('stroke', value), type: "color" }),
        React.createElement(SVGAttributeField, { label: "Stroke Width", value: attributes.strokeWidth, onChange: (value) => handleChange('strokeWidth', value), type: "number" })));
};
