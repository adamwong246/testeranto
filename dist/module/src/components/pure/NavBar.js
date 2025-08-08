import React from 'react';
import { Navbar, Container, Nav, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
export const NavBar = ({ title, backLink, navItems = [], rightContent }) => {
    return (React.createElement(Navbar, { bg: "light", expand: "lg", className: "mb-4", sticky: "top" },
        React.createElement(Container, { fluid: true },
            backLink && (React.createElement(Nav.Link, { as: Link, to: backLink, className: "me-2 fs-3 text-primary", style: {
                    padding: '0.25rem 0.75rem',
                    border: '2px solid var(--bs-primary)',
                    borderRadius: '50%',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '2.5rem',
                    height: '2.5rem'
                }, title: "Go up one level" }, "\u2191")),
            React.createElement(Navbar.Brand, { className: backLink ? 'ms-2' : '' }, title),
            React.createElement(Navbar.Toggle, { "aria-controls": "basic-navbar-nav" }),
            React.createElement(Navbar.Collapse, { id: "basic-navbar-nav" },
                navItems.length > 0 && (React.createElement(Nav, { className: "me-auto" }, navItems.map((item, i) => {
                    const className = [
                        item.className,
                        item.active ? 'text-primary fw-bold border-bottom border-2 border-primary' : '',
                        typeof item.label === 'string' && item.label.includes('❌') ? 'text-danger fw-bold' : '',
                        typeof item.label === 'string' && item.label.includes('✅') ? 'text-success fw-bold' : '',
                        !item.active && typeof item.label !== 'string' ? 'text-secondary' : ''
                    ].filter(Boolean).join(' ');
                    return (React.createElement(Nav.Link, { key: i, as: item.to ? Link : 'div', to: item.to, active: item.active, className: className, style: {
                            ':hover': {
                                color: 'var(--bs-primary)',
                                textDecoration: 'none'
                            }
                        } },
                        item.label,
                        item.badge && (React.createElement(Badge, { bg: item.badge.variant, className: "ms-2" }, item.badge.text))));
                }))),
                rightContent && (React.createElement(Nav, null, rightContent))))));
};
