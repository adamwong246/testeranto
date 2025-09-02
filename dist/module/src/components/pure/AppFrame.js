/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { Container, Nav, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useWebSocket, useTutorialMode, useAuth } from '../../App';
export const AppFrame = ({ children, title, rightContent }) => {
    const location = useLocation();
    const { isConnected } = useWebSocket();
    const { tutorialMode } = useTutorialMode();
    const { isAuthenticated, logout } = useAuth();
    return (React.createElement("div", { className: "d-flex min-vh-100" },
        React.createElement("div", { className: "border-end d-flex flex-column", style: {
                width: '60px',
                height: '100vh',
                position: 'sticky',
                top: 0
            } },
            tutorialMode ? (React.createElement(OverlayTrigger, { placement: "right", overlay: React.createElement(Tooltip, { id: "logo-tooltip" }, "Welcome to Testeranto!") },
                React.createElement("div", { className: "p-3 border-bottom d-flex align-items-center justify-content-center" },
                    React.createElement("img", { src: "/logo.svg", alt: "Testeranto Logo", style: {
                            width: '40px',
                            height: '40px'
                        } })))) : (React.createElement("div", { className: "p-3 border-bottom d-flex align-items-center justify-content-center" },
                React.createElement("img", { src: "/logo.svg", alt: "Testeranto Logo", style: {
                        width: '40px',
                        height: '40px'
                    } }))),
            React.createElement(Nav, { variant: "pills", className: "flex-column p-2 flex-grow-1" },
                React.createElement(Nav.Link, { as: NavLink, to: "/", className: `${location.pathname === '/' ? 'active' : ''} d-flex align-items-center justify-content-center`, style: { height: '40px', width: '40px' } }, tutorialMode ? (React.createElement(OverlayTrigger, { placement: "right", overlay: React.createElement(Tooltip, { id: "projects-tooltip" }, "Projects") },
                    React.createElement("span", null, "\uD83D\uDCC1"))) : (React.createElement("span", null, "\uD83D\uDCC1"))),
                React.createElement(Nav.Link, { as: NavLink, to: "/processes", className: `${location.pathname.startsWith('/processes') ? 'active' : ''} d-flex align-items-center justify-content-center ${!isConnected || !isAuthenticated ? 'text-muted pe-none' : ''}`, style: {
                        height: '40px',
                        width: '40px',
                        opacity: isConnected && isAuthenticated ? 1 : 0.6
                    }, onClick: (e) => {
                        if (!isConnected || !isAuthenticated) {
                            e.preventDefault();
                        }
                    } }, tutorialMode ? (React.createElement(OverlayTrigger, { placement: "right", overlay: React.createElement(Tooltip, { id: "processes-tooltip" },
                        "Processes ",
                        !isAuthenticated ? '(Sign in required)' : !isConnected ? '(WebSocket disconnected)' : '') },
                    React.createElement("span", null, "\uD83D\uDCCA"))) : (React.createElement("span", null, "\uD83D\uDCCA"))),
                React.createElement(Nav.Link, { as: NavLink, to: "/git", className: `${location.pathname === '/git' ? 'active' : ''} d-flex align-items-center justify-content-center ${!isAuthenticated ? 'text-muted pe-none' : ''}`, style: {
                        height: '40px',
                        width: '40px',
                        opacity: isAuthenticated ? 1 : 0.6
                    }, onClick: (e) => {
                        if (!isAuthenticated) {
                            e.preventDefault();
                        }
                    } }, tutorialMode ? (React.createElement(OverlayTrigger, { placement: "right", overlay: React.createElement(Tooltip, { id: "git-tooltip" },
                        "Git Integration ",
                        !isAuthenticated ? '(Sign in required)' : '') },
                    React.createElement("span", null, "\uD83D\uDC19"))) : (React.createElement("span", null, "\uD83D\uDC19"))),
                React.createElement(Nav.Link, { as: NavLink, to: "/settings", className: `${location.pathname === '/settings' ? 'active' : ''} d-flex align-items-center justify-content-center`, style: { height: '40px', width: '40px' } }, tutorialMode ? (React.createElement(OverlayTrigger, { placement: "right", overlay: React.createElement(Tooltip, { id: "settings-tooltip" }, "Settings") },
                    React.createElement("span", null, "\u2699\uFE0F"))) : (React.createElement("span", null, "\u2699\uFE0F")))),
            React.createElement(OverlayTrigger, { placement: "right", overlay: React.createElement(Tooltip, { id: "status-tooltip" }, isConnected ? 'Dev mode - Full access' : 'Static mode - Read only') },
                React.createElement("div", { className: "p-2 border-top d-flex align-items-center justify-content-center" },
                    React.createElement("span", { className: `badge rounded-circle d-flex align-items-center justify-content-center`, style: {
                            backgroundColor: isConnected ? '#198754' : '#6c757d',
                            width: '20px',
                            height: '20px',
                            fontSize: '12px'
                        } }, isConnected ? '🟢' : '🔴'))),
            React.createElement(OverlayTrigger, { placement: "right", overlay: React.createElement(Tooltip, { id: "footer-tooltip" },
                    "made with \u2764\uFE0F and ",
                    React.createElement("a", { href: "https://www.npmjs.com/package/testeranto" }, "testeranto")) },
                React.createElement("div", { className: "p-3 border-top text-center mt-auto" },
                    React.createElement("span", { className: "text-muted" }, "\u2764\uFE0F")))),
        React.createElement("div", { className: "flex-grow-1 d-flex flex-column", style: { minHeight: '100vh' } },
            React.createElement("main", { className: "flex-grow-1 p-4", style: { overflow: 'auto' } },
                React.createElement(Container, { fluid: true, style: { height: '100%' } }, children)))));
};
