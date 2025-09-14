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
exports.GenericTextEditor = void 0;
const react_1 = __importStar(require("react"));
const react_bootstrap_1 = require("react-bootstrap");
const nodeToXML = (node, depth = 0) => {
    const indent = '  '.repeat(depth);
    const attributes = Object.entries(node.attributes)
        .map(([key, value]) => ` ${key}="${value}"`)
        .join('');
    if (node.children.length === 0) {
        return `${indent}<${node.type}${attributes} />`;
    }
    else {
        const children = node.children.map(child => nodeToXML(child, depth + 1)).join('\n');
        return `${indent}<${node.type}${attributes}>\n${children}\n${indent}</${node.type}>`;
    }
};
const GenericTextEditor = ({ xmlTree, onUpdateTree }) => {
    const [xmlContent, setXmlContent] = (0, react_1.useState)('');
    const [error, setError] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        try {
            // For SVG, the root is the svg element itself, so we need to include its attributes
            if (xmlTree.type === 'svg') {
                const content = nodeToXML(xmlTree, 0);
                setXmlContent(content);
            }
            else {
                // Convert the XML tree to XML, but only the children of the root
                const content = xmlTree.children.map(child => nodeToXML(child, 0)).join('\n');
                setXmlContent(content);
            }
            setError(null);
        }
        catch (err) {
            setError('Error generating XML');
        }
    }, [xmlTree]);
    const handleXmlChange = (e) => {
        const newContent = e.currentTarget.textContent || '';
        setXmlContent(newContent);
        setError(null);
    };
    const applyChanges = () => {
        try {
            // This is a placeholder - in a real implementation, you'd parse the XML
            // and convert it back to an XMLNode structure
            // For now, we'll just log an error
            setError('XML parsing not implemented yet');
        }
        catch (err) {
            setError('Error parsing XML: ' + (err instanceof Error ? err.message : String(err)));
        }
    };
    return (react_1.default.createElement("div", { className: "h-100 d-flex flex-column align-items-center" },
        react_1.default.createElement("div", { style: { width: '80ch', maxWidth: '100%' } },
            react_1.default.createElement("div", { contentEditable: true, onInput: handleXmlChange, style: {
                    width: '80ch',
                    background: '#f8f9fa',
                    padding: '1rem',
                    borderRadius: '0.25rem',
                    overflow: 'auto',
                    minHeight: '400px',
                    fontFamily: 'monospace',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    lineHeight: '1.4',
                    outline: 'none'
                }, suppressContentEditableWarning: true }, xmlContent),
            error && (react_1.default.createElement(react_bootstrap_1.Alert, { variant: "danger", className: "mt-2" }, error)),
            react_1.default.createElement(react_bootstrap_1.Button, { variant: "primary", onClick: applyChanges, className: "mt-2", disabled: !!error }, "Apply Changes"))));
};
exports.GenericTextEditor = GenericTextEditor;
