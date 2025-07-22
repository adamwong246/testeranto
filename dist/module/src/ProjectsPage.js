import ReactDom from "react-dom/client";
import React, { useEffect, useState } from 'react';
import { Navbar, Table, Alert, Badge } from 'react-bootstrap';
import { Container } from 'react-bootstrap';
export const ProjectsPage = () => {
    const [projects, setProjects] = useState([]);
    const [summaries, setSummaries] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [configs, setConfigs] = useState({});
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const projectsRes = await fetch(`/testeranto/projects.json`);
                const projectNames = await projectsRes.json();
                // const projectNames = Object.keys(config.projects);
                const projectsData = await Promise.all(projectNames.map(async (name) => {
                    var _a, _b, _c;
                    const [summaryRes, nodeRes, webRes, pureRes, configRes] = await Promise.all([
                        fetch(`/testeranto/reports/${name}/summary.json`),
                        fetch(`/testeranto/bundles/node/${name}/metafile.json`),
                        fetch(`/testeranto/bundles/web/${name}/metafile.json`),
                        fetch(`/testeranto/bundles/pure/${name}/metafile.json`),
                        fetch(`/testeranto/reports/${name}/config.json`),
                    ]);
                    const [summary, nodeData, webData, pureData, configData] = await Promise.all([
                        summaryRes.json(),
                        nodeRes.ok ? nodeRes.json() : { errors: ["Failed to load node build logs"] },
                        webRes.ok ? webRes.json() : { errors: ["Failed to load web build logs"] },
                        pureRes.ok ? pureRes.json() : { errors: ["Failed to load pure build logs"] },
                        configRes.json(),
                    ]);
                    setSummaries(prev => (Object.assign(Object.assign({}, prev), { [name]: summary })));
                    setConfigs(prev => (Object.assign(Object.assign({}, prev), { [name]: configData })));
                    return {
                        name,
                        testCount: Object.keys(summary).length,
                        nodeStatus: ((_a = nodeData.errors) === null || _a === void 0 ? void 0 : _a.length) ? 'failed' : 'success',
                        webStatus: ((_b = webData.errors) === null || _b === void 0 ? void 0 : _b.length) ? 'failed' : 'success',
                        pureStatus: ((_c = pureData.errors) === null || _c === void 0 ? void 0 : _c.length) ? 'failed' : 'success',
                        config: Object.keys(configData).length,
                    };
                }));
                setProjects(projectsData);
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
    const getStatusIcon = (status) => {
        switch (status) {
            case 'success': return '✅';
            case 'failed': return '❌';
            default: return '❓';
        }
    };
    if (loading)
        return React.createElement("div", null, "Loading projects...");
    if (error)
        return React.createElement(Alert, { variant: "danger" },
            "Error: ",
            error);
    console.log(configs);
    return (React.createElement("div", null,
        React.createElement(Navbar, { bg: "light", expand: "lg", className: "mb-4" },
            React.createElement(Container, { fluid: true },
                React.createElement(Navbar.Brand, null, "Testeranto Projects"))),
        React.createElement(Table, { striped: true, bordered: true, hover: true, responsive: true },
            React.createElement("thead", null,
                React.createElement("tr", null,
                    React.createElement("th", null, "Project"),
                    React.createElement("th", null, "Tests"),
                    React.createElement("th", null, "Node"),
                    React.createElement("th", null, "Web"),
                    React.createElement("th", null, "Pure"))),
            React.createElement("tbody", null, projects.map((project) => (React.createElement("tr", { key: project.name },
                React.createElement("td", null,
                    React.createElement("a", { href: `/testeranto/reports/${project.name}.html` }, project.name)),
                React.createElement("td", null,
                    React.createElement("div", { style: { maxHeight: '200px', overflowY: 'auto' } }, summaries[project.name] ? (Object.keys(summaries[project.name]).map(testName => {
                        const runTime = configs[project.name].tests.find((t) => t[0] === testName)[1];
                        return (React.createElement("div", { key: testName },
                            React.createElement("a", { href: `/testeranto/reports/${project.name}/${testName.split('.').slice(0, -1).join('.')}/${runTime}/index.html` }, testName.split('/').pop())));
                    })) : (React.createElement("div", null, "Loading tests...")))),
                React.createElement("td", null,
                    React.createElement("a", { href: `/testeranto/reports/${project.name}.html#node` },
                        getStatusIcon(project.nodeStatus),
                        " Node",
                        project.nodeStatus === 'failed' && (React.createElement(Badge, { bg: "danger", className: "ms-2" }, "Failed")))),
                React.createElement("td", null,
                    React.createElement("a", { href: `/testeranto/reports/${project.name}.html#web` },
                        getStatusIcon(project.webStatus),
                        " Web",
                        project.webStatus === 'failed' && (React.createElement(Badge, { bg: "danger", className: "ms-2" }, "Failed")))),
                React.createElement("td", null,
                    React.createElement("a", { href: `/testeranto/reports/${project.name}.html#pure` },
                        getStatusIcon(project.pureStatus),
                        " Pure",
                        project.pureStatus === 'failed' && (React.createElement(Badge, { bg: "danger", className: "ms-2" }, "Failed")))))))))));
};
document.addEventListener("DOMContentLoaded", function () {
    const elem = document.getElementById("root");
    if (elem) {
        ReactDom.createRoot(elem).render(React.createElement(ProjectsPage, {}));
    }
});
