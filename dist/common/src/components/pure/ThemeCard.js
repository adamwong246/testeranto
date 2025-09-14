"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThemeCard = void 0;
const react_1 = __importDefault(require("react"));
const ThemeCard = ({ theme, handleThemeChange, value, title, description, style, }) => (react_1.default.createElement("div", { className: "col-md-4" },
    react_1.default.createElement("div", { className: `card theme-card ${theme === value ? "border-primary" : ""}`, onClick: () => handleThemeChange({
            target: { value },
        }), style: style },
        react_1.default.createElement("div", { className: "card-body text-center p-3" },
            react_1.default.createElement("h5", { className: "card-title mb-1" }, title),
            react_1.default.createElement("p", { className: "small text-muted mb-0" }, description)))));
exports.ThemeCard = ThemeCard;
