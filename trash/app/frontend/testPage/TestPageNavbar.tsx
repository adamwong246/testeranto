import React from "react";
import { Button } from "react-bootstrap";
import { NavBar } from "../components/pure/NavBar";

export const TestPageNavbar = ({ decodedTestPath, projectName, runtime, setShowAiderModal, isWebSocketConnected }) => {
  return <NavBar
    title={decodedTestPath}
    backLink={`/projects/${projectName}`}
    navItems={[
      {
        label: "",
        badge: {
          variant:
            runtime === "node"
              ? "primary"
              : runtime === "web"
                ? "success"
                : runtime === "golang"
                  ? "warning"
                  : "info",
          text: runtime,
        },
        className: "pe-none d-flex align-items-center gap-2",
      },
    ]}
    rightContent={
      <Button
        variant="info"
        onClick={() => setShowAiderModal(true)}
        className="ms-2 position-relative"
        title={
          isWebSocketConnected
            ? "AI Assistant"
            : "AI Assistant (WebSocket not connected)"
        }
        disabled={!isWebSocketConnected}
      >
        🤖
        {!isWebSocketConnected && (
          <span
            className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"
            title="WebSocket disconnected"
          >
            <span className="visually-hidden">
              WebSocket disconnected
            </span>
          </span>
        )}
      </Button>
    }
  />;
}