"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenericTree = void 0;
const react_1 = __importDefault(require("react"));
const react_bootstrap_1 = require("react-bootstrap");
const GenericTree = ({ node, selectedNodeId, onSelectNode, onAddNode, onRemoveNode, onToggleVisibility, hiddenNodes, nodeTypes }) => {
    const isSelected = node.id === selectedNodeId;
    const isHidden = hiddenNodes.has(node.id);
    return (react_1.default.createElement("li", { style: { listStyle: 'none', marginLeft: '0', paddingLeft: '10px' } },
        react_1.default.createElement("div", { className: `d-flex justify-content-between align-items-center p-1 ${isSelected ? 'bg-primary text-white rounded' : ''}`, onClick: () => onSelectNode(node.id), style: { cursor: 'pointer' } },
            react_1.default.createElement("span", { className: "flex-grow-1" },
                node.type,
                " (",
                node.id,
                ")"),
            node.type !== 'root' && (react_1.default.createElement(react_bootstrap_1.ButtonGroup, { size: "sm" },
                react_1.default.createElement(react_bootstrap_1.Button, { variant: "outline-secondary", onClick: (e) => {
                        e.stopPropagation();
                        onToggleVisibility(node.id);
                    }, title: isHidden ? 'Show node' : 'Hide node' }, isHidden ? '👁️‍🗨️' : '👁️'),
                react_1.default.createElement(react_bootstrap_1.Button, { variant: "outline-danger", onClick: (e) => {
                        e.stopPropagation();
                        onRemoveNode(node.id);
                    }, title: "Remove node" }, "\u00D7")))),
        node.children.length > 0 && (react_1.default.createElement("ul", { style: { marginLeft: '20px', paddingLeft: '0' } }, node.children.map((child) => (react_1.default.createElement(exports.GenericTree, { key: child.id, node: child, selectedNodeId: selectedNodeId, onSelectNode: onSelectNode, onAddNode: onAddNode, onRemoveNode: onRemoveNode, onToggleVisibility: onToggleVisibility, hiddenNodes: hiddenNodes, nodeTypes: nodeTypes }))))),
        isSelected && (react_1.default.createElement("div", { className: "mt-1" },
            react_1.default.createElement(react_bootstrap_1.Dropdown, null,
                react_1.default.createElement(react_bootstrap_1.Dropdown.Toggle, { size: "sm", variant: "outline-success", id: "dropdown-add-node" }, "Add Element"),
                react_1.default.createElement(react_bootstrap_1.Dropdown.Menu, null, nodeTypes.map(({ label, type }) => (react_1.default.createElement(react_bootstrap_1.Dropdown.Item, { key: type, onClick: () => onAddNode(node.id, type) }, label)))))))));
};
exports.GenericTree = GenericTree;
