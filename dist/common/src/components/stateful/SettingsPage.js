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
exports.SettingsPage = void 0;
const react_1 = __importStar(require("react"));
const react_bootstrap_1 = require("react-bootstrap");
// import { AppFrame } from '../pure/AppFrame';
const SettingsPage = () => {
    const [theme, setTheme] = (0, react_1.useState)(localStorage.getItem('theme') || 'system');
    (0, react_1.useEffect)(() => {
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
    return (react_1.default.createElement(react_bootstrap_1.Container, null,
        react_1.default.createElement(react_bootstrap_1.Row, { className: "justify-content-center" },
            react_1.default.createElement(react_bootstrap_1.Col, { lg: 8 },
                react_1.default.createElement(react_bootstrap_1.Card, { className: "theme-card" },
                    react_1.default.createElement(react_bootstrap_1.Card.Body, null,
                        react_1.default.createElement(react_bootstrap_1.Form, null,
                            react_1.default.createElement(react_bootstrap_1.Form.Group, { className: "mb-4" },
                                react_1.default.createElement(react_bootstrap_1.Form.Label, { className: "h6 mb-3" }, "Theme"),
                                react_1.default.createElement("div", { className: "d-flex flex-wrap gap-3" },
                                    react_1.default.createElement(react_bootstrap_1.Form.Check, { type: "radio", name: "theme", id: "light-theme", label: "Light", value: "light", checked: theme === 'light', onChange: handleThemeChange, className: "theme-option" }),
                                    react_1.default.createElement(react_bootstrap_1.Form.Check, { type: "radio", name: "theme", id: "dark-theme", label: "Dark", value: "dark", checked: theme === 'dark', onChange: handleThemeChange, className: "theme-option" }),
                                    react_1.default.createElement(react_bootstrap_1.Form.Check, { type: "radio", name: "theme", id: "system-theme", label: "System", value: "system", checked: theme === 'system', onChange: handleThemeChange, className: "theme-option" }))))))))));
};
exports.SettingsPage = SettingsPage;
