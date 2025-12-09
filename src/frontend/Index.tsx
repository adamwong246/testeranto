/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom/client";
import {
  Container,
  Row,
  Col,
  Card,
  ListGroup,
  Badge,
  Button,
  Form,
  Alert,
  Spinner,
  Tab,
  Tabs,
  InputGroup,
  FormControl,
} from "react-bootstrap";

import "../style.scss";

interface Process {
  processId: string;
  command: string;
  pid?: number;
  timestamp: string;
  status?: string;
}

interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
  source?: string;
}

export const Index = () => {
  return (
    <Container fluid className="mt-3">
      hello index
    </Container>
  );
};

// Export App to global scope
function initApp() {
  const rootElement = document.getElementById("root");
  if (rootElement) {
    try {
      const root = ReactDOM.createRoot(rootElement);
      root.render(React.createElement(Index));
    } catch (err) {
      console.error("Error rendering app:", err);
      setTimeout(initApp, 100);
    }
  } else {
    setTimeout(initApp, 100);
  }
}

if (typeof window !== "undefined" && typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initApp);
  } else {
    initApp();
  }
}
