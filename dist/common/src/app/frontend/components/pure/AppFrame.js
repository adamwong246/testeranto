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
const App_1 = require("../../App");
const useWebSocket_1 = require("../../useWebSocket");
const HelpoChatDrawer_1 = require("./HelpoChatDrawer");
const AppFrame = ({ children, title, rightContent }) => {
    const location = (0, react_router_dom_2.useLocation)();
    const { isConnected } = (0, useWebSocket_1.useWebSocket)();
    const { tutorialMode } = (0, App_1.useTutorialMode)();
    const { isAuthenticated, logout } = (0, App_1.useAuth)();
    const [hasAnimated, setHasAnimated] = (0, react_1.useState)(false);
    const [isHelpoActive, setIsHelpoActive] = (0, react_1.useState)(false);
    // Add CSS for the brand logo animation
    const brandLogoStyle = `
    .brand-logo:hover {
      transform: scale(1.1);
      transition: transform 0.3s ease;
    }
    .brand-logo:active {
      transform: scale(0.95);
    }
  `;
    (0, react_1.useEffect)(() => {
        // Only animate on the first load
        if (!hasAnimated) {
            const timer = setTimeout(() => {
                setHasAnimated(true);
            }, 4000); // Stop animation after all links have animated (1s + 1.8s = 2.8s, rounded up)
            return () => clearTimeout(timer);
        }
    }, [hasAnimated]);
    return (react_1.default.createElement("div", { className: "d-flex min-vh-100" },
        react_1.default.createElement("style", null, brandLogoStyle),
        react_1.default.createElement("div", { className: `border-end d-flex flex-column ${!hasAnimated ? "sidebar-attention" : ""}`, style: {
                flexBasis: "40px" /* Reduced from 60px */,
                flexGrow: "0",
                flexShrink: "0",
                height: "100vh",
                position: "sticky",
                top: 0,
            } },
            react_1.default.createElement(react_bootstrap_1.Nav, { variant: "pills", className: "flex-column p-0 flex-grow-1" },
                react_1.default.createElement(react_bootstrap_1.Nav.Link, { as: react_router_dom_1.NavLink, to: "/helpo", className: `${location.pathname === "/helpo" ? "active" : ""} d-flex align-items-center justify-content-center ${!hasAnimated ? "navbar-attention-1" : ""}` }, tutorialMode ? (react_1.default.createElement(react_bootstrap_1.OverlayTrigger, { placement: "right", overlay: react_1.default.createElement(react_bootstrap_1.Tooltip, { id: "help-tooltip" }, "Chat with Helpo, the helpful robot.") },
                    react_1.default.createElement("span", null, "helpo"))) : (react_1.default.createElement("span", null, "helpo"))),
                react_1.default.createElement(react_bootstrap_1.Nav.Link, { as: react_router_dom_1.NavLink, to: "/flua", className: `${location.pathname === "/flua" ? "active" : ""} d-flex align-items-center justify-content-center ${!hasAnimated ? "navbar-attention-1" : ""}` }, tutorialMode ? (react_1.default.createElement(react_bootstrap_1.OverlayTrigger, { placement: "right", overlay: react_1.default.createElement(react_bootstrap_1.Tooltip, { id: "help-tooltip" }, "Process/Project Management") },
                    react_1.default.createElement("span", null, "flua"))) : (react_1.default.createElement("span", null, "flua"))),
                react_1.default.createElement(react_bootstrap_1.Nav.Link, { as: react_router_dom_1.NavLink, to: "/projects", className: `${location.pathname === "/projects" ? "active" : ""} d-flex align-items-center justify-content-center ${!hasAnimated ? "navbar-attention-2" : ""}` }, tutorialMode ? (react_1.default.createElement(react_bootstrap_1.OverlayTrigger, { placement: "right", overlay: react_1.default.createElement(react_bootstrap_1.Tooltip, { id: "projects-tooltip" }, "Projects") },
                    react_1.default.createElement("span", null, "testo"))) : (react_1.default.createElement("span", null, "testo"))),
                react_1.default.createElement(react_bootstrap_1.Nav.Link, { as: react_router_dom_1.NavLink, to: "/processes", className: `${location.pathname.startsWith("/processes") ? "active" : ""} d-flex align-items-center justify-content-center ${!hasAnimated ? "navbar-attention-3" : ""}`, 
                    // style={{
                    //   height: '40px',
                    //   width: '40px',
                    //   opacity: isConnected && isAuthenticated ? 1 : 0.6
                    // }}
                    onClick: (e) => {
                        if (!isConnected || !isAuthenticated) {
                            e.preventDefault();
                        }
                    } }, tutorialMode ? (react_1.default.createElement(react_bootstrap_1.OverlayTrigger, { placement: "right", overlay: react_1.default.createElement(react_bootstrap_1.Tooltip, { id: "processes-tooltip" },
                        "Processes",
                        " ",
                        !isAuthenticated
                            ? "(Sign in required)"
                            : !isConnected
                                ? "(WebSocket disconnected)"
                                : "") },
                    react_1.default.createElement("span", null, "pro\u0109o"))) : (react_1.default.createElement("span", null, "pro\u0109o"))),
                react_1.default.createElement(react_bootstrap_1.Nav.Link, { as: react_router_dom_1.NavLink, to: "/git", className: `${location.pathname === "/git" ? "active" : ""} d-flex align-items-center justify-content-center ${!isAuthenticated ? "text-muted pe-none" : ""} ${!hasAnimated ? "navbar-attention-4" : ""}`, 
                    // style={{
                    //   height: '40px',
                    //   width: '40px',
                    //   opacity: isAuthenticated ? 1 : 0.6
                    // }}
                    onClick: (e) => {
                        if (!isAuthenticated) {
                            e.preventDefault();
                        }
                    } }, tutorialMode ? (react_1.default.createElement(react_bootstrap_1.OverlayTrigger, { placement: "right", overlay: react_1.default.createElement(react_bootstrap_1.Tooltip, { id: "git-tooltip" },
                        "Git Integration",
                        " ",
                        !isAuthenticated ? "(Sign in required)" : "") },
                    react_1.default.createElement("span", null, "arbo"))) : (react_1.default.createElement("span", null, "arbo"))),
                react_1.default.createElement(react_bootstrap_1.Nav.Link, { as: react_router_dom_1.NavLink, to: "/svg-editor", className: `${location.pathname === "/svg-editor" ? "active" : ""} d-flex align-items-center justify-content-center` }, tutorialMode ? (react_1.default.createElement(react_bootstrap_1.OverlayTrigger, { placement: "right", overlay: react_1.default.createElement(react_bootstrap_1.Tooltip, { id: "svg-editor-tooltip" }, "svg editor") },
                    react_1.default.createElement("span", null, "vektoro"))) : (react_1.default.createElement("span", null, "vektoro"))),
                react_1.default.createElement(react_bootstrap_1.Nav.Link, { as: react_router_dom_1.NavLink, to: "/drato", className: `${location.pathname === "/drato" ? "active" : ""} d-flex align-items-center justify-content-center` }, tutorialMode ? (react_1.default.createElement(react_bootstrap_1.OverlayTrigger, { placement: "right", overlay: react_1.default.createElement(react_bootstrap_1.Tooltip, { id: "drato-tooltip" }, "Bootstrap wireframing tool") },
                    react_1.default.createElement("span", null, "drato"))) : (react_1.default.createElement("span", null, "drato"))),
                react_1.default.createElement(react_bootstrap_1.Nav.Link, { as: react_router_dom_1.NavLink, to: "/grafeo", className: `${location.pathname === "/grafeo" ? "active" : ""} d-flex align-items-center justify-content-center` }, tutorialMode ? (react_1.default.createElement(react_bootstrap_1.OverlayTrigger, { placement: "right", overlay: react_1.default.createElement(react_bootstrap_1.Tooltip, { id: "grafeo-tooltip" }, "GraphML editor") },
                    react_1.default.createElement("span", null, "grafeo"))) : (react_1.default.createElement("span", null, "grafeo"))),
                react_1.default.createElement(react_bootstrap_1.Nav.Link, { as: react_router_dom_1.NavLink, to: "/skribo", className: `${location.pathname === "/skribo" ? "active" : ""} d-flex align-items-center justify-content-center` }, tutorialMode ? (react_1.default.createElement(react_bootstrap_1.OverlayTrigger, { placement: "right", overlay: react_1.default.createElement(react_bootstrap_1.Tooltip, { id: "skribo-tooltip" }, "Code editor") },
                    react_1.default.createElement("span", null, "skribo"))) : (react_1.default.createElement("span", null, "skribo"))),
                react_1.default.createElement(react_bootstrap_1.Nav.Link, { as: react_router_dom_1.NavLink, to: "/settings", className: `${location.pathname === "/settings" ? "active" : ""} d-flex align-items-center justify-content-center ${!hasAnimated ? "navbar-attention-6" : ""}` }, tutorialMode ? (react_1.default.createElement(react_bootstrap_1.OverlayTrigger, { placement: "right", overlay: react_1.default.createElement(react_bootstrap_1.Tooltip, { id: "settings-tooltip" }, "Settings") },
                    react_1.default.createElement("span", null, "konto"))) : (react_1.default.createElement("span", null, "konto")))),
            react_1.default.createElement(react_bootstrap_1.OverlayTrigger, { placement: "right", overlay: react_1.default.createElement(react_bootstrap_1.Tooltip, { id: "status-tooltip" }, isConnected
                    ? "Dev mode - Full access"
                    : "Static mode - Read only") },
                react_1.default.createElement("div", { className: "p-2 border-top d-flex align-items-center justify-content-center" },
                    react_1.default.createElement("span", { className: `badge rounded-circle d-flex align-items-center justify-content-center` }, isConnected ? "🟢" : "🔴"))),
            react_1.default.createElement("div", { className: "p-2 border-top d-flex align-items-center justify-content-center" },
                react_1.default.createElement("button", { onClick: () => setIsHelpoActive(!isHelpoActive), className: "brand-logo btn p-0 border-0 bg-transparent", style: {
                        display: "block",
                        transition: "transform 0.3s ease",
                    }, onMouseEnter: (e) => {
                        e.currentTarget.style.transform = "scale(1.1)";
                    }, onMouseLeave: (e) => {
                        e.currentTarget.style.transform = "scale(1)";
                    } },
                    react_1.default.createElement("img", { src: "https://www.testeranto.com/logo.svg", alt: "Testeranto Logo", style: {
                            height: "32px",
                            width: "32px",
                        } })))),
        react_1.default.createElement(HelpoChatDrawer_1.HelpoChatDrawer, { isActive: isHelpoActive, onToggle: () => setIsHelpoActive(!isHelpoActive) }),
        react_1.default.createElement("div", { className: "d-flex flex-column", style: {
                minHeight: "100vh",
                minWidth: "0", // Allows the content to shrink below its initial size
                flex: "1 1 auto", // Take up remaining space
                overflow: "auto", // Enable scrolling
            } },
            react_1.default.createElement("main", { className: "flex-grow-1 p-1", style: {
                    minWidth: "fit-content",
                    width: "100%",
                } },
                react_1.default.createElement(react_bootstrap_1.Container, { fluid: true, style: {
                        height: "100%",
                        minWidth: "fit-content",
                        padding: "0.125rem",
                    } }, location.pathname === "/helpo" ? (react_1.default.createElement("div", null,
                    react_1.default.createElement("h1", null, "Helpo Documentation"),
                    react_1.default.createElement("p", null, "Welcome to the Helpo documentation. Here you can find information about using Testeranto."),
                    react_1.default.createElement("h2", null, "Getting Started"),
                    react_1.default.createElement("p", null, "Start by creating a project and writing your first test cases."),
                    react_1.default.createElement("h2", null, "Features"),
                    react_1.default.createElement("ul", null,
                        react_1.default.createElement("li", null, "Test automation"),
                        react_1.default.createElement("li", null, "Process management"),
                        react_1.default.createElement("li", null, "Git integration"),
                        react_1.default.createElement("li", null, "And much more...")))) : (children))))));
};
exports.AppFrame = AppFrame;
