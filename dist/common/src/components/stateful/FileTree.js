"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileTree = void 0;
const react_1 = __importDefault(require("react"));
const FileTree = ({ files, onSelect, activeFile }) => {
    // Group files by directory
    const fileGroups = files.reduce((acc, file) => {
        const dir = file.path.split('/').slice(0, -1).join('/');
        if (!acc[dir]) {
            acc[dir] = [];
        }
        acc[dir].push(file);
        return acc;
    }, {});
    const fileTreeStyle = {
        padding: '8px',
        fontFamily: 'monospace'
    };
    const directoryStyle = {
        marginBottom: '8px'
    };
    const directoryNameStyle = {
        fontWeight: 'bold',
        padding: '4px 0',
        color: '#555'
    };
    const fileStyle = {
        padding: '4px 8px',
        cursor: 'pointer',
        borderRadius: '4px'
    };
    const activeFileStyle = Object.assign(Object.assign({}, fileStyle), { backgroundColor: '#e0e0e0', fontWeight: 'bold' });
    return (react_1.default.createElement("div", { style: fileTreeStyle }, Object.entries(fileGroups).map(([dir, dirFiles]) => (react_1.default.createElement("div", { key: dir, style: directoryStyle },
        react_1.default.createElement("div", { style: directoryNameStyle }, dir || '/'),
        dirFiles.map(file => (react_1.default.createElement("div", { key: file.path, style: activeFile === file.path ? activeFileStyle : fileStyle, onClick: () => onSelect(file.path) }, file.path.split('/').pop()))))))));
};
exports.FileTree = FileTree;
