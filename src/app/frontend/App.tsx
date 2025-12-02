/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useContext, createContext } from "react";
import { Routes, Route, HashRouter } from "react-router-dom";
import ReactDOM from "react-dom/client";

import { AppFrame } from "./components/pure/AppFrame";
import { ProjectPage } from "./components/stateful/ProjectPage";
import { ProjectsPage } from "./components/stateful/ProjectsPage";
import { TestPage } from "./testPage/TestPage";

export const App = () => {

  return (
    <HashRouter>
      <AppFrame>
        <Routes>
          {/* <Route path="/" element={<Landin />} /> */}
          {/* <Route path="/flua" element={<FluaPage />} /> */}

          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:projectName" element={<ProjectPage />} />
          <Route path="/projects/:projectName/tests/*" element={<TestPage />} />
          <Route path="/projects/:projectName#:tab" element={<ProjectPage />} />
          {/* <Route path="/signin" element={<SignIn />} />
            <Route
              path="/auth/github/callback"
              element={<AuthCallbackPage />}
            />
            <Route
              path="/design-editor"
              element={isAuthenticated ? <DesignEditorPage /> : <SignIn />}
            />
            <Route
              path="/text-editor"
              element={isAuthenticated ? <TextEditorPage /> : <SignIn />}
            />
            {isConnected ? (
              <>
                <Route
                  path="/processes"
                  element={
                    isAuthenticated ? <ProcessManagerPage /> : <SignIn />
                  }
                />
                <Route path="/processes/:processId" element={<p>IDK</p>} />
              </>
            ) : null}
            <Route path="/settings" element={<Settings />} />
            <Route
              path="/git"
              element={
                isAuthenticated ? <GitIntegrationPage /> : <SignIn />
              }
            /> */}
          {/* <Route path="/svg-editor" element={isAuthenticated ? <SVGEditorPage /> : <SignIn />} /> */}
          {/* <Route path="/drato" element={isAuthenticated ? <DratoPage /> : <SignIn />} /> */}
          {/* <Route path="/grafeo" element={isAuthenticated ? <GrafeoPage /> : <SignIn />} /> */}
          {/* <Route path="/skribo" element={isAuthenticated ? <SkriboPage /> : <SignIn />} /> */}
          {/* <Route path="*" element={<Helpo />} /> */}
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
