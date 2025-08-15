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
                React.createElement(Route, { path: "/text-editor", element: React.createElement(TextEditorPage, null) })))));
};
// Export App to global scope
function initApp() {
    const rootElement = document.getElementById('root');
    if (rootElement && window.React && window.ReactDOM) {
        const root = window.ReactDOM.createRoot(rootElement);
        root.render(window.React.createElement(App));
    }
    else {
        // Retry if React isn't loaded yet
        setTimeout(initApp, 100);
    }
}
// Export App to global scope
if (typeof window !== 'undefined') {
    window.App = App;
    window.React = React;
    window.ReactDOM = ReactDom;
}
