"use strict";
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = exports.useAuth = exports.useTutorialMode = exports.useWebSocket = void 0;
const react_1 = __importStar(require("react"));
const react_router_dom_1 = require("react-router-dom");
const client_1 = __importDefault(require("react-dom/client"));
const Helpo_1 = require("../../Helpo");
const AppFrame_1 = require("./components/pure/AppFrame");
const SignIn_1 = require("./components/pure/SignIn");
const GitHubAuthService_1 = require("./GitHubAuthService");
const AuthCallbackPage_1 = require("./components/stateful/AuthCallbackPage");
const ProjectPage_1 = require("./components/stateful/ProjectPage");
const ProjectsPage_1 = require("./components/stateful/ProjectsPage");
const FluaPage_1 = require("./flua/FluaPage");
const TestPage_1 = require("./testPage/TestPage");
const DesignEditorPage_1 = require("./components/DesignEditorPage");
// import { FeaturesReporter } from "./components/stateful/FeaturesReporter";
const TextEditorPage_1 = require("./components/stateful/TextEditorPage");
const ProcessManagerPage_1 = require("./components/stateful/ProcessManagerPage");
const Settings_1 = require("./components/pure/Settings");
const GitIntegrationPage_1 = require("./components/stateful/GitIntegrationPage");
const DevelopmentFileService_1 = require("./DevelopmentFileService");
const FileServiceContext_1 = require("./FileServiceContext");
// Create a context for the WebSocket
const WebSocketContext = (0, react_1.createContext)({
    ws: null,
    isConnected: false,
    sendMessage: function (message) {
        throw new Error("Function not implemented.");
    }
});
// Create a context for tutorial mode
const TutorialModeContext = (0, react_1.createContext)({
    tutorialMode: false,
    setTutorialMode: () => { },
});
// Create a context for authentication
const AuthContext = (0, react_1.createContext)({
    isAuthenticated: false,
    user: null,
    login: () => { },
    logout: () => { },
});
// const FileServiceContext = createContext<any>(new DevelopmentFileService());
const useWebSocket = () => {
    return (0, react_1.useContext)(WebSocketContext);
};
exports.useWebSocket = useWebSocket;
const useTutorialMode = () => {
    return (0, react_1.useContext)(TutorialModeContext);
};
exports.useTutorialMode = useTutorialMode;
const useAuth = () => {
    return (0, react_1.useContext)(AuthContext);
};
exports.useAuth = useAuth;
const App = () => {
    const [ws, setWs] = (0, react_1.useState)(null);
    const [isConnected, setIsConnected] = (0, react_1.useState)(false);
    const [tutorialMode, setTutorialMode] = (0, react_1.useState)(false);
    const [isAuthenticated, setIsAuthenticated] = (0, react_1.useState)(GitHubAuthService_1.githubAuthService.isAuthenticated);
    const [user, setUser] = (0, react_1.useState)(GitHubAuthService_1.githubAuthService.userInfo);
    const [fileService] = (0, react_1.useState)(() => {
        // Create DevelopmentFileService instance
        // Note: In a real implementation, we might need to handle WebSocket connection differently
        // For now, we'll create a basic instance
        return new DevelopmentFileService_1.DevelopmentFileService();
    });
    (0, react_1.useEffect)(() => {
        // Load tutorial mode from localStorage
        const savedTutorialMode = localStorage.getItem("tutorialMode");
        if (savedTutorialMode) {
            setTutorialMode(savedTutorialMode === "true");
        }
        // Listen for auth changes
        const handleAuthChange = (authenticated) => {
            setIsAuthenticated(authenticated);
            setUser(GitHubAuthService_1.githubAuthService.userInfo);
        };
        GitHubAuthService_1.githubAuthService.on('authChange', handleAuthChange);
        // Handle GitHub OAuth callback from popup
        const handleMessage = async (event) => {
            if (event.data.type === "github-auth-callback") {
                const { code } = event.data;
                try {
                    const success = await GitHubAuthService_1.githubAuthService.handleCallback(code);
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
            GitHubAuthService_1.githubAuthService.off("authChange", handleAuthChange);
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
        login: () => GitHubAuthService_1.githubAuthService.initiateLogin(),
        logout: () => GitHubAuthService_1.githubAuthService.logout(),
    };
    return (react_1.default.createElement(FileServiceContext_1.FileServiceContext.Provider, { value: fileService },
        react_1.default.createElement(WebSocketContext.Provider, { value: { ws, isConnected, sendMessage } },
            react_1.default.createElement(TutorialModeContext.Provider, { value: { tutorialMode, setTutorialMode } },
                react_1.default.createElement(AuthContext.Provider, { value: authContextValue },
                    react_1.default.createElement(react_router_dom_1.HashRouter, null,
                        react_1.default.createElement(AppFrame_1.AppFrame, null,
                            react_1.default.createElement(react_router_dom_1.Routes, null,
                                react_1.default.createElement(react_router_dom_1.Route, { path: "/", element: react_1.default.createElement(Helpo_1.Helpo, null) }),
                                react_1.default.createElement(react_router_dom_1.Route, { path: "/flua", element: react_1.default.createElement(FluaPage_1.FluaPage, null) }),
                                react_1.default.createElement(react_router_dom_1.Route, { path: "/projects", element: react_1.default.createElement(ProjectsPage_1.ProjectsPage, null) }),
                                react_1.default.createElement(react_router_dom_1.Route, { path: "/projects/:projectName", element: react_1.default.createElement(ProjectPage_1.ProjectPage, null) }),
                                react_1.default.createElement(react_router_dom_1.Route, { path: "/projects/:projectName/tests/*", element: react_1.default.createElement(TestPage_1.TestPage, null) }),
                                react_1.default.createElement(react_router_dom_1.Route, { path: "/projects/:projectName#:tab", element: react_1.default.createElement(ProjectPage_1.ProjectPage, null) }),
                                react_1.default.createElement(react_router_dom_1.Route, { path: "/signin", element: react_1.default.createElement(SignIn_1.SignIn, null) }),
                                react_1.default.createElement(react_router_dom_1.Route, { path: "/auth/github/callback", element: react_1.default.createElement(AuthCallbackPage_1.AuthCallbackPage, null) }),
                                react_1.default.createElement(react_router_dom_1.Route, { path: "/design-editor", element: isAuthenticated ? react_1.default.createElement(DesignEditorPage_1.DesignEditorPage, null) : react_1.default.createElement(SignIn_1.SignIn, null) }),
                                react_1.default.createElement(react_router_dom_1.Route, { path: "/text-editor", element: isAuthenticated ? react_1.default.createElement(TextEditorPage_1.TextEditorPage, null) : react_1.default.createElement(SignIn_1.SignIn, null) }),
                                isConnected ? (react_1.default.createElement(react_1.default.Fragment, null,
                                    react_1.default.createElement(react_router_dom_1.Route, { path: "/processes", element: isAuthenticated ? react_1.default.createElement(ProcessManagerPage_1.ProcessManagerPage, null) : react_1.default.createElement(SignIn_1.SignIn, null) }),
                                    react_1.default.createElement(react_router_dom_1.Route, { path: "/processes/:processId", element: react_1.default.createElement("p", null, "IDK") }))) : null,
                                react_1.default.createElement(react_router_dom_1.Route, { path: "/settings", element: react_1.default.createElement(Settings_1.Settings, null) }),
                                react_1.default.createElement(react_router_dom_1.Route, { path: "/git", element: isAuthenticated ? react_1.default.createElement(GitIntegrationPage_1.GitIntegrationPage, null) : react_1.default.createElement(SignIn_1.SignIn, null) }),
                                react_1.default.createElement(react_router_dom_1.Route, { path: "*", element: react_1.default.createElement(Helpo_1.Helpo, null) })))))))));
};
exports.App = App;
// Export App to global scope
function initApp() {
    const rootElement = document.getElementById("root");
    if (rootElement) {
        try {
            // Use React 18's createRoot
            const root = client_1.default.createRoot(rootElement);
            root.render(react_1.default.createElement(exports.App));
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
