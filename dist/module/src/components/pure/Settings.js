import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { useTutorialMode } from '../../App';
export const Settings = () => {
    const [theme, setTheme] = useState('auto');
    const { tutorialMode, setTutorialMode } = useTutorialMode();
    useEffect(() => {
        // Load saved theme from localStorage
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            setTheme(savedTheme);
        }
    }, []);
    useEffect(() => {
        // Apply theme when it changes
        applyTheme(theme);
        // Save to localStorage
        localStorage.setItem('theme', theme);
    }, [theme]);
    const applyTheme = (selectedTheme) => {
        const root = document.documentElement;
        if (selectedTheme === 'auto') {
            // Use system preference
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                root.setAttribute('data-bs-theme', 'dark');
            }
            else {
                root.setAttribute('data-bs-theme', 'light');
            }
        }
        else {
            root.setAttribute('data-bs-theme', selectedTheme);
        }
    };
    const handleThemeChange = (event) => {
        setTheme(event.target.value);
    };
    const handleTutorialModeChange = () => {
        const newTutorialMode = !tutorialMode;
        setTutorialMode(newTutorialMode);
        // Save to localStorage
        localStorage.setItem('tutorialMode', newTutorialMode.toString());
    };
    return (React.createElement("div", null,
        React.createElement(Form, null,
            React.createElement(Form.Group, { className: "mb-4" },
                React.createElement("div", null,
                    React.createElement(Form.Check, { type: "radio", id: "theme-light", name: "theme", value: "light", label: "Light mode", checked: theme === 'light', onChange: handleThemeChange }),
                    React.createElement(Form.Check, { type: "radio", id: "theme-dark", name: "theme", value: "dark", label: "Dark mode", checked: theme === 'dark', onChange: handleThemeChange }),
                    React.createElement(Form.Check, { type: "radio", id: "theme-auto", name: "theme", value: "auto", label: "Auto mode. Use system setting", checked: theme === 'auto', onChange: handleThemeChange }))),
            React.createElement(Form.Group, { className: "mb-4" },
                React.createElement(Form.Check, { type: "switch", id: "tutorial-mode", label: tutorialMode ? "Tutorial Mode: ON" : "Tutorial Mode: OFF", checked: tutorialMode, onChange: handleTutorialModeChange }),
                React.createElement(Form.Text, { className: "text-muted" }, "When enabled, helpful tooltips will appear throughout the app to guide you.")))));
};
