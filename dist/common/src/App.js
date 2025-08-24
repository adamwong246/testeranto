"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const react_1 = __importDefault(require("react"));
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
const SettingsPage_1 = require("./components/stateful/SettingsPage");
const App = () => {
    return (react_1.default.createElement(react_router_dom_1.HashRouter, null,
        react_1.default.createElement(AppFrame_1.AppFrame, null,
            react_1.default.createElement(react_router_dom_1.Routes, null,
                react_1.default.createElement(react_router_dom_1.Route, { path: "/", element: react_1.default.createElement(ProjectsPage_1.ProjectsPage, null) }),
                react_1.default.createElement(react_router_dom_1.Route, { path: "/projects/:projectName", element: react_1.default.createElement(ProjectPage_1.ProjectPage, null) }),
                react_1.default.createElement(react_router_dom_1.Route, { path: "/projects/:projectName/tests/*", element: react_1.default.createElement(TestPage_1.TestPage, null) }),
                react_1.default.createElement(react_router_dom_1.Route, { path: "/projects/:projectName#:tab", element: react_1.default.createElement(ProjectPage_1.ProjectPage, null) }),
                react_1.default.createElement(react_router_dom_1.Route, { path: "/features-reporter", element: react_1.default.createElement(FeaturesReporter_1.FeaturesReporter, null) }),
                react_1.default.createElement(react_router_dom_1.Route, { path: "/design-editor", element: react_1.default.createElement(DesignEditorPage_1.DesignEditorPage, null) }),
                react_1.default.createElement(react_router_dom_1.Route, { path: "/text-editor", element: react_1.default.createElement(TextEditorPage_1.TextEditorPage, null) }),
                react_1.default.createElement(react_router_dom_1.Route, { path: "/processes", element: react_1.default.createElement(ProcessManagerPage_1.ProcessManagerPage, null) }),
                react_1.default.createElement(react_router_dom_1.Route, { path: "/processes/:processId", element: react_1.default.createElement(SingleProcessPage_1.SingleProcessPage, null) }),
                react_1.default.createElement(react_router_dom_1.Route, { path: "/settings", element: react_1.default.createElement(SettingsPage_1.SettingsPage, null) })))));
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
