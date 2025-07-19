import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "./TestReport.scss";
export const SettingsButton = ({ className }) => {
    const [showModal, setShowModal] = useState(false);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'system');
    const handleThemeChange = (e) => {
        const newTheme = e.target.value;
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        // Remove all theme classes first
        // document.body.classList.remove('light-theme', 'dark-theme', 'lovely-theme', 'light-grayscale-theme', 'dark-grayscale-theme', 'sepia-theme');
        let themeToApply = newTheme;
        if (newTheme === 'system') {
            themeToApply = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
        }
        document.documentElement.setAttribute('data-bs-theme', themeToApply);
        // document.body.classList.add(`${themeToApply}-theme`);
    };
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { id: "settings-button" },
            React.createElement("button", { className: `btn btn-sm btn-outline-secondary ${className}`, onClick: () => setShowModal(true) },
                React.createElement("div", { id: "gear-icon-settings" }, "\u2699\uFE0F"))),
        React.createElement(Modal, { show: showModal, onHide: () => setShowModal(false) },
            React.createElement(Modal.Header, { closeButton: true },
                React.createElement(Modal.Title, null, "\u2699\uFE0F Settings")),
            React.createElement(Modal.Body, null,
                React.createElement(Form, null,
                    React.createElement(Form.Group, { className: "mb-3" },
                        React.createElement(Form.Label, null, "Theme"),
                        React.createElement("div", null,
                            React.createElement(Form.Check, { type: "radio", id: "theme-system", label: "\uD83D\uDDA5\uFE0F Auto", name: "theme", value: "system", checked: theme === 'system', onChange: handleThemeChange }),
                            React.createElement(Form.Check, { type: "radio", id: "theme-light", label: "\u2600\uFE0F Business casual", name: "theme", value: "light", checked: theme === 'light', onChange: handleThemeChange }),
                            React.createElement(Form.Check, { type: "radio", id: "theme-dark", label: "\uD83C\uDF19 Business Formal", name: "theme", value: "dark", checked: theme === 'dark', onChange: handleThemeChange }),
                            React.createElement(Form.Check, { type: "radio", id: "theme-light-vibrant", label: "\uD83C\uDF89 Office party", name: "theme", value: "light-vibrant", checked: theme === 'light-vibrant', onChange: handleThemeChange }),
                            React.createElement(Form.Check, { type: "radio", id: "theme-dark-vibrant", label: "\uD83C\uDF03 After party", name: "theme", value: "dark-vibrant", checked: theme === 'dark-vibrant', onChange: handleThemeChange }),
                            React.createElement(Form.Check, { type: "radio", id: "theme-light-grayscale", label: "\uD83D\uDCBC Serious Business", name: "theme", value: "light-grayscale", checked: theme === 'light-grayscale', onChange: handleThemeChange }),
                            React.createElement(Form.Check, { type: "radio", id: "theme-dark-grayscale", label: "\uD83D\uDD76\uFE0F Very Serious Business", name: "theme", value: "dark-grayscale", checked: theme === 'dark-grayscale', onChange: handleThemeChange }),
                            React.createElement(Form.Check, { type: "radio", id: "theme-sepia", label: "\uD83C\uDFE1 WFH", name: "theme", value: "sepia", checked: theme === 'sepia', onChange: handleThemeChange }))))),
            React.createElement(Modal.Footer, null,
                React.createElement(Button, { variant: "secondary", onClick: () => setShowModal(false) }, "Close")))));
};
