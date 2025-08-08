import React, { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import { ModalContent } from "./ModalContent";
import SunriseAnimation from "../SunriseAnimation";
export const SettingsButton = ({ className }) => {
    useEffect(() => {
        return () => {
            // Cleanup if needed
        };
    }, []);
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
        // Animation is now handled by SunriseAnimation component
        // document.body.classList.add(`${themeToApply}-theme`);
    };
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { id: "settings-button" },
            React.createElement("button", { className: `btn btn-sm btn-outline-secondary ${className}`, onClick: () => setShowModal(true) },
                React.createElement("div", { id: "gear-icon-settings" }, "\u2699\uFE0F"))),
        React.createElement(SunriseAnimation, { active: theme === 'daily' }),
        React.createElement(Modal, { show: showModal, onHide: () => setShowModal(false), size: "lg" },
            React.createElement(ModalContent, { theme: theme, handleThemeChange: handleThemeChange }),
            React.createElement(Modal.Footer, { className: "border-0" },
                React.createElement(Button, { variant: "btn-primary", onClick: () => setShowModal(false) }, "Done")))));
};
