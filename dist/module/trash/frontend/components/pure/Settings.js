import React, { useState, useEffect } from "react";
import { Form, Container, Row, Col, Card, Button } from "react-bootstrap";
import { GitHubLoginButton } from "./GitHubLoginButton";
import { useTutorialMode, useAuth } from "../../App";
import { githubAuthService } from "../../GitHubAuthService";
export const Settings = () => {
    const [theme, setTheme] = useState("auto");
    const { tutorialMode, setTutorialMode } = useTutorialMode();
    const { isAuthenticated, logout } = useAuth();
    useEffect(() => {
        // Load saved theme from localStorage
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) {
            setTheme(savedTheme);
        }
    }, []);
    useEffect(() => {
        // Apply theme when it changes
        applyTheme(theme);
        // Save to localStorage
        localStorage.setItem("theme", theme);
    }, [theme]);
    const applyTheme = (selectedTheme) => {
        const root = document.documentElement;
        if (selectedTheme === "auto") {
            // Use system preference
            if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
                root.setAttribute("data-bs-theme", "dark");
            }
            else {
                root.setAttribute("data-bs-theme", "light");
            }
        }
        else {
            root.setAttribute("data-bs-theme", selectedTheme);
        }
    };
    const handleThemeChange = (event) => {
        setTheme(event.target.value);
    };
    const handleTutorialModeChange = () => {
        const newTutorialMode = !tutorialMode;
        setTutorialMode(newTutorialMode);
        // Save to localStorage
        localStorage.setItem("tutorialMode", newTutorialMode.toString());
    };
    return (React.createElement(Container, null,
        React.createElement(Row, null,
            React.createElement(Col, { md: 8, lg: 6 },
                React.createElement(Card, null,
                    React.createElement(Card.Header, null,
                        React.createElement("h5", { className: "mb-0" }, "Appearance")),
                    React.createElement(Card.Body, null,
                        React.createElement(Form, null,
                            React.createElement(Form.Group, { className: "mb-4" },
                                React.createElement("div", null,
                                    React.createElement(Form.Check, { type: "radio", id: "theme-light", name: "theme", value: "light", label: "Light mode", checked: theme === "light", onChange: handleThemeChange }),
                                    React.createElement(Form.Check, { type: "radio", id: "theme-dark", name: "theme", value: "dark", label: "Dark mode", checked: theme === "dark", onChange: handleThemeChange }),
                                    React.createElement(Form.Check, { type: "radio", id: "theme-auto", name: "theme", value: "auto", label: "Auto mode. Use system setting", checked: theme === "auto", onChange: handleThemeChange }))),
                            React.createElement(Form.Group, { className: "mb-4" },
                                React.createElement(Form.Check, { type: "switch", id: "tutorial-mode", label: tutorialMode ? "Tutorial Mode: ON" : "Tutorial Mode: OFF", checked: tutorialMode, onChange: handleTutorialModeChange }),
                                React.createElement(Form.Text, { className: "text-muted" }, "When enabled, helpful tooltips will appear throughout the app to guide you."))))))),
        React.createElement(Row, { className: "mt-4" },
            React.createElement(Col, { md: 8, lg: 6 },
                React.createElement(Card, null,
                    React.createElement(Card.Header, null,
                        React.createElement("h5", { className: "mb-0" }, "GitHub Integration")),
                    React.createElement(Card.Body, null, githubAuthService.isConfigured() ? (isAuthenticated ? (React.createElement("div", null,
                        React.createElement("p", null, "Connected to GitHub"),
                        React.createElement("div", { className: "d-grid gap-2" },
                            React.createElement(Button, { variant: "danger", onClick: logout }, "Sign Out from GitHub")))) : (React.createElement("div", null,
                        React.createElement("p", null, "Connect your GitHub account to enable Git operations:"),
                        React.createElement(GitHubLoginButton, null)))) : (React.createElement("div", null,
                        React.createElement("p", { className: "text-danger" }, "GitHub integration is not configured."),
                        React.createElement("p", null, "To enable GitHub authentication:"),
                        React.createElement("ol", { className: "small" },
                            React.createElement("li", null, "Create a GitHub OAuth App at https://github.com/settings/developers"),
                            React.createElement("li", null,
                                "Set Authorization callback URL to:",
                                " ",
                                window.location.origin,
                                "/auth/github/callback"),
                            React.createElement("li", null, "Update the clientId in testeranto.config.ts"),
                            React.createElement("li", null, "Restart the development server"))))))))));
};
