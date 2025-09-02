import React, { useState, useEffect } from 'react';
import { Form, Alert, Button } from 'react-bootstrap';
import { XMLNode } from '../GenericXMLEditorPage';

interface GenericTextEditorProps {
  xmlTree: XMLNode;
  onUpdateTree: (tree: XMLNode) => void;
}

const nodeToXML = (node: XMLNode, depth: number = 0): string => {
  const indent = '  '.repeat(depth);
  const attributes = Object.entries(node.attributes)
    .map(([key, value]) => ` ${key}="${value}"`)
    .join('');

  if (node.children.length === 0) {
    return `${indent}<${node.type}${attributes} />`;
  } else {
    const children = node.children.map(child => nodeToXML(child, depth + 1)).join('\n');
    return `${indent}<${node.type}${attributes}>\n${children}\n${indent}</${node.type}>`;
  }
};

export const GenericTextEditor: React.FC<GenericTextEditorProps> = ({
  xmlTree,
  onUpdateTree
}) => {
  const [xmlContent, setXmlContent] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // For SVG, the root is the svg element itself, so we need to include its attributes
      if (xmlTree.type === 'svg') {
        const content = nodeToXML(xmlTree, 0);
        setXmlContent(content);
      } else {
        // Convert the XML tree to XML, but only the children of the root
        const content = xmlTree.children.map(child => nodeToXML(child, 0)).join('\n');
        setXmlContent(content);
      }
      setError(null);
    } catch (err) {
      setError('Error generating XML');
    }
  }, [xmlTree]);

  const handleXmlChange = (e: React.FormEvent<HTMLDivElement>) => {
    const newContent = e.currentTarget.textContent || '';
    setXmlContent(newContent);
    setError(null);
  };

  const applyChanges = () => {
    try {
      // This is a placeholder - in a real implementation, you'd parse the XML
      // and convert it back to an XMLNode structure
      // For now, we'll just log an error
      setError('XML parsing not implemented yet');
    } catch (err) {
      setError('Error parsing XML: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  return (
    <div className="h-100 d-flex flex-column align-items-center">
      <div style={{ width: '80ch', maxWidth: '100%' }}>
        <div 
          contentEditable
          onInput={handleXmlChange}
          style={{ 
            width: '80ch',
            background: '#f8f9fa', 
            padding: '1rem', 
            borderRadius: '0.25rem',
            overflow: 'auto',
            minHeight: '400px',
            fontFamily: 'monospace',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            lineHeight: '1.4',
            outline: 'none'
          }}
          suppressContentEditableWarning={true}
        >
          {xmlContent}
        </div>
        {error && (
          <Alert variant="danger" className="mt-2">
            {error}
          </Alert>
        )}
        <Button
          variant="primary"
          onClick={applyChanges}
          className="mt-2"
          disabled={!!error}
        >
          Apply Changes
        </Button>
      </div>
    </div>
  );
};
