"use strict";
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
exports.App = exports.useTutorialMode = exports.useWebSocket = void 0;
const react_1 = __importStar(require("react"));
const client_1 = __importDefault(require("react-dom/client"));
const react_router_dom_1 = require("react-router-dom");
const TestPage_1 = require("./components/stateful/TestPage");
const ProjectPage_1 = require("./components/stateful/ProjectPage");
const ProjectsPage_1 = require("./components/stateful/ProjectsPage");
const AppFrame_1 = require("./components/pure/AppFrame");
const FeaturesReporter_1 = require("./components/stateful/FeaturesReporter");
const DesignEditorPage_1 = require("./components/DesignEditorPage");
const TextEditorPage_1 = require("./components/stateful/TextEditorPage");
const ProcessManagerPage_1 = require("./components/stateful/ProcessManagerPage");
const SingleProcessPage_1 = require("./components/stateful/SingleProcessPage");
const Settings_1 = require("./components/pure/Settings");
const GitIntegrationPage_1 = require("./components/stateful/GitIntegrationPage");
// Create a context for the WebSocket
const WebSocketContext = (0, react_1.createContext)({
    ws: null,
    isConnected: false,
});
// Create a context for tutorial mode
const TutorialModeContext = (0, react_1.createContext)({
    tutorialMode: false,
    setTutorialMode: () => { },
});
const useWebSocket = () => {
    return (0, react_1.useContext)(WebSocketContext);
};
exports.useWebSocket = useWebSocket;
const useTutorialMode = () => {
    return (0, react_1.useContext)(TutorialModeContext);
};
exports.useTutorialMode = useTutorialMode;
const App = () => {
    const [ws, setWs] = (0, react_1.useState)(null);
    const [isConnected, setIsConnected] = (0, react_1.useState)(false);
    const [tutorialMode, setTutorialMode] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        // Load tutorial mode from localStorage
        const savedTutorialMode = localStorage.getItem('tutorialMode');
        if (savedTutorialMode) {
            setTutorialMode(savedTutorialMode === 'true');
        }
        const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${wsProtocol}//${window.location.host}`;
        const websocket = new WebSocket(wsUrl);
        websocket.onopen = () => {
            console.log('WebSocket connected');
            setWs(websocket);
            setIsConnected(true);
        };
        websocket.onclose = () => {
            console.log('WebSocket disconnected');
            setWs(null);
            setIsConnected(false);
        };
        websocket.onerror = (error) => {
            console.error('WebSocket error:', error);
            setIsConnected(false);
        };
        return () => {
            websocket.close();
        };
    }, []);
    return (react_1.default.createElement(WebSocketContext.Provider, { value: { ws, isConnected } },
        react_1.default.createElement(TutorialModeContext.Provider, { value: { tutorialMode, setTutorialMode } },
            react_1.default.createElement(react_router_dom_1.HashRouter, null,
                react_1.default.createElement(AppFrame_1.AppFrame, null,
                    react_1.default.createElement(react_router_dom_1.Routes, null,
                        react_1.default.createElement(react_router_dom_1.Route, { path: "/", element: react_1.default.createElement(ProjectsPage_1.ProjectsPage, null) }),
                        react_1.default.createElement(react_router_dom_1.Route, { path: "/projects/:projectName", element: react_1.default.createElement(ProjectPage_1.ProjectPage, null) }),
                        react_1.default.createElement(react_router_dom_1.Route, { path: "/projects/:projectName/tests/*", element: react_1.default.createElement(TestPage_1.TestPage, null) }),
                        react_1.default.createElement(react_router_dom_1.Route, { path: "/projects/:projectName#:tab", element: react_1.default.createElement(ProjectPage_1.ProjectPage, null) }),
                        react_1.default.createElement(react_router_dom_1.Route, { path: "/features-reporter", element: react_1.default.createElement(FeaturesReporter_1.FeaturesReporter, null) }),
                        react_1.default.createElement(react_router_dom_1.Route, { path: "/design-editor", element: react_1.default.createElement(DesignEditorPage_1.DesignEditorPage, null) }),
                        react_1.default.createElement(react_router_dom_1.Route, { path: "/text-editor", element: react_1.default.createElement(TextEditorPage_1.TextEditorPage, null) }),
                        isConnected ? (react_1.default.createElement(react_1.default.Fragment, null,
                            react_1.default.createElement(react_router_dom_1.Route, { path: "/processes", element: react_1.default.createElement(ProcessManagerPage_1.ProcessManagerPage, null) }),
                            react_1.default.createElement(react_router_dom_1.Route, { path: "/processes/:processId", element: react_1.default.createElement(SingleProcessPage_1.SingleProcessPage, null) }))) : null,
                        react_1.default.createElement(react_router_dom_1.Route, { path: "/settings", element: react_1.default.createElement(Settings_1.Settings, null) }),
                        react_1.default.createElement(react_router_dom_1.Route, { path: "/git", element: react_1.default.createElement(GitIntegrationPage_1.GitIntegrationPage, null) })))))));
};
exports.App = App;
// Export App to global scope
function initApp() {
    const rootElement = document.getElementById('root');
    if (rootElement) {
        try {
            // Try to use React 18's createRoot if available
            if (client_1.default.createRoot) {
                const root = client_1.default.createRoot(rootElement);
                root.render(react_1.default.createElement(exports.App));
            }
            else {
                // Fall back to React 17's render
                client_1.default.render(react_1.default.createElement(exports.App), rootElement);
            }
        }
        catch (err) {
            console.error('Error rendering app:', err);
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
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    // @ts-ignore
    window.App = exports.App;
    // @ts-ignore
    window.React = react_1.default;
    // @ts-ignore
    window.ReactDOM = client_1.default;
    // Initialize the app when the window is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initApp);
    }
    else {
        initApp();
    }
}
