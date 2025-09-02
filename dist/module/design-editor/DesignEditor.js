import React, { useEffect, useRef } from 'react';
import { Canvas, Rect, Text } from 'fabric';
export const DesignEditor = () => {
    const canvasRef = useRef(null);
    useEffect(() => {
        if (!canvasRef.current)
            return;
        // Initialize the fabric canvas
        const canvas = new Canvas(canvasRef.current, {
            width: 800,
            height: 600,
            backgroundColor: '#f0f0f0'
        });
        // Add a simple rectangle
        const rect = new Rect({
            left: 100,
            top: 100,
            width: 100,
            height: 100,
            fill: 'red',
            angle: 0
        });
        // Add text
        const text = new Text('Hello Fabric.js!', {
            left: 50,
            top: 50,
            fontSize: 20,
            fill: 'blue'
        });
        // Add objects to canvas
        canvas.add(rect, text);
        canvas.renderAll();
        // Cleanup
        return () => {
            canvas.dispose();
        };
    }, []);
    return (React.createElement("div", null,
        React.createElement("canvas", { ref: canvasRef })));
};
