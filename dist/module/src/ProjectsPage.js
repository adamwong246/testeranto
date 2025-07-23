import React, { useEffect, useState } from 'react';
import { Table, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { NavBar } from "./NavBar";
export const ProjectsPage = () => {
    const [projects, setProjects] = useState([]);
    const [summaries, setSummaries] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [configs, setConfigs] = useState({});
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const projectsRes = await fetch(`projects.json`);
                const projectNames = await projectsRes.json();
                // const projectNames = Object.keys(config.projects);
                const projectsData = await Promise.all(projectNames.map(async (name) => {
                    var _a, _b, _c, _d, _e, _f;
                    const [summaryRes, nodeRes, webRes, pureRes, configRes] = await Promise.all([
                        fetch(`reports/${name}/summary.json`),
                        fetch(`bundles/node/${name}/metafile.json`),
                        fetch(`bundles/web/${name}/metafile.json`),
                        fetch(`bundles/pure/${name}/metafile.json`),
                        fetch(`reports/${name}/config.json`),
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
                        nodeStatus: ((_a = nodeData.errors) === null || _a === void 0 ? void 0 : _a.length) ? 'failed' : ((_b = nodeData.warnings) === null || _b === void 0 ? void 0 : _b.length) ? 'warning' : 'success',
                        webStatus: ((_c = webData.errors) === null || _c === void 0 ? void 0 : _c.length) ? 'failed' : ((_d = webData.warnings) === null || _d === void 0 ? void 0 : _d.length) ? 'warning' : 'success',
                        pureStatus: ((_e = pureData.errors) === null || _e === void 0 ? void 0 : _e.length) ? 'failed' : ((_f = pureData.warnings) === null || _f === void 0 ? void 0 : _f.length) ? 'warning' : 'success',
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
            case 'warning': return '⚠️';
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
    return (React.createElement("div", { className: "p-3" },
        React.createElement(NavBar, { title: "Testeranto", backLink: null }),
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
                    React.createElement("a", { href: "#", onClick: (e) => {
                            e.preventDefault();
                            navigate(`/projects/${project.name}`);
                        } }, project.name)),
                React.createElement("td", null,
                    React.createElement("div", { style: { maxHeight: '200px', overflowY: 'auto' } }, summaries[project.name] ? (Object.keys(summaries[project.name]).map(testName => {
                        const testData = summaries[project.name][testName];
                        const runTime = configs[project.name].tests.find((t) => t[0] === testName)[1];
                        const hasRuntimeErrors = testData.runTimeErrors > 0;
                        const hasStaticErrors = testData.typeErrors > 0 || testData.staticErrors > 0;
                        return (React.createElement("div", { key: testName },
                            React.createElement("a", { href: `#/projects/${project.name}/tests/${encodeURIComponent(testName)}/${runTime}` },
                                hasRuntimeErrors ? '❌ ' : hasStaticErrors ? '⚠️ ' : '',
                                testName.split('/').pop())));
                    })) : (React.createElement("div", null, "Loading tests...")))),
                React.createElement("td", null,
                    React.createElement("a", { href: `#/projects/${project.name}#node` },
                        getStatusIcon(project.nodeStatus),
                        " Node build logs")),
                React.createElement("td", null,
                    React.createElement("a", { href: `#/projects/${project.name}#web` },
                        getStatusIcon(project.webStatus),
                        " Web build logs")),
                React.createElement("td", null,
                    React.createElement("a", { href: `#/projects/${project.name}#pure` },
                        getStatusIcon(project.pureStatus),
                        " Pure build logs")))))))));
};
