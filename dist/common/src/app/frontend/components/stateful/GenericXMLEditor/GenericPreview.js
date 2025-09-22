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
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
const react_1 = __importStar(require("react"));
const react_bootstrap_1 = require("react-bootstrap");
const GenericPreview = ({ onTreeUpdate, xmlTree = {
    id: "root",
    type: "root",
    attributes: {},
    children: [],
}, selectedNodeId = null, hiddenNodes = new Set(), renderPreview = (node, isSelected, eventHandlers, onTreeUpdate) => {
    console.error("Default renderPreview called - this should be overridden");
    return (react_1.default.createElement("div", { style: {
            border: isSelected ? "2px solid blue" : "1px solid gray",
            padding: "4px",
        } },
        "Default preview for: ",
        node.type));
}, }) => {
    // Add a check to ensure xmlTree is defined
    console.log("GenericPreview props:", {
        xmlTree,
        selectedNodeId,
        hiddenNodes,
        renderPreview,
        onTreeUpdate
    });
    if (!xmlTree) {
        console.error("xmlTree is undefined in GenericPreview");
        return react_1.default.createElement("div", null, "No XML tree data available");
    }
    const [scale, setScale] = (0, react_1.useState)(1);
    const [position, setPosition] = (0, react_1.useState)({ x: 0, y: 0 });
    const [isPanning, setIsPanning] = (0, react_1.useState)(false);
    const [startPanPoint, setStartPanPoint] = (0, react_1.useState)({ x: 0, y: 0 });
    const previewRef = (0, react_1.useRef)(null);
    // Always render the preview using the root xmlTree, not individual nodes
    // This ensures we only get one preview rendered
    const previewElement = react_1.default.useMemo(() => {
        try {
            const isSelected = selectedNodeId === xmlTree.id;
            const eventHandlers = {};
            return renderPreview(xmlTree, isSelected, eventHandlers, onTreeUpdate);
        }
        catch (error) {
            console.error("Error in renderPreview:", error);
            return (react_1.default.createElement("div", { style: { border: "1px solid red", padding: "4px", margin: "2px" } }, "Error rendering preview"));
        }
    }, [xmlTree, selectedNodeId, renderPreview, onTreeUpdate]);
    // Handle mouse events for panning
    const handleMouseDown = (0, react_1.useCallback)((e) => {
        if (e.button === 1 || (e.button === 0 && e.altKey)) {
            // Middle click or Alt + Left click
            e.preventDefault();
            setIsPanning(true);
            setStartPanPoint({
                x: e.clientX - position.x,
                y: e.clientY - position.y,
            });
        }
    }, [position]);
    const handleMouseMove = (0, react_1.useCallback)((e) => {
        if (isPanning) {
            setPosition({
                x: e.clientX - startPanPoint.x,
                y: e.clientY - startPanPoint.y,
            });
        }
    }, [isPanning, startPanPoint]);
    const handleMouseUp = (0, react_1.useCallback)(() => {
        setIsPanning(false);
    }, []);
    const handleWheel = (0, react_1.useCallback)((e) => {
        e.preventDefault();
        const delta = -e.deltaY * 0.01;
        setScale((prevScale) => Math.max(0.1, Math.min(5, prevScale + delta)));
    }, []);
    const resetView = (0, react_1.useCallback)(() => {
        setScale(1);
        setPosition({ x: 0, y: 0 });
    }, []);
    // Check if we're rendering SVG content (root node is svg)
    let isSVG = false;
    try {
        isSVG = xmlTree.type === "svg";
    }
    catch (error) {
        console.error("Error checking if xmlTree is SVG:", error);
        return (react_1.default.createElement("div", { className: "border rounded p-3 d-flex justify-content-center align-items-center", style: { height: "400px", background: "#f8f9fa" } }, "Error: Invalid XML tree structure"));
    }
    // For SVG, we need to handle the transform differently
    if (isSVG) {
        return (react_1.default.createElement("div", { className: "border rounded p-3 d-flex justify-content-center align-items-center position-relative", style: { height: "400px", overflow: "hidden" }, ref: previewRef, onMouseDown: handleMouseDown, onMouseMove: handleMouseMove, onMouseUp: handleMouseUp, onMouseLeave: handleMouseUp, onWheel: handleWheel },
            react_1.default.createElement("div", { className: "position-absolute top-0 end-0 m-2" },
                react_1.default.createElement(react_bootstrap_1.ButtonGroup, { size: "sm" },
                    react_1.default.createElement(react_bootstrap_1.Button, { variant: "outline-secondary", onClick: () => setScale((s) => Math.min(5, s + 0.1)) }, "+"),
                    react_1.default.createElement(react_bootstrap_1.Button, { variant: "outline-secondary", onClick: () => setScale((s) => Math.max(0.1, s - 0.1)) }, "-"),
                    react_1.default.createElement(react_bootstrap_1.Button, { variant: "outline-secondary", onClick: resetView }, "Reset"))),
            react_1.default.createElement("div", { style: {
                    cursor: isPanning ? "grabbing" : scale !== 1 ? "grab" : "default",
                    transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                    transformOrigin: "center center",
                    transition: isPanning ? "none" : "transform 0.1s ease",
                } }, previewElement)));
    }
    // For non-SVG content (HTML/bootstrap), use a different approach
    return (react_1.default.createElement("div", { className: "border rounded p-3 position-relative", style: { height: "400px", overflow: "hidden" }, ref: previewRef, onMouseDown: handleMouseDown, onMouseMove: handleMouseMove, onMouseUp: handleMouseUp, onMouseLeave: handleMouseUp, onWheel: handleWheel },
        react_1.default.createElement("div", { className: "position-absolute top-0 end-0 m-2" },
            react_1.default.createElement(react_bootstrap_1.ButtonGroup, { size: "sm" },
                react_1.default.createElement(react_bootstrap_1.Button, { variant: "outline-secondary", onClick: () => setScale((s) => Math.min(5, s + 0.1)) }, "+"),
                react_1.default.createElement(react_bootstrap_1.Button, { variant: "outline-secondary", onClick: () => setScale((s) => Math.max(0.1, s - 0.1)) }, "-"),
                react_1.default.createElement(react_bootstrap_1.Button, { variant: "outline-secondary", onClick: resetView }, "Reset"))),
        react_1.default.createElement("div", { style: {
                cursor: isPanning ? "grabbing" : scale !== 1 ? "grab" : "default",
                transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                transformOrigin: "0 0",
                transition: isPanning ? "none" : "transform 0.1s ease",
                height: "100%",
            } }, previewElement)));
};
exports.GenericPreview = GenericPreview;
