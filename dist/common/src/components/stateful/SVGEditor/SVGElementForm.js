"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SVGElementForm = void 0;
const react_1 = __importDefault(require("react"));
const CircleForm_1 = require("./CircleForm");
const RectForm_1 = require("./RectForm");
const GroupForm_1 = require("./GroupForm");
const SVGElementForm = ({ elementType, attributes, onChange }) => {
    switch (elementType) {
        case 'circle':
            return (react_1.default.createElement(CircleForm_1.CircleForm, { attributes: attributes, onChange: onChange }));
        case 'rect':
            return (react_1.default.createElement(RectForm_1.RectForm, { attributes: attributes, onChange: onChange }));
        case 'g':
            return (react_1.default.createElement(GroupForm_1.GroupForm, { attributes: attributes, onChange: onChange }));
        default:
            return react_1.default.createElement("div", null, "Select an element type");
    }
};
exports.SVGElementForm = SVGElementForm;
