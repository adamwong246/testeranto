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
exports.DratoPage = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
const react_1 = __importStar(require("react"));
const GenericXMLEditorPage_1 = require("./GenericXMLEditorPage");
const DratoPage = () => {
    const initialTree = {
        id: "root",
        type: "Container",
        attributes: {
            fluid: "true"
        },
        children: [],
    };
    const [bootstrapTree, setBootstrapTree] = (0, react_1.useState)(initialTree);
    const [selectedNodeId, setSelectedNodeId] = (0, react_1.useState)(null);
    const [activeTab, setActiveTab] = (0, react_1.useState)("preview");
    const [history, setHistory] = (0, react_1.useState)([initialTree]);
    const [historyIndex, setHistoryIndex] = (0, react_1.useState)(0);
    const [hiddenNodes, setHiddenNodes] = (0, react_1.useState)(new Set());
    // Find a node by ID
    const findNode = (0, react_1.useCallback)((node, id) => {
        if (node.id === id)
            return node;
        for (const child of node.children) {
            const found = findNode(child, id);
            if (found)
                return found;
        }
        return null;
    }, []);
    // Helper to update tree and manage history
    const updateTree = (0, react_1.useCallback)((newTree) => {
        setBootstrapTree(newTree);
        setHistory((prevHistory) => {
            const newHistory = prevHistory.slice(0, historyIndex + 1);
            newHistory.push(newTree);
            return newHistory;
        });
        setHistoryIndex((prevIndex) => prevIndex + 1);
    }, [historyIndex]);
    // Update node attributes
    const updateNodeAttributes = (0, react_1.useCallback)((nodeId, attributes) => {
        setBootstrapTree((prevTree) => {
            const newTree = JSON.parse(JSON.stringify(prevTree));
            const node = findNode(newTree, nodeId);
            if (node) {
                node.attributes = Object.assign(Object.assign({}, node.attributes), attributes);
            }
            updateTree(newTree);
            return newTree;
        });
    }, [findNode, updateTree]);
    // Update node text content
    const updateNodeTextContent = (0, react_1.useCallback)((nodeId, textContent) => {
        setBootstrapTree((prevTree) => {
            const newTree = JSON.parse(JSON.stringify(prevTree));
            const node = findNode(newTree, nodeId);
            if (node) {
                node.textContent = textContent;
            }
            updateTree(newTree);
            return newTree;
        });
    }, [findNode, updateTree]);
    // Toggle node visibility
    const toggleNodeVisibility = (0, react_1.useCallback)((nodeId) => {
        setHiddenNodes((prev) => {
            const newHidden = new Set(prev);
            if (newHidden.has(nodeId)) {
                newHidden.delete(nodeId);
            }
            else {
                newHidden.add(nodeId);
            }
            return newHidden;
        });
    }, []);
    // Add a new child node
    const addChildNode = (0, react_1.useCallback)((parentId, nodeType) => {
        setBootstrapTree((prevTree) => {
            const newTree = JSON.parse(JSON.stringify(prevTree));
            const parent = findNode(newTree, parentId);
            if (parent) {
                // Default attributes based on node type
                let defaultAttributes = {};
                switch (nodeType) {
                    case "Container":
                        defaultAttributes = { fluid: "true" };
                        break;
                    case "Row":
                        defaultAttributes = {};
                        break;
                    case "Col":
                        defaultAttributes = { xs: "12" };
                        break;
                    case "Button":
                        defaultAttributes = { variant: "primary" };
                        break;
                    case "Card":
                        defaultAttributes = {};
                        break;
                    default:
                        defaultAttributes = {};
                }
                const newNode = {
                    id: `${nodeType}-${Date.now()}`,
                    type: nodeType,
                    attributes: defaultAttributes,
                    children: [],
                };
                parent.children = [...parent.children, newNode];
                setSelectedNodeId(newNode.id);
                updateTree(newTree);
            }
            return newTree;
        });
    }, [findNode, updateTree]);
    // Remove a node
    const removeNode = (0, react_1.useCallback)((nodeId) => {
        setBootstrapTree((prevTree) => {
            const newTree = JSON.parse(JSON.stringify(prevTree));
            const removeFromParent = (node, targetId) => {
                for (let i = 0; i < node.children.length; i++) {
                    if (node.children[i].id === targetId) {
                        node.children.splice(i, 1);
                        return true;
                    }
                    if (removeFromParent(node.children[i], targetId)) {
                        return true;
                    }
                }
                return false;
            };
            removeFromParent(newTree, nodeId);
            if (selectedNodeId === nodeId) {
                setSelectedNodeId(null);
            }
            updateTree(newTree);
            return newTree;
        });
    }, [selectedNodeId, updateTree]);
    // Undo/Redo handlers
    const handleUndo = (0, react_1.useCallback)(() => {
        if (historyIndex > 0) {
            setHistoryIndex((prevIndex) => prevIndex - 1);
            setBootstrapTree(history[historyIndex - 1]);
        }
    }, [history, historyIndex]);
    const handleRedo = (0, react_1.useCallback)(() => {
        if (historyIndex < history.length - 1) {
            setHistoryIndex((prevIndex) => prevIndex + 1);
            setBootstrapTree(history[historyIndex + 1]);
        }
    }, [history, historyIndex]);
    const selectedNode = selectedNodeId
        ? findNode(bootstrapTree, selectedNodeId)
        : null;
    // Define node types for Bootstrap
    const bootstrapNodeTypes = [
        { label: 'Container', type: 'Container' },
        { label: 'Row', type: 'Row' },
        { label: 'Column', type: 'Col' },
        { label: 'Button', type: 'Button' },
        { label: 'Card', type: 'Card' },
        { label: 'Text', type: 'Text' }
    ];
    // Function to create new Bootstrap nodes
    const createBootstrapNode = (parentId, nodeType) => {
        // Default attributes based on node type
        let defaultAttributes = {};
        switch (nodeType) {
            case "Container":
                defaultAttributes = { fluid: "true" };
                break;
            case "Row":
                defaultAttributes = {};
                break;
            case "Col":
                defaultAttributes = { xs: "12" };
                break;
            case "Button":
                defaultAttributes = { variant: "primary" };
                break;
            case "Card":
                defaultAttributes = {};
                break;
            case "Text":
                defaultAttributes = { class: "" };
                break;
            default:
                defaultAttributes = {};
        }
        return {
            id: `${nodeType}-${Date.now()}`,
            type: nodeType,
            attributes: defaultAttributes,
            children: [],
        };
    };
    // Render preview for Bootstrap
    const renderBootstrapPreview = (node, isSelected, eventHandlers) => {
        // Render Bootstrap components based on node type
        const { type, attributes, children, textContent } = node;
        const style = isSelected ? { outline: '2px dashed blue' } : {};
        // Convert children to React elements
        const childElements = children.map(child => renderBootstrapPreview(child, selectedNodeId === child.id, {}));
        // Handle different Bootstrap component types
        switch (type) {
            case 'Container':
                return (react_1.default.createElement("div", Object.assign({ key: node.id, className: `container${attributes.fluid === 'true' ? '-fluid' : ''}`, style: style }, eventHandlers),
                    childElements,
                    textContent));
            case 'Row':
                return (react_1.default.createElement("div", Object.assign({ key: node.id, className: "row", style: style }, eventHandlers),
                    childElements,
                    textContent));
            case 'Col':
                // Generate column classes based on attributes
                const colClasses = Object.entries(attributes)
                    .filter(([key]) => ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'].includes(key))
                    .map(([breakpoint, size]) => `col-${breakpoint}-${size}`)
                    .join(' ');
                return (react_1.default.createElement("div", Object.assign({ key: node.id, className: colClasses || 'col', style: style }, eventHandlers),
                    childElements,
                    textContent));
            case 'Button':
                return (react_1.default.createElement("button", Object.assign({ key: node.id, className: `btn btn-${attributes.variant || 'primary'}`, style: style }, eventHandlers), textContent || 'Button'));
            case 'Card':
                return (react_1.default.createElement("div", Object.assign({ key: node.id, className: "card", style: style }, eventHandlers),
                    react_1.default.createElement("div", { className: "card-body" },
                        childElements,
                        textContent)));
            case 'Text':
                return (react_1.default.createElement("div", Object.assign({ key: node.id, className: attributes.class || '', style: style }, eventHandlers),
                    textContent,
                    childElements));
            default:
                return (react_1.default.createElement("div", Object.assign({ key: node.id, style: style }, eventHandlers),
                    type,
                    " element",
                    childElements,
                    textContent));
        }
    };
    // Attribute editor for Bootstrap
    const renderBootstrapAttributeEditor = (node, onUpdateAttributes, onUpdateTextContent) => {
        const handleAttributeChange = (key, value) => {
            const newAttributes = Object.assign(Object.assign({}, node.attributes), { [key]: value });
            onUpdateAttributes(newAttributes);
        };
        const handleTextChange = (e) => {
            onUpdateTextContent(e.target.value);
        };
        // Render different attribute editors based on node type
        return (react_1.default.createElement("div", null,
            (node.type === 'Button' || node.type === 'Card' || node.type === 'Text') && (react_1.default.createElement("div", { className: "mb-3" },
                react_1.default.createElement("label", { className: "form-label" }, "Text Content"),
                react_1.default.createElement("input", { type: "text", className: "form-control", value: node.textContent || '', onChange: handleTextChange }))),
            node.type === 'Container' && (react_1.default.createElement("div", { className: "mb-3" },
                react_1.default.createElement("label", { className: "form-label" }, "Fluid"),
                react_1.default.createElement("select", { className: "form-select", value: node.attributes.fluid || 'false', onChange: (e) => handleAttributeChange('fluid', e.target.value) },
                    react_1.default.createElement("option", { value: "true" }, "True"),
                    react_1.default.createElement("option", { value: "false" }, "False")))),
            node.type === 'Col' && (react_1.default.createElement("div", null, ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'].map(breakpoint => (react_1.default.createElement("div", { key: breakpoint, className: "mb-2" },
                react_1.default.createElement("label", { className: "form-label" }, breakpoint.toUpperCase()),
                react_1.default.createElement("input", { type: "text", className: "form-control", value: node.attributes[breakpoint] || '', onChange: (e) => handleAttributeChange(breakpoint, e.target.value), placeholder: "1-12" })))))),
            node.type === 'Button' && (react_1.default.createElement("div", { className: "mb-3" },
                react_1.default.createElement("label", { className: "form-label" }, "Variant"),
                react_1.default.createElement("select", { className: "form-select", value: node.attributes.variant || 'primary', onChange: (e) => handleAttributeChange('variant', e.target.value) }, ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'].map(variant => (react_1.default.createElement("option", { key: variant, value: variant }, variant)))))),
            node.type === 'Text' && (react_1.default.createElement("div", { className: "mb-3" },
                react_1.default.createElement("label", { className: "form-label" }, "CSS Classes"),
                react_1.default.createElement("input", { type: "text", className: "form-control", value: node.attributes.class || '', onChange: (e) => handleAttributeChange('class', e.target.value), placeholder: "e.g., text-primary fs-4" }))),
            react_1.default.createElement("div", { className: "mb-3" },
                react_1.default.createElement("label", { className: "form-label" }, "Other Attributes"),
                Object.entries(node.attributes)
                    .filter(([key]) => !['fluid', 'variant'].includes(key) && !['xs', 'sm', 'md', 'lg', 'xl', 'xxl'].includes(key))
                    .map(([key, value]) => (react_1.default.createElement("div", { key: key, className: "input-group mb-2" },
                    react_1.default.createElement("span", { className: "input-group-text" }, key),
                    react_1.default.createElement("input", { type: "text", className: "form-control", value: value, onChange: (e) => handleAttributeChange(key, e.target.value) })))))));
    };
    return (react_1.default.createElement(GenericXMLEditorPage_1.GenericXMLEditorPage, { initialTree: initialTree, renderPreview: renderBootstrapPreview, attributeEditor: renderBootstrapAttributeEditor, nodeTypes: bootstrapNodeTypes, onAddNode: createBootstrapNode }));
};
exports.DratoPage = DratoPage;
