import React, { useState, useRef, useCallback } from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
export const GenericPreview = ({ xmlTree, selectedNodeId, hiddenNodes, renderPreview }) => {
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isPanning, setIsPanning] = useState(false);
    const [startPanPoint, setStartPanPoint] = useState({ x: 0, y: 0 });
    const previewRef = useRef(null);
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
    const handleMouseDown = useCallback((e) => {
        if (e.button === 1 || (e.button === 0 && e.altKey)) { // Middle click or Alt + Left click
            e.preventDefault();
            setIsPanning(true);
            setStartPanPoint({ x: e.clientX - position.x, y: e.clientY - position.y });
        }
    }, [position]);
    const handleMouseMove = useCallback((e) => {
        if (isPanning) {
            setPosition({
                x: e.clientX - startPanPoint.x,
                y: e.clientY - startPanPoint.y
            });
        }
    }, [isPanning, startPanPoint]);
    const handleMouseUp = useCallback(() => {
        setIsPanning(false);
    }, []);
    const handleWheel = useCallback((e) => {
        e.preventDefault();
        const delta = -e.deltaY * 0.01;
        setScale(prevScale => Math.max(0.1, Math.min(5, prevScale + delta)));
    }, []);
    const resetView = useCallback(() => {
        setScale(1);
        setPosition({ x: 0, y: 0 });
    }, []);
    // Check if we're rendering SVG content (root node is svg)
    const isSVG = xmlTree.type === 'svg';
    // For SVG, we need to handle the transform differently
    if (isSVG) {
        return (React.createElement("div", { className: "border rounded p-3 d-flex justify-content-center align-items-center position-relative", style: { height: '400px', overflow: 'hidden' }, ref: previewRef, onMouseDown: handleMouseDown, onMouseMove: handleMouseMove, onMouseUp: handleMouseUp, onMouseLeave: handleMouseUp, onWheel: handleWheel },
            React.createElement("div", { className: "position-absolute top-0 end-0 m-2" },
                React.createElement(ButtonGroup, { size: "sm" },
                    React.createElement(Button, { variant: "outline-secondary", onClick: () => setScale(s => Math.min(5, s + 0.1)) }, "+"),
                    React.createElement(Button, { variant: "outline-secondary", onClick: () => setScale(s => Math.max(0.1, s - 0.1)) }, "-"),
                    React.createElement(Button, { variant: "outline-secondary", onClick: resetView }, "Reset"))),
            React.createElement("div", { style: {
                    cursor: isPanning ? 'grabbing' : (scale !== 1 ? 'grab' : 'default'),
                    transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                    transformOrigin: 'center center',
                    transition: isPanning ? 'none' : 'transform 0.1s ease'
                } },
                React.createElement("svg", Object.assign({}, xmlTree.attributes, { style: { background: '#f8f9fa' } }), xmlTree.children.map(renderNode)))));
    }
    // For non-SVG content (HTML/bootstrap), use a different approach
    return (React.createElement("div", { className: "border rounded p-3 position-relative", style: { height: '400px', overflow: 'hidden' }, ref: previewRef, onMouseDown: handleMouseDown, onMouseMove: handleMouseMove, onMouseUp: handleMouseUp, onMouseLeave: handleMouseUp, onWheel: handleWheel },
        React.createElement("div", { className: "position-absolute top-0 end-0 m-2" },
            React.createElement(ButtonGroup, { size: "sm" },
                React.createElement(Button, { variant: "outline-secondary", onClick: () => setScale(s => Math.min(5, s + 0.1)) }, "+"),
                React.createElement(Button, { variant: "outline-secondary", onClick: () => setScale(s => Math.max(0.1, s - 0.1)) }, "-"),
                React.createElement(Button, { variant: "outline-secondary", onClick: resetView }, "Reset"))),
        React.createElement("div", { style: {
                cursor: isPanning ? 'grabbing' : (scale !== 1 ? 'grab' : 'default'),
                transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                transformOrigin: '0 0',
                transition: isPanning ? 'none' : 'transform 0.1s ease',
                height: '100%'
            } }, xmlTree.children.map(renderNode))));
};
