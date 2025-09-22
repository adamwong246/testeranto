/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Form, Alert, Button } from 'react-bootstrap';
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
export const SVGTextEditor = ({ svgTree, onUpdateTree }) => {
    const [xmlContent, setXmlContent] = useState('');
    const [error, setError] = useState(null);
    useEffect(() => {
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
    return (React.createElement("div", { className: "h-100 d-flex flex-column" },
        React.createElement(Form.Control, { as: "textarea", value: xmlContent, onChange: handleXmlChange, className: "flex-grow-1 font-monospace", style: { minHeight: '300px' }, placeholder: "Edit SVG content as XML..." }),
        error && (React.createElement(Alert, { variant: "danger", className: "mt-2" }, error)),
        React.createElement(Button, { variant: "primary", onClick: applyChanges, className: "mt-2", disabled: !!error }, "Apply Changes")));
};
