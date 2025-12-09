/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState } from "react";
import { Routes, HashRouter } from "react-router-dom";
import ReactDOM from "react-dom/client";
import { AppFrame } from "./AppFrame";

export const App = () => {

  const [ws, setWs] = useState<WebSocket | null>(null);



  return (

    <HashRouter>
      <AppFrame>
        <Routes>


        </Routes>
      </AppFrame>
    </HashRouter>

  );
};

// Export App to global scope
function initApp() {
  const rootElement = document.getElementById("root");
  if (rootElement) {
    try {
      // Use React 18's createRoot
      const root = ReactDOM.createRoot(rootElement);
      root.render(React.createElement(App));
    } catch (err) {
      console.error("Error rendering app:", err);
      // Retry if React isn't loaded yet
      setTimeout(initApp, 100);
    }
  } else {
    // Retry if root element isn't available yet
    setTimeout(initApp, 100);
  }
}

// Initialize the app when the window is ready
if (typeof window !== "undefined" && typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initApp);
  } else {
    initApp();
  }
}
