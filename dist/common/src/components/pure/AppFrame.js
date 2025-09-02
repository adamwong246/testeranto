"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppFrame = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
const react_1 = __importDefault(require("react"));
const react_bootstrap_1 = require("react-bootstrap");
const react_router_dom_1 = require("react-router-dom");
const react_router_dom_2 = require("react-router-dom");
const App_1 = require("../../App");
const AppFrame = ({ children, title, rightContent }) => {
    const location = (0, react_router_dom_2.useLocation)();
    const { isConnected } = (0, App_1.useWebSocket)();
    const { tutorialMode } = (0, App_1.useTutorialMode)();
    const { isAuthenticated, logout } = (0, App_1.useAuth)();
    return (react_1.default.createElement("div", { className: "d-flex min-vh-100" },
        react_1.default.createElement("div", { className: "border-end d-flex flex-column", style: {
                width: '60px',
                height: '100vh',
                position: 'sticky',
                top: 0
            } },
            tutorialMode ? (react_1.default.createElement(react_bootstrap_1.OverlayTrigger, { placement: "right", overlay: react_1.default.createElement(react_bootstrap_1.Tooltip, { id: "logo-tooltip" }, "Welcome to Testeranto!") },
                react_1.default.createElement("div", { className: "p-3 border-bottom d-flex align-items-center justify-content-center" },
                    react_1.default.createElement("img", { src: "/logo.svg", alt: "Testeranto Logo", style: {
                            width: '40px',
                            height: '40px'
                        } })))) : (react_1.default.createElement("div", { className: "p-3 border-bottom d-flex align-items-center justify-content-center" },
                react_1.default.createElement("img", { src: "/logo.svg", alt: "Testeranto Logo", style: {
                        width: '40px',
                        height: '40px'
                    } }))),
            react_1.default.createElement(react_bootstrap_1.Nav, { variant: "pills", className: "flex-column p-2 flex-grow-1" },
                react_1.default.createElement(react_bootstrap_1.Nav.Link, { as: react_router_dom_1.NavLink, to: "/", className: `${location.pathname === '/' ? 'active' : ''} d-flex align-items-center justify-content-center`, style: { height: '40px', width: '40px' } }, tutorialMode ? (react_1.default.createElement(react_bootstrap_1.OverlayTrigger, { placement: "right", overlay: react_1.default.createElement(react_bootstrap_1.Tooltip, { id: "projects-tooltip" }, "Projects") },
                    react_1.default.createElement("span", null, "\uD83D\uDCC1"))) : (react_1.default.createElement("span", null, "\uD83D\uDCC1"))),
                react_1.default.createElement(react_bootstrap_1.Nav.Link, { as: react_router_dom_1.NavLink, to: "/processes", className: `${location.pathname.startsWith('/processes') ? 'active' : ''} d-flex align-items-center justify-content-center ${!isConnected || !isAuthenticated ? 'text-muted pe-none' : ''}`, style: {
                        height: '40px',
                        width: '40px',
                        opacity: isConnected && isAuthenticated ? 1 : 0.6
                    }, onClick: (e) => {
                        if (!isConnected || !isAuthenticated) {
                            e.preventDefault();
                        }
                    } }, tutorialMode ? (react_1.default.createElement(react_bootstrap_1.OverlayTrigger, { placement: "right", overlay: react_1.default.createElement(react_bootstrap_1.Tooltip, { id: "processes-tooltip" },
                        "Processes ",
                        !isAuthenticated ? '(Sign in required)' : !isConnected ? '(WebSocket disconnected)' : '') },
                    react_1.default.createElement("span", null, "\uD83D\uDCCA"))) : (react_1.default.createElement("span", null, "\uD83D\uDCCA"))),
                react_1.default.createElement(react_bootstrap_1.Nav.Link, { as: react_router_dom_1.NavLink, to: "/git", className: `${location.pathname === '/git' ? 'active' : ''} d-flex align-items-center justify-content-center ${!isAuthenticated ? 'text-muted pe-none' : ''}`, style: {
                        height: '40px',
                        width: '40px',
                        opacity: isAuthenticated ? 1 : 0.6
                    }, onClick: (e) => {
                        if (!isAuthenticated) {
                            e.preventDefault();
                        }
                    } }, tutorialMode ? (react_1.default.createElement(react_bootstrap_1.OverlayTrigger, { placement: "right", overlay: react_1.default.createElement(react_bootstrap_1.Tooltip, { id: "git-tooltip" },
                        "Git Integration ",
                        !isAuthenticated ? '(Sign in required)' : '') },
                    react_1.default.createElement("span", null, "\uD83D\uDC19"))) : (react_1.default.createElement("span", null, "\uD83D\uDC19"))),
                react_1.default.createElement(react_bootstrap_1.Nav.Link, { as: react_router_dom_1.NavLink, to: "/settings", className: `${location.pathname === '/settings' ? 'active' : ''} d-flex align-items-center justify-content-center`, style: { height: '40px', width: '40px' } }, tutorialMode ? (react_1.default.createElement(react_bootstrap_1.OverlayTrigger, { placement: "right", overlay: react_1.default.createElement(react_bootstrap_1.Tooltip, { id: "settings-tooltip" }, "Settings") },
                    react_1.default.createElement("span", null, "\u2699\uFE0F"))) : (react_1.default.createElement("span", null, "\u2699\uFE0F")))),
            react_1.default.createElement(react_bootstrap_1.OverlayTrigger, { placement: "right", overlay: react_1.default.createElement(react_bootstrap_1.Tooltip, { id: "status-tooltip" }, isConnected ? 'Dev mode - Full access' : 'Static mode - Read only') },
                react_1.default.createElement("div", { className: "p-2 border-top d-flex align-items-center justify-content-center" },
                    react_1.default.createElement("span", { className: `badge rounded-circle d-flex align-items-center justify-content-center`, style: {
                            backgroundColor: isConnected ? '#198754' : '#6c757d',
                            width: '20px',
                            height: '20px',
                            fontSize: '12px'
                        } }, isConnected ? '🟢' : '🔴'))),
            react_1.default.createElement(react_bootstrap_1.OverlayTrigger, { placement: "right", overlay: react_1.default.createElement(react_bootstrap_1.Tooltip, { id: "footer-tooltip" },
                    "made with \u2764\uFE0F and ",
                    react_1.default.createElement("a", { href: "https://www.npmjs.com/package/testeranto" }, "testeranto")) },
                react_1.default.createElement("div", { className: "p-3 border-top text-center mt-auto" },
                    react_1.default.createElement("span", { className: "text-muted" }, "\u2764\uFE0F")))),
        react_1.default.createElement("div", { className: "flex-grow-1 d-flex flex-column", style: { minHeight: '100vh' } },
            react_1.default.createElement("main", { className: "flex-grow-1 p-4", style: { overflow: 'auto' } },
                react_1.default.createElement(react_bootstrap_1.Container, { fluid: true, style: { height: '100%' } }, children)))));
};
exports.AppFrame = AppFrame;
