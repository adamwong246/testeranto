/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useCallback, useEffect } from "react";
import { Card, Button, ButtonGroup } from "react-bootstrap";
import { GenericTree } from "./GenericXMLEditor/GenericTree";
import { GenericPreview } from "./GenericXMLEditor/GenericPreview";
import { GenericTextEditor } from "./GenericXMLEditor/GenericTextEditor";
import { Drawer } from "./GenericXMLEditor/Drawer";
export const GenericXMLEditorPage = ({ initialTree, renderPreview, attributeEditor, nodeTypes, onAddNode, }) => {
    const [xmlTree, setXmlTree] = useState(initialTree);
    // Add a check to ensure xmlTree is never undefined
    useEffect(() => {
        if (!xmlTree) {
            console.error("xmlTree became undefined, resetting to initialTree");
            setXmlTree(initialTree);
        }
    }, [xmlTree, initialTree]);
    const [selectedNodeId, setSelectedNodeId] = useState(null);
    const [activeTab, setActiveTab] = useState("preview");
    const [history, setHistory] = useState([initialTree]);
    const [historyIndex, setHistoryIndex] = useState(0);
    const [hiddenNodes, setHiddenNodes] = useState(new Set());
    const [drawerStates, setDrawerStates] = useState({
        left: { isOpen: true, zIndex: 1 },
        right: { isOpen: true, zIndex: 1 },
        bottom: { isOpen: true, zIndex: 1 },
    });
    const [activeDrawer, setActiveDrawer] = useState(null);
    // Find a node by ID
    const findNode = useCallback((node, id) => {
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
    const updateTree = useCallback((newTree) => {
        setXmlTree(newTree);
        setHistory((prevHistory) => {
            const newHistory = prevHistory.slice(0, historyIndex + 1);
            newHistory.push(newTree);
            return newHistory;
        });
        setHistoryIndex((prevIndex) => prevIndex + 1);
    }, [historyIndex]);
    // Update node attributes
    const updateNodeAttributes = useCallback((nodeId, attributes) => {
        setXmlTree((prevTree) => {
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
    const updateNodeTextContent = useCallback((nodeId, textContent) => {
        setXmlTree((prevTree) => {
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
    const toggleNodeVisibility = useCallback((nodeId) => {
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
    const handleAddChildNode = useCallback((parentId, nodeType) => {
        setXmlTree((prevTree) => {
            const newTree = JSON.parse(JSON.stringify(prevTree));
            const parent = findNode(newTree, parentId);
            if (parent) {
                const newNode = onAddNode(parentId, nodeType);
                parent.children = [...parent.children, newNode];
                setSelectedNodeId(newNode.id);
                updateTree(newTree);
            }
            return newTree;
        });
    }, [findNode, updateTree, onAddNode]);
    // Remove a node
    const removeNode = useCallback((nodeId) => {
        setXmlTree((prevTree) => {
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
    const handleUndo = useCallback(() => {
        if (historyIndex > 0) {
            setHistoryIndex((prevIndex) => prevIndex - 1);
            setXmlTree(history[historyIndex - 1]);
        }
    }, [history, historyIndex]);
    const handleRedo = useCallback(() => {
        if (historyIndex < history.length - 1) {
            setHistoryIndex((prevIndex) => prevIndex + 1);
            setXmlTree(history[historyIndex + 1]);
        }
    }, [history, historyIndex]);
    // Drawers are always open now, but we can keep the state for other purposes
    // Remove toggle functionality since we're always showing content
    // Bring drawer to front
    const bringToFront = useCallback((drawer) => {
        const maxZIndex = Math.max(drawerStates.left.zIndex, drawerStates.right.zIndex, drawerStates.bottom.zIndex);
        setDrawerStates((prev) => {
            const newStates = Object.assign({}, prev);
            Object.keys(newStates).forEach((key) => {
                if (key === drawer) {
                    newStates[key].zIndex = maxZIndex + 1;
                }
                else {
                    newStates[key].zIndex = Math.max(1, newStates[key].zIndex - 1);
                }
            });
            return newStates;
        });
        setActiveDrawer(drawer);
    }, [drawerStates]);
    const selectedNode = selectedNodeId
        ? findNode(xmlTree, selectedNodeId)
        : null;
    // Function to convert XML tree to XML string with proper formatting
    const convertTreeToXML = useCallback((node, depth = 0) => {
        const indent = '  '.repeat(depth);
        const attributes = Object.entries(node.attributes)
            .map(([key, value]) => ` ${key}="${value}"`)
            .join('');
        // Handle text content
        const hasTextContent = node.textContent && node.textContent.trim().length > 0;
        if (node.children.length === 0) {
            if (hasTextContent) {
                return `${indent}<${node.type}${attributes}>${node.textContent}</${node.type}>\n`;
            }
            else {
                return `${indent}<${node.type}${attributes} />\n`;
            }
        }
        else {
            let result = `${indent}<${node.type}${attributes}`;
            // If there are children and text content, we need to be careful
            if (hasTextContent) {
                result += `>${node.textContent}\n`;
            }
            else {
                result += '>\n';
            }
            // Add children
            node.children.forEach(child => {
                result += convertTreeToXML(child, depth + 1);
            });
            result += `${indent}</${node.type}>\n`;
            return result;
        }
    }, []);
    // Function to handle saving the XML
    const handleSave = useCallback(async () => {
        // Convert the XML tree to a proper XML string
        const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>\n${convertTreeToXML(xmlTree)}`;
        // Debug: log the content being sent
        console.log('Saving XML content:', xmlContent);
        // Let's also check if the content looks right
        if (!xmlContent.includes('kanban:KanbanProcess')) {
            console.warn('XML content may not be properly formatted');
        }
        try {
            const response = await fetch('/api/files/write', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    path: 'example/single-kanban-process.xml',
                    content: xmlContent
                })
            });
            if (response.ok) {
                alert('File saved successfully!');
                // Refresh the page to see changes
                window.location.reload();
            }
            else {
                const error = await response.json();
                console.error('Error response:', error);
                alert(`Error saving file: ${error.error}`);
            }
        }
        catch (error) {
            console.error('Error saving file:', error);
            alert('Failed to save file');
        }
    }, [xmlTree, convertTreeToXML]);
    return (React.createElement("div", { className: "d-flex flex-column h-100" },
        React.createElement("div", { className: "border-bottom p-0 bg-light" },
            React.createElement("div", { className: "d-flex justify-content-center align-items-center" },
                React.createElement(ButtonGroup, { size: "sm", className: "me-2" },
                    React.createElement(Button, { variant: activeTab === "preview" ? "primary" : "outline-secondary", onClick: () => setActiveTab("preview") }, "Preview"),
                    React.createElement(Button, { variant: activeTab === "text" ? "primary" : "outline-secondary", onClick: () => setActiveTab("text") }, "Text Mode")),
                React.createElement(ButtonGroup, { size: "sm", className: "me-2" },
                    React.createElement(Button, { variant: "outline-secondary", onClick: handleUndo, disabled: historyIndex === 0 }, "Undo"),
                    React.createElement(Button, { variant: "outline-secondary", onClick: handleRedo, disabled: historyIndex === history.length - 1 }, "Redo")),
                React.createElement(ButtonGroup, { size: "sm" },
                    React.createElement(Button, { variant: "outline-success", onClick: handleSave }, "Save")))),
        React.createElement("div", { className: "position-relative flex-grow-1" }, activeTab === "preview" ? (React.createElement(React.Fragment, null,
            React.createElement("div", { className: "position-absolute w-100 h-100 p-0" }, xmlTree && (React.createElement(GenericPreview, { xmlTree: xmlTree, selectedNodeId: selectedNodeId, hiddenNodes: hiddenNodes, renderPreview: (node, isSelected, eventHandlers) => renderPreview(node, isSelected, eventHandlers, updateTree) }))),
            React.createElement(Drawer, { position: "left", isOpen: true, zIndex: drawerStates.left.zIndex, onBringToFront: () => bringToFront("left"), title: "Tree View" },
                React.createElement("ul", { style: { paddingLeft: "0", marginBottom: "0" } },
                    React.createElement(GenericTree, { node: xmlTree, selectedNodeId: selectedNodeId, onSelectNode: setSelectedNodeId, onAddNode: handleAddChildNode, onRemoveNode: removeNode, onToggleVisibility: toggleNodeVisibility, hiddenNodes: hiddenNodes, nodeTypes: nodeTypes }))),
            React.createElement(Drawer, { position: "right", isOpen: true, zIndex: drawerStates.right.zIndex, onBringToFront: () => bringToFront("right"), title: "Attributes" }, selectedNode ? (React.createElement(Card, { className: "mb-3" },
                React.createElement(Card.Header, null,
                    React.createElement("strong", null,
                        "Node: ",
                        selectedNode.type)),
                React.createElement(Card.Body, null, attributeEditor(selectedNode, (attrs) => updateNodeAttributes(selectedNode.id, attrs), (text) => updateNodeTextContent(selectedNode.id, text))))) : (React.createElement(Card, null,
                React.createElement(Card.Body, null,
                    React.createElement("p", { className: "text-muted" }, "Select a node to edit its properties"))))),
            React.createElement(Drawer, { position: "bottom", isOpen: true, zIndex: drawerStates.bottom.zIndex, onBringToFront: () => bringToFront("bottom"), title: "Navigation Help" },
                React.createElement("div", { className: "p-1" },
                    React.createElement("h6", { className: "mb-0 small" }, "Pan & Zoom"),
                    React.createElement("p", { className: "mb-0 small" },
                        React.createElement("strong", null, "Zoom:"),
                        " Wheel"),
                    React.createElement("p", { className: "mb-0 small" },
                        React.createElement("strong", null, "Pan:"),
                        " Alt+drag"),
                    React.createElement("p", { className: "mb-0 small" },
                        React.createElement("strong", null, "Reset:"),
                        " Button"))))) : (
        /* Text Mode - Full screen text editor, no drawers */
        React.createElement("div", { className: "w-100 h-100 d-flex justify-content-center p-0" },
            React.createElement(GenericTextEditor, { xmlTree: xmlTree, onUpdateTree: setXmlTree }))))));
};
