/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, createContext, useContext } from 'react';
import ReactDom from "react-dom/client";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { TestPage } from './components/stateful/TestPage';
import { ProjectPage } from './components/stateful/ProjectPage';
import { ProjectsPage } from './components/stateful/ProjectsPage';
import { AppFrame } from './components/pure/AppFrame';
import { SignIn } from './components/pure/SignIn';
import { FeaturesReporter } from './components/stateful/FeaturesReporter';
import { DesignEditorPage } from './components/DesignEditorPage';
import { TextEditorPage } from './components/stateful/TextEditorPage';
import { ProcessManagerPage } from './components/stateful/ProcessManagerPage';
import { SingleProcessPage } from './components/stateful/SingleProcessPage';
import { Settings } from './components/pure/Settings';
import { GitIntegrationPage } from './components/stateful/GitIntegrationPage';
import { AuthCallbackPage } from './components/stateful/AuthCallbackPage';
import { githubAuthService } from './services/GitHubAuthService';
import { SVGEditorPage } from './components/stateful/SVGEditorPage';
import { DratoPage } from './components/stateful/DratoPage';
import { GrafeoPage } from './components/stateful/GrafeoPage';
import { SkriboPage } from './components/stateful/SkriboPage';
import { Helpo } from './Helpo';
import { FluaPage } from './flua/FluaPage';
// Create a context for the WebSocket
const WebSocketContext = createContext({
    ws: null,
    isConnected: false,
});
// Create a context for tutorial mode
const TutorialModeContext = createContext({
    tutorialMode: false,
    setTutorialMode: () => { },
});
// Create a context for authentication
const AuthContext = createContext({
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
    const [ws, setWs] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [tutorialMode, setTutorialMode] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(githubAuthService.isAuthenticated);
    const [user, setUser] = useState(githubAuthService.userInfo);
    useEffect(() => {
        // Load tutorial mode from localStorage
        const savedTutorialMode = localStorage.getItem("tutorialMode");
        if (savedTutorialMode) {
            setTutorialMode(savedTutorialMode === "true");
        }
        // Listen for auth changes
        const handleAuthChange = (authenticated) => {
            setIsAuthenticated(authenticated);
            setUser(githubAuthService.userInfo);
        };
        githubAuthService.on('authChange', handleAuthChange);
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
        window.addEventListener('message', handleMessage);
        const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
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
    // Add sendMessage function
    const sendMessage = (message) => {
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(message));
        }
        else {
            console.error('WebSocket is not connected');
        }
    };
    const authContextValue = {
        isAuthenticated,
        user,
        login: () => githubAuthService.initiateLogin(),
        logout: () => githubAuthService.logout(),
    };
    return (React.createElement(WebSocketContext.Provider, { value: { ws, isConnected, sendMessage } },
        React.createElement(TutorialModeContext.Provider, { value: { tutorialMode, setTutorialMode } },
            React.createElement(AuthContext.Provider, { value: authContextValue },
                React.createElement(Router, null,
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
                            React.createElement(Route, { path: "/features-reporter", element: isAuthenticated ? React.createElement(FeaturesReporter, null) : React.createElement(SignIn, null) }),
                            React.createElement(Route, { path: "/design-editor", element: isAuthenticated ? React.createElement(DesignEditorPage, null) : React.createElement(SignIn, null) }),
                            React.createElement(Route, { path: "/text-editor", element: isAuthenticated ? React.createElement(TextEditorPage, null) : React.createElement(SignIn, null) }),
                            isConnected ? (React.createElement(React.Fragment, null,
                                React.createElement(Route, { path: "/processes", element: isAuthenticated ? React.createElement(ProcessManagerPage, null) : React.createElement(SignIn, null) }),
                                React.createElement(Route, { path: "/processes/:processId", element: isAuthenticated ? React.createElement(SingleProcessPage, null) : React.createElement(SignIn, null) }))) : null,
                            React.createElement(Route, { path: "/settings", element: React.createElement(Settings, null) }),
                            React.createElement(Route, { path: "/git", element: isAuthenticated ? React.createElement(GitIntegrationPage, null) : React.createElement(SignIn, null) }),
                            React.createElement(Route, { path: "/svg-editor", element: isAuthenticated ? React.createElement(SVGEditorPage, null) : React.createElement(SignIn, null) }),
                            React.createElement(Route, { path: "/drato", element: isAuthenticated ? React.createElement(DratoPage, null) : React.createElement(SignIn, null) }),
                            React.createElement(Route, { path: "/grafeo", element: isAuthenticated ? React.createElement(GrafeoPage, null) : React.createElement(SignIn, null) }),
                            React.createElement(Route, { path: "/skribo", element: isAuthenticated ? React.createElement(SkriboPage, null) : React.createElement(SignIn, null) }),
                            React.createElement(Route, { path: "*", element: React.createElement(Helpo, null) }))))))));
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
            }
            else {
                // Fall back to React 17's render
                ReactDom.render(React.createElement(App), rootElement);
            }
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
    }
    else {
        initApp();
    }
}
