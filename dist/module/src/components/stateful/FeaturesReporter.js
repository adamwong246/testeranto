import React, { useEffect, useState } from 'react';
import { FeaturesReporterView } from '../pure/FeaturesReporterView';
import { buildTree } from '../../types/features';
export const FeaturesReporter = () => {
    const [treeData, setTreeData] = useState([]);
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch('testeranto/projects.json');
                if (!response.ok)
                    throw new Error('Failed to fetch projects');
                const projectNames = await response.json();
                setTreeData(buildTree(projectNames));
            }
            catch (error) {
                console.error('Error loading projects:', error);
            }
        };
        fetchProjects();
    }, []);
    return React.createElement(FeaturesReporterView, { treeData: treeData });
};
