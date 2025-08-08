import React from 'react';
import { Container } from 'react-bootstrap';
import { SettingsButton } from './SettingsButton';
export const AppFrame = ({ children }) => {
    return (React.createElement("div", { className: "d-flex flex-column min-vh-100", key: window.location.pathname },
        React.createElement("main", { className: "flex-grow-1 p-3" },
            React.createElement(Container, { fluid: true }, children)),
        React.createElement("footer", { className: "bg-light py-2 d-flex justify-content-between align-items-center" },
            React.createElement(SettingsButton, null),
            React.createElement(Container, { className: "text-end", fluid: true },
                "made with \u2764\uFE0F and ",
                React.createElement("a", { href: "https://www.npmjs.com/package/testeranto" }, "testeranto")))));
};
