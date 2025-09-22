import React, { useState, useEffect, useRef } from "react";

import { useWebSocket } from "../../useWebSocket";

interface ChatMessage {
  type: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface HelpoChatDrawerProps {
  isActive: boolean;
  onToggle: () => void;
}

export const HelpoChatDrawer: React.FC<HelpoChatDrawerProps> = ({
  isActive,
  // onToggle,
}) => {
  const { ws, isConnected, sendMessage } = useWebSocket();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle incoming WebSocket messages and request initial chat history
  useEffect(() => {
    const handleWebSocketMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "chatMessage") {
          // Add individual message to the current state
          // This ensures the message is properly recorded in the server's history
          setMessages((prev) => [...prev, data.message]);
        } else if (data.type === "chatHistory") {
          // Replace the entire message list with the history from the server
          setMessages(data.messages || []);
        }
      } catch (error) {
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
      const tempUserMessage: ChatMessage = {
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
        } catch (error) {
          console.error("Failed to send message:", error);
        }
      } else {
        console.log("WebSocket not connected - message not sent to server");
      }

      setInputMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div
      className={`gradient-typed-bdd-dsl d-flex flex-column border-end ${isActive ? "active" : "inactive"
        }`}
      style={{
        width: isActive ? "380px" : "0px",
        transition: "width 0.3s ease",
        overflow: "hidden",
        flexShrink: 0,
        height: "100vh",
      }}
    >
      <div
        style={{
          width: "380px",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Chat messages */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "1rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          {messages.length === 0 ? (
            <div
              style={{ textAlign: "center", color: "#666", marginTop: "2rem" }}
            >
              Start a conversation with Helpo!
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                style={{
                  textAlign: message.type === "user" ? "right" : "left",
                  marginBottom: "0.5rem",
                }}
              >
                <div
                  style={{
                    display: "inline-block",
                    padding: "0.5rem 1rem",
                    borderRadius: "1rem",
                    backgroundColor:
                      message.type === "user"
                        ? "rgba(0, 123, 255, 0.1)"
                        : "rgba(108, 117, 125, 0.1)",
                    maxWidth: "80%",
                    wordWrap: "break-word",
                  }}
                >
                  <strong>{message.type === "user" ? "You" : "Helpo"}:</strong>
                  <br />
                  {message.content}
                </div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "#666",
                    marginTop: "0.25rem",
                  }}
                >
                  {new Date(message.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div
          style={{
            padding: "1rem",
            borderTop: "1px solid rgba(128, 128, 128, 0.3)",
          }}
        >
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder={
                isConnected ? "Type your message..." : "Connecting..."
              }
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={!isConnected}
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                border: "1px solid rgba(128, 128, 128, 0.3)",
                color: "#333",
              }}
            />
            <button
              className="btn btn-primary"
              type="button"
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || !isConnected}
            >
              Send
            </button>
          </div>
          {!isConnected && (
            <small className="text-muted">
              WebSocket disconnected. Chat unavailable.
            </small>
          )}
        </div>
      </div>
    </div>
  );
};
