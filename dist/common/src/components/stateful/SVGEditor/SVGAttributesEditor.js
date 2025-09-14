"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.SVGAttributesEditor = void 0;
const react_1 = __importStar(require("react"));
const react_bootstrap_1 = require("react-bootstrap");
const SVGAttributesEditor = ({ node, onUpdateAttributes, onUpdateTextContent }) => {
    const [attributes, setAttributes] = (0, react_1.useState)(node.attributes);
    const [textContent, setTextContent] = (0, react_1.useState)('');
    (0, react_1.useEffect)(() => {
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
    return (react_1.default.createElement("div", null,
        (node.type === 'text' || node.type === 'tspan') && (react_1.default.createElement(react_bootstrap_1.Form.Group, { className: "mb-3" },
            react_1.default.createElement(react_bootstrap_1.Form.Label, null, "Text Content"),
            react_1.default.createElement(react_bootstrap_1.Form.Control, { type: "text", value: node.attributes['text-content'] || '', onChange: (e) => {
                    handleAttributeChange('text-content', e.target.value);
                    // Also update the actual text content if needed
                    if (onUpdateTextContent) {
                        onUpdateTextContent(e.target.value);
                    }
                } }))),
        Object.entries(attributes)
            .filter(([key]) => key !== 'text-content')
            .map(([key, value]) => (react_1.default.createElement(react_bootstrap_1.Form.Group, { key: key, className: "mb-2" },
            react_1.default.createElement(react_bootstrap_1.Form.Label, null, key),
            react_1.default.createElement(react_bootstrap_1.Form.Control, { type: "text", value: value, onChange: (e) => handleAttributeChange(key, e.target.value) })))),
        react_1.default.createElement(react_bootstrap_1.Form.Group, null,
            react_1.default.createElement(react_bootstrap_1.Form.Label, null, "Add New Attribute"),
            react_1.default.createElement(react_bootstrap_1.Form.Control, { type: "text", placeholder: "attribute=value", onKeyPress: (e) => {
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
exports.SVGAttributesEditor = SVGAttributesEditor;
