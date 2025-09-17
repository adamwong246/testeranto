import React, { useState, useEffect } from 'react';
import { Alert, Button } from 'react-bootstrap';
// Function to convert XMLNode to proper XML string
const nodeToXML = (node, depth = 0) => {
    const indent = '  '.repeat(depth);
    // Handle attributes
    const attributes = Object.entries(node.attributes || {})
        .map(([key, value]) => ` ${key}="${value}"`)
        .join('');
    // Handle text content
    const hasTextContent = node.textContent && node.textContent.trim().length > 0;
    if (node.children.length === 0) {
        if (hasTextContent) {
            return `${indent}<${node.type}${attributes}>${node.textContent}</${node.type}>`;
        }
        else {
            return `${indent}<${node.type}${attributes} />`;
        }
    }
    else {
        let result = `${indent}<${node.type}${attributes}`;
        if (hasTextContent) {
            result += `>${node.textContent}\n`;
        }
        else {
            result += '>\n';
        }
        // Add children
        node.children.forEach(child => {
            result += nodeToXML(child, depth + 1) + '\n';
        });
        result += `${indent}</${node.type}>`;
        return result;
    }
};
// Function to parse XML string back to XMLNode structure
const parseXmlString = (xmlString) => {
    // Remove XML declaration if present
    const cleanXmlString = xmlString.replace(/<\?xml.*?\?>\s*/s, '');
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(cleanXmlString, 'text/xml');
    const parseElement = (element) => {
        var _a;
        // Get attributes
        const attributes = {};
        for (let i = 0; i < element.attributes.length; i++) {
            const attr = element.attributes[i];
            attributes[attr.name] = attr.value;
        }
        // Process children
        const children = [];
        let textContent;
        for (let i = 0; i < element.childNodes.length; i++) {
            const node = element.childNodes[i];
            if (node.nodeType === Node.ELEMENT_NODE) {
                children.push(parseElement(node));
            }
            else if (node.nodeType === Node.TEXT_NODE && ((_a = node.textContent) === null || _a === void 0 ? void 0 : _a.trim())) {
                textContent = (textContent || '') + node.textContent;
            }
        }
        // Trim text content if it exists
        if (textContent) {
            textContent = textContent.trim();
        }
        return {
            id: `${element.nodeName}-${Date.now()}-${Math.random()}`,
            type: element.nodeName,
            attributes,
            children,
            textContent: textContent || undefined
        };
    };
    // Get the root element
    const rootElement = xmlDoc.documentElement;
    return parseElement(rootElement);
};
export const GenericTextEditor = ({ xmlTree, onUpdateTree }) => {
    const [xmlContent, setXmlContent] = useState('');
    const [error, setError] = useState(null);
    useEffect(() => {
        try {
            if (!xmlTree) {
                setXmlContent('');
                return;
            }
            // Generate proper XML content with XML declaration
            const content = `<?xml version="1.0" encoding="UTF-8"?>\n${nodeToXML(xmlTree, 0)}`;
            setXmlContent(content);
            setError(null);
        }
        catch (err) {
            setError('Error generating XML');
        }
    }, [xmlTree]);
    const handleXmlChange = (e) => {
        const newContent = e.target.value;
        setXmlContent(newContent);
        setError(null);
    };
    const applyChanges = () => {
        try {
            // Parse the XML content back to XMLNode structure
            const newTree = parseXmlString(xmlContent);
            onUpdateTree(newTree);
            setError(null);
        }
        catch (err) {
            setError('Error parsing XML: ' + (err instanceof Error ? err.message : String(err)));
        }
    };
    return (React.createElement("div", { className: "h-100 d-flex flex-column align-items-center p-1" },
        React.createElement("div", { style: { width: '100%', maxWidth: '100%', flex: 1, display: 'flex', flexDirection: 'column' } },
            React.createElement("textarea", { value: xmlContent, onChange: handleXmlChange, style: {
                    width: '100%',
                    background: '#f8f9fa',
                    padding: '0.5rem',
                    borderRadius: '0.125rem',
                    flex: 1,
                    fontFamily: 'monospace',
                    whiteSpace: 'pre',
                    wordBreak: 'break-word',
                    lineHeight: '1.2',
                    outline: 'none',
                    border: '1px solid #ced4da',
                    resize: 'none',
                    fontSize: '0.875rem'
                } }),
            error && (React.createElement(Alert, { variant: "danger", className: "mt-1 py-1" },
                React.createElement("small", null, error))),
            React.createElement(Button, { variant: "primary", onClick: applyChanges, className: "mt-1 py-0", disabled: !!error, size: "sm" }, "Apply"))));
};
