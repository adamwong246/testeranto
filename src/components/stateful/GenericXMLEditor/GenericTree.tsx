import React, { useState } from 'react';
import { Button, ButtonGroup, Dropdown } from 'react-bootstrap';
import { XMLNode } from '../GenericXMLEditorPage';

interface GenericTreeProps {
  node: XMLNode;
  selectedNodeId: string | null;
  onSelectNode: (id: string) => void;
  onAddNode: (parentId: string, nodeType: string) => void;
  onRemoveNode: (nodeId: string) => void;
  onToggleVisibility: (nodeId: string) => void;
  hiddenNodes: Set<string>;
  nodeTypes: { label: string; type: string }[];
}

export const GenericTree: React.FC<GenericTreeProps> = ({
  node,
  selectedNodeId,
  onSelectNode,
  onAddNode,
  onRemoveNode,
  onToggleVisibility,
  hiddenNodes,
  nodeTypes
}) => {
  const isSelected = node.id === selectedNodeId;
  const isHidden = hiddenNodes.has(node.id);

  return (
    <li
      style={{ listStyle: 'none', marginLeft: '0', paddingLeft: '10px' }}
    >
      <div
        className={`d-flex justify-content-between align-items-center p-1 ${isSelected ? 'bg-primary text-white rounded' : ''}`}
        onClick={() => onSelectNode(node.id)}
        style={{ cursor: 'pointer' }}
      >
        <span className="flex-grow-1">
          {node.type} ({node.id})
        </span>
        {node.type !== 'root' && (
          <ButtonGroup size="sm">
            <Button
              variant="outline-secondary"
              onClick={(e) => {
                e.stopPropagation();
                onToggleVisibility(node.id);
              }}
              title={isHidden ? 'Show node' : 'Hide node'}
            >
              {isHidden ? '👁️‍🗨️' : '👁️'}
            </Button>
            <Button
              variant="outline-danger"
              onClick={(e) => {
                e.stopPropagation();
                onRemoveNode(node.id);
              }}
              title="Remove node"
            >
              ×
            </Button>
          </ButtonGroup>
        )}
      </div>
      {node.children.length > 0 && (
        <ul style={{ marginLeft: '20px', paddingLeft: '0' }}>
          {node.children.map((child) => (
            <GenericTree
              key={child.id}
              node={child}
              selectedNodeId={selectedNodeId}
              onSelectNode={onSelectNode}
              onAddNode={onAddNode}
              onRemoveNode={onRemoveNode}
              onToggleVisibility={onToggleVisibility}
              hiddenNodes={hiddenNodes}
              nodeTypes={nodeTypes}
            />
          ))}
        </ul>
      )}
      {isSelected && (
        <div className="mt-1">
          <Dropdown>
            <Dropdown.Toggle size="sm" variant="outline-success" id="dropdown-add-node">
              Add Element
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {nodeTypes.map(({ label, type }) => (
                <Dropdown.Item 
                  key={type} 
                  onClick={() => onAddNode(node.id, type)}
                >
                  {label}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      )}
    </li>
  );
};
