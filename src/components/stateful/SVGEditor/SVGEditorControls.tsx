import React from 'react';
import { Button, ButtonGroup, Card } from 'react-bootstrap';
import { SVGNode } from '../SVGEditorPage';

interface SVGEditorControlsProps {
  selectedNode: SVGNode;
  onAddNode: (nodeType: string) => void;
  onRemoveNode: () => void;
}

export const SVGEditorControls: React.FC<SVGEditorControlsProps> = ({
  selectedNode,
  onAddNode,
  onRemoveNode
}) => {
  return (
    <Card>
      <Card.Header>Controls</Card.Header>
      <Card.Body>
        <ButtonGroup vertical className="w-100">
          <h6>Add Elements:</h6>
          <Button variant="outline-primary" onClick={() => onAddNode('rect')}>
            Rectangle
          </Button>
          <Button variant="outline-primary" onClick={() => onAddNode('circle')}>
            Circle
          </Button>
          <Button variant="outline-primary" onClick={() => onAddNode('path')}>
            Path
          </Button>
          <Button variant="outline-primary" onClick={() => onAddNode('text')}>
            Text
          </Button>
          <Button variant="outline-primary" onClick={() => onAddNode('g')}>
            Group
          </Button>
          <hr />
          <Button variant="outline-danger" onClick={onRemoveNode}>
            Remove This Element
          </Button>
        </ButtonGroup>
      </Card.Body>
    </Card>
  );
};
