import React from 'react';
import ReactDom from "react-dom/client";
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { ProjectsPage } from './ProjectsPage';
import { ProjectPage } from './ProjectPage';
import { TestPage } from './TestPage';
import { Container } from 'react-bootstrap';
export const App = () => {
    return (React.createElement(Router, null,
        React.createElement("div", { className: "d-flex flex-column min-vh-100", key: window.location.pathname },
            React.createElement("main", { className: "flex-grow-1 p-3" },
                React.createElement(Container, { fluid: true },
                    React.createElement(Routes, null,
                        React.createElement(Route, { path: "/", element: React.createElement(ProjectsPage, null) }),
                        React.createElement(Route, { path: "/projects/:projectName", element: React.createElement(ProjectPage, null) }),
                        React.createElement(Route, { path: "/projects/:projectName/tests/*", element: React.createElement(TestPage, null) }),
                        React.createElement(Route, { path: "/projects/:projectName#:tab", element: React.createElement(ProjectPage, null) })))),
            React.createElement("footer", { className: "bg-light py-3" },
                React.createElement(Container, { className: "text-end", fluid: true },
                    "made with \u2764\uFE0F and ",
                    React.createElement("a", { href: "https://www.npmjs.com/package/testeranto" }, "testeranto"))))));
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
