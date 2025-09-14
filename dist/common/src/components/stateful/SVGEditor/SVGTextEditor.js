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
exports.SVGTextEditor = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
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
const xmlToNode = (xml) => {
    try {
        // This is a simplified parser - in a real application, you'd want a proper XML parser
        const parser = new DOMParser();
        const doc = parser.parseFromString(`<root>${xml}</root>`, 'text/xml');
        const parseElement = (element) => {
            const attributes = {};
            for (let i = 0; i < element.attributes.length; i++) {
                const attr = element.attributes[i];
                attributes[attr.name] = attr.value;
            }
            const children = [];
            for (let i = 0; i < element.children.length; i++) {
                const child = element.children[i];
                children.push(parseElement(child));
            }
            return {
                id: `${element.nodeName}-${Date.now()}`,
                type: element.nodeName,
                attributes,
                children
            };
        };
        const rootElement = doc.documentElement.firstElementChild;
        if (rootElement) {
            return parseElement(rootElement);
        }
        return null;
    }
    catch (error) {
        console.error('Error parsing XML:', error);
        return null;
    }
};
const SVGTextEditor = ({ svgTree, onUpdateTree }) => {
    const [xmlContent, setXmlContent] = (0, react_1.useState)('');
    const [error, setError] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        try {
            // Convert the SVG tree to XML, but only the children of the root SVG
            const content = svgTree.children.map(child => nodeToXML(child, 0)).join('\n');
            setXmlContent(content);
            setError(null);
        }
        catch (err) {
            setError('Error generating XML');
        }
    }, [svgTree]);
    const handleXmlChange = (e) => {
        const newContent = e.target.value;
        setXmlContent(newContent);
        setError(null);
    };
    const applyChanges = () => {
        try {
            // Parse the XML content and update the tree
            const wrappedXml = `<svg>${xmlContent}</svg>`;
            const parser = new DOMParser();
            const doc = parser.parseFromString(wrappedXml, 'text/xml');
            // Check for parsing errors
            const parseError = doc.querySelector('parsererror');
            if (parseError) {
                throw new Error('Invalid XML structure');
            }
            // Create a new SVG tree with the parsed content
            const newSvgTree = Object.assign(Object.assign({}, svgTree), { children: [] });
            // Parse each child element
            const parseElement = (element) => {
                const attributes = {};
                for (let i = 0; i < element.attributes.length; i++) {
                    const attr = element.attributes[i];
                    attributes[attr.name] = attr.value;
                }
                const children = [];
                for (let i = 0; i < element.children.length; i++) {
                    const child = element.children[i];
                    children.push(parseElement(child));
                }
                return {
                    id: `${element.nodeName}-${Date.now()}`,
                    type: element.nodeName,
                    attributes,
                    children
                };
            };
            // Add all direct children of the SVG element
            for (let i = 0; i < doc.documentElement.children.length; i++) {
                const child = doc.documentElement.children[i];
                newSvgTree.children.push(parseElement(child));
            }
            onUpdateTree(newSvgTree);
            setError(null);
        }
        catch (err) {
            setError('Error parsing XML: ' + (err instanceof Error ? err.message : String(err)));
        }
    };
    return (react_1.default.createElement("div", { className: "h-100 d-flex flex-column" },
        react_1.default.createElement(react_bootstrap_1.Form.Control, { as: "textarea", value: xmlContent, onChange: handleXmlChange, className: "flex-grow-1 font-monospace", style: { minHeight: '300px' }, placeholder: "Edit SVG content as XML..." }),
        error && (react_1.default.createElement(react_bootstrap_1.Alert, { variant: "danger", className: "mt-2" }, error)),
        react_1.default.createElement(react_bootstrap_1.Button, { variant: "primary", onClick: applyChanges, className: "mt-2", disabled: !!error }, "Apply Changes")));
};
exports.SVGTextEditor = SVGTextEditor;
