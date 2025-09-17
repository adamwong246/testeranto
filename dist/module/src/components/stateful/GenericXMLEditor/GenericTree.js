import React from 'react';
import { Button, ButtonGroup, Dropdown } from 'react-bootstrap';
export const GenericTree = ({ node, selectedNodeId, onSelectNode, onAddNode, onRemoveNode, onToggleVisibility, hiddenNodes, nodeTypes }) => {
    const isSelected = node.id === selectedNodeId;
    const isHidden = hiddenNodes.has(node.id);
    return (React.createElement("li", { style: { listStyle: 'none', marginLeft: '0', paddingLeft: '10px' } },
        React.createElement("div", { className: `d-flex justify-content-between align-items-center p-0 ${isSelected ? 'bg-primary text-white rounded-sm' : ''}`, onClick: () => onSelectNode(node.id), style: { cursor: 'pointer' } },
            React.createElement("span", { className: "flex-grow-1 small" }, node.type),
            node.type !== 'root' && (React.createElement(ButtonGroup, { size: "sm" },
                React.createElement(Button, { variant: "outline-secondary", onClick: (e) => {
                        e.stopPropagation();
                        onToggleVisibility(node.id);
                    }, title: isHidden ? 'Show node' : 'Hide node' }, isHidden ? '👁️‍🗨️' : '👁️'),
                React.createElement(Button, { variant: "outline-danger", onClick: (e) => {
                        e.stopPropagation();
                        onRemoveNode(node.id);
                    }, title: "Remove node" }, "\u00D7")))),
        node.children.length > 0 && (React.createElement("ul", { style: { marginLeft: '10px', paddingLeft: '0' } }, node.children.map((child) => (React.createElement(GenericTree, { key: child.id, node: child, selectedNodeId: selectedNodeId, onSelectNode: onSelectNode, onAddNode: onAddNode, onRemoveNode: onRemoveNode, onToggleVisibility: onToggleVisibility, hiddenNodes: hiddenNodes, nodeTypes: nodeTypes }))))),
        isSelected && (React.createElement("div", { className: "mt-0" },
            React.createElement(Dropdown, null,
                React.createElement(Dropdown.Toggle, { size: "sm", variant: "outline-success", id: "dropdown-add-node", className: "py-0 px-1" }, "+"),
                React.createElement(Dropdown.Menu, null, nodeTypes.map(({ label, type }) => (React.createElement(Dropdown.Item, { key: type, onClick: () => onAddNode(node.id, type), className: "small" }, label)))))))));
};
