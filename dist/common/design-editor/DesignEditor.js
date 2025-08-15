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
exports.DesignEditor = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const react_1 = __importStar(require("react"));
const fabric_1 = require("fabric");
const html_to_image_1 = require("html-to-image");
exports.DesignEditor = react_1.default.forwardRef(({ projectId }, ref) => {
    const canvasRef = (0, react_1.useRef)(null);
    const [design, setDesign] = (0, react_1.useState)({
        objects: [],
        background: '#ffffff',
        version: '1.0'
    });
    const [collaborators, setCollaborators] = (0, react_1.useState)([]);
    const wsRef = (0, react_1.useRef)(null);
    // Initialize canvas and WebSocket connection
    (0, react_1.useEffect)(() => {
        const canvas = new fabric_1.Canvas('design-canvas', {
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
                object = new fabric_1.Rect({
                    width: 100,
                    height: 100,
                    fill: 'red',
                    left: 100,
                    top: 100
                });
                break;
            case 'circle':
                object = new fabric_1.Circle({
                    radius: 50,
                    fill: 'blue',
                    left: 200,
                    top: 200
                });
                break;
            case 'text':
                object = new fabric_1.Text('Double click to edit', {
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
            const json = canvasRef.current.toJSON();
            setDesign(json);
            if (wsRef.current) {
                wsRef.current.send(JSON.stringify({
                    type: 'design_update',
                    data: json
                }));
            }
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
    react_1.default.useImperativeHandle(ref, () => ({
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
            const dataUrl = await (0, html_to_image_1.toPng)(canvasElement);
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
    return (react_1.default.createElement("div", { className: "design-editor" },
        react_1.default.createElement("div", { className: "toolbar" },
            react_1.default.createElement("button", { onClick: () => addShape('rectangle') }, "Add Rectangle"),
            react_1.default.createElement("button", { onClick: () => addShape('circle') }, "Add Circle"),
            react_1.default.createElement("button", { onClick: () => addShape('text') }, "Add Text"),
            react_1.default.createElement("button", { onClick: exportAsPNG }, "Export PNG")),
        react_1.default.createElement("canvas", { id: "design-canvas" }),
        react_1.default.createElement("div", { className: "collaborators" },
            react_1.default.createElement("h3", null,
                "Collaborators (",
                collaborators.length,
                ")"),
            react_1.default.createElement("ul", null, collaborators.map(user => (react_1.default.createElement("li", { key: user.id }, user.name)))))));
});
