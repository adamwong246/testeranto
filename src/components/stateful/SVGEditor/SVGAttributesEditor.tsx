import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { SVGNode } from '../SVGEditorPage';

interface SVGAttributesEditorProps {
  node: SVGNode;
  onUpdateAttributes: (attributes: Record<string, string>) => void;
  onUpdateTextContent?: (text: string) => void;
}

export const SVGAttributesEditor: React.FC<SVGAttributesEditorProps> = ({
  node,
  onUpdateAttributes,
  onUpdateTextContent
}) => {
  const [attributes, setAttributes] = useState<Record<string, string>>(node.attributes);
  const [textContent, setTextContent] = useState<string>('');

  useEffect(() => {
    setAttributes(node.attributes);
    // For text and tspan nodes, we might want to handle text content
    // This is a simple approach - in a real implementation, you'd need to track text content separately
  }, [node.id]);

  const handleAttributeChange = (key: string, value: string) => {
    const newAttributes = { ...attributes, [key]: value };
    setAttributes(newAttributes);
    onUpdateAttributes(newAttributes);
  };

  // const handleTextContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  //   const newText = e.target.value;
  //   setTextContent(newText);
  //   if (onUpdateTextContent) {
  //     onUpdateTextContent(newText);
  //   }
  // };

  return (
    <div>


      {Object.entries(attributes).map(([key, value]) => (
        <Form.Group key={key} className="mb-2">
          <Form.Label>{key}</Form.Label>
          <Form.Control
            type="text"
            value={value}
            onChange={(e) => handleAttributeChange(key, e.target.value)}
          />
        </Form.Group>
      ))}
      {/* Add new attribute */}
      <Form.Group>
        <Form.Label>Add New Attribute</Form.Label>
        <Form.Control
          type="text"
          placeholder="attribute=value"
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              const target = e.target as HTMLInputElement;
              const [key, value] = target.value.split('=');
              if (key && value) {
                handleAttributeChange(key.trim(), value.trim());
                target.value = '';
              }
            }
          }}
        />
      </Form.Group>
    </div>
  );
};
