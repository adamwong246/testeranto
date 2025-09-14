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
exports.GenericPreview = void 0;
const react_1 = __importStar(require("react"));
const react_bootstrap_1 = require("react-bootstrap");
const GenericPreview = ({ xmlTree, selectedNodeId, hiddenNodes, renderPreview }) => {
    const [scale, setScale] = (0, react_1.useState)(1);
    const [position, setPosition] = (0, react_1.useState)({ x: 0, y: 0 });
    const [isPanning, setIsPanning] = (0, react_1.useState)(false);
    const [startPanPoint, setStartPanPoint] = (0, react_1.useState)({ x: 0, y: 0 });
    const previewRef = (0, react_1.useRef)(null);
    const renderNode = (node) => {
        // Skip rendering if node is hidden
        if (hiddenNodes.has(node.id)) {
            return null;
        }
        const isSelected = selectedNodeId === node.id;
        const eventHandlers = {};
        // Render children
        const children = node.children
            .map(renderNode)
            .filter(child => child !== null);
        // Use the provided renderPreview function
        return renderPreview(node, isSelected, eventHandlers);
    };
    // Handle mouse events for panning
    const handleMouseDown = (0, react_1.useCallback)((e) => {
        if (e.button === 1 || (e.button === 0 && e.altKey)) { // Middle click or Alt + Left click
            e.preventDefault();
            setIsPanning(true);
            setStartPanPoint({ x: e.clientX - position.x, y: e.clientY - position.y });
        }
    }, [position]);
    const handleMouseMove = (0, react_1.useCallback)((e) => {
        if (isPanning) {
            setPosition({
                x: e.clientX - startPanPoint.x,
                y: e.clientY - startPanPoint.y
            });
        }
    }, [isPanning, startPanPoint]);
    const handleMouseUp = (0, react_1.useCallback)(() => {
        setIsPanning(false);
    }, []);
    const handleWheel = (0, react_1.useCallback)((e) => {
        e.preventDefault();
        const delta = -e.deltaY * 0.01;
        setScale(prevScale => Math.max(0.1, Math.min(5, prevScale + delta)));
    }, []);
    const resetView = (0, react_1.useCallback)(() => {
        setScale(1);
        setPosition({ x: 0, y: 0 });
    }, []);
    // Check if we're rendering SVG content (root node is svg)
    const isSVG = xmlTree.type === 'svg';
    // For SVG, we need to handle the transform differently
    if (isSVG) {
        return (react_1.default.createElement("div", { className: "border rounded p-3 d-flex justify-content-center align-items-center position-relative", style: { height: '400px', overflow: 'hidden' }, ref: previewRef, onMouseDown: handleMouseDown, onMouseMove: handleMouseMove, onMouseUp: handleMouseUp, onMouseLeave: handleMouseUp, onWheel: handleWheel },
            react_1.default.createElement("div", { className: "position-absolute top-0 end-0 m-2" },
                react_1.default.createElement(react_bootstrap_1.ButtonGroup, { size: "sm" },
                    react_1.default.createElement(react_bootstrap_1.Button, { variant: "outline-secondary", onClick: () => setScale(s => Math.min(5, s + 0.1)) }, "+"),
                    react_1.default.createElement(react_bootstrap_1.Button, { variant: "outline-secondary", onClick: () => setScale(s => Math.max(0.1, s - 0.1)) }, "-"),
                    react_1.default.createElement(react_bootstrap_1.Button, { variant: "outline-secondary", onClick: resetView }, "Reset"))),
            react_1.default.createElement("div", { style: {
                    cursor: isPanning ? 'grabbing' : (scale !== 1 ? 'grab' : 'default'),
                    transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                    transformOrigin: 'center center',
                    transition: isPanning ? 'none' : 'transform 0.1s ease'
                } },
                react_1.default.createElement("svg", Object.assign({}, xmlTree.attributes, { style: { background: '#f8f9fa' } }), xmlTree.children.map(renderNode)))));
    }
    // For non-SVG content (HTML/bootstrap), use a different approach
    return (react_1.default.createElement("div", { className: "border rounded p-3 position-relative", style: { height: '400px', overflow: 'hidden' }, ref: previewRef, onMouseDown: handleMouseDown, onMouseMove: handleMouseMove, onMouseUp: handleMouseUp, onMouseLeave: handleMouseUp, onWheel: handleWheel },
        react_1.default.createElement("div", { className: "position-absolute top-0 end-0 m-2" },
            react_1.default.createElement(react_bootstrap_1.ButtonGroup, { size: "sm" },
                react_1.default.createElement(react_bootstrap_1.Button, { variant: "outline-secondary", onClick: () => setScale(s => Math.min(5, s + 0.1)) }, "+"),
                react_1.default.createElement(react_bootstrap_1.Button, { variant: "outline-secondary", onClick: () => setScale(s => Math.max(0.1, s - 0.1)) }, "-"),
                react_1.default.createElement(react_bootstrap_1.Button, { variant: "outline-secondary", onClick: resetView }, "Reset"))),
        react_1.default.createElement("div", { style: {
                cursor: isPanning ? 'grabbing' : (scale !== 1 ? 'grab' : 'default'),
                transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                transformOrigin: '0 0',
                transition: isPanning ? 'none' : 'transform 0.1s ease',
                height: '100%'
            } }, xmlTree.children.map(renderNode))));
};
exports.GenericPreview = GenericPreview;
