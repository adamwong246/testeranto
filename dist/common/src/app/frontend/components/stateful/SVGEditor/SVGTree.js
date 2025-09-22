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
exports.SVGTree = void 0;
const react_1 = __importStar(require("react"));
const react_bootstrap_1 = require("react-bootstrap");
const SVGTree = ({ node, selectedNodeId, onSelectNode, onAddNode, onRemoveNode, onToggleVisibility, onMoveNode, hiddenNodes, dragInfo, onDragStart, onDragEnd }) => {
    const isSelected = node.id === selectedNodeId;
    const isHidden = hiddenNodes.has(node.id);
    const [isDragOver, setIsDragOver] = (0, react_1.useState)(false);
    const handleDragStart = (e, nodeId) => {
        e.dataTransfer.setData('text/plain', nodeId);
        onDragStart(nodeId);
    };
    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragOver(true);
        e.dataTransfer.dropEffect = 'move';
    };
    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragOver(false);
    };
    const handleDrop = (e, targetNodeId) => {
        e.preventDefault();
        setIsDragOver(false);
        const draggedNodeId = e.dataTransfer.getData('text/plain');
        if (draggedNodeId && draggedNodeId !== targetNodeId) {
            // Move the node to be a child of the target node
            onMoveNode(draggedNodeId, targetNodeId, node.children.length);
        }
        onDragEnd();
    };
    const handleDropBefore = (e, targetNodeId, index) => {
        e.preventDefault();
        e.stopPropagation();
        const draggedNodeId = e.dataTransfer.getData('text/plain');
        if (draggedNodeId && draggedNodeId !== targetNodeId) {
            // Find the parent of the target node to insert at the correct index
            // For simplicity, we'll pass the parent ID and index to onMoveNode
            // This requires some restructuring, but for now, we'll use a placeholder
            // In a real implementation, you'd need to know the parent node
        }
        onDragEnd();
    };
    return (react_1.default.createElement("li", { style: { listStyle: 'none', marginLeft: '0', paddingLeft: '10px' }, onDragOver: handleDragOver, onDragLeave: handleDragLeave, onDrop: (e) => handleDrop(e, node.id) },
        react_1.default.createElement("div", { className: `d-flex justify-content-between align-items-center p-1 ${isSelected ? 'bg-primary text-white rounded' : ''} ${isDragOver ? 'bg-info' : ''}`, onClick: () => onSelectNode(node.id), style: { cursor: 'pointer' }, draggable: true, onDragStart: (e) => handleDragStart(e, node.id), onDragEnd: onDragEnd },
            react_1.default.createElement("span", { className: "flex-grow-1" },
                node.type,
                " (",
                node.id,
                ")"),
            node.type !== 'svg' && (react_1.default.createElement(react_bootstrap_1.ButtonGroup, { size: "sm" },
                react_1.default.createElement(react_bootstrap_1.Button, { variant: "outline-secondary", onClick: (e) => {
                        e.stopPropagation();
                        onToggleVisibility(node.id);
                    }, title: isHidden ? 'Show node' : 'Hide node' }, isHidden ? '👁️‍🗨️' : '👁️'),
                react_1.default.createElement(react_bootstrap_1.Button, { variant: "outline-danger", onClick: (e) => {
                        e.stopPropagation();
                        onRemoveNode(node.id);
                    }, title: "Remove node" }, "\u00D7")))),
        node.children.length > 0 && (react_1.default.createElement("ul", { style: { marginLeft: '20px', paddingLeft: '0' } }, node.children.map((child, index) => (react_1.default.createElement(exports.SVGTree, { key: child.id, node: child, selectedNodeId: selectedNodeId, onSelectNode: onSelectNode, onAddNode: onAddNode, onRemoveNode: onRemoveNode, onToggleVisibility: onToggleVisibility, onMoveNode: onMoveNode, hiddenNodes: hiddenNodes, dragInfo: dragInfo, onDragStart: onDragStart, onDragEnd: onDragEnd }))))),
        isSelected && (react_1.default.createElement("div", { className: "mt-1" },
            react_1.default.createElement(react_bootstrap_1.Dropdown, null,
                react_1.default.createElement(react_bootstrap_1.Dropdown.Toggle, { size: "sm", variant: "outline-success", id: "dropdown-add-node" }, "Add Element"),
                react_1.default.createElement(react_bootstrap_1.Dropdown.Menu, null,
                    react_1.default.createElement(react_bootstrap_1.Dropdown.Item, { onClick: () => onAddNode(node.id, 'rect') }, "Rectangle"),
                    react_1.default.createElement(react_bootstrap_1.Dropdown.Item, { onClick: () => onAddNode(node.id, 'circle') }, "Circle"),
                    react_1.default.createElement(react_bootstrap_1.Dropdown.Item, { onClick: () => onAddNode(node.id, 'path') }, "Path"),
                    react_1.default.createElement(react_bootstrap_1.Dropdown.Item, { onClick: () => onAddNode(node.id, 'text') }, "Text"),
                    react_1.default.createElement(react_bootstrap_1.Dropdown.Item, { onClick: () => onAddNode(node.id, 'g') }, "Group")))))));
};
exports.SVGTree = SVGTree;
