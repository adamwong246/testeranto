import React from 'react';
import { Table, Alert } from 'react-bootstrap';
import { NavBar } from '../../NavBar';
export const ProjectsPageView = ({ projects, summaries, configs, loading, error, navigate }) => {
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
