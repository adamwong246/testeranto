"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SVGAttributeField = void 0;
const react_1 = __importDefault(require("react"));
const SVGAttributeField = ({ label, value, onChange, type = 'text' }) => {
    return (react_1.default.createElement("div", { style: { marginBottom: '8px' } },
        react_1.default.createElement("label", { style: { display: 'block', marginBottom: '4px' } },
            label,
            ":"),
        react_1.default.createElement("input", { type: type, value: value || '', onChange: (e) => onChange(e.target.value), style: { width: '100%' } })));
};
exports.SVGAttributeField = SVGAttributeField;
