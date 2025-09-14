"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RectForm = void 0;
const react_1 = __importDefault(require("react"));
const SVGAttributeField_1 = require("./SVGAttributeField");
const RectForm = ({ attributes, onChange }) => {
    const handleChange = (key, value) => {
        onChange(Object.assign(Object.assign({}, attributes), { [key]: value }));
    };
    return (react_1.default.createElement("div", null,
        react_1.default.createElement("h3", null, "Rectangle Attributes"),
        react_1.default.createElement(SVGAttributeField_1.SVGAttributeField, { label: "X Position", value: attributes.x, onChange: (value) => handleChange('x', value), type: "number" }),
        react_1.default.createElement(SVGAttributeField_1.SVGAttributeField, { label: "Y Position", value: attributes.y, onChange: (value) => handleChange('y', value), type: "number" }),
        react_1.default.createElement(SVGAttributeField_1.SVGAttributeField, { label: "Width", value: attributes.width, onChange: (value) => handleChange('width', value), type: "number" }),
        react_1.default.createElement(SVGAttributeField_1.SVGAttributeField, { label: "Height", value: attributes.height, onChange: (value) => handleChange('height', value), type: "number" }),
        react_1.default.createElement(SVGAttributeField_1.SVGAttributeField, { label: "RX (Corner Radius X)", value: attributes.rx, onChange: (value) => handleChange('rx', value), type: "number" }),
        react_1.default.createElement(SVGAttributeField_1.SVGAttributeField, { label: "RY (Corner Radius Y)", value: attributes.ry, onChange: (value) => handleChange('ry', value), type: "number" }),
        react_1.default.createElement(SVGAttributeField_1.SVGAttributeField, { label: "Fill Color", value: attributes.fill, onChange: (value) => handleChange('fill', value), type: "color" }),
        react_1.default.createElement(SVGAttributeField_1.SVGAttributeField, { label: "Stroke Color", value: attributes.stroke, onChange: (value) => handleChange('stroke', value), type: "color" }),
        react_1.default.createElement(SVGAttributeField_1.SVGAttributeField, { label: "Stroke Width", value: attributes.strokeWidth, onChange: (value) => handleChange('strokeWidth', value), type: "number" })));
};
exports.RectForm = RectForm;
