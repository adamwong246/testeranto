import React from 'react';
import ReactDom from "react-dom/client";
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { TestPage } from './components/stateful/TestPage';
import { ProjectPage } from './components/stateful/ProjectPage';
import { ProjectsPage } from './components/stateful/ProjectsPage';
import { AppFrame } from './components/pure/AppFrame';
import { FeaturesReporter } from './components/stateful/FeaturesReporter';
import { DesignEditorPage } from './components/DesignEditorPage';
import { TextEditorPage } from './components/stateful/TextEditorPage';
import { ProcessManagerPage } from './components/stateful/ProcessManagerPage';
import { SingleProcessPage } from './components/stateful/SingleProcessPage';
import { SettingsPage } from './components/stateful/SettingsPage';
export const App = () => {
    return (React.createElement(Router, null,
        React.createElement(AppFrame, null,
            React.createElement(Routes, null,
                React.createElement(Route, { path: "/", element: React.createElement(ProjectsPage, null) }),
                React.createElement(Route, { path: "/projects/:projectName", element: React.createElement(ProjectPage, null) }),
                React.createElement(Route, { path: "/projects/:projectName/tests/*", element: React.createElement(TestPage, null) }),
                React.createElement(Route, { path: "/projects/:projectName#:tab", element: React.createElement(ProjectPage, null) }),
                React.createElement(Route, { path: "/features-reporter", element: React.createElement(FeaturesReporter, null) }),
                React.createElement(Route, { path: "/design-editor", element: React.createElement(DesignEditorPage, null) }),
                React.createElement(Route, { path: "/text-editor", element: React.createElement(TextEditorPage, null) }),
                React.createElement(Route, { path: "/processes", element: React.createElement(ProcessManagerPage, null) }),
                React.createElement(Route, { path: "/processes/:processId", element: React.createElement(SingleProcessPage, null) }),
                React.createElement(Route, { path: "/settings", element: React.createElement(SettingsPage, null) })))));
};
// Export App to global scope
function initApp() {
    const rootElement = document.getElementById('root');
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
    window.App = App;
    // @ts-ignore
    window.React = React;
    // @ts-ignore
    window.ReactDOM = ReactDom;
    // Initialize the app when the window is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initApp);
    }
    else {
        initApp();
    }
}
