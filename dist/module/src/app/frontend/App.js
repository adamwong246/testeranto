/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useState, useEffect, createContext } from "react";
import { Routes, Route, HashRouter } from "react-router-dom";
import ReactDOM from "react-dom/client";
import { Helpo } from "../../Helpo";
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
const TutorialModeContext = createContext({
    tutorialMode: false,
    setTutorialMode: () => { },
});
export const useTutorialMode = () => {
    return useContext(TutorialModeContext);
};
const AuthContext = createContext({
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
    const [ws, setWs] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [tutorialMode, setTutorialMode] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(githubAuthService.isAuthenticated);
    const [user, setUser] = useState(githubAuthService.userInfo);
    useEffect(() => {
        const savedTutorialMode = localStorage.getItem("tutorialMode");
        if (savedTutorialMode) {
            setTutorialMode(savedTutorialMode === "true");
        }
        const handleAuthChange = (authenticated) => {
            setIsAuthenticated(authenticated);
            setUser(githubAuthService.userInfo);
        };
        githubAuthService.on("authChange", handleAuthChange);
        // Handle GitHub OAuth callback from popup
        const handleMessage = async (event) => {
            if (event.data.type === "github-auth-callback") {
                const { code } = event.data;
                try {
                    const success = await githubAuthService.handleCallback(code);
                    if (success) {
                        console.log("GitHub authentication successful");
                    }
                    else {
                        console.error("GitHub authentication failed");
                    }
                }
                catch (error) {
                    console.error("Error handling GitHub callback:", error);
                }
            }
            else if (event.data.type === "github-auth-error") {
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
    return (React.createElement(FileServiceContext.Provider, { value: fs },
        React.createElement(TutorialModeContext.Provider, { value: { tutorialMode, setTutorialMode } },
            React.createElement(AuthContext.Provider, { value: authContextValue },
                React.createElement(HashRouter, null,
                    React.createElement(AppFrame, null,
                        React.createElement(Routes, null,
                            React.createElement(Route, { path: "/", element: React.createElement(Helpo, null) }),
                            React.createElement(Route, { path: "/flua", element: React.createElement(FluaPage, null) }),
                            React.createElement(Route, { path: "/projects", element: React.createElement(ProjectsPage, null) }),
                            React.createElement(Route, { path: "/projects/:projectName", element: React.createElement(ProjectPage, null) }),
                            React.createElement(Route, { path: "/projects/:projectName/tests/*", element: React.createElement(TestPage, null) }),
                            React.createElement(Route, { path: "/projects/:projectName#:tab", element: React.createElement(ProjectPage, null) }),
                            React.createElement(Route, { path: "/signin", element: React.createElement(SignIn, null) }),
                            React.createElement(Route, { path: "/auth/github/callback", element: React.createElement(AuthCallbackPage, null) }),
                            React.createElement(Route, { path: "/design-editor", element: isAuthenticated ? React.createElement(DesignEditorPage, null) : React.createElement(SignIn, null) }),
                            React.createElement(Route, { path: "/text-editor", element: isAuthenticated ? React.createElement(TextEditorPage, null) : React.createElement(SignIn, null) }),
                            isConnected ? (React.createElement(React.Fragment, null,
                                React.createElement(Route, { path: "/processes", element: isAuthenticated ? React.createElement(ProcessManagerPage, null) : React.createElement(SignIn, null) }),
                                React.createElement(Route, { path: "/processes/:processId", element: React.createElement("p", null, "IDK") }))) : null,
                            React.createElement(Route, { path: "/settings", element: React.createElement(Settings, null) }),
                            React.createElement(Route, { path: "/git", element: isAuthenticated ? React.createElement(GitIntegrationPage, null) : React.createElement(SignIn, null) }),
                            React.createElement(Route, { path: "*", element: React.createElement(Helpo, null) }))))))));
};
// Export App to global scope
function initApp() {
    const rootElement = document.getElementById("root");
    if (rootElement) {
        try {
            // Use React 18's createRoot
            const root = ReactDOM.createRoot(rootElement);
            root.render(React.createElement(App));
        }
        catch (err) {
            console.error("Error rendering app:", err);
            // Retry if React isn't loaded yet
            setTimeout(initApp, 100);
        }
    }
    else {
        // Retry if root element isn't available yet
        setTimeout(initApp, 100);
    }
}
// Initialize the app when the window is ready
if (typeof window !== "undefined" && typeof document !== "undefined") {
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initApp);
    }
    else {
        initApp();
    }
}
