import React from "react";
import { ToastContainer, Toast } from "react-bootstrap";
export const ToastNotification = ({ showToast, setShowToast, toastVariant, toastMessage }) => (React.createElement(ToastContainer, { position: "top-end", className: "p-3" },
    React.createElement(Toast, { show: showToast, onClose: () => setShowToast(false), delay: 3000, autohide: true, bg: toastVariant },
        React.createElement(Toast.Header, null,
            React.createElement("strong", { className: "me-auto" }, "Command Status")),
        React.createElement(Toast.Body, { className: "text-white" }, toastMessage))));
