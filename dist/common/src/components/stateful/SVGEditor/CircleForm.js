"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CircleForm = void 0;
const react_1 = __importDefault(require("react"));
const SVGAttributeField_1 = require("./SVGAttributeField");
const CircleForm = ({ attributes, onChange }) => {
    const handleChange = (key, value) => {
        onChange(Object.assign(Object.assign({}, attributes), { [key]: value }));
    };
    return (react_1.default.createElement("div", null,
        react_1.default.createElement("h3", null, "Circle Attributes"),
        react_1.default.createElement(SVGAttributeField_1.SVGAttributeField, { label: "Center X", value: attributes.cx, onChange: (value) => handleChange('cx', value), type: "number" }),
        react_1.default.createElement(SVGAttributeField_1.SVGAttributeField, { label: "Center Y", value: attributes.cy, onChange: (value) => handleChange('cy', value), type: "number" }),
        react_1.default.createElement(SVGAttributeField_1.SVGAttributeField, { label: "Radius", value: attributes.r, onChange: (value) => handleChange('r', value), type: "number" }),
        react_1.default.createElement(SVGAttributeField_1.SVGAttributeField, { label: "Fill Color", value: attributes.fill, onChange: (value) => handleChange('fill', value), type: "color" }),
        react_1.default.createElement(SVGAttributeField_1.SVGAttributeField, { label: "Stroke Color", value: attributes.stroke, onChange: (value) => handleChange('stroke', value), type: "color" }),
        react_1.default.createElement(SVGAttributeField_1.SVGAttributeField, { label: "Stroke Width", value: attributes.strokeWidth, onChange: (value) => handleChange('strokeWidth', value), type: "number" }),
        react_1.default.createElement(SVGAttributeField_1.SVGAttributeField, { label: "ID", value: attributes.id, onChange: (value) => handleChange('id', value), type: "text" }),
        react_1.default.createElement(SVGAttributeField_1.SVGAttributeField, { label: "Class Name", value: attributes.className, onChange: (value) => handleChange('className', value), type: "text" })));
};
exports.CircleForm = CircleForm;
