import ReactDom from "react-dom/client";
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ProjectsPage } from './ProjectsPage';
import { ProjectPage } from './ProjectPage';
import { TestPage } from './TestPage';
import { BuildLogsPage } from './BuildLogsPage';
import { Footer } from './Footer';
export const App = () => {
    const location = useLocation();
    return (React.createElement(Router, null,
        React.createElement("div", { className: "d-flex flex-column min-vh-100" },
            React.createElement("nav", { className: "navbar navbar-expand-lg navbar-dark bg-dark" },
                React.createElement("div", { className: "container-fluid" },
                    React.createElement(Link, { className: "navbar-brand", to: "/" }, "Testeranto"),
                    React.createElement("div", { className: "collapse navbar-collapse" },
                        React.createElement("ul", { className: "navbar-nav me-auto" },
                            React.createElement("li", { className: "nav-item" },
                                React.createElement(Link, { className: "nav-link", to: "/" }, "Projects")))))),
            React.createElement("main", { className: "flex-grow-1 p-3" },
                React.createElement(Routes, null,
                    React.createElement(Route, { path: "/", element: React.createElement(ProjectsPage, null) }),
                    React.createElement(Route, { path: "/projects/:projectName", element: React.createElement(ProjectPage, null) }),
                    React.createElement(Route, { path: "/projects/:projectName/tests/:testName", element: React.createElement(TestPage, null) }),
                    React.createElement(Route, { path: "/projects/:projectName/builds/:runtime", element: React.createElement(BuildLogsPage, null) }))),
            React.createElement(Footer, null))));
};
document.addEventListener("DOMContentLoaded", function () {
    const elem = document.getElementById("root");
    if (elem) {
        ReactDom.createRoot(elem).render(React.createElement(App, {}));
    }
});
