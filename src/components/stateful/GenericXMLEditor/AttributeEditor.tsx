import React from 'react';
import { Form } from 'react-bootstrap';
import { XMLNode } from '../GenericXMLEditorPage';

interface AttributeEditorProps {
  selectedNode: XMLNode | null;
  onUpdateNode: (nodeId: string, attributes: Record<string, string>) => void;
}

export const AttributeEditor: React.FC<AttributeEditorProps> = ({
  selectedNode,
  onUpdateNode
}) => {
  if (!selectedNode) {
    return (
      <div className="p-3 text-muted">
        Select a node to edit its attributes
      </div>
    );
  }

  const handleAttributeChange = (key: string, value: string) => {
    const newAttributes = { ...selectedNode.attributes };
    if (value === '') {
      delete newAttributes[key];
    } else {
      newAttributes[key] = value;
    }
    onUpdateNode(selectedNode.id, newAttributes);
  };

  const handleAddAttribute = () => {
    const newKey = prompt('Enter attribute name:');
    if (newKey && newKey.trim() !== '') {
      const newAttributes = { ...selectedNode.attributes, [newKey]: '' };
      onUpdateNode(selectedNode.id, newAttributes);
    }
  };

  const handleRemoveAttribute = (key: string) => {
    const newAttributes = { ...selectedNode.attributes };
    delete newAttributes[key];
    onUpdateNode(selectedNode.id, newAttributes);
  };

  return (
    <div className="p-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6>Attributes for {selectedNode.type}</h6>
        <button
          className="btn btn-sm btn-outline-success"
          onClick={handleAddAttribute}
        >
          + Add
        </button>
      </div>
      
      {Object.entries(selectedNode.attributes).map(([key, value]) => (
        <div key={key} className="mb-2 d-flex align-items-center">
          <Form.Group className="flex-grow-1 me-2">
            <Form.Label className="small mb-0">{key}</Form.Label>
            <Form.Control
              type="text"
              size="sm"
              value={value}
              onChange={(e) => handleAttributeChange(key, e.target.value)}
              placeholder="Value"
            />
          </Form.Group>
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={() => handleRemoveAttribute(key)}
            style={{ marginTop: '1.5rem' }}
          >
            ×
          </button>
        </div>
      ))}
      
      {Object.keys(selectedNode.attributes).length === 0 && (
        <div className="text-muted small">
          No attributes defined
        </div>
      )}
    </div>
  );
};
