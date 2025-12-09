/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import {
  Container,
} from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { useWebSocket } from "../app/frontend/useWebSocket";

type AppFrameProps = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  "data-testid"?: string;
  title?: string;
  rightContent?: React.ReactNode;
};

export const AppFrame = ({ children, title, rightContent }: AppFrameProps) => {
  const location = useLocation();
  const { isConnected } = useWebSocket();
  return (
    <div className="d-flex min-vh-100">

      <div
        className="d-flex flex-column"
        style={{
          minHeight: "100vh",
          minWidth: "0", // Allows the content to shrink below its initial size
          flex: "1 1 auto", // Take up remaining space
          overflow: "auto", // Enable scrolling
        }}
      >
        <main
          className="flex-grow-1 p-1"
          style={{
            minWidth: "fit-content",
            width: "100%",
          }}
        >
          <Container
            fluid
            style={{
              height: "100%",
              minWidth: "fit-content",
              padding: "0.125rem",
            }}
          >
            {children}
          </Container>
        </main>
      </div>
    </div>
  );
};
