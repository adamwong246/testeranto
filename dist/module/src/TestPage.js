import ReactDom from "react-dom/client";
import React, { useEffect, useState } from 'react';
import { Navbar, Nav, Tab, Container, Alert, Badge, Button } from 'react-bootstrap';
import { fetchTestData } from './utils/api';
const useRouter = () => {
    const [route, setRoute] = useState(() => {
        const hash = window.location.hash.replace('#', '');
        return hash || 'results';
    });
    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash.replace('#', '');
            setRoute(hash || 'results');
        };
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);
    const navigate = (newRoute) => {
        window.location.hash = newRoute;
        setRoute(newRoute);
    };
    return { route, navigate };
};
export const TestPage = () => {
    const { route, navigate } = useRouter();
    const [testName, setTestName] = useState('');
    const [projectName, setProjectName] = useState('');
    const [testData, setTestData] = useState(null);
    const [logs, setLogs] = useState('');
    const [typeErrors, setTypeErrors] = useState('');
    const [lintErrors, setLintErrors] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const pathParts = window.location.pathname.split('/'); //.slice(0, -1)
        const projectName = pathParts[3];
        const testPath = pathParts.slice(4, -2).join("/");
        const runTime = pathParts.slice(-2, -1)[0];
        // const name = pathParts[pathParts.length - 1].replace('.html', '');
        // const project = pathParts[pathParts.length - 2];
        setTestName(testPath);
        setProjectName(projectName);
        const fetchData = async () => {
            try {
                const { testData, logs, typeErrors, lintErrors } = await fetchTestData(projectName, testPath, runTime);
                setTestData(testData);
                setLogs(logs);
                setTypeErrors(typeErrors);
                setLintErrors(lintErrors);
            }
            catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
            }
            finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);
    if (loading)
        return React.createElement("div", null, "Loading test data...");
    if (error)
        return React.createElement(Alert, { variant: "danger" },
            "Error: ",
            error);
    return (React.createElement(Container, { fluid: true },
        React.createElement(Navbar, { bg: "light", expand: "lg", className: "mb-4" },
            React.createElement(Container, { fluid: true },
                React.createElement(Navbar.Brand, null,
                    projectName,
                    " / ",
                    testName.split('/').pop(),
                    React.createElement(Badge, { bg: "secondary", className: "ms-2" }, projectName)),
                React.createElement(Navbar.Toggle, { "aria-controls": "basic-navbar-nav" }),
                React.createElement(Navbar.Collapse, { id: "basic-navbar-nav" },
                    React.createElement(Nav, { variant: "tabs", activeKey: route, onSelect: (k) => navigate(k || 'results'), className: "me-auto" },
                        React.createElement(Nav.Item, null,
                            React.createElement(Nav.Link, { eventKey: "results" }, "BDD Results")),
                        React.createElement(Nav.Item, null,
                            React.createElement(Nav.Link, { eventKey: "logs" }, "Runtime Logs")),
                        React.createElement(Nav.Item, null,
                            React.createElement(Nav.Link, { eventKey: "types" }, "Type Errors")),
                        React.createElement(Nav.Item, null,
                            React.createElement(Nav.Link, { eventKey: "lint" }, "Lint Errors"))),
                    React.createElement(Nav, null,
                        React.createElement(Button, { variant: "info", onClick: () => alert("Magic robot activated!") }, "\uD83E\uDD16"))))),
        React.createElement(Tab.Container, { activeKey: route, onSelect: (k) => navigate(k || 'results') },
            React.createElement(Tab.Content, { className: "mt-3" },
                React.createElement(Tab.Pane, { eventKey: "results" }, testData ? (React.createElement("div", null, testData.givens.map((given, i) => (React.createElement("div", { key: i, className: "mb-4" },
                    React.createElement("h4", null,
                        "Given: ",
                        given.name),
                    given.whens.map((when, j) => (React.createElement("div", { key: `w-${j}`, className: `p-3 mb-2 ${when.error ? 'bg-danger text-white' : 'bg-success text-white'}` },
                        React.createElement("strong", null, "When:"),
                        " ",
                        when.name,
                        when.error && React.createElement("pre", { className: "mt-2" }, when.error)))),
                    given.thens.map((then, k) => (React.createElement("div", { key: `t-${k}`, className: `p-3 mb-2 ${then.error ? 'bg-danger text-white' : 'bg-success text-white'}` },
                        React.createElement("strong", null, "Then:"),
                        " ",
                        then.name,
                        then.error && React.createElement("pre", { className: "mt-2" }, then.error))))))))) : (React.createElement(Alert, { variant: "warning" }, "No test results found"))),
                React.createElement(Tab.Pane, { eventKey: "logs" }, logs ? (React.createElement("pre", { className: "bg-dark text-white p-3" }, logs)) : (React.createElement(Alert, { variant: "warning" }, "No runtime logs found"))),
                React.createElement(Tab.Pane, { eventKey: "types" }, typeErrors ? (React.createElement("pre", { className: "bg-dark text-white p-3" }, typeErrors)) : (React.createElement(Alert, { variant: "warning" }, "No type errors found"))),
                React.createElement(Tab.Pane, { eventKey: "lint" }, lintErrors ? (React.createElement("pre", { className: "bg-dark text-white p-3" }, lintErrors)) : (React.createElement(Alert, { variant: "warning" }, "No lint errors found")))))));
};
document.addEventListener("DOMContentLoaded", function () {
    const elem = document.getElementById("root");
    if (elem) {
        ReactDom.createRoot(elem).render(React.createElement(TestPage, {}));
    }
});
