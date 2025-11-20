"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileTree = void 0;
const react_1 = __importDefault(require("react"));
const react_2 = require("react");
const FileTreeItem_1 = require("./FileTreeItem");
const FileTree = ({ data, onSelect, level = 0, selectedSourcePath }) => {
    const [expanded, setExpanded] = (0, react_2.useState)({});
    const toggleExpand = (path) => {
        setExpanded((prev) => (Object.assign(Object.assign({}, prev), { [path]: !prev[path] })));
    };
    return (react_1.default.createElement("div", null, Object.entries(data).map(([name, node]) => {
        const path = Object.keys(expanded).find((k) => k.endsWith(name)) || name;
        const isExpanded = expanded[path];
        if (node.__isFile) {
            return (react_1.default.createElement(FileTreeItem_1.FileTreeItem, { key: name, name: name, isFile: true, level: level, isSelected: selectedSourcePath === path, onClick: () => onSelect(path, node.content) }));
        }
        else {
            return (react_1.default.createElement("div", { key: name },
                react_1.default.createElement("div", { className: "d-flex align-items-center py-1 text-dark", style: {
                        paddingLeft: `${level * 16}px`,
                        cursor: 'pointer',
                        fontSize: '0.875rem'
                    }, onClick: () => toggleExpand(path) },
                    react_1.default.createElement("i", { className: `bi ${isExpanded ? 'bi-folder2-open' : 'bi-folder'} me-1` }),
                    react_1.default.createElement("span", null, name)),
                isExpanded && (react_1.default.createElement(exports.FileTree, { data: node, onSelect: onSelect, level: level + 1, selectedSourcePath: selectedSourcePath }))));
        }
    })));
};
exports.FileTree = FileTree;
