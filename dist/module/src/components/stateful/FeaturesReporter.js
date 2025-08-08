import React, { useEffect, useState } from 'react';
import { buildTree, renderTree } from '../../utils/featureUtils';
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
    const featureTree = buildTree(features);
    return (React.createElement("div", null,
        React.createElement("h1", null, "Features Reporter"),
        renderTree(featureTree)));
};
