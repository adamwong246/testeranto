/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useCallback } from "react";
import { XMLNode, GenericXMLEditorPage } from "./GenericXMLEditorPage";

export interface BootstrapNode {
  id: string;
  type: string;
  attributes: Record<string, string>;
  children: BootstrapNode[];
  textContent?: string;
}

export const DratoPage = () => {
  const initialTree: XMLNode = {
    id: "root",
    type: "Container",
    attributes: {
      fluid: "true"
    },
    children: [],
  };

  const [bootstrapTree, setBootstrapTree] = useState<BootstrapNode>(initialTree);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("preview");
  const [history, setHistory] = useState<BootstrapNode[]>([initialTree]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const [hiddenNodes, setHiddenNodes] = useState<Set<string>>(new Set());

  // Find a node by ID
  const findNode = useCallback((node: BootstrapNode, id: string): BootstrapNode | null => {
    if (node.id === id) return node;
    for (const child of node.children) {
      const found = findNode(child, id);
      if (found) return found;
    }
    return null;
  }, []);

  // Helper to update tree and manage history
  const updateTree = useCallback(
    (newTree: BootstrapNode) => {
      setBootstrapTree(newTree);
      setHistory((prevHistory) => {
        const newHistory = prevHistory.slice(0, historyIndex + 1);
        newHistory.push(newTree);
        return newHistory;
      });
      setHistoryIndex((prevIndex) => prevIndex + 1);
    },
    [historyIndex]
  );

  // Update node attributes
  const updateNodeAttributes = useCallback(
    (nodeId: string, attributes: Record<string, string>) => {
      setBootstrapTree((prevTree) => {
        const newTree = JSON.parse(JSON.stringify(prevTree));
        const node = findNode(newTree, nodeId);
        if (node) {
          node.attributes = { ...node.attributes, ...attributes };
        }
        updateTree(newTree);
        return newTree;
      });
    },
    [findNode, updateTree]
  );

  // Update node text content
  const updateNodeTextContent = useCallback(
    (nodeId: string, textContent: string) => {
      setBootstrapTree((prevTree) => {
        const newTree = JSON.parse(JSON.stringify(prevTree));
        const node = findNode(newTree, nodeId);
        if (node) {
          node.textContent = textContent;
        }
        updateTree(newTree);
        return newTree;
      });
    },
    [findNode, updateTree]
  );

  // Toggle node visibility
  const toggleNodeVisibility = useCallback((nodeId: string) => {
    setHiddenNodes((prev) => {
      const newHidden = new Set(prev);
      if (newHidden.has(nodeId)) {
        newHidden.delete(nodeId);
      } else {
        newHidden.add(nodeId);
      }
      return newHidden;
    });
  }, []);

  // Add a new child node
  const addChildNode = useCallback(
    (parentId: string, nodeType: string) => {
      setBootstrapTree((prevTree) => {
        const newTree = JSON.parse(JSON.stringify(prevTree));
        const parent = findNode(newTree, parentId);
        if (parent) {
          // Default attributes based on node type
          let defaultAttributes: Record<string, string> = {};
          switch (nodeType) {
            case "Container":
              defaultAttributes = { fluid: "true" };
              break;
            case "Row":
              defaultAttributes = {};
              break;
            case "Col":
              defaultAttributes = { xs: "12" };
              break;
            case "Button":
              defaultAttributes = { variant: "primary" };
              break;
            case "Card":
              defaultAttributes = {};
              break;
            default:
              defaultAttributes = {};
          }

          const newNode: BootstrapNode = {
            id: `${nodeType}-${Date.now()}`,
            type: nodeType,
            attributes: defaultAttributes,
            children: [],
          };
          parent.children = [...parent.children, newNode];
          setSelectedNodeId(newNode.id);
          updateTree(newTree);
        }
        return newTree;
      });
    },
    [findNode, updateTree]
  );

  // Remove a node
  const removeNode = useCallback(
    (nodeId: string) => {
      setBootstrapTree((prevTree) => {
        const newTree = JSON.parse(JSON.stringify(prevTree));
        const removeFromParent = (node: BootstrapNode, targetId: string): boolean => {
          for (let i = 0; i < node.children.length; i++) {
            if (node.children[i].id === targetId) {
              node.children.splice(i, 1);
              return true;
            }
            if (removeFromParent(node.children[i], targetId)) {
              return true;
            }
          }
          return false;
        };
        removeFromParent(newTree, nodeId);
        if (selectedNodeId === nodeId) {
          setSelectedNodeId(null);
        }
        updateTree(newTree);
        return newTree;
      });
    },
    [selectedNodeId, updateTree]
  );

  // Undo/Redo handlers
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex((prevIndex) => prevIndex - 1);
      setBootstrapTree(history[historyIndex - 1]);
    }
  }, [history, historyIndex]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex((prevIndex) => prevIndex + 1);
      setBootstrapTree(history[historyIndex + 1]);
    }
  }, [history, historyIndex]);

  const selectedNode = selectedNodeId
    ? findNode(bootstrapTree, selectedNodeId)
    : null;

  // Define node types for Bootstrap
  const bootstrapNodeTypes = [
    { label: 'Container', type: 'Container' },
    { label: 'Row', type: 'Row' },
    { label: 'Column', type: 'Col' },
    { label: 'Button', type: 'Button' },
    { label: 'Card', type: 'Card' },
    { label: 'Text', type: 'Text' }
  ];

  // Function to create new Bootstrap nodes
  const createBootstrapNode = (parentId: string, nodeType: string): XMLNode => {
    // Default attributes based on node type
    let defaultAttributes: Record<string, string> = {};
    switch (nodeType) {
      case "Container":
        defaultAttributes = { fluid: "true" };
        break;
      case "Row":
        defaultAttributes = {};
        break;
      case "Col":
        defaultAttributes = { xs: "12" };
        break;
      case "Button":
        defaultAttributes = { variant: "primary" };
        break;
      case "Card":
        defaultAttributes = {};
        break;
      case "Text":
        defaultAttributes = { class: "" };
        break;
      default:
        defaultAttributes = {};
    }

    return {
      id: `${nodeType}-${Date.now()}`,
      type: nodeType,
      attributes: defaultAttributes,
      children: [],
    };
  };

  // Render preview for Bootstrap
  const renderBootstrapPreview = (node: XMLNode, isSelected: boolean, eventHandlers: any) => {
    // Render Bootstrap components based on node type
    const { type, attributes, children, textContent } = node;
    const style = isSelected ? { outline: '2px dashed blue' } : {};
    
    // Convert children to React elements
    const childElements = children.map(child => 
      renderBootstrapPreview(child, selectedNodeId === child.id, {})
    );
    
    // Handle different Bootstrap component types
    switch (type) {
      case 'Container':
        return (
          <div 
            key={node.id}
            className={`container${attributes.fluid === 'true' ? '-fluid' : ''}`}
            style={style}
            {...eventHandlers}
          >
            {childElements}
            {textContent}
          </div>
        );
      case 'Row':
        return (
          <div 
            key={node.id}
            className="row"
            style={style}
            {...eventHandlers}
          >
            {childElements}
            {textContent}
          </div>
        );
      case 'Col':
        // Generate column classes based on attributes
        const colClasses = Object.entries(attributes)
          .filter(([key]) => ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'].includes(key))
          .map(([breakpoint, size]) => `col-${breakpoint}-${size}`)
          .join(' ');
        return (
          <div 
            key={node.id}
            className={colClasses || 'col'}
            style={style}
            {...eventHandlers}
          >
            {childElements}
            {textContent}
          </div>
        );
      case 'Button':
        return (
          <button 
            key={node.id}
            className={`btn btn-${attributes.variant || 'primary'}`}
            style={style}
            {...eventHandlers}
          >
            {textContent || 'Button'}
          </button>
        );
      case 'Card':
        return (
          <div 
            key={node.id}
            className="card"
            style={style}
            {...eventHandlers}
          >
            <div className="card-body">
              {childElements}
              {textContent}
            </div>
          </div>
        );
      case 'Text':
        return (
          <div 
            key={node.id}
            className={attributes.class || ''}
            style={style}
            {...eventHandlers}
          >
            {textContent}
            {childElements}
          </div>
        );
      default:
        return (
          <div key={node.id} style={style} {...eventHandlers}>
            {type} element
            {childElements}
            {textContent}
          </div>
        );
    }
  };

  // Attribute editor for Bootstrap
  const renderBootstrapAttributeEditor = (node: XMLNode, onUpdateAttributes: (attrs: Record<string, string>) => void, onUpdateTextContent: (text: string) => void) => {
    const handleAttributeChange = (key: string, value: string) => {
      const newAttributes = { ...node.attributes, [key]: value };
      onUpdateAttributes(newAttributes);
    };

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onUpdateTextContent(e.target.value);
    };

    // Render different attribute editors based on node type
    return (
      <div>
        {/* Text content editor for nodes that can have text */}
        {(node.type === 'Button' || node.type === 'Card' || node.type === 'Text') && (
          <div className="mb-3">
            <label className="form-label">Text Content</label>
            <input
              type="text"
              className="form-control"
              value={node.textContent || ''}
              onChange={handleTextChange}
            />
          </div>
        )}
        
        {/* Type-specific attribute editors */}
        {node.type === 'Container' && (
          <div className="mb-3">
            <label className="form-label">Fluid</label>
            <select
              className="form-select"
              value={node.attributes.fluid || 'false'}
              onChange={(e) => handleAttributeChange('fluid', e.target.value)}
            >
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          </div>
        )}
        
        {node.type === 'Col' && (
          <div>
            {['xs', 'sm', 'md', 'lg', 'xl', 'xxl'].map(breakpoint => (
              <div key={breakpoint} className="mb-2">
                <label className="form-label">{breakpoint.toUpperCase()}</label>
                <input
                  type="text"
                  className="form-control"
                  value={node.attributes[breakpoint] || ''}
                  onChange={(e) => handleAttributeChange(breakpoint, e.target.value)}
                  placeholder="1-12"
                />
              </div>
            ))}
          </div>
        )}
        
        {node.type === 'Button' && (
          <div className="mb-3">
            <label className="form-label">Variant</label>
            <select
              className="form-select"
              value={node.attributes.variant || 'primary'}
              onChange={(e) => handleAttributeChange('variant', e.target.value)}
            >
              {['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'].map(variant => (
                <option key={variant} value={variant}>{variant}</option>
              ))}
            </select>
          </div>
        )}
        
        {node.type === 'Text' && (
          <div className="mb-3">
            <label className="form-label">CSS Classes</label>
            <input
              type="text"
              className="form-control"
              value={node.attributes.class || ''}
              onChange={(e) => handleAttributeChange('class', e.target.value)}
              placeholder="e.g., text-primary fs-4"
            />
          </div>
        )}
        
        {/* Generic attribute editor for other attributes */}
        <div className="mb-3">
          <label className="form-label">Other Attributes</label>
          {Object.entries(node.attributes)
            .filter(([key]) => !['fluid', 'variant'].includes(key) && !['xs', 'sm', 'md', 'lg', 'xl', 'xxl'].includes(key))
            .map(([key, value]) => (
              <div key={key} className="input-group mb-2">
                <span className="input-group-text">{key}</span>
                <input
                  type="text"
                  className="form-control"
                  value={value}
                  onChange={(e) => handleAttributeChange(key, e.target.value)}
                />
              </div>
            ))
          }
        </div>
      </div>
    );
  };

  return (
    <GenericXMLEditorPage
      initialTree={initialTree}
      renderPreview={renderBootstrapPreview}
      attributeEditor={renderBootstrapAttributeEditor}
      nodeTypes={bootstrapNodeTypes}
      onAddNode={createBootstrapNode}
    />
  );
};
