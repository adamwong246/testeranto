// /* eslint-disable @typescript-eslint/no-explicit-any */
// import React, { useEffect, useState } from 'react';

// import { FeaturesReporterView } from '../pure/FeaturesReporterView';
// import { buildTree } from '../../../types/features';


// export const FeaturesReporter: React.FC = () => {
//   const [treeData, setTreeData] = useState<any[]>([]);

//   useEffect(() => {
//     const fetchProjects = async () => {
//       try {
//         const response = await fetch('projects.json');
//         if (!response.ok) throw new Error('Failed to fetch projects');
//         const projectNames: string[] = await response.json();
//         setTreeData(buildTree(projectNames));
//       } catch (error) {
//         console.error('Error loading projects:', error);
//       }
//     };

//     fetchProjects();
//   }, []);

//   return <FeaturesReporterView treeData={treeData} />;
// };
