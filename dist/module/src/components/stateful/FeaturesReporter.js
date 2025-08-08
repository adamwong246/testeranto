import React, { useEffect, useState } from 'react';
export const FeaturesReporter = () => {
    const [features, setFeatures] = useState([]);
    useEffect(() => {
        const fetchAllFeatures = async () => {
            try {
                const projectsResponse = await fetch('projects.json');
                if (!projectsResponse.ok)
                    throw new Error('Failed to fetch projects');
                const projectNames = await projectsResponse.json();
                const allFeatures = [];
                for (const projectName of projectNames) {
                    const configResponse = await fetch(`reports/${projectName}/config.json`);
                    let configData = { tests: [] };
                    if (configResponse.ok) {
                        configData = await configResponse.json();
                    }
                    else {
                        console.warn(`Failed to fetch config for ${projectName}`);
                    }
                    const summaryResponse = await fetch(`reports/${projectName}/summary.json`);
                    if (summaryResponse.ok) {
                        const summaryData = await summaryResponse.json();
                        for (const [testName, testData] of Object.entries(summaryData)) {
                            const testPath = testName.split('.').slice(0, -1).join('.');
                            const testConfig = configData.tests.find((t) => t[0] === testName);
                            const runtime = testConfig ? testConfig[1] : 'defaultRuntime';
                            const testsResponse = await fetch(`reports/${projectName}/${testPath}/${runtime}/tests.json`);
                            if (testsResponse.ok) {
                                const testsData = await testsResponse.json();
                                testsData.givens.forEach((given) => {
                                    const givenNode = `${given.name}`;
                                    given.thens.forEach((then) => {
                                        const thenNode = `${then.name}`;
                                        const status = then.error ? 'warning' : 'AOK green';
                                        allFeatures.push({
                                            name: `${projectName} - ${testName} - ${givenNode} - ${thenNode}`,
                                            status,
                                        });
                                    });
                                });
                            }
                            else {
                                allFeatures.push({
                                    name: `${projectName} - ${testName}`,
                                    status: 'dangerous',
                                });
                                console.warn(`Failed to fetch tests for ${testName}`);
                            }
                        }
                    }
                    else {
                        console.warn(`Failed to fetch summary for ${projectName}`);
                    }
                }
                setFeatures(allFeatures);
            }
            catch (error) {
                console.error('Error fetching features:', error);
            }
        };
        fetchAllFeatures();
    }, []);
    const renderTree = (nodes) => (React.createElement("ul", null, Object.entries(nodes).map(([key, value]) => (React.createElement("li", { key: key }, typeof value === 'string' ? (React.createElement("span", null,
        key,
        " - ",
        value)) : (React.createElement(React.Fragment, null,
        React.createElement("span", null, key),
        renderTree(value))))))));
    const buildTree = (features) => {
        const tree = {};
        features.forEach(({ name, status }) => {
            const parts = name.split(' - ');
            const projectAndTest = parts.slice(0, 2).join(' - ');
            const givenAndThen = parts.slice(2).join(' - ');
            const pathParts = projectAndTest.split('/');
            let current = tree;
            pathParts.forEach((part) => {
                if (!current[part]) {
                    current[part] = {};
                }
                current = current[part];
            });
            current[givenAndThen] = status;
        });
        return tree;
    };
    const featureTree = buildTree(features);
    return (React.createElement("div", null,
        React.createElement("h1", null, "Features Reporter"),
        renderTree(featureTree)));
};
