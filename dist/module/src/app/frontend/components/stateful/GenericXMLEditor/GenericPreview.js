/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useRef, useCallback } from "react";
import { Button, ButtonGroup } from "react-bootstrap";
export const GenericPreview = ({ onTreeUpdate, xmlTree = {
    id: "root",
    type: "root",
    attributes: {},
    children: [],
}, selectedNodeId = null, hiddenNodes = new Set(), renderPreview = (node, isSelected, eventHandlers, onTreeUpdate) => {
    console.error("Default renderPreview called - this should be overridden");
    return (React.createElement("div", { style: {
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
        return React.createElement("div", null, "No XML tree data available");
    }
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isPanning, setIsPanning] = useState(false);
    const [startPanPoint, setStartPanPoint] = useState({ x: 0, y: 0 });
    const previewRef = useRef(null);
    // Always render the preview using the root xmlTree, not individual nodes
    // This ensures we only get one preview rendered
    const previewElement = React.useMemo(() => {
        try {
            const isSelected = selectedNodeId === xmlTree.id;
            const eventHandlers = {};
            return renderPreview(xmlTree, isSelected, eventHandlers, onTreeUpdate);
        }
        catch (error) {
            console.error("Error in renderPreview:", error);
            return (React.createElement("div", { style: { border: "1px solid red", padding: "4px", margin: "2px" } }, "Error rendering preview"));
        }
    }, [xmlTree, selectedNodeId, renderPreview, onTreeUpdate]);
    // Handle mouse events for panning
    const handleMouseDown = useCallback((e) => {
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
    const handleMouseMove = useCallback((e) => {
        if (isPanning) {
            setPosition({
                x: e.clientX - startPanPoint.x,
                y: e.clientY - startPanPoint.y,
            });
        }
    }, [isPanning, startPanPoint]);
    const handleMouseUp = useCallback(() => {
        setIsPanning(false);
    }, []);
    const handleWheel = useCallback((e) => {
        e.preventDefault();
        const delta = -e.deltaY * 0.01;
        setScale((prevScale) => Math.max(0.1, Math.min(5, prevScale + delta)));
    }, []);
    const resetView = useCallback(() => {
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
        return (React.createElement("div", { className: "border rounded p-3 d-flex justify-content-center align-items-center", style: { height: "400px", background: "#f8f9fa" } }, "Error: Invalid XML tree structure"));
    }
    // For SVG, we need to handle the transform differently
    if (isSVG) {
        return (React.createElement("div", { className: "border rounded p-3 d-flex justify-content-center align-items-center position-relative", style: { height: "400px", overflow: "hidden" }, ref: previewRef, onMouseDown: handleMouseDown, onMouseMove: handleMouseMove, onMouseUp: handleMouseUp, onMouseLeave: handleMouseUp, onWheel: handleWheel },
            React.createElement("div", { className: "position-absolute top-0 end-0 m-2" },
                React.createElement(ButtonGroup, { size: "sm" },
                    React.createElement(Button, { variant: "outline-secondary", onClick: () => setScale((s) => Math.min(5, s + 0.1)) }, "+"),
                    React.createElement(Button, { variant: "outline-secondary", onClick: () => setScale((s) => Math.max(0.1, s - 0.1)) }, "-"),
                    React.createElement(Button, { variant: "outline-secondary", onClick: resetView }, "Reset"))),
            React.createElement("div", { style: {
                    cursor: isPanning ? "grabbing" : scale !== 1 ? "grab" : "default",
                    transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                    transformOrigin: "center center",
                    transition: isPanning ? "none" : "transform 0.1s ease",
                } }, previewElement)));
    }
    // For non-SVG content (HTML/bootstrap), use a different approach
    return (React.createElement("div", { className: "border rounded p-3 position-relative", style: { height: "400px", overflow: "hidden" }, ref: previewRef, onMouseDown: handleMouseDown, onMouseMove: handleMouseMove, onMouseUp: handleMouseUp, onMouseLeave: handleMouseUp, onWheel: handleWheel },
        React.createElement("div", { className: "position-absolute top-0 end-0 m-2" },
            React.createElement(ButtonGroup, { size: "sm" },
                React.createElement(Button, { variant: "outline-secondary", onClick: () => setScale((s) => Math.min(5, s + 0.1)) }, "+"),
                React.createElement(Button, { variant: "outline-secondary", onClick: () => setScale((s) => Math.max(0.1, s - 0.1)) }, "-"),
                React.createElement(Button, { variant: "outline-secondary", onClick: resetView }, "Reset"))),
        React.createElement("div", { style: {
                cursor: isPanning ? "grabbing" : scale !== 1 ? "grab" : "default",
                transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                transformOrigin: "0 0",
                transition: isPanning ? "none" : "transform 0.1s ease",
                height: "100%",
            } }, previewElement)));
};
