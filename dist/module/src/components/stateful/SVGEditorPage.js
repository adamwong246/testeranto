/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useCallback } from "react";
import { SVGAttributesEditor } from "./SVGEditor/SVGAttributesEditor";
import { SVGElementForm } from "./SVGEditor/SVGElementForm";
import { GenericXMLEditorPage } from "./GenericXMLEditorPage";
import { SVGPreview } from "./SVGEditor/SVGPreview";
export const SVGEditorPage = () => {
    const initialTree = {
        id: "root",
        type: "svg",
        attributes: {
            width: "400",
            height: "400",
            viewBox: "0 0 400 400",
            xmlns: "http://www.w3.org/2000/svg",
        },
        children: [
            {
                id: "rect-1",
                type: "rect",
                attributes: {
                    x: "50",
                    y: "50",
                    width: "100",
                    height: "100",
                    fill: "blue",
                    stroke: "black",
                    "stroke-width": "2",
                },
                children: [],
            }
        ],
    };
    const [svgTree, setSvgTree] = useState(initialTree);
    const [selectedNodeId, setSelectedNodeId] = useState(null);
    const [activeTab, setActiveTab] = useState("preview");
    const [history, setHistory] = useState([initialTree]);
    const [historyIndex, setHistoryIndex] = useState(0);
    const [editMode, setEditMode] = useState("none");
    const [showGrid, setShowGrid] = useState(false);
    const [snapToGrid, setSnapToGrid] = useState(false);
    const [hiddenNodes, setHiddenNodes] = useState(new Set());
    const [dragInfo, setDragInfo] = useState({
        isDragging: false,
        nodeId: null,
    });
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
        setSvgTree(newTree);
        // Add to history, truncating future history if we're not at the end
        setHistory((prevHistory) => {
            const newHistory = prevHistory.slice(0, historyIndex + 1);
            newHistory.push(newTree);
            return newHistory;
        });
        setHistoryIndex((prevIndex) => prevIndex + 1);
    }, [historyIndex]);
    // Update node attributes
    const updateNodeAttributes = useCallback((nodeId, attributes) => {
        setSvgTree((prevTree) => {
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
        setSvgTree((prevTree) => {
            const newTree = JSON.parse(JSON.stringify(prevTree));
            const node = findNode(newTree, nodeId);
            if (node) {
                // For text and tspan nodes, we need to handle text content
                // This is a simplified approach - in a real implementation, you'd track text content separately
                // For now, we'll add a special attribute to track the text content
                node.attributes['data-text-content'] = textContent;
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
    // Handle drag start
    const handleDragStart = useCallback((nodeId) => {
        setDragInfo({ isDragging: true, nodeId });
    }, []);
    // Handle drag end
    const handleDragEnd = useCallback(() => {
        setDragInfo({ isDragging: false, nodeId: null });
    }, []);
    // Move a node
    const moveNode = useCallback((nodeId, newParentId, index) => {
        setSvgTree((prevTree) => {
            const newTree = JSON.parse(JSON.stringify(prevTree));
            // Find the node to move and its original parent
            let nodeToMove = null;
            let oldParent = null;
            const findNodeAndParent = (current, parent = null) => {
                if (current.id === nodeId) {
                    nodeToMove = current;
                    oldParent = parent;
                    return true;
                }
                for (const child of current.children) {
                    if (findNodeAndParent(child, current))
                        return true;
                }
                return false;
            };
            findNodeAndParent(newTree);
            if (!nodeToMove || !oldParent)
                return prevTree;
            // Remove from old parent
            oldParent.children = oldParent.children.filter((child) => child.id !== nodeId);
            // Find new parent
            let targetParent = null;
            if (newParentId === null) {
                targetParent = newTree;
            }
            else {
                const findParent = (current) => {
                    if (current.id === newParentId)
                        return current;
                    for (const child of current.children) {
                        const found = findParent(child);
                        if (found)
                            return found;
                    }
                    return null;
                };
                targetParent = findParent(newTree);
            }
            if (!targetParent)
                return prevTree;
            // Insert at specified index
            targetParent.children.splice(index, 0, nodeToMove);
            updateTree(newTree);
            return newTree;
        });
    }, [updateTree]);
    // Add a new child node
    const addChildNode = useCallback((parentId, nodeType) => {
        setSvgTree((prevTree) => {
            const newTree = JSON.parse(JSON.stringify(prevTree));
            const parent = findNode(newTree, parentId);
            if (parent) {
                // Default attributes based on node type to make them visible
                let defaultAttributes = {};
                switch (nodeType) {
                    case "rect":
                        defaultAttributes = {
                            x: "50",
                            y: "50",
                            width: "100",
                            height: "100",
                            fill: "blue",
                            stroke: "black",
                            "stroke-width": "2",
                        };
                        break;
                    case "circle":
                        defaultAttributes = {
                            cx: "100",
                            cy: "100",
                            r: "50",
                            fill: "red",
                            stroke: "black",
                            "stroke-width": "2",
                        };
                        break;
                    case "path":
                        defaultAttributes = {
                            d: "M50 50 L150 150",
                            stroke: "green",
                            "stroke-width": "3",
                            fill: "none",
                        };
                        break;
                    case "text":
                        defaultAttributes = {
                            x: "50",
                            y: "50",
                            fill: "black",
                            "font-size": "16",
                        };
                        break;
                    case "g":
                        defaultAttributes = {
                            transform: "translate(0,0)",
                        };
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
    const removeNode = useCallback((nodeId) => {
        setSvgTree((prevTree) => {
            const newTree = JSON.parse(JSON.stringify(prevTree));
            // Function to remove node from its parent's children
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
            setSvgTree(history[historyIndex - 1]);
        }
    }, [history, historyIndex]);
    const handleRedo = useCallback(() => {
        if (historyIndex < history.length - 1) {
            setHistoryIndex((prevIndex) => prevIndex + 1);
            setSvgTree(history[historyIndex + 1]);
        }
    }, [history, historyIndex]);
    // Move handler - for now, just log to console
    const handleMove = useCallback(() => {
        console.log("Move functionality to be implemented");
        // This would typically involve setting up a mode where nodes can be dragged
    }, []);
    // Helper variables for edit modes
    const isMoveMode = editMode === "move";
    const isScaleMode = editMode === "scale";
    const isRotateMode = editMode === "rotate";
    const selectedNode = selectedNodeId
        ? findNode(svgTree, selectedNodeId)
        : null;
    // Define node types for SVG
    const svgNodeTypes = [
        { label: 'Rectangle', type: 'rect' },
        { label: 'Circle', type: 'circle' },
        { label: 'Path', type: 'path' },
        { label: 'Text', type: 'text' },
        { label: 'Group', type: 'g' }
    ];
    // Function to create new SVG nodes
    const createSVGNode = (parentId, nodeType) => {
        // Default attributes based on node type
        let defaultAttributes = {};
        switch (nodeType) {
            case "rect":
                defaultAttributes = {
                    x: "50",
                    y: "50",
                    width: "100",
                    height: "100",
                    fill: "blue",
                    stroke: "black",
                    "stroke-width": "2",
                };
                break;
            case "circle":
                defaultAttributes = {
                    cx: "100",
                    cy: "100",
                    r: "50",
                    fill: "red",
                    stroke: "black",
                    "stroke-width": "2",
                };
                break;
            case "path":
                defaultAttributes = {
                    d: "M50 50 L150 150",
                    stroke: "green",
                    "stroke-width": "3",
                    fill: "none",
                };
                break;
            case "text":
                defaultAttributes = {
                    x: "50",
                    y: "50",
                    fill: "black",
                    "font-size": "16",
                };
                break;
            case "g":
                defaultAttributes = {
                    transform: "translate(0,0)",
                };
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
    // Render preview for SVG
    const renderSVGPreview = (node, isSelected, eventHandlers) => {
        const { type, attributes, children, textContent } = node;
        const style = isSelected ? { outline: '2px dashed blue' } : {};
        // Convert children to React elements
        const childElements = children.map(child => renderSVGPreview(child, selectedNodeId === child.id, {}));
        // Handle text content for text elements
        if (type === 'text' || type === 'tspan') {
            return React.createElement(type, Object.assign(Object.assign(Object.assign({ key: node.id }, attributes), eventHandlers), { style }), textContent, ...childElements);
        }
        // For other SVG elements
        // Note: React.createElement expects the type to be a string for HTML/SVG elements
        // Make sure the type is always lowercase
        const elementType = type.toLowerCase();
        return React.createElement(elementType, Object.assign(Object.assign(Object.assign({ key: node.id }, attributes), eventHandlers), { style }), childElements);
    };
    // Attribute editor for SVG
    const renderSVGAttributeEditor = (node, onUpdateAttributes, onUpdateTextContent) => {
        // Use SVGElementForm for supported types, fallback to SVGAttributesEditor
        if (["circle", "rect", "g"].includes(node.type)) {
            return (React.createElement(SVGElementForm, { elementType: node.type, attributes: node.attributes, onChange: onUpdateAttributes }));
        }
        else {
            return (React.createElement(SVGAttributesEditor, { node: node, onUpdateAttributes: onUpdateAttributes, onUpdateTextContent: onUpdateTextContent }));
        }
    };
    // Custom SVG preview that uses the original SVGPreview component
    const SvgCustomPreview = () => {
        // Convert XMLNode to SVGNode
        const svgTree = {
            id: xmlTree.id,
            type: xmlTree.type,
            attributes: xmlTree.attributes,
            children: xmlTree.children
        };
        return (React.createElement(SVGPreview, { svgTree: svgTree, editMode: editMode, showGrid: showGrid, selectedNodeId: selectedNodeId, onNodeInteraction: (nodeId, updates) => {
                // Update node attributes based on interaction
                updateNodeAttributes(nodeId, updates);
            }, hiddenNodes: hiddenNodes }));
    };
    // Modify renderSVGPreview to use our custom preview
    const renderSVGPreviewWithControls = (node, isSelected, eventHandlers) => {
        // For the generic preview, we'll still use the basic rendering
        // The SVG-specific interactions are handled by SVGPreview component
        return renderSVGPreview(node, isSelected, eventHandlers);
    };
    // For the SVG editor, we'll need to create a custom implementation
    // that properly integrates the SVGPreview component
    // Let's use the GenericXMLEditorPage but override the preview when in SVG mode
    return (React.createElement(GenericXMLEditorPage, { initialTree: initialTree, renderPreview: renderSVGPreviewWithControls, attributeEditor: renderSVGAttributeEditor, nodeTypes: svgNodeTypes, onAddNode: createSVGNode }));
};
