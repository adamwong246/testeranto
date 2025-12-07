/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useContext, useState, useEffect, createContext } from "react";
import { Routes, Route, HashRouter } from "react-router-dom";
import ReactDOM from "react-dom/client";

import { AppFrame } from "./components/pure/AppFrame";
import { SignIn } from "./components/pure/SignIn";
import { githubAuthService } from "./GitHubAuthService";
import { AuthCallbackPage } from "./components/stateful/AuthCallbackPage";
import { ProjectPage } from "./components/stateful/ProjectPage";
import { ProjectsPage } from "./components/stateful/ProjectsPage";
import { FluaPage } from "./flua/FluaPage";
import { TestPage } from "./testPage/TestPage";
import { DesignEditorPage } from "./components/DesignEditorPage";
import { TextEditorPage } from "./components/stateful/TextEditorPage";
import { ProcessManagerPage } from "./components/stateful/ProcessManagerPage";
import { Settings } from "./components/pure/Settings";
import { GitIntegrationPage } from "./components/stateful/GitIntegrationPage";
// import { FileServiceContext } from "./useFileService";
import { useFs } from "./useFs";
import { FileService } from "../FileService";

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

const TutorialModeContext = createContext<TutorialModeContextType>({
  tutorialMode: false,
  setTutorialMode: () => { },
});

export const useTutorialMode = () => {
  return useContext(TutorialModeContext);
};

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: () => { },
  logout: () => { },
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const App = () => {
  const [fs, setFs] = useFs();
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [tutorialMode, setTutorialMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(
    githubAuthService.isAuthenticated
  );
  const [user, setUser] = useState(githubAuthService.userInfo);

  useEffect(() => {
    const savedTutorialMode = localStorage.getItem("tutorialMode");
    if (savedTutorialMode) {
      setTutorialMode(savedTutorialMode === "true");
    }

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
      setIsConnected(true);
      setWs(websocket);
      fs.setSocket(websocket);
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

  // let fs: FileService;

  // if (ws) {
  //   fs = useFs(ws);
  // } else {
  //   return <p>loading</p>
  // }


  return (

    <TutorialModeContext.Provider value={{ tutorialMode, setTutorialMode }}>
      <AuthContext.Provider value={authContextValue}>
        <HashRouter>
          <AppFrame>
            <Routes>

              <Route path="/flua" element={<FluaPage />} />

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
              />
              {/* <Route path="/svg-editor" element={isAuthenticated ? <SVGEditorPage /> : <SignIn />} /> */}
              {/* <Route path="/drato" element={isAuthenticated ? <DratoPage /> : <SignIn />} /> */}
              {/* <Route path="/grafeo" element={isAuthenticated ? <GrafeoPage /> : <SignIn />} /> */}
              {/* <Route path="/skribo" element={isAuthenticated ? <SkriboPage /> : <SignIn />} /> */}

            </Routes>
          </AppFrame>
        </HashRouter>
      </AuthContext.Provider>
    </TutorialModeContext.Provider>

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
