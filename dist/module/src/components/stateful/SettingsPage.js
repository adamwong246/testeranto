import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Row, Col } from 'react-bootstrap';
// import { AppFrame } from '../pure/AppFrame';
export const SettingsPage = () => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'system');
    useEffect(() => {
        let themeToApply = theme;
        if (theme === 'system') {
            themeToApply = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
        }
        document.documentElement.setAttribute('data-bs-theme', themeToApply);
    }, [theme]);
    const handleThemeChange = (e) => {
        const newTheme = e.target.value;
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        let themeToApply = newTheme;
        if (newTheme === 'system') {
            themeToApply = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
        }
        document.documentElement.setAttribute('data-bs-theme', themeToApply);
    };
    return (React.createElement(Container, null,
        React.createElement(Row, { className: "justify-content-center" },
            React.createElement(Col, { lg: 8 },
                React.createElement(Card, { className: "theme-card" },
                    React.createElement(Card.Body, null,
                        React.createElement(Form, null,
                            React.createElement(Form.Group, { className: "mb-4" },
                                React.createElement(Form.Label, { className: "h6 mb-3" }, "Theme"),
                                React.createElement("div", { className: "d-flex flex-wrap gap-3" },
                                    React.createElement(Form.Check, { type: "radio", name: "theme", id: "light-theme", label: "Light", value: "light", checked: theme === 'light', onChange: handleThemeChange, className: "theme-option" }),
                                    React.createElement(Form.Check, { type: "radio", name: "theme", id: "dark-theme", label: "Dark", value: "dark", checked: theme === 'dark', onChange: handleThemeChange, className: "theme-option" }),
                                    React.createElement(Form.Check, { type: "radio", name: "theme", id: "system-theme", label: "System", value: "system", checked: theme === 'system', onChange: handleThemeChange, className: "theme-option" }))))))))));
};
