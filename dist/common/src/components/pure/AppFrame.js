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
exports.AppFrame = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
const react_1 = __importStar(require("react"));
const react_bootstrap_1 = require("react-bootstrap");
const react_router_dom_1 = require("react-router-dom");
const react_router_dom_2 = require("react-router-dom");
const AppFrame = ({ children, title, rightContent }) => {
    const location = (0, react_router_dom_2.useLocation)();
    const [isExpanded, setIsExpanded] = (0, react_1.useState)(true);
    return (react_1.default.createElement("div", { className: "d-flex min-vh-100", style: { backgroundColor: '#f8f9fa' } },
        react_1.default.createElement("div", { className: "bg-light border-end d-flex flex-column", style: {
                width: isExpanded ? '250px' : '60px',
                minHeight: '100vh',
                transition: 'width 0.3s ease'
            }, onMouseEnter: () => setIsExpanded(true), onMouseLeave: () => setIsExpanded(false) },
            react_1.default.createElement("div", { className: "p-3 border-bottom d-flex align-items-center justify-content-center" }, isExpanded ? (react_1.default.createElement("img", { src: "/logo.svg", alt: "Testeranto Logo", style: { width: '128px', height: '128px' } })) : (react_1.default.createElement("img", { src: "/logo.svg", alt: "Testeranto Logo", style: { width: '40px', height: '40px' } }))),
            react_1.default.createElement(react_bootstrap_1.Nav, { variant: "pills", className: "flex-column p-2 flex-grow-1" },
                react_1.default.createElement(react_bootstrap_1.Nav.Link, { as: react_router_dom_1.NavLink, to: "/", className: `${location.pathname === '/' ? 'active' : ''} text-truncate d-flex align-items-center`, style: { width: '100%' }, title: "Projects" },
                    react_1.default.createElement("span", { className: "me-2" }, "\uD83D\uDCC1"),
                    isExpanded && 'Projects'),
                react_1.default.createElement(react_bootstrap_1.Nav.Link, { as: react_router_dom_1.NavLink, to: "/processes", className: `${location.pathname.startsWith('/processes') ? 'active' : ''} text-truncate d-flex align-items-center`, style: { width: '100%' }, title: "Process Manager" },
                    react_1.default.createElement("span", { className: "me-2" }, "\uD83D\uDCCA"),
                    isExpanded && 'Process Manager'),
                react_1.default.createElement(react_bootstrap_1.Nav.Link, { as: react_router_dom_1.NavLink, to: "/settings", className: `${location.pathname === '/settings' ? 'active' : ''} text-truncate d-flex align-items-center`, style: { width: '100%' }, title: "Settings" },
                    react_1.default.createElement("span", { className: "me-2" }, "\u2699\uFE0F"),
                    isExpanded && 'Settings')),
            react_1.default.createElement("div", { className: "p-3 border-top text-center mt-auto" }, isExpanded ? (react_1.default.createElement("small", { className: "text-muted" },
                "made with \u2764\uFE0F and ",
                react_1.default.createElement("a", { href: "https://www.npmjs.com/package/testeranto" }, "testeranto"))) : (react_1.default.createElement("small", { className: "text-muted" }, "\u2764\uFE0F")))),
        react_1.default.createElement("div", { className: "flex-grow-1 d-flex flex-column" },
            react_1.default.createElement("main", { className: "flex-grow-1 p-4", style: { overflow: 'auto' } },
                react_1.default.createElement(react_bootstrap_1.Container, { fluid: true, className: "h-100" }, children)))));
};
exports.AppFrame = AppFrame;
