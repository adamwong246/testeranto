import ReactDom from "react-dom/client";
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProjectsPage } from './ProjectsPage';
import { ProjectPage } from './ProjectPage';
import { TestPage } from './TestPage';
import { BuildLogsPage } from './BuildLogsPage';
import { Footer } from './Footer';
import { Navbar, Nav, Container, Alert } from 'react-bootstrap';
export const ReportApp = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await fetch('/testeranto/reports/config.json');
                const config = await res.json();
                // Create project summaries from config
                const projectSummaries = config.tests.map(test => ({
                    name: test[0].split('/')[2], // Extract project name
                    testCount: 1, // Each test entry represents one test
                    nodeStatus: test[1] === 'node' ? 'success' : 'unknown',
                    webStatus: test[1] === 'web' ? 'success' : 'unknown',
                    pureStatus: test[1] === 'pure' ? 'success' : 'unknown'
                }));
                setProjects(projectSummaries);
            }
            catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
            }
            finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);
    if (loading)
        return React.createElement("div", { className: "text-center p-5" }, "Loading...");
    if (error)
        return React.createElement(Alert, { variant: "danger" }, error);
    return (React.createElement(Router, null,
        React.createElement("div", { className: "d-flex flex-column min-vh-100" },
            React.createElement(Navbar, { bg: "dark", variant: "dark", expand: "lg" },
                React.createElement(Container, null,
                    React.createElement(Navbar.Brand, { href: "/" }, "Testeranto Report"),
                    React.createElement(Navbar.Toggle, { "aria-controls": "basic-navbar-nav" }),
                    React.createElement(Navbar.Collapse, { id: "basic-navbar-nav" },
                        React.createElement(Nav, { className: "me-auto" },
                            React.createElement(Nav.Link, { href: "/testeranto/projects.html" }, "Projects"))))),
            React.createElement("main", { className: "flex-grow-1 p-3" },
                React.createElement(Routes, null,
                    React.createElement(Route, { path: "/", element: React.createElement(ProjectsPage, null) }),
                    React.createElement(Route, { path: "/reports/:projectName", element: React.createElement(ProjectPage, null) }),
                    React.createElement(Route, { path: "/reports/:projectName/tests/:testName", element: React.createElement(TestPage, null) }),
                    React.createElement(Route, { path: "/reports/:projectName/builds/:runtime", element: React.createElement(BuildLogsPage, null) }))),
            React.createElement(Footer, null))));
};
// Helper components would go here:
// - ProjectOverview (similar to Project.tsx main view)
// - ProjectDetail (shows all tests for a project)  
// - TestReport (similar to TestReport.tsx but for a specific test)
// - RuntimeStatus (shows build status for a runtime)
// - ErrorBoundary (handles errors in child components)
export default ReportApp;
document.addEventListener("DOMContentLoaded", function () {
    const elem = document.getElementById("root");
    if (elem) {
        ReactDom.createRoot(elem).render(React.createElement(ReportApp, {}));
    }
});
