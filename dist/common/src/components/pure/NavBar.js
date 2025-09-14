"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NavBar = void 0;
const react_1 = __importDefault(require("react"));
const react_bootstrap_1 = require("react-bootstrap");
const react_router_dom_1 = require("react-router-dom");
const NavBar = ({ title, backLink, navItems = [], rightContent, }) => {
    const location = (0, react_router_dom_1.useLocation)();
    return (react_1.default.createElement(react_bootstrap_1.Navbar, { bg: "light", expand: "lg", className: "mb-2", sticky: "top", expanded: false },
        react_1.default.createElement(react_bootstrap_1.Container, { fluid: true },
            backLink && (react_1.default.createElement(react_bootstrap_1.Nav.Link, { as: react_router_dom_1.Link, to: backLink, className: "me-2 fs-3 text-primary", style: {
                    padding: '0.25rem 0.75rem',
                    border: '2px solid var(--bs-primary)',
                    borderRadius: '50%',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '2.5rem',
                    height: '2.5rem'
                }, title: "Go up one level" }, "\u2191")),
            react_1.default.createElement(react_bootstrap_1.Navbar.Brand, { className: backLink ? 'ms-2' : '' }, title),
            react_1.default.createElement(react_bootstrap_1.Navbar.Toggle, { "aria-controls": "basic-navbar-nav", style: { display: 'none' } }),
            react_1.default.createElement(react_bootstrap_1.Navbar.Collapse, { id: "basic-navbar-nav" },
                navItems.length > 0 && (react_1.default.createElement(react_bootstrap_1.Nav, { className: "me-auto" }, navItems.map((item, i) => {
                    const className = [
                        item.className,
                        item.active ? 'text-primary fw-bold border-bottom border-2 border-primary' : '',
                        typeof item.label === 'string' && item.label.includes('❌') ? 'text-danger fw-bold' : '',
                        typeof item.label === 'string' && item.label.includes('✅') ? 'text-success fw-bold' : '',
                        !item.active && typeof item.label !== 'string' ? 'text-secondary' : ''
                    ].filter(Boolean).join(' ');
                    return (react_1.default.createElement(react_bootstrap_1.Nav.Link, { key: i, as: item.to ? react_router_dom_1.Link : 'div', to: item.to, active: item.active, className: className, title: typeof item.label === 'string' ? item.label : undefined },
                        item.icon && react_1.default.createElement("span", { className: "me-2" }, item.icon),
                        item.label,
                        item.badge && (react_1.default.createElement(react_bootstrap_1.Badge, { bg: item.badge.variant, className: "ms-2" }, item.badge.text))));
                }))),
                rightContent && (react_1.default.createElement(react_bootstrap_1.Nav, null, react_1.default.Children.map(rightContent, (child) => {
                    return child;
                })))))));
};
exports.NavBar = NavBar;
