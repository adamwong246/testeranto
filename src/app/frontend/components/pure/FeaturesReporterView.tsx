import React from 'react';
import { TreeNode } from '../../../types/features';


interface FeaturesReporterViewProps {
  treeData: TreeNode[];
}

export const FeaturesReporterView: React.FC<FeaturesReporterViewProps> = ({ treeData }) => {
  return (
    <div className="features-reporter">
      <h1>File Structure</h1>
      <div className="tree-container">
        {treeData.map(project => (
          <div key={project.name} className="project">
            <h3>{project.name}</h3>
            <ul className="file-tree">
              {project.children?.map(file => renderFile(file))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

function renderFile(node: TreeNode): React.ReactNode {
  return (
    <li key={node.name}>
      <span>{node.name}</span>
      {node.children && (
        <ul>
          {node.children.map(child => renderFile(child))}
        </ul>
      )}
    </li>
  );
}
