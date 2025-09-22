var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import React, { useState, useRef, useCallback } from 'react';
const renderGrid = (width, height) => {
    const gridSize = 20;
    const lines = [];
    // Horizontal lines
    for (let y = 0; y <= height; y += gridSize) {
        lines.push(React.createElement("line", { key: `h-${y}`, x1: 0, y1: y, x2: width, y2: y, stroke: "#e0e0e0", strokeWidth: 1 }));
    }
    // Vertical lines
    for (let x = 0; x <= width; x += gridSize) {
        lines.push(React.createElement("line", { key: `v-${x}`, x1: x, y1: 0, x2: x, y2: height, stroke: "#e0e0e0", strokeWidth: 1 }));
    }
    return lines;
};
export const SVGPreview = ({ svgTree, editMode, showGrid, selectedNodeId, onNodeInteraction, hiddenNodes }) => {
    const svgRef = useRef(null);
    const [isInteracting, setIsInteracting] = useState(false);
    const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
    const [originalAttributes, setOriginalAttributes] = useState({});
    const getSVGPoint = useCallback((clientX, clientY) => {
        var _a;
        if (svgRef.current) {
            const pt = svgRef.current.createSVGPoint();
            pt.x = clientX;
            pt.y = clientY;
            return pt.matrixTransform((_a = svgRef.current.getScreenCTM()) === null || _a === void 0 ? void 0 : _a.inverse());
        }
        return { x: 0, y: 0 };
    }, []);
    const handleMouseDown = useCallback((e, node) => {
        if (editMode !== 'none' && selectedNodeId === node.id) {
            e.preventDefault();
            setIsInteracting(true);
            setStartPoint({ x: e.clientX, y: e.clientY });
            setOriginalAttributes(Object.assign({}, node.attributes));
        }
    }, [editMode, selectedNodeId]);
    const handleMouseMove = useCallback((e, node) => {
        if (isInteracting && editMode !== 'none' && selectedNodeId === node.id) {
            e.preventDefault();
            const currentPoint = getSVGPoint(e.clientX, e.clientY);
            const startSVGPoint = getSVGPoint(startPoint.x, startPoint.y);
            const dx = currentPoint.x - startSVGPoint.x;
            const dy = currentPoint.y - startSVGPoint.y;
            const updates = {};
            switch (editMode) {
                case 'move':
                    if (node.type === 'rect' || node.type === 'text') {
                        updates.x = (parseFloat(originalAttributes.x || '0') + dx).toString();
                        updates.y = (parseFloat(originalAttributes.y || '0') + dy).toString();
                    }
                    else if (node.type === 'circle') {
                        updates.cx = (parseFloat(originalAttributes.cx || '0') + dx).toString();
                        updates.cy = (parseFloat(originalAttributes.cy || '0') + dy).toString();
                    }
                    break;
                case 'scale':
                    if (node.type === 'rect') {
                        updates.width = Math.max(0, parseFloat(originalAttributes.width || '0') + dx).toString();
                        updates.height = Math.max(0, parseFloat(originalAttributes.height || '0') + dy).toString();
                    }
                    else if (node.type === 'circle') {
                        updates.r = Math.max(0, parseFloat(originalAttributes.r || '0') + dx).toString();
                    }
                    break;
                case 'rotate':
                    // Calculate angle from center
                    const centerX = parseFloat(originalAttributes.cx || originalAttributes.x || '0') +
                        parseFloat(originalAttributes.width || '0') / 2;
                    const centerY = parseFloat(originalAttributes.cy || originalAttributes.y || '0') +
                        parseFloat(originalAttributes.height || '0') / 2;
                    const startAngle = Math.atan2(startSVGPoint.y - centerY, startSVGPoint.x - centerX);
                    const currentAngle = Math.atan2(currentPoint.y - centerY, currentPoint.x - centerX);
                    const angleDiff = (currentAngle - startAngle) * 180 / Math.PI;
                    updates.transform = `rotate(${angleDiff}, ${centerX}, ${centerY})`;
                    break;
            }
            onNodeInteraction(node.id, updates);
        }
    }, [isInteracting, editMode, selectedNodeId, startPoint, originalAttributes, getSVGPoint, onNodeInteraction]);
    const handleMouseUp = useCallback(() => {
        setIsInteracting(false);
    }, []);
    const renderSVGNode = useCallback((node) => {
        // Skip rendering if node is hidden
        if (hiddenNodes.has(node.id)) {
            return null;
        }
        const isSelected = selectedNodeId === node.id;
        const { type, attributes, children } = node;
        const eventHandlers = editMode !== 'none' && isSelected ? {
            onMouseDown: (e) => handleMouseDown(e, node),
            onMouseMove: (e) => handleMouseMove(e, node),
            style: { cursor: getCursorForMode(editMode), outline: isSelected ? '2px dashed blue' : 'none' }
        } : {
            style: { outline: isSelected ? '2px dashed blue' : 'none' }
        };
        // Filter out hidden children
        const visibleChildren = children
            .map(renderSVGNode)
            .filter(child => child !== null);
        // For text elements, use the text content
        if (type === 'text' || type === 'tspan') {
            const textContent = attributes['text-content'] || '';
            // Filter out the text-content attribute to prevent it from being added as an SVG attribute
            const { 'text-content': _ } = attributes, filteredAttributes = __rest(attributes, ['text-content']);
            return React.createElement(type, Object.assign(Object.assign({ key: node.id }, filteredAttributes), eventHandlers), textContent, ...visibleChildren);
        }
        return React.createElement(type, Object.assign(Object.assign({ key: node.id }, attributes), eventHandlers), visibleChildren);
    }, [editMode, selectedNodeId, hiddenNodes, handleMouseDown, handleMouseMove]);
    const getCursorForMode = (mode) => {
        switch (mode) {
            case 'move': return 'move';
            case 'scale': return 'nwse-resize';
            case 'rotate': return 'crosshair';
            default: return 'pointer';
        }
    };
    const width = parseInt(svgTree.attributes.width || '400');
    const height = parseInt(svgTree.attributes.height || '400');
    return (React.createElement("div", { className: "border rounded p-3 d-flex justify-content-center align-items-center", style: { height: '400px' }, onMouseUp: handleMouseUp, onMouseLeave: handleMouseUp },
        React.createElement("svg", Object.assign({ ref: svgRef }, svgTree.attributes, { style: {
                background: showGrid ? '#f8f9fa' : 'white',
                cursor: editMode !== 'none' ? getCursorForMode(editMode) : 'default'
            }, onMouseMove: (e) => {
                // Handle mouse move on the SVG itself if needed
            } }),
            showGrid && renderGrid(width, height),
            svgTree.children.map(renderSVGNode))));
};
