import React from "react";
export const ThemeCard = ({ theme, handleThemeChange, value, title, description, style, }) => (React.createElement("div", { className: "col-md-4" },
    React.createElement("div", { className: `card theme-card ${theme === value ? "border-primary" : ""}`, onClick: () => handleThemeChange({
            target: { value },
        }), style: style },
        React.createElement("div", { className: "card-body text-center p-3" },
            React.createElement("h5", { className: "card-title mb-1" }, title),
            React.createElement("p", { className: "small text-muted mb-0" }, description)))));
