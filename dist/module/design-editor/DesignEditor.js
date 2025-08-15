/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from 'react';
import { Canvas, Rect, Circle, Text } from 'fabric';
import { toPng } from 'html-to-image';
export const DesignEditor = React.forwardRef(({ projectId }, ref) => {
    const canvasRef = useRef(null);
    const [design, setDesign] = useState({
        objects: [],
        background: '#ffffff',
        version: '1.0'
    });
    const [collaborators, setCollaborators] = useState([]);
    const wsRef = useRef(null);
    // Initialize canvas and WebSocket connection
    useEffect(() => {
        const canvas = new Canvas('design-canvas', {
            width: 800,
            height: 600
        });
        canvas.backgroundColor = design.background;
        canvasRef.current = canvas;
        const wsPort = window.location.port ? Number(window.location.port) + 1 : 3001;
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const host = window.location.hostname;
        wsRef.current = new WebSocket(`${protocol}//${host}:${wsPort}/design?project=${projectId}`);
        wsRef.current.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.type === 'design_update' && canvasRef.current) {
                canvasRef.current.loadFromJSON(message.data, () => {
                    var _a;
                    (_a = canvasRef.current) === null || _a === void 0 ? void 0 : _a.renderAll();
                });
            }
            else if (message.type === 'collaborators_update') {
                setCollaborators(message.data);
            }
        };
        return () => {
            var _a;
            (_a = wsRef.current) === null || _a === void 0 ? void 0 : _a.close();
            canvas.dispose();
        };
    }, [projectId]);
    const addShape = (shape) => {
        if (!canvasRef.current)
            return;
        let object;
        switch (shape) {
            case 'rectangle':
                object = new Rect({
                    width: 100,
                    height: 100,
                    fill: 'red',
                    left: 100,
                    top: 100
                });
                break;
            case 'circle':
                object = new Circle({
                    radius: 50,
                    fill: 'blue',
                    left: 200,
                    top: 200
                });
                break;
            case 'text':
                object = new Text('Double click to edit', {
                    fontFamily: 'Arial',
                    fontSize: 20,
                    left: 100,
                    top: 300
                });
                break;
            default:
                return;
        }
        canvasRef.current.add(object);
        canvasRef.current.renderAll();
    };
    const saveDesign = () => {
        if (!canvasRef.current) {
            console.warn('Canvas ref is null, cannot save design');
            return null;
        }
        try {
            // Get current canvas state
            const json = canvasRef.current.toJSON();
            setDesign(json);
            // Send update to collaborators
            if (wsRef.current) {
                wsRef.current.send(JSON.stringify({
                    type: 'design_update',
                    data: json
                }));
            }
            // Force re-render of all objects
            canvasRef.current.getObjects().forEach(obj => {
                obj.set('dirty', true);
            });
            canvasRef.current.renderAll();
            console.log('Design saved:', json);
            return json;
        }
        catch (err) {
            console.error('Error saving design:', err);
            return null;
        }
    };
    const loadDesign = (design) => {
        console.log('loadDesign called with:', design);
        if (!canvasRef.current) {
            console.warn('Canvas ref is null, cannot load design');
            return;
        }
        try {
            console.log('Loading design into canvas...');
            // Clear existing canvas
            canvasRef.current.clear();
            // Set background color
            if (design.background) {
                canvasRef.current.backgroundColor = design.background;
            }
            // Load objects if they exist
            if (design.objects && design.objects.length > 0) {
                console.log('Loading objects:', design.objects.length);
                canvasRef.current.loadFromJSON(design, () => {
                    var _a, _b;
                    console.log('Design loaded, rendering canvas...');
                    // Force re-render of all objects
                    (_a = canvasRef.current) === null || _a === void 0 ? void 0 : _a.getObjects().forEach(obj => {
                        obj.set('dirty', true);
                    });
                    (_b = canvasRef.current) === null || _b === void 0 ? void 0 : _b.renderAll();
                    console.log('Canvas rendered with new design');
                });
            }
            else {
                console.log('No objects to load, rendering empty canvas');
                canvasRef.current.renderAll();
            }
            // Force immediate render
            canvasRef.current.renderAll();
        }
        catch (err) {
            console.error('Error loading design:', err);
            if (err instanceof Error) {
                console.error('Error details:', {
                    name: err.name,
                    message: err.message,
                    stack: err.stack
                });
            }
        }
    };
    // Expose methods via ref
    React.useImperativeHandle(ref, () => ({
        loadDesign,
        saveDesign
    }));
    const exportAsPNG = async () => {
        if (!canvasRef.current)
            return;
        try {
            // Store current active object and hide controls
            const activeObject = canvasRef.current.getActiveObject();
            if (activeObject) {
                canvasRef.current.discardActiveObject();
            }
            // Render once to clear controls
            canvasRef.current.renderAll();
            // Get canvas element and export
            const canvasElement = document.getElementById('design-canvas');
            if (!canvasElement)
                return;
            const dataUrl = await toPng(canvasElement);
            const link = document.createElement('a');
            link.download = `design-${projectId}.png`;
            link.href = dataUrl;
            link.click();
            // Restore active object if there was one
            if (activeObject) {
                canvasRef.current.setActiveObject(activeObject);
                canvasRef.current.renderAll();
            }
        }
        catch (error) {
            console.error('Error exporting PNG:', error);
        }
    };
    return (React.createElement("div", { className: "design-editor" },
        React.createElement("div", { className: "toolbar" },
            React.createElement("button", { onClick: () => addShape('rectangle') }, "Add Rectangle"),
            React.createElement("button", { onClick: () => addShape('circle') }, "Add Circle"),
            React.createElement("button", { onClick: () => addShape('text') }, "Add Text"),
            React.createElement("button", { onClick: exportAsPNG }, "Export PNG")),
        React.createElement("canvas", { id: "design-canvas" }),
        React.createElement("div", { className: "collaborators" },
            React.createElement("h3", null,
                "Collaborators (",
                collaborators.length,
                ")"),
            React.createElement("ul", null, collaborators.map(user => (React.createElement("li", { key: user.id }, user.name)))))));
});
