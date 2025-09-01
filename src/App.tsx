/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, createContext, useContext } from "react";
import ReactDom from "react-dom/client";
import { HashRouter as Router, Routes, Route } from "react-router-dom";

import { TestPage } from "./components/stateful/TestPage";
import { ProjectPage } from "./components/stateful/ProjectPage";
import { ProjectsPage } from "./components/stateful/ProjectsPage";
import { AppFrame } from "./components/pure/AppFrame";
import { SignIn } from "./components/pure/SignIn";
import { FeaturesReporter } from "./components/stateful/FeaturesReporter";
import { DesignEditorPage } from "./components/DesignEditorPage";
import { TextEditorPage } from "./components/stateful/TextEditorPage";
import { ProcessManagerPage } from "./components/stateful/ProcessManagerPage";
import { SingleProcessPage } from "./components/stateful/SingleProcessPage";
import { Settings } from "./components/pure/Settings";
import { GitIntegrationPage } from "./components/stateful/GitIntegrationPage";
import { AuthCallbackPage } from "./components/stateful/AuthCallbackPage";
import { githubAuthService } from "./services/GitHubAuthService";
import { Helpo } from "./Helpo";

interface WebSocketContextType {
  ws: WebSocket | null;
  isConnected: boolean;
}

interface TutorialModeContextType {
  tutorialMode: boolean;
  setTutorialMode: (mode: boolean) => void;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: any;
  login: () => void;
  logout: () => void;
}

// Create a context for the WebSocket
const WebSocketContext = createContext<WebSocketContextType>({
  ws: null,
  isConnected: false,
});

// Create a context for tutorial mode
const TutorialModeContext = createContext<TutorialModeContextType>({
  tutorialMode: false,
  setTutorialMode: () => { },
});

// Create a context for authentication
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: () => { },
  logout: () => { },
});

export const useWebSocket = () => {
  return useContext(WebSocketContext);
};

export const useTutorialMode = () => {
  return useContext(TutorialModeContext);
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export const App = () => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [tutorialMode, setTutorialMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(
    githubAuthService.isAuthenticated
  );
  const [user, setUser] = useState(githubAuthService.userInfo);

  useEffect(() => {
    // Load tutorial mode from localStorage
    const savedTutorialMode = localStorage.getItem("tutorialMode");
    if (savedTutorialMode) {
      setTutorialMode(savedTutorialMode === "true");
    }

    // Listen for auth changes
    const handleAuthChange = (authenticated: boolean) => {
      setIsAuthenticated(authenticated);
      setUser(githubAuthService.userInfo);
    };

    githubAuthService.on("authChange", handleAuthChange);

    // Handle GitHub OAuth callback from popup
    const handleMessage = async (event: MessageEvent) => {
      if (event.data.type === "github-auth-callback") {
        const { code } = event.data;
        try {
          const success = await githubAuthService.handleCallback(code);
          if (success) {
            console.log("GitHub authentication successful");
          } else {
            console.error("GitHub authentication failed");
          }
        } catch (error) {
          console.error("Error handling GitHub callback:", error);
        }
      } else if (event.data.type === "github-auth-error") {
        console.error("GitHub authentication error:", event.data.error);
      }
    };

    window.addEventListener("message", handleMessage);

    const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${wsProtocol}//${window.location.host}`;
    const websocket = new WebSocket(wsUrl);

    websocket.onopen = () => {
      console.log("WebSocket connected");
      setWs(websocket);
      setIsConnected(true);
    };

    websocket.onclose = () => {
      console.log("WebSocket disconnected");
      setWs(null);
      setIsConnected(false);
    };

    websocket.onerror = (error) => {
      console.error("WebSocket error:", error);
      setIsConnected(false);
    };

    return () => {
      githubAuthService.off("authChange", handleAuthChange);
      window.removeEventListener("message", handleMessage);
      websocket.close();
    };
  }, []);

  const authContextValue = {
    isAuthenticated,
    user,
    login: () => githubAuthService.initiateLogin(),
    logout: () => githubAuthService.logout(),
  };

  return (
    <WebSocketContext.Provider value={{ ws, isConnected }}>
      <TutorialModeContext.Provider value={{ tutorialMode, setTutorialMode }}>
        <AuthContext.Provider value={authContextValue}>
          <Router>
            <AppFrame>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Helpo />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route
                  path="/projects/:projectName"
                  element={<ProjectPage />}
                />
                <Route
                  path="/projects/:projectName/tests/*"
                  element={<TestPage />}
                />
                <Route
                  path="/projects/:projectName#:tab"
                  element={<ProjectPage />}
                />
                <Route path="/signin" element={<SignIn />} />
                <Route
                  path="/auth/github/callback"
                  element={<AuthCallbackPage />}
                />

                {/* Protected routes - handle authentication within components */}
                <Route
                  path="/features-reporter"
                  element={isAuthenticated ? <FeaturesReporter /> : <SignIn />}
                />
                <Route
                  path="/design-editor"
                  element={isAuthenticated ? <DesignEditorPage /> : <SignIn />}
                />
                <Route
                  path="/text-editor"
                  element={isAuthenticated ? <TextEditorPage /> : <SignIn />}
                />
                {/* Conditionally render process-related routes only if WebSocket is connected */}
                {isConnected ? (
                  <>
                    <Route
                      path="/processes"
                      element={
                        isAuthenticated ? <ProcessManagerPage /> : <SignIn />
                      }
                    />
                    <Route
                      path="/processes/:processId"
                      element={
                        isAuthenticated ? <SingleProcessPage /> : <SignIn />
                      }
                    />
                  </>
                ) : null}
                <Route path="/settings" element={<Settings />} />
                <Route
                  path="/git"
                  element={
                    isAuthenticated ? <GitIntegrationPage /> : <SignIn />
                  }
                />

                {/* Catch all - redirect to help for logged out users */}
                <Route path="*" element={<Helpo />} />
              </Routes>
            </AppFrame>
          </Router>
        </AuthContext.Provider>
      </TutorialModeContext.Provider>
    </WebSocketContext.Provider>
  );
};

// Export App to global scope
function initApp() {
  const rootElement = document.getElementById("root");
  if (rootElement) {
    try {
      // Try to use React 18's createRoot if available
      if (ReactDom.createRoot) {
        const root = ReactDom.createRoot(rootElement);
        root.render(React.createElement(App));
      } else {
        // Fall back to React 17's render
        ReactDom.render(React.createElement(App), rootElement);
      }
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

// Export App to global scope
if (typeof window !== "undefined" && typeof document !== "undefined") {
  // @ts-ignore
  window.App = App;
  // @ts-ignore
  window.React = React;
  // @ts-ignore
  window.ReactDOM = ReactDom;

  // Initialize the app when the window is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initApp);
  } else {
    initApp();
  }
}
