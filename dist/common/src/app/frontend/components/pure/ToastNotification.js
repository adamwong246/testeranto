"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToastNotification = void 0;
const react_1 = __importDefault(require("react"));
const react_bootstrap_1 = require("react-bootstrap");
const ToastNotification = ({ showToast, setShowToast, toastVariant, toastMessage }) => (react_1.default.createElement(react_bootstrap_1.ToastContainer, { position: "top-end", className: "p-3" },
    react_1.default.createElement(react_bootstrap_1.Toast, { show: showToast, onClose: () => setShowToast(false), delay: 3000, autohide: true, bg: toastVariant },
        react_1.default.createElement(react_bootstrap_1.Toast.Header, null,
            react_1.default.createElement("strong", { className: "me-auto" }, "Command Status")),
        react_1.default.createElement(react_bootstrap_1.Toast.Body, { className: "text-white" }, toastMessage))));
exports.ToastNotification = ToastNotification;
