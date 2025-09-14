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
const react_1 = __importStar(require("react"));
const fabric_1 = require("fabric");
const DesignEditor = () => {
    const canvasRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        if (!canvasRef.current)
            return;
        // Initialize the fabric canvas
        const canvas = new fabric_1.Canvas(canvasRef.current, {
            width: 800,
            height: 600,
            backgroundColor: '#f0f0f0'
        });
        // Add a simple rectangle
        const rect = new fabric_1.Rect({
            left: 100,
            top: 100,
            width: 100,
            height: 100,
            fill: 'red',
            angle: 0
        });
        // Add text
        const text = new fabric_1.Text('Hello Fabric.js!', {
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
    return (react_1.default.createElement("div", null,
        react_1.default.createElement("canvas", { ref: canvasRef })));
};
exports.DesignEditor = DesignEditor;
