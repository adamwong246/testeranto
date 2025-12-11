import React, { useState } from 'react';
import { Button, ButtonGroup, Dropdown } from 'react-bootstrap';
import { SVGNode } from '../SVGEditorPage';

interface SVGTreeProps {
  node: SVGNode;
  selectedNodeId: string | null;
  onSelectNode: (id: string) => void;
  onAddNode: (parentId: string, nodeType: string) => void;
  onRemoveNode: (nodeId: string) => void;
  onToggleVisibility: (nodeId: string) => void;
  onMoveNode: (nodeId: string, newParentId: string | null, index: number) => void;
  hiddenNodes: Set<string>;
  dragInfo: { isDragging: boolean; nodeId: string | null };
  onDragStart: (nodeId: string) => void;
  onDragEnd: () => void;
}

export const SVGTree: React.FC<SVGTreeProps> = ({
  node,
  selectedNodeId,
  onSelectNode,
  onAddNode,
  onRemoveNode,
  onToggleVisibility,
  onMoveNode,
  hiddenNodes,
  dragInfo,
  onDragStart,
  onDragEnd
}) => {
  const isSelected = node.id === selectedNodeId;
  const isHidden = hiddenNodes.has(node.id);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragStart = (e: React.DragEvent, nodeId: string) => {
    e.dataTransfer.setData('text/plain', nodeId);
    onDragStart(nodeId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent, targetNodeId: string) => {
    e.preventDefault();
    setIsDragOver(false);
    const draggedNodeId = e.dataTransfer.getData('text/plain');

    if (draggedNodeId && draggedNodeId !== targetNodeId) {
      // Move the node to be a child of the target node
      onMoveNode(draggedNodeId, targetNodeId, node.children.length);
    }
    onDragEnd();
  };

  const handleDropBefore = (e: React.DragEvent, targetNodeId: string, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    const draggedNodeId = e.dataTransfer.getData('text/plain');

    if (draggedNodeId && draggedNodeId !== targetNodeId) {
      // Find the parent of the target node to insert at the correct index
      // For simplicity, we'll pass the parent ID and index to onMoveNode
      // This requires some restructuring, but for now, we'll use a placeholder
      // In a real implementation, you'd need to know the parent node
    }
    onDragEnd();
  };

  return (
    <li
      style={{ listStyle: 'none', marginLeft: '0', paddingLeft: '10px' }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={(e) => handleDrop(e, node.id)}
    >
      <div
        className={`d-flex justify-content-between align-items-center p-1 ${isSelected ? 'bg-primary text-white rounded' : ''} ${isDragOver ? 'bg-info' : ''}`}
        onClick={() => onSelectNode(node.id)}
        style={{ cursor: 'pointer' }}
        draggable
        onDragStart={(e) => handleDragStart(e, node.id)}
        onDragEnd={onDragEnd}
      >
        <span className="flex-grow-1">
          {node.type} ({node.id})
        </span>
        {node.type !== 'svg' && (
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
          {node.children.map((child, index) => (
            <SVGTree
              key={child.id}
              node={child}
              selectedNodeId={selectedNodeId}
              onSelectNode={onSelectNode}
              onAddNode={onAddNode}
              onRemoveNode={onRemoveNode}
              onToggleVisibility={onToggleVisibility}
              onMoveNode={onMoveNode}
              hiddenNodes={hiddenNodes}
              dragInfo={dragInfo}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
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
              <Dropdown.Item onClick={() => onAddNode(node.id, 'rect')}>Rectangle</Dropdown.Item>
              <Dropdown.Item onClick={() => onAddNode(node.id, 'circle')}>Circle</Dropdown.Item>
              <Dropdown.Item onClick={() => onAddNode(node.id, 'path')}>Path</Dropdown.Item>
              <Dropdown.Item onClick={() => onAddNode(node.id, 'text')}>Text</Dropdown.Item>
              <Dropdown.Item onClick={() => onAddNode(node.id, 'g')}>Group</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      )}
    </li>
  );
};
