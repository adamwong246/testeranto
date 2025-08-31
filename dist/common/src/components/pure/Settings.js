"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Settings = void 0;
const react_1 = __importStar(require("react"));
const react_bootstrap_1 = require("react-bootstrap");
const App_1 = require("../../App");
const Settings = () => {
    const [theme, setTheme] = (0, react_1.useState)('auto');
    const { tutorialMode, setTutorialMode } = (0, App_1.useTutorialMode)();
    (0, react_1.useEffect)(() => {
        // Load saved theme from localStorage
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            setTheme(savedTheme);
        }
    }, []);
    (0, react_1.useEffect)(() => {
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
    return (react_1.default.createElement("div", null,
        react_1.default.createElement(react_bootstrap_1.Form, null,
            react_1.default.createElement(react_bootstrap_1.Form.Group, { className: "mb-4" },
                react_1.default.createElement("div", null,
                    react_1.default.createElement(react_bootstrap_1.Form.Check, { type: "radio", id: "theme-light", name: "theme", value: "light", label: "Light mode", checked: theme === 'light', onChange: handleThemeChange }),
                    react_1.default.createElement(react_bootstrap_1.Form.Check, { type: "radio", id: "theme-dark", name: "theme", value: "dark", label: "Dark mode", checked: theme === 'dark', onChange: handleThemeChange }),
                    react_1.default.createElement(react_bootstrap_1.Form.Check, { type: "radio", id: "theme-auto", name: "theme", value: "auto", label: "Auto mode. Use system setting", checked: theme === 'auto', onChange: handleThemeChange }))),
            react_1.default.createElement(react_bootstrap_1.Form.Group, { className: "mb-4" },
                react_1.default.createElement(react_bootstrap_1.Form.Check, { type: "switch", id: "tutorial-mode", label: tutorialMode ? "Tutorial Mode: ON" : "Tutorial Mode: OFF", checked: tutorialMode, onChange: handleTutorialModeChange }),
                react_1.default.createElement(react_bootstrap_1.Form.Text, { className: "text-muted" }, "When enabled, helpful tooltips will appear throughout the app to guide you.")))));
};
exports.Settings = Settings;
