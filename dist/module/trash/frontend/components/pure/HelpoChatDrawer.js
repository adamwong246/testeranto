import React, { useState, useEffect, useRef } from "react";
import { useWebSocket } from "../../useWebSocket";
export const HelpoChatDrawer = ({ isActive,
// onToggle,
 }) => {
    const { ws, isConnected, sendMessage } = useWebSocket();
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState("");
    const messagesEndRef = useRef(null);
    // Scroll to bottom whenever messages change
    useEffect(() => {
        var _a;
        (_a = messagesEndRef.current) === null || _a === void 0 ? void 0 : _a.scrollIntoView({ behavior: "smooth" });
    }, [messages]);
    // Handle incoming WebSocket messages and request initial chat history
    useEffect(() => {
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
    return (React.createElement("div", { className: `gradient-typed-bdd-dsl d-flex flex-column border-end ${isActive ? "active" : "inactive"}`, style: {
            width: isActive ? "380px" : "0px",
            transition: "width 0.3s ease",
            overflow: "hidden",
            flexShrink: 0,
            height: "100vh",
        } },
        React.createElement("div", { style: {
                width: "380px",
                height: "100%",
                display: "flex",
                flexDirection: "column",
            } },
            React.createElement("div", { style: {
                    flex: 1,
                    overflowY: "auto",
                    padding: "1rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                } },
                messages.length === 0 ? (React.createElement("div", { style: { textAlign: "center", color: "#666", marginTop: "2rem" } }, "Start a conversation with Helpo!")) : (messages.map((message, index) => (React.createElement("div", { key: index, style: {
                        textAlign: message.type === "user" ? "right" : "left",
                        marginBottom: "0.5rem",
                    } },
                    React.createElement("div", { style: {
                            display: "inline-block",
                            padding: "0.5rem 1rem",
                            borderRadius: "1rem",
                            backgroundColor: message.type === "user"
                                ? "rgba(0, 123, 255, 0.1)"
                                : "rgba(108, 117, 125, 0.1)",
                            maxWidth: "80%",
                            wordWrap: "break-word",
                        } },
                        React.createElement("strong", null,
                            message.type === "user" ? "You" : "Helpo",
                            ":"),
                        React.createElement("br", null),
                        message.content),
                    React.createElement("div", { style: {
                            fontSize: "0.75rem",
                            color: "#666",
                            marginTop: "0.25rem",
                        } }, new Date(message.timestamp).toLocaleTimeString()))))),
                React.createElement("div", { ref: messagesEndRef })),
            React.createElement("div", { style: {
                    padding: "1rem",
                    borderTop: "1px solid rgba(128, 128, 128, 0.3)",
                } },
                React.createElement("div", { className: "input-group" },
                    React.createElement("input", { type: "text", className: "form-control", placeholder: isConnected ? "Type your message..." : "Connecting...", value: inputMessage, onChange: (e) => setInputMessage(e.target.value), onKeyPress: handleKeyPress, disabled: !isConnected, style: {
                            backgroundColor: "rgba(255, 255, 255, 0.2)",
                            border: "1px solid rgba(128, 128, 128, 0.3)",
                            color: "#333",
                        } }),
                    React.createElement("button", { className: "btn btn-primary", type: "button", onClick: handleSendMessage, disabled: !inputMessage.trim() || !isConnected }, "Send")),
                !isConnected && (React.createElement("small", { className: "text-muted" }, "WebSocket disconnected. Chat unavailable."))))));
};
