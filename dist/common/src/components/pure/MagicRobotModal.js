"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MagicRobotModal = void 0;
const react_1 = __importDefault(require("react"));
const react_bootstrap_1 = require("react-bootstrap");
const MagicRobotModal = ({ customMessage, isWebSocketConnected, messageOption, navigate, projectName, runtime, setCustomMessage, setMessageOption, setShowAiderModal, setShowToast, setToastMessage, setToastVariant, showAiderModal, testName, ws, }) => (react_1.default.createElement(react_bootstrap_1.Modal, { show: showAiderModal, onHide: () => setShowAiderModal(false), size: "lg", onShow: () => setMessageOption("default") },
    react_1.default.createElement(react_bootstrap_1.Modal.Header, { closeButton: true },
        react_1.default.createElement(react_bootstrap_1.Modal.Title, null, "Aider")),
    react_1.default.createElement(react_bootstrap_1.Modal.Body, null,
        react_1.default.createElement("div", { className: "mb-3" },
            react_1.default.createElement("div", { className: "form-check" },
                react_1.default.createElement("input", { className: "form-check-input", type: "radio", name: "messageOption", id: "defaultMessage", value: "default", checked: messageOption === "default", onChange: () => setMessageOption("default") }),
                react_1.default.createElement("label", { className: "form-check-label", htmlFor: "defaultMessage" }, "Use default message.txt")),
            react_1.default.createElement("div", { className: "form-check" },
                react_1.default.createElement("input", { className: "form-check-input", type: "radio", name: "messageOption", id: "customMessage", value: "custom", checked: messageOption === "custom", onChange: () => setMessageOption("custom") }),
                react_1.default.createElement("label", { className: "form-check-label", htmlFor: "customMessage" }, "Use custom message")),
            messageOption === "custom" && (react_1.default.createElement("div", { className: "mt-2" },
                react_1.default.createElement("textarea", { className: "form-control", rows: 8, placeholder: "Enter your custom message", value: customMessage, onChange: (e) => setCustomMessage(e.target.value), style: { minHeight: "500px" } }))))),
    react_1.default.createElement(react_bootstrap_1.Modal.Footer, null,
        react_1.default.createElement(react_bootstrap_1.Button, { variant: "primary", onClick: async () => {
                try {
                    const promptPath = `testeranto/reports/${projectName}/${testName
                        .split(".")
                        .slice(0, -1)
                        .join(".")}/${runtime}/prompt.txt`;
                    let command = `aider --load ${promptPath}`;
                    if (messageOption === "default") {
                        const messagePath = `testeranto/reports/${projectName}/${testName
                            .split(".")
                            .slice(0, -1)
                            .join(".")}/${runtime}/message.txt`;
                        command += ` --message-file ${messagePath}`;
                    }
                    else {
                        command += ` --message "${customMessage}"`;
                    }
                    // Send command to server via the centralized WebSocket
                    if (isWebSocketConnected && ws) {
                        ws.send(JSON.stringify({
                            type: "executeCommand",
                            command: command,
                        }));
                        setToastMessage("Command sent to server");
                        setToastVariant("success");
                        setShowToast(true);
                        setShowAiderModal(false);
                        // Navigate to process manager page
                        setTimeout(() => {
                            navigate("/processes");
                        }, 1000);
                    }
                    else {
                        setToastMessage("WebSocket connection not ready");
                        setToastVariant("danger");
                        setShowToast(true);
                    }
                }
                catch (err) {
                    console.error("WebSocket error:", err);
                    setToastMessage("Error preparing command");
                    setToastVariant("danger");
                    setShowToast(true);
                }
            } }, "Run Aider Command"))));
exports.MagicRobotModal = MagicRobotModal;
