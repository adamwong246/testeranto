import React from "react";
import { Modal, Button } from "react-bootstrap";
export const MagicRobotModal = ({ customMessage, isWebSocketConnected, messageOption, navigate, projectName, runtime, setCustomMessage, setMessageOption, setShowAiderModal, setShowToast, setToastMessage, setToastVariant, showAiderModal, testName, ws, }) => (React.createElement(Modal, { show: showAiderModal, onHide: () => setShowAiderModal(false), size: "lg", onShow: () => setMessageOption("default") },
    React.createElement(Modal.Header, { closeButton: true },
        React.createElement(Modal.Title, null, "Aider")),
    React.createElement(Modal.Body, null,
        React.createElement("div", { className: "mb-3" },
            React.createElement("div", { className: "form-check" },
                React.createElement("input", { className: "form-check-input", type: "radio", name: "messageOption", id: "defaultMessage", value: "default", checked: messageOption === "default", onChange: () => setMessageOption("default") }),
                React.createElement("label", { className: "form-check-label", htmlFor: "defaultMessage" }, "Use default message.txt")),
            React.createElement("div", { className: "form-check" },
                React.createElement("input", { className: "form-check-input", type: "radio", name: "messageOption", id: "customMessage", value: "custom", checked: messageOption === "custom", onChange: () => setMessageOption("custom") }),
                React.createElement("label", { className: "form-check-label", htmlFor: "customMessage" }, "Use custom message")),
            messageOption === "custom" && (React.createElement("div", { className: "mt-2" },
                React.createElement("textarea", { className: "form-control", rows: 8, placeholder: "Enter your custom message", value: customMessage, onChange: (e) => setCustomMessage(e.target.value), style: { minHeight: "500px" } }))))),
    React.createElement(Modal.Footer, null,
        React.createElement(Button, { variant: "primary", onClick: async () => {
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
