/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { Container, Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
export const AppFrame = ({ children, title, rightContent }) => {
    const location = useLocation();
    const [isExpanded, setIsExpanded] = useState(true);
    return (React.createElement("div", { className: "d-flex min-vh-100", style: { backgroundColor: '#f8f9fa' } },
        React.createElement("div", { className: "bg-light border-end d-flex flex-column", style: {
                width: isExpanded ? '250px' : '60px',
                minHeight: '100vh',
                transition: 'width 0.3s ease'
            }, onMouseEnter: () => setIsExpanded(true), onMouseLeave: () => setIsExpanded(false) },
            React.createElement("div", { className: "p-3 border-bottom d-flex align-items-center justify-content-center" }, isExpanded ? (React.createElement("img", { src: "/logo.svg", alt: "Testeranto Logo", style: { width: '128px', height: '128px' } })) : (React.createElement("img", { src: "/logo.svg", alt: "Testeranto Logo", style: { width: '40px', height: '40px' } }))),
            React.createElement(Nav, { variant: "pills", className: "flex-column p-2 flex-grow-1" },
                React.createElement(Nav.Link, { as: NavLink, to: "/", className: `${location.pathname === '/' ? 'active' : ''} text-truncate d-flex align-items-center`, style: { width: '100%' }, title: "Projects" },
                    React.createElement("span", { className: "me-2" }, "\uD83D\uDCC1"),
                    isExpanded && 'Projects'),
                React.createElement(Nav.Link, { as: NavLink, to: "/processes", className: `${location.pathname.startsWith('/processes') ? 'active' : ''} text-truncate d-flex align-items-center`, style: { width: '100%' }, title: "Process Manager" },
                    React.createElement("span", { className: "me-2" }, "\uD83D\uDCCA"),
                    isExpanded && 'Process Manager'),
                React.createElement(Nav.Link, { as: NavLink, to: "/settings", className: `${location.pathname === '/settings' ? 'active' : ''} text-truncate d-flex align-items-center`, style: { width: '100%' }, title: "Settings" },
                    React.createElement("span", { className: "me-2" }, "\u2699\uFE0F"),
                    isExpanded && 'Settings')),
            React.createElement("div", { className: "p-3 border-top text-center mt-auto" }, isExpanded ? (React.createElement("small", { className: "text-muted" },
                "made with \u2764\uFE0F and ",
                React.createElement("a", { href: "https://www.npmjs.com/package/testeranto" }, "testeranto"))) : (React.createElement("small", { className: "text-muted" }, "\u2764\uFE0F")))),
        React.createElement("div", { className: "flex-grow-1 d-flex flex-column" },
            React.createElement("main", { className: "flex-grow-1 p-4", style: { overflow: 'auto' } },
                React.createElement(Container, { fluid: true, className: "h-100" }, children)))));
};
