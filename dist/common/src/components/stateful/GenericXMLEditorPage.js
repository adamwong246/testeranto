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
exports.GenericXMLEditorPage = void 0;
const react_1 = __importStar(require("react"));
const react_bootstrap_1 = require("react-bootstrap");
const GenericTree_1 = require("./GenericXMLEditor/GenericTree");
const GenericPreview_1 = require("./GenericXMLEditor/GenericPreview");
const GenericTextEditor_1 = require("./GenericXMLEditor/GenericTextEditor");
const Drawer_1 = require("./GenericXMLEditor/Drawer");
const GenericXMLEditorPage = ({ initialTree, renderPreview, attributeEditor, nodeTypes, onAddNode }) => {
    const [xmlTree, setXmlTree] = (0, react_1.useState)(initialTree);
    const [selectedNodeId, setSelectedNodeId] = (0, react_1.useState)(null);
    const [activeTab, setActiveTab] = (0, react_1.useState)("preview");
    const [history, setHistory] = (0, react_1.useState)([initialTree]);
    const [historyIndex, setHistoryIndex] = (0, react_1.useState)(0);
    const [hiddenNodes, setHiddenNodes] = (0, react_1.useState)(new Set());
    const [drawerStates, setDrawerStates] = (0, react_1.useState)({
        left: { isOpen: true, zIndex: 1 },
        right: { isOpen: true, zIndex: 1 },
        bottom: { isOpen: true, zIndex: 1 }
    });
    const [activeDrawer, setActiveDrawer] = (0, react_1.useState)(null);
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
        setXmlTree(newTree);
        setHistory((prevHistory) => {
            const newHistory = prevHistory.slice(0, historyIndex + 1);
            newHistory.push(newTree);
            return newHistory;
        });
        setHistoryIndex((prevIndex) => prevIndex + 1);
    }, [historyIndex]);
    // Update node attributes
    const updateNodeAttributes = (0, react_1.useCallback)((nodeId, attributes) => {
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
    const updateNodeTextContent = (0, react_1.useCallback)((nodeId, textContent) => {
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
    const handleAddChildNode = (0, react_1.useCallback)((parentId, nodeType) => {
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
    const removeNode = (0, react_1.useCallback)((nodeId) => {
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
    const handleUndo = (0, react_1.useCallback)(() => {
        if (historyIndex > 0) {
            setHistoryIndex((prevIndex) => prevIndex - 1);
            setXmlTree(history[historyIndex - 1]);
        }
    }, [history, historyIndex]);
    const handleRedo = (0, react_1.useCallback)(() => {
        if (historyIndex < history.length - 1) {
            setHistoryIndex((prevIndex) => prevIndex + 1);
            setXmlTree(history[historyIndex + 1]);
        }
    }, [history, historyIndex]);
    // Drawers are always open now, but we can keep the state for other purposes
    // Remove toggle functionality since we're always showing content
    // Bring drawer to front
    const bringToFront = (0, react_1.useCallback)((drawer) => {
        const maxZIndex = Math.max(drawerStates.left.zIndex, drawerStates.right.zIndex, drawerStates.bottom.zIndex);
        setDrawerStates(prev => {
            const newStates = Object.assign({}, prev);
            Object.keys(newStates).forEach(key => {
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
    return (react_1.default.createElement("div", { className: "d-flex flex-column h-100" },
        react_1.default.createElement("div", { className: "border-bottom p-2 bg-light" },
            react_1.default.createElement("div", { className: "d-flex justify-content-center align-items-center" },
                react_1.default.createElement(react_bootstrap_1.ButtonGroup, { size: "sm", className: "me-2" },
                    react_1.default.createElement(react_bootstrap_1.Button, { variant: activeTab === "preview" ? "primary" : "outline-secondary", onClick: () => setActiveTab("preview") }, "Preview"),
                    react_1.default.createElement(react_bootstrap_1.Button, { variant: activeTab === "text" ? "primary" : "outline-secondary", onClick: () => setActiveTab("text") }, "Text Mode")),
                react_1.default.createElement(react_bootstrap_1.ButtonGroup, { size: "sm" },
                    react_1.default.createElement(react_bootstrap_1.Button, { variant: "outline-secondary", onClick: handleUndo, disabled: historyIndex === 0 }, "Undo"),
                    react_1.default.createElement(react_bootstrap_1.Button, { variant: "outline-secondary", onClick: handleRedo, disabled: historyIndex === history.length - 1 }, "Redo")))),
        react_1.default.createElement("div", { className: "position-relative flex-grow-1" }, activeTab === "preview" ? (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement("div", { className: "position-absolute w-100 h-100 p-3" },
                react_1.default.createElement(GenericPreview_1.GenericPreview, { xmlTree: xmlTree, selectedNodeId: selectedNodeId, hiddenNodes: hiddenNodes, renderPreview: renderPreview })),
            react_1.default.createElement(Drawer_1.Drawer, { position: "left", isOpen: true, zIndex: drawerStates.left.zIndex, onBringToFront: () => bringToFront('left'), title: "Tree View" },
                react_1.default.createElement("ul", { style: { paddingLeft: '0', marginBottom: '0' } },
                    react_1.default.createElement(GenericTree_1.GenericTree, { node: xmlTree, selectedNodeId: selectedNodeId, onSelectNode: setSelectedNodeId, onAddNode: handleAddChildNode, onRemoveNode: removeNode, onToggleVisibility: toggleNodeVisibility, hiddenNodes: hiddenNodes, nodeTypes: nodeTypes }))),
            react_1.default.createElement(Drawer_1.Drawer, { position: "right", isOpen: true, zIndex: drawerStates.right.zIndex, onBringToFront: () => bringToFront('right'), title: "Attributes" }, selectedNode ? (react_1.default.createElement(react_bootstrap_1.Card, { className: "mb-3" },
                react_1.default.createElement(react_bootstrap_1.Card.Header, null,
                    react_1.default.createElement("strong", null,
                        "Node: ",
                        selectedNode.type)),
                react_1.default.createElement(react_bootstrap_1.Card.Body, null, attributeEditor(selectedNode, (attrs) => updateNodeAttributes(selectedNode.id, attrs), (text) => updateNodeTextContent(selectedNode.id, text))))) : (react_1.default.createElement(react_bootstrap_1.Card, null,
                react_1.default.createElement(react_bootstrap_1.Card.Body, null,
                    react_1.default.createElement("p", { className: "text-muted" }, "Select a node to edit its properties"))))),
            react_1.default.createElement(Drawer_1.Drawer, { position: "bottom", isOpen: true, zIndex: drawerStates.bottom.zIndex, onBringToFront: () => bringToFront('bottom'), title: "Navigation Help" },
                react_1.default.createElement("div", { className: "p-3" },
                    react_1.default.createElement("h4", null, "Pan & Zoom Controls"),
                    react_1.default.createElement("p", null,
                        react_1.default.createElement("strong", null, "Zoom:"),
                        " Use mouse wheel or +/- buttons"),
                    react_1.default.createElement("p", null,
                        react_1.default.createElement("strong", null, "Pan:"),
                        " Middle mouse button or Alt + Left click and drag"),
                    react_1.default.createElement("p", null,
                        react_1.default.createElement("strong", null, "Reset:"),
                        " Click the Reset button to return to default view"),
                    react_1.default.createElement("p", { className: "text-muted" }, "Note: These controls work across all editors (SVG, Bootstrap, GraphML)"))))) : (
        /* Text Mode - Full screen text editor, no drawers */
        react_1.default.createElement("div", { className: "w-100 h-100 d-flex justify-content-center p-3" },
            react_1.default.createElement(GenericTextEditor_1.GenericTextEditor, { xmlTree: xmlTree, onUpdateTree: setXmlTree }))))));
};
exports.GenericXMLEditorPage = GenericXMLEditorPage;
