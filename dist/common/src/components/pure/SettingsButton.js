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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsButton = void 0;
const react_1 = __importStar(require("react"));
const react_bootstrap_1 = require("react-bootstrap");
const ModalContent_1 = require("./ModalContent");
const SunriseAnimation_1 = __importDefault(require("../SunriseAnimation"));
const SettingsButton = ({ className }) => {
    (0, react_1.useEffect)(() => {
        return () => {
            // Cleanup if needed
        };
    }, []);
    const [showModal, setShowModal] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        let themeToApply = theme;
        if (theme === 'system') {
            themeToApply = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
        }
        document.documentElement.setAttribute('data-bs-theme', themeToApply);
    }, []);
    const [theme, setTheme] = (0, react_1.useState)(localStorage.getItem('theme') || 'system');
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
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement("div", { id: "settings-button" },
            react_1.default.createElement("button", { className: `btn btn-sm btn-outline-secondary ${className}`, onClick: () => setShowModal(true) },
                react_1.default.createElement("div", { id: "gear-icon-settings" }, "\u2699\uFE0F"))),
        react_1.default.createElement(SunriseAnimation_1.default, { active: theme === 'daily' }),
        react_1.default.createElement(react_bootstrap_1.Modal, { show: showModal, onHide: () => setShowModal(false), size: "lg" },
            react_1.default.createElement(ModalContent_1.ModalContent, { theme: theme, handleThemeChange: handleThemeChange }),
            react_1.default.createElement(react_bootstrap_1.Modal.Footer, { className: "border-0" },
                react_1.default.createElement(react_bootstrap_1.Button, { variant: "btn-primary", onClick: () => setShowModal(false) }, "Done")))));
};
exports.SettingsButton = SettingsButton;
