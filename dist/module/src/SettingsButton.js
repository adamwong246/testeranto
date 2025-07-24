import React, { useState, useEffect } from "react";
import SunriseAnimation from "./components/SunriseAnimation";
import { Modal, Button } from "react-bootstrap";
// import "./TestReport.scss";
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
            React.createElement(Modal.Header, { closeButton: true, className: "border-0" },
                React.createElement(Modal.Title, { className: "d-flex align-items-center" },
                    React.createElement("i", { className: "bi bi-palette-fill me-2" }),
                    React.createElement("span", null, "Settings"))),
            React.createElement("div", { className: "alert alert-warning mx-3 mt-2 mb-0" },
                React.createElement("i", { className: "bi bi-exclamation-triangle-fill me-2" }),
                React.createElement("strong", null, "Warning:"),
                " Themes are an experimental feature. Only \"Business casual\" is fully supported at this time."),
            React.createElement(Modal.Body, { className: "p-0" },
                React.createElement("div", { className: "p-3" },
                    React.createElement("div", { className: "row g-3" },
                        React.createElement("div", { className: "col-md-4" },
                            React.createElement("div", { className: `card theme-card ${theme === 'system' ? 'border-primary' : ''}`, onClick: () => handleThemeChange({ target: { value: 'system' } }), style: {
                                    background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                                    borderColor: '#adb5bd'
                                } },
                                React.createElement("div", { className: "card-body text-center p-3" },
                                    React.createElement("h5", { className: "card-title mb-0" }, "9 to 5"),
                                    React.createElement("p", { className: "small text-muted mb-0" }, "Follows your OS theme")))),
                        React.createElement("div", { className: "col-md-4" },
                            React.createElement("div", { className: `card theme-card ${theme === 'light' ? 'border-primary' : ''}`, onClick: () => handleThemeChange({ target: { value: 'light' } }), style: {
                                    background: 'linear-gradient(135deg, #ffffff 0%, #f1f3f5 100%)',
                                    borderColor: '#ced4da',
                                    color: '#212529',
                                    borderWidth: '2px'
                                } },
                                React.createElement("div", { className: "card-body text-center p-3" },
                                    React.createElement("h5", { className: "card-title mb-1" }, "Business casual"),
                                    React.createElement("p", { className: "small text-muted mb-0" }, "Clean & professional")))),
                        React.createElement("div", { className: "col-md-4" },
                            React.createElement("div", { className: `card theme-card ${theme === 'dark' ? 'border-primary' : ''}`, onClick: () => handleThemeChange({ target: { value: 'dark' } }), style: {
                                    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                                    borderColor: '#4ecdc4',
                                    color: '#f8f9fa',
                                    borderWidth: '2px'
                                } },
                                React.createElement("div", { className: "card-body text-center p-3" },
                                    React.createElement("h5", { className: "card-title mb-1" }, "Business formal"),
                                    React.createElement("p", { className: "small text-muted mb-0" }, "Premium & focused")))),
                        React.createElement("div", { className: "col-md-4" },
                            React.createElement("div", { className: `card theme-card ${theme === 'light-vibrant' ? 'border-primary' : ''}`, onClick: () => handleThemeChange({ target: { value: 'light-vibrant' } }), style: {
                                    background: 'linear-gradient(135deg, #ff2d75 0%, #00e5ff 100%)',
                                    borderColor: '#ffeb3b',
                                    color: '#fff'
                                } },
                                React.createElement("div", { className: "card-body text-center p-3" },
                                    React.createElement("h5", { className: "card-title mb-1" }, "Office Party"),
                                    React.createElement("p", { className: "small text-muted mb-0" }, "Colorful & fun")))),
                        React.createElement("div", { className: "col-md-4" },
                            React.createElement("div", { className: `card theme-card ${theme === 'dark-vibrant' ? 'border-primary' : ''}`, onClick: () => handleThemeChange({ target: { value: 'dark-vibrant' } }), style: {
                                    background: 'linear-gradient(135deg, #16213e 0%, #e94560 100%)',
                                    borderColor: '#00e5ff',
                                    color: '#fff'
                                } },
                                React.createElement("div", { className: "card-body text-center p-3" },
                                    React.createElement("h5", { className: "card-title mb-1" }, "After Party"),
                                    React.createElement("p", { className: "small text-muted mb-0" }, "Neon nightlife")))),
                        React.createElement("div", { className: "col-md-4" },
                            React.createElement("div", { className: `card theme-card ${theme === 'sepia' ? 'border-primary' : ''}`, onClick: () => handleThemeChange({ target: { value: 'sepia' } }), style: {
                                    background: 'linear-gradient(135deg, #f4ecd8 0%, #d0b88f 100%)',
                                    borderColor: '#8b6b4a',
                                    color: '#3a3226'
                                } },
                                React.createElement("div", { className: "card-body text-center p-3" },
                                    React.createElement("h5", { className: "card-title mb-1" }, "WFH"),
                                    React.createElement("p", { className: "small text-muted mb-0" }, "Vintage warmth")))),
                        React.createElement("div", { className: "col-md-4" },
                            React.createElement("div", { className: `card theme-card ${theme === 'light-grayscale' ? 'border-primary' : ''}`, onClick: () => handleThemeChange({ target: { value: 'light-grayscale' } }), style: {
                                    background: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
                                    borderColor: '#666',
                                    color: '#333',
                                    borderWidth: '2px'
                                } },
                                React.createElement("div", { className: "card-body text-center p-3" },
                                    React.createElement("h5", { className: "card-title mb-1" }, "Serious Business"),
                                    React.createElement("p", { className: "small text-muted mb-0" }, "Simple & distraction-free")))),
                        React.createElement("div", { className: "col-md-4" },
                            React.createElement("div", { className: `card theme-card ${theme === 'dark-grayscale' ? 'border-primary' : ''}`, onClick: () => handleThemeChange({ target: { value: 'dark-grayscale' } }), style: {
                                    background: 'linear-gradient(135deg, #111 0%, #333 100%)',
                                    borderColor: '#ff6b6b',
                                    color: '#e0e0e0',
                                    borderWidth: '2px'
                                } },
                                React.createElement("div", { className: "card-body text-center p-3" },
                                    React.createElement("h5", { className: "card-title mb-1" }, "Very Serious business"),
                                    React.createElement("p", { className: "small text-muted mb-0" }, "Maximum readability")))),
                        React.createElement("div", { className: "col-md-4" },
                            React.createElement("div", { className: `card theme-card ${theme === 'daily' ? 'border-primary' : ''}`, onClick: () => handleThemeChange({ target: { value: 'daily' } }), style: {
                                    background: 'linear-gradient(135deg, #6eafff 0%, #f9fbf0 100%)',
                                    borderColor: '#f7d62e',
                                    color: '#00192d'
                                } },
                                React.createElement("div", { className: "card-body text-center p-3" },
                                    React.createElement("h5", { className: "card-title mb-1" }, "Dreaming of PTO"),
                                    React.createElement("p", { className: "small text-muted mb-0" }, "Sunrise, sunset")))),
                        React.createElement("div", { className: "col-md-4" },
                            React.createElement("div", { className: `card theme-card ${theme === 'protanopia' ? 'border-primary' : ''}`, onClick: () => handleThemeChange({ target: { value: 'protanopia' } }), style: {
                                    background: 'linear-gradient(135deg, #f8f9fa 0%, #e0e8ff 100%)',
                                    borderColor: '#3366cc',
                                    color: '#333'
                                } },
                                React.createElement("div", { className: "card-body text-center p-3" },
                                    React.createElement("h5", { className: "card-title mb-0" }, "Protanopia"),
                                    React.createElement("p", { className: "small text-muted mb-0" }, "Red-blind mode")))),
                        React.createElement("div", { className: "col-md-4" },
                            React.createElement("div", { className: `card theme-card ${theme === 'deuteranopia' ? 'border-primary' : ''}`, onClick: () => handleThemeChange({ target: { value: 'deuteranopia' } }), style: {
                                    background: 'linear-gradient(135deg, #f8f9fa 0%, #ffe0e0 100%)',
                                    borderColor: '#cc6633',
                                    color: '#333'
                                } },
                                React.createElement("div", { className: "card-body text-center p-3" },
                                    React.createElement("h5", { className: "card-title mb-0" }, "Deuteranopia"),
                                    React.createElement("p", { className: "small text-muted mb-0" }, "Green-blind mode")))),
                        React.createElement("div", { className: "col-md-4" },
                            React.createElement("div", { className: `card theme-card ${theme === 'tritanopia' ? 'border-primary' : ''}`, onClick: () => handleThemeChange({ target: { value: 'tritanopia' } }), style: {
                                    background: 'linear-gradient(135deg, #f8f9fa 0%, #e0ffe0 100%)',
                                    borderColor: '#00aa66',
                                    color: '#333'
                                } },
                                React.createElement("div", { className: "card-body text-center p-3" },
                                    React.createElement("h5", { className: "card-title mb-0" }, "Tritanopia"),
                                    React.createElement("p", { className: "small text-muted mb-0" }, "Blue-blind mode"))))))),
            React.createElement(Modal.Footer, { className: "border-0" },
                React.createElement(Button, { variant: "btn-primary", onClick: () => setShowModal(false) }, "Done")))));
};
