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
exports.Drawer = void 0;
const react_1 = __importStar(require("react"));
const Drawer = ({ position, isOpen, zIndex, onBringToFront, title, children }) => {
    const [size, setSize] = (0, react_1.useState)(position === 'bottom' ? 200 : 300);
    const [isResizing, setIsResizing] = (0, react_1.useState)(false);
    const [dragStart, setDragStart] = (0, react_1.useState)({ x: 0, y: 0, size: 0 });
    const drawerRef = (0, react_1.useRef)(null);
    const handleMouseDown = (e) => {
        setIsResizing(true);
        setDragStart({
            x: e.clientX,
            y: e.clientY,
            size: size
        });
        onBringToFront();
        e.preventDefault();
    };
    (0, react_1.useEffect)(() => {
        const handleMouseMove = (e) => {
            if (!isResizing)
                return;
            switch (position) {
                case 'left':
                    setSize(Math.max(40, Math.min(window.innerWidth - 100, dragStart.size + (e.clientX - dragStart.x))));
                    break;
                case 'right':
                    setSize(Math.max(40, Math.min(window.innerWidth - 100, dragStart.size - (e.clientX - dragStart.x))));
                    break;
                case 'bottom':
                    setSize(Math.max(40, Math.min(window.innerHeight - 100, dragStart.size - (e.clientY - dragStart.y))));
                    break;
            }
        };
        const handleMouseUp = () => {
            setIsResizing(false);
        };
        if (isResizing) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = position === 'bottom' ? 'ns-resize' : 'ew-resize';
            document.body.style.userSelect = 'none';
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        };
    }, [isResizing, dragStart, position]);
    const getPositionStyles = () => {
        switch (position) {
            case 'left':
                return {
                    top: 0,
                    left: 0,
                    height: '100%',
                    width: `${size}px`,
                    transform: 'none'
                };
            case 'right':
                return {
                    top: 0,
                    right: 0,
                    height: '100%',
                    width: `${size}px`,
                    transform: 'none'
                };
            case 'bottom':
                return {
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    height: `${size}px`,
                    transform: 'none'
                };
            default:
                return {};
        }
    };
    // Determine which edge to show the drag handle based on position
    const getDragEdgeStyle = () => {
        switch (position) {
            case 'left':
                return {
                    right: '0',
                    top: '0',
                    height: '100%',
                    width: '8px',
                    cursor: 'ew-resize'
                };
            case 'right':
                return {
                    left: '0',
                    top: '0',
                    height: '100%',
                    width: '8px',
                    cursor: 'ew-resize'
                };
            case 'bottom':
                return {
                    top: '0',
                    left: '0',
                    width: '100%',
                    height: '8px',
                    cursor: 'ns-resize'
                };
            default:
                return {};
        }
    };
    return (react_1.default.createElement("div", { ref: drawerRef, className: `position-absolute bg-light border ${isResizing ? 'user-select-none' : ''}`, style: Object.assign(Object.assign({}, getPositionStyles()), { zIndex, transition: isResizing ? 'none' : 'all 0.3s ease', overflow: 'hidden' }) },
        react_1.default.createElement("div", { className: "d-flex justify-content-between align-items-center p-2 border-bottom bg-white", onMouseDown: () => onBringToFront(), style: { cursor: 'move' } },
            react_1.default.createElement("span", null, title)),
        react_1.default.createElement("div", { className: "h-100", style: { overflow: 'auto' } }, children),
        react_1.default.createElement("div", { style: Object.assign(Object.assign({ position: 'absolute' }, getDragEdgeStyle()), { backgroundColor: 'rgba(0, 0, 0, 0.2)' }), onMouseDown: handleMouseDown, className: "drag-edge" })));
};
exports.Drawer = Drawer;
