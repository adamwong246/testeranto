import React from 'react';
import { Form } from 'react-bootstrap';
import { XMLNode } from '../GenericXMLEditorPage';

interface AttributeEditorProps {
  node: XMLNode | null;
  onUpdateAttributes: (attrs: Record<string, string>) => void;
  onUpdateTextContent?: (text: string) => void;
}

export const AttributeEditor: React.FC<AttributeEditorProps> = ({
  node: selectedNode,
  onUpdateAttributes,
  onUpdateTextContent
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
    onUpdateAttributes(newAttributes);
  };

  const handleAddAttribute = () => {
    const newKey = prompt('Enter attribute name:');
    if (newKey && newKey.trim() !== '') {
      const newAttributes = { ...selectedNode.attributes, [newKey]: '' };
      onUpdateAttributes(newAttributes);
    }
  };

  const handleRemoveAttribute = (key: string) => {
    const newAttributes = { ...selectedNode.attributes };
    delete newAttributes[key];
    onUpdateAttributes(newAttributes);
  };

  return (
    <div className="p-2">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h6 className="mb-0 small">Attributes for {selectedNode.type}</h6>
        <button
          className="btn btn-sm btn-outline-success py-0 px-1"
          onClick={handleAddAttribute}
        >
          + Add
        </button>
      </div>
      
      {Object.entries(selectedNode.attributes).map(([key, value]) => (
        <div key={key} className="mb-1 d-flex align-items-center">
          <Form.Group className="flex-grow-1 me-1">
            <Form.Label className="small mb-0">{key}</Form.Label>
            <Form.Control
              type="text"
              size="sm"
              value={value}
              onChange={(e) => handleAttributeChange(key, e.target.value)}
              placeholder="Value"
              className="py-0"
            />
          </Form.Group>
          <button
            className="btn btn-sm btn-outline-danger py-0 px-1"
            onClick={() => handleRemoveAttribute(key)}
            style={{ marginTop: '1.25rem' }}
          >
            ×
          </button>
        </div>
      ))}
      
      {Object.keys(selectedNode.attributes).length === 0 && (
        <div className="text-muted small">
          No attributes
        </div>
      )}
      
      {/* Text content editor */}
      {onUpdateTextContent && (
        <Form.Group className="mt-2">
          <Form.Label className="small mb-0">Text Content</Form.Label>
          <Form.Control
            as="textarea"
            rows={2}
            value={selectedNode.textContent || ''}
            onChange={(e) => onUpdateTextContent(e.target.value)}
            placeholder="Text content"
            className="py-0"
          />
        </Form.Group>
      )}
    </div>
  );
};
