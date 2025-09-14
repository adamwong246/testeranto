import React, { useState } from 'react';
import { Button, ButtonGroup, Dropdown } from 'react-bootstrap';
export const SVGTree = ({ node, selectedNodeId, onSelectNode, onAddNode, onRemoveNode, onToggleVisibility, onMoveNode, hiddenNodes, dragInfo, onDragStart, onDragEnd }) => {
    const isSelected = node.id === selectedNodeId;
    const isHidden = hiddenNodes.has(node.id);
    const [isDragOver, setIsDragOver] = useState(false);
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
    return (React.createElement("li", { style: { listStyle: 'none', marginLeft: '0', paddingLeft: '10px' }, onDragOver: handleDragOver, onDragLeave: handleDragLeave, onDrop: (e) => handleDrop(e, node.id) },
        React.createElement("div", { className: `d-flex justify-content-between align-items-center p-1 ${isSelected ? 'bg-primary text-white rounded' : ''} ${isDragOver ? 'bg-info' : ''}`, onClick: () => onSelectNode(node.id), style: { cursor: 'pointer' }, draggable: true, onDragStart: (e) => handleDragStart(e, node.id), onDragEnd: onDragEnd },
            React.createElement("span", { className: "flex-grow-1" },
                node.type,
                " (",
                node.id,
                ")"),
            node.type !== 'svg' && (React.createElement(ButtonGroup, { size: "sm" },
                React.createElement(Button, { variant: "outline-secondary", onClick: (e) => {
                        e.stopPropagation();
                        onToggleVisibility(node.id);
                    }, title: isHidden ? 'Show node' : 'Hide node' }, isHidden ? '👁️‍🗨️' : '👁️'),
                React.createElement(Button, { variant: "outline-danger", onClick: (e) => {
                        e.stopPropagation();
                        onRemoveNode(node.id);
                    }, title: "Remove node" }, "\u00D7")))),
        node.children.length > 0 && (React.createElement("ul", { style: { marginLeft: '20px', paddingLeft: '0' } }, node.children.map((child, index) => (React.createElement(SVGTree, { key: child.id, node: child, selectedNodeId: selectedNodeId, onSelectNode: onSelectNode, onAddNode: onAddNode, onRemoveNode: onRemoveNode, onToggleVisibility: onToggleVisibility, onMoveNode: onMoveNode, hiddenNodes: hiddenNodes, dragInfo: dragInfo, onDragStart: onDragStart, onDragEnd: onDragEnd }))))),
        isSelected && (React.createElement("div", { className: "mt-1" },
            React.createElement(Dropdown, null,
                React.createElement(Dropdown.Toggle, { size: "sm", variant: "outline-success", id: "dropdown-add-node" }, "Add Element"),
                React.createElement(Dropdown.Menu, null,
                    React.createElement(Dropdown.Item, { onClick: () => onAddNode(node.id, 'rect') }, "Rectangle"),
                    React.createElement(Dropdown.Item, { onClick: () => onAddNode(node.id, 'circle') }, "Circle"),
                    React.createElement(Dropdown.Item, { onClick: () => onAddNode(node.id, 'path') }, "Path"),
                    React.createElement(Dropdown.Item, { onClick: () => onAddNode(node.id, 'text') }, "Text"),
                    React.createElement(Dropdown.Item, { onClick: () => onAddNode(node.id, 'g') }, "Group")))))));
};
