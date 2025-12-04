/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { Container, Nav, OverlayTrigger, Tooltip, } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useTutorialMode, useAuth } from "../../App";
import { useWebSocket } from "../../useWebSocket";
import { HelpoChatDrawer } from "./HelpoChatDrawer";
export const AppFrame = ({ children, title, rightContent }) => {
    const location = useLocation();
    const { isConnected } = useWebSocket();
    const { tutorialMode } = useTutorialMode();
    const { isAuthenticated, logout } = useAuth();
    const [hasAnimated, setHasAnimated] = useState(false);
    const [isHelpoActive, setIsHelpoActive] = useState(false);
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
    useEffect(() => {
        // Only animate on the first load
        if (!hasAnimated) {
            const timer = setTimeout(() => {
                setHasAnimated(true);
            }, 4000); // Stop animation after all links have animated (1s + 1.8s = 2.8s, rounded up)
            return () => clearTimeout(timer);
        }
    }, [hasAnimated]);
    return (React.createElement("div", { className: "d-flex min-vh-100" },
        React.createElement("style", null, brandLogoStyle),
        React.createElement("div", { className: `border-end d-flex flex-column ${!hasAnimated ? "sidebar-attention" : ""}`, style: {
                flexBasis: "40px" /* Reduced from 60px */,
                flexGrow: "0",
                flexShrink: "0",
                height: "100vh",
                position: "sticky",
                top: 0,
            } },
            React.createElement(Nav, { variant: "pills", className: "flex-column p-0 flex-grow-1" },
                React.createElement(Nav.Link, { as: NavLink, to: "/helpo", className: `${location.pathname === "/helpo" ? "active" : ""} d-flex align-items-center justify-content-center ${!hasAnimated ? "navbar-attention-1" : ""}` }, tutorialMode ? (React.createElement(OverlayTrigger, { placement: "right", overlay: React.createElement(Tooltip, { id: "help-tooltip" }, "Chat with Helpo, the helpful robot.") },
                    React.createElement("span", null, "helpo"))) : (React.createElement("span", null, "helpo"))),
                React.createElement(Nav.Link, { as: NavLink, to: "/flua", className: `${location.pathname === "/flua" ? "active" : ""} d-flex align-items-center justify-content-center ${!hasAnimated ? "navbar-attention-1" : ""}` }, tutorialMode ? (React.createElement(OverlayTrigger, { placement: "right", overlay: React.createElement(Tooltip, { id: "help-tooltip" }, "Process/Project Management") },
                    React.createElement("span", null, "flua"))) : (React.createElement("span", null, "flua"))),
                React.createElement(Nav.Link, { as: NavLink, to: "/projects", className: `${location.pathname === "/projects" ? "active" : ""} d-flex align-items-center justify-content-center ${!hasAnimated ? "navbar-attention-2" : ""}` }, tutorialMode ? (React.createElement(OverlayTrigger, { placement: "right", overlay: React.createElement(Tooltip, { id: "projects-tooltip" }, "Projects") },
                    React.createElement("span", null, "testo"))) : (React.createElement("span", null, "testo"))),
                React.createElement(Nav.Link, { as: NavLink, to: "/processes", className: `${location.pathname.startsWith("/processes") ? "active" : ""} d-flex align-items-center justify-content-center ${!hasAnimated ? "navbar-attention-3" : ""}`, 
                    // style={{
                    //   height: '40px',
                    //   width: '40px',
                    //   opacity: isConnected && isAuthenticated ? 1 : 0.6
                    // }}
                    onClick: (e) => {
                        if (!isConnected || !isAuthenticated) {
                            e.preventDefault();
                        }
                    } }, tutorialMode ? (React.createElement(OverlayTrigger, { placement: "right", overlay: React.createElement(Tooltip, { id: "processes-tooltip" },
                        "Processes",
                        " ",
                        !isAuthenticated
                            ? "(Sign in required)"
                            : !isConnected
                                ? "(WebSocket disconnected)"
                                : "") },
                    React.createElement("span", null, "pro\u0109o"))) : (React.createElement("span", null, "pro\u0109o"))),
                React.createElement(Nav.Link, { as: NavLink, to: "/git", className: `${location.pathname === "/git" ? "active" : ""} d-flex align-items-center justify-content-center ${!isAuthenticated ? "text-muted pe-none" : ""} ${!hasAnimated ? "navbar-attention-4" : ""}`, 
                    // style={{
                    //   height: '40px',
                    //   width: '40px',
                    //   opacity: isAuthenticated ? 1 : 0.6
                    // }}
                    onClick: (e) => {
                        if (!isAuthenticated) {
                            e.preventDefault();
                        }
                    } }, tutorialMode ? (React.createElement(OverlayTrigger, { placement: "right", overlay: React.createElement(Tooltip, { id: "git-tooltip" },
                        "Git Integration",
                        " ",
                        !isAuthenticated ? "(Sign in required)" : "") },
                    React.createElement("span", null, "arbo"))) : (React.createElement("span", null, "arbo"))),
                React.createElement(Nav.Link, { as: NavLink, to: "/svg-editor", className: `${location.pathname === "/svg-editor" ? "active" : ""} d-flex align-items-center justify-content-center` }, tutorialMode ? (React.createElement(OverlayTrigger, { placement: "right", overlay: React.createElement(Tooltip, { id: "svg-editor-tooltip" }, "svg editor") },
                    React.createElement("span", null, "vektoro"))) : (React.createElement("span", null, "vektoro"))),
                React.createElement(Nav.Link, { as: NavLink, to: "/drato", className: `${location.pathname === "/drato" ? "active" : ""} d-flex align-items-center justify-content-center` }, tutorialMode ? (React.createElement(OverlayTrigger, { placement: "right", overlay: React.createElement(Tooltip, { id: "drato-tooltip" }, "Bootstrap wireframing tool") },
                    React.createElement("span", null, "drato"))) : (React.createElement("span", null, "drato"))),
                React.createElement(Nav.Link, { as: NavLink, to: "/grafeo", className: `${location.pathname === "/grafeo" ? "active" : ""} d-flex align-items-center justify-content-center` }, tutorialMode ? (React.createElement(OverlayTrigger, { placement: "right", overlay: React.createElement(Tooltip, { id: "grafeo-tooltip" }, "GraphML editor") },
                    React.createElement("span", null, "grafeo"))) : (React.createElement("span", null, "grafeo"))),
                React.createElement(Nav.Link, { as: NavLink, to: "/skribo", className: `${location.pathname === "/skribo" ? "active" : ""} d-flex align-items-center justify-content-center` }, tutorialMode ? (React.createElement(OverlayTrigger, { placement: "right", overlay: React.createElement(Tooltip, { id: "skribo-tooltip" }, "Code editor") },
                    React.createElement("span", null, "skribo"))) : (React.createElement("span", null, "skribo"))),
                React.createElement(Nav.Link, { as: NavLink, to: "/settings", className: `${location.pathname === "/settings" ? "active" : ""} d-flex align-items-center justify-content-center ${!hasAnimated ? "navbar-attention-6" : ""}` }, tutorialMode ? (React.createElement(OverlayTrigger, { placement: "right", overlay: React.createElement(Tooltip, { id: "settings-tooltip" }, "Settings") },
                    React.createElement("span", null, "konto"))) : (React.createElement("span", null, "konto")))),
            React.createElement(OverlayTrigger, { placement: "right", overlay: React.createElement(Tooltip, { id: "status-tooltip" }, isConnected
                    ? "Dev mode - Full access"
                    : "Static mode - Read only") },
                React.createElement("div", { className: "p-2 border-top d-flex align-items-center justify-content-center" },
                    React.createElement("span", { className: `badge rounded-circle d-flex align-items-center justify-content-center` }, isConnected ? "🟢" : "🔴"))),
            React.createElement("div", { className: "p-2 border-top d-flex align-items-center justify-content-center" },
                React.createElement("button", { onClick: () => setIsHelpoActive(!isHelpoActive), className: "brand-logo btn p-0 border-0 bg-transparent", style: {
                        display: "block",
                        transition: "transform 0.3s ease",
                    }, onMouseEnter: (e) => {
                        e.currentTarget.style.transform = "scale(1.1)";
                    }, onMouseLeave: (e) => {
                        e.currentTarget.style.transform = "scale(1)";
                    } },
                    React.createElement("img", { src: "https://www.testeranto.com/logo.svg", alt: "Testeranto Logo", style: {
                            height: "32px",
                            width: "32px",
                        } })))),
        React.createElement(HelpoChatDrawer, { isActive: isHelpoActive, onToggle: () => setIsHelpoActive(!isHelpoActive) }),
        React.createElement("div", { className: "d-flex flex-column", style: {
                minHeight: "100vh",
                minWidth: "0", // Allows the content to shrink below its initial size
                flex: "1 1 auto", // Take up remaining space
                overflow: "auto", // Enable scrolling
            } },
            React.createElement("main", { className: "flex-grow-1 p-1", style: {
                    minWidth: "fit-content",
                    width: "100%",
                } },
                React.createElement(Container, { fluid: true, style: {
                        height: "100%",
                        minWidth: "fit-content",
                        padding: "0.125rem",
                    } }, location.pathname === "/helpo" ? (React.createElement("div", null,
                    React.createElement("h1", null, "Helpo Documentation"),
                    React.createElement("p", null, "Welcome to the Helpo documentation. Here you can find information about using Testeranto."),
                    React.createElement("h2", null, "Getting Started"),
                    React.createElement("p", null, "Start by creating a project and writing your first test cases."),
                    React.createElement("h2", null, "Features"),
                    React.createElement("ul", null,
                        React.createElement("li", null, "Test automation"),
                        React.createElement("li", null, "Process management"),
                        React.createElement("li", null, "Git integration"),
                        React.createElement("li", null, "And much more...")))) : (children))))));
};
