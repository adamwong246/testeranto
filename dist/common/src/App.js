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
                react_1.default.createElement(react_router_dom_1.Route, { path: "/text-editor", element: react_1.default.createElement(TextEditorPage_1.TextEditorPage, null) })))));
};
exports.App = App;
// Export App to global scope
function initApp() {
    const rootElement = document.getElementById('root');
    if (rootElement && window.React && window.ReactDOM) {
        const root = window.ReactDOM.createRoot(rootElement);
        root.render(window.React.createElement(exports.App));
    }
    else {
        // Retry if React isn't loaded yet
        setTimeout(initApp, 100);
    }
}
// Export App to global scope
if (typeof window !== 'undefined') {
    window.App = exports.App;
    window.React = react_1.default;
    window.ReactDOM = client_1.default;
}
