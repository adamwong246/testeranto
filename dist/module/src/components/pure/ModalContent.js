import React from "react";
import { Modal } from "react-bootstrap";
import { ThemeCard } from "./ThemeCard";
import "../../App.scss";
export const ModalContent = ({ theme, handleThemeChange, }) => (React.createElement(React.Fragment, null,
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
                React.createElement(ThemeCard, { theme: theme, handleThemeChange: handleThemeChange, value: "system", title: "9 to 5", description: "Follows your OS theme", style: {
                        background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
                        borderColor: "#adb5bd",
                    } }),
                React.createElement(ThemeCard, { theme: theme, handleThemeChange: handleThemeChange, value: "light", title: "Business casual", description: "Clean & professional", style: {
                        background: "linear-gradient(135deg, #ffffff 0%, #f1f3f5 100%)",
                        borderColor: "#ced4da",
                        color: "#212529",
                        borderWidth: "2px",
                    } }),
                React.createElement(ThemeCard, { theme: theme, handleThemeChange: handleThemeChange, value: "dark", title: "Business formal", description: "Premium & focused", style: {
                        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
                        borderColor: "#4ecdc4",
                        color: "#f8f9fa",
                        borderWidth: "2px",
                    } }),
                React.createElement(ThemeCard, { theme: theme, handleThemeChange: handleThemeChange, value: "light-vibrant", title: "Office Party", description: "Colorful & fun", style: {
                        background: "linear-gradient(135deg, #ff2d75 0%, #00e5ff 100%)",
                        borderColor: "#ffeb3b",
                        color: "#fff",
                    } }),
                React.createElement(ThemeCard, { theme: theme, handleThemeChange: handleThemeChange, value: "dark-vibrant", title: "After Party", description: "Neon nightlife", style: {
                        background: "linear-gradient(135deg, #16213e 0%, #e94560 100%)",
                        borderColor: "#00e5ff",
                        color: "#fff",
                    } }),
                React.createElement(ThemeCard, { theme: theme, handleThemeChange: handleThemeChange, value: "sepia", title: "WFH", description: "Vintage warmth", style: {
                        background: "linear-gradient(135deg, #f4ecd8 0%, #d0b88f 100%)",
                        borderColor: "#8b6b4a",
                        color: "#3a3226",
                    } }),
                React.createElement(ThemeCard, { theme: theme, handleThemeChange: handleThemeChange, value: "light-grayscale", title: "Serious Business", description: "Simple & distraction-free", style: {
                        background: "linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)",
                        borderColor: "#666",
                        color: "#333",
                        borderWidth: "2px",
                    } }),
                React.createElement(ThemeCard, { theme: theme, handleThemeChange: handleThemeChange, value: "dark-grayscale", title: "Very Serious business", description: "Maximum readability", style: {
                        background: "linear-gradient(135deg, #111 0%, #333 100%)",
                        borderColor: "#ff6b6b",
                        color: "#e0e0e0",
                        borderWidth: "2px",
                    } }),
                React.createElement(ThemeCard, { theme: theme, handleThemeChange: handleThemeChange, value: "daily", title: "Dreaming of PTO", description: "Sunrise, sunset", style: {
                        background: "linear-gradient(135deg, #6eafff 0%, #f9fbf0 100%)",
                        borderColor: "#f7d62e",
                        color: "#00192d",
                    } }),
                React.createElement(ThemeCard, { theme: theme, handleThemeChange: handleThemeChange, value: "protanopia", title: "Protanopia", description: "Red-blind mode", style: {
                        background: "linear-gradient(135deg, #f8f9fa 0%, #e0e8ff 100%)",
                        borderColor: "#3366cc",
                        color: "#333",
                    } }),
                React.createElement(ThemeCard, { theme: theme, handleThemeChange: handleThemeChange, value: "deuteranopia", title: "Deuteranopia", description: "Green-blind mode", style: {
                        background: "linear-gradient(135deg, #f8f9fa 0%, #ffe0e0 100%)",
                        borderColor: "#cc6633",
                        color: "#333",
                    } }),
                React.createElement(ThemeCard, { theme: theme, handleThemeChange: handleThemeChange, value: "tritanopia", title: "Tritanopia", description: "Blue-blind mode", style: {
                        background: "linear-gradient(135deg, #f8f9fa 0%, #e0ffe0 100%)",
                        borderColor: "#00aa66",
                        color: "#333",
                    } }))))));
