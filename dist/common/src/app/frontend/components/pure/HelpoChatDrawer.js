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
exports.HelpoChatDrawer = void 0;
const react_1 = __importStar(require("react"));
const useWebSocket_1 = require("../../useWebSocket");
const HelpoChatDrawer = ({ isActive,
// onToggle,
 }) => {
    const { ws, isConnected, sendMessage } = (0, useWebSocket_1.useWebSocket)();
    const [messages, setMessages] = (0, react_1.useState)([]);
    const [inputMessage, setInputMessage] = (0, react_1.useState)("");
    const messagesEndRef = (0, react_1.useRef)(null);
    // Scroll to bottom whenever messages change
    (0, react_1.useEffect)(() => {
        var _a;
        (_a = messagesEndRef.current) === null || _a === void 0 ? void 0 : _a.scrollIntoView({ behavior: "smooth" });
    }, [messages]);
    // Handle incoming WebSocket messages and request initial chat history
    (0, react_1.useEffect)(() => {
        const handleWebSocketMessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.type === "chatMessage") {
                    // Add individual message to the current state
                    // This ensures the message is properly recorded in the server's history
                    setMessages((prev) => [...prev, data.message]);
                }
                else if (data.type === "chatHistory") {
                    // Replace the entire message list with the history from the server
                    setMessages(data.messages || []);
                }
            }
            catch (error) {
                console.error("Error parsing WebSocket message:", error);
            }
        };
        if (ws) {
            ws.addEventListener("message", handleWebSocketMessage);
            // Request the initial chat history when connected
            if (isConnected) {
                // Send a request for the chat history
                // You might need to implement a specific message type for this
                // For now, we'll use a generic message that the server can handle
                sendMessage({
                    type: "getChatHistory"
                });
            }
            return () => {
                ws.removeEventListener("message", handleWebSocketMessage);
            };
        }
    }, [ws, isConnected, sendMessage]);
    const handleSendMessage = () => {
        if (inputMessage.trim()) {
            // Add user message to local state immediately for better UX
            // This will be replaced when the server sends the actual message
            const tempUserMessage = {
                type: "user",
                content: inputMessage.trim(),
                timestamp: new Date().toISOString(),
            };
            setMessages((prev) => [...prev, tempUserMessage]);
            // Send message via WebSocket if connected
            if (isConnected) {
                try {
                    sendMessage({
                        type: "chatMessage",
                        content: inputMessage.trim(),
                    });
                }
                catch (error) {
                    console.error("Failed to send message:", error);
                }
            }
            else {
                console.log("WebSocket not connected - message not sent to server");
            }
            setInputMessage("");
        }
    };
    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };
    return (react_1.default.createElement("div", { className: `gradient-typed-bdd-dsl d-flex flex-column border-end ${isActive ? "active" : "inactive"}`, style: {
            width: isActive ? "380px" : "0px",
            transition: "width 0.3s ease",
            overflow: "hidden",
            flexShrink: 0,
            height: "100vh",
        } },
        react_1.default.createElement("div", { style: {
                width: "380px",
                height: "100%",
                display: "flex",
                flexDirection: "column",
            } },
            react_1.default.createElement("div", { style: {
                    flex: 1,
                    overflowY: "auto",
                    padding: "1rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                } },
                messages.length === 0 ? (react_1.default.createElement("div", { style: { textAlign: "center", color: "#666", marginTop: "2rem" } }, "Start a conversation with Helpo!")) : (messages.map((message, index) => (react_1.default.createElement("div", { key: index, style: {
                        textAlign: message.type === "user" ? "right" : "left",
                        marginBottom: "0.5rem",
                    } },
                    react_1.default.createElement("div", { style: {
                            display: "inline-block",
                            padding: "0.5rem 1rem",
                            borderRadius: "1rem",
                            backgroundColor: message.type === "user"
                                ? "rgba(0, 123, 255, 0.1)"
                                : "rgba(108, 117, 125, 0.1)",
                            maxWidth: "80%",
                            wordWrap: "break-word",
                        } },
                        react_1.default.createElement("strong", null,
                            message.type === "user" ? "You" : "Helpo",
                            ":"),
                        react_1.default.createElement("br", null),
                        message.content),
                    react_1.default.createElement("div", { style: {
                            fontSize: "0.75rem",
                            color: "#666",
                            marginTop: "0.25rem",
                        } }, new Date(message.timestamp).toLocaleTimeString()))))),
                react_1.default.createElement("div", { ref: messagesEndRef })),
            react_1.default.createElement("div", { style: {
                    padding: "1rem",
                    borderTop: "1px solid rgba(128, 128, 128, 0.3)",
                } },
                react_1.default.createElement("div", { className: "input-group" },
                    react_1.default.createElement("input", { type: "text", className: "form-control", placeholder: isConnected ? "Type your message..." : "Connecting...", value: inputMessage, onChange: (e) => setInputMessage(e.target.value), onKeyPress: handleKeyPress, disabled: !isConnected, style: {
                            backgroundColor: "rgba(255, 255, 255, 0.2)",
                            border: "1px solid rgba(128, 128, 128, 0.3)",
                            color: "#333",
                        } }),
                    react_1.default.createElement("button", { className: "btn btn-primary", type: "button", onClick: handleSendMessage, disabled: !inputMessage.trim() || !isConnected }, "Send")),
                !isConnected && (react_1.default.createElement("small", { className: "text-muted" }, "WebSocket disconnected. Chat unavailable."))))));
};
exports.HelpoChatDrawer = HelpoChatDrawer;
